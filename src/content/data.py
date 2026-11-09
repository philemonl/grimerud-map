# Single source for places and outlines. Coordinates are native pixels of the 1792px z18 mosaic.
def R(x1,y1,x2,y2): return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]]
# The farm buildings stand square to the national map grid (UTM 33), which is turned this many degrees
# against the north-up mosaic here; outlines traced from the norgeibilder.no orthophotos.
import math
ROT=-3.37
def RT(cx,cy,w,d,a=ROT):
    'rectangle w x d (px) centred on cx,cy, turned a degrees; corners NW, NE, SE, SW as with R()'
    c,s=math.cos(math.radians(a)),math.sin(math.radians(a))
    return [[round(cx+dx*c-dy*s,1),round(cy+dx*s+dy*c,1)] for dx,dy in [(-w/2,-d/2),(w/2,-d/2),(w/2,d/2),(-w/2,d/2)]]
def AT(q,u,v):
    'point at fractions u (west to east) and v (north to south) across a quad from RT()'
    a,b,c,d=q
    return [round((1-u)*(1-v)*a[i]+u*(1-v)*b[i]+u*v*c[i]+(1-u)*v*d[i],1) for i in (0,1)]
def SUB(q,u1,v1,u2,v2): return [AT(q,u1,v1),AT(q,u2,v1),AT(q,u2,v2),AT(q,u1,v2)]
MAIN=RT(798.3,1050.3,40.8,120.6); OFFICE=RT(604.8,947.1,100.3,50.7); GYM=RT(672.5,932.8,36.5,68.4)
BARN=RT(689.6,695.0,227,67.9); LEAN=RT(692.3,741.6,227,25.5); BARNX=RT(717.3,756.2,77.5,29.7)
WHITE='#f4f1ea'; YELLOW='#e6bd4e'; RED='#a8292a'; DARKRED='#8c2626'; CREAM='#f2ece0'; CONCRETE='#d9d5cc'
ROOF_RED='#c4432d'; ROOF_TILE='#b84a30'; ROOF_DARK='#3d3a38'; ROOF_BROWN='#6e3a2a'; ROOF_GREY='#8b8f8c'
ITEMS=[
 # numbered as on the drawn site map
 dict(n='1',g='b',no='Hovedbygning',en='Main building',sub_no='Matsal · Stuene · Café Alv · TV-rom',sub_en='Dining hall · Living rooms · Café Alv · TV room',
      parts=[dict(p=MAIN,h=6.6,wall='#f7f5ef',roof='#7b3a2b',bay=4.7,endBays=3,dormers=6,rise=4.5,dormerSize=1.35,chimneys=[AT(MAIN,.5,.25),AT(MAIN,.5,.55)],porch=AT(MAIN,0,.5)+['w']),
             dict(p=SUB(MAIN,-.14,.84,0,.98),h=3.3,wall='#f7f5ef',roof='#e9e6de',flat=True,railing=True),
             # lower wing along the east side, and a small white flat-roofed porch on it
             dict(p=RT(824.7,1016.0,16.0,48.5),h=3.6,wall='#f7f5ef',roof='#8a4a36',bay=4.7,rise=2.2,trim=False),
             dict(p=RT(836.1,1003.7,8.3,17.1),h=2.6,wall='#f7f5ef',roof='#e9e6de',flat=True,trim=False)]),
 dict(n='1a',g='b',no='The Bird & Baby Cafe',en='The Bird & Baby Cafe',sub_no='Kafé i nordenden av hovedbygningen',sub_en='Café at the north end of the main building',pin=AT(MAIN,.5,.1),inside='1'),
 dict(n='2',g='b',no='Kontorbygning',en='Office building',sub_no='Resepsjon · Kontorfløy · Studio',sub_en='Reception · Offices · Studio',
      parts=[dict(p=OFFICE,grade=(1.9,0.6,0.5),h=8.8,wall='#e2b350',roof=ROOF_TILE,stucco=True,solar='s',skylights=dict(n=4),base=[2.7,'#f1f0eb','stone'],bay=3.1,rise=4.6,chimneys=[AT(OFFICE,.92,.5)],chimneyColor='#dcae4f',balconies=[dict(edge=3,n=1,upper=True,y=5.7,w=11,color='#e4e8df',rail=True),
                 # south side (edge 2 runs east to west): long balcony over the basement doors, a small one up by the east corner
                 dict(edge=2,n=1,at=.56,upper=True,y=2.75,w=5.6,color='#7f8b74',rail=True),dict(edge=2,n=1,at=.06,upper=True,y=5.75,w=2.2,color='#7f8b74',rail=True)],
             garage=[AT(OFFICE,.44,1)+['s',2.8,2.3,'wood']],porch=AT(OFFICE,.965,1)+['s'])]),
 dict(n='3',g='b',no='Gym-bygning',en='Gym building',sub_no='Gymsal · Lille bønnerommet',sub_en='Gym · Little prayer room',
      parts=[dict(p=GYM,h=6.5,wall='#f4f2ec',roof=ROOF_TILE,steeple=AT(GYM,.5,.83),gables=dict(s='#dcb35a'),skin=[dict(p=SUB(GYM,0,.6,1,1),wall='#dcb35a',stucco=True)],porch=AT(GYM,.85,1)+['s','gable'])]),
 dict(n='4',g='b',no='Låven',en='The Barn',sub_no='Møtesal · Prokla Media · Bønnerom',sub_en='Meeting hall · Prokla Media · Prayer room',
      parts=[dict(p=BARN,h=6.2,wall='#a3282a',gable='#a3282a',base=[3.0,'#d8d5cc'],roof='#46474b',plain=True,rise=7.5),
             # lower lean-to along the south side, where the roof turns lighter in the photo
             dict(p=LEAN,h=4.2,wall='#a3282a',gable='#a3282a',base=[2.4,'#d8d5cc'],roof='#55575b',plain=True,rise=1.6,trim=False,garage=[AT(LEAN,.44,1)+['s',3.6,3.0]]),
             dict(p=BARNX,h=6.2,wall='#a3282a',base=[3.0,'#d8d5cc'],roof='#46474b',cross=True,rise=4.6,porch=AT(BARNX,.55,1)+['s','plain']),dict(p=RT(672.5,758.5,10,10),h=2.6,wall='#a3282a',roof='#46474b',plain=True,trim=False,rise=0.9),dict(p=SUB(BARN,-.045,.6,0,.95),h=2.4,wall='#a3282a',roof='#cfd6d8',flat=True,plain=True,trim=False),dict(p=R(756,750,797,840),h=2.8,wall='#fbfaf5',roof='#f6f4ee',tent=True,trim=False)]),
 dict(n='4a',g='b',no='Bønnerommet',en='Prayer room',sub_no='Oppe i inngangsfløyen til låven',sub_en='Upstairs in the barn’s entrance wing',pin=[722,752],inside='4',pinH=11),
 dict(n='4b',g='b',no='Overflow-rommet',en='Overflow room',sub_no='Inne i låven, i vestenden',sub_en='Inside the barn, at the west end',pin=[606,688],inside='4'),
 dict(n='5',g='b',no='Internatet',en='Dormitories',sub_no='',sub_en='',
      parts=[dict(p=[[1124.4,1132.0],[1161.8,1123.2],[1181.1,1205.0],[1143.7,1213.8]],h=6.5,wall=RED,roof='#6e3a2e',balconies=[dict(edge=1,n=2,color='#f4f2ec'),dict(edge=3,n=3,color='#f4f2ec')]),dict(p=[[1149.0,1152.4],[1175.7,1146.1],[1182.4,1174.8],[1155.7,1181.1]],h=6.5,wall=RED,roof='#5a2d26',cross=True,rise=4.4,trim=False,porch=[1179.0,1160.5,'e'])]),
 dict(n='6',g='b',no='«Bispen»',en='«Bispen»',sub_no='',sub_en='',
      # yellow house, ridge east-west with the gable to the west; steep red-brown roof; low wing on the north side,
      # dark deck with a white fence on the south side, small shed at the south-west corner
      parts=[dict(p=RT(673.1,1123.0,33.1,30.5),h=5.6,wall='#e8c77e',roof='#7a3328',bay=3.4,skylights=dict(s=1)),
             dict(p=RT(667.6,1104.5,18.5,7.1),h=3.0,wall='#e8c77e',roof='#7a3328',bay=3.4),
             dict(p=RT(672.9,1144.5,30.2,12.3),h=0.6,wall='#4a4440',roof='#5b5148',flat=True,plain=True,trim=False,railing=True),
             dict(p=RT(651.8,1144.4,10.8,11.4),h=2.3,wall='#9a9a92',roof='#43474c',bay=3.4)]),
 dict(n='7',g='b',no='Hybelhuset',en='Boys’ House',sub_no='',sub_en='',
      parts=[dict(p=[[1100,1300],[1118,1276],[1158,1306],[1140,1332]],h=3.4,wall='#e6bf4f',roof='#c0532f',rise=4.8,dormers=1,dormerSize=3,chimneys=[[1124,1298]],bay=3.6),dict(p=[[1128, 1302], [1149, 1318], [1175, 1284], [1154, 1268]],h=3.0,wall='#e6bf4f',roof='#c0532f',rise=2.8,trim=False,bay=3.6)]),
 dict(n='8',g='b',no='Rekkehusene',en='Row houses',sub_no='',sub_en='',
      parts=[dict(p=[[1025, 1300.5], [1062, 1326.5], [1040.6, 1355.7], [1003.6, 1328.7]],h=5.6,wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2)),dict(p=[[1069, 1319.5], [1106, 1346.5], [1085.6, 1375.7], [1048.6, 1348.7]],h=5.6,wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2)),dict(p=[[1102, 1355.5], [1139, 1382.5], [1117.6, 1411.7], [1080.6, 1384.7]],h=5.6,wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2))]),
 dict(n='9',g='b',no='Grimerud Barnehage',en='Grimerud Kindergarten',sub_no='',sub_en='',
      parts=[dict(p=RT(885.0,1100.6,44.1,25.5),h=5.5,wall=RED,roof='#b23e2c'),dict(p=RT(857.3,1102.1,11.3,31.4),h=2.8,wall='#f4f2ec',roof='#e9e6de',flat=True,trim=False),dict(p=RT(888.5,1160.9,34.0,95.4),h=4.5,wall=RED,roof='#b23e2c',solar=True),dict(p=RT(913.4,1159.6,20.4,29.4),h=4.5,wall=RED,roof='#5a2d26',rise=2.7,cross=True,trim=False,solar='s')]),
 # lettered: arrival, outdoors, other buildings
 dict(n='P',g='a',no='Parkering',en='Car park',sub_no='',sub_en='Main parking on the south side of the farm road.',
      area=[[834,940],[1065,926],[1072,1056],[918,1058],[880,1044],[834,1044]]),
 dict(n='E',g='a',icon='arrow',no='Innkjøring',en='Entrance',sub_no='',sub_en='Turn west off Grimerudvegen. The car park is about 100 m ahead on the left.',
      pin=[1442,838]),
 dict(n='H',g='a',icon='ball',no='Hagen og ballplassen',en='Garden & football lawn',sub_no='Fotballbane og sandvolleyballbane',sub_en='Football pitch and beach volleyball court',
      area=[[504,988],[770,988],[770,1113],[700,1117],[700,1212],[504,1212]],pin=[600,1045]),
 # playground, unlabelled for now:
 # dict(n='L',g='a',no='Lekeplassen',en='Playground',sub_no='',sub_en='Play area in the trees between the kindergarten and the dormitories.',
 #      area=[[925,1090],[1110,1085],[1115,1250],[930,1250]],pin=[1010,1160]),
 dict(n='10',g='o',no='Garasjen',en='Garage',sub_no='',sub_en='Red garage building east of the barn.',
      parts=[dict(p=RT(974.8,734.4,45.8,112.6),h=5,wall=RED,roof=ROOF_GREY)]),
 dict(n='11',g='o',no='Barracks',en='Barracks',sub_no='',sub_en='Long, low building along the farm road, opposite the car park.',
      parts=[dict(p=[[1026,872],[1210,832],[1220,866],[1035,906]],h=6,wall=RED,roof='#d6d4ce',flat=True)]),
 dict(n='12',g='o',no='Spiseteltet',en='Dining tent',sub_no='',sub_en='Large white tent just south of the main building.',
      parts=[dict(p=RT(807.4,1168.5,33.1,63.6),h=2.6,wall='#fbfaf5',roof='#f6f4ee',tent=True)]),
 dict(n='13',g='o',no='Nordlåven',en='North barn',sub_no='',sub_en='Older farm barn and work yard north of the garage, reached by the farm track.',
      parts=[dict(p=[[982,258],[1036,261],[1031,415],[977,412]],h=7,wall=RED,gable=RED,roof='#55585c',plain=True,base=[1.6,CONCRETE]),dict(p=RT(845,328,30,36),h=3.5,wall=RED,roof='#55585c',plain=True)]),
 dict(n='14',g='o',no='Vaktmesterboligen',en='Caretaker’s house',sub_no='',sub_en='First house on the right as you turn in from Grimerudvegen.',
      parts=[dict(p=RT(1382,793,44,34),h=4.5,wall=WHITE,roof=ROOF_RED)]),
]
CONTEXT=[
 # the yellow house, unlabelled for now (was item Y: no='Det gule huset', en='Yellow house',
 # sub_en='Small yellow house between the garage and the main building.')
 dict(p=RT(877.6,859.3,34.0,38.8),h=4.5,wall='#e6bf4f',roof='#c0532f'),dict(p=RT(881.1,829.7,23.5,19.8),h=5.2,wall='#e6bf4f',roof='#c0532f'),dict(p=RT(855.0,846.2,9.6,31.4),h=2.6,wall='#e6bf4f',roof='#e9e6de',flat=True,trim=False),
 dict(p=RT(872.9,1027.9,12.8,12.8),h=2.6,wall='#f4f2ec',roof='#3e3a38',plain=True,trim=False,rise=1.4),
 dict(p=[[1174.4,1395.0],[1199.0,1364.3],[1230.2,1397.4],[1207.4,1426.1]],h=5,wall=YELLOW,roof='#c97f4a'),
]
FLAG=[740,925]
ROADS_EXTRA=[]
WALK_FIELD=[[1396,10],[1700,12],[2000,14],[2310,16],[2360,100],[2385,150]]
YARD=[[590,752],[805,752],[840,790],[840,840],[700,845],[595,840]]
SPORTS=dict(goals=[[548,1000,0],[548,1096,180]],court=[[562,1120],[637,1120],[637,1190],[562,1190]],net=[[600,1124],[600,1186]])
HEDGES=[[[1002.6, 1330.7], [985.6, 1354.7], [1022.6, 1381.7], [1039.6, 1357.7]], [[1046.6, 1350.7], [1029.6, 1374.7], [1066.6, 1401.7], [1083.6, 1376.7]], [[1079.6, 1385.7], [1061.6, 1410.7], [1098.6, 1437.7], [1116.6, 1412.7]]]
# grass islands with trees between the drive and the car park, as on the hand-drawn map; gaps are the entries
ISLANDS=[[[918,941],[962,939],[963,952],[919,954]],[[982,938],[1020,936],[1021,949],[983,951]]]
ISLAND_TREES=[[930,947,2.8],[952,946,2.6],[994,944,3.0],[1012,943,2.6]]
ISLAND=[[622,782],[688,780],[692,852],[640,860],[620,830]]
ROADS=[ # traced from the z18 imagery; (points, width in metres, kind)
 # public roads
 ([[1480,-1280],[1400,-1120],[1384,-880],[1388,-480],[1393,0],[1400,392],[1428,588],[1440,760],[1446,850],[1446,980],[1428,1162],[1390,1255],[1344,1344],[1255,1478],[1232,1500],[1148,1650],[1078,1740],[1043,1792]],6,'road'),
 ([[1445,846],[1600,846],[1792,841]],5.5,'road'),
 ([[1189,1576],[1350,1588],[1500,1588],[1792,1588]],4.5,'road'),
 # farm drive from Grimerudvegen to the yard
 ([[1445,836],[1385,834],[1300,856],[1228,882],[1150,904],[1080,916],[1030,921],[960,927],[900,933],[840,935],[790,931],[762,928]],5,'drive'),
 ([[975,926],[955,912],[930,890],[910,860],[907,830],[898,798],[860,788],[828,790]],5,'drive'),
 ([[1386,823],[1386,836]],3,'path'),
 # farm tracks
 ([[1405,398],[1200,424],[1029,448],[950,462],[925,540],[922,620],[925,700],[930,803]],3.2,'track'),
 ([[957,470],[948,435],[955,418],[968,410],[973,407]],3.2,'track'),
 ([[564,628],[400,614],[200,611],[0,609]],3.2,'track'),
 ([[598,790],[566,782],[552,760],[550,700],[553,645],[562,625],[600,620],[700,618],[800,622],[860,640],[905,680],[925,700]],3,'track'),
 # yard and main building
 ([[828,795],[860,795],[930,803]],3,'path'),
 ([[715,845],[725,880],[735,907]],3,'path'),
 ([[747,943],[745,1000],[745,1060],[745,1100],[752,1122]],3,'path'),
 ([[745,1080],[725,1092],[711,1098]],2.8,'path'),
 ([[925,1040],[890,1036],[852,1040],[845,1080],[841,1128]],3,'path'),
 ([[752,1122],[800,1123],[845,1123],[855,1160],[868,1210],[935,1250],[990,1280]],3,'path'),
 # dormitories loop to Men's Manor and the row houses
 ([[1058,1040],[1066,1062],[1092,1074],[1130,1076],[1165,1076],[1195,1090],[1212,1115],[1220,1165],[1205,1210],[1165,1228],[1120,1248],[1085,1272],[1068,1302]],3,'path'),
 ([[990,1280],[1031,1276],[1100,1325],[1150,1362],[1160,1395],[1175,1430],[1215,1462],[1254,1477]],3.2,'drive'),
]
ROADS+=ROADS_EXTRA
CIRCLE=[740,925,19]
# paved ground we paint as gravel besides the car park: the yard north of the main building, up to its wall
GRAVEL_AREAS=[RT(606,981,106,15),[[752,944],[800,948],[845,955],[853,972],[850,998],[835,998],[773,998],[760,1006],[749,1000]]]
