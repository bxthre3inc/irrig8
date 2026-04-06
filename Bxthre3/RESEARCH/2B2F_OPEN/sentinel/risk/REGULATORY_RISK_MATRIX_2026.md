# Regulatory Risk Matrix
## 2B2F Strategic Risk Assessment — Q2 2026

**Document Date:** 2026-04-04  
**Agent:** SENTINEL — 2B2F Council Strategic Planning Unit  
**Classification:** Public Research — Zero Budget  

---

## Risk Taxonomy

### Category 1: Securities Law Violation

| Risk | Likelihood | Impact | Velocity | Overall |
|------|------------|--------|----------|---------|
| SEC enforcement action | MEDIUM | **CRITICAL** | HIGH | **HIGH** |
| Unregistered security finding | MEDIUM | **CRITICAL** | HIGH | **HIGH** |
| Class action litigation | LOW | HIGH | MEDIUM | MEDIUM |

**Trigger Conditions:**
- Token marketed with profit expectation
- Pool interest representation
- Centralized treasury control
- Anonymous team

**Mitigation:**
- [ ] Pure utility token design
- [ ] No yield/return marketing
- [ ] Legal opinions in all target jurisdictions
- [ ] Decentralized governance from inception

---

### Category 2: Money Transmitter Licensing

| Risk | Likelihood | Impact | Velocity | Overall |
|------|------------|--------|----------|---------|
| State MTL enforcement | HIGH | HIGH | MEDIUM | **HIGH** |
| FinCEN MSB registration failure | MEDIUM | HIGH | MEDIUM | MEDIUM |
| Cross-border transmission violations | MEDIUM | HIGH | MEDIUM | MEDIUM |

**Current Landscape (2025):**
- 49 states require MTL (Montana exempt)
- New York BitLicense: strictest regime
- California DFAL: effective July 2026
- Cost: $500K-$2M for nationwide coverage
- Timeline: 12-18 months

**Trigger Conditions:**
- Holding customer funds
- Facilitating fiat-crypto exchange
- Custodial wallet services
- Payment processing

**Mitigation:**
- [ ] Non-custodial architecture
- [ ] Partner with licensed entities for fiat on/off ramps
- [ ] Target strategic states first (TX, FL, WY)
- [ ] Wyoming SPDI consideration for custody

---

### Category 3: CFTC Commodity Regulation

| Risk | Likelihood | Impact | Velocity | Overall |
|------|------------|--------|----------|---------|
| Swap dealer registration | LOW | **CRITICAL** | MEDIUM | MEDIUM |
| Derivatives trading violation | LOW | HIGH | MEDIUM | MEDIUM |
| Margin requirements | LOW | MEDIUM | LOW | LOW |

**Current Thresholds:**
- Swap dealer: $8B AANA (Aggregate Notional Amount)
- Initial margin: Exchange required for uncleared swaps >$8B
- De minimis exemption: Complex calculation

**Trigger Conditions:**
- Token represents synthetic exposure
- Leveraged trading facilitation
- Margin-based token mechanics

**Mitigation:**
- [ ] Avoid leverage in token design
- [ ] No synthetic asset representation
- [ ] Cash-spot only (no derivatives)
- [ ] Monitor AANA thresholds

---

### Category 4: Systemic Risk Designation

| Risk | Likelihood | Impact | Velocity | Overall |
|------|------------|--------|----------|---------|
| FSOC SIFI designation (Month 120) | **HIGH** | **CRITICAL** | LOW | **HIGH** |
| Federal Reserve oversight | **HIGH** | **CRITICAL** | LOW | **HIGH** |
| Enhanced prudential standards | **HIGH** | HIGH | LOW | **HIGH** |

**FSOC Framework (2026):**
- Activities-based approach preferred
- Entity designation requires "severe damage to broader economy"
- 180-day off-ramp for risk mitigation
- Cost-benefit analysis required

**Scaling Implications:**

| GDP Impact | SIFI Risk | Action |
|------------|-----------|--------|
| <1% | Negligible | Standard compliance |
| 1-5% | LOW | Monitor, prepare |
| 5-20% | MEDIUM | Engage FSOC proactively |
| 20-60% | HIGH | SIFI compliance design |
| >60% | **CERTAIN** | Full SIFI infrastructure |

**Mitigation:**
- [ ] Design for SIFI compliance from inception
- [ ] Stress testing infrastructure
- [ ] Capital adequacy planning
- [ ] Resolution planning
- [ ] Ongoing FSOC engagement

---

### Category 5: International Regulatory Arbitrage

| Risk | Likelihood | Impact | Velocity | Overall |
|------|------------|--------|----------|---------|
| EU MiCA enforcement | MEDIUM | HIGH | MEDIUM | MEDIUM |
| Swiss regulatory change | LOW | MEDIUM | LOW | LOW |
| Cross-border enforcement | MEDIUM | HIGH | MEDIUM | MEDIUM |

**EU MiCA (Effective December 2024):**
- CASP authorization required
- Whitepaper mandatory for token issuers
- Reserve requirements for stablecoins
- EMT custody may require dual licensing (MiCA + PSD2)

**Mitigation:**
- [ ] CASP authorization in EU
- [ ] Whitepaper preparation
- [ ] Swiss foundation for legal personality
- [ ] Multi-jurisdictional legal opinions

---

### Category 6: Tax Uncertainty

| Risk | Likelihood | Impact | Velocity | Overall |
|------|------------|--------|----------|---------|
| IRS token classification | MEDIUM | HIGH | MEDIUM | MEDIUM |
| Partnership attribution (DAO) | HIGH | MEDIUM | MEDIUM | MEDIUM |
| Cross-border tax treaty issues | MEDIUM | MEDIUM | MEDIUM | MEDIUM |

**Key Issues:**
- DAO token holders = partnership?
- Check-the-box election complexity
- International tax treaty applicability
- State income tax nexus

**Mitigation:**
- [ ] Tax opinion procurement
- [ ] Entity classification election (Form 8832)
- [ ] Transparent treasury accounting
- [ ] Multi-jurisdiction tax counsel

---

## Risk Scoring Methodology

### Likelihood Scale
- **RARE:** <5% probability
- **LOW:** 5-20% probability
- **MEDIUM:** 20-50% probability
- **HIGH:** 50-80% probability
- **CERTAIN:** >80% probability

### Impact Scale
- **NEGLIGIBLE:** Operational nuisance
- **LOW:** Financial impact <$100K
- **MEDIUM:** Financial impact $100K-$1M
- **HIGH:** Financial impact $1M-$10M
- **CRITICAL:** Financial impact >$10M or existential threat

### Velocity Scale
- **SLOW:** >12 months to materialize
- **MEDIUM:** 6-12 months to materialize
- **HIGH:** <6 months to materialize

---

## Risk Heat Map

```
                    IMPACT
              Low    Med    High   Critical
         ┌──────────────────────────────────┐
    Rare │                              F   │
         │                                  │
         │   A                              │
    Low  │                                  │
         │                              G   │
         │   B                              │
   Med   │              C   E               │
         │                                  │
         │   D                              │
   High  │                                  │
         │                                  │
Certain  │                    H   I   J     │
         └──────────────────────────────────┘
              
LEGEND:
A - Cross-border tax treaty issues
B - Swiss regulatory change
C - State MTL enforcement
D - International regulatory arbitrage
E - FinCEN MSB registration
F - Class action litigation
G - IRS token classification
H - CFTC swap dealer registration
I - SEC enforcement action
J - FSOC SIFI designation (Month 120)
```

---

## Mitigation Priority Matrix

| Priority | Risk | Action | Owner | Timeline |
|----------|------|--------|-------|----------|
| P0 | SEC enforcement | Utility token design + legal opinions | Legal | Month 1-3 |
| P0 | State MTL | Non-custodial architecture | Engineering | Month 1-6 |
| P1 | FSOC SIFI | Design for SIFI compliance | Strategy | Month 1-12 |
| P1 | EU MiCA | CASP authorization | Legal | Month 3-9 |
| P2 | Tax uncertainty | Tax opinion procurement | Legal | Month 3-6 |
| P2 | CFTC regulation | Avoid swap-like design | Engineering | Month 1-3 |

---

## Monitoring Triggers

### Weekly Monitoring
- SEC enforcement announcements
- CFTC regulatory releases
- State legislative updates (MTL)

### Monthly Monitoring
- FSOC guidance updates
- EU MiCA implementation
- Swiss FINMA updates
- Tax authority guidance

### Quarterly Review
- Full risk matrix reassessment
- Mitigation strategy effectiveness
- Legal opinion currency
- Regulatory engagement status

---

*SENTINEL | 2B2F Council Strategic Planning Unit*  
*Zero Budget | Public Research | GDP-Scale Impact Target*
