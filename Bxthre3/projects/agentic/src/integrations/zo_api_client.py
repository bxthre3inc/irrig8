"""Zo API client — calls the local agentic API server which bridges to Zo app tools.

The agentic API server (port 5182) acts as a bridge.
Agents call local methods here → server calls Zo app tools → returns result.
"""
import urllib.request, json, logging, os

logger = logging.getLogger("zo_api")
BASE = os.environ.get("AGENTIC_API_URL", "http://localhost:5182")

def _call(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=body,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except Exception as e:
        logger.error(f"ZoAPI {path} error: {e}")
        return {"error": str(e)}

class GmailClient:
    def health_check(self):
        return {"status": "ok", "provider": "gmail"}

    def send(self, to, subject, body, body_type="plaintext"):
        return _call("/tool/gmail/send", {
            "to": to, "subject": subject, "body": body, "bodyType": body_type,
            "email": "bxthre3inc@gmail.com"
        })

    def sendHITLApproval(self, to, task_name, task_desc, urgency="medium"):
        subject = f"[AGENTIC HITL] Approval required: {task_name}"
        body = (
            f"An agentic task requires your approval.\n\n"
            f"Task: {task_name}\nDescription: {task_desc}\nUrgency: {urgency}\n\n"
            f"Reply APPROVE or DENY to this email.\n---\nAgentic AI Workforce"
        )
        return self.send(to, subject, body)

    def read_recent(self, n=20, query=""):
        q = query or "in:inbox newer_than:7d"
        return _call("/tool/gmail/search", {
            "q": q, "maxResults": n, "withTextPayload": True,
            "email": "bxthre3inc@gmail.com"
        })

class CalendarClient:
    def health_check(self):
        return {"status": "ok", "provider": "google_calendar"}

    def create_event(self, summary, start, end=None, description="", location="", attendees=None):
        return _call("/tool/calendar/create", {
            "summary": summary, "eventStartDate": start, "eventEndDate": end or start,
            "description": description, "location": location, "attendees": attendees or []
        })

    def list_upcoming(self, n=10):
        return _call("/tool/calendar/list", {"maxResults": n})

    def delete_event(self, event_id):
        return _call("/tool/calendar/delete", {"eventId": event_id})

    def update_event(self, event_id, **kwargs):
        d = {"eventId": event_id}
        d.update(kwargs)
        return _call("/tool/calendar/update", d)

class TasksClient:
    def health_check(self):
        return {"status": "ok", "provider": "google_tasks"}

    def create_task(self, title, notes="", due=None, list_id=None):
        return _call("/tool/tasks/create", {"title": title, "notes": notes, "due": due, "taskListId": list_id})

    def list_tasks(self, list_id=None):
        return _call("/tool/tasks/list", {"taskListId": list_id})

    def complete_task(self, task_id):
        return _call("/tool/tasks/complete", {"taskId": task_id})

class LinearClient:
    def health_check(self):
        return {"status": "ok", "provider": "linear"}

    def create_issue(self, title, description="", team_id=None):
        return _call("/tool/linear/create_issue", {"title": title, "description": description, "teamId": team_id})

    def list_issues(self, team_id=None):
        return _call("/tool/linear/list_issues", {"teamId": team_id})

class NotionClient:
    def health_check(self):
        return {"status": "ok", "provider": "notion"}

    def search_pages(self, query):
        return _call("/tool/notion/search", {"query": query, "email": "bxthre3inc@gmail.com"})

    def create_page(self, parent_id, title, content=""):
        return _call("/tool/notion/create_page", {
            "parentId": parent_id, "title": title, "pageContent": content,
            "email": "bxthre3inc@gmail.com"
        })

class StripeClient:
    def health_check(self):
        return {"status": "ok", "provider": "stripe"}

    def create_payment_link(self, price_id):
        return _call("/tool/stripe/payment_link", {"priceId": price_id})
