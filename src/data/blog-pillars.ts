// Hand-curated topic pillars for the blog's hub pages (/blog/topics/<slug>/).
// Not derived from `tags` (too granular/noisy — see specs/blog.md) and not a
// content-collection field, so adding or reassigning a post is a one-line
// change here rather than an edit to any Markdown file. See decisions.md
// ADR-010.

export interface BlogPillarTool {
  label: string;
  href: string;
}

export interface BlogPillar {
  slug: string;
  name: string;
  intro: string;
  postSlugs: string[];
  tools?: BlogPillarTool[];
}

export const blogPillars: BlogPillar[] = [
  {
    slug: 'sql-analytics',
    name: 'SQL & Local Analytics',
    intro:
      'Practical SQL for analysts — the patterns you actually reuse, from joins and window functions to running analytics locally with DuckDB.',
    postSlugs: [
      'sql-window-functions',
      'sql-joins-explained-inner-left-right-full',
      'sql-group-by-vs-having-vs-where',
      'sql-cte-vs-subquery-vs-temp-table-which-to-use',
      'sql-cheat-sheet-for-data-analysts-15-queries-you-will-reuse',
      'sql-date-functions-fiscal-calendars-week-starts-time-zones',
      'find-and-fix-duplicate-rows-in-sql',
      'cohort-retention-analysis-in-sql-step-by-step',
      'why-your-sql-query-is-slow-reading-an-execution-plan',
      'duckdb-for-analysts-local-analytics-without-a-warehouse',
      'sql-interview-questions-analysts-are-actually-asked',
      'prompting-an-llm-for-sql-you-can-trust',
      'text-to-sql-tools-compared',
    ],
  },
  {
    slug: 'power-bi-dax',
    name: 'Power BI & DAX',
    intro:
      'Modeling, DAX and performance for Power BI — star schemas, CALCULATE, time intelligence, and what actually makes reports fast.',
    postSlugs: [
      'power-bi-star-schema-for-beginners',
      'dax-calculate-explained-filter-context-in-plain-english',
      'dax-variables-var-why-they-fix-half-your-measures',
      'power-bi-time-intelligence-ytd-yoy-rolling-12-months',
      'power-query-vs-dax-where-each-step-belongs',
      'power-bi-design-model-first-then-calculation-groups',
      'power-bi-row-level-security-a-practical-setup',
      'power-bi-vs-tableau-how-an-analyst-chooses',
      'power-bi-copilot-what-it-can-and-cant-do_1',
      'slow-power-bi-report-7-fixes-in-order-of-payoff',
      'git-github-llm-power-bi-dax-m-workflow',
      'kpi-dashboard-best-practices-people-actually-open',
    ],
  },
  {
    slug: 'ai-for-analysts',
    name: 'AI for Analysts',
    intro:
      "Where AI genuinely helps an analyst's workflow, where it fails, and how to validate what it produces before it reaches a stakeholder.",
    postSlugs: [
      'which-analyst-tasks-to-hand-to-ai-and-which-to-keep',
      'how-to-validate-ai-generated-analysis-before-it-reaches-your-boss',
      'why-llms-hallucinate-numbers-in-analytics',
      'why-ai-analysts-fail-on-bad-metric-definitions',
      'semantic-layer-for-ai-what-it-is-and-why-analytics-needs-one',
      'building-a-simple-data-analyst-ai-agent-with-claude',
      'claude-code-for-data-analysis-a-beginner-setup',
      'prompting-an-llm-for-sql-you-can-trust',
      'text-to-sql-tools-compared',
      'git-github-llm-power-bi-dax-m-workflow',
    ],
  },
  {
    slug: 'revops-forecasting',
    name: 'RevOps & Forecasting',
    intro:
      'Revenue operations and sales forecasting — data quality audits, benchmark reality checks, and forecast accuracy without sandbagging.',
    postSlugs: [
      'revops-data-quality-audit-10-point-checklist',
      'revops-benchmarks-2026-what-gartner-says',
      'sales-forecast-accuracy-wape-bias-sandbagging',
      'cohort-based-revenue-forecasting-for-ecommerce',
    ],
  },
  {
    slug: 'marketing-measurement',
    name: 'Marketing Measurement & Experimentation',
    intro:
      'Attribution, incrementality and A/B testing done right — how to tell whether a marketing result is real or noise.',
    postSlugs: [
      'attribution-vs-incrementality-vs-mmm',
      'ab-test-sample-size-and-significance-explained',
      'common-ab-testing-mistakes-that-invalidate-results',
      'chi-square-test-explained',
      'utm-parameters-explained-a-naming-convention-that-works',
      'why-platform-reported-conversions-overstate-impact',
    ],
    tools: [
      { label: 'A/B Test Calculator', href: '/projects/ab-test-calculator/' },
      { label: 'Chi-Square Calculator', href: '/projects/chi-square-calculator/' },
      { label: 'UTM Link Builder', href: '/projects/utm-builder/' },
      { label: 'Marketing ROI Calculator', href: '/projects/marketing-roi-calculator/' },
    ],
  },
  {
    slug: 'analyst-craft',
    name: 'Analyst Craft & Authority',
    intro:
      'The non-technical half of the job — storytelling, portfolios, metric definitions and prioritization that make analysis land.',
    postSlugs: [
      'data-storytelling-for-non-technical-stakeholders',
      'data-analyst-portfolio-projects-that-get-interviews',
      'metric-definition-doc-with-a-template',
      'excel-vs-sql-vs-power-bi-how-to-choose',
      'rice-prioritization-framework-explained',
      'kpi-dashboard-best-practices-people-actually-open',
      'sql-interview-questions-analysts-are-actually-asked',
      'why-ai-analysts-fail-on-bad-metric-definitions',
    ],
    tools: [{ label: 'RICE / ICE Prioritizer', href: '/projects/rice-prioritizer/' }],
  },
  {
    slug: 'saas-pricing',
    name: 'SaaS Metrics & Pricing',
    intro:
      'The numbers behind a SaaS business — MRR and churn, CAC payback, break-even pricing, and how an early-stage company gets valued.',
    postSlugs: [
      'saas-metrics-that-matter-mrr-churn-ltv-nrr',
      'cac-payback-period-explained',
      'break-even-analysis-for-pricing-step-by-step',
      'how-to-value-an-early-stage-saas-company',
    ],
    tools: [
      { label: 'SaaS Metrics & Runway Calculator', href: '/projects/saas-metrics-calculator/' },
      { label: 'Break-even & Pricing Calculator', href: '/projects/break-even-pricing-calculator/' },
      { label: 'Company Valuation Calculator', href: '/projects/company-valuation-calculator/' },
    ],
  },
];

export function getPillarsForSlug(id: string): BlogPillar[] {
  return blogPillars.filter((p) => p.postSlugs.includes(id));
}
