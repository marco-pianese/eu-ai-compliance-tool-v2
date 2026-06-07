# Eval Framework · EU AI Compliance Tool v2

## Overview

This directory contains the Phase 4.1 evaluation framework for the EU AI Compliance Tool v2.
It provides a reproducible test protocol to verify system behaviour — scoring calibration,
tier classification, and monotonicity — after any change to the system prompt, article corpus,
or scoring logic.

---

## Files

| File | Purpose |
|---|---|
| `scenarios.js` | 20 canonical test scenarios with inputs and expected outputs |
| `run-eval.mjs` | Node.js runner — calls the live API and evaluates pass/fail |
| `README-eval.md` | This document |

---

## Prerequisites

- Node.js 18+ (for native `fetch` and ES module support)
- An Anthropic API key (`sk-ant-...`) with available credits
- The `eu-ai-compliance-tool-v2` repo cloned locally (runner imports from `../src/data/articles.js`)

---

## Usage

Run from the repository root:

```bash
# Full suite — 20 scenarios (~2 min, ~$0.30–0.50)
node eval/run-eval.mjs --key sk-ant-YOUR_KEY_HERE

# Smoke test — Group A only, 9 scenarios (~1 min, ~$0.15)
node eval/run-eval.mjs --key sk-ant-YOUR_KEY_HERE --smoke

# Specific group
node eval/run-eval.mjs --key sk-ant-YOUR_KEY_HERE --group B

# Specific scenarios
node eval/run-eval.mjs --key sk-ant-YOUR_KEY_HERE --id A3,D1,E2

# Save results to JSON
node eval/run-eval.mjs --key sk-ant-YOUR_KEY_HERE --out eval/results-latest.json

# Custom delay between calls (default: 2000ms)
node eval/run-eval.mjs --key sk-ant-YOUR_KEY_HERE --delay 3000
```

---

## Pass/Fail Criteria

A scenario **passes** if all three conditions hold:

1. **Tier match** — `inferRiskTier()` returns the expected risk tier
2. **Score in range** — `complianceScore` falls within `[expectedScoreRange[0], expectedScoreRange[1]]`
3. **Readiness label match** — `overallReadiness` matches the expected label

Additionally, after every Group A run, the runner automatically checks **monotonicity**:
within each tier (HIGH, LIMITED, GPAI), the three input-richness levels must produce
strictly increasing scores: `minimo < medio < completo`.

---

## The 20 Scenarios

### Group A — Calibration Matrix 3×3 (9 scenarios)

The original calibration matrix verified in Session 5. Run after every system prompt change.

| ID | Tier | Input | Expected Score | Expected Readiness |
|---|---|---|---|---|
| A1 | HIGH | Minimo (Q1–Q3) | 5–20 | NOT_COMPLIANT |
| A2 | HIGH | Medio (Q1–Q5 parziali) | 35–50 | PARTIALLY_COMPLIANT |
| A3 | HIGH | Completo (Q1–Q5 dettagliati) | 62–78 | LARGELY_COMPLIANT |
| A4 | LIMITED | Minimo (Q1–Q3) | 15–25 | NOT_COMPLIANT |
| A5 | LIMITED | Medio (Q1–Q5 parziali) | 35–55 | PARTIALLY_COMPLIANT |
| A6 | LIMITED | Completo (Q1–Q5 dettagliati) | 65–80 | LARGELY_COMPLIANT |
| A7 | GPAI | Minimo (Q1–Q3) | 10–20 | NOT_COMPLIANT |
| A8 | GPAI | Medio (Q1–Q5 parziali) | 35–50 | PARTIALLY_COMPLIANT |
| A9 | GPAI | Completo (Q1–Q5 dettagliati) | 60–75 | LARGELY_COMPLIANT |

### Group B — Tier Boundary Cases (4 scenarios)

Ambiguous inputs that sit on the boundary between tiers. Verifies `inferRiskTier()` produces
consistent classification for edge cases.

| ID | Description | Expected Tier | Expected Score |
|---|---|---|---|
| B1 | Medical chatbot (LIMITED vs HIGH) | LIMITED | 20–45 |
| B2 | HR recommendation engine (HIGH vs LIMITED) | LIMITED | 25–50 |
| B3 | Student dropout prediction (HIGH vs MINIMAL) | HIGH | 30–55 |
| B4 | Deepfake detection tool (LIMITED vs MINIMAL) | LIMITED | 30–55 |

### Group C — GPAI Edge Cases (3 scenarios)

Tests GPAI-specific routing logic, including keyword detection in mixed or buried contexts.

| ID | Description | Expected Tier | Expected Score |
|---|---|---|---|
| C1 | Foundation model fine-tuned for legal use | GPAI | 25–50 |
| C2 | Marketing platform with buried LLM mention | GPAI | 20–45 |
| C3 | GPAI minimal input, no documentation | GPAI | 5–20 |

### Group D — Score Boundary Cases (2 scenarios)

Verifies floor and ceiling of the scoring system.

| ID | Description | Expected Tier | Expected Score | Expected Readiness |
|---|---|---|---|---|
| D1 | Credit scoring with full compliance stack | HIGH | 82–95 | COMPLIANT |
| D2 | Recruitment AI, zero compliance, no human review | HIGH | 5–20 | NOT_COMPLIANT |

### Group E — Input Stress Tests (2 scenarios)

Verifies parser and tool_use robustness under non-standard inputs.

| ID | Description | Expected Tier | Expected Score |
|---|---|---|---|
| E1 | Monosyllabic inputs across all 5 questions | HIGH | 5–35 |
| E2 | Full Italian-language inputs | HIGH | 35–65 |

---

## When to Run

| Trigger | Recommended suite |
|---|---|
| System prompt change (scoring rules, wording) | Smoke test (Group A) |
| Article corpus change (new articles, updated summaries) | Smoke test (Group A) |
| `inferRiskTier()` or `deriveArticleIds()` logic change | Groups A + B + C |
| Before a significant public release | Full suite (all 20) |
| Periodic quality check (monthly) | Smoke test (Group A) |

---

## Interpreting Results

**All green, monotonicity OK** — system behaviour is stable. Safe to deploy.

**Score out of range, readiness matches** — scoring drift, likely caused by system prompt
change or model update. Re-run Group A and inspect which tier regressed.

**Tier mismatch** — keyword logic in `inferRiskTier()` may have changed or inputs have
edge cases not covered. Review `inferRiskTier()` keyword arrays.

**Monotonicity violation** — a more detailed input scored lower than a less detailed one
within the same tier. This was the bug fixed in Session 5 for LIMITED medio/completo.
Re-apply the deployment signal rule in the system prompt (`+8 pts for live EU systems`).

**Group E failure (tool_use not returned)** — parser regression. Verify `tool_choice`
is still `{ type: "tool", name: "submit_compliance_analysis" }` in `runGapAnalysis()`.

---

## Cost Estimate

| Suite | Scenarios | Estimated cost |
|---|---|---|
| Smoke test (Group A) | 9 | ~$0.15 |
| Full suite | 20 | ~$0.30–0.50 |

Based on `claude-sonnet-4-20250514` pricing at $3/MTok input, $15/MTok output.
Actual cost varies with input richness and article count per tier.

