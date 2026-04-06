# MCP Mesh v2.0 — Universal 3-Way Symmetric Peer Mesh

**Zo ↔ Antigravity ↔ AgentOS** — With support for any MCP IDE: Cursor, VS Code, JetBrains, Windsurf

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MCP Mesh Protocol v2                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐   │
│   │     Zo     │◄────►│ Antigravity │◄────►│   AgentOS   │   │
│   │  (Assistant)│      │    (IDE)    │      │   (Agent)   │   │
│   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘   │
│          │                    │                    │           │
│          └────────────────────┴────────────────────┘           │
│                         MCP Mesh                               │
│                                                                 │
│   Supports: Claude Desktop, Cursor, VS Code, JetBrains, etc.   │
└─────────────────────────────────────────────────────────────────┘
```

## All 12 Fixes Applied (v2.0)

| # | Fix | Status | Description |
|---|-----|--------|-------------|
| **1** | Real Adapter Integration | ✅ | Wraps actual AgentOS and Antigravity MCP servers |
| **2** | Heartbeat/Keepalive | ✅ | 30s ping/pong with 90s timeout |
| **3** | Schema Validation | ✅ | JSON Schema validation for all messages |
| **4** | Graceful Cleanup | ✅ | SIGTERM/SIGINT + destroy() |
| **5** | Message Compression | ✅ | zlib compression for payloads >1KB |
| **6** | WebSocket Reconnect | ✅ | Exponential backoff with jitter |
| **7** | Circuit Breaker UI | ✅ | Exposed via /mesh/status |
| **8** | Graceful Degradation | ✅ | Degraded mode with reduced features |
| **9** | Metrics Endpoint | ✅ | Prometheus format at /mesh/metrics |
| **10** | CLI Enhancement | ✅ | start, status, metrics, call commands |
| **11** | Test Suite | ✅ | Jest tests in tests/ |
| **12** | Documentation | ✅ | ARCHITECTURE.md + API.md |

## Quick Start

```bash
cd /home/workspace/Bxthre3/mcp-mesh
npm install
npm run build
npm run dev -- start full
```

## CLI Commands

```bash
mesh start [mode]     Start mesh (modes: full, zo, agentos, antigravity)
mesh status           Show mesh status
mesh metrics          Show mesh metrics
mesh call <peer> <tool> [args]  Call a tool on a peer
mesh help             Show help
```

## HTTP Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /mesh/status` | Peer status and circuit breaker states |
| `GET /mesh/metrics` | Prometheus-format metrics |
| `GET /mesh/health` | Health check |

## Peer Identity & Auth (Q13 Answer)

**Per-peer API keys are implemented.** Each peer has its own identity:

```typescript
interface PeerCredentials {
  peerId: PeerId;           // "zo", "agentos", "antigravity"
  apiKey: string;            // Unique API key per peer
  permissions: string[];    // What this peer can access
}
```

## Context Sync (Q14 Answer)

**Hybrid approach** — Event-driven + periodic heartbeat:

| Context Type | Sync Method |
|-------------|-----------|
| activeFile | Real-time (event) |
| openFiles | On open/close (event) |
| activeTask | On task change (event) |
| peer state | Periodic (30s heartbeat) |

## Message Ordering (Q15 Answer)

**Per-conversation ordering** for tool calls only:

- Tool calls/responses: Ordered via `callId` sequence
- Events/context: Eventual consistency (acceptable)

**DON'T DO:** Total ordering — complexity/cost not justified for this use case.

## Project Structure

```
mcp-mesh/
├── src/
│   ├── index.ts              # Main entry
│   ├── core/
│   │   ├── mesh-core.ts      # Core mesh logic
│   │   └── mesh-extended.ts  # Extended features
│   ├── peer/
│   │   ├── adapter-wrappers.ts  # Real MCP server adapters
│   │   ├── zo-adapter.ts     # Zo MCP adapter
│   │   └── ide-adapter.ts    # Universal IDE adapter
│   ├── protocol/
│   │   └── v2.ts             # Protocol definitions
│   ├── registry/
│   │   └── registry.ts       # Peer registry
│   └── transport/
│       └── transport.ts      # Transport abstraction
├── tests/
│   └── mesh.test.ts          # Test suite
├── package.json
└── README.md
```

## Features

- **Universal IDE Support**: Any MCP-compatible IDE can join
- **Symmetric Peers**: All peers serve AND consume tools
- **Auto-Discovery**: Dynamic peer advertisement
- **Circuit Breakers**: Fault isolation per peer
- **Resource Leasing**: Prevents conflicts
- **Event Pub/Sub**: Decoupled communication
- **Observability**: Metrics, health checks, tracing

## License

Proprietary — Bxthre3 Inc.
