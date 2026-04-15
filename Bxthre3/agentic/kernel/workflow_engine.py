"""
Workflow Engine — AgentOS Multi-Step Task Orchestration
Bxthre3/agentic/kernel/workflow_engine.py

An agentic workflow is a DAG of steps. Each step has:
  - tool(s) to call
  - input binding (from task vars or previous step output)
  - pass/fail condition (what "success" means)
  - next step (static or conditional)
  - optional HITL gate (human approval before proceeding)

Workflow state machine: PENDING → RUNNING → AWAITING_HITL → COMPLETED|FAILED|PAUSED
"""
import sqlite3, uuid, json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional, Any

DB = Path(__file__).parent.parent / "store" / "workflow_engine.db"

class WorkflowStatus(Enum):
    PENDING = "PENDING"; RUNNING = "RUNNING"; AWAITING_HITL = "AWAITING_HITL"
    COMPLETED = "COMPLETED"; FAILED = "FAILED"; PAUSED = "PAUSED"

class StepStatus(Enum):
    PENDING = "PENDING"; RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"; FAILED = "FAILED"; SKIPPED = "SKIPPED"

@dataclass
class Step:
    step_id: str; name: str; tool: str; args: dict
    condition: Optional[str] = None  # JS-like expression evaluated against context
    next_step: Optional[str] = None
    on_fail: Optional[str] = None     # step_id to goto on failure
    hitl_required: bool = False
    timeout_ms: int = 30000

@dataclass
class Workflow:
    workflow_id: str; name: str; agent_did: str
    steps: list[Step];  # serialized as JSON in DB
    status: WorkflowStatus; current_step: int
    context: dict;      # accumulates as workflow runs
    result: Optional[dict]; error: Optional[str]
    created_at: str; started_at: Optional[str]; completed_at: Optional[str]

def _db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB), timeout=60, isolation_level=None)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=60000")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS workflows (
            workflow_id TEXT PRIMARY KEY,
            name TEXT NOT NULL, agent_did TEXT,
            steps TEXT NOT NULL,        -- JSON array of Step
            status TEXT DEFAULT 'PENDING',
            current_step INTEGER DEFAULT 0,
            context TEXT DEFAULT '{}',  -- JSON dict
            result TEXT, error TEXT,
            created_at TEXT, started_at TEXT, completed_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS step_log (
            log_id TEXT PRIMARY KEY, workflow_id TEXT, step_id TEXT,
            status TEXT, tool TEXT, args TEXT,
            output TEXT, error TEXT, started_at TEXT, completed_at TEXT
        )
    """)
    conn.commit()
    return conn

def _step_to_dict(s: Step) -> dict:
    return {"step_id": s.step_id, "name": s.name, "tool": s.tool,
            "args": s.args, "condition": s.condition,
            "next_step": s.next_step, "on_fail": s.on_fail,
            "hitl_required": s.hitl_required, "timeout_ms": s.timeout_ms}

def _dict_to_step(d: dict) -> Step:
    return Step(step_id=d["step_id"], name=d["name"], tool=d["tool"],
                 args=d["args"], condition=d.get("condition"),
                 next_step=d.get("next_step"), on_fail=d.get("on_fail"),
                 hitl_required=d.get("hitl_required", False),
                 timeout_ms=d.get("timeout_ms", 30000))

# ─── Workflow CRUD ──────────────────────────────────────────────────────────────

def create_workflow(name: str, agent_did: str, steps: list[Step]) -> str:
    wid = f"wf-{uuid.uuid4().hex[:16]}"
    conn = _db()
    conn.execute("""INSERT INTO workflows VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        (wid, name, agent_did, json.dumps([_step_to_dict(s) for s in steps]),
         "PENDING", 0, "{}", None, None,
         datetime.now(timezone.utc).isoformat(), None, None))
    conn.commit(); conn.close()
    return wid

def get_workflow(wid: str) -> Optional[Workflow]:
    r = _db().execute("SELECT * FROM workflows WHERE workflow_id=?", (wid,)).fetchone()
    _db().close()
    if not r: return None
    steps = [_dict_to_step(d) for d in json.loads(r[3])]
    ctx = json.loads(r[6]) if r[6] else {}
    result = json.loads(r[7]) if r[7] else None
    return Workflow(workflow_id=r[0], name=r[1], agent_did=r[2], steps=steps,
                     status=WorkflowStatus(r[4]), current_step=r[5], context=ctx,
                     result=result, error=r[8], created_at=r[9],
                     started_at=r[10], completed_at=r[11])

def update_workflow(wid: str, **fields) -> bool:
    conn = _db()
    for k, v in fields.items():
        col = {"status": 4, "current_step": 5, "context": 6,
               "result": 7, "error": 8, "started_at": 10, "completed_at": 11}.get(k)
        if col is not None:
            if k in ("context", "result"):
                v = json.dumps(v)
            elif isinstance(v, Enum):
                v = v.value
            conn.execute(f"UPDATE workflows SET {k}=? WHERE workflow_id=?", (v, wid))
    conn.commit(); conn.close()
    return True

def list_workflows(agent_did: Optional[str] = None, status: Optional[WorkflowStatus] = None) -> list[Workflow]:
    conn = _db()
    q = "SELECT * FROM workflows WHERE 1=1"
    args = []
    if agent_did: q += " AND agent_did=?"; args.append(agent_did)
    if status: q += " AND status=?"; args.append(status.value)
    rows = conn.execute(q, args).fetchall(); conn.close()
    return [get_workflow(r[0]) for r in rows]

# ─── Step Execution ─────────────────────────────────────────────────────────────

def _eval_condition(expr: str, ctx: dict) -> bool:
    """Minimal JS-like condition eval against context dict."""
    try:
        import re
        e = expr
        for k, v in ctx.items():
            pat = rf'\b{k}\b'
            e = re.sub(pat, repr(v), e)
        return bool(eval(e, {"__builtins__": {"True": True, "False": False}}))
    except Exception:
        return False

def execute_step(wid: str) -> dict:
    """Execute the current step. Returns dict with status, output, next_action."""
    wf = get_workflow(wid)
    if not wf:
        return {"status": "error", "error": "workflow not found"}
    _s = wf.status.value if isinstance(wf.status, WorkflowStatus) else wf.status
    if _s in ("COMPLETED", "FAILED"):
        return {"status": "error", "error": f"workflow already {wf.status.value}"}
    if wf.status == WorkflowStatus.AWAITING_HITL:
        return {"status": "awaiting_hitl", "message": "workflow waiting for human approval"}

    if wf.status == WorkflowStatus.PENDING:
        update_workflow(wid, status=WorkflowStatus.RUNNING, started_at=datetime.now(timezone.utc).isoformat())

    step = wf.steps[wf.current_step]
    # Idempotency: skip if already completed or skipped
    conn_idem = _db()
    existing = conn_idem.execute("SELECT status FROM step_log WHERE workflow_id=? AND step_id=? ORDER BY started_at DESC LIMIT 1", (wid, step.step_id)).fetchone()
    conn_idem.close()
    if existing and existing[0] in ("COMPLETED", "SKIPPED"):
        idx = wf.current_step + 1
        if idx >= len(wf.steps):
            update_workflow(wid, status=WorkflowStatus.COMPLETED, completed_at=datetime.now(timezone.utc).isoformat())
        else:
            update_workflow(wid, current_step=idx)
        return {"status": "already_done", "step": step.step_id, "existing_status": existing[0]}
    log_id = f"log-{uuid.uuid4().hex[:16]}"
    conn = _db()
    conn.execute("""INSERT INTO step_log VALUES (?,?,?,?,?,?,?,?,?,?)""",
        (log_id, wid, step.step_id, "RUNNING", step.tool,
         json.dumps(step.args), None, None,
         datetime.now(timezone.utc).isoformat(), None))
    conn.commit(); conn.close()

    # Bind args from context
    bound_args = {}
    for k, v in step.args.items():
        if isinstance(v, str) and v.startswith("${") and v.endswith("}"):
            ctx_key = v[2:-1]
            bound_args[k] = wf.context.get(ctx_key, v)
        else:
            bound_args[k] = v

    # Check condition
    if step.condition and not _eval_condition(step.condition, wf.context):
        conn = _db()
        conn.execute("UPDATE step_log SET status='SKIPPED',completed_at=? WHERE log_id=?", (datetime.now(timezone.utc).isoformat(), log_id))
        update_workflow(wid, current_step=wf.current_step + 1)
        wf = get_workflow(wid)  # re-read after update
        next_idx = wf.current_step
        if next_idx < len(wf.steps):
            update_workflow(wid, current_step=next_idx, status=WorkflowStatus.RUNNING)
            return {"status": "skipped", "step": step.step_id, "reason": f"condition '{step.condition}' false"}
        else:
            update_workflow(wid, status=WorkflowStatus.COMPLETED, completed_at=datetime.now(timezone.utc).isoformat())
            return {"status": "completed", "step": step.step_id, "reason": "condition false, no more steps"}

    # HITL gate: only block if step needs HITL AND not already approved via context
    hitl_approved = wf.context.get(f"step_{wf.current_step}_hitl_approved", False)
    _s = wf.status.value if hasattr(wf.status, "value") else wf.status
    import sys; print(f"DEBUG execute step_idx={wf.current_step} hitl_req={step.hitl_required} hitl_app={hitl_approved} wf_status={_s}", flush=True)
    if step.hitl_required and not hitl_approved:
        update_workflow(wid, status=WorkflowStatus.AWAITING_HITL)
        return {"status": "awaiting_hitl", "step": step.step_id, "name": step.name, "tool": step.tool, "args": bound_args}

    # Call tool via tool_registry
    try:
        from Bxthre3.agentic.kernel.tool_registry import parse_lfm_tool_call, get_tool
        from Bxthre3.agentic.kernel.gateway.chairman_queue import enqueue
        tool_def = get_tool(step.tool)
        raw_call = f"{step.tool}({', '.join(f'{k}={repr(v)}' for k,v in bound_args.items())})"
        
        # T2 tools: if workflow step has hitl_required, enqueue then return await;
        # otherwise execute directly (workflow controls the gate, not the registry)
        if tool_def and tool_def.tier.value == 2 and step.hitl_required:
            enq_id = enqueue(wf.agent_did, raw_call, f"[workflow] {step.name}: {step.tool}", "HIGH")
            conn = _db()
            conn.execute("UPDATE step_log SET status='COMPLETED',output=?,completed_at=? WHERE log_id=?",
                (json.dumps({"status": "enqueued_for_hitl", "enqueued_id": enq_id}),
                 datetime.now(timezone.utc).isoformat(), log_id))
            conn.commit(); conn.close()
            update_workflow(wid, status=WorkflowStatus.AWAITING_HITL)
            return {"status": "awaiting_hitl", "step": step.step_id, "name": step.name, "tool": step.tool, "enqueued_id": enq_id}
        
        # T0/T1 tools or T2 with no step-level HITL: execute via registry
        from Bxthre3.agentic.kernel.tool_registry import route_tool_call
        result = route_tool_call(wf.agent_did, raw_call)
        output = result.get("output", {})
        step_status = result.get("action", "") or result.get("status", "")

        conn = _db()
        conn.execute("UPDATE step_log SET status='COMPLETED',output=?,completed_at=? WHERE log_id=?",
            (json.dumps(output), datetime.now(timezone.utc).isoformat(), log_id))
        conn.commit(); conn.close()

        new_context = dict(wf.context)
        new_context[f"step_{wf.current_step}_output"] = output
        new_context[f"step_{wf.current_step}_success"] = step_status not in ("BLOCKED", "BLOCKED_T2")

        next_idx = wf.current_step + 1
        update_workflow(wid, current_step=next_idx, context=new_context)

        if next_idx >= len(wf.steps):
            update_workflow(wid, status=WorkflowStatus.COMPLETED, completed_at=datetime.now(timezone.utc).isoformat(), result=json.dumps(output))
            return {"status": "completed", "step": step.step_id, "output": output}
        else:
            return {"status": "running", "step": step.step_id, "next_step_index": next_idx, "output": output}
    except Exception as e:
        conn = _db()
        conn.execute("UPDATE step_log SET status='FAILED',error=?,completed_at=? WHERE log_id=?",
            (str(e), datetime.now(timezone.utc).isoformat(), log_id))
        conn.commit(); conn.close()
        on_fail = step.on_fail
        if on_fail:
            fail_idx = next((i for i, s in enumerate(wf.steps) if s.step_id == on_fail), None)
            if fail_idx is not None:
                update_workflow(wid, current_step=fail_idx, status=WorkflowStatus.RUNNING)
                return {"status": "failed_cascade", "step": step.step_id, "error": str(e), "goto_step": on_fail}
        update_workflow(wid, status=WorkflowStatus.FAILED, error=str(e))
        return {"status": "failed", "step": step.step_id, "error": str(e)}

def approve_workflow_step(wid: str, approver_did: str, approved: bool) -> dict:
    wf = get_workflow(wid)
    if not wf or (wf.status.value if isinstance(wf.status, WorkflowStatus) else wf.status) != "AWAITING_HITL":
        return {"status": "error", "error": "workflow not awaiting approval"}
    if not approved:
        update_workflow(wid, status=WorkflowStatus.FAILED, error="rejected by human")
        return {"status": "rejected"}
    # Mark this step as HITL-approved so re-execution bypasses the gate
    wf_pre = get_workflow(wid)
    new_ctx = dict(wf_pre.context)
    new_ctx[f"step_{wf_pre.current_step}_hitl_approved"] = True
    update_workflow(wid, context=new_ctx)
    wf2 = get_workflow(wid)
    return execute_step(wid)  # resume

# ─── Built-in Workflow Templates ───────────────────────────────────────────────

def build_irrigation_diagnostic(farm_id: str) -> str:
    """Irrig8: sensor read → satellite data → soil map → submit irrigation change (all real tools)."""
    return create_workflow(
        name="Irrigation Diagnostic",
        agent_did="did:agentos:irrig8",
        steps=[
            Step(step_id="s1", name="Read Sensors", tool="sensor_read",
                 args={"farm_id": farm_id}, next_step="s2"),
            Step(step_id="s2", name="Fetch Satellite", tool="satellite_fetch",
                 args={"farm_id": farm_id}, condition="s1_output.status == 'dry'",
                 next_step="s3", hitl_required=True),
            Step(step_id="s3", name="Soil Variability", tool="soil_variability_map",
                 args={"farm_id": farm_id}, next_step="s4"),
            Step(step_id="s4", name="Submit Irrigation Change", tool="submit_irrigation_change",
                 args={"farm_id": farm_id, "change": "${s3_output}"}, hitl_required=True),
        ]
    )

def build_grant_prospect_workflow(agent_did: str, focus_area: str = "agriculture") -> str:
    """Grant Prospector: airtable_sync → filter → INBOX notification."""
    return create_workflow(
        name="Grant Prospector",
        agent_did=agent_did,
        steps=[
            Step(step_id="s1", name="Sync Airtable", tool="airtable_sync",
                 args={"focus_area": focus_area}, next_step="s2"),
            Step(step_id="s2", name="Soil Map", tool="soil_variability_map",
                 args={"focus_area": focus_area}, condition="s1_output.status == 'ok'",
                 next_step="s3"),
            Step(step_id="s3", name="Generate Compliance Report", tool="compliance_report",
                 args={"farm_id": focus_area}, next_step="s4"),
            Step(step_id="s4", name="Notify Grants Dept", tool="notify_department",
                 args={"dept": "grants", "content": "${s3_output}"}, hitl_required=False),
        ]
    )

# ─── Workflow Queries ────────────────────────────────────────────────────────────

def get_workflow_history(wid: str) -> list[dict]:
    conn = _db()
    rows = conn.execute("SELECT * FROM step_log WHERE workflow_id=? ORDER BY started_at", (wid,)).fetchall()
    conn.close()
    return [dict(log_id=r[0], workflow_id=r[1], step_id=r[2], status=r[3],
                 tool=r[4], args=json.loads(r[5]) if r[5] else {},
                 output=json.loads(r[6]) if r[6] else None,
                 error=r[7], started_at=r[8], completed_at=r[9]) for r in rows]

def get_pending_approvals() -> list[Workflow]:
    return list_workflows(status=WorkflowStatus.AWAITING_HITL)

def get_active_workflows() -> list[Workflow]:
    return list_workflows(status=WorkflowStatus.RUNNING)

init_workflow_engine = lambda: _db() and True

def notify_workflow_progress(wid: str, step_idx: int, action: str) -> None:
    """Emit workflow progress events to the event bus."""
    try:
        from Bxthre3.agentic.kernel.service_mesh.event_bus import emit_tool_event
        emit_tool_event("workflow_engine", action, wid, step_index=step_idx)
    except Exception:
        pass


init_workflow_engine()