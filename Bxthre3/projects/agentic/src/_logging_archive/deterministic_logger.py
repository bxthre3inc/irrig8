"""Deterministic Logger — semantic version 2.0.0"""
import json
from datetime import datetime
import logging
from typing import Dict, Any

__version__ = "1.0.0"
VERSION = "1.0.0"


class DeterministicLogger:
    def __init__(self, log_file: str = "agentic1.log"):
        self.log_file = log_file
        self.logger = logging.getLogger("DeterministicLogger")

    def log_action(self, action: Dict, entity: Dict) -> Dict:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "entity": entity,
            "action": action,
            "code": self._generate_executable_code(action, entity),
        }
        with open(self.log_file, "a") as f:
            json.dump(log_entry, f)
            f.write("\n")
        self.logger.info(f"Logged action: {action.get('Task', 'Unknown')}")
        return log_entry

    def _generate_executable_code(self, action: Dict, entity: Dict) -> str:
        action_type = action.get("Task", "unknown")
        if action_type == "Analyze_Patent_Cluster":
            patents = action.get("target", [])
            return f"analyze_patents(patents={patents}, agent='{entity.get('role', 'Unknown')}')"
        elif action_type == "File_Patent":
            patents = action.get("target", [])
            return f"file_patent(patents={patents}, agent='{entity.get('role', 'Unknown')}')"
        else:
            return f"unknown_action(action={action}, entity={entity})"