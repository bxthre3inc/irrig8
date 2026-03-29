# Hardware Integrity & Actuation Protocol: The \"Physical Hand\"

## 1. The Actuation Loop: Beyond the \"Worksheet\"

The **DEM (Worksheet)** provides the instruction, but the **Hub** must
provide the **Verification**. For the June 29th Trial, \"Intent\" isn\'t
enough; we need \"Execution.\"

### 1.1 Closed-Loop Feedback (The Pulse)

When the Hub executes a command from the DEM (e.g., OPEN_VALVE_A), it
does not assume success. It initiates a three-stage hardware check:

1.  **Electronic Confirmation:** Verify the solenoid/actuator drew the
    > expected current (detects wire cuts or blown fuses).

2.  **Hydraulic Confirmation:** Verify a change in the **Telemetric
    > Endpoint (Flow Meter)** data within 30 seconds of actuation.

3.  **State-Locking:** Only after hydraulic confirmation is the event
    > written to the **IRP Ledger**.

## 2. The \"Handshake\" of the Three Nodes

To guarantee the hardware works, we rely on a specialized communication
hierarchy:

  --------------------------------------------------------------------------
  **Device**              **Responsibility**      **Hard-Link Guarantee**
  ----------------------- ----------------------- --------------------------
  **Sensor (TE)**         Raw Acquisition         Uses **Sub-GHz
                                                  Long-Range** to punch
                                                  through dense crop
                                                  canopies where
                                                  Wi-Fi/Bluetooth fail.

  **Relay (DAN)**         Concentration           Maintains a **Local
                                                  Volatile Buffer**. If the
                                                  Hub is busy, the Relay
                                                  holds the data so no
                                                  \"moisture spikes\" are
                                                  missed.

  **Hub (ECG)**           The Executioner         Equipped with a
                                                  **Supercapacitor/Battery
                                                  Backup**. If the farm
                                                  loses power, the Hub has
                                                  enough juice to \"Safe
                                                  State\" the valves and
                                                  write the final log to
                                                  flash.
  --------------------------------------------------------------------------

## 3. Hardware \"Sovereignty\" (The Anti-Tamper)

If a regulator claims the farmer manually bypassed the system to steal
water, the hardware must prove otherwise.

-   **Physical Seal:** The Hub enclosure uses an internal light sensor
    > or magnetic reed switch. If the box is opened, a \"Tamper Event\"
    > is immediately hashed into the **IRP Ledger**.

-   **Manual Override Detection:** The Hub monitors the valve state. If
    > the valve opens without a **DEM command**, the Hub logs an
    > \"Unauthorized Actuation\" event. This protects the **QCV
    > Report\'s** integrity.

## 4. The \"Worksheet\" Execution Environment

The Hub doesn\'t run a full OS like Windows; it runs a **Minimalist
Deterministic Runtime**.

-   **Logic Isolation:** The actuation code is separated from the
    > communication code. Even if the LTE modem crashes, the
    > valve-control logic continues to pulse.

-   **Watchdog Timers:** A hardware \"Heartbeat\" monitor. If the
    > software freezes for more than 500ms, the hardware physically
    > resets the processor to a known good state.

## 5. Deployment Reality Check (The \"Mud\" Factor)

To ensure this works in Monte Vista, CO:

-   **Thermal Management:** Components rated for **-40°C** for winter
    > storage and **+85°C** for summer heat inside a poly-box.

-   **Surge Protection:** Every sensor line is optically isolated or
    > TVS-diode protected against the San Luis Valley\'s
    > lightning/static.
