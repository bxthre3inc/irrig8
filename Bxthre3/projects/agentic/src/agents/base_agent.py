"""Base Agent for Agentic1 System"""
import logging
from typing import Dict, Any, List
from pydantic import BaseModel

__version__ = "1.0.0"

class CoreTraits(BaseModel):
    skills: List[str]
    tools: List[str]
    modalities: List[str]

class RoleDefinition(BaseModel):
    role: str
    description: str
    tier: str
    core_traits: CoreTraits
    max_concurrent_tasks: int = 5

class TaskResult(BaseModel):
    task_id: str
    status: str
    output: str
    agent: str
    duration_ms: float

class BaseAgent:
    def __init__(self, role: str, role_def: RoleDefinition, log_level: int = logging.INFO):
        self.role = role
        self.role_def = role_def
        self.logger = logging.getLogger(f"agentic.{role}")
        self.logger.setLevel(log_level)
        if not self.logger.handlers:
            h = logging.StreamHandler()
            h.setFormatter(logging.Formatter("%(asctime)s [%(name)s] %(levelname)s: %(message)s"))
            self.logger.addHandler(h)
        self._inference = None
        self._total_tasks = 0

    def init_inference(self):
        if self._inference is None:
            from ..inference.engine import InferenceEngine
            self._inference = InferenceEngine()

    def execute_task(self, task: Dict[str, Any]) -> TaskResult:
        import time
        start = time.time()
        self.logger.info(f"Executing task: {task.get('name', '?')}")

        task_type = task.get("type", "general")
        task_input = task.get("input", task.get("description", ""))

        if self._inference and self._inference.is_available():
            self.init_inference()
            output = self._inference.run_agent(
                agent_name=self.role_def.role,
                agent_role=self.role,
                agent_description=self.role_def.description,
                capabilities=self.role_def.core_traits.skills,
                modalities=self.role_def.core_traits.modalities,
                task=task_input,
                context=task.get("context")
            )
        else:
            output = f"[{self.role}] Task '{task_input}' acknowledged. Local inference unavailable — queued."

        self._total_tasks += 1
        return TaskResult(
            task_id=task.get("id", "local-" + str(self._total_tasks)),
            status="completed",
            output=output,
            agent=self.role,
            duration_ms=int((time.time() - start) * 1000)
        )

    def reason(self, statement: str) -> str:
        if not self._inference:
            self.init_inference()
        if self._inference and self._inference.is_available():
            return self._inference.reason(statement)
        return f"[{self.role}] Reasoning: {statement} — inference offline"

    def get_stats(self) -> Dict[str, Any]:
        return {
            "role": self.role,
            "version": __version__,
            "total_tasks": self._total_tasks,
            "inference_available": self._inference.is_available() if self._inference else False
        }
