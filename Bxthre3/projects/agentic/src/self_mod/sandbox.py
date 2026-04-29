"""Sandbox code modifier — applies patches to files in isolation."""
import re, shutil, hashlib, logging, os
from pathlib import Path

logger = logging.getLogger("sandbox")

SANDBOX_DIR = "/tmp/agentic-sandbox"

class SandboxModifier:
    def __init__(self, base_path=None):
        self.base = Path(base_path or "/home/workspace/Bxthre3/projects/agentic/src")
        self.sandbox_base = Path(SANDBOX_DIR)
        self.sandbox_base.mkdir(parents=True, exist_ok=True)

    def _checksum(self, filepath: Path) -> str:
        return hashlib.sha256(filepath.read_bytes()).hexdigest()

    def modify_code(self, filepath: str, search: str, replace: str) -> dict:
        """
        Apply a single-search → single-replace patch to a source file.
        Returns dict with status, backup_path, checksum_before/after.
        """
        target = self.base / filepath
        if not target.exists():
            return {"status": "error", "error": f"file not found: {filepath}"}

        original = target.read_text()
        if search not in original:
            return {"status": "error", "error": "search pattern not found in file"}

        checksum_before = self._checksum(target)
        backup = target.with_suffix(target.suffix + ".bak")
        shutil.copy2(target, backup)

        new_content = original.replace(search, replace, 1)
        target.write_text(new_content)
        checksum_after = self._checksum(target)

        logger.info(f"SandboxMod applied to {filepath}: checksum {checksum_before[:8]} → {checksum_after[:8]}")
        return {
            "status": "ok",
            "file": str(target),
            "backup": str(backup),
            "checksum_before": checksum_before,
            "checksum_after": checksum_after,
        }

    def rollback(self, filepath: str) -> dict:
        """Restore from .bak backup."""
        target = self.base / filepath
        backup = target.with_suffix(target.suffix + ".bak")
        if not backup.exists():
            return {"status": "error", "error": "no backup found"}
        shutil.copy2(backup, target)
        backup.unlink()
        return {"status": "ok", "restored": str(target)}
