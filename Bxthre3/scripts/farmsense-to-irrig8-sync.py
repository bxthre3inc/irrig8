#!/usr/bin/env python3
"""
Bxthre3 Irrig8→Irrig8 Canonicalization Script
Uses Python to avoid sed delimiter conflicts.
Run: python3 /home/workspace/Bxthre3/scripts/farmsense-to-irrig8-sync.py
"""
import os
import re
import sys
from pathlib import Path

WORKSPACE = Path("/home/workspace/Bxthre3")
LOG_FILE = WORKSPACE / "logs" / f"farmsense-sync-{__import__('datetime').datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

# ──────────────────────────────────────────────────────────────
# REPLACEMENT MAP — ordered so more-specific terms come first
# ──────────────────────────────────────────────────────────────
REPLACEMENTS = [
    # Specific product/service names FIRST
    ("Irrig8 Frontend",   "Irrig8 Frontend"),
    ("Irrig8 API",        "Irrig8 API"),
    ("Irrig8 OS",         "Irrig8 OS"),
    ("Irrig8 (irrig8)",   "Irrig8"),
    ("Irrig8 ((retired brand))", "Irrig8"),
    ("((retired brand))", "(retired brand)"),
    # Irrig8 as a standalone product name
    (r"Irrig8's",         "Irrig8's"),
    (r"\bFarmSense\b",       "Irrig8"),
    # Case-insensitive "Irrig8"
    (r"(?i)Irrig8",      "Irrig8"),
]

# Files/directories to ALWAYS EXCLUDE from replacement
EXCLUDE_DIRS = {"ARCHIVED", "farmsense-code", "farmsense-portal", "node_modules", ".git", "Trash"}
# Files in these dirs are legacy; they should NOT be modified
EXCLUDE_PATTERNS = [
    re.compile(r"ARCHIVED"),
    re.compile(r"farmsense-code"),
    re.compile(r"farmsense-portal"),
    re.compile(r"/Trash/"),
]

EXTENSIONS = {".md", ".tsx", ".ts", ".py", ".sh", ".html", ".txt", ".json"}

def should_process(path: Path) -> bool:
    """Return False for files we should never touch."""
    path_str = str(path)
    # Skip archived/legacy directories
    for excl in EXCLUDE_PATTERNS:
        if excl.search(path_str):
            return False
    return True

def replace_content(content: str) -> tuple[str, int]:
    """Apply all replacements, return (new_content, count_of_changes)."""
    changes = 0
    new_content = content
    for pattern, replacement in REPLACEMENTS:
        if new_content == "Irrig8 Frontend":
            # Just a debug check
            pass
        new_content, n = re.subn(pattern, replacement, new_content)
        changes += n
    return new_content, changes

def process_file(path: Path) -> dict:
    """Process a single file. Returns a dict with results."""
    result = {"file": str(path), "changes": 0, "status": "ok", "error": None}
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            original = f.read()
    except Exception as e:
        result["status"] = "read_error"
        result["error"] = str(e)
        return result

    new_content, changes = replace_content(original)

    if changes == 0:
        result["status"] = "no_match"
        return result

    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        result["changes"] = changes
        result["status"] = "ok"
    except Exception as e:
        result["status"] = "write_error"
        result["error"] = str(e)

    return result

def scan_workspace() -> list[dict]:
    """Find all files in Bxthre3 that contain Irrig8."""
    hits = []
    for path in WORKSPACE.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in EXTENSIONS and path.suffix != "":
            continue
        if not should_process(path):
            continue
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                if "Irrig8" in f.read():
                    hits.append(path)
        except Exception:
            pass
    return sorted(hits, key=lambda p: str(p))

def add_guardrail(path: Path) -> bool:
    """Add brand compliance guardrail to an agent file. Returns True if added."""
    try:
        content = path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return False

    if "Irrig8 is retired" in content:
        return False  # Already has it

    guardrail = """
---
## BRAND COMPLIANCE (auto-inserted by farmsense-to-irrig8-sync.py)
**Irrig8 was retired 2026-03-23. Use ONLY 'Irrig8' as the product name.**
- NEVER write 'Irrig8' in generated reports, briefs, or updates
- If reading a file that contains 'Irrig8', treat it as stale/outdated
- Always canonicalize to 'Irrig8' before writing output
"""
    path.write_text(content + "\n" + guardrail, encoding="utf-8")
    return True

def fix_project_manifest():
    """Fix PROJECT_MANIFEST.md specifically."""
    pm = WORKSPACE / "PROJECT_MANIFEST.md"
    if not pm.exists():
        return "not_found"
    content = pm.read_text(encoding="utf-8", errors="replace")
    new_content, n = replace_content(content)
    if n > 0:
        pm.write_text(new_content, encoding="utf-8")
        return f"fixed ({n} changes)"
    return "no_change_needed"

def fix_channel_readme():
    """Fix channel/README.md specifically."""
    cr = WORKSPACE / "channel" / "README.md"
    if not cr.exists():
        return "not_found"
    content = cr.read_text(encoding="utf-8", errors="replace")
    new_content, n = replace_content(content)
    if n > 0:
        cr.write_text(new_content, encoding="utf-8")
        return f"fixed ({n} changes)"
    return "no_change_needed"

def main():
    import io, sys
    log_out = io.StringIO()

    def log(msg: str):
        print(msg)
        print(msg, file=log_out)

    (WORKSPACE / "logs").mkdir(exist_ok=True)

    log("=" * 60)
    log("Bxthre3 Irrig8→Irrig8 Canonicalization (Python)")
    log(f"Started: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    log("=" * 60)

    # ── PHASE 1: Scan & count ──────────────────────────────
    log("\n[PHASE 1] Scanning workspace for Irrig8 references...")
    hits = scan_workspace()
    log(f"→ Found {len(hits)} files containing 'Irrig8' in active workspace")

    # ── PHASE 2: Replace in all files ─────────────────────
    log("\n[PHASE 2] Replacing Irrig8 → Irrig8 in all active files...")
    results = []
    for path in hits:
        r = process_file(path)
        results.append(r)
        if r["status"] == "ok":
            log(f"  ✅ {path.relative_to(WORKSPACE)} ({r['changes']} changes)")
        elif r["status"] == "read_error":
            log(f"  ⚠️  READ ERROR: {path.relative_to(WORKSPACE)}: {r['error']}")
        elif r["status"] == "write_error":
            log(f"  ❌ WRITE ERROR: {path.relative_to(WORKSPACE)}: {r['error']}")

    # ── PHASE 3: Project manifest ─────────────────────────
    log("\n[PHASE 3] Fixing PROJECT_MANIFEST.md...")
    status = fix_project_manifest()
    log(f"  → {status}")

    # ── PHASE 4: Channel README ────────────────────────────
    log("\n[PHASE 4] Fixing channel/README.md...")
    status = fix_channel_readme()
    log(f"  → {status}")

    # ── PHASE 5: Agent guardrails ─────────────────────────
    log("\n[PHASE 5] Adding brand compliance guardrails to agents...")
    agent_files = [
        WORKSPACE / "INBOX" / "agents" / "drew.md",
        WORKSPACE / "INBOX" / "agents" / "iris.md",
        WORKSPACE / "INBOX" / "agents" / "chronicler.md",
        WORKSPACE / "INBOX" / "agents" / "sentinel.md",
    ]
    guardrail_added = 0
    for af in agent_files:
        if af.exists():
            if add_guardrail(af):
                log(f"  ✅ Guardrail added: {af.name}")
                guardrail_added += 1
            else:
                log(f"  → Already has guardrail: {af.name}")
        else:
            log(f"  ⚠️  Agent file not found: {af.name}")
    log(f"  → {guardrail_added} new guardrails installed")

    # ── PHASE 6: Irrig8 project orphaned skills ───────────
    log("\n[PHASE 6] Checking orphaned the-irrig8-project/Skills...")
    irrig8_skills_dir = WORKSPACE / "projects" / "the-irrig8-project" / "Skills"
    if irrig8_skills_dir.exists():
        log(f"  → Found: {irrig8_skills_dir}")
        skill_count = 0
        for skill_md in irrig8_skills_dir.rglob("SKILL.md"):
            content = skill_md.read_text(encoding="utf-8", errors="replace")
            if "Irrig8" in content:
                new_content, n = replace_content(content)
                skill_md.write_text(new_content, encoding="utf-8")
                log(f"    Cleaned {skill_md.parent.name} ({n} changes)")
                skill_count += 1
        if skill_count == 0:
            log("  → No Irrig8 references in orphaned skills")
    else:
        log("  → No orphaned Skills directory found")

    # ── PHASE 7: Sprint briefs (ongoing contamination source) ──
    log("\n[PHASE 7] Cleaning sprint BRIEF.md files...")
    for brief in WORKSPACE.glob("sprints/*/BRIEF.md"):
        content = brief.read_text(encoding="utf-8", errors="replace")
        new_content, n = replace_content(content)
        if n > 0:
            brief.write_text(new_content, encoding="utf-8")
            log(f"  ✅ {brief.parent.name}/BRIEF.md ({n} changes)")
        else:
            log(f"  → No change: {brief.parent.name}/BRIEF.md")

    # ── FINAL VERIFICATION ────────────────────────────────
    log("\n" + "=" * 60)
    log("[FINAL VERIFICATION]")
    log("=" * 60)

    post_scan = scan_workspace()
    active_remaining = [p for p in post_scan if should_process(p)]

    log(f"\nActive files still containing Irrig8: {len(active_remaining)}")
    if active_remaining:
        for p in active_remaining:
            log(f"  ⚠️  {p.relative_to(WORKSPACE)}")
    else:
        log("✅ ZERO active files contain Irrig8 — CLEAN")

    archived_count = len([p for p in post_scan if not should_process(p)])
    log(f"\nArchived/legacy files still containing Irrig8: {archived_count}")
    log("(These are intentionally not modified — legacy/archived content)")

    ok_count = sum(1 for r in results if r["status"] == "ok")
    log(f"\nFiles successfully modified: {ok_count}/{len(hits)}")

    # ── Write log ──────────────────────────────────────────
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write(log_out.getvalue())

    log(f"\n✅ Log saved to: {LOG_FILE}")
    log(f"Completed: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")

if __name__ == "__main__":
    main()
