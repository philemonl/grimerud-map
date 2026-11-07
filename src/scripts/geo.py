import math, numpy as np
M18=0.29188
def t(lat,lon,z):
    n=2**z; x=(lon+180)/360*n; y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n; return x,y
def inv(x,y,z):
    n=2**z; lon=x/n*360-180; lat=math.degrees(math.atan(math.sinh(math.pi*(1-2*y/n)))); return lat,lon
cx,cy=t(60.73975,11.13256,18)
X0=(int(cx)-3)*256+896; Y0=(int(cy)-3)*256+896       # world origin in global z18 px
def g18_to_world(gx,gy): return ((gx-X0)*M18,(gy-Y0)*M18)
def world_to_g18(x,z): return (x/M18+X0, z/M18+Y0)
def site_px_to_world(px,py): return ((px-896)*M18,(py-896)*M18)
def world_to_site_px(x,z): return (x/M18+896, z/M18+896)
WIDE=(69590,37514)
def wide_to_world(px,py): return g18_to_world(2*(WIDE[0]*256+px),2*(WIDE[1]*256+py))
Fd=np.load('/home/claude/ref/A_disc.npy')
def disc_to_world(u,v):
    w=Fd@np.array([u,v,1.0]); return wide_to_world(w[0],w[1])
def world_to_site_px_list(pts): return [[round(a,1) for a in world_to_site_px(*p)] for p in pts]
