# EU AI Compliance Tool — v2

**Automated Gap Analysis · Regulation (EU) 2024/1689 — EU AI Act**

→ **[Live Demo](https://eu-ai-compliance-tool-v2.vercel.app)**

> **Disclaimer**: This tool is intended for educational and portfolio purposes only. It does not constitute legal advice. For formal EU AI Act compliance assessments, always consult qualified legal counsel.

---

## Overview

This is an **applied AI portfolio project** exploring the intersection of large language models and regulatory compliance. It was built to demonstrate how LLMs can structure and automate complex legal analysis — in this case, compliance assessment against the EU Artificial Intelligence Act (Regulation EU 2024/1689).

The tool allows anyone to describe an AI system across five structured dimensions and receive a full gap analysis in seconds: risk classification, compliance score, prioritized action plan, article-by-article breakdown, and a downloadable PDF report — output that would typically require hours of manual legal and technical review.

v2 is a full rewrite of v1. Key improvements: BYOK architecture, 23-article corpus (vs 8 in v1), GPAI coverage (Art. 51–55), native tool_use output, score calibration across 9 validated scenarios, and client-side PDF export.

---

## What it does

The user answers five structured questions about their AI system and receives a full compliance report in three sections.

### Section 1 — Executive Dashboard
- **Compliance Score** (0–100) displayed as an animated gauge
- **Overall Readiness** label: Non-Compliant / Partially Compliant / Largely Compliant / Compliant
- **Risk Classification**: category, sector, affected persons, risk rationale
- **Executive Summary**: 3–4 sentence synthesis of the compliance posture
- **Critical Red Flags**: immediate blockers requiring urgent attention

### Section 2 — Priority Action Plan
- All required actions sorted by criticality (HIGH → MEDIUM → LOW)
- Each action includes a priority badge and deadline (Immediate / Before Aug 2026 / Ongoing)

### Section 3 — Article-by-Article Analysis
- Collapsible cards for each relevant EU AI Act article
- Each card shows: gap level, gap description, required actions, official EUR-Lex source link

### PDF Export
- One-click export of the full gap analysis as a structured PDF report
- Includes all sections: classification, score, executive summary, red flags, action plan, article gaps
- Filename auto-generated: `eu-ai-compliance-{system-slug}-{date}.pdf`

---

## Five-Question Intake Form

The analysis is grounded in a structured intake across five dimensions:

| # | Question | Required |
|---|---|---|
| 01 | What does your AI system do? | Yes |
| 02 | Who is directly affected by the system's outputs? | Yes |
| 03 | What data does the system process or was trained on? | Yes |
| 04 | What documentation or governance processes already exist? | No |
| 05 | Where and how is the system deployed? | No |

Questions Q4 and Q5 are optional but significantly improve score accuracy. The more specific the answers, the more actionable the analysis.

---

## Risk Classification

The tool automatically classifies the described system into one of five risk tiers based on keyword analysis of the intake answers:

| Tier | Description | Examples |
|---|---|---|
| **UNACCEPTABLE** | Prohibited practices under Art. 5 | Social scoring, subliminal manipulation, predictive policing |
| **HIGH** | Annex III high-risk systems | Recruitment AI, credit scoring, medical diagnosis, biometric |
| **GPAI** | General Purpose AI models | Foundation models, LLMs, base models offered via API |
| **LIMITED** | Transparency obligations only | Chatbots, virtual assistants, deepfake generation |
| **MINIMAL** | No specific obligations | Most standard software with no significant AI risk |

Classification is confirmed and refined by the Claude analysis in the gap analysis step.

---

## EU AI Act Articles Covered

v2 covers 23 articles, up from 8 in v1. Articles are assigned per risk tier and filtered client-side before the API call.

| Tier | Articles | Count |
|---|---|---|
| HIGH | Art. 5, 6, 9, 10, 13, 14, 15, 17, 18, 19, 20, 22, 25, 43, 47, 71, 72 | 17 |
| LIMITED | Art. 5, 50, 52, 99 | 4 |
| GPAI | Art. 51, 52, 53, 54, 55 | 4–5 |
| MINIMAL | Art. 5 | 1 |

GPAI article selection is additive: if GPAI keywords are detected in the intake, GPAI articles are appended to the standard tier set regardless of the primary tier.

All article definitions are in `src/data/articles.js`. Each entry includes: number, title, summary, key obligations, application date, and EUR-Lex source URL.

---

## Compliance Score Calibration

The scoring model was validated across a 3×3 calibration matrix covering three risk tiers at three input richness levels. All 9 cells were verified against expected ranges with monotonicity confirmed.

| Scenario | Input minimo (Q1–Q3 only) | Input medio (Q1–Q5 partial) | Input completo (Q1–Q5 detailed) |
|---|---|---|---|
| HIGH — Recruitment AI | 15 ✓ | 45 ✓ | 68 ✓ |
| LIMITED — Chatbot | 25 ✓ | 38 ✓ | 68 ✓ |
| GPAI — Foundation Model | 15 ✓ | 42 ✓ | 72 ✓ |

**Score mapping:**

| Range | Label | Meaning |
|---|---|---|
| 5–20 | Non-Compliant | No documentation, no oversight, possible violations |
| 35–55 | Partially Compliant | Some practices exist, major formal gaps remain |
| 62–78 | Largely Compliant | Solid foundations, minor procedural gaps |
| 82–95 | Compliant | Full documentation, QMS, conformity assessment complete |

**Scoring rules applied in system prompt:**
1. Score floors by input richness: blank Q4+Q5 → may fall in 5–30; any documented measures → floor 30; multiple concrete practices → floor 40
2. Each declared compliance signal (bias testing, human oversight, audit logging, copyright policy, etc.) adds +5–8 points above tier floor
3. Monotonicity guarantee: richer input always scores higher within the same scenario
4. Penalise only what is absent, not what was not claimed
5. Live EU deployment with active users → additional +8 points above tier floor

---

## Architecture — BYOK (Bring Your Own Key)

This tool uses a **BYOK architecture**: the user provides their own Anthropic API key, stored in the browser only, used to call the Anthropic API directly. There is no server-side proxy and no backend.

```
┌──────────────────────────────────────────────────────┐
│                   Browser (React SPA)                 │
│  - API key collected at gate UI                       │
│  - Key stored in sessionStorage (or localStorage)     │
│  - Intake answers stored in sessionStorage            │
│  - Client-side risk pre-classification (keyword)      │
│  - Client-side article filtering per risk tier        │
│  - POST sent directly to api.anthropic.com            │
└──────────────────────┬───────────────────────────────┘
                       │ POST /v1/messages
                       │ headers: x-api-key (USER key)
                       │          anthropic-version
                       │          anthropic-dangerous-direct-browser-access: true
                       ▼
┌──────────────────────────────────────────────────────┐
│                   Anthropic API                       │
│  - claude-sonnet-4-20250514                           │
│  - tool_use: submit_compliance_analysis               │
│  - Returns structured JSON via toolUseBlock.input     │
└──────────────────────────────────────────────────────┘
```

**Privacy**: your API key never leaves your browser. No proxy, no server, no logging. Verify in DevTools → Network: the only outbound call is directly to `api.anthropic.com`.

**Why BYOK?** Two reasons: (1) it eliminates server-side cost exposure for the project owner; (2) it is a deliberate architectural signal — cost awareness and security-by-design are standard considerations in production AI systems.

---

## Tool Use Output (Phase 3.1)

v2 uses Claude's native `tool_use` API to guarantee structured output. The analysis is returned as a validated JSON object via `toolUseBlock.input` — no JSON parsing, no fragility.

```js
// API call forces tool_use response
body: JSON.stringify({
  model: "claude-sonnet-4-20250514",
  max_tokens: 4000,
  tools: [COMPLIANCE_TOOL],          // full JSON Schema definition
  tool_choice: { type: "tool", name: "submit_compliance_analysis" },
  messages: [{ role: "user", content: userMessage }],
})

// Response parsing — no JSON.parse needed
const toolUseBlock = data.content.find((b) => b.type === "tool_use");
return toolUseBlock.input;  // always a valid JS object
```

---

## PDF Export (Phase 3.2)

Client-side PDF export via jsPDF (UMD build). The export button appears in the result view and triggers a full document generation in the browser — no server call required.

```js
// jsPDF loaded via UMD script tag — avoids @babel/runtime resolution errors
if (!window.jspdf) {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  document.head.appendChild(script);
  await new Promise((resolve) => { script.onload = resolve; });
}
const { jsPDF } = window.jspdf;
```

**Note for contributors**: always use the UMD build from cdnjs. The ES module build from jsDelivr fails in browser due to unresolved `@babel/runtime` dependencies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| AI Engine | Claude Sonnet (claude-sonnet-4-20250514) |
| API Pattern | BYOK — direct browser → api.anthropic.com |
| Output Format | Native tool_use (JSON Schema validated) |
| PDF Export | jsPDF 2.5.1 (UMD, client-side) |
| Hosting | Vercel (Hobby — free tier) |
| Fonts | DM Mono + Playfair Display (Google Fonts) |

---

## How to Get an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an account
2. Navigate to **API Keys** and generate a new key (name it `eu-ai-tool` for easy revocation)
3. Set a monthly spending limit under **Settings → Limits** to cap costs
4. Each analysis call costs approximately **$0.02–$0.05** depending on answer length

---

## How to Run Locally

```bash
git clone https://github.com/marco-pianese/eu-ai-compliance-tool-v2
cd eu-ai-compliance-tool-v2
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. No environment variables needed — the API key is entered at runtime in the gate UI.

---

## How to Deploy Your Own Instance

1. Fork the repository on GitHub
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Deploy — Vercel will automatically detect the Vite framework
5. No environment variables required (BYOK — key lives in the browser, not on the server)

Every subsequent `git push` to `main` triggers an automatic redeploy.

---

## How to Extend the Knowledge Base

To add or modify EU AI Act articles, edit `src/data/articles.js`. Each article follows this structure:

```js
artXX: {
  id: "artXX",
  number: "Article XX",
  title: "Article Title",
  applicationDate: "YYYY-MM-DD",
  status: "IN_FORCE | UPCOMING",
  source: "https://eur-lex.europa.eu/...",
  summary: "Plain-language summary of the article",
  keyObligations: [
    "Obligation 1",
    "Obligation 2",
  ],
  riskIfNonCompliant: "Fine / penalty description",
}
```

Then add the article ID to the relevant tier array in `ARTICLES_BY_TIER` (not `ARTICLES_BY_PROFILE`, which is kept for backwards compatibility only).

---

## Project Structure

```
eu-ai-compliance-tool-v2/
├── src/
│   ├── App.jsx             # Main application — UI, logic, API call, PDF export
│   ├── main.jsx            # React entry point
│   └── data/
│       └── articles.js     # EU AI Act knowledge base (23 articles + GPAI)
├── index.html              # HTML shell
├── package.json
├── vite.config.js
└── README.md
```

---

## Roadmap

| Phase | Description | Status |
|---|---|---|
| 1.1 | 5-question intake form | ✅ Done |
| 1.2 | Client-side risk pre-classification | ✅ Done |
| 1.3 | Session continuity via sessionStorage | ✅ Done |
| 2.1 | Full corpus: 23 articles + GPAI Art. 51–55 | ✅ Done |
| 2.2 | Client-side filter + token budget + GPAI showcase | ✅ Done |
| 3.1 | Tool use output: replace JSON prompt with tool_use | ✅ Done |
| 3.2 | PDF export: client-side via jsPDF | ✅ Done |
| 3.3 | Score calibration: system prompt tuning + 3×3 matrix | ✅ Done |
| 2.3 | Hybrid RAG: Supabase pgvector + Voyage AI | 🔲 Backlog |
| 4.1 | Eval framework: 9-scenario test suite + README | 🔲 Backlog |
| 4.2 | README v2 + LinkedIn post | 🔲 Backlog |

---

## Regulatory Source

All analysis is grounded in the official text of the EU Artificial Intelligence Act:

**Regulation (EU) 2024/1689 of the European Parliament and of the Council**
Published in the Official Journal of the European Union on July 12, 2024.

→ [Full text on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)

---

*Built as an applied AI consulting portfolio project — v2, June 2026*
*Author: Marco Pianese · [LinkedIn](https://www.linkedin.com/in/marco-pianese-40b3901b6/) · [GitHub](https://github.com/marco-pianese)*
