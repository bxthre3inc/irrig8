# RAIN Research Concept: Regulatory Arbitrage Intelligence Network

## Executive Summary

RAIN is a proposed federally-funded research initiative to build the first comprehensive intelligence system for detecting and analyzing water rights regulatory arbitrage in drought-stressed basins. The project bridges academic water policy research, satellite remote sensing, and machine learning to create actionable intelligence for water managers, farmers, and policymakers.

**Product ↔ Research Connection:** RAIN the research project directly enables RAIN the commercial product. Research funding covers data infrastructure and methodology development; commercial licensing funds ongoing operations and basin expansion.

---

## Research Problem Statement

### The Gap
Water rights in the Western United States operate across fragmented regulatory environments:
- Federal (USBR, USACE, EPA, tribal trust responsibilities)
- State (water courts, engineer's offices, environmental quality)
- Local (conservation districts, counties, municipalities)
- Private (lease markets, broker networks, informal transfers)

This fragmentation creates **regulatory arbitrage opportunities**—situations where water rights are transferred, leased, or changed in use faster than affected parties can respond. Current systems leave most stakeholders operating with information delays measured in months or years.

### Research Questions

1. **Detection:** Can automated monitoring of 40+ regulatory databases, combined with satellite-derived water use data, detect water rights movements in near-real-time?

2. **Prediction:** What signals predict regulatory arbitrage events? Can machine learning models forecast lease applications, permanent transfers, or priority date changes?

3. **Impact:** How do information asymmetries in water rights markets affect pricing, equity, and long-term resource sustainability?

4. **Intervention:** What notification systems and policy mechanisms can reduce harmful arbitrage while preserving legitimate market activity?

---

## Methodology

### Phase 1: Data Infrastructure (Months 1-6)

#### 1.1 Regulatory Data Collection
**Objective:** Build automated pipelines for 47 identified water rights data sources.

**Sources by Category:**
| Category | Count | Examples |
|----------|-------|----------|
| Federal | 8 | USBR eWRIMS, USACE permits, EPA NPDES, tribal databases |
| State (CO) | 12 | Water courts, DWR well permits, CWCB leases |
| State (NM) | 8 | OSE adjudications, ISC decisions |
| Local | 14 | Conservation districts, county records, ditch companies |
| Commercial | 5 | Lease listings, broker databases, auction records |

**Technical Approach:**
- Web scraping with legal review and robots.txt compliance
- API integration where available
- OCR pipeline for scanned PDFs
- Structured data extraction using NLP (spaCy/LLM hybrid)

#### 1.2 Satellite Data Integration
**Objective:** Correlate regulatory activity with actual water use.

**Data Sources:**
- Landsat 8/9 (30m, 16-day)
- Sentinel-2 (10m, 5-day)
- Planet Labs (3m, daily) — commercial partnership
- SMAP soil moisture (36km, 2-3 day)

**Products:**
- NDVI time series by parcel
- ET (evapotranspiration) estimates using METRIC/SEBAL
- Irrigation vs. dryland classification
- Water stress indices

#### 1.3 Baseline Dataset Construction
**Objective:** Historical database for model training.

**Coverage:**
- Rio Grande Basin (CO/NM): 2015-2025
- Arkansas River Basin (CO): 2018-2025
- South Platte River Basin (CO): 2020-2025

**Records Target:** 100,000+ water rights with full transaction history

---

### Phase 2: Detection & Analysis (Months 4-12)

#### 2.1 Arbitrage Event Detection
**Objective:** Identify patterns indicating potential regulatory arbitrage.

**Detection Targets:**
- Lease applications filed without neighboring notice
- Priority date changes in adjudication proceedings
- Change-of-use applications to more profitable crops
- Temporary transfers during drought emergencies
- Tribal water rights lease-backs

**Method:**
- Rule-based flagging for known patterns
- Anomaly detection on filing velocity
- Network analysis for coordinated filings

#### 2.2 Predictive Modeling
**Objective:** Forecast water rights events before they occur.

**Model Types:**
| Target | Features | Approach |
|--------|----------|----------|
| Lease likelihood | Water stress, crop prices, land values, drought indices | Gradient-boosted classifier |
| Transfer price | Historical sales, basin scarcity, buyer network | XGBoost regression |
| Priority date challenge | Adjacent rights, senior calls, return flow impacts | Graph neural network |
| Drought response filing | Reservoir levels, snowpack, Palmer Drought Index | Time-series LSTM |

**Validation:**
- Train/test split: 80/20 by time (no future data leakage)
- Spatial cross-validation by basin
- Backtesting against known historical events

#### 2.3 Information Asymmetry Analysis
**Objective:** Quantify market impacts of unequal information access.

**Research Design:**
- Compare prices in "early information" vs. "public information" transactions
- Survey water rights holders on information sources
- Economic modeling of welfare effects

---

### Phase 3: Intervention Design (Months 8-18)

#### 3.1 Notification System Prototyping
**Objective:** Design effective early warning systems for affected parties.

**Components:**
- Alert relevance scoring (reduce fatigue)
- Multi-channel delivery (email, SMS, API, postal for some)
- Action recommendation engine
- Legal document template generation

**User Research:**
- Interviews with 50+ farmers and water managers
- Usability testing with conservation district staff
- A/B testing of alert formats

#### 3.2 Policy Recommendations
**Objective:** Suggest regulatory reforms to reduce harmful arbitrage.

**Areas:**
- Notice requirements for lease applications
- Priority date change transparency
- Tribal consultation protocols
- Market maker registration

---

### Phase 4: Validation & Scale (Months 12-24)

#### 4.1 Controlled Deployment
**Objective:** Test system effectiveness with real users.

**Pilot:**
- 100 farmers in Rio Grande Basin
- 5 conservation districts
- 2 state engineer offices

**Metrics:**
- Time-to-awareness (vs. control group)
- Response action rate
- User satisfaction (SUS survey)
- False positive rate

#### 4.2 Basin Expansion
**Objective:** Validate transferability to other basins.

**Targets:**
- Colorado River headwaters
- Pecos River Basin (NM)
- Republican River Basin (CO/NE/KS)

---

## Expected Outcomes

### Academic Outputs

**Publications:**
1. "Detecting Water Rights Regulatory Arbitrage with Multi-Source Data Fusion" — *Water Resources Research*
2. "Machine Learning Prediction of Agricultural Water Transfers" — *Environmental Research Letters*
3. "Information Asymmetries in Western Water Markets" — *Journal of Environmental Economics and Management*
4. "Satellite-Based Monitoring of Groundwater Rights Compliance" — *Remote Sensing of Environment*
5. "Policy Interventions for Transparent Water Rights Markets" — *Water Policy*

**Datasets:**
- Public: Anonymized transaction database (10,000+ records)
- Public: Validated model predictions with outcomes
- Restricted: Full research database (available via data use agreement)

### Applied Outcomes

1. **Operational System:** Production-grade RAIN platform monitoring 3+ basins
2. **Policy Briefs:** 4-6 briefs for state legislators and water boards
3. **Training Materials:** Workshops for conservation district staff
4. **Open Source Tools:** Data extraction pipelines, model architectures

### Commercial Outcomes

1. **Product Foundation:** RAIN platform with validated methodology
2. **IP Portfolio:** Patents pending on prediction algorithms
3. **Revenue Stream:** Licensing to farmers, agencies, and private sector
4. **Sustainability:** Research funding + commercial revenue = ongoing operations

---

## Funding Request

### Budget Overview

| Category | Year 1 | Year 2 | Total |
|----------|--------|--------|-------|
| Personnel (2 FTE research staff, 1 PI) | $280,000 | $290,000 | $570,000 |
| Data & Computing (satellite, cloud, storage) | $45,000 | $50,000 | $95,000 |
| Equipment (servers, field verification) | $20,000 | $10,000 | $30,000 |
| Travel (basin visits, conferences) | $15,000 | $15,000 | $30,000 |
| Participant Support (pilot farmer stipends) | $10,000 | $5,000 | $15,000 |
| Indirect (F&A at 25%) | $92,500 | $92,500 | $185,000 |
| **Total** | **$462,500** | **$462,500** | **$925,000** |

### Funding Sources

**Primary Targets:**
1. **USDA NIFA Agriculture and Food Research Initiative** — Water for Food Production Systems
2. **NSF Smart and Connected Communities** — Civic innovation in water management
3. **USBR WaterSMART Grants** — System conservation and efficiency
4. **DOI Office of Policy Analysis** — Tribal water rights implementation

**Matching:**
- In-kind: University computing infrastructure
- Cash: RAIN product revenue (reinvested 20%)
- Data partnerships: USGS, USBR, state agencies

---

## Team & Partners

### Research Team
- **Principal Investigator:** [Name], Water Policy/Economics
- **Co-PI:** [Name], Remote Sensing/Machine Learning
- **Research Scientist:** Data engineering and NLP
- **Graduate Students:** Basin-specific analysis

### Institutional Partners
- **New Mexico State University** — Water policy, Rio Grande expertise
- **Colorado State University** — Agricultural economics, remote sensing
- **University of Colorado Law** — Water rights law, tribal consultation

### Government Partners
- Colorado Division of Water Resources
- New Mexico Office of the State Engineer
- USBR Albuquerque Office
- [Tribal nation partners]

### Commercial Partner
- **Bxthre3 Inc / RAIN** — Product development, data infrastructure, commercialization

---

## Timeline

```
Year 1:
Q1: Funding award, team hiring, data agreements
Q2: Pipeline construction, satellite data ingestion
Q3: Detection models, baseline dataset complete
Q4: Prediction models, user research begins

Year 2:
Q1: Notification system prototype, policy analysis
Q2: Pilot deployment, controlled trial launch
Q3: Validation analysis, basin expansion
Q4: Final reports, publication submissions, commercial transition
```

---

## Connection to RAIN Product

This research project directly enables the commercial RAIN platform:

| Research Component | Product Feature |
|-------------------|-----------------|
| 47-database pipeline | Core monitoring infrastructure |
| Satellite water use detection | Irrigation anomaly alerts |
| Lease prediction model | Early warning scoring |
| User research on alerts | Notification UX optimization |
| Policy recommendations | Compliance advisory features |

**Sustainability Model:**
- Research funding covers R&D and methodology validation
- Commercial licensing covers operations and basin expansion
- Continued research partnerships enable new features
- Data sharing agreements with research partners improve coverage

---

## Related Files

- `COMMERCIALIZATION_STRATEGY.md` — Government sales and licensing
- `../rain-marketing/LANDING_PAGE_SPECS.md` — Customer-facing messaging
- `../rain-marketing/WEBSITE_STRUCTURE.md` — Research collaboration pages
- `research-plan/METHODOLOGY_DETAIL.md` — Technical methodology expansion
- `proposals/USDA_NIFA_TEMPLATE.md` — Grant proposal draft

---

*Last Updated: 2026-04-04*
*Owner: RAIN Research Team*
*Status: Draft — Ready for PI Review and Submission*
