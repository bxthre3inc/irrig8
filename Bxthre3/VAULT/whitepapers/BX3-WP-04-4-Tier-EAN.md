# BX3 White Paper #4
## 4-Tier Enforcement Access Network: Deterministic Resolution-Gated Data Architecture

| Field | Value |
|-------|-------|
| **White Paper ID** | BX3-WP-2026-04 |
| **Patent Reference** | Provisional Patent #4 — 4-Tier EAN |
| **Pillar** | Pillar 3: Spatial Firewall |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |

---

## 1. Executive Summary

Data access in precision agriculture has a fundamental structural flaw: resolution is treated as a software permission, enforced by code that can be bypassed, modified, or exploited. When a high-resolution satellite imagery license costs $50,000 per season and a compromised edge agent can scrape that imagery at 1-meter resolution without authorization, the security model has already failed. The permission layer is the wrong place to enforce data access. Permissions can be changed. Permissions can be misconfigured. Permissions can be exploited.

**The 4-Tier Enforcement Access Network (EAN)** treats spatial resolution as a physical property of the Fact Layer — enforced not by software permissions but by the structure of the data architecture itself. A node provisioned at 50-meter resolution cannot access 1-meter data because the data architecture physically does not serve that data to that node. The gate is not a lock on the door; the gate is the absence of the door.

This is the difference between security through policy and security through architecture.

---

## 2. The Problem: Permission-Based Data Security Fails at Scale

### 2.1 The Permission Model Is a Liability

In conventional precision agriculture platforms:

- Field scouts access 10-meter resolution NDVI through a web dashboard
- Agronomists access 5-meter multispectral imagery through a professional tier
- Farm managers access 1-meter commercial satellite imagery through an enterprise license
- The underlying data warehouse contains all resolutions in the same database

This creates a single point of failure: the permission system. When a malicious or compromised actor gains access to any credentialed account, they can traverse from their authorized tier into the raw data warehouse and extract any resolution they want. The tiered pricing model is not a security boundary — it is a business model.

### 2.2 The Scraping Attack

The canonical attack against permission-based agricultural data systems:

1. Attacker subscribes to the 50-meter free tier
2. Attacker identifies API endpoints that serve higher-resolution data (often discoverable through client-side code inspection)
3. Attacker crafts API calls with spoofed credentials or session tokens
4. High-resolution imagery extracted at marginal cost
5. IP protection of crop stress detection models undermined — competitors access proprietary analytics

Current mitigations (rate limiting, token expiration, IP allowlisting) are reactive. They slow attackers but do not stop them.

### 2.3 The Structural Flaw

The fundamental problem is architectural: the permission layer and the data layer share the same plane. The system authenticates who you are, then serves you from the same data store that contains everything. Authentication is not authorization. A valid credential on a compromised account is indistinguishable from an authorized credential.

---

## 3. The BX3 Solution: Resolution-Gated Architecture

### 3.1 Core Principle

The 4-Tier EAN operates on a single architectural principle: **data at a given resolution exists only in the Fact Layer gate that is authorized to serve it.** There is no unified data warehouse containing all resolutions. There are four discrete data planes, each physically isolated from the others, each served exclusively by its corresponding Fact Layer gate.

A node at Tier 1 cannot query Tier 2 data because Tier 2 data does not exist in the Tier 1 data plane. The gate is not checking credentials — the gate is the structural absence of the higher-resolution data plane at the lower tier.

### 3.2 The Four Tiers

| Tier | Label | Resolution | Data Plane | Authorized Actors |
|------|-------|-----------|-----------|------------------|
| Tier 1 | Free | 50m | Global context mosaic | Public-facing dashboards, scouting apps |
| Tier 2 | Basic | 20m | Regional field composite | Paying growers, entry-level subscribers |
| Tier 3 | Pro | 10m | High-frequency field scan | Agronomists, professional consultants |
| Tier 4 | Enterprise | 1m | Full resolution capture | Enterprise operations, multi-field portfolios |

### 3.3 The Deterministic Funnel

When a node or Bounds Engine requests data at a resolution beyond its provisioned tier:

**Conventional response:** "Permission Denied" — logged, surfaced to user, creates friction and support tickets

**BX3 response (Deterministic Funnel):**
1. **Interception:** Fact Layer intercepts the request at the database level
2. **Evaluation:** Requested resolution compared against node's provisioned tier
3. **Trigger:** If tier mismatch detected — Fact Layer initiates automated commercial handshake
4. **Resolution:** The request itself initiates a provisioning workflow — tier upgrade offered, executed atomically upon payment confirmation
5. **Result:** The node is automatically upgraded to the tier it attempted to access

Growth is a system rule, not a sales task. Data access and commercial upgrade are the same event.

### 3.4 Physical Isolation Mechanism

Each tier operates from a physically isolated data plane:

```
Tier 1 Plane (50m)  ← MongoDB cluster A (public)
Tier 2 Plane (20m)  ← MongoDB cluster B (authenticated)
Tier 3 Plane (10m)  ← MongoDB cluster C (enterprise)
Tier 4 Plane (1m)   ← MongoDB cluster D (on-premise or dedicated cloud)
```

Cross-plane queries are not permitted at the database level. A Tier 1 node's MongoDB driver cannot connect to Cluster B, C, or D — connection strings for higher-tier clusters are not present in its configuration. The isolation is enforced by the absence of connectivity, not by access control lists.

---

## 4. Technical Specifications

### 4.1 Node Provisioning

Each node is provisioned at a specific tier at manufacture/deployment:

```json
{
  "node_id": "HUB-P1-042",
  "tier": "TIER_2",
  "resolution_authorized_m": 20,
  "data_plane_uri": "mongodb://cluster-b.internal.bx3",
  "upgrade_eligible": true,
  "upgrade_trigger": "auto"
}
```

### 4.2 Resolution Request Protocol

1. Bounds Engine generates data request with `target_resolution_m` parameter
2. Request routed to local Fact Layer gate
3. Gate compares `target_resolution_m` against `node.tier.resolution_authorized_m`
4. If `target_resolution_m < resolution_authorized_m`: block and trigger Deterministic Funnel
5. If `target_resolution_m >= resolution_authorized_m`: forward to data plane, return result
6. All events logged in Ledger

### 4.3 Tier Upgrade Flow

```
Attempted Access (1m request from Tier 2 node)
    ↓
Fact Layer Intercepts
    ↓
Deterministic Funnel Triggered
    ↓
Commercial handshake initiated (Stripe or equivalent)
    ↓
Payment confirmed
    ↓
Node.tier upgraded atomically
    ↓
Original request re-submitted and fulfilled
    ↓
Ledger records: original request, tier upgrade, fulfillment
```

---

## 5. Product Application

### 5.1 Irrig8 Multi-Tier Platform

Irrig8 serves operations ranging from smallholder single-pivot farms to enterprise multi-pivot portfolios. The 4-Tier EAN allows a single platform to serve all tiers without cross-tier data exposure:

- Small farms (Tier 1/2): Full irrigation decision support at operational resolutions
- Enterprise (Tier 4): Full-resolution analytics plus proprietary model inputs
- Agronomists (Tier 3): Professional-grade imagery for consulting engagements
- Public researchers (Tier 1): Aggregate trend data for regional water management

### 5.2 AgentOS Data Governance

AgentOS manages agents serving multiple enterprises. The 4-Tier EAN ensures that an agent serving a Tier 2 client cannot access Tier 4 data from a different client even if the agent is compromised. Each client environment is a separate Fact Layer with its own tier provisioning.

---

## 6. Claims / IP Position

1. **Resolution-Gated Data Architecture** — a physically isolated multi-tier data architecture in which spatial resolution access is enforced by the structural absence of higher-resolution data planes at lower-tier nodes, rather than by software permission systems

2. **Deterministic Commercial Funnel** — a method for automated commercial tier upgrade triggered by attempted access to data beyond a node's provisioned resolution tier, wherein the access attempt and the commercial transaction are the same event

3. **Cross-Tenant Data Isolation via Tier Architecture** — a multi-tenant data governance system in which each tenant's data plane access is structurally bounded by their provisioned resolution tier, preventing cross-tenant data exfiltration regardless of credential compromise

---

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*
