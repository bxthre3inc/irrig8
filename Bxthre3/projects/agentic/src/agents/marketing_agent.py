"""Marketing Agent — semantic version 2.0.0"""
from .base_agent import BaseAgent

__version__ = "1.0.0"
VERSION = "1.0.0"


class MarketingAgent(BaseAgent):
    def __init__(self, role_yaml_path: str = "configs/roles/marketing_agent.yaml"):
        super().__init__(role_yaml_path)

    def create_social_media_content(self, topic: str) -> dict:
        return {
            "status": "created",
            "topic": topic,
            "content": [f"Post about {topic}", f"Tweet about {topic}"],
        }