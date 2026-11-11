"""Level the ground under every building on the saved heightmap, then redo the hill shading.

Reads build/style/terrain_base.json (the untouched heights, saved from a terrain.py run) and writes
build/style/terrain.json, so it can be run again and again without the ground drifting. Use it after moving
or adding buildings when the Geonorge height service is unavailable; terrain.py does the full job when it is up.
Plots with grade=(rise m, rise to the north m, start fraction) slope instead of lying flat (walk-out basements).
"""
import json, base64, os, numpy as np, cv2
from paths import B
import data
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'terrain.py')).read()
T=json.load(open(B+'style/terrain_base.json')); N=T['n']; CTX_S=T['size']   # always from the untouched heights, so repeated runs never drift
xs=T['x0']+np.arange(N)*CTX_S/(N-1); zs=T['z0']+np.arange(N)*CTX_S/(N-1)
Hm=np.frombuffer(base64.b64decode(T['data']),'<u2').reshape(N,N)/100+T['hmin']
M=0.29188; step=CTX_S/(N-1)
def wpx(p): return [((p[0]-896)*M-xs[0])/step,((p[1]-896)*M-zs[0])/step]
bis=[q for it in data.ITEMS for q in it.get('parts',[])]+data.CONTEXT
for q in bis:
    poly=np.array([wpx(p) for p in q['p']],np.float32)
    inner=np.zeros((N,N),np.uint8); cv2.fillPoly(inner,[np.round(poly*4).astype(np.int32)],1,shift=2)
    pad=cv2.dilate(inner,np.ones((3,3),np.uint8)); level=float(np.percentile(Hm[pad>0],3)) if q.get('tent') else float(np.median(Hm[pad>0]))
    dd=cv2.distanceTransform((1-pad).astype(np.uint8),cv2.DIST_L2,3); w=np.clip(1-dd/3.0,0,1); w=w*w*(3-2*w)
    if q.get('grade'):
        # a sloping plot (walk-out basement): ground rises grade[0] m towards the east wall and grade[1] m from south to north
        wx=[(p[0]-896)*M for p in q['p']]; wz=[(p[1]-896)*M for p in q['p']]
        GX,GZ=np.meshgrid(xs,zs); cx,cz=np.mean(wx),np.mean(wz)
        # optional grade[2]: fraction of the way east where the rise starts (flat to the west of it)
        k=q['grade'][2] if len(q['grade'])>2 else 0.0
        t=np.clip(((GX-min(wx))/(max(wx)-min(wx))-k)/(1-k),0,1); t=t*t*(3-2*t)
        level=level+q['grade'][0]*(t-0.5)-q['grade'][1]*(GZ-cz)/(max(wz)-min(wz))
    Hm=Hm*(1-w)+level*w
# retaining walls: fill the ground on the building's side of the wall up to the wall top, falling back
# to the natural ground over a few metres, so the wall holds up a bank instead of standing free
GX,GZ=np.meshgrid(xs,zs)
for q in bis:
    if not q.get('retain'): continue
    ax,az,bx,bz,h0,h1=q['retain']; A=np.array([(ax-896)*M,(az-896)*M]); Bw=np.array([(bx-896)*M,(bz-896)*M])
    c=np.mean([[(p[0]-896)*M,(p[1]-896)*M] for p in q['p']],0)
    u=(Bw-A)/np.linalg.norm(Bw-A); n=np.array([-u[1],u[0]])
    if np.dot(c-A,n)<0: n=-n                              # n points into the bank (the building's side)
    from scipy.interpolate import RegularGridInterpolator as RGI
    base=RGI((zs,xs),Hm,bounds_error=False,fill_value=None)
    ya=float(base([[A[1]-n[1],A[0]-n[0]]])[0]); yb=float(base([[Bw[1]-n[1],Bw[0]-n[0]]])[0])   # foot of the wall, outside
    t=((GX-A[0])*u[0]+(GZ-A[1])*u[1])/np.linalg.norm(Bw-A); d=(GX-A[0])*n[0]+(GZ-A[1])*n[1]
    top=ya+h0+(yb+h1-ya-h0)*np.clip(t,0,1)
    fall=np.clip(1-(d-0.3)/6.0,0,1)*((t>-0.05)&(t<1.05)&(d>0.05))   # flat for the first bit, then easing down over ~6 m
    Hm=np.where(fall>0,np.maximum(Hm,Hm*(1-fall)+top*fall),Hm)
q=np.round((Hm-T['hmin'])*100).astype('<u2'); T['data']=base64.b64encode(q.tobytes()).decode()
json.dump(T,open(B+'style/terrain.json','w'))
# hill shading: reuse the function body from terrain.py
i=src.index('def hillshade'); j=src.index('import scipy.interpolate')
import scipy.interpolate as si
S=1792*0.29188; CX=336.24576; CZ=37.36064
_gi=si.RegularGridInterpolator((zs,xs),Hm,bounds_error=False,fill_value=None)
heights=lambda X,Z: _gi(np.c_[Z,X]) + 0*X
exec(src[i:j])
hillshade(B+'style/ground_site.png',B+'style/ground_site_hs.png',S,0,0)
hillshade(B+'style/ground_ctx.png',B+'style/ground_ctx_hs.png',CTX_S,CX,CZ)
print('ok')
