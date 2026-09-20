// Share & favorites bar. The social and email buttons are plain links that work without JavaScript;
// this script only enables "Copy link" and "Add to favorites" and reports clicks to the existing GA4 tag.
// No third-party script or widget is loaded.
(function () {
  var bar = document.querySelector('.share-bar');
  if (!bar) return;
  var status = bar.querySelector('.share-status');
  var say = function (text) { if (status) status.textContent = text; };
  var canonical = document.querySelector('link[rel="canonical"]');
  var pageUrl = canonical ? canonical.href : location.href;

  bar.querySelectorAll('[data-share-js]').forEach(function (el) { el.hidden = false; });

  function bookmarkHint() {
    var ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return 'Tap the Share icon in Safari, then choose "Add Bookmark" or "Add to Favorites".';
    if (/Android/i.test(ua)) return 'Open your browser menu (the three dots), then tap the star or "Add to bookmarks".';
    if (/Mac/i.test(navigator.platform || ua)) return 'Press ⌘ + D to add this page to your favorites.';
    return 'Press Ctrl + D to add this page to your favorites.';
  }

  function copyLink() {
    var done = function () { say('Link copied.'); };
    var fallback = function () {
      var box = document.createElement('textarea');
      box.value = pageUrl;
      box.setAttribute('readonly', '');
      box.style.position = 'fixed';
      box.style.opacity = '0';
      document.body.appendChild(box);
      box.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(box);
      if (ok) done(); else say('Copy failed. The link is: ' + pageUrl);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pageUrl).then(done, fallback);
    else fallback();
  }

  bar.addEventListener('click', function (e) {
    var el = e.target.closest('[data-share]');
    if (!el) return;
    var method = el.getAttribute('data-share');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'share', { method: method, content_type: bar.getAttribute('data-type') || 'page', item_id: pageUrl });
    }
    if (method === 'copy') copyLink();
    else if (method === 'bookmark') say(bookmarkHint());
    else say('');
  });
})();
