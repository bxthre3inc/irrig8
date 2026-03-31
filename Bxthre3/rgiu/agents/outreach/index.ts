// Outreach Agent - Investor and buyer acquisition
import type { Agent, Context, Result, Lead } from "../../core/types.ts";

const agent: Agent = {
  name: "outreach",
  trigger: "event",

  async run(ctx: Context): Promise<Result> {
    console.log("[outreach] Executing outreach campaign...");

    const hotProps = ctx.state.query(
      "SELECT * FROM properties WHERE status = 'valued' ORDER BY score DESC LIMIT 5"
    );

    const leadCount = ctx.state.query("SELECT COUNT(*) as count FROM leads")[0] as { count: number };
    
    if (leadCount.count === 0) {
      await this.seedLeads(ctx);
    }

    const leads = ctx.state.query("SELECT * FROM leads WHERE score > 70 LIMIT 10") as Lead[];
    const matches = this.matchProperties(hotProps as any[], leads);

    // Write outreach script
    const script = this.generateScript(matches[0]);
    await Bun.write("./data/outreach-script.txt", script);

    return {
      success: true,
      data: {
        hotProperties: hotProps.length,
        matches: matches.length,
        topMatch: matches[0],
        script: script.slice(0, 200)
      },
      nextActions: matches.length > 0 ? [{
        agent: "revenue",
        task: "log-potential-fee",
        payload: { feeAmount: 5000 },
        priority: 9
      }] : undefined
    };
  },

  async seedLeads(ctx: Context): Promise<void> {
    const leads = [
      {
        id: "L1", type: "investor", name: "Denver Multifamily LLC",
        email: "deals@denvermf.com", phone: "+1-303-555-0100",
        score: 85, source: "linkedin", status: "new"
      },
      {
        id: "L2", type: "developer", name: "SLV Development Group",
        email: "acquisitions@slvdev.com", phone: "+1-719-555-0200",
        score: 75, source: "chamber", status: "new"
      },
      {
        id: "L3", type: "investor", name: "Aspen Capital Partners",
        email: "deals@aspen-cap.com", phone: "+1-970-555-0300",
        score: 90, source: "referral", status: "new"
      }
    ];

    for (const lead of leads) {
      ctx.state.exec(
        "INSERT INTO leads (id, type, name, email, phone, score, source, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [lead.id, lead.type, lead.name, lead.email, lead.phone, lead.score, lead.source, lead.status]
      );
    }
  },

  matchProperties(props: any[], leads: Lead[]): any[] {
    return props.slice(0, 3).map((p, i) => ({
      property: p,
      lead: leads[i % leads.length],
      potentialFee: 5000
    }));
  },

  generateScript(match: any): string {
    return `OUTREACH SCRIPT
================
To: ${match?.lead?.name || "Investor"}
Re: Off-Market Deal - Monte Vista Commercial

Hi [Name],

We've identified a distressed commercial property in Monte Vista, CO that may fit your investment criteria.

Property: ${match?.property?.address || "TBD"}
Assessed Value: $${match?.property?.assessed_value || "TBD"}
Max Offer: $${Math.round((match?.property?.assessed_value || 100000) * 0.7)}

We represent the deal flow only - no ownership stake.

Interested in a 5-minute call this week?

Best,
RGIU Deal Flow`;
  }
};

export default agent;
