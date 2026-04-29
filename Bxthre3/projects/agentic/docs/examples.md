# Agentic1 — Usage Examples

## 1. Run a Role Agent

```python
from src.agents.research_agent import ResearchAgent

agent = ResearchAgent("specs/roles/research_agent.yaml")

task = {
    "Task": "Analyze_Patent_Cluster",
    "Prerequisites": {
        "Access": ["PatentDB", "InternalResearchDB"],
        "Requires": ["LLM", "GPU", "OpenCLIP"],
        "NeedsApproval": ["You"]
    },
    "VelocityRequirement": {"Min": 8, "Stretch": 10},
    "RiskWeight": 6,
    "CascadingTriggers": [
        {"OnComplete": "File_Patent"},
        {"OnError": "Notify_You"}
    ]
}

if agent.can_handle_task(task):
    result = agent.execute_task(task, modality="text")
    print(result)
```

## 2. Spawn a Downtime Task

```python
from src.downtime.work_buffer import WorkBuffer

buffer = WorkBuffer()

# Agent is idle — spawn self-generated task
task = buffer.spawn_downtime_task("LegalAgent")
print(task)
# Output: {'Task': 'Review_Old_Contracts', 'RiskWeight': 1, 'Alignment': ['#compliance']}
```

## 3. Cascade a Patent Workflow

```python
from src.cascading.task_dag import TaskDAG
from src.cascading.event_router import EventRouter

dag = TaskDAG()
router = EventRouter()

# Route "Analyze complete" event → triggers File_Patent automatically
event = {
    "trigger": "OnComplete",
    "source_task": "Analyze_Patent_Cluster",
    "result": {"patent_id": "US2024012345", "novelty_score": 0.87}
}
router.route_event(event["trigger"], event["source_task"], event["result"])
```

## 4. Handle Multi-Modal Input

```python
from src.modalities.modality_router import ModalityRouter

router = ModalityRouter()

# Text input
text_out = router.route(
    "Analyze patent US2024012345 for prior art",
    modality="text"
)

# Voice input
voice_out = router.route(
    b"<audio_bytes>",
    modality="voice",
    lang="en"
)

# Visual input
visual_out = router.route(
    b"<image_bytes>",
    modality="visual",
    model="OpenCLIP"
)

# Data input
data_out = router.route(
    {"csv": "field_data.csv", "schema": "patent_schema.yaml"},
    modality="data"
)
```

## 5. HITL Approval Flow

```python
from src.hitl.hitl_manager import HITLManager

hitl = HITLManager("configs/hitl.yaml")

task = {
    "name": "Transfer_Funds",
    "description": "Move $50,000 to Operating Reserve",
    "RiskWeight": 9,
    "destination": "OperatingReserve",
    "amount": 50000
}

if hitl.check_intervention(task):
    hitl.request_approval(task)
    print("Waiting for human approval...")
else:
    print("Auto-approved — below risk threshold")
```

## 6. Sub-Agent Allocation

```python
from src.subagent.sub_agent_pool import SubAgentPool

pool = SubAgentPool("configs/subagents.yaml")

# Researcher needs a web search sub-agent
sub = pool.get_available_subagent(
    parent_role="researcher",
    specialization="web_search"
)
if sub:
    result = pool.execute_subagent_task(sub.name, {
        "name": "Deep Web Search",
        "query": "center pivot irrigation sensor patents 2024"
    })
    pool.release_subagent(sub.name)
```

## 7. Log and Replay a Deterministic Action

```python
from src.logging.deterministic_logger import DeterministicLogger

logger = DeterministicLogger()

action = {
    "Task": "Analyze_Patents",
    "target": ["patent_123", "patent_456"],
    "mode": "text"
}
entity = {
    "role": "ResearchAgent",
    "agent_id": "agent_001",
    "loop": "R&D"
}

log_entry = logger.log_action(action, entity)
print(log_entry["executable_json"])

# Replay later for audit
replay = logger.replay_actions(
    start_time="2026-04-01T00:00:00Z",
    end_time="2026-04-01T23:59:59Z"
)
for entry in replay:
    print(entry)
```

## 8. Kubernetes Scaling

```bash
# Scale agent deployment to 500 replicas
kubectl scale deployment agentic-agents -n agentic --replicas=500

# Check HPA status
kubectl get hpa agentic-hpa -n agentic

# Watch agent pod rollout
kubectl rollout status deployment agentic-agents -n agentic
```

## 9. Monte Carlo Investment Simulation (Downtime)

```python
from src.agents.financial_agent import FinancialAgent

agent = FinancialAgent("specs/roles/financial_agent.yaml")

task = {
    "Task": "Run_Investment_Simulations",
    "Portfolio": "GrowthPortfolio",
    "Simulations": 10000,
    "RiskWeight": 2,
    "Alignment": ["#growth", "#risk_management"]
}

result = agent.execute_task(task, modality="data")
print(result["sharpe_ratio"], result["max_drawdown"])
```

## 10. Compliance Audit (Downtime)

```python
from src.agents.compliance_agent import ComplianceAgent

agent = ComplianceAgent("specs/roles/compliance_agent.yaml")

task = {
    "Task": "Audit_Internal_Policies",
    "Framework": ["GDPR", "SOX"],
    "RiskWeight": 1,
    "Alignment": ["#compliance", "#risk_management"]
}

result = agent.execute_task(task, modality="text")
print(result["violations_found"], result["recommendations"])
```
