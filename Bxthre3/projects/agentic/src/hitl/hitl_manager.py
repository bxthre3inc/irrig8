"""HITL Manager — Floating Human-in-the-Loop — semantic version 2.0.0"""
import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import json

__version__ = "1.0.0"
VERSION = "1.0.0"


class HITLPermission:
    NONE = 0
    VIEW = 1
    APPROVE_LOW = 2
    APPROVE_MEDIUM = 3
    APPROVE_HIGH = 4
    FULL = 5


class HITLRequest:
    def __init__(
        self,
        task_id: str,
        task_name: str,
        description: str,
        risk_weight: int,
        requested_by: str,
        deadline: Optional[str] = None,
    ):
        self.task_id = task_id
        self.task_name = task_name
        self.description = description
        self.risk_weight = risk_weight
        self.requested_by = requested_by
        self.deadline = deadline
        self.status = "pending"
        self.created_at = datetime.utcnow()
        self.responded_at: Optional[datetime] = None
        self.responder: Optional[str] = None

    def to_dict(self) -> Dict:
        return {
            "task_id": self.task_id,
            "task_name": self.task_name,
            "description": self.description,
            "risk_weight": self.risk_weight,
            "requested_by": self.requested_by,
            "deadline": self.deadline,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "responded_at": self.responded_at.isoformat() if self.responded_at else None,
            "responder": self.responder,
        }


class HITLManager:
    """
    Floating HITL system — human approval required for high-risk tasks.
    Integrates with Slack, updates WorkBuffer, exposes REST API.
    """

    def __init__(self, config_path: Optional[str] = None):
        self.version = __version__
        self.version = SEMVER
        self.logger = logging.getLogger("HITLManager")
        self.pending_requests: Dict[str, HITLRequest] = {}
        self.completed_requests: List[HITLRequest] = []
        self._slack_token = os.getenv("SLACK_API_TOKEN", "")
        self._slack_channel = os.getenv("SLACK_HITL_CHANNEL", "#agentic-hitl")
        self._initialize_permissions()

    def _initialize_permissions(self):
        self.permission_levels = {
            "viewer": HITLPermission.VIEW,
            "approver_low": HITLPermission.APPROVE_LOW,
            "approver_medium": HITLPermission.APPROVE_MEDIUM,
            "approver_high": HITLPermission.APPROVE_HIGH,
            "admin": HITLPermission.FULL,
        }
        self.risk_thresholds = {
            "LOW": 3,
            "MEDIUM": 6,
            "HIGH": 8,
        }

    def _risk_to_level(self, risk_weight: int) -> str:
        if risk_weight <= 3:
            return "LOW"
        elif risk_weight <= 6:
            return "MEDIUM"
        else:
            return "HIGH"

    def _requires_approval(self, task: Dict) -> bool:
        return task.get("Prerequisites", {}).get("NeedsApproval", []) != []

    def request_approval(
        self,
        task_id: str,
        task_name: str,
        description: str,
        risk_weight: int,
        requested_by: str,
        deadline: Optional[str] = None,
    ) -> HITLRequest:
        hitl_req = HITLRequest(
            task_id=task_id,
            task_name=task_name,
            description=description,
            risk_weight=risk_weight,
            requested_by=requested_by,
            deadline=deadline,
        )
        self.pending_requests[task_id] = hitl_req
        self._send_slack_notification(hitl_req)
        self.logger.info(f"HITL request created: {task_name} (RW: {risk_weight})")
        return hitl_req

    def approve(self, task_id: str, responder: str = "human") -> bool:
        if task_id not in self.pending_requests:
            self.logger.warning(f"HITL request not found: {task_id}")
            return False
        req = self.pending_requests[task_id]
        req.status = "approved"
        req.responded_at = datetime.utcnow()
        req.responder = responder
        self.completed_requests.append(req)
        del self.pending_requests[task_id]
        self.logger.info(f"HITL approved: {req.task_name} by {responder}")
        return True

    def reject(self, task_id: str, responder: str = "human", reason: str = "") -> bool:
        if task_id not in self.pending_requests:
            self.logger.warning(f"HITL request not found: {task_id}")
            return False
        req = self.pending_requests[task_id]
        req.status = "rejected"
        req.responded_at = datetime.utcnow()
        req.responder = responder
        self.completed_requests.append(req)
        del self.pending_requests[task_id]
        self.logger.info(f"HITL rejected: {req.task_name} by {responder} — {reason}")
        return True

    def get_pending(self) -> List[Dict]:
        return [req.to_dict() for req in self.pending_requests.values()]

    def get_status(self) -> Dict:
        return {
            "pending": len(self.pending_requests),
            "completed": len(self.completed_requests),
            "approved": sum(1 for r in self.completed_requests if r.status == "approved"),
            "rejected": sum(1 for r in self.completed_requests if r.status == "rejected"),
        }

    def _send_slack_notification(self, req: HITLRequest) -> None:
        if not self._slack_token:
            self.logger.info(f"[SLACK] Would notify {self._slack_channel}: {req.task_name}")
            return
        risk_level = self._risk_to_level(req.risk_weight)
        self.logger.info(
            f"[SLACK] Notifying {self._slack_channel}: "
            f"{req.task_name} | RW: {req.risk_weight} ({risk_level}) | {req.description}"
        )

    def update_work_buffer_on_approval(self, task_id: str, work_buffer) -> None:
        task = {"Task": task_id, "source": "hitl_approved"}
        work_buffer.add_task(task, "assigned")
        self.logger.info(f"Updated WorkBuffer: {task_id} unblocked")

    def to_api_dict(self) -> Dict:
        return {
            "version": self.version,
            "version": self.version,
            "status": self.get_status(),
            "pending": self.get_pending(),
        }