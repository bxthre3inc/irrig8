// Agentic v1 — Deterministic Shell (P0)
// CommandWhitelist with safety interlocks
// Version-controlled, cryptographically signed whitelist

export interface ShellCommand {
  command: string;          // e.g. 'mcp.file_read'
  args: Record<string, any>;
  sandboxed: boolean;
  safety_interlock?: boolean;
  rate_limit?: string;      // e.g. '100/min'
  max_size?: string;
  e_stop_category?: number;
  blocking?: boolean;
}

export interface ShellResult {
  allowed: boolean;
  whitelist_version: string;
  command: string;
  sandboxed: boolean;
  safety_interlock_triggered: boolean;
  rate_limit_ok: boolean;
  violations: string[];
  executed?: boolean;
  output?: any;
  error?: string;
}

export const SHELL_VERSION = '2026.04.11-001';

export const COMMAND_WHITELIST: Record<string, Omit<ShellCommand, 'command'>> = {
  // MCP / Digital worker commands
  'mcp.file_read':     { sandboxed: true,  args: ['path', 'encoding'] },
  'mcp.file_write':     { sandboxed: true,  args: ['path', 'content'] },
  'mcp.file_delete':   { sandboxed: false, args: ['path'], safety_interlock: true },
  'mcp.http_request':  { sandboxed: true,  args: ['url', 'method', 'headers'], rate_limit: '100/min' },
  'mcp.execute_python':{ sandboxed: true,  args: ['code'], rate_limit: '10/min' },
  'mcp.execute_bash':  { sandboxed: false, args: ['cmd'],   safety_interlock: true, rate_limit: '5/min' },
  
  // OPC-UA / Physical worker commands
  'opcua.cnc_start_program':  { sandboxed: false, args: ['program_id', 'tool_check'], safety_interlock: true },
  'opcua.cnc_stop':           { sandboxed: false, args: [], safety_interlock: true, e_stop_category: 1 },
  'opcua.cnc_estop':          { sandboxed: false, args: [], safety_interlock: true, e_stop_category: 1 },
  'opcua.sensor_read':        { sandboxed: true,  args: ['sensor_id', 'unit'] },
  
  // MQTT / IoT commands
  'mqtt.publish':      { sandboxed: true, args: ['topic', 'payload', 'qos'], max_size: '1MB', rate_limit: '1000/min' },
  'mqtt.subscribe':    { sandboxed: true, args: ['topic', 'qos'] },
  
  // Human escalation
  'human.notify':           { sandboxed: true, args: ['user_id', 'message', 'priority'], escalation_timeout: '24h' },
  'human.request_approval': { sandboxed: true, args: ['decision_context', 'options'], blocking: true },
  'human.page_p1':          { sandboxed: false, args: ['user_id', 'message'], safety_interlock: true },
  
  // Agentic internal
  'agentic.ingest_event':     { sandboxed: true, args: ['event_type', 'vector'] },
  'agentic.query_store':      { sandboxed: true, args: ['table', 'filters'] },
  'agentic.invoke_agent':     { sandboxed: true, args: ['agent_id', 'task'] },
  
  // Irrig8 specific
  'irrig8.set_pivot_position':  { sandboxed: false, args: ['pivot_id', 'angle'], safety_interlock: true },
  'irrig8.read_sensor':         { sandboxed: true,  args: ['sensor_id'] },
  'irrig8.trigger_irrigation': { sandboxed: false, args: ['zone_id', 'duration_min'], safety_interlock: true },
};

// Rate limit tracking (in-memory for now)
const rateLimitWindow = new Map<string, { count: number; reset_at: number }>();

function checkRateLimit(command: string): { ok: boolean; remaining: number; reset_at: number } {
  const spec = COMMAND_WHITELIST[command];
  if (!spec?.rate_limit) return { ok: true, remaining: Infinity, reset_at: 0 };
  
  const [limit, window] = spec.rate_limit.split('/');
  const limitNum = parseInt(limit, 10);
  const windowMs = window === 'min' ? 60000 : window === 'sec' ? 1000 : 60000;
  
  const now = Date.now();
  const entry = rateLimitWindow.get(command);
  
  if (!entry || now > entry.reset_at) {
    rateLimitWindow.set(command, { count: 1, reset_at: now + windowMs });
    return { ok: true, remaining: limitNum - 1, reset_at: now + windowMs };
  }
  
  if (entry.count >= limitNum) {
    return { ok: false, remaining: 0, reset_at: entry.reset_at };
  }
  
  entry.count++;
  return { ok: true, remaining: limitNum - entry.count, reset_at: entry.reset_at };
}

export function evaluateShellCommand(cmd: ShellCommand): ShellResult {
  const violations: string[] = [];
  
  // Check whitelist
  const spec = COMMAND_WHITELIST[cmd.command];
  if (!spec) {
    return {
      allowed: false,
      whitelist_version: SHELL_VERSION,
      command: cmd.command,
      sandboxed: false,
      safety_interlock_triggered: false,
      rate_limit_ok: true,
      violations: [`UNKNOWN_COMMAND: '${cmd.command}' is not in the CommandWhitelist`],
      error: `Command '${cmd.command}' is not whitelisted. Known commands: ${Object.keys(COMMAND_WHITELIST).join(', ')}`
    };
  }
  
  // Check safety interlock
  let safety_interlock_triggered = false;
  if (spec.safety_interlock && !cmd.sandboxed) {
    // Safety interlocks require manual human confirmation for physical actions
    safety_interlock_triggered = true;
    violations.push('SAFETY_INTERLOCK: Physical-world command requires human confirmation before execution');
  }
  
  // Rate limit check
  const rateCheck = checkRateLimit(cmd.command);
  if (!rateCheck.ok) {
    violations.push(`RATE_LIMIT_EXCEEDED: ${cmd.command} exceeded ${spec.rate_limit}`);
  }
  
  // Payload size check
  if (spec.max_size) {
    const payloadStr = JSON.stringify(cmd.args);
    const sizeNum = parseInt(spec.max_size);
    if (payloadStr.length > sizeNum) {
      violations.push(`PAYLOAD_SIZE_EXCEEDED: ${payloadStr.length} > ${spec.max_size}`);
    }
  }
  
  const allowed = violations.length === 0;
  
  return {
    allowed,
    whitelist_version: SHELL_VERSION,
    command: cmd.command,
    sandboxed: spec.sandboxed,
    safety_interlock_triggered,
    rate_limit_ok: rateCheck.ok,
    violations,
    executed: allowed,
  };
}
