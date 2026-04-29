# Agentic1 Documentation

## Architecture

### High-Level Design

```
graph TD
A[You: Master Loop] -->|Intents/RWES| B[Executive Agent Loop]
B -->|Cascades| C[Subsidiary/Team Loops]
C --> D[Subsidiary A Loop]
C --> E[Subsidiary B Loop]
C --> F[R&D Loop]
D --> G[Agents/Humans/Mechanical]
E --> G
F --> G
G -->|Downtime Protocol| H[Work Buffer: Redis]
H -->|Self-Generated Tasks| G
B -->|RWES| A
G -->|Escalation| B
G -->|Logs| I[Deterministic Logging: Dolt]
I -->|Audit| A
```

### Key Components

- **Executive Agent Loop**: Orchestrates all other loops, manages RWES, and handles escalations.
- **Subsidiary/Team Loops**: Contain agents, humans, and mechanical entities. Execute tasks and cascade events.
- **Agents**: Execute tasks, cascade events, and generate outputs. Inherit core traits and have specialized traits.
- **Downtime Protocol**: Ensures agents always have work (assigned or self-generated).
- **Deterministic Logging**: Logs every action as executable code for full auditability.

### Data Flow

1. You issue a command (e.g., "Analyze these patents").
2. The Executive Agent Loop parses the intent and assigns it to the appropriate loop.
3. The Subsidiary/Team Loop assigns the task to an agent with the required traits.
4. The Agent executes the task, logs the action, and triggers any cascading tasks.
5. The Downtime Protocol ensures idle agents spawn self-generated tasks.
6. All actions are logged in Dolt for auditability.

## API Documentation

### Agents

#### BaseAgent

**Methods:**

- `__init__(role_yaml_path: str)` - Initialize agent from YAML role definition.
- `can_handle_task(task: Dict) -> bool` - Check if agent meets task prerequisites.
- `execute_task(task: Dict, modality: str = "text") -> Dict` - Execute task with ambition protocol and cascading.

**Example:**
```python
from src.agents.base_agent import BaseAgent
agent = BaseAgent("specs/roles/research_agent.yaml")
task = {
    "Task": "Analyze_Patent_Cluster",
    "Prerequisites": {"Requires": ["LLM", "GPU"]},
    "RiskWeight": 6,
}
if agent.can_handle_task(task):
    result = agent.execute_task(task)
    print(result)
```

### Modality Handlers

#### ModalityRouter

**Methods:**

- `route(input_data: Any, modality: str, **kwargs) -> Any` - Route input to the appropriate handler.

**Example:**
```python
from src.modalities.modality_router import ModalityRouter
router = ModalityRouter()
text_result = router.route("Analyze this patent.", "text")
voice_result = router.route(b"voice_command.wav", "voice")
```

### Cascading Workflows

#### patent_workflow

**Parameters:**

- `patents: List[str]` - List of patent IDs to analyze.
- `agent: str = "ResearchAgent"` - Agent to execute the workflow.

**Returns:**

- `Dict` - Results of analysis, filing, and notification.

**Example:**
```python
from src.cascading.task_dag import patent_workflow
result = patent_workflow(["patent_123", "patent_456"])
print(result)
```

### Work Buffer

#### WorkBuffer

**Methods:**

- `add_task(task: Dict, task_type: str = "assigned") -> bool` - Add a task to the work buffer.
- `get_next_task(agent_role: str) -> Optional[Dict]` - Get the highest-priority task for an agent.
- `spawn_downtime_task(agent_role: str) -> Optional[Dict]` - Spawn a self-generated task for an idle agent.

**Example:**
```python
from src.downtime.work_buffer import WorkBuffer
buffer = WorkBuffer()
buffer.add_task({"Task": "Analyze_Patents", "RiskWeight": 6}, "assigned")
next_task = buffer.get_next_task("ResearchAgent")
print(next_task)
```

### Deterministic Logger

#### DeterministicLogger

**Methods:**

- `log_action(action: Dict, entity: Dict) -> Dict` - Log an action as executable JSON.
- `replay_actions(start_time: str, end_time: str) -> List[Dict]` - Replay actions from a time range.

**Example:**
```python
from src.logging.deterministic_logger import DeterministicLogger
logger = DeterministicLogger()
action = {"Task": "Analyze_Patents", "target": ["patent_123"]}
entity = {"role": "ResearchAgent", "id": "agent_123"}
log_entry = logger.log_action(action, entity)
print(log_entry)
```

## Setup Guide

### Prerequisites

- Python 3.10+: [Download Python](https://www.python.org/downloads/)
- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Redis: Running locally or via Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bxthre3/Agentic1.git
   cd Agentic1
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start Redis:
   ```bash
   docker run -p 6379:6379 redis
   ```

5. Initialize Dolt (optional for deterministic logging):
   ```bash
   dolt init
   ```

### Running the System

1. Start the work buffer:
   ```bash
   python -m src.downtime.work_buffer
   ```

2. Run an agent:
   ```bash
   python -m src.agents.research_agent --task specs/tasks/analyze_patents.yaml
   ```

3. Test a cascading workflow:
   ```bash
   python -m src.cascading.task_dag
   ```