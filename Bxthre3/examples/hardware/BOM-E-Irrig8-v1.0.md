# BOM-E-Irrig8-v1.0 — Electronics Bill of Materials
**Status:** APPROVED  
**Owner:** Hardware (Current)  
**Created:** 2026-03-20  
**Updated:** 2026-04-02

---

## 1. Assembly: Sensor Node PCB

### PCB Components

| Ref Des | Qty | Description | Manufacturer | Part Number | Unit Cost | Source |
|---------|-----|-------------|--------------|-------------|-----------|--------|
| U1 | 1 | MCU ARM Cortex-M0+ | STMicro | STM32L072KZ | $4.20 | Digi-Key [^1] |
| U2 | 1 | LoRa Transceiver | Semtech | SX1262 | $8.50 | Mouser [^2] |
| Y1 | 1 | Crystal 32.768kHz | Abracon | ABS25-32.768K | $0.45 | Digi-Key [^3] |
| C1-4 | 4 | Cap 100nF 0603 | Murata | GRM188R71H104K | $0.08 | Digi-Key [^4] |
| C5 | 1 | Cap 10uF 1206 | TDK | C3216X7R1E106K | $0.32 | Mouser [^5] |
| R1-5 | 5 | Res 10K 0603 | Yageo | RC0603FR-0710KL | $0.02 | Digi-Key [^6] |
| J1 | 1 | Header 2x20 | Amphenol | 75869-110LF | $1.20 | Digi-Key [^7] |
| U3 | 1 | Voltage Regulator | TI | TPS7A02 | $1.85 | TI Direct [^8] |
| U4 | 1 | Sensor Interface | Meter Group | EC-5-IF | $12.00 | Meter [^9] |

**Subtotal PCB:** $35.87

---

## 2. Assembly: Gateway PCB

| Item | Qty | Description | Unit Cost | Source |
|------|-----|-------------|-----------|--------|
| Raspberry Pi 4 | 1 | SBC, 4GB RAM | $55 | Adafruit [^10] |
| HAT LoRa | 1 | RAK 2247 | $89 | RAK [^11] |
| Cellular Modem | 1 | Quectel EC25 | $45 | Digi-Key [^12] |
| Enclosure | 1 | DIN rail mount | $28 | Hammond [^13] |
| PSU | 1 | 24V DIN | $35 | Phoenix Contact [^14] |
| Antenna | 1 | 915MHz omni | $18 | Taoglas [^15] |

**Subtotal Gateway:** $270

---

## 3. Summary

| Component | Units | Cost/Unit | Total |
|-----------|-------|-----------|-------|
| Sensor Node PCB | 20 | $35.87 | $717.40 |
| Sensor Node Assembly | 20 | $12.00 | $240.00 |
| Gateway | 2 | $270 | $540.00 |
| **Total Electronics** | — | — | **$1,497.40** |

---

## 4. Alternatives Documented

| Item | Alternative | Why Not Chosen |
|------|-------------|----------------|
| SX1262 | RF95 | RF95 EOL confirmed [^16] |
| STM32L072 | NRF52 | BLE not needed [^17] |
| 4G | NB-IoT | Rural coverage poor [^18] |

---

*[APPROVED]* — Current + CFO (Balance)
**Version Lock:** All sources current as of 2026-03-20
