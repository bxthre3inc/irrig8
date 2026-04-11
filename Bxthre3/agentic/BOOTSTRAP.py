#!/usr/bin/env python3
"""
Agentic v1 — Bootstrap / Seed Script
Creates all required stores and seeds canonical data so Agentic 
can run standalone on any Zo instance without manual setup.
"""
import json, os, sys, hashlib, uuid
from datetime import datetime, timezone

STORES_DIR = "/dev/shm/agentic"
AGENTS = [
    {"id":"zoe","name":"Zoe Patel","role":"Executive Agent","department":"Executive","status":"ACTIVE","completionRate":97,"activeTasks":2,"lastSeen":0,"skills":["strategy","leadership","communication"],"tools":["gmail","calendar"],"shifts":["08:00-18:00 UTC"],"colleagues":["atlas","vance","iris"]},
    {"id":"atlas","name":"Atlas","role":"Operations Agent","department":"Operations","status":"ACTIVE","completionRate":94,"activeTasks":3,"lastSeen":0,"skills":["coordination","systems","automation"],"tools":["notion","linear"],"shifts":["07:00-19:00 UTC"],"colleagues":["zoe","pulse","sentinel"]},
    {"id":"vance","name":"Vance","role":"Executive Agent","department":"Executive","status":"ACTIVE","completionRate":96,"activeTasks":1,"lastSeen":0,"skills":["finance","planning","analysis"],"tools":["gmail","sheets"],"shifts":["09:00-17:00 UTC"],"colleagues":["zoe","iris"]},
    {"id":"pulse","name":"Pulse","role":"People Ops","department":"Operations","status":"ACTIVE","completionRate":91,"activeTasks":2,"lastSeen":0,"skills":["hr","onboarding","culture"],"tools":["gmail","tasks"],"shifts":["08:00-16:00 UTC"],"colleagues":["atlas","zoe"]},
    {"id":"sentinel","name":"Sentinel","role":"System Monitor","department":"Operations","status":"ACTIVE","completionRate":99,"activeTasks":0,"lastSeen":0,"skills":["monitoring","alerting","diagnostics"],"tools":["api","logs"],"shifts":["always-on"],"colleagues":["atlas","theo"]},
    {"id":"iris","name":"Iris","role":"Engineering Lead","department":"Engineering","status":"ACTIVE","completionRate":93,"activeTasks":4,"lastSeen":0,"skills":["architecture","code","review"],"tools":["github","linear"],"shifts":["10:00-20:00 UTC"],"colleagues":["dev","taylor","theo"]},
    {"id":"dev","name":"Dev","role":"Backend Engineer","department":"Engineering","status":"ACTIVE","completionRate":88,"activeTasks":3,"lastSeen":0,"skills":["python","typescript","apis"],"tools":["github","db"],"shifts":["09:00-18:00 UTC"],"colleagues":["iris","sam"]},
    {"id":"sam","name":"Sam","role":"Data Analyst","department":"Engineering","status":"ACTIVE","completionRate":90,"activeTasks":2,"lastSeen":0,"skills":["analytics","sql","visualization"],"tools":["airtable","sheets"],"shifts":["09:00-17:00 UTC"],"colleagues":["iris","dev"]},
    {"id":"taylor","name":"Taylor","role":"Security Engineer","department":"Engineering","status":"ACTIVE","completionRate":95,"activeTasks":1,"lastSeen":0,"skills":["security","compliance","audit"],"tools":["vault","logs"],"shifts":["10:00-18:00 UTC"],"colleagues":["iris","theo"]},
    {"id":"theo","name":"Theo","role":"DevOps Engineer","department":"Engineering","status":"ACTIVE","completionRate":92,"activeTasks":2,"lastSeen":0,"skills":["devops","infrastructure","ci/cd"],"tools":["github","docker"],"shifts":["08:00-17:00 UTC"],"colleagues":["iris","sentinel"]},
    {"id":"casey","name":"Casey","role":"Marketing Lead","department":"Marketing","status":"ACTIVE","completionRate":87,"activeTasks":3,"lastSeen":0,"skills":["campaigns","content","analytics"],"tools":["gmail","drive"],"shifts":["09:00-18:00 UTC"],"colleagues":["drew","zoe"]},
    {"id":"maya","name":"Maya","role":"Grant Strategist","department":"Grants","status":"ACTIVE","completionRate":89,"activeTasks":4,"lastSeen":0,"skills":["sbir","grants","compliance"],"tools":["airtable","gmail"],"shifts":["10:00-19:00 UTC"],"colleagues":["zoe","raj"]},
    {"id":"raj","name":"Raj","role":"Legal & Compliance","department":"Legal","status":"ACTIVE","completionRate":98,"activeTasks":2,"lastSeen":0,"skills":["contracts","ip","regulatory"],"tools":["gmail","drive"],"shifts":["09:00-18:00 UTC"],"colleagues":["zoe","maya"]},
    {"id":"drew","name":"Drew","role":"Sales Lead","department":"Sales","status":"ACTIVE","completionRate":86,"activeTasks":5,"lastSeen":0,"skills":["sales","outreach","pipeline"],"tools":["gmail","crm"],"shifts":["08:00-17:00 UTC"],"colleagues":["casey","zoe"]},
    {"id":"irrig8","name":"Irrig8 Field Agent","role":"Field Operations","department":"Operations","status":"ACTIVE","completionRate":91,"activeTasks":1,"lastSeen":0,"skills":["sensors","irrigation","slv"],"tools":["mqtt","satellite"],"shifts":["06:00-22:00 UTC"],"colleagues":["atlas","rain"]},
    {"id":"rain","name":"RAIN","role":"Regulatory Intelligence","department":"Strategy","status":"ACTIVE","completionRate":94,"activeTasks":2,"lastSeen":0,"skills":["regulatory","water","crypto"],"tools":["gmail","research"],"shifts":["always-on"],"colleagues":["zoe","irrig8"]},
    {"id":"vpc","name":"VPC Agent","role":"Gaming Operations","department":"Operations","status":"ACTIVE","completionRate":88,"activeTasks":3,"lastSeen":0,"skills":["gaming","compliance"," Wyoming"],"tools":["api","gmail"],"shifts":["always-on"],"colleagues":["zoe","irrig8"]},
    {"id":"trenchbabys","name":"Trenchbabys Agent","role":"Retail Operations","department":"Sales","status":"ACTIVE","completionRate":83,"activeTasks":1,"lastSeen":0,"skills":["inventory","social","events"],"tools":["gmail","drive"],"shifts":["10:00-20:00 UTC"],"colleagues":["drew","casey"]},
]

TASKS = [
    {"id":"tsk-001","title":"Deploy Irrig8 sensor v2 to SLV Field 4","priority":"P0","status":"IN_PROGRESS","phase":"EXECUTE","assignedAgent":"irrig8","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":[],"economic_value":25000,"dap_gate":"N/A"},
    {"id":"tsk-002","title":"VPC Wyoming LLC formation — finalize","priority":"P0","status":"IN_PROGRESS","phase":"EXECUTE","assignedAgent":"vpc","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":[],"economic_value":50000,"dap_gate":"N/A"},
    {"id":"tsk-003","title":"File 7 provisional patents — Raj","priority":"P0","status":"PENDING","phase":"ANALYZE","assignedAgent":"raj","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":["Deadline 2026-05-15"],"economic_value":100000,"dap_gate":"N/A"},
    {"id":"tsk-004","title":"SBIR Phase I grant — Maya","priority":"P1","status":"IN_PROGRESS","phase":"EXECUTE","assignedAgent":"maya","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":[],"economic_value":306250,"dap_gate":"N/A"},
    {"id":"tsk-005","title":"Agentic v1 GitHub release","priority":"P1","status":"COMPLETE","phase":"DELIVER","assignedAgent":"dev","createdAt":"2026-04-10T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":[],"economic_value":50000,"dap_gate":"N/A"},
    {"id":"tsk-006","title":"Danny Romero partnership close","priority":"P1","status":"IN_PROGRESS","phase":"ANALYZE","assignedAgent":"drew","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":["Meeting 2026-04-11"],"economic_value":10000,"dap_gate":"N/A"},
    {"id":"tsk-007","title":"Agentic Airtable bridge — full sync","priority":"P2","status":"PENDING","phase":"ANALYZE","assignedAgent":"dev","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":[],"economic_value":5000,"dap_gate":"N/A"},
    {"id":"tsk-008","title":"Thompson Q dashboard — complete","priority":"P2","status":"DONE","phase":"COMPLETE","assignedAgent":"dev","createdAt":"2026-04-11T08:00:00Z","updatedAt":"2026-04-11T08:00:00Z","blockers":[],"economic_value":2000,"dap_gate":"N/A"},
]

SUBSCRIPTIONS = {a["id"]: {
    "subscriptions": ["sfd.*","rss.*","sys.*"] if a["department"]=="Operations" else ["sfd.*","rss.anomaly.*"],
    "dap_planes": [7,8,9] if a["role"]=="Executive Agent" else [1,2,3,4,5],
    "callback_url": f"https://brodiblanco.zo.space/api/agentic/agent/{a['id']}/webhook",
    "status": "active",
    "n_pulls": 0, "alpha": 1.0, "beta": 1.0
} for a in AGENTS}

def bootstrap():
    os.makedirs(STORES_DIR, exist_ok=True)
    # Agents
    with open(f"{STORES_DIR}/agents.json","w") as f:
        json.dump({"agents":AGENTS,"q_entries":{a["id"]:{"agent_id":a["id"],"n_pulls":0,"alpha":1.0,"beta":1.0,"mean":0.5} for a in AGENTS}}, f)
    # Subscriptions
    with open(f"{STORES_DIR}/subscriptions.json","w") as f:
        json.dump({"subscriptions":SUBSCRIPTIONS,"events":[]}, f)
    # Tasks
    with open(f"{STORES_DIR}/tasks.json","w") as f:
        json.dump({"tasks":TASKS}, f)
    # Events (seed 50 sample events)
    events = []
    now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    for i, evt in enumerate([
        ("sfd.irrig8.moisture.critical","irrig8",[1,2,5,6,7,8,9]),
        ("sfd.vpc.wager.placed","vpc",[1,4,5,7,8,9]),
        ("sfd.agent.task.completed","sentinel",[1,2,3,5,8]),
        ("rss.market.signal","rain",[1,4,7,8,9]),
        ("rss.anomaly.captured","sentinel",[1,2,3,4,5,6,7,8,9]),
    ] * 10):
        eid = f"{now_ms - i*60000:019d}"
        events.append({
            "event_id": eid,
            "event_type": evt[0],
            "tier_source": 1,
            "vector": {"t":now_ms-i*60000,"s_x":37.1234+i*0.01,"s_y":-105.5678-i*0.01,"z_negative":-0.15-i*0.01,"z_positive":0.1+i*0.005,"c":0.95-i*0.01,"l":"COMPLIANT","v_f":0.8+i*0.01,"e":1000+i*100,"g":"APPROVED"},
            "execution": {"plane_triggered":evt[2],"agent_bindings":[evt[1]]},
            "metadata": {"correlation_id":f"boot-{i}","session_id":"bootstrap","ancestry_hash":""},
            "forensic": {"created_at":now_ms-i*60000,"hash_input":f"bootstrap-{eid}","sealed":True,"hash_full":hashlib.sha3_256(f"bootstrap-{eid}".encode()).hexdigest()},
            "cascade_depth":1,
            "child_events":[],
            "dap_evaluation": {"planes_evaluated":evt[2],"all_match":True,"planes7to9_pass":True,"final_state":"execute","plane_results":{str(p):{"name":"bootstrap","matched":True,"threshold":"bootstrap","weight":0.1} for p in evt[2]}}
        })
    with open(f"{STORES_DIR}/events.json","w") as f:
        json.dump({"events":events,"total":len(events),"cascade_depth_max":1}, f)
    # Reasoning
    with open(f"{STORES_DIR}/reasoning.json","w") as f:
        json.dump({"entries":[]}, f)
    # SEM context
    with open(f"{STORES_DIR}/sem_context.json","w") as f:
        json.dump({"version":"1.0.0","darwin_cycle":{"phase":"OBSERVE","iteration":0,"last_run":None,"observations":[],"hypotheses":[],"applied":[],"rollbacks":[]},"self_modifications":{"count":0,"log":[]}}, f)
    print(f"[BOOTSTRAP] Agentic v1.0.0 seeded to {STORES_DIR}")
    print(f"  Agents: {len(AGENTS)}")
    print(f"  Tasks: {len(TASKS)}")
    print(f"  Events: {len(events)}")
    print(f"  Subscriptions: {len(SUBSCRIPTIONS)}")
    print(f"  Stores: agents.json, tasks.json, events.json, subscriptions.json, reasoning.json, sem_context.json")

if __name__ == "__main__":
    bootstrap()
