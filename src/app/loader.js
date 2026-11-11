// Grimerud Gård map loader. build.py wraps map.js inside init() below and fills in the @-placeholders.
// It loads three.js and the heavy data file only when the map comes near the screen, then starts the map.
(function () {
  "use strict";
  var root = document.getElementById("grimerud-map");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";

  var DATA_URL = root.getAttribute("data-src") || /*@DATA_URL*/"";
  var THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
  var ORBIT_URL = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";
  var fill = root.hasAttribute("data-fill"); // standalone page: the map is the whole page
  var loadEl = document.getElementById("gm-load");
  var DATA_BYTES = /*@DATA_BYTES*/0;   // size of the data file, so its download can show real progress

  // Loader progress: 0..1, never backwards; the logo fills and the bar grows with it
  var shown = 0;
  function progress(p) {
    p = Math.max(shown, Math.min(1, p)); shown = p;
    if (!loadEl) return;
    loadEl.style.setProperty("--p", p.toFixed(3)); loadEl.setAttribute("aria-valuenow", Math.round(p * 100));
  }
  // Fetch a script with byte progress mapped into [a, b] of the bar, then run it; any trouble falls back to a plain <script>
  function scriptP(src, ready, a, b, expect) {
    if (ready()) { progress(b); return Promise.resolve(); }
    if (!window.fetch || !window.ReadableStream) return script(src, ready).then(function () { progress(b); });
    return fetch(src).then(function (r) {
      if (!r.ok || !r.body) throw new Error("http " + r.status);
      var len = +r.headers.get("content-length") || 0, enc = r.headers.get("content-encoding");
      var total = (!enc || enc === "identity") && len ? len : expect, got = 0, rd = r.body.getReader(), parts = [];
      function pump() {
        return rd.read().then(function (x) {
          if (x.done) return;
          parts.push(x.value); got += x.value.length;
          progress(a + (b - a) * (total ? Math.min(1, got / total) : 1 - Math.exp(-got / 4e5)));
          return pump();
        });
      }
      return pump().then(function () {
        var url = URL.createObjectURL(new Blob(parts, { type: "text/javascript" }));
        return script(url, ready).then(function () { URL.revokeObjectURL(url); progress(b); });
      });
    }).catch(function () { return script(src, ready).then(function () { progress(b); }); });
  }

  function script(src, ready) {
    return new Promise(function (res, rej) {
      if (ready()) return res();
      var s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = function () { ready() ? res() : rej(new Error("not ready: " + src)); };
      s.onerror = function () { rej(new Error("failed: " + src)); };
      document.head.appendChild(s);
    });
  }
  // Terrain heights ship as delta-coded uint16, zlib-compressed and base64'd (see src/pipeline/build_data.py)
  async function decodeTerrain(t) {
    if (t.v) return t;
    var bin = atob(t.data), u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    var buf = await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer();
    var v = new Uint16Array(buf);
    for (var k = 1; k < v.length; k++) v[k] = (v[k] + v[k - 1]) & 0xffff;
    t.v = v; return t;
  }
  function fail(e) {
    console.error("[Grimerud map]", e);
    if (loadEl) { loadEl.classList.add("err"); var m = loadEl.querySelector(".gm-msg"); (m || loadEl).textContent = "Kartet kunne ikke lastes. · The 3D map could not load. Reload the page to try again."; }
  }
  function start() {
    progress(0.03);
    scriptP(THREE_URL, function () { return !!window.THREE; }, 0.03, 0.25, 6.0e5)
      .then(function () { return scriptP(ORBIT_URL, function () { return !!(window.THREE && THREE.OrbitControls); }, 0.25, 0.28, 2.6e4); })
      .then(function () { return scriptP(DATA_URL, function () { return !!window.GRIMERUD_MAP_DATA; }, 0.28, 0.85, DATA_BYTES); })
      .then(function () { return decodeTerrain(window.GRIMERUD_MAP_DATA.TERRAIN); })
      .then(function () { progress(0.9); return new Promise(function (r) { requestAnimationFrame(function () { setTimeout(r, 30); }); }); })  // let the bar paint before the heavy build
      .then(function () {
        init(window.GRIMERUD_MAP_DATA); progress(1);
        if (loadEl) { setTimeout(function () { loadEl.classList.add("done"); setTimeout(function () { loadEl.remove(); }, 500); }, 250); }
      })
      .catch(fail);
  }

  var visible = true;
  function onScreen() { return visible; }
  if ("IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.isIntersecting;
        if (e.isIntersecting && !started) { started = true; start(); }
      });
    }, { rootMargin: "400px 0px" }).observe(root);
  } else start();

  // Embedded in a page, the mouse wheel scrolls the page; zoom with Ctrl/⌘ + scroll, a trackpad pinch, or after clicking the map
  if (!fill) (function () {
    var stageEl = document.getElementById("gm-stage"), tip = document.getElementById("gm-wheel"), engaged = false, timer;
    stageEl.addEventListener("pointerdown", function () { engaged = true; }, true);
    stageEl.addEventListener("pointerleave", function () { engaged = false; });
    stageEl.addEventListener("wheel", function (e) {
      if (engaged || e.ctrlKey || e.metaKey || root.classList.contains("gm-full")) { tip.classList.remove("on"); return; }
      e.stopPropagation(); // keep it from the map controls so the page scrolls instead
      tip.classList.add("on"); clearTimeout(timer); timer = setTimeout(function () { tip.classList.remove("on"); }, 1100);
    }, { capture: true, passive: true });
  })();

  function init(D) {
    var GROUND_SITE = D.GROUND_SITE, GROUND_CTX = D.GROUND_CTX, TREES = D.TREES, TERRAIN = D.TERRAIN, FAR = D.FAR, FAR_IMG = D.FAR_IMG, OUTER = D.OUTER, OUTER_IMG = D.OUTER_IMG;
    const DATA = /*@DATA*/null;
    /*@MAP*/
  }
})();
