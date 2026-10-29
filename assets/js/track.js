/* Tracking + ad attribution. Loads Google tag / Meta Pixel only when IDs are set in config.js. */
(function () {
  var C = window.LAKUT || {};
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // Remember where the visitor came from (gclid + UTMs) for 90 days, so the lead row shows which ad worked.
  var params = new URLSearchParams(location.search);
  var keys = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var fresh = {};
  keys.forEach(function (k) { if (params.get(k)) fresh[k] = params.get(k).slice(0, 200); });
  var saved = store.get("lk_attr");
  if (Object.keys(fresh).length) {
    fresh.landed = new Date().toISOString();
    store.set("lk_attr", fresh);
    saved = fresh;
  } else if (saved && Date.now() - new Date(saved.landed).getTime() > 90 * 864e5) {
    saved = null;
  }

  window.gtag = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
  var tagId = C.ga4 || C.adsId;
  if (tagId) {
    gtag("js", new Date());
    if (C.ga4) gtag("config", C.ga4);
    if (C.adsId) gtag("config", C.adsId);
    var addTag = function () {
      if (addTag.done) return;
      addTag.done = true;
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(tagId);
      document.head.appendChild(s);
    };
    var me = document.currentScript;
    if (me && me.hasAttribute("data-lazy-tags")) {
      // Landing page: let the photo, text and form load first. The Google tag (160 KB) loads at the
      // visitor's first touch, scroll, key press or mouse move, or 4 seconds after the page has loaded,
      // whichever comes first. Commands above wait in the queue, so the ad click (gclid) is still recorded
      // long before anyone can fill in the form.
      ["pointerdown", "touchstart", "scroll", "keydown", "mousemove"].forEach(function (e) {
        addEventListener(e, addTag, { once: true, passive: true });
      });
      var later = function () { setTimeout(addTag, 4000); };
      if (document.readyState === "complete") later(); else addEventListener("load", later);
    } else {
      addTag();
    }
  }

  if (C.metaPixel) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", C.metaPixel);
    fbq("track", "PageView");
  }

  window.LK = {
    attribution: function () { return saved || {}; },
    // name: "generate_lead" | "whatsapp_click" | "call_click"
    track: function (name, extra) {
      var label = { generate_lead: C.adsLeadLabel, whatsapp_click: C.adsWhatsappLabel, call_click: C.adsCallLabel }[name];
      gtag("event", name, extra || {});
      if (C.adsId && label) gtag("event", "conversion", { send_to: C.adsId + "/" + label, value: 1.0, currency: "INR" });
      if (window.fbq) fbq(name === "generate_lead" ? "track" : "trackCustom", name === "generate_lead" ? "Lead" : name);
    }
  };
})();
