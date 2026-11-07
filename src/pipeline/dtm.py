from paths import B
import math, subprocess, numpy as np
from pyproj import Transformer
LAT0,LON0=60.73975,11.13256
R=6378137.0
cosl=math.cos(math.radians(LAT0))
mx0=math.radians(LON0)*R; my0=math.log(math.tan(math.pi/4+math.radians(LAT0)/2))*R
def world_to_ll(x,z):
    # world metres (ground-scaled mercator), x east, z south
    mx=mx0+x/cosl; my=my0-z/cosl
    lon=math.degrees(mx/R); lat=math.degrees(2*math.atan(math.exp(my/R))-math.pi/2); return lat,lon
tr=Transformer.from_crs(4326,25833,always_xy=True)
pts=[world_to_ll(x,z) for x in (-500,1175) for z in (-800,875)]
E=[tr.transform(lo,la) for la,lo in pts]
xs=[e[0] for e in E]; ys=[e[1] for e in E]
bb=(min(xs)-20,min(ys)-20,max(xs)+20,max(ys)+20); print(bb)
url=("https://wcs.geonorge.no/skwms1/wcs.hoyde-dtm-nhm-25833?service=WCS&version=2.0.1&request=GetCoverage"
     f"&coverageId=nhm_dtm_topo_25833&format=image/tiff&subset=x({bb[0]:.0f},{bb[2]:.0f})&subset=y({bb[1]:.0f},{bb[3]:.0f})")
print(subprocess.run(['curl','-sS','-m','120','-o',B+'dtm/dtm.tif','-w','%{http_code} %{size_download}',url],capture_output=True,text=True).stdout)
open(B+'dtm/bbox.txt','w').write(' '.join(f'{v:.0f}' for v in bb))
