"""The wide landscape round Grimerud, out to 35 km: real terrain and painted land cover for the map's horizon.

Fetches Esri World Imagery at zoom 11 (9 x 9 tiles, about 86 km across) and paints it in the map's palette, the same
way far.py does the near landscape, with Mjøsa and the other lakes in blue. Heights come from the coarse Geonorge
model that horizon.py fetches (build/dtm/horizon.tif, 200 m cells), lowered for the earth's curve.
Writes build/style/outer.jpg and outer.json (heights on a grid, world metres); map.js drapes one over the other and
pulls the distant part in towards the camera so it fits inside the view distance.
"""
from paths import B
import math, json, base64, os, urllib.request, numpy as np, cv2, tifffile
from scipy.ndimage import map_coordinates
from geo import g18_to_world, t as tile_xy
from stylize import PAL
from pyproj import Transformer
LAT0,LON0=60.73975,11.13256; Z=11; RT=4; HALF_W=35000.0; G=177
cx,cy=tile_xy(LAT0,LON0,Z); X0,Y0=int(cx)-RT,int(cy)-RT; NT=2*RT+1
mos=np.zeros((NT*256,NT*256,3),np.uint8)
for i in range(NT):
    for j in range(NT):
        p=f"{B}tiles/{Z}_{X0+i}_{Y0+j}.jpg"
        if not os.path.exists(p):
            u=f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{Z}/{Y0+j}/{X0+i}"
            open(p,'wb').write(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'grimerud-map'}),timeout=30).read())
        mos[j*256:(j+1)*256,i*256:(i+1)*256]=cv2.cvtColor(cv2.imread(p),cv2.COLOR_BGR2RGB)
k=2**(18-Z)
wx0,wz0=g18_to_world(X0*256*k,Y0*256*k); wx1,wz1=g18_to_world((X0+NT)*256*k,(Y0+NT)*256*k)
# crop the mosaic to the square +-HALF_W round the farm and resample to the texture
P=1280
def px(x,z): return (x-wx0)/(wx1-wx0)*mos.shape[1],(z-wz0)/(wz1-wz0)*mos.shape[0]
(a0,b0),(a1,b1)=px(-HALF_W,-HALF_W),px(HALF_W,HALF_W)
Mx=np.float32([[ (a1-a0)/P,0,a0],[0,(b1-b0)/P,b0]])
img=cv2.warpAffine(mos,Mx,(P,P),flags=cv2.INTER_AREA|cv2.WARP_INVERSE_MAP).astype(np.float32)/255
# heights on the same square
R=6378137.0; cosl=math.cos(math.radians(LAT0))
mx0=math.radians(LON0)*R; my0=math.log(math.tan(math.pi/4+math.radians(LAT0)/2))*R
tr=Transformer.from_crs(4326,25833,always_xy=True)
def to_en(X,Zs):
    mx=mx0+X/cosl; my=my0-Zs/cosl
    return tr.transform(np.degrees(mx/R),np.degrees(2*np.arctan(np.exp(my/R))-np.pi/2))
e0,n0=tr.transform(LON0,LAT0); DH=70000; DW=700; cell=2*DH/DW
dem=tifffile.imread(B+'dtm/horizon.tif').astype(np.float64); nod=dem<0; dem[nod]=123.0
def sample(arr,X,Zs,order=1):
    e,n=to_en(X,Zs); return map_coordinates(arr,[(n0+DH-n)/cell-0.5,(e-(e0-DH))/cell-0.5],order=order,mode='nearest')
gx=np.linspace(-HALF_W,HALF_W,G); GX,GZ=np.meshgrid(gx,gx)
Hm=sample(dem,GX.ravel(),GZ.ravel()).reshape(G,G)
# water: Mjøsa has no data in the height model; other lakes are dark, smooth and level in the imagery
tx=np.linspace(-HALF_W,HALF_W,P); TX,TZ=np.meshgrid(tx,tx)
mj=sample(nod.astype(np.float64),TX.ravel(),TZ.ravel()).reshape(P,P)>0.5
hh=sample(dem,TX.ravel(),TZ.ravel()).reshape(P,P).astype(np.float32)
lum=img.mean(-1); sm=cv2.GaussianBlur(lum,(0,0),2)
slope=np.hypot(*np.gradient(hh,2*HALF_W/P))
dark=((sm<0.115)&(slope<0.01)&(img[...,2]>=img[...,1]*0.9)).astype(np.uint8)
dark=cv2.morphologyEx(dark,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(dark); keep=mj.astype(np.uint8)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]>60: keep[lab==i]=1
keep=cv2.morphologyEx(keep,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
# land: at this zoom the photo only tells forest (dark) from farmland (lighter, yellower). Forest goes dark green,
# farmland a patchwork of the map's gold and meadow, so it carries on from the fields painted nearer the farm.
sm2=cv2.GaussianBlur(img,(0,0),1.2); br=sm2[...,0]*0.6+sm2[...,1]*0.4
lo,hi=np.percentile(br[keep==0],[45,88]); fld=np.clip((br-lo)/(hi-lo),0,1); fld=fld*fld*(3-2*fld)
rng=np.random.default_rng(7); cells=rng.random((P//7+1,P//7+1)).astype(np.float32)
patch=cv2.resize(cells,(P,P),interpolation=cv2.INTER_NEAREST); patch=cv2.GaussianBlur(patch,(0,0),0.8)
gold=np.array(PAL['gold'],np.float32); mead=np.array(PAL['meadow'],np.float32); brown=np.array(PAL['brown'],np.float32)
farm=np.where((patch>0.42)[...,None],gold,mead); farm=np.where((patch>0.88)[...,None],brown,farm)
farm=cv2.GaussianBlur(farm.astype(np.float32),(0,0),0.7)
forest=np.array([0.27,0.45,0.22],np.float32)*(0.82+0.5*np.clip((br-lo)/(hi-lo)+0.4,0,1))[...,None]
out=forest*(1-fld[...,None])+farm*fld[...,None]
lum=img.mean(-1); hp=lum-cv2.GaussianBlur(lum,(0,0),4); out=out*(1+np.clip(hp*2.0,-.2,.2)[...,None])
lake=np.array([0.22,0.35,0.64],np.float32)
m=cv2.GaussianBlur(keep.astype(np.float32),(0,0),1.0)[...,None]; out=out*(1-m)+lake*m
# hill shading
ex=2.0; s=2*HALF_W/P
nrm=np.dstack([-np.gradient(hh,s,axis=1)*ex,np.ones_like(hh),-np.gradient(hh,s,axis=0)*ex]); nrm/=np.linalg.norm(nrm,axis=2,keepdims=True)
L=np.array([-0.55,0.75,-0.37]); L/=np.linalg.norm(L)
f=np.clip(1+1.5*(nrm@L-L[1]),0.72,1.15)[...,None]
out=np.clip(out*np.where(keep[...,None]>0,1.0,f),0,1)
cv2.imwrite(B+'style/outer.jpg',cv2.cvtColor((out*255).astype(np.uint8),cv2.COLOR_RGB2BGR),[cv2.IMWRITE_JPEG_QUALITY,80,cv2.IMWRITE_JPEG_PROGRESSIVE,1])
# heights: level water, drop for the earth's curve (with refraction) as seen from the farm
wm=cv2.resize(keep,(G,G),interpolation=cv2.INTER_NEAREST)>0
mjg=sample(nod.astype(np.float64),GX.ravel(),GZ.ravel(),0).reshape(G,G)>0.5
Hm[mjg]=123.0
Hm=Hm-(GX**2+GZ**2)/(2*6371000/(1-0.13))
hmin=float(Hm.min()); q=np.round((Hm-hmin)*10).astype('<u2')
json.dump(dict(n=G,half=HALF_W,hmin=hmin,lake=123.0,data=base64.b64encode(q.tobytes()).decode()),open(B+'style/outer.json','w'))
print('outer',P,G,'h',round(hmin),round(float(Hm.max())),'water',round(float(keep.mean()),3))
