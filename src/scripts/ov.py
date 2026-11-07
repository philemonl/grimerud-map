import sys, cv2, numpy as np
sys.path.insert(0,'/home/claude/scripts'); import importlib, data; importlib.reload(data)
im=cv2.imread('/home/claude/ref/g_warp.png')
x0,y0,x1,y1,k,out=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),sys.argv[6]
c=cv2.resize(im[y0:y1,x0:x1],None,fx=k,fy=k,interpolation=cv2.INTER_CUBIC)
for i,(pts,w,kind) in enumerate(data.ROADS):
    P=np.array([[(x-x0)*k,(y-y0)*k] for x,y in pts],np.int32)
    cv2.polylines(c,[P],False,(255,0,255),2)
    for j,(x,y) in enumerate(P): cv2.circle(c,(x,y),3,(0,255,255),-1)
    m=P[len(P)//2]; cv2.putText(c,str(i),(int(m[0])+4,int(m[1])-4),0,0.6,(0,0,255),2)
for x in range((x0//50+1)*50,x1,50):
    cv2.line(c,((x-x0)*k,0),((x-x0)*k,c.shape[0]),(0,200,255),1); cv2.putText(c,str(x),((x-x0)*k+2,12),0,0.4,(0,255,255),1)
for y in range((y0//50+1)*50,y1,50):
    cv2.line(c,(0,(y-y0)*k),(c.shape[1],(y-y0)*k),(0,200,255),1); cv2.putText(c,str(y),(2,(y-y0)*k+12),0,0.4,(0,255,255),1)
for it in data.ITEMS:
    for q in it.get('parts',[]):
        P=np.array([[(x-x0)*k,(y-y0)*k] for x,y in q['p']],np.int32); cv2.polylines(c,[P],True,(0,255,0),2)
for q in data.CONTEXT:
    P=np.array([[(x-x0)*k,(y-y0)*k] for x,y in q['p']],np.int32); cv2.polylines(c,[P],True,(0,160,255),2)
cv2.imwrite(out,c)
