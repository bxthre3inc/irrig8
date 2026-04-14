"""
Event Bus — AgentOS internal pub/sub spine.
"""
from dataclasses import dataclass, field
from typing import Callable, Any, Optional
from datetime import datetime
from collections import defaultdict, deque
import threading

CHANNELS = {
    'tool': 'agentic.tool.events',
    'agent': 'agentic.agent.events',
    'training': 'agentic.training.events',
    'mesh': 'agentic.mesh.events',
    'chairman': 'agentic.chairman.events',
}

@dataclass
class Event:
    channel: str
    payload: dict
    published_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

_subscribers: dict[str, list[tuple[Callable, str]]] = defaultdict(list)
_channels: dict[str, dict] = defaultdict(lambda: {"queue": deque(), "lock": threading.Lock()})
_lock = threading.RLock()

def subscribe(channel: str, handler: Callable, name: str = '') -> str:
    with _lock:
        _subscribers[channel].append((handler, name))
    return f"sub-{channel}-{name}"

def unsubscribe(channel: str, handler: Callable) -> None:
    with _lock:
        _subscribers[channel] = [(h, n) for h, n in _subscribers[channel] if h != handler]

def publish(channel: str, payload: dict) -> None:
    event = Event(channel=channel, payload=payload)
    with _channels[channel]["lock"]:
        _channels[channel]["queue"].append(event)
    handlers = []
    with _lock:
        handlers = list(_subscribers.get(channel, []))
    for handler, _ in handlers:
        try:
            handler(event)
        except Exception:
            pass

def drain_all(channel: Optional[str] = None) -> list[dict]:
    """Drain events from a specific channel or all channels. Returns list of event dicts."""
    events = []
    if channel:
        with _channels[channel]["lock"]:
            q = _channels[channel]["queue"]
            while q:
                try:
                    ev = q.popleft()
                    events.append({"channel": ev.channel, "payload": ev.payload, "published_at": ev.published_at})
                except IndexError:
                    break
    else:
        for ch_name in list(_channels.keys()):
            with _channels[ch_name]["lock"]:
                q = _channels[ch_name]["queue"]
                while q:
                    try:
                        ev = q.popleft()
                        events.append({"channel": ev.channel, "payload": ev.payload, "published_at": ev.published_at})
                    except IndexError:
                        break
    return events

def list_subscriptions() -> dict[str, int]:
    with _lock:
        return {ch: len(handlers) for ch, handlers in _subscribers.items()}

def clear() -> None:
    with _lock:
        _subscribers.clear()
    for ch in _channels.values():
        with ch["lock"]:
            ch["queue"].clear()

def emit_tool_event(tool: str, action: str, agent_did: str, **kwargs) -> None:
    publish('agentic.tool.events', {'tool': tool, 'action': action, 'agent_did': agent_did, **kwargs})

def emit_agent_event(agent_did: str, action: str, **kwargs) -> None:
    publish('agentic.agent.events', {'agent_did': agent_did, 'action': action, **kwargs})

def emit_training_event(run_id: str, stage: str, action: str, **kwargs) -> None:
    publish('agentic.training.events', {'run_id': run_id, 'stage': stage, 'action': action, **kwargs})

def emit_mesh_event(peer_id: str, action: str, **kwargs) -> None:
    publish('agentic.mesh.events', {'peer_id': peer_id, 'action': action, **kwargs})

def emit_chairman_event(action: str, item_id: str, **kwargs) -> None:
    publish('agentic.chairman.events', {'action': action, 'item_id': item_id, **kwargs})