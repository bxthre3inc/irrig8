# Automated Kennel System — SPEC.md

## 1. Concept & Vision

**Product:** Self-cleaning, climate-controlled pet boarding kennels with an integrated software dashboard for facility managers.

**Mission:** Eliminate the most labor-intensive and error-prone aspects of kennel operations — cleaning, feeding, and environmental control — while giving operators real-time visibility and auditability over every kennel in their facility.

**Positioning:** Hardware-software integrated system. Not just "fancy kennels" — a full operating layer for boarding facilities. Competes with manual cleaning/feeding workflows and legacy timer-based systems.

**Target users:**
- Facility managers (primary dashboard users)
- Staff (operate the physical system)
- Pet owners (optional: receive notifications, check on pets)

---

## 2. Layout

```
[ Kennel 1 ] [ Kennel 2 ] [ Kennel 3 ] [ Kennel 4 ] ...
    |           |           |           |
    +-----------+-----------+-----------+
                    |
              [ SHARED YARD ]
           (group play / exercise area)
```

- Kennels face the same direction, arranged in a row or bank
- Shared yard behind the kennel row (accessible via individual kennel doors)
- Central utility corridor behind kennels for plumbing, wiring, feed/water lines
- Nursing/bathing station located at one end of the kennel row as a dedicated zone

---

## 3. Core Features

### 3.1 Self-Cleaning System

**Car wash style cycle:**
1. Pre-rinse (low pressure, lukewarm water)
2. Pressurized wash (heated water + approved disinfectant solution)
3. Disinfectant dwell time (hold, no rinse — contact time per product spec)
4. Fresh water rinse (remove residue)
5. Squeegee dry (mechanical blade sweep, optional heated air assist)
6. UV sanitization step (optional, for facilities requiring enhanced pathogen control)

**Triggers:**
- Manual trigger via dashboard
- Scheduled (e.g., every 4 hours or between guest check-outs)
- Automatic between departing guest and incoming guest (gapped time > X hours)

**Controls per kennel:**
- Enable/disable the auto-cycle
- Adjust solution concentration
- Set dwell time

### 3.2 Heated Floors/Pads

- Radiant heating element embedded in or beneath kennel floor
- Per-kennel thermostat
- Dashboard control: setpoint temperature, on/off scheduling
- Safety: auto-off if floor temp exceeds safe threshold

### 3.3 Automated Feeding

- Portion-controlled dispenser mounted on or near each kennel
- Schedule-based dispensing (e.g., 7am, 12pm, 6pm)
- On-demand trigger via dashboard or API
- Log every feeding event (timestamp, portion size, kennel ID)
- Support for multiple food types (dry, wet — separate compartments)

### 3.4 Automated Watering

- Fresh water dispenser per kennel (bowl or trough style)
- Auto-refill when level drops below sensor threshold
- Flushing cycle to prevent stagnant water (run fresh water through line X times per day)
- Log water dispense events

### 3.5 Nursing / Bathing Station

- Separate dedicated table/area not part of the kennel bank
- Drains and plumbing for wet work
- Grooming equipment hookups (water hose, air dryer)
- Secure restraint points
- Optional: integrated scale, exam lighting
- **Not automated** — manually operated by staff; available on-demand

### 3.6 Software Dashboard

**Facility Manager View:**
- Grid overview of all kennels (occupancy status, current pet, last cleaned, next scheduled clean)
- Per-kennel detail panel: temperature, feeding schedule, water status, cleaning cycle status
- Pet profiles: name, owner, dietary needs, medical notes, photo
- Cleaning cycle scheduling (global default, per-kennel override)
- Feeding schedule management (global defaults, per-pet dietary profiles)
- Activity logs: all events timestamped (cleaning cycles, feedings, water dispenses, temperature excursions)
- Alerts: high/low temperature, missed feedings, cleaning failures, low water supply
- Staff accounts & permissions (manager vs. staff roles)

**Pet Owner View (optional MVP scope):**
- Simple portal showing pet's last feeding, last cleaning, current temperature setting
- Push notifications (optional: pet arrived, pet fed, cleaning complete)

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────┐
│           SOFTWARE DASHBOARD (Cloud / On-Prem)       │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐         │
│  │ Facility │ │  Pet     │ │  Alerting  │          │
│  │ Manager  │ │ Profiles │ │  Engine    │          │
│  └────┬─────┘ └────┬─────┘ └─────┬──────┘          │
│       │            │             │                 │
│  ┌────┴────────────┴─────────────┴────┐             │
│  │         REST API / MQTT Broker     │             │
│  └────────────────┬──────────────────┘             │
└───────────────────┼───────────────────────────────┘
                    │ (WiFi / Ethernet)
        ┌───────────┼───────────┐
        │           │           │
┌───────▼────┐ ┌───▼───────┐ ┌▼────────┐
│ Kennel 1   │ │ Kennel 2  │ │ Kennel N │
│ Controller │ │ Controller│ │ Controller│
│            │ │           │ │          │
│ - MCU      │ │ - MCU     │ │ - MCU    │
│ - Solenoid │ │ - Solenoid│ │ - Solenoid│
│ - Pump     │ │ - Pump    │ │ - Pump   │
│ - Heater   │ │ - Heater  │ │ - Heater │
│ - Feeder   │ │ - Feeder  │ │ - Feeder │
│ - Water    │ │ - Water   │ │ - Water  │
│   sensor   │ │   sensor  │ │   sensor │
└────────────┘ └───────────┘ └──────────┘

Hardware Control Layer (per-kennel):
  - Primary MCU (e.g., ESP32 or similar) with WiFi
  - Solid-state relay or motor driver board for:
      • Pump (water supply valve)
      • Solenoid (cleaning solution injection)
      • Squeegee motor
      • Feeder dispenser stepper motor
      • Heater element relay
  - Sensors:
      • Water level sensor (bowl and reservoir)
      • Temperature probe (floor surface, ambient)
      • Flow meter (water dispensed)
      • Door sensor (open/close state)
  - Manual override: physical buttons on kennel unit for staff emergency stop
```

---

## 5. Key Components

### Hardware

| Component | Purpose | Notes |
|-----------|---------|-------|
| Kennel frame / enclosure | Pet housing | Stainless steel or coated steel for cleanability |
| Floor with radiant heating | Comfort, sanitation | Sealed surface, heat element beneath |
| Cleaning system (pump, nozzles, hose, squeegee) | Auto-clean | Car wash-style spray architecture |
| Water reservoir + pump | Cleaning + watering | Sized for facility capacity |
| Feeder dispenser | Scheduled feeding | Portion-calibrated, tamper-resistant |
| Water bowl + level sensor | Drinking water | Auto-refill, low-pressure flush |
| Per-kennel MCU + relay board | Local control | WiFi-connected, offline-capable |
| Emergency stop button | Safety | Hardwired, overrides software |
| Nursing/bathing station | Medical/grooming | Separate from automated kennel bank |

### Software

| Component | Purpose | Notes |
|-----------|---------|-------|
| Facility dashboard (web app) | Central UI | Responsive, role-based |
| REST API | Data plane | Kennel state, schedules, profiles |
| MQTT broker (optional) | Real-time events | Cleaning alerts, temperature excursions |
| Pet profile database | Guest management | Per-pet dietary/medical data |
| Event log / audit trail | Compliance, accountability | All actions timestamped and traceable |
| Alert engine | Notifications | PagerDuty-style escalation for critical failures |

---

## 6. MVP Scope

### In Scope (MVP)

- **3–5 kennels** in a single bank (one facility)
- **Per-kennel controller** (ESP32-based) with cleaning, heating, feeding, water
- **Facility manager dashboard** (single-tenant, browser-based)
- **Core operations:** manual cleaning trigger, scheduled cleaning, feeding schedules, floor heating control
- **Basic pet profiles:** name, owner, photo, dietary notes
- **Activity logs:** all cleaning cycles, feedings, temperature readings
- **Alerts:** high/low temperature, missed cleaning cycle
- **On-premises deployment** (no cloud required — local server / Raspberry Pi as hub)

### Out of Scope (Post-MVP)

- Multi-facility management (single dashboard, single location)
- Pet owner portal / notifications
- UV sanitization step
- Wet feed support (canned food dispensers)
- Billing / reservation integration
- Mobile app
- Cloud sync / SaaS dashboard

---

## 7. Naming

**Work-in-progress names to explore:**

| Name | Notes |
|------|-------|
| Kenneli | Clean, short, suggests care |
| AutoKen | Descriptive, direct |
| KenLoop | Loop = recurring cycles, clean loop |
| PetLoop | Broader pet angle |
| KenFlow | Flow = water, workflow, continuous |
| AutoKennel | Literal but clear |
| KennelPro | Professional grade |
| KenBot | Implies automation, but less serious tone |

**Decision:** Name selection deferred until branding work begins. All subsequent docs and artifacts to use `AutoKen` or `[KENNEL SYSTEM]` as placeholder until branded.

---

## 8. Open Questions

1. **Water sourcing:** Central reservoir fed by facility water supply, or per-kennel tanks? Central simplifies refilling; per-kennel adds redundancy.
2. **Disinfectant solution:** What class of chemicals is approved for use in pet facilities in target markets? This drives solution selection and nozzle material requirements.
3. **Power recovery:** If power is lost mid-cleaning cycle, does the system resume? Partial flush of chemicals on the floor could be a safety issue.
4. **Offline operation:** If WiFi drops, does the kennel continue its scheduled cleaning/feeding? Local autonomy vs. central control trade-off.
5. **Feeding precision:** What portion sizes are needed? Small dogs vs. large dogs — one dispenser size or calibrated per kennel?
6. **Kennel size variants:** Single-size kennel or small/medium/large variants? MVP may fix one size.
7. **Staff override granularity:** Can staff disable auto-cleaning for a specific kennel (e.g., anxious dog present)? Can they trigger a cleaning at will?
8. **Installation footprint:** What are the plumbing/electrical requirements for retrofit vs. new construction?
9. **Regulatory compliance:** Are there FDA, USDA, or state veterinary board requirements for cleaning protocols in boarding facilities?
10. **Pricing model:** Hardware sale + software subscription? One-time hardware + perpetual license? Hardware as a service (monthly lease)?