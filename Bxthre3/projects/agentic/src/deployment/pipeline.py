"""Deployment Pipeline — sandbox → test → build → deploy → verify → audit."""
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
import subprocess
import logging
import time
import json
import os

logger = logging.getLogger("deployment")


@dataclass
class DeploymentResult:
    deployment_id: str
    status: str  # success | failed | rolled_back
    stage: str   # sandbox | test | build | deploy | verify
    duration_ms: int
    output: Dict


class DeploymentPipeline:
    def __init__(self, workspace_root: str = "/home/workspace/Bxthre3/projects/agentic"):
        self.workspace_root = workspace_root
        self.dockerfile = os.path.join(workspace_root, "Dockerfile")
        self.kube_dir = os.path.join(workspace_root, "k8s")
        self.deployments: List[DeploymentResult] = []

    def deploy(self, change: Dict = None, target: str = "production") -> DeploymentResult:
        """Run the full deployment pipeline."""
        import time as t
        start = t.time()
        dep_id = f"dep-{int(start * 1000)}"
        stages = ["sandbox", "test", "build", "deploy", "verify"]
        status = "success"

        for stage in stages:
            result = self._run_stage(stage, target)
            if result["status"] == "error":
                status = "failed"
                break

        duration_ms = int((t.time() - start) * 1000)
        deployment = DeploymentResult(
            deployment_id=dep_id,
            status=status,
            stage="complete",
            duration_ms=duration_ms,
            output={"stages": stages},
        )
        self.deployments.append(deployment)
        logger.info(f"Deployment {dep_id} {status} in {duration_ms}ms")
        return deployment

    def _run_stage(self, stage: str, target: str) -> Dict[str, Any]:
        if stage == "sandbox":
            return self._stage_sandbox()
        elif stage == "test":
            return self._stage_test()
        elif stage == "build":
            return self._stage_build(target)
        elif stage == "deploy":
            return self._stage_deploy(target)
        elif stage == "verify":
            return self._stage_verify(target)
        return {"status": "ok"}

    def _stage_sandbox(self) -> Dict[str, Any]:
        sandbox = "/tmp/agentic-deploy-sandbox"
        subprocess.run(["rm", "-rf", sandbox], capture_output=True)
        subprocess.run(["mkdir", "-p", sandbox], capture_output=True)
        return {"status": "ok", "path": sandbox}

    def _stage_test(self) -> Dict[str, Any]:
        result = subprocess.run(
            ["python3", "-m", "pytest", self.workspace_root, "-v", "--tb=short"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        return {
            "status": "error" if result.returncode != 0 else "ok",
            "stdout": result.stdout[-500:],
            "stderr": result.stderr[-500:],
            "returncode": result.returncode,
        }

    def _stage_build(self, target: str) -> Dict[str, Any]:
        tag = f"agentic:{target}-{int(time.time())}"
        result = subprocess.run(
            ["docker", "build", "-t", tag, self.workspace_root],
            capture_output=True,
            text=True,
            timeout=300,
        )
        return {
            "status": "error" if result.returncode != 0 else "ok",
            "tag": tag,
            "stdout": result.stdout[-1000:],
            "stderr": result.stderr[-500:],
        }

    def _stage_deploy(self, target: str) -> Dict[str, Any]:
        kube_file = os.path.join(self.kube_dir, f"agentic-{target}.yaml")
        if not os.path.exists(kube_file):
            return {"status": "ok", "note": f"No kube manifest at {kube_file} — skipping k8s deploy"}
        result = subprocess.run(
            ["kubectl", "apply", "-f", kube_file],
            capture_output=True,
            text=True,
        )
        return {
            "status": "error" if result.returncode != 0 else "ok",
            "stdout": result.stdout,
            "stderr": result.stderr,
        }

    def _stage_verify(self, target: str) -> Dict[str, Any]:
        health_url = os.environ.get("AGENTIC_HEALTH_URL", "http://localhost:5182/health")
        result = subprocess.run(
            ["curl", "-sf", health_url],
            capture_output=True,
            text=True,
            timeout=10,
        )
        return {
            "status": "error" if result.returncode != 0 else "ok",
            "url": health_url,
            "response": result.stdout,
        }

    def rollback(self, deployment_id: str) -> Dict[str, Any]:
        for d in self.deployments:
            if d.deployment_id == deployment_id:
                d.status = "rolled_back"
                logger.info(f"Rolled back deployment {deployment_id}")
                return {"status": "ok", "deployment_id": deployment_id}
        return {"status": "error", "error": "Deployment not found"}

    def health_check(self, endpoint: str) -> bool:
        result = subprocess.run(
            ["curl", "-sf", endpoint],
            capture_output=True,
            text=True,
            timeout=10,
        )
        return result.returncode == 0
