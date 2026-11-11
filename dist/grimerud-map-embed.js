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
  var st = document.createElement("style"); st.textContent = "/* Grimerud G\u00e5rd map. Every rule is scoped to #grimerud-map so it can sit inside another site (Squarespace). */\n\n/* Guard against the host site's own heading/paragraph/button styles */\n#grimerud-map { container: gm / inline-size; display: block; width: 100%; position: relative; isolation: isolate; text-align: left; -webkit-text-size-adjust: 100%; }\n#grimerud-map :where(h1,h2,p,button,nav,aside,main,div,span,strong,svg) { margin: 0; padding: 0; font-family: inherit; font-size: inherit; line-height: inherit; font-weight: inherit; letter-spacing: normal; text-transform: none; text-decoration: none; color: inherit; text-align: inherit; max-width: none; }\n#grimerud-map :where(i,b) { letter-spacing: normal; text-transform: none; font-family: inherit; }\n#grimerud-map :where(button) { -webkit-appearance: none; appearance: none; background: none; border: 0; border-radius: 0; box-shadow: none; min-height: 0; min-width: 0; width: auto; height: auto; }\n#grimerud-map :where(h1,h2)::before, #grimerud-map :where(h1,h2)::after { content: none; }\n\n/* Map */\n#grimerud-map { --paper: #f7f5ef; --bg: #f1efe8; --panel: #fbfaf6; --ink: #26221d; --muted: #615a50; --line: #d9d3c6; --accent: #b23a2b; --accent-ink: #ffffff; --leaf: #4c8a2f; --chip: #ece8de; --shadow: 0 4px 18px rgba(38, 34, 29, .18); --f: \"Ubuntu\", \"Segoe UI\", system-ui, sans-serif; }\n#grimerud-map { background: var(--bg); color: var(--ink); font: 15px/1.45 var(--f); }\n#grimerud-map * { box-sizing: border-box; }\n#grimerud-map button { font: inherit; color: inherit; }\n#grimerud-map :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n#grimerud-map .app { display: grid; grid-template-columns: 360px minmax(0, 1fr); height: 100%; }\n#grimerud-map .panel { display: flex; flex-direction: column; min-height: 0; background: var(--panel); border-right: 1px solid var(--line); }\n#grimerud-map .head { padding: 22px 22px 14px; }\n#grimerud-map .welcome { font: italic 500 15px/1.25 var(--f); margin: 0; }\n#grimerud-map h1 { font: 700 34px/1.05 var(--f); font-size: 34px !important; line-height: 1.05 !important; letter-spacing: -.01em; margin: 2px 0 0; padding-bottom: 6px; border-bottom: 2px solid var(--ink); text-wrap: balance; }\n#grimerud-map .since { font: italic 400 12px/1 var(--f); margin: 6px 0 0; color: var(--muted); }\n#grimerud-map .lede { margin: 12px 0 0; color: var(--muted); font-size: 13.5px; max-width: 36ch; }\n#grimerud-map .list { flex: 1; overflow-y: auto; padding: 0 12px 16px; min-height: 0; }\n/* search */\n#grimerud-map .search { position: relative; margin: 2px 22px 10px; display: flex; align-items: center; }\n#grimerud-map .search svg { position: absolute; left: 10px; width: 16px; height: 16px; color: var(--muted); pointer-events: none; }\n#grimerud-map .search input { width: 100%; font: 400 14px/1.2 var(--f); color: var(--ink); background: #fffdf8; border: 1.6px solid var(--line); border-radius: 9px; padding: 9px 32px 9px 33px; -webkit-appearance: none; appearance: none; }\n#grimerud-map .search input:focus { outline: none; border-color: var(--ink); }\n#grimerud-map .search input::-webkit-search-cancel-button { display: none; }\n#grimerud-map .search button { position: absolute; right: 6px; width: 24px; height: 24px; border: 0; background: none; color: var(--muted); font-size: 18px; line-height: 1; cursor: pointer; }\n#grimerud-map .noresult { margin: 4px 22px 0; color: var(--muted); font-size: 13px; }\n#grimerud-map.searching .ltabs { display: none; }\n#grimerud-map.searching .grp-items { display: block !important; }\n#grimerud-map.searching .group svg { visibility: hidden; }\n#grimerud-map .item[hidden], #grimerud-map .grp[hidden] { display: none !important; }\n/* list collapse (wide screens) */\n#grimerud-map .listtoggle { position: absolute; z-index: 6; left: 0; top: 50%; transform: translateY(-50%); width: 22px; height: 54px; display: grid; place-items: center; padding: 0; background: #fffdf8; color: #26221d; border: 1.6px solid #26221d; border-left: 0; border-radius: 0 9px 9px 0; box-shadow: 0 2px 0 rgba(38,34,29,.25); cursor: pointer; }\n#grimerud-map .listtoggle svg { width: 12px; height: 20px; transition: transform .2s; }\n#grimerud-map.nolist .listtoggle svg { transform: rotate(180deg); }\n#grimerud-map.nolist .app { grid-template-columns: 0 minmax(0, 1fr); }\n#grimerud-map.nolist .panel { visibility: hidden; border: 0; }\n#grimerud-map .listtoggle[data-tip]::after { content: attr(data-tip); position: absolute; left: calc(100% + 8px); top: 50%; transform: translateY(-50%); white-space: pre; background: #26221d; color: #fffdf8; font: 500 12.5px/1.3 var(--f); padding: 6px 9px; border-radius: 7px; opacity: 0; pointer-events: none; transition: opacity .12s; }\n@media (hover: hover) { #grimerud-map .listtoggle:hover::after { opacity: 1; } }\n/* \"more to show\" drawer */\n#grimerud-map .tgrp.look { position: relative; }\n#grimerud-map .tool.vmode { display: none; }\n#grimerud-map .sheet-handle { display: none; }\n#grimerud-map .pin.lv-off:not(.on) { display: none; }\n/* opens downward; .side (not enough room below, e.g. the short map on a phone) opens to the left instead */\n#grimerud-map .drawer { position: absolute; left: 0; top: calc(100% + 8px); display: flex; flex-direction: column; gap: 8px; }\n#grimerud-map .drawer.side { left: auto; top: 0; right: calc(100% + 8px); flex-direction: row-reverse; }\n#grimerud-map .drawer .tool { transition: transform .18s cubic-bezier(.3,1.4,.5,1), opacity .14s; }\n#grimerud-map .drawer:not(.open) { pointer-events: none; }\n#grimerud-map .drawer:not(.open) .tool { opacity: 0; transform: translateY(calc(-1 * var(--dx, 48px))) scale(.6); visibility: hidden; transition: transform .14s, opacity .1s, visibility 0s .14s; }\n#grimerud-map .drawer.side:not(.open) .tool { transform: translateX(var(--dx, 48px)) scale(.6); }\n#grimerud-map .drawer .tool:nth-child(2) { --dx: 96px; transition-delay: .03s; }\n#grimerud-map .drawer .tool:nth-child(3) { --dx: 144px; transition-delay: .06s; }\n/* in the sideways row, tips sit below the buttons */\n#grimerud-map .drawer.side .tool[data-tip]::after { right: auto; left: 50%; top: calc(100% + 8px); transform: translate(-50%, -4px); text-align: center; }\n@media (hover: hover) { #grimerud-map .drawer.side .tool[data-tip]:hover::after, #grimerud-map .drawer.side .tool[data-tip]:focus-visible::after { transform: translate(-50%, 0); } }\n/* while closed, a dot on the button says something in the drawer is switched on */\n#grimerud-map .tgrp.look.lit #gm-layers[aria-expanded=\"false\"]::before { content: \"\"; position: absolute; top: -1px; right: -1px; width: 11px; height: 11px; border-radius: 50%; background: #b23a2b; border: 2px solid #fffdf8; }\n#grimerud-map #gm-layers[aria-expanded=\"true\"] { background: #26221d; color: #fffdf8; }\n@media (prefers-reduced-motion: reduce) { #grimerud-map .drawer .tool, #grimerud-map .listtoggle svg { transition: none; } }\n#grimerud-map .ltabs { display: flex; gap: 0; margin: 4px 22px 0; border-bottom: 1.6px solid var(--ink); }\n#grimerud-map .ltabs button { flex: 1; padding: 9px 8px 8px; font: 500 14px/1 var(--f); color: var(--muted); background: none; border: 1.6px solid transparent; border-bottom: 0; border-radius: 8px 8px 0 0; margin-bottom: -1.6px; cursor: pointer; }\n#grimerud-map .ltabs button[aria-selected=\"true\"] { color: var(--ink); background: var(--panel); border-color: var(--ink); }\n#grimerud-map .ltabs button:hover:not([aria-selected=\"true\"]) { color: var(--ink); }\n#grimerud-map .group { display: flex; align-items: center; gap: 8px; width: calc(100% - 8px); text-align: left; background: none; border: 0; cursor: pointer; font: 500 11.5px/1.2 var(--f); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 14px 4px 4px; padding: 6px 6px; border-radius: 6px; }\n#grimerud-map .group:hover { background: var(--chip); color: var(--ink); }\n#grimerud-map .group > span:first-child { flex: 1; }\n#grimerud-map .group .cnt { font-variant-numeric: tabular-nums; letter-spacing: 0; font-size: 11px; color: var(--muted); }\n#grimerud-map .group svg { width: 12px; height: 12px; flex: none; transition: transform .15s; }\n#grimerud-map .group[aria-expanded=\"false\"] svg { transform: rotate(-90deg); }\n@media (prefers-reduced-motion: reduce) { #grimerud-map .group svg { transition: none; } }\n#grimerud-map .group i { text-transform: none; letter-spacing: 0; font-size: 12px; }\n#grimerud-map .item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; align-items: start; width: 100%; text-align: left; background: none; border: 0; border-radius: 8px; padding: 7px 10px; cursor: pointer; }\n#grimerud-map .item:hover, #grimerud-map .item[aria-pressed=\"true\"] { background: var(--chip); }\n#grimerud-map .item[aria-pressed=\"true\"] .num { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }\n#grimerud-map .num { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; border: 1.6px solid var(--ink); font: 500 13px/1 var(--f); background: var(--panel); margin-top: 1px; }\n#grimerud-map .num { position: relative; }  /* keeps the screen-reader letter inside the list scroller, so it never stretches the page */\n#grimerud-map .num.sq { border-radius: 7px; }\n#grimerud-map .num .glyph { font: 400 16px/1 \"Segoe UI Symbol\", \"Apple Symbols\", \"Noto Sans Symbols 2\", \"Noto Sans Symbols\", \"DejaVu Sans\", sans-serif; font-variant-emoji: text; }\n#grimerud-map .nm { display: block; font-weight: 500; font-size: 15.5px; line-height: 1.25; }\n#grimerud-map .nm i { font-weight: 500; }\n#grimerud-map .sub { display: block; color: var(--muted); font-size: 12.5px; line-height: 1.4; margin-top: 2px; }\n#grimerud-map .sub i { display: block; }\n#grimerud-map .foot { border-top: 1px solid var(--line); padding: 14px 22px 18px; font-size: 12px; color: var(--muted); display: grid; gap: 4px; }\n#grimerud-map .foot strong { color: var(--ink); font-weight: 500; font-size: 13px; }\n#grimerud-map .coord { font-variant-numeric: tabular-nums; }\n#grimerud-map .stage { position: relative; min-width: 0; overflow: hidden; touch-action: none; background: linear-gradient(180deg, #cfe0e6 0%, #e9eee9 22%, var(--paper) 44%); }\n#grimerud-map canvas { display: block; width: 100%; height: 100%; cursor: grab; }\n#grimerud-map canvas:active { cursor: grabbing; }\n#grimerud-map #gm-pins { position: absolute; inset: 0; pointer-events: none; }\n#grimerud-map .pin { position: absolute; left: 0; top: 0; pointer-events: auto; display: flex; align-items: center; gap: 6px; background: none; border: 0; padding: 0; cursor: pointer; white-space: nowrap; }\n#grimerud-map .pin .num { width: 28px; height: 28px; background: #fffdf8; color: #26221d; border: 2px solid #26221d; font-weight: 700; box-shadow: 0 2px 0 rgba(38,34,29,.35); }\n#grimerud-map .pin .num { position: relative; z-index: 1; }\n#grimerud-map .pin .lbl { z-index: 3; position: absolute; left: calc(100% + 6px); top: 50%; transform: translateY(-50%); white-space: nowrap; display: none; background: #fffdf8; color: #26221d; border: 1.6px solid #26221d; border-radius: 6px; padding: 4px 8px; box-shadow: 0 2px 0 rgba(38,34,29,.3); line-height: 1.15; }\n#grimerud-map .pin .lbl b { display: block; font: 500 13px/1.15 var(--f); }\n#grimerud-map .pin .lbl i { display: block; font: italic 400 11.5px/1.2 var(--f); color: #5a5248; }\n#grimerud-map .pin:hover .lbl, #grimerud-map .pin.on .lbl, #grimerud-map #gm-pins.names .lbl { display: block; }\n#grimerud-map .pin.on .num { z-index: 4; }\n#grimerud-map #gm-pins.names .pin[data-side=\"l\"] .lbl { left: auto; right: calc(100% + 6px); }\n#grimerud-map #gm-pins.names .pin[data-side=\"t\"] .lbl { left: 50%; top: auto; bottom: calc(100% + 6px); transform: translateX(-50%); }\n#grimerud-map #gm-pins.names .pin[data-side=\"b\"] .lbl { left: 50%; top: calc(100% + 6px); transform: translateX(-50%); }\n#grimerud-map #gm-pins.names .pin[data-side=\"x\"]:not(:hover):not(.on) .lbl { display: none; }\n#grimerud-map #gm-pins.names .pin[data-side=\"f\"] .lbl { left: var(--lx); top: var(--ly); transform: none; }\n#grimerud-map .pin .ldr { display: none; position: absolute; left: 14px; top: 13.2px; height: 1.6px; background: #26221d; transform-origin: 0 50%; pointer-events: none; z-index: 0; }\n#grimerud-map #gm-pins.names .pin[data-side=\"f\"] .ldr { display: block; }\n#grimerud-map .pin.on .lbl, #grimerud-map .pin:hover .lbl { z-index: 5; }\n#grimerud-map .pin.on .num { background: #b23a2b; color: #fff; border-color: #26221d; }\n/* Map switch top left; one column of round tools down the right edge */\n#grimerud-map .maptabs { position: absolute; z-index: 5; top: calc(14px + env(safe-area-inset-top, 0px)); left: calc(14px + env(safe-area-inset-left, 0px)); }\n#grimerud-map .tools { position: absolute; z-index: 5; top: calc(14px + env(safe-area-inset-top, 0px)); right: calc(14px + env(safe-area-inset-right, 0px)); display: flex; flex-direction: column; align-items: center; gap: 16px; pointer-events: none; }\n#grimerud-map .tgrp { display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: auto; }\n#grimerud-map .tool .aa { font: 700 14px/1 var(--f); letter-spacing: -.02em; }\n/* full screen sits on its own in the bottom-right corner */\n#grimerud-map .tool.corner { position: absolute; z-index: 5; right: calc(14px + env(safe-area-inset-right, 0px)); bottom: calc(14px + env(safe-area-inset-bottom, 0px)); }\n#grimerud-map .tool { width: 40px; height: 40px; display: grid; place-items: center; padding: 0; background: #fffdf8; color: #26221d; border: 1.6px solid #26221d; border-radius: 50%; box-shadow: 0 2px 0 rgba(38,34,29,.3); font: 700 13px/1 var(--f); cursor: pointer; }\n#grimerud-map .tool svg { width: 19px; height: 19px; }\n#grimerud-map .tool[aria-pressed=\"true\"] { background: #26221d; color: #fffdf8; }\n/* state buttons show the current state (sun/moon, leaf/snowflake) instead of turning dark */\n#grimerud-map .tool.state[aria-pressed=\"true\"] { background: #fffdf8; color: #26221d; }\n#grimerud-map .tool.state .st-on, #grimerud-map .tool.state[aria-pressed=\"true\"] .st-off { display: none; }\n#grimerud-map .tool.state[aria-pressed=\"true\"] .st-on { display: block; }\n#grimerud-map #gm-vnight .st-off { color: #c98a12; }\n#grimerud-map #gm-vnight .st-on { color: #2c3a66; }\n#grimerud-map #gm-vwinter .st-off { color: #4c8a2f; }\n#grimerud-map #gm-vwinter .st-on { color: #3f7fb5; }\n#grimerud-map .tool:hover:not([aria-pressed=\"true\"]) { background: #ffffff; }\n/* hover labels to the left of the tool column */\n#grimerud-map .tool { position: relative; }\n#grimerud-map .tool[data-tip]::after { content: attr(data-tip); position: absolute; right: calc(100% + 10px); top: 50%; transform: translate(4px, -50%); opacity: 0; pointer-events: none; white-space: pre; text-align: right; background: #26221d; color: #fffdf8; font: 500 12.5px/1.3 var(--f); padding: 6px 9px; border-radius: 7px; box-shadow: 0 2px 0 rgba(38,34,29,.25); transition: opacity .12s, transform .12s; z-index: 6; }\n#grimerud-map .tool-pair .tool[data-tip]::after { right: calc(100% + 11.6px); }\n@media (hover: hover) {\n  #grimerud-map .tool[data-tip]:hover::after, #grimerud-map .tool[data-tip]:focus-visible::after { opacity: 1; transform: translate(0, -50%); }\n}\n@media (prefers-reduced-motion: reduce) { #grimerud-map .tool[data-tip]::after { transition: none; } }\n#grimerud-map .tool-pair { display: flex; flex-direction: column; background: #26221d; padding: 1.6px; gap: 1.6px; border-radius: 21px; box-shadow: 0 2px 0 rgba(38,34,29,.3); }\n#grimerud-map .tool-pair .tool { width: 36.8px; height: 34px; border: 0; box-shadow: none; border-radius: 0; }\n#grimerud-map .tool-pair .tool:first-child { border-radius: 19px 19px 4px 4px; }\n#grimerud-map .tool-pair .tool:last-child { border-radius: 4px 4px 19px 19px; }\n#grimerud-map .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }\n#grimerud-map .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }\n#grimerud-map .brand img { height: 34px; width: auto; display: block; }\n#grimerud-map .seg { display: flex; background: #26221d; color: #26221d; padding: 1.6px; gap: 1.6px; border-radius: 9px; box-shadow: 0 2px 0 rgba(38,34,29,.3); }\n#grimerud-map .seg button { border: 0; background: #fffdf8; color: #26221d; padding: 7px 12px; font: 500 13px/1 var(--f); cursor: pointer; border-radius: 0; }\n#grimerud-map .seg button:first-child { border-top-left-radius: 7.4px; border-bottom-left-radius: 7.4px; }\n#grimerud-map .seg button:last-child { border-top-right-radius: 7.4px; border-bottom-right-radius: 7.4px; }\n#grimerud-map .seg button[aria-pressed=\"true\"] { background: #26221d; color: #fffdf8; }\n#grimerud-map .tool.compass { width: 46px; height: 46px; }\n#grimerud-map .tool.compass svg { width: 38px; height: 38px; }\n#grimerud-map .card { z-index: 7; position: absolute; left: calc(14px + env(safe-area-inset-left, 0px)); bottom: calc(14px + env(safe-area-inset-bottom, 0px)); max-width: min(380px, calc(100% - 28px)); background: #fffdf8; color: #26221d; border: 2px solid #26221d; border-radius: 12px; box-shadow: 0 3px 0 rgba(38,34,29,.3); padding: 12px 14px; display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; gap: 12px; align-items: start; }\n#grimerud-map .card .num { background: #b23a2b; color: #fff; border: 2px solid #26221d; width: 30px; height: 30px; font-weight: 700; }\n#grimerud-map .card h2 { font: 500 18px/1.2 var(--f); margin: 3px 0 2px; }\n#grimerud-map .card h2 i { font-weight: 400; color: #5a5248; }\n#grimerud-map .card p { margin: 0; font-size: 13px; color: #5a5248; }\n#grimerud-map .card p i { display: block; }\n#grimerud-map .close { border: 0; background: none; cursor: pointer; padding: 2px 4px; color: #5a5248; font-size: 22px; line-height: 1; }\n#grimerud-map .hint { position: absolute; left: 50%; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); font: italic 12px/1 var(--f); color: #26221d; background: rgba(255,253,248,.85); border: 1px solid rgba(38,34,29,.3); padding: 6px 10px; border-radius: 20px; pointer-events: none; white-space: nowrap; z-index: 6; transition: opacity .5s; }\n#grimerud-map .toast { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 6; padding: 10px 16px; border-radius: 12px; background: rgba(38,34,29,.82); color: #fffdf8; font-size: 14px; line-height: 1.35; text-align: center; pointer-events: none; opacity: 0; visibility: hidden; transition: opacity .25s, visibility 0s .25s; }\n#grimerud-map .toast i { display: block; font-size: 12.5px; opacity: .8; }\n#grimerud-map .toast.show { opacity: 1; visibility: visible; transition: opacity .15s; }\n#grimerud-map .hint.gone { opacity: 0; visibility: hidden; transition: opacity .5s, visibility 0s .5s; }\n#grimerud-map [hidden] { display: none !important; }\n#grimerud-map .pin.behind { visibility: hidden; }\n#grimerud-map .num.dg { background: #f3c33b; border-color: #26221d; color: #26221d; border-radius: 6px; font-weight: 700; }\n#grimerud-map .pin .num.dg { background: #f3c33b; width: 26px; height: 26px; font-size: 12px; }\n#grimerud-map .pin.dg-off, #grimerud-map .pin.farm-off:not(.on) { display: none; }\n#grimerud-map .dg-go { position: absolute; left: 0; top: 0; z-index: 4; display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 6px; background: #f3c33b; color: #26221d; border: 2px solid #26221d; border-radius: 999px; box-shadow: 0 2px 0 rgba(38,34,29,.35); font: 700 12.5px/1 var(--f); cursor: pointer; white-space: nowrap; }\n#grimerud-map .dg-go.farm { background: #fffdf8; }\n#grimerud-map .dg-go .dir { display: none; margin-left: 2px; font-size: 14px; line-height: 1; transform: rotate(var(--a, 0rad)); }\n#grimerud-map .dg-go.edge .dir { display: inline-block; }\n#grimerud-map .dg-go.farm:hover { background: #ffffff; }\n#grimerud-map .maptabs { flex: none; }\n#grimerud-map .maptabs button { padding: 8px 12px; font-size: 13.5px; }\n#grimerud-map .maptabs button i { font-weight: 400; }\n#grimerud-map .maptabs button[aria-pressed=\"true\"] i { color: #e9e3d6; }\n#grimerud-map .dg-go svg { width: 18px; height: 18px; flex: none; }\n#grimerud-map .dg-go:hover { background: #ffd65a; }\n#grimerud-map .group.dg-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n#grimerud-map .err { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; color: #5a5248; }\n\n/* Height when embedded in a page (the standalone page overrides this to fill the window) */\n#grimerud-map .app { height: var(--gm-h, min(82vh, 860px)); min-height: 560px; }\n\n/* Loading message, and the tip shown when someone scrolls the page over the map */\n#grimerud-map .gm-load { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; font: italic 13px/1.3 var(--f); color: #5a5248; pointer-events: none; }\n#grimerud-map .gm-wheel { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; background: rgba(38,34,29,.38); color: #fffdf8; font: 500 15px/1.3 var(--f); opacity: 0; transition: opacity .25s; z-index: 6; }\n#grimerud-map .gm-wheel.on { opacity: 1; }\n\n/* Touch: the page scrolls past the map; \"Utforsk\" opens it full screen for turning and zooming */\n\n#grimerud-map .lede-m { display: none; }\n#grimerud-map .lede b { font-weight: 500; color: var(--ink); }\n#grimerud-map .lede .ico { width: 1.05em; height: 1.05em; vertical-align: -0.17em; color: var(--ink); }\n@media (pointer: coarse) {\n  #grimerud-map .stage { touch-action: pan-y; }\n  #grimerud-map .lede-d { display: none; }\n  #grimerud-map .lede-m { display: inline; }\n  #grimerud-map .hint { display: none; }\n  /* touch screens pinch to zoom */\n  #grimerud-map .tgrp[data-g=\"zoom\"] { display: none; }\n}\n\n/* Narrow: legend below the map, compact controls */\n@container gm (max-width: 760px) {\n  #grimerud-map .app { display: flex; flex-direction: column; height: auto; min-height: 0; }\n  /* the map stays pinned at the top while the list below it scrolls */\n  #grimerud-map .stage { order: 1; height: 66svh; min-height: 380px; position: sticky; top: var(--gm-sticky-top, 0px); z-index: 2; }\n  #grimerud-map .panel { order: 2; border-right: 0; }\n  #grimerud-map .head { padding: 14px 16px 8px; }\n  /* phone type scale: one size step down throughout the legend */\n  #grimerud-map h1 { font-size: 23px !important; padding-bottom: 5px; }\n  #grimerud-map .welcome { font-size: 13px; }\n  #grimerud-map .since { font-size: 11px; margin-top: 5px; }\n  #grimerud-map .lede { font-size: 12.5px; margin-top: 8px; }\n  #grimerud-map .group { margin-top: 14px; font-size: 10.5px; }\n  #grimerud-map .nm { font-size: 14.5px; }\n  #grimerud-map .sub { font-size: 11.5px; }\n  #grimerud-map .foot { font-size: 11px; }\n  #grimerud-map .foot strong { font-size: 12px; }\n  #grimerud-map .list { overflow: visible; padding: 0 6px 12px; }\n  #grimerud-map .foot { padding: 14px 16px calc(18px + env(safe-area-inset-bottom, 0px)); }\n  #grimerud-map .hint { display: none; }\n  #grimerud-map .stage { height: 64svh; min-height: 340px; }\n  /* one map switch on phones: the one on the map; the list follows it */\n  #grimerud-map .ltabs { display: none; }\n  #grimerud-map .lede-d { display: none; }\n  #grimerud-map .lede-m { display: inline; }\n  #grimerud-map .search { margin: 0 16px 8px; }\n  #grimerud-map .listtoggle { display: none; }\n  #grimerud-map .ltabs button { padding: 8px 6px 7px; font-size: 13.5px; }\n  #grimerud-map .maptabs { top: 10px; left: 10px; }\n  /* phones: view and zoom stay in the right-hand column; names, season and time sit in a row under the map switch */\n  /* phones: compass (reset) and the drawer button only; 2D lives in the drawer, zoom is pinch */\n  #grimerud-map .tools { top: 10px; right: 10px; align-items: flex-end; gap: 8px; }\n  #grimerud-map .tgrp { gap: 8px; }\n  #grimerud-map .tool { width: 40px; height: 40px; }\n  #grimerud-map .tgrp[data-g=\"view\"] .tool-pair, #grimerud-map .tgrp[data-g=\"zoom\"] { display: none; }\n  #grimerud-map .tool.vmode { display: grid; }\n  #grimerud-map .tool.corner { right: 10px; bottom: 10px; }\n  #grimerud-map .brand img { height: 28px; }\n  #grimerud-map .brand { margin-bottom: 8px; }\n  #grimerud-map .seg button, #grimerud-map .maptabs button { padding: 9px 11px; font-size: 13px; }\n  #grimerud-map .tool.compass { width: 42px; height: 42px; }\n  #grimerud-map .tool.compass svg { width: 35px; height: 35px; }\n  #grimerud-map .card { left: 10px; right: 64px; bottom: 10px; max-width: none; padding: 10px 12px; }\n  #grimerud-map .card h2 { font-size: 16.5px; }\n  #grimerud-map .item { padding: 7px 10px; }\n}\n\n/* Full-screen explore mode */\nhtml.gm-lock, html.gm-lock body { overflow: hidden !important; overscroll-behavior: none; }\n#grimerud-map.gm-full { position: fixed; inset: 0; z-index: 2147483000; width: auto; background: var(--bg); }\n#grimerud-map.gm-full .app { height: 100%; min-height: 0; }\n/* height of the list sheet's visible strip on phones (set here: a container query can't style the container itself) */\n#grimerud-map.gm-full { --peek: calc(76px + env(safe-area-inset-bottom, 0px)); }\n#grimerud-map.gm-full .stage { height: 100%; min-height: 0; touch-action: none; position: relative; top: 0; }\n/* wide: the list stays beside the map; narrow: the map takes the whole screen */\n@container gm (max-width: 760px) {\n  /* the list becomes a sheet along the bottom: search showing, drag or tap the handle to pull it up */\n  #grimerud-map.gm-full .app { display: block; position: relative; }\n  #grimerud-map.gm-full .panel { position: absolute; left: 0; right: 0; bottom: 0; z-index: 8; height: 72%; border: 0; border-top: 2px solid var(--ink); border-radius: 16px 16px 0 0; box-shadow: 0 -4px 18px rgba(38,34,29,.18); transform: translateY(calc(100% - var(--peek))); transition: transform .28s cubic-bezier(.2,.8,.2,1); }\n  #grimerud-map.gm-full .panel.open { transform: none; }\n  #grimerud-map.gm-full .panel .head, #grimerud-map.gm-full .panel .foot { display: none; }\n  #grimerud-map.gm-full .sheet-handle { display: grid; place-items: center; width: 100%; height: 22px; flex: none; cursor: grab; touch-action: none; }\n  #grimerud-map.gm-full .sheet-handle span { width: 40px; height: 5px; border-radius: 3px; background: #c9c2b4; }\n  #grimerud-map.gm-full .search { margin: 0 14px 10px; }\n  #grimerud-map.gm-full .list { overflow-y: auto; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }\n  #grimerud-map.gm-full .stage .tool.corner, #grimerud-map.gm-full .stage .card { bottom: calc(var(--peek) + 10px); }\n  @media (prefers-reduced-motion: reduce) { #grimerud-map.gm-full .panel { transition: none; } }\n}\n#grimerud-map.gm-full .maptabs, #grimerud-map.gm-full .tools { top: calc(10px + env(safe-area-inset-top, 0px)); }\n#grimerud-map.gm-full .tool.corner { bottom: calc(10px + env(safe-area-inset-bottom, 0px)); }\n#grimerud-map.gm-full .card { bottom: calc(10px + env(safe-area-inset-bottom, 0px)); }\n#grimerud-map.gm-full #gm-expand { background: #26221d; color: #fffdf8; }\n"; document.head.appendChild(st);
  mount.outerHTML = "<!-- Grimerud G\u00e5rd map markup. Element ids are prefixed gm- so they cannot clash with the host page. -->\n<div id=\"grimerud-map\" data-src=\"https://philemonl.github.io/grimerud-map/dist/grimerud-map-data.js?v=24615c2ab9\">\n  <div class=\"app\">\n    <aside class=\"panel\">\n      <button class=\"sheet-handle\" id=\"gm-sheet\" type=\"button\" aria-expanded=\"false\" aria-label=\"Vis liste \u00b7 Show list\"><span></span></button>\n      <div class=\"head\">\n        <div class=\"brand\"><img src=\"data:image/png;base64,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\" alt=\"YWAM \u00b7 Ungdom i Oppdrag\" width=\"61\" height=\"48\"><img src=\"data:image/png;base64,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\" alt=\"Grimerud\" width=\"28\" height=\"48\"></div>\n        <p class=\"welcome\">Velkommen til Ungdom i Oppdrag</p>\n        <h1>Grimerud G\u00e5rd</h1>\n        <p class=\"since\">Siden 1975</p>\n        <p class=\"lede\"><span class=\"lede-d\">Tap a place in the list or on the map. Drag to turn the map, scroll to zoom, or open it full screen with <svg class=\"ico\" viewBox=\"0 0 20 20\" aria-label=\"full screen button\"><path d=\"M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>.</span><span class=\"lede-m\">Tap a place in the list or on the map. Move and zoom the map with two fingers, or tap <svg class=\"ico\" viewBox=\"0 0 20 20\" aria-label=\"full screen button\"><path d=\"M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg> for full screen, where one finger turns it.</span></p>\n      </div>\n      <div class=\"search\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><circle cx=\"8.5\" cy=\"8.5\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"/><path d=\"M12.3 12.3l4.2 4.2\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg><input id=\"gm-search\" type=\"search\" placeholder=\"S\u00f8k \u00b7 Search\" aria-label=\"S\u00f8k etter et sted \u00b7 Search for a place\" autocomplete=\"off\"><button id=\"gm-sclear\" type=\"button\" aria-label=\"T\u00f8m s\u00f8k \u00b7 Clear search\" hidden>\u00d7</button></div>\n      <p class=\"noresult\" id=\"gm-noresult\" hidden>Ingen treff \u00b7 No matches</p>\n      <div class=\"ltabs\" role=\"tablist\" aria-label=\"Lister \u00b7 Lists\">\n        <button role=\"tab\" id=\"gm-tfarm\" aria-selected=\"true\" aria-controls=\"gm-list\">Grimerud</button>\n        <button role=\"tab\" id=\"gm-tdisc\" aria-selected=\"false\" aria-controls=\"gm-list\">Diskgolf</button>\n      </div>\n      <nav class=\"list\" id=\"gm-list\" aria-label=\"Places\" role=\"tabpanel\"></nav>\n      <div class=\"foot\">\n        <strong>Grimerudvegen 77, 2312 Ottestad</strong>\n        <div class=\"coord\">60\u00b044\u203223\u2033N \u00b7 11\u00b007\u203252\u2033E</div>\n        <div>Site map by Jan Willem Middag \u00b7 Disc golf after UDisc \u00b7 Imagery \u00a9 Esri, Maxar, Earthstar Geographics. Positions and heights approximate.</div>\n      </div>\n    </aside>\n    <main class=\"stage\" id=\"gm-stage\">\n      <button class=\"listtoggle\" id=\"gm-listtoggle\" aria-expanded=\"true\" aria-label=\"Skjul liste \u00b7 Hide list\" data-tip=\"Skjul liste&#10;Hide list\"><svg viewBox=\"0 0 12 20\" aria-hidden=\"true\"><path d=\"M8 5l-4 5 4 5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></button>\n      <div class=\"gm-load\" id=\"gm-load\">Laster kart \u00b7 Loading map\u2026</div>\n      <canvas id=\"gm-c\" aria-label=\"Illustrated 3D map of Grimerud G\u00e5rd\"></canvas>\n      <div id=\"gm-pins\"></div>\n      <button class=\"dg-go\" id=\"gm-dggo\" hidden aria-label=\"Show the disc golf course\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 3v14M5 7h10l-1.5 4h-7z\" fill=\"none\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/><path d=\"M5.5 5h9\" stroke=\"#26221d\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M7 17h6\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg>Diskgolf</button>\n      <!-- top left: which map; right edge: one column of round tools -->\n      <div class=\"seg maptabs\" role=\"group\" aria-label=\"Kart \u00b7 Map\">\n        <button id=\"gm-mfarm\" aria-pressed=\"true\">Grimerud</button>\n        <button id=\"gm-mdisc\" aria-pressed=\"false\">Diskgolf</button>\n      </div>\n      <div class=\"tools\" role=\"toolbar\" aria-label=\"Kartverkt\u00f8y \u00b7 Map tools\">\n      <div class=\"tgrp\" data-g=\"view\">\n        <button class=\"tool compass\" id=\"gm-compass\" data-tip=\"Startvisning&#10;Reset view\" aria-label=\"Startvisning \u00b7 Reset view\">\n          <svg viewBox=\"0 0 40 40\" id=\"gm-needle\">\n            <path d=\"M20 3 L23 17 L37 20 L23 23 L20 37 L17 23 L3 20 L17 17 Z\" fill=\"#fffdf8\" stroke=\"#26221d\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/>\n            <path d=\"M20 3 L23 17 L20 20 Z M37 20 L23 23 L20 20 Z M20 37 L17 23 L20 20 Z M3 20 L17 17 L20 20 Z\" fill=\"#26221d\"/>\n            <path d=\"M20 3 L23 17 L20 20 L17 17 Z\" fill=\"#b23a2b\" stroke=\"#26221d\" stroke-width=\"1\"/>\n          </svg>\n        </button>\n        <div class=\"tool-pair\" role=\"group\" aria-label=\"Visning \u00b7 View\">\n          <button class=\"tool\" id=\"gm-v3d\" aria-pressed=\"true\" data-tip=\"3D-visning&#10;3D view\">3D</button>\n          <button class=\"tool\" id=\"gm-vtop\" aria-pressed=\"false\" data-tip=\"Kart ovenfra&#10;Map from above\">2D</button>\n        </div>\n      </div>\n      <div class=\"tgrp\" data-g=\"zoom\">\n        <div class=\"tool-pair\" role=\"group\" aria-label=\"Zoom\">\n          <button class=\"tool\" id=\"gm-zin\" data-tip=\"Zoom inn&#10;Zoom in\" aria-label=\"Zoom inn \u00b7 Zoom in\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 4.5v11M4.5 10h11\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg></button>\n          <button class=\"tool\" id=\"gm-zout\" data-tip=\"Zoom ut&#10;Zoom out\" aria-label=\"Zoom ut \u00b7 Zoom out\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M4.5 10h11\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg></button>\n        </div>\n      </div>\n      <div class=\"tgrp look\" data-g=\"look\">\n        <button class=\"tool\" id=\"gm-layers\" aria-expanded=\"false\" aria-controls=\"gm-menu\" data-tip=\"Mer \u00e5 vise&#10;More to show\" aria-label=\"Mer \u00e5 vise \u00b7 More to show\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 3l7.5 4L10 11 2.5 7z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/><path d=\"M2.5 10.5L10 14.5l7.5-4M2.5 13.8L10 17.8l7.5-4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/></svg></button>\n        <div class=\"drawer\" id=\"gm-menu\" aria-label=\"Mer \u00e5 vise \u00b7 More to show\">\n          <button class=\"tool vmode\" id=\"gm-vmode\" data-tip=\"Kart ovenfra&#10;Map from above\" aria-pressed=\"false\" aria-label=\"Kart ovenfra \u00b7 Map from above\">2D</button>\n          <button class=\"tool\" id=\"gm-vnames\" data-tip=\"Vis navn&#10;Show names\" aria-pressed=\"false\" aria-label=\"Vis navn \u00b7 Show names\"><span class=\"aa\" aria-hidden=\"true\">Aa</span></button>\n          <button class=\"tool state\" id=\"gm-vwinter\" data-tip=\"Vinter&#10;Winter\" aria-pressed=\"false\" aria-label=\"Vinter \u00b7 Winter\"><svg class=\"st-off\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M4 16c0-7 4.5-11.5 12-12-.3 7.5-5 12-12 12z\" fill=\"currentColor\"/><path d=\"M4 16l7-7\" stroke=\"#fffdf8\" stroke-width=\"1.4\" stroke-linecap=\"round\"/></svg><svg class=\"st-on\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 2.5v15M3.5 6.25l13 7.5M3.5 13.75l13-7.5M10 2.5l-2 2M10 2.5l2 2M10 17.5l-2-2M10 17.5l2-2M3.5 6.25l2.7.7M3.5 6.25l.7 2.7M16.5 13.75l-2.7-.7M16.5 13.75l-.7-2.7M3.5 13.75l.7-2.7M3.5 13.75l2.7-.7M16.5 6.25l-.7 2.7M16.5 6.25l-2.7.7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></button>\n          <button class=\"tool state\" id=\"gm-vnight\" data-tip=\"Natt&#10;Night\" aria-pressed=\"false\" aria-label=\"Natt \u00b7 Night\"><svg class=\"st-off\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><circle cx=\"10\" cy=\"10\" r=\"3.6\" fill=\"currentColor\"/><path d=\"M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l1.7-1.7\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg><svg class=\"st-on\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M14.5 13.2A6.5 6.5 0 0 1 7 3.6a6.5 6.5 0 1 0 7.5 9.6z\" fill=\"currentColor\"/></svg></button>\n        </div>\n      </div>\n      </div>\n        <button class=\"tool corner\" id=\"gm-expand\" aria-pressed=\"false\" data-tip=\"Fullskjerm&#10;Full screen\" aria-label=\"Fullskjerm \u00b7 Full screen\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg><span class=\"tx sr\">Fullskjerm</span></button>\n      <button class=\"dg-go farm\" id=\"gm-farmpin\" hidden aria-label=\"Zoom in on Grimerud\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M3 10l7-6 7 6M5 9v8h10V9\" fill=\"none\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/></svg>Grimerud</button>\n      <button class=\"dg-go farm\" id=\"gm-farmgo\" hidden aria-label=\"Back to the Grimerud map\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M3 10l7-6 7 6M5 9v8h10V9\" fill=\"none\" stroke=\"#26221d\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/></svg>Grimerud</button>\n      <div class=\"card\" id=\"gm-card\" hidden>\n        <span class=\"num\" id=\"gm-cnum\"></span>\n        <div><h2 id=\"gm-cname\"></h2><p id=\"gm-cdesc\"></p></div>\n        <button class=\"close\" id=\"gm-cclose\" aria-label=\"Close\">\u00d7</button>\n      </div>\n      <div class=\"gm-wheel\" id=\"gm-wheel\" aria-hidden=\"true\">Hold Ctrl / \u2318 og scroll for \u00e5 zoome \u00b7 to zoom</div>\n      <div class=\"toast\" id=\"gm-two\" aria-hidden=\"true\">Bruk to fingre for \u00e5 flytte kartet<i>Use two fingers to move the map</i></div>\n      <div class=\"hint\" id=\"gm-hint\">Drag to turn \u00b7 right-drag or two fingers to move</div>\n    </main>\n  </div>\n</div>\n";
})();
// Grimerud G\u00e5rd map loader. build.py wraps map.js inside init() below and fills in the @-placeholders.
// It loads three.js and the heavy data file only when the map comes near the screen, then starts the map.
(function () {
  "use strict";
  var root = document.getElementById("grimerud-map");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";

  var DATA_URL = root.getAttribute("data-src") || "https://philemonl.github.io/grimerud-map/dist/grimerud-map-data.js?v=24615c2ab9";
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
    const DATA = {"items":[{"n":"1","g":"b","no":"Hovedbygning","en":"Main building","sub_no":"Matsal \u00b7 Stuene \u00b7 Caf\u00e9 Alv \u00b7 TV-rom","sub_en":"Dining hall \u00b7 Living rooms \u00b7 Caf\u00e9 Alv \u00b7 TV room","parts":[{"p":[[774.4,991.3],[815.1,988.9],[822.2,1109.3],[781.5,1111.7]],"h":6.6,"wall":"#f6f4ee","stucco":true,"base":[0.9,"#8e8a84","stone"],"gable":"#f8f6f0","trim":false,"roof":"#6a3226","bay":4.7,"endBays":3,"dormers":6,"dormerStyle":"shed","rise":5.0,"dormerSize":1.35,"chimneys":[[796.5,1020.2],[798.7,1056.3]],"porch":[778.0,1051.5,"w"],"facade":{"side":"s","wall":"#f6f4ee","base":[0.9,"#8e8a84"],"win":[[0.8,0.22,1.1,0.48,"cellar"],[2.25,0.22,1.1,0.48,"cellar"],[3.7,0.22,1.1,0.48,"cellar"],[0.8,1.45,1.1,1.75],[2.25,1.45,1.1,1.75],[3.7,1.45,1.1,1.75],[0.8,4.0,1.1,1.85,"juliet"],[2.25,4.0,1.1,1.85,"juliet"],[3.7,4.0,1.1,1.85,"juliet"],[7.95,5.0,1.4,1.45]],"gable":{"color":"#f8f6f0","win":[[4.0,0.75,1.2,1.3],[5.35,0.75,1.2,1.3],[6.7,0.75,1.2,1.3]]}},"stoop":[811.2,1109.9,"s",1.2],"tables":[[787.3,1120.4],[796.7,1119.9],[786.6,1128.9],[796.0,1128.4]]},{"p":[[774.7,1092.8],[780.4,1092.4],[781.4,1109.3],[775.7,1109.6]],"h":3.3,"wall":"#f6f4ee","stucco":true,"trim":false,"roof":"#e9e6de","flat":true,"railing":true},{"p":[[799.8,1001.5],[831.7,999.6],[834.8,1052.5],[802.9,1054.4]],"h":2.7,"wall":"#f4f2ec","roof":"#6a3226","bay":4.7,"rise":2.0,"trim":false,"stoop":[833.9,1022.5,"e",1.0,"open"]},{"p":[[832.9,994.4],[845.8,993.6],[847.1,1015.6],[834.2,1016.4]],"h":2.6,"wall":"#f4f2ec","roof":"#e9e6de","flat":true,"trim":false,"plain":true}]},{"n":"1a","g":"b","no":"The Bird & Baby Caf\u00e9","en":"The Bird & Baby Caf\u00e9","sub_no":"Serverer kaffe, espresso, te-drikker og mer.","sub_en":"Serving coffee, espresso, tea drinks, and more.","pin":[795.5,1002.1],"inside":"1"},{"n":"2","g":"b","no":"Kontorbygning","en":"Office building","sub_no":"Resepsjon \u00b7 Kontorfl\u00f8y \u00b7 Studio","sub_en":"Reception \u00b7 Offices \u00b7 Studio","parts":[{"p":[[553.2,924.7],[653.4,918.8],[656.4,969.5],[556.2,975.4]],"grade":[1.9,0.6,0.5],"h":8.8,"wall":"#e2b350","roof":"#b84a30","stucco":true,"solar":"s","skylights":{"n":4},"base":[2.7,"#f1f0eb","stone"],"bay":3.1,"rise":4.6,"chimneys":[[646.9,944.6],[609.2,936.7]],"chimneyColor":"#dcae4f","balconies":[{"edge":3,"n":1,"upper":true,"y":5.7,"w":11,"color":"#e4e8df","rail":true},{"edge":2,"n":1,"at":0.56,"upper":true,"y":2.75,"w":5.6,"color":"#7f8b74","rail":true},{"edge":2,"n":1,"at":0.06,"upper":true,"y":5.75,"w":2.2,"color":"#7f8b74","rail":true}],"garage":[[600.3,972.8,"s",2.8,2.3,"wood"]],"porch":[652.9,969.7,"s"]}]},{"n":"3","g":"b","no":"Gym-bygning","en":"Gym building","sub_no":"Gymsal \u00b7 Lille b\u00f8nnerommet","sub_en":"Gym \u00b7 Little prayer room","parts":[{"p":[[652.3,899.7],[688.7,897.6],[692.7,965.9],[656.3,968.0]],"h":6.5,"wall":"#f4f2ec","roof":"#b84a30","steeple":[673.8,955.3],"gables":{"s":"#dcb35a"},"skin":[{"p":[[654.7,940.7],[691.1,938.6],[692.7,965.9],[656.3,968.0]],"wall":"#dcb35a","stucco":true}],"porch":[687.2,966.2,"s","gable"]}]},{"n":"4","g":"b","no":"L\u00e5ven","en":"The Barn","sub_no":"M\u00f8tesal \u00b7 Prokla Media \u00b7 B\u00f8nnerom","sub_en":"Meeting hall \u00b7 Prokla Media \u00b7 Prayer room","parts":[{"p":[[575.7,699.7],[802.3,686.4],[806.3,755.3],[579.7,768.6]],"grade":[2.8,0,0.8],"h":6.2,"wall":"#a3282a","gable":"#a3282a","base":[3.0,"#e4e1d8","barn"],"roof":"#2f3135","plain":true,"barn":true,"rise":7.5,"garage":[[679.4,762.7,"s",3.6,3.0],[804.3,720.8,"e",4.4,3.8],[650.5,695.3,"n",2.6,2.5],[679.9,693.6,"n",2.6,2.5],[720.7,691.2,"n",2.6,2.5],[734.3,690.4,"n",1.2,2.2],[747.9,689.6,"n",2.4,2.4],[772.8,688.1,"n",1.2,2.2]],"ramp":[600,642,600,692,4.8,3.0]},{"p":[[677.7,755.3],[755.1,750.7],[756.9,780.7],[679.5,785.3]],"h":6.2,"wall":"#a3282a","base":[3.0,"#e4e1d8"],"roof":"#2f3135","cross":true,"gables":{"s":"#a3282a"},"rise":4.6,"porch":[722.1,782.8,"s","plain"]},{"p":[[667.2,762.8],[677.2,762.2],[677.8,772.2],[667.8,772.8]],"h":2.6,"wall":"#a3282a","roof":"#46474b","plain":true,"trim":false,"rise":0.9},{"p":[[567.9,741.6],[578.1,741.0],[579.5,765.2],[569.3,765.8]],"h":2.4,"wall":"#a3282a","roof":"#cfd6d8","flat":true,"plain":true,"trim":false},{"p":[[758.9,764.1],[794.9,762.0],[799.1,833.9],[763.1,836.0]],"h":2.8,"wall":"#fbfaf5","roof":"#f6f4ee","tent":true,"trim":false}]},{"n":"4a","g":"b","no":"B\u00f8nnerommet","en":"Prayer room","sub_no":"Oppe i inngangsfl\u00f8yen til l\u00e5ven","sub_en":"Upstairs in the barn\u2019s entrance wing","pin":[722,752],"inside":"4","pinH":11},{"n":"4b","g":"b","no":"Overflow-rommet","en":"Overflow room","sub_no":"Inne i l\u00e5ven, i vestenden","sub_en":"Inside the barn, at the west end","pin":[606,688],"inside":"4"},{"n":"5","g":"b","no":"Internatet","en":"Dormitories","sub_no":"","sub_en":"","parts":[{"p":[[1124.4,1132.0],[1161.8,1123.2],[1181.1,1205.0],[1143.7,1213.8]],"h":6.5,"wall":"#a8292a","roof":"#6e3a2e","balconies":[{"edge":1,"n":2,"color":"#f4f2ec"},{"edge":3,"n":3,"color":"#f4f2ec"}]},{"p":[[1149.0,1152.4],[1175.7,1146.1],[1182.4,1174.8],[1155.7,1181.1]],"h":6.5,"wall":"#a8292a","roof":"#5a2d26","cross":true,"rise":4.4,"trim":false,"porch":[1179.0,1160.5,"e"]}]},{"n":"6","g":"b","no":"Bispen","en":"Bispen","sub_no":"","sub_en":"","parts":[{"p":[[655.7,1108.7],[688.7,1106.8],[690.5,1137.3],[657.5,1139.2]],"h":5.6,"wall":"#e8c77e","roof":"#7a3328","bay":3.4,"solar":"s"},{"p":[[658.2,1101.5],[676.6,1100.4],[677.0,1107.5],[658.6,1108.6]],"h":3.0,"wall":"#e8c77e","roof":"#7a3328","bay":3.4},{"p":[[657.5,1139.2],[687.6,1137.5],[688.3,1149.8],[658.2,1151.5]],"h":0.6,"wall":"#4a4440","roof":"#5b5148","flat":true,"plain":true,"trim":false,"railing":true},{"p":[[646.1,1139.0],[656.9,1138.4],[657.5,1149.8],[646.7,1150.4]],"h":2.3,"wall":"#9a9a92","roof":"#43474c","bay":3.4}]},{"n":"7","g":"b","no":"Hybelhuset","en":"Boys\u2019 House","sub_no":"","sub_en":"","parts":[{"p":[[1100,1300],[1118,1276],[1158,1306],[1140,1332]],"h":3.4,"wall":"#e6bf4f","roof":"#c0532f","rise":4.8,"dormers":1,"dormerSize":3,"chimneys":[[1124,1298]],"bay":3.6},{"p":[[1128,1302],[1149,1318],[1175,1284],[1154,1268]],"h":3.0,"wall":"#e6bf4f","roof":"#c0532f","rise":2.8,"trim":false,"bay":3.6}]},{"n":"8","g":"b","no":"Rekkehusene","en":"Row houses","sub_no":"","sub_en":"","parts":[{"p":[[1025,1300.5],[1062,1326.5],[1040.6,1355.7],[1003.6,1328.7]],"h":5.6,"wall":"#a12e28","roof":"#6b5b53","bay":3.4,"balconies":{"edge":2,"n":2}},{"p":[[1069,1319.5],[1106,1346.5],[1085.6,1375.7],[1048.6,1348.7]],"h":5.6,"wall":"#a12e28","roof":"#6b5b53","bay":3.4,"balconies":{"edge":2,"n":2}},{"p":[[1102,1355.5],[1139,1382.5],[1117.6,1411.7],[1080.6,1384.7]],"h":5.6,"wall":"#a12e28","roof":"#6b5b53","bay":3.4,"balconies":{"edge":2,"n":2}}]},{"n":"9","g":"b","no":"Grimerud Barnehage","en":"Grimerud Kindergarten","sub_no":"","sub_en":"","parts":[{"p":[[862.2,1089.2],[906.3,1086.6],[907.8,1112.0],[863.7,1114.6]],"h":5.5,"wall":"#a8292a","roof":"#b23e2c"},{"p":[[850.7,1086.8],[862.0,1086.1],[863.9,1117.4],[852.6,1118.1]],"h":2.8,"wall":"#f4f2ec","roof":"#e9e6de","flat":true,"trim":false},{"p":[[868.7,1114.3],[902.7,1112.3],[908.3,1207.5],[874.3,1209.5]],"h":4.5,"wall":"#a8292a","roof":"#b23e2c","solar":true},{"p":[[902.4,1145.5],[922.7,1144.3],[924.4,1173.7],[904.1,1174.9]],"h":4.5,"wall":"#a8292a","roof":"#5a2d26","rise":2.7,"cross":true,"trim":false,"solar":"s"}]},{"n":"P","g":"a","no":"Parkering","en":"Car park","sub_no":"","sub_en":"Main parking on the south side of the farm road.","area":[[834,940],[1065,926],[1072,1056],[918,1058],[880,1044],[834,1044]]},{"n":"E","g":"a","icon":"arrow","no":"Innkj\u00f8ring","en":"Entrance","sub_no":"","sub_en":"Turn west off Grimerudvegen. The car park is about 100 m ahead on the left.","pin":[1442,838]},{"n":"10","g":"o","no":"Garasjen","en":"Garage","sub_no":"","sub_en":"Red garage building east of the barn.","parts":[{"p":[[948.6,679.5],[994.4,676.9],[1001.0,789.3],[955.2,791.9]],"h":5,"wall":"#a8292a","roof":"#34363a","plain":true,"garage":[[970,791,"s",3.4,3.0],[985,790,"s",3.4,3.0]]}]},{"n":"11","g":"o","no":"Barracks","en":"Barracks","sub_no":"","sub_en":"Long, low building along the farm road, opposite the car park.","parts":[{"p":[[1027.3,872.1],[1211.0,832.1],[1218.3,865.9],[1034.6,905.9]],"h":6,"wall":"#a8292a","roof":"#dcdbd6","flat":true,"stripes":2.9}]},{"n":"12","g":"o","no":"Spiseteltet","en":"Dining tent","sub_no":"","sub_en":"Large white tent just south of the main building.","parts":[{"p":[[789.0,1137.7],[822.1,1135.8],[825.8,1199.3],[792.7,1201.2]],"h":2.6,"wall":"#fbfaf5","roof":"#f6f4ee","tent":true}]},{"n":"13","g":"o","no":"Nordl\u00e5ven","en":"North barn","sub_no":"","sub_en":"Older farm barn and work yard north of the garage, reached by the farm track.","parts":[{"p":[[982,258],[1036,261],[1031,415],[977,412]],"h":7,"wall":"#a8292a","gable":"#a8292a","roof":"#55585c","plain":true,"base":[1.6,"#d9d5cc"]},{"p":[[829.0,310.9],[858.9,309.1],[861.0,345.1],[831.1,346.9]],"h":3.5,"wall":"#a8292a","roof":"#55585c","plain":true}]},{"n":"14","g":"o","no":"Vaktmesterboligen","en":"Caretaker\u2019s house","sub_no":"","sub_en":"First house on the right as you turn in from Grimerudvegen.","parts":[{"p":[[1359.0,777.3],[1403.0,774.7],[1405.0,808.7],[1361.0,811.3]],"h":4.5,"wall":"#f4f1ea","roof":"#c4432d"}]},{"n":"15","g":"o","no":"Trailerparken","en":"Trailer park","sub_no":"Brakker og vogner mellom kontorbygget og l\u00e5ven.","sub_en":"Cabins and trailers between the office building and the barn.","pin":[588,838],"parts":[{"p":[[555.7,785.0],[579.7,783.6],[580.3,793.0],[556.3,794.4]],"h":3.0,"trailer":{"door":"n","n":8}},{"p":[[555.7,795.5],[579.7,794.1],[580.3,803.5],[556.3,804.9]],"h":3.0,"trailer":{"door":"s","n":7}},{"p":[[556.7,828.5],[580.7,827.1],[581.3,836.5],[557.3,837.9]],"h":3.0,"trailer":{"door":"n","n":6}},{"p":[[556.7,839.0],[580.7,837.6],[581.3,847.0],[557.3,848.4]],"h":3.0,"trailer":{"door":"s","n":5}},{"p":[[560.7,871.0],[586.7,869.5],[587.3,879.0],[561.3,880.5]],"h":3.0,"trailer":{"door":"n","n":4}},{"p":[[560.7,881.5],[586.7,880.0],[587.3,889.5],[561.3,891.0]],"h":3.0,"trailer":{"door":"s","n":3}},{"p":[[604.0,803.3],[613.5,802.7],[615.0,828.7],[605.5,829.3]],"h":3.0,"trailer":{"door":"w","n":1}},{"p":[[609.5,853.3],[619.0,852.7],[620.5,878.7],[611.0,879.3]],"h":3.0,"trailer":{"door":"e","n":2}}]},{"n":"DG","g":"d","no":"Grimerud diskgolfbane","en":"Grimerud disc golf course","sub_no":"Parker p\u00e5 Grimerud g\u00e5rd og f\u00f8lg den stiplede ruten \u00b7 ca. 700 m","sub_en":"Park at Grimerud g\u00e5rd and follow the dashed route \u00b7 about 700 m","pin":[2966,-209],"size":260,"disc":"all"},{"n":"1","g":"d","no":"Hull 1","en":"Hole 1","sub_no":"ca. 73 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 73 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2456.8,-85.2],"focus":[2421,35],"size":40.150000000000006,"disc":1},{"n":"2","g":"d","no":"Hull 2","en":"Hole 2","sub_no":"ca. 144 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 144 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2829.7,-252.7],"focus":[2648,-87],"size":79.2,"disc":2},{"n":"3","g":"d","no":"Hull 3","en":"Hole 3","sub_no":"ca. 94 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 94 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2890.0,-440.0],"focus":[2762,-343],"size":51.7,"disc":3},{"n":"4","g":"d","no":"Hull 4","en":"Hole 4","sub_no":"ca. 64 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 64 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2756.0,-625.8],"focus":[2830,-546],"size":35.2,"disc":4},{"n":"5","g":"d","no":"Hull 5","en":"Hole 5","sub_no":"ca. 88 m \u00b7 utkast: Bl\u00e5 / R\u00f8d","sub_en":"About 88 m \u00b7 tee: Bl\u00e5 / R\u00f8d","pin":[2689.7,-424.8],"focus":[2654,-571],"size":48.400000000000006,"disc":5},{"n":"6","g":"d","no":"Hull 6","en":"Hole 6","sub_no":"ca. 127 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 127 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2499.2,-726.2],"focus":[2557,-516],"size":69.85000000000001,"disc":6},{"n":"7","g":"d","no":"Hull 7","en":"Hole 7","sub_no":"ca. 64 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 64 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2487.9,-1009.4],"focus":[2502,-901],"size":35.2,"disc":7},{"n":"8","g":"d","no":"Hull 8","en":"Hole 8","sub_no":"ca. 64 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 64 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2697.6,-927.2],"focus":[2609,-991],"size":35.2,"disc":8},{"n":"9","g":"d","no":"Hull 9","en":"Hole 9","sub_no":"ca. 77 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 77 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2805.7,-765.8],"focus":[2674,-770],"size":42.35,"disc":9},{"n":"10","g":"d","no":"Hull 10","en":"Hole 10","sub_no":"ca. 102 m \u00b7 utkast: Bl\u00e5 / R\u00f8d","sub_en":"About 102 m \u00b7 tee: Bl\u00e5 / R\u00f8d","pin":[2967.0,-601.4],"focus":[2873,-749],"size":56.1,"disc":10},{"n":"11","g":"d","no":"Hull 11","en":"Hole 11","sub_no":"ca. 67 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 67 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2987.4,-315.2],"focus":[2960,-427],"size":36.85,"disc":11},{"n":"12","g":"d","no":"Hull 12","en":"Hole 12","sub_no":"ca. 110 m \u00b7 utkast: Bl\u00e5 / R\u00f8d","sub_en":"About 110 m \u00b7 tee: Bl\u00e5 / R\u00f8d","pin":[2957.9,19.8],"focus":[2923,-166],"size":60.50000000000001,"disc":12},{"n":"13","g":"d","no":"Hull 13","en":"Hole 13","sub_no":"ca. 82 m \u00b7 utkast: Bl\u00e5","sub_en":"About 82 m \u00b7 tee: Bl\u00e5","pin":[3504.0,523.7],"focus":[3398,431],"size":45.1,"disc":13},{"n":"14","g":"d","no":"Hull 14","en":"Hole 14","sub_no":"ca. 108 m \u00b7 utkast: Bl\u00e5","sub_en":"About 108 m \u00b7 tee: Bl\u00e5","pin":[4034.2,765.8],"focus":[3854,722],"size":59.400000000000006,"disc":14},{"n":"15","g":"d","no":"Hull 15","en":"Hole 15","sub_no":"ca. 77 m \u00b7 utkast: Bl\u00e5","sub_en":"About 77 m \u00b7 tee: Bl\u00e5","pin":[4178.0,610.5],"focus":[4187,742],"size":42.35,"disc":15},{"n":"16","g":"d","no":"Hull 16","en":"Hole 16","sub_no":"ca. 144 m \u00b7 utkast: Bl\u00e5","sub_en":"About 144 m \u00b7 tee: Bl\u00e5","pin":[3626.8,473.5],"focus":[3849,582],"size":79.2,"disc":16},{"n":"17","g":"d","no":"Hull 17","en":"Hole 17","sub_no":"ca. 85 m \u00b7 utkast: Bl\u00e5","sub_en":"About 85 m \u00b7 tee: Bl\u00e5","pin":[3113.1,184.2],"focus":[3246,244],"size":46.75000000000001,"disc":17},{"n":"18","g":"d","no":"Hull 18","en":"Hole 18","sub_no":"ca. 130 m \u00b7 utkast: Bl\u00e5/R\u00f8d","sub_en":"About 130 m \u00b7 tee: Bl\u00e5/R\u00f8d","pin":[2448.4,207.1],"focus":[2645,105],"size":71.5,"disc":18}],"disc":[{"hole":1,"basket":[2456.8,-85.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2384.5,155.3]}],"length":73},{"hole":2,"basket":[2829.7,-252.7],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2466.3,79.2]}],"length":144},{"hole":3,"basket":[2890.0,-440.0],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2634.0,-245.1]}],"length":94},{"hole":4,"basket":[2756.0,-625.8],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2903.6,-465.9]}],"length":64},{"hole":5,"basket":[2689.7,-424.8],"tees":[{"label":"Bl\u00e5","p":[2617.6,-717.1]},{"label":"R\u00f8d","p":[2672.4,-674.5]}],"length":88},{"hole":6,"basket":[2499.2,-726.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2614.1,-306.0]}],"length":127},{"hole":7,"basket":[2487.9,-1009.4],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2515.8,-793.2]}],"length":64},{"hole":8,"basket":[2697.6,-927.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2521.2,-1055.1]}],"length":64},{"hole":9,"basket":[2805.7,-765.8],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2541.6,-775.0]}],"length":77},{"hole":10,"basket":[2967.0,-601.4],"tees":[{"label":"Bl\u00e5","p":[2778.1,-896.8]},{"label":"R\u00f8d","p":[2831.4,-820.6]}],"length":102},{"hole":11,"basket":[2987.4,-315.2],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2932.2,-539.0]}],"length":67},{"hole":12,"basket":[2957.9,19.8],"tees":[{"label":"Bl\u00e5","p":[2887.2,-351.7]},{"label":"R\u00f8d","p":[2975.5,-245.1]}],"length":110},{"hole":13,"basket":[3504.0,523.7],"tees":[{"label":"Bl\u00e5","p":[3292.6,338.0]}],"length":82},{"hole":14,"basket":[4034.2,765.8],"tees":[{"label":"Bl\u00e5","p":[3672.8,679.0]}],"length":108},{"hole":15,"basket":[4178.0,610.5],"tees":[{"label":"Bl\u00e5","p":[4195.4,873.9]}],"length":77},{"hole":16,"basket":[3626.8,473.5],"tees":[{"label":"Bl\u00e5","p":[4070.5,691.2]}],"length":144},{"hole":17,"basket":[3113.1,184.2],"tees":[{"label":"Bl\u00e5","p":[3379.0,303.0]}],"length":85},{"hole":18,"basket":[2448.4,207.1],"tees":[{"label":"Bl\u00e5/R\u00f8d","p":[2842.5,3.1]}],"length":130}],"walk":[[1020,962],[1040,925],[1090,902],[1150,888],[1210,872],[1260,860],[1300,848],[1340,838],[1385,836],[1446,838],[1440,760],[1428,588],[1400,392],[1393,0],[1396,10],[1700,12],[2000,14],[2310,16],[2360,100],[2385,150]],"context":[{"p":[[866.7,860.2],[904.7,857.9],[907.3,901.8],[869.3,904.1]],"h":5.0,"wall":"#e6bf4f","roof":"#c0432b"},{"p":[[868.4,837.9],[898.3,836.1],[899.6,858.1],[869.7,859.9]],"h":3.0,"wall":"#f4f2ec","roof":"#e9e6de","flat":true,"trim":false},{"p":[[857.8,854.3],[867.8,853.7],[870.2,893.7],[860.2,894.3]],"h":2.8,"wall":"#e6bf4f","roof":"#e9e6de","flat":true,"trim":false},{"p":[[894.5,603.5],[910.5,602.5],[911.5,620.5],[895.5,621.5]],"h":6.0,"wall":"#a3282a","roof":"#34363a","plain":true,"trim":false,"rise":1.8},{"p":[[939.5,647.3],[983.4,644.7],[984.5,664.7],[940.6,667.3]],"h":1.6,"wall":"#a98a62","roof":"#d9d2c4","flat":true,"plain":true,"trim":false},{"p":[[957.3,876.8],[996.4,868.5],[998.7,879.2],[959.6,887.5]],"h":2.6,"wall":"#f4f2ec","roof":"#e9e6de","flat":true,"plain":true,"trim":false},{"p":[[865.3,1018.3],[879.3,1017.5],[880.5,1037.5],[866.5,1038.3]],"h":2.5,"wall":"#f4f2ec","roof":"#7b3a2b","plain":true,"trim":false,"rise":1.6},{"p":[[1174.4,1395.0],[1199.0,1364.3],[1230.2,1397.4],[1207.4,1426.1]],"h":5,"wall":"#e6bd4e","roof":"#c97f4a"}],"flag":[742,941],"roads":[[[[1480,-1280],[1400,-1120],[1384,-880],[1388,-480],[1393,0],[1400,392],[1428,588],[1440,760],[1446,850],[1446,980],[1428,1162],[1390,1255],[1344,1344],[1255,1478],[1232,1500],[1148,1650],[1078,1740],[1043,1792]],6,"road"],[[[1445.7,846.0],[1445,846],[1600,846],[1792,841]],5.5,"road"],[[[1189,1576],[1350,1588],[1500,1588],[1792,1588]],4.5,"road"],[[[1445,838],[1385,836],[1340,838],[1300,848],[1260,860],[1210,872],[1150,888],[1090,902],[1040,912],[1000,920],[960,927],[900,934],[868,946],[848,957],[815,962],[785,962],[764.5,957.4]],3.5,"drive"],[[[974.7,924.4],[975,926],[950,905],[932,880],[926,850],[924,820],[922,803]],3.5,"drive"],[[[1385.6,836.0],[1386,823],[1386,836]],3,"path"],[[[1400.9,398.6],[1405,398],[1200,424],[1029,448],[950,462],[925,540],[922,620],[922,700],[922,803]],3.2,"track"],[[[955.4,461.0],[957,470],[948,435],[955,418],[968,410],[973,407],[977.2,407.1]],3.2,"track"],[[[571.0,649.7],[556,640],[400,614],[200,611],[0,609]],3.2,"track"],[[[600,778],[576,776],[564,755],[561,700],[563,662],[576,642],[600,638],[700,646],[790,653],[840,665],[880,688],[905,700],[922,705]],3,"track"],[[[922,712],[870,710],[830,712],[806,716],[804.0,716.1]],3,"path"],[[[922,806],[892,803],[858,804],[826,800],[799,800],[797.1,800.1]],2.4,"path"],[[[700.0,885.0],[700,880],[706,895],[712,906],[724.2,920.2]],3.2,"path"],[[[747.2,967.8],[748,972],[753,988],[757,1020],[757,1080],[757,1105]],3.2,"path"],[[[757,1092],[725,1097],[700,1100],[688.7,1106.8]],2.8,"path"],[[[925.2,1057.9],[925,1045],[890,1040],[852,1045],[843,1080],[840,1118],[838.0,1118.2]],3,"path"],[[[757,1105],[765,1118],[800,1118],[838,1118],[842,1160],[857,1200],[880,1235],[930,1264],[990,1287]],3,"path"],[[[1052.1,1056.3],[1052,1045],[1058,1070],[1085,1088],[1125,1095],[1160,1108],[1185,1130],[1198,1165],[1198,1200],[1180,1220],[1140,1238],[1112,1252],[1090,1272],[1072,1298],[1066.6,1305.4]],3,"path"],[[[990,1287],[1030,1290],[1062,1302],[1100,1330],[1142,1360],[1152,1395],[1168,1430],[1210,1460],[1254,1477],[1255.2,1477.8]],3.2,"drive"]],"circle":[742,941,26],"island":[[622,782],[688,780],[692,852],[640,860],[620,830]],"islands":[[[918,941],[962,939],[963,952],[919,954]],[[982,938],[1020,936],[1021,949],[983,951]]],"island_trees":[[930,947,2.8],[952,946,2.6],[994,944,3.0],[1012,943,2.6]],"yard":[[590,752],[805,752],[840,790],[840,840],[700,845],[595,840]],"sports":{"goals":[[548,1000,0],[548,1096,180]],"court":[[562,1133],[637,1133],[637,1202],[562,1202]],"net":[[600,1137],[600,1198]]},"hedges":[[[1002.6,1330.7],[985.6,1354.7],[1022.6,1381.7],[1039.6,1357.7]],[[1046.6,1350.7],[1029.6,1374.7],[1066.6,1401.7],[1083.6,1376.7]],[[1079.6,1385.7],[1061.6,1410.7],[1098.6,1437.7],[1116.6,1412.7]]],"gravel":[[[[1182.0,1573.0],[1183.0,1581.0],[1188.0,1584.0],[1342.0,1595.0],[1343.0,1596.0],[1791.0,1596.0],[1791.0,1580.0],[1345.0,1580.0],[1344.0,1579.0],[1277.0,1575.0],[1276.0,1574.0],[1210.0,1570.0],[1196.0,1568.0],[1186.0,1569.0]]],[[[0.0,603.0],[0.0,615.0],[402.0,620.0],[546.0,644.0],[556.0,647.0],[560.0,652.0],[560.0,656.0],[557.0,662.0],[555.0,709.0],[556.0,710.0],[558.0,755.0],[561.0,762.0],[561.0,766.0],[558.0,770.0],[550.0,773.0],[550.0,896.0],[551.0,897.0],[644.0,897.0],[651.0,901.0],[653.0,908.0],[652.0,914.0],[649.0,917.0],[644.0,919.0],[554.0,924.0],[553.0,932.0],[554.0,933.0],[556.0,974.0],[557.0,975.0],[565.0,974.0],[583.0,975.0],[588.0,980.0],[589.0,989.0],[719.0,985.0],[739.0,990.0],[745.0,996.0],[747.0,1044.0],[751.0,1050.0],[751.0,1082.0],[750.0,1084.0],[740.0,1089.0],[699.0,1094.0],[686.0,1102.0],[679.0,1102.0],[675.0,1100.0],[659.0,1101.0],[655.0,1109.0],[656.0,1133.0],[653.0,1137.0],[646.0,1140.0],[646.0,1149.0],[658.0,1151.0],[687.0,1149.0],[688.0,1140.0],[690.0,1137.0],[689.0,1116.0],[693.0,1111.0],[705.0,1105.0],[721.0,1104.0],[742.0,1100.0],[749.0,1102.0],[759.0,1120.0],[762.0,1123.0],[774.0,1126.0],[777.0,1130.0],[777.0,1139.0],[786.0,1142.0],[790.0,1148.0],[791.0,1190.0],[793.0,1201.0],[824.0,1199.0],[825.0,1198.0],[824.0,1171.0],[829.0,1166.0],[837.0,1167.0],[841.0,1173.0],[851.0,1202.0],[874.0,1237.0],[878.0,1241.0],[930.0,1271.0],[943.0,1275.0],[985.0,1292.0],[997.0,1294.0],[1010.0,1294.0],[1016.0,1296.0],[1020.0,1301.0],[1020.0,1306.0],[1004.0,1327.0],[1008.0,1332.0],[1038.0,1354.0],[1041.0,1354.0],[1045.0,1351.0],[1052.0,1351.0],[1061.0,1357.0],[1082.0,1374.0],[1083.0,1380.0],[1081.0,1384.0],[1085.0,1388.0],[1115.0,1410.0],[1119.0,1409.0],[1133.0,1391.0],[1135.0,1390.0],[1143.0,1391.0],[1146.0,1395.0],[1163.0,1433.0],[1167.0,1437.0],[1208.0,1466.0],[1252.0,1483.0],[1257.0,1483.0],[1260.0,1480.0],[1260.0,1476.0],[1256.0,1471.0],[1213.0,1455.0],[1172.0,1425.0],[1158.0,1395.0],[1148.0,1358.0],[1143.0,1353.0],[1083.0,1310.0],[1078.0,1304.0],[1078.0,1300.0],[1091.0,1280.0],[1115.0,1257.0],[1151.0,1239.0],[1183.0,1225.0],[1202.0,1205.0],[1204.0,1200.0],[1204.0,1163.0],[1191.0,1128.0],[1186.0,1122.0],[1162.0,1102.0],[1127.0,1089.0],[1087.0,1082.0],[1068.0,1070.0],[1064.0,1065.0],[1064.0,1061.0],[1068.0,1056.0],[1077.0,1053.0],[1083.0,1047.0],[1090.0,1030.0],[1087.0,938.0],[1085.0,919.0],[1086.0,913.0],[1089.0,910.0],[1094.0,908.0],[1149.0,896.0],[1198.0,882.0],[1259.0,868.0],[1300.0,855.0],[1340.0,845.0],[1373.0,844.0],[1374.0,843.0],[1428.0,844.0],[1433.0,846.0],[1439.0,854.0],[1445.0,856.0],[1619.0,856.0],[1620.0,855.0],[1791.0,851.0],[1791.0,831.0],[1620.0,835.0],[1619.0,836.0],[1455.0,836.0],[1445.0,831.0],[1400.0,830.0],[1393.0,826.0],[1390.0,819.0],[1384.0,818.0],[1382.0,819.0],[1379.0,826.0],[1372.0,830.0],[1337.0,831.0],[1301.0,840.0],[1260.0,853.0],[1227.0,861.0],[1221.0,860.0],[1217.0,857.0],[1215.0,853.0],[1211.0,833.0],[1195.0,835.0],[1181.0,839.0],[1028.0,872.0],[1028.0,879.0],[1032.0,894.0],[1032.0,900.0],[1026.0,906.0],[988.0,908.0],[987.0,909.0],[969.0,909.0],[962.0,906.0],[951.0,895.0],[938.0,876.0],[933.0,852.0],[931.0,821.0],[934.0,817.0],[939.0,815.0],[999.0,815.0],[1000.0,814.0],[1000.0,800.0],[998.0,797.0],[998.0,793.0],[1001.0,788.0],[1001.0,781.0],[1000.0,780.0],[994.0,677.0],[987.0,676.0],[986.0,677.0],[949.0,679.0],[945.0,684.0],[940.0,686.0],[933.0,685.0],[928.0,680.0],[928.0,607.0],[929.0,606.0],[931.0,540.0],[951.0,479.0],[969.0,469.0],[982.0,470.0],[1001.0,459.0],[1027.0,454.0],[1205.0,429.0],[1378.0,408.0],[1394.0,405.0],[1403.0,405.0],[1408.0,403.0],[1410.0,400.0],[1409.0,394.0],[1405.0,392.0],[1361.0,398.0],[1196.0,418.0],[1039.0,441.0],[1032.0,441.0],[1025.0,443.0],[1020.0,442.0],[1016.0,439.0],[1008.0,424.0],[1008.0,420.0],[1011.0,416.0],[1016.0,414.0],[1023.0,415.0],[1031.0,414.0],[1035.0,277.0],[1036.0,276.0],[1036.0,262.0],[1035.0,261.0],[992.0,259.0],[991.0,258.0],[982.0,259.0],[978.0,373.0],[973.0,378.0],[956.0,377.0],[952.0,379.0],[947.0,388.0],[948.0,393.0],[955.0,402.0],[956.0,408.0],[949.0,416.0],[942.0,433.0],[942.0,437.0],[946.0,449.0],[946.0,457.0],[944.0,460.0],[919.0,538.0],[917.0,596.0],[912.0,601.0],[894.0,604.0],[895.0,620.0],[896.0,621.0],[908.0,620.0],[913.0,622.0],[916.0,626.0],[916.0,684.0],[913.0,688.0],[902.0,691.0],[887.0,685.0],[844.0,660.0],[806.0,651.0],[799.0,648.0],[657.0,637.0],[656.0,636.0],[644.0,636.0],[631.0,634.0],[619.0,634.0],[606.0,632.0],[597.0,632.0],[579.0,635.0],[572.0,638.0],[564.0,638.0],[553.0,633.0],[403.0,608.0]],[[858.0,1117.0],[866.0,1119.0],[869.0,1123.0],[872.0,1181.0],[867.0,1186.0],[861.0,1186.0],[857.0,1183.0],[849.0,1163.0],[847.0,1154.0],[845.0,1124.0],[848.0,1120.0]],[[856.0,1055.0],[862.0,1051.0],[875.0,1050.0],[880.0,1052.0],[887.0,1062.0],[898.0,1066.0],[967.0,1065.0],[978.0,1062.0],[987.0,1057.0],[996.0,1055.0],[1009.0,1055.0],[1026.0,1062.0],[1046.0,1061.0],[1050.0,1064.0],[1052.0,1071.0],[1056.0,1076.0],[1084.0,1094.0],[1125.0,1101.0],[1153.0,1112.0],[1156.0,1116.0],[1156.0,1120.0],[1152.0,1125.0],[1125.0,1132.0],[1125.0,1138.0],[1143.0,1212.0],[1150.0,1213.0],[1154.0,1216.0],[1155.0,1218.0],[1154.0,1224.0],[1151.0,1227.0],[1136.0,1233.0],[1107.0,1248.0],[1084.0,1270.0],[1071.0,1290.0],[1068.0,1293.0],[1063.0,1295.0],[1054.0,1293.0],[1031.0,1284.0],[997.0,1282.0],[988.0,1280.0],[931.0,1258.0],[886.0,1232.0],[878.0,1222.0],[876.0,1218.0],[876.0,1214.0],[879.0,1210.0],[884.0,1208.0],[908.0,1207.0],[913.0,1209.0],[921.0,1218.0],[939.0,1234.0],[942.0,1234.0],[967.0,1216.0],[968.0,1211.0],[960.0,1151.0],[958.0,1149.0],[932.0,1141.0],[927.0,1141.0],[921.0,1144.0],[907.0,1143.0],[903.0,1135.0],[903.0,1117.0],[907.0,1111.0],[906.0,1087.0],[899.0,1086.0],[884.0,1088.0],[865.0,1088.0],[853.0,1084.0],[850.0,1080.0],[850.0,1075.0]],[[739.0,921.0],[745.0,921.0],[753.0,924.0],[759.0,930.0],[762.0,938.0],[762.0,945.0],[759.0,952.0],[754.0,957.0],[745.0,960.0],[737.0,960.0],[731.0,958.0],[725.0,952.0],[722.0,945.0],[722.0,938.0],[725.0,930.0],[731.0,924.0]],[[708.0,830.0],[712.0,825.0],[722.0,820.0],[744.0,821.0],[751.0,823.0],[756.0,827.0],[757.0,841.0],[761.0,842.0],[805.0,836.0],[807.0,834.0],[815.0,810.0],[822.0,806.0],[854.0,810.0],[896.0,809.0],[910.0,811.0],[914.0,813.0],[917.0,817.0],[919.0,852.0],[925.0,881.0],[928.0,887.0],[938.0,900.0],[939.0,906.0],[936.0,910.0],[931.0,912.0],[918.0,912.0],[892.0,915.0],[884.0,921.0],[879.0,932.0],[875.0,936.0],[868.0,938.0],[852.0,947.0],[816.0,952.0],[780.0,950.0],[774.0,944.0],[774.0,936.0],[770.0,925.0],[761.0,915.0],[752.0,910.0],[747.0,909.0],[737.0,909.0],[728.0,911.0],[723.0,909.0],[717.0,903.0],[707.0,882.0]],[[617.0,802.0],[622.0,800.0],[638.0,800.0],[648.0,797.0],[675.0,799.0],[680.0,801.0],[683.0,804.0],[690.0,815.0],[690.0,872.0],[687.0,876.0],[682.0,878.0],[628.0,878.0],[621.0,874.0],[619.0,865.0],[619.0,853.0],[618.0,852.0],[605.0,853.0],[600.0,848.0],[601.0,833.0],[607.0,829.0],[615.0,827.0],[614.0,806.0]],[[806.0,732.0],[813.0,728.0],[878.0,728.0],[894.0,736.0],[899.0,741.0],[901.0,746.0],[905.0,786.0],[904.0,793.0],[897.0,797.0],[855.0,798.0],[825.0,794.0],[820.0,792.0],[817.0,788.0],[815.0,756.0],[810.0,754.0],[807.0,751.0],[805.0,746.0]],[[810.0,672.0],[813.0,668.0],[818.0,666.0],[837.0,670.0],[870.0,689.0],[874.0,694.0],[874.0,698.0],[871.0,702.0],[860.0,705.0],[827.0,706.0],[820.0,708.0],[811.0,707.0],[806.0,702.0],[807.0,696.0],[814.0,690.0],[814.0,686.0],[810.0,677.0]]]],"asphalt":[[[600,772],[612,755],[815,755],[818,800],[806,836],[757,842],[757,826],[745,821],[720,820],[708,828],[707,885],[690,885],[690,815],[680,800],[650,797],[636,800],[600,800]],[[550,772],[600,772],[600,878],[691,878],[691,897],[550,897]],[[691,885],[707,885],[714,912],[718,985],[691,985]],[[588,972],[691,968],[691,986],[588,989]],[[718,962],[762,958],[764,990],[762,1045],[747,1045],[745,992],[718,985]],[[800,708],[880,708],[905,690],[948,685],[950,800],[1000,800],[1000,815],[925,815],[905,790],[900,740],[880,728],[800,728]],[[928,1140],[960,1150],[968,1215],[940,1235],[915,1212],[925,1175]]]};
    // Grimerud G\u00e5rd map: scene, pins, legend and controls.
    // Runs inside init() in loader.js, which provides: root (the #grimerud-map element), onScreen(),
    // DATA (places, roads, disc golf from src/content) and the heavy assets
    // GROUND_SITE, GROUND_CTX, TREES, TERRAIN (heights already decoded to TERRAIN.v), FAR, FAR_IMG.
    let waveFlag = null, hillsMat = null, nightS = 0, rerenderSky = () => {};
    const snow = { value: 0 };   // 0 = summer, 1 = winter; shared by every patched material
    const M = 0.29188, S = 1792 * M, CTX_S = 1643.86816, CTX_CX = 336.24576, CTX_CZ = 37.36064;
    const P = ([x, y]) => [(x - 896) * M, (y - 896) * M];
    const INK = 0x26221d;
    // badge content: the number or letter, or a small icon for the outdoor areas (entrance arrow, ball for the lawn)
    const ICONS = {
      arrow: '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M2.5 8h10M8.5 3.8 12.8 8l-4.3 4.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      // football: the text-style soccer ball character (U+26BD with the text variation selector, so it stays monochrome)
      ball: '<span class="glyph">\u26BD\uFE0E</span>'
    };
    function numHTML(it) { return it.icon && ICONS[it.icon] ? `${ICONS[it.icon]}<span class="sr">${esc(it.n)}</span>` : esc(it.n); }
    const GROUPS = { b: ["Bygninger", "Buildings"], a: ["Ankomst og uteomr\u00e5der", "Arrival & outdoors"], o: ["Andre bygg p\u00e5 g\u00e5rden", "Other farm buildings"], d: ["Diskgolf", "Disc golf"] };
    const ITEMS = DATA.items;

    const stage = document.getElementById("gm-stage");
    const listEl = document.getElementById("gm-list");
    const pinsEl = document.getElementById("gm-pins");
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const nameHTML = it => it.no === it.en ? esc(it.no) : `${esc(it.no)} / <i>${esc(it.en)}</i>`;
    const subHTML = it => (it.sub_no ? `${esc(it.sub_no)}<i>${esc(it.sub_en)}</i>` : esc(it.sub_en || ""));

    // Legend list: a Grimerud tab (buildings, arrival, other buildings, each collapsible) and a Diskgolf tab
    const panes = { farm: document.createElement("div"), disc: document.createElement("div") };
    panes.disc.hidden = true;
    listEl.append(panes.farm, panes.disc);
    ["b", "o", "a", "d"].forEach(g => {
      const pane = g === "d" ? panes.disc : panes.farm;
      const sec = document.createElement("section"); sec.className = "grp"; pane.appendChild(sec);
      const items = document.createElement("div"); items.className = "grp-items"; items.id = "gm-grp-" + g;
      const h = document.createElement("button"); h.className = "group"; h.type = "button";
      h.setAttribute("aria-expanded", "true"); h.setAttribute("aria-controls", items.id);
      h.innerHTML = `<span>${GROUPS[g][0]} \u00b7 <i>${GROUPS[g][1]}</i></span><span class="cnt">${ITEMS.filter(it => it.g === g).length}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      h.addEventListener("click", () => { const open = h.getAttribute("aria-expanded") !== "true"; h.setAttribute("aria-expanded", open); items.hidden = !open; });
      sec.append(h, items);
      ITEMS.filter(it => it.g === g).forEach(it => {
        const b = document.createElement("button");
        b.className = "item"; b.setAttribute("aria-pressed", "false");
        const sq = it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq";
        b.innerHTML = `<span class="num${sq}">${numHTML(it)}</span><span><span class="nm">${nameHTML(it)}</span>${subHTML(it) ? `<span class="sub">${subHTML(it)}</span>` : ""}</span>`;
        b.addEventListener("click", () => select(it, true));
        items.appendChild(b); it.btn = b;
      });
    });
    const tFarm = document.getElementById("gm-tfarm"), tDisc = document.getElementById("gm-tdisc");
    function showList(disc) {
      panes.farm.hidden = disc; panes.disc.hidden = !disc;
      tFarm.setAttribute("aria-selected", !disc); tDisc.setAttribute("aria-selected", disc);
    }


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
    // Barn walls (drone video): the concrete base has a row of small square windows about every 2.2 m;
    // the red board wall above has only the odd small hatch near the eaves
    const barnBaseTex = color => canvasTex("bb" + color, 64, 64, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 90; i++) g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
      g.fillStyle = "#fffdf8"; g.fillRect(22, 14, 20, 20);
      g.fillStyle = "#3b4a52"; g.fillRect(25, 17, 14, 14);
      g.fillStyle = "#fffdf8"; g.fillRect(31, 17, 2, 14);
      g.strokeStyle = "#26221d"; g.lineWidth = 1.5; g.strokeRect(22, 14, 20, 20);
    });
    const barnUpperTex = color => canvasTex("bu" + color, 64, 64, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 64; i += 4) g.fillRect(i, 0, 1, h);
      g.fillStyle = "#f4f2ec"; g.fillRect(27, 6, 10, 9); g.fillStyle = "#3b4a52"; g.fillRect(29, 8, 6, 5);
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
    const stuccoPlain = color => canvasTex("sp" + color, 32, 32, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      g.fillStyle = "rgba(0,0,0,.06)"; for (let i = 0; i < 60; i++) g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
    });
    // Wooden shingles, for the steeple spire
    const shingleTex = color => canvasTex("sh" + color, 32, 32, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(0,0,0,.25)"; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1);
      g.fillStyle = "rgba(0,0,0,.18)"; for (let y = 0; y < h; y += 4) for (let x = (y / 4) % 2 * 3; x < w; x += 6) g.fillRect(x, y, 1, 4);
    });
    const louvreTex = color => canvasTex("lv" + color, 32, 32, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(0,0,0,.35)"; for (let y = 6; y < h - 4; y += 3) g.fillRect(5, y, w - 10, 1.4);
      g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; g.strokeRect(5, 5, w - 10, h - 9);
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
      // gravel yards and lanes as traced from the orthophotos: [outer ring, ...holes] each, corners rounded off
      const round = pts => { for (let k = 0; k < 2; k++) { const o = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; o.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } pts = o; } return pts; };
      const ASPHALT = GRAVEL /* one surface colour for every road and yard */, asphalt = (DATA.asphalt || []).map(a => round(a.map(P)).length ? a.map(P) : []);
      const gravel = (DATA.gravel || []).map(rings => rings.map(r => round(r.map(P))));
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
        const rings = rs => { g.beginPath(); rs.forEach(r => { r.forEach((p, i) => g[i ? "lineTo" : "moveTo"](...X(p))); g.closePath(); }); };
        gravel.forEach(rs => { rings(rs); g.lineWidth = 1.1 * k; g.strokeStyle = INKC; g.stroke(); });
        asphalt.forEach(a => { poly(a); g.lineWidth = 1.1 * k; g.strokeStyle = INKC; g.stroke(); });
        gravel.forEach(rs => { rings(rs); g.fillStyle = GRAVEL; g.fill("evenodd"); });
        strokeLines(0, GRAVEL, l => l.kind === "road" || l.kind === "drive");
        strokeLines(0, GRAVEL_LIGHT, l => l.kind === "path" || l.kind === "track");
        // asphalt yards and the roundabout ring, on top of the gravel lanes that run into them
        asphalt.forEach(a => { poly(a); g.fillStyle = ASPHALT; g.fill(); });
        gravel.forEach(rs => { rings(rs); g.fillStyle = GRAVEL; g.fill("evenodd"); });   // the merged surface last, over every seam
        g.lineWidth = 3.2 * k; g.strokeStyle = ASPHALT; g.beginPath(); g.arc(...X(cc), cr * M * k, 0, 6.2832); g.stroke();
        // grass island in the farmyard
        (DATA.islands || []).map(a => a.map(P)).forEach(a => { poly(a); g.fillStyle = "#6fa83c"; g.fill(); g.lineWidth = 0.7 * k; g.strokeStyle = INKC; g.stroke(); });
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
    // endBays: a fixed number of window bays on the short walls (gable ends) of a rectangular building
    function wallGeom(pts, h, y0 = 0, bay = 4.4, endBays = 0) {
      const pos = [], uv = [];
      const lens = pts.map((p, i) => Math.hypot(pts[(i + 1) % pts.length][0] - p[0], pts[(i + 1) % pts.length][1] - p[1])), longest = Math.max(...lens);
      for (let i = 0; i < pts.length; i++) {
        const [x1, z1] = pts[i], [x2, z2] = pts[(i + 1) % pts.length];
        // whole windows only: each wall gets an integer number of bays and floors, so no window is cut at a corner
        const L = lens[i], bays = endBays && L < 0.8 * longest ? endBays : Math.max(1, Math.round(L / bay)), floors = Math.max(1, Math.round((h - y0) / 2.9));
        const W = L / bays;
        if (W <= bay * 1.05) {   // close to the texture's own spacing: one quad, scaled to fit
          pos.push(x1, y0, z1, x2, y0, z2, x2, h, z2, x1, y0, z1, x2, h, z2, x1, h, z1);
          uv.push(0, 0, bays, 0, bays, floors, 0, 0, bays, floors, 0, floors);
          continue;
        }
        // Wider bays: the window keeps its normal width and only the plain wall either side of it widens,
        // so windows are never stretched. The window sits between u = WL and WR of each texture tile.
        const WL = 22 / 64, WR = 42 / 64, win = bay * (WR - WL), side = (W - win) / 2;
        const at = s => [x1 + (x2 - x1) * s / L, z1 + (z2 - z1) * s / L];
        const quad = (s1, s2, u1, u2) => { const [ax, az] = at(s1), [bx, bz] = at(s2);
          pos.push(ax, y0, az, bx, y0, bz, bx, h, bz, ax, y0, az, bx, h, bz, ax, h, az);
          uv.push(u1, 0, u2, 0, u2, floors, u1, 0, u2, floors, u1, floors); };
        for (let k = 0; k < bays; k++) {
          const s = k * W;
          quad(s, s + side, k, k + WL); quad(s + side, s + side + win, k + WL, k + WR); quad(s + side + win, s + W, k + WR, k + 1);
        }
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
      // Overhang: the eaves stick out sideways and the whole roof (ridge included) runs past each gable,
      // so the roof edge stays parallel to the gable and no gap opens under it. The eave height is set
      // so the slope passes exactly through the wall top, with no slit between wall and roof.
      const ovP = 0.45, ovA = 0.4, c = mid(m1, m2);
      const ax = [m2[0] - m1[0], m2[1] - m1[1]], al = Math.hypot(...ax); ax[0] /= al; ax[1] /= al;
      const side = p => { const s = (p[0] - c[0]) * -ax[1] + (p[1] - c[1]) * ax[0]; return s >= 0 ? 1 : -1; };
      const end = p => ((p[0] - c[0]) * ax[0] + (p[1] - c[1]) * ax[1]) >= 0 ? 1 : -1;
      const push = p => [p[0] + (-ax[1]) * side(p) * ovP + ax[0] * end(p) * ovA, p[1] + ax[0] * side(p) * ovP + ax[1] * end(p) * ovA];
      const q0 = push(p0), q1 = push(p1), q2 = push(p2), q3 = push(p3);
      const r1 = [m1[0] - ax[0] * ovA, m1[1] - ax[1] * ovA], r2 = [m2[0] + ax[0] * ovA, m2[1] + ax[1] * ovA];
      const V = (p, y) => [p[0], y, p[1]];
      const along = p => (p[0] * ax[0] + p[1] * ax[1]) / 2.2;
      const pos = [], uv = [];
      const tri = (a, b, cc) => { for (const p of [a, b, cc]) { pos.push(...p); uv.push(along([p[0], p[2]]), p[1] / 0.6); } };
      const hy = h - rise * ovP / (span / 2);
      tri(V(q0, hy), V(q1, hy), V(r1, top)); tri(V(q0, hy), V(r1, top), V(r2, top));
      tri(V(q2, hy), V(q3, hy), V(r2, top)); tri(V(q2, hy), V(r2, top), V(r1, top));
      // gable triangles reach right up under the ridge
      const ends = [...V(p1, h), ...V(p2, h), ...V(m1, top - 0.02), ...V(p3, h), ...V(p0, h), ...V(m2, top - 0.02)];
      const halves = [0, 1].map(k => geomFrom(pos.slice(k * 18, k * 18 + 18), uv.slice(k * 12, k * 12 + 12)));
      const outA = [mid(p0, p1)[0] - c[0], mid(p0, p1)[1] - c[1]], outB = [mid(p2, p3)[0] - c[0], mid(p2, p3)[1] - c[1]];
      return { roof: geomFrom(pos, uv), halves, outs: [outA, outB], ends: geomFrom(ends), top, rise, h, slopes: [[p0, p1, m2, m1], [p2, p3, m1, m2]], ridgeMid: [(m1[0] + m2[0]) / 2, (m1[1] + m2[1]) / 2], ax, ends2: [m1, m2] };
    }

    const pickables = [];
    const trimMat = toon({ color: "#fbf8f0" });
    // Dormers: small gabled windows standing on each roof slope
    function addDormers(group, g, part, ink) {
      // Each dormer's front wall stands on the slope and its body runs back into the roof
      // until its own ridge meets the main roof, so nothing floats above the tiles.
      const dWall = toon({ map: wallTex(part.wall) }), dRoof = toon({ color: part.roof });
      const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const shed = part.dormerStyle === "shed", k = part.dormerSize || 1, w = 1.6 * k * (shed ? 1.3 : 1), tf = part.dormerSize ? 0.22 : 0.3;
      g.slopes.forEach(([e0, e1, r0, r1]) => {
        const S = Math.hypot(...[0, 1].map(i => (e0[i] + e1[i]) / 2 - (r0[i] + r1[i]) / 2));
        // keep each dormer in the lower part of the slope: its ridge meets the roof about 60% of the way up
        const want = 2.4 * k, room = (0.8 - tf) * g.rise, total = Math.min(want, room);
        let hgt = total * (shed ? 0.8 : 0.62), capH = total * (shed ? 0.2 : 0.38);
        const tb = tf + total / g.rise;
        const D = (tb - tf) * S + 0.3;
        const yb = g.h + g.rise * tf - 0.15;
        const prism = (() => {
          // shed dormer: a flat lid tilting back into the roof; otherwise a little gable
          const s = new THREE.Shape(shed ? [new THREE.Vector2(-w / 2 - .2, 0), new THREE.Vector2(w / 2 + .2, 0), new THREE.Vector2(w / 2 + .2, capH), new THREE.Vector2(-w / 2 - .2, capH)]
            : [new THREE.Vector2(-w / 2 - .15, 0), new THREE.Vector2(w / 2 + .15, 0), new THREE.Vector2(0, capH)]);
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
    // Site cabin on a trailer (the trailer park, from a site photo): warm grey panels in white frames, a door with
    // a little aluminium stair on one long side, windows, its number on the end, white flat roof, twin wheels.
    // part.trailer = { door: "n"|"s"|"e"|"w", n: number }
    function trailer(part, item, group, pts, baseY, ink) {
      const t = part.trailer, H = 2.5, lift = 0.55;
      let a = 0, L = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length], l = Math.hypot(q[0] - p[0], q[1] - p[1]); if (l > L) { L = l; a = Math.atan2(q[1] - p[1], q[0] - p[0]); } });
      const c = centroid(pts), W = Math.min(...pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); }));
      const g = new THREE.Group(); g.position.set(c[0], hAt(...c) - baseY, c[1]); g.rotation.y = -a; group.add(g);
      // which long side carries the door: the one whose outward normal points most toward the asked compass side
      const want = { e: [1, 0], w: [-1, 0], s: [0, 1], n: [0, -1] }[t.door || "s"];
      const nz = [Math.sin(a), Math.cos(a)];          // local +z in world (x, z)
      const doorSide = (nz[0] * want[0] + nz[1] * want[1]) >= 0 ? 1 : -1;
      const GREY = "#9f9d97", WHITE = "#f4f3ef";
      const side = (withDoor) => canvasTex("trailer-side" + (withDoor ? "d" : "") + (t.flip ? "f" : ""), 256, 64, (g2, w, h) => {
        g2.fillStyle = GREY; g2.fillRect(0, 0, w, h);
        g2.fillStyle = "rgba(0,0,0,.06)"; for (let x = 0; x < w; x += 16) g2.fillRect(x, 0, 1, h);
        g2.fillStyle = WHITE; g2.fillRect(0, 0, w, 4); g2.fillRect(0, h - 3, w, 3); g2.fillRect(0, 0, 4, h); g2.fillRect(w - 4, 0, 4, h);
        const win = (x, y, ww, hh) => { g2.fillStyle = WHITE; g2.fillRect(x, y, ww, hh); g2.fillStyle = "#3b4a52"; g2.fillRect(x + 3, y + 3, ww - 6, hh - 6); g2.fillStyle = "rgba(255,200,120,.35)"; g2.fillRect(x + 3, y + 3, ww - 6, (hh - 6) / 2); };
        win(28, 18, 40, 24); win(132, 18, 22, 32);
        if (withDoor) { g2.fillStyle = "#b7b5ae"; g2.fillRect(176, 10, 30, 52); g2.strokeStyle = WHITE; g2.lineWidth = 2; g2.strokeRect(176, 10, 30, 52); g2.fillStyle = "#e9e7e1"; g2.fillRect(182, 24, 12, 8); g2.fillStyle = "#444"; g2.fillRect(200, 36, 3, 4); }
        else win(190, 18, 40, 24);
      });
      const end = (num) => canvasTex("trailer-end" + num, 64, 64, (g2, w, h) => {
        g2.fillStyle = GREY; g2.fillRect(0, 0, w, h);
        g2.fillStyle = WHITE; g2.fillRect(0, 0, w, 4); g2.fillRect(0, h - 3, w, 3); g2.fillRect(0, 0, 4, h); g2.fillRect(w - 4, 0, 4, h);
        g2.fillStyle = "#1c1c1c"; g2.font = "bold 22px sans-serif"; g2.textAlign = "center"; g2.fillText(String(num), w / 2, 40);
      });
      const sideD = toon({ map: side(true) }), sideP = toon({ map: side(false) }), endM = toon({ map: end(t.n || "") }), roofM = toon({ color: WHITE });
      // BoxGeometry material order: +x, -x, +y, -y, +z, -z
      const box = new THREE.Mesh(new THREE.BoxGeometry(L - 0.2, H, W - 0.3), [endM, endM, roofM, roofM, doorSide > 0 ? sideD : sideP, doorSide > 0 ? sideP : sideD]);
      box.position.y = lift + H / 2; g.add(box); addInk(box.geometry, box, 25, ink);
      // the long-side texture reads left to right from outside, so mirror the far side
      if (doorSide < 0) { const m = sideD.map.clone(); m.needsUpdate = true; m.repeat.x = -1; m.offset.x = 1; box.material[5] = toon({ map: m }); }
      // chassis and twin wheels
      const dark = toon({ color: "#2b2b2b" });
      const ch = new THREE.Mesh(new THREE.BoxGeometry(L * 0.8, 0.18, W - 0.8), toon({ color: "#55534f" })); ch.position.y = lift - 0.1; g.add(ch);
      [-0.45, 0.45].forEach(dx => [-1, 1].forEach(sz => {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.22, 12), dark); wh.rotation.x = Math.PI / 2;
        wh.position.set(dx, 0.33, sz * (W / 2 - 0.55)); g.add(wh);
      }));
      // little stair under the door
      const sx = (L - 0.2) * (191 / 256 - 0.5), st = new THREE.Group(); st.position.set(sx, 0, doorSide * (W / 2 - 0.15)); g.add(st);
      const al = toon({ color: "#c9c8c3" });
      for (let k = 0; k < 3; k++) { const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.28), al); s1.position.set(0, 0.18 + k * 0.18, doorSide * (0.75 - k * 0.24)); st.add(s1); }
      const top = lift + H + 0.05, roofTop = top;
      if (item) group.traverse(o => { if (o.isMesh) { o.userData.item = item; pickables.push(o); } });
      const c0 = centroid(pts);
      const halo = pts.map(([x, z]) => { const dx = x - c0[0], dz = z - c0[1], l = Math.hypot(dx, dz) || 1; return [x + dx / l * 2.2, z + dz / l * 2.2]; });
      const hl = drape(halo, { fill: "rgba(201,69,47,.45)", stroke: "#c9452f", strokeW: 0.5, dy: 0.45, order: 2 }); hl.visible = false;
      return { pts, top, roofTop, ink, hl, baseY };
    }
    function building(part, item) {
      const group = new THREE.Group(); scene.add(group);
      const pts = part.p.map(P);
      const baseY = Math.min(...pts.map(([x, z]) => hAt(x, z))) - 0.05; group.position.y = baseY;
      const ink = item ? new THREE.LineBasicMaterial({ color: INK }) : inkMat;
      if (part.trailer) return trailer(part, item, group, pts, baseY, ink);
      const wallMat = part.tent ? toon({ color: part.wall }) : toon({ map: part.barn ? barnUpperTex(part.wall) : part.plain ? boardTex(part.wall) : part.stucco ? stuccoTex(part.wall) : wallTex(part.wall) });
      const y0 = part.base ? part.base[0] : 0;
      const mats = [wallMat];
      const walls = new THREE.Mesh(wallGeom(pts, part.h, y0, part.barn ? 16 : part.bay || 4.4, part.endBays), wallMat); group.add(walls); addInk(walls.geometry, group, 25, ink);
      // skin: a stretch of the building with walls of its own colour, laid just outside the main walls
      (part.skin || []).forEach(sk => {
        const sp = sk.p.map(P), c = centroid(sp), out = sp.map(([x, z]) => { const dx = x - c[0], dz = z - c[1]; return [x + Math.sign(dx) * 0.04, z + Math.sign(dz) * 0.04]; });
        const m = new THREE.Mesh(wallGeom(out, part.h, y0, part.bay || 4.4), toon({ map: sk.plain ? boardTex(sk.wall) : sk.stucco ? stuccoTex(sk.wall) : wallTex(sk.wall) }));
        group.add(m); addInk(m.geometry, group, 25, ink); mats.push(m.material);
      });
      if (part.base) {
        const bw = new THREE.Mesh(wallGeom(pts, y0, 0, part.base[2] === "barn" ? 2.2 : 4.4), toon({ map: part.base[2] === "barn" ? barnBaseTex(part.base[1]) : part.base[2] === "plain" ? boardTex(part.base[1]) : part.base[2] === "stone" ? stuccoTex(part.base[1]) : wallTex(part.base[1]) }));
        group.add(bw); addInk(bw.geometry, group, 25, ink);
      }
      // white corner boards, as on the painted wooden houses
      if (!part.tent && part.trim !== false) pts.forEach(([x, z]) => {
        // stop the board just under the eave so it never pokes through the roof
        const top = part.h - (part.flat ? 0.05 : 0.32), hb = top - y0;
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, hb, 0.3), trimMat);
        b.position.set(x, y0 + hb / 2, z); group.add(b);
      });
      let top = part.h, ridge = null, gAx = [1, 0];
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
        mats.push(endMat);
        // gables: {s: colour}: the gable facing that way gets its own colour (stucco, like a skin below it)
        if (part.gables) Object.entries(part.gables).forEach(([f, col]) => {
          const dir = { s: [0, 1], n: [0, -1], e: [1, 0], w: [-1, 0] }[f], c = centroid(pts);
          g.ends2.forEach((m, k) => {
            if ((m[0] - c[0]) * dir[0] + (m[1] - c[1]) * dir[1] <= 0) return;
            const a = k ? pts.find(() => 0) : null;
            const pos = g.ends.attributes.position.array.slice(k * 9, k * 9 + 9);
            // nudge it outward so it sits on top of the shared gable
            for (let i = 0; i < 9; i += 3) { pos[i] += dir[0] * 0.05; pos[i + 2] += dir[1] * 0.05; }
            const gm = new THREE.Mesh(geomFrom(Array.from(pos)), toon({ color: col })); group.add(gm); mats.push(gm.material);
          });
        });
        // skylights: {n: count}: glazed roof windows lying on the slope facing that way
        if (part.skylights) Object.entries(part.skylights).forEach(([f, n]) => {
          const dir = { s: [0, 1], n: [0, -1], e: [1, 0], w: [-1, 0] }[f];
          g.slopes.forEach(([e0, e1, r0, r1], k) => {
            const o = g.outs[k]; if (o[0] * dir[0] + o[1] * dir[1] <= 0) return;
            const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
            const glass = toon({ color: "#2f3e4c" }), frame = toon({ color: "#e9e6de" });
            for (let i = 0; i < n; i++) {
              const t = 0.15 + 0.7 * (n > 1 ? i / (n - 1) : 0.5);
              const e = lerp(e0, e1, t), r = lerp(r0, r1, t), c = lerp(e, r, 0.55);
              const yy = g.h + g.rise * 0.55 + 0.08;
              const out = [e[0] - r[0], e[1] - r[1]], run = Math.hypot(...out);
              const sw = new THREE.Group(); sw.position.set(c[0], yy, c[1]); sw.rotation.y = Math.atan2(out[0], out[1]);
              const tilt = new THREE.Group(); tilt.rotation.x = Math.atan2(g.rise, run); sw.add(tilt);
              const fr = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.1, 1.3), frame); tilt.add(fr);
              const gl = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 1.1), glass); tilt.add(gl);
              group.add(sw);
            }
          });
        });
        top = g.top; ridge = g.ridgeMid; gAx = g.ax;
        if (part.dormers) addDormers(group, g, part, ink);
        if (part.chimneys) part.chimneys.forEach(cp => {
          const [x, z] = P(cp), hgt = g.top - part.h + 1.6;
          const ch = new THREE.Mesh(new THREE.BoxGeometry(0.9, hgt, 0.9), toon(part.chimneyColor ? { map: stuccoPlain(part.chimneyColor) } : { color: "#a5452e" }));
          ch.position.set(x, part.h + hgt / 2 + 0.3, z); group.add(ch); addInk(ch.geometry, ch, 25, ink);
          const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.1), toon({ color: "#5a5652" }));
          cap.position.set(x, part.h + hgt + 0.4, z); group.add(cap);
        });
      } else {
        const fg = flatRoof(pts, part.h);
        let rmat = { color: part.roof };
        if (part.stripes) {
          // ribbed sheet roof: darker bands across the building every `stripes` metres, square to its longest wall
          let best = [1, 0], bl = 0; pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L > bl) { bl = L; best = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]; } });
          // start at the end wall and fit a whole number of panels, so both ends finish on a full panel
          const p = fg.attributes.position, uv = [], pr = i => p.getX(i) * best[0] + p.getZ(i) * best[1];
          let lo = Infinity, hi = -Infinity; for (let i = 0; i < p.count; i++) { lo = Math.min(lo, pr(i)); hi = Math.max(hi, pr(i)); }
          const sp = (hi - lo) / Math.max(1, Math.round((hi - lo) / part.stripes));
          for (let i = 0; i < p.count; i++) uv.push((pr(i) - lo) / sp + 0.33, 0.5);
          fg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
          rmat = { map: canvasTex("stripes" + part.roof, 32, 4, (g, w, h) => {
            g.fillStyle = part.roof; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(60,64,70,.38)"; g.fillRect(0, 0, 9, h); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(9, 0, 2, h);
          }) };
        }
        const roof = new THREE.Mesh(fg, toon(rmat));
        group.add(roof); addInk(roof.geometry, group, 25, ink);
      }
      if (part.porch) {
        // front entrance: dark canopy over a glazed double door, with a low step.
        // Built facing +x, then turned to face the side named in porch[2] (w, e, s, n).
        const [x, z] = P(part.porch), side = part.porch[2] || "e";
        const ent = new THREE.Group(); ent.position.set(x, Math.max(0, hAt(x, z) - baseY - 0.1), z); ent.rotation.y = wallRot(pts, side); group.add(ent);  // on sloping ground the door sits at its own ground level
        const dir = 1;
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 1.7), toon({ map: canvasTex("door", 32, 48, (g, w, h) => {
          g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, w, h); g.fillStyle = "#3b4a52";
          for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) g.fillRect(4 + i * 13, 4 + j * 11, 11, 9);
          g.strokeStyle = "#26221d"; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
        }) }));
        door.position.set(dir * 0.07, 1.25, 0); ent.add(door);
        if (part.porch[3] === "gable") {
          // porch box (built facing +x): white walls, door in the front, tiled gable roof running out from the wall
          const PW = 2.6, PD = 2.2, PH = 2.6, white = toon({ map: stuccoPlain("#f6f4ee") });
          const box = new THREE.Mesh(new THREE.BoxGeometry(PD, PH, PW), white); box.position.set(PD / 2, PH / 2, 0); ent.add(box); addInk(box.geometry, box, 25, ink);
          door.position.set(PD + 0.07, 1.2, 0); door.scale.set(1, 0.95, 0.7);
          const pr = new THREE.Shape([new THREE.Vector2(-PW / 2 - 0.3, 0), new THREE.Vector2(PW / 2 + 0.3, 0), new THREE.Vector2(0, 1.3)]);
          const roofG = new THREE.ExtrudeGeometry(pr, { depth: PD + 0.4, bevelEnabled: false });
          const rf = new THREE.Mesh(roofG, toon({ map: roofTex(part.roof) })); rf.rotation.y = Math.PI / 2; rf.position.set(0, PH, 0); ent.add(rf); addInk(roofG, rf, 25, ink);
          const gt = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-PW / 2, 0), new THREE.Vector2(PW / 2, 0), new THREE.Vector2(0, 1.15)])), toon({ color: "#f6f4ee" }));
          gt.rotation.y = Math.PI / 2; gt.position.set(PD + 0.01, PH, 0); ent.add(gt);
        }
        const plainDoor = part.porch[3] === "plain";
        if (plainDoor) door.material = toon({ color: "#24211f" });
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.8, 4, 1), toon({ color: "#23304a" }));
        canopy.visible = !plainDoor && part.porch[3] !== "gable";
        canopy.rotation.y = Math.PI / 4; canopy.scale.set(0.75, 1, 1.1);
        canopy.position.set(dir * 0.75, 2.95, 0); ent.add(canopy); addInk(canopy.geometry, canopy, 25, ink);
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 3.2), toon({ color: "#d4cec2" }));
        step.position.set(dir * 0.7 + (part.porch[3] === "gable" ? 2.2 : 0), 0.15, 0); ent.add(step); addInk(step.geometry, step, 25, ink);
      }
      // facade: one wall drawn from a photo \u2014 its own windows (metres from the left corner seen from outside, and up from
      // the ground), a grey plinth with cellar windows, and a board-clad gable above with its own windows
      if (part.facade) {
        const fc = part.facade, want = { e: [1, 0], w: [-1, 0], s: [0, 1], n: [0, -1] }[fc.side], c0 = centroid(pts);
        let ei = 0, bd = -2;
        pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          let nx = (b[1] - a[1]) / L, nz = -(b[0] - a[0]) / L;
          if (nx * ((a[0] + b[0]) / 2 - c0[0]) + nz * ((a[1] + b[1]) / 2 - c0[1]) < 0) { nx = -nx; nz = -nz; }
          const d = nx * want[0] + nz * want[1]; if (d > bd) { bd = d; ei = i; } });
        let A = pts[ei], B = pts[(ei + 1) % pts.length];
        const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
        let nx = (B[1] - A[1]) / L, nz = -(B[0] - A[0]) / L;
        if (nx * ((A[0] + B[0]) / 2 - c0[0]) + nz * ((A[1] + B[1]) / 2 - c0[1]) < 0) { nx = -nx; nz = -nz; }
        if ((B[0] - A[0]) * nz - (B[1] - A[1]) * nx < 0) [A, B] = [B, A];      // A = left corner as seen from outside
        const ux = (B[0] - A[0]) / L, uz = (B[1] - A[1]) / L, H = part.h, o = 0.07;
        const at = (s, y, off) => [A[0] + ux * s + nx * off, y, A[1] + uz * s + nz * off];
        const PX = 48;  // canvas px per metre
        const win = (g, x0, y0, w, h, Hc, kind) => {
          const X = x0 * PX, Y = Hc - (y0 + h) * PX, W = w * PX, Hh = h * PX;
          g.fillStyle = "#fbf8f0"; g.fillRect(X, Y, W, Hh);
          g.fillStyle = "#3b4a52"; g.fillRect(X + 4, Y + 4, W - 8, Hh - 8);
          g.fillStyle = "#fbf8f0";
          const cols = kind === "cellar" ? 2 : 2; for (let k = 1; k < cols; k++) g.fillRect(X + W * k / cols - 2, Y, 4, Hh);
          if (kind !== "cellar") { g.fillRect(X, Y + Hh * 0.36, W, 3); if (h > 1.4) g.fillRect(X, Y + Hh * 0.68, W, 3); }
          g.strokeStyle = "#26221d"; g.lineWidth = 2.5; g.strokeRect(X, Y, W, Hh);
          if (kind === "juliet") {   // French balcony: black wrought railing over the lower part of the window
            const top = Y + Hh * 0.62, bot = Y + Hh + 2; g.strokeStyle = "#1f1c1a"; g.lineWidth = 3;
            g.strokeRect(X - 3, top, W + 6, bot - top); g.lineWidth = 2;
            for (let xx = X + 6; xx < X + W; xx += 9) { g.beginPath(); g.moveTo(xx, top); g.lineTo(xx, bot); g.stroke(); }
            g.beginPath(); g.moveTo(X, (top + bot) / 2); g.lineTo(X + W, (top + bot) / 2); g.stroke();
          }
        };
        const Wc = Math.round(L * PX), Hc = Math.round(H * PX);
        const wt = canvasTex("facade" + item.n + fc.side, Wc, Hc, (g, w, h) => {
          g.fillStyle = fc.wall; g.fillRect(0, 0, w, h);
          let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
          g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < w * h / 90; i++) g.fillRect(rnd() * w, rnd() * h, 2, 2);
          if (fc.base) { g.fillStyle = fc.base[1]; g.fillRect(0, h - fc.base[0] * PX, w, fc.base[0] * PX); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, h - fc.base[0] * PX, w, 2); }
          (fc.win || []).forEach(([x0, y0, ww, hh, kind]) => win(g, x0, y0, ww, hh, h, kind));
          // gutter downpipes at the corners
          g.fillStyle = "#2b2a29"; g.fillRect(6, 0, 5, h); g.fillRect(w - 11, 0, 5, h);
        });
        wt.wrapS = wt.wrapT = THREE.ClampToEdgeWrapping;
        const a0 = at(0, 0, o), a1 = at(L, 0, o), a2 = at(L, H, o), a3 = at(0, H, o);
        const fm = new THREE.Mesh(geomFrom([...a0, ...a1, ...a2, ...a0, ...a2, ...a3], [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]), toon({ map: wt }));
        group.add(fm); mats.push(fm.material);
        if (fc.gable && top > H + 0.5) {
          const R = top - H, gc = fc.gable, Gc = Math.round(R * PX);
          const gt = canvasTex("gable" + item.n + fc.side, Wc, Gc, (g, w, h) => {
            g.fillStyle = gc.color; g.fillRect(0, 0, w, h);
            g.fillStyle = "rgba(0,0,0,.09)"; for (let x = 0; x < w; x += 12) g.fillRect(x, 0, 2, h);     // vertical boards
            g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, h - 4, w, 4);
            (gc.win || []).forEach(([x0, y0, ww, hh]) => win(g, x0, y0, ww, hh, h));
          });
          gt.wrapS = gt.wrapT = THREE.ClampToEdgeWrapping;
          const b0 = at(0, H, o + 0.02), b1 = at(L, H, o + 0.02), b2 = at(L / 2, top - 0.05, o + 0.02);
          const gm = new THREE.Mesh(geomFrom([...b0, ...b1, ...b2], [0, 0, 1, 0, 0.5, 1]), toon({ map: gt }));
          group.add(gm); mats.push(gm.material);
          // the white skirt board where the cladding meets the render
          const sk = new THREE.Mesh(new THREE.BoxGeometry(L + 0.3, 0.16, 0.12), trimMat);
          sk.position.set(...at(L / 2, H + 0.02, o + 0.04)); sk.rotation.y = -Math.atan2(uz, ux); group.add(sk);
        }
      }
      // stoop: a gabled porch roof on white posts over a raised landing, with concrete steps and black railings
      // [x, z, side, landing height]
      if (part.stoop) {
        const [x, z] = P(part.stoop), side = part.stoop[2] || "s", LH = part.stoop[3] || 1.2;
        const ent = new THREE.Group(); ent.position.set(x, Math.max(0, hAt(x, z) - baseY - 0.1), z); ent.rotation.y = wallRot(pts, side); group.add(ent);
        const add = (geo, mat, px, py, pz, inkIt = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); ent.add(m); if (inkIt) addInk(geo, m, 25, ink); return m; };
        const conc = toon({ color: "#a9a49b" }), white = toon({ color: "#f8f6f0" });
        const LD = 1.7, SW = 3.0, n = 6, r = LH / n, tr = 0.32;
        add(new THREE.BoxGeometry(LD, LH, SW), conc, LD / 2, LH / 2, 0);
        for (let k = 0; k < n - 1; k++) { const d = (n - 1 - k) * tr; add(new THREE.BoxGeometry(d, r, SW - 0.3), conc, LD + d / 2, k * r + r / 2, 0); }
        // glazed double door
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.3, 1.6), toon({ map: canvasTex("door2", 32, 48, (g, w, h) => {
          g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, w, h); g.fillStyle = "#3b4a52"; g.fillRect(3, 3, 12, 40); g.fillRect(17, 3, 12, 40);
          g.strokeStyle = "#26221d"; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
        }) }));
        door.position.set(0.07, LH + 1.15, 0); ent.add(door);
        // posts, roof and front gable (an 'open' stoop is just the landing, door and steps)
        if (part.stoop[4] !== "open") {
        const PH = 2.5, RW = 3.3, RD = LD + 0.35;
        [[LD - 0.12, -SW / 2 + 0.15], [LD - 0.12, SW / 2 - 0.15]].forEach(([px, pz]) => add(new THREE.BoxGeometry(0.16, PH, 0.16), white, px, LH + PH / 2, pz));
        const pr = new THREE.Shape([new THREE.Vector2(-RW / 2, 0), new THREE.Vector2(RW / 2, 0), new THREE.Vector2(0, 1.25)]);
        const roofG = new THREE.ExtrudeGeometry(pr, { depth: RD, bevelEnabled: false });
        const rf = new THREE.Mesh(roofG, toon({ map: roofTex(part.roof) })); rf.rotation.y = Math.PI / 2; rf.position.set(0, LH + PH, 0); ent.add(rf); addInk(roofG, rf, 25, ink);
        const tri = new THREE.Shape([new THREE.Vector2(-RW / 2 + 0.25, 0.08), new THREE.Vector2(RW / 2 - 0.25, 0.08), new THREE.Vector2(0, 1.05)]);
        const gt = new THREE.Mesh(new THREE.ShapeGeometry(tri), white); gt.rotation.y = Math.PI / 2; gt.position.set(RD + 0.01, LH + PH, 0); ent.add(gt);
        add(new THREE.BoxGeometry(0.14, 0.2, RW - 0.3), white, LD - 0.12, LH + PH - 0.1, 0);   // beam across the posts
        }
        // railings down both sides of the steps, black balusters under a white handrail
        const segs = [], foot = LD + (n - 1) * tr;
        [-1, 1].forEach(sg => {
          const zz = sg * (SW / 2 - 0.2), y1 = LH + 0.9, y2 = 0.9;
          segs.push(new THREE.Vector3(LD - 0.1, y1, zz), new THREE.Vector3(foot, y2, zz));
          for (let t = 0; t <= 1.0001; t += 1 / 8) { const xx = LD - 0.1 + (foot - LD + 0.1) * t, yt = y1 + (y2 - y1) * t, yb = LH - (LH - r) * t - 0.02; segs.push(new THREE.Vector3(xx, Math.max(yb, r), zz), new THREE.Vector3(xx, yt, zz)); }
          const hr = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(foot - LD + 0.1, y1 - y2), 0.08, 0.08), white);
          hr.position.set((LD - 0.1 + foot) / 2, (y1 + y2) / 2 + 0.04, zz); hr.rotation.z = -Math.atan2(y1 - y2, foot - LD + 0.1); ent.add(hr);
        });
        ent.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), new THREE.LineBasicMaterial({ color: "#1f1c1a" })));
      }
      // ramp: a smooth concrete driveway from the ground up to a floor of the building, with low walls along both sides
      // [x0, z0 (low end), x1, z1 (top, at the wall), width m, rise m]
      if (part.ramp) {
        const [ax, az, bx, bz, W, R] = part.ramp, A = P([ax, az]), Bp = P([bx, bz]);
        const L = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), ya = hAt(...A) - baseY;
        const rg = new THREE.Group(); rg.position.set(A[0], ya - 0.05, A[1]); rg.rotation.y = Math.atan2(-(Bp[1] - A[1]), Bp[0] - A[0]); group.add(rg);
        const conc = toon({ color: "#bdb9af" }), wallC = toon({ color: "#a9a59b" });
        const side = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(L, 0), new THREE.Vector2(L, R), new THREE.Vector2(0, 0.05)]);
        const deck = new THREE.ExtrudeGeometry(side, { depth: W, bevelEnabled: false }); deck.translate(0, 0, -W / 2);
        const dm = new THREE.Mesh(deck, conc); rg.add(dm); addInk(deck, dm, 25, ink);
        [-1, 1].forEach(sg => {
          const ws = new THREE.Shape([new THREE.Vector2(0, 0.05), new THREE.Vector2(L, R), new THREE.Vector2(L, R + 0.9), new THREE.Vector2(0, 0.95)]);
          const wg = new THREE.ExtrudeGeometry(ws, { depth: 0.25, bevelEnabled: false }); wg.translate(0, 0, sg > 0 ? W / 2 - 0.25 : -W / 2);
          const wm = new THREE.Mesh(wg, wallC); rg.add(wm); addInk(wg, wm, 25, ink);
        });
      }
      // picnic tables on the ground near the building: [x, z] each, set square to the building
      if (part.tables) {
        const wood = toon({ color: "#c19560" }), [ax, az] = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]], ry = -Math.atan2(az, ax);
        part.tables.forEach(tp => {
          const [x, z] = P(tp), t = new THREE.Group(); t.position.set(x, hAt(x, z) - baseY - 0.02, z); t.rotation.y = ry; group.add(t);
          const add = (geo, px, py, pz) => { const m = new THREE.Mesh(geo, wood); m.position.set(px, py, pz); t.add(m); addInk(geo, m, 25, ink); };
          add(new THREE.BoxGeometry(1.9, 0.07, 0.75), 0, 0.76, 0);
          add(new THREE.BoxGeometry(1.9, 0.06, 0.28), 0, 0.45, 0.62); add(new THREE.BoxGeometry(1.9, 0.06, 0.28), 0, 0.45, -0.62);
          [-0.7, 0.7].forEach(px => add(new THREE.BoxGeometry(0.08, 0.76, 1.5), px, 0.38, 0));
        });
      }
      if (part.garage) part.garage.forEach(([px, pz, side, w, hgt, style]) => {
        // roller door: grey ribbed panel in a white frame, set just proud of the wall; "wood": glazed wooden double doors
        const [x, z] = P([px, pz]), rot = wallRot(pts, side || "s");
        const ent = new THREE.Group(); ent.position.set(x, Math.max(0, hAt(x, z) - baseY - 0.1), z); ent.rotation.y = rot; group.add(ent);
        const tex = style === "wood" ? canvasTex("wooddoor", 64, 64, (g, W, H) => {
          g.fillStyle = "#6b3f22"; g.fillRect(0, 0, W, H);
          g.fillStyle = "#2f3a40"; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) g.fillRect(7 + i * 30 + (i ? 0 : 0), 6 + j * 26, 20, 20);
          g.fillStyle = "#4e2c17"; g.fillRect(W / 2 - 1.5, 0, 3, H);
          g.strokeStyle = "#26221d"; g.lineWidth = 2; g.strokeRect(1, 1, W - 2, H - 2);
        }) : canvasTex("garage", 64, 64, (g, W, H) => {
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
          const k = bc.at != null ? bc.at : (i + 0.5) / n, bg = new THREE.Group();  // at: fraction along the edge, for a single balcony off-centre
          bg.position.set(a[0] + ex * k, 0, a[1] + ez * k); bg.rotation.y = -Math.atan2(ez, ex);
          const W = bc.w || Math.min(3, L / n - 0.6), D = 1.4;
          // upper balcony: slab plus solid board railing
          const slab = new THREE.Mesh(new THREE.BoxGeometry(W, 0.2, D), bm); slab.position.set(0, y, side * D / 2);
          const front = new THREE.Mesh(new THREE.BoxGeometry(W, 1.0, 0.1), bm); front.position.set(0, y + 0.6, side * D);
          const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, D), bm); s1.position.set(-W / 2, y + 0.6, side * D / 2);
          const s2 = s1.clone(); s2.position.x = W / 2;
          // ground-floor terrace with a low railing
          const deck = new THREE.Mesh(new THREE.BoxGeometry(W, 0.35, D + 0.3), bm); deck.position.set(0, 0.17, side * (D + 0.3) / 2);
          const rail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.8, 0.1), bm); rail.position.set(0, 0.75, side * (D + 0.3));
          if (bc.rail) {
            // open railing: thin top rail and posts, the wall showing through
            [front, s1, s2].forEach(m => { m.scale.y = 0.08; m.position.y = y + 1.05; });
            const bars = [];
            const bar = (x0, z0) => bars.push(new THREE.Vector3(x0, y + 0.1, z0), new THREE.Vector3(x0, y + 1.05, z0));
            for (let x = -W / 2; x <= W / 2 + 1e-6; x += 0.25) bar(x, side * D);
            for (let zz = 0.25; zz < D; zz += 0.25) { bar(-W / 2, side * zz); bar(W / 2, side * zz); }
            bg.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(bars), new THREE.LineBasicMaterial({ color: color || "#26221d" })));
          }
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
      const roofTop = top;
      if (part.steeple && ridge) {
        // ridge turret: louvred box astride the ridge, open belfry on four posts, tall shingled spire with a flared foot
        const sp = Array.isArray(part.steeple) ? P(part.steeple) : ridge, ax = gAx;
        const st = new THREE.Group(); st.position.set(sp[0], top, sp[1]); st.rotation.y = -Math.atan2(ax[1], ax[0]); group.add(st);
        const wood = toon({ map: shingleTex("#6b4e36") }), post = toon({ color: "#4a3626" });
        const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); st.add(m); addInk(geo, m, 25, ink); return m; };
        add(new THREE.BoxGeometry(1.9, 2.0, 1.9), toon({ map: louvreTex("#8f9a83") }), 0, -0.1, 0);       // louvred base, half sunk in the roof
        add(new THREE.BoxGeometry(2.1, 0.15, 2.1), post, 0, 0.95, 0);
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => add(new THREE.BoxGeometry(0.18, 1.3, 0.18), post, a * 0.8, 1.65, b * 0.8));
        add(new THREE.CylinderGeometry(0.22, 0.42, 0.6, 8), toon({ color: "#7a5a2a" }), 0, 1.6, 0);          // bell
        const skirt = add(new THREE.ConeGeometry(1.75, 0.7, 4, 1, true), wood, 0, 2.55, 0); skirt.rotation.y = Math.PI / 4;
        const spire = add(new THREE.ConeGeometry(0.95, 6.2, 4), wood, 0, 5.4, 0); spire.rotation.y = Math.PI / 4;
        add(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 5), post, 0, 8.9, 0);
        top += 9.3;   // steeple; the pin still sits on the roof (roofTop)
      }
      if (item) group.traverse(o => { if (o.isMesh) { o.userData.item = item; pickables.push(o); } });
      // ground halo shown when the building is selected
      const c0 = centroid(pts);
      const halo = pts.map(([x, z]) => { const dx = x - c0[0], dz = z - c0[1], l = Math.hypot(dx, dz) || 1; return [x + dx / l * 2.2, z + dz / l * 2.2]; });
      const hl = drape(halo, { fill: "rgba(201,69,47,.45)", stroke: "#c9452f", strokeW: 0.5, dy: 0.45, order: 2 }); hl.visible = false;
      return { pts, top, roofTop, ink, hl, baseY };
    }
    DATA.context.forEach(p => building(p, null));

    // Turn for a door on the wall facing roughly n/s/e/w: the wall's own outward direction, so doors sit flush
    // on buildings that are not square to the map (+x faces east at 0, +z is south)
    function wallRot(pts, side) {
      const want = { e: [1, 0], w: [-1, 0], s: [0, 1], n: [0, -1] }[side], c = centroid(pts);
      let best = null, bd = -2;
      pts.forEach((a, i) => {
        const b = pts[(i + 1) % pts.length], ex = b[0] - a[0], ez = b[1] - a[1], L = Math.hypot(ex, ez);
        let nx = ez / L, nz = -ex / L;
        if (nx * ((a[0] + b[0]) / 2 - c[0]) + nz * ((a[1] + b[1]) / 2 - c[1]) < 0) { nx = -nx; nz = -nz; }
        const d = nx * want[0] + nz * want[1]; if (d > bd) { bd = d; best = [nx, nz]; }
      });
      return Math.atan2(-best[1], best[0]);
    }
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
        it.h = Math.max(...it.objs.map(o => o.roofTop));
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
      pin.innerHTML = `<span class="num${sq}">${numHTML(it)}</span><span class="lbl"><b>${esc(it.no)}</b>${it.no !== it.en ? `<i>${esc(it.en)}</i>` : ""}</span>`;
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
      flag.material.userData.noSnow = true;   // the flag keeps its colours in winter
      const fp = flag.geometry.attributes.position;
      const base = Float32Array.from(fp.array);
      waveFlag = t => { for (let i = 0; i < fp.count; i++) { const px = base[i * 3]; fp.setZ(i, Math.sin(px * 2.2 - t * 0.004) * 0.18 * (px + 1.3)); } fp.needsUpdate = true; };
    })();

    // Trees: lollipop broadleaves and spruce cones, with drawn outlines
    (() => {
      const leaf = ["#5b9a33", "#4c8a2f", "#6ea83c", "#3f7a2a", "#78b046"].map(c => new THREE.Color(c));
      const pine = ["#2f5d2a", "#386a30", "#2a5426"].map(c => new THREE.Color(c));
      const extra = (DATA.island_trees || []).map(([x, z, r]) => { const w = P([x, z]); return [w[0], w[1], r, 0, 1]; });
      const all = TREES.site.map(t => [...t, 1]).concat(extra).concat(TREES.ctx.map(t => [...t, 0]));
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
        mDisc.setAttribute("aria-pressed", on); mFarm.setAttribute("aria-pressed", !on); showList(on);
        ITEMS.forEach(it => it.pinEl.classList.toggle(it.g === "d" ? "dg-off" : "farm-off", it.g === "d" ? !on : on));
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
    tDisc.addEventListener("click", () => setDisc(true, true));
    tFarm.addEventListener("click", () => setDisc(false, true));

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
      hideHint();
      root.querySelector(".panel").classList.remove("open");
      styleItem(it, true);
      const cn = document.getElementById("gm-cnum"); cn.innerHTML = numHTML(it); cn.className = "num" + (it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq");
      setDisc(it.g === "d");   // a building chosen from search while on the disc golf map switches back
      document.getElementById("gm-cname").innerHTML = nameHTML(it);
      document.getElementById("gm-cdesc").innerHTML = subHTML(it);
      card.hidden = false;
      if (fly) focusOn(it);
      // open the group holding it, if collapsed
      if (it.btn) { const items = it.btn.parentElement; if (items.hidden) items.previousElementSibling.click(); }
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
    const HOME = { t: new THREE.Vector3(-40, 0, 25), d: 400, polar: 1.17, az: Math.PI / 2 };   // looking west: west is up
    const TOP = { t: new THREE.Vector3(10, 0, 40), d: 520, polar: 0.001, az: Math.PI / 2 };      // west up, like the opening view
    const TOP_DISC = { t: new THREE.Vector3(330, 0, -170), d: 1250, polar: 0.001, az: -Math.PI / 2 };
    let anim = null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const posFrom = (t, d, polar, az) => new THREE.Vector3(t.x + d * Math.sin(polar) * Math.sin(az), t.y + d * Math.cos(polar), t.z + d * Math.sin(polar) * Math.cos(az));
    // Opening and 2D views fitted to the map's shape. Tuned for a landscape map; on a tall phone screen the
    // camera stands back a little to keep the farm's width in view and looks down more steeply, so the farm
    // fills the height instead of sitting in a thin strip under a lot of sky.
    const tall = () => Math.min(1, Math.max(0, (1.15 - (camera.aspect || 1.4)) / 0.65));   // 0 wide \u2026 1 very tall
    const homeView = () => { const k = tall(); return { t: HOME.t, d: HOME.d * (1 + 0.35 * k), polar: HOME.polar - 0.34 * k, az: HOME.az }; };
    const topView = (v) => ({ ...v, d: v.d * (1 + 0.6 * tall()) });
    let viewTouched = false;   // until someone moves the map, the opening view refits when the map changes shape
    function flyTo(t, d, polar, az, ms = 900) {
      viewTouched = true;
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
    function jumpHome() { const v = homeView(); camera.position.copy(posFrom(v.t, v.d, v.polar, v.az)); controls.target.copy(v.t); controls.update(); }
    jumpHome();

    const b3d = document.getElementById("gm-v3d"), btop = document.getElementById("gm-vtop");
    function setMode(m, move = true) {
      b3d.setAttribute("aria-pressed", m === "3d"); btop.setAttribute("aria-pressed", m === "top");
      if (!move) return;
      vmode.setAttribute("aria-pressed", m === "top");
      const v = m === "top" ? topView(discOn ? TOP_DISC : TOP) : homeView(); flyTo(v.t, v.d, v.polar, v.az);
    }
    b3d.addEventListener("click", () => setMode("3d"));
    // phones: one 2D switch in the drawer instead of the 3D/2D pair
    const vmode = document.getElementById("gm-vmode");
    vmode.addEventListener("click", () => setMode(vmode.getAttribute("aria-pressed") === "true" ? "3d" : "top"));
    btop.addEventListener("click", () => setMode("top"));
    // compass: shows which way north is, and a tap goes back to the opening view (west up)
    document.getElementById("gm-compass").addEventListener("click", () => { if (current) select(null); discOn ? setDisc(true, true) : setMode("3d"); });
    // zoom buttons: move the camera towards or away from what it looks at
    function zoomBy(f) {
      const d = Math.max(controls.minDistance, Math.min(controls.maxDistance, camera.position.distanceTo(controls.target) * f));
      flyTo(controls.target.clone(), d, controls.getPolarAngle(), controls.getAzimuthalAngle(), 350);
    }
    document.getElementById("gm-zin").addEventListener("click", () => zoomBy(0.65));
    document.getElementById("gm-zout").addEventListener("click", () => zoomBy(1.55));
    const bn = document.getElementById("gm-vnames");
    bn.addEventListener("click", () => { const on = bn.getAttribute("aria-pressed") !== "true"; bn.setAttribute("aria-pressed", on); pinsEl.classList.toggle("names", on); });

    // Tap to pick
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let down = null;
    canvas.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; anim = null; viewTouched = true; hideHint(); });
    canvas.addEventListener("wheel", () => { viewTouched = true; hideHint(); }, { passive: true });
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
      if (!viewTouched) jumpHome();
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
    // With all names shown, each label goes to whichever side of its pin is free: right, left, above or
    // below. Nearer pins and the selected one choose first; a label with no room anywhere is hidden
    // until you hover or select its pin.
    // does segment s cross box r (Liang-Barsky clip)? does it cross segment t?
    function segRect(s, r) {
      let t0 = 0, t1 = 1; const dx = s[2] - s[0], dy = s[3] - s[1];
      for (const [p, q] of [[-dx, s[0] - r[0]], [dx, r[2] - s[0]], [-dy, s[1] - r[1]], [dy, r[3] - s[1]]]) {
        if (p === 0) { if (q < 0) return false; continue; }
        const t = q / p; if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
      }
      return true;
    }
    function segSeg(a, b) {
      const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
      const A = [a[0], a[1]], B = [a[2], a[3]], C = [b[0], b[1]], D = [b[2], b[3]];
      return o(A, B, C) !== o(A, B, D) && o(C, D, A) !== o(C, D, B);
    }
    const SIDES = ["r", "l", "t", "b"];
    // label sizes are cached; the page's web font can arrive after the first measure and change them, so measure again then
    let labelFontsV = 0;
    if (document.fonts) { document.fonts.ready.then(() => labelFontsV++); document.fonts.addEventListener("loadingdone", () => labelFontsV++); }
    function placeLabels(w, h) {
      const shown = ITEMS.filter(it => pinShown(it) && !it.pinEl.classList.contains("behind"));
      const busy = shown.map(it => [it.sx - 15, it.sy - 15, it.sx + 15, it.sy + 15]);   // every number is taken
      const lines = [];   // leader lines drawn so far: no label may sit on one, and no new line may cross one
      const free = (r) => r[0] >= 2 && r[1] >= 2 && r[2] <= w - 2 && r[3] <= h - 2 && !busy.some(b => r[0] < b[2] && r[2] > b[0] && r[1] < b[3] && r[3] > b[1]) && !lines.some(l => segRect(l, r));
      // a leader from the number's edge to the nearest point of the label box, or null if it would cross a number, a label or another leader
      const leader = (x, y, q) => {
        // aim at the label's rounded outline: nearest point of the box shrunk by the corner radius, then out by the radius
        // (less a little, so the line tucks under the border instead of stopping short at a rounded corner)
        const R = 7, ix = Math.min(Math.max(x, q[0] + 1 + R), q[2] - 1 - R), iy = Math.min(Math.max(y, q[1] + 1 + R), q[3] - 1 - R), d = Math.hypot(x - ix, y - iy) || 1;
        const nx = ix + (x - ix) / d * (R - 2), ny = iy + (y - iy) / d * (R - 2), L = Math.hypot(nx - x, ny - y);
        if (L < 16) return null;
        const seg = [x + (nx - x) / L * 15, y + (ny - y) / L * 15, nx, ny];
        if (busy.some(b => segRect(seg, [b[0] + 2, b[1] + 2, b[2] - 2, b[3] - 2])) || lines.some(l => segSeg(seg, l))) return null;
        return seg;
      };
      shown.sort((a, b) => (b === current) - (a === current) || a.sz - b.sz);
      for (const it of shown) {
        const lbl = it.pinEl.querySelector(".lbl");
        if (!it.lw || it.lfv !== labelFontsV) { it.lw = lbl.offsetWidth; it.lh = lbl.offsetHeight; it.lfv = labelFontsV; }  // re-measured once the web font has loaded
        const lw = it.lw + 2, lh = it.lh + 2, x = it.sx, y = it.sy;
        const rect = { r: [x + 20, y - lh / 2, x + 20 + lw, y + lh / 2], l: [x - 20 - lw, y - lh / 2, x - 20, y + lh / 2],
                       t: [x - lw / 2, y - 20 - lh, x + lw / 2, y - 20], b: [x - lw / 2, y + 20, x + lw / 2, y + 20 + lh] };
        let side = SIDES.find(s => free(rect[s])), far = null, seg = null;
        if (!side) {
          // no room right beside the pin: look further out, ring by ring, and draw a leader line back to the number,
          // so with names on every label shows (good for a screenshot to print)
          search: for (let r = 46; r <= 220; r += 18) for (let k = 0; k < 16; k++) {
            const a = k * Math.PI / 8 + (r / 18 % 2) * Math.PI / 16, cx = x + Math.cos(a) * (r + lw / 2 * Math.abs(Math.cos(a))), cy = y + Math.sin(a) * (r * 0.8 + lh / 2 * Math.abs(Math.sin(a)));
            const q = [cx - lw / 2, cy - lh / 2, cx + lw / 2, cy + lh / 2];
            if (free(q) && (seg = leader(x, y, q))) { far = q; break search; }
          }
          if (far) side = "f";
        }
        it.pinEl.dataset.side = side || "x";
        if (side === "f") {
          const st = it.pinEl.style, ldr = it.pinEl.querySelector(".ldr") || it.pinEl.appendChild(Object.assign(document.createElement("i"), { className: "ldr" }));
          st.setProperty("--lx", (far[0] - x + 14 + 1).toFixed(1) + "px"); st.setProperty("--ly", (far[1] - y + 14 + 1).toFixed(1) + "px");
          // line from the number's edge to the nearest point of the label box
          const nx = seg[2], ny = seg[3], L = Math.hypot(nx - x, ny - y);
          lines.push(seg);
          ldr.style.width = Math.max(0, L - 13).toFixed(1) + "px"; ldr.style.transform = `rotate(${Math.atan2(ny - y, nx - x).toFixed(3)}rad) translateX(13px)`;
        }
        if (side) busy.push(side === "f" ? far : rect[side]);
      }
    }
    // Pins that land on top of each other are pushed apart a little (never more than PUSH px from their
    // spot); the selected pin stays put and the others move round it.
    const PIN = 30, PUSH = 20;
    // on screen and not switched off with the other map's pins (the class list is read, not the layout)
    function pinShown(it) { const c = it.pinEl.classList; return !it.pinEl.hidden && !c.contains("dg-off") && ((!c.contains("farm-off") && !c.contains("lv-off")) || it === current); }
    function declutter() {
      const ps = ITEMS.filter(pinShown);
      ps.forEach(it => { it.ox = it.sx; it.oy = it.sy; });
      for (let k = 0; k < 4; k++) {
        for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j]; let dx = b.sx - a.sx, dy = b.sy - a.sy; const d = Math.hypot(dx, dy);
          if (d >= PIN) continue;
          if (d < 0.01) { dx = 1; dy = 0; } else { dx /= d; dy /= d; }
          const push = PIN - d, wa = a === current ? 0 : b === current ? 1 : 0.5, wb = 1 - wa;
          a.sx -= dx * push * wa; a.sy -= dy * push * wa; b.sx += dx * push * wb; b.sy += dy * push * wb;
        }
        ps.forEach(it => { const dx = it.sx - it.ox, dy = it.sy - it.oy, d = Math.hypot(dx, dy);
          if (d > PUSH) { it.sx = it.ox + dx / d * PUSH; it.sy = it.oy + dy / d * PUSH; } });
      }
    }
    // From far away the farm's pins would pile up: when the farm's buildings span less than PX_ONE px one "Grimerud" pin
    // stands in for all of them and flies back in when tapped (PX_ALL is kept for the level maths).
    const FARM_ITEMS = ITEMS.filter(it => it.g !== "d"), BLDG = ITEMS.filter(it => it.g === "b");
    const FARM_C = centroid(BLDG.map(it => it.c)), FARM_R = Math.max(...BLDG.map(it => Math.hypot(it.c[0] - FARM_C[0], it.c[1] - FARM_C[1])));
    const PX_ALL = 330, PX_ONE = 150, farmPin = document.getElementById("gm-farmpin"), fv = new THREE.Vector3();
    farmPin.addEventListener("click", e => { e.stopPropagation(); setMode("3d"); });
    function pinLevels(h) {
      fv.set(FARM_C[0], hAt(FARM_C[0], FARM_C[1]), FARM_C[1]);
      const across = 2 * FARM_R * h / (2 * camera.position.distanceTo(fv) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      const lv = discOn || across >= PX_ALL ? 0 : across >= PX_ONE ? 1 : 2;
      for (const it of FARM_ITEMS) it.pinEl.classList.toggle("lv-off", lv === 2);  // every pin shows until the farm shrinks to one pin
      fv.project(camera);
      const show = lv === 2 && fv.z < 1 && Math.abs(fv.x) < 0.95 && Math.abs(fv.y) < 0.95;
      farmPin.hidden = !show;
      if (show) farmPin.style.transform = `translate(${((fv.x + 1) / 2 * stage.clientWidth - 46).toFixed(1)}px, ${((1 - fv.y) / 2 * h - 16).toFixed(1)}px)`;
    }
    // The "drag to turn" hint goes after the first drag, scroll or selection, or after 8 s on screen
    const hintEl = document.getElementById("gm-hint"); let hintTimer = 0;
    function hideHint() { hintEl.classList.add("gone"); }
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
        if (vis) { it.sx = (v.x + 1) / 2 * w; it.sy = (1 - v.y) / 2 * h; it.sz = v.z; }
      }
      pinLevels(h);
      declutter();
      for (const it of ITEMS) if (!it.pinEl.hidden) { const s = it.pinEl.style; s.left = (it.sx - 14).toFixed(1) + "px"; s.top = (it.sy - 14).toFixed(1) + "px"; }
      if (!hintTimer && onScreen()) hintTimer = setTimeout(hideHint, 8000);
      if (pinsEl.classList.contains("names")) placeLabels(w, h);
      for (const [el, at, show] of [[dgGo, DG_AT, !discOn], [farmGo, FARM_AT, discOn]]) {
        v.set(at[0], hAt(at[0], at[1]) + 3, at[1]).project(camera);
        // only shown when its spot on the road is in view
        const ok = show && v.z < 1 && Math.abs(v.x) < 0.92 && Math.abs(v.y) < 0.9;
        el.hidden = !ok;
        if (ok) {
          if (!el._w) el._w = el.offsetWidth;
          const x = Math.max(8, Math.min((v.x + 1) / 2 * w - 20, w - el._w - 62)), y = Math.max(8, Math.min((1 - v.y) / 2 * h - 16, h - 44));
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        }
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
      const WSKY = [C("#c9d3dc"), C("#dfe5ea"), C("#eef1f3")];
      function render(s) {
        nightS = s;
        const wk = snow.value * (1 - s) * 0.85;
        const top = key(K.skyTop, s, new THREE.Color()).lerp(WSKY[0], wk).getStyle(), mid = key(K.skyMid, s, new THREE.Color()).lerp(WSKY[1], wk).getStyle(), low = key(K.skyLow, s, new THREE.Color()).lerp(WSKY[2], wk).getStyle();
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
        btn.dataset.tip = on ? "Vis dag\nShow day" : "Vis natt\nShow night";
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
      rerenderSky = () => render(nightS);
      btn.addEventListener("click", () => go(!on));
    })();

    // Touch devices: inline, one finger scrolls the page (taps still pick places) and two fingers move and
    // zoom the map; a one-finger sideways drag shows a "use two fingers" note. Full screen gets all gestures.
    (() => {
      const btn = document.getElementById("gm-expand"), lbl = btn.querySelector(".tx"), icon = btn.querySelector("path");
      const coarse = matchMedia("(pointer: coarse)");
      const openLabel = () => coarse.matches ? "Utforsk" : "Fullskjerm";
      lbl.textContent = openLabel();
      let full = false, ph = null;
      const passThrough = () => coarse.matches && !full;
      const two = document.getElementById("gm-two"); let t0 = null, twoTimer = 0;
      stage.addEventListener("touchstart", e => { t0 = passThrough() && e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null; }, { capture: true, passive: true });
      stage.addEventListener("touchmove", e => {
        if (!t0 || e.touches.length !== 1) { t0 = null; return; }
        const dx = e.touches[0].clientX - t0[0], dy = e.touches[0].clientY - t0[1];
        if (Math.abs(dx) > 24 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
          t0 = null; two.classList.add("show"); clearTimeout(twoTimer); twoTimer = setTimeout(() => two.classList.remove("show"), 1600);
        }
      }, { capture: true, passive: true });
      ["touchstart", "touchmove"].forEach(t => stage.addEventListener(t, e => {
        if (passThrough() && e.target === canvas && e.touches.length < 2) e.stopPropagation(); // keep one finger from the map controls
      }, { capture: true, passive: true }));
      function setFull(on) {
        if (on === full) return; full = on;
        if (on) {
          // move the whole map to <body> so no transformed ancestor in the host page can trap position: fixed
          ph = document.createElement("div"); ph.style.height = root.offsetHeight + "px";
          root.parentNode.insertBefore(ph, root); document.body.appendChild(root);
          root.classList.add("gm-full"); document.documentElement.classList.add("gm-lock");
          // also ask for real full screen where the browser allows it; the fixed overlay covers the rest
          if (!coarse.matches && root.requestFullscreen) root.requestFullscreen().catch(() => {});
        } else {
          if (document.fullscreenElement === root) document.exitFullscreen().catch(() => {});
          root.classList.remove("gm-full"); document.documentElement.classList.remove("gm-lock");
          ph.parentNode.insertBefore(root, ph); ph.remove(); ph = null;
          stage.scrollIntoView({ block: "center" });
        }
        btn.setAttribute("aria-pressed", on);
        lbl.textContent = on ? "Lukk" : openLabel();
        btn.dataset.tip = on ? "Lukk fullskjerm\nClose full screen" : "Fullskjerm\nFull screen";
        icon.setAttribute("d", on ? "M5 5l10 10M15 5L5 15" : "M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12");
        btn.setAttribute("aria-label", on ? "Lukk fullskjerm \u00b7 Close full screen" : "Utforsk kartet i fullskjerm \u00b7 Explore the map full screen");
        resize();
      }
      btn.addEventListener("click", e => { e.stopPropagation(); setFull(!full); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && full) setFull(false); });
      document.addEventListener("fullscreenchange", () => { if (full && document.fullscreenElement !== root) setFull(false); });
    })();

    // Winter: snow on the ground, roofs and tree tops. Every material gets the same "snow" uniform, so the
    // switch is one number animated from 0 to 1. Ground textures are whitened before the night tint applies.
    (() => {
      const btn = document.getElementById("gm-vwinter");
      const snowRGB = "vec3(0.93, 0.95, 0.97)";
      function patch(m, mode, strength) {
        if (m.userData.snow) return; m.userData.snow = true;
        m.onBeforeCompile = sh => {
          sh.uniforms.uSnow = snow;
          sh.fragmentShader = "uniform float uSnow;\n" + (mode === "up" ? "varying float vSnowUp;\n" : "") + sh.fragmentShader;
          if (mode === "ground") {
            // keep the hill shading (luminance), keep water blue, whiten everything else
            sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", `
              #ifdef USE_MAP
                vec4 texelColor = texture2D( map, vUv );
                texelColor = mapTexelToLinear( texelColor );
                float sl = dot(texelColor.rgb, vec3(.3, .59, .11));
                float water = smoothstep(0.03, 0.12, texelColor.b - max(texelColor.r, texelColor.g * 0.9));
                texelColor.rgb = mix(texelColor.rgb, ${snowRGB} * (0.78 + 0.3 * sl), uSnow * ${strength.toFixed(2)} * (1.0 - water));
                diffuseColor *= texelColor;
              #endif`);
          } else {
            sh.vertexShader = "varying float vSnowUp;\n" + sh.vertexShader.replace("#include <beginnormal_vertex>", `#include <beginnormal_vertex>
              #ifdef USE_INSTANCING
                vSnowUp = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * objectNormal).y;
              #else
                vSnowUp = abs(normalize(mat3(modelMatrix) * objectNormal).y);  // building faces are double-sided, so either way up counts
              #endif`);
            // after color_fragment, so instance colours (tree greens) don't tint the snow
            sh.fragmentShader = sh.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
              diffuseColor.rgb = mix(diffuseColor.rgb, ${snowRGB}, uSnow * ${strength.toFixed(2)} * smoothstep(0.25, 0.65, vSnowUp));`);
          }
        };
        m.needsUpdate = true;
      }
      scene.traverse(o => {
        if (!o.isMesh) return;
        [].concat(o.material).forEach(m => {
          if (!m || m.userData.noSnow) return;
          if (m.isMeshToonMaterial) patch(m, "up", 0.92);
          else if (m.isMeshBasicMaterial && m.map && !m.transparent) patch(m, "ground", 0.88);
          else if (m.isMeshBasicMaterial && m.map && m.transparent && m.depthWrite === false) patch(m, "ground", 0.45); // roads and yards: trodden snow
        });
      });
      const hillsBase = hillsMat ? hillsMat.color.clone() : null;
      let on = false, anim = null;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      function apply(v) {
        snow.value = v;
        scene.fog.color.lerp(new THREE.Color("#eef1f3"), 0); // fog follows the sky via the night code
        rerenderSky();
      }
      function step(now) {
        if (!anim) return;
        const k = Math.min(1, (now - anim.t0) / 900), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        apply(anim.from + (anim.to - anim.from) * e);
        if (k < 1) requestAnimationFrame(step); else anim = null;
      }
      btn.addEventListener("click", () => {
        on = !on; btn.setAttribute("aria-pressed", on);
        btn.dataset.tip = on ? "Vis sommer\nShow summer" : "Vis vinter\nShow winter";
        if (reduce) { apply(on ? 1 : 0); return; }
        anim = { t0: performance.now(), from: snow.value, to: on ? 1 : 0 }; requestAnimationFrame(step);
      });
    })();

    // "More to show": names, winter and night slide out beside one button and stay out until it's pressed again
    (() => {
      const btn = document.getElementById("gm-layers"), drawer = document.getElementById("gm-menu"), grp = btn.parentElement;
      const opts = [...drawer.querySelectorAll(".tool")];
      const open = on => {
        if (on) {   // room below the button for the column, clear of the full-screen corner button?
          const b = btn.getBoundingClientRect(), st = stage.getBoundingClientRect(), need = opts.filter(o => o.offsetParent).length * (b.height + 8);
          drawer.classList.toggle("side", b.bottom + need > st.bottom - b.height - 22);
        }
        drawer.classList.toggle("open", on); btn.setAttribute("aria-expanded", on); opts.forEach(b => b.tabIndex = on ? 0 : -1); };
      btn.addEventListener("click", e => { e.stopPropagation(); open(!drawer.classList.contains("open")); });
      root.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) { open(false); btn.focus(); } });
      const lit = () => grp.classList.toggle("lit", opts.some(b => b.getAttribute("aria-pressed") === "true"));
      new MutationObserver(lit).observe(drawer, { subtree: true, attributes: true, attributeFilter: ["aria-pressed"] });
      addEventListener("resize", () => { if (drawer.classList.contains("open")) open(true); });
      open(false); lit();
    })();

    // Full screen on a phone: the list is a sheet along the bottom with the search showing. Tap or drag the
    // handle, or tap into the search, to pull it up; choosing a place drops it again to show the map.
    (() => {
      const panel = root.querySelector(".panel"), handle = document.getElementById("gm-sheet"), input = document.getElementById("gm-search");
      const sheet = () => root.classList.contains("gm-full") && handle.offsetParent !== null;
      const open = on => { panel.classList.toggle("open", on); handle.setAttribute("aria-expanded", on); handle.setAttribute("aria-label", on ? "Skjul liste \u00b7 Hide list" : "Vis liste \u00b7 Show list"); };
      let y0 = null, swiped = false;
      handle.addEventListener("pointerdown", e => { y0 = e.clientY; swiped = false; });
      addEventListener("pointerup", e => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (Math.abs(dy) > 24) { swiped = true; open(dy < 0); } });
      handle.addEventListener("click", () => { if (swiped) { swiped = false; return; } open(!panel.classList.contains("open")); });
      input.addEventListener("focus", () => { if (sheet()) open(true); });
      new MutationObserver(() => { if (!root.classList.contains("gm-full")) open(false); }).observe(root, { attributes: true, attributeFilter: ["class"] });
    })();

    // Hide or show the list beside the map (wide screens)
    (() => {
      const btn = document.getElementById("gm-listtoggle");
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const hide = !root.classList.contains("nolist");
        root.classList.toggle("nolist", hide);
        btn.setAttribute("aria-expanded", !hide);
        btn.setAttribute("aria-label", hide ? "Vis liste \u00b7 Show list" : "Skjul liste \u00b7 Hide list");
        btn.dataset.tip = hide ? "Vis liste\nShow list" : "Skjul liste\nHide list";
        resize();
      });
    })();

    // Search: filter both lists as you type; Enter opens the first match
    (() => {
      const input = document.getElementById("gm-search"), clear = document.getElementById("gm-sclear"), none = document.getElementById("gm-noresult");
      const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u00f8/g, "o").replace(/\u00e6/g, "ae");
      ITEMS.forEach(it => { it.find = norm([it.n, it.no, it.en, it.sub_no, it.sub_en].join(" ")); });
      let first = null;
      function run() {
        const q = norm(input.value.trim());
        clear.hidden = !q;
        root.classList.toggle("searching", !!q);
        first = null;
        if (!q) {
          ITEMS.forEach(it => { if (it.btn) it.btn.hidden = false; });
          listEl.querySelectorAll(".grp").forEach(s => s.hidden = false);
          showList(discOn); none.hidden = true; return;
        }
        const words = q.split(/\s+/);
        ITEMS.forEach(it => {
          if (!it.btn) return;
          const ok = words.every(w => it.find.includes(w));
          it.btn.hidden = !ok; if (ok && !first) first = it;
        });
        listEl.querySelectorAll(".grp").forEach(s => s.hidden = !s.querySelector(".item:not([hidden])"));
        panes.farm.hidden = false; panes.disc.hidden = false;
        none.hidden = !!first;
      }
      input.addEventListener("input", run);
      input.addEventListener("keydown", e => {
        if (e.key === "Enter" && first) { select(first, true); input.blur(); }
        if (e.key === "Escape") { input.value = ""; run(); }
      });
      clear.addEventListener("click", () => { input.value = ""; run(); input.focus(); });
    })();

  }
})();

