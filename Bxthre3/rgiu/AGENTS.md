# RGIU - Rio Grande Intelligence Unit

Self-funding, self-extending Agentic Business Unit.

## Philosophy
- Zero external dependencies (Bun runtime only)
- Every component is readable and replaceable
- SQLite for state, filesystem for messaging
- Agent creates new Agents via Extend protocol

## Quick Start
```bash
cd /home/workspace/Bxthre3/rgiu
bun install  # (zero deps, just types)
bun run cli.ts scout
bun run cli.ts www   # launches website
```

## Agent Registry
- `scout` - Discovers distressed properties
- `appraise` - Values properties
- `extend` - Creates new skills/agents
- `outreach` - Investor/buyer acquisition
- `revenue` - Fee collection tracking
