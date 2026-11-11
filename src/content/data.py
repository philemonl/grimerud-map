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
BARN=RT(691,727.5,227,69); BARNX=RT(717.3,768,77.5,30)   # one roof over the whole barn (drone photos)
WHITE='#f4f1ea'; YELLOW='#e6bd4e'; RED='#a8292a'; DARKRED='#8c2626'; CREAM='#f2ece0'; CONCRETE='#d9d5cc'
ROOF_RED='#c4432d'; ROOF_TILE='#b84a30'; ROOF_DARK='#3d3a38'; ROOF_BROWN='#6e3a2a'; ROOF_GREY='#8b8f8c'
ITEMS=[
 # numbered as on the drawn site map
 dict(n='1',g='b',no='Hovedbygning',en='Main building',sub_no='Matsal · Stuene · Café Alv · TV-rom',sub_en='Dining hall · Living rooms · Café Alv · TV room',
      parts=[dict(p=MAIN,h=6.6,wall='#f6f4ee',base=[0.6,'#8e8a84','stone'],gable='#f8f6f0',trim=False,roof='#6a3226',bay=4.7,endBays=3,dormers=6,dormerStyle='shed',rise=5.0,dormerSize=1.35,chimneys=[AT(MAIN,.5,.25),AT(MAIN,.5,.55)],porch=AT(MAIN,0,.41)+['w'],
                  # south end, from the site photo: rendered wall on a grey plinth, three windows a floor on the west side
                  # (French balconies upstairs), the gabled entrance porch up a flight of steps on the east side,
                  # and a board-clad gable with a row of three attic windows; picnic tables on the gravel in front
                  facade=[dict(side='w',wall='#f6f4ee',boards=True,base=[0.5,'#8e8a84'],
                              # west front from the site photo: four pairs of windows a floor either side of the centre door
                              win=[[2.01, 3.95, 1.25, 1.7], [4.37, 3.95, 1.25, 1.7], [7.87, 3.95, 1.25, 1.7], [9.91, 3.95, 1.25, 1.7], [13.91, 3.95, 1.25, 1.7], [18.45, 3.95, 1.25, 1.7], [20.49, 3.95, 1.25, 1.7], [24.26, 3.95, 1.25, 1.7], [26.3, 3.95, 1.25, 1.7], [1.88, 0.95, 1.25, 1.7], [4.15, 0.95, 1.25, 1.7], [7.78, 0.95, 1.25, 1.7], [9.82, 0.95, 1.25, 1.7], [18.45, 0.95, 1.25, 1.7], [20.49, 0.95, 1.25, 1.7], [24.35, 0.95, 1.25, 1.7], [26.48, 0.95, 1.25, 1.7]]),
                         dict(side='s',wall='#f6f4ee',base=[0.9,'#8e8a84'],
                              win=[[x,.22,1.1,.48,'cellar'] for x in (.8,2.25,3.7)]+[[x,1.45,1.1,1.75] for x in (.8,2.25,3.7)]
                                  +[[x,4.0,1.1,1.85,'juliet'] for x in (.8,2.25,3.7)]+[[7.95,5.0,1.4,1.45]],
                              gable=dict(color='#f8f6f0',win=[[x,.75,1.2,1.3] for x in (4.0,5.35,6.7)]))],
                  stoop=AT(MAIN,.73,1)+['s',1.2],
                  tables=[AT(MAIN,.13,1.075),AT(MAIN,.36,1.075),AT(MAIN,.1,1.145),AT(MAIN,.33,1.145)]),
             dict(p=SUB(MAIN,-.14,.84,0,.98),h=3.3,wall='#f6f4ee',stucco=True,trim=False,roof='#e9e6de',flat=True,railing=True),
             # lower wing along the east side, and a small white flat-roofed porch on it
             # lean-to along the east wall (drone photo DJI_0041): drawn as a low gable centred on the wall, so only its outer slope shows
             dict(p=RT(817.3,1027.0,32.0,53.0),h=2.7,wall='#f4f2ec',roof='#6a3226',bay=4.7,rise=2.0,trim=False,stoop=[833.9,1025,'e',0.6,'open']),   # back entrance: door on a raised landing with steps, just south of the white box
             # white flat-roofed box at the lean-to's north end
             dict(p=RT(840.0,1005.0,13.0,22.0),h=2.6,wall='#f4f2ec',roof='#e9e6de',flat=True,trim=False,plain=True)]),
 dict(n='1a',g='b',no='The Bird & Baby Café',en='The Bird & Baby Café',sub_no='Serverer kaffe, espresso, te-drikker og mer.',sub_en='Serving coffee, espresso, tea drinks, and more.',pin=AT(MAIN,.5,.1),inside='1'),
 dict(n='2',g='b',no='Kontorbygning',en='Office building',sub_no='Resepsjon · Kontorfløy · Studio',sub_en='Reception · Offices · Studio',
      parts=[dict(p=OFFICE,grade=(1.9,0.6,0.5),h=8.8,wall='#e2b350',roof=ROOF_TILE,stucco=True,office=True,solar='s',skylights=dict(n=4),base=[2.7,'#f1f0eb','small'],bay=3.1,rise=4.6,chimneys=[AT(OFFICE,.92,.5),AT(OFFICE,.55,.3)],chimneyColor='#dcae4f',balconies=[dict(edge=3,n=1,upper=True,y=5.7,w=11,color='#e4e8df',rail=True),
                 # south side (edge 2 runs east to west): long balcony over the basement doors, a small one up by the east corner
                 dict(edge=2,n=1,at=.56,upper=True,y=2.75,w=5.6,color='#7f8b74',rail=True),dict(edge=2,n=1,at=.06,upper=True,y=5.75,w=2.2,color='#7f8b74',rail=True)],
             garage=[AT(OFFICE,.44,1)+['s',2.8,2.3,'wood']],porch=AT(OFFICE,.965,1)+['s'])]),
 dict(n='3',g='b',no='Gym-bygning',en='Gym building',sub_no='Gymsal · Lille bønnerommet',sub_en='Gym · Little prayer room',
      parts=[dict(p=GYM,h=6.5,wall='#f4f2ec',roof=ROOF_TILE,steeple=AT(GYM,.5,.83),gables=dict(s='#dcb35a'),skin=[dict(p=SUB(GYM,0,.6,1,1),wall='#dcb35a',stucco=True)],porch=AT(GYM,.85,1)+['s','gable'])]),
 dict(n='4',g='b',no='Låven',en='The Barn',sub_no='Møtesal · Prokla Media · Bønnerom',sub_en='Meeting hall · Prokla Media · Prayer room',
      parts=[dict(p=BARN,grade=(2.8,0,0.8),h=6.2,wall='#a3282a',gable='#a3282a',base=[3.0,'#e4e1d8','barn'],roof='#2f3135',plain=True,barn=True,rise=7.5,garage=[AT(BARN,.44,1)+['s',3.6,3.0],AT(BARN,1,.5)+['e',4.4,3.8],
                    # the basement opens onto the north side at ground level (Barn_07): doors along the concrete base
                    AT(BARN,.33,0)+['n',2.6,2.5],AT(BARN,.46,0)+['n',2.6,2.5],AT(BARN,.64,0)+['n',2.6,2.5],AT(BARN,.70,0)+['n',1.2,2.2],AT(BARN,.76,0)+['n',2.4,2.4],AT(BARN,.87,0)+['n',1.2,2.2]],
                    # concrete ramp up the north side at the west end to the upper floor (Barn_07/08)
                    ramp=[AT(BARN,.1,0)[0]-0.0588*50,AT(BARN,.1,0)[1]-0.998*50,AT(BARN,.1,0)[0]+0.0588*2,AT(BARN,.1,0)[1]+0.998*2,4.8,3.0]),   # square to the wall and running into it
             dict(p=BARNX,h=6.2,wall='#a3282a',base=[3.0,'#e4e1d8'],roof='#2f3135',cross=True,gables=dict(s='#a3282a'),rise=4.6,porch=AT(BARNX,.55,1)+['s','plain']),dict(p=RT(672.5,767.5,10,10),h=2.6,wall='#a3282a',roof='#46474b',plain=True,trim=False,rise=0.9),dict(p=SUB(BARN,-.045,.6,0,.95),h=2.4,wall='#a3282a',roof='#cfd6d8',flat=True,plain=True,trim=False),dict(p=RT(779,799,36,72),h=2.8,wall='#fbfaf5',roof='#f6f4ee',tent=True,trim=False)]),
 dict(n='4a',g='b',no='Bønnerommet',en='Prayer room',sub_no='Oppe i inngangsfløyen til låven',sub_en='Upstairs in the barn’s entrance wing',pin=[722,752],inside='4',pinH=11),
 dict(n='4b',g='b',no='Overflow-rommet',en='Overflow room',sub_no='Inne i låven, i vestenden',sub_en='Inside the barn, at the west end',pin=[606,688],inside='4'),
 dict(n='5',g='b',no='Internatet',en='Dormitories',sub_no='',sub_en='',
      parts=[dict(p=[[1124.4,1132.0],[1161.8,1123.2],[1181.1,1205.0],[1143.7,1213.8]],h=6.5,wall=RED,roof='#6e3a2e',balconies=[dict(edge=1,n=2,color='#f4f2ec'),dict(edge=3,n=3,color='#f4f2ec')]),dict(p=[[1149.0,1152.4],[1175.7,1146.1],[1182.4,1174.8],[1155.7,1181.1]],h=6.5,wall=RED,roof='#5a2d26',cross=True,rise=4.4,trim=False,porch=[1179.0,1160.5,'e'])]),
 dict(n='6',level=True,g='b',no='Bispen',en='Bispen',sub_no='',sub_en='',
      # yellow house, ridge east-west with the gable to the west; steep red-brown roof; low wing on the north side,
      # dark deck with a white fence on the south side, small shed at the south-west corner
      parts=[dict(p=RT(673.1,1123.0,33.1,30.5),h=5.6,wall='#e8c77e',roof='#7a3328',bay=3.4,endBays=2,solar='s'),
             # north lean-to under the main roof's north slope carried on down (catslide): same pitch, eaves 1.7 m lower;
             dict(p=RT(669.78,1104.6,26.45,7.1),h=3.93,shed='s',wall='#e8c77e',roof='#7a3328',bay=3.4,trim=False,porch=[683.0,1104.4,'e','plain']),
             # its east end is open: the same roof on a white post, sheltering the door (photo)
             dict(p=RT(686.33,1104.0,6.65,7.1),h=3.93,shed='s',open=True,wall='#e8c77e',roof='#7a3328',trim=False),
             dict(p=RT(672.9,1144.5,30.2,12.3),h=0.6,wall='#4a4440',roof='#5b5148',flat=True,plain=True,trim=False,railing=True),
             dict(p=RT(651.8,1144.4,10.8,11.4),h=2.3,wall='#9a9a92',roof='#43474c',bay=3.4)]),
 dict(n='7',g='b',no='Hybelhuset',en='Boys’ House',sub_no='',sub_en='',
      parts=[dict(p=[[1100,1300],[1118,1276],[1158,1306],[1140,1332]],h=3.4,wall='#e6bf4f',roof='#c0532f',rise=4.8,dormers=1,dormerSize=3,chimneys=[[1124,1298]],bay=3.6),dict(p=[[1128, 1302], [1149, 1318], [1175, 1284], [1154, 1268]],h=3.0,wall='#e6bf4f',roof='#c0532f',rise=2.8,trim=False,bay=3.6)]),
 dict(n='8',g='b',no='Rekkehusene',en='Row houses',sub_no='',sub_en='',
      # two homes a block, front doors up short flights of steps on the road side; the ground climbs about 1.5 m to the
      # gardens behind, so the basement walks out at the front (drone photo)
      parts=[dict(p=[[1025, 1300.5], [1062, 1326.5], [1040.6, 1355.7], [1003.6, 1328.7]],h=5.6,grade=(-0.9,-1.3,0),wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2),stoops=[[1035.3, 1307.1, 'n', 1.4, 'open'], [1051.2, 1318.3, 'n', 1.4, 'open']]),
             dict(p=[[1069, 1319.5], [1106, 1346.5], [1085.6, 1375.7], [1048.6, 1348.7]],h=5.6,grade=(-0.9,-1.3,0),wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2),stoops=[[1079.3, 1326.4, 'n', 1.4, 'open'], [1095.2, 1338.0, 'n', 1.4, 'open']]),
             dict(p=[[1102, 1355.5], [1139, 1382.5], [1117.6, 1411.7], [1080.6, 1384.7]],h=5.6,grade=(-0.9,-1.3,0),wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2),stoops=[[1112.3, 1362.4, 'n', 1.4, 'open'], [1128.2, 1374.0, 'n', 1.4, 'open']])]),
 dict(n='9',g='b',no='Grimerud Barnehage',en='Grimerud Kindergarten',sub_no='',sub_en='',
      parts=[dict(p=RT(885.0,1100.6,44.1,25.5),h=5.5,wall=RED,roof='#b23e2c'),dict(p=RT(857.3,1102.1,11.3,31.4),h=2.8,wall='#f4f2ec',roof='#e9e6de',flat=True,trim=False),dict(p=RT(888.5,1160.9,34.0,95.4),h=4.5,wall=RED,roof='#b23e2c',solar=True),dict(p=RT(913.4,1159.6,20.4,29.4),h=4.5,wall=RED,roof='#5a2d26',rise=2.7,cross=True,trim=False,solar='s')]),
 # lettered: arrival, outdoors, other buildings
 dict(n='P',g='a',no='Parkering',en='Car park',sub_no='',sub_en='Main parking on the south side of the farm road.',
      area=[[834,940],[1065,926],[1072,1056],[918,1058],[880,1044],[834,1044]]),
 dict(n='E',g='a',icon='arrow',no='Innkjøring',en='Entrance',sub_no='',sub_en='Turn west off Grimerudvegen. The car park is about 100 m ahead on the left.',
      pin=[1442,838]),
 # garden & football lawn, unlabelled for now:
 # dict(n='H',g='a',icon='ball',no='Hagen og ballplassen',en='Garden & football lawn',sub_no='Fotballbane og sandvolleyballbane',sub_en='Football pitch and beach volleyball court',
 #      area=[[504,988],[770,988],[770,1113],[700,1117],[700,1212],[504,1212]],pin=[600,1045]),
 # playground, unlabelled for now:
 # dict(n='L',g='a',no='Lekeplassen',en='Playground',sub_no='',sub_en='Play area in the trees between the kindergarten and the dormitories.',
 #      area=[[925,1090],[1110,1085],[1115,1250],[930,1250]],pin=[1010,1160]),
 dict(n='10',g='o',no='Garasjen',en='Garage',sub_no='',sub_en='Red garage building east of the barn.',
      parts=[dict(p=RT(974.8,734.4,45.8,112.6),h=5,wall=RED,roof='#34363a',plain=True,garage=[[970,791,'s',3.4,3.0],[985,790,'s',3.4,3.0]])]),   # black roof, two doors in the south gable (drone video)
 dict(n='11',g='o',no='Barracks',en='Barracks',sub_no='',sub_en='Long, low building along the farm road, opposite the car park.',
      parts=[dict(p=RT(1122.8,869,188,34.6,a=-12.3),h=6,wall=RED,roof='#dcdbd6',flat=True,stripes=2.9)]),
 dict(n='12',g='o',no='Spiseteltet',en='Dining tent',sub_no='',sub_en='Large white tent just south of the main building.',
      parts=[dict(p=RT(807.4,1168.5,33.1,63.6),h=2.6,wall='#fbfaf5',roof='#f6f4ee',tent=True)]),
 dict(n='13',g='o',no='Nordlåven',en='North barn',sub_no='',sub_en='Older farm barn and work yard north of the garage, reached by the farm track.',
      parts=[dict(p=[[982,258],[1036,261],[1031,415],[977,412]],h=7,wall=RED,gable=RED,roof='#55585c',plain=True,base=[1.6,CONCRETE]),dict(p=RT(845,328,30,36),h=3.5,wall=RED,roof='#55585c',plain=True)]),
 dict(n='14',g='o',level=True,no='Vaktmesterboligen',en='Caretaker’s house',sub_no='',sub_en='First house on the right as you turn in from Grimerudvegen.',
      # from the drone photo (DJI_0033): an L of two tiled gables, cream walls, a low west wing and a raised wooden deck
      # traced from the user's marked-up drone photo: an L of two pale-tiled blocks, a dark-tiled block on the south side,
      # and a small lower roof in the corner, each its own roof
      # from the marked-up drone photo, each marked piece being one roof slope with ridges between them:
      # main block, ridge east-west where the frosty north slope meets the bare south slope;
      # west wing: its north slope is the main roof's north slope carried on down (same pitch, eaves 1.42 m lower
      # where the wall steps 1.7 m further north), so the two read as one unbroken slope
      parts=[dict(p=[[1414.87, 781.04], [1418.48, 806.73], [1387.69, 811.05], [1384.08, 785.37]],h=4.2,wall='#d4a640',roof='#7a3328',bay=3.4,chimneys=[[1396.64, 795.01]],porch=[1403.79, 808.79]+['s']),
             dict(p=[[1397.14, 777.67], [1400.44, 801.18], [1374.44, 804.84], [1371.13, 781.33]],h=2.78,wall='#d4a640',roof='#7a3328',bay=3.4),
             dict(p=RT(1366,786,15.5,31,a=-8),h=0.9,wall='#8a6a48',roof='#a88a64',flat=True,plain=True,trim=False,railing=True,tables=[[1366,783],[1366,778]]),
             dict(p=RT(1364.5,770.5,9,4.5,a=-8),h=2.0,wall='#8a6a48',roof='#5b5148',flat=True,plain=True,trim=False)]),
 # cabins on the asphalt between the office and the barn (from the drone photos, Nov 2026)
 dict(n='15',g='o',no='Trailerparken',en='Trailer park',sub_no='Vogner mellom kontorbygget og låven.',sub_en='Trailers between the office building and the barn.',
      pin=[588,838],parts=[dict(p=RT(568,789,24,9.5),h=3.0,trailer=dict(door='n',n=8)),
             dict(p=RT(568,799.5,24,9.5),h=3.0,trailer=dict(door='s',n=7)),
             dict(p=RT(569,832.5,24,9.5),h=3.0,trailer=dict(door='n',n=6)),
             dict(p=RT(569,843,24,9.5),h=3.0,trailer=dict(door='s',n=5)),
             dict(p=RT(574,875,26,9.5),h=3.0,trailer=dict(door='n',n=4)),
             dict(p=RT(574,885.5,26,9.5),h=3.0,trailer=dict(door='s',n=3)),
             dict(p=RT(609.5,816,9.5,26),h=3.0,trailer=dict(door='w',n=1)),
             dict(p=RT(615,866,9.5,26),h=3.0,trailer=dict(door='e',n=2))]),
]
CONTEXT=[
 # the yellow house, unlabelled for now (was item Y: no='Det gule huset', en='Yellow house',
 # sub_en='Small yellow house between the garage and the main building.')
 dict(p=RT(887,881,38,44),h=5.0,wall='#e6bf4f',roof='#c0432b'),dict(p=RT(884,848,30,22),h=3.0,wall='#f4f2ec',roof='#e9e6de',flat=True,trim=False),dict(p=RT(864,874,10,40),h=2.8,wall='#e6bf4f',roof='#e9e6de',flat=True,trim=False),
 # around the garage (drone video): tall red shed by the track, log stacks at the garage's north end, a white container
 dict(p=RT(903,612,16,18),h=6.0,wall='#a3282a',roof='#34363a',plain=True,trim=False,rise=1.8),
 dict(p=RT(962,656,44,20),h=1.6,wall='#a98a62',roof='#d9d2c4',flat=True,plain=True,trim=False),
 dict(p=RT(978,878,40,11,a=-12),h=2.6,wall='#f4f2ec',roof='#e9e6de',flat=True,plain=True,trim=False),
 dict(p=RT(872.9,1027.9,14,20),h=2.5,wall='#f4f2ec',roof='#7b3a2b',plain=True,trim=False,rise=1.6),   # white shed with a tiled roof in the yard
 dict(p=[[1174.4,1395.0],[1199.0,1364.3],[1230.2,1397.4],[1207.4,1426.1]],h=5,wall=YELLOW,roof='#c97f4a'),
]
FLAG=[742,941]
ROADS_EXTRA=[]
WALK_FIELD=[[1396,10],[1700,12],[2000,14],[2310,16],[2360,100],[2385,150]]
YARD=[[590,752],[805,752],[840,790],[840,840],[700,845],[595,840]]
SPORTS=dict(goals=[[548,1000,0],[548,1096,180]],court=[[562,1133],[637,1133],[637,1202],[562,1202]],net=[[600,1137],[600,1198]])
HEDGES=[[[1003.6, 1328.7], [975.8, 1365.3], [1012.8, 1391.3], [1040.6, 1354.7]], [[1022.1, 1341.7], [994.3, 1378.3]], [[1048.6, 1348.7], [1022.3, 1386.4], [1059.3, 1413.4], [1085.6, 1375.7]], [[1067.1, 1362.2], [1040.8, 1399.9]], [[1080.6, 1384.7], [1053.4, 1421.8], [1090.4, 1448.8], [1117.6, 1411.7]], [[1099.1, 1398.2], [1071.9, 1435.3]]]   # a garden per home behind each row house block (drone photo)
# grass islands with trees between the drive and the car park, as on the hand-drawn map; gaps are the entries
ISLANDS=[[[918,941],[962,939],[963,952],[919,954]],[[982,938],[1020,936],[1021,949],[983,951]]]
ISLAND_TREES=[[930,947,2.8],[952,946,2.6],[994,944,3.0],[1012,943,2.6]]
ISLAND=[[622,782],[688,780],[692,852],[640,860],[620,830]]
ROADS=[ # traced from the z18 imagery; (points, width in metres, kind)
 # public roads
 ([[1480,-1280],[1400,-1120],[1384,-880],[1388,-480],[1393,0],[1400,392],[1428,588],[1440,760],[1446,850],[1446,980],[1428,1162],[1390,1255],[1344,1344],[1255,1478],[1232,1500],[1148,1650],[1078,1740],[1043,1792]],6,'road'),
 ([[1445,846],[1600,846],[1792,841]],5.5,'road'),
 ([[1189,1576],[1350,1588],[1500,1588],[1792,1588]],4.5,'road'),
 # farm lanes, traced along the gravel in the norgeibilder.no orthophotos (see src/pipeline/gravel.py)
 # drive from Grimerudvegen along the barracks, through the car park to the roundabout
 ([[1445,838],[1385,836],[1340,838],[1300,848],[1260,860],[1210,872],[1150,888],[1090,902],[1040,912],[1000,920],[960,927],[900,934],[868,946],[848,957],[815,962],[785,962],[764,957]],3.5,'drive'),
 # from the car park north past the yellow house to the garage
 ([[975,926],[950,905],[932,880],[926,850],[924,820],[922,803]],3.5,'drive'),
 ([[1386,823],[1386,836]],3,'path'),
 # farm tracks
 ([[1405,398],[1200,424],[1029,448],[950,462],[925,540],[922,620],[922,700],[922,803]],3.2,'track'),
 ([[957,470],[948,435],[955,418],[968,410],[973,407]],3.2,'track'),
 ([[556,640],[400,614],[200,611],[0,609]],3.2,'track'),
 # round the west end and along the north side of the barn
 ([[600,778],[576,776],[564,755],[561,700],[563,662],[576,642],[600,638],[700,646],[790,653],[840,665],[880,688],[905,700],[922,705]],3,'track'),
 # the barn's east end to the garage lane; barn yard to the roundabout
 ([[922,712],[870,710],[830,712],[806,716]],3,'path'),
 # footpath from the garage lane through the trees to the marquee's east entrance
 ([[922,806],[892,803],[858,804],[826,800],[799,800]],2.4,'path'),
 ([[700,880],[706,895],[712,906]],3.2,'path'),
 # west side of the main building, the spur to Bispen, and round the south end
 ([[748,972],[753,988],[757,1020],[757,1080],[757,1105]],3.2,'path'),
 ([[757,1092],[725,1097],[700,1100]],2.8,'path'),
 ([[925,1045],[890,1040],[852,1045],[843,1080],[840,1118]],3,'path'),
 ([[757,1105],[765,1118],[800,1118],[838,1118],[842,1160],[857,1200],[880,1235],[930,1264],[990,1287]],3,'path'),
 # dormitories loop to the Boys' House and the row houses
 ([[1052,1045],[1058,1070],[1085,1088],[1125,1095],[1160,1108],[1185,1130],[1198,1165],[1198,1200],[1180,1220],[1140,1238],[1112,1252],[1090,1272],[1072,1298]],3,'path'),
 ([[990,1287],[1030,1290],[1062,1302],[1100,1330],[1142,1360],[1152,1395],[1168,1430],[1210,1460],[1254,1477]],3.2,'drive'),
]
ROADS+=ROADS_EXTRA
CIRCLE=[742,941,26]

# RULE: every road and path joins the network; none may stop short of the road it meets.
# Each road end within SNAP px of another road's centre line (or the roundabout ring) is carried on to that
# centre line, so the painted roads always overlap where they meet and no ink outline cuts across a junction.
def _connect(roads,circle,polys=(),snap=30):
    import math
    def near_seg(p,a,b):
        dx,dy=b[0]-a[0],b[1]-a[1]; L2=dx*dx+dy*dy or 1
        t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L2)); q=[a[0]+t*dx,a[1]+t*dy]
        return math.hypot(p[0]-q[0],p[1]-q[1]),q
    out=[]
    for i,(pts,w,k) in enumerate(roads):
        pts=[list(p) for p in pts]
        for end in (0,-1):
            p=pts[end]; best=(snap+1,None)
            for j,(o,_,_) in enumerate(roads):
                if j==i: continue
                for a,b in zip(o,o[1:]):
                    d,q=near_seg(p,a,b)
                    if d<best[0]: best=(d,q)
            # the roundabout: stop where the road's round end just meets the island, never biting into it
            # (ring painted 3 m wide around radius r; this road is w m wide, 0.29188 m a px)
            cx,cy,r=circle; d0=math.hypot(p[0]-cx,p[1]-cy) or 1
            rr=r-(1.5/0.29188)+1+(w/0.29188)/2
            dr=abs(d0-r)
            if dr<best[0]: best=(dr,[cx+(p[0]-cx)/d0*rr,cy+(p[1]-cy)/d0*rr])
            if best[1] is None:
                # a lane that ends at a building or a gravel yard runs on to its edge
                for pg in polys:
                    for a,b in zip(pg,pg[1:]+pg[:1]):
                        d,q=near_seg(p,a,b)
                        if d<best[0]: best=(d,q)
            if best[1] is not None and best[0]>0.5:
                q=[round(best[1][0],1),round(best[1][1],1)]
                if math.hypot(p[0]-circle[0],p[1]-circle[1])<circle[2]+2: pts.pop(end)   # an end already over the ring is moved, not extended
                if end==0: pts.insert(0,q)
                else: pts.append(q)
        out.append((pts,w,k))
    return out
# paved ground we paint as gravel besides the car park: the yard north of the main building, up to its wall
# Hand-traced surfaces from the drone photos (Nov 2026, light frost: asphalt black, driven gravel tracked).
# Gravel picked from the orthophotos is only trusted inside GRAVEL_ZONES; everywhere else gravel is the roads
# above plus these yards, so worn grass and garden paths never turn into lanes.
GRAVEL_AREAS=[[[560,640],[800,648],[815,690],[800,700],[578,692],[560,700]],     # storage yard north of the barn
              [[774,950],[812,952],[885,944],[888,1048],[852,1052],[815,1052],[815,1000],[760,1004],[762,975]],
              RT(801,1124,48,30)]                                                 # picnic tables between the main building's south end and the dining tent             # north end and east side of the main building, up to its walls
GRAVEL_ZONES=[[[872,915],[1085,903],[1092,1064],[882,1066]],                       # the car park
              [[915,375],[1065,375],[1065,475],[915,475]]]                        # north barn yard
ASPHALT=[
 [[600,772],[612,755],[815,755],[818,800],[806,836],[757,842],[757,826],[745,821],[720,820],[708,828],[707,885],[690,885],[690,815],[680,800],[650,797],[636,800],[600,800]],  # barn yard
 [[550,772],[600,772],[600,878],[691,878],[691,897],[550,897]],                    # trailer park
 [[691,885],[707,885],[714,912],[718,985],[691,985]],                              # east of the gym
 [[588,972],[691,968],[691,986],[588,989]],                                        # along the office's south side
 [[718,962],[762,958],[764,990],[762,1045],[747,1045],[745,992],[718,985]],        # roundabout to the main building's west side
 [[800,708],[880,708],[905,690],[948,685],[950,800],[1000,800],[1000,815],[925,815],[905,790],[900,740],[880,728],[800,728]],  # barn's east end and the garage yard
 [[928,1140],[960,1150],[968,1215],[940,1235],[915,1212],[925,1175]],              # kindergarten playground (approximate)
]
ROADS=_connect(ROADS,CIRCLE,[p['p'] for it in ITEMS for p in it.get('parts',[])]+[p['p'] for p in CONTEXT]+[it['area'] for it in ITEMS if it.get('area')]+GRAVEL_AREAS+ASPHALT)
