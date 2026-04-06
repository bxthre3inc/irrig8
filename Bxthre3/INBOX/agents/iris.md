# IRIS INBOX — April 6, 2026

## 🔴 P0 ACTIVE: Investor Protector Dashboard — PARALLEL MODE

**Status:** ACCELERATED — building NOW with mock data, not waiting for Dev

---

## NEW APPROACH: Parallel Tracks (Not Sequential)

| Track | What | Status |
|-------|------|--------|
| **A** | UI with MOCK data | STARTING NOW |
| **B** | Real API | Dev builds in parallel |
| **C** | Integration | Swap mocks for real API when ready |

---

## TODAY'S DELIVERABLE (April 6)

Build `/investor` dashboard with:
1. **Static JSON mock** representing ideal state
2. **All UI components** — charts, metrics, tables
3. **Responsive layout** — mobile + desktop

**Mock data structure:**
```json
{
  "snapshot_date": "2026-04-06",
  "velocity_score": 99.7,
  "p0_completed_7d": 2,
  "p1_completed_7d": 867,
  "funding_pipeline": {
    "submitted": 3,
    "pending": 7,
    "approved": 0
  },
  "metrics": {
    "execution": {"score": 99.7, "trend": "up"},
    "artifacts": {"docs": 1676, "code": 218, "ratio": 2.67},
    "costs": {"monthly": 127, "trend": "flat"},
    "verification": {"auditable": 87, "total": 87}
  }
}
```

---

## DESIGN SPECS (Copy from existing)

**Layout:**
- Dark theme (#0f172a background)
- Accent: #00d4ff (cyan)
- Grid: 3-column main + sidebar

**Sections:**
1. **Header** — Logo, date selector, "Export Report" button
2. **Scorecard row** — 4 cards: Velocity, Deliverables, Costs, Verification
3. **Trend charts** — Velocity 30-day sparkline, P0/P1 burn-down
4. **Active projects** — Table with status, last update, blockers
5. **Funding tracker** — Pipeline visualization
6. **Audit trail** — Last 5 verifiable actions with hashes

---

## DO NOT WAIT FOR

- [ ] Real API from Dev
- [ ] Live data sources
- [ ] Theo deployment review

**SHIP MOCK VERSION TODAY.** We'll swap data sources later.

---

## ACCEPTANCE CRITERIA

- [ ] Dashboard renders at `brodiblanco.zo.space/investor`
- [ ] All 6 sections visible
- [ ] Mobile responsive
- [ ] Export to PDF button (mock)
- [ ] Auto-refresh every 60s (mock data rotates)

**Deadline: April 6, 11:59 PM MT**

---

*Accelerated mode: Build the airplane while flying it.*