// A post is live when it is not a draft and its Publish Date (calendar day,
// Europe/Berlin) is today or earlier. Future-dated posts are "scheduled" (ADR-009).
const TZ = 'Europe/Berlin';

const dayKey = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

export function isLive(data: { draft: boolean; pubDate: Date }, now: Date = new Date()): boolean {
  return !data.draft && dayKey(data.pubDate) <= dayKey(now);
}
