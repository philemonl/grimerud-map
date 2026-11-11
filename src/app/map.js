// Grimerud Gård map: scene, pins, legend and controls.
// Runs inside init() in loader.js, which provides: root (the #grimerud-map element), onScreen(),
// DATA (places, roads, disc golf from src/content) and the heavy assets
// GROUND_SITE, GROUND_CTX, TREES, TERRAIN (heights already decoded to TERRAIN.v), FAR, FAR_IMG.
let waveFlag = null, hillsMat = null, stars = null, aurora = null, nightS = 0, rerenderSky = () => {};
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
const GROUPS = { b: ["Bygninger", "Buildings"], a: ["Ankomst og uteområder", "Arrival & outdoors"], o: ["Andre bygg på gården", "Other farm buildings"], d: ["Diskgolf", "Disc golf"] };
const ITEMS = DATA.items;

const stage = document.getElementById("gm-stage");
const listEl = document.getElementById("gm-list");
const pinsEl = document.getElementById("gm-pins");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nameHTML = it => it.no === it.en ? esc(it.no) : `${esc(it.no)}<span class="sl"> / </span><i>${esc(it.en)}</i>`;
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
  h.innerHTML = `<span>${GROUPS[g][0]} · <i>${GROUPS[g][1]}</i></span><span class="cnt">${ITEMS.filter(it => it.g === g).length}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
scene.fog = new THREE.Fog(0xbdd3ea, 1800, 15000);
const camera = new THREE.PerspectiveCamera(36, 1, 2, 15500);
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
    // the west strip is open water but for the tip of Helgøya, which the horizon ring draws: keep it flat lake
    if (x < FAR.x0 + FAR.size * 0.09) y = (FAR.lake - TERRAIN.h0) * EX;
    // tuck under the detailed ground so the two never fight
    if (Math.abs(x - CTX_CX) < half && Math.abs(z - CTX_CZ) < half) y -= 12; else y -= 1.2;
    pos.setY(i, y);
  }
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex(FAR_IMG) })); scene.add(m);
  const HZ_EYE = DATA.horizon.eye;
  // The wide landscape out to 35 km (src/pipeline/outer.py): real terrain with painted land cover, Mjøsa and
  // Helgøya included, laid under the nearer sheet. Beyond PULL metres from the farm it is drawn in towards the
  // camera along its line of sight (distance squeezed, height above eye level scaled to match), so every ridge
  // keeps its true bearing and angular height while the whole of it fits inside the view distance. The fog,
  // working on the squeezed distance, gives the far ridges their blue.
  const PULL = 9000, REACH = 12600, eyeY = (HZ_EYE - TERRAIN.h0) * EX;
  {
    const bin = atob(OUTER.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const v = new Uint16Array(u8.buffer), n = OUTER.n, H = OUTER.half, K = (REACH - PULL) / (H * Math.SQRT2 - PULL);
    const g = new THREE.PlaneGeometry(H * 2, H * 2, n - 1, n - 1); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, pad = 450;
    const tint = [];   // distance blue: the land cover is multiplied towards slate blue the further off it lies
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), z = pos.getZ(i), y = (v[i] / 10 + OUTER.hmin - TERRAIN.h0) * EX;
      // sink it where the nearer sheet lies on top (and a cell beyond, so it never pokes through the edge)
      if (x > FAR.x0 - pad && x < FAR.x0 + FAR.size + pad && z > FAR.z0 - pad && z < FAR.z0 + FAR.size + pad) y -= 22;
      const r = Math.hypot(x, z);
      // far ridges at their true angular height: the terrain's exaggeration is eased off with distance
      const far = Math.min(1, Math.max(0, (r - 5000) / 15000)), ex = 1 + (1 / EX - 1) * far * far * (3 - 2 * far);
      if (y > eyeY || r > PULL) y = eyeY + (y - eyeY) * (r > 5000 ? ex : 1);
      if (r > PULL) { const k = (PULL + (r - PULL) * K) / r; x *= k; z *= k; y = eyeY + (y - eyeY) * k; }
      pos.setXYZ(i, x, y, z);
      const b = Math.min(1, Math.max(0, (r - 6000) / 22000)); tint.push(1 - 0.42 * b, 1 - 0.27 * b, 1 - 0.02 * b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(tint, 3));
    scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex(OUTER_IMG), vertexColors: true })));
  }
  // Past 35 km: one pale range for the furthest skyline (src/pipeline/horizon.py), standing in haze
  const HZ = DATA.horizon, HAZE = [0.66, 0.77, 0.90], pts = [], idx = [], cols = [];
  const base = (123 - TERRAIN.h0) * EX - 60;
  HZ.rings.forEach(ring => {
    const col = [0.52, 0.63, 0.80], n = ring.h.length, o = pts.length / 3;
    for (let i = 0; i <= n; i++) {
      const a = i / n * Math.PI * 2, cx = HZ.centre[0] + Math.cos(a) * ring.r, cz = HZ.centre[1] + Math.sin(a) * ring.r;
      const top = eyeY + ring.h[i % n] * EX;     // angular height from the farm, at the terrain's exaggeration
      pts.push(cx, base, cz, cx, base + (top - base) * 0.5, cz, cx, top, cz);
      const foot = col.map((c, k) => c + (HAZE[k] - c) * 0.6), mid = col.map((c, k) => c + (HAZE[k] - c) * 0.3);
      cols.push(...foot, ...mid, ...col);
      if (i < n) { const k = o + i * 3; idx.push(k, k + 1, k + 3, k + 1, k + 4, k + 3, k + 1, k + 2, k + 4, k + 2, k + 5, k + 4); }
    }
  });
  const hg = new THREE.BufferGeometry(); hg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); hg.setIndex(idx);
  hg.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  hillsMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, fog: false });
  scene.add(new THREE.Mesh(hg, hillsMat));
})();
const siteGround = terrainPlane(S, 260, 0, 0, 0, tex(GROUND_SITE));
const canvasTexRaw = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); return new THREE.CanvasTexture(c); };
// Night stars: points on a dome that travels with the camera, behind the hills; faded in by the night code.
// A few brighter ones, most faint, thinning towards the horizon where haze would hide them.
(() => {
  let s = 77; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const mk = (n, size, minEl) => {
    const p = [];
    while (p.length < n * 3) {
      // the view never tilts far up, so only the few degrees above the horizon are ever seen: fill that band
      const az = rnd() * Math.PI * 2, el = minEl + rnd() * 0.16;
      if (rnd() > 0.4 + 0.6 * Math.min(1, el / 0.05)) continue;     // thinner in the haze right at the horizon
      const R = 14200; p.push(Math.cos(az) * Math.cos(el) * R, Math.sin(el) * R, Math.sin(az) * Math.cos(el) * R);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfdf6e3, size, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  };
  stars = new THREE.Group(); stars.add(mk(900, 1.4, 0.008), mk(140, 2.4, 0.015)); stars.visible = false;
  // Northern lights for winter nights: three rayed curtains rising from behind the northern hills, green with a violet top.
  // They ride on the same dome as the stars and drift slowly sideways.
  const ray = canvasTexRaw(512, 128, (g, w, h) => {
    let q = 5; const r = () => (q = (q * 16807) % 2147483647) / 2147483647;
    const img = g.createImageData(w, h), cols = []; let a = 0;
    const f = [3, 7, 13, 29, 53].map(k => [k, r() * 6.283]);     // rays from whole-number waves, so the texture tiles
    for (let x = 0; x < w; x++) { a = 0; f.forEach(([k, p], i) => { a += Math.sin(x / w * 6.283 * k + p) / (1 + i * 0.5); }); cols.push(Math.min(1, Math.max(0.05, 0.5 + a * 0.28))); }
    for (let x = 0; x < w; x++) { const edge = 1, top = 0.55 + 0.45 * Math.sin(x / w * 6.283 * 4) ** 2;
      for (let y = 0; y < h; y++) {
        const t = 1 - y / (h - 1);                                  // 0 at the lower edge, 1 at the top
        const body = t < 0.08 ? t / 0.08 : Math.pow(Math.max(0, 1 - (t - 0.08) / (0.92 * top)), 1.7);
        const i = (y * w + x) * 4, v = Math.min(1, t * 1.5);         // green low down, violet towards the top
        img.data[i] = 60 + 130 * v; img.data[i + 1] = 255 - 150 * v; img.data[i + 2] = 150 + 90 * v;
        img.data[i + 3] = 255 * body * (0.35 + 0.65 * cols[x]) * edge;
      } }
    g.putImageData(img, 0, 0);
  });
  aurora = new THREE.Group(); aurora.visible = false;
  [[-1.25, 0.55, 0.012, 0.085, 1.0], [-0.5, 1.2, 0.022, 0.075, 0.8], [-0.95, 0.2, 0.034, 0.06, 0.55]].forEach(([a0, a1, el0, tall, op], ci) => {
    const n = 48, R = 14000, pos = [], uv = [], idx = [], vc = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, az = a0 + (a1 - a0) * t + 0.05 * Math.sin(t * 9 + ci), el = el0 + 0.008 * Math.sin(t * 6.5 + ci * 2) + 0.004 * Math.sin(t * 17 + ci);
      [el, el + tall].forEach((e, k) => { pos.push(Math.sin(az) * Math.cos(e) * R, Math.sin(e) * R, -Math.cos(az) * Math.cos(e) * R); uv.push(t * (0.8 + ci * 0.15) + ci * 0.31, k);
        const fd = Math.min(1, t / 0.22, (1 - t) / 0.22), fe = fd * fd * (3 - 2 * fd); vc.push(fe, fe, fe); });   // each curtain fades out at its ends
      if (i < n) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute("color", new THREE.Float32BufferAttribute(vc, 3)); g.setIndex(idx);
    const t = ray.clone(); t.needsUpdate = true; t.wrapS = THREE.RepeatWrapping;
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: t, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, fog: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    m.userData.op = op; m.userData.drift = (ci % 2 ? -1 : 1) * (0.004 + ci * 0.0015); m.material.userData.noSnow = true; m.frustumCulled = false; aurora.add(m);
  });
  stars.add(aurora);
  stars.traverse(o => { o.frustumCulled = false; }); scene.add(stars);
})();

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
// Night glow for a texture with its own window layout: black, with the given panes lit
function glowMap(key, w, h, rects) {
  return canvasTex("glow:" + key, w, h, (g) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
    rects.forEach(([x, y, rw, rh]) => { const grd = g.createLinearGradient(0, y, 0, y + rh); grd.addColorStop(0, "#ffd98a"); grd.addColorStop(1, "#ffb347"); g.fillStyle = grd; g.fillRect(x, y, rw, rh); });
  });
}
const withGlow = (t, rects) => { if (!t.__glow) t.__glow = glowMap(t.__key, t.image.width, t.image.height, rects); return t; };
// Window glow for night mode: the same layout as wallTex, lit panes only
const glowTex = canvasTex("glow", 64, 64, (g, w, h) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
  const grd = g.createLinearGradient(0, 21, 0, 41); grd.addColorStop(0, "#ffd98a"); grd.addColorStop(1, "#ffb347");
  g.fillStyle = grd; g.fillRect(25, 21, 14, 20);
  g.fillStyle = "#3a2a10"; g.fillRect(31, 21, 2, 20); g.fillRect(25, 30, 14, 2);
});
// Shed dormer front (drone photo): a pair of white-framed four-pane windows side by side
const dormerTex = color => withGlow(canvasTex("dm" + color, 128, 64, (g, w, h) => {
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < w; i += 4) g.fillRect(i, 0, 1, h);
  [[14, 12], [68, 12]].forEach(([x, y]) => {
    g.fillStyle = "#fffdf8"; g.fillRect(x, y, 46, 42);
    g.fillStyle = "#3b4a52"; g.fillRect(x + 4, y + 4, 38, 34);
    g.fillStyle = "#fffdf8"; g.fillRect(x + 21, y + 4, 4, 34); g.fillRect(x + 4, y + 19, 38, 3);
    g.strokeStyle = "#26221d"; g.lineWidth = 1.5; g.strokeRect(x, y, 46, 42);
  });
}), [[18, 16, 38, 34], [72, 16, 38, 34]]);
const boardTex = color => canvasTex("b" + color, 64, 64, (g, w, h) => {
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 64; i += 4) g.fillRect(i, 0, 1, h);
});
// Barn walls (drone video): the concrete base has a row of small square windows about every 2.2 m;
// the red board wall above has only the odd small hatch near the eaves
const barnBaseTex = color => withGlow(canvasTex("bb" + color, 64, 64, (g, w, h) => {
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 90; i++) g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
  g.fillStyle = "#fffdf8"; g.fillRect(22, 14, 20, 20);
  g.fillStyle = "#3b4a52"; g.fillRect(25, 17, 14, 14);
  g.fillStyle = "#fffdf8"; g.fillRect(31, 17, 2, 14);
  g.strokeStyle = "#26221d"; g.lineWidth = 1.5; g.strokeRect(22, 14, 20, 20);
}), [[25, 17, 14, 14]]);
const barnUpperTex = color => canvasTex("bu" + color, 64, 64, (g, w, h) => {
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 64; i += 4) g.fillRect(i, 0, 1, h);
  g.fillStyle = "#f4f2ec"; g.fillRect(27, 6, 10, 9); g.fillStyle = "#3b4a52"; g.fillRect(29, 8, 6, 5);
});
// Office (drone video): rendered walls, tall white-framed windows with four panes on a white apron panel
const officeTex = color => withGlow(canvasTex("of" + color, 64, 64, (g, w, h) => {
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  let s = 9; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 140; i++) g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
  g.fillStyle = "#f6f4ee"; g.fillRect(20, 12, 24, 44);                 // white surround and apron
  g.fillStyle = "#3b4a52"; g.fillRect(23, 15, 18, 26);                 // glass
  g.fillStyle = "#f6f4ee"; g.fillRect(31, 15, 2, 26); g.fillRect(23, 27, 18, 2);
  g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(20, 43, 24, 1.5);         // sill line
  g.strokeStyle = "#26221d"; g.lineWidth = 1.2; g.strokeRect(20, 12, 24, 44);
}), [[23, 15, 18, 26]]);
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
    strokeLines(0, GRAVEL, l => l.kind === "road" || l.kind === "drive");
    strokeLines(0, GRAVEL_LIGHT, l => l.kind === "path" || l.kind === "track");
    // the merged surface (yards, lanes, ring) last, over every seam
    gravel.forEach(rs => { rings(rs); g.fillStyle = GRAVEL; g.fill("evenodd"); });
    g.lineWidth = 3.2 * k; g.strokeStyle = GRAVEL; g.beginPath(); g.arc(...X(cc), cr * M * k, 0, 6.2832); g.stroke();
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
    const L = lens[i], bays = endBays && L < 0.99 * longest ? endBays : Math.max(1, Math.round(L / bay)), floors = Math.max(1, Math.round((h - y0) / 2.9));
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
// Hipped roof over any right-angled outline (an L, a T, a stepped plan): every point rises at the same pitch
// with its distance to the nearest wall, measured square to the walls. On a grid whose lines pass through
// every corner that height is flat on each half-cell, so splitting each cell along the right diagonal gives
// the exact roof: straight hips, ridges and valleys, one piece, no crossing roofs.
function hipRoof(pts, h, pitch = 0.84, maxRise = 5) {
  const o = pts[0], e = [pts[1][0] - o[0], pts[1][1] - o[1]], el = Math.hypot(...e), u = [e[0] / el, e[1] / el], v = [-u[1], u[0]];
  const st = 0.25, snap = x => Math.round(x / st) * st;
  const loc = pts.map(p => [snap((p[0] - o[0]) * u[0] + (p[1] - o[1]) * u[1]), snap((p[0] - o[0]) * v[0] + (p[1] - o[1]) * v[1])]);
  const segs = loc.map((a, i) => [a, loc[(i + 1) % loc.length]]);
  const inside = (x, y) => { let c = false; for (const [a, b] of segs) if ((a[1] > y) !== (b[1] > y) && x < a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])) c = !c; return c; };
  const dInf = (x, y) => { let m = Infinity; for (const [a, b] of segs) {
    const dx = Math.max(0, Math.min(a[0], b[0]) - x, x - Math.max(a[0], b[0])), dy = Math.max(0, Math.min(a[1], b[1]) - y, y - Math.max(a[1], b[1]));
    m = Math.min(m, Math.max(dx, dy)); } return m; };
  const H = (x, y) => h + Math.min(pitch * dInf(x, y), maxRise);
  const xs = loc.map(p => p[0]), ys = loc.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const W = (x, y) => [o[0] + u[0] * x + v[0] * y, o[1] + u[1] * x + v[1] * y];
  const pos = [], uv = [], put = (x, y) => { const [wx, wz] = W(x, y), hy = H(x, y); pos.push(wx, hy, wz); uv.push(x / 2.2, hy / 0.6); };
  let top = h;
  for (let x = x0; x < x1 - 1e-6; x += st) for (let y = y0; y < y1 - 1e-6; y += st) {
    if (!inside(x + st / 2, y + st / 2)) continue;
    const a = H(x, y), b = H(x + st, y), c = H(x + st, y + st), d = H(x, y + st), m = H(x + st / 2, y + st / 2);
    top = Math.max(top, a, b, c, d);
    if (Math.abs((a + c) / 2 - m) <= Math.abs((b + d) / 2 - m)) { put(x, y); put(x, y + st); put(x + st, y + st); put(x, y); put(x + st, y + st); put(x + st, y); }
    else { put(x, y); put(x, y + st); put(x + st, y); put(x + st, y); put(x, y + st); put(x + st, y + st); }
  }
  const g = geomFrom(pos, uv); g.computeVertexNormals();
  // keep the faces lit toward the sky whichever way the outline winds
  const n = g.attributes.normal; let up = 0; for (let i = 0; i < n.count; i++) up += n.getY(i);
  if (up < 0) { const p = g.attributes.position; for (let i = 0; i < p.count; i += 3) for (let k = 0; k < 3; k++) { const t = p.getX(i + 1); } g.index = null; const arr = p.array; for (let i = 0; i < arr.length; i += 9) for (let k = 0; k < 3; k++) { const t = arr[i + 3 + k]; arr[i + 3 + k] = arr[i + 6 + k]; arr[i + 6 + k] = t; } g.computeVertexNormals(); }
  return { geom: g, top };
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
  // window only on the dormer's front; its side cheeks and back are plain cladding
  const dWall = toon({ map: wallTex(part.wall) }), dPlain = toon({ map: boardTex(part.wall) }), dRoof = toon({ color: part.roof });
  const dFront = part.dormerStyle === "shed" ? toon({ map: dormerTex(part.wall) }) : dWall;
  const dMats = [dPlain, dPlain, dPlain, dPlain, dFront, dPlain];
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
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, hgt + 0.15, D), dMats); box.position.set(0, (hgt + 0.15) / 2, -D / 2);
      const cap = new THREE.Mesh(prism, dRoof); cap.position.y = hgt + 0.15;
      d.add(box, cap); addInk(box.geometry, box, 25, ink); addInk(prism, cap, 25, ink);
      // white barge boards down both sides of a shed dormer's lid
      if (shed) [-1, 1].forEach(sg => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.1, capH + 0.06, D + 0.22), trimMat);
        b.position.set(sg * (w / 2 + 0.22), hgt + 0.15 + (capH + 0.06) / 2 - 0.03, -D / 2 + 0.1); d.add(b);
      });
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
  const trWin = [[31, 21, 34, 18], [135, 21, 16, 26]];
  const sideD = toon({ map: withGlow(side(true), trWin) }), sideP = toon({ map: withGlow(side(false), trWin.concat([[193, 21, 34, 18]])) });
  sideD.userData.early = sideP.userData.early = true;   // lived-in cabins: their lights come on first and stay bright
  const endM = toon({ map: end(t.n || "") }), roofM = toon({ color: WHITE });
  // BoxGeometry material order: +x, -x, +y, -y, +z, -z
  const box = new THREE.Mesh(new THREE.BoxGeometry(L - 0.2, H, W - 0.3), [endM, endM, roofM, roofM, doorSide > 0 ? sideD : sideP, doorSide > 0 ? sideP : sideD]);
  box.position.y = lift + H / 2; g.add(box); addInk(box.geometry, box, 25, ink);
  // the long-side texture reads left to right from outside, so mirror the far side
  if (doorSide < 0) { const m = sideD.map.clone(); m.needsUpdate = true; m.repeat.x = -1; m.offset.x = 1; m.__key = sideD.map.__key; m.__glow = sideD.map.__glow; const fm = toon({ map: m }); fm.userData.early = true; box.material[5] = fm; }
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
  // item.level: every part of the building stands on one floor level, so roofs meant to line up do line up
  const basePts = item && item.level ? item.parts.flatMap(q => q.p.map(P)) : pts;
  const baseY = Math.min(...basePts.map(([x, z]) => hAt(x, z))) - 0.05; group.position.y = baseY;
  const ink = item ? new THREE.LineBasicMaterial({ color: INK }) : inkMat;
  if (part.trailer) return trailer(part, item, group, pts, baseY, ink);
  const wallMat = part.tent ? toon({ color: part.wall }) : toon({ map: part.barn ? barnUpperTex(part.wall) : part.office ? officeTex(part.wall) : part.plain ? boardTex(part.wall) : part.stucco ? stuccoTex(part.wall) : wallTex(part.wall) });
  const y0 = part.base ? part.base[0] : 0;
  const mats = [wallMat];
  // open: a roof on posts with no walls (a covered entrance or carport)
  const walls = new THREE.Mesh(wallGeom(pts, part.h, y0, part.barn ? 16 : part.bay || 4.4, part.endBays), wallMat); if (!part.open) { group.add(walls); addInk(walls.geometry, group, 25, ink); }
  // skin: a stretch of the building with walls of its own colour, laid just outside the main walls
  (part.skin || []).forEach(sk => {
    const sp = sk.p.map(P), c = centroid(sp), out = sp.map(([x, z]) => { const dx = x - c[0], dz = z - c[1]; return [x + Math.sign(dx) * 0.04, z + Math.sign(dz) * 0.04]; });
    const m = new THREE.Mesh(wallGeom(out, part.h, y0, part.bay || 4.4), toon({ map: sk.plain ? boardTex(sk.wall) : sk.stucco ? stuccoTex(sk.wall) : wallTex(sk.wall) }));
    group.add(m); addInk(m.geometry, group, 25, ink); mats.push(m.material);
  });
  if (part.base) {
    const bw = new THREE.Mesh(wallGeom(pts, y0, 0, part.base[2] === "barn" ? 2.2 : part.base[2] === "small" ? (part.bay || 4.4) : 4.4), toon({ map: part.base[2] === "barn" || part.base[2] === "small" ? barnBaseTex(part.base[1]) : part.base[2] === "plain" ? boardTex(part.base[1]) : part.base[2] === "stone" ? stuccoTex(part.base[1]) : wallTex(part.base[1]) }));
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
  if (part.shed) {
    // mono-pitch roof rising toward the side named in part.shed (n/s/e/w) at the gable pitch, so a lean-to's roof
    // carries the main roof's slope straight on down; the two end walls are filled up to the slope
    const want = { e: [1, 0], w: [-1, 0], s: [0, 1], n: [0, -1] }[part.shed], c = centroid(pts);
    let best = 0, bd = -2;
    pts.forEach((a, i) => { const b = pts[(i + 1) % 4]; let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz); nx /= l; nz /= l;
      if (nx * ((a[0] + b[0]) / 2 - c[0]) + nz * ((a[1] + b[1]) / 2 - c[1]) < 0) { nx = -nx; nz = -nz; }
      const d = nx * want[0] + nz * want[1]; if (d > bd) { bd = d; best = i; } });
    const hiA = pts[best], hiB = pts[(best + 1) % 4], loA = pts[(best + 3) % 4], loB = pts[(best + 2) % 4];
    const depth = Math.hypot(hiA[0] - loA[0], hiA[1] - loA[1]), rise = 0.84 * depth, ov = 0.3;
    const ex = [(hiA[0] - loA[0]) / depth, (hiA[1] - loA[1]) / depth];                 // low side to high side
    const out = (p, k) => [p[0] - ex[0] * ov * k, p[1] - ex[1] * ov * k];
    const V = (p, y) => [p[0], y, p[1]], H = part.h, T = part.h + rise;
    const rp = [...V(out(loA, 1), H - 0.84 * ov), ...V(out(loB, 1), H - 0.84 * ov), ...V(hiB, T), ...V(out(loA, 1), H - 0.84 * ov), ...V(hiB, T), ...V(hiA, T)];
    const ruv = []; for (let i = 0; i < rp.length; i += 3) ruv.push((rp[i] * ex[1] - rp[i + 2] * ex[0]) / 2.2, rp[i + 1] / 0.6);
    const rg = geomFrom(rp, ruv); rg.computeVertexNormals();
    const rm = new THREE.Mesh(rg, toon({ map: roofTex(part.roof), side: THREE.DoubleSide })); group.add(rm); addInk(rg, group, 25, ink);
    const ends = geomFrom([...V(loA, H), ...V(hiA, H), ...V(hiA, T), ...V(loB, H), ...V(hiB, T), ...V(hiB, H)]);
    if (!part.open) { const em = new THREE.Mesh(ends, toon({ map: boardTex(part.wall), side: THREE.DoubleSide })); group.add(em); addInk(ends, group, 25, ink); }
    else [loA, loB].forEach(([x, z]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.18, H, 0.18), toon({ color: "#f6f4ee" })); p.position.set(x, H / 2, z); group.add(p); addInk(p.geometry, p, 25, ink); });
    top = T;
  } else if (part.hip && !part.flat) {
    const hr = hipRoof(pts, part.h);
    const rm = new THREE.Mesh(hr.geom, toon({ map: roofTex(part.roof), side: THREE.DoubleSide })); group.add(rm); addInk(hr.geom, group, 25, ink);
    top = hr.top;
    if (part.chimneys) part.chimneys.forEach(cp => {
      const [x, z] = P(cp), hgt = hr.top - part.h + 1.0;
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.9, hgt, 0.9), toon({ color: "#a5452e" }));
      ch.position.set(x, part.h + hgt / 2 + 0.3, z); group.add(ch); addInk(ch.geometry, ch, 25, ink);
    });
  } else if (pts.length === 4 && !part.flat) {
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
    door.scale.z = 0.62;   // a single glazed door, narrower than the canopy
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
    // hipped hood: a four-sided pyramid turned square to the wall in its own geometry, then stretched along the wall
    // (stretching after turning the mesh skewed it into a lopsided diamond)
    const cg = new THREE.ConeGeometry(1.75, 0.8, 4, 1); cg.rotateY(Math.PI / 4);
    const canopy = new THREE.Mesh(cg, toon({ color: "#23304a" }));
    canopy.visible = !plainDoor && part.porch[3] !== "gable";
    canopy.scale.set(0.75, 1, 1.1);
    canopy.position.set(dir * 0.75, 2.45 + 0.4 + 0.05, 0); ent.add(canopy);   // sits just above the 2.45 m door top addInk(canopy.geometry, canopy, 25, ink);
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 3.2), toon({ color: "#d4cec2" }));
    step.position.set(dir * 0.7 + (part.porch[3] === "gable" ? 2.2 : 0), 0.15, 0); ent.add(step); addInk(step.geometry, step, 25, ink);
  }
  // facade: one wall drawn from a photo — its own windows (metres from the left corner seen from outside, and up from
  // the ground), a grey plinth with cellar windows, and a board-clad gable above with its own windows
  if (part.facade) (Array.isArray(part.facade) ? part.facade : [part.facade]).forEach(fc => {
    const want = { e: [1, 0], w: [-1, 0], s: [0, 1], n: [0, -1] }[fc.side], c0 = centroid(pts);
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
      if (fc.boards) { g.fillStyle = "rgba(0,0,0,.07)"; for (let x = 0; x < w; x += 9) g.fillRect(x, 0, 1.5, h); }   // vertical board cladding
      if (fc.base) { g.fillStyle = fc.base[1]; g.fillRect(0, h - fc.base[0] * PX, w, fc.base[0] * PX); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, h - fc.base[0] * PX, w, 2); }
      (fc.win || []).forEach(([x0, y0, ww, hh, kind]) => win(g, x0, y0, ww, hh, h, kind));
      // gutter downpipes at the corners
      g.fillStyle = "#2b2a29"; g.fillRect(6, 0, 5, h); g.fillRect(w - 11, 0, 5, h);
    });
    withGlow(wt, (fc.win || []).map(([x0, y0, ww, hh]) => [x0 * PX + 4, Hc - (y0 + hh) * PX + 4, ww * PX - 8, hh * PX - 8]));
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
      withGlow(gt, (gc.win || []).map(([x0, y0, ww, hh]) => [x0 * PX + 4, Gc - (y0 + hh) * PX + 4, ww * PX - 8, hh * PX - 8]));
      gt.wrapS = gt.wrapT = THREE.ClampToEdgeWrapping;
      const b0 = at(0, H, o + 0.02), b1 = at(L, H, o + 0.02), b2 = at(L / 2, top - 0.05, o + 0.02);
      const gm = new THREE.Mesh(geomFrom([...b0, ...b1, ...b2], [0, 0, 1, 0, 0.5, 1]), toon({ map: gt }));
      group.add(gm); mats.push(gm.material);
      // the white skirt board where the cladding meets the render
      const sk = new THREE.Mesh(new THREE.BoxGeometry(L + 0.3, 0.16, 0.12), trimMat);
      sk.position.set(...at(L / 2, H + 0.02, o + 0.04)); sk.rotation.y = -Math.atan2(uz, ux); group.add(sk);
    }
  });
  // stoop: a gabled porch roof on white posts over a raised landing, with concrete steps and black railings
  // [x, z, side, landing height]
  // stoops: several entrances on one part, each like part.stoop
  (part.stoops || (part.stoop ? [part.stoop] : [])).forEach(stp => {
    const [x, z] = P(stp), side = stp[2] || "s", LH = stp[3] || 1.2;
    const ent = new THREE.Group(); ent.position.set(x, Math.max(0, hAt(x, z) - baseY - 0.1), z); ent.rotation.y = wallRot(pts, side); group.add(ent);
    const add = (geo, mat, px, py, pz, inkIt = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); ent.add(m); if (inkIt) addInk(geo, m, 25, ink); return m; };
    const conc = toon({ color: "#a9a49b" }), white = toon({ color: "#f8f6f0" });
    const LD = 1.7, SW = 3.0, n = Math.max(2, Math.round(LH / 0.18)), r = LH / n, tr = 0.3;   // as many steps as the height needs
    add(new THREE.BoxGeometry(LD, LH, SW), conc, LD / 2, LH / 2, 0);
    for (let k = 0; k < n - 1; k++) { const d = (n - 1 - k) * tr; add(new THREE.BoxGeometry(d, r, SW - 0.3), conc, LD + d / 2, k * r + r / 2, 0); }
    // glazed double door
    const DH = Math.min(2.3, part.h - LH - 0.3);   // the door always fits under the eaves
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.12, DH, 1.6), toon({ map: canvasTex("door2", 32, 48, (g, w, h) => {
      g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, w, h); g.fillStyle = "#3b4a52"; g.fillRect(3, 3, 12, 40); g.fillRect(17, 3, 12, 40);
      g.strokeStyle = "#26221d"; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
    }) }));
    door.position.set(0.07, LH + DH / 2, 0); ent.add(door);
    if (stp[4] === "steps") door.visible = false;   // just a flight of steps, e.g. down from a deck
    // posts, roof and front gable (an 'open' stoop is just the landing, door and steps)
    if (stp[4] !== "open" && stp[4] !== "steps") {
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
    (LH >= 0.8 ? [-1, 1] : []).forEach(sg => {   // a low landing needs no railing
      const zz = sg * (SW / 2 - 0.2), y1 = LH + 0.9, y2 = 0.9;
      segs.push(new THREE.Vector3(LD - 0.1, y1, zz), new THREE.Vector3(foot, y2, zz));
      for (let t = 0; t <= 1.0001; t += 1 / 8) { const xx = LD - 0.1 + (foot - LD + 0.1) * t, yt = y1 + (y2 - y1) * t, yb = LH - (LH - r) * t - 0.02; segs.push(new THREE.Vector3(xx, Math.max(yb, r), zz), new THREE.Vector3(xx, yt, zz)); }
      const hr = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(foot - LD + 0.1, y1 - y2), 0.08, 0.08), white);
      hr.position.set((LD - 0.1 + foot) / 2, (y1 + y2) / 2 + 0.04, zz); hr.rotation.z = -Math.atan2(y1 - y2, foot - LD + 0.1); ent.add(hr);
    });
    ent.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), new THREE.LineBasicMaterial({ color: "#1f1c1a" })));
  });
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
  // retaining wall: concrete, its top falling from h0 at the first point to h1 at the second, red railing along the top
  // [x0, z0, x1, z1, h0 m, h1 m]
  if (part.retain) {
    const [ax, az, bx, bz, h0, h1] = part.retain, A = P([ax, az]), Bp = P([bx, bz]);
    const L = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), ux = (Bp[0] - A[0]) / L, uz = (Bp[1] - A[1]) / L, cc = centroid(pts);
    let nx = -uz, nz = ux; if (part.retain[6] === "s" ? nz > 0 : nz < 0) { nx = -nx; nz = -nz; }   // n: the open side; the bank lies on retain[6] (default north)
    const ya = hAt(A[0] + nx, A[1] + nz) - baseY, yb = hAt(Bp[0] + nx, Bp[1] + nz) - baseY;          // foot of the wall on the open side
    const rg = new THREE.Group(); rg.position.set(A[0], 0, A[1]); rg.rotation.y = Math.atan2(-(Bp[1] - A[1]), Bp[0] - A[0]); group.add(rg);
    const sh = new THREE.Shape([new THREE.Vector2(0, ya - 0.4), new THREE.Vector2(L, yb - 0.4), new THREE.Vector2(L, yb + h1), new THREE.Vector2(0, ya + h0)]);
    const wg = new THREE.ExtrudeGeometry(sh, { depth: 0.35, bevelEnabled: false }); wg.translate(0, 0, -0.175);
    const wm = new THREE.Mesh(wg, toon({ color: "#cfcbc1" })); rg.add(wm); addInk(wg, wm, 25, ink);
    const red = toon({ color: "#9e2a26" }), n = Math.max(2, Math.round(L / 1.2)), segs = [];
    const hr = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(L, (yb + h1) - (ya + h0)), 0.07, 0.07), red);
    hr.position.set(L / 2, (ya + h0 + yb + h1) / 2 + 1.0, 0); hr.rotation.z = Math.atan2((yb + h1) - (ya + h0), L); rg.add(hr);
    for (let k = 0; k <= n; k++) { const t = k / n, y = ya + h0 + ((yb + h1) - (ya + h0)) * t;
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.0, 0.05), red); p.position.set(L * t, y + 0.5, 0); rg.add(p); }
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

// Kindergarten play-area fence: chain link on round galvanised posts every ~2.4 m, with a top rail, following the ground
(() => {
  const posts = [], spans = [], H = 1.2, SP = 2.4;
  (DATA.fences || []).forEach(line => {
    const pts = line.map(P), seq = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / SP));
      for (let k = 0; k < n; k++) seq.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    seq.push(pts[pts.length - 1]);
    const ys = seq.map(p => hAt(...p));
    seq.forEach((p, i) => posts.push([p[0], ys[i], p[1]]));
    for (let i = 0; i < seq.length - 1; i++) spans.push([seq[i], ys[i], seq[i + 1], ys[i + 1]]);
  });
  if (!posts.length) return;
  const steel = toon({ color: "#9a9d9f" }), o = new THREE.Object3D();
  // diamond wire mesh, mostly see-through
  const wire = canvasTex("chainlink", 64, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.strokeStyle = "rgba(150,154,156,.95)"; g.lineWidth = 2.2;
    for (let k = -64; k <= 64; k += 16) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 64, 64); g.stroke(); g.beginPath(); g.moveTo(k + 64, 0); g.lineTo(k, 64); g.stroke(); }
  });
  wire.wrapS = wire.wrapT = THREE.RepeatWrapping; wire.repeat.set(SP / 0.5, H / 0.5);
  const meshMat = new THREE.MeshBasicMaterial({ map: wire, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, depthWrite: false });
  const pm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.045, H + 0.05, 6), steel, posts.length);
  posts.forEach(([x, y, z], i) => { o.position.set(x, y + H / 2 - 0.05, z); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); o.updateMatrix(); pm.setMatrixAt(i, o.matrix); });
  const rail = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.05, 0.05), steel, spans.length);
  const net = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, H - 0.08), meshMat, spans.length);
  spans.forEach(([a, ya, b, yb], i) => {
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), Ls = Math.hypot(L, yb - ya);
    o.rotation.set(0, -Math.atan2(dz, dx), Math.atan2(yb - ya, L), "YXZ"); o.scale.set(Ls, 1, 1);
    o.position.set((a[0] + b[0]) / 2, (ya + yb) / 2 + H - 0.05, (a[1] + b[1]) / 2); o.updateMatrix(); rail.setMatrixAt(i, o.matrix);
    o.position.y = (ya + yb) / 2 + (H - 0.08) / 2 - 0.03; o.updateMatrix(); net.setMatrixAt(i, o.matrix);
  });
  net.material.userData.noSnow = true;
  scene.add(pm, rail, net);
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
tDisc.addEventListener("click", () => { setDisc(true, true); track("tab/discgolf", "Disc golf tab"); });
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
  if (fly) track((it.g === "d" && it.n !== "DG" ? "hole/" : "place/") + it.n, `${it.n} ${it.en}`);
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
// Opening view: from the entrance on Grimerudvegen, looking west over the farm towards Mjøsa
const HOME = { t: new THREE.Vector3(-40, 0, 25), d: 400, polar: 1.17, az: Math.PI / 2 };   // looking west: west is up
const TOP = { t: new THREE.Vector3(10, 0, 40), d: 520, polar: 0.001, az: Math.PI / 2 };      // west up, like the opening view
const TOP_DISC = { t: new THREE.Vector3(330, 0, -170), d: 1250, polar: 0.001, az: -Math.PI / 2 };
let anim = null;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const posFrom = (t, d, polar, az) => new THREE.Vector3(t.x + d * Math.sin(polar) * Math.sin(az), t.y + d * Math.cos(polar), t.z + d * Math.sin(polar) * Math.cos(az));
// Opening and 2D views fitted to the map's shape. Tuned for a landscape map; on a tall phone screen the
// camera stands back a little to keep the farm's width in view and looks down more steeply, so the farm
// fills the height instead of sitting in a thin strip under a lot of sky.
const tall = () => Math.min(1, Math.max(0, (1.15 - (camera.aspect || 1.4)) / 0.65));   // 0 wide … 1 very tall
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
  // on a tall phone screen stand further back, and aim a little short of the place so it sits in the upper part of
  // the view, clear of the card along the bottom
  const k = tall(), d = Math.max(85, it.size * 3.2) * (1 + 0.45 * k);
  const polar = Math.min(Math.max(controls.getPolarAngle(), 0.6), 1.0), az = controls.getAzimuthalAngle();
  const off = d * 0.16 * k; t.x += Math.sin(az) * off; t.z += Math.cos(az) * off;
  flyTo(t, d, polar, az);
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
const trackTop = () => track("view/2d", "2D view");
// phones: one 2D switch in the drawer instead of the 3D/2D pair
const vmode = document.getElementById("gm-vmode");
vmode.addEventListener("click", () => { const top = vmode.getAttribute("aria-pressed") !== "true"; setMode(top ? "top" : "3d"); if (top) trackTop(); });
btop.addEventListener("click", () => { setMode("top"); trackTop(); });
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
bn.addEventListener("click", () => { const on = bn.getAttribute("aria-pressed") !== "true"; bn.setAttribute("aria-pressed", on); pinsEl.classList.toggle("names", on); if (on) track("view/labels", "All labels shown"); });

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
  if (stars && stars.visible) stars.position.copy(camera.position);
  if (aurora && aurora.visible && !reduce) aurora.children.forEach(m => { m.material.map.offset.x = now * 0.001 * m.userData.drift; });
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
  // an arrow badge with a "toward" point turns to keep pointing that way on screen (the entrance points in)
  for (const it of ITEMS) if (it.toward && !it.pinEl.hidden) {
    const g = it.c, t = P(it.toward), y = hAt(...g);
    v.set(g[0], y, g[1]).project(camera); const ax = v.x * w, ay = -v.y * h;
    v.set(t[0], y, t[1]).project(camera);
    const ang = Math.atan2(-v.y * h - ay, v.x * w - ax);
    (it.arrowEl || (it.arrowEl = it.pinEl.querySelector(".num svg"))).style.transform = `rotate(${ang}rad)`;
  }
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
      if (m.isMeshToonMaterial && m.map && m.map.image && (m.map.__glow || /^w/.test(m.map.__key || ""))) glows.push(m);
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
    skyTop: [C("#a6cbf0"), C("#f2a46b"), C("#0d1426")],
    skyMid: [C("#c2dbf3"), C("#f6c99a"), C("#1a2440")],
    skyLow: [C("#d9e8f5"), C("#e9b98f"), C("#232c44")],
    tint:   [C("#ffffff"), C("#f4c9a4"), C("#46557a")],
    fog:    [C("#bdd3ea"), C("#e7b28a"), C("#1d2640")],   // day haze is a pale blue, so far land fades like the hills
    amb:    [C("#ffffff"), C("#ffd2b0"), C("#8fa3d6")],
    sun:    [C("#fff6e6"), C("#ff9a55"), C("#a9bfff")],
  };
  const ambI = [0.42, 0.36, 0.3], sunI = [0.66, 0.5, 0.22];
  const tmp = new THREE.Color();
  const key = (arr, s, out) => s < 0.5 ? out.copy(arr[0]).lerp(arr[1], s * 2) : out.copy(arr[1]).lerp(arr[2], (s - 0.5) * 2);
  const num = (arr, s) => s < 0.5 ? arr[0] + (arr[1] - arr[0]) * s * 2 : arr[1] + (arr[2] - arr[1]) * (s - 0.5) * 2;
  const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  glows.forEach(m => { m.emissiveMap = m.map.__glow || glowTex; m.emissive.copy(WARM); m.emissiveIntensity = 0; m.needsUpdate = true; });
  poolMat.opacity = 0;
  const sunHome = sun.position.clone();
  // each window-wall colour switches on at its own moment, so lights come on one house at a time
  const lightAt = glows.map((m, i) => m.userData.early ? 0.42 : 0.55 + ((i * 0.6180339) % 1) * 0.3);
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
    if (stars) { const k = smooth(0.62, 0.97, s); stars.visible = k > 0.01; stars.children.forEach((c, i) => { if (c.material) c.material.opacity = k * (i ? 1 : 0.75); });
      const ak = k * snow.value; aurora.visible = ak > 0.01; aurora.children.forEach(m => { m.material.opacity = ak * m.userData.op * 0.8; }); }
    glows.forEach((m, i) => { m.emissiveIntensity = (m.userData.early ? 1.9 : 1.4) * smooth(lightAt[i] - 0.08, lightAt[i] + 0.04, s); });
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
  btn.addEventListener("click", () => { go(!on); if (on) track("view/night", "Night mode"); });
})();

// Touch devices: inline, one finger scrolls the page (taps still pick places) and two fingers move and
// zoom the map; a one-finger sideways drag shows a "use two fingers" note. Full screen gets all gestures.
(() => {
  const btn = document.getElementById("gm-expand"), lbl = btn.querySelector(".tx"), icon = btn.querySelector("path");
  const coarse = matchMedia("(pointer: coarse)");
  const openLabel = () => coarse.matches ? "Utforsk kartet" : "Fullskjerm";
  lbl.textContent = openLabel();
  let full = false, ph = null;
  const passThrough = () => coarse.matches && !full;
  const two = document.getElementById("gm-two"); let t0 = null, twoTimer = 0;
  stage.addEventListener("touchstart", e => { t0 = passThrough() && e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null; }, { capture: true, passive: true });
  stage.addEventListener("touchmove", e => {
    if (!t0 || e.touches.length !== 1) { t0 = null; return; }
    const dx = e.touches[0].clientX - t0[0], dy = e.touches[0].clientY - t0[1];
    if (Math.abs(dx) > 24 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      t0 = null; two.classList.add("show"); clearTimeout(twoTimer); twoTimer = setTimeout(() => two.classList.remove("show"), 3200);
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
    icon.setAttribute("d", on ? "M8 3.5V8H3.5M12 3.5V8h4.5M16.5 12H12v4.5M3.5 12H8v4.5" : "M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12");   // leaving full screen: arrows pointing in, so it never reads as a second close (x) beside the card's
    btn.setAttribute("aria-label", on ? "Lukk fullskjerm · Close full screen" : "Utforsk kartet i fullskjerm · Explore the map full screen");
    resize();
  }
  btn.addEventListener("click", e => { e.stopPropagation(); setFull(!full); if (full) track("view/fullscreen", "Full screen"); });
  // a one-finger swipe on the page shows a toast; tapping it opens the map full screen, where one finger moves it
  two.addEventListener("click", e => { e.stopPropagation(); two.classList.remove("show"); setFull(true); track("view/fullscreen", "Full screen"); });
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
    on = !on; btn.setAttribute("aria-pressed", on); if (on) track("view/winter", "Winter mode");
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
  const open = on => { panel.classList.toggle("open", on); handle.setAttribute("aria-expanded", on); handle.setAttribute("aria-label", on ? "Skjul liste · Hide list" : "Vis liste · Show list"); };
  let y0 = null, swiped = false;
  handle.addEventListener("pointerdown", e => { y0 = e.clientY; swiped = false; });
  addEventListener("pointerup", e => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (Math.abs(dy) > 24) { swiped = true; open(dy < 0); } });
  handle.addEventListener("click", () => { if (swiped) { swiped = false; return; } open(!panel.classList.contains("open")); });
  input.addEventListener("focus", () => { if (sheet()) open(true); });
  // the on-screen keyboard: --kb is how much of the screen it covers, so the sheet (and its results) sit above it
  const vv = window.visualViewport;
  if (vv) {
    const kb = () => root.style.setProperty("--kb", Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop)) + "px");
    vv.addEventListener("resize", kb); vv.addEventListener("scroll", kb); kb();
  }
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
    btn.setAttribute("aria-label", hide ? "Vis liste · Show list" : "Skjul liste · Hide list");
    btn.dataset.tip = hide ? "Vis liste\nShow list" : "Skjul liste\nHide list";
    resize();
  });
})();

// Search: filter both lists as you type; Enter opens the first match
(() => {
  const input = document.getElementById("gm-search"), clear = document.getElementById("gm-sclear"), none = document.getElementById("gm-noresult");
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ø/g, "o").replace(/æ/g, "ae");
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
  input.addEventListener("change", () => { if (input.value.trim()) track("search", "Search used"); });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && first) { select(first, true); input.blur(); }
    if (e.key === "Escape") { input.value = ""; run(); }
  });
  clear.addEventListener("click", () => { input.value = ""; run(); input.focus(); });
})();
