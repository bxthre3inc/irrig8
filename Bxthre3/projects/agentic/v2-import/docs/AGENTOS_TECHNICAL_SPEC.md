# AgentOS Technical Specification

## Version 0.1.0 (Draft)

---

## 1. Overview

AgentOS is a deterministic orchestration framework for AI agents. It provides a structured execution environment where AI agent behavior is constrained, auditable, and reproducible.

### 1.1 Design Principles

1. **Determinism First**: All execution paths must be predictable and reproducible
2. **Audit by Default**: Every decision is logged with full context
3. **MCP Native**: Built on the Model Context Protocol for tool integration
4. **BPMN Compatible**: Uses industry-standard process notation
5. **Minimal Overhead**: <100ms latency addition for orchestration layer

### 1.2 Scope

AgentOS is NOT:
- Another LLM or agent framework
- A replacement for LangChain/LlamaIndex
- A model training or fine-tuning tool

AgentOS IS:
- A deterministic execution shell around AI agents
- An orchestration layer that guarantees reproducibility
- An audit and compliance framework for agent actions

---

## 2. Architecture

### 2.1 Layered Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                                │
│  (User interfaces, API clients, CLI tools)                         │
├────────────────────────────────────────────────────────────────────┤
│                    ORCHESTRATION LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐      │
│  │ Workflow     │  │ Session      │  │ Audit                │      │
│  │ Engine       │  │ Manager      │  │ Service              │      │
│  └──────────────┘  └──────────────┘  └──────────────────────┘      │
├────────────────────────────────────────────────────────────────────┤
│                    DETERMINISTIC SHELL                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐      │
│  │ Permission   │  │ Constraint   │  │ Rollback             │      │
│  │ Enforcer     │  │ Engine       │  │ Manager              │      │
│  └──────────────┘  └──────────────┘  └──────────────────────┘      │
├────────────────────────────────────────────────────────────────────┤
│                    AGENT ADAPTER LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐      │
│  │ MCP Client   │  │ LLM          │  │ Tool                 │      │
│  │              │  │ Adapters     │  │ Registry             │      │
│  └──────────────┘  └──────────────┘  └──────────────────────┘      │
├────────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐      │
│  │ State        │  │ Event        │  │ Configuration        │      │
│  │ Store        │  │ Bus          │  │ Manager              │      │
│  └──────────────┘  └──────────────┘  └──────────────────────┘      │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Components

#### 2.2.1 Workflow Engine

The workflow engine executes processes defined in BPMN 2.0 notation or simplified YAML format.

**Responsibilities:**
- Parse and validate workflow definitions
- Execute steps in defined order
- Handle branching and merging logic
- Manage parallel execution paths
- Track execution state

**Workflow Definition Example (YAML):**

```yaml
name: customer_onboarding
version: "1.0"
description: New customer onboarding workflow

steps:
  - id: verify_identity
    type: deterministic
    action: api_call
    service: identity_verification
    timeout: 30s
    on_failure: retry(3)
    
  - id: assess_risk
    type: ai_augmented
    agent: risk_assessment_agent
    constraints:
      - output_schema: risk_level
      - max_tokens: 100
      - timeout: 60s
    fallback: default_risk_level
    
  - id: create_account
    type: deterministic
    action: mcp_tool
    server: stripe
    tool: create_customer
    requires:
      - verify_identity: success
      - assess_risk: completed
    
  - id: send_welcome
    type: deterministic
    action: mcp_tool
    server: sendgrid
    tool: send_email
    template: welcome_email
    async: true

boundaries:
  max_duration: 5m
  max_cost: $0.50
  rollback_on_failure: true
```

#### 2.2.2 Deterministic Shell

The deterministic shell wraps AI agent execution with guaranteed constraints.

**Constraint Types:**

| Constraint | Description | Example |
|------------|-------------|---------|
| `output_schema` | JSON Schema for agent output | `{"type": "object", "properties": {...}}` |
| `allowed_actions` | Whitelist of permitted actions | `["read", "query"]` |
| `max_tokens` | Maximum tokens in response | `500` |
| `timeout` | Maximum execution time | `30s` |
| `max_retries` | Maximum retry attempts | `3` |
| `cost_ceiling` | Maximum API cost | `$0.10` |
| `require_confirmation` | Human approval required | `true` |

**Execution Flow:**

```
1. Validate constraints
2. Execute agent within sandbox
3. Validate output against schema
4. Log decision with full context
5. Return result or trigger fallback
```

#### 2.2.3 Audit Service

The audit service records every decision and action for compliance and debugging.

**Audit Record Structure:**

```json
{
  "id": "audit_20250101_abc123",
  "timestamp": "2025-01-01T12:00:00Z",
  "session_id": "session_xyz789",
  "workflow": "customer_onboarding",
  "step": "assess_risk",
  "type": "ai_decision",
  "input": {
    "customer_data": {...}
  },
  "output": {
    "risk_level": "low",
    "confidence": 0.92
  },
  "constraints_applied": [
    "output_schema",
    "max_tokens:100"
  ],
  "model": "claude-3-opus",
  "tokens_used": 87,
  "latency_ms": 1243,
  "reproducible": true,
  "replay_hash": "sha256:abc123..."
}
```

#### 2.2.4 MCP Client

Native Model Context Protocol client for tool integration.

**Capabilities:**
- Connect to MCP servers
- Discover available tools
- Invoke tools with audit trail
- Manage authentication
- Handle server lifecycle

**Supported MCP Servers (Initial):**
- GitHub MCP Server
- Stripe MCP Server
- Notion MCP Server
- Filesystem MCP Server
- PostgreSQL MCP Server

---

## 3. Data Models

### 3.1 Workflow Definition

```typescript
interface Workflow {
  id: string;
  name: string;
  version: string;
  description: string;
  steps: Step[];
  boundaries: Boundaries;
  metadata: Record<string, any>;
}

interface Step {
  id: string;
  type: 'deterministic' | 'ai_augmented' | 'human_approval';
  action: 'api_call' | 'mcp_tool' | 'agent_invoke' | 'condition';
  constraints?: Constraints;
  fallback?: FallbackConfig;
  requires?: Dependency[];
}

interface Constraints {
  output_schema?: JSONSchema;
  allowed_actions?: string[];
  max_tokens?: number;
  timeout?: string;
  max_retries?: number;
  cost_ceiling?: string;
  require_confirmation?: boolean;
}

interface Boundaries {
  max_duration?: string;
  max_cost?: string;
  max_steps?: number;
  rollback_on_failure?: boolean;
  allowed_agents?: string[];
}
```

### 3.2 Execution Record

```typescript
interface Execution {
  id: string;
  workflow_id: string;
  workflow_version: string;
  status: 'running' | 'completed' | 'failed' | 'rolled_back';
  started_at: string;
  completed_at?: string;
  steps: StepExecution[];
  total_cost?: number;
  audit_trail: AuditRecord[];
}

interface StepExecution {
  step_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  input?: any;
  output?: any;
  error?: string;
  retries: number;
}
```

### 3.3 Audit Record

```typescript
interface AuditRecord {
  id: string;
  timestamp: string;
  session_id: string;
  workflow_id: string;
  step_id: string;
  type: 'decision' | 'action' | 'constraint' | 'error';
  actor: 'system' | 'agent' | 'human';
  input: any;
  output: any;
  constraints_applied: string[];
  model?: string;
  tokens_used?: number;
  latency_ms: number;
  reproducible: boolean;
  replay_hash: string;
}
```

---

## 4. API Design

### 4.1 REST API

**Create Workflow:**
```
POST /api/v1/workflows
Content-Type: application/json

{
  "name": "customer_onboarding",
  "steps": [...],
  "boundaries": {...}
}
```

**Execute Workflow:**
```
POST /api/v1/executions
Content-Type: application/json

{
  "workflow_id": "wf_abc123",
  "input": {
    "customer_id": "cust_xyz"
  }
}
```

**Get Execution Status:**
```
GET /api/v1/executions/{execution_id}
```

**Get Audit Trail:**
```
GET /api/v1/executions/{execution_id}/audit
```

**Replay Execution:**
```
POST /api/v1/executions/{execution_id}/replay
```

### 4.2 CLI Interface

```bash
# Initialize new project
agentos init my-project

# Validate workflow definition
agentos validate workflow.yaml

# Execute workflow
agentos run workflow.yaml --input input.json

# View execution history
agentos history --workflow customer_onboarding

# Audit specific execution
agentos audit exec_abc123

# Replay execution for debugging
agentos replay exec_abc123

# Connect MCP server
agentos mcp connect github --url https://github.com/mcp
```

---

## 5. Implementation Plan

### 5.1 Phase 1: Core Runtime (Weeks 1-4)

- [ ] Workflow parser (YAML + BPMN)
- [ ] Execution engine
- [ ] Constraint validator
- [ ] SQLite audit store
- [ ] Basic CLI

### 5.2 Phase 2: Agent Integration (Weeks 5-8)

- [ ] MCP client implementation
- [ ] LLM adapter interface
- [ ] Tool registry
- [ ] Session management
- [ ] Rollback manager

### 5.3 Phase 3: Developer Experience (Weeks 9-12)

- [ ] REST API
- [ ] Python SDK
- [ ] TypeScript SDK
- [ ] Documentation site
- [ ] Example workflows

### 5.4 Phase 4: Enterprise Features (Weeks 13-16)

- [ ] Multi-tenancy
- [ ] RBAC
- [ ] SSO integration
- [ ] Advanced analytics
- [ ] Compliance reports

---

## 6. Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Core Runtime | Python 3.11+ | MCP ecosystem, AI libraries |
| API Server | FastAPI | Async, OpenAPI, performance |
| State Store | SQLite → PostgreSQL | Start simple, scale later |
| Event Bus | Redis (optional) | Pub/sub for distributed mode |
| CLI | Typer | Modern Python CLI framework |
| SDK | Python + TypeScript | Broadest developer reach |

---

## 7. Testing Strategy

### 7.1 Determinism Tests

Every workflow must pass the determinism test:
```python
def test_determinism():
    workflow = load_workflow("customer_onboarding")
    input_data = {"customer_id": "test_123"}
    
    result1 = execute(workflow, input_data, seed=42)
    result2 = execute(workflow, input_data, seed=42)
    
    assert result1 == result2
```

### 7.2 Replay Tests

Every execution must be replayable:
```python
def test_replay():
    execution = get_execution("exec_abc123")
    replayed = replay_execution("exec_abc123")
    
    assert execution.steps == replayed.steps
    assert execution.audit_trail == replayed.audit_trail
```

### 7.3 Constraint Tests

Constraints must be enforced:
```python
def test_constraint_enforcement():
    workflow = load_workflow("bounded_workflow")
    execution = execute(workflow, test_input)
    
    assert execution.total_cost <= workflow.boundaries.max_cost
    assert execution.duration <= parse_duration(workflow.boundaries.max_duration)
```

---

## 8. Security Model

### 8.1 Principle of Least Privilege

- Agents can only access tools explicitly granted
- Each workflow step declares required permissions
- Permission escalation requires human approval

### 8.2 Audit Integrity

- Audit records are append-only
- Records are cryptographically signed
- Tampering detection via hash chains

### 8.3 Credential Management

- MCP server credentials stored in encrypted vault
- Credentials never exposed to agent context
- Per-workflow credential scoping

---

## Appendix A: Comparison with Existing Tools

| Feature | AgentOS | LangGraph | Temporal | Camunda |
|---------|---------|-----------|----------|---------|
| Deterministic execution | ✅ Native | ⚠️ Partial | ✅ Native | ✅ Native |
| AI agent integration | ✅ Native | ✅ Native | ⚠️ Via SDK | ⚠️ Via SDK |
| MCP support | ✅ Native | ❌ | ❌ | ❌ |
| Audit by default | ✅ Native | ❌ | ⚠️ Config | ✅ Native |
| Open source | ✅ MIT | ✅ MIT | ✅ MIT | ✅ Apache |
| AI-native design | ✅ | ✅ | ❌ | ❌ |

---

## Appendix B: Glossary

- **Deterministic Shell**: Execution wrapper that guarantees reproducible outputs for given inputs
- **BPMN**: Business Process Model and Notation - industry standard for process modeling
- **MCP**: Model Context Protocol - standard for connecting AI to tools and data
- **Constraint**: A rule that limits or validates agent behavior
- **Audit Trail**: Complete record of all decisions and actions in an execution
- **Replay**: Ability to re-execute a workflow with identical inputs and seed to reproduce outputs

---

*Version: 0.1.0-draft*
*Last Updated: 2025*