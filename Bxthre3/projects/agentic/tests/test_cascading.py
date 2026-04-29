# Integration Tests for Agentic1

from src.cascading.task_dag import patent_workflow


def test_patent_workflow():
    result = patent_workflow(["patent_123", "patent_456"])
    assert result["analysis"]["status"] == "complete"
    assert result["filing"]["status"] == "filed"
    assert result["notification"]["status"] == "notified"