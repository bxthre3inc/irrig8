"""Prerequisite Resolver — semantic version 2.0.0"""
from typing import Dict, List

__version__ = "1.0.0"
VERSION = "1.0.0"


class PrerequisiteResolver:
    @staticmethod
    def check_prerequisites(task: Dict, agent_tools: List[str]) -> bool:
        required_tools = task.get("Prerequisites", {}).get("Requires", [])
        return all(tool in agent_tools for tool in required_tools)