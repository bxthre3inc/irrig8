# OSGym Benchmarks for Agentic1

try:
    import osgym
    HAS_OSGYM = True
except ImportError:
    HAS_OSGYM = False

from src.agents.research_agent import ResearchAgent


def benchmark_patent_analysis():
    if not HAS_OSGYM:
        print("OSGym not installed, skipping benchmark")
        return

    env = osgym.make("PatentAnalysis-v0")
    agent = ResearchAgent("specs/roles/research_agent.yaml")
    obs = env.reset()
    for _ in range(100):
        action = agent.act(obs)
        obs, reward, done, info = env.step(action)
        if done:
            print(f"Episode reward: {reward}, Velocity: {info.get('velocity', 0)}")
            break