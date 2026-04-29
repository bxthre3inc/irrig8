"""Event Bus — pub/sub for real-time agent events. WebSocket streaming to dashboard."""
from typing import Dict, List, Callable, Any
import json
import logging
import threading
import time
import os
from dataclasses import dataclass, field
from datetime import datetime
import asyncio

logger = logging.getLogger("event_bus")


@dataclass
class AgentEvent:
    event_id: str
    event_type: str  # task_started | task_completed | hitl_requested | agent_reasoning | tool_invoked | ...
    agent_id: str
    agent_role: str
    payload: Dict[str, Any]
    timestamp: float = field(default_factory=time.time)

    def to_dict(self) -> Dict:
        return {
            "event_id": self.event_id,
            "event_type": self.event_type,
            "agent_id": self.agent_id,
            "agent_role": self.agent_role,
            "payload": self.payload,
            "timestamp": self.timestamp,
            "ts": datetime.fromtimestamp(self.timestamp).isoformat(),
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict())


class EventBus:
    _instance: "EventBus | None" = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._subscribers: Dict[str, List[Callable]] = {}  # event_type → [callbacks]
            self._history: List[AgentEvent] = []
            self._max_history = 10000
            self._lock = threading.Lock()
            self._ws_clients: List[Any] = []  # WebSocket client connections
            self._event_file = "/home/workspace/Bxthre3/TELEMETRY/agentic/events/event_log.jsonl"
            os.makedirs(os.path.dirname(self._event_file), exist_ok=True)
            self._initialized = True

    def publish(self, event: AgentEvent):
        """Publish an event to all subscribers."""
        with self._lock:
            self._history.append(event)
            if len(self._history) > self._max_history:
                self._history = self._history[-self._max_history:]
            with open(self._event_file, "a") as f:
                f.write(event.to_json() + "\n")

        # Notify subscribers
        for cb in self._subscribers.get(event.event_type, []):
            try:
                cb(event)
            except Exception as e:
                logger.error(f"Subscriber callback error: {e}")

        # Notify wildcard subscribers
        for cb in self._subscribers.get("*", []):
            try:
                cb(event)
            except Exception as e:
                logger.error(f"Wildcard subscriber error: {e}")

    def subscribe(self, event_types: List[str], callback: Callable[[AgentEvent], None], subscriber_id: str = None):
        """Subscribe to event types."""
        with self._lock:
            for et in event_types:
                if et not in self._subscribers:
                    self._subscribers[et] = []
                self._subscribers[et].append(callback)
        logger.info(f"Subscribed to {event_types} (id={subscriber_id or 'anon'})")

    def unsubscribe(self, event_types: List[str], subscriber_id: str = None):
        """Unsubscribe from event types."""
        with self._lock:
            for et in event_types:
                if et in self._subscribers:
                    self._subscribers[et] = []

    def get_history(self, event_type: str = None, agent_id: str = None, limit: int = 100) -> List[AgentEvent]:
        events = self._history[-limit:]
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        if agent_id:
            events = [e for e in events if e.agent_id == agent_id]
        return events

    def emit(self, event_type: str, agent_id: str, agent_role: str, payload: Dict):
        """Convenience method to emit an event."""
        import uuid
        event = AgentEvent(
            event_id=str(uuid.uuid4())[:12],
            event_type=event_type,
            agent_id=agent_id,
            agent_role=agent_role,
            payload=payload,
        )
        self.publish(event)
        return event.event_id


# Global singleton
event_bus = EventBus()
