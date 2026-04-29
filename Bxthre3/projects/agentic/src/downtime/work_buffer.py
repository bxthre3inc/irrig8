"""Work Buffer — Redis-backed task queue — semantic version 2.0.0"""
import redis
import logging
from typing import Dict, Optional

__version__ = "1.0.0"
VERSION = "1.0.0"


class WorkBuffer:
    def __init__(self, redis_host: str = "localhost", redis_port: int = 6379):
        self.redis = redis.StrictRedis(
            host=redis_host, port=redis_port, db=0, decode_responses=True
        )
        self.priority_scores = {
            "assigned": 3,
            "cascaded": 2,
            "self_generated": 1,
        }
        self.logger = logging.getLogger("WorkBuffer")

    def add_task(self, task: Dict, task_type: str = "assigned") -> bool:
        if task_type not in self.priority_scores:
            self.logger.error(f"Invalid task type: {task_type}")
            return False
        priority = self.priority_scores[task_type]
        task_str = str(task)
        self.redis.zadd("work_buffer", {task_str: priority})
        self.logger.info(f"Added {task_type} task to buffer: {task.get('Task', 'Unknown')}")
        return True

    def get_next_task(self, agent_role: str) -> Optional[Dict]:
        task = self.redis.zpopmax("work_buffer")
        if not task:
            self.logger.info("No tasks in buffer.")
            return None
        task_str, _ = task
        return eval(task_str)

    def spawn_downtime_task(self, agent_role: str) -> Optional[Dict]:
        downtime_tasks = [
            {
                "Task": "Scan_New_Patents",
                "AgentType": "ResearchAgent",
                "RiskWeight": 1,
                "Alignment": ["#innovation"],
            },
            {
                "Task": "Review_Old_Contracts",
                "AgentType": "LegalAgent",
                "RiskWeight": 1,
                "Alignment": ["#compliance"],
            },
        ]
        for task in downtime_tasks:
            if task["AgentType"] == agent_role:
                self.add_task(task, "self_generated")
                self.logger.info(f"Spawned downtime task for {agent_role}: {task['Task']}")
                return task
        self.logger.warning(f"No downtime tasks found for {agent_role}.")
        return None