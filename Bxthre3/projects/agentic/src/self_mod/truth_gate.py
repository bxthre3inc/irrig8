"""Truth Gate — immutable SHA-256 sealed audit log for all agent actions."""
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import hashlib
import json
import threading
import os

AUDIT_DIR = os.environ.get("AUDIT_DIR", "/home/workspace/Bxthre3/TELEMETRY/agentic/audit")
os.makedirs(AUDIT_DIR, exist_ok=True)


@dataclass
class AuditEntry:
    seq: int
    agent_id: str
    agent_role: str
    action: Dict[str, Any]
    timestamp: float
    hash: str
    prev_hash: str
    sealed: bool = True

    def to_dict(self) -> Dict:
        return {
            "seq": self.seq,
            "agent_id": self.agent_id,
            "agent_role": self.agent_role,
            "action": self.action,
            "timestamp": self.timestamp,
            "hash": self.hash,
            "prev_hash": self.prev_hash,
            "sealed": self.sealed,
        }

    def verify(self) -> bool:
        """Verify this entry's hash is valid."""
        data = {
            "seq": self.seq,
            "agent_id": self.agent_id,
            "agent_role": self.agent_role,
            "action": self.action,
            "timestamp": self.timestamp,
            "prev_hash": self.prev_hash,
        }
        computed = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
        return computed == self.hash


class TruthGate:
    _instance: Optional["TruthGate"] = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._seq = 0
            self._prev_hash = "0" * 64  # genesis
            self._index: Dict[str, List[int]] = {}  # agent_id → seq list
            self._entries: Dict[int, AuditEntry] = {}
            self._audit_file = os.path.join(AUDIT_DIR, "truth_gate.jsonl")
            self._load_index()
            self._initialized = True

    def _load_index(self):
        """Load existing entries from disk."""
        if not os.path.exists(self._audit_file):
            return
        with open(self._audit_file, "r") as f:
            for line in f:
                entry = json.loads(line.strip())
                seq = entry["seq"]
                self._entries[seq] = AuditEntry(**entry)
                self._seq = max(self._seq, seq)
                agent_id = entry["agent_id"]
                if agent_id not in self._index:
                    self._index[agent_id] = []
                self._index[agent_id].append(seq)
        if self._entries:
            self._prev_hash = self._entries[self._seq].hash

    def _seal(self, agent_id: str, agent_role: str, action: Dict[str, Any]) -> AuditEntry:
        """Create a sealed audit entry."""
        import time
        self._seq += 1
        timestamp = time.time()
        data = {
            "seq": self._seq,
            "agent_id": agent_id,
            "agent_role": agent_role,
            "action": action,
            "timestamp": timestamp,
            "prev_hash": self._prev_hash,
        }
        raw = json.dumps(data, sort_keys=True).encode()
        digest = hashlib.sha256(raw).hexdigest()
        entry = AuditEntry(
            seq=self._seq,
            agent_id=agent_id,
            agent_role=agent_role,
            action=action,
            timestamp=timestamp,
            hash=digest,
            prev_hash=self._prev_hash,
            sealed=True,
        )
        self._entries[self._seq] = entry
        self._prev_hash = digest
        if agent_id not in self._index:
            self._index[agent_id] = []
        self._index[agent_id].append(self._seq)
        # Append to disk
        with open(self._audit_file, "a") as f:
            f.write(json.dumps(entry.to_dict()) + "\n")
        return entry

    def record(self, agent_id: str, agent_role: str, action: Dict[str, Any]) -> str:
        """Record an agent action and return its sealed hash."""
        with self._lock:
            entry = self._seal(agent_id, agent_role, action)
            return entry.hash

    def verify_chain(self, from_seq: int = 1, to_seq: int = None) -> Dict[str, Any]:
        """Verify integrity of the audit chain from from_seq to to_seq."""
        to_seq = to_seq or self._seq
        broken = []
        for seq in range(from_seq, to_seq + 1):
            if seq not in self._entries:
                broken.append(f"Missing seq {seq}")
                continue
            entry = self._entries[seq]
            if entry.prev_hash != self._entries[seq - 1].hash if seq > 1 else entry.prev_hash != "0" * 64:
                broken.append(f"Chain broken at seq {seq}")
            if not entry.verify():
                broken.append(f"Hash mismatch at seq {seq}")
        return {
            "valid": len(broken) == 0,
            "verified": to_seq - from_seq + 1 - len(broken),
            "total": to_seq - from_seq + 1,
            "broken": broken,
        }

    def query(self, agent_id: str = None, limit: int = 100) -> List[AuditEntry]:
        """Query audit entries by agent_id or all agents."""
        if agent_id:
            seqs = self._index.get(agent_id, [])[-limit:]
            return [self._entries[s] for s in seqs if s in self._entries]
        else:
            return list(self._entries.values())[-limit:]

    def get_stats(self) -> Dict[str, Any]:
        """Return audit statistics."""
        return {
            "total_entries": self._seq,
            "unique_agents": len(self._index),
            "latest_hash": self._prev_hash,
            "chain_valid": self.verify_chain()["valid"],
        }
