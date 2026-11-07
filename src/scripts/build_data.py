# Writes grimerud-map-data.js (the heavy assets the ywam.no embed loads) from the current build
import base64, cv2, json, sys
def webp(path, size=None, q=82):
    im=cv2.imread(path)
    if size: im=cv2.resize(im,(size,size),interpolation=cv2.INTER_AREA)
    ok,b=cv2.imencode('.webp',im,[cv2.IMWRITE_WEBP_QUALITY,q]); return 'data:image/webp;base64,'+base64.b64encode(b.tobytes()).decode()
S='/home/claude/style/'
import zlib
def terrain_z():
    # same layout as terrain.json, but the uint16 heights are zlib-compressed (the embed inflates them)
    d=json.load(open(S+'terrain.json')); raw=base64.b64decode(d['data'])
    d['data']=base64.b64encode(zlib.compress(raw,9)).decode(); return json.dumps(d)
out=sys.argv[1]
parts=[
 ('GROUND_SITE', json.dumps(webp(S+'ground_site_hs.png'))),
 ('GROUND_CTX', json.dumps(webp(S+'ground_ctx_hs.png',2048,80))),
 ('TREES', open(S+'trees.json').read()),
 ('TERRAIN', terrain_z()),
 ('FAR', open(S+'far.json').read()),
 ('FAR_IMG', json.dumps(webp(S+'far.jpg',None,78))),
]
with open(out,'w') as f:
    f.write('/* Grimerud Gård map data: ground imagery (© Esri, Maxar, Earthstar Geographics), terrain (Kartverket DTM), trees. */\nwindow.GRIMERUD_MAP_DATA = {\n')
    f.write(',\n'.join(f'{k}: {v}' for k,v in parts)); f.write('\n};\n')
print(out)
