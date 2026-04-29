"""Financial Agent — semantic version 2.0.0"""
from .base_agent import BaseAgent

__version__ = "1.0.0"
VERSION = "1.0.0"


class FinancialAgent(BaseAgent):
    def __init__(self, role_yaml_path: str = "configs/roles/financial_agent.yaml"):
        super().__init__(role_yaml_path)

    def transfer_funds(self, amount: float, from_account: str, to_account: str) -> dict:
        return {
            "status": "transferred",
            "amount": amount,
            "from": from_account,
            "to": to_account,
        }