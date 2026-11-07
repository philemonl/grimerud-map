/* Grimerud G\u00e5rd 3D map, built from github.com/philemonl/grimerud-map by build.py. Do not edit by hand. */
(function () {
  "use strict";
  if (document.getElementById("grimerud-map")) return;
  var mount = document.getElementById("grimerud-map-mount");
  if (!mount) { console.error("[Grimerud map] no #grimerud-map-mount on the page"); return; }
  ["https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap"].forEach(function (href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
  });
  var st = document.createElement("style"); st.textContent = "/* Grimerud G\u00e5rd map. Every rule is scoped to #grimerud-map so it can sit inside another site (Squarespace). */\n\n/* Guard against the host site's own heading/paragraph/button styles */\n#grimerud-map { container: gm / inline-size; display: block; width: 100%; position: relative; isolation: isolate; text-align: left; -webkit-text-size-adjust: 100%; }\n#grimerud-map :where(h1,h2,p,button,nav,aside,main,div,span,strong,svg) { margin: 0; padding: 0; font-family: inherit; font-size: inherit; line-height: inherit; font-weight: inherit; letter-spacing: normal; text-transform: none; text-decoration: none; color: inherit; text-align: inherit; max-width: none; }\n#grimerud-map :where(i,b) { letter-spacing: normal; text-transform: none; font-family: inherit; }\n#grimerud-map :where(button) { -webkit-appearance: none; appearance: none; background: none; border: 0; border-radius: 0; box-shadow: none; min-height: 0; min-width: 0; width: auto; height: auto; }\n#grimerud-map :where(h1,h2)::before, #grimerud-map :where(h1,h2)::after { content: none; }\n\n/* Map */\n#grimerud-map { --paper: #f7f5ef; --bg: #f1efe8; --panel: #fbfaf6; --ink: #26221d; --muted: #615a50; --line: #d9d3c6; --accent: #b23a2b; --accent-ink: #ffffff; --leaf: #4c8a2f; --chip: #ece8de; --shadow: 0 4px 18px rgba(38, 34, 29, .18); --f: \"Ubuntu\", \"Segoe UI\", system-ui, sans-serif; }\n#grimerud-map { background: var(--bg); color: var(--ink); font: 15px/1.45 var(--f); }\n#grimerud-map * { box-sizing: border-box; }\n#grimerud-map button { font: inherit; color: inherit; }\n#grimerud-map :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n#grimerud-map .app { display: grid; grid-template-columns: 360px minmax(0, 1fr); height: 100%; }\n#grimerud-map .panel { display: flex; flex-direction: column; min-height: 0; background: var(--panel); border-right: 1px solid var(--line); }\n#grimerud-map .head { padding: 22px 22px 14px; }\n#grimerud-map .welcome { font: italic 500 15px/1.25 var(--f); margin: 0; }\n#grimerud-map h1 { font: 700 34px/1.05 var(--f); font-size: 34px !important; line-height: 1.05 !important; letter-spacing: -.01em; margin: 2px 0 0; padding-bottom: 6px; border-bottom: 2px solid var(--ink); text-wrap: balance; }\n#grimerud-map .since { font: italic 400 12px/1 var(--f); margin: 6px 0 0; color: var(--muted); }\n#grimerud-map .lede { margin: 12px 0 0; color: var(--muted); font-size: 13.5px; max-width: 36ch; }\n#grimerud-map .list { flex: 1; overflow-y: auto; padding: 0 12px 16px; min-height: 0; }\n#grimerud-map .group { font: 500 11.5px/1.2 var(--f); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 18px 10px 6px; }\n#grimerud-map .group i { text-transform: none; letter-spacing: 0; font-size: 12px; }\n#grimerud-map .item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; align-items: start; width: 100%; text-align: left; background: none; border: 0; border-radius: 8px; padding: 7px 10px; cursor: pointer; }\n#grimerud-map .item:hover, #grimerud-map .item[aria-pressed=\"true\"] { background: var(--chip); }\n#grimerud-map .item[aria-pressed=\"true\"] .num { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }\n#grimerud-map .num { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; border: 1.6px solid var(--ink); font: 500 13px/1 var(--f); background: var(--panel); margin-top: 1px; }\n#grimerud-map .num.sq { border-radius: 7px; }\n#grimerud-map .nm { display: block; font-weight: 500; font-size: 15.5px; line-height: 1.25; }\n#grimerud-map .nm i { font-weight: 500; }\n#grimerud-map .sub { display: block; color: var(--muted); font-size: 12.5px; line-height: 1.4; margin-top: 2px; }\n#grimerud-map .sub i { display: block; }\n#grimerud-map .foot { border-top: 1px solid var(--line); padding: 14px 22px 18px; font-size: 12px; color: var(--muted); display: grid; gap: 4px; }\n#grimerud-map .foot strong { color: var(--ink); font-weight: 500; font-size: 13px; }\n#grimerud-map .coord { font-variant-numeric: tabular-nums; }\n#grimerud-map .stage { position: relative; min-width: 0; overflow: hidden; touch-action: none; background: linear-gradient(180deg, #cfe0e6 0%, #e9eee9 22%, var(--paper) 44%); }\n#grimerud-map canvas { display: block; width: 100%; height: 100%; cursor: grab; }\n#grimerud-map canvas:active { cursor: grabbing; }\n#grimerud-map #gm-pins { position: absolute; inset: 0; pointer-events: none; }\n#grimerud-map .pin { position: absolute; left: 0; top: 0; pointer-events: auto; display: flex; align-items: center; gap: 6px; background: none; border: 0; padding: 0; cursor: pointer; white-space: nowrap; }\n#grimerud-map .pin .num { width: 28px; height: 28px; background: #fffdf8; color: #26221d; border: 2px solid #26221d; font-weight: 700; box-shadow: 0 2px 0 rgba(38,34,29,.35); }\n#grimerud-map .pin .lbl { display: none; background: #fffdf8; color: #26221d; border: 1.6px solid #26221d; border-radius: 6px; padding: 4px 8px; box-shadow: 0 2px 0 rgba(38,34,29,.3); line-height: 1.15; }\n#grimerud-map .pin .lbl b { display: block; font: 500 13px/1.15 var(--f); }\n#grimerud-map .pin .lbl i { display: block; font: italic 400 11.5px/1.2 var(--f); color: #5a5248; }\n#grimerud-map .pin:hover .lbl, #grimerud-map .pin.on .lbl, #grimerud-map #gm-pins.names .lbl { display: block; }\n#grimerud-map .pin.on { z-index: 5; }\n#grimerud-map .pin.on .num { background: #b23a2b; color: #fff; border-color: #26221d; }\n#grimerud-map .topbar { position: absolute; z-index: 5; top: calc(14px + env(safe-area-inset-top, 0px)); left: calc(14px + env(safe-area-inset-left, 0px)); right: calc(14px + env(safe-area-inset-right, 0px)); display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; pointer-events: none; }\n#grimerud-map .topbar > * { pointer-events: auto; }\n#grimerud-map .hud { margin-left: auto; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }\n#grimerud-map .seg { display: flex; background: #26221d; color: #26221d; padding: 1.6px; gap: 1.6px; border-radius: 9px; box-shadow: 0 2px 0 rgba(38,34,29,.3); }\n#grimerud-map .seg button { border: 0; background: #fffdf8; color: #26221d; padding: 7px 12px; font: 500 13px/1 var(--f); cursor: pointer; border-radius: 0; }\n#grimerud-map .seg button:first-child { border-top-left-radius: 7.4px; border-bottom-left-radius: 7.4px; }\n#grimerud-map .seg button:last-child { border-top-right-radius: 7.4px; border-bottom-right-radius: 7.4px; }\n#grimerud-map .seg button[aria-pressed=\"true\"] { background: #26221d; color: #fffdf8; }\n#grimerud-map .compass { width: 48px; height: 48px; border-radius: 50%; background: #fffdf8; border: 1.6px solid #26221d; box-shadow: 0 2px 0 rgba(38,34,29,.3); display: grid; place-items: center; cursor: pointer; padding: 0; }\n#grimerud-map .compass svg { width: 40px; height: 40px; }\n#grimerud-map .card { position: absolute; left: calc(14px + env(safe-area-inset-left, 0px)); bottom: calc(14px + env(safe-area-inset-bottom, 0px)); max-width: min(380px, calc(100% - 28px)); background: #fffdf8; color: #26221d; border: 2px solid #26221d; border-radius: 12px; box-shadow: 0 3px 0 rgba(38,34,29,.3); padding: 12px 14px; display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; gap: 12px; align-items: start; }\n#grimerud-map .card .num { background: #b23a2b; color: #fff; border: 2px solid #26221d; width: 30px; height: 30px; font-weight: 700; }\n#grimerud-map .card h2 { font: 500 18px/1.2 var(--f); margin: 3px 0 2px; }\n#grimerud-map .card h2 i { font-weight: 400; color: #5a5248; }\n#grimerud-map .card p { margin: 0; font-size: 13px; color: #5a5248; }\n#grimerud-map .card p i { display: block; }\n#grimerud-map .close { border: 0; background: none; cursor: pointer; padding: 2px 4px; color: #5a5248; font-size: 22px; line-height: 1; }\n#grimerud-map .hint { position: absolute; left: 50%; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); font: italic 12px/1 var(--f); color: #26221d; background: rgba(255,253,248,.85); border: 1px solid rgba(38,34,29,.3); padding: 6px 10px; border-radius: 20px; pointer-events: none; white-space: nowrap; }\n#grimerud-map [hidden] { display: none !important; }\n#grimerud-map .pin.behind { visibility: hidden; }\n#grimerud-map .num.dg { background: #f3c33b; border-color: #26221d; color: #26221d; border-radius: 6px; font-weight: 700; }\n#grimerud-map .pin .num.dg { background: #f3c33b; width: 26px; height: 26px; font-size: 12px; }\n#grimerud-map .pin.dg-off { display: none; }\n#grimerud-map .dg-go { position: absolute; left: 0; top: 0; z-index: 4; display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 6px; background: #f3c33b; color: #26221d; border: 2px solid #26221d; border-radius: 999px; box-shadow: 0 2px 0 rgba(38,34,29,.35); font: 700 12.5px/1 var(--f); cursor: pointer; white-space: nowrap; }\n#grimerud-map .dg-go.farm { background: #fffdf8; }\n#grimerud-map .dg-go .dir { display: none; margin-left: 2px; font-size: 14px; line-height: 1; transform: rotate(var(--a, 0rad)); }\n#grimerud-map .dg-go.edge .dir { display: inline-block; }\n#grimerud-map .dg-go.farm:hover { background: #ffffff; }\n#grimerud-map .maptabs { flex: none; }\n#grimerud-map .maptabs button { padding: 8px 12px; font-size: 13.5px; }\n#grimerud-map .maptabs button i { font-weight: 400; }\n#grimerud-map .maptabs button[aria-pressed=\"true\"] i { color: #e9e3d6; }\n#grimerud-map .dg-go svg { width: 18px; height: 18px; flex: none; }\n#grimerud-map .dg-go:hover { background: #ffd65a; }\n#grimerud-map .group.dg-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n#grimerud-map .err { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; color: #5a5248; }\n\n/* Height when embedded in a page (the standalone page overrides this to fill the window) */\n#grimerud-map .app { height: var(--gm-h, min(82vh, 860px)); min-height: 560px; }\n\n/* Loading message, and the tip shown when someone scrolls the page over the map */\n#grimerud-map .gm-load { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; font: italic 13px/1.3 var(--f); color: #5a5248; pointer-events: none; }\n#grimerud-map .gm-wheel { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; background: rgba(38,34,29,.38); color: #fffdf8; font: 500 15px/1.3 var(--f); opacity: 0; transition: opacity .25s; z-index: 6; }\n#grimerud-map .gm-wheel.on { opacity: 1; }\n\n/* Touch: the page scrolls past the map; \"Utforsk\" opens it full screen for turning and zooming */\n#grimerud-map .gm-expand { display: none; align-items: center; gap: 6px; background: #fffdf8; color: #26221d; border: 1.6px solid #26221d; border-radius: 9px; box-shadow: 0 2px 0 rgba(38,34,29,.3); padding: 7px 11px; font: 500 13.5px/1 var(--f); cursor: pointer; }\n#grimerud-map .gm-expand svg { width: 16px; height: 16px; flex: none; }\n#grimerud-map .lede-m { display: none; }\n#grimerud-map .lede b { font-weight: 500; color: var(--ink); }\n@media (pointer: coarse) {\n  #grimerud-map .gm-expand { display: inline-flex; }\n  #grimerud-map .stage { touch-action: pan-y; }\n  #grimerud-map .lede-d { display: none; }\n  #grimerud-map .lede-m { display: inline; }\n  #grimerud-map .hint { display: none; }\n}\n\n/* Narrow: legend below the map, compact controls */\n@container gm (max-width: 760px) {\n  #grimerud-map .app { display: flex; flex-direction: column; height: auto; min-height: 0; }\n  #grimerud-map .stage { order: 1; height: 66svh; min-height: 380px; }\n  #grimerud-map .panel { order: 2; border-right: 0; }\n  #grimerud-map .head { padding: 14px 16px 8px; }\n  /* phone type scale: one size step down throughout the legend */\n  #grimerud-map h1 { font-size: 23px !important; padding-bottom: 5px; }\n  #grimerud-map .welcome { font-size: 13px; }\n  #grimerud-map .since { font-size: 11px; margin-top: 5px; }\n  #grimerud-map .lede { font-size: 12.5px; margin-top: 8px; }\n  #grimerud-map .group { margin-top: 14px; font-size: 10.5px; }\n  #grimerud-map .nm { font-size: 14.5px; }\n  #grimerud-map .sub { font-size: 11.5px; }\n  #grimerud-map .foot { font-size: 11px; }\n  #grimerud-map .foot strong { font-size: 12px; }\n  #grimerud-map .list { overflow: visible; padding: 0 6px 12px; }\n  #grimerud-map .foot { padding: 14px 16px calc(18px + env(safe-area-inset-bottom, 0px)); }\n  #grimerud-map .hint { display: none; }\n  #grimerud-map .stage { height: 62svh; min-height: 360px; }\n  #grimerud-map .topbar { top: 10px; left: 10px; right: 10px; gap: 6px; }\n  #grimerud-map .hud { flex-basis: 100%; gap: 6px; justify-content: flex-start; margin-left: 0; }\n  #grimerud-map .hud .compass { margin-left: auto; }\n  #grimerud-map .gm-expand { margin-left: auto; }\n  #grimerud-map .seg button, #grimerud-map .maptabs button { padding: 9px 11px; font-size: 13px; }\n  #grimerud-map .en { display: none; }\n  #grimerud-map #gm-vnight .tx { display: none; }\n  #grimerud-map #gm-vnight svg { margin-right: 0 !important; }\n  #grimerud-map .compass { width: 40px; height: 40px; }\n  #grimerud-map .compass svg { width: 32px; height: 32px; }\n  #grimerud-map .card { left: 10px; right: 10px; bottom: 10px; max-width: none; padding: 10px 12px; }\n  #grimerud-map .card h2 { font-size: 16.5px; }\n  #grimerud-map .item { padding: 7px 10px; }\n}\n\n/* Full-screen explore mode */\nhtml.gm-lock, html.gm-lock body { overflow: hidden !important; overscroll-behavior: none; }\n#grimerud-map.gm-full { position: fixed; inset: 0; z-index: 2147483000; width: auto; background: var(--bg); }\n#grimerud-map.gm-full .app { display: block; height: 100%; min-height: 0; }\n#grimerud-map.gm-full .panel { display: none; }\n#grimerud-map.gm-full .stage { height: 100%; min-height: 0; touch-action: none; }\n#grimerud-map.gm-full .topbar { top: calc(10px + env(safe-area-inset-top, 0px)); }\n#grimerud-map.gm-full .card { bottom: calc(10px + env(safe-area-inset-bottom, 0px)); }\n#grimerud-map.gm-full .gm-expand { display: inline-flex; background: #26221d; color: #fffdf8; }\n"; document.head.appendChild(st);
  mount.outerHTML = "<!-- Grimerud G\u00e5rd map markup. Element ids are prefixed gm- so they cannot clash with the host page. -->\n<div id=\"grimerud-map\" data-src=\"https://philemonl.github.io/grimerud-map/dist/grimerud-map-data.js?v=cf716eb6a9\">\n  <div class=\"app\">\n    <aside class=\"panel\">\n      <div class=\"head\">\n        <p class=\"welcome\">Velkommen til Ungdom i Oppdrag</p>\n        <h1>Grimerud G\u00e5rd</h1>\n        <p class=\"since\">Siden 1975</p>\n        <p class=\"lede\"><span class=\"lede-d\">Tap a place in the list or on the map. Drag to turn the map, pinch or scroll to zoom.</span><span class=\"lede-m\">Tap a place in the list or on the map. Tap <b>Utforsk</b> to open the map full screen, then drag to turn and pinch to zoom.</span></p>\n      </div>\n      <nav class=\"list\" id=\"gm-list\" aria-label=\"Places\"></nav>\n      <div class=\"foot\">\n        <strong>Grimerudvegen 77, 2312 Ottestad</strong>\n        <div class=\"coord\">60\u00b044\u203223\u2033N \u00b7 11\u00b007\u203252\u2033E</div>\n        <div>Site map by Jan Willem Middag \u00b7 Disc golf after UDisc \u00b7 Imagery \u00a9 Esri, Maxar, Earthstar Geographics. Positions and heights approximate.</div>\n      </div>\n    </aside>\n    <main class=\"stage\" id=\"gm-stage\">\n      <div class=\"gm-load\" id=\"gm-load\">Laster kart \u00b7 Loading map\u2026</div>\n      <canvas id=\"gm-c\" aria-label=\"Illustrated 3D map of Grimerud G\u00e5rd\"></canvas>\n      <div id=\"gm-pins\"></div>\n      <button class=\"dg-go\" id=\"gm-dggo\" hidden aria-label=\"Show the disc golf course\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 3v14M5 7h10l-1.5 4h-7z\" fill=\"none\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/><path d=\"M5.5 5h9\" stroke=\"#26221d\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M7 17h6\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg>Diskgolf</button>\n      <div class=\"topbar\">\n      <div class=\"seg maptabs\" role=\"group\" aria-label=\"Map\">\n        <button id=\"gm-mfarm\" aria-pressed=\"true\">Grimerud</button>\n        <button id=\"gm-mdisc\" aria-pressed=\"false\">Diskgolf</button>\n      </div>\n      <button class=\"gm-expand\" id=\"gm-expand\" aria-pressed=\"false\" aria-label=\"Utforsk kartet i fullskjerm \u00b7 Explore the map full screen\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg><span class=\"tx\">Utforsk</span></button>\n      <div class=\"hud\">\n        <div class=\"seg\" role=\"group\" aria-label=\"View\">\n          <button id=\"gm-v3d\" aria-pressed=\"true\">3D</button>\n          <button id=\"gm-vtop\" aria-pressed=\"false\">Kart<span class=\"en\"> \u00b7 Map</span></button>\n        </div>\n        <div class=\"seg\"><button id=\"gm-vnames\" aria-pressed=\"false\">Navn<span class=\"en\"> \u00b7 Names</span></button></div>\n        <div class=\"seg\"><button id=\"gm-vnight\" aria-pressed=\"false\" aria-label=\"Night mode\"><svg viewBox=\"0 0 20 20\" width=\"15\" height=\"15\" aria-hidden=\"true\" style=\"vertical-align:-3px;margin-right:5px\"><path d=\"M14.5 13.2A6.5 6.5 0 0 1 7 3.6a6.5 6.5 0 1 0 7.5 9.6z\" fill=\"currentColor\"/></svg><span class=\"tx\">Natt \u00b7 Night</span></button></div>\n        <button class=\"compass\" id=\"gm-compass\" title=\"Reset view\" aria-label=\"Reset view\">\n          <svg viewBox=\"0 0 40 40\" id=\"gm-needle\">\n            <path d=\"M20 3 L23 17 L37 20 L23 23 L20 37 L17 23 L3 20 L17 17 Z\" fill=\"#fffdf8\" stroke=\"#26221d\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/>\n            <path d=\"M20 3 L23 17 L20 20 Z M37 20 L23 23 L20 20 Z M20 37 L17 23 L20 20 Z M3 20 L17 17 L20 20 Z\" fill=\"#26221d\"/>\n            <path d=\"M20 3 L23 17 L20 20 L17 17 Z\" fill=\"#b23a2b\" stroke=\"#26221d\" stroke-width=\"1\"/>\n          </svg>\n        </button>\n      </div>\n      </div>\n      <button class=\"dg-go farm\" id=\"gm-farmgo\" hidden aria-label=\"Back to the Grimerud map\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M3 10l7-6 7 6M5 9v8h10V9\" fill=\"none\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/></svg>Grimerud</button>\n      <div class=\"card\" id=\"gm-card\" hidden>\n        <span class=\"num\" id=\"gm-cnum\"></span>\n        <div><h2 id=\"gm-cname\"></h2><p id=\"gm-cdesc\"></p></div>\n        <button class=\"close\" id=\"gm-cclose\" aria-label=\"Close\">\u00d7</button>\n      </div>\n      <div class=\"gm-wheel\" id=\"gm-wheel\" aria-hidden=\"true\">Hold Ctrl / \u2318 og scroll for \u00e5 zoome \u00b7 to zoom</div>\n      <div class=\"hint\" id=\"gm-hint\">Drag to turn \u00b7 right-drag or two fingers to move</div>\n    </main>\n  </div>\n</div>\n";
})();
// Grimerud G\u00e5rd map loader. build.py wraps map.js inside init() below and fills in the @-placeholders.
// It loads three.js and the heavy data file only when the map comes near the screen, then starts the map.
(function () {
  "use strict";
  var root = document.getElementById("grimerud-map");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";

  var DATA_URL = root.getAttribute("data-src") || "https://philemonl.github.io/grimerud-map/dist/grimerud-map-data.js?v=cf716eb6a9";
  var THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
  var ORBIT_URL = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";
  var fill = root.hasAttribute("data-fill"); // standalone page: the map is the whole page
  var loadEl = document.getElementById("gm-load");

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
    if (loadEl) loadEl.textContent = "Kartet kunne ikke lastes. \u00b7 The 3D map could not load. Reload the page to try again.";
  }
  function start() {
    script(THREE_URL, function () { return !!window.THREE; })
      .then(function () { return script(ORBIT_URL, function () { return !!(window.THREE && THREE.OrbitControls); }); })
      .then(function () { return script(DATA_URL, function () { return !!window.GRIMERUD_MAP_DATA; }); })
      .then(function () { return decodeTerrain(window.GRIMERUD_MAP_DATA.TERRAIN); })
      .then(function () { init(window.GRIMERUD_MAP_DATA); if (loadEl) loadEl.remove(); })
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

  // Embedded in a page, the mouse wheel scrolls the page; zoom with Ctrl/\u2318 + scroll, a trackpad pinch, or after clicking the map
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
    var GROUND_SITE = D.GROUND_SITE, GROUND_CTX = D.GROUND_CTX, TREES = D.TREES, TERRAIN = D.TERRAIN, FAR = D.FAR, FAR_IMG = D.FAR_IMG;
    const DATA = {"items":[{"n":"1","g":"b","no":"Hovedbygning","en":"Main building","sub_no":"Matsal \u00b7 Stuene \u00b7 Caf\u00e9 Alv \u00b7 TV-rom","sub_en":"Dining hall \u00b7 Living rooms \u00b7 Caf\u00e9 Alv \u00b7 TV room","parts":[{"p":[[762,962],[830,962],[830,1108],[762,1108]],"h":6.6,"wall":"#f7f5ef","roof":"#7b3a2b","bay":4.7,"dormers":6,"rise":4.5,"dormerSize":1.35,"chimneys":[[796,998],[796,1042]],"porch":[762,1035,"w"]},{"p":[[756,1086],[762,1086],[762,1106],[756,1106]],"h":3.3,"wall":"#f7f5ef","roof":"#e9e6de","flat":true,"railing":true}]},{"n":"2","g":"b","no":"Kontorbygning","en":"Office building","sub_no":"Resepsjon \u00b7 Kontorfl\u00f8y \u00b7 Studio","sub_en":"Reception \u00b7 Offices \u00b7 Studio","parts":[{"p":[[556,880],[656,880],[656,960],[556,960]],"h":7.8,"wall":"#e2b350","roof":"#8e3f2d","stucco":true,"solar":"s","base":[1.6,"#ecebe6","plain"],"bay":3.3,"rise":5.2,"chimneys":[[606,890]],"balconies":{"edge":3,"n":1,"upper":true,"y":4.4,"color":"#3b3a38"}}]},{"n":"3","g":"b","no":"Gym-bygning","en":"Gym building","sub_no":"Gymsal \u00b7 Lille b\u00f8nnerommet","sub_en":"Gym \u00b7 Little prayer room","parts":[{"p":[[659,860],[698,860],[698,960],[659,960]],"h":6.5,"wall":"#f4f2ec","roof":"#8e3f2d","steeple":true}]},{"n":"4","g":"b","no":"L\u00e5ven","en":"The Barn","sub_no":"M\u00f8tesal \u00b7 Prokla Media \u00b7 B\u00f8nnerom","sub_en":"Meeting hall \u00b7 Prokla Media \u00b7 Prayer room","parts":[{"p":[[572,640],[800,640],[800,748],[572,748]],"h":6.2,"wall":"#a3282a","gable":"#a3282a","base":[3.0,"#d8d5cc"],"roof":"#46474b","plain":true,"rise":7.5,"garage":[[668,748,"s",3.6,3.0]]},{"p":[[692,736],[752,736],[752,768],[692,768]],"h":6.2,"wall":"#a3282a","base":[3.0,"#d8d5cc"],"roof":"#46474b","cross":true,"rise":4.6,"porch":[730,768,"s","plain"]},{"p":[[681,748],[691,748],[691,758],[681,758]],"h":2.6,"wall":"#a3282a","roof":"#46474b","plain":true,"trim":false,"rise":0.9},{"p":[[562,690],[572,690],[572,712],[562,712]],"h":2.4,"wall":"#a3282a","roof":"#cfd6d8","flat":true,"plain":true,"trim":false},{"p":[[756,750],[797,750],[797,840],[756,840]],"h":2.8,"wall":"#fbfaf5","roof":"#f6f4ee","tent":true,"trim":false}]},{"n":"4a","g":"b","no":"B\u00f8nnerommet","en":"Prayer room","sub_no":"Oppe i inngangsfl\u00f8yen til l\u00e5ven","sub_en":"Upstairs in the barn\u2019s entrance wing","pin":[722,752],"inside":"4","pinH":11},{"n":"4b","g":"b","no":"Overflow-rommet","en":"Overflow room","sub_no":"Inne i l\u00e5ven, i vestenden","sub_en":"Inside the barn, at the west end","pin":[606,688],"inside":"4"},{"n":"5","g":"b","no":"Internatet","en":"Dormitories","sub_no":"","sub_en":"","parts":[{"p":[[1138,1108],[1178,1108],[1178,1212],[1138,1212]],"h":6.5,"wall":"#a8292a","roof":"#6e3a2e","balconies":[{"edge":1,"n":2,"color":"#f4f2ec"},{"edge":3,"n":3,"color":"#f4f2ec"}]},{"p":[[1158,1143],[1188,1143],[1188,1175],[1158,1175]],"h":6.5,"wall":"#a8292a","roof":"#5a2d26","cross":true,"rise":4.4,"trim":false}]},{"n":"6","g":"b","no":"\u00abBispen\u00bb","en":"\u00abBispen\u00bb","sub_no":"","sub_en":"","parts":[{"p":[[654,1090],[690,1090],[690,1148],[654,1148]],"h":5,"wall":"#e8c77e","roof":"#4a4d52","solar":true,"bay":3.6},{"p":[[690,1098],[704,1098],[704,1146],[690,1146]],"h":0.7,"wall":"#8a5a44","roof":"#9c6b52","flat":true,"plain":true,"trim":false}]},{"n":"7","g":"b","no":"Hybelhuset","en":"Men's Manor","sub_no":"","sub_en":"","parts":[{"p":[[1100,1300],[1118,1276],[1158,1306],[1140,1332]],"h":3.4,"wall":"#e6bf4f","roof":"#c0532f","rise":4.8,"dormers":1,"dormerSize":3,"chimneys":[[1124,1298]],"bay":3.6},{"p":[[1128,1302],[1149,1318],[1175,1284],[1154,1268]],"h":3.0,"wall":"#e6bf4f","roof":"#c0532f","rise":2.8,"trim":false,"bay":3.6}]},{"n":"8","g":"b","no":"Rekkehusene","en":"Row houses","sub_no":"","sub_en":"","parts":[{"p":[[1017,1297],[1054,1323],[1035,1349],[998,1322]],"h":5.6,"wall":"#a12e28","roof":"#6b5b53","bay":3.4,"balconies":{"edge":2,"n":2}},{"p":[[1061,1316],[1098,1343],[1080,1369],[1043,1342]],"h":5.6,"wall":"#a12e28","roof":"#6b5b53","bay":3.4,"balconies":{"edge":2,"n":2}},{"p":[[1094,1352],[1131,1379],[1112,1405],[1075,1378]],"h":5.6,"wall":"#a12e28","roof":"#6b5b53","bay":3.4,"balconies":{"edge":2,"n":2}}]},{"n":"9","g":"b","no":"Grimerud Barnehage","en":"Grimerud Kindergarten","sub_no":"","sub_en":"","parts":[{"p":[[862,1064],[906,1064],[906,1112],[862,1112]],"h":5.5,"wall":"#a8292a","roof":"#b23e2c","solar":true},{"p":[[882,1112],[906,1112],[906,1200],[882,1200]],"h":4.5,"wall":"#a8292a","roof":"#b23e2c"},{"p":[[894,1128],[924,1128],[924,1152],[894,1152]],"h":4.5,"wall":"#a8292a","roof":"#5a2d26","rise":2.7,"trim":false}]},{"n":"P","g":"a","no":"Parkering","en":"Car park","sub_no":"","sub_en":"Main parking on the south side of the farm road.","area":[[915,936],[1065,926],[1070,1035],[925,1042]]},{"n":"E","g":"a","no":"Innkj\u00f8ring","en":"Entrance","sub_no":"","sub_en":"Turn west off Grimerudvegen. The car park is about 100 m ahead on the left.","pin":[1337,846]},{"n":"H","g":"a","no":"Hagen og ballplassen","en":"Garden & football lawn","sub_no":"Fotballbane og sandvolleyballbane","sub_en":"Football pitch and beach volleyball court","area":[[504,988],[770,988],[770,1113],[700,1117],[700,1212],[504,1212]],"pin":[600,1045]},{"n":"L","g":"a","no":"Lekeplassen","en":"Playground","sub_no":"","sub_en":"Play area in the trees between the kindergarten and the dormitories.","area":[[925,1090],[1110,1085],[1115,1250],[930,1250]],"pin":[1010,1160]},{"n":"G","g":"o","no":"Garasjen","en":"Garage","sub_no":"","sub_en":"Red garage building east of the barn.","parts":[{"p":[[952,680],[1000,680],[1000,800],[952,800]],"h":5,"wall":"#a8292a","roof":"#8b8f8c"}]},{"n":"Y","g":"o","no":"Det gule huset","en":"Yellow house","sub_no":"","sub_en":"Small yellow house between the garage and the main building.","parts":[{"p":[[852,812],[892,812],[892,846],[852,846]],"h":4.5,"wall":"#e6bf4f","roof":"#c0532f"}]},{"n":"S","g":"o","no":"Barracks","en":"Barracks","sub_no":"","sub_en":"Long, low building along the farm road, opposite the car park.","parts":[{"p":[[1026,872],[1210,832],[1220,866],[1035,906]],"h":6,"wall":"#a8292a","roof":"#d6d4ce","flat":true}]},{"n":"W","g":"o","no":"Spiseteltet","en":"Dining tent","sub_no":"","sub_en":"Large white tent just south of the main building.","parts":[{"p":[[792,1138],[826,1138],[826,1200],[792,1200]],"h":2.6,"wall":"#fbfaf5","roof":"#f6f4ee","tent":true}]},{"n":"N","g":"o","no":"Nordl\u00e5ven","en":"North barn","sub_no":"","sub_en":"Older farm barn and work yard north of the garage, reached by the farm track.","parts":[{"p":[[983,253],[1037,256],[1030,404],[978,400]],"h":7,"wall":"#a8292a","gable":"#a8292a","roof":"#55585c","plain":true,"base":[1.6,"#d9d5cc"]},{"p":[[830,303],[866,303],[866,338],[830,338]],"h":3.5,"wall":"#a8292a","roof":"#55585c","plain":true}]},{"n":"I","g":"o","no":"Huset ved innkj\u00f8ringen","en":"House at the entrance","sub_no":"","sub_en":"First house on the right as you turn in from Grimerudvegen.","parts":[{"p":[[1360,790],[1404,790],[1404,816],[1360,816]],"h":4.5,"wall":"#f4f1ea","roof":"#c4432d"}]},{"n":"DG","g":"d","no":"Grimerud diskgolfbane","en":"Grimerud disc golf course","sub_no":"Parker p\u00e5 Grimerud g\u00e5rd og f\u00f8lg den stiplede ruten \u00b7 ca. 700 m","sub_en":"Park at Grimerud g\u00e5rd and follow the dashed route \u00b7 about 700 m","pin":[2966,-209],"size":260,"disc":"all"},{"n":"1","g":"d","no":"Hull 1","en":"Hole 1","sub_no":"ca. 73 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 73 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2456.8,-85.2],"focus":[2421,35],"size":40.150000000000006,"disc":1},{"n":"2","g":"d","no":"Hull 2","en":"Hole 2","sub_no":"ca. 144 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 144 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2829.7,-252.7],"focus":[2648,-87],"size":79.2,"disc":2},{"n":"3","g":"d","no":"Hull 3","en":"Hole 3","sub_no":"ca. 94 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 94 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2890.0,-440.0],"focus":[2762,-343],"size":51.7,"disc":3},{"n":"4","g":"d","no":"Hull 4","en":"Hole 4","sub_no":"ca. 64 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 64 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2756.0,-625.8],"focus":[2830,-546],"size":35.2,"disc":4},{"n":"5","g":"d","no":"Hull 5","en":"Hole 5","sub_no":"ca. 88 m \u00b7 utkast: Bl\u00e5 / R\u00f8d","sub_en":"About 88 m \u00b7 tee: Bl\u00e5 / R\u00f8d","pin":[2689.7,-424.8],"focus":[2654,-571],"size":48.400000000000006,"disc":5},{"n":"6","g":"d","no":"Hull 6","en":"Hole 6","sub_no":"ca. 127 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 127 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2499.2,-726.2],"focus":[2557,-516],"size":69.85000000000001,"disc":6},{"n":"7","g":"d","no":"Hull 7","en":"Hole 7","sub_no":"ca. 64 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 64 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2487.9,-1009.4],"focus":[2502,-901],"size":35.2,"disc":7},{"n":"8","g":"d","no":"Hull 8","en":"Hole 8","sub_no":"ca. 64 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 64 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2697.6,-927.2],"focus":[2609,-991],"size":35.2,"disc":8},{"n":"9","g":"d","no":"Hull 9","en":"Hole 9","sub_no":"ca. 77 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 77 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2805.7,-765.8],"focus":[2674,-770],"size":42.35,"disc":9},{"n":"10","g":"d","no":"Hull 10","en":"Hole 10","sub_no":"ca. 102 m \u00b7 utkast: Bl\u00e5 / R\u00f8d","sub_en":"About 102 m \u00b7 tee: Bl\u00e5 / R\u00f8d","pin":[2967.0,-601.4],"focus":[2873,-749],"size":56.1,"disc":10},{"n":"11","g":"d","no":"Hull 11","en":"Hole 11","sub_no":"ca. 67 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 67 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2987.4,-315.2],"focus":[2960,-427],"size":36.85,"disc":11},{"n":"12","g":"d","no":"Hull 12","en":"Hole 12","sub_no":"ca. 110 m \u00b7 utkast: Bl\u00e5 / R\u00f8d","sub_en":"About 110 m \u00b7 tee: Bl\u00e5 / R\u00f8d","pin":[2957.9,19.8],"focus":[2923,-166],"size":60.50000000000001,"disc":12},{"n":"13","g":"d","no":"Hull 13","en":"Hole 13","sub_no":"ca. 82 m \u00b7 utkast: Bl\u00e5","sub_en":"About 82 m \u00b7 tee: Bl\u00e5","pin":[3504.0,523.7],"focus":[3398,431],"size":45.1,"disc":13},{"n":"14","g":"d","no":"Hull 14","en":"Hole 14","sub_no":"ca. 108 m \u00b7 utkast: Bl\u00e5","sub_en":"About 108 m \u00b7 tee: Bl\u00e5","pin":[4034.2,765.8],"focus":[3854,722],"size":59.400000000000006,"disc":14},{"n":"15","g":"d","no":"Hull 15","en":"Hole 15","sub_no":"ca. 77 m \u00b7 utkast: Bl\u00e5","sub_en":"About 77 m \u00b7 tee: Bl\u00e5","pin":[4178.0,610.5],"focus":[4187,742],"size":42.35,"disc":15},{"n":"16","g":"d","no":"Hull 16","en":"Hole 16","sub_no":"ca. 144 m \u00b7 utkast: Bl\u00e5","sub_en":"About 144 m \u00b7 tee: Bl\u00e5","pin":[3626.8,473.5],"focus":[3849,582],"size":79.2,"disc":16},{"n":"17","g":"d","no":"Hull 17","en":"Hole 17","sub_no":"ca. 85 m \u00b7 utkast: Bl\u00e5","sub_en":"About 85 m \u00b7 tee: Bl\u00e5","pin":[3113.1,184.2],"focus":[3246,244],"size":46.75000000000001,"disc":17},{"n":"18","g":"d","no":"Hull 18","en":"Hole 18","sub_no":"ca. 130 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 130 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2448.4,207.1],"focus":[2645,105],"size":71.5,"disc":18}],"disc":[{"hole":1,"basket":[2456.8,-85.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2384.5,155.3]}],"length":73},{"hole":2,"basket":[2829.7,-252.7],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2466.3,79.2]}],"length":144},{"hole":3,"basket":[2890.0,-440.0],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2634.0,-245.1]}],"length":94},{"hole":4,"basket":[2756.0,-625.8],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2903.6,-465.9]}],"length":64},{"hole":5,"basket":[2689.7,-424.8],"tees":[{"label":"Bl\u00e5","p":[2617.6,-717.1]},{"label":"R\u00f8d","p":[2672.4,-674.5]}],"length":88},{"hole":6,"basket":[2499.2,-726.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2614.1,-306.0]}],"length":127},{"hole":7,"basket":[2487.9,-1009.4],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2515.8,-793.2]}],"length":64},{"hole":8,"basket":[2697.6,-927.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2521.2,-1055.1]}],"length":64},{"hole":9,"basket":[2805.7,-765.8],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2541.6,-775.0]}],"length":77},{"hole":10,"basket":[2967.0,-601.4],"tees":[{"label":"Bl\u00e5","p":[2778.1,-896.8]},{"label":"R\u00f8d","p":[2831.4,-820.6]}],"length":102},{"hole":11,"basket":[2987.4,-315.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2932.2,-539.0]}],"length":67},{"hole":12,"basket":[2957.9,19.8],"tees":[{"label":"Bl\u00e5","p":[2887.2,-351.7]},{"label":"R\u00f8d","p":[2975.5,-245.1]}],"length":110},{"hole":13,"basket":[3504.0,523.7],"tees":[{"label":"Bl\u00e5","p":[3292.6,338.0]}],"length":82},{"hole":14,"basket":[4034.2,765.8],"tees":[{"label":"Bl\u00e5","p":[3672.8,679.0]}],"length":108},{"hole":15,"basket":[4178.0,610.5],"tees":[{"label":"Bl\u00e5","p":[4195.4,873.9]}],"length":77},{"hole":16,"basket":[3626.8,473.5],"tees":[{"label":"Bl\u00e5","p":[4070.5,691.2]}],"length":144},{"hole":17,"basket":[3113.1,184.2],"tees":[{"label":"Bl\u00e5","p":[3379.0,303.0]}],"length":85},{"hole":18,"basket":[2448.4,207.1],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2842.5,3.1]}],"length":130}],"walk":[[1020,962],[1048,925],[1080,910],[1150,893],[1228,872],[1300,850],[1385,834],[1446,836],[1440,760],[1428,588],[1400,392],[1393,0],[1396,10],[1700,12],[2000,14],[2310,16],[2360,100],[2385,150]],"context":[{"p":[[1178,1398],[1210,1368],[1240,1405],[1205,1435]],"h":5,"wall":"#e6bd4e","roof":"#c97f4a"}],"flag":[752,952],"roads":[[[[1480,-1280],[1400,-1120],[1384,-880],[1388,-480],[1393,0],[1400,392],[1428,588],[1440,760],[1446,850],[1446,980],[1428,1162],[1390,1255],[1344,1344],[1255,1478],[1232,1500],[1148,1650],[1078,1740],[1043,1792]],6,"road"],[[[1446,846],[1600,846],[1792,841]],5.5,"road"],[[[1205,1585],[1350,1588],[1500,1588]],4.5,"road"],[[[1446,836],[1385,834],[1300,856],[1228,882],[1150,904],[1080,916],[1030,921],[960,927],[900,933],[840,935],[790,931],[757,927]],5,"drive"],[[[975,925],[955,912],[930,890],[910,860],[907,830],[898,798],[860,788],[828,790]],5,"drive"],[[[1386,823],[1388,852]],3,"path"],[[[1393,399],[1200,424],[1029,448],[950,462],[925,540],[922,620],[925,700],[930,795]],3.2,"track"],[[[950,462],[948,435],[955,418],[968,410]],3.2,"track"],[[[560,622],[400,614],[200,611],[0,609]],3.2,"track"],[[[598,790],[566,782],[552,760],[550,700],[553,645],[562,625],[600,620],[700,618],[800,622],[860,640],[905,680],[925,700]],3,"track"],[[[828,795],[860,795],[930,803],[948,808]],3,"path"],[[[715,845],[725,880],[735,908]],3,"path"],[[[748,945],[745,1000],[745,1060],[745,1100],[752,1122]],3,"path"],[[[745,1080],[725,1092],[711,1096]],2.8,"path"],[[[925,1040],[890,1036],[852,1040],[845,1080],[845,1123]],3,"path"],[[[752,1122],[800,1123],[845,1123],[855,1160],[868,1210],[935,1250],[990,1280]],3,"path"],[[[1066,1000],[1090,1040],[1110,1064],[1165,1076],[1195,1090],[1212,1115],[1220,1165],[1205,1210],[1165,1228],[1120,1248],[1085,1272],[1068,1302]],3,"path"],[[[990,1280],[1031,1276],[1100,1325],[1150,1362],[1160,1395],[1175,1430],[1215,1462],[1255,1478]],3.2,"drive"]],"circle":[740,925,19],"island":[[622,782],[688,780],[692,852],[640,860],[620,830]],"yard":[[590,752],[805,752],[840,790],[840,840],[700,845],[595,840]],"sports":{"goals":[[548,1000,0],[548,1096,180]],"court":[[562,1120],[637,1120],[637,1190],[562,1190]],"net":[[600,1124],[600,1186]]},"hedges":[[[997,1324],[980,1348],[1017,1375],[1034,1351]],[[1041,1344],[1024,1368],[1061,1395],[1078,1370]],[[1074,1379],[1056,1404],[1093,1431],[1111,1406]]]};
    // Grimerud G\u00e5rd map: scene, pins, legend and controls.
    // Runs inside init() in loader.js, which provides: root (the #grimerud-map element), onScreen(),
    // DATA (places, roads, disc golf from src/content) and the heavy assets
    // GROUND_SITE, GROUND_CTX, TREES, TERRAIN (heights already decoded to TERRAIN.v), FAR, FAR_IMG.
    let waveFlag = null, hillsMat = null;
    const M = 0.29188, S = 1792 * M, CTX_S = 1643.86816, CTX_CX = 336.24576, CTX_CZ = 37.36064;
    const P = ([x, y]) => [(x - 896) * M, (y - 896) * M];
    const INK = 0x26221d;
    const GROUPS = { b: ["Bygninger", "Buildings"], a: ["Ankomst og uteomr\u00e5der", "Arrival & outdoors"], o: ["Andre bygg", "Other buildings"], d: ["Diskgolf", "Disc golf"] };
    const ITEMS = DATA.items;

    const stage = document.getElementById("gm-stage");
    const listEl = document.getElementById("gm-list");
    const pinsEl = document.getElementById("gm-pins");
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const nameHTML = it => it.no === it.en ? esc(it.no) : `${esc(it.no)} / <i>${esc(it.en)}</i>`;
    const subHTML = it => (it.sub_no ? `${esc(it.sub_no)}<i>${esc(it.sub_en)}</i>` : esc(it.sub_en || ""));

    // Legend list
    ["b", "a", "o", "d"].forEach(g => {
      const h = document.createElement("div"); h.className = "group";
      h.innerHTML = `${GROUPS[g][0]} \u00b7 <i>${GROUPS[g][1]}</i>`; listEl.appendChild(h);
      ITEMS.filter(it => it.g === g).forEach(it => {
        const b = document.createElement("button");
        b.className = "item"; b.setAttribute("aria-pressed", "false");
        const sq = it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq";
        b.innerHTML = `<span class="num${sq}">${esc(it.n)}</span><span><span class="nm">${nameHTML(it)}</span>${subHTML(it) ? `<span class="sub">${subHTML(it)}</span>` : ""}</span>`;
        b.addEventListener("click", () => select(it, true));
        listEl.appendChild(b); it.btn = b;
      });
    });


    // Renderer and scene
    const canvas = document.getElementById("gm-c");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7f5ef, 1300, 8500);
    const camera = new THREE.PerspectiveCamera(36, 1, 1, 9000);
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.minDistance = 30; controls.maxDistance = 1150; controls.maxPolarAngle = 1.3;
    controls.screenSpacePanning = false;

    const amb = new THREE.AmbientLight(0xffffff, 0.42); scene.add(amb);
    const sun = new THREE.DirectionalLight(0xfff6e6, 0.66); sun.position.set(-220, 320, 160); scene.add(sun);

    const grad = new THREE.DataTexture(new Uint8Array([105, 105, 105, 180, 180, 180, 255, 255, 255]), 3, 1, THREE.RGBFormat);
    grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.generateMipmaps = false; grad.needsUpdate = true;
    const toon = (o) => new THREE.MeshToonMaterial(Object.assign({ gradientMap: grad, side: THREE.DoubleSide }, o));
    const inkMat = new THREE.LineBasicMaterial({ color: INK });

    // Ground
    const loader = new THREE.TextureLoader();
    const aniso = renderer.capabilities.getMaxAnisotropy();
    function tex(src) { const t = loader.load(src); t.anisotropy = aniso; return t; }
    // Terrain: Kartverket 1 m DTM resampled to a 3 m grid, heights exaggerated for readability
    const EX = 1.4;
    const TER = { n: TERRAIN.n, x0: TERRAIN.x0, z0: TERRAIN.z0, step: TERRAIN.size / (TERRAIN.n - 1), off: TERRAIN.hmin - TERRAIN.h0, v: TERRAIN.v }; // heights decoded by the loader
    function hAt(x, z) {
      const { n, x0, z0, step, v, off } = TER;
      let fx = (x - x0) / step, fz = (z - z0) / step;
      fx = Math.max(0, Math.min(n - 1.001, fx)); fz = Math.max(0, Math.min(n - 1.001, fz));
      const i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j;
      const g = (a, b) => v[b * n + a] / 100;
      const h = g(i, j) * (1 - tx) * (1 - tz) + g(i + 1, j) * tx * (1 - tz) + g(i, j + 1) * (1 - tx) * tz + g(i + 1, j + 1) * tx * tz;
      return (h + off) * EX;
    }
    function terrainPlane(size, seg, cx, cz, dy, map) {
      const g = new THREE.PlaneGeometry(size, size, seg, seg); g.rotateX(-Math.PI / 2); g.translate(cx, 0, cz);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setY(i, hAt(pos.getX(i), pos.getZ(i)) + dy);
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map })); scene.add(m); return m;
    }
    const ctxGround = terrainPlane(CTX_S, 320, CTX_CX, CTX_CZ, -0.35, tex(GROUND_CTX));
    // Distant landscape with Mj\u00f8sa: a coarse painted sheet (~11 km) laid under the detailed ground
    (() => {
      const bin = atob(FAR.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const v = new Uint16Array(u8.buffer), n = FAR.n, seg = n - 1;
      const g = new THREE.PlaneGeometry(FAR.size, FAR.size, seg, seg); g.rotateX(-Math.PI / 2);
      g.translate(FAR.x0 + FAR.size / 2, 0, FAR.z0 + FAR.size / 2);
      const pos = g.attributes.position, half = CTX_S / 2 - 30;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i), col = i % n, row = Math.floor(i / n);
        let y = (v[row * n + col] / 10 + FAR.hmin - TERRAIN.h0) * EX;
        // tuck under the detailed ground so the two never fight
        if (Math.abs(x - CTX_CX) < half && Math.abs(z - CTX_CZ) < half) y -= 12; else y -= 1.2;
        pos.setY(i, y);
      }
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex(FAR_IMG) })); scene.add(m);
      // a soft ring of far hills on the horizon, in hazy aerial-perspective blue
      const R0 = 6200, segs = 180, pts = [], idx = [];
      let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
      for (let i = 0; i <= segs; i++) {
        const a = i / segs * Math.PI * 2;
        const h = 120 + 70 * Math.sin(a * 3 + ph[0]) + 45 * Math.sin(a * 7 + ph[1]) + 22 * Math.sin(a * 17 + ph[2]);
        const cx = -1000 + Math.cos(a) * R0, cz = Math.sin(a) * R0, base = (123 - TERRAIN.h0) * EX - 20;
        pts.push(cx, base, cz, cx, base + h * EX, cz);
        if (i < segs) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
      const hg = new THREE.BufferGeometry(); hg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); hg.setIndex(idx);
      const cols = []; for (let i = 0; i <= segs; i++) cols.push(0.47, 0.58, 0.50, 0.49, 0.58, 0.64);  // base: hazy green, ridge: blue-grey
      hg.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      hillsMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, fog: false });
      scene.add(new THREE.Mesh(hg, hillsMat));
    })();
    const siteGround = terrainPlane(S, 260, 0, 0, 0, tex(GROUND_SITE));

    // Painted textures for walls and roofs
    const cache = {};
    function canvasTex(key, w, h, draw) {
      if (cache[key]) return cache[key];
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso;
      t.__key = key; return (cache[key] = t);
    }
    const wallTex = color => canvasTex("w" + color, 64, 64, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 64; i += 4) g.fillRect(i, 0, 1, h);   // board lines
      g.fillStyle = "#fffdf8"; g.fillRect(22, 18, 20, 26);
      g.fillStyle = "#3b4a52"; g.fillRect(25, 21, 14, 20);
      g.fillStyle = "#fffdf8"; g.fillRect(31, 21, 2, 20); g.fillRect(25, 30, 14, 2);
      g.strokeStyle = "#26221d"; g.lineWidth = 1.5; g.strokeRect(22, 18, 20, 26);
    });
    // Window glow for night mode: the same layout as wallTex, lit panes only
    const glowTex = canvasTex("glow", 64, 64, (g, w, h) => {
      g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
      const grd = g.createLinearGradient(0, 21, 0, 41); grd.addColorStop(0, "#ffd98a"); grd.addColorStop(1, "#ffb347");
      g.fillStyle = grd; g.fillRect(25, 21, 14, 20);
      g.fillStyle = "#3a2a10"; g.fillRect(31, 21, 2, 20); g.fillRect(25, 30, 14, 2);
    });
    const boardTex = color => canvasTex("b" + color, 64, 64, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 64; i += 4) g.fillRect(i, 0, 1, h);
    });
    const stuccoTex = color => canvasTex("ws" + color, 64, 64, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      let s = 5; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 140; i++) g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
      g.fillStyle = "#fffdf8"; g.fillRect(22, 18, 20, 26);
      g.fillStyle = "#3b4a52"; g.fillRect(25, 21, 14, 20);
      g.fillStyle = "#fffdf8"; g.fillRect(31, 21, 2, 20); g.fillRect(25, 30, 14, 2);
      g.strokeStyle = "#26221d"; g.lineWidth = 1.5; g.strokeRect(22, 18, 20, 26);
    });
    const solarTex = color => canvasTex("solar" + color, 64, 64, (g, w, h) => {
      g.fillStyle = "#262d39"; g.fillRect(0, 0, w, h);                 // panel field
      g.fillStyle = "#3e4757"; for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 1, h); for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 1);
      g.fillStyle = color; g.globalAlpha = .55; g.fillRect(0, 62, w, 2); g.globalAlpha = 1;   // a sliver of tile between panel rows
    });
    const roofTex = color => canvasTex("r" + color, 32, 32, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(0, 28, w, 3);
      g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(0, 0, w, 6);
    });

    const tentTex = () => canvasTex("tent", 32, 32, (g, w, h) => {
      g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#e4e1d8"; g.fillRect(0, 0, 16, h);
      g.fillStyle = "rgba(38,34,29,.25)"; g.fillRect(15, 0, 1, h);
    });

    // Draped overlays: a canvas-painted patch that follows the terrain (car park, yard, highlights)
    function drape(pts, opts) {
      const xs = pts.map(p => p[0]), zs = pts.map(p => p[1]), pad = 2;
      const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, z0 = Math.min(...zs) - pad, z1 = Math.max(...zs) + pad;
      const w = x1 - x0, d = z1 - z0, ppm = Math.min(6, 1024 / Math.max(w, d));
      const c = document.createElement("canvas"); c.width = Math.ceil(w * ppm); c.height = Math.ceil(d * ppm);
      const g = c.getContext("2d"); g.lineJoin = "round";
      const path = () => { g.beginPath(); pts.forEach(([x, z], i) => g[i ? "lineTo" : "moveTo"]((x - x0) * ppm, (z - z0) * ppm)); g.closePath(); };
      path();
      if (opts.fill) { g.fillStyle = opts.fill; g.fill(); }
      if (opts.draw) opts.draw(g, (x, z) => [(x - x0) * ppm, (z - z0) * ppm], ppm);
      if (opts.stroke) { path(); g.strokeStyle = opts.stroke; g.lineWidth = opts.strokeW * ppm; g.stroke(); }
      const t = new THREE.CanvasTexture(c); t.anisotropy = aniso;
      const geo = new THREE.PlaneGeometry(w, d, Math.ceil(w / 2), Math.ceil(d / 2)); geo.rotateX(-Math.PI / 2); geo.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setY(i, hAt(pos.getX(i), pos.getZ(i)) + (opts.dy || 0.15));
      const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: opts.opacity ?? 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
      const mesh = new THREE.Mesh(geo, mat); mesh.renderOrder = opts.order || 1; scene.add(mesh); return mesh;
    }

    // Roads, paths, car park and yard: painted on a transparent canvas laid over the terrain mesh.
    // Using the ground's own vertices means the overlay follows every slope with no steps or gaps.
    (() => {
      const GRAVEL = "#ddcca8", GRAVEL_LIGHT = GRAVEL, INKC = "#26221d";
      const chaikin = (pts, n) => { for (let k = 0; k < n; k++) { if (pts.length < 3) break; const o = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; o.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } o.push(pts[pts.length - 1]); pts = o; } return pts; };
      const park = ITEMS.find(i => i.n === "P").area.map(P), yard = DATA.yard.map(P), island = DATA.island.map(P);
      const [ccx, ccy, cr] = DATA.circle, cc = P([ccx, ccy]);
      const lines = DATA.roads.map(([pts, w, kind]) => ({ pts: chaikin(pts.map(P), 3), w: Math.max(w, 3.2), kind }));
      function paint(size, cx, cz, px, clipSite) {
        const c = document.createElement("canvas"); c.width = c.height = px;
        const g = c.getContext("2d"), k = px / size, ox = cx - size / 2, oz = cz - size / 2;
        const X = ([x, z]) => [(x - ox) * k, (z - oz) * k];
        g.lineCap = g.lineJoin = "round";
        const poly = pts => { g.beginPath(); pts.forEach((p, i) => g[i ? "lineTo" : "moveTo"](...X(p))); g.closePath(); };
        const strokeLines = (extra, color, filter) => { g.strokeStyle = color; lines.filter(filter).forEach(l => { g.lineWidth = (l.w + extra) * k; g.beginPath(); l.pts.forEach((p, i) => g[i ? "lineTo" : "moveTo"](...X(p))); g.stroke(); }); };
        // ink outlines first, then the gravel on top, so joins merge cleanly
        strokeLines(1.1, INKC, () => true);
        g.lineWidth = 4.3 * k; g.strokeStyle = INKC; g.beginPath(); g.arc(...X(cc), cr * M * k, 0, 6.2832); g.stroke();
        [park, yard].forEach(a => { poly(a); g.lineWidth = 1.1 * k; g.strokeStyle = INKC; g.stroke(); });
        [park, yard].forEach(a => { poly(a); g.fillStyle = GRAVEL; g.fill(); });
        strokeLines(0, GRAVEL, l => l.kind === "road" || l.kind === "drive");
        strokeLines(0, GRAVEL_LIGHT, l => l.kind === "path" || l.kind === "track");
        g.lineWidth = 3.2 * k; g.strokeStyle = GRAVEL_LIGHT; g.beginPath(); g.arc(...X(cc), cr * M * k, 0, 6.2832); g.stroke();
        // grass island in the farmyard
        poly(island); g.fillStyle = "#6fa83c"; g.fill(); g.lineWidth = 0.7 * k; g.strokeStyle = INKC; g.stroke();
        // a little gravel grain
        let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
        g.globalCompositeOperation = "source-atop"; g.fillStyle = "rgba(90,70,40,.18)";
        for (let i = 0; i < px * px / 140; i++) g.fillRect(rnd() * px, rnd() * px, 1.2, 1.2);
        g.globalCompositeOperation = "source-over";
        if (clipSite) { const [a0] = X([-S / 2 + 1, -S / 2 + 1]), [a1] = X([S / 2 - 1, S / 2 - 1]); g.clearRect(a0, a0, a1 - a0, a1 - a0); }
        const t = new THREE.CanvasTexture(c); t.anisotropy = aniso; return t;
      }
      function overlay(ground, map, dy, order) {
        const geo = ground.geometry.clone(); const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) + dy);
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
        m.renderOrder = order; scene.add(m);
      }
      const big = Math.min(3072, renderer.capabilities.maxTextureSize);
      overlay(siteGround, paint(S, 0, 0, big, false), 0.08, 1);
      overlay(ctxGround, paint(CTX_S, CTX_CX, CTX_CZ, 2048, true), 0.08, 1);
    })();
    function addInk(geom, parent, threshold = 25, mat = inkMat) {
      const l = new THREE.LineSegments(new THREE.EdgesGeometry(geom, threshold), mat);
      parent.add(l); return l;
    }
    function geomFrom(pos, uv) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      if (uv) g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals(); return g;
    }
    function wallGeom(pts, h, y0 = 0, bay = 4.4) {
      const pos = [], uv = [];
      let u = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, z1] = pts[i], [x2, z2] = pts[(i + 1) % pts.length];
        // whole windows only: each wall gets an integer number of bays and floors, so no window is cut at a corner
        const L = Math.hypot(x2 - x1, z2 - z1), bays = Math.max(1, Math.round(L / bay)), floors = Math.max(1, Math.round((h - y0) / 2.9));
        pos.push(x1, y0, z1, x2, y0, z2, x2, h, z2, x1, y0, z1, x2, h, z2, x1, h, z1);
        uv.push(0, 0, bays, 0, bays, floors, 0, 0, bays, floors, 0, floors);
      }
      return geomFrom(pos, uv);
    }
    function flatRoof(pts, y) {
      const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
      const g = new THREE.ShapeGeometry(shape); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); return g;
    }
    function gable(pts, h, maxRise = 6.5, cross = false) {
      const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      let [p0, p1, p2, p3] = pts;
      if ((d(p0, p1) < d(p1, p2)) !== cross) [p0, p1, p2, p3] = [p1, p2, p3, p0];
      const span = (d(p1, p2) + d(p3, p0)) / 2, rise = Math.min(span * 0.42, maxRise);
      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const m1 = mid(p1, p2), m2 = mid(p3, p0), top = h + rise;
      // small eave overhang
      const ov = 0.45, c = mid(m1, m2);
      const grow = p => { const dx = p[0] - c[0], dz = p[1] - c[1], l = Math.hypot(dx, dz); return [p[0] + dx / l * ov, p[1] + dz / l * ov]; };
      const q0 = grow(p0), q1 = grow(p1), q2 = grow(p2), q3 = grow(p3);
      const ax = [m2[0] - m1[0], m2[1] - m1[1]], al = Math.hypot(...ax); ax[0] /= al; ax[1] /= al;
      const V = (p, y) => [p[0], y, p[1]];
      const along = p => (p[0] * ax[0] + p[1] * ax[1]) / 2.2;
      const pos = [], uv = [];
      const tri = (a, b, cc) => { for (const p of [a, b, cc]) { pos.push(...p); uv.push(along([p[0], p[2]]), p[1] / 0.6); } };
      const hy = h - 0.25;
      tri(V(q0, hy), V(q1, hy), V(m1, top)); tri(V(q0, hy), V(m1, top), V(m2, top));
      tri(V(q2, hy), V(q3, hy), V(m2, top)); tri(V(q2, hy), V(m2, top), V(m1, top));
      const ends = [...V(p1, h), ...V(p2, h), ...V(m1, top - 0.2), ...V(p3, h), ...V(p0, h), ...V(m2, top - 0.2)];
      const halves = [0, 1].map(k => geomFrom(pos.slice(k * 18, k * 18 + 18), uv.slice(k * 12, k * 12 + 12)));
      const outA = [mid(p0, p1)[0] - c[0], mid(p0, p1)[1] - c[1]], outB = [mid(p2, p3)[0] - c[0], mid(p2, p3)[1] - c[1]];
      return { roof: geomFrom(pos, uv), halves, outs: [outA, outB], ends: geomFrom(ends), top, rise, h, slopes: [[p0, p1, m2, m1], [p2, p3, m1, m2]], ridgeMid: [(m1[0] + m2[0]) / 2, (m1[1] + m2[1]) / 2] };
    }

    const pickables = [];
    const trimMat = toon({ color: "#fbf8f0" });
    // Dormers: small gabled windows standing on each roof slope
    function addDormers(group, g, part, ink) {
      // Each dormer's front wall stands on the slope and its body runs back into the roof
      // until its own ridge meets the main roof, so nothing floats above the tiles.
      const dWall = toon({ map: wallTex(part.wall) }), dRoof = toon({ color: part.roof });
      const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const k = part.dormerSize || 1, w = 1.6 * k, tf = part.dormerSize ? 0.22 : 0.3;
      g.slopes.forEach(([e0, e1, r0, r1]) => {
        const S = Math.hypot(...[0, 1].map(i => (e0[i] + e1[i]) / 2 - (r0[i] + r1[i]) / 2));
        // keep each dormer in the lower part of the slope: its ridge meets the roof about 60% of the way up
        const want = 2.4 * k, room = (0.8 - tf) * g.rise, total = Math.min(want, room);
        let hgt = total * 0.62, capH = total * 0.38;
        const tb = tf + total / g.rise;
        const D = (tb - tf) * S + 0.3;
        const yb = g.h + g.rise * tf - 0.15;
        const prism = (() => {
          const s = new THREE.Shape([new THREE.Vector2(-w / 2 - .15, 0), new THREE.Vector2(w / 2 + .15, 0), new THREE.Vector2(0, capH)]);
          const e = new THREE.ExtrudeGeometry(s, { depth: D + .2, bevelEnabled: false }); e.translate(0, 0, -D); return e;
        })();
        for (let i = 0; i < part.dormers; i++) {
          const t = (i + 0.5) / part.dormers;
          const e = lerp(e0, e1, 0.08 + t * 0.84), r = lerp(r0, r1, 0.08 + t * 0.84);
          const c = lerp(e, r, tf), out = [e[0] - r[0], e[1] - r[1]];
          const d = new THREE.Group(); d.position.set(c[0], yb, c[1]); d.rotation.y = Math.atan2(out[0], out[1]);
          const box = new THREE.Mesh(new THREE.BoxGeometry(w, hgt + 0.15, D), dWall); box.position.set(0, (hgt + 0.15) / 2, -D / 2);
          const cap = new THREE.Mesh(prism, dRoof); cap.position.y = hgt + 0.15;
          d.add(box, cap); addInk(box.geometry, box, 25, ink); addInk(prism, cap, 25, ink);
          group.add(d);
        }
      });
    }
    function building(part, item) {
      const group = new THREE.Group(); scene.add(group);
      const pts = part.p.map(P);
      const baseY = Math.min(...pts.map(([x, z]) => hAt(x, z))) - 0.05; group.position.y = baseY;
      const ink = item ? new THREE.LineBasicMaterial({ color: INK }) : inkMat;
      const wallMat = part.tent ? toon({ color: part.wall }) : toon({ map: part.plain ? boardTex(part.wall) : part.stucco ? stuccoTex(part.wall) : wallTex(part.wall) });
      const y0 = part.base ? part.base[0] : 0;
      const walls = new THREE.Mesh(wallGeom(pts, part.h, y0, part.bay || 4.4), wallMat); group.add(walls); addInk(walls.geometry, group, 25, ink);
      if (part.base) {
        const bw = new THREE.Mesh(wallGeom(pts, y0), toon({ map: part.base[2] === "plain" ? boardTex(part.base[1]) : wallTex(part.base[1]) }));
        group.add(bw); addInk(bw.geometry, group, 25, ink);
      }
      // white corner boards, as on the painted wooden houses
      if (!part.tent && part.trim !== false) pts.forEach(([x, z]) => {
        // stop the board just under the eave so it never pokes through the roof
        const top = part.h - (part.flat ? 0.05 : 0.32), hb = top - y0;
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, hb, 0.3), trimMat);
        b.position.set(x, y0 + hb / 2, z); group.add(b);
      });
      const mats = [wallMat];
      let top = part.h, ridge = null;
      if (pts.length === 4 && !part.flat) {
        const g = gable(pts, part.h, part.rise || 6.5, !!part.cross);
        // solar: true = both slopes; "s"/"n"/"e"/"w" = only the slope facing that way (+z is south, +x is east)
        const faces = { s: [0, 1], n: [0, -1], e: [1, 0], w: [-1, 0] }[part.solar];
        g.halves.forEach((hg, k) => {
          const o = g.outs[k], panels = part.solar === true || (faces && o[0] * faces[0] + o[1] * faces[1] > 0);
          group.add(new THREE.Mesh(hg, toon({ map: part.tent ? tentTex() : panels ? solarTex(part.roof) : roofTex(part.roof) })));
        });
        const endMat = toon({ color: part.gable || part.wall });
        const ends = new THREE.Mesh(g.ends, endMat);
        group.add(ends); addInk(g.roof, group, 25, ink); addInk(g.ends, group, 25, ink);
        mats.push(endMat); top = g.top; ridge = g.ridgeMid;
        if (part.dormers) addDormers(group, g, part, ink);
        if (part.chimneys) part.chimneys.forEach(cp => {
          const [x, z] = P(cp), hgt = g.top - part.h + 1.6;
          const ch = new THREE.Mesh(new THREE.BoxGeometry(0.9, hgt, 0.9), toon({ color: "#a5452e" }));
          ch.position.set(x, part.h + hgt / 2 + 0.3, z); group.add(ch); addInk(ch.geometry, ch, 25, ink);
          const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.1), toon({ color: "#5a5652" }));
          cap.position.set(x, part.h + hgt + 0.4, z); group.add(cap);
        });
      } else {
        const roof = new THREE.Mesh(flatRoof(pts, part.h), toon({ color: part.roof }));
        group.add(roof); addInk(roof.geometry, group, 25, ink);
      }
      if (part.porch) {
        // front entrance: dark canopy over a glazed double door, with a low step.
        // Built facing +x, then turned to face the side named in porch[2] (w, e, s, n).
        const [x, z] = P(part.porch), side = part.porch[2] || "e";
        const ent = new THREE.Group(); ent.position.set(x, 0, z); ent.rotation.y = { e: 0, w: Math.PI, s: -Math.PI / 2, n: Math.PI / 2 }[side]; group.add(ent);
        const dir = 1;
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 1.7), toon({ map: canvasTex("door", 32, 48, (g, w, h) => {
          g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, w, h); g.fillStyle = "#3b4a52";
          for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) g.fillRect(4 + i * 13, 4 + j * 11, 11, 9);
          g.strokeStyle = "#26221d"; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
        }) }));
        door.position.set(dir * 0.07, 1.25, 0); ent.add(door);
        const plainDoor = part.porch[3] === "plain";
        if (plainDoor) door.material = toon({ color: "#24211f" });
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.8, 4, 1), toon({ color: "#23304a" }));
        canopy.visible = !plainDoor;
        canopy.rotation.y = Math.PI / 4; canopy.scale.set(0.75, 1, 1.1);
        canopy.position.set(dir * 0.75, 2.95, 0); ent.add(canopy); addInk(canopy.geometry, canopy, 25, ink);
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 3.2), toon({ color: "#d4cec2" }));
        step.position.set(dir * 0.7, 0.15, 0); ent.add(step); addInk(step.geometry, step, 25, ink);
      }
      if (part.garage) part.garage.forEach(([px, pz, side, w, hgt]) => {
        // roller door: grey ribbed panel in a white frame, set just proud of the wall
        const [x, z] = P([px, pz]), rot = { e: 0, w: Math.PI, s: -Math.PI / 2, n: Math.PI / 2 }[side || "s"];
        const ent = new THREE.Group(); ent.position.set(x, 0, z); ent.rotation.y = rot; group.add(ent);
        const tex = canvasTex("garage", 64, 64, (g, W, H) => {
          g.fillStyle = "#2c2a29"; g.fillRect(0, 0, W, H);
          g.fillStyle = "rgba(255,255,255,.12)"; for (let y = 6; y < H; y += 6) g.fillRect(0, y, W, 1.4);
          g.strokeStyle = "#fbfaf5"; g.lineWidth = 5; g.strokeRect(0, 0, W, H);
          g.strokeStyle = "#26221d"; g.lineWidth = 1.5; g.strokeRect(2.5, 2.5, W - 5, H - 5);
        });
        const d = new THREE.Mesh(new THREE.BoxGeometry(0.14, hgt || 3.2, w || 3.6), toon({ map: tex }));
        d.position.set(0.08, (hgt || 3.2) / 2, 0); ent.add(d); addInk(d.geometry, d, 25, ink);
        const apron = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, (w || 3.6) + 0.6), toon({ color: "#d4cec2" }));
        apron.position.set(0.6, 0.05, 0); ent.add(apron);
      });
      [].concat(part.balconies || []).forEach(bc => {
        const { edge, n, color, upper, y = 2.75 } = bc, bm = toon({ color: color || part.wall });
        const a = pts[edge], b = pts[(edge + 1) % pts.length], c0 = centroid(pts);
        const ex = b[0] - a[0], ez = b[1] - a[1], L = Math.hypot(ex, ez), ux = ex / L, uz = ez / L;
        const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], side = ((-uz) * (mid[0] - c0[0]) + ux * (mid[1] - c0[1])) > 0 ? 1 : -1;
        for (let i = 0; i < n; i++) {
          const k = (i + 0.5) / n, bg = new THREE.Group();
          bg.position.set(a[0] + ex * k, 0, a[1] + ez * k); bg.rotation.y = -Math.atan2(ez, ex);
          const W = Math.min(3, L / n - 0.6), D = 1.4;
          // upper balcony: slab plus solid board railing
          const slab = new THREE.Mesh(new THREE.BoxGeometry(W, 0.2, D), bm); slab.position.set(0, y, side * D / 2);
          const front = new THREE.Mesh(new THREE.BoxGeometry(W, 1.0, 0.1), bm); front.position.set(0, y + 0.6, side * D);
          const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, D), bm); s1.position.set(-W / 2, y + 0.6, side * D / 2);
          const s2 = s1.clone(); s2.position.x = W / 2;
          // ground-floor terrace with a low railing
          const deck = new THREE.Mesh(new THREE.BoxGeometry(W, 0.35, D + 0.3), bm); deck.position.set(0, 0.17, side * (D + 0.3) / 2);
          const rail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.8, 0.1), bm); rail.position.set(0, 0.75, side * (D + 0.3));
          (upper ? [slab, front, s1, s2] : [slab, front, s1, s2, deck, rail]).forEach(m => { bg.add(m); addInk(m.geometry, m, 25, ink); });
          group.add(bg);
        }
      });
      if (part.railing) {
        const yR = part.h + 1.0, segs = [];
        pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length];
          segs.push(new THREE.Vector3(a[0], yR, a[1]), new THREE.Vector3(b[0], yR, b[1]));
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 0.5));
          for (let k = 0; k < n; k++) { const tt = k / n, px = a[0] + (b[0] - a[0]) * tt, pz = a[1] + (b[1] - a[1]) * tt; segs.push(new THREE.Vector3(px, part.h, pz), new THREE.Vector3(px, yR, pz)); }
        });
        group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), ink));
      }
      if (part.steeple && ridge) {
        const tw = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.6), toon({ color: "#fffdf8" }));
        tw.position.set(ridge[0], top + 0.6, ridge[1]);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(1.35, 3.2, 4), toon({ color: part.roof }));
        cap.position.set(ridge[0], top + 3.8, ridge[1]); cap.rotation.y = Math.PI / 4;
        group.add(tw, cap); addInk(tw.geometry, tw, 25, ink); addInk(cap.geometry, cap, 25, ink); top += 5.4;
      }
      if (item) group.traverse(o => { if (o.isMesh) { o.userData.item = item; pickables.push(o); } });
      // ground halo shown when the building is selected
      const c0 = centroid(pts);
      const halo = pts.map(([x, z]) => { const dx = x - c0[0], dz = z - c0[1], l = Math.hypot(dx, dz) || 1; return [x + dx / l * 2.2, z + dz / l * 2.2]; });
      const hl = drape(halo, { fill: "rgba(201,69,47,.45)", stroke: "#c9452f", strokeW: 0.5, dy: 0.45, order: 2 }); hl.visible = false;
      return { pts, top, ink, hl, baseY };
    }
    DATA.context.forEach(p => building(p, null));

    function centroid(pts) { let x = 0, z = 0; pts.forEach(p => { x += p[0]; z += p[1]; }); return [x / pts.length, z / pts.length]; }
    function outlineLoop(pts, y, color) {
      return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, y, z))), new THREE.LineBasicMaterial({ color }));
    }

    ITEMS.forEach(it => {
      if (it.parts) {
        it.objs = it.parts.map(p => building(p, it));
        const all = it.objs.flatMap(o => o.pts);
        it.c = it.pin ? P(it.pin) : centroid(all);
        it.y0 = Math.min(...it.objs.map(o => o.baseY));
        it.h = Math.max(...it.objs.map(o => o.top));
        it.size = Math.max(...all.map(p => Math.hypot(p[0] - it.c[0], p[1] - it.c[1])));
      } else if (it.area) {
        const pts = it.area.map(P);
        const hit = drape(pts, { fill: "#ffffff", dy: 0.1 }); hit.material.opacity = 0; hit.material.colorWrite = false;
        hit.userData.item = it; hit.userData.poly = pts; pickables.push(hit);
        const hl = drape(pts, { fill: "rgba(178,58,43,.28)", stroke: "#b23a2b", strokeW: 0.6, dy: 0.45, order: 2 }); hl.visible = false;
        it.hl = hl; it.h = 0;
        it.c = it.pin ? P(it.pin) : centroid(pts);
        it.size = Math.max(...pts.map(p => Math.hypot(p[0] - it.c[0], p[1] - it.c[1])));
      } else { it.h = 0; it.c = P(it.pin); it.size = it.size || 30; }
      if (it.focus) it.fc = P(it.focus);
      if (it.y0 === undefined) it.y0 = hAt(it.c[0], it.c[1]);
      const pin = document.createElement("button");
      pin.className = "pin"; pin.setAttribute("aria-label", `${it.no} / ${it.en}`);
      const sq = it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq";
      if (it.g === "d") pin.classList.add("dg-off");
      pin.innerHTML = `<span class="num${sq}">${esc(it.n)}</span><span class="lbl"><b>${esc(it.no)}</b>${it.no !== it.en ? `<i>${esc(it.en)}</i>` : ""}</span>`;
      pin.addEventListener("click", e => { e.stopPropagation(); select(it, true); });
      pinsEl.appendChild(pin); it.pinEl = pin;
    });

    // Rooms inside a building: pin sits on that building's roof and is never hidden by it
    ITEMS.forEach(it => { if (!it.inside) return;
      const host = ITEMS.find(h => h.n === it.inside); if (!host) return;
      it.host = host; it.y0 = host.y0; it.h = it.pinH ?? host.h - 2;
    });

    // Sports: football goals on the lawn, beach volleyball net on the sand court
    (() => {
      const SP = DATA.sports, white = toon({ color: "#fbfaf5" });
      const netMat = new THREE.LineBasicMaterial({ color: 0xf4f2ec, transparent: true, opacity: 0.85 });
      // sand court surface with boundary lines
      drape(SP.court.map(P), { fill: "#e9d6a6", stroke: "#26221d", strokeW: 0.5, dy: 0.22, draw: (g, toPx, ppm) => {
        const c = SP.court.map(P), pad = 1.6;
        const xs = c.map(p => p[0]), zs = c.map(p => p[1]);
        const [x0, x1, z0, z1] = [Math.min(...xs) + pad, Math.max(...xs) - pad, Math.min(...zs) + pad, Math.max(...zs) - pad];
        g.strokeStyle = "#fbfaf5"; g.lineWidth = 0.15 * ppm;
        const a = toPx(x0, z0), b = toPx(x1, z1); g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
        let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
        g.fillStyle = "rgba(150,120,70,.25)"; for (let i = 0; i < 900; i++) g.fillRect(rnd() * g.canvas.width, rnd() * g.canvas.height, 1.3, 1.3);
      } });
      // goals: 5 m wide, 2 m tall frame with a sloping net behind
      SP.goals.forEach(([px, pz, deg]) => {
        const [x, z] = P([px, pz]), y = hAt(x, z), gr = new THREE.Group();
        gr.position.set(x, y, z); gr.rotation.y = deg * Math.PI / 180;
        const W = 5, H = 2, D = 1.6, r = 0.09;
        [-W / 2, W / 2].forEach(xx => { const p = new THREE.Mesh(new THREE.CylinderGeometry(r, r, H, 6), white); p.position.set(xx, H / 2, 0); gr.add(p); });
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(r, r, W + r * 2, 6), white); bar.rotation.z = Math.PI / 2; bar.position.set(0, H, 0); gr.add(bar);
        const segs = [];
        for (let i = 0; i <= 10; i++) { const xx = -W / 2 + W * i / 10; segs.push(new THREE.Vector3(xx, H, 0), new THREE.Vector3(xx, 0, -D)); }
        for (let j = 0; j <= 4; j++) { const k = j / 4; segs.push(new THREE.Vector3(-W / 2, H * (1 - k), -D * k), new THREE.Vector3(W / 2, H * (1 - k), -D * k)); }
        [-W / 2, W / 2].forEach(xx => { for (let j = 0; j <= 4; j++) { const k = j / 4; segs.push(new THREE.Vector3(xx, H, 0), new THREE.Vector3(xx, 0, -D * k)); } });
        segs.push(new THREE.Vector3(-W / 2, 0, -D), new THREE.Vector3(W / 2, 0, -D));
        gr.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), netMat));
        scene.add(gr);
      });
      // volleyball: two posts and a net band across the middle of the court
      const [a, b] = SP.net.map(P), yl = (hAt(...a) + hAt(...b)) / 2 + 0.2, ya = yl, yb = yl, top = 2.43, bot = 1.43;
      [[a, ya], [b, yb]].forEach(([p, y]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, top + 0.1, 6), toon({ color: "#c9cdd0" })); m.position.set(p[0], y + (top + 0.1) / 2, p[1]); scene.add(m); addInk(m.geometry, m); });
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), segs = [], n = Math.round(L / 0.5);
      const at = (k, h) => new THREE.Vector3(a[0] + (b[0] - a[0]) * k, ya + (yb - ya) * k + h, a[1] + (b[1] - a[1]) * k);
      for (let i = 0; i <= n; i++) segs.push(at(i / n, bot), at(i / n, top));
      for (let j = 0; j <= 4; j++) { const h = bot + (top - bot) * j / 4; segs.push(at(0, h), at(1, h)); }
      scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), netMat));
      const band = new THREE.Mesh(new THREE.BoxGeometry(L, 0.12, 0.04), white);
      band.position.copy(at(0.5, top)); band.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]); scene.add(band);
    })();

    // Clipped hedges round the row houses' back gardens
    (() => {
      const mat = toon({ color: "#3f7a2a" }), top = toon({ color: "#5b9a33" }), W = 0.9, Hh = 1.5;
      DATA.hedges.forEach(line => {
        const pts = line.map(P);
        for (let i = 0; i < pts.length - 1; i++) {
          const [a, b] = [pts[i], pts[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]) + W;
          const cx = (a[0] + b[0]) / 2, cz = (a[1] + b[1]) / 2, y = Math.min(hAt(...a), hAt(...b));
          const m = new THREE.Mesh(new THREE.BoxGeometry(L, Hh, W), [mat, mat, top, mat, mat, mat]);
          m.position.set(cx, y + Hh / 2 - 0.1, cz); m.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]);
          scene.add(m); addInk(m.geometry, m);
        }
      });
    })();

    // Flag pole by the circular drive
    (() => {
      const [x, z] = P(DATA.flag);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 11, 6), toon({ color: "#fffdf8" }));
      const fy = hAt(x, z);
      pole.position.set(x, fy + 5.5, z); scene.add(pole);
      const ft = canvasTex("flag", 88, 64, (g) => {
        g.fillStyle = "#ba0c2f"; g.fillRect(0, 0, 88, 64);
        g.fillStyle = "#fff"; g.fillRect(24, 0, 16, 64); g.fillRect(0, 24, 88, 16);
        g.fillStyle = "#00205b"; g.fillRect(28, 0, 8, 64); g.fillRect(0, 28, 88, 8);
      });
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.9, 8, 1), new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide }));
      flag.position.set(x + 1.3, fy + 9.9, z); scene.add(flag);
      const fp = flag.geometry.attributes.position;
      const base = Float32Array.from(fp.array);
      waveFlag = t => { for (let i = 0; i < fp.count; i++) { const px = base[i * 3]; fp.setZ(i, Math.sin(px * 2.2 - t * 0.004) * 0.18 * (px + 1.3)); } fp.needsUpdate = true; };
    })();

    // Trees: lollipop broadleaves and spruce cones, with drawn outlines
    (() => {
      const leaf = ["#5b9a33", "#4c8a2f", "#6ea83c", "#3f7a2a", "#78b046"].map(c => new THREE.Color(c));
      const pine = ["#2f5d2a", "#386a30", "#2a5426"].map(c => new THREE.Color(c));
      const all = TREES.site.map(t => [...t, 1]).concat(TREES.ctx.map(t => [...t, 0]));
      const broad = all.filter(t => !t[3]), con = all.filter(t => t[3]);
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
      let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      function inst(geom, mat, list, place, colors) {
        const mesh = new THREE.InstancedMesh(geom, mat, list.length);
        list.forEach((t, i) => { place(t); m.compose(p, q, s); mesh.setMatrixAt(i, m); if (colors) mesh.setColorAt(i, colors[Math.floor(rnd() * colors.length)]); });
        mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        scene.add(mesh); return mesh;
      }
      const hull = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
      const leafMat = new THREE.MeshToonMaterial({ gradientMap: grad });
      const ball = new THREE.IcosahedronGeometry(1, 1), ballLo = new THREE.IcosahedronGeometry(1, 0);
      const cone = new THREE.ConeGeometry(1, 1, 7);
      const trunk = new THREE.CylinderGeometry(0.16, 0.24, 1, 5);
      const trunkMat = new THREE.MeshToonMaterial({ color: "#6b4a2f", gradientMap: grad });
      const broadHi = broad.filter(t => t[4]), broadLo = broad.filter(t => !t[4]);
      const ballPlace = k => t => { const r = t[2]; p.set(t[0], hAt(t[0], t[1]) + r * 1.25 + 1.6, t[1]); s.set(r * k, r * 1.1 * k, r * k); };
      [[broadHi, ball], [broadLo, ballLo]].forEach(([list, g]) => {
        inst(g, leafMat, list, ballPlace(1), leaf);
        inst(g, hull, list, ballPlace(1.1));
        inst(trunk, trunkMat, list, t => { p.set(t[0], hAt(t[0], t[1]) + 1.0, t[1]); s.set(1, 2.2, 1); });
      });
      const conePlace = k => t => { const r = t[2] * 0.75; p.set(t[0], hAt(t[0], t[1]) + r * 1.5 + 0.8, t[1]); s.set(r * k, r * 3 * (k > 1 ? 1.04 : 1), r * k); };
      inst(cone, leafMat, con, conePlace(1), pine);
      inst(cone, hull, con, conePlace(1.12));
    })();

    // Disc golf layer: tee pads, baskets, fairway lines and the walk from the car park
    const discLayer = new THREE.Group(); discLayer.visible = false; scene.add(discLayer);
    (() => {
      const densify = (pts, maxL) => { const o = [pts[0]]; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxL)); for (let k = 1; k <= n; k++) o.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return o; };
      function ribbon(pts, w, dy, dash) {
        const pos = [], hw = w / 2;
        let run = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          run += L; if (dash && Math.floor(run / dash) % 2) continue;
          const dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L, nx = -dz * hw, nz = dx * hw;
          const ya = hAt(a[0], a[1]) + dy, yb = hAt(b[0], b[1]) + dy;
          pos.push(a[0] + nx, ya, a[1] + nz, b[0] + nx, yb, b[1] + nz, b[0] - nx, yb, b[1] - nz, a[0] + nx, ya, a[1] + nz, b[0] - nx, yb, b[1] - nz, a[0] - nx, ya, a[1] - nz);
        }
        const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); return g;
      }
      const flat = (color, f) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: f, polygonOffsetUnits: f * 2 });
      // walk from the car park
      const walk = densify(DATA.walk.map(P), 2);
      discLayer.add(new THREE.Mesh(ribbon(walk, 2.6, 0.5), flat(INK, -4)));
      discLayer.add(new THREE.Mesh(ribbon(walk, 1.6, 0.55, 6), flat(0xf3c33b, -6)));
      const BLUE = "#2f6fd0", RED = "#d43c33";
      const basketMat = toon({ color: "#9aa0a3" }), bandMat = toon({ color: "#f3c33b" }), chainMat = toon({ color: "#c9cdd0" });
      DATA.disc.forEach(d => {
        const b = P(d.basket), t0 = P(d.tees[0].p);
        const line = densify([t0, b], 2);
        discLayer.add(new THREE.Mesh(ribbon(line, 2.0, 0.4), flat(INK, -4)));
        discLayer.add(new THREE.Mesh(ribbon(line, 1.1, 0.45), flat(0xfffdf8, -6)));
        // tee pads, drawn larger than life so they read at map scale
        d.tees.forEach(tp => {
          const [x, z] = P(tp.p), y = hAt(x, z);
          const dir = Math.atan2(b[0] - x, b[1] - z);
          const g = new THREE.Group(); g.position.set(x, y + 0.25, z); g.rotation.y = dir;
          const cols = tp.label === "Bl\u00e5" ? [BLUE] : tp.label === "R\u00f8d" ? [RED] : [BLUE, RED];
          cols.forEach((c, i) => {
            const w = 3.2 / cols.length, m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, 6), toon({ color: c }));
            m.position.x = -1.6 + w / 2 + i * w; g.add(m); addInk(m.geometry, m);
          });
          discLayer.add(g);
        });
        // basket: pole, chains, tray and yellow band, about 3x real size
        const [x, z] = b, y = hAt(x, z);
        const bg = new THREE.Group(); bg.position.set(x, y, z);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.2, 8), basketMat); pole.position.y = 2.1;
        const tray = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, 0.8, 16, 1, true), basketMat); tray.position.y = 1.9;
        const chains = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.1, 1.6, 12, 1, true), chainMat); chains.position.y = 3.0;
        const band = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.5, 16), bandMat); band.position.y = 4.0;
        [pole, tray, chains, band].forEach(m => { bg.add(m); addInk(m.geometry, m); });
        discLayer.add(bg);
      });
    })();
    let discOn = false;
    const mFarm = document.getElementById("gm-mfarm"), mDisc = document.getElementById("gm-mdisc");
    function setDisc(on, fly) {
      if (on !== discOn) {
        discOn = on; discLayer.visible = on;
        mDisc.setAttribute("aria-pressed", on); mFarm.setAttribute("aria-pressed", !on);
        ITEMS.forEach(it => { if (it.g === "d") it.pinEl.classList.toggle("dg-off", !on); });
      }
      if (!fly) return;
      if (on) select(ITEMS.find(i => i.disc === "all"), true);
      else { if (current && current.g === "d") select(null); setMode("3d"); }
    }
    // On-map shortcuts: at the turn-off from Grimerudvegen (farm map) and where the route reaches the course (disc golf map)
    const dgGo = document.getElementById("gm-dggo"), farmGo = document.getElementById("gm-farmgo");
    const DG_AT = P([1396, 14]), FARM_AT = P([2290, 24]);
    dgGo.addEventListener("click", e => { e.stopPropagation(); setDisc(true, true); });
    farmGo.addEventListener("click", e => { e.stopPropagation(); setDisc(false, true); });
    mDisc.addEventListener("click", () => setDisc(true, true));
    mFarm.addEventListener("click", () => setDisc(false, true));

    // Selection
    let current = null;
    const card = document.getElementById("gm-card");
    const accent = new THREE.Color("#c9452f");
    function resetView() {
      if (discOn) { const all = ITEMS.find(i => i.disc === "all"); focusOn(all); }
      else setMode("3d");
    }
    function select(it, fly) {
      // a second tap on the selected place clears it and returns to the overview
      if (it && fly && it === current) { styleItem(it, false); current = null; card.hidden = true; resetView(); return; }
      if (current) styleItem(current, false);
      current = it || null;
      if (!it) { card.hidden = true; return; }
      styleItem(it, true);
      const cn = document.getElementById("gm-cnum"); cn.textContent = it.n; cn.className = "num" + (it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq");
      if (it.g === "d") setDisc(true);
      document.getElementById("gm-cname").innerHTML = nameHTML(it);
      document.getElementById("gm-cdesc").innerHTML = subHTML(it);
      card.hidden = false;
      if (fly) focusOn(it);
      if (fly && root.clientWidth <= 760 && document.activeElement && document.activeElement.classList.contains("item")) {
        stage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    function styleItem(it, on) {
      it.btn.setAttribute("aria-pressed", on ? "true" : "false");
      it.pinEl.classList.toggle("on", on);
      if (it.objs) it.objs.forEach(o => { o.ink.color.set(on ? 0xc9452f : INK); o.hl.visible = on; });
      if (it.hl) it.hl.visible = on;
    }
    document.getElementById("gm-cclose").addEventListener("click", () => select(null));

    // Camera.
    // Opening view: from the entrance on Grimerudvegen, looking west over the farm towards Mj\u00f8sa
    const HOME = { t: new THREE.Vector3(-40, 0, 25), d: 400, polar: 1.17, az: Math.atan2(144, -40) };
    const TOP = { t: new THREE.Vector3(10, 0, 40), d: 520, polar: 0.001, az: -Math.PI / 2 };
    const TOP_DISC = { t: new THREE.Vector3(330, 0, -170), d: 1250, polar: 0.001, az: -Math.PI / 2 };
    let anim = null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const posFrom = (t, d, polar, az) => new THREE.Vector3(t.x + d * Math.sin(polar) * Math.sin(az), t.y + d * Math.cos(polar), t.z + d * Math.sin(polar) * Math.cos(az));
    function flyTo(t, d, polar, az, ms = 900) {
      const endPos = posFrom(t, d, polar, az);
      if (reduce) { controls.target.copy(t); camera.position.copy(endPos); controls.update(); return; }
      anim = { t0: performance.now(), ms, fromT: controls.target.clone(), toT: t.clone(), fromP: camera.position.clone(), toP: endPos };
    }
    function focusOn(it) {
      const fc = it.fc || it.c;
      const t = new THREE.Vector3(fc[0], hAt(fc[0], fc[1]) + it.h * 0.4, fc[1]);
      const d = Math.max(85, it.size * 3.2);
      const polar = Math.min(Math.max(controls.getPolarAngle(), 0.6), 1.0);
      flyTo(t, d, polar, controls.getAzimuthalAngle());
      setMode("3d", false);
    }
    camera.position.copy(posFrom(HOME.t, HOME.d, HOME.polar, HOME.az));
    controls.target.copy(HOME.t); controls.update();

    const b3d = document.getElementById("gm-v3d"), btop = document.getElementById("gm-vtop");
    function setMode(m, move = true) {
      b3d.setAttribute("aria-pressed", m === "3d"); btop.setAttribute("aria-pressed", m === "top");
      if (!move) return;
      const v = m === "top" ? (discOn ? TOP_DISC : TOP) : HOME; flyTo(v.t, v.d, v.polar, v.az);
    }
    b3d.addEventListener("click", () => setMode("3d"));
    btop.addEventListener("click", () => setMode("top"));
    document.getElementById("gm-compass").addEventListener("click", () => setMode("3d"));
    const bn = document.getElementById("gm-vnames");
    bn.addEventListener("click", () => { const on = bn.getAttribute("aria-pressed") !== "true"; bn.setAttribute("aria-pressed", on); pinsEl.classList.toggle("names", on); });

    // Tap to pick
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let down = null;
    canvas.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; anim = null; document.getElementById("gm-hint").hidden = true; });
    canvas.addEventListener("pointerup", e => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const inPoly = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > pt.z) !== (zj > pt.z) && pt.x < (xj - xi) * (pt.z - zi) / (zj - zi) + xi) c = !c; } return c; };
      const hit = ray.intersectObjects(pickables).find(h => !h.object.userData.poly || inPoly(h.point, h.object.userData.poly));
      select(hit ? hit.object.userData.item : null, !!hit);
    });

    function clampTarget() {
      const t = controls.target;
      const cx = Math.max(-420, Math.min(1000, t.x)), cz = Math.max(-640, Math.min(420, t.z));
      if (cx !== t.x || cz !== t.z) { camera.position.x += cx - t.x; camera.position.z += cz - t.z; t.x = cx; t.z = cz; }
    }
    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage); resize();

    const needle = document.getElementById("gm-needle");
    const solid = pickables.filter(o => !o.userData.item || o.userData.item.parts);
    const occ = new THREE.Raycaster(), anchor = new THREE.Vector3(), dir = new THREE.Vector3();
    let lastOcc = 0;
    function occlusion() {
      for (const it of ITEMS) {
        anchor.set(it.c[0], it.y0 + it.h + 1.5, it.c[1]);
        dir.subVectors(anchor, camera.position); const dist = dir.length(); dir.normalize();
        occ.set(camera.position, dir); occ.far = dist - 1;
        const hit = occ.intersectObjects(solid)[0];
        const by = hit && hit.object.userData.item;
        it.pinEl.classList.toggle("behind", !!hit && by !== it && by !== it.host && it !== current);
      }
    }
    const v = new THREE.Vector3();
    function frame(now) {
      if (!onScreen()) { requestAnimationFrame(frame); return; } // paused while scrolled out of view
      if (anim) {
        const k = Math.min(1, (now - anim.t0) / anim.ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        controls.target.lerpVectors(anim.fromT, anim.toT, e);
        camera.position.lerpVectors(anim.fromP, anim.toP, e);
        if (k >= 1) anim = null;
      }
      controls.update(); clampTarget();
      if (!reduce && waveFlag) waveFlag(now);
      renderer.render(scene, camera);
      if (now - lastOcc > 160) { lastOcc = now; occlusion(); }
      needle.style.transform = `rotate(${controls.getAzimuthalAngle()}rad)`;
      const w = stage.clientWidth, h = stage.clientHeight;
      for (const it of ITEMS) {
        v.set(it.c[0], it.y0 + it.h + 1.5, it.c[1]).project(camera);
        const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
        it.pinEl.hidden = !vis;
        if (vis) it.pinEl.style.transform = `translate(${((v.x + 1) / 2 * w - 14).toFixed(1)}px, ${((1 - v.y) / 2 * h - 14).toFixed(1)}px)`;
      }
      for (const [el, at, show] of [[dgGo, DG_AT, !discOn], [farmGo, FARM_AT, discOn]]) {
        v.set(at[0], hAt(at[0], at[1]) + 3, at[1]).project(camera);
        // only shown when its spot on the road is in view
        const ok = show && v.z < 1 && Math.abs(v.x) < 0.92 && Math.abs(v.y) < 0.9;
        el.hidden = !ok;
        if (ok) el.style.transform = `translate(${((v.x + 1) / 2 * w - 20).toFixed(1)}px, ${((1 - v.y) / 2 * h - 16).toFixed(1)}px)`;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Night mode: dim the land and lights, and let the windows glow
    (() => {
      const btn = document.getElementById("gm-vnight"), WARM = new THREE.Color("#ffc46b");
      const basics = [], glows = [];
      scene.traverse(o => {
        if (!o.isMesh && !o.isInstancedMesh) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => {
          if (!m) return;
          if (m.isMeshBasicMaterial && !m.transparent && m.color) basics.push([m, m.color.clone()]);
          if (m.isMeshBasicMaterial && m.transparent && m.map && !m.opacity === false) basics.push([m, m.color.clone()]);
          if (m.isMeshToonMaterial && m.map && m.map.image && /^w/.test(m.map.__key || "")) glows.push(m);
        });
      });
      const tint = new THREE.Color("#46557a");
      // warm light spilling onto the ground around each lit building
      const pool = canvasTex("pool", 128, 128, (g, w, h) => {
        const rg = g.createRadialGradient(64, 64, 4, 64, 64, 64);
        rg.addColorStop(0, "rgba(255,196,107,.55)"); rg.addColorStop(.45, "rgba(255,170,80,.22)"); rg.addColorStop(1, "rgba(255,160,70,0)");
        g.fillStyle = rg; g.fillRect(0, 0, w, h);
      });
      const pools = new THREE.Group(); pools.visible = false; scene.add(pools);
      const poolMat = new THREE.MeshBasicMaterial({ map: pool, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      ITEMS.forEach(it => { if (!it.objs || it.g === "d") return;
        it.objs.forEach(o => {
          const c = centroid(o.pts), rad = Math.max(...o.pts.map(p => Math.hypot(p[0] - c[0], p[1] - c[1]))) + 9;
          const g = new THREE.PlaneGeometry(rad * 2, rad * 2, 8, 8); g.rotateX(-Math.PI / 2); g.translate(c[0], 0, c[1]);
          const pos = g.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, hAt(pos.getX(i), pos.getZ(i)) + 0.6);
          const m = new THREE.Mesh(g, poolMat); m.renderOrder = 3; pools.add(m);
        });
      });
      // Day \u2194 night is one value s (0 = day, 1 = night) that we animate; dusk sits in the middle.
      const C = (h) => new THREE.Color(h);
      const K = {
        skyTop: [C("#cfe0e6"), C("#f2a46b"), C("#0d1426")],
        skyMid: [C("#e9eee9"), C("#f6c99a"), C("#1a2440")],
        skyLow: [C("#f7f5ef"), C("#e9b98f"), C("#232c44")],
        tint:   [C("#ffffff"), C("#f4c9a4"), C("#46557a")],
        fog:    [C("#f7f5ef"), C("#e7b28a"), C("#1d2640")],
        amb:    [C("#ffffff"), C("#ffd2b0"), C("#8fa3d6")],
        sun:    [C("#fff6e6"), C("#ff9a55"), C("#a9bfff")],
      };
      const ambI = [0.42, 0.36, 0.3], sunI = [0.66, 0.5, 0.22];
      const tmp = new THREE.Color();
      const key = (arr, s, out) => s < 0.5 ? out.copy(arr[0]).lerp(arr[1], s * 2) : out.copy(arr[1]).lerp(arr[2], (s - 0.5) * 2);
      const num = (arr, s) => s < 0.5 ? arr[0] + (arr[1] - arr[0]) * s * 2 : arr[1] + (arr[2] - arr[1]) * (s - 0.5) * 2;
      const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
      glows.forEach(m => { m.emissiveMap = glowTex; m.emissive.copy(WARM); m.emissiveIntensity = 0; m.needsUpdate = true; });
      poolMat.opacity = 0;
      const sunHome = sun.position.clone();
      // each window-wall colour switches on at its own moment, so lights come on one house at a time
      const lightAt = glows.map((m, i) => 0.55 + ((i * 0.6180339) % 1) * 0.3);
      let s = 0;
      function render(s) {
        const top = key(K.skyTop, s, new THREE.Color()).getStyle(), mid = key(K.skyMid, s, new THREE.Color()).getStyle(), low = key(K.skyLow, s, new THREE.Color()).getStyle();
        stage.style.background = `linear-gradient(180deg, ${top} 0%, ${mid} 26%, ${low} 52%)`;
        key(K.amb, s, amb.color); amb.intensity = num(ambI, s);
        key(K.sun, s, sun.color); sun.intensity = num(sunI, s);
        // the sun sinks towards the west horizon, then the moon rises in its place
        const e = s < 0.6 ? 1 - s / 0.6 * 0.9 : 0.1 + (s - 0.6) / 0.4 * 0.8;
        sun.position.set(sunHome.x - (s < 0.6 ? s * 500 : (1 - s) * 400), Math.max(30, sunHome.y * e), sunHome.z);
        key(K.fog, s, scene.fog.color);
        key(K.tint, s, tmp);
        basics.forEach(([m, c]) => m.color.copy(c).multiply(tmp));
        if (hillsMat) hillsMat.color.copy(tmp);
        glows.forEach((m, i) => { m.emissiveIntensity = 1.4 * smooth(lightAt[i] - 0.08, lightAt[i] + 0.04, s); });
        poolMat.opacity = smooth(0.6, 0.95, s); pools.visible = s > 0.55;
      }
      const fmt = mins => { mins = ((mins % 1440) + 1440) % 1440; return String(Math.floor(mins / 60)).padStart(2, "0") + ":" + String(Math.floor(mins % 60)).padStart(2, "0"); };
      let anim = null, on = false;
      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      function go(toNight) {
        on = toNight; btn.setAttribute("aria-pressed", on);
        if (reduceMotion) { s = on ? 1 : 0; render(s); return; }
        anim = { t0: performance.now(), ms: 1100, from: s, to: on ? 1 : 0, startClock: on ? 16.5 * 60 : 23 * 60, span: on ? 6.5 * 60 : 8.5 * 60 };
        requestAnimationFrame(step);
      }
      function step(now) {
        if (!anim) return;
        const k = Math.max(0, Math.min(1, (now - anim.t0) / anim.ms)), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        if (anim.to === 1) s = anim.from + (1 - anim.from) * e;
        else {
          // night \u2192 day runs forward through the small hours: dark, then a dawn glow, then day
          s = anim.from * (1 - e);
        }
        render(s);
        if (k < 1) requestAnimationFrame(step);
        else anim = null;
      }
      render(0);
      btn.addEventListener("click", () => go(!on));
    })();

    // Touch devices: inline, one finger scrolls the page (taps still pick places); full screen gets all gestures
    (() => {
      const btn = document.getElementById("gm-expand"), lbl = btn.querySelector(".tx"), icon = btn.querySelector("path");
      const coarse = matchMedia("(pointer: coarse)");
      let full = false, ph = null;
      const passThrough = () => coarse.matches && !full;
      ["touchstart", "touchmove", "touchend"].forEach(t => stage.addEventListener(t, e => {
        if (passThrough() && e.target === canvas) e.stopPropagation(); // keep it from the map controls
      }, { capture: true, passive: true }));
      function setFull(on) {
        if (on === full) return; full = on;
        if (on) {
          // move the whole map to <body> so no transformed ancestor in the host page can trap position: fixed
          ph = document.createElement("div"); ph.style.height = root.offsetHeight + "px";
          root.parentNode.insertBefore(ph, root); document.body.appendChild(root);
          root.classList.add("gm-full"); document.documentElement.classList.add("gm-lock");
        } else {
          root.classList.remove("gm-full"); document.documentElement.classList.remove("gm-lock");
          ph.parentNode.insertBefore(root, ph); ph.remove(); ph = null;
          stage.scrollIntoView({ block: "center" });
        }
        btn.setAttribute("aria-pressed", on);
        lbl.textContent = on ? "Lukk" : "Utforsk";
        icon.setAttribute("d", on ? "M5 5l10 10M15 5L5 15" : "M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12");
        btn.setAttribute("aria-label", on ? "Lukk fullskjerm \u00b7 Close full screen" : "Utforsk kartet i fullskjerm \u00b7 Explore the map full screen");
        resize();
      }
      btn.addEventListener("click", e => { e.stopPropagation(); setFull(!full); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && full) setFull(false); });
    })();

  }
})();

