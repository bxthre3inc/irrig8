"""Calendar client."""
import logging
logger = logging.getLogger("calendar")
class CalendarClient:
    def health_check(self): return {"status": "ok", "provider": "google_calendar"}
    def create_event(self, summary, start, end=None, description=""):
        logger.info(f"calendar event: {summary}")
        return {"status": "created", "summary": summary}
    def list_upcoming(self, n=10):
        return {"status": "listed", "count": n, "events": []}
