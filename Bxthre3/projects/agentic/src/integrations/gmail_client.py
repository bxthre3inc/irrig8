"""Gmail client — uses Zo's real Gmail integration."""
import logging, json, os
logger = logging.getLogger("gmail")

class GmailClient:
    def __init__(self):
        self.name = "gmail"
        self._token = os.environ.get("ZO_INTEGRATION_GMAIL_TOKEN", "")

    def health_check(self):
        return {"status": "ok", "provider": "gmail", "mode": "zo-native"}

    def send(self, to, subject, body, body_type="plaintext"):
        from tools import use_app_gmail
        result = use_app_gmail(
            "gmail-send-email",
            configured_props=json.dumps({"to": to, "subject": subject, "body": body, "bodyType": body_type}),
            email="bxthre3inc@gmail.com"
        )
        logger.info(f"email sent to {to}: {subject}")
        return result

    def sendHITLApproval(self, to, task_name, task_desc, urgency="medium"):
        subject = f"[AGENTIC HITL] Approval required: {task_name}"
        body = (
            f"An agentic task requires your approval before execution.\n\n"
            f"Task: {task_name}\n"
            f"Description: {task_desc}\n"
            f"Urgency: {urgency}\n\n"
            f"Reply APPROVE or DENY to this email to respond.\n"
            f"---\nAgentic AI Workforce (Bxthre3 Inc)"
        )
        return self.send(to, subject, body)

    def read_recent(self, n=20, query=""):
        from tools import use_app_gmail
        q = query or f"in:inbox newer_than:7d"
        return use_app_gmail(
            "gmail-find-email",
            configured_props=json.dumps({"q": q, "maxResults": n, "withTextPayload": True}),
            email="bxthre3inc@gmail.com"
        )
