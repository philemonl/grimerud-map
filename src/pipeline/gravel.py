"""Gravel mask from the norgeibilder.no orthophotos.

Reads build/ortho/*.png with build/ortho/reg.json (photo px -> z18 mosaic px, one 2x3 affine per photo) and writes
build/style/gravel.png: white where the photos show bare gravel or asphalt, in the mosaic's own pixels.
Sunlit gravel is picked by colour (light, unsaturated); gravel in shadow by being dark and bluish rather than green.
Buildings and the sand court are cut out; small specks go and car-sized holes are filled.
"""
from paths import B
import numpy as np, cv2, json, glob, os
import data
N=1792
reg=json.load(open(B+'ortho/reg.json'))
acc=np.zeros((N,N),np.float32); cov=np.zeros((N,N),np.float32); shd=np.zeros((N,N),np.float32)
for name,M in reg.items():
    im=cv2.imread(B+'ortho/%s-image.png'%name).astype(np.float32)/255
    im=cv2.GaussianBlur(im,(0,0),1.5)
    b,g,r=im[...,0],im[...,1],im[...,2]
    mx=im.max(2); mn=im.min(2); sat=(mx-mn)/(mx+1e-6)
    sun=((sat<0.13)&(mx>0.50)&(mx<0.97)).astype(np.float32)
    # shadowed gravel: dark, and blue at least as strong as green (shadowed grass stays green)
    shade=((mx<0.42)&(mx>0.10)&(b>g*1.04)&(sat<0.45)).astype(np.float32)
    M=np.array(M,np.float32)
    acc=np.maximum(acc,cv2.warpAffine(sun,M,(N,N),flags=cv2.INTER_AREA))
    shd=np.maximum(shd,cv2.warpAffine(shade,M,(N,N),flags=cv2.INTER_AREA))
    cov=np.maximum(cov,cv2.warpAffine(np.ones(sun.shape,np.float32),M,(N,N)))
sun=(acc>0.5).astype(np.uint8); shade=(shd>0.6).astype(np.uint8)
build=np.zeros((N,N),np.uint8)
for p in [p for it in data.ITEMS for p in it.get('parts',[])]+data.CONTEXT: cv2.fillPoly(build,[np.array(p['p'],np.int32)],1)
cut=cv2.dilate(build,np.ones((3,3),np.uint8))
cv2.fillPoly(cut,[np.array(data.SPORTS['court'],np.int32)],1); cut=np.maximum(cut,cv2.dilate(cut*0+cv2.fillPoly(np.zeros((N,N),np.uint8),[np.array(data.SPORTS['court'],np.int32)],1),np.ones((9,9),np.uint8)))
cut[:, :530]=1   # the field-edge track west of the farm is not part of the site
sun[cut>0]=0
k=lambda n: cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(n,n))
sun=cv2.morphologyEx(sun,cv2.MORPH_OPEN,k(5))
# shadowed gravel only counts where it touches sunlit gravel (a shadow lying across a yard), never on its own
shade[cut>0]=0; shade=cv2.morphologyEx(shade,cv2.MORPH_OPEN,k(5))
near=cv2.dilate(sun,k(9)); nlab,lab=cv2.connectedComponents(shade)
keep=np.zeros(nlab,bool); keep[np.unique(lab[(near>0)&(shade>0)])]=True; keep[0]=False
m=np.clip(sun+keep[lab].astype(np.uint8),0,1)
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,k(9))
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,k(7))    # wisps narrower than a lane go
# drop specks, fill car-sized holes
n,lab,st,_=cv2.connectedComponentsWithStats(m)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]<700: m[lab==i]=0
n,lab,st,_=cv2.connectedComponentsWithStats(1-m)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]<220 and not (build[lab==i].any()): m[lab==i]=1
# only trust the colour pick inside the zones checked against the drone photos; add the hand-traced yards
zone=np.zeros((N,N),np.uint8)
for z in data.GRAVEL_ZONES: cv2.fillPoly(zone,[np.array(z,np.int32)],1)
m=m*zone
# smooth, simple outlines: fill bays and cut spurs narrower than ~8 m, then round what is left
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,k(41)); m=cv2.morphologyEx(m,cv2.MORPH_OPEN,k(29))
m=(cv2.GaussianBlur(m.astype(np.float32),(0,0),6)>0.5).astype(np.uint8)
for g in data.GRAVEL_AREAS: cv2.fillPoly(m,[np.array(g,np.int32)],1)
for g in data.ASPHALT: cv2.fillPoly(m,[np.array(g,np.int32)],0)
m[cut>0]=0
cv2.imwrite(B+'style/gravel.png',m*255); cv2.imwrite(B+'style/gravel_cov.png',(cov>0.5).astype(np.uint8)*255)
print('gravel px',int(m.sum()))

# one surface: yards, asphalt, the roundabout ring and every road inside the mosaic, merged so that no sliver of
# grass is left where two of them run side by side; only real islands survive as holes
for g in data.ASPHALT: cv2.fillPoly(m,[np.array(g,np.int32)],1)
for pts,w,kind in data.ROADS:
    p=np.array(pts,np.float32)
    if (p.min()<-50) or (p.max()>N+50): continue
    cv2.polylines(m,[np.round(p).astype(np.int32)],False,1,int(round(max(w,3.2)/0.29188))+1)
    for x,y in pts: cv2.circle(m,(int(round(x)),int(round(y))),int(max(w,3.2)/0.29188/2),1,-1)
cx_,cy_,cr_=data.CIRCLE; cv2.circle(m,(cx_,cy_),cr_,1,int(3.2/0.29188)+1)
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,k(15))
n,lab,st,_=cv2.connectedComponentsWithStats(1-m)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]<900: m[lab==i]=1
m=(cv2.GaussianBlur(m.astype(np.float32),(0,0),1.6)>0.5).astype(np.uint8)
cv2.imwrite(B+'style/gravel.png',m*255)
# vector outline for the app (src/content/gravel.json): outer rings and their holes, in mosaic px
cs,hier=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
polys=[]
for i,c in enumerate(cs):
    if hier[0][i][3]!=-1: continue
    ring=lambda c:[[round(float(x),1),round(float(y),1)] for x,y in cv2.approxPolyDP(c,0.9,True)[:,0]]
    holes=[]; j=hier[0][i][2]
    while j!=-1:
        if cv2.contourArea(cs[j])>600: holes.append(ring(cs[j]))
        j=hier[0][j][0]
    polys.append([ring(c)]+holes)
from paths import CONTENT
json.dump(dict(polys=polys),open(str(CONTENT)+'/gravel.json','w'),separators=(',',':'))
print('polys',len(polys),'pts',sum(len(r) for p in polys for r in p))
