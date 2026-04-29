"""Self-Modification Engine — implements the Darwin Gödel Cycle per SOUL.md."""
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import hashlib
import json
import subprocess
import os
import shutil
import logging
import sys

sys.path.insert(0, "/home/workspace/Bxthre3/projects/agentic/src")
from .truth_gate import TruthGate

logger = logging.getLogger("self_mod")


@dataclass
class CodeChange:
    id: str
    agent_id: str
    target_file: str
    original_hash: str
    proposed_hash: str
    patch: str
    reason: str
    status: str = "proposed"  # proposed | sandboxed | approved | committed | rejected | rolled_back
    sandbox_result: Optional[Dict] = None
    commit_id: Optional[str] = None
    created_at: float = field(default_factory=datetime.utcnow().timestamp)


IMMUTABLE_CORE = {
    "LLM_weights",
    "safety_constraints",
    "truth_gate_enforcement",
    "INBOX_routing",
    "SOUL.md",
    "base_agent.py",  # immutable base
}


class SelfModificationEngine:
    def __init__(self, sandbox_dir: str = "/tmp/agentic-sandbox", workspace_root: str = "/home/workspace"):
        self.sandbox_dir = sandbox_dir
        self.workspace_root = workspace_root
        self.truth_gate = TruthGate()
        self._changes: Dict[str, CodeChange] = {}
        os.makedirs(sandbox_dir, exist_ok=True)

    def _is_immutable(self, file_path: str) -> bool:
        for core in IMMUTABLE_CORE:
            if core in file_path:
                return True
        return False

    def observe(self) -> List[Dict[str, Any]]:
        """Observe execution patterns and failures. Returns list of FailureEvent dicts."""
        from ..execution.engine import TaskExecutionEngine
        executor = TaskExecutionEngine()
        failures = []
        for result in executor.get_completed(limit=100):
            if result.status == "error":
                failures.append({
                    "type": "task_failure",
                    "task_id": result.task_id,
                    "error": result.error,
                    "tools_used": result.tools_used,
                    "timestamp": datetime.utcnow().timestamp(),
                })
        logger.info(f"Observed {len(failures)} failure events")
        return failures

    def hypothesize(self, failures: List[Dict]) -> List[CodeChange]:
        """Generate code change proposals for observed failures."""
        changes = []
        for failure in failures:
            change = self._propose_fix(failure)
            if change:
                changes.append(change)
                self._changes[change.id] = change
        logger.info(f"Hypothesized {len(changes)} code changes")
        return changes

    def _propose_fix(self, failure: Dict) -> Optional[CodeChange]:
        """Use inference to propose a fix for a failure."""
        import urllib.request, json as json_lib, ssl, hashlib

        error_msg = failure.get("error", "")
        task_type = failure.get("type", "unknown")

        prompt = (
            f"A task failed in the Agentic AI system.\n"
            f"Task type: {task_type}\n"
            f"Error: {error_msg}\n"
            f"Tools used: {failure.get('tools_used', [])}\n\n"
            f"Propose a minimal Python code fix. Return JSON with keys: "
            f"{{\"file\": \"relative/path.py\", \"patch\": \"exact replacement code\", \"reason\": \"why this fixes it\"}}"
            f"Only propose if you are confident. Return {{\"file\": null}} if no fix needed."
        )

        ctx = ssl.create_default_context()
        payload = json_lib.dumps({
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
            "options": {"num_predict": 512},
        }).encode()
        req = urllib.request.Request(
            "http://localhost:11434/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
                data = json_lib.loads(r.read())
            response = data.get("response", "{}")
            # Try to extract JSON
            start = response.find("{")
            end = response.rfind("}") + 1
            if start >= 0 and end > start:
                parsed = json_lib.loads(response[start:end])
                if parsed.get("file") is None:
                    return None
                file_path = os.path.join(self.workspace_root, parsed["file"])
                if self._is_immutable(file_path):
                    logger.warning(f"Proposed change targets immutable file: {file_path}")
                    return None
                with open(file_path, "r") as f:
                    original = f.read()
                proposed = parsed["patch"]
                change_id = hashlib.sha256(f"{file_path}{original[:50]}".encode()).hexdigest()[:12]
                return CodeChange(
                    id=change_id,
                    agent_id="self-mod-engine",
                    target_file=file_path,
                    original_hash=hashlib.sha256(original.encode()).hexdigest(),
                    proposed_hash=hashlib.sha256(proposed.encode()).hexdigest(),
                    patch=proposed,
                    reason=parsed.get("reason", ""),
                )
        except Exception as e:
            logger.error(f"Failed to hypothesize fix: {e}")
        return None

    def sandbox(self, change: CodeChange) -> Dict[str, Any]:
        """Test a proposed change in an isolated sandbox."""
        import tempfile, time
        sandbox_path = os.path.join(self.sandbox_dir, f"{change.id}_{int(time.time())}")
        os.makedirs(sandbox_path, exist_ok=True)

        # Copy full workspace to sandbox
        try:
            shutil.copytree(
                os.path.dirname(change.target_file),
                sandbox_path,
                dirs_exist_ok=True,
            )
        except Exception as e:
            result = {"status": "error", "error": f"Could not copy to sandbox: {e}"}
            change.sandbox_result = result
            change.status = "sandboxed"
            return result

        # Apply patch
        sandbox_file = os.path.join(sandbox_path, os.path.basename(change.target_file))
        try:
            with open(sandbox_file, "w") as f:
                f.write(change.patch)
        except Exception as e:
            result = {"status": "error", "error": f"Could not apply patch: {e}"}
            change.sandbox_result = result
            change.status = "sandboxed"
            return result

        # Run tests if they exist
        test_result = subprocess.run(
            ["python3", "-m", "pytest", sandbox_path, "-v"],
            capture_output=True,
            text=True,
            timeout=60,
        )

        result = {
            "status": "passed" if test_result.returncode == 0 else "failed",
            "sandbox_path": sandbox_path,
            "stdout": test_result.stdout,
            "stderr": test_result.stderr,
            "returncode": test_result.returncode,
        }
        change.sandbox_result = result
        change.status = "sandboxed"
        logger.info(f"Sandbox result for {change.id}: {result['status']}")
        return result

    def commit(self, change_id: str) -> Dict[str, Any]:
        """Apply an approved change to the live workspace."""
        change = self._changes.get(change_id)
        if not change:
            return {"status": "error", "error": "Change not found"}
        if change.status not in ("sandboxed", "proposed"):
            return {"status": "error", "error": f"Cannot commit change in status '{change.status}'"}

        # Verify hash of original hasn't changed
        with open(change.target_file, "r") as f:
            current = f.read()
        if hashlib.sha256(current.encode()).hexdigest() != change.original_hash:
            return {"status": "error", "error": "Original file changed since proposal — aborting"}

        # Create git branch
        branch_name = f"agentic/self-mod/{change_id}"
        try:
            subprocess.run(["git", "checkout", "-b", branch_name],
                           capture_output=True, cwd=os.path.dirname(change.target_file))
        except Exception:
            pass  # Branch may already exist

        # Apply change
        with open(change.target_file, "w") as f:
            f.write(change.patch)

        # Commit
        commit_result = subprocess.run(
            ["git", "commit", "-am", f"self-mod: {change.reason}"],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(change.target_file),
        )
        change.commit_id = commit_result.stdout.strip() or branch_name
        change.status = "committed"

        # Seal in Truth Gate
        self.truth_gate.record("self-mod-engine", "system", {
            "type": "code_change_committed",
            "change_id": change_id,
            "file": change.target_file,
            "commit_id": change.commit_id,
            "reason": change.reason,
        })

        logger.info(f"Committed change {change_id} → {change.target_file}")
        return {"status": "ok", "change_id": change_id, "commit_id": change.commit_id}

    def rollback(self, change_id: str) -> Dict[str, Any]:
        """Rollback a committed change."""
        change = self._changes.get(change_id)
        if not change:
            return {"status": "error", "error": "Change not found"}
        if change.status != "committed":
            return {"status": "error", "error": f"Cannot rollback change in status '{change.status}'"}

        try:
            subprocess.run(
                ["git", "revert", "--no-commit", change.commit_id],
                capture_output=True,
                cwd=os.path.dirname(change.target_file),
            )
            subprocess.run(["git", "commit", "-am", f"rollback: {change_id}"],
                           capture_output=True, cwd=os.path.dirname(change.target_file))
            change.status = "rolled_back"
            self.truth_gate.record("self-mod-engine", "system", {
                "type": "code_change_rolled_back",
                "change_id": change_id,
            })
            return {"status": "ok", "change_id": change_id}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def get_change(self, change_id: str) -> Optional[CodeChange]:
        return self._changes.get(change_id)

    def list_changes(self, status: str = None) -> List[CodeChange]:
        if status:
            return [c for c in self._changes.values() if c.status == status]
        return list(self._changes.values())
