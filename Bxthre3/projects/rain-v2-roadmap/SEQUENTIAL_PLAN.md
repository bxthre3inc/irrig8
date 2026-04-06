# V2 RAIN Sequential Product Roadmap

> **Sequential-Thinking Approach**: Each version builds on the previous. No skipping. No parallel tracks. Ship → Learn → Iterate.

---

⚠️ **DO NOT BUILD — PENDING BX3 APPROVAL**

---

## Overview

V2 RAIN is a fully self-contained weather intelligence platform delivering rain and weather alerts via SMS. This roadmap uses **sequential-thinking**: each version must ship and stabilize before the next begins.

---

## Pre-V2 Assessment Phase

Before any V2.0 development begins, the following assessments must be completed and reviewed:

### Required Evaluations

1. **V1 Monetization Optimization** — Analyze what's working and what's not in the current RAIN system
   - Current revenue streams performance
   - Subscriber conversion rates
   - Churn analysis and patterns
   - Pricing model effectiveness

2. **Subscriber Feedback Collection** — Gather direct input from current users
   - Survey existing subscribers on feature priorities
   - Interview high-value/long-term users
   - Analyze support tickets and common requests
   - Identify pain points in current experience

3. **Data Source Reliability Audit** — Verify weather data dependencies
   - NWS API uptime and latency metrics
   - Backup data source options evaluated
   - Data accuracy validation
   - Rate limiting and cost analysis

4. **Competitive Landscape Check** — Understand market position
   - Direct competitors analysis (price, features, market share)
   - Indirect alternatives (free apps, weather services)
   - Differentiation opportunities
   - Market size and growth projections

5. **Technical Debt in Current RAIN System** — Assess V1 codebase
   - Known bugs and stability issues
   - Refactoring needs vs. rewrite decision
   - Infrastructure limitations
   - Security vulnerabilities

6. **Resource Availability** — Confirm capacity to execute
   - Engineering time allocation
   - Capital requirements for build + 6 months runway
   - Team availability (dev, design, ops)
   - Opportunity cost vs. other projects

### Assessment Deliverables

- [ ] Written summary of each evaluation area
- [ ] Go/No-Go recommendation with rationale
- [ ] If GO: prioritized V1 enhancements to complete first
- [ ] If GO: updated timeline and resource plan
- [ ] BX3 approval signature (explicit)

---

## V2.0 — Core SMS Service (MVP)

**Goal**: Working SMS weather alerts in production.

### Scope (What's IN)
- User signup via SMS keyword (`RAIN` → +1-XXX-XXX-XXXX)
- Single data source: National Weather Service API
- Basic rain/storm alerts for user zip code
- Stripe checkout for one pricing tier only
- Simple subscription status tracking (active/inactive)
- Daily digest option (morning brief)
- Opt-out via `STOP` keyword

### Dependencies
- SignalWire account + phone number provisioned
- Stripe Connect account active
- NWS API integration tested
- Basic subscriber database (SQLite/PostgreSQL)

### Success Metric
- 50 paid subscribers within 30 days of launch
- <5% churn in first month
- 99% SMS delivery rate

### Estimated Build Time
- **2 weeks**
- Week 1: SMS service, NWS integration, database
- Week 2: Stripe billing, signup flow, deployment

> **⚠️ V2.0 build BLOCKED until approval received.**

---

## V2.1 — Multi-Tier Pricing

**Goal**: Monetize engagement levels with tiered options.

### Scope (What's IN)
- Four billing frequencies:
  - Daily: $0.99/day
  - Weekly: $4.99/week
  - Monthly: $14.99/month
  - Quarterly: $39.99/quarter
- 2x upgrade: Double alerts for 2x price (any tier ×2)
- Annual discount: 25% off for yearly prepay
- Tier switching (upgrade/downgrade) in user flow
- Revenue attribution by tier

### Dependencies
- V2.0 stable in production
- Stripe Product/Price catalog for all tiers
- Billing logic handles proration

### Success Metric
- 20% of subscribers on non-daily tiers within 45 days
- 10% take annual option
- Average revenue per user (ARPU) increases 40%

### Estimated Build Time
- **1 week**
- Days 1-3: Stripe catalog + price objects
- Days 4-5: Upgrade/downgrade flows + UI

---

## V2.2 — Subscriber Management Portal

**Goal**: Reduce churn through self-service control.

### Scope (What's IN)
- Passwordless login (SMS code to phone)
- Web portal at `rain.brodiblanco.zo.space/portal`
- Preference center:
  - Alert types (rain, snow, severe, flood)
  - Alert timing (quiet hours)
  - Location management (multiple zip codes)
- Pause subscription (billing hold, 30-day max)
- Resume subscription (reactivate anytime)
- Cancel with exit survey

### Dependencies
- V2.1 stable with multi-tier billing
- Authentication system (passwordless)
- Portal UI scaffold

### Success Metric
- 60% of active subscribers use portal within 60 days
- Churn drops from 8% to 5% monthly
- 15% of cancels convert to pause instead

### Estimated Build Time
- **2 weeks**
- Week 1: Auth + portal scaffold + preferences
- Week 2: Pause/resume logic + exit survey + polish

---

## V2.3 — Free Lead Magnet

**Goal**: Capture emails, upsell to SMS.

### Scope (What's IN)
- 2026 RAIN Report: Annual weather prediction report
- Landing page: `rain.brodiblanco.zo.space/report`
- Email capture form (name, email, zip code)
- Automated PDF delivery via email
- Email nurture sequence (5 emails over 14 days)
- SMS upsell CTA in every email
- Free → paid conversion tracking

### Dependencies
- V2.2 portal + auth system
- Report content created (weather predictions)
- Email service integration (SendGrid/Resend)
- Landing page designed

### Success Metric
- 500 email signups in first 30 days
- 10% email → SMS paid conversion
- Cost per lead <$2

### Estimated Build Time
- **2 weeks**
- Week 1: Report creation + landing page + email integration
- Week 2: Nurture sequence + conversion tracking + SMS upsell flow

---

## V2.4 — Browser Extension

**Goal**: Expand touchpoint to desktop browsing.

### Scope (What's IN)
- Chrome Extension MVP
- Toolbar badge showing current alert status
- Sidebar brief: Current conditions + 3-day outlook
- Click to open full portal
- Extension-specific pricing: $2.99/month (or bundled)
- Sync with SMS subscription status

### Dependencies
- V2.3 lead magnet stable
- Chrome Web Store developer account
- Extension manifest v3 scaffold
- Portal API endpoints for extension

### Success Metric
- 200 extension installs in first 30 days
- 30% of installers also SMS subscribers
- 15% new revenue from extension-only tier

### Estimated Build Time
- **2 weeks**
- Week 1: Extension scaffold + badge + sidebar
- Week 2: Portal integration + store submission + pricing

---

## V2.5 — API Tier

**Goal**: Open platform for developers and power users.

### Scope (What's IN)
- REST API for weather data access
- Endpoints:
  - `GET /v1/alerts` — active alerts by location
  - `GET /v1/forecast` — 7-day forecast
  - `GET /v1/history` — historical weather data
  - `POST /v1/webhooks` — subscribe to alert webhooks
- Rate limiting: 100 req/day free, 10K req/day paid
- API key management (generate, revoke, rotate)
- API documentation at `rain.brodiblanco.zo.space/docs`
- Pricing: $49/month for paid tier

### Dependencies
- V2.4 extension stable
- API authentication layer (API keys)
- Rate limiting middleware
- Webhook delivery system

### Success Metric
- 50 API keys issued in first 60 days
- 10 paying API customers
- $500 MRR from API tier

### Estimated Build Time
- **3 weeks**
- Week 1: API scaffold + auth + rate limiting
- Week 2: Endpoints + webhook system + docs
- Week 3: Testing + pricing integration + launch

---

## V2.6 — Widgets + Embeds

**Goal**: Embed RAIN intelligence everywhere.

### Scope (What's IN)
- Trading desk ticker widget (live weather impact on markets)
  - Embed: `<script src="...">` or iframe
  - Configurable: location, alert types, theme
- Slack bot: `/rain` command for alerts
- Discord bot: `!rain` command + channel alerts
- Notion embed block (official integration)
- Widget builder UI in portal
- Pricing: included in all paid tiers

### Dependencies
- V2.5 API stable
- Widget iframe architecture
- Bot integration frameworks (Slack SDK, Discord.js)
- Notion integration OAuth

### Success Metric
- 100 widget embeds in first 60 days
- 50 Slack/Discord workspace installs
- 20% of new signups mention "saw widget"

### Estimated Build Time
- **3 weeks**
- Week 1: Widget scaffold + ticker + builder UI
- Week 2: Slack bot + Discord bot
- Week 3: Notion embed + testing + docs

---

## V2.7 — White-Label Partnerships

**Goal**: B2B revenue through branded deployments.

### Scope (What's IN)
- Multi-tenant architecture
- Partner onboarding flow
- Custom branding:
  - Logo, colors, domain (CNAME)
  - Custom SMS sender name (where supported)
  - Branded portal UI
- Revenue share model: 70% partner / 30% RAIN
- Partner dashboard: subscriber counts, revenue, churn
- Self-service partner signup + Stripe Connect

### Dependencies
- V2.6 widgets stable
- Multi-tenant database schema
- Partner management system
- Stripe Connect for marketplace

### Success Metric
- 5 active partners in first 90 days
- 500 subscribers across all partner brands
- $2,000 MRR from partner revenue share

### Estimated Build Time
- **4 weeks**
- Week 1: Multi-tenant schema + partner model
- Week 2: Custom branding system + CNAME
- Week 3: Partner dashboard + Stripe Connect
- Week 4: Self-service flow + testing

---

## V2.8 — Advanced Intelligence

**Goal**: AI-powered personalization and customization.

### Scope (What's IN)
- Multiple AI models for alert generation:
  - Conservative (high confidence only)
  - Balanced (default)
  - Aggressive (early warnings)
- Custom scenario builder:
  - User-defined alert rules
  - "Alert me when temp drops 20° in 2 hours"
  - "Alert me if no rain for 7 days"
- User-defined alert channels:
  - SMS, email, webhook, push
  - Per-rule channel selection
- ML-based alert timing optimization
- A/B testing framework for alert copy

### Dependencies
- V2.7 white-label stable
- AI model integration (multiple providers)
- Rule engine for custom scenarios
- ML pipeline for optimization

### Success Metric
- 40% of users enable custom rules
- 25% choose non-default AI model
- Engagement increases 50% (alerts opened/read)
- Churn drops to 3% monthly

### Estimated Build Time
- **6 weeks**
- Week 1-2: Multi-model AI integration
- Week 3-4: Rule engine + scenario builder
- Week 5: ML optimization + A/B testing
- Week 6: Polish + documentation

---

## Timeline Summary

| Version | Duration | Cumulative | Focus |
|---------|----------|------------|-------|
| V2.0 | 2 weeks | Week 2 | MVP SMS |
| V2.1 | 1 week | Week 3 | Pricing tiers |
| V2.2 | 2 weeks | Week 5 | Portal |
| V2.3 | 2 weeks | Week 7 | Lead magnet |
| V2.4 | 2 weeks | Week 9 | Extension |
| V2.5 | 3 weeks | Week 12 | API tier |
| V2.6 | 3 weeks | Week 15 | Widgets |
| V2.7 | 4 weeks | Week 19 | White-label |
| V2.8 | 6 weeks | Week 25 | AI features |

**Total: ~6 months to V2.8**

---

## Sequential-Thinking Principles Applied

1. **No skipping**: V2.2 cannot start until V2.1 is stable
2. **Ship to learn**: Each version goes to production
3. **Metrics drive go/no-go**: Success metrics must hit before next version
4. **Dependencies are real**: Each version lists actual technical dependencies
5. **Time boxes exist**: Estimated build times are commitments

---

*Last updated: 2026-04-04*
