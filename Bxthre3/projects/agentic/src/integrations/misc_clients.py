"""Tasks, Linear, Notion, Stripe, Drive clients — stubbed for now."""
import logging
logger = logging.getLogger(__name__)

class TasksClient:
    def __init__(self):
        self.name = "google_tasks"
        self.connected = True
        logger.info(f"{self.name} client initialized")

    def list_tasks(self, list_id=None):
        return [{"id": "sample-task-1", "title": "Sample Task", "status": "needsAction"}]

    def create_task(self, title, notes="", due=None, list_id=None):
        return {"id": "new-task-1", "title": title, "status": "needsAction"}

    def complete_task(self, task_id):
        return {"id": task_id, "status": "completed"}

class LinearClient:
    def __init__(self):
        self.name = "linear"
        self.connected = True
        logger.info(f"{self.name} client initialized")

    def create_issue(self, title, description="", team_id=None):
        return {"id": "linear-issue-1", "title": title, "status": "backlog"}

    def list_issues(self, team_id=None):
        return [{"id": "linear-issue-1", "title": "Sample Issue", "status": "backlog"}]

class NotionClient:
    def __init__(self):
        self.name = "notion"
        self.connected = True
        logger.info(f"{self.name} client initialized")

    def search_pages(self, query):
        return [{"id": "page-1", "title": "Sample Page"}]

    def create_page(self, parent_id, title, content=""):
        return {"id": "new-page-1", "title": title}

class StripeClient:
    def __init__(self):
        self.name = "stripe"
        self.connected = True
        logger.info(f"{self.name} client initialized")

    def list_products(self):
        return [{"id": "prod-1", "name": "Sample Product"}]

    def create_payment_link(self, price_id):
        return {"id": "pl-1", "url": "https://buy.stripe.com/sample"}

class DriveClient:
    def __init__(self):
        self.name = "google_drive"
        self.connected = True
        logger.info(f"{self.name} client initialized")

    def list_files(self, folder_id=None):
        return [{"id": "file-1", "name": "Sample Document"}]

    def upload_file(self, name, content, mime_type="text/plain"):
        return {"id": "new-file-1", "name": name}
