# Single source for places and outlines. Coordinates are native pixels of the 1792px z18 mosaic.
def R(x1,y1,x2,y2): return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]]
WHITE='#f4f1ea'; YELLOW='#e6bd4e'; RED='#a8292a'; DARKRED='#8c2626'; CREAM='#f2ece0'; CONCRETE='#d9d5cc'
ROOF_RED='#c4432d'; ROOF_TILE='#b84a30'; ROOF_DARK='#3d3a38'; ROOF_BROWN='#6e3a2a'; ROOF_GREY='#8b8f8c'
ITEMS=[
 # numbered as on the drawn site map
 dict(n='1',g='b',no='Hovedbygning',en='Main building',sub_no='Matsal · Stuene · Café Alv · TV-rom',sub_en='Dining hall · Living rooms · Café Alv · TV room',
      parts=[dict(p=R(762,962,830,1108),h=6.6,wall='#f7f5ef',roof='#7b3a2b',bay=4.7,dormers=6,rise=4.5,dormerSize=1.35,chimneys=[[796,998],[796,1042]],porch=[762,1035,'w']),dict(p=R(756,1086,762,1106),h=3.3,wall='#f7f5ef',roof='#e9e6de',flat=True,railing=True)]),
 dict(n='2',g='b',no='Kontorbygning',en='Office building',sub_no='Resepsjon · Kontorfløy · Studio',sub_en='Reception · Offices · Studio',
      parts=[dict(p=R(556,914,659,958),h=8.8,wall='#e2b350',roof=ROOF_TILE,stucco=True,solar='s',skylights=dict(n=4),base=[2.7,'#ecebe6'],bay=3.1,rise=4.6,chimneys=[[649,936]],chimneyColor='#dcae4f',balconies=dict(edge=3,n=1,upper=True,y=5.7,w=11,color='#e4e8df',rail=True))]),
 dict(n='3',g='b',no='Gym-bygning',en='Gym building',sub_no='Gymsal · Lille bønnerommet',sub_en='Gym · Little prayer room',
      parts=[dict(p=R(659,860,698,960),h=6.5,wall='#f4f2ec',roof=ROOF_TILE,steeple=[678.5,947],gables=dict(s='#dcb35a'),skin=[dict(p=R(659,921,698,960),wall='#dcb35a',stucco=True)],porch=[692,960,'s','gable'])]),
 dict(n='4',g='b',no='Låven',en='The Barn',sub_no='Møtesal · Prokla Media · Bønnerom',sub_en='Meeting hall · Prokla Media · Prayer room',
      parts=[dict(p=R(572,640,800,748),h=6.2,wall='#a3282a',gable='#a3282a',base=[3.0,'#d8d5cc'],roof='#46474b',plain=True,rise=7.5,garage=[[668,748,'s',3.6,3.0]]),dict(p=R(692,736,752,768),h=6.2,wall='#a3282a',base=[3.0,'#d8d5cc'],roof='#46474b',cross=True,rise=4.6,porch=[730,768,'s','plain']),dict(p=R(681,748,691,758),h=2.6,wall='#a3282a',roof='#46474b',plain=True,trim=False,rise=0.9),dict(p=R(562,690,572,712),h=2.4,wall='#a3282a',roof='#cfd6d8',flat=True,plain=True,trim=False),dict(p=R(756,750,797,840),h=2.8,wall='#fbfaf5',roof='#f6f4ee',tent=True,trim=False)]),
 dict(n='4a',g='b',no='Bønnerommet',en='Prayer room',sub_no='Oppe i inngangsfløyen til låven',sub_en='Upstairs in the barn’s entrance wing',pin=[722,752],inside='4',pinH=11),
 dict(n='4b',g='b',no='Overflow-rommet',en='Overflow room',sub_no='Inne i låven, i vestenden',sub_en='Inside the barn, at the west end',pin=[606,688],inside='4'),
 dict(n='5',g='b',no='Internatet',en='Dormitories',sub_no='',sub_en='',
      parts=[dict(p=R(1138,1108,1178,1212),h=6.5,wall=RED,roof='#6e3a2e',balconies=[dict(edge=1,n=2,color='#f4f2ec'),dict(edge=3,n=3,color='#f4f2ec')]),dict(p=R(1158,1143,1188,1175),h=6.5,wall=RED,roof='#5a2d26',cross=True,rise=4.4,trim=False,porch=[1188,1159,'e'])]),
 dict(n='6',g='b',no='«Bispen»',en='«Bispen»',sub_no='',sub_en='',
      # yellow house, ridge east-west with the gable to the west; steep red-brown roof; low wing on the north side,
      # dark deck with a white fence on the south side, small shed at the south-west corner
      parts=[dict(p=R(650,1086,694,1124),h=5.6,wall='#e8c77e',roof='#7a3328',bay=3.4,skylights=dict(s=1)),
             dict(p=R(652,1076,676,1086),h=3.0,wall='#e8c77e',roof='#7a3328',bay=3.4),
             dict(p=R(668,1124,696,1140),h=0.6,wall='#4a4440',roof='#5b5148',flat=True,plain=True,trim=False,railing=True),
             dict(p=R(648,1124,662,1134),h=2.3,wall='#9a9a92',roof='#43474c',bay=3.4)]),
 dict(n='7',g='b',no='Hybelhuset',en="Men's Manor",sub_no='',sub_en='',
      parts=[dict(p=[[1100,1300],[1118,1276],[1158,1306],[1140,1332]],h=3.4,wall='#e6bf4f',roof='#c0532f',rise=4.8,dormers=1,dormerSize=3,chimneys=[[1124,1298]],bay=3.6),dict(p=[[1128, 1302], [1149, 1318], [1175, 1284], [1154, 1268]],h=3.0,wall='#e6bf4f',roof='#c0532f',rise=2.8,trim=False,bay=3.6)]),
 dict(n='8',g='b',no='Rekkehusene',en='Row houses',sub_no='',sub_en='',
      parts=[dict(p=[[1017, 1297], [1054, 1323], [1035, 1349], [998, 1322]],h=5.6,wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2)),dict(p=[[1061, 1316], [1098, 1343], [1080, 1369], [1043, 1342]],h=5.6,wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2)),dict(p=[[1094, 1352], [1131, 1379], [1112, 1405], [1075, 1378]],h=5.6,wall='#a12e28',roof='#6b5b53',bay=3.4,balconies=dict(edge=2,n=2))]),
 dict(n='9',g='b',no='Grimerud Barnehage',en='Grimerud Kindergarten',sub_no='',sub_en='',
      parts=[dict(p=R(862,1064,906,1112),h=5.5,wall=RED,roof='#b23e2c',solar=True),dict(p=R(882,1112,906,1200),h=4.5,wall=RED,roof='#b23e2c'),dict(p=R(894,1128,924,1152),h=4.5,wall=RED,roof='#5a2d26',rise=2.7,trim=False)]),
 # lettered: arrival, outdoors, other buildings
 dict(n='P',g='a',no='Parkering',en='Car park',sub_no='',sub_en='Main parking on the south side of the farm road.',
      area=[[834,940],[1065,926],[1072,1056],[918,1058],[880,1044],[834,1044]]),
 dict(n='E',g='a',no='Innkjøring',en='Entrance',sub_no='',sub_en='Turn west off Grimerudvegen. The car park is about 100 m ahead on the left.',
      pin=[1442,838]),
 dict(n='H',g='a',no='Hagen og ballplassen',en='Garden & football lawn',sub_no='Fotballbane og sandvolleyballbane',sub_en='Football pitch and beach volleyball court',
      area=[[504,988],[770,988],[770,1113],[700,1117],[700,1212],[504,1212]],pin=[600,1045]),
 dict(n='L',g='a',no='Lekeplassen',en='Playground',sub_no='',sub_en='Play area in the trees between the kindergarten and the dormitories.',
      area=[[925,1090],[1110,1085],[1115,1250],[930,1250]],pin=[1010,1160]),
 dict(n='G',g='o',no='Garasjen',en='Garage',sub_no='',sub_en='Red garage building east of the barn.',
      parts=[dict(p=R(952,680,1000,800),h=5,wall=RED,roof=ROOF_GREY)]),
 dict(n='Y',g='o',no='Det gule huset',en='Yellow house',sub_no='',sub_en='Small yellow house between the garage and the main building.',
      parts=[dict(p=R(852,812,892,846),h=4.5,wall='#e6bf4f',roof='#c0532f')]),
 dict(n='S',g='o',no='Barracks',en='Barracks',sub_no='',sub_en='Long, low building along the farm road, opposite the car park.',
      parts=[dict(p=[[1026,872],[1210,832],[1220,866],[1035,906]],h=6,wall=RED,roof='#d6d4ce',flat=True)]),
 dict(n='W',g='o',no='Spiseteltet',en='Dining tent',sub_no='',sub_en='Large white tent just south of the main building.',
      parts=[dict(p=R(792,1138,826,1200),h=2.6,wall='#fbfaf5',roof='#f6f4ee',tent=True)]),
 dict(n='N',g='o',no='Nordlåven',en='North barn',sub_no='',sub_en='Older farm barn and work yard north of the garage, reached by the farm track.',
      parts=[dict(p=[[983,253],[1037,256],[1030,404],[978,400]],h=7,wall=RED,gable=RED,roof='#55585c',plain=True,base=[1.6,CONCRETE]),dict(p=R(830,303,866,338),h=3.5,wall=RED,roof='#55585c',plain=True)]),
 dict(n='I',g='o',no='Huset ved innkjøringen',en='House at the entrance',sub_no='',sub_en='First house on the right as you turn in from Grimerudvegen.',
      parts=[dict(p=R(1360,790,1404,816),h=4.5,wall=WHITE,roof=ROOF_RED)]),
]
CONTEXT=[
 dict(p=R(850,996,870,1016),h=2.6,wall='#f4f2ec',roof='#3e3a38',plain=True,trim=False,rise=1.4),
 dict(p=[[1178,1398],[1210,1368],[1240,1405],[1205,1435]],h=5,wall=YELLOW,roof='#c97f4a'),
]
FLAG=[740,925]
ROADS_EXTRA=[]
WALK_FIELD=[[1396,10],[1700,12],[2000,14],[2310,16],[2360,100],[2385,150]]
YARD=[[590,752],[805,752],[840,790],[840,840],[700,845],[595,840]]
SPORTS=dict(goals=[[548,1000,0],[548,1096,180]],court=[[562,1120],[637,1120],[637,1190],[562,1190]],net=[[600,1124],[600,1186]])
HEDGES=[[[997, 1324], [980, 1348], [1017, 1375], [1034, 1351]], [[1041, 1344], [1024, 1368], [1061, 1395], [1078, 1370]], [[1074, 1379], [1056, 1404], [1093, 1431], [1111, 1406]]]
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
