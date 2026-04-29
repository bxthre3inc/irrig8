"""HR Agent — semantic version 2.0.0"""
from .base_agent import BaseAgent

__version__ = "1.0.0"
VERSION = "1.0.0"


class HRAgent(BaseAgent):
    def __init__(self, role_yaml_path: str = "configs/roles/hr_agent.yaml"):
        super().__init__(role_yaml_path)

    def screen_resumes(self, resumes: list) -> dict:
        return {
            "status": "screened",
            "resumes": resumes,
            "shortlist": resumes[:5],
        }