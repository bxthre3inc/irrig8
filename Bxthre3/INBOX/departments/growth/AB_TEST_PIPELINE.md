# A/B Test Pipeline — Growth Department
**Last Updated:** 2026-04-02  
**Owner:** Optimize (CRO & Growth Lead)

---

## Pipeline Overview

| Priority | Venture | Test ID | Test Name | Hypothesis | Status | Expected Lift | Actual Lift |
|----------|---------|---------|-----------|------------|--------|---------------|-------------|
| P1 | Zoe | ZOE-001 | Developer Portal CTA Copy | "Start building" vs "Get API key" increases signups | Ideation | +15% | — |
| P1 | Zoe | ZOE-002 | Pricing Page Layout | Tiered cards vs unified calculator increases team plan conversions | Ideation | +20% | — |
| P1 | Irrig8 | IRG-001 | Trial Signup Flow | 3-step vs 1-step onboarding increases trial completions | Ideation | +25% | — |
| P1 | VPC | VPC-001 | Deposit Page Urgency | Time-bound bonus vs flat bonus increases deposit rate | Ideation | +18% | — |
| P1 | VPC | VPC-002 | VIP Tier Threshold | 3 tiers vs 5 tiers increases progression engagement | Ideation | +12% | — |
| P2 | Irrig8 | IRG-002 | District Landing Page | Case study-first vs ROI-first messaging increases inquiry rate | Ideation | +20% | — |
| P2 | Bxthre3 | BX3-001 | Investor Portal CTA | "View opportunities" vs "Request access" increases portal logins | Ideation | +15% | — |
| P3 | Starting 5 | S5-001 | Founder Onboarding | Email-first vs in-app wizard increases profile completion | Ideation | +22% | — |
| P3 | Starting 5 | S5-002 | AI Match Presentation | Sequential reveal vs batch reveal increases upgrade rate | Ideation | +30% | — |

---

## Test Specifications

### ZOE-001 — Developer Portal CTA Copy
**Venture:** Zoe  
**Priority:** P1  
**Owner:** Optimize  
**Hypothesis:** CTA copy "Start building" implies immediate action and lower friction vs "Get API key" which feels like a gate.  
**Control:** "Get your free API key"  
**Variant:** "Start building — free forever"  
**Primary Metric:** Developer signup completions  
**Secondary Metric:** API key generation, first API call within 24h  
**Sample Size:** 500 visits (250/var) — [VERIFY] based on baseline  
**Duration:** 2 weeks  
**Instrumentation:** Zo API endpoint tracking  

### ZOE-002 — Pricing Page Layout
**Venture:** Zoe  
**Priority:** P1  
**Owner:** Optimize  
**Hypothesis:** Team plan buyers need to feel control over cost; a calculator gives perceived agency vs fixed cards.  
**Control:** 3-tier pricing cards ($0 / $20 / $80)  
**Variant:** Interactive calculator with sliders for team size, messages, storage  
**Primary Metric:** Team plan (paid) conversions  
**Secondary Metric:** Plan upgrades from free→team within 7 days  
**Sample Size:** 400 visits — [VERIFY]  
**Duration:** 2 weeks  

### IRG-001 — Trial Signup Flow
**Venture:** Irrig8  
**Priority:** P1  
**Owner:** Optimize  
**Hypothesis:** Center-pivot farmers are mobile-first in the field; 1-step (phone+field) captures them before they lose interest.  
**Control:** 3-step signup (contact → farm details → field setup)  
**Variant:** 1-step (phone + GPS pin or address)  
**Primary Metric:** Trial activation completions  
**Secondary Metric:** Time-to-first-irrigation-decision (TTFID)  
**Sample Size:** 100 trials (50/var) — [VERIFY] low-volume  
**Duration:** 4 weeks (seasonal)  

### VPC-001 — Deposit Page Urgency
**Venture:** Valley Players Club  
**Priority:** P1  
**Owner:** Optimize  
**Hypothesis:** Time-bound scarcity drives deposit urgency; non-bonused deposits signal low-intent players.  
**Control:** "Claim your $10 bonus on any deposit"  
**Variant:** "Bonus expires in 47:32:15 — claim now" (countdown)  
**Primary Metric:** Deposit conversion rate (visitor→deposit)  
**Secondary Metric:** Average deposit amount, bonus redemption rate  
**Sample Size:** 1000 visits (500/var)  
**Duration:** 2 weeks  

### VPC-002 — VIP Tier Threshold
**Venture:** Valley Players Club  
**Priority:** P1  
**Owner:** Optimize  
**Hypothesis:** Too many tiers create decision fatigue; fewer tiers with clearer milestones drive progression behavior.  
**Control:** 5 VIP tiers ($0/$100/$500/$2K/$10K lifetime deposits)  
**Variant:** 3 tiers ($0/$250/$2K) with named status (Bronze / Silver / Gold)  
**Primary Metric:** VIP tier progression rate (any upgrade)  
**Secondary Metric:** Deposit frequency, churn rate at 30/60/90 days  
**Sample Size:** 800 active players (400/var)  
**Duration:** 3 weeks  

### IRG-002 — District Landing Page Messaging
**Venture:** Irrig8  
**Priority:** P2  
**Owner:** Optimize  
**Hypothesis:** Irrigation district decision-makers respond to peer validation (case study) more than abstract ROI claims.  
**Control:** Hero: "Reduce water waste by 30% — see how"  
**Variant:** Hero: "How Heginbotham Farms cut water use 28% in one season"  
**Primary Metric:** Contact/inquiry form submissions  
**Secondary Metric:** Demo request, sales cycle length  
**Sample Size:** 300 visits (150/var)  
**Duration:** 3 weeks  

### BX3-001 — Investor Portal CTA
**Venture:** Bxthre3 corporate  
**Priority:** P2  
**Owner:** Optimize  
**Hypothesis:** "Request access" implies gate-keeping and creates friction; "View opportunities" implies openness and lower commitment.  
**Control:** "Request access to investor portal"  
**Variant:** "View investment opportunities"  
**Primary Metric:** Portal login rate from landing page  
**Secondary Metric:** Time-to-first-login, document downloads  
**Sample Size:** 200 visits (100/var)  
**Duration:** 2 weeks  

### S5-001 — Founder Onboarding (BLOCKED: path TBD)
**Venture:** Starting 5  
**Priority:** P3  
**Status:** BLOCKED — project path not in workspace  
**Hypothesis:** Email drip creates anticipation; in-app wizard feels instantaneous.  
**Control:** Email-first onboarding (3 emails over 5 days)  
**Variant:** In-app setup wizard at signup  
**Primary Metric:** Profile completion rate  
**Secondary Metric:** First AI co-founder match generated  

### S5-002 — AI Match Presentation (BLOCKED: path TBD)
**Venture:** Starting 5  
**Priority:** P3  
**Status:** BLOCKED  
**Hypothesis:** Revealing matches one-at-a-time with "why this match" creates intrigue and reduces overwhelm.  
**Control:** All matches shown simultaneously in a grid  
**Variant:** Matches revealed sequentially with 24hr gap and rationale card  
**Primary Metric:** Upgrade to paid tier  
**Secondary Metric:** Match acceptance rate, session length  

---

## Prioritization Framework

Tests ranked by:
1. **Impact magnitude** — higher expected lift = higher priority
2. **Speed to results** — faster cycles preferred
3. **Dependencies** — blocked tests deprioritized
4. **Resource cost** — instrumentation complexity weighted against lift

**Decision rule:** Pass threshold = expected lift ≥ 10% OR strategic (brand, retention). Tests below 10% expected lift deferred unless strategic.

---

## Status Key

| Status | Meaning |
|--------|---------|
| Ideation | Hypothesis drafted, awaiting resourcing |
| Designed | Full spec complete, ready to implement |
| Running | Live experiment |
| Analyzing | Data collected, writing results |
| Complete | Results published |
| Blocked | Dependency or resource issue |

---

*Report generated by Optimize — CRO & Growth Lead — 2026-04-02*
