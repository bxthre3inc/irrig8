# AgentOS Tool Manifest & Intent Tier System
> **Canonical Reference:** `Bxthre3/agentic/TOOL_MANIFEST.md`
> **Status:** ACTIVE — governs tool calling behavior, LFM fine-tuning scope, and HITL routing
> **Last Updated:** 2026-04-13

---

## Tier Overview

| Tier | Label | Behavior | Model Calling |
|---|---|---|---|
| **T0** | Autonomous | Free to call without announcement | Default |
| **T1** | Intentional | Must announce intent before calling | Requires `<|intent_start|>` prefix |
| **T2** | HITL-Gated | Human-in-the-loop approval required | Routes to Chairman queue |

---

## T0 — Autonomous Tools
*Free to call. No announcement required. Model may call directly after reasoning.*

### MCP Server Tools (sync_engine/mcp_server.py)
| Tool | Description | Parameters |
|---|---|---|
| `ping` | Liveness check | `agent_id` |
| `list_workspace` | List shared workspace files | `agent_id` |
| `get_secret` | Retrieve secret from vault | `agent_id`, `name` |
| `list_secrets` | List available secrets | `agent_id` |
| `list_features` | List feature flags | `agent_id` |
| `get_messages` | Read inbox messages | `agent_id`, `unread_only` |
| `get_events` | Read sync event log | `agent_id`, `limit` |
| `poll_commands` | Fetch queued commands | `agent_id` |
| `get_peers` | List registered peers | `agent_id` |
| `get_session` | Read IDE session context | `agent_id`, `target_agent` |

**Intent format:** Standard tool call only.

---

## T1 — Intentional Tools
*Must announce intent before execution. Model prefixes with `<|intent_start|>`. No execution until intent is acknowledged by receiving agent.*

### Resource Operations
| Tool | Description | Parameters |
|---|---|---|
| `sync_resource` | Push file to shared workspace | `agent_id`, `dest_path`, `content_b64`, `overwrite` |
| `read_resource` | Read file from shared workspace | `agent_id`, `path` |
| `delete_resource` | Delete shared resource | `agent_id`, `path` |
| `set_secret` | Store encrypted secret | `agent_id`, `name`, `value`, `visibility` |
| `toggle_feature` | Enable/disable feature flag | `agent_id`, `flag`, `enabled`, `global` |

### Peer & Mesh Operations
| Tool | Description | Parameters |
|---|---|---|
| `register_peer` | Register MCP server URL | `agent_id`, `mcp_server_url`, `capabilities`, `api_key` |
| `send_message` | Post to agent inbox | `agent_id`, `to`, `topic`, `body` |
| `issue_command` | Send control command to peer | `agent_id`, `target`, `command`, `args` |
| `register_extension` | Register custom extension | `agent_id`, `extension` |
| `toggle_extension` | Enable/disable extension | `agent_id`, `extension_id`, `enabled` |

### Integration Operations
| Tool | Description | Parameters |
|---|---|---|
| `linear_sync` | Sync Linear tasks/issues | `sub_action` |
| `notion_sync` | Access Notion pages/DB | `page_id` |
| `google_workspace` | Calendar/Drive operations | `sub_action` |
| `airtable_sync` | Airtable record management | — |
| `gmail_sync` | Gmail search/triage | `query` |
| `dropbox_sync` | Dropbox file sync | `path` |
| `github_sync` | PR review/issue management | — |
| `syncthing_sync` | P2P folder sync | `device_id` |
| `matrix_message` | Matrix room messaging | `room_id` |

**Intent announcement format:**
```
<|intent_start|>[tool_name(param="value")]<|intent_end|>
```
Example:
```
<|intent_start|>[sync_resource(agent_id="zo", dest_path="projects/irrig8/config.yaml", content_b64="...")]<|intent_end|>
```

---

## T2 — HITL-Gated Tools
*Must announce intent AND receive brodiblanco approval via Chairman queue before execution. Model outputs `<|chairman_intent|>` — routes to zo.space/agentic/chairman-queue.*

### Chairman-Level (brodiblanco approval required)
| Tool | Description | Why HITL |
|---|---|---|
| `file_patent` | File provisional patent | Irreversible IP action, legal deadline |
| `issue_equity` | Create/assign equity units | Cap table modification, legal |
| `authorize_payment` | Approve expenditure >$500 | Financial commitment |
| `approve_grant_submission` | Submit grant application | Irreversible, deadline-sensitive |
| `delete_workspace_path` | Destructive delete of workspace files | Data loss risk |
| `create_agent` | Spawn new named agent | Org structural change |
| `deploy_public_route` | Publish any zo.space route publicly | Public-facing commitment |
| `revoke_secret` | Permanently delete secret | Credential loss |
| `submit_water_claim` | File water court evidence | Legal proceeding, time-sensitive |
| `open_external_api_key` | Create API key for external service | Security exposure |

**Intent announcement format:**
```
<|chairman_intent|>[tool_name(param="value")]<|chairman_intent|>
  Rationale: <1-sentence why this requires human approval>
  Risk: <what could go wrong if executed autonomously>
  Alternatives: <what was considered before this request>
```
Example:
```
<|chairman_intent|>[file_patent(patent_id="PROV-007", filing_deadline="2026-05-15")]<|chairman_intent|>
  Rationale: ARPA-E deadline is 18 days away; provisional must be filed before May 1.
  Risk: Missing the filing deadline makes the patent prior-art vulnerable.
  Alternatives: Requested extension considered but ARPA-E does not allow extensions.
```

---

## Product Layer — Irrig8 Tools
*Agriculture OS tools. Tier assigned based on operational risk.*

### T0 — Autonomous
| Tool | Description |
|---|---|
| `weather_inject` | Pull weather forecast into decision context |
| `sensor_read` | Poll in-ground/above-ground sensor suite |
| `field_boundary_query` | Geo-fence operations on farm parcels |

### T1 — Intentional
| Tool | Description |
|---|---|
| `satellite_fetch` | Landsat/Sentinel imagery for field analysis |
| `soil_variability_map` | Load variability maps for precision zones |
| `pivot_schedule` | Generate/edit center-pivot irrigation schedules |
| `water_audit_log` | Append-only resource usage ledger entry |

### T2 — HITL-Gated
| Tool | Description |
|---|---|
| `compliance_report` | Generate food safety / regulatory report for submission |
| `submit_irrigation_change` | Submit change to water rights allocation |
| `deploy_firmware` | Push firmware update to sensor hardware |

---

## AgentOS Kernel Tools
*Internal orchestration. Tier assigned based on system-level impact.*

### T0 — Autonomous
| Tool | Description |
|---|---|
| `ide_open_file` | Open file in IDE session |
| `ide_get_diagnostics` | Read IDE diagnostic/errors |
| `list_extensions` | List available extensions |
| `vocalize` | Convert agent text to speech |
| `listen` | Convert audio to text |

### T1 — Intentional
| Tool | Description |
|---|---|
| `ide_edit_file` | Edit file in IDE session |
| `ide_run_terminal` | Execute terminal command |
| `git_branch` | Create/switch/merge git branches |
| `git_pr_create` | Open pull request |
| `comm_send` | Send email/SMS via SMTP/SMS |

### T2 — HITL-Gated
| Tool | Description |
|---|---|
| `git_force_push` | Force-push to protected branch |
| `deploy_route` | Deploy zo.space route |
| `register_user_service` | Register long-running managed service |
| `delete_user_service` | Remove managed service |
| `kill_session` | Terminate another agent's session |
| `modify_inbox` | Write to another agent's inbox directly |
| `override_feature_flag` | Override system-wide feature flag |

---

## Chairman Queue UI
**Route:** `https://brodiblanco.zo.space/agentic/chairman-queue`

**Display for each pending item:**
- Timestamp of request
- Requesting agent
- Proposed action with full parameters
- Rationale
- Risk assessment
- Alternatives considered
- **Approve / Deny / Request Clarification** buttons

**On approval:** Execution logged in `Bxthre3/agentic/store/chairman_audit.db` with:
- Request ID
- Approver identity
- Timestamp
- Executed action + parameters
- Outcome

---

## LFM Fine-Tuning Notes

### Data Preparation
For each tool in the manifest:
1. Generate 20-100 task-specific examples
2. Include examples of:
   - Correct tool call syntax
   - Intent announcement (T1 tools)
   - Chairman intent announcement (T2 tools) with rationale
   - Incorrect calls that would be rejected
3. For T2 tools: include counter-examples showing that autonomous execution is wrong

### Negative Examples (Critical)
The model must learn that T2 tool calls without `<|chairman_intent|>` are hallucinations:
```
User: file the PROV-007 patent
Model (WRONG): <|tool_call_start|>[file_patent(patent_id="PROV-007")]<|tool_call_end|>
Model (CORRECT): <|chairman_intent|>[file_patent(patent_id="PROV-007")]<|chairman_intent|>
  Rationale: ...
  Risk: ...
  Alternatives: ...
```

### Tool Name Sanitization for LFM
Map tool names to lowercase_snake for model output:
- `linear_sync` → `linear_sync`
- `file_patent` → `file_patent`
- `ide_run_terminal` → `ide_run_terminal`
- No renaming. Names must match manifest exactly.

---

## Tier Assignment Rules (Deterministic)

1. **Reversible + bounded scope = T0**
   - Can be undone in <5 minutes
   - No external party receives output
   - No financial or legal commitment

2. **Intentional when:**
   - Affects another agent's state or inbox
   - Creates or modifies a shared resource
   - Involves credentials or secrets
   - Triggers external API calls that commit to third parties

3. **HITL-Gated when:**
   - Irreversible (patent filing, equity issuance, data deletion)
   - Financial commitment >$500
   - Legal or regulatory action
   - Creates public-facing content
   - Affects system-level configuration
   - Could trigger security exposure

---

*This manifest is the single source of truth for tool tiering, intent formats, and fine-tuning scope. Any tool not listed here defaults to T0. Any tier dispute routes to brodiblanco for resolution.*
