# Agentic System

Multi-tiered AI workforce orchestration with HITL and Kubernetes scaling.

## Version

**version: 1.0.0** | **release: 1.0.0**

## Architecture

```
CEO Agent
  └── C-Suite (Legal, Finance, Operations)
        └── Divisions (Research, Engineering, QA)
              └── Teams (individual agents)
                    └── Sub-Agents (downtime monetization)
```

## Components

| Component | Version | Location |
|-----------|---------|----------|
| Base Agent | 1.0.0 | `src/agents/base_agent.py` |
| HITL Manager | 1.0.0 | `src/hitl/hitl_manager.py` |
| Cascading Task DAG | 1.0.0 | `src/cascading/task_dag.py` |

## Roles

- `analyst` - data processing, statistical analysis, visualization
- `engineer` - system design, implementation, deployment
- `researcher` - literature review, hypothesis testing
- `qa` - test case design, test execution
- `manager` - task coordination, resource allocation

## Tasks

- `data_processing` - raw data → structured format
- `statistical_analysis` - processed data → analysis report
- `system_design` - requirements → architecture doc
- `code_implementation` - design → codebase
- `test_execution` - test cases → results report
- `literature_review` - topic → review report

## HITL Intervention Points

- `task_approval` - pre-task human approval
- `result_review` - post-task human review
- `escalation` - on-failure human intervention

## Kubernetes Scaling

- HPA: 2 → 100 replicas
- Namespace: `agent-system`
- Services: hitl-service, task-dag-service, redis

## Quick Start

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/agent-configmap.yaml
kubectl apply -f k8s/agent-deployment.yaml
kubectl apply -f k8s/hitl-deployment.yaml
kubectl apply -f k8s/task-dag-deployment.yaml
```

## Dashboard

Live UI: https://brodiblanco.zocomputer.io/agentic-dashboard