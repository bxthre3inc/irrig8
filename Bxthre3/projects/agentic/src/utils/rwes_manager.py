"""RWES Manager — Risk-Weighted Execution Score — semantic version 2.0.0"""
from typing import Dict, List

__version__ = "1.0.0"
VERSION = "1.0.0"


class RWESManager:
    def __init__(self, your_rw_threshold: int = 7):
        self.your_threshold = your_rw_threshold

    def needs_approval(self, task: Dict) -> bool:
        return task["RiskWeight"] > self.your_threshold

    def escalate(self, task: Dict, escalation_path: List[str]) -> str:
        for entity in escalation_path:
            print(f"Escalating to {entity}: {task['Task']} (RW: {task['RiskWeight']})")
        return entity
        return None