// Extend Agent - Self-creation protocol
import type { Agent, Context, Result } from "../../core/types.ts";

const agent: Agent = {
  name: "extend",
  trigger: "manual",

  async run(ctx: Context): Promise<Result> {
    const skillName = ctx.input as string;
    
    if (!skillName) {
      return { success: false, errors: ["Skill name required"] };
    }

    console.log(`[extend] Creating skill: ${skillName}`);

    const skillDir = `./skills/${skillName}`;
    await Bun.mkdir(skillDir, { recursive: true });

    const skillMd = `---
name: ${skillName}
description: Auto-generated skill
created: ${new Date().toISOString()}
by: extend-agent
---

## Purpose
Satisfies requirement flagged by runtime.

## Interface
- Input: TBD by calling agent
- Output: Structured JSON

## Next Steps
1. Define exact interface
2. Implement core logic
3. Add test cases
4. Register in runtime
`;

    await Bun.write(`${skillDir}/SKILL.md`, skillMd);

    const skillCode = `// Auto-generated skill: ${skillName}
import type { SkillContext, SkillResult } from "../../core/types";

export async function execute(ctx: SkillContext): Promise<SkillResult> {
  console.log(`[${skillName}] Running...`);
  
  return {
    success: true,
    data: {},
    nextActions: []
  };
}
`;

    await Bun.write(`${skillDir}/index.ts`, skillCode);

    return {
      success: true,
      data: { created: skillName, path: skillDir },
      nextActions: [{
        agent: "outreach",
        task: "notify-builders",
        payload: { newSkill: skillName },
        priority: 5
      }]
    };
  },

  // Called by runtime when agent requests new skill
  async requestSkill(skillName: string): Promise<void> {
    console.log(`[extend] Auto-triggered to create: ${skillName}`);
    // In real implementation, would queue this properly
  }
};

export default agent;
