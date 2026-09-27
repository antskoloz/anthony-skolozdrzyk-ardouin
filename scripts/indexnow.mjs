// Pings IndexNow (Bing, Yandex, Seznam, Naver) with the site's public URLs
// after a deploy. The URL list comes from the live /llms.txt, which is built
// from the blog topic pillars and so already leaves payments content out
// (ADR-010, ADR-011). Never fails the workflow: problems are logged only.

const HOST = 'anthonysko.com';
const KEY = 'e21570c5322aff30c38d9202638323c3';
const ORIGIN = `https://${HOST}`;

async function main() {
  const res = await fetch(`${ORIGIN}/llms.txt`);
  if (!res.ok) throw new Error(`llms.txt returned ${res.status}`);
  const text = await res.text();

  const found = text.match(/https:\/\/anthonysko\.com\/[^\s)]*/g) ?? [];
  const urlList = [...new Set([`${ORIGIN}/`, `${ORIGIN}/fr/`, `${ORIGIN}/de/`, ...found])];

  const ping = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
  });
  console.log(`IndexNow: submitted ${urlList.length} URLs, status ${ping.status}`);
  if (ping.status !== 200 && ping.status !== 202) {
    console.warn(`::warning::IndexNow returned ${ping.status}: ${await ping.text()}`);
  }
}

main().catch((err) => console.warn(`::warning::IndexNow ping skipped: ${err.message}`));
