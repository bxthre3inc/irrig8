# Irrig8 — Deterministic Farming Operating System

**Resource Health Management & Auditability for Modern Agriculture**

Irrig8 is an end-to-end deterministic farming operating system that manages resource health, 
ensures auditability/accountability, and optimizes yields using data from satellites, 
in/on-ground sensor suites, soil variability maps, neighboring systems, and various APIs.

## Architecture

```
irrig8/
├── code/
│   ├── backend/          # FastAPI + Python backend
│   ├── frontend/         # React/Vite portal
│   ├── edge-compute/     # Go + Python edge processing
│   ├── database/         # DuckDB migrations & seeds
│   ├── cloud-processing/ # Analytics & data pipelines
│   └── deployment/       # Docker, Kubernetes, nginx, Zo deploy
├── docs/                 # Full system specifications
├── IP/                   # Patent filings & IP documentation
└── simulation/           # Simulation environment
```

## Quick Start

```bash
cd code/backend
./start.sh

cd code/frontend/farmsense-portal
npm install && npm run dev
```

## Origin

Irrig8 supersedes the original FarmSense platform (2024-2025). 
The FarmSense code base has been migrated here and rebranded.
See docs/ for full specifications.
