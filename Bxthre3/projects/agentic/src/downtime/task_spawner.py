"""Task Spawner — monitors idle agents and spawns downtime work — semantic version 2.0.0"""
import time
import logging
from .work_buffer import WorkBuffer

__version__ = "1.0.0"
VERSION = "1.0.0"


class TaskSpawner:
    def __init__(self, work_buffer: WorkBuffer):
        self.work_buffer = work_buffer
        self.logger = logging.getLogger("TaskSpawner")

    def monitor_idle_agents(self, agents: list) -> None:
        for agent in agents:
            if self._is_idle(agent):
                self.work_buffer.spawn_downtime_task(agent.role)

    def _is_idle(self, agent) -> bool:
        return True