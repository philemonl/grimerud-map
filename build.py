#!/usr/bin/env python3
"""Build the Grimerud Gård map into dist/.

  python3 build.py

Reads the map source (src/app), the places and outlines (src/content) and the heavy data file
(dist/grimerud-map-data.js, written by src/pipeline/build_data.py), and writes:

  dist/grimerud-map.html            standalone page with everything inlined
  dist/grimerud-map-embed.js        styles, markup and map code for the ywam.no embed
  dist/squarespace-codeblock.html   the code block on ywam.no (paste once)

The code block only loads dist/grimerud-map-embed.js from GitHub Pages, so pushing a rebuilt
dist/ to main updates ywam.no within a few minutes (Pages caches files for about 10 minutes).
The data file URL carries a hash of its contents, so browsers fetch it again only when it changes.
"""
import hashlib, json, math, sys
from pathlib import Path

REPO = "philemonl/grimerud-map"
PAGES = "https://philemonl.github.io/grimerud-map/dist/"
EMBED_URL = PAGES + "grimerud-map-embed.js"

ROOT = Path(__file__).resolve().parent
APP, DIST = ROOT / "src" / "app", ROOT / "dist"
sys.path.insert(0, str(ROOT / "src" / "pipeline"))
import paths  # noqa: E402  (puts src/content on the path)
import data, disc  # noqa: E402
from geo import disc_to_world, world_to_site_px  # noqa: E402

FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap">"""


def places():
    """Everything the map draws apart from imagery and terrain: places, disc golf, roads, outlines."""
    def sp(u, v):
        x, z = world_to_site_px(*disc_to_world(u, v)); return [round(x, 1), round(z, 1)]
    holes = []
    for h, tees, b in disc.HOLES:
        bp = sp(*b); tps = [dict(label=l, p=sp(*q)) for l, q in tees]
        length = math.hypot(bp[0] - tps[0]["p"][0], bp[1] - tps[0]["p"][1]) * 0.29188
        holes.append(dict(hole=h, basket=bp, tees=tps, length=round(length)))
    items = list(data.ITEMS)
    pts = [q for d in holes for q in [d["basket"]] + [t["p"] for t in d["tees"]]]
    cx = sum(p[0] for p in pts) / len(pts); cz = sum(p[1] for p in pts) / len(pts)
    items.append(dict(n="DG", g="d", no="Grimerud diskgolfbane", en="Grimerud disc golf course",
                      sub_no="Parker på Grimerud gård og følg den stiplede ruten · ca. 700 m",
                      sub_en="Park at Grimerud gård and follow the dashed route · about 700 m",
                      pin=[round(cx), round(cz)], size=260, disc="all"))
    for d in holes:
        tees = " / ".join(t["label"] for t in d["tees"])
        mid = [(d["basket"][0] + d["tees"][0]["p"][0]) / 2, (d["basket"][1] + d["tees"][0]["p"][1]) / 2]
        items.append(dict(n=str(d["hole"]), g="d", no=f"Hull {d['hole']}", en=f"Hole {d['hole']}",
                          sub_no=f"ca. {d['length']} m · utkast: {tees}", sub_en=f"About {d['length']} m · tee: {tees}",
                          pin=d["basket"], focus=[round(mid[0]), round(mid[1])], size=max(30, d["length"] * 0.55), disc=d["hole"]))
    walk = [[1020, 962], [1040, 925], [1090, 902], [1150, 888], [1210, 872], [1260, 860], [1300, 848], [1340, 838], [1385, 836],
            [1446, 838], [1440, 760], [1428, 588], [1400, 392], [1393, 0]] + data.WALK_FIELD
    return dict(items=items, disc=holes, walk=walk, context=data.CONTEXT, flag=data.FLAG, roads=data.ROADS,
                circle=data.CIRCLE, islands=data.ISLANDS, island_trees=data.ISLAND_TREES, sports=data.SPORTS, hedges=data.HEDGES, fences=data.FENCES,
                gravel=json.load(open(paths.CONTENT / 'gravel.json'))['polys'],
                horizon=json.load(open(paths.CONTENT / 'horizon.json')))


def script(data_url, data_bytes=0):
    loader = (APP / "loader.js").read_text(encoding="utf-8")
    body = (APP / "map.js").read_text(encoding="utf-8")
    body = "\n".join(("    " + l) if l else l for l in body.split("\n"))
    places_json = json.dumps(places(), ensure_ascii=False, separators=(",", ":"))
    for key, val in (("/*@DATA_URL*/\"\"", json.dumps(data_url)), ("/*@DATA_BYTES*/0", str(data_bytes)), ("/*@DATA*/null", places_json), ("    /*@MAP*/", body)):
        assert loader.count(key) == 1, key
        loader = loader.replace(key, val)
    return loader.replace("</script", "<\\/script")


def main():
    css = (APP / "map.css").read_text(encoding="utf-8")
    markup = (APP / "map.html").read_text(encoding="utf-8")
    import base64, re
    markup = re.sub(r'src="(logos/[^"]+\.png)"', lambda m: 'src="data:image/png;base64,' + base64.b64encode((APP / m.group(1)).read_bytes()).decode() + '"', markup)
    heavy = (DIST / "grimerud-map-data.js").read_text(encoding="utf-8")
    data_url = PAGES + "grimerud-map-data.js?v=" + hashlib.sha1(heavy.encode("utf-8")).hexdigest()[:10]

    # Embed script: puts the fonts, styles and markup where the code block sits, then runs the map
    fonts = [l.split('href="')[1].split('"')[0] for l in FONTS.splitlines() if 'rel="stylesheet"' in l]
    embed = f"""/* Grimerud Gård 3D map, built from github.com/{REPO} by build.py. Do not edit by hand. */
(function () {{
  "use strict";
  if (document.getElementById("grimerud-map")) return;
  var mount = document.getElementById("grimerud-map-mount");
  if (!mount) {{ console.error("[Grimerud map] no #grimerud-map-mount on the page"); return; }}
  {json.dumps(fonts)}.forEach(function (href) {{
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
  }});
  var st = document.createElement("style"); st.textContent = {json.dumps(css)}; document.head.appendChild(st);
  mount.outerHTML = {json.dumps(markup.replace('<div id="grimerud-map">', f'<div id="grimerud-map" data-src="{data_url}">', 1))};
}})();
{script(data_url, len(heavy.encode("utf-8")))}
"""
    # ASCII only (non-ASCII as \\u escapes), so Norwegian letters survive however the file is served
    def esc(c):
        o = ord(c)
        if o < 128: return c
        if o < 0x10000: return f"\\u{o:04x}"
        o -= 0x10000; return f"\\u{0xd800 + (o >> 10):04x}\\u{0xdc00 + (o & 0x3ff):04x}"
    embed = "".join(esc(c) for c in embed)
    (DIST / "grimerud-map-embed.js").write_text(embed, encoding="utf-8")

    block = f"""<!-- Grimerud Gård 3D map: paste once into a Squarespace Code Block (Display Source off).
     It loads the map from GitHub Pages, so pushing to github.com/{REPO} updates it without re-pasting. -->
<div id="grimerud-map-mount" style="min-height:560px"></div>
<script src="{EMBED_URL}" charset="utf-8" defer></script>
"""
    (DIST / "squarespace-codeblock.html").write_text(block, encoding="utf-8")

    page = f"""<!doctype html>
<html lang="no">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Grimerud Gård Map</title>
{FONTS}
<style>
html, body {{ margin: 0; background: #f1efe8; }}
#grimerud-map[data-fill] .app {{ height: 100vh; height: 100dvh; min-height: 0; }}
@container gm (max-width: 760px) {{ #grimerud-map[data-fill] .app {{ height: auto; }} }}
{css}</style>
</head>
<body>
{markup.replace('<div id="grimerud-map">', '<div id="grimerud-map" data-fill>', 1)}<script>
{heavy}</script>
<script>
{script("")}</script>
</body>
</html>
"""
    (DIST / "grimerud-map.html").write_text(page, encoding="utf-8")
    for f in ("squarespace-codeblock.html", "grimerud-map-embed.js", "grimerud-map.html", "grimerud-map-data.js"):
        print(f"dist/{f}  {(DIST / f).stat().st_size / 1024:,.0f} KB")


if __name__ == "__main__":
    main()
