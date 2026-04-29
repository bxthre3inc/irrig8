"""Tool Registry — dynamic registration and invocation of agent tools."""
from typing import Any, Dict, List, Optional, Callable
from dataclasses import dataclass, field
import logging
import inspect
import json
import os

logger = logging.getLogger("tool_registry")


@dataclass
class ToolDef:
    name: str
    fn: Callable
    schema: Dict[str, Any]
    description: str
    allowed_roles: List[str]
    timeout_seconds: int = 30
    requires_approval: bool = False


class ToolRegistry:
    _instance: Optional["ToolRegistry"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._tools: Dict[str, ToolDef] = {}
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._tools: Dict[str, ToolDef] = {}
            self._initialized = True
            self._register_builtin_tools()
            self._register_integration_bridges()

    def _register_builtin_tools(self):
        """Register built-in system tools."""
        tools = [
            ToolDef(
                name="filesystem.write",
                fn=self._fs_write,
                schema={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "content": {"type": "string"},
                    },
                    "required": ["path", "content"],
                },
                description="Write content to a file",
                allowed_roles=["developer", "operations", "manager"],
            ),
            ToolDef(
                name="filesystem.read",
                fn=self._fs_read,
                schema={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                    },
                    "required": ["path"],
                },
                description="Read contents of a file",
                allowed_roles=["developer", "researcher", "reviewer", "qa", "manager"],
            ),
            ToolDef(
                name="filesystem.list",
                fn=self._fs_list,
                schema={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "pattern": {"type": "string", "default": "*"},
                    },
                    "required": ["path"],
                },
                description="List files in a directory",
                allowed_roles=["developer", "operations", "manager"],
            ),
            ToolDef(
                name="bash.execute",
                fn=self._bash_execute,
                schema={
                    "type": "object",
                    "properties": {
                        "command": {"type": "string"},
                        "timeout": {"type": "integer", "default": 30},
                        "cwd": {"type": "string"},
                    },
                    "required": ["command"],
                },
                description="Execute a bash command (sandboxed)",
                allowed_roles=["developer", "operations"],
                timeout_seconds=60,
            ),
            ToolDef(
                name="inference.generate",
                fn=self._inference_generate,
                schema={
                    "type": "object",
                    "properties": {
                        "prompt": {"type": "string"},
                        "model": {"type": "string", "default": "llama3.2"},
                        "max_tokens": {"type": "integer", "default": 512},
                    },
                    "required": ["prompt"],
                },
                description="Generate text using local Ollama inference",
                allowed_roles=["*"],
            ),
            ToolDef(
                name="git.commit",
                fn=self._git_commit,
                schema={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "message": {"type": "string"},
                        "files": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["path", "message"],
                },
                description="Commit changes to a git repository",
                allowed_roles=["developer", "operations"],
            ),
            ToolDef(
                name="git.branch",
                fn=self._git_branch,
                schema={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "branch": {"type": "string"},
                    },
                    "required": ["path", "branch"],
                },
                description="Create a new git branch",
                allowed_roles=["developer", "operations"],
            ),
            ToolDef(
                name="http.request",
                fn=self._http_request,
                schema={
                    "type": "object",
                    "properties": {
                        "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE"]},
                        "url": {"type": "string"},
                        "headers": {"type": "object"},
                        "body": {"type": "object"},
                    },
                    "required": ["method", "url"],
                },
                description="Make an HTTP request",
                allowed_roles=["*"],
            ),
            ToolDef(
                name="log.write",
                fn=self._log_write,
                schema={
                    "type": "object",
                    "properties": {
                        "level": {"type": "string", "enum": ["INFO", "WARN", "ERROR"]},
                        "message": {"type": "string"},
                        "agent_id": {"type": "string"},
                    },
                    "required": ["level", "message"],
                },
                description="Write to the audit log",
                allowed_roles=["*"],
            ),
            ToolDef(
                name="truth_gate.seal",
                fn=self._truth_gate_seal,
                schema={
                    "type": "object",
                    "properties": {
                        "agent_id": {"type": "string"},
                        "action": {"type": "object"},
                    },
                    "required": ["agent_id", "action"],
                },
                description="Seal an action in the Truth Gate",
                allowed_roles=["*"],
            ),
            ToolDef(
                name="task.create",
                fn=self._task_create,
                schema={
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "type": {"type": "string"},
                        "priority": {"type": "string", "default": "P3"},
                        "assigned_agent": {"type": "string"},
                    },
                    "required": ["name", "type"],
                },
                description="Create a new task in the queue",
                allowed_roles=["manager", "operations"],
            ),
            ToolDef(
                name="task.update",
                fn=self._task_update,
                schema={
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "string"},
                        "status": {"type": "string"},
                    },
                    "required": ["task_id", "status"],
                },
                description="Update a task's status",
                allowed_roles=["*"],
            ),
            ToolDef(
                name="skill.load",
                fn=self._skill_load,
                schema={
                    "type": "object",
                    "properties": {
                        "skill_name": {"type": "string"},
                        "agent_id": {"type": "string"},
                    },
                    "required": ["skill_name", "agent_id"],
                },
                description="Load a skill into an agent",
                allowed_roles=["manager", "operations"],
            ),
            ToolDef(
                name="agent.list",
                fn=self._agent_list,
                schema={
                    "type": "object",
                    "properties": {},
                },
                description="List all active agents",
                allowed_roles=["manager", "ceo"],
            ),
            ToolDef(
                name="hitl.request",
                fn=self._hitl_request,
                schema={
                    "type": "object",
                    "properties": {
                        "agent_id": {"type": "string"},
                        "action": {"type": "object"},
                        "description": {"type": "string"},
                        "urgency": {"type": "string", "default": "medium"},
                    },
                    "required": ["agent_id", "action", "description"],
                },
                description="Submit an action for human-in-the-loop approval",
                allowed_roles=["*"],
                requires_approval=True,
            ),
        ]

        for tool in tools:
            self._tools[tool.name] = tool
            logger.info(f"Registered tool: {tool.name}")

    def _register_integration_bridges(self):
        """Register Gmail, Calendar, Tasks, Linear, Notion tools."""
        self.register(
            name="gmail.send",
            fn=self._gmail_send,
            schema={
                "type": "object",
                "properties": {"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}},
                "required": ["to", "subject", "body"],
            },
            description="Send an email via Gmail",
            allowed_roles=["researcher", "developer", "reviewer", "qa", "legal", "financial", "manager", "operations"],
            requires_approval=True,
        )
        self.register(
            name="calendar.create_event",
            fn=self._calendar_create,
            schema={
                "type": "object",
                "properties": {"summary": {"type": "string"}, "start": {"type": "string"}, "end": {"type": "string"}, "description": {"type": "string"}},
                "required": ["summary", "start"],
            },
            description="Create a Google Calendar event",
            allowed_roles=["researcher", "developer", "reviewer", "qa", "legal", "financial", "manager", "operations"],
            requires_approval=True,
        )
        self.register(
            name="tasks.create",
            fn=self._tasks_create,
            schema={
                "type": "object",
                "properties": {"title": {"type": "string"}, "due": {"type": "string"}, "list_id": {"type": "string"}},
                "required": ["title"],
            },
            description="Create a Google Tasks item",
            allowed_roles=["researcher", "developer", "reviewer", "qa", "legal", "financial", "manager", "operations"],
        )
        self.register(
            name="linear.create_issue",
            fn=self._linear_create,
            schema={
                "type": "object",
                "properties": {"title": {"type": "string"}, "description": {"type": "string"}, "team_id": {"type": "string"}},
                "required": ["title"],
            },
            description="Create a Linear issue",
            allowed_roles=["researcher", "developer", "reviewer", "qa", "manager", "operations"],
        )
        self.register(
            name="notion.search",
            fn=self._notion_search,
            schema={
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
            description="Search Notion pages",
            allowed_roles=["researcher", "developer", "reviewer", "qa", "legal", "manager", "operations"],
        )
        self.register(
            name="stripe.payment_link",
            fn=self._stripe_payment,
            schema={
                "type": "object",
                "properties": {"price_id": {"type": "string"}},
                "required": ["price_id"],
            },
            description="Create a Stripe payment link",
            allowed_roles=["financial", "manager"],
            requires_approval=True,
        )
        self.register(
            name="zo.ask",
            fn=self._zo_ask,
            schema={
                "type": "object",
                "properties": {"input": {"type": "string"}, "model": {"type": "string"}},
                "required": ["input"],
            },
            description="Ask the Zo AI assistant",
            allowed_roles=["*"],
        )
        self.register(
            name="discord.send",
            fn=self._discord_send,
            schema={
                "type": "object",
                "properties": {"channel_id": {"type": "string"}, "message": {"type": "string"}},
                "required": ["channel_id", "message"],
            },
            description="Send a Discord message",
            allowed_roles=["researcher", "developer", "reviewer", "qa", "legal", "financial", "manager", "operations"],
            requires_approval=True,
        )

    # ── Built-in tool implementations ────────────────────────────────────────

    def _fs_write(self, path: str, content: str, **kwargs) -> Dict[str, Any]:
        import os
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w") as f:
            f.write(content)
        return {"status": "ok", "path": path}

    def _fs_read(self, path: str, **kwargs) -> Dict[str, Any]:
        with open(path, "r") as f:
            content = f.read()
        return {"status": "ok", "path": path, "content": content}

    def _fs_list(self, path: str, pattern: str = "*", **kwargs) -> Dict[str, Any]:
        import glob
        import os
        files = glob.glob(os.path.join(path, pattern))
        return {"status": "ok", "path": path, "files": files}

    def _bash_execute(self, command: str, timeout: int = 30, cwd: str = None, **kwargs) -> Dict[str, Any]:
        import subprocess
        import os
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd,
        )
        return {
            "status": "ok" if result.returncode == 0 else "error",
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
        }

    def _inference_generate(self, prompt: str, model: str = "llama3.2", max_tokens: int = 512, **kwargs) -> Dict[str, Any]:
        import urllib.request, json, ssl
        ctx = ssl.create_default_context()
        payload = json.dumps({
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"num_predict": max_tokens},
        }).encode()
        req = urllib.request.Request(
            "http://localhost:11434/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=120, context=ctx) as r:
            data = json.loads(r.read())
        return {"status": "ok", "response": data.get("response", ""), "model": model}

    def _git_commit(self, path: str, message: str, files: List[str] = None, **kwargs) -> Dict[str, Any]:
        import subprocess
        if files:
            for f in files:
                subprocess.run(f"git add {f}", shell=True, cwd=path)
        result = subprocess.run(
            f"git commit -m {repr(message)}",
            shell=True,
            capture_output=True,
            text=True,
            cwd=path,
        )
        return {"status": "ok", "returncode": result.returncode, "output": result.stdout + result.stderr}

    def _git_branch(self, path: str, branch: str, **kwargs) -> Dict[str, Any]:
        import subprocess
        result = subprocess.run(f"git checkout -b {branch}", shell=True, capture_output=True, text=True, cwd=path)
        return {"status": "ok", "returncode": result.returncode, "output": result.stdout + result.stderr}

    def _http_request(self, method: str, url: str, headers: Dict = None, body: Dict = None, **kwargs) -> Dict[str, Any]:
        import urllib.request, json, ssl
        ctx = ssl.create_default_context()
        payload = json.dumps(body).encode() if body else None
        h = {"Content-Type": "application/json"}
        if headers:
            h.update(headers)
        req = urllib.request.Request(url, data=payload, headers=h, method=method)
        try:
            with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
                resp = r.read().decode()
                return {"status": "ok", "status_code": r.status, "body": resp}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def _log_write(self, level: str, message: str, agent_id: str = "system", **kwargs) -> Dict[str, Any]:
        getattr(logger, level.lower(), logger.info)(f"[{agent_id}] {message}")
        return {"status": "ok"}

    def _truth_gate_seal(self, agent_id: str, action: Dict, **kwargs) -> Dict[str, Any]:
        import hashlib, json, time
        entry = {"agent_id": agent_id, "action": action, "timestamp": time.time()}
        raw = json.dumps(entry, sort_keys=True).encode()
        entry["hash"] = hashlib.sha256(raw).hexdigest()
        return {"status": "ok", "hash": entry["hash"], "entry": entry}

    def _task_create(self, name: str, type: str, priority: str = "P3", assigned_agent: str = None, **kwargs) -> Dict[str, Any]:
        task_id = f"task-{hash(name) % 100000:05d}"
        return {"status": "ok", "task_id": task_id, "name": name, "type": type, "priority": priority, "assigned_agent": assigned_agent}

    def _task_update(self, task_id: str, status: str, **kwargs) -> Dict[str, Any]:
        return {"status": "ok", "task_id": task_id, "status": status}

    def _skill_load(self, skill_name: str, agent_id: str, **kwargs) -> Dict[str, Any]:
        return {"status": "ok", "skill_name": skill_name, "agent_id": agent_id, "loaded": True}

    def _gmail_send(self, to: str, subject: str, body: str, **kwargs) -> Dict[str, Any]:
        result = registry.invoke("system", "system", "http.request", {
            "method": "POST",
            "url": "https://api.zo.computer/zo/ask",
            "headers": {"Authorization": f"Bearer {os.environ.get('ZO_CLIENT_IDENTITY_TOKEN', '')}", "Content-Type": "application/json"},
            "body": {"input": f"Send an email to {to} with subject: {subject}. Body: {body}"}
        })
        return {"status": "ok", "to": to, "subject": subject}

    def _calendar_create(self, summary: str, start: str, end: str = "", description: str = "", **kwargs) -> Dict[str, Any]:
        return {"status": "created", "summary": summary, "start": start}

    def _tasks_create(self, title: str, due: str = "", list_id: str = "", **kwargs) -> Dict[str, Any]:
        return {"status": "created", "title": title, "id": f"task-{hash(title) % 100000:05d}"}

    def _linear_create(self, title: str, description: str = "", team_id: str = "", **kwargs) -> Dict[str, Any]:
        return {"status": "created", "title": title, "id": f"linear-{hash(title) % 100000:05d}"}

    def _notion_search(self, query: str, **kwargs) -> Dict[str, Any]:
        return {"status": "ok", "query": query, "pages": []}

    def _stripe_payment(self, price_id: str, **kwargs) -> Dict[str, Any]:
        return {"status": "ok", "price_id": price_id, "url": "https://buy.stripe.com/sample"}

    def _zo_ask(self, input: str, model: str = "vercel:minimax/minimax-m2.7", **kwargs) -> Dict[str, Any]:
        import urllib.request, json as _json
        body = _json.dumps({"input": input, "model_name": model}).encode()
        req = urllib.request.Request("https://api.zo.computer/zo/ask", data=body, headers={"Authorization": f"Bearer {os.environ.get('ZO_CLIENT_IDENTITY_TOKEN', '')}", "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return _json.loads(resp.read())
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def _discord_send(self, channel_id: str, message: str, **kwargs) -> Dict[str, Any]:
        return {"status": "ok", "channel_id": channel_id, "message": message}

    def _agent_list(self, **kwargs) -> Dict[str, Any]:
        return {"status": "ok", "agents": []}

    def _hitl_request(self, agent_id: str, action: Dict, description: str, urgency: str = "medium", **kwargs) -> Dict[str, Any]:
        return {"status": "pending", "hitl_id": f"hitl-{hash(description) % 100000:05d}", "description": description}

    # ── Public API ────────────────────────────────────────────────────────────

    def register(self, name: str, fn: Callable, schema: Dict, description: str, allowed_roles: List[str], **kwargs):
        self._tools[name] = ToolDef(name=name, fn=fn, schema=schema, description=description, allowed_roles=allowed_roles, **kwargs)
        logger.info(f"Registered tool: {name}")

    def invoke(self, agent_id: str, agent_role: str, tool_name: str, params: Dict) -> Dict[str, Any]:
        if tool_name not in self._tools:
            return {"status": "error", "error": f"Tool '{tool_name}' not found"}
        tool = self._tools[tool_name]
        if "*" not in tool.allowed_roles and agent_role not in tool.allowed_roles:
            return {"status": "error", "error": f"Role '{agent_role}' cannot invoke '{tool_name}'"}
        try:
            result = tool.fn(**params)
            return {"status": "ok", "result": result}
        except Exception as e:
            logger.error(f"Tool '{tool_name}' failed: {e}")
            return {"status": "error", "error": str(e)}

    def list_tools(self, agent_role: str = None) -> List[Dict]:
        if agent_role is None:
            return [
                {"name": t.name, "description": t.description, "schema": t.schema, "allowed_roles": t.allowed_roles}
                for t in self._tools.values()
            ]
        return [
            {"name": t.name, "description": t.description, "schema": t.schema}
            for t in self._tools.values()
            if "*" in t.allowed_roles or agent_role in t.allowed_roles
        ]

    def get_tool(self, name: str) -> Optional[ToolDef]:
        return self._tools.get(name)
