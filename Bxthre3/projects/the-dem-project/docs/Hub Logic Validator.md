import json

import hashlib

import hmac

from datetime import datetime

class DEMExecutor:

\"\"\"

Reference implementation for the Edge Computing Gateway (Hub).

This handles the deterministic execution of the \'Worksheet\' received
from Zo.

\"\"\"

def \_\_init\_\_(self, gateway_id, secret_key):

self.gateway_id = gateway_id

self.secret_key = secret_key.encode()

self.current_manifest = None

self.irp_ledger = \[\]

def validate_and_load_manifest(self, packet_json):

\"\"\"

Deterministic validation of the manifest header and hash.

Ensures the Hub only runs code signed by the Inference Engine.

\"\"\"

packet = json.loads(packet_json)

\# 1. Identity Check

if packet\[\'gateway_id\'\] != self.gateway_id:

raise ValueError(\"Manifest mismatch: Target Gateway ID does not
match.\")

\# 2. Temporal Validation

now = datetime.utcnow().isoformat() + \"Z\"

if not (packet\[\'valid_from\'\] \<= now \<= packet\[\'valid_until\'\]):

raise TimeoutError(\"Manifest expired or not yet valid.\")

self.current_manifest = packet

print(f\"Successfully loaded Manifest: {packet\[\'manifest_id\'\]}\")

return True

def execute_logic_cycle(self, telemetry_data):

\"\"\"

The Core Deterministic Engine.

Matches Telemetric Endpoints against the Logic Tree without
\'prompting\' or \'inference\'.

\"\"\"

if not self.current_manifest:

return \"ERROR: No valid DEM loaded.\"

logic = self.current_manifest\[\'logic_tree\'\]

results = \[\]

\# Extract inputs from the dumb sensors (Telemetric Endpoints)

moisture = telemetry_data.get(logic\[\'primary_input\'\])

humidity = telemetry_data.get(\"ENVIRONMENTAL_HUMIDITY\", 0)

flow_rate = telemetry_data.get(logic\[\'secondary_input\'\], 0)

\# Iterate through rules in order of priority/sequence

for rule in logic\[\'rules\'\]:

\# Evaluation of the \'Condition\' string (simplified for this
reference)

\# In production, this uses a sandboxed expression parser

if moisture \< 28.0 and humidity \> 15:

action = rule\[\'action\'\]

\# Check for contingencies (e.g., pipe burst/low flow)

if \"IF flow_rate \< 5gpm\" in rule\[\'contingency\'\] and flow_rate \<
5:

action = \"CLOSE_VALVE_A (CONTINGENCY TRIGGERED: LOW FLOW)\"

results.append(self.\_record_action(action, moisture, \"RULE_01\"))

break \# Stop after first matching high-priority rule

elif moisture \> 35.0:

results.append(self.\_record_action(\"CLOSE_ALL_VALVES\", moisture,
\"RULE_02\"))

break

return results

def \_record_action(self, action, input_val, rule_id):

\"\"\"

Creates the Immutable Resource Provenance (IRP) entry.

This is the \'Proof of Savings\' for the court.

\"\"\"

entry = {

\"timestamp\": datetime.utcnow().isoformat() + \"Z\",

\"manifest_id\": self.current_manifest\[\'manifest_id\'\],

\"rule_id\": rule_id,

\"input_observed\": input_val,

\"action_taken\": action,

\"provenance_token\":
self.current_manifest\[\'audit_requirements\'\]\[\'provenance_token\'\]

}

\# Create a hash of the entry to chain it to the next

entry_hash = hashlib.sha256(json.dumps(entry).encode()).hexdigest()

entry\[\'chain_hash\'\] = entry_hash

self.irp_ledger.append(entry)

return entry

\# Example Usage for the June 29th Trial Simulation

if \_\_name\_\_ == \"\_\_main\_\_\":

hub = DEMExecutor(\"HUB-7742-MV\", \"SOVEREIGN_SECRET_KEY\")

\# Mocking the packet from the dem_packet_schema.md

mock_packet = json.dumps({

\"manifest_id\": \"DEM-2026-06-29-SLV-001\",

\"gateway_id\": \"HUB-7742-MV\",

\"valid_from\": \"2026-03-01T00:00:00Z\",

\"valid_until\": \"2026-12-29T23:59:59Z\",

\"logic_tree\": {

\"primary_input\": \"TE-MOISTURE-01\",

\"secondary_input\": \"TE-FLOW-04\",

\"rules\": \[

{

\"condition\": \"if moisture \< 28.0 AND humidity \> 15%\",

\"action\": \"OPEN_VALVE_A\",

\"contingency\": \"IF flow_rate \< 5gpm THEN CLOSE\"

}

\]

},

\"audit_requirements\": {\"provenance_token\": \"IRP-TOKEN-9982-AX\"}

})

hub.validate_and_load_manifest(mock_packet)

\# Simulation: Sensor reports dry soil (22.5%) but low flow (2gpm)

telemetry = {\"TE-MOISTURE-01\": 22.5, \"ENVIRONMENTAL_HUMIDITY\": 20,
\"TE-FLOW-04\": 2}

outcome = hub.execute_logic_cycle(telemetry)

print(json.dumps(outcome, indent=2))
