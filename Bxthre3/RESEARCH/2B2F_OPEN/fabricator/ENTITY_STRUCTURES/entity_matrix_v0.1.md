# 2B2F Entity Structure Matrix
## Version 0.1 — Entity Hierarchy & Capital Stack Model

**Document ID:** ES-001
**Generated:** 2026-03-30
**Author:** FABRICATOR

---

## 1. Master Entity Structure

```
                            ┌─────────────────────────────────────┐
                            │      BXTHRE3 INC (Delaware)         │
                            │         Holding Company             │
                            │         Valuation: $500M            │
                            └───────────────┬─────────────────────┘
                                            │
            ┌───────────────────────────────┼───────────────────────────────┐
            │                               │                               │
    ┌───────▼────────┐            ┌──────────▼──────────┐      ┌───────────▼──────────┐
    │ IRRIG8 OP      │            │ VPC OP              │      │ STRATEGIC INV        │
    │ SOLUTIONS LTD  │            │ LLC                 │      │ HOLDINGS             │
    │ $50M Cap       │            │ $10M Cap            │      │ $100M AUM            │
    └───────┬────────┘            └──────────┬──────────┘      └──────────────────
            │                               │
    ┌───────▼────────┐            ┌──────────▼──────────┐
    │ IRRIG8         │            │ VPC                 │
    │ SUBSIDIARIES   │            │ SUBSIDIARIES        │
    ├─ Irrig8 EU     │            ├─ VPC Media          │
    ├─ Irrig8 APAC   │            └─ VPC Tech            │
    └─ Irrig8 SA     │
                     │
    ┌───────▼────────┐
    │ DATA & AI      │
    │ LAYER          │
    └────────────────┘
```

---

## 2. Operating Company (OpCo) Specifications

### 2.1 Irrig8 Solutions Ltd

| Attribute | Value |
|-----------|-------|
| Entity Type | C-Corp (Delaware) |
| Capital Structure | Common + Preferred |
| Initial Cap Table | Founder 60% / Seed 25% / Option Pool 15% |
| Target Valuation M36 | $200M |
| Revenue Target M24 | $10M ARR |
| Revenue Target M36 | $50M ARR |
| Revenue Target M120 | $500M ARR |

**Subsidiary Structure:**
- Irrig8 EU GmbH (Germany) — EU regulatory compliance
- Irrig8 APAC Pte Ltd (Singapore) — Asia-Pacific operations
- Irrig8 SA (Pty) Ltd (South Africa) — Africa operations

### 2.2 Valley Players Club LLC

| Attribute | Value |
|-----------|-------|
| Entity Type | Series LLC (Wyoming) |
| Capital Structure | Member units + Revenue share |
| Initial Cap Table | Parent Co 80% / Operators 20% |
| Target Valuation M36 | $50M |
| Revenue Target M24 | $5M ARR |
| Revenue Target M36 | $25M ARR |
| Revenue Target M120 | $200M ARR |

**Subsidiary Structure:**
- VPC Media LLC — Content and sweepstakes operations
- VPC Tech LLC — Platform and technology development

### 2.3 Bxthre3 Strategic Investments

| Attribute | Value |
|-----------|-------|
| Entity Type | Investment Holding Corp |
| Purpose | Portfolio management, minority investments |
| Target AUM M36 | $50M |
| Target AUM M120 | $500M |
| Investment Thesis | Ag-tech adjacencies, gaming infrastructure |

---

## 3. Capital Flow Architecture

### 3.1 Funding Cascade

```
Phase 1 (M1-M24): Bootstrap → Seed
├── Founder capital: $500K
├── Friends & Family: $500K
├── Angel/Seed: $1M
│   └── Irrig8 pre-seed: $400K
│   └── VPC seed: $200K
│   └── Operations: $400K
└── Total Phase 1: $2M

Phase 2 (M12-M36): Seed → Series A
├── Seed Extension: $3M
├── Series A Lead: $8M
│   └── Allocation:
│       ├── Irrig8 growth: $4M
│       ├── VPC scale: $2M
│       └── Operations: $2M
└── Total Phase 2: $11M

Phase 3 (M24-M120): Series A → Scale
├── Series B: $40M
├── Strategic Rounds: $100M+
└── Debt facilities: $50M
```

### 3.2 Inter-Company Flows

| From | To | Purpose | Amount | Frequency |
|------|-----|---------|--------|-----------|
| Bxthre3 Inc | Irrig8 | Operating capital | $200K | Monthly |
| Bxthre3 Inc | VPC | Operating capital | $80K | Monthly |
| Irrig8 | Bxthre3 (dividends) | Return of capital | 20% of FCF | Quarterly |
| VPC | Bxre3 (rev share) | Platform fee | 15% of gross | Monthly |

---

## 4. Governance Structure

### 4.1 Board Composition

| Entity | Board Seats | Composition |
|--------|-------------|-------------|
| Bxthre3 Inc | 3 | Founder (CCEO) + 2 Independent |
| Irrig8 | 5 | Parent rep + Founder + 2 Investors + Independent |
| VPC | 3 | Parent rep + Operator + Investor |

### 4.2 Decision Matrix

| Decision Type | Approval Required | Timeline |
|---------------|-------------------|----------|
| <$100K OpEx | OpCo CEO | Immediate |
| $100K-$500K | OpCo Board | 5 days |
| $500K-$2M | Parent Board | 30 days |
| >$2M / Strategic | Full Board + Shareholders | 60 days |

---

## 5. Tax Optimization Strategy

### 5.1 Jurisdiction Allocation

| Entity | Jurisdiction | Tax Treatment | Rationale |
|--------|--------------|---------------|-----------|
| Bxthre3 Inc | Delaware | Pass-through considerations | US operations, investor preference |
| Irrig8 EU | Germany | EU tax compliance | Customer base, regulatory |
| Irrig8 APAC | Singapore | 17% corporate, IP incentives | APAC hub, tax efficiency |
| VPC OpCo | Wyoming | 0% state income tax | Gaming operations |

### 5.2 Transfer Pricing

- IP licensing: 5% of net revenue
- Technology services: Cost + 15% markup
- Data services: Fair market value (arms-length)

---

## 6. Risk Mitigation in Structure

### 6.1 Asset Protection
- Operating entities in LLC structure (liability isolation)
- IP held in separate IP holding entities
- Insurance: E&O, D&O, Cyber liability

### 6.2 Regulatory Compliance
- All gaming operations segregated from ag-tech
- Separate financial tracking per entity
- Independent audits for each OpCo

---

## 7. Evolution Timeline

| Month | Milestone | Structural Change |
|-------|-----------|-------------------|
| M6 | Irrig8 entity spinout | Separate cap table |
| M12 | VPC regulatory clearance | Operational independence |
| M18 | First subsidiary (Irrig8 EU) | Geographic expansion |
| M24 | Series A close | Board expansion |
| M36 | Series B prep | Holding company restructuring |
| M60 | Potential IPO consideration | Public entity readiness |
| M120 | Platform maturity | Full portfolio autonomy |

---

*Document: ES-001 — Entity Structure Matrix v0.1*
*Next Version: ES-002 (after Series A modeling)*
