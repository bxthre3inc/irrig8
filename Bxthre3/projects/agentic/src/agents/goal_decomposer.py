"""Goal Decomposition Agent — takes high-level intent → structured task tree → tracks to completion."""
from typing import Optional
from datetime import datetime, timedelta
import importlib, sys, os, uuid

# Add src/ to path so 'integrations' and 'inference' are importable
_src_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _src_dir)
from integrations import GmailClient, CalendarClient, TasksClient, LinearClient, NotionClient


class GoalDecomposer:
    """Decomposes business goals into executable task trees using local LLM inference."""

    def __init__(self):
        self.llm_available = True
        try:
            from inference.engine import InferenceEngine
            self.inference = InferenceEngine(model="llama3.2")
            self.inference.llm.model = "llama3.2"
            print("GoalDecomposer: local LLM inference ready")
        except Exception as e:
            print(f"GoalDecomposer: inference unavailable ({e}), will use rule-based decomposition")
            self.inference = None

    def decompose(self, goal: str, deadline: str = None, priority: str = "P2") -> dict:
        """
        Decompose a high-level goal into a task tree.
        
        Args:
            goal: High-level business goal, e.g. "ARPA-E grant due in 7 days"
            deadline: ISO date string or natural language
            priority: P0-P3
        """
        task_id = str(uuid.uuid4())[:8]

        prompt = f"Decompose this business goal into a JSON task tree with fields: goal, goal_summary, tasks=[{{name, type, assigned_role, dependencies, tools, priority}}]. Goal: {goal}. Respond ONLY with valid JSON, no explanation."
        if self.inference:
            import threading
            result_holder = [None]
            exc_holder = [None]
            def call_llm():
                try:
                    result_holder[0] = self.inference.reason(prompt)
                except Exception as e:
                    exc_holder[0] = e
            t = threading.Thread(target=call_llm)
            t.start()
            t.join(timeout=20)
            if t.is_alive():
                print("GoalDecomposer: LLM timed out after 20s, using rule-based fallback")
                self.inference = None
                return self._rule_based_decompose(goal, deadline, priority, task_id)
            if exc_holder[0]:
                print(f"GoalDecomposer: LLM error ({exc_holder[0]}), using rule-based fallback")
                self.inference = None
                return self._rule_based_decompose(goal, deadline, priority, task_id)
            response = result_holder[0]
            if response and response.startswith("{"):
                try:
                    import json
                    result = json.loads(response)
                    result["goal"] = goal
                    result["deadline"] = deadline
                    result["decomposed_at"] = datetime.utcnow().isoformat()
                    result["task_tree_id"] = task_id
                    print(f"GoalDecomposer: decomposed '{goal}' into {len(result.get('tasks', []))} tasks (LLM)")
                    return result
                except Exception as e:
                    print(f"GoalDecomposer: LLM parse failed ({e}), using rule-based fallback")
        
        # Rule-based fallback
        return self._rule_based_decompose(goal, deadline, priority, task_id)

    def _rule_based_decompose(self, goal: str, deadline: str, priority: str, task_id: str) -> dict:
        """Fallback when LLM is unavailable."""
        goal_lower = goal.lower()
        tasks = []

        if "arpa" in goal_lower or "grant" in goal_lower:
            tasks = [
                {"name": "Draft grant narrative", "type": "research", "assigned_role": "researcher", "dependencies": [], "tools": ["inference.generate"], "priority": "P1"},
                {"name": "Compile budget figures", "type": "financial", "assigned_role": "financial", "dependencies": ["Draft grant narrative"], "tools": ["inference.generate"], "priority": "P1"},
                {"name": "Review IP section with legal", "type": "legal", "assigned_role": "legal", "dependencies": ["Draft grant narrative"], "tools": ["inference.generate"], "priority": "P1"},
                {"name": "Final review and submission", "type": "review", "assigned_role": "reviewer", "dependencies": ["Compile budget figures", "Review IP section with legal"], "tools": ["inference.generate"], "priority": "P1"},
                {"name": "Submit grant application", "type": "operations", "assigned_role": "manager", "dependencies": ["Final review and submission"], "tools": ["filesystem.write", "inference.generate"], "priority": "P0"},
            ]
        elif "water court" in goal_lower:
            tasks = [
                {"name": "Gather water rights documentation", "type": "research", "assigned_role": "researcher", "dependencies": [], "tools": ["filesystem.read"], "priority": "P1"},
                {"name": "Prepare evidence exhibits", "type": "legal", "assigned_role": "legal", "dependencies": ["Gather water rights documentation"], "tools": ["filesystem.write"], "priority": "P1"},
                {"name": "Coordinate with legal counsel", "type": "operations", "assigned_role": "manager", "dependencies": ["Prepare evidence exhibits"], "tools": ["inference.generate"], "priority": "P1"},
                {"name": "Prepare witness statements", "type": "legal", "assigned_role": "legal", "dependencies": ["Prepare evidence exhibits"], "tools": ["inference.generate"], "priority": "P2"},
            ]
        elif "patent" in goal_lower:
            tasks = [
                {"name": "Draft patent specification", "type": "research", "assigned_role": "researcher", "dependencies": [], "tools": ["inference.generate"], "priority": "P2"},
                {"name": "Draft patent claims", "type": "legal", "assigned_role": "legal", "dependencies": ["Draft patent specification"], "tools": ["inference.generate"], "priority": "P2"},
                {"name": "Review patent draft with IP counsel", "type": "review", "assigned_role": "reviewer", "dependencies": ["Draft patent claims"], "tools": ["inference.generate"], "priority": "P2"},
                {"name": "File provisional patent", "type": "legal", "assigned_role": "legal", "dependencies": ["Review patent draft with IP counsel"], "tools": ["filesystem.write"], "priority": "P1"},
            ]
        elif "investor" in goal_lower or "deck" in goal_lower:
            tasks = [
                {"name": "Gather Q2 financial metrics", "type": "financial", "assigned_role": "financial", "dependencies": [], "tools": ["inference.generate"], "priority": "P2"},
                {"name": "Draft investor narrative", "type": "research", "assigned_role": "researcher", "dependencies": ["Gather Q2 financial metrics"], "tools": ["inference.generate"], "priority": "P2"},
                {"name": "Build investor deck slides", "type": "development", "assigned_role": "developer", "dependencies": ["Draft investor narrative"], "tools": ["filesystem.write"], "priority": "P2"},
                {"name": "Legal review of deck", "type": "review", "assigned_role": "reviewer", "dependencies": ["Build investor deck slides"], "tools": ["inference.generate"], "priority": "P2"},
            ]
        elif "irrig8" in goal_lower or "product" in goal_lower:
            tasks = [
                {"name": "Analyze current sensor data pipeline", "type": "research", "assigned_role": "researcher", "dependencies": [], "tools": ["filesystem.read"], "priority": "P2"},
                {"name": "Design irrigation decision algorithm", "type": "development", "assigned_role": "developer", "dependencies": ["Analyze current sensor data pipeline"], "tools": ["inference.generate"], "priority": "P2"},
                {"name": "Implement resource health monitoring", "type": "development", "assigned_role": "developer", "dependencies": ["Design irrigation decision algorithm"], "tools": ["filesystem.write"], "priority": "P2"},
                {"name": "QA testing of decision engine", "type": "qa", "assigned_role": "qa", "dependencies": ["Implement resource health monitoring"], "tools": ["inference.generate"], "priority": "P2"},
            ]
        else:
            tasks = [
                {"name": f"Analyze goal: {goal[:50]}", "type": "research", "assigned_role": "researcher", "dependencies": [], "tools": ["inference.generate"], "priority": priority},
                {"name": f"Plan execution for: {goal[:50]}", "type": "development", "assigned_role": "developer", "dependencies": [f"Analyze goal: {goal[:50]}"], "tools": ["inference.generate"], "priority": priority},
                {"name": f"Execute: {goal[:50]}", "type": "operations", "assigned_role": "manager", "dependencies": [f"Plan execution for: {goal[:50]}"], "tools": ["inference.generate"], "priority": priority},
            ]

        return {
            "task_tree_id": task_id,
            "goal": goal,
            "deadline": deadline,
            "priority": priority,
            "decomposed_at": datetime.utcnow().isoformat(),
            "goal_summary": goal,
            "tasks": tasks,
        }

    def execute_task_tree(self, task_tree: dict, api_server_url: str = "http://localhost:5182") -> dict:
        """Execute all tasks in a task tree through the API server."""
        import urllib.request, json
        results = []
        completed = set()
        task_name_to_id = {}

        for task in task_tree.get("tasks", []):
            task_name_to_id[task["name"]] = task.get("task_id", task["name"])

        for task in task_tree.get("tasks", []):
            deps = task.get("dependencies", [])
            if deps:
                unmet = [d for d in deps if d not in completed]
                if unmet:
                    print(f"GoalDecomposer: skipping {task['name']} — unmet deps: {unmet}")
                    results.append({"task": task["name"], "status": "skipped", "reason": f"unmet dependencies: {unmet}"})
                    continue

            print(f"GoalDecomposer: executing {task['name']} ({task.get('assigned_role', 'unknown')})")

            payload = json.dumps({
                "agent_id": f"{task.get('assigned_role', 'manager')}-auto",
                "agent_role": task.get("assigned_role", "manager"),
                "task": {
                    "name": task["name"],
                    "type": task.get("type", "operations"),
                    "tools": task.get("tools", ["inference.generate"]),
                    "params": {"prompt": f"Task: {task['name']}. Goal context: {task_tree.get('goal', '')}"}
                }
            }).encode()

            try:
                req = urllib.request.Request(
                    f"{api_server_url}/execute",
                    data=payload,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read())
                    results.append({"task": task["name"], "status": result.get("status", "unknown"), "result": result})
                    if result.get("status") == "success":
                        completed.add(task["name"])
            except Exception as e:
                results.append({"task": task["name"], "status": "error", "error": str(e)})

        return {
            "task_tree_id": task_tree.get("task_tree_id"),
            "goal": task_tree.get("goal"),
            "tasks_completed": len(completed),
            "tasks_total": len(task_tree.get("tasks", [])),
            "results": results,
            "completed_tasks": list(completed),
        }


def main():
    import json
    decomposer = GoalDecomposer()

    goals = [
        "ARPA-E grant due in 7 days — make sure we submit",
        "Water Court hearing June 29 — prepare evidence",
        "File 7 provisional patents by May 15",
        "Build Q2 investor deck",
        "Improve Irrig8 sensor decision accuracy",
    ]

    for goal in goals:
        print(f"\n{'='*60}\nGOAL: {goal}\n{'='*60}")
        tree = decomposer.decompose(goal)
        print(f"Decomposed into {len(tree['tasks'])} tasks:")
        for t in tree["tasks"]:
            print(f"  [{t.get('priority','P?')}] {t['name']} → {t.get('assigned_role')} (deps: {t.get('dependencies',[])})")
        
        print("\nExecuting task tree...")
        exec_result = decomposer.execute_task_tree(tree)
        print(f"\nDone: {exec_result['tasks_completed']}/{exec_result['tasks_total']} tasks completed")
        for r in exec_result.get("results", []):
            status_icon = "✅" if r.get("status") == "success" else ("⏭️" if r.get("status") == "skipped" else "❌")
            print(f"  {status_icon} {r.get('task')}: {r.get('status')}")


if __name__ == "__main__":
    main()
