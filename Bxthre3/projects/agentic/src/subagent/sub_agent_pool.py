"""Sub-Agent Pool — semantic version 2.0.0"""
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime

__version__ = "1.0.0"
VERSION = "1.0.0"


@dataclass
class SubAgent:
    name: str
    parent_role: str
    specialization: str
    capabilities: List[str]
    constraints: Dict[str, Any]
    is_active: bool = False
    current_task: Optional[str] = None
    tasks_completed: int = 0


class SubAgentPool:
    """
    Manages sub-agent pools for specialized work.
    Spawns/despawns based on demand.
    """

    def __init__(self, config_path: Optional[str] = None):
        self.pools: Dict[str, List[SubAgent]] = {}
        self.parent_to_subagents: Dict[str, List[str]] = {}
        self.logger = logging.getLogger("SubAgentPool")
        self._initialize_default_pools()

    def _initialize_default_pools(self):
        default_subagents = [
            SubAgent(
                name="web_researcher",
                parent_role="ResearchAgent",
                specialization="web_search",
                capabilities=["deep_web_search", "social_media_analysis"],
                constraints={"max_requests_per_minute": 60},
            ),
            SubAgent(
                name="code_generator",
                parent_role="ResearchAgent",
                specialization="code_generation",
                capabilities=["multi_language_support", "test_generation"],
                constraints={"max_generation_size": 1000},
            ),
            SubAgent(
                name="security_auditor",
                parent_role="ComplianceAgent",
                specialization="security_review",
                capabilities=["vulnerability_scanning", "compliance_checking"],
                constraints={"false_positive_rate": 0.001},
            ),
            SubAgent(
                name="deployment_orchestrator",
                parent_role="OperationsAgent",
                specialization="deployment",
                capabilities=["multi_environment_deployment", "rollback_management"],
                constraints={"max_downtime_minutes": 5},
            ),
        ]
        for agent in default_subagents:
            self._register_subagent(agent)

    def _register_subagent(self, agent: SubAgent):
        if agent.parent_role not in self.pools:
            self.pools[agent.parent_role] = []
        self.pools[agent.parent_role].append(agent)
        self.logger.info(f"Registered sub-agent {agent.name} under {agent.parent_role}")

    def get_available(self, parent_role: str, specialization: Optional[str] = None) -> Optional[SubAgent]:
        if parent_role not in self.pools:
            return None
        for agent in self.pools[parent_role]:
            if agent.is_active:
                continue
            if specialization and agent.specialization != specialization:
                continue
            agent.is_active = True
            return agent
        return None

    def release(self, agent_name: str) -> bool:
        for pool in self.pools.values():
            for agent in pool:
                if agent.name == agent_name:
                    agent.is_active = False
                    agent.current_task = None
                    return True
        return False

    def execute_task(self, agent_name: str, task: Dict[str, Any]) -> Dict[str, Any]:
        agent = next((a for pool in self.pools.values() for a in pool if a.name == agent_name), None)
        if not agent:
            return {"status": "error", "error": f"Sub-agent {agent_name} not found"}
        agent.is_active = True
        agent.current_task = task.get("name", "unnamed")
        result = {
            "status": "success",
            "agent": agent_name,
            "specialization": agent.specialization,
            "task": task,
            "executed_at": datetime.utcnow().isoformat() + "Z",
        }
        agent.tasks_completed += 1
        agent.is_active = False
        agent.current_task = None
        return result

    def pool_status(self) -> Dict:
        return {
            role: {
                "total": len(agents),
                "active": sum(1 for a in agents if a.is_active),
                "agents": [{"name": a.name, "active": a.is_active, "tasks": a.tasks_completed} for a in agents],
            }
            for role, agents in self.pools.items()
        }

    def to_api_dict(self) -> Dict:
        return {
            "version": __version__,
            "version": SEMVER,
            "pools": self.pool_status(),
        }