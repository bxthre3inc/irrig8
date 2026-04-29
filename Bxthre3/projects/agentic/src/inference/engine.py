"""Inference engine — routes agent prompts to local Ollama"""
import logging
from typing import Dict, Any, Optional, List
from .local_llm import LocalLLM

logger = logging.getLogger(__name__)

INFERENCE_PROMPT = """You are {agent_name}, a {agent_role}. {agent_description}

Capabilities: {capabilities}
Modalities: {modalities}

Follow the SOUL.md behavioral guidelines. Be direct. Execute to completion. Verify or die.

Task: {task}
"""

class InferenceEngine:
    def __init__(self, model: str = "llama3.2"):
        self.llm = LocalLLM(model=model)
        if self.llm.is_available():
            logger.info(f"InferenceEngine ready using {model}")
        else:
            logger.warning("Ollama not reachable — inference will return [unavailable]")

    def run_agent(
        self,
        agent_name: str,
        agent_role: str,
        agent_description: str,
        capabilities: List[str],
        modalities: List[str],
        task: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        prompt = INFERENCE_PROMPT.format(
            agent_name=agent_name,
            agent_role=agent_role,
            agent_description=agent_description,
            capabilities=", ".join(capabilities),
            modalities=", ".join(modalities),
            task=task
        )
        if context:
            prompt += f"\n\nContext: {json.dumps(context)}"
        return self.llm.generate(prompt)

    def reason(self, task: str, context: Optional[Dict[str, Any]] = None) -> str:
        prompt = f"""Think through this step by step:

Task: {task}
"""
        if context:
            prompt += f"\nContext: {json.dumps(context)}"
        return self.llm.generate(prompt)

    def is_available(self) -> bool:
        return self.llm.is_available()
