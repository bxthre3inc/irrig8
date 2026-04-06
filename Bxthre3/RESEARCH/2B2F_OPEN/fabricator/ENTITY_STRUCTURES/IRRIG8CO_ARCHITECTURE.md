# IRRIG8CO — Operating Company Entity Structure

**OpCo:** IRRIG8CO (Precision Agriculture)  
**Parent:** Bxthre3 Inc  
**Status:** DRAFT  
**Version:** 0.1  
**Date:** 2026-04-03

---

## Entity Hierarchy

```
Bxthre3 Inc (Delaware C-Corp)
│
├── Founders Pool (equity reserve)
├── Investor Pool (Series A/B/C)
│
└── IRRIG8CO Holdings LLC (OpCo Parent)
    │
    ├── IRRIG8CO Ops LLC (Operating Entity)
    │   ├── Engineering Division
    │   ├── Field Operations Division
    │   └── Customer Success Division
    │
    ├── IRRIG8CO IP Holdings LLC (IP Entity)
    │   └── Patents, Trademarks, Trade Secrets
    │
    └── IRRIG8CO Data Services LLC (Data Entity)
        └── Anonymized Platform Data, ML Models
```

---

## Capital Stack — IRRIG8CO

### Initial Funding (M1-12): $2M

| Source | Amount | Equity/Dilution | Terms |
|--------|--------|-----------------|-------|
| Founder Cash | $150,000 | Direct equity | Unrestricted |
| Founder Deferred | $250,000 | Sweat equity | 4-year vest |
| Convertible Note | $1,600,000 | Converts at Seed | 20% cap, 10% discount |
| **Total Seed** | **$2M** | **~25% fully diluted** | — |

### Series A Projection (M12-24): $6M

| Source | Amount | Dilution | Valuation |
|--------|--------|----------|-----------|
| Lead Investor | $3,000,000 | 15% | $20M post |
| Co-Investors | $2,400,000 | 12% | — |
| Strategic | $600,000 | 3% | — |
| **Total A** | **$6M** | **30%** | **$20M** |

### Post-Series A Cap Table

| Stakeholder | Fully Diluted % | Value @ Series A |
|-------------|-----------------|------------------|
| Founders | 45% | $9,000,000 |
| Convertible Holders | 20% | $4,000,000 |
| Series A Investors | 30% | $6,000,000 |
| Option Pool | 5% | $1,000,000 |
| **Total** | **100%** | **$20,000,000** |

---

## IP Structure

```
IP Ownership: IRRIG8CO IP Holdings LLC
│
├── Core Patents (pending)
│   ├── Satellite-to-sensor irrigation correlation
│   ├── Soil variability mapping algorithms
│   └── Deterministic water allocation system
│
├── Trademarks
│   └── Irrig8® (registered), associated marks
│
└── Trade Secrets
    ├── Proprietary algorithmic models
    ├── Aggregated farmer data (anonymized)
    └── Integration protocols
```

---

## Operating Unit Economics

### Revenue Model (Unit: Single Farm)

| Revenue Stream | M12 | M24 | M36 | M60 |
|----------------|-----|-----|-----|-----|
| SaaS Subscription | $1,500/yr | $1,650/yr | $1,800/yr | $2,100/yr |
| Data Insights Add-on | $0 | $300/yr | $600/yr | $900/yr |
| API Access | $0 | $0 | $1,200/yr | $2,400/yr |
| **ARPU** | **$1,500** | **$1,950** | **$3,600** | **$5,400** |

### Cost Structure

| Category | % of Revenue | M12 | M24 | M36 |
|----------|--------------|-----|-----|-----|
| COGS (AWS, CDN) | 15% | $225/farm | $293/farm | $540/farm |
| Sales & Marketing | 35% | $525/farm | $683/farm | — |
| R&D | 20% | $300/farm | $390/farm | — |
| G&A | 15% | $225/farm | $293/farm | — |
| **Net Margin** | **15%** | **$225/farm** | **$293/farm** | **$540/farm** |

---

## Key Assumptions

1. **Market Size:** U.S. center-pivot irrigated acreage = 12M acres
2. **TAM Capture:** 2% M24, 10% M36, 25% M60
3. **Burn Rate:** $150K/month through M24, then profitability
4. **Headcount:** 12 FTE by M24, 35 by M36

---

## Risk Factors

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Slow farmer adoption | Medium | Revenue delay | Free pilot program M1-12 |
| Regulatory (water rights) | Low | Ops pause | Legal pre-clearance |
| Competitive entry | High | Price pressure | First-mover, data moat |
| Climate events | Low | Demand spike | Built-in surge pricing |

---

**Next:** VPC OpCo Structure  
**Status:** Draft for brodiblanco review
