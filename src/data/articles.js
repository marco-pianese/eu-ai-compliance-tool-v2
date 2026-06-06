/**
 * EU AI Act — Knowledge Base
 * Regulation (EU) 2024/1689 — Official Journal 12.7.2024
 * Source: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
 *
 * Structure: modular per article — ready for v2 auto-update via EUR-Lex monitoring
 * Last verified: May 2026
 */

export const EU_AI_ACT_META = {
  regulation: "Regulation (EU) 2024/1689",
  title: "Artificial Intelligence Act",
  published: "2024-07-12",
  inForce: "2024-08-01",
  source: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  applicationDates: {
    prohibitedPractices: "2025-02-02",
    gpaiAndGovernance: "2025-08-02",
    highRiskSystems: "2026-08-02",
    highRiskProductSafety: "2027-08-02",
  },
};

export const ARTICLES = {

  // ─── PROHIBITED PRACTICES ────────────────────────────────────────────────────

  art5: {
    id: "art5",
    number: "Article 5",
    title: "Prohibited AI Practices",
    applicationDate: "2025-02-02",
    status: "IN_FORCE",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_5",
    summary:
      "Prohibits AI systems that manipulate human behavior subliminally, exploit vulnerabilities, perform social scoring, use real-time biometric identification in public spaces for law enforcement (with narrow exceptions), and conduct predictive policing based solely on profiling.",
    keyObligations: [
      "Do not deploy AI systems that use subliminal or manipulative techniques to distort human behavior causing significant harm",
      "Do not exploit vulnerabilities of specific groups (age, disability, social/economic situation)",
      "Do not implement social scoring systems by public or private actors",
      "Do not use real-time remote biometric identification in publicly accessible spaces for law enforcement (except narrow exceptions)",
      "Do not use AI for predictive policing based solely on profiling of individuals",
      "Do not use biometric categorization to infer sensitive attributes (race, religion, sexual orientation, etc.)",
    ],
    riskIfNonCompliant: "Fines up to €35 million or 7% of global annual turnover",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },

  // ─── HIGH-RISK CLASSIFICATION ────────────────────────────────────────────────

  art6: {
    id: "art6",
    number: "Article 6 + Annex III",
    title: "Classification Rules for High-Risk AI Systems",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_6",
    summary:
      "Defines high-risk AI systems as those embedded in regulated products (Annex I) or listed in Annex III sectors: biometric identification, critical infrastructure, education, employment, essential services, law enforcement, migration, administration of justice, democratic processes.",
    keyObligations: [
      "Determine if your AI system qualifies as high-risk under Annex I (product safety) or Annex III (specific sectors)",
      "Register high-risk AI systems in the EU database before placing on market",
      "Apply conformity assessment before deployment",
      "Maintain high-risk classification throughout the lifecycle unless deregistered",
    ],
    annex3Sectors: [
      "Biometric identification and categorisation",
      "Critical infrastructure management",
      "Education and vocational training",
      "Employment and workers management",
      "Essential private and public services (credit scoring, insurance)",
      "Law enforcement",
      "Migration, asylum and border control",
      "Administration of justice",
      "Democratic processes and elections",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },

  art7: {
    id: "art7",
    number: "Article 7",
    title: "Amendments to Annex III",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_7",
    summary:
      "Empowers the European Commission to update the list of high-risk AI systems in Annex III via delegated acts, ensuring the regulation remains current as AI technology evolves.",
    keyObligations: [
      "Monitor Commission delegated acts that may expand or modify Annex III high-risk categories",
      "Reassess your AI system classification whenever Annex III is updated",
      "Implement a regulatory monitoring process to track changes to the high-risk list",
      "Adjust compliance programs promptly when new high-risk categories are introduced",
    ],
    riskIfNonCompliant: "Failure to reclassify may result in fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  // ─── HIGH-RISK PROVIDER OBLIGATIONS ─────────────────────────────────────────

  art9: {
    id: "art9",
    number: "Article 9",
    title: "Risk Management System",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_9",
    summary:
      "Requires providers of high-risk AI systems to establish, implement, document and maintain a risk management system throughout the entire lifecycle of the system.",
    keyObligations: [
      "Establish a continuous, iterative risk management process across the AI lifecycle",
      "Identify and analyse known and reasonably foreseeable risks",
      "Estimate and evaluate risks that may emerge from intended use and foreseeable misuse",
      "Adopt suitable risk mitigation and control measures",
      "Test AI systems to identify the most appropriate risk management measures",
      "Document all risk management activities and decisions",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art10: {
    id: "art10",
    number: "Article 10",
    title: "Data and Data Governance",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_10",
    summary:
      "Requires that training, validation and testing datasets for high-risk AI systems meet quality criteria including relevance, representativeness, and freedom from errors and biases.",
    keyObligations: [
      "Implement data governance and management practices for training/validation/testing data",
      "Ensure datasets are relevant, representative, free of errors and complete",
      "Examine datasets for biases that could lead to discrimination",
      "Identify and address data gaps and shortcomings",
      "Document data provenance, collection methods, and preprocessing operations",
      "Apply appropriate data protection measures (GDPR alignment)",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art11: {
    id: "art11",
    number: "Article 11",
    title: "Technical Documentation",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_11",
    summary:
      "Providers of high-risk AI systems must draw up technical documentation before placing the system on the market, demonstrating compliance with all applicable requirements. Documentation must be kept up to date.",
    keyObligations: [
      "Prepare comprehensive technical documentation before market placement (per Annex IV)",
      "Include general description of the AI system and its intended purpose",
      "Document design specifications, development process, and training methodologies",
      "Describe monitoring, functioning and control of the AI system",
      "Include information on validation and testing procedures and results",
      "Keep technical documentation updated throughout the system lifecycle",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art12: {
    id: "art12",
    number: "Article 12",
    title: "Record-keeping and Logging",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_12",
    summary:
      "High-risk AI systems must automatically generate logs throughout their operation to ensure traceability of decisions and enable post-hoc auditing and investigation of incidents.",
    keyObligations: [
      "Implement automatic logging capabilities throughout the AI system operation",
      "Ensure logs enable traceability of results throughout the system lifecycle",
      "Record period of each use, reference database against which input was checked",
      "Log input data that led to the system's output (where technically feasible)",
      "Retain logs for minimum periods defined by applicable law or deployer obligations",
      "Make logs available to national competent authorities upon request",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art13: {
    id: "art13",
    number: "Article 13",
    title: "Transparency and Provision of Information",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_13",
    summary:
      "High-risk AI systems must be designed to ensure deployers can understand the system's capabilities and limitations, enabling informed oversight and correct use.",
    keyObligations: [
      "Design AI systems with appropriate level of transparency",
      "Provide instructions for use including identity and contact details of provider",
      "Document capabilities and limitations of the system",
      "Describe level of accuracy and robustness, including known biases",
      "Specify circumstances that may affect system performance",
      "Describe human oversight measures and interface characteristics",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },

  art14: {
    id: "art14",
    number: "Article 14",
    title: "Human Oversight",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_14",
    summary:
      "High-risk AI systems must be designed to allow effective human oversight during their use, with built-in tools enabling humans to monitor, understand, intervene, and override AI decisions.",
    keyObligations: [
      "Build-in human-machine interface tools to allow effective oversight",
      "Enable humans to fully understand capabilities and limitations of the AI system",
      "Implement ability to disregard, override or reverse AI system outputs",
      "Implement ability to intervene or interrupt the system via a stop button",
      "Ensure designated persons have competence, training and authority to oversee",
      "Monitor the AI system for anomalies, dysfunctions and unexpected performance",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },

  art15: {
    id: "art15",
    number: "Article 15",
    title: "Accuracy, Robustness and Cybersecurity",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_15",
    summary:
      "High-risk AI systems must achieve appropriate levels of accuracy, robustness, and cybersecurity throughout their lifecycle, with resilience against errors, faults, and adversarial attacks.",
    keyObligations: [
      "Design systems to achieve appropriate accuracy levels for their intended purpose",
      "Implement resilience against errors, faults, and inconsistencies in inputs",
      "Ensure technical robustness against attempts to alter system behavior (adversarial attacks)",
      "Apply appropriate cybersecurity measures proportionate to risks",
      "Implement fallback plans and fail-safe mechanisms",
      "Document accuracy metrics and testing results across different demographic groups",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art16: {
    id: "art16",
    number: "Article 16",
    title: "Obligations of Providers of High-Risk AI Systems",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_16",
    summary:
      "Consolidates the full set of obligations for providers of high-risk AI systems, covering the complete compliance lifecycle from design through post-market monitoring.",
    keyObligations: [
      "Ensure the AI system complies with all high-risk requirements before market placement",
      "Establish, maintain and document a quality management system (Art. 17)",
      "Draw up technical documentation and keep it updated (Art. 11)",
      "Keep logs automatically generated by the system (Art. 12)",
      "Affix CE marking and register the system in the EU database",
      "Take corrective action and report serious incidents to authorities",
      "Cooperate with national competent authorities upon request",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art17: {
    id: "art17",
    number: "Article 17",
    title: "Quality Management System",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_17",
    summary:
      "Providers of high-risk AI systems must put in place a quality management system ensuring compliance, documented in a systematic and orderly manner.",
    keyObligations: [
      "Establish and maintain a documented quality management system",
      "Define strategy for regulatory compliance including conformity assessments",
      "Implement techniques for AI system design and development control",
      "Implement validation and testing procedures with performance metrics",
      "Establish post-market monitoring system",
      "Define accountability procedures including management responsibilities",
      "Implement resource management including data access and governance",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  // ─── DEPLOYER OBLIGATIONS ────────────────────────────────────────────────────

  art26: {
    id: "art26",
    number: "Article 26",
    title: "Obligations of Deployers of High-Risk AI Systems",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_26",
    summary:
      "Organizations deploying high-risk AI systems must ensure appropriate use in accordance with provider instructions, implement human oversight, conduct data protection impact assessments where required, and inform affected individuals.",
    keyObligations: [
      "Use the AI system in accordance with the provider's instructions for use",
      "Assign human oversight to competent and trained natural persons",
      "Monitor the AI system's operation and report incidents to the provider",
      "Conduct a data protection impact assessment (DPIA) where required by GDPR",
      "Inform employees and worker representatives before deploying AI in the workplace",
      "Inform affected natural persons that they are subject to a high-risk AI system",
      "Keep logs generated by the system for minimum retention periods",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "procurement"],
  },

  // ─── CONFORMITY ASSESSMENT ───────────────────────────────────────────────────

  art43: {
    id: "art43",
    number: "Article 43",
    title: "Conformity Assessment",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_43",
    summary:
      "High-risk AI systems must undergo a conformity assessment before market placement. Most Annex III systems may use internal assessment; biometric and critical infrastructure systems require a notified body.",
    keyObligations: [
      "Conduct conformity assessment before placing the high-risk AI system on the market",
      "Follow the appropriate conformity assessment procedure (Annex VI or Annex VII)",
      "Engage a notified body for biometric identification and law enforcement systems",
      "Issue EU declaration of conformity after successful assessment",
      "Affix CE marking to the AI system upon completion of conformity assessment",
      "Repeat conformity assessment when making substantial modifications to the system",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover; system may be withdrawn from market",
    relevantProfiles: ["compliance", "vendor"],
  },

  // ─── EU DATABASE REGISTRATION ────────────────────────────────────────────────

  art71: {
    id: "art71",
    number: "Article 71",
    title: "EU Database for High-Risk AI Systems",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_71",
    summary:
      "Providers and deployers of high-risk AI systems listed in Annex III must register their systems in the EU database before market placement or deployment, ensuring public transparency.",
    keyObligations: [
      "Register high-risk AI system in the EU database before placing on the market",
      "Provide all required information including system name, version, and intended purpose",
      "Identify the categories of persons and groups likely to be affected",
      "Describe the geographic areas where the system is intended to be used",
      "Keep registration information updated throughout the system lifecycle",
      "Deployers of public authority systems must also register in the EU database",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },

  // ─── POST-MARKET MONITORING ──────────────────────────────────────────────────

  art72: {
    id: "art72",
    number: "Article 72",
    title: "Post-Market Monitoring",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_72",
    summary:
      "Providers of high-risk AI systems must establish and implement a post-market monitoring system to proactively collect and review data on system performance in real-world conditions.",
    keyObligations: [
      "Establish a post-market monitoring plan before market placement",
      "Actively collect, document, and analyse data on system performance in deployment",
      "Identify and report serious incidents and malfunctions to competent authorities",
      "Take immediate corrective action when risks are identified post-deployment",
      "Document all post-market monitoring activities and findings",
      "Share post-market monitoring data with notified bodies upon request",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  // ─── LIMITED RISK — TRANSPARENCY OBLIGATIONS ─────────────────────────────────

  art50: {
    id: "art50",
    number: "Article 50",
    title: "Transparency Obligations for Certain AI Systems",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_50",
    summary:
      "AI systems interacting directly with humans (chatbots), generating synthetic content (deepfakes), or used for emotion recognition must disclose their AI nature to users.",
    keyObligations: [
      "Inform users they are interacting with an AI system (chatbots, virtual assistants)",
      "Label AI-generated content, synthetic audio, video, and images as artificially generated",
      "Disclose when emotion recognition or biometric categorisation systems are in use",
      "Ensure AI-generated content is machine-detectable where technically feasible",
      "Do not use AI-generated content to deceive users about its artificial nature",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },

  // ─── GENERAL PURPOSE AI (GPAI) ───────────────────────────────────────────────

  art51: {
    id: "art51",
    number: "Article 51",
    title: "Classification of GPAI Models with Systemic Risk",
    applicationDate: "2025-08-02",
    status: "IN_FORCE",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_51",
    summary:
      "General-purpose AI models are classified as posing systemic risk if trained with a compute exceeding 10^25 FLOPs or if designated by the Commission based on capability assessments.",
    keyObligations: [
      "Assess whether your GPAI model meets the systemic risk threshold (10^25 FLOPs training compute)",
      "Notify the AI Office if your model reaches or approaches the systemic risk threshold",
      "Monitor Commission decisions designating specific models as systemic risk",
      "Apply enhanced obligations if your model is classified as systemic risk",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art52: {
    id: "art52",
    number: "Article 52",
    title: "Obligations for Providers of GPAI Models",
    applicationDate: "2025-08-02",
    status: "IN_FORCE",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_52",
    summary:
      "All providers of general-purpose AI models must prepare technical documentation, provide information to downstream providers, maintain copyright compliance policies, and publish summaries of training data.",
    keyObligations: [
      "Prepare and maintain up-to-date technical documentation for the GPAI model",
      "Provide information and documentation to downstream AI system providers",
      "Implement a copyright compliance policy (respect opt-outs under DSM Directive)",
      "Publish a sufficiently detailed summary of training data used",
      "Register the GPAI model in the EU database when available",
      "Cooperate with the AI Office and national competent authorities",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art53: {
    id: "art53",
    number: "Article 53",
    title: "Technical Documentation for GPAI Models",
    applicationDate: "2025-08-02",
    status: "IN_FORCE",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_53",
    summary:
      "GPAI model providers must prepare technical documentation covering training methodology, data used, capabilities and limitations, and evaluation results, structured per Annex XI.",
    keyObligations: [
      "Document general description of the GPAI model and its intended purpose",
      "Describe training methodology, compute used, and training data sources",
      "Document model capabilities, known limitations, and foreseeable misuse scenarios",
      "Include results of evaluations, red-teaming, and adversarial testing",
      "Describe information provided to downstream providers for integration",
      "Keep documentation updated with each significant model update",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  art55: {
    id: "art55",
    number: "Article 55",
    title: "Obligations for GPAI Models with Systemic Risk",
    applicationDate: "2025-08-02",
    status: "IN_FORCE",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_55",
    summary:
      "Providers of GPAI models with systemic risk must perform model evaluations, adversarial testing, track and report serious incidents, and implement cybersecurity measures.",
    keyObligations: [
      "Perform model evaluations including adversarial testing (red-teaming) before release",
      "Assess and mitigate systemic risks including at EU level",
      "Track, document and report serious incidents and corrective measures to the AI Office",
      "Ensure adequate cybersecurity protection for the model and its infrastructure",
      "Conduct ongoing monitoring and post-deployment evaluation of systemic risks",
      "Share evaluation results with the AI Office upon request",
    ],
    riskIfNonCompliant: "Fines up to €15 million or 3% of global annual turnover",
    relevantProfiles: ["compliance", "vendor"],
  },

  // ─── PENALTIES ───────────────────────────────────────────────────────────────

  art99: {
    id: "art99",
    number: "Article 99",
    title: "Penalties",
    applicationDate: "2026-08-02",
    status: "UPCOMING",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_99",
    summary:
      "Defines administrative fines for non-compliance, with penalties tiered by severity of the violation. Member States must implement additional penalties at national level.",
    keyObligations: [
      "Violations of prohibited practices (Art. 5): up to €35M or 7% global turnover",
      "Non-compliance with high-risk obligations: up to €15M or 3% global turnover",
      "Provision of incorrect information to authorities: up to €7.5M or 1% global turnover",
      "SMEs and startups subject to lower of the two thresholds",
      "National authorities may impose additional penalties under national law",
    ],
    riskIfNonCompliant: "This article defines the penalties themselves",
    relevantProfiles: ["compliance", "vendor", "procurement"],
  },
};

// ─── Article ID sets by risk tier (used by deriveArticleIds in App.jsx) ───────

export const ARTICLES_BY_TIER = {
  UNACCEPTABLE: ["art5", "art99"],
  HIGH: [
    "art5", "art6", "art7", "art9", "art10", "art11", "art12",
    "art13", "art14", "art15", "art16", "art17", "art26",
    "art43", "art71", "art72", "art99",
  ],
  LIMITED: ["art5", "art13", "art50", "art99"],
  MINIMAL: ["art5", "art99"],
  GPAI: ["art51", "art52", "art53", "art55"],
};

// ─── Legacy profile-based mapping (kept for backwards compatibility) ──────────

export const ARTICLES_BY_PROFILE = {
  compliance: ["art5", "art6", "art9", "art10", "art13", "art14", "art17", "art99"],
  vendor: ["art5", "art6", "art9", "art10", "art13", "art14", "art17", "art99"],
  procurement: ["art5", "art6", "art13", "art14", "art99"],
};