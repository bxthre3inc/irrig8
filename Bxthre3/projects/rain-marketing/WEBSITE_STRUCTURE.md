# RAIN Marketing Website — Full Structure

## Overview
Complete product marketing website for RAIN (Regulatory Arbitrage Intelligence Network). Positions RAIN as the essential intelligence platform for water rights holders in drought-stressed basins.

**Research ↔ Product Connection:** This website explicitly ties RAIN's commercial capabilities to its federally-funded research origins, establishing credibility and opening government sales channels.

---

## Information Architecture

```
/
├── / (Homepage)
├── /product
│   ├── /features
│   ├── /pricing
│   ├── /basins
│   └── /demo
├── /intelligence
│   ├── /reports
│   ├── /basin-monitoring
│   └── /api-access
├── /research
│   ├── /publications
│   ├── /methodology
│   ├── /data-sources
│   └── /collaboration
├── /government
│   ├── /water-districts
│   ├── /agencies
│   ├── /tribal-nations
│   └── /procurement
├── /about
│   ├── /team
│   ├── /mission
│   └── /press
├── /resources
│   ├── /blog
│   ├── /case-studies
│   ├── /webinars
│   └── /faq
└── /contact
    ├── /sales
    ├── /support
    └── /research-inquiries
```

---

## Page Specifications

### 1. Homepage (/)

**Purpose:** Conversion hub establishing authority and driving to free report or demo.

**Sections:**
1. **Hero:** Dynamic map visualization, headline, dual CTAs (Free Report / See Demo)
2. **Problem Agitation:** "Water rights are disappearing faster than ever"
3. **Solution Overview:** 3-pane feature grid with micro-interactions
4. **Live Intelligence Preview:** Real-time (or recent) sample data display
5. **Research Credibility:** "Built on federally-funded research" section
6. **Social Proof:** Customer logos, testimonials, use case cards
7. **Basin Coverage:** Interactive map of monitored basins
8. **Blog/News Preview:** Latest intelligence briefs
9. **Final CTA:** Free report form or calendar booking

**Key Metrics to Track:** Time on site, scroll depth, CTA click-through rate

---

### 2. Product Section (/product)

#### 2.1 Features Page (/product/features)
**Purpose:** Comprehensive feature tour for evaluators.

**Modules:**
- **Regulatory Monitoring:** 47-database scraping, daily refresh, custom alerts
- **Satellite Intelligence:** Water use anomaly detection, crop identification, stress indices
- **Predictive Analytics:** Lease likelihood scoring, price forecasting, transfer probability
- **Collaboration Tools:** Multi-user access, legal team integration, document management
- **API Access:** Programmatic data access, webhook notifications, bulk exports

**Interactive Elements:**
- Feature toggles showing before/after scenarios
- Live data sample widgets
- ROI calculator

#### 2.2 Pricing Page (/product/pricing)
**Purpose:** Clear tier structure with government/research discounts.

**Tiers:**
| Free | Grower | Enterprise | Government/Research |
|------|--------|------------|---------------------|
| Monthly report | Real-time alerts | Custom basins | Unlimited basins |
| 1 basin | Up to 3 basins | Unlimited | Multi-state |
| Email alerts | SMS + Email | Dedicated rep | FedRAMP pending |
| - | API access | White-label | Data sharing rights |
| - | $299/mo | Custom | GSA Schedule |

**Note:** Government/Research tier ties to rain-research-fund procurement strategy.

#### 2.3 Basins Page (/product/basins)
**Purpose:** Show coverage and capture expansion requests.

**Content:**
- Interactive basin map with coverage status
- Per-basin data source details
- "Request Your Basin" lead capture form
- Coverage roadmap timeline

#### 2.4 Demo Page (/product/demo)
**Purpose:** Self-service product exploration.

**Content:**
- Embedded interactive demo (Guided tour or sandbox)
- Video walkthroughs by use case
- "Request Live Demo" calendar booking

---

### 3. Intelligence Section (/intelligence)

#### 3.1 Reports Page (/intelligence/reports)
**Purpose:** Showcase output quality and establish thought leadership.

**Content:**
- Sample report library (anonymized)
- Report frequency and delivery options
- Custom report requests
- RSS/email subscription for public briefs

#### 3.2 Basin Monitoring (/intelligence/basin-monitoring)
**Purpose:** Explain monitoring methodology for technical buyers.

**Content:**
- Data source documentation
- Refresh frequency by source type
- Alert configuration options
- Data quality metrics

#### 3.3 API Access (/intelligence/api-access)
**Purpose:** Developer and systems integrator documentation.

**Content:**
- API reference documentation
- Code samples (Python, JavaScript, R)
- Webhook configuration
- Rate limits and pricing

---

### 4. Research Section (/research)

**Critical Connection:** This section bridges the commercial product to the research fund, establishing RAIN's academic credibility and enabling grant-funded development.

#### 4.1 Publications (/research/publications)
**Purpose:** Demonstrate scientific rigor and domain expertise.

**Content:**
- Peer-reviewed papers using RAIN data
- Conference presentations
- Government reports citing RAIN
- Working papers and preprints

**Format:** Abstract + PDF download + citation info

#### 4.2 Methodology (/research/methodology)
**Purpose:** Transparent explanation of data collection and analysis methods.

**Content:**
- Data source catalog
- Scraping and NLP pipeline overview
- Validation and quality assurance
- Ethical guidelines and privacy protection
- Limitations and uncertainty quantification

**Format:** Technical documentation with diagrams

#### 4.3 Data Sources (/research/data-sources)
**Purpose:** Comprehensive transparency on input data.

**Content:**
- Federal sources (USBR, USGS, EPA)
- State sources (water courts, engineer's offices)
- County/local sources
- Tribal water rights databases
- Satellite data (Landsat, Sentinel)
- Commercial data partnerships

**Format:** Searchable database with source details

#### 4.4 Collaboration (/research/collaboration)
**Purpose:** Recruit academic and government research partners.

**Content:**
- Active research partnerships
- Data sharing agreements
- Joint publication opportunities
- Graduate student/fellowship programs
- Grant collaboration CTA

**Lead Form:** Research partnership inquiry

---

### 5. Government Section (/government)

**Critical Connection:** Direct pathway to rain-research-fund commercialization strategy.

#### 5.1 Water Districts (/government/water-districts)
**Purpose:** Targeted messaging for conservation/conservancy districts.

**Content:**
- District-specific use cases
- Multi-member pricing
- Board reporting features
- Case study: [Example District]

#### 5.2 Agencies (/government/agencies)
**Purpose:** Federal and state agency positioning.

**Content:**
- USBR integration capabilities
- State engineer office coordination
- Compliance and audit support
- BAA/GSA procurement information

#### 5.3 Tribal Nations (/government/tribal-nations)
**Purpose:** Respectful, specialized outreach for tribal water rights.

**Content:**
- Tribal water rights expertise
- Data sovereignty commitments
- Trust obligation support
- Dedicated tribal liaison contact

#### 5.4 Procurement (/government/procurement)
**Purpose:** Remove friction from government purchasing.

**Content:**
- GSA Schedule status (or application)
- BAA eligibility
- Sole source justification template
- Grant-funded access programs
- Contract vehicles and terms

**Download:** Capability statement PDF

---

### 6. About Section (/about)

#### 6.1 Team (/about/team)
**Content:** Leadership, advisors, research partners

#### 6.2 Mission (/about/mission)
**Content:** Origin story, values, long-term vision

#### 6.3 Press (/about/press)
**Content:** Media kit, press releases, media coverage

---

### 7. Resources Section (/resources)

#### 7.1 Blog (/resources/blog)
**Categories:**
- Intelligence Briefs (basin-specific updates)
- Regulatory Changes (policy analysis)
- Technical Deep-Dives (methodology explanations)
- Customer Stories (anonymized case studies)
- Research Updates (academic collaboration news)

#### 7.2 Case Studies (/resources/case-studies)
**Format:** Challenge → RAIN Solution → Outcome

**Target Stories:**
- Caught early lease application
- Price negotiation with market data
- Multi-generational water rights protection
- Government agency efficiency gain

#### 7.3 Webinars (/resources/webinars)
**Content:** On-demand and upcoming educational content

#### 7.4 FAQ (/resources/faq)
**Sections:** Product, Pricing, Data, Research, Government

---

### 8. Contact Section (/contact)

#### 8.1 Sales (/contact/sales)
- Form for commercial inquiries
- Direct phone number
- Calendar booking for demos

#### 8.2 Support (/contact/support)
- Knowledge base
- Ticket submission
- Phone support hours

#### 8.3 Research Inquiries (/contact/research-inquiries)
**Critical:** Direct pipeline to rain-research-fund team

**Form Fields:**
- Institution
- Research area
- Data needs
- Collaboration type
- Funding status

---

## Design System

### Visual Identity
- **Primary:** Deep water blue (#0A2540)
- **Secondary:** Rain cloud gray (#96F7D6 accent for satellite imagery)
- **Accent:** Alert orange (#FF6B35) for warnings/urgent data
- **Typography:** Inter (body), Merriweather (headers — authority)

### Imagery
- Satellite photography of water basins
- Data visualization aesthetics
- Authentic farm/water imagery (not stock)
- Abstract water flow patterns

### Interactions
- Map-based navigation where possible
- Real-time data refresh indicators
- Scroll-triggered animations for data reveals
- Dark mode for extended monitoring use

---

## Technical Stack

**Platform:** Zo Space (primary) or Zo Site (if complex interactivity)
**CMS:** Headless (Contentful/Strapi) for blog/resources
**Analytics:** Mixpanel + GA4 + Hotjar
**CRM:** HubSpot
**Email:** Postmark
**Maps:** Mapbox GL JS
**Data Viz:** D3.js or Observable Plot

---

## SEO Strategy

### Primary Keywords
- "water rights monitoring"
- "water lease alerts"
- "water transfer notifications"
- "Colorado water rights"
- "Rio Grande water rights"
- "water rights intelligence"

### Content Clusters
1. Basin-specific intelligence (landing pages per basin)
2. Regulatory change impacts
3. Research methodology (academic search traffic)
4. Government procurement

---

## Related Files

- `LANDING_PAGE_SPECS.md` — Focused conversion page for free report
- `../rain-research-fund/RESEARCH_CONCEPT.md` — Academic foundation
- `../rain-research-fund/COMMERCIALIZATION_STRATEGY.md` — Government sales alignment
- `assets/copy/` — Final copy for all pages
- `assets/images/` — Photography, diagrams, icons

---

*Last Updated: 2026-04-04*
*Owner: RAIN Marketing Team*
*Status: Draft — Architecture Complete, Content in Progress*
