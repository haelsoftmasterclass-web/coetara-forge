/*
  Coetara Forge — progressive enhancement.
  Every page is complete without this file. It adds: the mobile drawer, scroll reveals,
  the journey/loop animations, engine toggle, FAQ search, insight filters, the
  multi-step application form, the contact form and analytics events (dataLayer).
*/
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ---------- Analytics ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    try { window.dataLayer.push(Object.assign({ event: event }, params || {})); } catch (e) {}
  }
  doc.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("[data-track]");
    if (el) track(el.getAttribute("data-track"), { label: (el.textContent || "").trim().slice(0, 80), href: el.getAttribute("href") || "", page: location.pathname });
  });
  var pageViews = {
    "/incubator/": "incubator_visit", "/forge-launch/": "forge_launch_visit", "/forge-commercial/": "forge_commercial_visit", "/portfolio/": "portfolio_visit",
    "/cohort-01/": "cohort_01_visit", "/partners/universities/": "university_partnerships_visit", "/partners/corporates/": "corporate_partnerships_visit", "/partners/investors/": "investors_visit"
  };
  var p = location.pathname.replace(/index\.html$/, "");
  Object.keys(pageViews).forEach(function (k) { if (p.slice(-k.length) === k) track(pageViews[k]); });
  if ($("[data-article]")) {
    var marks = [25, 50, 75, 100], sent = {};
    window.addEventListener("scroll", function () {
      var a = $("[data-article]"); if (!a) return;
      var r = a.getBoundingClientRect();
      var pct = Math.min(100, Math.max(0, ((window.innerHeight - r.top) / r.height) * 100));
      marks.forEach(function (m) { if (pct >= m && !sent[m]) { sent[m] = 1; track("insight_engagement", { percent: m, title: doc.title }); } });
    }, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  var drawer = $("[data-drawer]");
  var opener = $("[data-drawer-open]");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("hidden", !open);
    if (opener) opener.setAttribute("aria-expanded", String(open));
    doc.body.style.overflow = open ? "hidden" : "";
    if (open) { var f = $("a, button", $("[data-drawer-panel]", drawer)); if (f) f.focus(); }
    else if (opener) opener.focus();
  }
  if (opener) opener.addEventListener("click", function () { setDrawer(true); });
  $$("[data-drawer-close]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(false); }); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer && !drawer.classList.contains("hidden")) setDrawer(false); });

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("reveal-ready");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) {
      // anything already on screen is shown immediately, so the first frame is complete
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      else io.observe(el);
    });
  }

  /* ---------- Journey: light the rail stage by stage ---------- */
  $$("[data-journey]").forEach(function (j) {
    var stages = $$("[data-journey-stage]", j);
    function light() {
      j.classList.add("is-lit");
      stages.forEach(function (s, i) { setTimeout(function () { s.classList.add("is-lit"); }, reduceMotion ? 0 : i * 260); });
    }
    if (!("IntersectionObserver" in window)) return light();
    var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { light(); o.disconnect(); } }, { threshold: 0.3 });
    o.observe(j);
  });

  /* ---------- Build / Test / Learn / Refine loop ---------- */
  $$("[data-loop]").forEach(function (loop) {
    var nodes = $$("[data-loop-node]", loop), items = $$("[data-loop-item]", loop), i = 0, timer = null;
    function set(n) {
      i = n;
      nodes.forEach(function (el, k) { if (k === n) el.setAttribute("data-active", ""); else el.removeAttribute("data-active"); });
      items.forEach(function (el, k) { if (k === n) el.setAttribute("data-active", ""); else el.removeAttribute("data-active"); });
    }
    set(0);
    if (!reduceMotion) timer = setInterval(function () { set((i + 1) % nodes.length); }, 2600);
    items.forEach(function (el, k) {
      el.addEventListener("mouseenter", function () { clearInterval(timer); set(k); });
    });
  });

  /* ---------- Engine toggle (small screens) ---------- */
  $$("[data-tabs]").forEach(function (t) {
    var tabs = $$("[data-tab]", t), panels = $$("[data-panel]", t);
    function select(id) {
      tabs.forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === id)); });
      panels.forEach(function (p) { if (p.getAttribute("data-panel") === id) p.removeAttribute("data-inactive"); else p.setAttribute("data-inactive", ""); });
      track("engine_toggle", { engine: id });
    }
    tabs.forEach(function (b) { b.addEventListener("click", function () { select(b.getAttribute("data-tab")); }); });
    if (tabs[0]) {
      panels.forEach(function (p, k) { if (k > 0) p.setAttribute("data-inactive", ""); });
    }
  });

  /* ---------- FAQ search + topic filter ---------- */
  $$("[data-faq]").forEach(function (f) {
    var input = $("[data-faq-search]", f), items = $$("[data-faq-item]", f), empty = $("[data-faq-empty]", f), topic = "all";
    var topicBtns = $$("[data-faq-topic]", f);
    function apply() {
      var q = (input && input.value || "").trim().toLowerCase(), shown = 0;
      items.forEach(function (it) {
        var ok = (topic === "all" || it.getAttribute("data-topic") === topic) && (!q || it.textContent.toLowerCase().indexOf(q) > -1);
        it.hidden = !ok; if (ok) shown++;
        if (q && ok) it.open = true;
      });
      if (empty) empty.classList.toggle("hidden", shown > 0);
    }
    if (input) input.addEventListener("input", apply);
    topicBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        topic = b.getAttribute("data-faq-topic");
        topicBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        apply();
      });
    });
  });

  /* ---------- Insight category filter ---------- */
  $$("[data-insight-filter]").forEach(function (wrap) {
    var btns = $$("[data-category-btn]", wrap), cards = $$("[data-insight]"), empty = $("[data-insight-empty]");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var c = b.getAttribute("data-category-btn"), shown = 0;
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        cards.forEach(function (card) { var ok = c === "all" || card.getAttribute("data-category") === c; card.hidden = !ok; if (ok) shown++; });
        if (empty) empty.classList.toggle("hidden", shown > 0);
        track("insight_filter", { category: c });
      });
    });
  });

  /* ---------- Marketing attribution ----------
     First touch is kept for 90 days; the latest touch updates whenever a visitor
     arrives with UTM tags. Both are attached to every form submission. */
  var ATTR_KEY = "forge-attribution";
  function readAttr() { try { return JSON.parse(localStorage.getItem(ATTR_KEY) || "{}"); } catch (e) { return {}; } }
  (function captureAttribution() {
    var q = new URLSearchParams(location.search), a = readAttr(), now = Date.now();
    var utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k).slice(0, 200); });
    var ref = doc.referrer && doc.referrer.indexOf(location.host) === -1 ? doc.referrer : "";
    if (!a.first || now - a.first.at > 90 * 864e5) a.first = Object.assign({ at: now, referrer: ref, landing_page: location.pathname }, utm);
    if (Object.keys(utm).length || ref) a.last = Object.assign({ at: now, referrer: ref, landing_page: location.pathname }, utm);
    try { localStorage.setItem(ATTR_KEY, JSON.stringify(a)); } catch (e) {}
  })();
  function addAttribution(data) {
    var a = readAttr(), first = a.first || {}, last = a.last || first;
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) { if (last[k]) data.set(k, last[k]); });
    if (first.utm_source) data.set("first_utm_source", first.utm_source);
    if (first.utm_medium) data.set("first_utm_medium", first.utm_medium);
    if (first.utm_campaign) data.set("first_utm_campaign", first.utm_campaign);
    data.set("referrer", last.referrer || first.referrer || "");
    data.set("landing_page", first.landing_page || "");
    return data;
  }

  /* ---------- Forms ----------
     1. Preview build: simulated.
     2. Otherwise POST to the form's own API (Netlify Function → Supabase + Resend).
     3. If that API is missing or the database is unavailable, fall back to Netlify Forms
        so no submission is ever lost. Validation errors (400/422) are shown to the visitor. */
  var endpoint = doc.body.getAttribute("data-form-endpoint") || "";
  function FormError(message) { this.message = message; }
  function netlifyForms(data) {
    var body = new URLSearchParams();
    data.forEach(function (v, k) { body.append(k, typeof v === "string" ? v : v.name); });
    return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
      .then(function (r) { if (!r.ok) throw new Error("bad status"); });
  }
  function submitForm(form) {
    var data = addAttribution(new FormData(form));
    // Design preview: nothing is sent anywhere.
    if (endpoint === "__preview__") return new Promise(function (r) { setTimeout(r, 700); });
    var api = endpoint || form.getAttribute("data-api");
    if (!api) return netlifyForms(data);
    return fetch(api, { method: "POST", body: data, headers: { Accept: "application/json" } }).then(function (r) {
      if (r.ok) return;
      if (r.status === 400 || r.status === 422) {
        return r.json().catch(function () { return {}; }).then(function (j) { throw new FormError(j.error || "Please check your answers and try again."); });
      }
      return netlifyForms(data);
    }, function () { return netlifyForms(data); });
  }

  function validateField(el) {
    var wrap = el.closest(".field"), msg = wrap && $(".error-msg", wrap), ok = el.checkValidity();
    if (el.type === "radio") {
      var group = $$('input[name="' + el.name + '"]', el.form);
      ok = !group.some(function (g) { return g.required; }) || group.some(function (g) { return g.checked; });
    }
    el.setAttribute("aria-invalid", String(!ok));
    if (msg) {
      msg.textContent = ok ? "" : (el.validity.typeMismatch ? "Please enter a valid " + (el.type === "email" ? "email address." : "web address, starting with https://") : el.getAttribute("data-error") || "This field is required.");
      msg.hidden = ok;
    }
    return ok;
  }

  function showDone(form, ok, detail) {
    var done = $("[data-form-done]", form.parentNode);
    var fail = $("[data-form-fail]", form.parentNode);
    if (ok) { form.hidden = true; if (fail) fail.hidden = true; if (done) { done.hidden = false; done.focus(); } }
    else if (fail) {
      var custom = $("[data-form-fail-detail]", fail);
      if (custom) custom.textContent = detail || "";
      fail.hidden = false;
    }
  }

  // Contact form
  $$("form[data-contact-form]").forEach(function (form) {
    var params = new URLSearchParams(location.search);
    var type = params.get("type");
    var sel = $('select[name="role"]', form);
    var map = { partner: "Corporate", corporate: "Corporate", university: "University / Research Institution", investor: "Investor", builder: "Founder / Builder", technology: "University / Research Institution" };
    if (type && sel && map[type]) sel.value = map[type];
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = $$("input, select, textarea", form).map(validateField).every(Boolean);
      if (!ok) { var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); return; }
      var btn = $('button[type="submit"]', form), label = btn ? btn.textContent : ""; if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      submitForm(form).then(function () { track("contact_submit", { role: sel ? sel.value : "", page: location.pathname }); showDone(form, true); })
        .catch(function (err) { if (btn) { btn.disabled = false; btn.textContent = label; } showDone(form, false, err instanceof FormError ? err.message : ""); });
    });
  });

  // Multi-step application
  $$("form[data-apply-form]").forEach(function (form) {
    var steps = $$("[data-step]", form), bar = $("[data-progress-bar]"), label = $("[data-progress-label]"), stepName = $("[data-progress-name]");
    var back = $("[data-back]", form), next = $("[data-next]", form), submit = $("[data-submit]", form);
    var KEY = "forge-application-cohort-01", current = 0, started = false;

    function save() {
      try {
        var obj = {};
        new FormData(form).forEach(function (v, k) { if (typeof v === "string") obj[k] = v; });
        obj.__step = current;
        localStorage.setItem(KEY, JSON.stringify(obj));
      } catch (e) {}
    }
    function restore() {
      try {
        var raw = localStorage.getItem(KEY); if (!raw) return 0;
        var obj = JSON.parse(raw);
        Object.keys(obj).forEach(function (k) {
          if (k === "__step") return;
          $$('[name="' + k + '"]', form).forEach(function (el) {
            if (el.type === "radio" || el.type === "checkbox") el.checked = el.value === obj[k];
            else el.value = obj[k];
          });
        });
        var note = $("[data-restored]"); if (note) note.hidden = false;
        return Math.min(obj.__step || 0, steps.length - 1);
      } catch (e) { return 0; }
    }
    function show(n) {
      current = n;
      steps.forEach(function (s, i) { s.hidden = i !== n; });
      var pct = Math.round(((n + 1) / steps.length) * 100);
      if (bar) bar.style.width = pct + "%";
      if (label) label.textContent = "Step " + (n + 1) + " of " + steps.length;
      if (stepName) stepName.textContent = steps[n].getAttribute("data-step");
      if (back) back.hidden = n === 0;
      if (next) next.hidden = n === steps.length - 1;
      if (submit) submit.hidden = n !== steps.length - 1;
      var h = $("h2", steps[n]); if (h && started) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      if (started) { var top = form.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" }); }
    }
    function validStep(n) {
      var ok = $$("input, select, textarea", steps[n]).map(validateField).every(Boolean);
      if (!ok) { var bad = $('[aria-invalid="true"]', steps[n]); if (bad) bad.focus(); }
      return ok;
    }
    form.addEventListener("input", function () {
      if (!started) { started = true; track("application_start"); }
      save();
    });
    form.addEventListener("change", function (e) { if (e.target.matches("input, select, textarea") && e.target.getAttribute("aria-invalid") === "true") validateField(e.target); });
    if (next) next.addEventListener("click", function () { if (validStep(current)) { started = true; show(current + 1); save(); track("application_step", { step: current + 1 }); } });
    if (back) back.addEventListener("click", function () { started = true; show(current - 1); save(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validStep(current)) return;
      var all = steps.every(function (s, i) { return $$("input, select, textarea", s).every(function (el) { return el.type === "radio" ? true : el.checkValidity(); }) || (show(i), false); });
      if (!all) return;
      submit.disabled = true; submit.textContent = "Submitting…";
      submitForm(form).then(function () {
        try { localStorage.removeItem(KEY); } catch (e) {}
        track("application_complete");
        var progress = $("[data-progress]"); if (progress) progress.hidden = true;
        showDone(form, true);
      }).catch(function (err) { submit.disabled = false; submit.textContent = "Submit Application"; showDone(form, false, err instanceof FormError ? err.message : ""); });
    });
    var restart = $("[data-restart]");
    if (restart) restart.addEventListener("click", function () { try { localStorage.removeItem(KEY); } catch (e) {} form.reset(); restart.closest("[data-restored]").hidden = true; show(0); });
    show(restore());
  });
})();
