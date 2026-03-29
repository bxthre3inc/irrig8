# Functional Requirements Document: Edge Computing Gateway (ECG)

## 1. Hardware Architecture & Performance

The **Edge Computing Gateway (ECG)** must serve as the localized
execution node for the **Deterministic Execution Manifest (DEM)**. It is
designed for high-reliability operations in environments where network
backhaul is intermittent.

### 1.1 Compute & Storage

-   **Local Runtime Environment:** Must support a lightweight execution
    > engine (e.g., Python-based or C++ micro-runtime) capable of
    > parsing and executing JSON-serialized DEM decision trees.

-   **Persistent Cache:** Minimum 4GB of industrial-grade flash storage
    > to maintain a local buffer of the **Spatial Query Engine (SQE)**
    > data and a 30-day rolling log of **Immutable Resource Provenance
    > (IRP)** data.

-   **Cryptographic Module:** Dedicated hardware-based Root of Trust
    > (RoT) or Secure Element for manifest decryption and
    > state-synchronization hashing.

### 1.2 Connectivity & Networking

-   **Primary Backhaul:** Integrated 4G/5G LTE with an external
    > high-gain antenna port.

-   **Local Mesh/LPWAN:** Integrated LoRaWAN or proprietary Sub-GHz
    > radio for communication with **Telemetric Endpoints** (sensors)
    > and **Data Aggregation Nodes** (relays).

-   **Failover Logic:** Automatic detection of backhaul loss, triggering
    > immediate transition to \"Autonomous Manifest Mode.\"

## 2. Software & Protocol Requirements

### 2.1 Manifest Ingestion & Validation

-   **Handshake Protocol:** The ECG must perform a mutual TLS handshake
    > with the **Inference Engine** before accepting a new DEM.

-   **Integrity Check:** Upon receipt of a **DEM**, the ECG must verify
    > the cryptographic signature against the stored public key.

-   **Temporal Sync:** Must maintain an internal Real-Time Clock (RTC)
    > synced via NTP (when connected) or GPS pulse-per-second to ensure
    > **Temporal Bound Parameters** of the DEM are strictly enforced.

### 2.2 Local Inference Execution

-   **Threshold Monitoring:** The ECG shall sample data from
    > **Telemetric Endpoints** at a frequency defined within the DEM
    > (e.g., every 15 minutes).

-   **Actuation Logic:** Must provide direct GPIO or industrial protocol
    > (Modbus/CAN bus) outputs to trigger physical hardware based on the
    > DEM decision tree.

-   **Delta Calculation:** Must calculate the variance between
    > \"Predicted Environmental State\" (from the DEM) and \"Actual
    > Measured State\" for later reporting.

## 3. Data Integrity & Reporting

### 3.1 IRP Ledger Generation

-   **Local Logging:** Every actuation event must be logged with a
    > timestamp, the triggering sensor value, and the unique ID of the
    > governing DEM.

-   **Hashing:** Each log entry must be chained to the previous entry
    > using a SHA-256 hash to ensure the immutability of the field
    > record.

### 3.2 Asynchronous State Synchronization

-   **Packetization:** Upon restoration of network backhaul, the ECG
    > must package all execution logs into a **State Verification
    > Packet**.

-   **Priority Queue:** The ECG must prioritize the transmission of
    > **Quantifiable Conservation Validation (QCV)** data over
    > non-critical system health telemetry.

## 4. Power & Environmental Specs

-   **Operating Temperature:** -40°C to +85°C (Industrial Grade).

-   **Power Management:** Must support solar-plus-battery input with
    > ultra-low-power \"Sleep\" states between telemetric sampling
    > windows.

-   **Enclosure:** IP67-rated weatherproofing for deployment in exposed
    > agricultural or industrial environments.
