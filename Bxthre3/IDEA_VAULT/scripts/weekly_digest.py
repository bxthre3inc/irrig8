#!/usr/bin/env python3
"""Weekly IDEA_VAULT Digest — Pattern Matching for Idea Reuse."""
import os
import json
import sys
import subprocess
from datetime import datetime

VAULT_DIR = "/home/workspace/Bxthre3/IDEA_VAULT"
BACKUP_DIR = f"{VAULT_DIR}/backup"

def get_unused_concepts():
    """Scan archived ideas for reusable patterns."""
    archived = f"{VAULT_DIR}/archived"
    if not os.path.exists(archived):
        print(f"[DIGEST] No archived ideas found at {archived}")
        return []
    
    concepts = []
    for f in os.listdir(archived):
        if f.endswith('.json'):
            with open(f"{archived}/{f}") as file:
                data = json.load(file)
                if data.get('status') == 'unused':
                    concepts.append({
                        'id': data.get('id'),
                        'problem': data.get('problem'),
                        'value': data.get('estimated_value', 0),
                        'created': data.get('created_at')
                    })
    return concepts

def find_matching_projects(concepts):
    """Pattern match: search current active projects for similar problems."""
    active_dir = f"{VAULT_DIR}/active"
    matches = []
    
    for concept in concepts:
        # Simple keyword match (in production: use embeddings)
        keywords = concept['problem'].lower().split()[:3]
        
        # Check active projects
        if os.path.exists(active_dir):
            for f in os.listdir(active_dir):
                if f.endswith('.md'):
                    with open(f"{active_dir}/{f}") as file:
                        content = file.read().lower()
                        if any(kw in content for kw in keywords):
                            matches.append({
                                'concept_id': concept['id'],
                                'concept_problem': concept['problem'],
                                'project': f,
                                'potential_reuse': True
                            })
    return matches

def generate_digest():
    """Generate weekly report of reusable concepts."""
    print("[DIGEST] Scanning IDEA_VAULT for reusable concepts...")
    
    concepts = get_unused_concepts()
    if not concepts:
        print("[DIGEST] No unused concepts found.")
        return
    
    print(f"[DIGEST] Found {len(concepts)} unused concepts")
    
    matches = find_matching_projects(concepts)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    digest_file = f"{VAULT_DIR}/weekly_digest_{timestamp}.md"
    
    with open(digest_file, 'w') as f:
        f.write("# Weekly IDEA_VAULT Digest\n\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n\n")
        
        f.write("## Unused Concepts\n")
        for c in concepts:
            f.write(f"- **{c['id']}**: {c['problem'][:60]}...\n")
            f.write(f"  - Potential value: ${c['value']:,}\n")
            f.write(f"  - Archived: {c['created']}\n\n")
        
        f.write(f"\n## Pattern Matches ({len(matches)} found)\n")
        for m in matches:
            f.write(f"- `{m['concept_id']}` → Project `{m['project']}`\n")
        
        f.write("\n---\n")
        f.write("Action: Review `archived/` and run repurpose script if match found.\n")
    
    print(f"[DIGEST] Written to: {digest_file}")
    return digest_file

if __name__ == '__main__':
    if '--init' in sys.argv:
        os.makedirs(f"{VAULT_DIR}/archived", exist_ok=True)
        os.makedirs(f"{VAULT_DIR}/active", exist_ok=True)
        os.makedirs(f"{VAULT_DIR}/repurposed", exist_ok=True)
        print(f"[DIGEST] Initialized IDEA_VAULT directories")
    else:
        generate_digest()
