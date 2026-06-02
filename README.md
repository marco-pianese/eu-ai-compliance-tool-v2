# EU AI Compliance Tool — v1

**Automated Gap Analysis · Regulation (EU) 2024/1689 — EU AI Act**

→ **[Live Demo](https://eu-ai-compliance-tool-omega.vercel.app)**

> **This is v1 — a functional baseline.** The architecture and knowledge base are intentionally kept simple to validate the core concept. A v2 with RAG-based knowledge retrieval, richer article coverage, and free-form system description is in active development.

---

## Overview

This is an **educational portfolio project** exploring the intersection of applied AI and regulatory compliance. It was built to demonstrate how large language models can be used to structure and automate complex legal analysis tasks — in this case, compliance assessment against the EU Artificial Intelligence Act (Regulation EU 2024/1689).

The tool allows anyone to describe an AI system in plain language and receive a structured gap analysis in seconds, including a compliance score, prioritized action plan, and article-by-article breakdown — output that would typically require hours of manual legal and technical review.

> **Disclaimer**: This tool is intended for educational and portfolio purposes only. It does not constitute legal advice. For formal EU AI Act compliance assessments, always consult qualified legal counsel.

---

## What it does

The user selects a profile, describes their AI system in plain language, and receives a full compliance report structured in three sections:

### Section 1 — Executive Dashboard
- **Compliance Score** (0–100) displayed as an animated gauge
- **Overall Readiness** label: Non-Compliant / Partially Compliant / Largely Compliant / Compliant
- **Risk Classification**: category, sector, affected persons, risk rationale
- **Executive Summary**: 3–4 sentence synthesis of the compliance posture
- **Critical Red Flags**: immediate blockers requiring urgent attention

### Section 2 — Priority Action Plan
- All required actions sorted by criticality (HIGH → MEDIUM → LOW)
- Each action includes a priority badge and deadline (Immediate / Before Aug 2026 / Ongoing)
- Designed to be directly actionable for compliance teams

### Section 3 — Article-by-Article Analysis
- Collapsible cards for each relevant EU AI Act article
- Each card shows: gap level, gap description, required actions, official EUR-Lex source link

---

## User Profiles

The analysis is tailored to three distinct use cases:

| Profile | Who it's for | Focus |
|---|---|---|
| **Compliance Officer** | Organizations with internal AI systems | Internal gaps and remediation roadmap |
| **AI Vendor** | Companies building AI products for the EU market | Certification requirements and go-to-market blockers |
| **Procurement / Buyer** | Organizations evaluating AI purchases | Supplier risk and due diligence requirements |

---

## EU AI Act Articles Covered

| Article | Topic | Status |
|---|---|---|
| **Art. 5** | Prohibited AI Practices | ✅ In force since Feb 2, 2025 |
| **Art. 6 + Annex III** | High-Risk AI System Classification | Applies Aug 2, 2026 |
| **Art. 9** | Risk Management System | Applies Aug 2, 2026 |
| **Art. 10** | Data and Data Governance | Applies Aug 2, 2026 |
| **Art. 13** | Transparency and Information Provision | Applies Aug 2, 2026 |
| **Art. 14** | Human Oversight | Applies Aug 2, 2026 |
| **Art. 17** | Quality Management System | Applies Aug 2, 2026 |
| **Art. 99** | Penalties | Applies Aug 2, 2026 |

All article summaries and key obligations are stored in `src/data/articles.js`. In v2, this static knowledge base will be replaced by a RAG pipeline pulling from EUR-Lex directly, enabling automatic coverage of new articles and regulatory updates.

---

## Compliance Score Calibration

The scoring model was validated across 9 test scenarios covering all three profiles at low, medium, and high compliance levels:

| Compliance Level | Score Range | Example |
|---|---|---|
| 🔴 Low | 5–25 | Predictive policing software with no documentation |
| 🟡 Medium | 36–55 | Employee monitoring with basic docs but no formal QMS |
| 🟢 High | 62–78 | Medical imaging tool with full conformity assessment |

---

## Architecture — BYOK (Bring Your Own Key)

This tool uses a **BYOK architecture**: the user provides their own Anthropic API key, which is stored in the browser session only and used to call the Anthropic API directly. There is no server-side proxy and no backend.

```
┌─────────────────────────────────────────────────────┐
│                    Browser (React SPA)               │
│  - API key collected at gate UI                      │
│  - Key stored in sessionStorage (or localStorage)    │
│  - POST sent directly to api.anthropic.com           │
└──────────────────────┬──────────────────────────────┘
                       │ POST /v1/messages
                       │ headers: x-api-key (USER key)
                       │          anthropic-version
                       │          anthropic-dangerous-direct-browser-access: true
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Anthropic API                       │
│  - claude-sonnet-4-20250514                          │
│  - Returns structured JSON gap analysis              │
└─────────────────────────────────────────────────────┘
```

**Privacy claim**: your API key never leaves your browser. There is no proxy, no server, no logging. You can verify this yourself in DevTools → Network: the only outbound call is directly to `api.anthropic.com`.

**Why BYOK?** Two reasons: (1) it eliminates any server-side cost exposure for the project owner; (2) it is a deliberate architectural signal — cost awareness and security-by-design are considerations in production AI systems.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| AI Engine | Claude Sonnet (claude-sonnet-4-20250514) |
| API Pattern | BYOK — direct browser → api.anthropic.com |
| Hosting | Vercel (Hobby — free tier) |
| Fonts | DM Mono + Playfair Display (Google Fonts) |

---

## How to Get an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an account
2. Navigate to **API Keys** and generate a new key
3. Set a monthly spending limit to cap costs
4. Each analysis call costs approximately **$0.02–$0.05** with the current model and token settings

---

## How to Run Locally

```bash
git clone https://github.com/marco-pianese/eu-ai-compliance-tool-v1
cd eu-ai-compliance-tool-v1
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
5. No environment variables required (BYOK pattern — key lives in the browser, not on the server)

Every subsequent `git push` to `main` will trigger an automatic redeploy.

---

## How to Extend the Knowledge Base

To add or modify EU AI Act articles, edit `src/data/articles.js`. Each article follows this structure:

```js
art_XX: {
  id: "art_XX",
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
  riskIfNonCompliant: "Fine description",
  relevantProfiles: ["compliance", "vendor", "procurement"],
}
```

Then add the article ID to the relevant profile arrays in `ARTICLES_BY_PROFILE`.

---

## Project Structure

```
eu-ai-compliance-tool-v1/
├── src/
│   ├── App.jsx             # Main application — UI, logic, API call
│   ├── main.jsx            # React entry point
│   └── data/
│       └── articles.js     # EU AI Act knowledge base (static, v1)
├── index.html              # HTML shell
├── package.json
├── vite.config.js
└── README.md
```

---

## Roadmap — What v2 will address

The current v1 baseline has known limitations that v2 is designed to solve:

| Limitation (v1) | Planned solution (v2) |
|---|---|
| Articles hard-coded in a static JS file | RAG pipeline pulling from EUR-Lex API |
| No automatic update when new articles are published | Automated normative monitoring |
| Limited article coverage (8 articles) | Full EU AI Act coverage including GPAI (Art. 51–56) |
| Profile-based input only | Free-form system description with guided questions |
| No export | PDF gap report export |

---

## Regulatory Source

All analysis is grounded in the official text of the EU Artificial Intelligence Act:

**Regulation (EU) 2024/1689 of the European Parliament and of the Council**
Published in the Official Journal of the European Union on July 12, 2024.

→ [Full text on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)

---

*Built as an applied AI consulting portfolio project — v1, May 2026*
*Author: Marco Pianese · [LinkedIn](https://www.linkedin.com/in/marco-pianese-40b3901b6/) · [GitHub](https://github.com/marco-pianese)*
