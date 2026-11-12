"""Проверка фото карусели на главной: файлы на месте, размеры совпадают с HERO_POOL,
и ни на одном типичном экране фото не растягивается сильнее допустимого.

Запуск:  python tests/hero.py
Увеличение считается от исходника (поле q, без него — ширина большого файла):
  до 1.15 — хорошо, до 1.3 — терпимо (предупреждение), больше — ошибка: фото будет мыльным.
Логика кадра повторяет Hero.place в dev/src.html (cover / pan / fit и предел 1.5).
"""
import os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = open(os.path.join(ROOT, 'dev', 'src.html'), encoding='utf-8').read()
a = SRC.index('const HERO_POOL = ['); b = SRC.index('];\nconst HERO_N', a)
POOL = []
for m in re.finditer(r"\{f:'(\w+)', c:'(\w+)', w:(\d+), h:(\d+), sw:(\d+)(?:, q:(\d+))?, b:\[([^\]]+)\]", SRC[a:b]):
    f, c, w, h, sw, q, box = m.groups()
    POOL.append(dict(f=f, c=c, w=int(w), h=int(h), sw=int(sw), q=int(q or w), b=[float(x) for x in box.split(',')]))

# экраны: ширина и высота кадра карусели (окно минус шапка и нижняя панель)
SCREENS = [('ноутбук 1366', 1366, 634), ('ноутбук 1440', 1440, 766), ('монитор 1920', 1920, 946),
           ('планшет 768', 768, 904), ('телефон 390', 390, 626)]
WARN, FAIL = 1.15, 1.3

def scale(s, W, H, still=False):
    x0, y0, x1, y1 = s['b']; bw = (x1 - x0) * s['w']; bh = (y1 - y0) * s['h']
    sc = max(W / s['w'], H / s['h']); mode = 'cover'
    over = bw * sc / W
    if bh * sc > H * 1.04: mode = 'fit'
    elif over > 1.04: mode = 'pan' if not still and over <= 3 else 'fit'
    if mode == 'fit': sc = max(min(W / bw, H / bh) * .96, min(W / s['w'], H / s['h']))
    cap = s['q'] * 1.5 / s['w']
    if sc > cap: sc, mode = cap, 'fit'
    return sc * s['w'] / s['q'], mode

errors = warns = 0
print(f'Фото в карусели: {len(POOL)}')
for s in POOL:
    for size in ('2400', '1200'):
        p = os.path.join(ROOT, 'img', 'hero', f"{s['f']}-{size}.jpg")
        if not os.path.exists(p): print(f"  ОШИБКА {s['f']}: нет файла {os.path.basename(p)}"); errors += 1; continue
        iw, ih = Image.open(p).size
        want = (s['w'], s['h']) if size == '2400' else (s['sw'], round(s['h'] * s['sw'] / s['w']))
        if iw != want[0] or abs(ih - want[1]) > 2: print(f"  ОШИБКА {s['f']}-{size}: {iw}x{ih}, в списке {want[0]}x{want[1]}"); errors += 1
    row = []
    for name, W, H in SCREENS:
        up, mode = scale(s, W, H)
        mark = '!!' if up > FAIL else '!' if up > WARN else ''
        if up > FAIL: errors += 1
        elif up > WARN: warns += 1
        row.append(f"{name}: x{up:.2f} {mode}{mark}")
    print(f"  {s['f']:<10} исходник {s['q']}px | " + ' | '.join(row))
print(f"Ошибок: {errors}, предупреждений: {warns}")
sys.exit(1 if errors else 0)
