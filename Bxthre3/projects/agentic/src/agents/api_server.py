"""Agentic1 Agent API Server — runs on port 5182"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json, logging, sys, os

sys.path.insert(0, "/home/workspace/Bxthre3/projects/agentic/src")

from inference.engine import InferenceEngine
from tools.registry import ToolRegistry
from execution.engine import TaskExecutionEngine, Task
from self_mod.engine import SelfModificationEngine
from self_mod.truth_gate import TruthGate
from deployment.pipeline import DeploymentPipeline
from events.bus import event_bus, AgentEvent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
logger = logging.getLogger("agentic-api")

# Core singletons
registry = ToolRegistry()
executor = TaskExecutionEngine(registry)
inference = InferenceEngine()
truth_gate = TruthGate()
self_mod = SelfModificationEngine()
deployment_pipeline = DeploymentPipeline()


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length)) if length else {}

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            return self._json(200, {"status": "ok", "version": "1.0.0", "ollama": inference.is_available()})
        if self.path == "/agents":
            tools = registry.list_tools()
            queue = executor.get_queue()
            running = executor.get_running()
            completed = executor.get_completed(limit=10)
            stats = truth_gate.get_stats()
            return self._json(200, {
                "tools_available": len(tools),
                "queue_depth": len(queue),
                "running": len(running),
                "completed_recently": len(completed),
                "audit_entries": stats["total_entries"],
            })
        if self.path == "/events":
            history = event_bus.get_history(limit=50)
            return self._json(200, {"events": [e.to_dict() for e in history]})
        self._json(404, {"error": "not found"})

    def do_POST(self):
        body = self._body()

        if self.path == "/reason":
            prompt = body.get("prompt", "")
            model = body.get("model", "llama3.2")
            result = inference.generate(prompt, model=model)
            agent_id = body.get("agent_id", "anon")
            agent_role = body.get("agent_role", "unknown")
            event_bus.emit("agent_reasoning", agent_id, agent_role, {"prompt": prompt[:200], "response": result[:500]})
            return self._json(200, result)

        if self.path == "/execute":
            task_data = body.get("task", {})
            agent_id = body.get("agent_id", "system")
            agent_role = body.get("agent_role", "system")
            task = Task(
                name=task_data.get("name", "unnamed"),
                type=task_data.get("type", "generic"),
                priority=task_data.get("priority", "P3"),
                agent_role=agent_role,
                tools=task_data.get("tools", []),
                params=task_data.get("params", {}),
            )
            event_bus.emit("task_started", agent_id, agent_role, {"task_id": task.id, "task_name": task.name})
            result = executor.execute(task, agent_id, agent_role)
            truth_gate.record(agent_id, agent_role, {
                "type": "task_executed",
                "task_id": task.id,
                "task_name": task.name,
                "status": result.status,
                "tools_used": result.tools_used,
                "duration_ms": result.duration_ms,
            })
            event_bus.emit("task_completed", agent_id, agent_role, {
                "task_id": task.id,
                "status": result.status,
                "duration_ms": result.duration_ms,
            })
            return self._json(200, {
                "task_id": result.task_id,
                "status": result.status,
                "output": result.output,
                "error": result.error,
                "tools_used": result.tools_used,
                "duration_ms": result.duration_ms,
            })

        if self.path == "/tool/invoke":
            tool_name = body.get("tool")
            params = body.get("params", {})
            agent_id = body.get("agent_id", "anon")
            agent_role = body.get("agent_role", "unknown")
            result = registry.invoke(agent_id, agent_role, tool_name, params)
            truth_gate.record(agent_id, agent_role, {"type": "tool_invoked", "tool": tool_name, "params": params})
            event_bus.emit("tool_invoked", agent_id, agent_role, {"tool": tool_name})
            return self._json(200, result)

        if self.path == "/tools":
            agent_role = body.get("agent_role")
            tools = registry.list_tools(agent_role)
            return self._json(200, {"tools": tools})

        if self.path == "/self-mod/observe":
            failures = self_mod.observe()
            return self._json(200, {"failures": failures})

        if self.path == "/self-mod/hypothesize":
            failures = body.get("failures", [])
            changes = self_mod.hypothesize(failures)
            return self._json(200, {"changes": [{"id": c.id, "file": c.target_file, "reason": c.reason, "status": c.status} for c in changes]})

        if self.path == "/self-mod/sandbox":
            change_id = body.get("change_id")
            change = self_mod.get_change(change_id)
            if not change:
                return self._json(404, {"error": "change not found"})
            result = self_mod.sandbox(change)
            return self._json(200, result)

        if self.path == "/self-mod/commit":
            change_id = body.get("change_id")
            result = self_mod.commit(change_id)
            return self._json(200, result)

        if self.path == "/self-mod/rollback":
            change_id = body.get("change_id")
            result = self_mod.rollback(change_id)
            return self._json(200, result)

        if self.path == "/self-mod/list":
            changes = self_mod.list_changes()
            return self._json(200, {"changes": [{"id": c.id, "file": c.target_file, "status": c.status, "reason": c.reason} for c in changes]})

        if self.path == "/truth-gate/record":
            agent_id = body.get("agent_id", "anon")
            agent_role = body.get("agent_role", "unknown")
            action = body.get("action", {})
            hash = truth_gate.record(agent_id, agent_role, action)
            return self._json(200, {"hash": hash})

        if self.path == "/truth-gate/query":
            agent_id = body.get("agent_id")
            limit = body.get("limit", 100)
            entries = truth_gate.query(agent_id, limit)
            return self._json(200, {"entries": [e.to_dict() for e in entries]})

        if self.path == "/truth-gate/verify":
            result = truth_gate.verify_chain()
            return self._json(200, result)

        if self.path == "/deploy":
            result = deployment_pipeline.deploy()
            return self._json(200, {
                "deployment_id": result.deployment_id,
                "status": result.status,
                "duration_ms": result.duration_ms,
            })

        if self.path == "/event":
            event_type = body.get("type")
            agent_id = body.get("agent_id", "anon")
            agent_role = body.get("agent_role", "unknown")
            payload = body.get("payload", {})
            event_id = event_bus.emit(event_type, agent_id, agent_role, payload)
            return self._json(200, {"event_id": event_id})

        # ---- Tool Bridge: routes tool calls to real Zo app integrations ----
        if self.path.startswith("/tool/"):
            return self._tool_bridge(body)

        self._json(404, {"error": "endpoint not found"})

    def _tool_bridge(self, body):
        """Bridge tool invocations to real Zo app tools via subprocess."""
        import subprocess, json as _json

        tool_path = self.path.replace("/tool/", "")
        if "/" not in tool_path:
            return self._json(400, {"error": "invalid tool path"})

        parts = tool_path.split("/", 1)
        app = parts[0]
        action = parts[1]

        params = body.get("params", {})
        email = body.get("email", "bxthre3inc@gmail.com")

        # Build the Zo ask command for this tool
        prompt = (
            f"Execute the '{app}.{action}' tool with these arguments:\n"
            f"_json_params={_json.dumps(params)}\n"
            f"email={email}\n\n"
            f"Return the raw tool result as JSON."
        )

        cmd = [
            "python3", "-c",
            f"import urllib.request, json; "
            f"r=urllib.request.Request('https://api.zo.computer/zo/ask', "
            f"data=json.dumps({{'input': {repr(prompt)}, 'model_name': 'vercel:minimax/minimax-m2.7'}}).encode(), "
            f"headers={{'Authorization': 'Bearer {os.environ.get('ZO_CLIENT_IDENTITY_TOKEN','')}', 'Content-Type': 'application/json'}}) ;"
            f"print(urllib.request.urlopen(r, timeout=30).read().decode())"
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, timeout=30)
            if result.returncode == 0 and result.stdout:
                data = _json.loads(result.stdout)
                return self._json(200, {"result": data.get("output", data)})
            return self._json(502, {"error": "tool bridge failed", "detail": result.stderr[:500]})
        except Exception as e:
            return self._json(502, {"error": f"tool bridge exception: {e}"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5182))
    server = HTTPServer(("0.0.0.0", port), Handler)
    logger.info(f"Agentic API server running on port {port}")
    server.serve_forever()
