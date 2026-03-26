---
name: rain-gemini
description: "RAIN regulatory gap detection via Gemini — sends regulatory arbitrage queries and returns structured gap analysis powered by Google Gemini."
compatibility: "Created for Zo Computer"
metadata:
  author: brodiblanco.zo.computer
---

# RAIN Gemini Integration Skill

Calls Google Gemini directly to power RAIN (Regulatory Arbitrage Identification & Notification) regulatory gap detection.

## Setup

### 1. Get a Google AI Studio API Key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create a new API key (free tier available — includes Gemini 2.5 Flash free)
3. Copy the key

### 2. Store the Key in Zo

Navigate to **[Settings → Advanced → Secrets](/?t=settings&s=advanced)** and add:

| Secret Name | Value |
|---|---|
| `GOOGLE_API_KEY` | Your Google AI Studio API key |

## Usage

### Run a Query

```bash
bun Skills/rain-gemini/scripts/query-rain.ts "What are current regulatory gaps in cryptocurrency derivatives in the EU?"
```

### CLI Options

```bash
bun Skills/rain-gemini/scripts/query-rain.ts --help
```

| Flag | Description |
|---|---|
| `--mode <arb\|reg>` | Query mode: `arb` (Arbitrageur) or `reg` (Regulator). Default: `arb` |
| `--jurisdiction <code>` | ISO 3166-1 alpha-2 jurisdiction code. Default: `US` |
| `--model <name>` | Gemini model to use. Default: `gemini-2.0-flash` |
| `--json` | Output raw JSON response |
| `--help` | Show this help message |

### Programmatic Usage

```typescript
import { queryRain } from "./Skills/rain-gemini/scripts/query-rain.ts";

const result = await queryRain({
  query: "Regulatory gaps in peer-to-peer lending in Brazil",
  mode: "arb",
  jurisdiction: "BR",
  model: "gemini-2.0-flash",
});

console.log(result.gaps);      // Array of identified gaps
console.log(result.summary);   // Human-readable summary
console.log(result.riskScore); // 0-100 risk/opportunity score
```

## API Details

- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Auth:** `?key={GOOGLE_API_KEY}` query param
- **Free tier:** Gemini 2.5 Flash is free under threshold
- **Rate limit:** ~15 RPM on free tier

## Output Format

The script returns a structured gap analysis:

```json
{
  "summary": "...",
  "gaps": [
    {
      "title": "Gap name",
      "description": "Description of the gap",
      "jurisdiction": "US",
      "riskLevel": "high|medium|low",
      "opportunityScore": 0-100,
      "applicableRegulations": ["reg1", "reg2"],
      "exploitationVector": "How to exploit this gap"
    }
  ],
  "riskScore": 0-100,
  "mode": "arb|reg",
  "jurisdiction": "US",
  "model": "gemini-2.0-flash",
  "timestamp": "ISO timestamp"
}
```
