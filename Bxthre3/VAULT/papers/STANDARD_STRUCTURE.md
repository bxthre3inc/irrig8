# BX3 Paper Standard — Author Guide

**Author:** Jeremy Blaine Thompson Beebe  
**Institution:** Independent Researcher  
**ORCID:** 0009-0009-2394-9714  
**Contact:** bxthre3inc@gmail.com  
**Papers:** 17-paper portfolio on Zenodo + arXiv

---

## Required Sections (All Papers)

### Abstract (200–300 words)
- Problem statement (1 sentence)
- Gap in current approaches (1 sentence)  
- Novel contribution (1–2 sentences)
- Key mechanism/how it works (1–2 sentences)
- Empirical or deployment proof (1 sentence)
- Impact statement (1 sentence)

### 1. Introduction (1000–1500 words)
- Context: why this problem is urgent and unsolved
- Taxonomy of current approaches and their specific failures
- The gap this paper fills
- The core insight (the "aha")
- Roadmap of the paper

### 2. Background and Related Work (1500–2000 words)
- 4–6 prior work categories
- Each category: what exists, specific limitation, citation
- Formal citations throughout body (not just bibliography)
- End with a clear "Prior work has not..." gap statement

### 3. Problem Definition (800–1200 words)
- Formal definition of the problem
- Specific failure modes with concrete examples
- Mathematical formulation where applicable
- Scope and assumptions clearly stated

### 4. Proposed Approach / The BX3 Solution (2000–3000 words)
- Core architecture with diagram
- Each sub-component described in detail
- Step-by-step mechanism walkthrough with examples
- Key innovations highlighted
- Comparison to prior approaches from Section 2

### 5. Implementation (1200–1800 words)
- How it was built and deployed
- Specific technical components
- Code snippets where relevant
- Live system metrics if applicable (AgentOS deployment)

### 6. Evaluation (1200–1800 words)
- Test scenarios with specific results
- Before/after comparisons with numbers
- Failure mode analysis
- Edge cases and limitations

### 7. Discussion (800–1200 words)
- Strengths and contributions
- Specific limitations and future work
- Implications for the field
- How this changes practice

### 8. Conclusion (300–500 words)
- Summary of contribution
- Significance statement
- Future roadmap

### References (15–30 citations minimum)
- Full IEEE/ACM style
- Mix of: foundational papers, recent work (2023+), domain-specific

### Appendices (optional)
- Extended proofs
- Additional data
- Implementation details

---

## Metadata Requirements

**Author block:**
```
Jeremy Blaine Thompson Beebe
Independent Researcher
ORCID: 0009-0009-2394-9714
Email: bxthre3inc@gmail.com
```

**Keywords (all papers):** BX3 Framework, Purpose Layer, Bounds Engine, Fact Layer, autonomous systems, human-in-the-loop, deterministic systems, AI governance

**Additional keywords by domain:**
- cs.AI papers: + artificial intelligence, agentic systems, autonomous systems
- cs.SE papers: + software architecture, formal verification
- cs.ET papers: + precision agriculture, irrigation, IoT
- cs.MA papers: + multi-agent systems, orchestration
- cs.CR papers: + security, cryptography

---

## Style Requirements

- First person singular ("I") throughout
- Formal academic tone
- Active voice preferred
- Define all acronyms on first use
- Include citations in body text, not just bibliography
- Peer review note: *"This paper has not been peer reviewed. Comments and correspondence are welcomed."*
- Acknowledgments section: thank research community
- Appendices: use only when necessary

---

## Page Targets by Paper Tier

| Tier | Papers | Target pages |
|------|--------|-------------|
| Tier 1 (Foundational) | 1, 2, 3 | 20–25 pages |
| Tier 2 (Core Protocols) | 4–11 | 15–20 pages |
| Tier 3 (Applied) | 12–17 | 15–20 pages |

---

## Submission Targets

1. **Zenodo** — primary, immediate upload
2. **arXiv** — after 3+ papers live with citations, apply for endorsement

Both receive identical PDFs. Zenodo provides DOI immediately. arXiv provides citability and community discovery.

---

## Version Control

- `paperXX-name-v1.tex` — initial draft
- `paperXX-name-v2.tex` — extended/final draft
- `paperXX-name-final.tex` — approved for submission
- Keep all versions for audit trail

---

*Last updated: 2026-04-23*
