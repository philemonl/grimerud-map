# Writes grimerud-map-data.js (the heavy assets the ywam.no embed loads) from the current build
from paths import B
import base64, cv2, json, sys
def webp(path, size=None, q=82):
    im=cv2.imread(path)
    if size: im=cv2.resize(im,(size,size),interpolation=cv2.INTER_AREA)
    ok,b=cv2.imencode('.webp',im,[cv2.IMWRITE_WEBP_QUALITY,q]); return 'data:image/webp;base64,'+base64.b64encode(b.tobytes()).decode()
S=B+'style/'
import zlib
import numpy as np
def terrain_z():
    # same layout as terrain.json, but the uint16 heights are delta-coded then zlib-compressed
    # (about half the size); src/app/loader.js undoes both
    d=json.load(open(S+'terrain.json')); v=np.frombuffer(base64.b64decode(d['data']),np.uint16)
    dv=np.diff(v,prepend=np.uint16(0)).astype(np.uint16)
    d['data']=base64.b64encode(zlib.compress(dv.tobytes(),9)).decode(); return json.dumps(d)
from paths import DIST
out=sys.argv[1] if len(sys.argv)>1 else str(DIST/'grimerud-map-data.js')
parts=[
 ('GROUND_SITE', json.dumps(webp(S+'ground_site_hs.png'))),
 ('GROUND_CTX', json.dumps(webp(S+'ground_ctx_hs.png',2048,80))),
 ('TREES', open(S+'trees.json').read()),
 ('TERRAIN', terrain_z()),
 ('FAR', open(S+'far.json').read()),
 ('FAR_IMG', json.dumps(webp(S+'far.jpg',None,78))),
 ('OUTER', open(S+'outer.json').read()),
 ('OUTER_IMG', json.dumps(webp(S+'outer.jpg',None,76))),
]
with open(out,'w') as f:
    f.write('/* Grimerud Gård map data: ground imagery (© Esri, Maxar, Earthstar Geographics), terrain (Kartverket DTM), trees. */\nwindow.GRIMERUD_MAP_DATA = {\n')
    f.write(',\n'.join(f'{k}: {v}' for k,v in parts)); f.write('\n};\n')
print(out)
