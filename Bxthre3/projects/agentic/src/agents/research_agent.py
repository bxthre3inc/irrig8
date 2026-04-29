"""Researcher Agent — Tier 3"""
from ..agents.base_agent import BaseAgent, RoleDefinition, CoreTraits

ROLE_DEF = RoleDefinition(
    role="Researcher",
    description="Deep research across web, academic, and proprietary sources. Produces structured findings with full citation traceability.",
    tier="Tier-3",
    core_traits=CoreTraits(
        skills=["web_search", "academic_search", "competitive_intel", "patent_analysis", "grant_discovery"],
        tools=["search", "browser", "notion", "arxiv", "google_scholar"],
        modalities=["text", "data"]
    ),
    max_concurrent_tasks=8
)

def create_agent(**kwargs):
    return BaseAgent(role="Researcher", role_def=ROLE_DEF, **kwargs)
