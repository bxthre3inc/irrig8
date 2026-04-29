# Unit Tests for Agentic1

import pytest
from src.agents.base_agent import BaseAgent


def test_agent_initialization():
    agent = BaseAgent("specs/roles/research_agent.yaml")
    assert agent.role == "ResearchAgent"
    assert "PatentAnalysis" in agent.specialized_traits.skills


def test_can_handle_task():
    agent = BaseAgent("specs/roles/research_agent.yaml")
    task = {
        "Task": "Analyze_Patent_Cluster",
        "Prerequisites": {"Requires": ["LLM", "GPU"]},
    }
    assert agent.can_handle_task(task) == True
    task["Prerequisites"]["Requires"].append("NonExistentTool")
    assert agent.can_handle_task(task) == False