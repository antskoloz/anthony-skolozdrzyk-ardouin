import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isLive } from '../lib/publish';
import { blogPillars } from '../data/blog-pillars';
import { SITE_URL, AUTHOR_NAME } from '../consts';

// Payments content is deliberately absent: the list is built from the topic
// pillars, which exclude it (ADR-010).
const tools = [
  ['A/B Test Calculator', 'ab-test-calculator', 'Sample size before a test and a plain-English verdict after it.'],
  ['Chi-Square Calculator', 'chi-square-calculator', 'Whether two or more groups really convert differently.'],
  ['Marketing ROI Calculator', 'marketing-roi-calculator', 'ROAS, CAC, LTV and CAC payback from one set of inputs.'],
  ['UTM Link Builder', 'utm-builder', 'Consistently tagged campaign links.'],
  ['SaaS Metrics & Runway Calculator', 'saas-metrics-calculator', 'MRR, churn, NRR, quick ratio, Rule of 40, burn multiple and runway.'],
  ['RICE / ICE Prioritizer', 'rice-prioritizer', 'Score and rank roadmap ideas.'],
  ['Break-even & Pricing Calculator', 'break-even-pricing-calculator', 'Margin vs markup, break-even units and the real cost of a discount.'],
  ['Company Valuation Calculator', 'company-valuation-calculator', 'An educational walkthrough of WACC, free cash flow, DCF and EPS.'],
] as const;

export const GET: APIRoute = async () => {
  const live = await getCollection('blog', ({ data }) => isLive(data));
  const byId = new Map(live.map((p) => [p.id, p]));

  const lines: string[] = [
    `# ${AUTHOR_NAME}`,
    '',
    '> Practical notes on SQL, Power BI, AI for analysts, RevOps, marketing measurement and SaaS metrics, plus free calculators for marketers, product managers and finance teams. Blog posts are in English.',
    '',
    '## Key pages',
    `- [Homepage](${SITE_URL}/)`,
    `- [Blog](${SITE_URL}/blog/)`,
    `- [Blog topics](${SITE_URL}/blog/topics/)`,
    '',
  ];

  for (const pillar of blogPillars) {
    const posts = pillar.postSlugs.flatMap((id) => byId.get(id) ?? []);
    if (posts.length === 0) continue;
    lines.push(`## ${pillar.name}`, '', `${pillar.intro} Hub: ${SITE_URL}/blog/topics/${pillar.slug}/`, '');
    for (const post of posts) {
      lines.push(`- [${post.data.title}](${SITE_URL}/blog/${post.id}/): ${post.data.description}`);
    }
    lines.push('');
  }

  lines.push('## Free tools', '');
  for (const [name, slug, summary] of tools) {
    lines.push(`- [${name}](${SITE_URL}/projects/${slug}/): ${summary}`);
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
