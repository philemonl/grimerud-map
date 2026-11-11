# Writes grimerud-map-data.js (the heavy assets the embed loads) from the current build
from paths import B
import base64, cv2, json, sys
import io
from PIL import Image
def webp(path, size=None, q=82):
    # Pillow's slowest WebP effort (method 6): same quality setting, about 5-10% smaller than OpenCV's encoder
    im=cv2.imread(path)
    if size: im=cv2.resize(im,(size,size),interpolation=cv2.INTER_AREA)
    b=io.BytesIO(); Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)).save(b,'WEBP',quality=q,method=6)
    return 'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
S=B+'style/'
import zlib
import numpy as np
def grid_z(d):
    """Pack a square grid of uint16 heights losslessly, about a third smaller than plain delta + zlib: each height is
    predicted from its neighbours (left + up - up-left), the residuals zigzag-coded, their low and high bytes stored
    as two planes, then zlib. src/app/loader.js (unpackGrid) undoes it into d.v."""
    v=np.frombuffer(base64.b64decode(d['data']),np.uint16).astype(np.int32); n=int(round(len(v)**.5)); V=v.reshape(n,n)
    P=np.zeros_like(V); P[1:,1:]=V[1:,:-1]+V[:-1,1:]-V[:-1,:-1]; P[0,1:]=V[0,:-1]; P[1:,0]=V[:-1,0]
    r=(V-P).astype(np.int32); zz=((r<<1)^(r>>31)).astype(np.uint32)
    assert zz.max()<65536
    zz=zz.astype(np.uint16).ravel()
    d['data']=base64.b64encode(zlib.compress((zz&255).astype(np.uint8).tobytes()+(zz>>8).astype(np.uint8).tobytes(),9)).decode()
    d['grid']=n; return json.dumps(d)
def terrain_z(): return grid_z(json.load(open(S+'terrain.json')))
from paths import DIST
out=sys.argv[1] if len(sys.argv)>1 else str(DIST/'grimerud-map-data.js')
parts=[
 ('GROUND_SITE', json.dumps(webp(S+'ground_site_hs.png'))),
 ('GROUND_CTX', json.dumps(webp(S+'ground_ctx_hs.png',2048,80))),
 ('TREES', open(S+'trees.json').read()),
 ('TERRAIN', terrain_z()),
 ('FAR', grid_z(json.load(open(S+'far.json')))),
 ('FAR_IMG', json.dumps(webp(S+'far.jpg',None,78))),
 ('OUTER', grid_z(json.load(open(S+'outer.json')))),
 ('OUTER_IMG', json.dumps(webp(S+'outer.jpg',None,76))),
]
with open(out,'w') as f:
    f.write('/* Grimerud Gård map data: ground imagery (© Esri, Maxar, Earthstar Geographics), terrain (Kartverket DTM), trees. */\nwindow.GRIMERUD_MAP_DATA = {\n')
    f.write(',\n'.join(f'{k}: {v}' for k,v in parts)); f.write('\n};\n')
print(out)
