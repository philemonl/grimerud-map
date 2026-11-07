from paths import B
import numpy as np, cv2, json, sys
from scipy import ndimage as ndi
rng=np.random.default_rng(7)
def load(p): return cv2.cvtColor(cv2.imread(p),cv2.COLOR_BGR2RGB).astype(np.float32)/255
PAL={ # reference colours from the drone photos and the drawn map
 'gold':(0.89,0.72,0.38),'brown':(0.62,0.44,0.25),'lawn':(0.47,0.70,0.28),
 'meadow':(0.66,0.78,0.36),'under':(0.33,0.55,0.22),'gravel':(0.91,0.87,0.79)}
ORDER=['gold','brown','lawn','meadow','under','gravel']
def classify(img):
    sm=cv2.pyrMeanShiftFiltering((img*255).astype(np.uint8),9,18).astype(np.float32)/255
    hsv=cv2.cvtColor(sm,cv2.COLOR_RGB2HSV); h=hsv[...,0]; s=hsv[...,1]; v=hsv[...,2]
    r,g,b=sm[...,0],sm[...,1],sm[...,2]
    cls=np.full(h.shape,0,np.int32)
    greenish=(g>r*1.02)&(g>b)
    cls[(~greenish)&(v<0.42)]=1
    cls[greenish&(v>=0.30)]=2
    cls[greenish&(v>=0.30)&(s<0.42)&(r>0.42*g+0.0)&(v>0.45)]=3
    dark=v<0.24
    cls[greenish&(v<0.30)]=4
    cls[(s<0.16)&(v>0.55)]=5
    # majority filter
    oh=np.stack([(cls==i).astype(np.float32) for i in range(6)],-1)
    oh=cv2.blur(oh,(7,7)); cls=oh.argmax(-1)
    return sm,cls,dark,greenish,v
def paint(img,cls,scale):
    lum=img.mean(-1); hp=lum-cv2.GaussianBlur(lum,(0,0),3*scale)
    out=np.zeros_like(img)
    for i,k in enumerate(ORDER): out[cls==i]=PAL[k]
    out=cv2.GaussianBlur(out,(0,0),1.2*scale)
    tone=cv2.GaussianBlur(lum,(0,0),14*scale); tone=(tone-tone.mean())*0.35
    out=out*(1+np.clip(hp*2.6,-0.35,0.35)[...,None])+tone[...,None]
    # grain + ink boundaries
    out*= (1+rng.normal(0,0.025,lum.shape))[...,None]
    edge=np.zeros(lum.shape,bool)
    for i in range(6):
        m=(cls==i).astype(np.uint8); e=cv2.morphologyEx(m,cv2.MORPH_GRADIENT,np.ones((2,2),np.uint8))>0; edge|=e
    edge=cv2.GaussianBlur(edge.astype(np.float32),(0,0),0.6)
    out=out*(1-0.45*edge[...,None])+np.array([0.2,0.18,0.12])*0.45*edge[...,None]
    return np.clip(out,0,1)
def trees(cls,dark,greenish,v,step,M,off):
    m=((cls==4)|(dark&~(cls==1)))
    m=cv2.morphologyEx(m.astype(np.uint8),cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    dist=ndi.distance_transform_edt(m)
    pts=[]
    H,W=m.shape
    for y in range(0,H,step):
        for x in range(0,W,step):
            jx=int(x+rng.uniform(0,step)); jy=int(y+rng.uniform(0,step))
            if jx>=W or jy>=H or not m[jy,jx]: continue
            d=dist[jy,jx]
            if d<2: continue
            r=min(d*M,4.2)*rng.uniform(0.75,1.05)+1.2
            pts.append([round((jx-W/2)*M+off,1),round((jy-H/2)*M+off,1),round(r,1),int(rng.random()<0.22)])
    return pts,m
if __name__=='__main__':
    site=load(B+'z18.jpg'); M=0.29188
    sm,cls,dark,gr,v=classify(site)
    p=paint(site,cls,1)
    cv2.imwrite(B+'style/ground_site.png',cv2.cvtColor((p*255).astype(np.uint8),cv2.COLOR_RGB2BGR))
    t,m=trees(cls,dark,gr,v,11,M,0)
    np.save(B+'style/cls_site.npy',cls)
    cv2.imwrite(B+'style/treemask.png',m*255)
    json.dump(t,open(B+'style/trees_site.json','w'))
    print('site trees',len(t))
    ctx=load(B+'z17ctx.jpg'); Mc=0.58376
    sm2,cls2,dark2,gr2,v2=classify(ctx)
    p2=paint(ctx,cls2,0.5)
    # fade to paper at edges
    H,W=cls2.shape; yy,xx=np.mgrid[0:H,0:W]; d=np.minimum.reduce([xx,yy,W-1-xx,H-1-yy]).astype(np.float32)
    a=np.clip((d-40)/260,0,1)[...,None]; paper=np.array([0.953,0.933,0.886])
    p2=p2*a+paper*(1-a)
    cv2.imwrite(B+'style/ground_ctx.png',cv2.cvtColor((p2*255).astype(np.uint8),cv2.COLOR_RGB2BGR))
    t2,_=trees(cls2,dark2,gr2,v2,8,Mc,37.36)
    # drop ctx trees inside site square and near the faded edge
    t2=[q for q in t2 if not(abs(q[0])<261 and abs(q[1])<261) and max(abs(q[0]-37.36),abs(q[1]-37.36))<430]
    json.dump(t2,open(B+'style/trees_ctx.json','w')); print('ctx trees',len(t2))
