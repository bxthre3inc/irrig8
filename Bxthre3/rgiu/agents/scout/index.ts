// Scout Agent - Discovers distressed properties
import type { Agent, Context, Result, Property } from "../../core/types.ts";

const agent: Agent = {
  name: "scout",
  trigger: "cron",

  async run(ctx: Context): Promise<Result> {
    console.log("[scout] Scanning Rio Grande County...");
    
    const properties = await this.findProperties(ctx);
    let hotCount = 0;
    const nextActions: { agent: string; task: string; payload: string; priority: number }[] = [];

    for (const prop of properties) {
      const scored = this.score(prop);
      
      if (scored.score >= 70) {
        hotCount++;
        scored.status = "hot";
        nextActions.push({
          agent: "appraise",
          task: "deep-valuation",
          payload: scored.id,
          priority: scored.score / 10
        });
      }

      ctx.state.exec(`INSERT OR REPLACE INTO properties 
        (id, address, city, county, state, zip, assessed_value, tax_status, score, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [scored.id, scored.address, scored.city, scored.county, scored.state, 
         scored.zip, scored.assessedValue, scored.taxStatus, scored.score, scored.status, scored.createdAt]
      );
    }

    const total = (ctx.state.query("SELECT COUNT(*) as count FROM properties")[0] as { count: number }).count;

    return {
      success: true,
      data: { found: properties.length, hot: hotCount, totalInDb: total },
      nextActions: nextActions.length > 0 ? nextActions : undefined
    };
  },

  async findProperties(ctx: Context): Promise<Property[]> {
    // MVP: Return sample distressed properties in Rio Grande County
    // Production: Scrape assessor, watch foreclosure filings
    
    const samples: Partial<Property>[] = [
      {
        address: "947 1st Ave",
        city: "Monte Vista",
        county: "Rio Grande",
        state: "CO",
        zip: "81144",
        assessedValue: 85000,
        taxStatus: "delinquent",
        condition: "fair",
        distressSignals: [{ type: "tax_delinquent", severity: 2, source: "county_records", date: new Date().toISOString() }]
      },
      {
        address: "225 Adams St",
        city: "Monte Vista",
        county: "Rio Grande", 
        state: "CO",
        zip: "81144",
        assessedValue: 120000,
        taxStatus: "current",
        condition: "poor",
        distressSignals: [{ type: "code_violations", severity: 3, source: "city_records", date: new Date().toISOString() }]
      },
      {
        address: "1030 US-160",
        city: "Monte Vista",
        county: "Rio Grande",
        state: "CO", 
        zip: "81144",
        assessedValue: 180000,
        taxStatus: "delinquent",
        condition: "poor",
        distressSignals: [
          { type: "tax_delinquent", severity: 3, source: "county_records", date: new Date().toISOString() },
          { type: "vacant", severity: 2, source: "field_check", date: new Date().toISOString() }
        ]
      }
    ];

    return samples.map((p, i) => ({
      ...p,
      id: `RGC-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: 0,
      status: "new"
    })) as Property[];
  },

  score(prop: Property): Property {
    let score = 50; // Base score

    // Tax status weight
    if (prop.taxStatus === "delinquent") score += 15;
    
    // Condition weight  
    if (prop.condition === "poor") score += 10;
    if (prop.condition === "fair") score += 5;
    
    // Distress signal weight
    score += (prop.distressSignals?.length || 0) * 5;
    prop.distressSignals?.forEach(s => score += s.severity * 3);
    
    // Price attractiveness
    if (prop.assessedValue < 100000) score += 10;
    if (prop.assessedValue < 150000) score += 5;

    return { ...prop, score: Math.min(100, Math.max(0, score)) };
  }
};

export default agent;
