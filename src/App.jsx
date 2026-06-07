import { useState, useEffect } from "react";
import { ARTICLES, EU_AI_ACT_META, ARTICLES_BY_TIER } from "./data/articles.js";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  surfaceHover: "#F0F2F5",
  border: "#DDE2EC",
  borderLight: "#C8D0DF",
  gold: "#8B6914",
  goldLight: "#A07820",
  goldFaint: "rgba(139,105,20,0.08)",
  text: "#111827",
  textSub: "#374151",
  textMuted: "#6B7280",
  red: "#B91C1C",
  redFaint: "rgba(185,28,28,0.07)",
  amber: "#B45309",
  amberFaint: "rgba(180,83,9,0.07)",
  blue: "#1D4ED8",
  blueFaint: "rgba(29,78,216,0.07)",
  green: "#166534",
  greenFaint: "rgba(22,101,52,0.07)",
};

// ─── Intake Questions ─────────────────────────────────────────────────────────
const INTAKE_QUESTIONS = [
  {
    id: "systemDescription",
    label: "01 — What does your AI system do?",
    sublabel: "Describe its main function, what it decides or predicts, and how it's used.",
    placeholder: "E.g.: 'We use a machine learning model that analyses CV text and assigns a ranked score to job candidates. HR teams use the score to shortlist applicants for interviews.'",
    required: true,
    minLength: 30,
    multiline: true,
  },
  {
    id: "affectedPersons",
    label: "02 — Who is directly affected by the system's outputs?",
    sublabel: "Think about who receives a decision, recommendation, or classification from the system.",
    placeholder: "E.g.: 'Job applicants across EU member states, including vulnerable groups such as people with disabilities or from minority ethnic backgrounds.'",
    required: true,
    minLength: 10,
    multiline: false,
  },
  {
    id: "dataSources",
    label: "03 — What data does the system process or was trained on?",
    sublabel: "Include personal data, sensitive categories, third-party datasets, or proprietary data.",
    placeholder: "E.g.: 'CV text, LinkedIn profiles, educational background, and historical hiring outcomes. Training set includes 5 years of past recruitment decisions.'",
    required: true,
    minLength: 10,
    multiline: false,
  },
  {
    id: "existingDocs",
    label: "04 — What documentation or governance processes already exist?",
    sublabel: "Include any technical docs, risk assessments, audits, GDPR measures, or human oversight processes — even informal ones.",
    placeholder: "E.g.: 'We have a GDPR Data Processing Agreement and basic technical documentation. No formal AI risk assessment or conformity assessment has been done yet.'",
    required: false,
    minLength: 0,
    multiline: false,
  },
  {
    id: "deploymentContext",
    label: "05 — Where and how is the system deployed?",
    sublabel: "Is it used internally, sold as a product, or integrated into a third-party platform? Is it already live in the EU?",
    placeholder: "E.g.: 'SaaS product sold to HR departments across Europe. Currently live in Italy, France, and Germany. Approx. 40 enterprise clients.'",
    required: false,
    minLength: 0,
    multiline: false,
  },
];

// ─── Risk Pre-Classification ──────────────────────────────────────────────────
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
  ];
  const limitedKeywords = [
    "chatbot", "virtual assistant", "customer service", "recommendation",
    "deepfake", "generated content", "synthetic",
  ];

  const isProhibited = prohibitedKeywords.some((k) => text.includes(k));
  const isHighRisk = highRiskKeywords.some((k) => text.includes(k));
  const isLimited = limitedKeywords.some((k) => text.includes(k));

  const gpaiKeywords = [
    "general purpose", "foundation model", "gpai", "large language model",
    "llm", "base model", "pretrained model",
  ];
  const isGpai = gpaiKeywords.some((k) => text.includes(k));

  if (isProhibited) return { tier: "UNACCEPTABLE", confidence: "HIGH", label: "Prohibited Practice", color: C.red };
  if (isHighRisk)   return { tier: "HIGH",          confidence: "HIGH", label: "High-Risk AI System", color: C.red };
  if (isGpai)       return { tier: "GPAI",           confidence: "MEDIUM", label: "General Purpose AI (GPAI)", color: C.blue };
  if (isLimited)    return { tier: "LIMITED",        confidence: "MEDIUM", label: "Limited Risk", color: C.amber };
  return                   { tier: "MINIMAL",        confidence: "LOW", label: "Minimal Risk (unconfirmed)", color: C.green };
}

function deriveArticleIds(riskTier, answers = {}) {
  const text = Object.values(answers).join(" ").toLowerCase();
  const isGpai = [
    "general purpose", "foundation model", "gpai", "large language model",
    "llm", "base model", "pretrained model",
  ].some((k) => text.includes(k));

  const ids = [...(ARTICLES_BY_TIER[riskTier] || ARTICLES_BY_TIER.MINIMAL)];
  if (isGpai) {
    ARTICLES_BY_TIER.GPAI.forEach((id) => { if (!ids.includes(id)) ids.push(id); });
  }
  return ids;
}

// ─── Showcase: pre-computed results ──────────────────────────────────────────
const SHOWCASE_RESULT = {
  classification: {
    systemType: "AI-Powered CV Screening & Candidate Ranking SaaS",
    riskCategory: "HIGH",
    riskRationale: "The system makes consequential decisions in employment recruitment, directly affecting individuals' access to job opportunities. Under Annex III of the EU AI Act, AI systems used for recruitment and candidate selection are explicitly listed as high-risk. The use of NLP to score and rank candidates creates significant potential for discriminatory outcomes.",
    sector: "Human Resources / Recruitment Technology",
    affectedPersons: "Job candidates and applicants across EU member states",
  },
  complianceScore: 74,
  overallReadiness: "LARGELY_COMPLIANT",
  executiveSummary: "The AI vendor demonstrates solid foundational compliance with the EU AI Act's high-risk requirements, including documented technical specifications, a GDPR Data Processing Agreement, and reference EU clients. However, formal gaps remain in bias documentation, conformity assessment procedures, and post-market monitoring. These are remediable within the August 2026 deadline with focused effort.",
  redFlags: [
    "No formal conformity assessment procedure initiated — mandatory for high-risk AI systems before EU market placement",
    "Bias and fairness testing documentation absent — critical given the system scores candidates across demographic groups",
  ],
  priorityActions: [
    { priority: "HIGH", action: "Initiate conformity assessment procedure per Article 43 — engage a notified body or complete self-assessment with full technical documentation package", deadline: "BEFORE_2026-08-02" },
    { priority: "HIGH", action: "Conduct and document bias/fairness testing across protected characteristics (gender, age, ethnicity) with quantitative results and mitigation measures", deadline: "BEFORE_2026-08-02" },
    { priority: "HIGH", action: "Register the AI system in the EU database for high-risk AI systems per Article 71 before commercial deployment", deadline: "BEFORE_2026-08-02" },
    { priority: "MEDIUM", action: "Implement post-market monitoring system with automated anomaly detection and periodic bias re-evaluation cadence", deadline: "ONGOING" },
    { priority: "MEDIUM", action: "Enhance human oversight controls — ensure recruiters can meaningfully override AI recommendations with documented escalation workflow", deadline: "BEFORE_2026-08-02" },
    { priority: "LOW", action: "Prepare candidate-facing transparency notices explaining AI use, logic, and right to human review per Article 13", deadline: "BEFORE_2026-08-02" },
  ],
  gaps: [
    { articleId: "art9", articleNumber: "Article 9", gapLevel: "HIGH", gapTitle: "Risk Management System Incomplete", gapDescription: "While the vendor has basic QMS documentation, there is no evidence of a continuous risk management system specifically addressing AI-related risks: bias propagation, data drift, adversarial inputs, and disparate impact across candidate demographics.", actions: [{ priority: "HIGH", action: "Establish a documented AI risk register with identified risks, likelihood, impact, and mitigation measures", deadline: "BEFORE_2026-08-02" }, { priority: "MEDIUM", action: "Implement automated monitoring to detect model drift and trigger re-evaluation cycles", deadline: "ONGOING" }], estimatedEffort: "HIGH" },
    { articleId: "art10", articleNumber: "Article 10", gapLevel: "HIGH", gapTitle: "Training Data Governance Gaps", gapDescription: "No documentation provided on training dataset composition, demographic representativeness, or data quality measures. For a system scoring candidates, the absence of dataset transparency is a critical compliance gap.", actions: [{ priority: "HIGH", action: "Document training data sources, composition, and demographic distribution; conduct representativeness audit", deadline: "BEFORE_2026-08-02" }, { priority: "HIGH", action: "Implement data quality processes including bias detection at the data pipeline level", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "HIGH" },
    { articleId: "art13", articleNumber: "Article 13", gapLevel: "MEDIUM", gapTitle: "Transparency to Deployers Partial", gapDescription: "Technical documentation exists but instructions for use lack sufficient detail on system limitations, known biases, and conditions under which the system may underperform.", actions: [{ priority: "MEDIUM", action: "Expand instructions for use to include known limitations, edge cases, and recommended human review triggers", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "LOW" },
    { articleId: "art14", articleNumber: "Article 14", gapLevel: "MEDIUM", gapTitle: "Human Oversight Controls Need Strengthening", gapDescription: "The system provides scores and rankings but the override mechanism for human reviewers is not formally documented. There is no logged audit trail of override decisions.", actions: [{ priority: "MEDIUM", action: "Implement and document human override workflow with mandatory logging of override decisions and rationale", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "MEDIUM" },
    { articleId: "art43", articleNumber: "Article 43", gapLevel: "HIGH", gapTitle: "Conformity Assessment Not Initiated", gapDescription: "No conformity assessment procedure has been initiated. For high-risk AI systems in employment, this is a mandatory pre-market requirement.", actions: [{ priority: "HIGH", action: "Initiate conformity assessment — determine self-assessment eligibility or identify applicable notified body", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "HIGH" },
    { articleId: "art17", articleNumber: "Article 17", gapLevel: "LOW", gapTitle: "Quality Management System Partially Documented", gapDescription: "Basic QMS exists covering standard software development practices. AI-specific quality processes are not yet formalized.", actions: [{ priority: "LOW", action: "Extend QMS to cover AI-specific lifecycle: model versioning policy, retraining triggers, performance threshold definitions", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "MEDIUM" },
    { articleId: "art72", articleNumber: "Article 72", gapLevel: "LOW", gapTitle: "Post-Market Monitoring Plan Missing", gapDescription: "No post-market monitoring plan documented. For high-risk AI, providers must proactively collect and review performance data.", actions: [{ priority: "MEDIUM", action: "Draft and implement a post-market monitoring plan with KPIs, review cadence, and incident reporting procedure", deadline: "ONGOING" }], estimatedEffort: "MEDIUM" },
  ],
};

const SHOWCASE_GPAI_RESULT = {
  classification: {
    systemType: "General Purpose Large Language Model — API Provider",
    riskCategory: "GPAI",
    riskRationale: "The system is a large language model made available via API to third-party developers and businesses. Under the EU AI Act, GPAI models are subject to specific obligations under Articles 51–55, including transparency to downstream providers, copyright policy disclosure, and — for models with systemic risk — additional adversarial testing and incident reporting requirements.",
    sector: "Artificial Intelligence / Foundation Model Infrastructure",
    affectedPersons: "Downstream developers, businesses integrating the model, and end users of downstream applications",
  },
  complianceScore: 58,
  overallReadiness: "PARTIALLY_COMPLIANT",
  executiveSummary: "The GPAI provider has established foundational technical infrastructure but lacks formal compliance documentation required under Articles 51–55 of the EU AI Act. Key gaps include absence of a published copyright policy, incomplete technical documentation for downstream integrators, and no documented systemic risk self-assessment. These gaps are remediable but require structured effort before the August 2026 deadline.",
  redFlags: [
    "No copyright and data provenance policy published — mandatory for all GPAI model providers under Article 53",
    "Systemic risk classification not assessed — models above 10^25 FLOPs threshold trigger additional obligations under Article 55",
  ],
  priorityActions: [
    { priority: "HIGH", action: "Publish a copyright policy documenting training data sources and compliance with EU copyright law per Article 53(1)(c)", deadline: "BEFORE_2026-08-02" },
    { priority: "HIGH", action: "Prepare and maintain technical documentation for downstream providers per Article 53(1)(a) — including model architecture, training data summary, capabilities and limitations", deadline: "BEFORE_2026-08-02" },
    { priority: "HIGH", action: "Conduct and document systemic risk self-assessment per Article 55 — determine if model meets the 10^25 FLOPs threshold and document the evaluation", deadline: "BEFORE_2026-08-02" },
    { priority: "MEDIUM", action: "Implement incident reporting mechanism for serious incidents caused by downstream use of the model per Article 55(1)(c)", deadline: "ONGOING" },
    { priority: "LOW", action: "Register model in EU GPAI model database once the registry is operational per Article 52", deadline: "ONGOING" },
  ],
  gaps: [
    { articleId: "art51", articleNumber: "Article 51", gapLevel: "MEDIUM", gapTitle: "GPAI Classification Not Formally Documented", gapDescription: "The provider has not formally self-classified the model under Article 51 categories. A documented classification is required to determine which obligations apply.", actions: [{ priority: "MEDIUM", action: "Complete formal GPAI classification assessment and document the outcome", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "LOW" },
    { articleId: "art52", articleNumber: "Article 52", gapLevel: "HIGH", gapTitle: "Technical Documentation for Downstream Providers Incomplete", gapDescription: "No structured technical documentation package exists for downstream API integrators. Article 52 requires providers to make available sufficient information for deployers to understand capabilities, limitations, and safe integration conditions.", actions: [{ priority: "HIGH", action: "Create and publish technical documentation package covering model capabilities, known limitations, recommended use cases, and misuse risks", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "MEDIUM" },
    { articleId: "art53", articleNumber: "Article 53", gapLevel: "HIGH", gapTitle: "Copyright Policy Not Published", gapDescription: "No publicly available copyright policy documenting training data sources and compliance measures. This is a hard requirement for all GPAI providers under Article 53(1)(c), regardless of systemic risk classification.", actions: [{ priority: "HIGH", action: "Draft and publish a copyright compliance policy covering training data provenance, opt-out mechanisms, and rights clearance procedures", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "MEDIUM" },
    { articleId: "art55", articleNumber: "Article 55", gapLevel: "MEDIUM", gapTitle: "Systemic Risk Assessment Pending", gapDescription: "No documented self-assessment of systemic risk threshold (10^25 FLOPs). If the model meets this threshold, additional obligations apply including adversarial testing, cybersecurity measures, and incident reporting.", actions: [{ priority: "HIGH", action: "Conduct and document systemic risk self-assessment; if threshold is met, initiate adversarial testing programme", deadline: "BEFORE_2026-08-02" }, { priority: "MEDIUM", action: "Establish incident monitoring and reporting pipeline for serious incidents in downstream deployments", deadline: "ONGOING" }], estimatedEffort: "HIGH" },
    { articleId: "art5", articleNumber: "Article 5", gapLevel: "LOW", gapTitle: "Prohibited Use Guardrails Present but Not Formally Documented", gapDescription: "The model likely has safety filters in place, but there is no formal documentation demonstrating that prohibited use cases are actively prevented at the API level.", actions: [{ priority: "LOW", action: "Document prohibited use case policy and technical enforcement measures at API gateway level", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "LOW" },
    { articleId: "art99", articleNumber: "Article 99", gapLevel: "LOW", gapTitle: "Penalty Exposure from Documentation Gaps", gapDescription: "Current documentation gaps under Articles 52 and 53 carry penalty exposure up to €15M or 3% of global turnover for GPAI providers.", actions: [{ priority: "MEDIUM", action: "Prioritise Art. 52 and 53 documentation to eliminate highest-exposure penalty risk", deadline: "BEFORE_2026-08-02" }], estimatedEffort: "LOW" },
  ],
};

const STEPS = [
  { id: "classify", label: "Classification" },
  { id: "map", label: "Regulatory Mapping" },
  { id: "gap", label: "Gap Analysis" },
];

const SESSION_KEY = "eu_ai_tool_intake";

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: { background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace" },
  header: { borderBottom: `1px solid ${C.border}`, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, position: "sticky", top: 0, zIndex: 10 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 30, height: 30, border: `1.5px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.gold, transform: "rotate(45deg)", flexShrink: 0 },
  logoMarkInner: { transform: "rotate(-45deg)" },
  logoText: { fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.text },
  logoSub: { fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginTop: 1, textTransform: "uppercase" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  badge: { fontSize: 10, padding: "3px 10px", border: `1px solid ${C.borderLight}`, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" },
  changeKeyBtn: { fontSize: 10, color: C.textMuted, background: "none", border: `1px solid ${C.border}`, padding: "5px 10px", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "inherit" },
  main: { maxWidth: 860, margin: "0 auto", padding: "3rem 2rem" },
  hero: { marginBottom: "3rem" },
  heroEyebrow: { fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, marginBottom: "0.875rem" },
  heroTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.15, color: C.text, marginBottom: "1rem" },
  heroSub: { fontSize: 14, color: C.textSub, lineHeight: 1.75, maxWidth: 540 },
  sectionLabel: { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textMuted, marginBottom: "0.875rem" },
  keyInput: { width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, padding: "1rem", fontFamily: "'DM Mono', monospace", outline: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "1rem" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.textSub, marginBottom: "1.5rem", cursor: "pointer", userSelect: "none" },
  privacyNote: { fontSize: 11, color: C.textSub, lineHeight: 1.75, marginTop: "2rem", padding: "1rem 1.125rem", background: C.goldFaint, borderLeft: `3px solid ${C.gold}` },
  analyzeBtn: (disabled) => ({ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 22px", background: disabled ? "transparent" : C.goldFaint, border: `1px solid ${disabled ? C.border : C.gold}`, color: disabled ? C.textMuted : C.gold, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }),
  stepsBar: { display: "flex", alignItems: "center", marginBottom: "2rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "1.5rem" },
  step: (active, done) => ({ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: done ? C.gold : active ? C.text : C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }),
  stepDot: (active, done) => ({ width: 6, height: 6, borderRadius: "50%", background: done ? C.gold : active ? C.text : C.textMuted, animation: active ? "pulse 1.5s infinite" : "none" }),
  stepLine: { flex: 1, height: 1, background: C.border, margin: "0 12px" },
  card: { background: C.surface, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  cardLabel: { fontSize: 10, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" },
  errorBox: { background: C.redFaint, border: `1px solid ${C.red}`, padding: "1rem", fontSize: 13, color: C.red, marginTop: "1rem" },
  resetBtn: { fontSize: 11, color: C.textMuted, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "inherit", padding: 0, marginTop: "2.5rem", textDecoration: "underline" },
  footer: { borderTop: `1px solid ${C.border}`, padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", background: C.surface },
  sourceLink: { fontSize: 11, color: C.blue, textDecoration: "none", borderBottom: `1px solid rgba(29,78,216,0.3)`, paddingBottom: 1 },
  questionBlock: { marginBottom: "1.75rem" },
  questionLabel: { fontSize: 11, fontWeight: 600, color: C.text, letterSpacing: "0.06em", marginBottom: 3 },
  questionSublabel: { fontSize: 11, color: C.textMuted, marginBottom: 8, lineHeight: 1.6 },
  input: { width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, lineHeight: 1.75, padding: "0.875rem 1rem", fontFamily: "inherit", outline: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  textarea: { width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, lineHeight: 1.75, padding: "0.875rem 1rem", fontFamily: "inherit", resize: "vertical", minHeight: 110, outline: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  charCount: { fontSize: 10, color: C.textMuted, textAlign: "right", marginTop: 4, letterSpacing: "0.06em" },
  riskBadge: (color) => ({ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", border: `1px solid ${color}`, background: `${color}12`, fontSize: 10, color, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.5rem" }),
  riskNote: { fontSize: 11, color: C.textMuted, lineHeight: 1.65, marginBottom: "1.5rem" },
};

// ─── Compliance Score Gauge ───────────────────────────────────────────────────
function ScoreGauge({ score }) {
  const r = 54;
  const circumference = Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? C.green : score >= 40 ? C.amber : C.red;
  const levelLabel = score >= 70 ? "HIGH COMPLIANCE" : score >= 40 ? "MEDIUM COMPLIANCE" : "LOW COMPLIANCE";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={144} height={82} viewBox="0 0 144 82">
        <path d="M 12 76 A 60 60 0 0 1 132 76" fill="none" stroke={C.border} strokeWidth={7} strokeLinecap="round" />
        <path d="M 12 76 A 60 60 0 0 1 132 76" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        <text x="72" y="70" textAnchor="middle" style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Mono',monospace", fill: C.text }}>{score}</text>
      </svg>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color, fontWeight: 700 }}>{levelLabel}</div>
    </div>
  );
}

// ─── Priority Action Item ─────────────────────────────────────────────────────
function ActionItem({ action, priority, deadline, index }) {
  const colors = { HIGH: C.red, MEDIUM: C.amber, LOW: C.green };
  const bgColors = { HIGH: C.redFaint, MEDIUM: C.amberFaint, LOW: C.greenFaint };
  const color = colors[priority] || C.textMuted;
  const deadlineLabel = deadline === "IMMEDIATE" ? "⚡ Immediate" : deadline === "BEFORE_2026-08-02" ? "📅 Before Aug 2, 2026" : "🔄 Ongoing";
  return (
    <div style={{ display: "flex", gap: 14, padding: "0.875rem 1rem", borderBottom: `1px solid ${C.border}`, background: index === 0 ? bgColors[priority] : "transparent" }}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{ width: 22, height: 22, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color, fontWeight: 700 }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65, marginBottom: 5 }}>{action}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 9, padding: "2px 7px", border: `1px solid ${color}`, color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{priority}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{deadlineLabel}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Article Detail Card ──────────────────────────────────────────────────────
function ArticleCard({ gap }) {
  const [open, setOpen] = useState(false);
  const gapColor = { HIGH: C.red, MEDIUM: C.amber, LOW: C.amber, NONE: C.green }[gap.gapLevel] || C.textMuted;
  const gapBg = { HIGH: C.redFaint, MEDIUM: C.amberFaint, LOW: C.amberFaint, NONE: C.greenFaint }[gap.gapLevel] || "transparent";
  return (
    <div style={{ border: `1px solid ${C.border}`, marginBottom: 8, background: C.surface, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", cursor: "pointer", background: gapBg, borderBottom: open ? `1px solid ${C.border}` : "none", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, padding: "2px 7px", border: `1px solid ${gapColor}`, color: gapColor, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, flexShrink: 0 }}>
            {gap.gapLevel === "NONE" ? "✓ OK" : `GAP: ${gap.gapLevel}`}
          </span>
          <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{gap.articleNumber}</span>
          <span style={{ fontSize: 12, color: C.textSub }}>— {gap.gapTitle}</span>
        </div>
        <span style={{ fontSize: 11, color: C.textMuted, flexShrink: 0, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "1.125rem 1rem 1.25rem" }}>
          <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.75, marginBottom: "1rem" }}>{gap.gapDescription}</p>
          {gap.actions?.length > 0 && gap.gapLevel !== "NONE" && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Required Actions</div>
              {gap.actions.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, marginTop: 6, background: a.priority === "HIGH" ? C.red : a.priority === "MEDIUM" ? C.amber : C.green }} />
                  <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.65 }}>
                    {a.action}
                    <span style={{ color: C.textMuted, marginLeft: 6 }}>
                      {a.deadline === "IMMEDIATE" ? "— ⚡ Immediate" : a.deadline === "BEFORE_2026-08-02" ? "— 📅 Before Aug 2, 2026" : "— 🔄 Ongoing"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: "0.875rem", borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>Official source:</span>
            <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener noreferrer" style={s.sourceLink}>
              Regulation (EU) 2024/1689 — {gap.articleNumber} on EUR-Lex ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Steps Bar ────────────────────────────────────────────────────────────────
function StepsBar({ currentStep }) {
  const stepIndex = STEPS.findIndex((st) => st.id === currentStep);
  return (
    <div style={s.stepsBar}>
      {STEPS.map((step, i) => (
        <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={s.step(i === stepIndex, i < stepIndex)}>
            <div style={s.stepDot(i === stepIndex, i < stepIndex)} />
            {step.label}
          </div>
          {i < STEPS.length - 1 && <div style={s.stepLine} />}
        </div>
      ))}
    </div>
  );
}

// ─── API Key Guide Modal ──────────────────────────────────────────────────────
function ApiKeyGuideModal({ onClose }) {
  const steps = [
    { n: '01', title: 'Create an Anthropic account', body: 'Go to console.anthropic.com and sign up with your email. Existing Claude.ai accounts work too — use the same credentials.' },
    { n: '02', title: 'Add a payment method', body: 'Navigate to Settings → Billing and add a credit card. Anthropic uses pay-as-you-go pricing — you are only charged for what you use. No subscription required.' },
    { n: '03', title: 'Set a spending limit (recommended)', body: 'In Settings → Limits, set a monthly spend limit (e.g. $5). This guarantees you will never be surprised by an unexpected charge.' },
    { n: '04', title: 'Create a dedicated API key', body: "Go to API Keys → Create Key. Name it something recognisable like 'eu-ai-tool' so you can revoke it independently without affecting other projects." },
    { n: '05', title: 'Copy and paste the key', body: 'Copy the key immediately — it is shown only once. Paste it in the field on this page. The key starts with sk-ant-.' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>// API Key Guide</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.text }}>How to get an Anthropic API key</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.textMuted, padding: '0 0 0 12px', lineHeight: 1 }}>✕</button>
        </div>
        {steps.map((step) => (
          <div key={step.n} style={{ display: 'flex', gap: 14, marginBottom: '1.25rem' }}>
            <div style={{ flexShrink: 0, width: 28, height: 28, border: `1.5px solid ${C.gold}`, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '0.05em' }}>{step.n}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7 }}>{step.body}</div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.25rem', marginTop: '0.5rem' }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>// Cost per analysis</div>
          <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.75 }}>
            Each gap analysis uses the <strong style={{ color: C.text }}>claude-sonnet-4-20250514</strong> model and costs approximately <strong style={{ color: C.text }}>$0.02 – $0.05</strong> depending on the length of your description. Running 20 analyses costs less than $1.
          </div>
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 20px', background: C.goldFaint, border: `1px solid ${C.gold}`, color: C.gold, cursor: 'pointer', fontFamily: 'inherit' }} onClick={onClose}>
            → Got it, back to the tool
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  // Intake form state — 5 questions
  const emptyAnswers = () => ({ systemDescription: "", affectedPersons: "", dataSources: "", existingDocs: "", deploymentContext: "" });
  const [answers, setAnswers] = useState(emptyAnswers);
  const [riskPreview, setRiskPreview] = useState(null);

  // Analysis state
  const [phase, setPhase] = useState("input");
  const [currentStep, setCurrentStep] = useState("classify");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ── On mount: restore API key and saved intake from session/localStorage
  useEffect(() => {
    const fromSession = sessionStorage.getItem("anthropic_api_key");
    const fromLocal = localStorage.getItem("anthropic_api_key");
    if (fromSession) { setApiKey(fromSession); }
    else if (fromLocal) { setApiKey(fromLocal); setRememberKey(true); }

    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        setRiskPreview(inferRiskTier(parsed));
      }
    } catch (_) {}
  }, []);

  function handleAnswerChange(id, value) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    const allFilled = INTAKE_QUESTIONS
      .filter((q) => q.required)
      .every((q) => (next[q.id] || "").trim().length >= q.minLength);
    if (allFilled) setRiskPreview(inferRiskTier(next));
    else setRiskPreview(null);
  }

  function handleSaveKey() {
    const trimmed = keyInput.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setKeyError("Invalid format. Anthropic API keys start with 'sk-ant-'. Verify you copied the correct value from console.anthropic.com.");
      return;
    }
    setApiKey(trimmed);
    setKeyError("");
    if (rememberKey) { localStorage.setItem("anthropic_api_key", trimmed); }
    else { sessionStorage.setItem("anthropic_api_key", trimmed); }
    setKeyInput("");
    // Phase 3.2 fix: reset showcase state when key is entered
    setPhase("input");
    setResult(null);
  }

  function handleClearKey() {
    setApiKey("");
    sessionStorage.removeItem("anthropic_api_key");
    localStorage.removeItem("anthropic_api_key");
    setKeyInput(""); setRememberKey(false);
    setPhase("input"); setResult(null);
    setError(""); setCurrentStep("classify");
  }

  function loadShowcase(scenario = "high") {
    setResult(scenario === "gpai" ? SHOWCASE_GPAI_RESULT : SHOWCASE_RESULT);
    setPhase("result");
  }

  const isFormValid = INTAKE_QUESTIONS
    .filter((q) => q.required)
    .every((q) => (answers[q.id] || "").trim().length >= q.minLength);

  async function runAnalysis() {
    if (!apiKey || !isFormValid) return;
    setPhase("analyzing"); setError(""); setCurrentStep("classify");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setCurrentStep("map");
      await new Promise((r) => setTimeout(r, 700));
      setCurrentStep("gap");
      const riskTier = riskPreview?.tier || "HIGH";
      const articleIds = deriveArticleIds(riskTier, answers);
      const data = await runGapAnalysis(answers, articleIds, apiKey);
      setResult(data);
      setPhase("result");
    } catch (e) {
      setError(e.message || "Analysis error. Please check your inputs and try again.");
      setPhase("input");
    }
  }

  function reset() {
    setPhase("input"); setResult(null);
    setError(""); setCurrentStep("classify");
    // answers and riskPreview are intentionally preserved for session continuity
  }

  function fullReset() {
    setPhase("input"); setResult(null);
    setError(""); setCurrentStep("classify");
    setAnswers(emptyAnswers()); setRiskPreview(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  // ─── Phase 3.2: PDF Export ───────────────────────────────────────────────────
  async function exportToPDF() {
    // Load jsPDF via UMD script tag (avoids Babel module resolution issues)
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const PW = 210; // page width mm
    const ML = 18; // margin left
    const MR = 18; // margin right
    const CW = PW - ML - MR; // content width
    const PAGE_H = 297;
    const MB = 20; // margin bottom
    let y = 0;

    const COLORS = {
      gold:    [139, 105, 20],
      text:    [17,  24,  39],
      sub:     [55,  65,  81],
      muted:   [107, 114, 128],
      red:     [185, 28,  28],
      amber:   [180, 83,  9],
      blue:    [29,  78,  216],
      green:   [22,  101, 52],
      border:  [221, 226, 236],
      bg:      [244, 246, 249],
    };

    function setColor(rgb, type = "text") {
      if (type === "text") doc.setTextColor(...rgb);
      else if (type === "fill") doc.setFillColor(...rgb);
      else if (type === "draw") doc.setDrawColor(...rgb);
    }

    function checkPage(needed = 10) {
      if (y + needed > PAGE_H - MB) {
        doc.addPage();
        y = 18;
      }
    }

    function drawHRule(color = COLORS.border, lw = 0.2) {
      doc.setLineWidth(lw);
      setColor(color, "draw");
      doc.line(ML, y, PW - MR, y);
      y += 4;
    }

    function label(text, color = COLORS.gold) {
      checkPage(8);
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      setColor(color, "text");
      doc.text(text.toUpperCase(), ML, y);
      y += 5;
    }

    function body(text, color = COLORS.sub, size = 10, indent = 0) {
      doc.setFont("courier", "normal");
      doc.setFontSize(size);
      setColor(color, "text");
      const lines = doc.splitTextToSize(text, CW - indent);
      lines.forEach((line) => {
        checkPage(6);
        doc.text(line, ML + indent, y);
        y += 5;
      });
    }

    function sectionTitle(text) {
      checkPage(14);
      y += 4;
      label(`// ${text}`);
      drawHRule(COLORS.border, 0.15);
    }

    function pill(text, color) {
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      setColor(color, "text");
      doc.text(`[ ${text} ]`, ML, y);
      y += 5;
    }

    const readinessColor = {
      NOT_COMPLIANT:       COLORS.red,
      PARTIALLY_COMPLIANT: COLORS.amber,
      LARGELY_COMPLIANT:   COLORS.blue,
      COMPLIANT:           COLORS.green,
    };
    const readinessLabel = {
      NOT_COMPLIANT:       "Non-Compliant",
      PARTIALLY_COMPLIANT: "Partially Compliant",
      LARGELY_COMPLIANT:   "Largely Compliant",
      COMPLIANT:           "Compliant",
    };
    const priorityColor = { HIGH: COLORS.red, MEDIUM: COLORS.amber, LOW: COLORS.green };
    const gapColor = { HIGH: COLORS.red, MEDIUM: COLORS.amber, LOW: COLORS.blue, NONE: COLORS.green };

    // ── HEADER ──────────────────────────────────────────────────────────────
    y = 18;
    setColor(COLORS.gold, "fill");
    doc.rect(ML, y - 5, CW, 0.8, "F");
    y += 2;
    doc.setFont("courier", "bold");
    doc.setFontSize(18);
    setColor(COLORS.text, "text");
    doc.text("EU AI Compliance Tool", ML, y);
    y += 7;
    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    setColor(COLORS.muted, "text");
    doc.text(`Gap Analysis Report  ·  ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}  ·  Regulation (EU) 2024/1689`, ML, y);
    y += 3;
    setColor(COLORS.gold, "fill");
    doc.rect(ML, y, CW, 0.5, "F");
    y += 8;

    // ── CLASSIFICATION ───────────────────────────────────────────────────────
    label("// 01 — System Classification");
    doc.setFont("courier", "bold");
    doc.setFontSize(13);
    setColor(COLORS.text, "text");
    const titleLines = doc.splitTextToSize(result.classification?.systemType || "", CW);
    titleLines.forEach((l) => { doc.text(l, ML, y); y += 6; });
    y += 2;

    // Score box
    checkPage(28);
    setColor(COLORS.bg, "fill");
    setColor(COLORS.border, "draw");
    doc.setLineWidth(0.3);
    doc.rect(ML, y, 38, 22, "FD");
    doc.setFont("courier", "bold");
    doc.setFontSize(26);
    setColor(COLORS.gold, "text");
    doc.text(String(result.complianceScore ?? 0), ML + 19, y + 13, { align: "center" });
    doc.setFontSize(7);
    setColor(COLORS.muted, "text");
    doc.text("COMPLIANCE SCORE", ML + 19, y + 19, { align: "center" });

    const rColor = readinessColor[result.overallReadiness] || COLORS.muted;
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    setColor(rColor, "text");
    doc.text(`[ ${(readinessLabel[result.overallReadiness] || "").toUpperCase()} ]`, ML + 43, y + 8);

    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    setColor(COLORS.sub, "text");
    const metaItems = [
      ["Risk Category", result.classification?.riskCategory],
      ["Sector", result.classification?.sector],
    ];
    let mx = ML + 43;
    metaItems.forEach(([k, v]) => {
      if (!v) return;
      doc.setFont("courier", "bold"); doc.setFontSize(7); setColor(COLORS.muted, "text"); doc.text(k.toUpperCase(), mx, y + 13);
      doc.setFont("courier", "normal"); doc.setFontSize(8.5); setColor(COLORS.text, "text"); doc.text(String(v), mx, y + 18);
      mx += 60;
    });
    y += 26;

    // Rationale
    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    setColor(COLORS.muted, "text");
    doc.text("RISK RATIONALE", ML, y); y += 4;
    body(result.classification?.riskRationale || "", COLORS.sub, 9);
    y += 2;

    // ── EXECUTIVE SUMMARY ────────────────────────────────────────────────────
    sectionTitle("02 — Executive Summary");
    body(result.executiveSummary || "", COLORS.sub, 10);
    y += 2;

    // ── RED FLAGS ────────────────────────────────────────────────────────────
    if (result.redFlags?.length > 0) {
      sectionTitle("03 — Critical Red Flags");
      result.redFlags.forEach((f) => {
        checkPage(10);
        setColor(COLORS.red, "text");
        doc.setFont("courier", "bold");
        doc.setFontSize(9);
        doc.text("▶", ML, y);
        body(f, COLORS.red, 9, 5);
        y += 1;
      });
      y += 2;
    }

    // ── PRIORITY ACTIONS ─────────────────────────────────────────────────────
    sectionTitle("04 — Priority Action Plan");
    sortedActions.forEach((a, i) => {
      checkPage(16);
      const pColor = priorityColor[a.priority] || COLORS.muted;
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      setColor(pColor, "text");
      doc.text(`${String(i + 1).padStart(2, "0")}  [ ${a.priority} ]`, ML, y);
      doc.setFont("courier", "normal");
      doc.setFontSize(7.5);
      setColor(COLORS.muted, "text");
      doc.text(a.deadline?.replace(/_/g, " ") || "", PW - MR, y, { align: "right" });
      y += 5;
      body(a.action || "", COLORS.sub, 9, 4);
      y += 2;
    });

    // ── ARTICLE-BY-ARTICLE GAPS ──────────────────────────────────────────────
    sectionTitle("05 — Article-by-Article Gap Analysis");
    sortedGaps.forEach((gap) => {
      checkPage(22);
      const gColor = gapColor[gap.gapLevel] || COLORS.muted;
      // Article header bar
      setColor(COLORS.bg, "fill");
      doc.rect(ML, y - 4, CW, 8, "F");
      doc.setFont("courier", "bold");
      doc.setFontSize(9);
      setColor(COLORS.text, "text");
      doc.text(gap.articleNumber || "", ML + 2, y);
      doc.setFontSize(7.5);
      setColor(gColor, "text");
      doc.text(`[ ${gap.gapLevel} ]`, ML + 28, y);
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      setColor(COLORS.text, "text");
      const titleStr = doc.splitTextToSize(gap.gapTitle || "", CW - 55)[0];
      doc.text(titleStr, ML + 48, y);
      doc.setFontSize(7.5);
      setColor(COLORS.muted, "text");
      doc.text(`Effort: ${gap.estimatedEffort || ""}`, PW - MR, y, { align: "right" });
      y += 6;
      body(gap.gapDescription || "", COLORS.sub, 8.5, 2);
      if (gap.actions?.length > 0) {
        gap.actions.forEach((act) => {
          checkPage(10);
          const aColor = priorityColor[act.priority] || COLORS.muted;
          doc.setFont("courier", "bold");
          doc.setFontSize(7.5);
          setColor(aColor, "text");
          doc.text(`→ ${act.priority}`, ML + 2, y);
          body(act.action || "", COLORS.sub, 8, 16);
          y += 1;
        });
      }
      y += 4;
      drawHRule(COLORS.border, 0.1);
    });

    // ── FOOTER ───────────────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      setColor(COLORS.muted, "text");
      doc.text(`EU AI Compliance Tool v2  ·  eu-ai-compliance-tool-v2.vercel.app  ·  Page ${p} of ${totalPages}`, PW / 2, PAGE_H - 10, { align: "center" });
    }

    const systemSlug = (result.classification?.systemType || "analysis").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    doc.save(`eu-ai-compliance-${systemSlug}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }
  // ─────────────────────────────────────────────────────────────────────────────

  const READINESS = {
    NOT_COMPLIANT:       { label: "Non-Compliant",       color: C.red },
    PARTIALLY_COMPLIANT: { label: "Partially Compliant", color: C.amber },
    LARGELY_COMPLIANT:   { label: "Largely Compliant",   color: C.blue },
    COMPLIANT:           { label: "Compliant",            color: C.green },
  };

  const sortedActions = result?.priorityActions
    ? [...result.priorityActions].sort((a, b) => ({ HIGH: 0, MEDIUM: 1, LOW: 2 }[a.priority] ?? 3) - ({ HIGH: 0, MEDIUM: 1, LOW: 2 }[b.priority] ?? 3))
    : [];

  const sortedGaps = result?.gaps
    ? [...result.gaps].sort((a, b) => ({ HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 }[a.gapLevel] ?? 4) - ({ HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 }[b.gapLevel] ?? 4))
    : [];

  return (
    <div style={s.root}>
      {showGuide && <ApiKeyGuideModal onClose={() => setShowGuide(false)} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        textarea:focus, input:focus { border-color: ${C.gold} !important; }
        textarea::placeholder, input::placeholder { color: ${C.textMuted}; }
        button:hover { opacity: 0.82; }
        a:hover { opacity: 0.75; }
      `}</style>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.logo}>
          <div style={s.logoMark}><span style={s.logoMarkInner}>⚖</span></div>
          <div>
            <div style={s.logoText}>EU AI Compliance</div>
            <div style={s.logoSub}>Gap Analysis Tool · v2.0</div>
          </div>
        </div>
        <div style={s.headerRight}>
          {apiKey && <button style={s.changeKeyBtn} onClick={handleClearKey}>Change Key</button>}
          <div style={s.badge}>Reg. EU 2024/1689</div>
        </div>
      </header>

      <main style={s.main}>

        {/* ══════════════════ API KEY GATE ══════════════════ */}
        {!apiKey && (
          <>
            <div style={s.hero}>
              <div style={s.heroEyebrow}>// EU AI Act Gap Analysis Tool</div>
              <h1 style={s.heroTitle}>Assess your AI system's<br /><span style={{ color: C.gold }}>EU AI Act compliance</span></h1>
              <p style={s.heroSub}>
                Answer five questions about your AI system and get an instant gap analysis: risk classification,
                compliance score, article-by-article gaps, and a prioritised remediation plan.
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, margin: '1.75rem 0 1.5rem', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: 10, color: C.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>// How it works</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: '⚿', text: 'Paste your Anthropic API key — calls go directly from your browser to api.anthropic.com, never through our servers.' },
                    { icon: '◈', text: 'Or try one of the example scenarios instantly, no key required.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: C.gold, fontSize: 13, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.65 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={s.sectionLabel}>// Enter your Anthropic API key</div>
            <input type="password" value={keyInput} onChange={(e) => { setKeyInput(e.target.value); if (keyError) setKeyError(""); }} onKeyDown={(e) => { if (e.key === "Enter" && keyInput.trim()) handleSaveKey(); }} placeholder="sk-ant-api03-..." style={s.keyInput} autoFocus />
            <label style={s.checkboxLabel}>
              <input type="checkbox" checked={rememberKey} onChange={(e) => setRememberKey(e.target.checked)} />
              <span>Remember this key on this browser <span style={{ color: C.textMuted }}>(stored in localStorage)</span></span>
            </label>
            {keyError && <div style={s.errorBox}>{keyError}</div>}
            <button style={s.analyzeBtn(!keyInput.trim())} onClick={handleSaveKey} disabled={!keyInput.trim()}>
              <span>→</span><span>Continue</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.5rem 0" }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 22px", background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }} onClick={() => loadShowcase("high")}>
                <span>◈</span><span>Example: High-Risk AI (CV Screening)</span>
              </button>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 22px", background: "transparent", border: `1px solid ${C.blue}20`, color: C.blue, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }} onClick={() => loadShowcase("gpai")}>
                <span>◈</span><span>Example: GPAI Foundation Model</span>
              </button>
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8, lineHeight: 1.6 }}>Preview pre-computed analyses — no API key required.</div>
            <div style={s.privacyNote}>
              <strong style={{ color: C.gold, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 10 }}>// Privacy & Security</strong>
              <div style={{ marginTop: 8 }}>
                • Your key is stored only in your browser (sessionStorage by default, localStorage if "Remember" is checked).<br />
                • No backend logs your key. No proxy. No analytics on the key value.<br />
                • No API key yet?{" "}<button onClick={() => setShowGuide(true)} style={{ background: "none", border: "none", color: C.blue, cursor: "pointer", fontFamily: "inherit", fontSize: 11, padding: 0, textDecoration: "underline" }}>Step-by-step guide to get one →</button><br />
                • Recommended: create a dedicated key for this tool so you can revoke it anytime.
              </div>
            </div>
          </>
        )}

        {/* ══════════════════ INPUT PHASE ══════════════════ */}
        {apiKey && phase === "input" && (
          <>
            <div style={s.hero}>
              <div style={s.heroEyebrow}>// EU AI Act Compliance</div>
              <h1 style={s.heroTitle}>Automated<br /><span style={{ color: C.gold }}>Gap Analysis</span></h1>
              <p style={s.heroSub}>Answer five questions about your AI system. The more specific your answers, the more actionable the analysis.</p>
            </div>

            <div style={s.sectionLabel}>// System intake — five questions</div>

            {INTAKE_QUESTIONS.map((q) => (
              <div key={q.id} style={s.questionBlock}>
                <div style={s.questionLabel}>{q.label}{q.required && <span style={{ color: C.red, marginLeft: 4 }}>*</span>}</div>
                <div style={s.questionSublabel}>{q.sublabel}</div>
                {q.multiline
                  ? <textarea style={s.textarea} rows={5} value={answers[q.id]} onChange={(e) => handleAnswerChange(q.id, e.target.value)} placeholder={q.placeholder} />
                  : <input type="text" style={s.input} value={answers[q.id]} onChange={(e) => handleAnswerChange(q.id, e.target.value)} placeholder={q.placeholder} />
                }
                {q.required && (
                  <div style={s.charCount}>{(answers[q.id] || "").length} / min. {q.minLength} characters</div>
                )}
              </div>
            ))}

            {/* Risk pre-classification preview */}
            {riskPreview && (
              <div style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem", border: `1px solid ${riskPreview.color}`, background: `${riskPreview.color}0d` }}>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  // Pre-classification (based on your answers)
                </div>
                <div style={s.riskBadge(riskPreview.color)}>
                  <span>◈</span><span>{riskPreview.label}</span>
                </div>
                <div style={s.riskNote}>
                  Preliminary classification based on keywords in your description.
                  The full analysis will confirm or refine this assessment.
                  {riskPreview.confidence === "LOW" && " Low confidence — add more detail to improve accuracy."}
                </div>
              </div>
            )}

            {error && <div style={s.errorBox}>{error}</div>}

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button style={s.analyzeBtn(!isFormValid)} onClick={runAnalysis} disabled={!isFormValid}>
                <span>→</span><span>Run Gap Analysis</span>
              </button>
              {Object.values(answers).some((v) => v.trim().length > 0) && (
                <button style={{ ...s.changeKeyBtn, fontSize: 11 }} onClick={fullReset}>
                  Clear form
                </button>
              )}
            </div>
            {!isFormValid && (
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10, lineHeight: 1.6 }}>
                Complete the required fields (*) to run the analysis.
              </div>
            )}
          </>
        )}

        {/* ══════════════════ ANALYZING PHASE ══════════════════ */}
        {apiKey && phase === "analyzing" && (
          <>
            <div style={s.hero}>
              <div style={s.heroEyebrow}>// Analysis in progress</div>
              <h1 style={s.heroTitle}>Processing<br /><span style={{ color: C.gold }}>your system</span></h1>
            </div>
            <StepsBar currentStep={currentStep} />
            <div style={s.card}>
              <div style={s.cardLabel}>
                {currentStep === "classify" && "// AI System Classification"}
                {currentStep === "map" && "// EU AI Act Article Mapping"}
                {currentStep === "gap" && "// Compliance Gap Analysis"}
              </div>
              <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.75 }}>
                {currentStep === "classify" && "Identifying risk category, application sector and affected persons..."}
                {currentStep === "map" && "Cross-referencing your system with relevant EU AI Act articles..."}
                {currentStep === "gap" && "Evaluating compliance status article by article and generating prioritized actions..."}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════ RESULT PHASE ══════════════════ */}
        {phase === "result" && result && (
          <>
            {!apiKey && (
              <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", background: C.goldFaint, border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <span style={{ fontSize: 11, color: C.gold, letterSpacing: "0.08em", textTransform: "uppercase" }}>// Showcase — pre-computed example scenario</span>
                <button style={{ ...s.changeKeyBtn, borderColor: C.gold, color: C.gold }} onClick={() => { setPhase("input"); setResult(null); }}>
                  ← Add your API key to run a real analysis
                </button>
              </div>
            )}
            <div style={s.heroEyebrow}>// Assessment Result</div>
            <h2 style={{ ...s.heroTitle, fontSize: "clamp(20px,3vw,30px)", marginBottom: "2rem" }}>{result.classification?.systemType}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, marginBottom: "1.5rem", background: C.surface, border: `1px solid ${C.border}`, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingRight: 24, borderRight: `1px solid ${C.border}` }}>
                <ScoreGauge score={result.complianceScore ?? 0} />
                {result.overallReadiness && (
                  <div style={{ marginTop: 10, fontSize: 10, padding: "3px 10px", border: `1px solid ${READINESS[result.overallReadiness]?.color}`, color: READINESS[result.overallReadiness]?.color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                    {READINESS[result.overallReadiness]?.label}
                  </div>
                )}
              </div>
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: "12px 20px", marginBottom: "1rem" }}>
                  {[
                    ["Risk Category", result.classification?.riskCategory],
                    ["Sector", result.classification?.sector],
                    ["Affected Persons", result.classification?.affectedPersons],
                  ].map(([k, v]) => v && (
                    <div key={k}>
                      <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Risk Rationale</div>
                <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{result.classification?.riskRationale}</p>
              </div>
            </div>

            <div style={{ border: `1px solid ${C.gold}`, background: C.goldFaint, padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>// Executive Summary</div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8 }}>{result.executiveSummary}</p>
            </div>

            {result.redFlags?.length > 0 && (
              <div style={{ border: `1px solid ${C.red}`, background: C.redFaint, padding: "1.25rem", marginBottom: "2rem" }}>
                <div style={{ fontSize: 10, color: C.red, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>// ⚠ Critical Red Flags</div>
                {result.redFlags.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.red, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontSize: 13, color: C.red, lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ ...s.sectionLabel, marginBottom: "0.4rem" }}>// 02 — Priority Action Plan</div>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: "1rem" }}>Sorted by criticality — address HIGH priority items first.</p>
              <div style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                {sortedActions.length > 0
                  ? sortedActions.map((a, i) => <ActionItem key={i} index={i} action={a.action} priority={a.priority} deadline={a.deadline} />)
                  : <div style={{ padding: "1rem", fontSize: 13, color: C.textMuted }}>No priority actions identified.</div>
                }
              </div>
            </div>

            <div>
              <div style={{ ...s.sectionLabel, marginBottom: "0.4rem" }}>// 03 — Article-by-Article Analysis</div>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: "1rem" }}>Click any row to expand the detailed gap assessment, required actions, and official source.</p>
              {sortedGaps.map((gap, i) => <ArticleCard key={i} gap={gap} />)}
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: C.surface, border: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, lineHeight: 1.9 }}>
              <div>Regulatory source:{" "}<a href={EU_AI_ACT_META.source} target="_blank" rel="noopener noreferrer" style={s.sourceLink}>Regulation (EU) 2024/1689 — EUR-Lex Official ↗</a></div>
              <div>Published: {EU_AI_ACT_META.published} · In force: {EU_AI_ACT_META.inForce}</div>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: "2.5rem", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem" }}>
              <button style={s.resetBtn} onClick={reset}>← Run another analysis</button>
              <button style={{ ...s.resetBtn, color: C.red }} onClick={fullReset}>✕ Clear all and start over</button>
              <button style={{ ...s.resetBtn, color: C.gold, marginTop: 0 }} onClick={exportToPDF}>↓ Export PDF report</button>
            </div>
          </>
        )}
      </main>

      <footer style={s.footer}>
        <span>EU AI Compliance Tool v2 · Regulation (EU) 2024/1689</span>
        <a href={EU_AI_ACT_META.source} target="_blank" rel="noopener noreferrer" style={{ ...s.sourceLink, color: C.textMuted, borderBottomColor: C.border }}>EUR-Lex Official Source →</a>
      </footer>
    </div>
  );
}

// ─── Phase 3.1: Tool Use Schema ──────────────────────────────────────────────
const COMPLIANCE_TOOL = {
  name: "submit_compliance_analysis",
  description: "Submit the structured EU AI Act compliance gap analysis result.",
  input_schema: {
    type: "object",
    properties: {
      classification: {
        type: "object",
        properties: {
          systemType:      { type: "string", description: "Brief technical classification of the AI system" },
          riskCategory:    { type: "string", enum: ["UNACCEPTABLE", "HIGH", "LIMITED", "MINIMAL", "GPAI"] },
          riskRationale:   { type: "string", description: "2-3 sentence explanation referencing the specific system" },
          sector:          { type: "string", description: "Identified sector or domain" },
          affectedPersons: { type: "string", description: "Who is impacted by the system outputs" },
        },
        required: ["systemType", "riskCategory", "riskRationale", "sector", "affectedPersons"],
      },
      complianceScore:  { type: "integer", minimum: 0, maximum: 100 },
      overallReadiness: { type: "string", enum: ["NOT_COMPLIANT", "PARTIALLY_COMPLIANT", "LARGELY_COMPLIANT", "COMPLIANT"] },
      executiveSummary: { type: "string", description: "3-4 sentence executive summary specific to this system" },
      gaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            articleId:      { type: "string" },
            articleNumber:  { type: "string" },
            gapLevel:       { type: "string", enum: ["HIGH", "MEDIUM", "LOW", "NONE"] },
            gapTitle:       { type: "string" },
            gapDescription: { type: "string" },
            estimatedEffort:{ type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
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

// ─── API Call ────────────────────────────────────────────────────────────────
async function runGapAnalysis(answers, articleIds, apiKey) {
  const relevantArticles = articleIds
    .map((id) => ARTICLES[id])
    .filter(Boolean);

  const systemPrompt = `You are a senior EU AI Act compliance expert with deep legal and technical expertise.
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
1. Score floors by input richness: if Q4 and Q5 are both blank, score may fall in 5–30. If Q4 or Q5 contain any documented measures, score must be at least 30. If both Q4 and Q5 describe multiple concrete practices, score must be at least 40.
2. Reward declared evidence: treat each of the following as a positive signal worth +5–8 points above tier floor: formal risk assessment, bias testing, human override/escalation, audit logging, transparency notice, data retention policy, conformity assessment (initiated or complete), incident reporting pipeline, copyright policy, adversarial testing.
3. Monotonicity guarantee: a response with more documented practices than a previous scenario must always score higher. Never assign the same score to minimal and complete inputs for the same system type.
4. Penalise only what is absent: do not penalise for gaps that the user did not claim to have filled. Score what exists, not what is missing.
5. Reserve scores below 20 for systems with zero compliance measures or active prohibited practices.

Use the submit_compliance_analysis tool to return your structured findings.`;

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
${relevantArticles.map((a) => `
${a.number} — ${a.title}
Summary: ${a.summary}
Key Obligations: ${a.keyObligations.join("; ")}
Application Date: ${a.applicationDate}
`).join("\n---\n")}`;

  // ─── Token Budget Log (Phase 2.2 — preserved) ────────────────────────────
  const charCount = userMessage.length;
  const estimatedTokens = Math.round(charCount / 4);
  console.log(`[Phase 3.1] Tier: ${articleIds.length} articles | ${charCount} chars | ~${estimatedTokens} tokens`);
  // ─────────────────────────────────────────────────────────────────────────

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      tools: [COMPLIANCE_TOOL],
      tool_choice: { type: "tool", name: "submit_compliance_analysis" },
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (response.status === 401) throw new Error("Invalid or expired API key. Verify the value and credit availability.");
  if (response.status === 429) throw new Error("Anthropic rate limit hit. Retry in a few minutes.");
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API error: ${response.status}`);
  }

  // ─── Phase 3.1: Tool Use Response Parsing ────────────────────────────────
  const data = await response.json();
  const toolUseBlock = data.content.find((b) => b.type === "tool_use");
  if (!toolUseBlock) throw new Error("Unexpected API response: no tool_use block returned. Please retry.");
  return toolUseBlock.input;
  // ─────────────────────────────────────────────────────────────────────────
}
