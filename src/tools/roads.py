"""Check how roads and paths join, and optionally snap their ends.

  python3 src/tools/roads.py          report
  python3 src/tools/roads.py --fix    snap ends onto the road they meet and rewrite src/content/data.py

A road end that meets another road is moved onto that road's centre line (as the map draws it,
after smoothing), so its rounded end sits fully inside the other road: no stub poking out past
the far edge and no notch at the near edge. Ends that meet the roundabout snap to its ring.
Ends inside the car park, the farmyard or a building, or off the map, are left alone.
Anything else is reported as a loose end.
"""
import sys, re, math
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src" / "content"))
import data

M = 0.29188
NEAR = 30          # px (~9 m): how far an end may be from a road to count as meeting it

def chaikin(pts, n=3):
    for _ in range(n):
        if len(pts) < 3: break
        o = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            o += [[a[0]*.75+b[0]*.25, a[1]*.75+b[1]*.25], [a[0]*.25+b[0]*.75, a[1]*.25+b[1]*.75]]
        o.append(pts[-1]); pts = o
    return pts

def closest_on(poly, p):
    best = (1e9, None, None)
    for a, b in zip(poly, poly[1:]):
        dx, dy = b[0]-a[0], b[1]-a[1]; L2 = dx*dx+dy*dy or 1e-9
        t = max(0, min(1, ((p[0]-a[0])*dx + (p[1]-a[1])*dy) / L2))
        q = [a[0]+dx*t, a[1]+dy*t]; d = math.dist(p, q)
        if d < best[0]: best = (d, q, t)
    return best

def inside(poly, p):
    c = False
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[i-1]
        if (y1 > p[1]) != (y2 > p[1]) and p[0] < (x2-x1)*(p[1]-y1)/(y2-y1)+x1: c = not c
    return c

def grow(poly, d):
    cx = sum(p[0] for p in poly)/len(poly); cy = sum(p[1] for p in poly)/len(poly)
    return [[x+(x-cx)/math.hypot(x-cx, y-cy)*d, y+(y-cy)/math.hypot(x-cx, y-cy)*d] for x, y in poly]

def analyse():
    roads = data.ROADS
    smooth = [chaikin([list(map(float, p)) for p in pts]) for pts, w, k in roads]
    park = [i for i in data.ITEMS if i['n'] == 'P'][0]['area']
    areas = [('car park', park), ('farmyard', data.YARD)]
    bldg = [q['p'] for it in data.ITEMS for q in it.get('parts', [])] + [q['p'] for q in data.CONTEXT]
    cx, cy, cr = data.CIRCLE
    out = []
    for i, (pts, w, kind) in enumerate(roads):
        hw = max(w, 3.2) / 2 / M
        for end in (0, -1):
            p = list(map(float, pts[end]))
            if not (0 < p[0] < 1792 and 0 < p[1] < 1792):
                out.append((i, end, 'off map', None)); continue
            # roundabout ring
            # a road wider than the ring stops a little outside it, so its rounded end doesn't bulge into the island
            ring_hw = 3.2 / 2 / M; rr = cr + max(0, hw - ring_hw)
            dc = abs(math.dist(p, (cx, cy)) - rr)
            if abs(math.dist(p, (cx, cy)) - cr) < NEAR:
                ang = math.atan2(p[1]-cy, p[0]-cx); q = [cx+math.cos(ang)*rr, cy+math.sin(ang)*rr]
                out.append((i, end, 'roundabout', q if dc > 0.6 else None)); continue
            # nearest other road
            best = (1e9, None, None)
            for j, sp in enumerate(smooth):
                if j == i: continue
                d, q, _ = closest_on(sp, p)
                if d < best[0]: best = (d, q, j)
            d, q, j = best
            if any(inside(b, p) or closest_on(b + [b[0]], p)[0] < 10 for b in bldg):
                out.append((i, end, 'at a building', None)); continue
            area = next((n for n, a in areas if inside(grow(a, 2), p)), None)
            if area and d > 2:
                out.append((i, end, 'in ' + area, None)); continue
            if d < NEAR:
                out.append((i, end, f'meets road {j}', q if d > 0.6 else None)); continue
            if any(inside(grow(b, 4), p) for b in bldg):
                out.append((i, end, 'at a building', None)); continue
            out.append((i, end, f'LOOSE END ({d*M:.0f} m from road {j})', None))
    return out

def main():
    res = analyse()
    fix = '--fix' in sys.argv
    for i, end, what, q in res:
        pts = data.ROADS[i][0]
        flag = f'  -> snap {pts[end]} to [{q[0]:.0f},{q[1]:.0f}]' if q else ''
        if q or 'LOOSE' in what or not fix:
            print(f'road {i:2} {"start" if end == 0 else "end  "} {pts[end]}: {what}{flag}')
    if not fix: return
    p = ROOT / 'src' / 'content' / 'data.py'; t = p.read_text(encoding='utf-8')
    cur = {i: [list(q) for q in pts] for i, (pts, w, k) in enumerate(data.ROADS)}
    for i, end, what, q in res:
        if not q: continue
        key = '[' + ','.join(f'[{x},{y}]' for x, y in cur[i]) + ']'
        assert t.count(key) == 1, f'road {i} not found once'
        cur[i][end] = [round(q[0]), round(q[1])]
        t = t.replace(key, '[' + ','.join(f'[{x},{y}]' for x, y in cur[i]) + ']')
    p.write_text(t, encoding='utf-8')
    print('data.py updated')

if __name__ == '__main__':
    main()
