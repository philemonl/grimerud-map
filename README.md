# Grimerud Gård map

Illustrated 3D map of Grimerud Gård (YWAM Grimerud, Grimerudvegen 77, Ottestad), with an optional layer for the Grimerud disc golf course. It runs in the browser with three.js and can be embedded in a Squarespace code block.

**Live map:** https://philemonl.github.io/grimerud-map/dist/grimerud-map.html

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
  grimerud-map-data.js           imagery, terrain, trees, distant landscape
  grimerud-map-embed.js          styles, markup and map code for the Squarespace embed
  squarespace-codeblock.html     the code block on the Squarespace site (pasted once; loads the embed from Pages)
build/                           gitignored: tiles, terrain model, painted intermediates
```

Coordinates in `src/content` are pixels of the 1792 px zoom-18 satellite mosaic (0.29188 m per pixel).

## How the live site updates

GitHub Pages serves this repo from `main`. The code block on the Squarespace site is pasted once and only loads `dist/grimerud-map-embed.js` from `https://philemonl.github.io/grimerud-map/dist/`. That file loads the data file, whose URL carries a hash of its contents.

**Whatever is in `dist/` on `main` is live.** A push shows up on the site within about 10 minutes, the time Pages caches files. No tags, releases or re-pasting.

## Everyday changes

Names, descriptions, outlines, colours, roads, or anything in the app:

1. Edit `src/content/*.py` or `src/app/*`.
2. `python3 build.py`, then open `dist/grimerud-map.html` to check it.
3. Commit and push to `main`.

Map rules:

- **All roads connect.** No road or path may stop short of the road, yard or building it meets. `_connect()` in
  `src/content/data.py` carries each road end within 30 px on to the nearest road (or the roundabout ring, or failing
  that a building, the car park or a gravel yard), and the ground painter draws roads with round ends and no ink
  outline where they run onto a gravel pad. Changing roads means re-running the ground step (see below).

## Rebuilding the imagery and terrain

Only needed when the ground painting, trees, terrain or distant landscape change, such as after moving a road or a building outline. Needs Python with numpy, scipy, opencv, pillow, pyproj and tifffile. Downloads and intermediates go to `build/`.

1. `src/pipeline/mosaic.py`: fetch Esri World Imagery tiles into mosaics.
2. `src/pipeline/dtm.py`: fetch the Kartverket 1 m terrain model (WCS).
3. `src/pipeline/stylize2.py`: paint the illustrated ground and place trees.
4. `src/pipeline/terrain.py`: build the heightmap (with level pads under buildings) and hill shading.
5. `src/pipeline/far.py`: paint the distant landscape and Mjøsa.
6. `src/pipeline/build_data.py`: write `dist/grimerud-map-data.js`.

Then `python3 build.py`, commit and push to `main`, as for everyday changes.

### Levelling the ground without the height service

`python3 src/pipeline/level.py` flattens (or, with `grade=`, slopes) the ground under every building on the saved
heightmap and redoes the hill shading. It always starts from `build/style/terrain_base.json`, so repeated runs never
sink the ground; copy `terrain.json` there after a fresh `terrain.py` run.

### Gravel yards and lanes

`src/content/gravel.json` holds the outline of all bare gravel on the farm, picked out by colour from the
norgeibilder.no orthophotos. To redo it, put the photos in `build/ortho/` with `reg.json` (one 2x3 affine per photo,
photo px to mosaic px) and run `python3 src/pipeline/gravel.py`, then the ground step. Roads in `data.py` should run
along that gravel; they carry the public roads, everything outside the photos, and bridge the gaps under trees.

### Horizon

Beyond the painted landscape the map shows the real country round Grimerud. `python3 src/pipeline/horizon.py` fetches
a coarse height model (70 km each way) from Geonorge; `python3 src/pipeline/outer.py` then paints Esri imagery of the
35 km round the farm in the map's palette and writes `build/style/outer.jpg` and `outer.json`. `map.js` drapes it as
real terrain (Mjøsa, Helgøya, the Toten hills), pulls the distant part in towards the camera so every ridge keeps its
true bearing and height above the horizon, and tints it bluer with distance. `src/content/horizon.json` holds the
skyline past 35 km, drawn as one pale ridge. Run both, then `build_data.py` and `build.py`, only if that range changes.

## Analytics

`loader.js` loads GoatCounter (philemon.goatcounter.com; cookieless, so no consent banner) unless the page already has
it, and skips it in claude.ai previews and on local files. Besides the page view it counts these events, each at most
once per 3 s: `map/loaded`, `map/place/<n>` and `map/hole/<n>` (a place or hole opened by a tap, the list or search),
`map/tab/discgolf`, `map/search`, and `map/view/2d|labels|night|winter|fullscreen` when those are switched on.
In GoatCounter, events are listed with the pages; untick "Hide events" if they don't show.

## Squarespace

The code block (Display Source off) holds the contents of `dist/squarespace-codeblock.html`. It only needs re-pasting if that file itself changes, which happens only if the Pages address moves.

`src/tools/check.py` lists any road or path that runs under a building.

## Credits

Numbers 1–9 follow the printed site map by Jan Willem Middag. Ground imagery © Esri, Maxar, Earthstar Geographics. Terrain from the Kartverket DTM. Disc golf layout after UDisc. Positions and heights are approximate.
