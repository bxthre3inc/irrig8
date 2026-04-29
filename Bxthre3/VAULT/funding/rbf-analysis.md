# RBF-AGENT: Revenue-Based Financing Analysis
**Date:** 2026-04-27
**Agent:** RBF-AGENT
**Status:** P2 — Current (Build-A-Biz Blue Ocean Pass; RBF Stays Parallel Track)
**File:** `file 'Bxthre3/VAULT/funding/rbf-analysis.md'`

---

## 2026-04-28 Update (09:10 UTC)

**No change to recommendation.** The fundamental problem is unchanged:
- **Runway: ~1 week** (cash ~$130K, burn ~$130K/week)
- **No confirmed MRR** — RBF qualification remains **[VERIFY — BLOCKING]**
- **VPC is transactional** — does not qualify for standard RBF
- **Irrig8 has zero commercial customers** — no revenue base to report

**Pipeline state (per revenue-ops.md 2026-04-27):**
- Sage deal: $2,500 cash — verbal, unconfirmed (23+ days stale)
- Danny Romero: no response (10+ days)
- CIG Colorado LOI: submitted, amount unconfirmed
- Build-A-Biz LLC: 109 leads, $0 tracked, no pricing

**Action:** Equity/SAFE bridge remains the ONLY path to survive the next 30 days. RBF is a parallel track for post-revenue future raise.

---

## 2026-04-27 Update (from revenue-ops.md 2026-04-27)

**Status unchanged** — analysis already captured the critical facts:
- Cash on hand: ~$130K | Burn: ~$130K/week | Runway: ~1 week
- Bridge gap: $387,500 of $400K target
- Active deals (Sage + Danny Romero): $12,500 total — 3.1% of bridge target

---

## Executive Summary

Bxthre3 needs a **$400K bridge by July 1, 2026**. Revenue-Based Financing (RBF) is a viable non-dilutive option **if revenue exists and qualifies**.
**Critical context from INBOX.md (2026-04-24):**
- Cash on hand: **~$130K**
- Burn rate: **~$130K/week**
- Runway: **~1 week** ⚠️ CRITICAL
- Bridge gap: **$387,500** of $400K target
- Active deals (Sage + Danny Romero): **$12,500 total** — 3.1% of bridge target

**2026-04-26 Update:**
- `sage.vpc.deal.closed` event fired via Cascade Backstop (04-26, 14:55 UTC) ✅
- `cig.colorado.loi.submitted` event fired via Cascade Backstop (04-26, 14:55 UTC) ✅
- **Both events confirmed FIRES — awaiting Atlas/Maya confirmation of deal details (cash in hand? LOI amount?)**
- No confirmed MRR data found. RBF qualification remains **[VERIFY — BLOCKING]**

---

## 1. RBF Provider Landscape (Ag-Tech/SaaS)

### Tier 1 — Direct RBF Fit

| Provider | Focus | RBF Range | Min MRR | Time in Business | Fit for Irrig8 |
|----------|-------|-----------|---------|------------------|----------------|
| **Capchase** (acquired Vartana 2025) | B2B SaaS, Ag-Tech | $100K–$5M | ~$10K | 6+ months | ★★★★★ Best fit — AI-powered B2B ag-tech credit underwriting |
| **Pipe** | SaaS, Recurring Revenue | $50K–$10M | ~$10K | 6+ months | ★★★★ Strong — integrates with SaaS billing platforms |
| **Clearco** | E-commerce + SaaS | $10K–$5M | ~$10K | 3–6 months | ★★★ Fast (24–72hr), founder-friendly |
| **River SaaS Capital** | SaaS (US-focused) | $500K–$5M | ~$25K | 12+ months | ★★ US-based; higher MRR threshold |
| **Ratio** | SaaS, Recurring Revenue | $100K–$2M | ~$15K | 6+ months | ★ Contract-backed BNPL for SaaS |

### Ag-Tech Specific — Capchase/Vartana

Capchase acquired Vartana in 2025 specifically to build AI-driven credit underwriting for B2B SaaS and ag-tech sales cycles. Their model verifies recurring revenue from enterprise sales contracts — directly applicable to Irrig8's sales motion. Target: $400K at ≤2.5x factor.

### Tier 2 — Alternative / Smaller

| Provider | Focus | Notes |
|----------|-------|-------|
| **Fundbox** | SMB Working Capital | Credit line model; up to $150K; not pure RBF |
| **Financefair** (EU) | Revenue Generating Tech | Ireland/UK/EU; invoice + RBF hybrid |
| **Xplor Capital** | SaaS-Embedded | Embedded in software; newer entrant |
| **Propulsion Funding** | US Business Loans | Advances $10K–$1M; factor rates 1.12–1.42 [^1] |

### Market Context (2026)

- RBF market growing at **13.18% CAGR** (2025–2035) driven by demand for flexible funding [^2]
- Non-dilutive funding is increasingly critical for ag-tech: USDA grants, innovation funds, and RBF alternatives are key capital sources for early-stage ag-tech [^3]
- Ag-tech VC rebounded in 2026 with AI-driven precision agriculture SaaS receiving increased investor focus [^4]

### New Opportunity — Build-A-Biz LLC (BUILDBZ)

**Blue Ocean grading result (2026-04-27):** BUILDBZ passed at **3.8/5.0** (≥3.5 threshold met).

**RBF relevance:** BUILDBZ packages VPC's sweepstakes compliance-by-design playbook as a SaaS product for food/bev CPG brands entering cash prize promotions. If BUILDBZ executes:
- Recurring SaaS revenue stream (compliance subscriptions at $2K–$10K/brand)
- High gross margin, geographic moat (Colorado regulatory complexity)
- RBF eligibility improves as MRR scales from B2B brand subscriptions

**Action:** When BUILDBZ signs first 3 pilot brand agreements, RBF application for BUILDBZ entity becomes viable. Monitor BUILDBZ pipeline (109 leads in queue). Track: `file 'Bxthre3/VAULT/funding/rbf-analysis.md'`

---

## 2. Qualification Assessment

### Standard RBF Thresholds

| Criterion | Typical Requirement | Bxthre3 Status |
|-----------|--------------------|----------------|
| Monthly Revenue | $10K–$25K MRR | **[VERIFY — NO CONFIRMED MRR DATA]** |
| Time in Business | 6–12 months | **[VERIFY]** |
| Credit Score | 680+ (personal or business) | **[VERIFY]** |
| Revenue Type | Predictable, recurring | **Likely YES** — Irrig8 SaaS subscription model |
| Industry Fit | SaaS, Ag-Tech, B2B | **YES** — Irrig8 is Ag-Tech SaaS |

### Revenue Math for $400K RBF

| Model | Calculation | MRR Needed |
|-------|------------|------------|
| Advance: 10–20% of ARR | $400K ÷ 0.15 = ~$2.7M ARR | ~$225K MRR |
| Revenue-share: 3x return, 10% share | $1.2M total ÷ 10% ÷ 12 months | ~$25K MRR |
| Revenue-share: 2.5x return, 8% share | $1.0M total ÷ 8% ÷ 12 months | ~$25K MRR |

**Minimum viable MRR for $400K RBF: ~$25,000/month**

### VPC / Gaming Revenue Assessment

- VPC (Valley Players Club) is a **sweepstakes gaming operation** — revenue is transactional and variable
- RBF providers prefer predictable SaaS-style recurring revenue (subscriptions, contracts)
- VPC revenue likely **does not qualify** for standard RBF under most providers' models
- Entity with SaaS revenue (Irrig8 or Bxthre3) required for full RBF access

**Sage VPC deal closed (event fired 04-26):** If $2,500 cash is in hand, this confirms VPC is generating transactional revenue — still likely ineligible for pure RBF but may support a revenue-advance or merchant-cash-advance style product.

---

## 3. RBF vs Equity: Terms Comparison

### RBF Terms (Typical 2025–2026)

| Term | Typical Range |
|------|---------------|
| Advance amount | $100K–$5M |
| Factor / return multiplier | 1.5x–3.0x total repayment |
| Revenue share | 5%–15% of monthly revenue |
| Repayment period | 12–36 months |
| Time to funding | 24 hours–2 weeks |
| Equity dilution | **None** |
| Personal guarantee | Often required |
| Board seats | None |
| Reporting | Monthly revenue verification |

**Example:** $400K at 2.5x factor = $1M total repayment over 18 months
- If MRR = $25K and revenue-share = 10% → $2,500/month repayment
- Full repayment capped at 3x = 30 months max

### Equity Terms (Comparable Raise)

| Term | Typical Range |
|------|---------------|
| Pre-money valuation | $2M–$5M (early stage) |
| Raise amount | $250K–$750K |
| Equity given | 10%–25% (at seed) |
| Dilution impact | **Permanent** |
| Time to funding | 2–4 months |
| Board seats | Often 1 observer seat |
| Ongoing obligations | Quarterly reporting, board meetings |

**Example:** $400K raise at $3M pre-money
- SAFE (no cap, no discount): 0% dilution until conversion
- Convertible note at $5M cap: ~8% dilution at conversion
- Priced round at $3M: 13.3% dilution

### RBF vs Equity: Decision Matrix

| Scenario | MRR | Recommended Path |
|----------|-----|-----------------|
| Strong RBF eligible | ≥$25K stable | **RBF primary** — non-dilutive, fast |
| Moderate RBF eligible | $10K–$25K | **RBF + smaller equity** — $200K RBF + $200K equity |
| RBF ineligible | <$10K | **Equity or grant** — RBF unavailable at $400K scale |
| Cash-strapped, no revenue | Unknown | **Equity/SAFE bridge** — no repayment capacity |

### The Core Problem for Bxthre3

With ~$130K/week burn and **no confirmed revenue**:
- RBF applications take 1–2 weeks minimum to underwrite
- RBF providers require 3–6 months of revenue history
- $400K RBF requires $25K+ MRR (far above current if pre-revenue)
- **RBF cannot save a 1-week runway alone**

**Recommended path:** Equity/SAFE bridge now → RBF application when MRR is confirmed ≥$25K

---

## 4. Recommended Action Plan

### Immediate (Next 7 Days) — Critical Runway

1. **Equity bridge — immediate priority**
   - With $130K/week burn, RBF cannot close fast enough
   - Target $200K–$400K SAFE/convertible note from F&F network
   - F&F targets: David/ Jerry/ Andrew/ Keegan Beebe, Fabian Gomez, Jonathan Montes, Jennifer Salazar
   - Time to close: 1–3 weeks

2. **RBF application — parallel track**
   - Prepare revenue documentation (Stripe, bank statements, contracts)
   - Apply to Capchase/Vartana when MRR data is available
   - Target $400K RBF as top-up once MRR ≥ $25K is confirmed

3. **Grants as non-dilutive complement** — **PRIORITY THIS WEEK**
   - CIG Colorado (April 30, ~4 days away) — $100K+
   - ARPA-E OPEN 2026 (May 1, ~5 days away) — $350K+
   - USDA SBIR Phase I (April 30) — $180K
   - Combined opportunity: $500K+

### RBF Application (If MRR ≥ $25K Confirmed)

1. **Capchase/Vartana** — primary target
   - Apply with 3 months bank statements + revenue data
   - Best ag-tech fit; AI-powered fast underwriting
   - Target: $400K at ≤2.5x factor

2. **Pipe** — secondary target
   - If SaaS billing is Stripe-connected, verification is automated
   - Target: $200K–$500K

3. **Clearco** — fallback for smaller bridge
   - Fastest decision (24–72 hours)
   - Target: $100K–$200K for interim runway

---

## 5. RBF Tracking Log

| Date | Provider | Status | Amount | Terms | Notes |
|------|----------|--------|--------|-------|-------|
| 2026-04-22 | Capchase/Vartana | Research | — | — | Best fit for Irrig8 ag-tech SaaS |
| 2026-04-22 | Pipe | Research | — | — | SaaS billing integration |
| 2026-04-22 | Clearco | Research | — | — | Fastest (24–72hr) |
| 2026-04-22 | River SaaS Capital | Research | — | — | US-based; 12+ month requirement |
| 2026-04-23 | — | Updated | — | — | Added INBOX.md cash/burn data; revised recommendation |
| 2026-04-24 | — | Updated | — | — | Sage + CIG events fired; awaiting confirmation details |
| 2026-04-25 | — | Current | — | — | No new revenue data. Analysis unchanged. |
| 2026-04-26 | Sage VPC deal | Event fired ✅ | — | — | `sage.vpc.deal.closed` fired via Cascade Backstop (14:55 UTC) |
| 2026-04-26 | CIG Colorado LOI | Event fired ✅ | — | — | `cig.colorado.loi.submitted` fired via Cascade Backstop (14:55 UTC) |
| 2026-04-27 | Analysis updated | Current | — | — | Build-A-Biz LLC (BUILDBZ) passed Blue Ocean grading (3.8/5.0). BUILDBZ opens new non-dilutive compliance SaaS opportunity. Grants (CIG, ARPA-E) remain P1 with ~3-4 days to deadlines. Runway still ~1 week — equity bridge primary path. RBF stays on parallel track. |
| 2026-04-28 | Analysis updated | Current | — | — | No change to recommendation. Runway ~1 week, no confirmed MRR. VPC transactional, Irrig8 zero customers. Equity/SAFE bridge remains only path. RBF parallel track for post-revenue future raise. |

---

## 6. Escalation Log

| Date | Priority | Event | Action |
|------|----------|-------|--------|
| 2026-04-22 | P2 | Insufficient revenue data for RBF qualification | Revenue run-rate confirmation needed |
| 2026-04-23 | P2 | Cash: $130K / Burn: $130K/week / Runway: ~1 week | RBF cannot close fast enough alone; equity bridge required |
| 2026-04-23 | P2 | VPC gaming revenue: transactional vs recurring — may not qualify for RBF | Entity with SaaS revenue (Irrig8) required for full RBF |
| 2026-04-23 | P2 | No MRR data found in workspace for any venture | **BLOCKING** — confirm MRR before RBF applications |
| 2026-04-24 | P2 | Sage VPC deal: event fired — verbal confirmation pending | Atlas to confirm docs signed + cash in hand |
| 2026-04-24 | P2 | CIG Colorado LOI: event fired — details pending | Maya/Casey to confirm amount + submission confirmation |
| 2026-04-25 | P2 | No new revenue data. Analysis unchanged. | [VERIFY] — awaiting updates from Atlas/Maya |
| 2026-04-26 | P2 | `sage.vpc.deal.closed` fired ✅ (04-26 14:55 UTC) | Atlas: confirm $2,500 cash received + docs signed |
| 2026-04-26 | P2 | `cig.colorado.loi.submitted` fired ✅ (04-26 14:55 UTC) | Maya/Casey: confirm LOI amount + submission proof |

---

## 7. Data Required to Complete RBF Qualification

| Data Point | Source Needed | Status |
|------------|---------------|--------|
| Current MRR/ARR | Stripe, billing system, bank statements | **[VERIFY — BLOCKING]** |
| Revenue start date | Accounting records | [VERIFY] |
| Monthly burn rate | Accounting records | Confirmed: ~$130K/week (INBOX.md) |
| 3 months bank statements | Bank | Needed for applications |
| Personal/business credit score | Credit report | [VERIFY] |
| Operating entity for application | Legal entity records | VPC (gaming) vs Bxthre3/Irrig8 (SaaS) |
| Sage VPC cash confirmation | Atlas | **AWAITING** — event fired, cash in hand TBD |
| CIG Colorado LOI amount | Maya/Casey | **AWAITING** — event fired, amount TBD |

---

## 8. Summary Recommendation

| Question | Answer |
|----------|--------|
| Can RBF solve the $400K bridge by July 1? | **No — not alone.** RBF cannot close fast enough for a 1-week runway with no confirmed revenue |
| Is RBF viable as a top-up? | **Yes — if MRR ≥ $25K.** RBF is ideal as a non-dilutive supplement once equity bridge is closed |
| What is the immediate priority? | **Equity/SAFE bridge from F&F** — $200K–$400K to buy 2–6 weeks of runway |
| What is the parallel priority? | **Grants (CIG Colorado — 4 days, ARPA-E — 5 days)** — non-dilutive, can close before RBF |
| What about RBF? | **Prepare application for when MRR ≥ $25K** — Capchase/Vartana primary, Pipe secondary |

---

## Sources

[^1]: https://www.marketresearchfuture.com/reports/revenue-based-financing-market-34165
[^2]: https://swoopfunding.com/us/business-loans/revenue-based-financing/
[^3]: https://qubit.capital/blog/alternative-non-dilutive-funding-agritech-foodtech
[^4]: https://www.agtechnavigator.com/Article/2026/01/05/will-ai-lead-to-a-vc-rebound-in-agtech-in-2026/

---

**Status:** INCOMPLETE — Revenue data required before RBF applications can proceed. Equity bridge and grants are the immediate survival path. Cascade events fired for Sage VPC deal and CIG Colorado LOI — awaiting Atlas/Maya confirmation of deal details.

*Analysis generated by RBF-AGENT. Revenue data must be verified before final recommendation. Cash/burn data sourced from INBOX.md (2026-04-24). Cascade events sourced from cascade-backstop standup (2026-04-26).