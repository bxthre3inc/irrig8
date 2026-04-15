# PS5cript — AI Agent PS5 Script Builder

## 1. Concept & Vision

PS5cript is a web/mobile app built on Agentic that lets users build, test, and deploy AI agent scripts using a PS5-inspired UI. Think: dark theme, neon accents, smooth card animations, media-style layouts — the PlayStation dashboard aesthetic applied to AI agent development.

The app feels like navigating a next-gen gaming console: fluid transitions, glowing neon highlights on a deep black canvas, cards that float and pulse with life. Every interaction should feel premium and responsive, like you're interfacing with hardware designed by Sony's UX team.

**Note on "PS5 App":** The term "PS5 app" refers to the PS5-inspired UI aesthetic — deep blacks, neon blue/purple accents, glass-morphism cards, smooth spring animations. Actual PS5 native app development requires Sony SDK/certification and is not in scope. This is a web-based experience with a PS5-inspired visual language, deployable as a standard responsive web app via Zo Sites.

---

## 2. Design Language

### Aesthetic Direction
PS5 dashboard: dark-mode-first, cinematic feel, media-grid layouts, glowing neon accents, glass-morphism cards with subtle blur and border glow.

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0a0a0f` | Primary dark canvas |
| Surface | `#12121a` | Cards, panels |
| Surface Elevated | `#1a1a26` | Hover states, modals |
| Neon Blue (Primary) | `#00d4ff` | Primary accent, CTAs, active states |
| Neon Purple (Secondary) | `#a855f7` | Secondary accent, gradients |
| Neon Pink (Accent) | `#ff2d92` | Highlights, badges, notifications |
| Text Primary | `#ffffff` | Headings, important text |
| Text Secondary | `#9ca3af` | Body text, descriptions |
| Text Muted | `#6b7280` | Placeholders, timestamps |
| Border Glow | `rgba(0, 212, 255, 0.3)` | Card borders, focus rings |
| Success | `#10b981` | Deployed, success states |
| Warning | `#f59e0b` | Pending, warnings |
| Error | `#ef4444` | Errors, destructive actions |

### Typography
- **Headings:** `Inter` (700/800 weight) — clean, modern, slightly condensed feel
- **Body:** `Inter` (400/500 weight)
- **Mono/Code:** `JetBrains Mono` — for script editor, code snippets
- Fallback: `system-ui, -apple-system, sans-serif`

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Border radius: 8px (small), 12px (medium), 16px (large), 24px (cards)
- Card padding: 24px default

### Motion Philosophy
- **Spring animations:** `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy feel
- **Ease-out:** `cubic-bezier(0.16, 1, 0.3, 1)` for smooth deceleration
- **Duration:** 150ms micro-interactions, 300ms transitions, 500ms page transitions
- **Hover lift:** Cards translate -4px Y with enhanced glow on hover
- **Stagger:** List items animate in with 50ms stagger delay

### Visual Assets
- Icons: Lucide React (consistent stroke weight)
- Gradients: Linear gradients using neon blue → neon purple
- Glow effects: Box-shadow with neon color at 30-50% opacity, blur 20-40px
- Glass-morphism: `backdrop-filter: blur(12px)` with semi-transparent backgrounds

---

## 3. Layout & Structure

### Page Structure

#### 3.1 Global Shell
- **Top Navigation Bar** (fixed, 64px height)
  - Left: PS5cript logo (neon glow)
  - Center: Navigation tabs (Dashboard, Editor, Library, Deployments)
  - Right: User avatar, settings icon
- **Bottom Tab Bar** (mobile only, 56px height)
  - 4 icons with labels: Home, Editor, Library, Profile

#### 3.2 Dashboard (`/`)
- Hero section: "Build AI Agents Without Code" headline + CTA
- Quick stats row: Scripts created, Tests run, Agents deployed
- Recent scripts grid (3 columns desktop, 1 mobile)
- Template spotlight carousel

#### 3.3 Script Editor (`/editor`)
- Full-width split layout:
  - Left panel (60%): Natural language input + structured script preview
  - Right panel (40%): Live preview / test sandbox
- Bottom drawer: Advanced settings (optional)
- Floating action button: Save, Test, Deploy

#### 3.4 Template Library (`/library`)
- Category filter chips (horizontal scroll mobile)
- Search bar with neon focus ring
- Card grid (3 cols → 2 cols → 1 col responsive)
- Each card: thumbnail, title, description, use count, "Use" button

#### 3.5 Deployments (`/deployments`)
- Status list view: agent name, status badge, last run, actions
- Detail view: agent config, test history, live metrics

### Responsive Strategy
- Mobile-first breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Grid collapses: 3→2→1 columns
- Navigation: bottom tab bar on mobile, side/top on desktop
- Touch targets: minimum 44x44px

---

## 4. Features & Interactions

### 4.1 Script Editor

**Natural Language Input**
- Large textarea with placeholder: "Describe what you want your agent to do..."
- As user types, AI parses and shows structured preview in real-time (debounced 1s)
- Toggle between raw input and structured JSON/YAML view

**Structured Script Preview**
- Displays parsed script as editable fields:
  - Agent name
  - Primary goal
  - Allowed actions (multi-select)
  - Response style (multi-select)
  - Conversation starters (list)
  - Fallback behavior
- Each field has neon focus ring when editing

**Test Sandbox**
- Chat-style interface to run test conversations
- Input at bottom, message history above
- Agent responses show as "typing..." animation then reveal
- Test results panel: success/fail badges per requirement checked

**Save & Version**
- Save to local storage ( IndexedDB)
- Version history sidebar (last 10 versions)
- Export as JSON/YAML file

### 4.2 Template Library

**Categories**
- Sales & Lead Gen
- Customer Support
- Data & Research
- Social Media
- Internal Ops
- Custom / Community

**Template Card Interactions**
- Hover: lift -4px, glow intensifies, "Preview" overlay appears
- Click "Preview": modal with full description, sample script, reviews
- Click "Use": opens editor pre-populated with template

**Search**
- Real-time filtering as user types
- Highlights matching text in results
- Empty state: "No templates found. Try a different search."

### 4.3 Agent Deployment

**Pre-Deploy Checklist**
- Script validation (all required fields filled)
- Test pass rate (must have ≥1 successful test)
- Naming convention check (alphanumeric, 3-30 chars)

**Deployment Flow**
1. Click "Deploy" → confirmation modal
2. Agent registers with Agentic backend via API
3. Success: status badge changes to "Live", unique agent ID shown
4. Share button: copy shareable link

**Agent Management**
- Pause/Resume toggle
- Configuration update (re-opens editor with saved script)
- View analytics: conversations run, avg response time, user satisfaction
- Delete with confirmation

### 4.4 User Account

**Auth (Phase 1: local storage only)**
- Simple username/display name setup
- All scripts stored in IndexedDB per browser

**Profile**
- Display name
- Avatar (initials-based, neon gradient background)
- Stats: total scripts, tests, deployments

---

## 5. Component Inventory

### 5.1 Button
| Variant | Default | Hover | Active | Disabled |
|---------|---------|-------|--------|----------|
| Primary | Neon blue bg, dark text | Glow intensifies, slight scale 1.02 | Scale 0.98 | 50% opacity, no glow |
| Secondary | Transparent, neon blue border | Neon blue bg at 10% | Scale 0.98 | 50% opacity |
| Ghost | Transparent, text only | Neon blue text | Neon blue text | 50% opacity |
| Danger | Error red bg | Glow intensifies | Scale 0.98 | 50% opacity |

### 5.2 Card
- Default: `#12121a` bg, 1px border `rgba(255,255,255,0.05)`, 24px radius
- Hover: translate -4px Y, border glow `rgba(0,212,255,0.3)`, shadow `0 20px 40px rgba(0,212,255,0.1)`
- Active/Selected: neon blue border, subtle pulse animation

### 5.3 Input / Textarea
- Default: `#1a1a26` bg, 1px border `rgba(255,255,255,0.1)`, 12px radius
- Focus: neon blue border glow, no outline
- Error: error red border, error message below
- Disabled: 50% opacity

### 5.4 Badge
- Live: success green bg with pulse animation
- Draft: muted gray bg
- Testing: warning amber bg
- Error: error red bg

### 5.5 Modal
- Backdrop: `rgba(0,0,0,0.8)` with `backdrop-filter: blur(8px)`
- Content: `#12121a` bg, 24px radius, max-width 500px
- Enter: fade in + scale from 0.95
- Exit: fade out + scale to 0.95

### 5.6 Navigation Tab
- Default: muted text
- Hover: text brightens
- Active: neon blue text, underline with neon glow

### 5.7 Chat Bubble
- User: neon blue gradient bg, right-aligned
- Agent: surface bg, left-aligned, subtle border
- Typing indicator: 3 dots pulsing in sequence

---

## 6. Technical Approach

### Stack
- **Runtime:** Bun
- **Framework:** Hono (matching Agentic backend architecture)
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Storage:** IndexedDB (via idb library) for local persistence
- **Deployment:** Zo Sites

### Project Structure
```
ps5cript/
├── src/
│   ├── routes/           # Hono route handlers
│   │   ├── index.tsx     # Dashboard
│   │   ├── editor.tsx    # Script editor
│   │   ├── library.tsx   # Template library
│   │   └── deployments.tsx
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Base components (Button, Card, Input, etc.)
│   │   └── features/     # Feature components (ScriptEditor, TemplateCard, etc.)
│   ├── lib/
│   │   ├── db.ts         # IndexedDB operations
│   │   ├── agentic.ts    # Agentic API client
│   │   └── parser.ts     # Natural language → structured script parser
│   ├── stores/           # State management (Zustand or similar)
│   ├── styles/           # Global styles, CSS variables
│   └── types/            # TypeScript interfaces
├── public/
│   └── assets/           # Static assets
├── SPEC.md
├── README.md
└── package.json
```

### API Design (Agentic Integration)

**Endpoints used:**
- `POST /api/agents` — Register new agent
- `GET /api/agents/:id` — Get agent status
- `PUT /api/agents/:id` — Update agent config
- `DELETE /api/agents/:id` — Remove agent
- `POST /api/agents/:id/test` — Run test conversation

**Agentic API payload for script deployment:**
```typescript
interface AgentScript {
  id: string;
  name: string;
  goal: string;
  allowedActions: string[];
  responseStyle: string[];
  conversationStarters: string[];
  fallbackBehavior: string;
  createdAt: string;
  updatedAt: string;
}
```

### Data Model

**Script (stored in IndexedDB)**
```typescript
interface Script {
  id: string;           // UUID
  name: string;
  description: string;
  naturalLanguageInput: string;
  structuredScript: AgentScript;
  version: number;
  createdAt: string;
  updatedAt: string;
  testResults?: TestResult[];
}
```

**Template**
```typescript
interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  script: AgentScript;
  useCount: number;
  rating: number;
  author: string;
}
```

### Phase 1 Scope (MVP)
- Script editor with natural language input and structured preview
- Basic template library (5-10 pre-built templates)
- Test sandbox (local only, no real Agentic backend in MVP)
- Local save/load via IndexedDB
- PS5-inspired UI with all core components
- Deploy button (connects to Agentic when backend is ready)

### Out of Scope (Future)
- Real user auth (OAuth, etc.)
- Cloud sync
- Script marketplace
- Actual PS5 native app
- Team collaboration

---

## 7. Milestones

- [ ] **M1:** Project scaffold, design system setup, base components
- [ ] **M2:** Script editor with natural language parsing
- [ ] **M3:** Template library with categories and search
- [ ] **M4:** Test sandbox
- [ ] **M5:** Agentic API integration (deployment)
- [ ] **M6:** Polish, animations, responsive testing
