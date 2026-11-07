import numpy as np, cv2
def canopy(path, k=1.0, min_area=120):
    img=cv2.imread(path).astype(np.float32)/255
    b,g,r=img[...,0],img[...,1],img[...,2]; lum=(r+g+b)/3
    w=max(3,int(9*k)|1); w2=max(3,int(7*k)|1)
    mean=cv2.blur(lum,(w,w)); sq=cv2.blur(lum*lum,(w,w)); std=np.sqrt(np.maximum(sq-mean*mean,0))
    exg=2*g-r-b
    m=((cv2.blur(lum,(w2,w2))<0.30)&(cv2.blur(std,(w2,w2))>0.045)&(cv2.blur(exg,(w2,w2))>0.02)).astype(np.uint8)
    o=max(3,int(7*k)|1); c=max(3,int(9*k)|1)
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((o,o),np.uint8)); m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((c,c),np.uint8))
    n,lab,st,_=cv2.connectedComponentsWithStats(m); keep=np.zeros_like(m)
    for i in range(1,n):
        if st[i,cv2.CC_STAT_AREA]>=min_area*k*k: keep[lab==i]=1
    return keep
