# Agentic1 — API Reference

## Agent System

### BaseAgent

```python
from src.agents.base_agent import BaseAgent
```

**Constructor:**
```python
agent = BaseAgent(role_yaml_path: str)
```

**Methods:**

| Method | Description |
|--------|-------------|
| `can_handle_task(task: Dict) -> bool` | Check if agent meets task prerequisites |
| `execute_task(task: Dict, modality: str = "text") -> Dict` | Execute task with ambition protocol and cascading |

**Example:**
```python
agent = BaseAgent("specs/roles/research_agent.yaml")
task = {
    "Task": "Analyze_Patent_Cluster",
    "Prerequisites": {"Requires": ["LLM", "GPU"]},
    "RiskWeight": 6,
}
if agent.can_handle_task(task):
    result = agent.execute_task(task)
```

### Role Agents

| Agent | Module | Specialization |
|-------|--------|----------------|
| ResearchAgent | `src.agents.research_agent` | Patent analysis, prior art search |
| LegalAgent | `src.agents.legal_agent` | Contracts, compliance, IP filings |
| FinancialAgent | `src.agents.financial_agent` | Budgets, investments, analysis |
| OperationsAgent | `src.agents.operations_agent` | Logistics, supply chain, workflows |
| ComplianceAgent | `src.agents.compliance_agent` | Regulatory standards, audit trails |
| SalesAgent | `src.agents.sales_agent` | Lead generation, pipeline management |
| HRAgent | `src.agents.hr_agent` | Recruitment, onboarding |
| MarketingAgent | `src.agents.marketing_agent` | Campaigns, content, SEO |
| SupportAgent | `src.agents.support_agent` | Issue resolution, knowledge base |

## Cascading System

### TaskDAG

```python
from src.cascading.task_dag import TaskDAG
```

**Methods:**

| Method | Description |
|--------|-------------|
| `add_task(name: str, spec: Dict)` | Register a task in the DAG |
| `get_execution_order() -> List[str]` | Topological sort — returns run order |
| `get_dependent_tasks(name: str) -> List[str]` | Tasks that depend on this one |
| `get_dependencies(name: str) -> List[str]` | Tasks this one depends on |
| `validate_task(name: str) -> bool` | Check task spec validity |

### EventRouter

```python
from src.cascading.event_router import EventRouter
```

Routes cascading trigger events to downstream tasks:
```python
router = EventRouter()
router.route_event("OnComplete", "Analyze_Patent_Cluster", result)
```

## Modality Handlers

### ModalityRouter

```python
from src.modalities.modality_router import ModalityRouter
```

Routes input to the appropriate handler:

| Modality | Handler |
|----------|---------|
| `text` | TextHandler |
| `voice` | VoiceHandler |
| `visual` | VisualHandler |
| `data` | DataHandler |
| `interactive` | InteractiveHandler |

```python
router = ModalityRouter()
result = router.route("Analyze this patent.", modality="text")
```

## Downtime Protocol

### WorkBuffer

```python
from src.downtime.work_buffer import WorkBuffer
```

**Methods:**

| Method | Description |
|--------|-------------|
| `add_task(task: Dict, task_type: str = "assigned") -> bool` | Add task to buffer |
| `get_next_task(agent_role: str) -> Optional[Dict]` | Get highest-priority task |
| `spawn_downtime_task(agent_role: str) -> Optional[Dict]` | Self-generated task for idle agent |

### TaskSpawner

```python
from src.downtime.task_spawner import TaskSpawner
```

Spawns tasks from templates when agent is idle. See `configs/downtime_protocol.yaml` for template definitions.

## HITL System

### HITLManager

```python
from src.hitl.hitl_manager import HITLManager
```

**Methods:**

| Method | Description |
|--------|-------------|
| `check_intervention(task: Dict) -> bool` | Check if task needs human approval |
| `request_approval(task: Dict) -> bool` | Send approval request to Slack |
| `request_review(task: Dict, results: Dict) -> bool` | Send review request |
| `escalate(task: Dict, error: str) -> bool` | Send escalation alert |

**Configuration:** `configs/hitl.yaml`

### HITL API

```
GET  /api/hitl/pending          — List pending approvals
POST /api/hitl/:id/approve      — Approve a task
POST /api/hitl/:id/reject       — Reject a task
GET  /api/hitl/workbuffer       — View work buffer status
```

## Deterministic Logging

### DeterministicLogger

```python
from src.logging.deterministic_logger import DeterministicLogger
```

**Methods:**

| Method | Description |
|--------|-------------|
| `log_action(action: Dict, entity: Dict) -> Dict` | Log as executable JSON |
| `replay_actions(start_time: str, end_time: str) -> List[Dict]` | Replay time range |

## Sub-Agent Pool

### SubAgentPool

```python
from src.subagent.sub_agent_pool import SubAgentPool
```

**Methods:**

| Method | Description |
|--------|-------------|
| `get_available_subagent(role: str, spec: Optional[str]) -> Optional[SubAgent]` | Allocate sub-agent |
| `release_subagent(name: str) -> bool` | Return to pool |
| `get_pool_status(role: str) -> Dict` | Pool health snapshot |

## Utilities

### VelocityManager
```python
from src.utils.velocity_manager import VelocityManager
```
Manages RWES (Real-World Equivalent Scores) and velocity capacity per agent.

### RWESManager
```python
from src.utils.rwes_manager import RWESManager
```
Tracks and resolves prerequisite dependencies across tasks.

### MonetizationEngine
```python
from src.monetization.monetization_engine import MonetizationEngine
```
Earns revenue from idle agent downtime via micro-tasks.
