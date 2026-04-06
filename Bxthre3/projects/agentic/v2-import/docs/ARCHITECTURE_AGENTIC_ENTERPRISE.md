# Project Agentic Enterprise Architecture

This document provides a detailed technical overview of Project Agentic Enterprise's architecture.

## System Overview

Project Agentic Enterprise is a self-improving AI agent designed to run on resource-constrained Android devices. The architecture follows a minimal, zero-dependency philosophy with exactly five core components.

```
┌─────────────────────────────────────────────────────────────┐
│                  PROJECT AGENTIC ENTERPRISE                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   SMS I/O   │  │   KERNEL    │  │     SKILL LIBRARY   │  │
│  │   LAYER     │──│   (LLM)     │──│   (file-based)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │             │
│         ▼                ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                 MEMORY LAYER (SQLite)                   ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              SELF-MODIFICATION ENGINE                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. SMS I/O Layer (`sms_handler.py`)

**Purpose:** Primary user interface via text messages

**Key Features:**
- Native Android SMS integration via JNI
- Asynchronous message handling
- Automatic message logging
- No data plan required

**Key Classes:**
- `SMSHandler` - Main SMS management class
- `SMSReceiver` - Broadcast receiver for incoming SMS

**API:**
```python
class SMSHandler:
    def __init__(self, message_callback: Callable)
    def send_sms(self, recipient: str, message: str) -> bool
    def receive_sms(self, sender: str, message: str) -> str
    def start_listening(self)
    def stop_listening(self)
```

### 2. Kernel (`kernel.py`)

**Purpose:** Minimal language model inference engine

**Key Features:**
- GGUF model format support via llama.cpp
- Sub-10M parameter models (TinyStories-33M recommended)
- Q4 quantization for minimal memory footprint
- ARM64 optimized inference

**Key Classes:**
- `Kernel` - Standard inference engine
- `TinyKernel` - Optimized for very constrained devices

**API:**
```python
class Kernel:
    def __init__(self, model_path: str)
    def generate(self, prompt: str, context: str = "") -> str
    def set_system_prompt(self, prompt: str)
    def set_parameters(self, **kwargs)
    def get_model_info(self) -> dict
```

**Memory Requirements:**
| Model | Parameters | Quantized Size | Runtime Memory |
|-------|-----------|----------------|----------------|
| TinyStories-1M | 1M | ~5MB | ~30MB |
| TinyStories-10M | 10M | ~10MB | ~60MB |
| TinyStories-33M | 33M | ~15MB | ~100MB |
| Qwen2.5-0.5B | 500M | ~350MB | ~180MB |

### 3. Skill Library (`skills.py`)

**Purpose:** File-based storage of executable capabilities

**Key Features:**
- JSON-based skill storage
- Embedded Python code execution
- Meta-skill for skill creation
- Skill usage tracking

**Key Classes:**
- `SkillLibrary` - Main skill management
- `SkillBuilder` - Helper for creating skills

**Skill Schema:**
```json
{
  "name": "skill_name",
  "description": "What this skill does",
  "code": "def execute(input): return processed_output",
  "created": 1234567890.0,
  "usage_count": 0,
  "success_rate": 0.0
}
```

**API:**
```python
class SkillLibrary:
    def create_skill(self, name: str, description: str, code: str) -> bool
    def get_skill(self, name: str) -> Optional[Dict]
    def execute_skill(self, name: str, input_text: str) -> str
    def find_skill(self, message: str) -> Optional[str]
    def list_skills(self) -> List[str]
    def delete_skill(self, name: str) -> bool
```

### 4. Memory Layer (`memory.py`)

**Purpose:** Persistent storage using SQLite

**Key Features:**
- Conversation history
- Learning patterns
- Self-modification logs
- User preferences
- No external dependencies (SQLite built into Android)

**Database Schema:**
```sql
-- Messages
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    timestamp REAL,
    direction TEXT,
    sender TEXT,
    content TEXT
);

-- Learnings
CREATE TABLE learnings (
    id INTEGER PRIMARY KEY,
    timestamp REAL,
    trigger_pattern TEXT,
    response TEXT,
    success_count INTEGER
);

-- Modifications
CREATE TABLE modifications (
    id INTEGER PRIMARY KEY,
    timestamp REAL,
    component TEXT,
    old_state TEXT,
    new_state TEXT,
    reason TEXT,
    success BOOLEAN
);
```

**API:**
```python
class Memory:
    def log_message(self, direction: str, sender: str, content: str)
    def get_context(self, sender: str, limit: int = 5) -> str
    def add_learning(self, trigger: str, response: str)
    def log_modification(self, component: str, old: str, new: str, reason: str)
    def get_stats(self) -> Dict
```

### 5. Self-Modification Engine (`self_mod.py`)

**Purpose:** Autonomous improvement over time

**Key Features:**
- Simplified Darwin Gödel Machine architecture
- Sandbox testing before applying changes
- Audit logging of all modifications
- Rollback capability

**Modification Cycle:**
```
┌─────────────────────────────────────────────┐
│           SELF-MODIFICATION CYCLE           │
├─────────────────────────────────────────────┤
│  1. OBSERVE: Analyze recent interactions    │
│  2. HYPOTHESIZE: Propose improvement        │
│  3. TEST: Apply modification in sandbox     │
│  4. COMMIT: If tests pass, apply change     │
└─────────────────────────────────────────────┘
```

**Modifiable Components:**
- System prompts
- Skill library
- Response templates
- Generation parameters

**Immutable Components (Safety):**
- Core LLM weights
- SMS permissions
- Safety constraints

**API:**
```python
class SelfModificationEngine:
    def observe_and_improve(self) -> Optional[str]
    def get_modification_history(self, limit: int = 10) -> List[Dict]
    def rollback_last_modification(self) -> bool
```

## Data Flow

### Incoming SMS Processing

```
1. SMS arrives on device
2. Android broadcasts SMS_RECEIVED intent
3. SMSReceiver captures intent
4. SMSHandler.receive_sms() called
5. Message logged to Memory
6. Check for skill match
7. If skill: execute skill
8. If no skill: Kernel.generate()
9. Response logged to Memory
10. SMSHandler.send_sms() returns response
```

### Self-Modification Flow

```
1. Interaction count threshold reached
2. SelfModificationEngine.observe_and_improve() triggered
3. _observe(): Analyze recent messages
4. _analyze_patterns(): Find patterns
5. _hypothesize(): Generate improvement proposals
6. _sandbox_test(): Validate each proposal
7. _apply_modification(): Apply if valid
8. Log modification to Memory
```

## File Structure

```
/sdcard/agentic-enterprise/
├── models/
│   └── tinystories-33m-q4.gguf    # LLM model file
├── skills/
│   ├── create_skill.json          # Meta-skill
│   ├── help.json                  # Help skill
│   └── [user-created skills]
├── agentic-enterprise.db                     # SQLite database
└── config.json                    # Configuration
```

## Configuration

```json
{
  "model": "tinystories-33m-q4.gguf",
  "max_tokens": 256,
  "temperature": 0.7,
  "top_p": 0.9,
  "top_k": 40,
  "repeat_penalty": 1.1,
  "self_mod_frequency": "daily",
  "min_interactions_before_mod": 10,
  "max_modifications_per_day": 5
}
```

## Performance Considerations

### Memory Optimization
- Use Q4 quantization for models
- Limit context window size
- Implement message cleanup (older than 30 days)
- Monitor memory usage and adjust parameters

### Battery Optimization
- Batch process messages when possible
- Reduce inference frequency
- Use lower temperature for faster generation
- Implement sleep modes during inactivity

### Storage Optimization
- Regular cleanup of old messages
- Compress skill code
- Archive modification history

## Security Model

### Permissions Required
- `RECEIVE_SMS` - Receive incoming SMS
- `SEND_SMS` - Send responses
- `READ_SMS` - Access SMS history (optional)
- `WRITE_EXTERNAL_STORAGE` - Store models and data

### Safety Constraints
- Frozen model weights (cannot be modified)
- Immutable safety rules
- Sandboxed skill execution
- Audit logging of all modifications
- Human-verifiable changes

## Future Architecture Considerations

### Planned Enhancements
1. Voice I/O using Android TTS/STT
2. Notification intelligence
3. Web configuration interface
4. Federated learning for model updates
5. Multi-agent collaboration

### Scalability
- Support for larger models as hardware improves
- Skill marketplace integration
- Cloud sync for backup (optional)
- Multi-device coordination