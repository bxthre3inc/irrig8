# INBOX Routing — Investor Relations
**Script:** `Bxthre3/INBOX/agents/INBOX_ROUTING.py`
**Usage:** `python3 Bxthre3/INBOX/agents/INBOX_ROUTING.py <agent> "<message>" [P0-P3] [department]

## Routing Table

| Priority | Destination | Trigger |
|---|---|---|
| P0 | `INBOX.md` + SMS brodiblanco | Term sheet received, lead investor confirmed, closing imminent |
| P1 | `INBOX.md` + SMS brodiblanco | Meeting with decision-maker, DD request, legal concern |
| P2 | `departments/investor-relations/` | Routine pipeline updates, deck revisions, follow-ups |
| P3 | `departments/investor-relations/` | Background research, landscape mapping |

## Department Codes

- `ir` = investor-relations (default)
- `finance` = finance (Balance)
- `legal` = legal (Raj)
- `engineering` = engineering (Iris)

## Examples

```
# Routine IR update
python3 Bxthre3/INBOX/agents/INBOX_ROUTING.py reach "Pipeline update: 5 new Tier 2 leads" P2 ir

# P1 escalation
python3 Bxthre3/INBOX/agents/INBOX_ROUTING.py reach "DD request from Finisterra VC" P1

# P0 — term sheet
python3 Bxthre3/INBOX/agents/INBOX_ROUTING.py reach "TS received — S2G Ventures, $7M at $25M cap" P0
```
