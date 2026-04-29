"""Task Execution Engine — executes tasks from the DAG using the Tool Registry."""
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import logging
import uuid

logger = logging.getLogger("task_executor")


@dataclass
class ExecutionResult:
    task_id: str
    status: str  # success | error | pending_hitl
    output: Any
    error: Optional[str] = None
    tools_used: List[str] = field(default_factory=list)
    duration_ms: int = 0
    sealed_hash: Optional[str] = None


class Task:
    def __init__(self, name: str, type: str, priority: str = "P3",
                 agent_role: str = None, params: Dict = None, tools: List[str] = None):
        self.id = str(uuid.uuid4())[:8]
        self.name = name
        self.type = type
        self.priority = priority
        self.agent_role = agent_role
        self.params = params or {}
        self.tools = tools or []
        self.status = "pending"
        self.created_at = datetime.utcnow()
        self.started_at = None
        self.completed_at = None
        self.result: Optional[ExecutionResult] = None

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "priority": self.priority,
            "agent_role": self.agent_role,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class TaskExecutionEngine:
    def __init__(self, tool_registry=None):
        self.tool_registry = tool_registry
        self._queue: List[Task] = []
        self._running: Dict[str, Task] = {}
        self._completed: List[ExecutionResult] = []

    def enqueue(self, task: Task):
        self._queue.append(task)
        logger.info(f"Enqueued task: {task.name} ({task.id})")

    def execute(self, task: Task, agent_id: str = "system", agent_role: str = "system") -> ExecutionResult:
        """Execute a single task synchronously."""
        import time
        task.status = "running"
        task.started_at = datetime.utcnow()
        self._running[task.id] = task
        start = time.time()
        tools_used = []
        output = {}

        try:
            for tool_name in task.tools:
                params = task.params
                result = self.tool_registry.invoke(agent_id, agent_role, tool_name, params)
                tools_used.append(tool_name)
                if result.get("status") == "error":
                    raise Exception(result["error"])
                output[tool_name] = result.get("result", result)

            duration_ms = int((time.time() - start) * 1000)
            task.status = "completed"
            task.completed_at = datetime.utcnow()
            res = ExecutionResult(
                task_id=task.id,
                status="success",
                output=output,
                tools_used=tools_used,
                duration_ms=duration_ms,
            )
            task.result = res
            self._completed.append(res)
            logger.info(f"Task {task.name} completed in {duration_ms}ms")
            return res

        except Exception as e:
            duration_ms = int((time.time() - start) * 1000)
            task.status = "failed"
            task.completed_at = datetime.utcnow()
            res = ExecutionResult(
                task_id=task.id,
                status="error",
                output=None,
                error=str(e),
                tools_used=tools_used,
                duration_ms=duration_ms,
            )
            task.result = res
            self._completed.append(res)
            logger.error(f"Task {task.name} failed: {e}")
            return res
        finally:
            self._running.pop(task.id, None)

    def execute_dag(self, dag, agent_id: str = "system", agent_role: str = "system") -> List[ExecutionResult]:
        """Execute a CascadingTaskDAG in topological order."""
        results = []
        for task_name in dag.get_execution_order():
            task_def = dag.task_map.get(task_name)
            if not task_def:
                continue
            tools = [inp.get("tool") for inp in task_def.get("inputs", []) if inp.get("tool")]
            task = Task(
                name=task_name,
                type=task_def.get("type", "generic"),
                priority=task_def.get("priority", "P3"),
                agent_role=task_def.get("assigned_agent"),
                tools=tools,
            )
            result = self.execute(task, agent_id, agent_role)
            results.append(result)
            if result.status == "error":
                logger.warning(f"DAG execution stopped at {task_name} due to error")
                break
        return results

    def get_queue(self) -> List[Dict]:
        return [t.to_dict() for t in self._queue]

    def get_running(self) -> List[Dict]:
        return [t.to_dict() for t in self._running.values()]

    def get_completed(self, limit: int = 50) -> List[ExecutionResult]:
        return self._completed[-limit:]
