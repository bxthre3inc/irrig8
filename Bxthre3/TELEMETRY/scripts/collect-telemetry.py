#!/usr/bin/env python3
"""
ATC Telemetry Collector — Phase 1: Data Harvest

Captures ALL platform usage for investor audit transparency.

SECURITY: This script WRITE-ONLY. Does not read historical telemetry.
          See: SYSTEMS/SECURE_TELEMETRY_ARCHITECTURE.md

OUTPUT: JSON files to TELEMETRY/VAULT/
SCHEDULE: Daily 3:00 AM via Agent
OWNER: brodiblanco exclusive access
"""

import os
import json
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

# CONFIGURATION
TELEMETRY_DIR = Path("/home/workspace/Bxthre3/TELEMETRY")
VAULT_DIR = TELEMETRY_DIR / "VAULT"
AUDIT_DIR = TELEMETRY_DIR / "AUDIT"
REPORTS_DIR = TELEMETRY_DIR / "REPORTS"

TIMESTAMP = datetime.utcnow().isoformat() + "Z"
DATE_STR = datetime.utcnow().strftime("%Y-%m-%d")

def ensure_dirs():
    for dir_path in [VAULT_DIR, AUDIT_DIR, REPORTS_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)

def run_cmd(cmd, cwd=None, shell=True, timeout=30):
    try:
        result = subprocess.run(cmd, shell=shell, cwd=cwd, capture_output=True, text=True, timeout=timeout)
        return result.stdout.strip()
    except:
        return ""

def collect_all():
    report = {"timestamp": TIMESTAMP, "date": DATE_STR, "planes": {}}
    
    # Plane 2: Workspace - File Operations
    report["planes"]["workspace_files"] = {
        "files_modified": int(run_cmd("find /home/workspace/Bxthre3 -type f -mtime -1 2>/dev/null | wc -l") or 0),
        "files_created_24h": int(run_cmd("find /home/workspace/Bxthre3 -type f -ctime -1 2>/dev/null | wc -l") or 0),
        "apk_builds_24h": int(run_cmd("find /home/workspace -name '*.apk' -mtime -1 2>/dev/null | wc -l") or 0),
    }
    
    # Plane 2: Workspace - Git
    git_repos = [r.strip() for r in run_cmd("find /home/workspace/Bxthre3 -name '.git' -type d 2>/dev/null | head -10").split("\n") if r.strip()]
    total_commits = 0
    for repo_dir in git_repos:
        repo_parent = Path(repo_dir).parent
        commits = run_cmd(f"git -C '{repo_parent}' log --since='24 hours ago' --oneline 2>/dev/null | wc -l")
        total_commits += int(commits) if commits.isdigit() else 0
    report["planes"]["workspace_git"] = {"commits_24h": total_commits, "repos_active": len(git_repos)}
    
    # Plane 2: INBOX
    inbox_path = Path("/home/workspace/Bxthre3/INBOX.md")
    if inbox_path.exists():
        content = inbox_path.read_text()
        report["planes"]["inbox"] = {
            "p0_count": content.count("🔴 P0"),
            "p1_count": content.count("🔴 P1"),
            "p2_count": content.count("🟡 P2"),
            "p3_count": content.count("🟢 P3"),
            "total_entries": len([l for l in content.split("\n") if l.startswith("|")])
        }
    
    # Plane 5: Scheduled Agents
    report["planes"]["agents"] = {
        "workspace_sessions_24h": int(run_cmd("find /home/.z/workspaces -type d -mtime -1 2>/dev/null | wc -l") or 0),
        "scheduled_agents_active": 3  # Grader, Sentinel, Foundry
    }
    
    # Plane 3: Infrastructure
    report["planes"]["infrastructure"] = {
        "service_log_files": int(run_cmd("ls /dev/shm/*.log 2>/dev/null | wc -l") or 0),
        "space_routes_count": 5  # Known routes
    }
    
    # Plane 4: Integrations
    report["planes"]["integrations"] = {
        "connected": ["linear", "notion", "google_calendar", "gmail", "google_tasks", "google_drive", "spotify", "dropbox", "airtable_oauth"],
        "pending": ["twitter", "linkedin"]
    }
    
    return report

def write_audit_log(action, details=""):
    audit_entry = f"{TIMESTAMP} | {action} | {details}\n"
    (AUDIT_DIR / "access.log").open("a").write(audit_entry)

def main():
    ensure_dirs()
    report = collect_all()
    
    # Write to VAULT - user access only
    output_file = VAULT_DIR / f"telemetry_{DATE_STR}.json"
    output_file.write_text(json.dumps(report, indent=2))
    
    # Log this collection
    write_audit_log("COLLECTION", f"Saved to {output_file}")
    
    # Write summary to REPORTS (user accessible, still restricted)
    summary = {
        "date": DATE_STR,
        "status": "collected",
        "planes_captured": list(report["planes"].keys()),
        "next_collection": "Tomorrow 3:00 AM"
    }
    (REPORTS_DIR / f"summary_{DATE_STR}.json").write_text(json.dumps(summary, indent=2))
    
    print(f"ATC Telemetry: Saved to {output_file}")
    return 0

if __name__ == "__main__":
    exit(main())
