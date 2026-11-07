import sys; from pathlib import Path; sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'pipeline'))
from paths import B
import sys
from PIL import Image, ImageDraw
im=Image.open(B+'z18.jpg').convert('RGB')
x0,y0,x1,y1,out=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),sys.argv[5]
k=int(sys.argv[6]) if len(sys.argv)>6 else 3
c=im.crop((x0,y0,x1,y1)).resize(((x1-x0)*k,(y1-y0)*k),Image.LANCZOS)
d=ImageDraw.Draw(c)
for x in range((x0//10+1)*10,x1,10):
    X=(x-x0)*k; d.line([(X,0),(X,c.height)],fill=(255,255,0) if x%50==0 else (255,255,255),width=1 if x%50 else 2)
    if x%50==0: d.text((X+2,2),str(x),fill=(255,255,0))
for y in range((y0//10+1)*10,y1,10):
    Y=(y-y0)*k; d.line([(0,Y),(c.width,Y)],fill=(255,255,0) if y%50==0 else (255,255,255),width=1 if y%50 else 2)
    if y%50==0: d.text((2,Y+2),str(y),fill=(255,255,0))
c.save(out,quality=90)
