import base64, json, sys, cv2
sys.path.insert(0,'/home/claude/scripts'); import data
def jpg2(p,q):
    im=cv2.resize(cv2.imread(p),(2048,2048),interpolation=cv2.INTER_AREA)
    ok,b=cv2.imencode('.jpg',im,[cv2.IMWRITE_JPEG_QUALITY,q,cv2.IMWRITE_JPEG_PROGRESSIVE,1]); return 'data:image/jpeg;base64,'+base64.b64encode(b.tobytes()).decode()
def jpg(p,q):
    ok,b=cv2.imencode('.jpg',cv2.imread(p),[cv2.IMWRITE_JPEG_QUALITY,q,cv2.IMWRITE_JPEG_PROGRESSIVE,1]); return 'data:image/jpeg;base64,'+base64.b64encode(b.tobytes()).decode()
t=open('/home/claude/template2.html').read()
t=t.replace('<text x="20" y="-0.5" text-anchor="middle" font-size="0" fill="#26221d">N</text>','')
from geo import disc_to_world, world_to_site_px
import disc, math
def sp(u,v):
    x,z=world_to_site_px(*disc_to_world(u,v)); return [round(x,1),round(z,1)]
DISC=[]
for h,tees,b in disc.HOLES:
    bp=sp(*b); tps=[dict(label=l,p=sp(*q)) for l,q in tees]
    L=math.hypot(bp[0]-tps[0]['p'][0],bp[1]-tps[0]['p'][1])*0.29188
    DISC.append(dict(hole=h,basket=bp,tees=tps,length=round(L)))
items=list(data.ITEMS)
allp=[q for d in DISC for q in [d['basket']]+[t_['p'] for t_ in d['tees']]]
cx=sum(p[0] for p in allp)/len(allp); cz=sum(p[1] for p in allp)/len(allp)
items.append(dict(n='DG',g='d',no='Grimerud diskgolfbane',en='Grimerud disc golf course',sub_no='Parker på Grimerud gård og følg den stiplede ruten · ca. 700 m',sub_en='Park at Grimerud gård and follow the dashed route · about 700 m',pin=[round(cx),round(cz)],size=260,disc='all'))
for d in DISC:
    tees=' / '.join(t_['label'] for t_ in d['tees'])
    mid=[(d['basket'][0]+d['tees'][0]['p'][0])/2,(d['basket'][1]+d['tees'][0]['p'][1])/2]
    items.append(dict(n=str(d['hole']),g='d',no=f"Hull {d['hole']}",en=f"Hole {d['hole']}",sub_no=f"ca. {d['length']} m · utkast: {tees}",sub_en=f"About {d['length']} m · tee: {tees}",pin=d['basket'],focus=[round(mid[0]),round(mid[1])],size=max(30,d['length']*0.55),disc=d['hole']))
WALK=[[1020,962],[1048,925],[1080,910],[1150,893],[1228,872],[1300,850],[1385,834],[1446,836],[1440,760],[1428,588],[1400,392],[1393,0]]+data.WALK_FIELD
D=dict(items=items,disc=DISC,walk=WALK,context=data.CONTEXT,flag=data.FLAG,roads=data.ROADS,circle=data.CIRCLE,island=data.ISLAND,yard=data.YARD,sports=data.SPORTS,hedges=data.HEDGES)
t=t.replace('__DATA__',json.dumps(D,ensure_ascii=False,separators=(',',':'))).replace('__TREES__',open('/home/claude/style/trees.json').read()).replace('__TERRAIN__',open('/home/claude/style/terrain.json').read()).replace('__FAR__',open('/home/claude/style/far.json').read()).replace('__FARIMG__','data:image/jpeg;base64,'+base64.b64encode(open('/home/claude/style/far.jpg','rb').read()).decode())
t=t.replace('__SITE__',jpg('/home/claude/style/ground_site_hs.png',84)).replace('__CTX__',jpg2('/home/claude/style/ground_ctx_hs.png',80))
open('/home/claude/grimerud-map.html','w').write(t); print(len(t))
