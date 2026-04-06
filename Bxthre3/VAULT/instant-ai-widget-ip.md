# Instant AI Widget — Intellectual Property Documentation

**Concept:** Drag-and-drop AI assistant for any codebase  
**Classification:** Trade Secret + Provisional Patent Candidate  
**Conceived:** 2026-04-05 during strategic design system review  
**Inventor:** BX3 (brodiblanco)  

---

## Problem Statement

Developers and non-technical users want AI assistance in their projects without:
- Complex setup (no API configuration, no environment variables)
- Vendor lock-in (can switch between local and cloud models)
- Context switching (stay in their editor/file browser)

## Solution: Instant AI Widget

### Core Concept

A floating/dockable chat widget that can be "dropped" into any project directory. Like adding a teammate who:
- Reads your project structure and docs automatically
- Answers questions about the codebase
- Suggests improvements
- Can run commands (with approval)

### Patentable Innovations

#### 1. Zero-Configuration Context Acquisition
**Claim:** "An AI assistant system that automatically ingests project documentation, code structure, and dependencies upon placement in a file system directory without explicit user configuration."

**Mechanism:**
- Scans directory for README.md, AGENTS.md, package.json, etc.
- Builds knowledge graph from file relationships
- Identifies entry points, dependencies, architecture patterns
- No manual "add these files to context"

#### 2. Adaptive Inference Routing
**Claim:** "A method for dynamically selecting between local on-device inference and remote API-based inference based on task complexity, privacy requirements, and resource availability."

**Decision Matrix:**
```
if (containsPII(userQuery) || containsSensitiveCode(context)):
    route = LOCAL
elif (taskComplexity > localModelCapability || requiresRealTimeInfo):
    route = CLOUD_API
elif (networkQuality < threshold):
    route = LOCAL
else:
    route = USER_PREFERENCE_DEFAULT
```

#### 3. Embedded Code-Aware Chat Interface
**Claim:** "A chat interface widget that renders inline within source code editors and file system browsers, maintaining spatial relationship to the code being discussed."

**Visual Design:**
- Floating bubble (collapsed) / Slide-out panel (expanded)
- Attaches to file nodes in tree view
- Highlights referenced code blocks with synchronized scrolling
- Can "pin" to specific files or directories

---

## Technical Architecture

### Component Structure

```
instant-ai-widget/
├── core/                          # Shared business logic
│   ├── context_ingestor.py        # Auto-ingest project files
│   ├── inference_router.py        # Local vs cloud decision engine
│   ├── knowledge_graph.py         # Project understanding
│   └── chat_engine.py             # Conversation management
├── adapters/                      # Platform-specific integrations
│   ├── vscode/                    # VS Code extension
│   ├── jetbrains/                 # IntelliJ/PyCharm plugin
│   ├── desktop_overlay/           # System-wide overlay (Electron)
│   ├── browser_extension/         # Browser-based (any web IDE)
│   └── mobile/                    # iOS/Android for mobile dev
├── inference_backends/            # Pluggable AI backends
│   ├── local_llm/                 # Ollama, llama.cpp, MLX
│   ├── huggingface/               # Transformers.js, HF Inference API
│   ├── openai/                    # GPT-4, GPT-4o
│   ├── anthropic/                 # Claude 3
│   └── groq/                      # Fast inference
└── ui/                            # Shared UI components
    ├── chat_bubble.tsx
    ├── code_block_renderer.tsx
    ├── file_tree_attachment.tsx
    └── suggestion_chips.tsx
```

### Key Features

#### Drag & Drop Deployment
```bash
# Method 1: CLI
npx instant-ai-widget ./my-project

# Method 2: Drag folder to widget icon
# (Desktop: opens overlay. Web: opens in browser tab)

# Method 3: IDE Extension
# Right-click folder → "Open with Instant AI"
```

#### Auto-Context Building
```python
class ContextIngestor:
    def ingest(self, project_path: str) -> KnowledgeGraph:
        # Priority order:
        # 1. AGENTS.md / SOUL.md (explicit instructions)
        # 2. README.md (project overview)
        # 3. package.json, requirements.txt, etc. (dependencies)
        # 4. Source code entry points (main files)
        # 5. Directory structure (architecture)
        # 6. Recent git commits (activity patterns)
        
        return KnowledgeGraph.from_files(files, priority_weights)
```

#### Inference Backend Options

| Backend | Local/Cloud | Speed | Best For |
|---------|-------------|-------|----------|
| **Ollama** | Local | Medium | Daily coding, private code |
| **llama.cpp** | Local | Fast | Quick lookups, small models |
| **MLX (Apple Silicon)** | Local | Very Fast | Mac development |
| **Hugging Face Inference API** | Cloud | Fast | Open-source models, pay-per-use |
| **OpenAI GPT-4** | Cloud | Medium | Complex reasoning, latest knowledge |
| **Claude 3** | Cloud | Medium | Long context, nuanced answers |
| **Groq** | Cloud | Very Fast | Real-time, high throughput |

#### Privacy-First Architecture

```
┌─────────────────────────────────────────┐
│          Instant AI Widget              │
├─────────────────────────────────────────┤
│  ┌──────────┐      ┌──────────────┐    │
│  │ Context  │──────│  Inference   │    │
│  │ Ingestor │      │   Router     │    │
│  └──────────┘      └──────┬───────┘    │
│       │                   │            │
│       ▼                   ▼            │
│  ┌──────────┐      ┌──────────────┐    │
│  │  Local   │      │  Encrypted   │    │
│  │   LLM    │      │  API Tunnel  │    │
│  │ (Private)│      │  (Optional)  │    │
│  └──────────┘      └──────────────┘    │
└─────────────────────────────────────────┘
```

- All code context stored locally
- Cloud APIs: only query + minimal context sent
- Local inference: zero network transmission
- Optional: End-to-end encrypted tunnel for cloud

---

## Monetization Strategy

### Open Core Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Local inference only (bring your own model), 3 concurrent projects |
| **Pro** | $9/mo | Cloud API routing, 10 projects, priority support |
| **Team** | $29/mo/user | Shared team knowledge base, admin controls, audit logs |
| **Enterprise** | Custom | On-prem deployment, custom model integration, SLA |

### IP Licensing

- **Patent licensing** to IDE companies (JetBrains, Microsoft)
- **White-label** for platform integration
- **Training data licensing** (anonymized usage patterns)

---

## Implementation Priority

### MVP (Month 1)
1. VS Code extension
2. Local inference via Ollama
3. Context ingestor for common project types
4. Basic chat interface

### v1.0 (Month 2-3)
1. Cloud API routing (OpenAI, Claude, HF)
2. JetBrains plugin
3. Desktop overlay (Electron)
4. Knowledge graph visualization

### v2.0 (Month 4-6)
1. Browser extension (for web IDEs)
2. Mobile companion app
3. Team collaboration features
4. Custom model fine-tuning UI

---

## Competitive Differentiation

| Competitor | Their Approach | Instant AI Differentiator |
|------------|--------------|--------------------------|
| GitHub Copilot | Inline suggestions, IDE-only | Chat-first, project-aware, multi-platform |
| Cursor | AI-native editor | Widget works with ANY editor |
| Continue.dev | Open-source copilot | Drag-and-drop, zero config |
| Cody (Sourcegraph) | Enterprise code search | Consumer-friendly, local-first |

**Unique Value Proposition:** 
"Add AI to any project in 10 seconds. No setup. No lock-in. Your code never leaves your machine unless you choose."

---

## Patent Filing Recommendation

**File provisional patents for:**

1. **Zero-configuration context acquisition** — automatic project understanding
2. **Adaptive inference routing** — dynamic local/cloud selection
3. **Spatially-attached code chat interface** — widget-code synchronization

**Deadline:** 2026-05-15 (align with existing patent sprint)

---

**Document Classification:** Trade Secret — Do Not Disclose  
**Patent Priority:** HIGH  
**Next Action:** Create MVP VS Code extension
