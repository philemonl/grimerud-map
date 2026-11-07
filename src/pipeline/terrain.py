from paths import B
import math, json, base64, numpy as np, tifffile, cv2
from pyproj import Transformer
from scipy.ndimage import map_coordinates
LAT0,LON0=60.73975,11.13256; R=6378137.0; cosl=math.cos(math.radians(LAT0))
mx0=math.radians(LON0)*R; my0=math.log(math.tan(math.pi/4+math.radians(LAT0)/2))*R
tr=Transformer.from_crs(4326,25833,always_xy=True)
dem=tifffile.imread(B+'dtm/dtm.tif').astype(np.float64)
a,b,c,d=[float(v) for v in open(B+'dtm/bbox.txt').read().split()]
H,W=dem.shape; sx=(c-a)/W; sy=(d-b)/H
def heights(X,Z):
    mx=mx0+X/cosl; my=my0-Z/cosl
    lon=np.degrees(mx/R); lat=np.degrees(2*np.arctan(np.exp(my/R))-np.pi/2)
    e,n=tr.transform(lon,lat)
    col=(e-a)/sx-0.5; row=(d-n)/sy-0.5
    return map_coordinates(dem,[row,col],order=1,mode='nearest')
S=1792*0.29188; CTX_S=1643.86816; CX=336.24576; CZ=37.36064
h0=float(heights(np.array([0.0]),np.array([0.0]))[0])
# heightmap for the page: covers the context square
N=600; xs=np.linspace(CX-CTX_S/2,CX+CTX_S/2,N); zs=np.linspace(CZ-CTX_S/2,CZ+CTX_S/2,N); X,Z=np.meshgrid(xs,zs)
Hm=heights(X.ravel(),Z.ravel()).reshape(N,N)
import sys; import data
M=0.29188; step=CTX_S/(N-1)
def wpx(p): return [((p[0]-896)*M-xs[0])/step,((p[1]-896)*M-zs[0])/step]
parts=[q for it in data.ITEMS for q in it.get('parts',[])]+data.CONTEXT
for q in parts:
    poly=np.array([wpx(p) for p in q['p']],np.float32)
    inner=np.zeros((N,N),np.uint8); cv2.fillPoly(inner,[np.round(poly*4).astype(np.int32)],1,shift=2)
    pad=cv2.dilate(inner,np.ones((3,3),np.uint8))  # ~2 m apron
    # tents sit at the bottom of the slope; buildings sit at the middle height of their plot
    level=float(np.percentile(Hm[pad>0],3)) if q.get('tent') else float(np.median(Hm[pad>0]))
    # blend out over ~6 m around the apron
    dd=cv2.distanceTransform((1-pad).astype(np.uint8),cv2.DIST_L2,3)
    w=np.clip(1-dd/3.0,0,1); w=w*w*(3-2*w)
    Hm=Hm*(1-w)+level*w
hmin=float(Hm.min())
q=np.round((Hm-hmin)*100).astype('<u2')
json.dump(dict(n=N,x0=float(xs[0]),z0=float(zs[0]),size=CTX_S,hmin=hmin,h0=h0,data=base64.b64encode(q.tobytes()).decode()),open(B+'style/terrain.json','w'))
print('h0',h0,'range',hmin,Hm.max())
def hillshade(img_path,out_path,size,cx,cz):
    im=cv2.imread(img_path).astype(np.float32)/255; n=im.shape[0]
    g=np.linspace(-size/2,size/2,n); X,Z=np.meshgrid(g+cx,g+cz)
    hh=heights(X.ravel(),Z.ravel()).reshape(n,n)
    hh=cv2.GaussianBlur(hh.astype(np.float32),(0,0),max(1,2.0/(size/n)))
    s=size/n; ex=2.5
    dzdx=np.gradient(hh,s,axis=1)*ex; dzdz=np.gradient(hh,s,axis=0)*ex
    nrm=np.dstack([-dzdx,np.ones_like(hh),-dzdz]); nrm/=np.linalg.norm(nrm,axis=2,keepdims=True)
    L=np.array([-0.55,0.75,-0.37]); L/=np.linalg.norm(L)
    sh=nrm@L; flat=L[1]
    f=np.clip(1+1.15*(sh-flat),0.8,1.12)[...,None]
    # warm the lit side and cool the shaded side slightly, like a painted relief
    warm=np.array([0.97,1.0,1.04]); cool=np.array([1.06,1.0,0.94])  # BGR
    tint=np.where(f>1,warm,cool)
    out=np.clip(im*f*(1+(tint-1)*np.abs(f-1)*2),0,1)
    cv2.imwrite(out_path,(out*255).astype(np.uint8))
import scipy.interpolate as si
_gi=si.RegularGridInterpolator((zs,xs),Hm,bounds_error=False,fill_value=None)
heights=lambda X,Z: _gi(np.c_[Z,X]) + 0*X
hillshade(B+'style/ground_site.png',B+'style/ground_site_hs.png',S,0,0)
hillshade(B+'style/ground_ctx.png',B+'style/ground_ctx_hs.png',CTX_S,CX,CZ)
