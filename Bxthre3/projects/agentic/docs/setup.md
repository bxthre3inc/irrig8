# Agentic1 — Setup Guide

## Prerequisites

| Requirement | Version | Install |
|-------------|---------|---------|
| Python | 3.10+ | [python.org](https://www.python.org/downloads/) |
| Redis | 6+ | `docker run -p 6379:6379 redis` |
| Docker | 24+ | [docker.com](https://docs.docker.com/get-docker/) |
| Git | 2.30+ | `apt install git` |

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bxthre3inc/agentic.git
cd agentic
```

### 2. Set Up Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
export AGENT_ROLE="ResearchAgent"
export AGENT_NAME="Researcher-1"
export REDIS_URL="redis://localhost:6379"
export SLACK_API_TOKEN="xoxb-your-token-here"
```

### 5. Initialize Configuration

```bash
mkdir -p /etc/agent-config
mkdir -p /etc/hitl-config
mkdir -p /etc/task-config

cp configs/roles/research_agent.yaml /etc/agent-config/research_agent.yaml
cp configs/hitl.yaml /etc/hitl-config/hitl.yaml
cp configs/tasks/analyze_patent.yaml /etc/task-config/analyze_patent.yaml
```

## Running the System

### Start Redis

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

### Start the Work Buffer

```bash
python3 -m src.downtime.work_buffer
```

### Run an Agent

```bash
AGENT_ROLE="ResearchAgent" python3 -m src.agents.research_agent --task specs/tasks/analyze_patent.yaml
```

### Start the HITL Manager

```bash
SLACK_API_TOKEN="xoxb-your-token" python3 -m src.hitl.hitl_manager
```

### Run the Cascading Task DAG

```bash
python3 -m src.cascading.task_dag
```

## Docker Deployment

### Build the Agent Image

```bash
docker build -f docker/Dockerfile.agent -t agentic/agent:latest .
```

### Run with Docker Compose

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts:
- Redis (port 6379)
- Agentic API (port 8080)
- HITL Manager (port 8081)
- Agentic Dashboard (port 3000)

## Kubernetes Deployment

### Prerequisites

- Kubernetes 1.28+
- Helm 3.12+

### Deploy the Full Stack

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/agent-configmap.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/agent-deployment.yaml
kubectl apply -f k8s/hitl-deployment.yaml
kubectl apply -f k8s/ui.yaml
kubectl apply -f k8s/ingress.yaml
```

### Scale to 10,000+ Agents

```bash
# Update HPA min/max
kubectl patch hpa agentic-hpa -n agentic -p '{"spec":{"minReplicas":10,"maxReplicas":10000}}'
```

## Configuration Reference

### Role YAML

```yaml
Role: "ResearchAgent"
CoreTraits:
  Skills: [CriticalThinking, ProblemSolving, Communication, Adaptability]
  Tools: [LLM, VectorDB, Python]
VelocityCapacity: 10
RiskThreshold: 5
```

### Task YAML

```yaml
Task: "Analyze_Patent_Cluster"
VelocityRequirement:
  Min: 8
  Stretch: 10
RiskWeight: 6
CascadingTriggers:
  - OnComplete: "File_Patent"
```

### HITL YAML

```yaml
intervention_points:
  - name: high_risk_transfer
    conditions:
      - RiskWeight: { min: 8 }
    notifications:
      - events: [approval_request]
        channel: "#agentic-approvals"
```
