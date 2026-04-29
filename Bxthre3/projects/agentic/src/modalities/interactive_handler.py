"""Interactive Handler — semantic version 2.0.0"""
__version__ = "1.0.0"
VERSION = "1.0.0"


class InteractiveHandler:
    def process(self, input_data, **kwargs) -> dict:
        return {"type": "interactive", "data": input_data}