#!/usr/bin/env node
// ─── EU AI Compliance Tool v2 · Eval Runner ──────────────────────────────────
// Phase 4.1 — Automated eval framework
//
// Usage:
//   node eval/run-eval.mjs --key sk-ant-...
//   node eval/run-eval.mjs --key sk-ant-... --group A
//   node eval/run-eval.mjs --key sk-ant-... --id A3,D1
//   node eval/run-eval.mjs --key sk-ant-... --smoke   (runs group A only, 9 scenarios)
//
// Options:
//   --key     Anthropic API key (required)
//   --group   Run only a specific group: A, B, C, D, E
//   --id      Run specific scenario IDs (comma-separated, e.g. A3,D1,E2)
//   --smoke   Alias for --group A (9-scenario fast check)
//   --delay   Milliseconds between API calls (default: 2000)
//   --out     Path to write JSON results (optional, e.g. eval/results-latest.json)

import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load scenarios ───────────────────────────────────────────────────────────
const { SCENARIOS } = await import("./scenarios.js");

// ─── Load articles (same source as App.jsx) ───────────────────────────────────
const { ARTICLES, ARTICLES_BY_TIER } = await import("../src/data/articles.js");

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);

function getArg(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

function hasFlag(name) {
  return args.includes(name);
}

const apiKey = getArg("--key");
if (!apiKey) {
  console.error("ERROR: --key is required. Usage: node eval/run-eval.mjs --key sk-ant-...");
  process.exit(1);
}

const filterGroup = getArg("--group");
const filterIds   = getArg("--id")?.split(",").map(s => s.trim());
const smokeMode   = hasFlag("--smoke");
const delayMs     = parseInt(getArg("--delay") || "2000", 10);
const outPath     = getArg("--out");

// ─── Filter scenarios ─────────────────────────────────────────────────────────
let scenariosToRun = SCENARIOS;
if (smokeMode)       scenariosToRun = SCENARIOS.filter(s => s.group === "A");
else if (filterIds)  scenariosToRun = SCENARIOS.filter(s => filterIds.includes(s.id));
else if (filterGroup) scenariosToRun = SCENARIOS.filter(s => s.group === filterGroup);

if (scenariosToRun.length === 0) {
  console.error("ERROR: No scenarios matched the provided filter.");
  process.exit(1);
}

// ─── Replicate inferRiskTier() from App.jsx ───────────────────────────────────
function inferRiskTier(answers) {
  const text = Object.values(answers).join(" ").toLowerCase();

  const prohibitedKeywords = [
    "social scoring", "social credit", "emotion recognition workplace",
    "biometric categorisation", "predictive policing", "subliminal",
    "manipulate behavior", "exploit vulnerability",
  ];
  const highRiskKeywords = [
    "recruitment", "hiring", "cv screening", "candidate", "employment",
    "credit scoring", "loan", "insurance", "medical", "health", "diagnosis",
    "education", "exam", "student", "school", "critical infrastructure",
    "border control", "migration", "asylum", "law enforcement", "police",
    "judicial", "court", "biometric", "facial recognition",
    // Italian equivalents
    "reclutamento", "assunzione", "selezione del personale", "selezione candidati",
    "candidato", "candidati", "curriculum", "punteggio credito", "prestito",
    "assicurazione", "medico", "salute", "diagnosi", "istruzione", "esame",
    "studente", "studenti", "scuola", "infrastruttura critica",
    "controllo frontiere", "migrazione", "forze dell'ordine", "polizia",
    "tribunale", "riconoscimento facciale",
  ];
  const limitedKeywords = [
    "chatbot", "virtual assistant", "conversational ai", "conversational assistant",
    "customer service", "recommendation system", "recommends", "suggests relevant",
    "deepfake", "generated content", "synthetic",
    // Italian equivalents
    "assistente virtuale", "assistente conversazionale", "servizio clienti",
    "sistema di raccomandazione", "contenuto generato", "sintetico",
  ];

  // Strong LIMITED signals: conversational/content tools that override HIGH
  const strongLimitedSignals = [
    "chatbot", "conversational ai", "conversational assistant",
    "virtual assistant", "assistente virtuale", "assistente conversazionale",
    "recommendation system", "suggests relevant", "sistema di raccomandazione",
    "deepfake", "generated content", "contenuto generato",
  ];

  const gpaiKeywords = [
    "general purpose", "foundation model", "gpai", "large language model",
    "llm", "base model", "pretrained model",
    // Italian equivalents
    "modello di uso generale", "modello fondazionale", "modello linguistico",
  ];

  const isProhibited    = prohibitedKeywords.some(k => text.includes(k));
  const isHighRisk      = highRiskKeywords.some(k => text.includes(k));
  const isGpai          = gpaiKeywords.some(k => text.includes(k));
  const isLimited       = limitedKeywords.some(k => text.includes(k));
  const isStrongLimited = strongLimitedSignals.some(k => text.includes(k));

  if (isProhibited) return "UNACCEPTABLE";
  // Strong LIMITED signals override HIGH (e.g. medical chatbot → LIMITED)
  if (isHighRisk && !isStrongLimited) return "HIGH";
  if (isGpai)       return "GPAI";
  if (isLimited)    return "LIMITED";
  if (isHighRisk)   return "HIGH";
  return "MINIMAL";
}

// ─── Replicate deriveArticleIds() from App.jsx ────────────────────────────────
function deriveArticleIds(riskTier, answers = {}) {
  const text = Object.values(answers).join(" ").toLowerCase();
  const isGpai = [
    "general purpose", "foundation model", "gpai", "large language model",
    "llm", "base model", "pretrained model",
  ].some(k => text.includes(k));

  const ids = [...(ARTICLES_BY_TIER[riskTier] || ARTICLES_BY_TIER.MINIMAL)];
  if (isGpai) {
    ARTICLES_BY_TIER.GPAI.forEach(id => { if (!ids.includes(id)) ids.push(id); });
  }
  return ids;
}

// ─── System prompt (exact copy from App.jsx runGapAnalysis) ──────────────────
const SYSTEM_PROMPT = `You are a senior EU AI Act compliance expert with deep legal and technical expertise.
Perform a structured gap analysis of the AI system described against specific EU AI Act articles.

The user has provided a structured intake describing their system across five dimensions:
1. What the system does
2. Who is affected by its outputs
3. What data it processes or was trained on
4. What documentation and governance already exists
5. Where and how it is deployed

Base every finding directly and specifically on the information provided. Do not make generic statements — reference the actual system described.

complianceScore mapping:
- NOT_COMPLIANT = 5–20 (no documentation, no oversight, active violations)
- PARTIALLY_COMPLIANT = 35–55 (some practices exist but major formal gaps remain)
- LARGELY_COMPLIANT = 62–78 (solid foundations, minor procedural gaps)
- COMPLIANT = 82–95 (full documentation, QMS, conformity assessment complete)

Scoring rules — apply these strictly:
1. Score floors by input richness: if Q4 and Q5 are both blank, score may fall in 5–30. If Q4 or Q5 contain any documented measures, score must be at least 30. If both Q4 and Q5 describe multiple concrete practices, score must be at least 40. ADDITIONAL FLOOR FOR HIGH AND GPAI TIER: if the system is HIGH or GPAI risk and Q4 or Q5 contain any documented measures (even partial), score must be at least 35. This reflects the higher baseline obligations for these tiers.
2. Reward declared evidence: treat each of the following as a positive signal worth +5–8 points above tier floor: formal risk assessment, bias testing, human override/escalation, audit logging, transparency notice, data retention policy, conformity assessment (initiated or complete), incident reporting pipeline, copyright policy, adversarial testing. CEILING FOR GPAI TIER: even with full documentation across all signals, score must not exceed 75 for GPAI systems unless a systemic risk assessment is explicitly described as complete — GPAI systems face inherent regulatory uncertainty on the 10^25 FLOPs systemic risk threshold.
3. Monotonicity guarantee: a response with more documented practices than a previous scenario must always score higher. Never assign the same score to minimal and complete inputs for the same system type.
4. Penalise only what is absent: do not penalise for gaps that the user did not claim to have filled. Score what exists, not what is missing.
5. Reserve scores below 20 for systems with zero compliance measures or active prohibited practices.
6. Language independence: evaluate and classify the system based on its described characteristics regardless of the language used in the input. An AI system described in Italian must receive the same tier classification and scoring as an equivalent description in English.
7. overallReadiness MUST match complianceScore exactly — use this mandatory mapping: score 0–20 → NOT_COMPLIANT; score 21–61 → PARTIALLY_COMPLIANT; score 62–78 → LARGELY_COMPLIANT; score 79–100 → COMPLIANT. Never assign a readiness label that contradicts the score.

Use the submit_compliance_analysis tool to return your structured findings.`;

// ─── Tool schema (exact copy from App.jsx) ───────────────────────────────────
const COMPLIANCE_TOOL = {
  name: "submit_compliance_analysis",
  description: "Submit the structured EU AI Act compliance gap analysis result.",
  input_schema: {
    type: "object",
    properties: {
      classification: {
        type: "object",
        properties: {
          systemType:      { type: "string" },
          riskCategory:    { type: "string", enum: ["UNACCEPTABLE", "HIGH", "LIMITED", "MINIMAL", "GPAI"] },
          riskRationale:   { type: "string" },
          sector:          { type: "string" },
          affectedPersons: { type: "string" },
        },
        required: ["systemType", "riskCategory", "riskRationale", "sector", "affectedPersons"],
      },
      complianceScore:  { type: "integer", minimum: 0, maximum: 100 },
      overallReadiness: { type: "string", enum: ["NOT_COMPLIANT", "PARTIALLY_COMPLIANT", "LARGELY_COMPLIANT", "COMPLIANT"] },
      executiveSummary: { type: "string" },
      gaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            articleId:       { type: "string" },
            articleNumber:   { type: "string" },
            gapLevel:        { type: "string", enum: ["HIGH", "MEDIUM", "LOW", "NONE"] },
            gapTitle:        { type: "string" },
            gapDescription:  { type: "string" },
            estimatedEffort: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
                  action:   { type: "string" },
                  deadline: { type: "string", enum: ["IMMEDIATE", "BEFORE_2026-08-02", "ONGOING"] },
                },
                required: ["priority", "action", "deadline"],
              },
            },
          },
          required: ["articleId", "articleNumber", "gapLevel", "gapTitle", "gapDescription", "estimatedEffort", "actions"],
        },
      },
      priorityActions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
            action:   { type: "string" },
            deadline: { type: "string", enum: ["IMMEDIATE", "BEFORE_2026-08-02", "ONGOING"] },
          },
          required: ["priority", "action", "deadline"],
        },
      },
      redFlags: { type: "array", items: { type: "string" } },
    },
    required: ["classification", "complianceScore", "overallReadiness", "executiveSummary", "gaps", "priorityActions", "redFlags"],
  },
};

// ─── Run a single scenario ────────────────────────────────────────────────────
async function runScenario(scenario) {
  const { answers } = scenario;

  const riskTier   = inferRiskTier(answers);
  const articleIds = deriveArticleIds(riskTier, answers);
  const articles   = articleIds.map(id => ARTICLES[id]).filter(Boolean);

  const userMessage = `AI System Intake:

1. What the system does:
"${answers.systemDescription}"

2. Who is directly affected:
"${answers.affectedPersons || "Not specified"}"

3. Data processed or used for training:
"${answers.dataSources || "Not specified"}"

4. Existing documentation and governance:
"${answers.existingDocs || "None described"}"

5. Deployment context:
"${answers.deploymentContext || "Not specified"}"

Analyze against these EU AI Act articles:
${articles.map(a => `
${a.number} — ${a.title}
Summary: ${a.summary}
Key Obligations: ${a.keyObligations.join("; ")}
Application Date: ${a.applicationDate}
`).join("\n---\n")}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      tools: [COMPLIANCE_TOOL],
      tool_choice: { type: "tool", name: "submit_compliance_analysis" },
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`API error ${response.status}: ${err.error?.message || "unknown"}`);
  }

  const data = await response.json();
  const toolBlock = data.content.find(b => b.type === "tool_use");
  if (!toolBlock) throw new Error("No tool_use block in response");

  return {
    inferredTier: riskTier,
    articlesCount: articleIds.length,
    result: toolBlock.input,
    usage: data.usage,
  };
}

// ─── Evaluate a single result against expectations ───────────────────────────
function evaluate(scenario, inferredTier, result) {
  const score     = result.complianceScore;
  const readiness = result.overallReadiness;
  const apiTier   = result.classification.riskCategory;

  const [lo, hi]   = scenario.expectedScoreRange;
  const scorePass  = score >= lo && score <= hi;
  const tierPass   = inferredTier === scenario.expectedTier;
  const readyPass  = readiness === scenario.expectedReadiness;
  const pass       = scorePass && tierPass && readyPass;

  return {
    pass,
    scorePass,
    tierPass,
    readyPass,
    score,
    readiness,
    inferredTier,
    apiTier,
    expectedTier: scenario.expectedTier,
    expectedScoreRange: scenario.expectedScoreRange,
    expectedReadiness: scenario.expectedReadiness,
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────
const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";

function pad(str, len) { return String(str).padEnd(len); }

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}EU AI Compliance Tool v2 — Eval Runner${RESET}`);
console.log(`${DIM}Phase 4.1 · ${scenariosToRun.length} scenario(s) · delay ${delayMs}ms between calls${RESET}\n`);
console.log(`${pad("ID",4)} ${pad("DESCRIPTION",52)} ${pad("TIER",8)} ${pad("SCORE",7)} ${pad("READINESS",22)} RESULT`);
console.log("─".repeat(110));

const results = [];
let passed = 0;
let failed = 0;

for (let i = 0; i < scenariosToRun.length; i++) {
  const scenario = scenariosToRun[i];
  process.stdout.write(`${pad(scenario.id,4)} ${pad(scenario.description.slice(0,51),52)} `);

  try {
    const { inferredTier, result } = await runScenario(scenario);
    const ev = evaluate(scenario, inferredTier, result);

    const tierStr    = ev.tierPass    ? `${GREEN}${pad(ev.inferredTier,8)}${RESET}` : `${RED}${pad(ev.inferredTier,8)}${RESET}`;
    const scoreStr   = ev.scorePass   ? `${GREEN}${pad(ev.score,7)}${RESET}`        : `${RED}${pad(ev.score,7)}${RESET}`;
    const readyStr   = ev.readyPass   ? `${GREEN}${pad(ev.readiness,22)}${RESET}`   : `${RED}${pad(ev.readiness,22)}${RESET}`;
    const resultStr  = ev.pass        ? `${GREEN}${BOLD}PASS${RESET}`               : `${RED}${BOLD}FAIL${RESET}`;

    console.log(`${tierStr} ${scoreStr} ${readyStr} ${resultStr}`);

    if (!ev.pass) {
      if (!ev.tierPass)  console.log(`     ${YELLOW}! Tier: got ${ev.inferredTier}, expected ${ev.expectedTier}${RESET}`);
      if (!ev.scorePass) console.log(`     ${YELLOW}! Score: got ${ev.score}, expected ${ev.expectedScoreRange[0]}–${ev.expectedScoreRange[1]}${RESET}`);
      if (!ev.readyPass) console.log(`     ${YELLOW}! Readiness: got ${ev.readiness}, expected ${ev.expectedReadiness}${RESET}`);
    }

    results.push({ id: scenario.id, group: scenario.group, description: scenario.description, ...ev });
    ev.pass ? passed++ : failed++;

  } catch (err) {
    console.log(`${RED}ERROR: ${err.message}${RESET}`);
    results.push({ id: scenario.id, group: scenario.group, description: scenario.description, pass: false, error: err.message });
    failed++;
  }

  // Rate limit delay (skip after last scenario)
  if (i < scenariosToRun.length - 1) {
    await new Promise(r => setTimeout(r, delayMs));
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(110));
console.log(`\n${BOLD}Results: ${GREEN}${passed} passed${RESET}${BOLD} · ${RED}${failed} failed${RESET}${BOLD} · ${scenariosToRun.length} total${RESET}`);

// Per-group breakdown
const groups = [...new Set(results.map(r => r.group))].sort();
if (groups.length > 1) {
  console.log(`\n${DIM}Group breakdown:${RESET}`);
  for (const g of groups) {
    const groupResults = results.filter(r => r.group === g);
    const gPass = groupResults.filter(r => r.pass).length;
    const color = gPass === groupResults.length ? GREEN : RED;
    console.log(`  Group ${g}: ${color}${gPass}/${groupResults.length}${RESET}`);
  }
}

// Monotonicity check for groups A (same tier, increasing input)
console.log(`\n${DIM}Monotonicity check (Group A — same tier, increasing input):${RESET}`);
const monoChecks = [
  ["A1","A2","A3","HIGH"],
  ["A4","A5","A6","LIMITED"],
  ["A7","A8","A9","GPAI"],
];
for (const [minId, medId, maxId, tier] of monoChecks) {
  const min = results.find(r => r.id === minId);
  const med = results.find(r => r.id === medId);
  const max = results.find(r => r.id === maxId);
  if (min && med && max && !min.error && !med.error && !max.error) {
    const mono = min.score < med.score && med.score < max.score;
    const color = mono ? GREEN : RED;
    console.log(`  ${tier}: ${min.score} < ${med.score} < ${max.score} → ${color}${mono ? "OK" : "VIOLATION"}${RESET}`);
  } else {
    console.log(`  ${tier}: ${DIM}skipped (not all scenarios ran or errored)${RESET}`);
  }
}

console.log();

// ─── Write JSON output if --out specified ─────────────────────────────────────
if (outPath) {
  const output = {
    runAt: new Date().toISOString(),
    scenariosRun: scenariosToRun.length,
    passed,
    failed,
    results,
  };
  writeFileSync(join(__dirname, "..", outPath), JSON.stringify(output, null, 2));
  console.log(`${DIM}Results written to ${outPath}${RESET}\n`);
}

process.exit(failed > 0 ? 1 : 0);

