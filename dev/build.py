"""Собирает index.html из src.html: подставляет сгенерированные SVG-фрагменты."""
import math, random, urllib.parse, pathlib

here = pathlib.Path(__file__).parent
root = here.parent if here.name == 'dev' else here   # можно держать сборщик в папке dev/
src = (here / 'src.html').read_text(encoding='utf-8')

def f(x):
    return f"{x:.1f}".rstrip('0').rstrip('.')

def rays(cx, cy, r1, r2a, r2b, n, width, color):
    out = []
    for i in range(n):
        a = 2 * math.pi * i / n
        r2 = r2a if i % 2 == 0 else r2b
        out.append(f'<line x1="{f(cx + r1*math.cos(a))}" y1="{f(cy + r1*math.sin(a))}" x2="{f(cx + r2*math.cos(a))}" y2="{f(cy + r2*math.sin(a))}"/>')
    return f'<g stroke="{color}" stroke-width="{width}" stroke-linecap="round">' + ''.join(out) + '</g>'

def tri_rays(cx, cy, r1, r2, n, half, color):
    out = []
    for i in range(n):
        a = 2 * math.pi * i / n
        b1, b2 = a - half, a + half
        pts = [(cx + r1*math.cos(b1), cy + r1*math.sin(b1)), (cx + r2*math.cos(a), cy + r2*math.sin(a)), (cx + r1*math.cos(b2), cy + r1*math.sin(b2))]
        out.append('M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in pts) + 'Z')
    return f'<path fill="{color}" d="' + ' '.join(out) + '"/>'

def star(cx, cy, R, r, color):
    pts = []
    for i in range(10):
        a = -math.pi/2 + i * math.pi/5
        rr = R if i % 2 == 0 else r
        pts.append(f'{f(cx + rr*math.cos(a))} {f(cy + rr*math.sin(a))}')
    return f'<path fill="{color}" d="M' + ' L'.join(pts) + 'Z"/>'

# --- архивные стеллажи: книги в переплётах и архивные короба ---
def shelves_svg(sfx, seed):
    rnd = random.Random(seed)
    spines = ['var(--il-box1)', 'var(--il-box2)', 'var(--il-box4)', 'var(--il-box1)', 'var(--il-box2)']
    items = []
    for rx in (28, 192, 356):
        for sy in (108, 170, 232, 294):
            x = rx + 9
            while True:
                if rnd.random() < .35:
                    w = rnd.choice([22, 26, 30]); h = rnd.choice([40, 44, 46])
                    if x + w > rx + 128: break
                    items.append(f'<rect x="{x}" y="{sy-h}" width="{w}" height="{h}" rx="1.5" fill="var(--il-box3)"/><rect x="{x+4}" y="{sy-h+9}" width="{w-8}" height="9" rx="1" fill="var(--il-label)"/><circle cx="{x+w/2}" cy="{sy-12}" r="2.2" fill="var(--il-rack)"/>')
                else:
                    w = rnd.choice([9, 11, 12, 14, 16]); h = rnd.choice([42, 46, 50, 54])
                    if x + w > rx + 128: break
                    c = rnd.choice(spines)
                    tilt = f' transform="rotate(-7 {x} {sy})"' if rnd.random() < .06 else ''
                    items.append(f'<g{tilt}><rect x="{x}" y="{sy-h}" width="{w}" height="{h}" rx="1" fill="{c}"/><rect x="{x}" y="{sy-h+5}" width="{w}" height="2" fill="var(--il-gilt)"/><rect x="{x}" y="{sy-9}" width="{w}" height="2" fill="var(--il-gilt)"/><rect x="{x+2}" y="{sy-h+13}" width="{w-4}" height="10" rx="1" fill="var(--il-gilt)" opacity=".55"/></g>')
                x += w + (2 if rnd.random() < .8 else 6)
    racks = []
    for rx in (28, 192, 356):
        racks.append(f'<rect x="{rx}" y="40" width="7" height="274" fill="var(--il-rack)"/><rect x="{rx+129}" y="40" width="7" height="274" fill="var(--il-rack)"/><rect x="{rx-2}" y="36" width="140" height="8" rx="1" fill="var(--il-rack)"/>')
        for sy in (108, 170, 232, 294):
            racks.append(f'<rect x="{rx}" y="{sy}" width="136" height="7" fill="var(--il-rack)"/>')
    return (
        f'<svg viewBox="0 0 520 400" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="shelf-t{sfx}"><title id="shelf-t{sfx}" data-i="shelfIll"></title>'
        '<rect width="520" height="400" fill="var(--il-wall)"/><rect y="314" width="520" height="86" fill="var(--il-floor)"/>'
        '<path d="M0 314H520" stroke="var(--il-rack)" stroke-width="2" opacity=".4"/>'
        + ''.join(racks) + ''.join(items) +
        '<rect x="96" y="330" width="328" height="12" rx="2" fill="var(--il-desk)"/><rect x="110" y="342" width="9" height="58" fill="var(--il-desk)"/><rect x="401" y="342" width="9" height="58" fill="var(--il-desk)"/>'
        '<rect x="118" y="318" width="70" height="12" rx="2" fill="var(--il-box2)"/><rect x="122" y="307" width="64" height="11" rx="2" fill="var(--il-box1)"/><rect x="116" y="297" width="70" height="10" rx="2" fill="var(--il-box3)"/>'
        '<path d="M262 329C240 316 216 314 192 318L188 329Z" fill="var(--il-page)" stroke="var(--il-page-edge)" stroke-width="2"/>'
        '<path d="M262 329C284 316 308 314 332 318L336 329Z" fill="var(--il-page)" stroke="var(--il-page-edge)" stroke-width="2"/>'
        '<path d="M200 322c18-4 36-4 54 2M272 324c18-6 36-6 54-2" stroke="var(--il-ink)" stroke-width="1.5" fill="none"/>'
        '<ellipse cx="384" cy="328" rx="18" ry="4" fill="var(--il-rack)"/><path d="M384 326L398 284L376 262" fill="none" stroke="var(--il-rack)" stroke-width="5" stroke-linecap="round"/>'
        '<path d="M360 262L392 250L398 270Z" fill="var(--il-gilt)"/><path d="M372 270L330 326H400Z" fill="var(--il-sun)" opacity=".22"/>'
        '</svg>')

# --- орнамент «қошқар мүйіз» для CSS ---
def orn_uri(color, bg=None):
    svg = (f"<svg xmlns='http://www.w3.org/2000/svg' width='56' height='28' viewBox='0 0 56 28'>"
           + (f"<rect width='56' height='28' fill='{bg}'/>" if bg else '')
           + f"<g fill='none' stroke='{color}' stroke-width='2.4' stroke-linecap='round'>"
           "<path d='M14 27V17c0-6-5-9-9-7.5S1 16 4 17.5s5 0 4.5-2.5M14 17c0-6 5-9 9-7.5s4 6.5 1 8-5 0-4.5-2.5'/>"
           "<path d='M42 1v10c0 6-5 9-9 7.5S29 12 32 10.5s5 0 4.5 2.5M42 11c0 6 5 9 9 7.5s4-6.5 1-8-5 0-4.5 2.5'/>"
           "</g></svg>")
    return 'data:image/svg+xml,' + urllib.parse.quote(svg, safe="/:=' ")

# --- вертикальный орнамент для флага ---
flag_orn = []
for i in range(7):
    y = 8 + i * 13
    flag_orn.append(f'M14 {y+10}v-4c0-3-2.6-4.6-4.6-3.8S7.4 5.4 9 {f(y+6.2)}' if False else '')
flag_orn_path = ''.join(
    f'M15 {y+11}V{y+6}c0-3-2.6-4.5-4.5-3.7s-2 3.3-.5 4 2.5 0 2.2-1.2M15 {y+6}c0-3 2.6-4.5 4.5-3.7s2 3.3.5 4-2.5 0-2.2-1.2'
    for y in range(4, 92, 12))

def fonts_css():
    """Шрифты Inter (текст) и Lora (заголовки), лицензия SIL OFL — подмножества WOFF из dev/fonts.
    ТЗ 7.2: раньше вшивались в index.html (≈230 КБ base64); теперь копируются в fonts/ и грузятся отдельными кэшируемыми файлами."""
    import shutil
    faces = [('Inter', 400, 'Inter-Regular'), ('Inter', 600, 'Inter-SemiBold'), ('Lora', '400 700', 'Lora')]
    out = []
    (root / 'fonts').mkdir(exist_ok=True)
    for fam, w, name in faces:
        f = here / 'fonts' / (name + '.woff')
        if not f.exists():
            continue
        shutil.copyfile(f, root / 'fonts' / f.name)
        out.append(f'@font-face{{font-family:"{fam}";src:url(/fonts/{f.name}) format("woff");font-weight:{w};font-style:normal;font-display:swap}}')
    # PT Serif Bold (ParaType, SIL OFL): шрифт заголовков, кириллица с казахскими буквами и латиница, WOFF2 из Google Fonts
    pt = [('cyrillic-ext', 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F'), ('cyrillic', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'),
          ('latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD')]
    for sub, rng in pt:
        f = here / 'fonts' / f'PTSerif-Bold-{sub}.woff2'
        if not f.exists():
            continue
        shutil.copyfile(f, root / 'fonts' / f.name)
        out.append(f'@font-face{{font-family:"PT Serif";src:url(/fonts/{f.name}) format("woff2");font-weight:700;font-style:normal;font-display:swap;unicode-range:{rng}}}')
    return '\n'.join(out)

def patched_site_data():
    """Данные сайта = dev/content.js (старый сайт) + dev/customer.json (данные заказчика от 10.11.2026: 13 филиалов, руководство, структура).
    content.js не меняется: видно, что пришло от заказчика, и пересборка воспроизводима."""
    import json as _j
    text = (here / 'content.js').read_text(encoding='utf-8')
    head, body = text.split('=', 1)
    site = _j.loads(body.strip().rstrip(';'))
    c = _j.loads((here / 'customer.json').read_text(encoding='utf-8'))
    site['branches'] = c['branches']
    site['leaders'] = c['leaders']
    site['history'] = [h for h in site.get('history', []) if h[0] != '2026'] + c['history_add']
    site['org'] = c['org']
    site['compliance'] = {k: v for k, v in _j.loads((here / 'customer-compliance.json').read_text(encoding='utf-8')).items() if not k.startswith('_')}
    site['prices'] = {k: v for k, v in _j.loads((here / 'customer-prices.json').read_text(encoding='utf-8')).items() if not k.startswith('_')}
    return head + '= ' + _j.dumps(site, ensure_ascii=False, separators=(',', ':')) + ';'

def site_data_name():
    import hashlib
    data = patched_site_data()
    name = 'site-data.' + hashlib.sha256(data.encode('utf-8')).hexdigest()[:10] + '.js'
    for old in root.glob('site-data.*.js'):
        if old.name != name:
            old.unlink()
    (root / name).write_text(data, encoding='utf-8')
    return name

rep = {
    '@@HERO_RAYS@@': rays(640, 106, 52, 70, 62, 32, 4, 'var(--il-sun)'),
    '@@EMBLEM_RAYS@@': rays(50, 50, 16, 43, 43, 24, 1.6, '#F2B40F'),
    '@@EMBLEM_STAR@@': star(50, 9.5, 6.5, 2.7, '#F2B40F'),
    '@@FLAG_RAYS@@': tri_rays(104, 38, 16, 25, 32, .055, '#FEC50C'),
    '@@SHANYRAK_UYKS@@': rays(100, 100, 56, 96, 96, 32, 3, 'currentColor'),
    '@@SHELVES_SVG_A@@': shelves_svg('a', 7),
    '@@SHELVES_SVG_B@@': shelves_svg('b', 21),
    '@@ORN_BRASS@@': orn_uri('#B8954E'),
    '@@ORN_BROWN@@': orn_uri('#8A6A4A'),
    '@@ORN_YELLOW@@': orn_uri('#FFE500'),
    '@@FLAG_ORN@@': flag_orn_path,
    # ТЗ 7.2: данные сайта (window.SITE, ≈0,6 МБ) — отдельный файл site-data.<хеш>.js рядом с index.html.
    # Хеш в имени: браузер кэширует файл надолго и сам берёт новый после пересборки. Сервер читает из него pidx для SEO
    '@@SITE_DATA_URL@@': '/' + site_data_name(),
    # разделы по ТЗ (каталог, архив памяти, выставки, филиалы, справка): отдельные файлы, чтобы их было проще править
    # formats.js (чтение TIFF и XLSX без библиотек) идёт перед tz.js: tz.js им пользуется. Отдельный файл — чтобы проверять его в Node (tests/formats.js)
    '@@TZ_JS@@': (here / 'formats.js').read_text(encoding='utf-8') + '\n' + (here / 'tz.js').read_text(encoding='utf-8') + '\n' + (here / 'tz-sections.js').read_text(encoding='utf-8'),
    '@@TZ_CSS@@': (here / 'tz.css').read_text(encoding='utf-8'),
    '@@FONTS_CSS@@': fonts_css(),
    # ТЗ 7.2: герб города, флаг и герб РК — ссылками на файлы (раньше base64, причём каждый дважды); браузер кэширует их один раз
    '@@CITY_ARMS@@': '/img/ust-kamenogorsk-arms.png',
    # официальные флаг и герб РК (присланы командой): img/symbols/
    '@@RK_FLAG@@': '/img/symbols/rk-flag.jpg',
    '@@RK_EMBLEM@@': '/img/symbols/rk-emblem.webp',
}
# ТЗ 7.2: короткий список фото заставки [имя, ширина, ширина -1200] для встроенного скрипта, который показывает первое фото до основного
import re as _re, json as _json
_pool = _re.findall(r"\{f:'([\w-]+)', c:'\w+', w:(\d+), h:\d+, sw:(\d+)", src.split('const HERO_POOL', 1)[1].split('];', 1)[0])
assert len(_pool) >= 10, _pool
rep['@@HERO_MINI@@'] = _json.dumps([[f, int(w), int(sw)] for f, w, sw in _pool], separators=(',', ':'))
# ТЗ 7.2: переводы подписей верхней строки и шапки для раннего скрипта (data-i из разметки до </header>, тексты — из T в src.html и tz.js)
_head = src[src.index('<div class="topbar">'):src.index('</header>')]
_tsrc = src + (here / 'tz.js').read_text(encoding='utf-8')
_str = r'"(?:[^"\\]|\\.)*"'
_head_t = {}
for _k in sorted(set(_re.findall(r'data-i="(\w+)"', _head)) | {'heroKick', 'heroTitle'}):
    _m = _re.search(r'(?<![\w.])' + _k + r'\s*:\s*\[(' + _str + r')\s*,\s*(' + _str + r')\s*,\s*(' + _str + r')\]', _tsrc)
    if _m:
        _head_t[_k] = [_json.loads(_m.group(i)) for i in (1, 2, 3)]
assert 'navAbout' in _head_t and 'orgName' in _head_t, sorted(_head_t)
rep['@@HEAD_T@@'] = _json.dumps(_head_t, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
for k, v in rep.items():
    src = src.replace(k, v)
# фото из img/*.jpg (заставка, здание, архивные кадры) больше не вшиваются в index.html: это ≈0,8 МБ base64.
# Они грузятся отдельными файлами параллельно со страницей и кэшируются (sw.js — для работы без сети).
left = [k for k in rep if k in src]
assert not left, left
# ТЗ 7.2: основной скрипт (≈620 КБ), данные сайта и QR-библиотека не вшиты в HTML и не стоят в нём тегами <script>: их подгружает короткий загрузчик
# ПОСЛЕ первой отрисовки (два кадра подряд; запасной таймер 1,2 с на случай скрытой вкладки). Так первый кадр — заставка и шапка из раннего кода, а HTML ≈240 КБ
# не ждёт ≈270 КБ скриптов, которые иначе попадали бы в путь главного кадра. Имя с хешем: браузер кэширует файлы надолго и сам берёт новые после пересборки.
# async=false сохраняет порядок выполнения: QR, данные сайта, основной код
import hashlib as _hl
def _external(html, pattern, prefix, marker):
    m = _re.search(pattern, html, _re.S)
    assert m, prefix
    body = m.group(1).strip() + '\n'
    name = prefix + '.' + _hl.sha256(body.encode('utf-8')).hexdigest()[:10] + '.js'
    for old in root.glob(prefix + '.*.js'):
        if old.name != name:
            old.unlink()
    (root / name).write_text(body, encoding='utf-8')
    return html[:m.start()] + marker + html[m.end():], name
src, _qr = _external(src, r'<script>(\s*/\* QRCode for JavaScript.*?)</script>', 'qr', '')
src, _app = _external(src, r"<script>(\s*\(\(\) => \{\s*'use strict';.*?)</script>", 'app', '@@LOADER@@')
_sd = _re.search(r'<script src="/(site-data\.[a-f0-9]{10}\.js)" id="site-data"></script>', src)
assert _sd
src = src.replace(_sd.group(0), '')
_loader = ('<script>(function () { var L = ["/' + _qr + '", "/' + _sd.group(1) + '", "/' + _app + '"], d = 0;\n'
           'function go() { if (d) return; d = 1; L.forEach(function (u) { var s = document.createElement("script"); s.src = u; s.async = false; document.head.appendChild(s); });\n'
           '  Array.prototype.forEach.call(document.querySelectorAll("img[data-src]"), function (i) { i.src = i.getAttribute("data-src"); }); }\n'
           'function after() { requestAnimationFrame(function () { setTimeout(go, 50); }); }\n'
           '/* ждём два события: первая отрисовка и загрузка фото заставки (если оно есть); иначе запасной таймер 2,5 с */\n'
           'var n = 0; function need() { if (++n === 2) after(); }\n'
           'try { new PerformanceObserver(function (l, o) { if (l.getEntries().some(function (e) { return e.name === "first-contentful-paint"; })) { o.disconnect(); need(); } }).observe({type: "paint", buffered: true}); } catch (e) { need(); }\n'
           'var hb = document.querySelector(".hs-boot img");\n'
           'if (hb && !(hb.complete && hb.naturalWidth)) { hb.addEventListener("load", need, {once: true}); hb.addEventListener("error", need, {once: true}); } else need();\n'
           'setTimeout(go, 2500); })();</script>')
src = src.replace('@@LOADER@@', _loader)
assert '@@LOADER@@' not in src
(root / 'index.html').write_text(src, encoding='utf-8')
# новости с прежнего сайта: сервер берёт их как стартовые при первом запуске
import json
site = json.loads((here / 'content.js').read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
(root / 'news-seed.json').write_text(json.dumps(site.get('news', []), ensure_ascii=False, indent=1), encoding='utf-8')
print('ok', len(src))
