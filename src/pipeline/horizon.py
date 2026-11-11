"""The real skyline round Grimerud, for the hill ranges on the map's horizon.

Fetches a coarse height model (200 m cells, 70 km each way) from Geonorge and, for every direction from the farm,
finds how high the land stands above the horizon in three distance bands: just beyond the painted landscape,
the middle distance, and the far ridges. Earth curvature and refraction are allowed for. Writes
src/content/horizon.json: for each ring of hills, its radius and the height (m above the farm) of its ridge at
every vertex, so map.js only has to draw them.
"""
from paths import B, CONTENT
import math, json, subprocess, os, numpy as np, tifffile
from scipy.ndimage import map_coordinates, gaussian_filter1d
from pyproj import Transformer
LAT0,LON0=60.73975,11.13256; R=6378137.0; cosl=math.cos(math.radians(LAT0))
mx0=math.radians(LON0)*R; my0=math.log(math.tan(math.pi/4+math.radians(LAT0)/2))*R
tr=Transformer.from_crs(4326,25833,always_xy=True)
def to_en(X,Z):   # world metres (x east, z south) -> UTM 33
    mx=mx0+X/cosl; my=my0-Z/cosl
    return tr.transform(np.degrees(mx/R),np.degrees(2*np.arctan(np.exp(my/R))-np.pi/2))
e0,n0=tr.transform(LON0,LAT0); HALF=70000; W=700
f=B+'dtm/horizon.tif'
if not os.path.exists(f):
    url=("https://wcs.geonorge.no/skwms1/wcs.hoyde-dtm-nhm-25833?service=WCS&version=1.0.0&request=GetCoverage&coverage=nhm_dtm_topo_25833"
         f"&crs=EPSG:25833&bbox={e0-HALF:.0f},{n0-HALF:.0f},{e0+HALF:.0f},{n0+HALF:.0f}&width={W}&height={W}&format=GeoTIFF")
    subprocess.run(['curl','-sS','-m','200','-o',f,url],check=True)
dem=tifffile.imread(f).astype(np.float64); dem[dem<0]=123.0   # no data over water -> Mjøsa's surface
cell=2*HALF/W
def height(X,Z):
    e,n=to_en(X,Z); return map_coordinates(dem,[(n0+HALF-n)/cell-0.5,(e-(e0-HALF))/cell-0.5],order=1,mode='nearest')
EYE=215.0                      # a viewer a little above the farmyard (196 m)
REFF=6371000/(1-0.13)          # earth radius with standard refraction
CENTRE=(-1000.0,0.0); SEGS=360
# ring radius (m, round CENTRE: just outside the painted landscape) and the band of distances from the farm it stands for
RINGS=[(6000,None,14000),(6700,14000,30000),(7500,30000,68000)]
out=[]
for R0,d0,d1 in RINGS:
    hs=[]
    for i in range(SEGS):
        a=i/SEGS*2*math.pi; vx,vz=CENTRE[0]+math.cos(a)*R0,CENTRE[1]+math.sin(a)*R0
        rv=math.hypot(vx,vz); ux,uz=vx/rv,vz/rv
        d=np.arange(d0 or rv,d1,150.0)
        ang=(height(ux*d,uz*d)-d*d/(2*REFF)-EYE)/d
        hs.append(float(ang.max()*rv))            # height above the viewer at the ring's own distance
    hs=gaussian_filter1d(np.array(hs),1.2,mode='wrap')
    out.append(dict(r=R0,h=[round(float(v),1) for v in hs]))
    print(R0,'min',round(hs.min()),'max',round(hs.max()),'W',round(hs[180]),'N',round(hs[270]),'E',round(hs[0]),'S',round(hs[90]))
json.dump(dict(centre=CENTRE,eye=EYE,rings=out),open(CONTENT/'horizon.json','w'),separators=(',',':'))
