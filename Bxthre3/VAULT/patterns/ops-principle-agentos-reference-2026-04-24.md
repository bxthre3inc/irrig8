# OPERATIONAL PRINCIPLE — Captured 2026-04-24

**Pattern:** All papers needing simulations, validation studies, or empirical examples must reference AgentOS (not Irrig8, not field trials, not San Luis Valley).

**Context:** When finalizing the BX3 Framework arXiv submission and planning the broader 8-paper publication portfolio, brodiblanco made a clear canonical product reference decision: AgentOS is the reference implementation for empirical validation across all research publications.

**Indicates preference for:** publication-strategy, product-naming-canonical, research-ip-alignment

---

## Source

User message: "all papers needing sims, validation or examples should reference bx3 all papers needing sims, validation or examples should reference AgentOS"

**Related:** The BX3 Framework v1.0 (`Bxthre3/VAULT/arxiv-upload/bx3_framework.tex`) is already clean of field trial references. Irrig8 references should remain in Irrig8-specific docs only.

---

## Canonical Reference Guide

| For... | Use | Notes |
|--------|-----|-------|
| Simulations, validation, empirical examples | **AgentOS** | The Bxthre3 agentic runtime reference implementation |
| Farming-specific OS, sensor integration | **Irrig8** | Bxthre3's agricultural operating system (retired: FarmSense) |
| Framework/theory papers | BX3 Framework | No product reference needed |
| Engineering specifications | BX3 Protocol | No product reference needed |
| Agentic architecture | AgentOS | Preferred over "Agentic" in formal docs |

---

## Notes

- This supersedes any earlier draft language that referenced "field trials" or "San Luis Valley" as validation evidence
- Irrig8 can be cited as a *deployment context* for the framework, but empirical validation claims should use AgentOS
- The AgentOS codebase (`Bxthre3/agentic/`, `Bxthre3/projects/the-agentic-project/src/`) is the canonical reference for reproducibility