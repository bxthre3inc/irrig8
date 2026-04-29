"""Data Handler — semantic version 2.0.0"""
__version__ = "1.0.0"
VERSION = "1.0.0"


class DataHandler:
    def process(self, input_data, **kwargs) -> dict:
        if hasattr(input_data, 'describe'):
            return input_data.describe().to_dict()
        return {"data": str(input_data)}