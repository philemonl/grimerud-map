// Grimerud Gård map: scene, pins, legend and controls.
// Runs inside init() in loader.js, which provides: root (the #grimerud-map element), onScreen(),
// DATA (places, roads, disc golf from src/content) and the heavy assets
// GROUND_SITE, GROUND_CTX, TREES, TERRAIN (heights already decoded to TERRAIN.v), FAR, FAR_IMG.
let waveFlag = null, hillsMat = null, nightS = 0, rerenderSky = () => {};
const snow = { value: 0 };   // 0 = summer, 1 = winter; shared by every patched material
const M = 0.29188, S = 1792 * M, CTX_S = 1643.86816, CTX_CX = 336.24576, CTX_CZ = 37.36064;
const P = ([x, y]) => [(x - 896) * M, (y - 896) * M];
const INK = 0x26221d;
const GROUPS = { b: ["Bygninger", "Buildings"], a: ["Ankomst og uteområder", "Arrival & outdoors"], o: ["Andre bygg", "Other buildings"], d: ["Diskgolf", "Disc golf"] };
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
["b", "a", "o", "d"].forEach(g => {
  const pane = g === "d" ? panes.disc : panes.farm;
  const sec = document.createElement("section"); sec.className = "grp"; pane.appendChild(sec);
  const items = document.createElement("div"); items.className = "grp-items"; items.id = "gm-grp-" + g;
  const h = document.createElement("button"); h.className = "group"; h.type = "button";
  h.setAttribute("aria-expanded", "true"); h.setAttribute("aria-controls", items.id);
  h.innerHTML = `<span>${GROUPS[g][0]} · <i>${GROUPS[g][1]}</i></span><span class="cnt">${ITEMS.filter(it => it.g === g).length}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  h.addEventListener("click", () => { const open = h.getAttribute("aria-expanded") !== "true"; h.setAttribute("aria-expanded", open); items.hidden = !open; });
  sec.append(h, items);
  ITEMS.filter(it => it.g === g).forEach(it => {
    const b = document.createElement("button");
    b.className = "item"; b.setAttribute("aria-pressed", "false");
    const sq = it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq";
    b.innerHTML = `<span class="num${sq}">${esc(it.n)}</span><span><span class="nm">${nameHTML(it)}</span>${subHTML(it) ? `<span class="sub">${subHTML(it)}</span>` : ""}</span>`;
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
// Distant landscape with Mjøsa: a coarse painted sheet (~11 km) laid under the detailed ground
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
    [island, ...(DATA.islands || []).map(a => a.map(P))].forEach(a => { poly(a); g.fillStyle = "#6fa83c"; g.fill(); g.lineWidth = 0.7 * k; g.strokeStyle = INKC; g.stroke(); });
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
      const W = bc.w || Math.min(3, L / n - 0.6), D = 1.4;
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
      const cols = tp.label === "Blå" ? [BLUE] : tp.label === "Rød" ? [RED] : [BLUE, RED];
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
  styleItem(it, true);
  const cn = document.getElementById("gm-cnum"); cn.textContent = it.n; cn.className = "num" + (it.g === "d" ? " dg" : /\d/.test(it.n) ? "" : " sq");
  if (it.g === "d") setDisc(true);
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
// Opening view: from the entrance on Grimerudvegen, looking west over the farm towards Mjøsa
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
// compass: turn the map north-up, keeping the tilt and distance; home: back to the opening view
document.getElementById("gm-compass").addEventListener("click", () => flyTo(controls.target.clone(), camera.position.distanceTo(controls.target), controls.getPolarAngle(), 0, 600));
document.getElementById("gm-home").addEventListener("click", () => { if (current) select(null); discOn ? setDisc(true, true) : setMode("3d"); });
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
    if (vis) { const s = it.pinEl.style; s.left = ((v.x + 1) / 2 * w - 14).toFixed(1) + "px"; s.top = ((1 - v.y) / 2 * h - 14).toFixed(1) + "px"; }
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
  // Day ↔ night is one value s (0 = day, 1 = night) that we animate; dusk sits in the middle.
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
      // night → day runs forward through the small hours: dark, then a dawn glow, then day
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

// Touch devices: inline, one finger scrolls the page (taps still pick places); full screen gets all gestures
(() => {
  const btn = document.getElementById("gm-expand"), lbl = btn.querySelector(".tx"), icon = btn.querySelector("path");
  const coarse = matchMedia("(pointer: coarse)");
  const openLabel = () => coarse.matches ? "Utforsk" : "Fullskjerm";
  lbl.textContent = openLabel();
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
    btn.setAttribute("aria-label", on ? "Lukk fullskjerm · Close full screen" : "Utforsk kartet i fullskjerm · Explore the map full screen");
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
      if (!m) return;
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
