# arXiv Upload Checklist — BX3 Framework Series
**Canonical Path:** `Bxthre3/VAULT/papers/ARXIV-UPLOAD-CHECKLIST.md`
**Status:** Ready to use
**Date:** 2026-04-24

---

## Before Uploading — Verify Each Paper

For each paper, confirm:

- [ ] Paper compiles without errors (`pdflatex` → PDF clean)
- [ ] All citations trace to real sources (no `[VERIFY]` markers in claims)
- [ ] Abstract is complete and compelling (1 paragraph, no jargon)
- [ ] Author metadata correct: Jeremy Blaine Thompson Beebe, ORCID: 0009-0009-2394-9714, bxthre3inc@gmail.com
- [ ] No arXiv.org or cs.ai remnants anywhere in PDF
- [ ] DOI of companion Zenodo paper cited (if applicable)
- [ ] No placeholder text (TODO, FIXME, coming soon, TBD)
- [ ] Correct arXiv classification (see below)

---

## arXiv Classification Guide

| Paper | arXiv Class |
|---|---|
| 01 — BX3 Framework | cs.AI |
| 02 — Truth Gate | cs.AI |
| 03 — Sandbox Execution Model | cs.AI |
| 04 — Bailout Protocol | cs.AI |
| 05 — Forensic Ledger | cs.SE |
| 06 — Reality Vector | cs.ET |
| 07 — Recursive Spawning | cs.MA |
| 08 — Self-Modification Engine | cs.AI |
| 09 — LLM Proxy Routing | cs.AI |
| 10 — LLM Sandbox | cs.SE |
| 11 — Context Puppetry | cs.AI |
| 12 — Token Bomb | cs.ET |
| 13 — Adversarial Deception Detection | cs.CR |
| 14 — Memory Poisoning Defense | cs.CR |
| 15 — Deterministic Learning | cs.AI |
| 16 — Human-in-the-Loop Oversight | cs.AI |
| 17 — AgentOS | cs.SE |

---

## Submission Order

| Step | Paper | arXiv Class | Action |
|---|---|---|---|
| 1 | 01 — BX3 Framework | cs.AI | Submit first — foundation |
| 2 | 02 — Truth Gate | cs.AI | Submit second |
| 3 | 03 — Sandbox Execution Model | cs.AI | Submit third |
| 4 | 04 — Bailout Protocol | cs.AI | After P01-P03 public |
| 5 | 08 — Self-Modification Engine | cs.AI | After P01-P03 public |

---

## arXiv Submission URL
https://arxiv.org/submit

## What to Do on arXiv

1. Sign in at https://arxiv.org/auth
2. Click "Submit"
3. Select "Submit manuscript"
4. Upload `.tex` file + all `.bst` / `.cls` / bibliography files
5. Select primary classification
6. Fill metadata:
   - **Title:** Exact title from `.tex` file
   - **Authors:** Jeremy Blaine Thompson Beebe
   - **ORCID:** 0009-0009-2394-9714
   - **Abstract:** Copy from `.tex` abstract
   - **Comments:** (optional) "20 pages, 4 figures"
   - **MSC/SLACS Codes:** Leave blank
   - **Journal Reference:** Leave blank
   - **DOI:** Leave blank OR enter Zenodo DOI if you want to link
7. Preview → Submit

---

## Post-Submission Checklist

After arXiv acceptance:

- [ ] Note arXiv ID (e.g., `2401.XXXXX`)
- [ ] Update `PAPER_INVENTORY.md` with arXiv ID
- [ ] Update `bx3framework.bib` to add arXiv DOI entry
- [ ] Link arXiv paper in VAULT publications index

---

## Files Ready for Upload

| Paper | Tex File | Bib File | Compile Status |
|---|---|---|---|
| P01 | `tex/paper01-bx3-framework.tex` | `tex/bx3framework.bib` | ✅ Clean |
| P02 | `tex/paper02-truth-gate.tex` | `tex/bx3framework.bib` | ✅ Clean |
| P03 | `tex/paper03-sandbox.tex` | `tex/bx3framework.bib` | ✅ Clean |
| P04 | `tex/paper04-bailout.tex` | `tex/bx3framework.bib` | ⏳ Needs compile |
| P08 | `tex/paper08-self-modification-engine.tex` | `tex/bx3framework.bib` | ⏳ Needs compile |

---

*Author: Jeremy Blaine Thompson Beebe | ORCID: 0009-0009-2394-9714*
