from paths import B
import numpy as np, cv2, json, sys
from scipy import ndimage as ndi
from stylize import load, PAL, ORDER, classify
import data
from treemask import canopy
rng=np.random.default_rng(11)
M=0.29188
INK=np.array([0.17,0.15,0.12]); GRAVEL=np.array([0.93,0.90,0.83]); ROADC=np.array([0.86,0.84,0.80])

def fix_shadows(cls,v,greenish):
    dark=(v<0.24)&~greenish
    lab,n=ndi.label(dark); sizes=ndi.sum(dark,lab,range(1,n+1))
    small=np.isin(lab,np.where(sizes<4000)[0]+1)
    cls=cls.copy(); cls[small]=4
    return cls

def paint(img,cls,scale):
    lum=img.mean(-1); hp=lum-cv2.GaussianBlur(lum,(0,0),3*scale)
    out=np.zeros_like(img)
    pal=dict(PAL); pal['brown']=(0.70,0.50,0.29)
    for i,k in enumerate(ORDER): out[cls==i]=pal[k]
    out=cv2.GaussianBlur(out,(0,0),1.5*scale)
    out=out*(1+np.clip(hp*2.2,-0.28,0.28)[...,None])
    return out

def ink_edges(out,cls,w=2,a=0.5):
    edge=np.zeros(cls.shape,bool)
    for i in range(6):
        m=(cls==i).astype(np.uint8); edge|=cv2.morphologyEx(m,cv2.MORPH_GRADIENT,np.ones((w,w),np.uint8))>0
    e=cv2.GaussianBlur(edge.astype(np.float32),(0,0),0.7)*a
    return out*(1-e[...,None])+INK*e[...,None]

def draw_poly_path(mask,pts,width_px):
    p=np.array(pts,np.int32).reshape(-1,1,2)
    cv2.polylines(mask,[p],False,1,int(round(width_px)),cv2.LINE_AA)
    # round joins and ends, so bends and junctions close up with no notch
    for x,y in pts: cv2.circle(mask,(int(round(x)),int(round(y))),max(1,int(round(width_px/2))),1,-1,cv2.LINE_AA)

site=load(B+'z18.jpg')
sm,cls,dark,gr,v=classify(site)
cls=fix_shadows(cls,v,gr)
# footprints & areas we paint ourselves
H,W=cls.shape
pads=np.zeros((H,W),np.uint8); build=np.zeros((H,W),np.uint8)
allparts=[p for it in data.ITEMS for p in it.get('parts',[])]+data.CONTEXT
for p in allparts:
    cv2.fillPoly(build,[np.array(p['p'],np.int32)],1)
pads=cv2.dilate(build,np.ones((9,9),np.uint8))
out=paint(site,cls,1)
out=ink_edges(out,cls)
# gravel pads around buildings
pm=cv2.GaussianBlur(pads.astype(np.float32),(0,0),1.5)[...,None]
out=out*(1-pm)+GRAVEL*pm
# car park
park=next(i for i in data.ITEMS if i['n']=='P')['area']
pk=np.zeros((H,W),np.uint8); cv2.fillPoly(pk,[np.array(park,np.int32)],1)
for g in getattr(data,'GRAVEL_AREAS',[]): cv2.fillPoly(pk,[np.array(g,np.int32)],1)
road=np.zeros((H,W),np.uint8)
for pts,wm,kind in data.ROADS: draw_poly_path(road,pts,wm/M)
cx,cy,r=data.CIRCLE; cv2.circle(road,(cx,cy),r,1,int(3/M),cv2.LINE_AA)
paved=np.clip(road+pk,0,1)
# ink outline then fill
outline=cv2.dilate(paved,np.ones((5,5),np.uint8))
om=cv2.GaussianBlur(outline.astype(np.float32),(0,0),0.8)[...,None]
# no ink where a road runs onto a building's gravel pad: the two read as one surface
om=om*(1-cv2.GaussianBlur((cv2.dilate(pads,np.ones((5,5),np.uint8))>0).astype(np.float32),(0,0),1.2))[...,None]
out=out*(1-om*0.85)+INK*om*0.85
fm=cv2.GaussianBlur(paved.astype(np.float32),(0,0),0.8)[...,None]
col=np.where(((road>0)&(pk==0))[...,None],ROADC,GRAVEL)   # roads crossing the car park or a yard take the yard's colour
out=out*(1-fm)+col*fm
# trees
treem=canopy(B+'z18.jpg')
treem[cv2.dilate(paved,np.ones((7,7),np.uint8))>0]=0
treem[pads>0]=0
cv2.circle(treem,(data.CIRCLE[0],data.CIRCLE[1]),data.CIRCLE[2]+3,0,-1)  # the flag stands alone on the island
dist=ndi.distance_transform_edt(treem)
trees=[]
step=17
for y in range(0,H,step):
    for x in range(0,W,step):
        jx=int(x+rng.uniform(0,step)); jy=int(y+rng.uniform(0,step))
        if jx>=W or jy>=H or not treem[jy,jx] or dist[jy,jx]<1.5: continue
        rr=(min(dist[jy,jx]*M,4.2)*rng.uniform(.85,1.05)+1.8)
        trees.append((jx,jy,rr,int(rng.random()<0.2)))
# painted tree shadows (sun from the south-west, shadows fall north-east)
sh=np.zeros((H,W),np.float32)
for x,y,rr,c in trees:
    R=rr/M; cv2.ellipse(sh,(int(x+R*0.9),int(y-R*0.5)),(int(R*1.1),int(R*0.8)),-25,0,360,1,-1,cv2.LINE_AA)
sh=cv2.GaussianBlur(sh,(0,0),2)*0.28
out=out*(1-sh[...,None])
# paper grain
out*=(1+rng.normal(0,0.02,(H,W)))[...,None]
out=np.clip(out,0,1)
cv2.imwrite(B+'style/ground_site.png',cv2.cvtColor((out*255).astype(np.uint8),cv2.COLOR_RGB2BGR))
T=[[round((x-896)*M,1),round((y-896)*M,1),round(rr,1),c] for x,y,rr,c in trees]
# context ring
ctx=load(B+'ref/big17.jpg'); Mc=0.58376; CX=336.24576; CZ=37.36064; CS=1643.86816
sm2,cls2,dark2,gr2,v2=classify(ctx); cls2=fix_shadows(cls2,v2,gr2)
o2=paint(ctx,cls2,0.5); o2=ink_edges(o2,cls2,2,0.35)
Hc,Wc=cls2.shape
# roads on ctx: same lines mapped (site native px -> ctx px)
def s2c(p): return [ ((p[0]-896)*0.29188-(CX-CS/2))/Mc, ((p[1]-896)*0.29188-(CZ-CS/2))/Mc ]
road2=np.zeros((Hc,Wc),np.uint8)
for pts,wm,kind in data.ROADS:
    if kind in('road',): draw_poly_path(road2,[s2c(p) for p in pts],wm/Mc)
om=cv2.GaussianBlur(cv2.dilate(road2,np.ones((3,3),np.uint8)).astype(np.float32),(0,0),.6)[...,None]
o2=o2*(1-om*.8)+INK*om*.8; fm=cv2.GaussianBlur(road2.astype(np.float32),(0,0),.6)[...,None]; o2=o2*(1-fm)+ROADC*fm
tm2=canopy(B+'ref/big17.jpg',0.5,120); tm2[road2>0]=0
d2=ndi.distance_transform_edt(tm2); T2=[]
for y in range(0,Hc,11):
    for x in range(0,Wc,11):
        jx=int(x+rng.uniform(0,11)); jy=int(y+rng.uniform(0,11))
        if jx>=Wc or jy>=Hc or not tm2[jy,jx] or d2[jy,jx]<1: continue
        wx=(jx-Wc/2)*Mc+CX; wz=(jy-Hc/2)*Mc+CZ
        if abs(wx)<258 and abs(wz)<258: continue
        if max(abs(wx-CX),abs(wz-CZ))>CS/2-110: continue
        T2.append([round(wx,1),round(wz,1),round(min(d2[jy,jx]*Mc,4.2)*rng.uniform(.85,1.05)+1.9,1),int(rng.random()<0.2)])
sh2=np.zeros((Hc,Wc),np.float32)
for wx,wz,rr,c in T2:
    x=(wx-CX)/Mc+Wc/2; y=(wz-CZ)/Mc+Hc/2; R=rr/Mc
    cv2.ellipse(sh2,(int(x+R*.9),int(y-R*.5)),(max(1,int(R*1.1)),max(1,int(R*.8))),-25,0,360,1,-1,cv2.LINE_AA)
o2=o2*(1-(cv2.GaussianBlur(sh2,(0,0),1.2)*0.28)[...,None])
yy,xx=np.mgrid[0:Hc,0:Wc]; d=np.minimum.reduce([xx,yy,Wc-1-xx,Hc-1-yy]).astype(np.float32)
a=np.ones_like(d)[...,None]; paper=np.array([0.965,0.953,0.925])  # no fade: the distant landscape continues beyond
o2=np.clip(o2*a+paper*(1-a),0,1)
cv2.imwrite(B+'style/ground_ctx.png',cv2.cvtColor((o2*255).astype(np.uint8),cv2.COLOR_RGB2BGR))
# blend edge of site square into ctx is handled by drawing ctx under it
json.dump(dict(site=T,ctx=T2),open(B+'style/trees.json','w'),separators=(',',':'))
print(len(T),len(T2))
