"""Velocity Manager — semantic version 2.0.0"""
from typing import Dict

__version__ = "1.0.0"
VERSION = "1.0.0"


class VelocityManager:
    @staticmethod
    def calculate_velocity(task: Dict, agent_velocity: int) -> int:
        if task.get("AmbitionProtocol", {}).get("Enabled", False):
            if task["RiskWeight"] <= task.get("AmbitionProtocol", {}).get("MaxStretchRW", 6):
                return task["VelocityRequirement"]["Stretch"]
        return task["VelocityRequirement"]["Min"]