#!/usr/bin/env python3
"""Generate all 17 BX3 papers using parallel /zo/ask API calls."""
import os
import subprocess
import json
import time

MODEL = "vercel:minimax/minimax-m2.7"
ENDPOINT = "https://api.zo.computer/zo/ask"
TOKEN = os.environ.get("ZO_CLIENT_IDENTITY_TOKEN", "")

papers = [
    # (paper_num, title, arxiv_class, keywords_extra, existing_tex, expand_or_new)
    ("01", "The BX3 Framework: A Universal Architecture of Functional Roles", "cs.AI", "universal architecture, functional layers, actor-agnostic", "paper01-final.tex", "expand"),
    ("02", "Truth Gate: Deterministic Factual Enforcement in Autonomous Systems", "cs.AI", "hallucination prevention, factual enforcement, zero-escape", "paper02-truth-gate.tex", "expand"),
    ("03", "Sandbox Execution Model: Bounded Operational Environments for Autonomous Agents", "cs.AI", "sandbox, bounded execution, digital twin validation, agentic systems", "paper03-sandbox.tex", "expand"),
    ("04", "Bailout Protocol: Mandatory Human Accountability in Multi-Agent Systems", "cs.AI", "human accountability, mandatory escalation, multi-agent systems, unresolved anomaly", "paper04-bailout.tex", "expand"),
    ("05", "Forensic Ledger: Nine-Plane Tamper-Evident Operational State Architecture", "cs.SE", "forensic logging, tamper-evident, nine-plane, audit trail", "paper05-forensic-ledger.tex", "expand"),
    ("06", "Reality Vector: A 10-Dimensional Environmental State Model for Autonomous Systems", "cs.ET", "environmental modeling, 10-dimensional state, autonomous systems, spatial reasoning", "paper06-reality-vector.tex", "expand"),
    ("07", "Recursive Spawning with Immutable Parent Pointers: Preventing Autonomous Drift", "cs.MA", "recursive spawning, parent pointers, autonomous drift, distributed systems", "paper07-recursive-spawning.tex", "expand"),
    ("08", "Self-Modification Engine: Bounded Evolution Without Determinism Collapse", "cs.AI", "self-modification, bounded evolution, immutable core, Darwin-Gödel cycle", "paper08-self-modification-engine.tex", "expand"),
    ("09", "10-Point Vector: A Complete Taxonomy of Autonomous Action", "cs.AI", "autonomous action taxonomy, decision taxonomy, action classification", "paper09-10-point-vector.tex", "new"),
    ("10", "Z-Axis Indexing: Spatial-Context Aware Resource Allocation", "cs.ET", "spatial indexing, resource allocation, geographic information, precision agriculture", "paper10-z-axis-indexing.tex", "new"),
    ("11", "4-Tier EAN: Deterministic Resolution-Gated Data Architecture", "cs.CR", "data architecture, resolution gates, deterministic storage, information hierarchy", "paper11-4-tier-ean.tex", "new"),
    ("12", "9-Plane DAP: Complete Operational State Architecture", "cs.SE", "operational state, data architecture plane, system state management", "paper12-9-plane-dap.tex", "new"),
    ("13", "SHA-256 Forensic Sealing: Immutable Event Integrity for Autonomous Operations", "cs.CR", "SHA-256, cryptographic sealing, event integrity, immutable audit", "paper13-sha256-sealing.tex", "new"),
    ("14", "Cascading Triggers: Self-Propagating Exception Escalation for Autonomous Systems", "cs.MA", "cascading triggers, exception escalation, self-propagating, autonomous fault handling", "paper14-cascading-triggers.tex", "new"),
    ("15", "Role Definition Language: A Formal Grammar for Functional Layer Assignment", "cs.SE", "role definition language, formal grammar, functional layer, DSL", "paper15-role-definition-language.tex", "new"),
    ("16", "Enterprise Orchestration: Deterministic Workflow Architecture for AI Governance", "cs.SE", "enterprise orchestration, workflow architecture, AI governance, deterministic process", "paper16-enterprise-orchestration.tex", "new"),
    ("17", "AgentOS: An Operating System Model for Autonomous Agent Hierarchies", "cs.SE", "AgentOS, operating system, agent hierarchy, autonomous computing", "paper17-agentos.tex", "new"),
]

CONTEXT = """
You are writing an academic paper for the BX3 Framework research portfolio.

## BX3 Framework Core Architecture (from Bxthre3/VAULT/):
The BX3 Framework organizes autonomous systems into three immutable functional layers:
1. PURPOSE LAYER: Intent, judgment, accountability (human root mandate)
2. BOUNDS ENGINE: Bounded reasoning, analysis, proposal (limbless — no direct actuator access)
3. FACT LAYER: Deterministic enforcement, hard physical constraint, forensic auditability

Five Named Pillars:
- PILLAR 1: Loop Isolation — prevents logic collisions by architectural separation
- PILLAR 2: Recursive Spawning — distributed local autonomy via Worksheets (child nodes carry immutable parent Purpose pointers)
- PILLAR 3: Sandbox Gate — validates proposals in a digital twin before execution
- PILLAR 4: Spatial Firewall — isolates data planes by architecture
- PILLAR 5: Bailout Protocol — mandatory upstream accountability on all exceptions (bypasses all machine actors, reaches human)

Key Postulates:
- Postulate 1 (Accountability): Every BX3 node N has an accountability actor A(N) that is reachable
- Postulate 2 (Limblessness): The Bounds Engine has no direct access to physical actuators
- Postulate 3 (Determinism): The Fact Layer produces identical outputs for identical inputs

Key Theorems:
- Theorem 1 (Layer Isolation): Logic Collision is architecturally impossible
- Theorem 2 (Upstream Accountability): Any unresolved condition escalates to Human Root in bounded hops

Author: Jeremy Blaine Thompson Beebe, Independent Researcher, ORCID: 0009-0009-2394-9714, bxthre3inc@gmail.com

## Standard Paper Structure (all sections required):
1. Abstract (200-300 words)
2. 1. Introduction (problem, gap, contribution, roadmap)
3. 2. Background and Related Work (4-6 categories with citations)
4. 3. Problem Definition (formal definition, failure modes, math formulation)
5. 4. Proposed Approach/The BX3 Solution (architecture, mechanisms, examples)
6. 5. Implementation (technical components, metrics if available)
7. 6. Evaluation (scenarios, results, comparisons)
8. 7. Discussion (strengths, limitations, implications)
9. 8. Conclusion (summary, significance, future work)
10. References (15-30 citations, IEEE/ACM style)
11. Peer review note: "This paper has not been peer reviewed. Comments and correspondence are welcomed."

First person singular ("I") throughout. Formal academic tone.
Minimum 4500 words of body content (sections 1-8). Target 15-25 pages.

## Bibliography file location:
/home/workspace/Bxthre3/VAULT/papers/tex/bx3framework.bib

## Existing content to build on:
The following papers already have partial drafts — expand them to full academic depth:
- paper02-truth-gate.tex: Truth Gate architecture (no hallucination escapes, Bounds Engine verification)
- paper03-sandbox.tex: Sandbox Gate execution model
- paper04-bailout.tex: Bailout Protocol (23 escalations, 100% human resolution)
- paper05-forensic-ledger.tex: 9-plane forensic ledger
- paper06-reality-vector.tex: 10-dimensional environmental state model
- paper07-recursive-spawning.tex: Recursive spawning with immutable parent pointers
- paper08-self-modification-engine.tex: Self-Modification Engine (Darwin-Gödel cycle, 18% accuracy improvement)

## New papers (09-17) — write from scratch using BX3 architecture:
09. 10-Point Vector: taxonomy of autonomous action dimensions
10. Z-Axis Indexing: spatial-context resource allocation for precision agriculture
11. 4-Tier EAN: resolution-gated data architecture
12. 9-Plane DAP: operational state management
13. SHA-256 Forensic Sealing: cryptographic event integrity
14. Cascading Triggers: self-propagating exception escalation
15. Role Definition Language: formal grammar for functional layer assignment
16. Enterprise Orchestration: deterministic workflow for AI governance
17. AgentOS: operating system model for autonomous agent hierarchies

## Output format:
Write the COMPLETE paper as a Python heredoc. Print ONLY the heredoc to stdout.
Use this format:
print('''
\\documentclass[12pt]{article}
\\usepackage[T1]{fontenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,booktabs,array,enumitem}
\\usepackage{graphicx,float}
\\usepackage[colorlinks=true,linkcolor=blue,citecolor=blue]{hyperref}
\\usepackage{rotating}
\\usepackage{cite}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0.5em}

\\newcommand{\\bxthree}{\\textbf{BX3}}
\\title{TITLE}
\\author{Jeremy Blaine Thompson Beebe\\\\ Bxthre3 Inc. --- bxthre3inc@gmail.com --- ORCID: 0009-0009-2394-9714}
\\date{April 2026}
\\begin{document}
\\maketitle
[full paper content]
\\end{document}
''')
"""

def write_paper(paper_num, title, arxiv_class, keywords_extra, existing_tex, expand_or_new):
    """Generate a single paper via /zo/ask"""
    prompt = f"""{CONTEXT}

Write paper {paper_num}: "{title}"

arxiv class: {arxiv_class}
extra keywords: {keywords_extra}
existing tex: {existing_tex} ({expand_or_new})

For paper 01 (which already has a 22-page final version), write a shorter companion piece (~5 pages) that serves as an accessible introduction/overview suitable for non-specialist audiences. For all other papers, write the complete full academic paper.

Respond with ONLY the Python heredoc containing the complete LaTeX paper.
"""
    
    payload = {
        "input": prompt,
        "model_name": MODEL
    }
    
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", ENDPOINT,
         "-H", f"Authorization: Bearer {TOKEN}",
         "-H", "Content-Type: application/json",
         "-d", json.dumps(payload)],
        capture_output=True, text=True, timeout=300
    )
    
    try:
        data = json.loads(result.stdout)
        return data.get("output", "")
    except:
        return f"ERROR: {result.stdout[:200]}"

def main():
    print(f"Starting parallel paper generation for 17 papers...")
    
    # Process in batches of 4 (rate limit awareness)
    batch_size = 4
    for i in range(0, len(papers), batch_size):
        batch = papers[i:i+batch_size]
        print(f"\n=== Processing batch {i//batch_size + 1}: papers {batch[0][0]} to {batch[-1][0]} ===")
        
        # Launch all in parallel using background jobs
        processes = []
        for paper_num, title, arxiv_class, kw, existing, expand_new in batch:
            out_file = f"/tmp/paper_{paper_num}_output.txt"
            err_file = f"/tmp/paper_{paper_num}_error.txt"
            
            prompt = f"""{CONTEXT}

Write paper {paper_num}: "{title}"

arxiv class: {arxiv_class}
extra keywords: {kw}
existing tex: {existing} ({expand_new})

For paper 01: write a 5-page accessible companion/overview piece (not the full academic paper).
For all other papers: write the complete full academic paper (15-25 pages, 4500+ words body).

IMPORTANT: Respond with ONLY a Python heredoc. The heredoc must be the ENTIRE output — no commentary, no explanations, nothing before or after.
Format:
print('''[complete LaTeX paper]''')
"""
            
            # Save prompt to temp file
            prompt_file = f"/tmp/paper_{paper_num}_prompt.txt"
            with open(prompt_file, 'w') as f:
                f.write(prompt)
            
            # Run as background process
            cmd = f'''curl -s -X POST "{ENDPOINT}" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d @"{prompt_file}" > /tmp/paper_{paper_num}_response.json 2>&1'''
            
            # Use nohup and background
            subprocess.Popen(f"cd /home/workspace/Bxthre3/VAULT/papers/tex && nohup bash -c 'response=$(cat /tmp/paper_{paper_num}_response.json); echo \"$response\" | python3 -c \"import sys,json; d=json.load(sys.stdin); print(d.get(\\\"output\\\",\\\"ERROR\\\"))\" > /tmp/paper_{paper_num}_output.txt' &", shell=True)
            processes.append((paper_num, existing))
        
        # Wait for all to complete
        time.sleep(15)
        
        # Process results
        for paper_num, existing in processes:
            resp_file = f"/tmp/paper_{paper_num}_response.json"
            out_file = f"/tmp/paper_{paper_num}_output.txt"
            
            if os.path.exists(resp_file):
                try:
                    with open(resp_file) as f:
                        data = json.load(f)
                    output = data.get("output", "")
                    if output and len(output) > 500:
                        # Write to tex file
                        tex_file = f"/home/workspace/Bxthre3/VAULT/papers/tex/{existing}"
                        with open(tex_file.replace('.tex', '_full.tex'), 'w') as f:
                            f.write(output)
                        print(f"  Paper {paper_num}: Got {len(output)} chars output")
                    else:
                        print(f"  Paper {paper_num}: Output too short ({len(output) if output else 0} chars)")
                except Exception as e:
                    print(f"  Paper {paper_num}: Error - {e}")
            else:
                print(f"  Paper {paper_num}: No response file yet")

if __name__ == "__main__":
    main()
