#!/usr/bin/env python3
"""Grants HQ CLI — Pipeline management for Bxthre3 Inc."""

import csv
import sys
from datetime import datetime, timedelta
from pathlib import Path

PIPELINE_PATH = Path("/home/workspace/Bxthre3/grants/pipeline.csv")

def load_pipeline():
    """Load pipeline CSV."""
    if not PIPELINE_PATH.exists():
        return []
    with open(PIPELINE_PATH) as f:
        return list(csv.DictReader(f))

def cmd_report():
    """Generate pipeline summary report."""
    grants = load_pipeline()
    if not grants:
        print("No grants in pipeline.")
        return

    by_stage = {}
    by_venture = {}
    for g in grants:
        stage = g.get("stage", "UNKNOWN")
        venture = g.get("venture", "UNKNOWN")
        by_stage[stage] = by_stage.get(stage, 0) + 1
        by_venture[venture] = by_venture.get(venture, 0) + 1

    print("=" * 50)
    print("GRANTS PIPELINE REPORT")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 50)
    print(f"\nTotal grants: {len(grants)}")
    print("\nBy Stage:")
    for stage in ["PROSPECT", "SHORTLIST", "WRITING", "SUBMITTED", "AWARDED", "REJECTED", "ARCHIVED"]:
        count = by_stage.get(stage, 0)
        if count > 0:
            print(f"  {stage}: {count}")
    print("\nBy Venture:")
    for venture, count in sorted(by_venture.items()):
        print(f"  {venture}: {count}")

def cmd_stage():
    """Show grants in each stage."""
    grants = load_pipeline()
    stages = {}
    for g in grants:
        stage = g.get("stage", "UNKNOWN")
        stages.setdefault(stage, []).append(g)

    for stage in ["PROSPECT", "SHORTLIST", "WRITING", "SUBMITTED", "AWARDED"]:
        items = stages.get(stage, [])
        if items:
            print(f"\n{stage} ({len(items)}):")
            for g in items:
                print(f"  • {g['id']}: {g['grant_name']} ({g['venture']}) - Due: {g.get('deadline', 'TBD')}")

def cmd_upcoming(days=14):
    """Show upcoming deadlines."""
    grants = load_pipeline()
    today = datetime.now().date()
    cutoff = today + timedelta(days=days)

    upcoming = []
    for g in grants:
        deadline_str = g.get("deadline", "")
        if deadline_str:
            try:
                deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()
                if today <= deadline <= cutoff and g.get("status") != "SUBMITTED":
                    upcoming.append((g, deadline))
            except ValueError:
                pass

    if upcoming:
        print(f"\nUpcoming Deadlines (next {days} days):")
        for g, deadline in sorted(upcoming, key=lambda x: x[1]):
            days_left = (deadline - today).days
            print(f"  ⚠ {g['id']}: {g['grant_name']} ({g['venture']}) - Due {deadline} ({days_left} days)")
    else:
        print(f"\nNo deadlines in next {days} days.")

def main():
    if len(sys.argv) < 2:
        print("Usage: grants-hq.py [report|stage|upcoming]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "report":
        cmd_report()
    elif cmd == "stage":
        cmd_stage()
    elif cmd == "upcoming":
        days = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 14
        cmd_upcoming(days)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)

if __name__ == "__main__":
    main()
