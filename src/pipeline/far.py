from paths import B
import sys, math, json, base64, subprocess, numpy as np, cv2
from geo import g18_to_world
from stylize import classify, PAL, ORDER
from pyproj import Transformer
Z=14; X0,Y0,N=8693,4685,9
k=2**(18-Z)
wx0,wz0=g18_to_world(X0*256*k,Y0*256*k); wx1,wz1=g18_to_world((X0+N)*256*k,(Y0+N)*256*k)
SIZE=wx1-wx0; CX=(wx0+wx1)/2; CZ=(wz0+wz1)/2
print('far size',SIZE,'centre',CX,CZ)
img=cv2.cvtColor(cv2.imread(B+'ref/far14.jpg'),cv2.COLOR_BGR2RGB).astype(np.float32)/255
img=cv2.resize(img,(1536,1536),interpolation=cv2.INTER_AREA)
lum=img.mean(-1)
# water: very dark, smooth, in big connected bodies
sm=cv2.GaussianBlur(lum,(0,0),3)
water=(sm<0.13).astype(np.uint8)
water=cv2.morphologyEx(water,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(water)
keep=np.zeros_like(water)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]>4000: keep[lab==i]=1
keep=cv2.morphologyEx(keep,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
# land: same classes and palette as the farm, softened for distance
_,cls,_,_,_=classify(img)
out=np.zeros_like(img)
for i,kk in enumerate(ORDER): out[cls==i]=PAL[kk]
out=cv2.GaussianBlur(out,(0,0),2.2)
hp=lum-cv2.GaussianBlur(lum,(0,0),4); out=out*(1+np.clip(hp*1.6,-.2,.2)[...,None])
# lake: painted blue, deeper away from shore, with a pale shoreline band and ink edge
d=cv2.distanceTransform(keep,cv2.DIST_L2,5)
deep=np.clip(d/60,0,1)[...,None]
shallow=np.array([0.40,0.58,0.82]); deepc=np.array([0.20,0.32,0.62])   # deeper blue, nearer Google Earth's Mjøsa
lake=shallow*(1-deep)+deepc*deep
# gentle painted ripples
yy,xx=np.mgrid[0:1536,0:1536]
rip=(np.sin(yy*0.35+np.sin(xx*0.02)*3)*0.5+0.5)*0.025
lake=lake+rip[...,None]
m=cv2.GaussianBlur(keep.astype(np.float32),(0,0),1.2)[...,None]
out=out*(1-m)+lake*m
edge=cv2.morphologyEx(keep,cv2.MORPH_GRADIENT,np.ones((3,3),np.uint8)).astype(np.float32)
edge=cv2.GaussianBlur(edge,(0,0),0.8)[...,None]*0.55
out=out*(1-edge)+np.array([0.17,0.15,0.12])*edge
out=np.clip(out,0,1)
# hillshade from coarse DTM
LAT0,LON0=60.73975,11.13256; R=6378137.0; cosl=math.cos(math.radians(LAT0))
mx0=math.radians(LON0)*R; my0=math.log(math.tan(math.pi/4+math.radians(LAT0)/2))*R
tr=Transformer.from_crs(4326,25833,always_xy=True)
def to_en(X,Z_):
    mx=mx0+X/cosl; my=my0-Z_/cosl
    lon=np.degrees(mx/R); lat=np.degrees(2*np.arctan(np.exp(my/R))-np.pi/2); return tr.transform(lon,lat)
cs=[to_en(np.array([x]),np.array([z])) for x in (wx0,wx1) for z in (wz0,wz1)]
es=[c[0][0] for c in cs]; ns=[c[1][0] for c in cs]
a,b,c,dd=min(es)-50,min(ns)-50,max(es)+50,max(ns)+50
W=H=300
url=("https://wcs.geonorge.no/skwms1/wcs.hoyde-dtm-nhm-25833?service=WCS&version=1.0.0&request=GetCoverage&coverage=nhm_dtm_topo_25833"
     f"&crs=EPSG:25833&bbox={a:.0f},{b:.0f},{c:.0f},{dd:.0f}&width={W}&height={H}&format=GeoTIFF")
subprocess.run(['curl','-sS','-m','200','-o',B+'dtm/far.tif',url],check=True)
import tifffile
from scipy.ndimage import map_coordinates
dem=tifffile.imread(B+'dtm/far.tif').astype(np.float64)
dem[dem<0]=123.0  # nodata over the lake -> Mjøsa surface
sx=(c-a)/W; sy=(dd-b)/H
G=129; gx=np.linspace(wx0,wx1,G); gz=np.linspace(wz0,wz1,G); GX,GZ=np.meshgrid(gx,gz)
e,nn=to_en(GX.ravel(),GZ.ravel())
Hm=map_coordinates(dem,[(dd-nn)/sy-0.5,(e-a)/sx-0.5],order=1,mode='nearest').reshape(G,G)
# flatten the lake surface exactly
wm=cv2.resize(keep,(G,G),interpolation=cv2.INTER_NEAREST)>0
Hm[wm]=np.minimum(Hm[wm],123.0); Hm=np.maximum(Hm,122.5)
hmin=float(Hm.min()); q=np.round((Hm-hmin)*10).astype('<u2')
# hillshade the painted image
hh=cv2.resize(Hm.astype(np.float32),(1536,1536),interpolation=cv2.INTER_CUBIC)
s=SIZE/1536; ex=2.0
nrm=np.dstack([-np.gradient(hh,s,axis=1)*ex,np.ones_like(hh),-np.gradient(hh,s,axis=0)*ex]); nrm/=np.linalg.norm(nrm,axis=2,keepdims=True)
L=np.array([-0.55,0.75,-0.37]); L/=np.linalg.norm(L)
f=np.clip(1+1.3*(nrm@L-L[1]),0.8,1.12)[...,None]
out=np.clip(out*np.where(keep[...,None]>0,1.0,f),0,1)
# fade to paper at the outer edge
D=np.minimum.reduce([xx,yy,1535-xx,1535-yy]).astype(np.float32); al=np.clip((D-20)/240,0,1)[...,None]
# (no fade at the outer edge: the horizon's hazy plain and near ring carry on in land colours; fog does the rest)
out[:, :int(1536*0.09)]=np.array([0.22,0.35,0.64])  # west strip: open water (Helgøya's tip is drawn by the horizon ring)
cv2.imwrite(B+'style/far.jpg',cv2.cvtColor((out*255).astype(np.uint8),cv2.COLOR_RGB2BGR)[::1,::1],[cv2.IMWRITE_JPEG_QUALITY,78,cv2.IMWRITE_JPEG_PROGRESSIVE,1])
small=cv2.resize(cv2.imread(B+'style/far.jpg'),(1024,1024),interpolation=cv2.INTER_AREA)
cv2.imwrite(B+'style/far.jpg',small,[cv2.IMWRITE_JPEG_QUALITY,76,cv2.IMWRITE_JPEG_PROGRESSIVE,1])
json.dump(dict(n=G,x0=wx0,z0=wz0,size=SIZE,hmin=hmin,lake=123.0,data=base64.b64encode(q.tobytes()).decode()),open(B+'style/far.json','w'))
print('lake px',keep.mean(),'hmin',hmin,'hmax',Hm.max())
