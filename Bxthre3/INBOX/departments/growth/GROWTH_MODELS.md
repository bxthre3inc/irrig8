# Growth Models — Growth Department
**Last Updated:** 2026-04-02  
**Owner:** Optimize (CRO & Growth Lead)

---

## Overview

Growth models document the expected relationships between inputs (traffic, activations, spending) and outputs (revenue, LTV, retention) for each venture. These are used to:
1. **Prioritize experiments** — where does a small improvement have the biggest output impact?
2. **Set targets** — what acquisition spend drives what revenue?
3. **Track progress** — are we improving at the rate we expected?

---

## Zoe — Developer Growth Model

### Funnel Metrics

| Stage | Metric | Formula | Baseline | Target |
|-------|--------|---------|----------|--------|
| Acquisition | Website visitors → signups | Signups / Visitors | [VERIFY] | 8% |
| Activation | Signup → API key generated | API keys / Signups | [VERIFY] | 75% |
| Usage | API key → first call (24h) | First calls / API keys | [VERIFY] | 40% |
| Retention | 30-day active | DAU / MAU | [VERIFY] | 30% |
| Revenue | Free → Paid upgrade | Upgrades / Active free | [VERIFY] | 5% |
| Expansion | Solo → Team | Team plans / Solo accounts | [VERIFY] | 15% |

### Key Ratios

| Ratio | Formula | Current | Target |
|-------|---------|---------|--------|
| Viral coefficient | Invites sent / signups | [VERIFY] | >1.2 |
| Developer LTV | Monthly revenue / churn | [VERIFY] | >$45 |
| CAC | Sales & marketing / new customers | [VERIFY] | <$30 |
| LTV:CAC | LTV / CAC | [VERIFY] | >5:1 |

### Growth Hypothesis
Zoe's highest-leverage lever is **activation rate** (signup → first API call). Every 10% improvement here compounds through the entire funnel. Secondary lever is **team expansion** — developers who build with Zoe rarely leave once their team is onboarded.

---

## Irrig8 — Farmer Growth Model

### Funnel Metrics

| Stage | Metric | Formula | Baseline | Target |
|-------|--------|---------|----------|--------|
| Acquisition | Leads / month | New trial requests | [VERIFY] | 20 |
| Activation | Trial → activated | Activated / Requests | [VERIFY] | 60% |
| Decision | TTFID | Days from activation to first decision | [VERIFY] | 3 days |
| Conversion | Trial → Paid | Paid / Activated | [VERIFY] | 25% |
| Expansion | Single field → multi | Multi-field / Single | [VERIFY] | 30% |
| District | District deals / quarter | District contracts | [VERIFY] | 1 |

### Key Ratios

| Ratio | Formula | Current | Target |
|-------|---------|---------|--------|
| Seasonal ramp | Q2 installs / Q1 installs | [VERIFY] | >3x |
| Farm LTV | Annual revenue / churn | [VERIFY] | >$2,400 |
| District deal value | Contract value | [VERIFY] | >$12K |
| Sales cycle | Days from lead to close | [VERIFY] | <45 days |

### Growth Hypothesis
Irrig8's highest-leverage lever is **trial activation rate**. The San Luis Valley farming season means a narrow window — farmers who don't activate within 14 days of signup rarely convert. The secondary lever is **irrigation district sales**, where a single district deal can equal 50+ farm accounts.

---

## Valley Players Club — Player Growth Model

### Funnel Metrics

| Stage | Metric | Formula | Baseline | Target |
|-------|--------|---------|----------|--------|
| Acquisition | Registrations / month | New accounts | [VERIFY] | 500 |
| Verification | Email verified / registered | Verified / Registered | [VERIFY] | 70% |
| Deposit | First deposit / verified | Deposits / Verified | [VERIFY] | 35% |
| Retention | 7-day active | Deposited users active at 7d | [VERIFY] | 45% |
| VIP | T2+ progression | Players at tier 2+ / all players | [VERIFY] | 20% |
| Revenue | ARPU / month | Revenue / active players | [VERIFY] | >$85 |

### Key Ratios

| Ratio | Formula | Current | Target |
|-------|---------|---------|--------|
| Deposit bonus cost | Bonus paid / deposits | [VERIFY] | <8% |
| VIP retention | VIP churn / total churn | [VERIFY] | <0.5x |
| Player LTV | LTV by tier | [VERIFY] | Bronze: $X / Silver: $Y / Gold: $Z |
| Organic % | Organic / total acquisition | [VERIFY] | >40% |

### Growth Hypothesis
VPC's highest-leverage lever is **first-deposit conversion**. Players who make a second deposit within 7 days have 3x higher LTV. The secondary lever is **VIP progression clarity** — players who understand the tier system progress faster and churn slower.

---

## Starting 5 — Founder Growth Model

### Funnel Metrics

| Stage | Metric | Formula | Baseline | Target |
|-------|--------|---------|----------|--------|
| Acquisition | Landing → signups | Signups / Visitors | [TBD] | 6% |
| Activation | Signup → profile complete | Profiles / Signups | [TBD] | 55% |
| Matching | Match generated / profile | Matches / Profiles | [TBD] | 70% |
| Acceptance | Match accepted / offered | Accepts / Offers | [TBD] | 40% |
| Conversion | Free → paid upgrade | Upgrades / Matched | [TBD] | 12% |

### Key Ratios

| Ratio | Formula | Current | Target |
|-------|---------|---------|--------|
| Founder LTV | MRR / churned | [TBD] | >$180 |
| Match quality score | Accept rate × retention | [TBD] | >0.35 |
| Referral rate | Referrals / completed matches | [TBD] | >0.25 |

### Growth Hypothesis [BLOCKED]
Starting 5's highest-leverage lever is **match acceptance rate**. Founders who accept their first AI co-founder match are 3x more likely to upgrade to paid. The secondary lever is **onboarding completion** — founders who complete profile setup within 24 hours have 2x higher match acceptance.

> ⚠️ **BLOCKED:** Starting 5 project not in workspace. All metrics marked [TBD].

---

## Bxthre3 Corporate — Investor & Partner Growth Model

### Investor Portal Funnel

| Stage | Metric | Formula | Baseline | Target |
|-------|--------|---------|----------|--------|
| Interest | LP → CTA click | Clicks / Sessions | [VERIFY] | 5% |
| Access | CTA → access request | Requests / Clicks | [VERIFY] | 60% |
| Login | Request → portal login | Logins / Requests | [VERIFY] | 80% |
| Engagement | Login → deal view | Views / Logins | [VERIFY] | 40% |
| Commitment | View → commit | Commits / Views | [VERIFY] | 15% |

### Partner Portal Funnel

| Stage | Metric | Formula | Baseline | Target |
|-------|--------|---------|----------|--------|
| Inquiry | Contact → qualified | Qualified / Inquiries | [VERIFY] | 25% |
| NDA | Qualified → NDA signed | NDAs / Qualified | [VERIFY] | 70% |
| Pilot | NDA → pilot started | Pilots / NDAs | [VERIFY] | 40% |
| Expansion | Pilot → full contract | Contracts / Pilots | [VERIFY] | 60% |

---

## Model Update Log

| Date | Venture | Metric | Old Value | New Value | Reason |
|------|---------|--------|----------|----------|--------|
| 2026-04-02 | All | All | [None] | [VERIFY] | Week 1 — baselines not yet established |

---

*Report generated by Optimize — CRO & Growth Lead — 2026-04-02*
