# Grimerud Gård map

Illustrated 3D map of Grimerud Gård (YWAM Grimerud, Grimerudvegen 77, Ottestad), with an optional layer for the Grimerud disc golf course. It runs in the browser with three.js and can be embedded in a Squarespace code block.

## Layout

```
build.py                         one command: src/ → dist/
src/
  app/                           the map, written once for every output
    map.html                     markup (ids prefixed gm-)
    map.css                      styles, all scoped to #grimerud-map
    map.js                       scene, pins, legend, controls
    loader.js                    loads three.js + the data file, then runs map.js
  content/                       hand-edited facts
    data.py                      places, building outlines, roads, sports, hedges
    disc.py                      disc golf tees and baskets (UDisc screenshot pixels)
    disc_transform.json          maps those pixels onto the satellite mosaic
  pipeline/                      paints the ground and builds terrain (slow; needs network)
  tools/                         debug helpers: check.py, crop.py, ov.py
dist/                            built files: never edit by hand
  grimerud-map.html              standalone page, everything inlined
  grimerud-map-data.js           imagery, terrain, trees, distant landscape (served by jsDelivr)
  squarespace-codeblock.html     paste into the code block on ywam.no
build/                           gitignored: tiles, terrain model, painted intermediates
```

Coordinates in `src/content` are pixels of the 1792 px zoom-18 satellite mosaic (0.29188 m per pixel).

## Everyday changes

Names, descriptions, outlines, colours, roads, or anything in the app:

1. Edit `src/content/*.py` or `src/app/*`.
2. `python3 build.py`
3. Commit, then paste `dist/squarespace-codeblock.html` into the Squarespace code block.

The data file does not change, so no new tag is needed.

## Rebuilding the imagery and terrain

Only needed when the ground painting, trees, terrain or distant landscape change. Needs Python with numpy, scipy, opencv, pillow, pyproj and tifffile. Downloads and intermediates go to `build/`.

1. `src/pipeline/mosaic.py`: fetch Esri World Imagery tiles into mosaics.
2. `src/pipeline/dtm.py`: fetch the Kartverket 1 m terrain model (WCS).
3. `src/pipeline/stylize2.py`: paint the illustrated ground and place trees.
4. `src/pipeline/terrain.py`: build the heightmap (with level pads under buildings) and hill shading.
5. `src/pipeline/far.py`: paint the distant landscape and Mjøsa.
6. `src/pipeline/build_data.py`: write `dist/grimerud-map-data.js`.

Then publish it as a new version:

1. Commit, tag and push: `git tag v3 && git push origin main --tags`.
2. Set `DATA_TAG = "v3"` in `build.py`, run `python3 build.py`, commit.
3. Paste the new `dist/squarespace-codeblock.html` into Squarespace.

The live site keeps loading the tagged version it points at, so pushing to the repo never changes ywam.no by itself.

`src/tools/check.py` lists any road or path that runs under a building.

## Credits

Numbers 1–9 follow the printed site map by Jan Willem Middag. Ground imagery © Esri, Maxar, Earthstar Geographics. Terrain from the Kartverket DTM. Disc golf layout after UDisc. Positions and heights are approximate.
