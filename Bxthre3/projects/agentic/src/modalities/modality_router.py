"""Modality Router — semantic version 2.0.0"""
from typing import Any, Dict
from .text_handler import TextHandler
from .voice_handler import VoiceHandler
from .visual_handler import VisualHandler
from .data_handler import DataHandler
from .interactive_handler import InteractiveHandler

__version__ = "1.0.0"
VERSION = "1.0.0"


class ModalityRouter:
    def __init__(self):
        self.handlers = {
            "text": TextHandler(),
            "voice": VoiceHandler(),
            "visual": VisualHandler(),
            "data": DataHandler(),
            "interactive": InteractiveHandler(),
        }

    def route(self, input_data: Any, modality: str, **kwargs) -> Any:
        handler = self.handlers.get(modality)
        if not handler:
            raise ValueError(f"No handler for modality: {modality}")
        return handler.process(input_data, **kwargs)