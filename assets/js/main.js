/* Lakut Kashmir landing page interactions & animations */
(function () {
  "use strict";
  var C = window.LAKUT || {};
  var LK = window.LK || { track: function () {}, attribution: function () { return {}; } };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  // Heavy effects (slideshow, snowfall, scroll animations) run on desktop computers only, so phones load fast.
  var fx = !reduced && matchMedia("(hover: hover) and (pointer: fine) and (min-width: 761px)").matches;
  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var waNumber = (C.whatsapp || "919541589391").replace(/\D/g, "");
  var waLink = function (text) { return "https://wa.me/" + waNumber + (text ? "?text=" + encodeURIComponent(text) : ""); };

  /* ---------- Config-driven content ---------- */
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.addEventListener("click", function () { LK.track("whatsapp_click", { location: a.className || "link" }); });
  });
  $$("[data-call]").forEach(function (a) {
    if (C.phone && a.getAttribute("href") === "tel:+919131990355") a.href = "tel:" + C.phone;
    a.addEventListener("click", function () { LK.track("call_click"); });
  });
  if (C.phoneDisplay) $$("[data-phone-display]").forEach(function (el) { el.textContent = C.phoneDisplay; });
  if (C.googlePlaceId) $$("[data-reviews-link]").forEach(function (a) { a.href = "https://search.google.com/local/reviews?placeid=" + encodeURIComponent(C.googlePlaceId); });
  var count = C.googleReviewCount || 841;
  if (C.googleRating) {
    $$("[data-rating-text]").forEach(function (el) { el.textContent = C.googleRating + "★ · " + count + " Google reviews"; });
    var head = $("[data-rating-head]");
    if (head) head.textContent = count + " travellers";
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Travel month options: the next 12 months.
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $$("[data-months]").forEach(function (sel) {
    var d = new Date(); d.setDate(1);
    var html = "";
    for (var i = 0; i < 12; i++) {
      var label = months[d.getMonth()] + " " + d.getFullYear();
      html += '<option value="' + label + '">' + label + "</option>";
      d.setMonth(d.getMonth() + 1);
    }
    sel.innerHTML = html + '<option value="Not decided">Not decided yet</option>';
    sel.selectedIndex = 1;
  });

  /* ---------- Message match: ?pkg=honeymoon|snow|group or ad keyword ---------- */
  var PKGS = {
    honeymoon: {
      line1: "Your Kashmir honeymoon,", from: 31198, to: 24959, label: "Romantic Kashmir Honeymoon (5D/4N) – ₹24,959",
      sub: "Shikara rides at sunset, a night on a Dal Lake houseboat, snow at Gulmarg and the meadows of Pahalgam — with hotels, breakfast & dinner and a private cab, planned by a local Kashmiri team."
    },
    snow: {
      line1: "Kashmir in the snow,", from: 15499, to: 12499, label: "Kashmir Snow Magic (5D/4N) – ₹12,499",
      sub: "Snowfields of Gulmarg and Sonmarg, a cosy Dal Lake houseboat and Pahalgam's frozen valleys — with hotels, breakfast & dinner, a private cab and a shikara ride."
    },
    group: {
      line1: "Kashmir family holiday,", from: 19499, to: 14499, label: "Best of Kashmir (6D/5N) – ₹14,499",
      sub: "Six days of Srinagar, Gulmarg, Sonmarg, Pahalgam and Doodhpathri for the whole family — hotels, houseboat, breakfast & dinner and a private cab included."
    }
  };
  var q = new URLSearchParams(location.search);
  var attr = LK.attribution();
  var hint = (q.get("pkg") || q.get("utm_term") || attr.utm_term || q.get("utm_campaign") || attr.utm_campaign || "").toLowerCase();
  var pkgKey = /honey|couple|romantic/.test(hint) ? "honeymoon" : /snow|winter|gulmarg|ski/.test(hint) ? "snow" : /family|group|best/.test(hint) ? "group" : "";
  var priceEl = $(".price-tick");
  if (pkgKey) {
    var P = PKGS[pkgKey];
    $("[data-hero-line1]").textContent = P.line1;
    $("[data-hero-sub]").textContent = P.sub;
    priceEl.setAttribute("data-price-from", P.from);
    priceEl.setAttribute("data-price-to", P.to);
    priceEl.textContent = "₹" + P.to.toLocaleString("en-IN");
    var heroPkg = $("#hero-form [name=package]");
    if (heroPkg) heroPkg.value = P.label;
    var card = $('.pk[data-pkg="' + pkgKey + '"]');
    if (card) { card.parentNode.prepend(card); card.classList.add("is-featured"); }
  }

  /* ---------- Hero slideshow ---------- */
  var slides = $$(".hero__slide");
  if (slides.length > 1 && fx) {
    var cur = 0;
    var loadSlide = function (img) { if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); } };
    setTimeout(function () { slides.forEach(loadSlide); }, 1500);
    setInterval(function () {
      if (document.hidden) return;
      var next = (cur + 1) % slides.length;
      loadSlide(slides[next]);
      slides[cur].classList.remove("is-on");
      slides[next].classList.add("is-on");
      cur = next;
    }, 6500);
  }

  /* ---------- Snowfall ---------- */
  var canvas = $(".hero__snow");
  if (canvas && fx) {
    var ctx = canvas.getContext("2d");
    var flakes = [], W = 0, H = 0, running = true, raf;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function () {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(140, Math.round(W / 10));
      flakes = [];
      for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.6 + .8, s: Math.random() * .7 + .35, d: Math.random() * Math.PI * 2, o: Math.random() * .5 + .35 });
    };
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.s * (f.r * .55);
        f.d += .01;
        f.x += Math.sin(f.d) * .4;
        if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255," + f.o + ")";
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    size();
    draw();
    addEventListener("resize", function () { clearTimeout(canvas._t); canvas._t = setTimeout(size, 200); });
    new IntersectionObserver(function (e) {
      var vis = e[0].isIntersecting;
      if (vis && !running) { running = true; draw(); }
      if (!vis) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  }

  /* ---------- Nav, mobile bar, WhatsApp tip ---------- */
  var nav = $(".nav"), mbar = $(".mbar"), hero = $(".hero");
  var onScroll = function () {
    var y = scrollY;
    nav.classList.toggle("is-solid", y > 60);
    if (mbar) mbar.classList.toggle("is-on", y > hero.offsetHeight * .6);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  var fab = $(".fab-wa");
  if (fab) setTimeout(function () { fab.classList.add("show-tip"); setTimeout(function () { fab.classList.remove("show-tip"); }, 5000); }, 9000);

  /* ---------- Modal ---------- */
  var modal = $("#modal"), lastFocus = null;
  var openModal = function (pkg, mode) {
    if (!modal.hidden) return;
    lastFocus = document.activeElement;
    var pill = $("[data-modal-pkg]"), hidden = $("#modal-form [name=package]");
    hidden.value = pkg || "Not sure yet";
    pill.hidden = !pkg;
    pill.textContent = pkg ? "Selected: " + pkg : "";
    $("[data-modal-eyebrow]").textContent = mode === "exit" ? "Wait — before you go!" : "Free quote on WhatsApp";
    $("[data-modal-title]").textContent = mode === "exit" ? "Get your Kashmir plan & best price, free" : pkg ? "Great choice! Where should we send it?" : "Get the full plan & best price";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    ss.set("lk_modal", "1");
    setTimeout(function () { var i = $("#modal-form [name=name]"); if (i && finePointer) i.focus(); }, 60);
  };
  var closeModal = function () {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus) lastFocus.focus();
  };
  $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });
  $$("[data-pick]").forEach(function (b) {
    b.addEventListener("click", function () { openModal(b.getAttribute("data-pick"), "pick"); });
  });

  // Exit intent: once per session, only after 10s, never after a lead was sent.
  var t0 = Date.now();
  var canExit = function () { return Date.now() - t0 > 10000 && !ss.get("lk_modal") && !ss.get("lk_sent"); };
  document.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget && e.clientY < 10 && canExit()) openModal("", "exit");
  });
  // No exit pop-up on phones: Google rates pop-ups that cover the page as a poor landing page experience.

  /* ---------- Lead forms ---------- */
  var cleanPhone = function (v) {
    var d = v.replace(/[^\d+]/g, "");
    var digits = d.replace(/\D/g, "");
    if (/^[6-9]\d{9}$/.test(digits)) return "+91" + digits;
    if (/^0[6-9]\d{9}$/.test(digits)) return "+91" + digits.slice(1);
    if (/^91[6-9]\d{9}$/.test(digits)) return "+" + digits;
    if (d.charAt(0) === "+" && digits.length >= 8 && digits.length <= 15) return "+" + digits;
    return "";
  };

  $$(".lead-form").forEach(function (form) {
    var err = $(".form-error", form);
    var showErr = function (msg, field) {
      err.textContent = msg; err.hidden = false;
      if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
      if (window.gsap) gsap.fromTo(form, { x: -8 }, { x: 0, duration: .5, ease: "elastic.out(1, .3)" });
    };
    $$("input", form).forEach(function (i) { i.addEventListener("input", function () { i.removeAttribute("aria-invalid"); err.hidden = true; }); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim();
      var phone = cleanPhone(f.phone.value);
      if (name.length < 2) return showErr("Please enter your name.", f.name);
      if (!phone) return showErr("Please enter a valid mobile number (10 digits, or with country code).", f.phone);

      var lead = {
        name: name.slice(0, 80),
        phone: phone,
        month: f.month.value,
        travellers: f.travellers.value,
        package: f.package.value,
        form: form.getAttribute("data-source"),
        page: location.origin + location.pathname
      };
      var a = LK.attribution();
      Object.keys(a).forEach(function (k) { lead[k] = a[k]; });
      ss.set("lk_sent", "1");
      ss.set("lk_counted", "0");
      ss.set("lk_saved", "0");
      ss.set("lk_lead", JSON.stringify({ name: lead.name, phone: lead.phone, month: lead.month, travellers: lead.travellers, package: lead.package }));

      // Bots fill the hidden field: pretend success, send nothing, count nothing.
      if (f.company && f.company.value) { location.href = "thank-you.html"; return; }

      form.classList.add("is-sending");
      $("button[type=submit] span", form).textContent = "Sending…";
      var go = function (saved) { ss.set("lk_saved", saved ? "1" : "0"); location.href = "thank-you.html"; };
      if (!C.sheetUrl) return go(false);

      // Save the enquiry (Google Sheet + email to Cratio). Only a confirmed save counts as a Google Ads lead;
      // if saving fails, the thank-you page asks the visitor to send the enquiry on WhatsApp instead.
      var finished = false;
      var fail = function () {
        if (finished) return;
        finished = true;
        try { if (navigator.sendBeacon) navigator.sendBeacon(C.sheetUrl, new URLSearchParams(lead)); } catch (e2) {}
        go(false);
      };
      var timer = setTimeout(fail, 15000);
      fetch(C.sheetUrl, { method: "POST", body: new URLSearchParams(lead) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (finished) return;
          if (!(res && res.ok)) return fail();
          finished = true;
          clearTimeout(timer);
          go(true);
        })
        .catch(function () { fail(); });
    });
  });

  /* ---------- YouTube (thumbnail first, player on tap) ---------- */
  $$(".yt[data-yt]").forEach(function (box) {
    box.addEventListener("click", function () {
      if (box.querySelector("iframe")) return;
      var id = box.getAttribute("data-yt");
      var ifr = document.createElement("iframe");
      ifr.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1&modestbranding=1";
      ifr.title = box.getAttribute("data-title") || "Guest video";
      ifr.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      ifr.allowFullscreen = true;
      box.appendChild(ifr);
      LK.track("video_play", { video_id: id });
    });
  });
  var rail = $(".shorts__rail");
  $$("[data-rail]").forEach(function (b) {
    b.addEventListener("click", function () { rail.scrollBy({ left: +b.getAttribute("data-rail") * rail.clientWidth * .9, behavior: "smooth" }); });
  });

  /* ---------- GSAP animations ---------- */
  var startAnimations = function () {
    var root = document.documentElement;
    if (!window.gsap || !fx) { root.classList.remove("anim"); return; }
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".nav", { y: -40, opacity: 0, duration: 1 })
      .from(".hero__title .line > span", { yPercent: 110, duration: 1.2, stagger: .12 }, "<.1")
      .from("[data-hero-eyebrow]", { opacity: 0, y: 20, duration: .8 }, "<")
      .from(".hero__sub", { opacity: 0, y: 24, duration: 1 }, "<.3")
      .from(".hero__chips li", { opacity: 0, y: 16, scale: .9, stagger: .08, duration: .8 }, "<.2")
      .from(".hero__ctas .btn", { opacity: 0, y: 20, stagger: .1, duration: .8 }, "<.15")
      .from("#hero-form", { opacity: 0, x: 60, rotateY: -12, transformPerspective: 900, duration: 1.3 }, "<-.6")
      .from("#hero-form .field, #hero-form .field-row, #hero-form .btn", { opacity: 0, y: 14, stagger: .06, duration: .7 }, "<.4");

    // Price drops from the old price to the offer price
    if (priceEl) {
      var from = +priceEl.getAttribute("data-price-from"), to = +priceEl.getAttribute("data-price-to");
      var o = { v: from };
      priceEl.textContent = "₹" + from.toLocaleString("en-IN");
      tl.to(o, {
        v: to, duration: 1.8, ease: "power3.inOut",
        onUpdate: function () { priceEl.textContent = "₹" + Math.round(o.v).toLocaleString("en-IN"); }
      }, "-=1.2")
        .fromTo(priceEl, { scale: 1 }, { scale: 1.08, duration: .25, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "left center" });
    }

    // Hero parallax on scroll
    gsap.to(".hero__bg", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__grid", { yPercent: -8, opacity: .3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Generic reveals
    gsap.set("[data-reveal]", { y: 50 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .12, overwrite: true }); }
    });

    // Package cards rise in like a hand of cards
    gsap.from(".pk", {
      y: 90, rotateX: 14, opacity: 0, duration: 1.2, stagger: .14, ease: "expo.out", transformPerspective: 1200,
      scrollTrigger: { trigger: ".pk-grid", start: "top 85%" }
    });
    gsap.from(".pk__save", { scale: 0, rotate: -20, duration: .8, stagger: .14, ease: "back.out(2.5)", delay: .5, scrollTrigger: { trigger: ".pk-grid", start: "top 80%" } });

    // Route line draws as you scroll
    var path = $(".route__line path");
    if (path) {
      gsap.fromTo(path, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".route", start: "top 65%", end: "bottom 65%", scrub: .6 } });
    }
    $$(".stop").forEach(function (s, i) {
      var img = $(".stop__img", s);
      var dir = innerWidth > 760 ? (i % 2 ? 80 : -80) : 0;
      gsap.from(img, { x: dir, y: dir ? 0 : 40, scale: .92, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 82%" } });
    });

    // Counters
    $$("[data-count]").forEach(function (el) {
      var end = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "";
      var o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () { gsap.to(o, { v: end, duration: 2, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString("en-IN") + suf; } }); }
      });
    });

    // Gallery & final parallax
    $$("[data-parallax]").forEach(function (fig) {
      gsap.fromTo($("img", fig), { y: -(+fig.getAttribute("data-parallax")) }, { y: +fig.getAttribute("data-parallax"), ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.from(".gl__i", { scale: .85, opacity: 0, duration: 1, stagger: { each: .07, from: "random" }, ease: "expo.out", scrollTrigger: { trigger: ".gl", start: "top 85%" } });
    gsap.fromTo(".final__bg", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });

    // 3D tilt + magnetic buttons on desktop
    if (finePointer) {
      $$("[data-tilt]").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, y: -6, transformPerspective: 1000, duration: .5, ease: "power2.out" });
        });
        card.addEventListener("pointerleave", function () { gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: .8, ease: "elastic.out(1, .5)" }); });
      });
      $$(".magnetic").forEach(function (b) {
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: "power2.out" });
        });
        b.addEventListener("pointerleave", function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: "elastic.out(1, .4)" }); });
      });
    }
  };
  // The animation library is downloaded on desktop computers only (started in the page head); phones skip it.
  if (fx && window.lkGsap) {
    window.lkGsap
      .then(function () {
        startAnimations();
        if (document.readyState === "complete" && window.ScrollTrigger) ScrollTrigger.refresh();
      })
      .catch(function () { document.documentElement.classList.remove("anim"); });
  } else {
    startAnimations();
  }
  // Lazy images change the page height as they load; re-measure scroll positions.
  addEventListener("load", function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();
