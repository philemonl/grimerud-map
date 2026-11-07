#!/usr/bin/env python3
"""Build the Grimerud Gård map into dist/.

  python3 build.py

Reads the map source (src/app), the places and outlines (src/content) and the heavy data file
(dist/grimerud-map-data.js, written by src/pipeline/build_data.py), and writes:

  dist/grimerud-map.html            standalone page with everything inlined
  dist/squarespace-codeblock.html   paste into the Squarespace code block on ywam.no

The code block loads the data file from jsDelivr at DATA_TAG. After changing the data file:
commit, tag the commit (git tag v3 && git push --tags), bump DATA_TAG, rebuild.
"""
import json, math, sys
from pathlib import Path

DATA_TAG = "v3"
REPO = "philemonl/grimerud-map"
DATA_URL = f"https://cdn.jsdelivr.net/gh/{REPO}@{DATA_TAG}/dist/grimerud-map-data.js"

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
    walk = [[1020, 962], [1048, 925], [1080, 910], [1150, 893], [1228, 872], [1300, 850], [1385, 834],
            [1446, 836], [1440, 760], [1428, 588], [1400, 392], [1393, 0]] + data.WALK_FIELD
    return dict(items=items, disc=holes, walk=walk, context=data.CONTEXT, flag=data.FLAG, roads=data.ROADS,
                circle=data.CIRCLE, island=data.ISLAND, yard=data.YARD, sports=data.SPORTS, hedges=data.HEDGES)


def script(data_url):
    loader = (APP / "loader.js").read_text(encoding="utf-8")
    body = (APP / "map.js").read_text(encoding="utf-8")
    body = "\n".join(("    " + l) if l else l for l in body.split("\n"))
    places_json = json.dumps(places(), ensure_ascii=False, separators=(",", ":"))
    for key, val in (("/*@DATA_URL*/\"\"", json.dumps(data_url)), ("/*@DATA*/null", places_json), ("    /*@MAP*/", body)):
        assert loader.count(key) == 1, key
        loader = loader.replace(key, val)
    return loader.replace("</script", "<\\/script")


def main():
    css = (APP / "map.css").read_text(encoding="utf-8")
    markup = (APP / "map.html").read_text(encoding="utf-8")
    heavy = (DIST / "grimerud-map-data.js").read_text(encoding="utf-8")

    block = f"""<!-- Grimerud Gård 3D map: paste into a Squarespace Code Block (Display Source off).
     Built from github.com/{REPO}; loads its imagery and terrain from jsDelivr ({DATA_TAG}). Do not edit by hand. -->
{FONTS}
<style>
{css}</style>
{markup.replace('<div id="grimerud-map">', f'<div id="grimerud-map" data-src="{DATA_URL}">', 1)}<script>
{script(DATA_URL)}</script>
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
    for f in ("squarespace-codeblock.html", "grimerud-map.html", "grimerud-map-data.js"):
        print(f"dist/{f}  {(DIST / f).stat().st_size / 1024:,.0f} KB")


if __name__ == "__main__":
    main()
