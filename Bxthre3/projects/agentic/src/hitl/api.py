"""HITL API — SSE streaming + queue management."""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, logging, sys, os, threading
from urllib.parse import parse_qs
from datetime import datetime
from dataclasses import dataclass, asdict
import uuid

sys.path.insert(0, "/home/workspace/Bxthre3/projects/agentic/src")

from events.bus import event_bus

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
logger = logging.getLogger("hitl-api")

PORT = int(os.environ.get("PORT", 5183))

# In-memory HITL queue (replace with Redis in production)
hitl_queue = []
queue_lock = threading.Lock()

@dataclass
class HITLRequest:
    id: str
    type: str          # financial_approval | contract_review | external_action
    agent_id: str
    agent_role: str
    task_name: str
    description: str
    payload: dict
    urgency: str       # low | medium | high | critical
    status: str         # pending | approved | denied | expired
    created_at: str
    responded_at: str = ""

    def to_dict(self):
        return asdict(self)

def add_hitl(req: HITLRequest):
    with queue_lock:
        hitl_queue.insert(0, req)
        event_bus.emit("hitl_request_added", req.agent_id, req.agent_role, {
            "hitl_id": req.id, "type": req.type, "task_name": req.task_name, "urgency": req.urgency
        })

def approve_hitl(hitl_id: str) -> dict:
    with queue_lock:
        for req in hitl_queue:
            if req.id == hitl_id:
                req.status = "approved"
                req.responded_at = datetime.utcnow().isoformat()
                event_bus.emit("hitl_approved", req.agent_id, req.agent_role, {"hitl_id": hitl_id})
                return {"status": "ok", "hitl_id": hitl_id}
    return {"status": "error", "error": "request not found"}

def deny_hitl(hitl_id: str) -> dict:
    with queue_lock:
        for req in hitl_queue:
            if req.id == hitl_id:
                req.status = "denied"
                req.responded_at = datetime.utcnow().isoformat()
                event_bus.emit("hitl_denied", req.agent_id, req.agent_role, {"hitl_id": hitl_id})
                return {"status": "ok", "hitl_id": hitl_id}
    return {"status": "error", "error": "request not found"}

def list_pending() -> list:
    with queue_lock:
        return [r.to_dict() for r in hitl_queue if r.status == "pending"]

def list_all() -> list:
    with queue_lock:
        return [r.to_dict() for r in hitl_queue]


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _sse_event(self, event_type, data):
        return f"event: {event_type}\ndata: {json.dumps(data)}\n\n".encode()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        # SSE: real-time stream of HITL events
        if self.path == "/stream" or self.path == "/events/stream":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            # Send initial snapshot
            initial = list_all()
            self.wfile.write(self._sse_event("hitl_snapshot", {"requests": initial}))
            logger.info("SSE client connected")
            return

        if self.path == "/queue":
            return self._json(200, {"pending": list_pending()})

        if self.path == "/all":
            return self._json(200, {"requests": list_all()})

        self._json(404, {"error": "not found"})

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))

        if self.path == "/queue":
            req = HITLRequest(
                id=str(uuid.uuid4())[:8],
                type=body.get("type", "generic"),
                agent_id=body.get("agent_id", "anon"),
                agent_role=body.get("agent_role", "unknown"),
                task_name=body.get("task_name", "Unnamed task"),
                description=body.get("description", ""),
                payload=body.get("payload", {}),
                urgency=body.get("urgency", "medium"),
                status="pending",
                created_at=datetime.utcnow().isoformat(),
            )
            add_hitl(req)
            logger.info(f"HITL request added: {req.id} [{req.urgency}] {req.task_name}")
            return self._json(200, {"hitl_id": req.id, "request": req.to_dict()})

        if self.path == "/approve":
            result = approve_hitl(body.get("hitl_id"))
            return self._json(200 if result["status"] == "ok" else 404, result)

        if self.path == "/deny":
            result = deny_hitl(body.get("hitl_id"))
            return self._json(200 if result["status"] == "ok" else 404, result)

        self._json(404, {"error": "not found"})


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    logger.info(f"HITL API server running on port {PORT}")
    server.serve_forever()
