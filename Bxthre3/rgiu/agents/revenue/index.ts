// Revenue Agent - Tracks fees and monetization
import type { Agent, Context, Result } from "../../core/types.ts";

const agent: Agent = {
  name: "revenue",
  trigger: "event",

  async run(ctx: Context): Promise<Result> {
    const payload = ctx.input as { feeAmount?: number };
    
    console.log("[revenue] Tracking potential fee...");

    // Log potential fee
    const feeId = `FEE-${Date.now()}`;
    
    ctx.state.exec(
      "INSERT INTO fees (id, type, amount, status, source, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [feeId, "finder_fee", payload?.feeAmount || 5000, "pending", "outreach", new Date().toISOString()]
    );

    // Calculate metrics
    const stats = ctx.state.query(`
      SELECT 
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_fees,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as collected_fees,
        COUNT(*) as total_deals
      FROM fees
    `)[0] as { pending_fees: number; collected_fees: number; total_deals: number };

    return {
      success: true,
      data: {
        newFeeId: feeId,
        pendingRevenue: stats?.pending_fees || 0,
        collectedRevenue: stats?.collected_fees || 0,
        totalDeals: stats?.total_deals || 0,
        runwayDays: Math.floor((stats?.pending_fees || 0) / 100), // Assumes $100/day burn
        message: "$0 budget strategy: Land 2 deals in 7 days to reach $10K revenue"
      },
      nextActions: stats?.pending_fees > 5000 ? [{
        agent: "outreach",
        task: "urgent-follow-up",
        payload: { reason: "pending_fees_crossed_threshold" },
        priority: 10
      }] : undefined
    };
  }
};

export default agent;
