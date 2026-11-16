/* ------------------------------------------------------------------
   Google Analytics 4, for israrahmed919.github.io

   ONE THING TO SET: paste your Measurement ID between the quotes.

   Get it at analytics.google.com:
     Admin  ->  Create property  ->  name it "Portfolio"
     Data streams  ->  Add stream  ->  Web
     Website URL:  https://israrahmed919.github.io
     Stream name:  Portfolio
   The ID appears top right of the stream page as G-XXXXXXXXXX.

   Left empty, this file does nothing: no request to Google, no
   cookies set, nothing in the console. The site behaves exactly as
   if analytics were not installed.

   Note on blocking: a large share of a technical audience runs an ad
   blocker, and every one of them blocks googletagmanager. Treat the
   numbers here as a floor on real traffic, not a count of it.
------------------------------------------------------------------ */

var GA_ID = "G-2ZK3ECN7RH";

/* ------------------------------------------------------------------
   Cloudflare Web Analytics. Paste the beacon token between the quotes.

   dash.cloudflare.com  ->  Web Analytics  ->  Add a site
     Hostname: israrahmed919.github.io
     Under advanced options, choose "Disable automatic setup"
   It then shows a snippet containing data-cf-beacon='{"token":"..."}'.
   Copy only the token value, not the whole snippet.

   Automatic setup is not an option here: it needs the domain proxied
   through Cloudflare, and a github.io subdomain cannot be. Manual
   works on any host, it just means only pages carrying this file get
   counted. Both our pages do.

   Why run it next to GA: no cookies, so no consent banner, and ad
   blockers hit it far less than googletagmanager. Treat this as the
   honest traffic number and GA as the enquiry funnel.
------------------------------------------------------------------ */

var CF_TOKEN = "ba53bacf886d4de7bafad98812b2b61b";

/* ---------------- Cloudflare Web Analytics ---------------- */
(function () {
  'use strict';
  if (!CF_TOKEN) return;
  var b = document.createElement('script');
  b.type = 'module';        /* Cloudflare's current snippet, not defer */
  b.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  b.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_TOKEN }));
  (document.body || document.head || document.documentElement).appendChild(b);
})();

/* ---------------- Google Analytics 4 ---------------- */
(function () {
  'use strict';

  /* a no-op by default, so callers never have to guard */
  window.track = function () {};

  if (!GA_ID || GA_ID.slice(0, 2) !== 'G-') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  (document.head || document.documentElement).appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  gtag('js', new Date());
  gtag('config', GA_ID);
  /* No anonymize_ip here on purpose: that was a Universal Analytics
     setting. GA4 does not store IP addresses at all, so passing it
     would just be cargo cult. */

  /* real events, not just page views */
  window.track = function (name, params) {
    try { gtag('event', name, params || {}); } catch (e) {}
  };

  /* outbound clicks: tells you whether people leave for GitHub, the
     Upwork profile, LinkedIn or Qualzo, and from which page */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/^https?:\/\//i.test(href)) return;
    if (href.indexOf(location.host) !== -1) return;
    var host = '';
    try { host = new URL(href).hostname.replace(/^www\./, ''); } catch (e) { return; }
    window.track('outbound_click', { destination: host, label: (a.textContent || '').trim().slice(0, 60) });
  }, true);
})();
