# BX3 OPERATIONAL RUNBOOKS
## How To Actually Do Things

**Purpose:** Step-by-step procedures for critical operations

---

## RUNBOOK-001: Adding a New OpCo to Agentic

**Prerequisites:**
- [ ] OpCo charter document (`CHARTER.md`)
- [ ] Defined L4 worker roles (what the OpCo actually does)
- [ ] Sovereign approval (verbal/written)

**Procedure:**

1. **Create directory structure**
   ```bash
   mkdir -p Bxthre3/projects/the-{opco}-project/{src,docs,tests,impact}
   touch Bxthre3/projects/the-{opco}-project/CHARTER.md
   ```

2. **Define L4 workers in Agentic**
   - Add to `org.ts` agent roster
   - Assign to OpCo department
   - Set status to 'idle' until activated

3. **Create INBOX**
   ```bash
   touch Bxthre3/INBOX/agents/{worker-name}.md
   ```

4. **Register with RAIN** (if regulatory monitoring needed)
   - Add sector classification to RAIN data sources
   - Set up daily-brief monitoring

5. **Sovereign verification**
   - Run: `python3 validate_new_opco.py {opco-name}`
   - Confirm no Bxthre3 nesting violations
   - Confirm canonical naming

**Rollback:**
- Delete directory if validation fails
- Remove from org.ts
- Archive INBOX (don't delete — audit trail)

---

## RUNBOOK-002: Grant Submission via Agentic

**Trigger:** Maya (Grant Strategist) identifies opportunity

**Procedure:**

1. **Maya logs opportunity**
   - Add to `Bxthre3/grants/PIPELINE.md`
   - Assign tier (S/A/B/C)
   - Set deadline in Google Calendar

2. **Maya creates INBOX task for writing agent**
   ```markdown
   ## P1: Grant Draft — [Program Name]
   - Deadline: YYYY-MM-DD
   - Amount: $XXX,XXX
   - Fit Score: X/10
   - Approach: [research angle]
   - Output: Full application package
   ```

3. **Writing agent (assigned) drafts**
   - Read relevant specs from project
   - Use DOCUMENT_STANDARDS.md format
   - Include verification citations [^n]
   - Save to `grants/applications/{program}-{date}.md`

4. **Maya review**
   - Fact-check all claims
   - Verify sources exist
   - Flag [VERIFY] items

5. **Sovereign approval**
   - Review for alignment with strategy
   - Approve submission or request revision

6. **Maya submits + logs**
   - Submit via program portal
   - Update PIPELINE.md status to 'Submitted'
   - Set reminder for 30-day follow-up

**Rollback:**
- If draft rejected at step 4: return to step 3 with notes
- If missed deadline: log in `grants/MISSED.md`, analyze why

---

## RUNBOOK-003: P1 Escalation to Sovereign

**Trigger:** Any agent/system detects critical issue

**Immediate Actions (within 5 minutes):**

1. **Log to canonical INBOX**
   ```bash
   python3 Bxthre3/INBOX/agents/INBOX_ROUTING.py {agent} "{message}" P0 {dept}
   ```

2. **SMS Sovereign**
   - Auto-triggered by INBOX_ROUTING on P0/P1
   - Format: "🔴 P1 ALERT from [Agent]: [summary]"

3. **Document in agent INBOX**
   - What happened
   - Impact assessment
   - Immediate containment
   - What Sovereign needs to decide

**Sovereign Response Options:**
- ACK: I'm aware, continue with proposed fix
- OVERRIDE: Do X instead
- PAGE: Escalate to human expert
- HALT: Pause all related operations

**Resolution:**
- Update INBOX with resolution
- If systemic issue, create ADR
- Update runbook if procedure gap

---

## RUNBOOK-004: Deploying to zo.space

**Prerequisites:**
- [ ] Route code tested locally
- [ ] No secrets in code (use env vars)
- [ ] Sovereign approval for public routes

**Procedure:**

1. **For new route:**
   ```typescript
   // update_space_route(path, route_type, code, public)
   update_space_route('/new-route', 'page', code, false)  // default private
   ```

2. **For edit:**
   ```typescript
   // Use code_edit, not full code rewrite
   update_space_route('/existing-route', 'page', code_edit, edit_instructions, public)
   ```

3. **Verify deployment:**
   ```bash
   curl https://brodiblanco.zo.space/new-route
   # Check 200 OK
   ```

4. **If private route:**
   - Test with auth: confirm 401 without session
   - Test with auth: confirm 200 with session

**Rollback:**
- `undo_space_route('/path')` — restores previous version
- Or use `get_space_route_history()` to find version, manually restore

---

## RUNBOOK-005: Capturing Knowledge for VAULT

**Trigger:** Any novel insight, architecture decision, or solution

**Procedure:**

1. **Real-time capture (lightweight)**
   - Add to conversation notes
   - Tag: #IP #novel #architecture

2. **End-of-session refinement**
   - Synthesize into coherent narrative
   - Identify: Problem → Action → Outcome

3. **File in VAULT**
   - Path: `Bxthre3/VAULT/drafts/{topic}-{date}.md`
   - Include: Quantified impact, cross-references

4. **Weekly review**
   - Zoe/Atlas review all drafts
   - Promote to `case-studies/` if significant
   - Archive if duplicate or low-value

**Quality Criteria:**
- Would this help future agent/human understand WHY?
- Is the context reconstructible?
- Are all claims verifiable?

---

*All runbooks must be tested quarterly*