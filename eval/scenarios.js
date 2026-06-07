// ─── EU AI Compliance Tool v2 · Eval Scenarios ───────────────────────────────
// 20 canonical test scenarios for Phase 4.1 eval framework.
// Groups:
//   A — Calibration matrix 3×3 (9 scenarios): verified in Session 5
//   B — Tier boundary cases   (4 scenarios): ambiguous classification inputs
//   C — GPAI edge cases       (3 scenarios): GPAI-specific routing logic
//   D — Score boundary cases  (2 scenarios): floor and ceiling of scoring
//   E — Input stress tests    (2 scenarios): robustness of parsing

export const SCENARIOS = [

  // ── GROUP A: Calibration Matrix 3×3 ─────────────────────────────────────────

  {
    id: "A1",
    group: "A",
    description: "HIGH tier — input minimo (Q1–Q3 only)",
    answers: {
      systemDescription: "We use a machine learning model that analyses CV text and assigns a ranked score to job candidates. HR teams use the score to shortlist applicants for interviews.",
      affectedPersons: "Job applicants across EU member states.",
      dataSources: "CV text, LinkedIn profiles, and historical hiring outcomes.",
      existingDocs: "",
      deploymentContext: "",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [5, 20],
    expectedReadiness: "NOT_COMPLIANT",
  },

  {
    id: "A2",
    group: "A",
    description: "HIGH tier — input medio (Q1–Q5 parziali)",
    answers: {
      systemDescription: "We use a machine learning model that analyses CV text and assigns a ranked score to job candidates. HR teams use the score to shortlist applicants for interviews.",
      affectedPersons: "Job applicants across EU member states, including people with disabilities.",
      dataSources: "CV text, LinkedIn profiles, educational background, and 5 years of historical hiring outcomes.",
      existingDocs: "We have a GDPR Data Processing Agreement and basic technical documentation.",
      deploymentContext: "Internal tool used by our HR department in Italy.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [35, 50],
    expectedReadiness: "PARTIALLY_COMPLIANT",
  },

  {
    id: "A3",
    group: "A",
    description: "HIGH tier — input completo (Q1–Q5 dettagliati)",
    answers: {
      systemDescription: "We use a machine learning model that analyses CV text and assigns a ranked score to job candidates. HR teams use the score to shortlist applicants for interviews.",
      affectedPersons: "Job applicants across EU member states, including vulnerable groups such as people with disabilities or from minority ethnic backgrounds.",
      dataSources: "CV text, LinkedIn profiles, educational background, and historical hiring outcomes. Training set includes 5 years of past recruitment decisions with demographic labels.",
      existingDocs: "We have a GDPR Data Processing Agreement, formal technical documentation, a bias testing report with quantitative results across gender and ethnicity, a documented human override workflow with audit logging, and an initiated conformity assessment procedure.",
      deploymentContext: "SaaS product sold to HR departments across Europe. Currently live and active in Italy, France, and Germany with approximately 40 enterprise clients.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [62, 78],
    expectedReadiness: "LARGELY_COMPLIANT",
  },

  {
    id: "A4",
    group: "A",
    description: "LIMITED tier — input minimo (Q1–Q3 only)",
    answers: {
      systemDescription: "A customer service chatbot that answers product questions and routes complaints to human agents.",
      affectedPersons: "Customers of an e-commerce platform.",
      dataSources: "Product catalogue, FAQ database, and anonymised customer service logs.",
      existingDocs: "",
      deploymentContext: "",
    },
    expectedTier: "LIMITED",
    expectedScoreRange: [15, 25],
    expectedReadiness: "NOT_COMPLIANT",
  },

  {
    id: "A5",
    group: "A",
    description: "LIMITED tier — input medio (Q1–Q5 parziali)",
    answers: {
      systemDescription: "A customer service chatbot that answers product questions and routes complaints to human agents.",
      affectedPersons: "Customers of an e-commerce platform across EU member states.",
      dataSources: "Product catalogue, FAQ database, and anonymised customer service interaction logs.",
      existingDocs: "Basic privacy notice on the website. Chatbot is disclosed to users as automated.",
      deploymentContext: "Live on our e-commerce website serving customers in Italy and Spain.",
    },
    expectedTier: "LIMITED",
    expectedScoreRange: [35, 55],
    expectedReadiness: "PARTIALLY_COMPLIANT",
  },

  {
    id: "A6",
    group: "A",
    description: "LIMITED tier — input completo (Q1–Q5 dettagliati)",
    answers: {
      systemDescription: "A customer service chatbot that answers product questions and routes complaints to human agents. Users are always informed they are interacting with an AI.",
      affectedPersons: "Customers of an e-commerce platform across EU member states.",
      dataSources: "Product catalogue, FAQ database, and anonymised customer service interaction logs. No sensitive personal data is stored.",
      existingDocs: "Formal transparency notice disclosing AI use. GDPR-compliant data retention policy. Human escalation workflow documented and tested. Incident reporting pipeline in place. Regular performance audits conducted quarterly.",
      deploymentContext: "Live on our e-commerce website serving customers in Italy, Spain, and France. Approximately 200,000 monthly active users. System has been live for 18 months with no reported incidents.",
    },
    expectedTier: "LIMITED",
    expectedScoreRange: [65, 80],
    expectedReadiness: "LARGELY_COMPLIANT",
  },

  {
    id: "A7",
    group: "A",
    description: "GPAI tier — input minimo (Q1–Q3 only)",
    answers: {
      systemDescription: "We provide a large language model via API to third-party developers and businesses.",
      affectedPersons: "Downstream developers and end users of applications built on the model.",
      dataSources: "Large-scale web crawl dataset and licensed text corpora used for pretraining.",
      existingDocs: "",
      deploymentContext: "",
    },
    expectedTier: "GPAI",
    expectedScoreRange: [10, 20],
    expectedReadiness: "NOT_COMPLIANT",
  },

  {
    id: "A8",
    group: "A",
    description: "GPAI tier — input medio (Q1–Q5 parziali)",
    answers: {
      systemDescription: "We provide a large language model via API to third-party developers and businesses for text generation, summarisation, and question answering.",
      affectedPersons: "Downstream developers, businesses integrating the model, and end users of downstream applications.",
      dataSources: "Large-scale web crawl dataset and licensed text corpora. Training data was filtered for quality and safety.",
      existingDocs: "Basic API documentation published. Usage policy prohibiting harmful use cases. No formal copyright policy or technical documentation for downstream providers.",
      deploymentContext: "API available globally including EU markets. Several hundred active downstream integrators.",
    },
    expectedTier: "GPAI",
    expectedScoreRange: [35, 50],
    expectedReadiness: "PARTIALLY_COMPLIANT",
  },

  {
    id: "A9",
    group: "A",
    description: "GPAI tier — input completo (Q1–Q5 dettagliati)",
    answers: {
      systemDescription: "We provide a general purpose large language model via API to third-party developers and businesses for text generation, summarisation, classification, and question answering.",
      affectedPersons: "Downstream developers, businesses integrating the model, and end users of downstream applications across EU member states.",
      dataSources: "Large-scale web crawl dataset and licensed text corpora. Formal data provenance documentation maintained. Opt-out mechanism implemented for copyright holders.",
      existingDocs: "Published copyright policy per Article 53. Full technical documentation package for downstream integrators including capabilities, limitations, and misuse risks. Systemic risk self-assessment completed — model is below 10^25 FLOPs threshold. Adversarial testing programme in place. Incident reporting pipeline operational.",
      deploymentContext: "API available globally including EU markets. Over 1,000 active downstream integrators. Model has been in production for 2 years. Registered in EU GPAI model database.",
    },
    expectedTier: "GPAI",
    expectedScoreRange: [60, 75],
    expectedReadiness: "LARGELY_COMPLIANT",
  },

  // ── GROUP B: Tier Boundary Cases ─────────────────────────────────────────────

  {
    id: "B1",
    group: "B",
    description: "Tier boundary — medical chatbot (LIMITED vs HIGH ambiguity)",
    answers: {
      systemDescription: "A conversational AI assistant that answers general health questions and suggests when users should see a doctor. It does not make diagnoses.",
      affectedPersons: "General public including elderly users and people with chronic conditions.",
      dataSources: "Curated medical knowledge base and anonymised consultation logs. No personal health records stored.",
      existingDocs: "Disclaimer that the tool is not a substitute for medical advice. Basic privacy policy.",
      deploymentContext: "Consumer mobile app available across the EU. Currently live with approximately 50,000 monthly users.",
    },
    expectedTier: "LIMITED",
    expectedScoreRange: [20, 45],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "Should classify as LIMITED (chatbot keyword dominates). If classified HIGH (medical keyword), score range shifts to 20–45. Either is acceptable — test verifies consistent classification across runs.",
  },

  {
    id: "B2",
    group: "B",
    description: "Tier boundary — HR recommendation engine (HIGH vs LIMITED ambiguity)",
    answers: {
      systemDescription: "A recommendation system that suggests relevant job postings to registered candidates based on their profile and browsing history. It does not screen or score candidates.",
      affectedPersons: "Job seekers registered on our platform across EU member states.",
      dataSources: "User profile data, job browsing history, and job listing metadata.",
      existingDocs: "GDPR consent mechanism in place. Recommendation logic documented at high level.",
      deploymentContext: "Live on our job board platform with approximately 500,000 registered users in the EU.",
    },
    expectedTier: "LIMITED",
    expectedScoreRange: [25, 50],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "Should classify as LIMITED or MINIMAL. The system recommends but does not score or rank candidates for hiring decisions — does not meet HIGH risk threshold for recruitment under Annex III.",
  },

  {
    id: "B3",
    group: "B",
    description: "Tier boundary — student performance prediction (HIGH vs MINIMAL ambiguity)",
    answers: {
      systemDescription: "A system that analyses student engagement metrics and predicts which students are at risk of dropping out so that tutors can proactively reach out.",
      affectedPersons: "University students enrolled in online courses.",
      dataSources: "Login frequency, assignment submission times, video watch rates, and forum participation. No grades or personal identifiers used.",
      existingDocs: "Internal data governance policy. Tutor training programme for interpreting predictions.",
      deploymentContext: "Internal tool used by our online university platform. Not sold externally. Live across 3 EU countries.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [30, 55],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "Should classify as HIGH — education keyword triggers. Student at-risk prediction falls under Annex III education category.",
  },

  {
    id: "B4",
    group: "B",
    description: "Tier boundary — deepfake detection tool (LIMITED vs MINIMAL ambiguity)",
    answers: {
      systemDescription: "A tool that analyses images and videos to detect whether they have been synthetically generated or manipulated using AI. Used by fact-checkers and media organisations.",
      affectedPersons: "Media organisations and journalists using the tool, and indirectly the public who consume verified content.",
      dataSources: "Labelled dataset of authentic and AI-generated media. No personal data of end users processed.",
      existingDocs: "Technical methodology documentation published. Accuracy benchmarks publicly available.",
      deploymentContext: "B2B SaaS sold to media organisations in EU. Not consumer-facing.",
    },
    expectedTier: "LIMITED",
    expectedScoreRange: [30, 55],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "Should classify as LIMITED — deepfake/synthetic keywords trigger. Detection tool, not generation tool, but transparency obligations still apply.",
  },

  // ── GROUP C: GPAI Edge Cases ──────────────────────────────────────────────────

  {
    id: "C1",
    group: "C",
    description: "GPAI edge — foundation model with specific vertical use case declared",
    answers: {
      systemDescription: "We provide a foundation model fine-tuned for legal document analysis. The base model is a pretrained transformer. Downstream customers use it to review contracts and flag risk clauses.",
      affectedPersons: "Legal professionals and businesses using the tool to review contracts.",
      dataSources: "General web corpus for pretraining plus a proprietary legal document dataset for fine-tuning.",
      existingDocs: "Technical documentation for the base model. Fine-tuning methodology documented. No formal GPAI compliance assessment yet.",
      deploymentContext: "API sold to law firms and legal tech companies in the EU. Approximately 80 active clients.",
    },
    expectedTier: "GPAI",
    expectedScoreRange: [25, 50],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "GPAI detection should fire on 'foundation model' and 'pretrained'. Vertical fine-tuning does not remove GPAI obligations.",
  },

  {
    id: "C2",
    group: "C",
    description: "GPAI edge — marginal LLM mention buried in longer description",
    answers: {
      systemDescription: "A marketing automation platform that generates personalised email campaigns. Under the hood it uses an LLM for content generation, but the main product is the campaign scheduling and analytics dashboard.",
      affectedPersons: "Marketing teams of B2B companies and their end customers who receive emails.",
      dataSources: "Customer CRM data, email engagement metrics, and product catalogue. The LLM component uses only anonymised prompt inputs.",
      existingDocs: "GDPR DPA in place. Email unsubscribe mechanism compliant with ePrivacy Directive.",
      deploymentContext: "SaaS sold to B2B companies across the EU. Over 200 active clients.",
    },
    expectedTier: "GPAI",
    expectedScoreRange: [20, 45],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "GPAI should fire on 'LLM' keyword even when buried. Tests that inferRiskTier() scans full text including mid-sentence mentions.",
  },

  {
    id: "C3",
    group: "C",
    description: "GPAI edge — input minimo, no documentation, no deployment context",
    answers: {
      systemDescription: "We are building a general purpose AI model for text and code generation.",
      affectedPersons: "Developers and businesses.",
      dataSources: "Publicly available text and code from the internet.",
      existingDocs: "",
      deploymentContext: "",
    },
    expectedTier: "GPAI",
    expectedScoreRange: [5, 20],
    expectedReadiness: "NOT_COMPLIANT",
    notes: "Minimal input GPAI. Verifies that GPAI tier still routes correctly and scores low when no compliance evidence is provided.",
  },

  // ── GROUP D: Score Boundary Cases ────────────────────────────────────────────

  {
    id: "D1",
    group: "D",
    description: "Score ceiling — HIGH tier with full compliance evidence declared",
    answers: {
      systemDescription: "An AI system used for credit scoring that evaluates loan applications for retail banking customers.",
      affectedPersons: "Retail banking customers applying for loans across EU member states.",
      dataSources: "Credit history, income data, and behavioural banking data. All data sourced with explicit consent and documented under GDPR.",
      existingDocs: "Conformity assessment completed and notified body certificate obtained. Full technical documentation package including risk management system, data governance policy, bias testing results across protected characteristics, human oversight workflow, audit logging system, post-market monitoring plan, and incident reporting pipeline. Annual independent audit conducted.",
      deploymentContext: "Production system live in Italy, Germany, and France for 3 years. Registered in EU high-risk AI database. Approximately 500,000 loan assessments processed annually.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [82, 95],
    expectedReadiness: "COMPLIANT",
    notes: "Tests score ceiling. Full documentation stack declared — score must reach COMPLIANT range (82–95).",
  },

  {
    id: "D2",
    group: "D",
    description: "Score floor — HIGH tier with zero compliance, active risk signals",
    answers: {
      systemDescription: "We use an AI model to score job candidates automatically. The system makes final hiring decisions without human review.",
      affectedPersons: "Job applicants.",
      dataSources: "CV data and social media profiles.",
      existingDocs: "None.",
      deploymentContext: "Internal tool, not yet live.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [5, 20],
    expectedReadiness: "NOT_COMPLIANT",
    notes: "Tests score floor. Zero compliance evidence plus automated final decisions without human oversight — score must stay below 20.",
  },

  // ── GROUP E: Input Stress Tests ───────────────────────────────────────────────

  {
    id: "E1",
    group: "E",
    description: "Stress test — minimal monosyllabic inputs",
    answers: {
      systemDescription: "AI tool for recruitment scoring of candidates.",
      affectedPersons: "Candidates.",
      dataSources: "CVs.",
      existingDocs: "Some docs.",
      deploymentContext: "EU.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [5, 35],
    expectedReadiness: "NOT_COMPLIANT",
    notes: "Tests parser robustness with extremely short inputs. Tool_use block must still be returned. Score expected low due to minimal evidence.",
  },

  {
    id: "E2",
    group: "E",
    description: "Stress test — full inputs in Italian",
    answers: {
      systemDescription: "Utilizziamo un sistema di intelligenza artificiale per valutare automaticamente i curriculum vitae dei candidati e assegnare un punteggio per la selezione del personale.",
      affectedPersons: "Candidati di lavoro in tutta Italia e nell'Unione Europea.",
      dataSources: "Testo del curriculum, profili LinkedIn e dati storici sulle assunzioni degli ultimi cinque anni.",
      existingDocs: "Abbiamo un accordo GDPR, documentazione tecnica di base e un processo di revisione umana per i candidati scartati.",
      deploymentContext: "Strumento SaaS venduto a reparti HR in Italia, Francia e Germania. Attualmente attivo con circa 30 clienti enterprise.",
    },
    expectedTier: "HIGH",
    expectedScoreRange: [35, 65],
    expectedReadiness: "PARTIALLY_COMPLIANT",
    notes: "Tests that the model handles Italian-language inputs correctly. Tier classification relies on keyword matching — verify that Italian text still triggers HIGH via 'curriculum', 'selezione del personale' etc. OR that the model infers correctly from context.",
  },

];

