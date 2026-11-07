import sys, numpy as np, cv2
sys.path.insert(0,'/home/claude/scripts'); import data
M=0.29188
bm=np.zeros((1792,1792),np.int32)
names=[]
for it in data.ITEMS:
    for q in it.get('parts',[]):
        names.append(it['en']); cv2.fillPoly(bm,[np.array(q['p'],np.int32)],len(names))
for q in data.CONTEXT:
    names.append('context'); cv2.fillPoly(bm,[np.array(q['p'],np.int32)],len(names))
for i,(pts,w,k) in enumerate(data.ROADS):
    rm=np.zeros((1792,1792),np.uint8)
    cv2.polylines(rm,[np.array(pts,np.int32)],False,1,max(1,int(round(max(w,3.2)/M))))
    hit=set(bm[(rm>0)&(bm>0)].tolist())
    if hit: print(i,pts[:2],'->',[names[h-1] for h in hit], int(((rm>0)&(bm>0)).sum()))
