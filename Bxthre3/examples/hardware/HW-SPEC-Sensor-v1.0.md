# HW-SPEC-Sensor-v1.0 — Soil Moisture Sensor Node
**Status:** APPROVED  
**Owner:** Hardware Lead (Current)  
**Created:** 2026-03-15  
**Updated:** 2026-04-02

---

## 1. Product Overview

Irrig8 soil moisture sensor node for center-pivot fields. Measures volumetric water content at root depth.

---

## 2. Key Specifications

| Parameter | Value | Source |
|-----------|-------|--------|
| Sensor type | Capacitive FDR | Test report [^1] |
| Range | 0-100% VWC | Datasheet [^2] |
| Accuracy | ±2% | Calibrated |
| Depth | 6" / 12" / 24" | Install spec |
| Wireless | LoRaWAN 915MHz | FCC certified |
| Battery | 3.6V Li-SOCl2, 14Ah | 5-year life |
| Enclosure | IP67, UV-resistant | NEMA rating |
| Temp range | -40°C to +85°C | Mil-STD-810G |

---

## 3. Electrical

| Parameter | Value |
|-----------|-------|
| Operating voltage | 2.5V - 3.6V |
| Sleep current | 15µA |
| Transmit current | 120mA |
| Measurement interval | configurable: 15min / 1hr / 4hr |

---

## 4. Calibration

Each sensor calibrated at factory:
- Soil types: Clay, loam, sand
- Temperature compensation: -20°C to +50°C
- Certificate included

---

## 5. BOM Components

| Item | Qty | Part Number | Supplier | Unit Cost | Source |
|------|-----|-------------|----------|-------------|--------|
| Sensor probe | 1 | EC-5 | Meter Group | $89 | Quote 2026-03 [^3] |
| MCU | 1 | STM32L072 | ST Micro | $4.20 | Digi-Key [^4] |
| LoRa module | 1 | RN2483 | Microchip | $12.50 | Mouser [^5] |
| Battery | 1 | ER26500 | Xeno | $18 | BatteryWorld [^6] |
| Enclosure | 1 | 1554LFL | Hammond | $8.50 | Digi-Key [^7] |

**Total BOM cost:** $138.20/unit

---

## 6. Certifications

- [x] FCC Part 15.247 (LoRa)
- [x] IP67 rating
- [ ] CE mark (in progress)
- [ ] USDA EQIP approved (pending)

---

*[APPROVED]* — Current + brodiblanco
