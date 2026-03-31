// RGIU Runtime - Agent execution engine
import type { Agent, Context, Result, State } from "./types.ts";
import { FileBus } from "./bus.ts";

export class Runtime {
  private state: State;
  private bus: FileBus;

  constructor(state: State) {
    this.state = state;
    this.bus = new FileBus();
  }

  async execute(agent: Agent, input?: unknown): Promise<Result> {
    console.log(`[RGIU] Executing: ${agent.name}`);
    
    const ctx: Context = {
      state: this.state,
      bus: this.bus,
      input
    };

    try {
      // Log start
      this.state.exec(
        "INSERT INTO events (agent, type, payload, created_at) VALUES (?, ?, ?, ?)",
        [agent.name, "start", JSON.stringify({ input }), new Date().toISOString()]
      );

      const startTime = Date.now();
      const result = await agent.run(ctx);
      const duration = Date.now() - startTime;

      // Log success
      this.state.exec(
        "INSERT INTO events (agent, type, payload, created_at) VALUES (?, ?, ?, ?)",
        [agent.name, "success", JSON.stringify({ duration, result: !!result.success }), new Date().toISOString()]
      );

      // Handle skill creation request
      if (result.needsSkill) {
        console.log(`[RGIU] Agent requests new skill: ${result.needsSkill}`);
        await this.triggerExtend(result.needsSkill);
      }

      // Execute next actions
      if (result.nextActions) {
        for (const action of result.nextActions) {
          if (action.priority >= 7) {
            console.log(`[RGIU] Triggering next: ${action.agent} (${action.task})`);
          }
        }
      }

      return result;

    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      
      this.state.exec(
        "INSERT INTO events (agent, type, payload, created_at) VALUES (?, ?, ?, ?)",
        [agent.name, "error", errMsg, new Date().toISOString()]
      );

      return {
        success: false,
        errors: [errMsg]
      };
    }
  }

  private async triggerExtend(skillName: string) {
    // Dynamically import and run extend agent
    const extend = await import("../agents/extend/index.ts");
    await extend.default.requestSkill(skillName);
  }
}
