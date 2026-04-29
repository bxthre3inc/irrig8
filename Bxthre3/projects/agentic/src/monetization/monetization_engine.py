"""Monetization Engine — semantic version 2.0.0"""
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

__version__ = "1.0.0"
VERSION = "1.0.0"


@dataclass
class MicroTask:
    task_id: str
    description: str
    agent_type: str
    risk_weight: int
    reward: float
    status: str = "pending"
    assigned_agent: Optional[str] = None
    completed_at: Optional[str] = None


class MonetizationEngine:
    """
    Downtime monetization — idle agents earn by processing micro-tasks.
    Supports TaskRabbit-style marketplace, revenue splitting, payout tracking.
    """

    def __init__(self, config_path: Optional[str] = None):
        self.version = __version__
        self.version = SEMVER
        self.logger = logging.getLogger("MonetizationEngine")
        self.micro_tasks: Dict[str, MicroTask] = {}
        self.agent_earnings: Dict[str, float] = {}
        self.total_revenue = 0.0
        self.revenue_split = {"agent": 0.70, "platform": 0.20, "pool": 0.10}
        self._initialize_task_templates()

    def _initialize_task_templates(self):
        self.task_templates = [
            {"description": "Web research task", "agent_type": "ResearchAgent", "risk_weight": 1, "reward_range": (0.05, 0.50)},
            {"description": "Data entry task", "agent_type": "OperationsAgent", "risk_weight": 1, "reward_range": (0.02, 0.20)},
            {"description": "Content review task", "agent_type": "LegalAgent", "risk_weight": 2, "reward_range": (0.10, 1.00)},
            {"description": "Lead qualification task", "agent_type": "SalesAgent", "risk_weight": 1, "reward_range": (0.05, 0.30)},
        ]

    def create_micro_task(self, description: str, agent_type: str, risk_weight: int, reward: float) -> MicroTask:
        task_id = f"micro_{len(self.micro_tasks) + 1}_{int(datetime.utcnow().timestamp())}"
        task = MicroTask(
            task_id=task_id,
            description=description,
            agent_type=agent_type,
            risk_weight=risk_weight,
            reward=reward,
        )
        self.micro_tasks[task_id] = task
        self.logger.info(f"Created micro-task {task_id}: {description} @ ${reward:.2f}")
        return task

    def assign_task(self, task_id: str, agent_id: str) -> bool:
        if task_id not in self.micro_tasks:
            return False
        task = self.micro_tasks[task_id]
        task.status = "assigned"
        task.assigned_agent = agent_id
        self.logger.info(f"Assigned {task_id} to {agent_id}")
        return True

    def complete_task(self, task_id: str) -> Dict:
        if task_id not in self.micro_tasks:
            return {"status": "error", "error": "Task not found"}
        task = self.micro_tasks[task_id]
        task.status = "completed"
        task.completed_at = datetime.utcnow().isoformat() + "Z"

        agent_share = task.reward * self.revenue_split["agent"]
        self.agent_earnings[task.assigned_agent] = (
            self.agent_earnings.get(task.assigned_agent, 0.0) + agent_share
        )
        self.total_revenue += task.reward
        self.logger.info(f"Completed {task_id}: agent earned ${agent_share:.2f}")
        return {
            "status": "completed",
            "task_id": task_id,
            "agent_earned": agent_share,
            "platform_earned": task.reward * self.revenue_split["platform"],
        }

    def get_idle_micro_tasks(self, agent_type: Optional[str] = None) -> List[MicroTask]:
        tasks = [t for t in self.micro_tasks.values() if t.status == "pending"]
        if agent_type:
            tasks = [t for t in tasks if t.agent_type == agent_type]
        return tasks

    def get_agent_earnings(self, agent_id: str) -> float:
        return self.agent_earnings.get(agent_id, 0.0)

    def get_total_revenue(self) -> float:
        return self.total_revenue

    def to_api_dict(self) -> Dict:
        return {
            "version": self.version,
            "version": self.version,
            "total_revenue": self.total_revenue,
            "active_tasks": sum(1 for t in self.micro_tasks.values() if t.status == "pending"),
            "completed_tasks": sum(1 for t in self.micro_tasks.values() if t.status == "completed"),
            "revenue_split": self.revenue_split,
        }