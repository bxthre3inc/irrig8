"""Local LLM inference via Ollama"""
import urllib.request, json, logging

logger = logging.getLogger(__name__)

class LocalLLM:
    def __init__(self, model="llama3.2", base_url="http://localhost:11434"):
        self.model = model
        self.url = base_url.rstrip("/")

    def generate(self, prompt, system=None, stream=False):
        payload = {"model": self.model, "prompt": prompt, "stream": stream, "options": {"num_predict": 256}}
        if system:
            payload["system"] = system
        body = json.dumps(payload).encode()
        req = urllib.request.Request(f"{self.url}/api/generate", data=body, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read()).get("response", "")
        except Exception as e:
            logger.error(f"Ollama error: {e}")
            return f"[LocalLLM Error: {e}]"

    def is_available(self):
        try:
            req = urllib.request.Request(f"{self.url}/api/tags")
            with urllib.request.urlopen(req, timeout=5):
                return True
        except:
            return False
