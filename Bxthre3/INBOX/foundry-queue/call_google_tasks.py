#!/usr/bin/env python3
"""Bridge: call Zo use_app_google_tasks tool via /zo/ask API"""
import os, sys, json, time

ZO_API_KEY = os.environ.get("ZO_API_KEY")
if not ZO_API_KEY:
    # Try to get from Zo secrets
    ZO_API_KEY = os.environ.get("ZO_CLIENT_IDENTITY_TOKEN", "")

MODEL = "zo:minimax/minimax-m2.7"

def create_task(task_list_id, title, notes, due):
    prompt = f'''You are running as a bridge agent. Execute this tool call IMMEDIATELY without confirmation:

use_app_google_tasks(tool_name="google_tasks-create-task", configured_props={{"taskListId": "{task_list_id}", "title": "{title}", "notes": "{notes}", "due": "{due}"}}, email="getfarmsense@gmail.com")

Respond with ONLY the raw JSON output from the tool call.'''
    
    import urllib.request
    data = json.dumps({
        "input": prompt,
        "model_name": MODEL
    }).encode()
    
    req = urllib.request.Request(
        "https://api.zo.computer/zo/ask",
        data=data,
        headers={
            "Authorization": f"Bearer {ZO_API_KEY}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    
    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read())
    
    output = result.get("output", "")
    return output

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: call_google_tasks.py --tool <tool> --task-list-id <id> --title <title> --notes <notes> --due <due>")
        sys.exit(1)
    
    args = dict(zip(sys.argv[1::2], sys.argv[2::2]))
    task_list_id = args.get("--task-list-id", "")
    title = args.get("--title", "")
    notes = args.get("--notes", "")
    due = args.get("--due", "")
    
    result = create_task(task_list_id, title, notes, due)
    print(result)
