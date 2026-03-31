// Appraise Agent - Valuation engine
import type { Agent, Context, Result, Valuation } from "../../core/types.ts";

const agent: Agent = {
  name: "appraise",
  trigger: "event",

  async run(ctx: Context): Promise<Result> {
    const propertyId = ctx.input as string;
    console.log(`[appraise] Valuing property: ${propertyId}`);

    const prop = ctx.state.get(
      "SELECT * FROM properties WHERE id = ?",
      [propertyId]
    ) as Record<string, unknown>;

    if (!prop) {
      return { success: false, errors: ["Property not found"] };
    }

    const valuation = this.calculateValuation(prop);
    
    ctx.state.exec(`INSERT INTO valuations 
      (id, property_id, method, estimated_market_value, estimated_repair_cost, 
       max_offer_price, confidence, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [Math.random().toString(36).substr(2, 9), propertyId, valuation.method,
       valuation.estimatedMarketValue, valuation.estimatedRepairCost,
       valuation.maxOfferPrice, valuation.confidence, new Date().toISOString()]
    );

    ctx.state.exec(
      "UPDATE properties SET status = 'valued' WHERE id = ?",
      [propertyId]
    );

    return {
      success: true,
      data: valuation,
      nextActions: valuation.confidence > 0.7 ? [{
        agent: "outreach",
        task: "alert-leads",
        payload: { propertyId, valuation },
        priority: 8
      }] : undefined
    };
  },

  calculateValuation(prop: Record<string, unknown>): Valuation {
    const assessed = (prop.assessed_value as number) || 100000;
    const condition = (prop.condition as string) || "unknown";
    
    const multipliers: Record<string, number> = {
      excellent: 1.3, good: 1.1, fair: 0.95, poor: 0.75, unknown: 1.0
    };

    const estimatedMarket = Math.round(assessed * (multipliers[condition] || 1.0));
    const repairCost = condition === "poor" ? 25000 : condition === "fair" ? 10000 : 0;
    const maxOffer = Math.round((estimatedMarket - repairCost) * 0.7);
    
    return {
      propertyId: prop.id as string,
      method: "comp",
      estimatedMarketValue: estimatedMarket,
      estimatedRepairCost: repairCost,
      maxOfferPrice: maxOffer,
      roiScenario: {
        holdPeriod: 12,
        exitPrice: Math.round(estimatedMarket * 1.05),
        rentalIncome: Math.round(estimatedMarket * 0.008)
      },
      confidence: 0.6,
      comparables: [],
      createdAt: new Date().toISOString()
    };
  }
};

export default agent;
