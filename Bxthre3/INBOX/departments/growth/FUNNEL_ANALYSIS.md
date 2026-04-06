# Conversion Funnel Analysis — Growth Department
**Last Updated:** 2026-04-02  
**Owner:** Optimize (CRO & Growth Lead)  
**Cadence:** Weekly

---

## Venture Funnel Baselines

> ⚠️ **Note:** Funnel data marked [VERIFY] — no existing analytics instrumentation found in workspace. Establish baseline metrics in week 1 by instrumenting key events.

### Zoe — Developer Funnel

```
Traffic → Signup → API Key Generated → First API Call → Team Invited → Paid Plan
```

| Stage | Metric | Baseline | Current | Target | Status |
|-------|--------|----------|---------|--------|--------|
| Visitor → Signup | Conversion rate | [VERIFY] | — | 8% | ⚠️ No data |
| Signup → API Key | Activation rate | [VERIFY] | — | 75% | ⚠️ No data |
| API Key → First Call | 24h usage rate | [VERIFY] | — | 40% | ⚠️ No data |
| Free → Paid | Upgrade rate | [VERIFY] | — | 5% | ⚠️ No data |
| Solo → Team | Team expansion rate | [VERIFY] | — | 15% | ⚠️ No data |

**Top 3 Drop-off Points (Hypothesis):**
1. Signup → API key: Friction from email verification
2. API key → first call: Missing quickstart / integration docs
3. Solo → team: No visible team tier benefit on dashboard

**Recommended Tests:** ZOE-001 (CTA), ZOE-002 (pricing layout)

---

### Irrig8 — Farmer Acquisition Funnel

```
Awareness → Website Visit → Trial Signup → Field Setup → First Decision → Paid License
```

| Stage | Metric | Baseline | Current | Target | Status |
|-------|--------|----------|---------|--------|--------|
| Visit → Trial Request | Inquiry rate | [VERIFY] | — | 3% | ⚠️ No data |
| Trial Request → Activated | Activation rate | [VERIFY] | — | 60% | ⚠️ No data |
| Activated → First Decision | TTFID (days) | [VERIFY] | — | 3 days | ⚠️ No data |
| Trial → Paid Conversion | Trial-to-paid | [VERIFY] | — | 25% | ⚠️ No data |
| Paid → District Expansion | District upsell | [VERIFY] | — | 10% | ⚠️ No data |

**Top 3 Drop-off Points (Hypothesis):**
1. Trial request → activated: Multi-step form abandonment
2. Activated → first decision: Setup complexity / no quick win
3. Trial → paid: Price anchoring without ROI proof

**Recommended Tests:** IRG-001 (signup flow), IRG-002 (district messaging)

---

### Valley Players Club — Player Funnel

```
Acquisition → Registration → Email Verified → First Deposit → Repeat Play → VIP Progression
```

| Stage | Metric | Baseline | Current | Target | Status |
|-------|--------|----------|---------|--------|--------|
| Visit → Register | Registration rate | [VERIFY] | — | 12% | ⚠️ No data |
| Register → Email Verified | Verification rate | [VERIFY] | — | 70% | ⚠️ No data |
| Verified → First Deposit | Deposit conversion | [VERIFY] | — | 35% | ⚠️ No data |
| First → Repeat | Retention (7-day) | [VERIFY] | — | 45% | ⚠️ No data |
| Repeat → VIP T2+ | Progression rate | [VERIFY] | — | 20% | ⚠️ No data |

**Top 3 Drop-off Points (Hypothesis):**
1. Verified → first deposit: Bonus offer not compelling enough
2. First → repeat: No second-chance bonus / game variety
3. Repeat → VIP T2+: Unclear tier benefits / progression feels unreachable

**Recommended Tests:** VPC-001 (deposit urgency), VPC-002 (VIP tiers)

---

### Starting 5 — Founder Funnel [BLOCKED]

> ⚠️ **BLOCKED:** Starting 5 project path not found in workspace. Funnel estimates cannot be validated.

```
Landing → Signup → Profile Complete → AI Match → Match Accept → Upgrade to Paid
```

| Stage | Metric | Baseline | Current | Target | Status |
|-------|--------|----------|---------|--------|--------|
| Visit → Signup | Conversion rate | [VERIFY] | — | TBD | 🔴 Blocked |
| Signup → Profile | Completion rate | [VERIFY] | — | TBD | 🔴 Blocked |
| Profile → Match | Match generation | [VERIFY] | — | TBD | 🔴 Blocked |
| Match → Accept | Acceptance rate | [VERIFY] | — | TBD | 🔴 Blocked |
| Accept → Upgrade | Upgrade rate | [VERIFY] | — | TBD | 🔴 Blocked |

**Recommended Tests:** S5-001 (onboarding), S5-002 (match presentation)

---

### Bxthre3 Corporate — Investor Portal

```
LP Visit → Portal Interest → Request Access → Portal Login → Deal View → Commitment
```

| Stage | Metric | Baseline | Current | Target | Status |
|-------|--------|----------|---------|--------|--------|
| LP → Interest CTA | Click rate | [VERIFY] | — | 5% | ⚠️ No data |
| Interest → Access Request | Form submit rate | [VERIFY] | — | 60% | ⚠️ No data |
| Request → Portal Login | Login rate | [VERIFY] | — | 80% | ⚠️ No data |
| Login → Deal View | Deep engagement | [VERIFY] | — | 40% | ⚠️ No data |
| Deal View → Commitment | Close rate | [VERIFY] | — | 15% | ⚠️ No data |

**Top 3 Drop-off Points (Hypothesis):**
1. Interest CTA → access request: Gate-keeping language ("request access")
2. Access → login: Friction in credential setup / invite flow
3. Deal view → commitment: Insufficient deal room content / due diligence materials

**Recommended Tests:** BX3-001 (portal CTA)

---

## Instrumentation Requirements

To establish baselines, the following events must be instrumented:

### Zoe
- [ ] `developer.signup.completed` — POST /auth/signup
- [ ] `developer.apikey.generated` — POST /api/keys
- [ ] `developer.firstcall.made` — POST /api/* (any)
- [ ] `developer.team.invited` — POST /team/invite
- [ ] `developer.plan.upgraded` — POST /billing/upgrade

### Irrig8
- [ ] `farmer.trial.requested` — form submission
- [ ] `farmer.trial.activated` — first field connected
- [ ] `farmer.firstdecision.generated` — first irrigation decision output
- [ ] `farmer.paid.converted` — subscription activated
- [ ] `farmer.district.inquired` — district interest form

### VPC
- [ ] `player.registered` — account created
- [ ] `player.email.verified` — email confirmation clicked
- [ ] `player.deposit.made` — first deposit transaction
- [ ] `player.repeat.deposit` — second+ deposit
- [ ] `player.vip.upgraded` — tier change event

### Starting 5
- [ ] `founder.signup.completed`
- [ ] `founder.profile.completed`
- [ ] `founder.match.generated`
- [ ] `founder.match.accepted`
- [ ] `founder.upgrade.paid`

### Bxthre3 Corporate
- [ ] `investor.cta.clicked`
- [ ] `investor.access.requested`
- [ ] `investor.portal.loggedin`
- [ ] `investor.deal.viewed`
- [ ] `investor.commitment.submitted`

---

## Weekly Funnel Report Schedule

| Day | Report | Recipients |
|-----|--------|------------|
| Monday | Week-over-week funnel snapshot | Brand, Roadmap |
| Thursday | Mid-week experiment check | Growth team |
| Friday | Weekly growth experiment results | Brand, Roadmap, brodiblanco |

---

*Report generated by Optimize — CRO & Growth Lead — 2026-04-02*
