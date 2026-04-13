# AgentOS Training Lifecycle — Self-Aware Orchestration
> **Module:** `Bxthre3/agentic/kernel/training_lifecycle.py`
> **Purpose:** AgentOS governs its own training pipeline — observes, hypothesizes, synthesizes, validates, and deploys new model versions
> **Canonical Reference:** `Bxthre3/agentic/TRAINING_LIFECYCLE.md`
> **Status:** ACTIVE
> **Last Updated:** 2026-04-13

---

## The Training Cycle (Darwin Gödel — AgentOS Edition)

```
OBSERVE → HYPOTHESIZE → SYNTHESIZE → VALIDATE → DEPLOY → MONITOR → (loop)
```

AgentOS executes this cycle continuously. It is not a one-time fine-tune — it is an operational loop.

---

## Phase 1 — OBSERVE
*Collect real-world tool call data from live inference logs*

**Sources:**
- `Bxthre3/agentic/store/inference.db` — raw LLM outputs with tool calls
- `Bxthre3/agentic/store/actions_log.db` — every action taken
- `Bxthre3/agentic/store/chairman_audit.db` — HITL approval/rejection records
- Per-tool success/failure rate from tool execution handlers

**What AgentOS monitors:**
| Signal | Metric | Threshold |
|---|---|---|
| Tool call accuracy | % of tool calls that execute successfully | <95% → flag |
| T2 confusion rate | % of T2 tool calls that lack `<|chairman_intent|>` | >1% → flag |
| False-positive tool calls | Model calls non-existent tool name | >0 → flag |
| Intent announcement rate | % of T1 calls with correct `<|intent_start|>` prefix | <98% → flag |
| Chairman queue volume | Number of pending HITL items | >10 → flag |
| Inference latency | ms per tool call decision | >2s → flag |

**AgentOS behavior:**
If a threshold is breached, AgentOS writes a P2 entry to its own INBOX and flags the tool/signal for review.

---

## Phase 2 — HYPOTHESIZE
*AgentOS proposes what's causing the issue and what to do about it*

**Common hypotheses:**
1. **Coverage gap:** Tool has no or few training examples → propose new synthesis batch
2. **Syntax drift:** Model outputs tool name differently than manifest → propose correction to manifest or training data
3. **Intent confusion:** Model calls T2 tool as T0 or T1 → propose negative example injection
4. **Tool name collision:** Two tools have similar names/descriptions → propose disambiguation
5. **New tool added:** New tool not in manifest → propose full synthesis run for new tool
6. **Conceptual confusion:** Model doesn't understand when to use tool X vs tool Y → propose reasoning-chain examples

**Output of this phase:**
A structured hypothesis stored in `Bxthre3/agentic/store/training_hypotheses.db`:
```
hypothesis_id | tool_name | symptom | proposed_fix | confidence | created_at
```

AgentOS does NOT act on hypotheses autonomously — it surfaces them to brodiblanco via INBOX for review.

---

## Phase 3 — SYNTHESIZE
*Generate training examples for specific tools or concepts*

**Canonical synthesis recipe per tool:**

```
1. Tool description (from TOOL_MANIFEST.md)
2. Input schema (from TOOL_MANIFEST.md)
3. Tier classification (T0 / T1 / T2)
4. 20-100 positive examples:
   - User instruction → correct tool call (with intent prefix if T1/T2)
   - Cover: common parameter values, edge cases, partial information
5. Negative examples (required for T1 and T2):
   - Show wrong calls (missing intent prefix, wrong tool, wrong params)
   - Annotate why each is wrong
6. Chain-of-thought examples (for reasoning-heavy tools):
   - Show reasoning steps before the tool call
```

**Synthesis pipeline for new tool additions:**
1. AgentOS reads new tool entry from `TOOL_MANIFEST.md`
2. AgentOS generates base example set (20 examples minimum)
3. AgentOS writes `Bxthre3/agentic/store/synthesis_batch_{tool}_{date}.jsonl`
4. AgentOS notifies brodiblanco: "New tool X synthesized — 20 base examples ready for review"

**For LFM 2.5 specifically:**
Convert all examples to the Pythonic syntax:
```
User: check the sync status
Model: <|tool_call_start|>[ping(agent_id="zo")]<|tool_call_end|>

User: file PROV-007 before May 1
Model: <|chairman_intent|>[file_patent(patent_id="PROV-007", filing_deadline="2026-05-01")]<|chairman_intent|>
  Rationale: ARPA-E OPEN 2026 deadline is May 1; provisional filing required before this date.
  Risk: Missing this deadline voids the patent claim for this invention.
  Alternatives: Standard patent application takes 3 years and is too slow for ARPA-E submission.
```

---

## Phase 4 — VALIDATE
*Test the synthesized examples before they go near a model*

**Validation rules:**
1. **No hallucinated tool names** — every tool name must exist in `TOOL_MANIFEST.md`
2. **Correct tier syntax** — T1 examples use `<|intent_start|>`, T2 use `<|chairman_intent|>`
3. **Parameter completeness** — required params present in all positive examples
4. **Rationale quality for T2** — each T2 example includes non-empty Rationale, Risk, Alternatives
5. **No circular references** — training example doesn't reference another training example
6. **Diversity check** — example set covers edge cases, not just happy paths

**AgentOS validation output:**
```
VALIDATION REPORT — tool: file_patent
  Total examples: 45
  Passed: 43
  Failed: 2
    Example #12: Missing Rationale in chairman_intent block
    Example #31: Parameter "filing_deadline" not in TOOL_MANIFEST schema
  Status: HOLD — 2 failures must be resolved before approval
```

AgentOS will not advance a batch with failures. It flags failures in the training queue and notifies the responsible agent.

---

## Phase 5 — DEPLOY
*Approved training batches are compiled and prepared for fine-tuning*

**Who can approve:**
- brodiblanco for any batch involving T2 tools
- Engineering lead for T0/T1 tool batches with no T2 cross-contamination
- AgentOS (automated) for routine maintenance batches (<10 examples, all T0)

**Deployment pipeline:**
1. Approved batches written to `Bxthre3/agentic/store/training_batches/approved_{date}.jsonl`
2. AgentOS compiles all approved batches since last deploy into `combined_training_set_{date}.jsonl`
3. AgentOS generates SHA-256 hash of combined set for audit
4. AgentOS writes `deploy_manifest.json`: hash, example count, tools covered, date, approved_by
5. AgentOS writes to INBOX: "Training set v{date} ready — {N} examples, {M} tools, hash={sha256}"
6. brodiblanco reviews and triggers actual fine-tune via external Liquid AI API or CLI

**AgentOS does NOT fine-tune directly** — it prepares, validates, audits, and notifies. The actual fine-tuning call is an external action (brodiblanco or automated CI/CD pipeline).

---

## Phase 6 — MONITOR
*After a new model version deploys, observe live performance*

**Monitoring windows:**
- **Immediate (0-24h):** Error rate, T2 confusion rate, tool call latency
- **Short-term (1-7d):** Approval queue volume, false-positive tool calls, per-tool accuracy
- **Long-term (7-30d):** Trend analysis, new failure modes, tool usage distribution

**Automated rollback trigger:**
If error rate exceeds 5% in first 24 hours OR T2 confusion rate exceeds 5%:
- AgentOS writes P1 to INBOX.md
- AgentOS sends SMS to brodiblanco
- AgentOS flags: "ROLLBACK RECOMMENDED — model v{date} underperforming"
- Previous model version reinstated pending investigation

**No automated rollback** — brodiblanco makes the final call.

---

## AgentOS Training INBOX

**New INBOX category:** `Bxthre3/agentic/INBOX/agents/training.md`

| Priority | Trigger | AgentOS Action |
|---|---|---|
| P2 | Monitoring signal breach | Write to training.md, surface to brodiblanco via INBOX.md |
| P1 | Automated rollback threshold | Write to INBOX.md + SMS brodiblanco |
| P0 | Systematic model failure (all tool calls failing) | Write P0 to INBOX.md + SMS immediately |

**Training agent also monitors:**
- New tool additions to `TOOL_MANIFEST.md` that lack training examples
- Tool rename/deprecation events
- Tool schema changes (new required parameters)
- Integration API changes (Google, Linear, Notion, etc.) that affect tool behavior

---

## Training Dashboard (zo.space)
**Route:** `https://brodiblanco.zo.space/agentic/training-dashboard`

**Displays:**
- Current active model version + hash
- Last fine-tune date + example count
- Per-tool accuracy (last 7 days)
- T2 confusion rate (last 7 days)
- Pending synthesis batches (awaiting approval)
- Approved batches queue (ready for next fine-tune)
- Monitoring signal status (green/yellow/red per threshold)

---

## Integration with Chairman Queue

The Chairman queue and Training lifecycle share audit data:

```
Chairman Queue (T2 tool approvals)
    ↓ (log of what was requested, approved, denied)
chairman_audit.db
    ↓ (fed into training observation)
Training Lifecycle → OBSERVE phase
    ↓ (flags T2 confusion patterns)
HYPOTHESIZE phase
    ↓ (generates negative examples for T2 intent)
SYNTHESIZE phase
    ↓ (T2 examples approved via Chairman queue)
DEPLOY phase
    ↓ (model improves)
MONITOR phase (next cycle)
```

This creates a closed loop: every T2 confusion event becomes training data that prevents future confusion.

---

## Tool: `training_get_status`

Available to AgentOS internal agents:

```python
@registry.register("training_get_status")
async def handle_training_status(task: TaskContext) -> dict:
    """Get current training pipeline status."""
    return {
        "active_model_version": get_active_version(),
        "last_finetune_date": get_last_finetune_date(),
        "pending_batches": count_pending_batches(),
        "monitoring_signals": get_monitoring_signals(),  # green/yellow/red
        "t2_confusion_rate_24h": get_t2_confusion_rate(hours=24),
        "tool_accuracy": get_tool_accuracy(hours=168),
    }
```

---

*This document is the operational constitution for AgentOS's training self-awareness. AgentOS must internalize this cycle and execute it as an ongoing operational loop — not as a one-time project.*
