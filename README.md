# Grimerud Gård map

Illustrated 3D map of Grimerud Gård (YWAM Grimerud, Grimerudvegen 77, Ottestad), with an optional layer for the Grimerud disc golf course. It runs in the browser with three.js.

## Files

| File | What it is |
|---|---|
| `grimerud-map.html` | The complete map as one self-contained page, with all imagery and data built in. Open it in a browser. |
| `grimerud-map-data.js` | The heavy assets on their own (ground imagery, terrain, trees, distant landscape) as `window.GRIMERUD_MAP_DATA`, for the embed on ywam.no. |
| `src/template.html` | Page source. The build fills in the `__SITE__`, `__CTX__`, `__DATA__`, `__TREES__`, `__TERRAIN__`, `__FAR__` and `__FARIMG__` placeholders. |
| `src/scripts/data.py` | Places, building outlines, roads, sports, hedges. Coordinates are pixels of the 1792 px zoom-18 satellite mosaic (0.29188 m per pixel). |
| `src/scripts/disc.py` | Disc golf tees and baskets, traced from the UDisc course map. |
| `src/scripts/*.py` | Build pipeline (see below). |

## Building

The scripts expect the working layout they were written in (`/home/claude/...`). Satellite tiles and terrain are fetched at build time and are not stored here.

1. `mosaic.py`: fetch Esri World Imagery tiles into mosaics.
2. `dtm.py`: fetch the Kartverket 1 m terrain model (WCS).
3. `stylize2.py`: paint the illustrated ground and place trees.
4. `terrain.py`: build the heightmap (with level pads under buildings) and hill shading.
5. `far.py`: paint the distant landscape and Mjøsa.
6. `build2.py`: write `grimerud-map.html`.
7. `build_data.py <out>`: write `grimerud-map-data.js`.

`check.py` lists any road or path that runs under a building.

## Credits

Numbers 1–9 follow the printed site map by Jan Willem Middag. Ground imagery © Esri, Maxar, Earthstar Geographics. Terrain from the Kartverket DTM. Disc golf layout after UDisc. Positions and heights are approximate.
