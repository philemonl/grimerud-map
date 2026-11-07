import math, sys, io, os, urllib.request
from PIL import Image
def t(lat,lon,z):
    n=2**z; x=(lon+180)/360*n; y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n; return x,y
lat,lon,z,r,out=float(sys.argv[1]),float(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),sys.argv[5]
cx,cy=t(lat,lon,z); x0,y0=int(cx)-r,int(cy)-r
W=2*r+1; img=Image.new('RGB',(W*256,W*256))
for i in range(W):
  for j in range(W):
    p=f"/home/claude/tiles/{z}_{x0+i}_{y0+j}.jpg"
    if not os.path.exists(p):
      u=f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y0+j}/{x0+i}"
      d=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'grimerud-map'}),timeout=30).read(); open(p,'wb').write(d)
    img.paste(Image.open(p),(i*256,j*256))
img.save(out,quality=88)
print(z,x0,y0,W)
