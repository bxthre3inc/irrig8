# Agentic — Self-Building Capability Plan
**Version:** 1.0.0  
**Status:** Draft  
**Date:** 2026-04-23  
**Owner:** BX3 Inc / brodiblanco  

---

## 1. Problem Statement

Agentic today is a **workflow orchestrator with local LLM inference**. It can think. It cannot build. Per SOUL.md's **"Evolve or Die"** principle, a static system decays. Agentic must be able to observe its own failures, generate fixes, sandbox them, and deploy — autonomously.

---

## 2. Target State

Agentic can:
- Detect failures/errors in its own execution
- Generate code modifications to fix those failures
- Sandboxed-test every modification before deployment
- Deploy approved changes autonomously
- Maintain a full audit trail (Truth Gate)
- Roll back any change instantly
- Execute tasks end-to-end without human intervention
- Register and invoke tools dynamically
- Load/upgrade skills without redeployment
- Stream events for real-time observability

---

## 3. Gap Analysis

### 3.1 Already Built ✅

| Component | Status |
|-----------|--------|
| Multi-tier hierarchy (C-Suite, Tier-2, Tier-3) | ✅ Built |
| Role YAML configs (9 roles) | ✅ Built |
| Agent classes (base + 9 specialized) | ✅ Built |
| HITL Manager + approval queue | ✅ Built (stub) |
| Sub-Agent Pool | ✅ Built (stub) |
| Cascading Task DAG | ✅ Built (modeling only) |
| Modality handlers (text, voice, visual, data, interactive) | ✅ Built |
| Local inference via Ollama (`llama3.2`, `phi3`) | ✅ Built |
| API server (`/health`, `/reason`, `/agents`) | ✅ Built |
| React dashboard | ✅ Built |
| K8s scaling configs (README only) | ✅ Built (partial) |
| Semver 2.0.0 | ✅ Applied |
| Docker setup | ✅ Built (partial) |
| README, Architecture doc | ✅ Built |

### 3.2 Missing / Stub-Only ❌

| Component | Severity | Impact |
|-----------|----------|--------|
| Self-Modification Engine (Darwin Gödel Cycle) | **P0** | Agents cannot evolve |
| Code Execution Engine | **P0** | Agents cannot write/build/run code |
| Tool Registry | **P0** | Agents have no callable tools |
| Autonomous Deployment Pipeline | **P0** | No path from code change → live system |
| Task Execution Engine | **P1** | DAG models deps; nothing executes |
| Sub-Agent Task Execution | **P1** | Pool exists; no actual task routing |
| Skill Library | **P1** | Agents can't load/upgrade capabilities |
| Streaming / Event Bus | **P1** | No real-time event pipeline |
| Truth Gate (audit log) | **P1** | No immutable audit of agent decisions |
| Rollback Engine | **P1** | No revert capability for self-changes |
| Credential Manager | **P2** | No secure secrets management |
| Full Kubernetes manifests | **P2** | Only README; no actual YAML |
| Complete Docker setup | **P2** | Partial Dockerfile; no docker-compose |
| Unit/Integration tests | **P2** | Stubs only |
| Production monitoring (Grafana + Loki) | **P2** | Docs exist; not wired up |
| Dolt schema/migrations | **P2** | Docs exist; not implemented |

---

## 4. Implementation Phases

### Phase 1 — Execution Core (Week 1-2)
**Goal:** Agents can execute tasks end-to-end

#### 1.1 Tool Registry (`src/tools/`)
Dynamic registry of all callable tools. Agents declare tools in their role config; the registry resolves them at runtime.

```python
class ToolRegistry:
    def register(self, name: str, fn: callable, schema: dict): ...
    def invoke(self, agent_id: str, tool_name: str, params: dict) -> Any: ...
    def list_tools(self, agent_role: str) -> list[dict]: ...
```

**Built-in tools:**
- `filesystem.write` — write a file
- `filesystem.read` — read a file
- `bash.execute` — run a shell command (sandboxed)
- `http.request` — make an HTTP call
- `inference.generate` — call local Ollama
- `git.commit` — commit a change
- `git.branch` — create a branch
- `http.request` — make an HTTP call
- `log.write` — write to audit log

#### 1.2 Task Execution Engine (`src/execution/`)
Replaces the stub. Executes tasks from the DAG against the Tool Registry.

```python
class TaskExecutor:
    def execute(self, task: Task, context: dict) -> ExecutionResult: ...
    def execute_dag(self, dag: CascadingTaskDAG) -> list[ExecutionResult]: ...
```

- Reads task from queue
- Resolves tools via Tool Registry
- Streams events to Event Bus
- Writes results + audit log

#### 1.3 Skill Library (`src/skills/`)
Agents load skills on demand. Skills are composable capability modules.

```python
class SkillLibrary:
    def load_skill(self, agent_id: str, skill_name: str): ...
    def list_skills(self) -> dict: ...
    def install_skill(self, skill_tarball: bytes): ...
```

### Phase 2 — Self-Modification (Week 2-3)
**Goal:** System can observe its failures and fix itself

#### 2.1 Self-Modification Engine (`src/self_mod/`)
Implements the Darwin Gödel Cycle per SOUL.md:

```
Observe → Hypothesize → Sandbox → Commit → Rollback
```

```python
class SelfModificationEngine:
    def observe(self) -> list[FailureEvent]: ...
    def hypothesize(self, failures: list[FailureEvent]) -> list[CodeChange]: ...
    def sandbox(self, change: CodeChange) -> SandboxResult: ...
    def commit(self, approved: CodeChange) -> CommitResult: ...
    def rollback(self, commit_id: str) -> bool: ...
```

**Immutable Core** (never modified):
- LLM weights
- Safety constraints
- Truth Gate enforcement
- INBOX routing rules

#### 2.2 Truth Gate (`src/truth_gate/`)
Immutable audit log. Every agent action is sealed with SHA-256.

```python
class TruthGate:
    def seal(self, agent_id: str, action: dict) -> str: ...  # returns hash
    def verify(self, entry: AuditEntry) -> bool: ...
    def query(self, agent_id: str, time_range: tuple) -> list[AuditEntry]: ...
```

#### 2.3 Rollback Engine (`src/rollback/`)
Git-based + file snapshot rollback.

```python
class RollbackEngine:
    def snapshot(self) -> str: ...  # returns snapshot_id
    def rollback_to(self, snapshot_id: str): ...
    def list_snapshots(self) -> list[dict]: ...
```

### Phase 3 — Autonomous Deployment (Week 3-4)
**Goal:** Approved code changes go live without human intervention

#### 3.1 Deployment Pipeline (`src/deployment/`)
```
Sandbox Approved → Run Tests → Build Docker → Deploy to K8s → Verify Health → Seal Audit
```

```python
class DeploymentPipeline:
    def deploy(self, change: CodeChange, target: str = "production") -> DeploymentResult: ...
    def rollback(self, deployment_id: str) -> bool: ...
    def health_check(self, endpoint: str) -> bool: ...
```

#### 3.2 Credential Manager (`src/credentials/`)
Secure storage for secrets used by agents.

```python
class CredentialManager:
    def store(self, agent_id: str, key: str, value: str): ...
    def retrieve(self, agent_id: str, key: str) -> str: ...
    def rotate(self, key: str): ...
```

### Phase 4 — Observability (Week 4-5)
**Goal:** Full real-time visibility + enterprise hardening

#### 4.1 Event Bus + Streaming (`src/events/`)
```python
class EventBus:
    def publish(self, event: AgentEvent): ...
    def subscribe(self, agent_id: str, event_types: list[str]): ...
```

WebSocket streaming to dashboard for real-time agent activity.

#### 4.2 Production K8s Manifests
Full Helm chart / K8s YAML:
- `k8s/agentic/values.yaml`
- `k8s/agentic/templates/deployment.yaml`
- `k8s/agentic/templates/service.yaml`
- `k8s/agentic/templates/hpa.yaml` (autoscaling)
- `k8s/agentic/templates/ingress.yaml`
- `k8s/agentic/templates/secret.yaml`
- `k8s/agentic/Chart.yaml`

HPA configured for **10,000+ agents** at 0.2 CPU per agent.

#### 4.3 Production Docker
- `Dockerfile` — multi-stage build, non-root user, healthcheck
- `docker-compose.yml` — full stack (API + Redis + Dolt + Ollama)
- `.dockerignore`

#### 4.4 Grafana + Loki Monitoring
Wire up the docs/monitoring.md to actual Prometheus metrics.

---

## 5. Priority Stack

```
P0 (Must have for self-building):
  1. Tool Registry
  2. Task Execution Engine
  3. Self-Modification Engine
  4. Truth Gate
  5. Rollback Engine

P1 (Enables full autonomy):
  6. Deployment Pipeline
  7. Skill Library
  8. Event Bus + Streaming
  9. Sub-Agent Task Execution

P2 (Production hardening):
  10. Credential Manager
  11. Full K8s manifests
  12. Production Docker + Compose
  13. Grafana monitoring wiring
  14. Unit + integration tests
```

---

## 6. Effort Estimate

| Phase | Components | Estimated Time |
|-------|-------------|-----------------|
| Phase 1 | Tool Registry + Task Executor + Skill Library | 2-3 days |
| Phase 2 | Self-Mod + Truth Gate + Rollback | 2-3 days |
| Phase 3 | Deployment Pipeline + Credentials | 1-2 days |
| Phase 4 | Event Bus + K8s + Docker + Tests | 2-3 days |

**Total: ~1-2 weeks** for a solo developer with this spec.

---

## 7. Also Missing (Not in Original Spec)

These weren't in the Notion pages but are needed for a real self-building system:

| Feature | Reason Needed |
|---------|---------------|
| **Memory system** | Agents forget context between sessions — needs persistent working memory |
| **Session manager** | Track agent conversations over time |
| **Context window management** | Long-running agents accumulate context — needs pruning |
| **Rate limiter** | Prevent agents from overwhelming external APIs |
| **Webhook system** | Agents need to receive external events (GitHub, Slack, etc.) |
| **API rate limiting + auth** | Dashboard needs proper auth; API needs key management |
| **Webhook inbox** | External trigger support for agent workflows |
| **A/B testing framework** | Test agent changes in shadow mode before deploying |
| **Cost accounting** | Track compute cost per agent, per task |

---

## 8. Immediate Next Steps

1. **Build Tool Registry** — the foundation everything else depends on
2. **Wire Task Executor to existing API server** — connects inference → action
3. **Add `/execute` endpoint to API server** — dashboard can trigger real tasks
4. **Build Self-Modification Engine** — closes the evolve loop
5. **Build Truth Gate** — audit trail for all agent actions
6. **Add Rollback** — git-based snapshot system
7. **Build Deployment Pipeline** — sandbox → test → deploy
8. **Full K8s manifests** — production-ready scaling
