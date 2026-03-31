# Solutions Engineering — Department INBOX

**Role:** Technical Pre-Sales, POC Management, Demo Environments  
**Head:** Architect (Solutions Engineer)  
**Reports to:** Deal (VP Sales), Bits (CTO)  
**Ventures Covered:** Irrig8, The Starting 5, Zoe, Valley Players Club

---

## 2026-03-30 — Standup (8:15 AM MT)

### Pre-Sales Pipeline (from Deal's deal-pipeline.csv)

#### 🔴 P1 — Active Technical Close

| Deal ID | Entity | Stage | Technical Focus | Next Step |
|---|---|---|---|---|
| VPC-CP-001 | Sage (Founding Cash Partner) | Term Sheet | Cash partnership structure, equity math, take-rate mechanics | Sage delivers mark-up — 2026-03-27 (OVERDUE) |
| IRR-DIST-001 | Valley Irrigation | Researched | Pivot manufacturer integration, dealer network API | Intro call with dealer network |
| IRR-DIST-002 | Reinke | Researched | Distribution partnership specs | Intro call with dealer network |
| IRR-DIST-007 | USDA NRCS | Active | EQIP vendor enrollment — GO/NO-GO needed this week | Grant pathway + credibility |
| IRR-FARM-001 | Maverick Potato Co | Targeted | Pilot — 2,500+ acres organic, tech adopter | Intro outreach |
| IRR-FARM-002 | Skyline Potato Co | Targeted | Pilot — 3,000+ acres, 3 facilities | Intro outreach |
| IRR-FARM-007 | Jessica Bradshaw / CPAC | Contacted | Gatekeeper to SLV potato community (52K acres) | Verify email + intro call |

#### 🟡 P2 — Technical Discovery Needed

| Deal ID | Entity | Technical Focus |
|---|---|---|
| IRR-DIST-006 | Planet Labs | Satellite data feed — dev API access needed |
| IRR-FARM-003 | Mix Farms | Qualifying call — 800+ acres |
| IRR-FARM-004 | Proximity Malt Colorado | Partnership explore — malt house integration |
| IRR-FARM-005 | Subdistrict 1 / RGWCD | Aggregated 500+ acres, 3,000+ wells |
| VPC-CP-002/003 | TBD Cash Partners x2 | Same structure as VPC-CP-001 |

### Demo Environment Status

| Environment | Status | URL/Location | Notes |
|---|---|---|---|
| Irrig8 | 🟢 Live | `brodiblanco.zo.space` (Irrig8 routes) | Web UI operational |
| AgentOS | 🟢 Live | `brodiblanco.zo.space/aos` | 6 tabs, private auth |
| VPC | 🟡 CI remediation | VPC project dir | 2 failing checks — due today |
| Starting 5 | 🟡 Planning | Architecture spike blocked | Primitives definition needed |
| Zoe | 🟢 Live | `brodiblanco.zo.space` | Zo Computer core |

### Integration Architecture Reviews Needed

| Deal | Integration Type | Status |
|---|---|---|
| Valley Irrigation / Reinke | Farm management system API | Awaiting first contact |
| Planet Labs | Satellite data feed | Dev API access request needed |
| USDA NRCS | EQIP enrollment system | GO/NO-GO pending from brodiblanco |
| Maverick/Skyline pilots | Sensor/IoT integration | Pre-POC technical discovery |
| VPC Sage | Cash partnership docs | Legal mark-up overdue |

### Open RFPs/RFIs

*TBD — none filed yet*

### Blockers

| Blocker | Owner | Resolution |
|---|---|---|
| VPC CI pipeline (2 failures) | Drew | Due today 2026-03-30 |
| mcp-mesh-control-plane 502 | Dev | Investigation needed |
| zo.space node_modules corruption | Theo | `restart_space_server` |
| BUILDBZ 8 TBD fields | brodiblanco | Say "promote to spec" or complete fields |

### Today's Actions

1. **IRR-DIST-007 (USDA NRCS):** EQIP vendor enrollment — GO/NO-GO decision needed this week
2. **IRR-DIST-006 (Planet Labs):** Request dev API access for Irrig8 satellite imagery
3. **VPC-CP-001 (Sage):** Confirm doc mark-up status — was due 2026-03-27
4. **IRR-FARM-007 (CPAC):** Verify Jessica Bradshaw email + schedule intro call

---

## Pipeline Summary (by Venture)

| Venture | P1 Deals | P2 Deals | Key Technical Gate |
|---|---|---|---|
| Irrig8 | 5 | 4 | Farm system API integration |
| VPC | 1 | 2 | CI remediation + cash partner docs |
| Starting 5 | 0 | 1 | Architecture spike — primitives undefined |
| Zoe | 0 | 0 | N/A — internal reference impl |

---

*Last updated: 2026-03-30 08:10 MT*
