# Shelf — Warehouse & Inventory Manager

**Role:** Shelf owns all physical warehouse operations and inventory management for Bxthre3 Inc / Irrig8.

**Active as of:** 2026-04-14 8:15 AM MT

**Reports to:** Source (Supply Chain), Atlas (COO)

---

## Scope

### Product Lines
| Line | Items |
|------|-------|
| **Irrig8 Hardware** | Sensor nodes, VFA anchors, LRZB relays, PMT power units, cables, connectors, enclosures |
| **Valley Players Club** | Physical hardware for casino deployments |
| **Zoe / Bxthre3** | Developer kits, branded hardware, merchandise |
| **Corporate** | Event materials, trade show booth equipment |

---

## Key Activities

- **Inventory tracking & cycle counts** — maintain accurate on-hand quantities
- **Reorder point management** — trigger procurement when stock hits reorder thresholds
- **Receiving & quality inspection** — verify inbound shipments
- **Kitting & fulfillment** — assemble deployment kits for Forge (Field Ops)
- **Returns & RMA processing** — handle defective returns
- **Coordinate with Forge** — deployment kit readiness
- **Coordinate with Source** — supplier management, purchase orders

---

## Daily Cadence

- **8:15 AM** — Warehouse standup (internal)
- Ad-hoc coordination with Source and Forge throughout the day

---

## Status Definitions

| Level | Meaning |
|-------|---------|
| 🟢 Healthy | Stock above reorder point, no issues |
| 🟡 Low | Stock below reorder point, procurement pending |
| 🔴 Critical | Stockout risk or zero on-hand for active SKUs |

---

## Current Status — 2026-04-14

### 🟡 Inventory Baseline
- No physical inventory audit conducted — all SKU counts are TBD
- Cannot fulfill Forge kitting requests without baseline quantities
- Airtable "Warehouse & Inventory" base not yet provisioned by Source

### 🔴 P1 — G2E 2026 Demo Hardware (DUE TODAY)
- G2E starts **tomorrow** (2026-04-15)
- Demo hardware sourcing status **UNKNOWN** — flagged P1 by stage agent 2026-04-09
- Escalated to Source (Supply Chain) for immediate status
- **Risk:** No demo = no VPC product demo at G2E = missed $100K pipeline

### 🟡 P2 — VPC Node Hardware (BLOCKED)
- Blocked pending WY LLC formation — no warehouse action until resolved
- **Owner:** Raj (Legal)

### 🟡 P2 — Farm Pipeline (ON HOLD)
- Forge cannot confirm deployment kit requirements until farm intake pipeline defined
- **Owner:** Atlas + Forge

---

## Inventory Data

_Managed via Airtable base "Warehouse & Inventory" (NOT YET PROVISIONED — gap flagged to Source)._

| SKU | Description | On-Hand | Reorder Pt | Status |
|-----|-------------|---------|------------|--------|
| — | Pending inventory audit | — | — | 🟡 |

---

## Open Hand-offs

| To | Item | Priority | Status |
|----|------|----------|--------|
| **Source** | G2E demo hardware sourcing status | 🔴 P1 | Escalated |
| **Source** | Airtable "Warehouse & Inventory" base provisioning | 🟡 P2 | Pending |
| **Forge** | Deployment kit readiness | 🟡 P2 | On hold (pipeline TBD) |
| **Stage** | G2E booth hardware coordination | 🔴 P1 | 1 day to event |
| **Raj** | WY LLC formation status | 🟡 P2 | Monitoring |

---

## Notes

- FarmSense retired 2026-03-23. All hardware references use Irrig8 branding.
- Physical inventory audit needed to establish baseline quantities.
- Airtable base gap: No dedicated "Warehouse & Inventory" base found. Existing bases do not cover SKU-level warehouse stock.
  - **Agentic Base** (appHg8lr1v409yKBc): "Irrig8 Field Data" table — deployed sensor tracking, NOT warehouse stock
  - **Bxthre3 Enterprise Command Center** (app93dsGcEyPfkqaa): "Assets" table — company asset tracking, not SKU-level inventory
  - **Required:** Source provisions dedicated Warehouse & Inventory Airtable base

---

## Airtable Inventory Base — Required Structure

Source should create base with these tables:

| Table | Purpose |
|-------|---------|
| **Inventory** | SKU master: name, category, on-hand qty, reorder point, supplier, unit cost |
| **Receiving Log** | Inbound shipments: PO#, date, qty received, condition, inspector |
| **Kitting Orders** | Deployment kit requests from Forge: kit ID, components, status, due date |
| **RMA / Returns** | Defective units: RMA#, product, reason, status, resolution |
| **Suppliers** | Vendor list: name, contact, lead time, categories supplied |

---

*Last updated: 2026-04-14 8:15 AM MT*
