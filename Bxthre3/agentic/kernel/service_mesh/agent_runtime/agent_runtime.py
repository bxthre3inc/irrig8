"""
Agent Runtime — Local LFM 2.5 Inference Node
Bxthre3/agentic/kernel/service_mesh/agent_runtime/agent_runtime.py

Hosts local LFM 2.5 models for agent inference.
Supports multi-model: LFM2.5-350M (fast), LFM2.5-1.2B-Thinking (reasoning).
Tool call parsing: LFM Pythonic syntax <|tool_call_start|>[func(args)]<|tool_call_end|>

This service is NOT exposed externally. Communication is via event bus only.
"""
import json
import hashlib
import logging
import time
import uuid
import os
from pathlib import Path
from typing import Optional, Literal, Any
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum

from ..event_bus import EventBus, Channel

logger = logging.getLogger("agentic.agent_runtime")


class ModelVariant(Enum):
    LFM_350M = "lfm2.5-350m"
    LFM_1_2B = "lfm2.5-1.2b-thinking"
    LFM_1_2B_FAST = "lfm2.5-1.2b-fast"


@dataclass
class ModelConfig:
    variant: ModelVariant
    model_path: Path
    context_window: int
    max_tokens: int
    temperature: float
    base_url: str  # e.g. "http://localhost:8000/v1"
    api_key: Optional[str]
    description: str
    recommended_for: str  # e.g. "fast tool calling, low-memory"


@dataclass
class InferenceRequest:
    request_id: str
    agent_id: str
    agent_did: str
    model_variant: ModelVariant
    messages: list[dict]  # [{role, content}]
    tools: list[str]       # enabled tool names (from registry)
    stream: bool
    created_at: str

    @classmethod
    def create(cls, agent_id: str, agent_did: str, messages: list[dict],
               model_variant: ModelVariant = ModelVariant.LFM_350M,
               tools: Optional[list[str]] = None) -> "InferenceRequest":
        return cls(
            request_id=f"req-{uuid.uuid4().hex[:16]}",
            agent_id=agent_id,
            agent_did=agent_did,
            model_variant=model_variant,
            messages=messages,
            tools=tools or [],
            stream=False,
            created_at=datetime.now(timezone.utc).isoformat(),
        )


@dataclass
class ToolCall:
    raw: str              # full match from LFM output
    tool_name: str        # parsed function name
    arguments: dict       # parsed JSON arguments
    request_id: str
    model: str
    parsed_at: str


@dataclass
class InferenceResponse:
    response_id: str
    request_id: str
    raw_content: str
    tool_calls: list[ToolCall]
    parsed_content: Optional[str]
    model: str
    tokens_used: int
    duration_ms: int
    status: str  # success | safety_blocked | error
    error: Optional[str]
    created_at: str


@dataclass
class AgentSession:
    session_id: str
    agent_id: str
    agent_did: str
    model_variant: ModelVariant
    created_at: str
    last_active: str
    messages: list[dict]
    context_window_used: int


class AgentRuntime:
    """
    Local LFM 2.5 inference runtime.
    Connects to a local inference server (ollama, vLLM, or custom).
    Tool call parsing uses LFM Pythonic syntax: <|tool_call_start|>[func(args)]<|tool_call_end|>
    """

    def __init__(
        self,
        event_bus: EventBus,
        model_configs: Optional[dict[ModelVariant, ModelConfig]] = None,
    ):
        self._eb = event_bus
        self._models: dict[ModelVariant, ModelConfig] = model_configs or self._default_configs()
        self._sessions: dict[str, AgentSession] = {}
        self._active_requests: dict[str, InferenceRequest] = {}

    def _default_configs(self) -> dict[ModelVariant, ModelConfig]:
        """
        Load from environment or use localhost defaults.
        Supports OLLAMA_HOST, VLLM_URL, HF_BACKEND env vars.
        """
        base = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
        return {
            ModelVariant.LFM_350M: ModelConfig(
                variant=ModelVariant.LFM_350M,
                model_path=Path(os.environ.get("LFM_350M_PATH", "~/.agentos/models/lfm2.5-350m")),
                context_window=8192,
                max_tokens=1024,
                temperature=0.3,
                base_url=f"{base}/api",
                api_key=None,
                description="Fast, low-memory. Best for: bulk tool calling, simple routing.",
                recommended_for="tool execution, simple routing",
            ),
            ModelVariant.LFM_1_2B: ModelConfig(
                variant=ModelVariant.LFM_1_2B,
                model_path=Path(os.environ.get("LFM_1_2B_PATH", "~/.agentos/models/lfm2.5-1.2b")),
                context_window=16384,
                max_tokens=2048,
                temperature=0.5,
                base_url=f"{base}/api",
                api_key=None,
                description="Thinking model. Best for: complex reasoning, chain-of-thought.",
                recommended_for="planning, complex decisions",
            ),
            ModelVariant.LFM_1_2B_FAST: ModelConfig(
                variant=ModelVariant.LFM_1_2B_FAST,
                model_path=Path(os.environ.get("LFM_1_2B_FAST_PATH", "~/.agentos/models/lfm2.5-1.2b-fast")),
                context_window=8192,
                max_tokens=512,
                temperature=0.2,
                base_url=f"{base}/api",
                api_key=None,
                description="Fastest latency. Best for: real-time tool calling, agent benchmarks.",
                recommended_for="agent benchmarks, latency-critical paths",
            ),
        }

    # ─── Session Management ────────────────────────────────────────────────────

    def create_session(
        self,
        agent_id: str,
        agent_did: str,
        model_variant: ModelVariant = ModelVariant.LFM_350M,
    ) -> AgentSession:
        session_id = f"sess-{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc).isoformat()
        session = AgentSession(
            session_id=session_id,
            agent_id=agent_id,
            agent_did=agent_did,
            model_variant=model_variant,
            created_at=now,
            last_active=now,
            messages=[],
            context_window_used=0,
        )
        self._sessions[session_id] = session
        logger.info(f"[AgentRuntime] Session created: {session_id} for agent {agent_id}")
        return session

    def get_session(self, session_id: str) -> Optional[AgentSession]:
        return self._sessions.get(session_id)

    def close_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            del self._sessions[session_id]
            logger.info(f"[AgentRuntime] Session closed: {session_id}")
            return True
        return False

    # ─── Tool Call Parsing ────────────────────────────────────────────────────

    TOOL_CALL_RE = __import__("re").compile(
        r"<\|tool_call_start\|>\s*\[([^\]]+)\]\s*<\|tool_call_end\|>"
    )

    def parse_tool_calls(self, raw_output: str, request_id: str, model: str) -> list[ToolCall]:
        """
        Parse LFM Pythonic tool calls from raw model output.
        Format: <|tool_call_start|>[get_weather(city="Paris")]<|tool_call_end|>
        """
        tool_calls = []
        matches = self.TOOL_CALL_RE.finditer(raw_output)
        for m in matches:
            try:
                call_str = m.group(1).strip()
                # Parse: func_name(arg1="val1", arg2=123)
                func_match = __import__("re").search(r"^([a-z_][a-z0-9_]*)\((.*)\)$", call_str)
                if not func_match:
                    logger.warning(f"[AgentRuntime] Could not parse tool call: {call_str}")
                    continue

                func_name = func_match.group(1)
                args_str = func_match.group(2)
                arguments = self._parse_args(args_str)

                tool_calls.append(ToolCall(
                    raw=call_str,
                    tool_name=func_name,
                    arguments=arguments,
                    request_id=request_id,
                    model=model,
                    parsed_at=datetime.now(timezone.utc).isoformat(),
                ))
            except Exception as e:
                logger.warning(f"[AgentRuntime] Tool call parse error: {e} | raw: {m.group(0)}")
                continue

        return tool_calls

    def _parse_args(self, args_str: str) -> dict:
        """
        Parse Pythonic keyword arguments: city="Paris", limit=5, active=true
        Returns dict. Handles strings, ints, floats, bools, null.
        """
        import ast
        args = {}
        if not args_str.strip():
            return args
        try:
            # Wrap in dict literal to parse as Python AST
            parsed = ast.literal_eval(f"dict({args_str})")
            return dict(parsed)
        except Exception:
            pass

        # Manual parse fallback
        parts = []
        current = ""
        in_string = False
        paren_depth = 0
        for ch in args_str:
            if ch == '"' and (not current or current[-1] != '\\'):
                in_string = not in_string
            if ch in "()" and not in_string:
                paren_depth += 1 if ch == "(" else -1
            if ch == "," and not in_string and paren_depth == 0:
                parts.append(current.strip())
                current = ""
            else:
                current += ch
        if current.strip():
            parts.append(current.strip())

        for part in parts:
            if "=" not in part:
                continue
            key, val = part.split("=", 1)
            key = key.strip()
            val = val.strip()
            # Parse value
            if val in ("None", "null"):
                args[key] = None
            elif val == "True":
                args[key] = True
            elif val == "False":
                args[key] = False
            elif val.startswith('"') and val.endswith('"'):
                args[key] = val[1:-1]
            elif val.startswith("'" ) and val.endswith("'"):
                args[key] = val[1:-1]
            elif val.isdigit():
                args[key] = int(val)
            else:
                try:
                    args[key] = float(val)
                except ValueError:
                    args[key] = val
        return args

    # ─── Inference ───────────────────────────────────────────────────────────

    async def infer(
        self,
        request: InferenceRequest,
        session_id: Optional[str] = None,
    ) -> InferenceResponse:
        """
        Run inference against the configured local LFM 2.5 server.
        Publishes agent.events to event bus on completion.
        """
        cfg = self._models.get(request.model_variant, self._models[ModelVariant.LFM_350M])
        request_id = request.request_id
        self._active_requests[request_id] = request

        start_ms = int(time.time() * 1000)
        response_id = f"res-{uuid.uuid4().hex[:12]}"

        try:
            # Build tool schema for the model (LFM uses its own format)
            tool_schema = self._build_tool_schema(request.tools)

            # Call local inference server
            raw_content, tokens_used = await self._call_inference_server(cfg, request, tool_schema)

            # Parse tool calls from output
            tool_calls = self.parse_tool_calls(raw_content, request_id, cfg.variant.value)

            status = "success"
            error = None

            # Publish inference complete event
            await self._eb.publish(Channel.AGENT_EVENTS, {
                "event": "inference.complete",
                "request_id": request_id,
                "response_id": response_id,
                "agent_id": request.agent_id,
                "model": cfg.variant.value,
                "tool_calls": [tc.tool_name for tc in tool_calls],
                "tokens_used": tokens_used,
                "duration_ms": int(time.time() * 1000) - start_ms,
                "session_id": session_id,
            })

        except Exception as e:
            raw_content = ""
            tool_calls = []
            status = "error"
            error = str(e)
            tokens_used = 0
            logger.error(f"[AgentRuntime] Inference error: {e}")

        duration_ms = int(time.time() * 1000) - start_ms

        response = InferenceResponse(
            response_id=response_id,
            request_id=request_id,
            raw_content=raw_content,
            tool_calls=tool_calls,
            parsed_content=self._strip_tool_calls(raw_content) if tool_calls else raw_content,
            model=cfg.variant.value,
            tokens_used=tokens_used,
            duration_ms=duration_ms,
            status=status,
            error=error,
            created_at=datetime.now(timezone.utc).isoformat(),
        )

        # Update session
        if session_id and session_id in self._sessions:
            sess = self._sessions[session_id]
            sess.last_active = datetime.now(timezone.utc).isoformat()
            sess.messages.append({"role": "user", "content": request.messages[-1]["content"] if request.messages else ""})
            sess.messages.append({"role": "assistant", "content": raw_content})
            sess.context_window_used += tokens_used

        self._active_requests.pop(request_id, None)
        return response

    async def _call_inference_server(
        self,
        cfg: ModelConfig,
        request: InferenceRequest,
        tool_schema: list[dict],
    ) -> tuple[str, int]:
        """
        Call the local inference server (ollama/vLLM/HF).
        Override this method to plug in your specific backend.
        """
        import httpx

        # Build messages with tools
        messages = request.messages
        if tool_schema:
            # Add tool system prompt
            tools_block = "\n".join([
                f"Available tools: {s['function']['name']} — {s['function']['description']}"
                for s in tool_schema
            ])
            # Prepend a system message with tool descriptions (LFM format)
            messages = [{"role": "system", "content": f"You have access to tools. Use them with the syntax: <|tool_call_start|>[tool_name(arg1=\"val1\")]<|tool_call_end|>"}] + messages

        # Build OpenAI-compatible request
        payload = {
            "model": cfg.variant.value,
            "messages": messages,
            "max_tokens": cfg.max_tokens,
            "temperature": cfg.temperature,
            "stream": False,
        }
        if tool_schema:
            payload["tools"] = tool_schema

        headers = {}
        if cfg.api_key:
            headers["Authorization"] = f"Bearer {cfg.api_key}"

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{cfg.base_url}/chat/completions",
                json=payload,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()

        content = data["choices"][0]["message"]["content"]
        tokens = data.get("usage", {}).get("total_tokens", 0)
        return content, tokens

    def _build_tool_schema(self, tool_names: list[str]) -> list[dict]:
        """
        Convert registered tool names to LLM tool format (OpenAI-compatible).
        Loads from ToolRegistry.
        """
        if not tool_names:
            return []

        from ..tool_registry import get_registry
        registry = get_registry()
        schema = []
        for name in tool_names:
            td = registry.get(name)
            if not td:
                continue
            schema.append({
                "type": "function",
                "function": {
                    "name": td.name,
                    "description": td.description,
                    "parameters": {
                        "type": "object",
                        "properties": {
                            p.name: {"type": p.type, "description": p.description}
                            for p in td.parameters
                        },
                        "required": [p.name for p in td.parameters if p.required],
                    },
                },
            })
        return schema

    def _strip_tool_calls(self, content: str) -> str:
        """Remove tool call tags from content for parsed_content field."""
        return self.TOOL_CALL_RE.sub("", content).strip()

    # ─── Model Management ────────────────────────────────────────────────────

    def list_models(self) -> list[ModelConfig]:
        return list(self._models.values())

    def get_model_config(self, variant: ModelVariant) -> Optional[ModelConfig]:
        return self._models.get(variant)

    def update_model_url(self, variant: ModelVariant, base_url: str) -> bool:
        if variant in self._models:
            self._models[variant].base_url = base_url
            logger.info(f"[AgentRuntime] Updated URL for {variant.value}: {base_url}")
            return True
        return False

    # ─── Status ──────────────────────────────────────────────────────────────

    def status(self) -> dict:
        return {
            "active_requests": len(self._active_requests),
            "active_sessions": len(self._sessions),
            "models": {v.value: {"base_url": c.base_url, "context_window": c.context_window} for v, c in self._models.items()},
            "loaded_at": datetime.now(timezone.utc).isoformat(),
        }