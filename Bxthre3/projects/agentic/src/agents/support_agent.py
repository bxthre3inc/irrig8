"""Support Agent — semantic version 2.0.0"""
from .base_agent import BaseAgent

__version__ = "1.0.0"
VERSION = "1.0.0"


class SupportAgent(BaseAgent):
    def __init__(self, role_yaml_path: str = "configs/roles/support_agent.yaml"):
        super().__init__(role_yaml_path)

    def respond_to_faq(self, question: str) -> dict:
        return {
            "status": "responded",
            "question": question,
            "answer": f"Answer to: {question}",
        }