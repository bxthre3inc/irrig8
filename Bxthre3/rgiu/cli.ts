#!/usr/bin/env bun
// RGIU CLI - Entry point

const runtime = {
  async run(agentName: string, input?: unknown) {
    console.log(`[RGIU] Loading agent: ${agentName}`);
    const agent = await import(`./agents/${agentName}/index.ts`);
    const { Runtime } = await import("./core/runtime.ts");
    const { State } = await import("./core/state.ts");
    
    const state = new State("./data/rgiu.sqlite");
    const rt = new Runtime(state);
    
    const result = await rt.execute(agent.default, input);
    console.log("\n=== RESULT ===");
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
};

const cmd = process.argv[2];
const args = process.argv.slice(3);

const commands: Record<string, () => Promise<void>> = {
  scout: () => runtime.run("scout"),
  appraise: () => runtime.run("appraise", args[0]),
  extend: () => runtime.run("extend", args[0]),
  outreach: () => runtime.run("outreach"),
  revenue: () => runtime.run("revenue"),
  init: async () => {
    await Bun.write("./data/rgiu.sqlite", "");
    console.log("[RGIU] Initialized database");
  },
  www: async () => {
    const { serve } = await import("./www/server.ts");
    await serve();
  },
  all: async () => {
    await runtime.run("scout");
    await runtime.run("appraise");
    await runtime.run("outreach");
  }
};

if (cmd && commands[cmd]) {
  await commands[cmd]();
} else {
  console.log(`
RGIU - Rio Grande Intelligence Unit
Usage:
  bun run cli.ts scout      # Find properties
  bun run cli.ts appraise   # Value properties  
  bun run cli.ts outreach   # Contact investors
  bun run cli.ts www        # Launch website
  bun run cli.ts all        # Run full pipeline
`);
}
