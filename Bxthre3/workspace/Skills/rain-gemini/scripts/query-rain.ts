#!/usr/bin/env bun

/**
 * RAIN — Regulatory Arbitrage Identification & Notification
 * Gemini-powered regulatory gap detection query tool
 *
 * Usage:
 *   bun query-rain.ts "Your regulatory query here" [options]
 *   bun query-rain.ts --help
 *
 * Environment:
 *   GOOGLE_API_KEY — Google AI Studio API key (set in Zo Settings > Advanced > Secrets)
 */

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface Gap {
  title: string;
  description: string;
  jurisdiction: string;
  riskLevel: "high" | "medium" | "low";
  opportunityScore: number;
  applicableRegulations: string[];
  exploitationVector: string;
}

interface RainResult {
  summary: string;
  gaps: Gap[];
  riskScore: number;
  mode: "arb" | "reg";
  jurisdiction: string;
  model: string;
  timestamp: string;
}

interface QueryOptions {
  query: string;
  mode?: "arb" | "reg";
  jurisdiction?: string;
  model?: string;
  json?: boolean;
}

function buildPrompt(query: string, mode: "arb" | "reg", jurisdiction: string): string {
  const roleInstruction =
    mode === "arb"
      ? `You are an offensive regtech analyst working in ARBITRAGEUR MODE.
Your goal is to identify exploitable REGULATORY GAPS and arbitrage opportunities.
Find grey areas, regulatory voids, loopholes, and non-enforced provisions that can be
exploited for competitive financial advantage.`
      : `You are a defensive regtech analyst working in REGULATOR MODE.
Your goal is to identify REGULATORY GAPS from a regulator's perspective.
Find policy leakage, enforcement gaps, regulatory voids, and systemic vulnerabilities
that allow entities to evade compliance or minimize tax obligations.`;

  return `${roleInstruction}

Jurisdiction: ${jurisdiction}
Query: ${query}

Respond ONLY with a valid JSON object. No markdown, no explanation, no preamble.
Format:
{
  "summary": "2-3 sentence executive summary of the key finding",
  "gaps": [
    {
      "title": "Short descriptive title of the gap",
      "description": "Detailed description (2-3 sentences)",
      "jurisdiction": "${jurisdiction}",
      "riskLevel": "high|medium|low",
      "opportunityScore": 0-100,
      "applicableRegulations": ["REG-001", "REG-002"],
      "exploitationVector": "How this gap can be exploited or addressed"
    }
  ],
  "riskScore": 0-100
}

If no significant gaps are found, return gaps: [] and riskScore: 0 with an appropriate summary.
Never invent specific regulation names — only use regulations you are confident exist.`;
}

async function queryGemini(
  prompt: string,
  apiKey: string,
  model: string
): Promise<{ text: string }> {
  const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${error}`);
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Unexpected Gemini response structure");
  }

  return { text: data.candidates[0].content.parts[0].text };
}

export async function queryRain(options: QueryOptions): Promise<RainResult> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_API_KEY not set. Add it in Zo: Settings > Advanced > Secrets as GOOGLE_API_KEY"
    );
  }

  const {
    query,
    mode = "arb",
    jurisdiction = "US",
    model = "gemini-2.0-flash",
  } = options;

  const prompt = buildPrompt(query, mode, jurisdiction);
  const { text } = await queryGemini(prompt, apiKey, model);

  let parsed: Partial<RainResult>;
  try {
    const cleaned = text.replace(/```json\n?|```\n?/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${text.slice(0, 500)}`);
  }

  return {
    summary: parsed.summary ?? "No summary returned",
    gaps: (parsed.gaps ?? []) as Gap[],
    riskScore: parsed.riskScore ?? 0,
    mode,
    jurisdiction,
    model,
    timestamp: new Date().toISOString(),
  };
}

function printHelp() {
  console.log(`
RAIN — Regulatory Arbitrage Identification & Notification
Gemini-powered regulatory gap detection query tool

USAGE
  bun query-rain.ts "your query here" [options]
  bun query-rain.ts --help

ARGUMENTS
  query    The regulatory arbitrage or compliance gap query to analyze

OPTIONS
  --mode <arb|reg>       Query mode:
                          arb  = Arbitrageur mode (offensive — find exploitable gaps)
                          reg  = Regulator mode (defensive — find enforcement gaps)
                          Default: arb

  --jurisdiction <code>   ISO 3166-1 alpha-2 jurisdiction code
                          Default: US

  --model <name>          Gemini model to use
                          Default: gemini-2.0-flash
                          Options: gemini-2.0-flash, gemini-1.5-flash,
                                   gemini-2.5-flash, gemini-2.5-pro

  --json                  Output raw JSON instead of formatted text

EXAMPLES
  # Find regulatory gaps in EU crypto derivatives
  bun query-rain.ts "Regulatory gaps in cryptocurrency derivatives in the EU" --jurisdiction EU --mode arb

  # Regulator mode: find enforcement gaps in US securities
  bun query-rain.ts "Compliance enforcement gaps in US equity market structure" --mode reg

  # Use a more powerful model
  bun query-rain.ts "Peer-to-peer lending regulatory arbitrage" --model gemini-2.5-pro

  # Programmatic usage (in another script)
  import { queryRain } from "./Skills/rain-gemini/scripts/query-rain.ts"
  const result = await queryRain({ query: "...", mode: "arb", jurisdiction: "US" })

ENVIRONMENT
  GOOGLE_API_KEY   Required. Set in Zo: Settings > Advanced > Secrets > GOOGLE_API_KEY
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else if (key === "json") {
        flags[key] = true;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  const query = positional.join(" ");
  if (!query) {
    console.error("Error: query argument required. Use --help for usage.");
    process.exit(1);
  }

  const mode = (flags.mode as "arb" | "reg") || "arb";
  const jurisdiction = (flags.jurisdiction as string) || "US";
  const model = (flags.model as string) || "gemini-2.0-flash";
  const asJson = flags.json === true;

  if (!["arb", "reg"].includes(mode)) {
    console.error(`Error: mode must be 'arb' or 'reg', got '${mode}'`);
    process.exit(1);
  }

  try {
    const result = await queryRain({ query, mode, jurisdiction, model });

    if (asJson) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`\n🔍 RAIN Query Results`);
      console.log(`Mode: ${mode.toUpperCase()} | Jurisdiction: ${jurisdiction} | Model: ${model}`);
      console.log(`Time: ${result.timestamp}\n`);
      console.log(`📊 Risk Score: ${result.riskScore}/100\n`);
      console.log(`Summary: ${result.summary}\n`);

      if (result.gaps.length === 0) {
        console.log("✅ No significant regulatory gaps identified.");
      } else {
        console.log(`📋 Identified Gaps (${result.gaps.length}):\n`);
        result.gaps.forEach((gap, i) => {
          const emoji = gap.riskLevel === "high" ? "🔴" : gap.riskLevel === "medium" ? "🟡" : "🟢";
          console.log(`  ${i + 1}. ${emoji} ${gap.title}`);
          console.log(`     Jurisdiction: ${gap.jurisdiction} | Risk: ${gap.riskLevel} | Score: ${gap.opportunityScore}/100`);
          console.log(`     ${gap.description}`);
          console.log(`     Regulations: ${gap.applicableRegulations.join(", ")}`);
          console.log(`     Vector: ${gap.exploitationVector}`);
          console.log();
        });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Error: ${message}`);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export type { RainResult, Gap, QueryOptions };
