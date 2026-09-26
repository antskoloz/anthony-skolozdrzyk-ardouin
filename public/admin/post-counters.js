/*
 * Decap CMS: status counters + filter buttons above the Blog list (ADR-009).
 * Reads each entry's summary line ("Title — ✅ Published — Sep 26, 2026, 15:26"),
 * classifies it as published / scheduled / draft, and lets the buttons hide the rest.
 * Display only: it never changes any content.
 */
(function () {
  var MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  var TZ = 'Europe/Berlin';

  // Today's calendar day in Berlin, as a comparable number (YYYYMMDD).
  function todayKey(now) {
    var parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(now || new Date()).split('-');
    return Number(parts[0]) * 10000 + Number(parts[1]) * 100 + Number(parts[2]);
  }

  // Returns 'draft' | 'published' | 'scheduled' (or null if the text is not a post summary).
  function classify(text, now) {
    if (/Draft/.test(text)) return 'draft';
    if (!/Published|Scheduled/.test(text)) return null;
    var m = text.match(/([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/);
    if (!m || !MONTHS[m[1]]) return 'published';
    var key = Number(m[3]) * 10000 + MONTHS[m[1]] * 100 + Number(m[2]);
    return key > todayKey(now) ? 'scheduled' : 'published';
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { classify: classify, todayKey: todayKey };
    return;
  }

  var LINK = 'a[href*="/collections/blog/entries/"]';
  var BAR_ID = 'post-counters-bar';
  var active = 'all';
  var busy = false;

  var LABELS = { all: 'Total', published: 'Published', scheduled: 'Scheduled', draft: 'Drafts' };
  var COLORS = { all: '#1e293b', published: '#16a34a', scheduled: '#d97706', draft: '#64748b' };

  // The card is the outermost element that wraps only this one entry.
  function cardOf(a) {
    var el = a;
    while (el.parentElement && el.parentElement.querySelectorAll(LINK).length === 1) el = el.parentElement;
    return el;
  }

  function onBlogList() {
    return /#\/collections\/blog\/?(\?.*)?$/.test(location.hash) || /#\/collections\/blog\/?$/.test(location.hash);
  }

  function ensureBar() {
    var bar = document.getElementById(BAR_ID);
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px;';
    Object.keys(LABELS).forEach(function (key) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-filter', key);
      b.style.cssText = 'cursor:pointer;border:2px solid ' + COLORS[key] + ';border-radius:8px;padding:8px 14px;font:600 14px/1.2 inherit;background:#fff;color:' + COLORS[key] + ';';
      b.addEventListener('click', function () {
        active = active === key ? 'all' : key;
        update();
      });
      bar.appendChild(b);
    });
    return bar;
  }

  function place(bar, links) {
    var top = document.querySelector('[class*="CollectionTopContainer"]');
    if (top && top.parentElement) {
      if (top.nextSibling !== bar) top.parentElement.insertBefore(bar, top.nextSibling);
      return;
    }
    var first = cardOf(links[0]);
    var list = first.parentElement;
    if (list && list.previousSibling !== bar) list.parentElement.insertBefore(bar, list);
  }

  function update() {
    if (busy) return;
    busy = true;
    try {
      var bar = document.getElementById(BAR_ID);
      if (!onBlogList()) { if (bar) bar.remove(); return; }
      var links = Array.prototype.slice.call(document.querySelectorAll(LINK));
      if (!links.length) return;

      var counts = { all: 0, published: 0, scheduled: 0, draft: 0 };
      var items = links.map(function (a) {
        var status = classify(a.textContent);
        if (status === 'scheduled') a.innerHTML = a.innerHTML.replace('✅ Published', '⏰ Scheduled');
        return { card: cardOf(a), status: status };
      });
      items.forEach(function (it) { if (it.status) { counts.all++; counts[it.status]++; } });

      bar = ensureBar();
      place(bar, links);
      Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
        var key = b.getAttribute('data-filter');
        b.textContent = LABELS[key] + ': ' + counts[key];
        var on = active === key;
        b.style.background = on ? COLORS[key] : '#fff';
        b.style.color = on ? '#fff' : COLORS[key];
      });
      items.forEach(function (it) {
        it.card.style.display = active === 'all' || it.status === active ? '' : 'none';
      });
    } finally {
      busy = false;
    }
  }

  var timer;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(update, 60);
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', function () { active = 'all'; setTimeout(update, 60); });
})();
