"""Данные разделов по ТЗ: электронный каталог, «Архив памяти», онлайн-выставки.

Всё берётся из выгрузки прежнего сайта (data/old-site/vko_site_data.json) и из dev/content.js.
Ничего не выдумываем: если поля нет в источнике, оно остаётся пустым, а на сайте пишется «не указано».

Запуск (из папки arhiv-vko):
  python tools/build_tz.py ../data/old-site/vko_site_data.json
Пишет:
  pages/catalog.json — записи каталога: фонды, описи, дела, документы, фото, карты, публикации, видео
  pages/memory.json  — люди, хронология, коллекции «Архива памяти»
  pages/expo.json    — онлайн-выставки
Каталог грузится сайтом по требованию; сотрудники дополняют его в админке (импорт CSV).
"""
import json, re, sys, pathlib, html
from collections import OrderedDict, defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
OLD = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT.parent / 'data' / 'old-site' / 'vko_site_data.json')
DATA = json.loads(OLD.read_text(encoding='utf-8'))
SITE = json.loads((ROOT / 'dev' / 'content.js').read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
PIDX = {r[0]: r for r in SITE.get('pidx', [])}

PAGES = {}
for p in DATA['pages']:
    if p.get('broken') or not p.get('pageId'):
        continue
    k = (p['pageId'], p['lang'])
    if k not in PAGES or (p.get('branch') == 'main'):
        PAGES[k] = p

def page(pid, lang='ru'):
    return PAGES.get((pid, lang))

def clean(s):
    s = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', s or '')
    s = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', s)
    s = re.sub(r'\*+', '', s)
    s = html.unescape(s)
    return re.sub(r'[ \t]+', ' ', s).strip()

def one_line(s, n=220):
    s = re.sub(r'\s+', ' ', clean(s)).strip(' .:;,-')
    return s if len(s) <= n else s[:n].rsplit(' ', 1)[0] + '…'

def years(s):
    ys = [int(y) for y in re.findall(r'(?<!\d)(1[6-9]\d\d|20[0-2]\d)(?!\d)', s or '')]
    return (min(ys), max(ys)) if ys else (None, None)

ARCH = {'gavko': 'Государственный архив ВКО', 'uka': 'Усть-Каменогорский филиал по личному составу', 'ridder': 'Риддерский филиал',
        'zirian': 'Филиал Алтай', 'zaisan': 'Зайсанский филиал'}
BR = {'main': 'gavko', 'vko': 'gavko', 'uka': 'uka', 'ridder': 'ridder', 'zirian': 'zirian', 'zaisan': 'zaisan', 'jarma': 'jarma', 'ajaguz': 'ajaguz'}

# --- темы и места: классификация по словам заголовка и описания (сами факты не меняются) ---
TOPICS = OrderedDict([
    ('war', r'войн|фронт|вов\b|отечествен|воен|солдат|дивизи|мобилизац|победы|панфилов|орден[а ]+слав|героев? советского'),
    ('industry', r'завод|комбинат|фабрик|рудник|промышлен|металлург|гэс\b|энерг|геолог|шахт|руд[аы]\b|совнархоз|предприят'),
    ('edu', r'школ|учител|образован|институт|университет|училищ|техникум|студент|ликбез|грамотн'),
    ('culture', r'театр|музе|художник|живопис|график|поэт|писател|литератур|кино|концерт|культур|искусств|цирк|библиотек|фотограф'),
    ('people', r'героя? социалистическ|почетн|почётн|заслуженн|лет со дня рождения|биограф|личн\w* фонд|родил[асья]*\b|кавалер'),
    ('city', r'усть-каменогорск|өскемен|устькаменн|оскемен'),
    ('region', r'район|област|край|село|сел[ае]\b|аул|крепост|поселок|посёлок|станиц'),
    ('repress', r'репресс|гулаг|спецпересел|реабилит|раскулач'),
    ('sport', r'спорт|гирев|атлет|пауэрлифт|чемпион|олимпи|турнир'),
    ('org', r'исполком|совет\b|советов|обком|горком|райком|управлени|акимат|аким\b|акимы|маслихат|ревком|министерств|комитет'),
    ('family', r'семь[яеи]|генеалог|метрическ|родослов|рождени[ея] и смерт'),
    ('nature', r'природ|заповедн|ландшафт|озер|река|горы|хребет|тайг|флора'),
])
def topics_of(s):
    s = (s or '').lower()
    return [k for k, rx in TOPICS.items() if re.search(rx, s)]

PLACES = OrderedDict([
    ('Усть-Каменогорск', r'усть-каменогорск|өскемен|устькаменн'), ('Риддер', r'риддер|лениногорск'), ('Алтай (Зыряновск)', r'зырянов|г\.\s*алтай|район алтай|филиал алтай'),
    ('Зайсан', r'зайсан'), ('Семей', r'семей|семипалатинск'), ('Курчатов', r'курчатов'), ('Серебрянск', r'серебрянск'), ('Шемонаиха', r'шемонаих'),
    ('Глубокое', r'глубоков|глубокое'), ('Катон-Карагай', r'катон-карага'), ('Кокпекты', r'кокпект'), ('Курчум', r'курчум'), ('Тарбагатай', r'тарбагата'),
    ('Уланский район', r'уланск'), ('Урджар', r'урджар'), ('Аягоз', r'аягоз|аягуз'), ('Жарма', r'жарм'), ('Бородулиха', r'бородулих'), ('Бескарагай', r'бескарага'),
    ('Абайский район', r'абайск\w* район'), ('Самарское', r'самарск'), ('Маркаколь', r'маркакол'), ('Большенарымское', r'большенарым|нарым'),
])
def places_of(s):
    s = (s or '').lower()
    return [k for k, rx in PLACES.items() if re.search(rx, s)]

REC = OrderedDict()
def add(r):
    r = {k: v for k, v in r.items() if v not in (None, '', [], {})}
    base = r['id']; n = 2
    while r['id'] in REC:
        r['id'] = f'{base}-{n}'; n += 1
    text = ' '.join([r.get('t', {}).get('ru', ''), r.get('ds', ''), r.get('nt', ''), r.get('au', ''), r.get('col', '')])
    r.setdefault('top', topics_of(text))
    r.setdefault('pl', places_of(text))
    if r.get('y0') is None:
        y0, y1 = years(r.get('dt', '') or r.get('t', {}).get('ru', ''))
        if y0: r['y0'], r['y1'] = y0, y1
    r = {k: v for k, v in r.items() if v not in (None, '', [], {})}
    REC[r['id']] = r
    return r

def code(arch, f=None, o=None, d=None, l=None):
    parts = [{'gavko': 'ГАВКО'}.get(arch, ARCH.get(arch, arch))]
    if f: parts.append(f'Ф. {f}')
    if o: parts.append(f'Оп. {o}')
    if d: parts.append(f'Д. {d}')
    if l: parts.append(f'Л. {l}')
    return '. '.join(parts)

FONDS = {}   # (arch, f) -> id
def fond(arch, f, title=None, **kw):
    key = (arch, str(f))
    if key in FONDS:
        r = REC[FONDS[key]]
        if title and r['t']['ru'].startswith('Фонд №'):
            r['t'] = {'ru': title}
        for k, v in kw.items():
            if v and not r.get(k): r[k] = v
        return r
    r = add({'id': f'f-{arch}-{f}', 'k': 'fond', 't': {'ru': title or f'Фонд № {f}'}, 'a': arch, 'f': str(f), 'c': code(arch, f), 'acc': 'open', **kw})
    FONDS[key] = r['id']
    return r

INVS = {}
def inv(fid, o):
    fr = REC[fid]; key = (fid, str(o))
    if key in INVS: return REC[INVS[key]]
    r = add({'id': f'{fid}-o{o}'.replace('f-', 'i-', 1), 'k': 'inv', 't': {'ru': f'Опись № {o} фонда № {fr["f"]}'}, 'a': fr['a'], 'f': fr['f'], 'o': str(o),
             'c': code(fr['a'], fr['f'], o), 'par': fid, 'acc': 'open', 'top': fr.get('top', []), 'pl': fr.get('pl', [])})
    INVS[key] = r['id']
    return r

FILES = {}
def file_(fid, o, d, l=None, src=None, ctx=None):
    fr = REC[fid]; key = (fid, str(o), str(d))
    if key in FILES:
        r = REC[FILES[key]]
        if src and src not in r.setdefault('refs', []): r['refs'].append(src)
        return r
    par = inv(fid, o)['id'] if o else fid
    r = add({'id': f'u-{fr["a"]}-{fr["f"]}-{o or 0}-{d}', 'k': 'file', 't': {'ru': f'Дело № {d}' + (f', опись № {o}' if o else '') + f', фонд № {fr["f"]}'},
             'a': fr['a'], 'f': fr['f'], 'o': str(o) if o else None, 'd': str(d), 'l': l, 'c': code(fr['a'], fr['f'], o, d), 'par': par, 'acc': 'open',
             'ds': ctx, 'refs': [src] if src else None})
    FILES[key] = r['id']
    return r

# ---------- 1. личные фонды главного архива: таблица на странице 1352 ----------
def fix_name(nm):
    nm = re.sub(r'\s+', ' ', nm).strip()
    if nm.upper() == nm:
        nm = ' '.join(w if re.fullmatch(r'([А-ЯЁA-Z]\.)+', w) else w.capitalize() for w in nm.split(' '))
    return re.sub(r'([А-ЯЁ])\.([А-ЯЁ])', r'\1. \2', nm)
# имена с правильным написанием — из SITE.personal (там же номер фонда)
PERS_NAMES = {}
for x in SITE.get('personal', []):
    mm = re.search(r'ф\.?\s*(\d+)', x.get('s', ''))
    if mm: PERS_NAMES.setdefault(mm.group(1), x['n'])
def parse_personal_table(pid, arch_default):
    p = page(pid)
    if not p: return 0
    n = 0
    for row in re.findall(r'^\|(.+)\|\s*$', p['text_md'], re.M):
        cells = [c.strip() for c in row.split('|')]
        if len(cells) < 2 or set(cells[0]) <= set('- '): continue
        name = clean(cells[0]); info = clean(cells[1])
        m = re.search(r'ф\.?\s*№?\s*(\d+)', info, re.I)
        if not m or not name: continue
        link = re.search(r'/Page/Index/(\d+)(?:/(\w+))?', cells[0] + cells[1])
        arch = arch_default
        if re.search(r'ГАВКО', info): arch = 'gavko'
        o = re.search(r'оп\.?\s*№?\s*([\w\-]+)', info, re.I)
        u = re.search(r'(\d+)\s*ед', info)
        y0, y1 = years(info)
        nm = PERS_NAMES.get(m.group(1)) or fix_name(name)
        r = fond(arch, m.group(1), f'Личный фонд: {nm}', sub='pers', u=int(u.group(1)) if u else None, y0=y0, y1=y1,
                 dt=f'{y0}–{y1}' if y0 and y1 and y0 != y1 else (str(y0) if y0 else None), au=nm, src=int(link.group(1)) if link else None,
                 ds=info, top=['people'])
        if o: inv(r['id'], o.group(1))
        n += 1
    return n

n_pers = parse_personal_table(1352, 'gavko')

# ---------- 2. фонды филиалов: «Характеристика фондов» и «Фонды личного происхождения» ----------
# Аягозский и Жарминский филиалы с 2022 года относятся к области Абай — их фонды в каталог ВКО не входят
BRANCH_PAGES = {'zaisan': [1650, 1651], 'ridder': [1655, 1656], 'zirian': [1692, 1693, 1700, 1701], 'uka': [1642]}
for arch, pids in BRANCH_PAGES.items():
    for pid in pids:
        p = page(pid)
        if not p: continue
        t = p['text_md']
        # «Фонд № 181 «Коллекция документов по истории края» за 1788-2002 годы, в количестве - 43 ед.хр.»
        for m in re.finditer(r'Фонд\s*№\s*(\d+)\s*[«"]([^»"]{4,200})[»"]([^.\n]{0,120})', t):
            y0, y1 = years(m.group(3)); u = re.search(r'(\d+)\s*ед', m.group(3))
            title = clean(m.group(2))
            fond(arch, m.group(1), title, sub='pers' if re.search(r'личн', title, re.I) else 'org', y0=y0, y1=y1, u=int(u.group(1)) if u else None,
                 dt=f'{y0}–{y1}' if y0 and y1 else None, src=pid, ds=one_line(m.group(0), 300))
        # личные: «**Караканов C.Х.** ГА Жарминского района, Фонд №222, опись № 1, ...»
        for m in re.finditer(r'\*\*([^*\n]{3,60})\*\*[^\n]{0,80}?(?:Фонд|Ф\.)\s*№?\s*(\d+)[,.\s]*(?:оп(?:ись)?\.?\s*№?\s*([\w\-]+))?([^\n|]{0,120})', t):
            name = clean(m.group(1)).strip(' .,:')
            if len(name) < 3 or re.search(r'фонд|архив|район', name, re.I): continue
            rest = m.group(4) or ''; y0, y1 = years(rest); u = re.search(r'(\d+)\s*ед', rest)
            r = fond(arch, m.group(2), f'Личный фонд: {name}', sub='pers', au=name, y0=y0, y1=y1, u=int(u.group(1)) if u else None,
                     dt=f'{y0}–{y1}' if y0 and y1 and y0 != y1 else None, src=pid, top=['people'])
            if m.group(3): inv(r['id'], m.group(3))

# риддерский: «[Медведев Петр Павлович](…/ridder) - ф.6, оп.1, 1900-1972 гг., 60 ед.хр.»; филиал Алтай: «1.Коллекция … (ф. 382, оп.1-31, 340 ед.хр., 1930-1999 г.г.)»
for arch, pids in BRANCH_PAGES.items():
    for pid in pids:
        p = page(pid)
        if not p: continue
        t = p['text_md']
        for m in re.finditer(r'\[([^\]]{3,80})\]\((?:[^)]*?/Page/Index/(\d+)[^)]*)?\)\s*[-–]\s*ф\.?\s*(\d+)\s*,\s*оп\.?\s*([\w\-–]+)([^\n\[]{0,80})', t):
            name = fix_name(clean(m.group(1))); rest = m.group(5); y0, y1 = years(rest); u = re.search(r'(\d+)\s*ед', rest)
            r = fond(arch, m.group(3), f'Личный фонд: {name}', sub='pers', au=name, y0=y0, y1=y1, u=int(u.group(1)) if u else None,
                     dt=f'{y0}–{y1}' if y0 and y1 and y0 != y1 else None, src=int(m.group(2)) if m.group(2) else pid, top=['people'])
            inv(r['id'], m.group(4).replace('–', '-'))
        for m in re.finditer(r'(?:^|\n|\*\*)\s*\d+\.\s*(?:\*\*)?\s*([^()\n]{10,320}?)\s*\(ф\.?\s*(\d+)\s*[;,]\s*оп\.?\s*([\w\-– ]+?)\s*[,;]([^)]*)\)', t):
            title = one_line(m.group(1), 240); rest = m.group(4); y0, y1 = years(rest); u = re.search(r'(\d+)\s*ед', rest)
            fond(arch, m.group(2), title, sub='pers' if re.search(r'личн|геро|участник|ветеран|заслуж', title, re.I) else 'org', y0=y0, y1=y1,
                 u=int(u.group(1)) if u else None, dt=f'{y0}–{y1}' if y0 and y1 else None, src=pid, ds=f'Описи: {m.group(3).strip()}; ' + rest.strip(' ,;'))

# ---------- 3. документы: «Рассекреченные материалы» (страница 42458), у каждого есть «Основание» ----------
MONTHS = {'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6, 'июля': 7, 'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12}
def date_of(s):
    m = re.search(r'(\d{1,2})\s+(' + '|'.join(MONTHS) + r')\s+(1[6-9]\d\d|20\d\d)', s)
    if m: return f'{int(m.group(1)):02d}.{MONTHS[m.group(2)]:02d}.{m.group(3)}', int(m.group(3))
    m = re.search(r'(\d{1,2})\.(\d{1,2})\.(1[6-9]\d\d|20\d\d)', s)
    if m: return f'{int(m.group(1)):02d}.{int(m.group(2)):02d}.{m.group(3)}', int(m.group(3))
    m = re.search(r'(\d{1,2})\.(\d{1,2})\.(\d\d)\s*г', s)
    if m: return f'{int(m.group(1)):02d}.{int(m.group(2)):02d}.19{m.group(3)}', 1900 + int(m.group(3))
    return None, None

p = page(42458)
n_doc = 0
if p:
    body = p['text_md']
    chunks = re.split(r'(Основание:\s*[^\n]+)', body)
    for i in range(0, len(chunks) - 1, 2):
        text, basis = chunks[i].strip(), chunks[i + 1]
        m = re.search(r'ф\.?\s*(\d+)\s*,\s*оп\.?\s*([\w\-]+)\s*,\s*д\.?\s*([\w\-]+)(?:\s*,\s*л+\.?\s*([\d\-–, об.]+))?', basis, re.I)
        if not m or len(text) < 40: continue
        lines = [clean(x) for x in text.split('\n') if clean(x)]
        stamp = [x for x in lines[:2] if re.match(r'(Сов\.?\s*секретно|Секретно|Совершенно секретно)', x, re.I)]
        head = next((x for x in lines if not re.match(r'(Сов\.?\s*секретно|Секретно|Совершенно секретно|Н\s*А\s*Р\s*Я\s*Д)$', x, re.I) and len(x) > 15), lines[0])
        dt, y = date_of(' '.join(lines[:6]))
        fid = fond('gavko', m.group(1))['id']
        fl = file_(fid, m.group(2), m.group(3), src=42458)
        l = (m.group(4) or '').strip(' .,')
        add({'id': f'd-42458-{n_doc + 1}', 'k': 'doc', 't': {'ru': one_line(head, 200)}, 'a': 'gavko', 'f': m.group(1), 'o': m.group(2), 'd': m.group(3), 'l': l,
             'c': code('gavko', m.group(1), m.group(2), m.group(3), l), 'par': fl['id'], 'dt': dt, 'y0': y, 'y1': y,
             'tx': '\n'.join(lines), 'acc': 'declass', 'lang': 'ru', 'src': 42458, 'gr': stamp[0] if stamp else None,
             'nt': 'Рассекреченный документ. Опубликован архивом в разделе «Рассекреченные материалы».'})
        n_doc += 1

# ---------- 4. дела, на которые ссылаются публикации архива (ГАВКО и архивы филиалов) ----------
CITE = re.compile(r'(ГАВКО|ГА\s*ВКО|Государственн\w+ архив\w* Восточно-Казахстанской области(?:\s*\(ГАВКО\))?)\s*[,.:]?\s*ф\.?\s*(\d+)\s*[,.]\s*оп\.?\s*([\w\-]+)\s*[,.]\s*д\.?\s*([\w\-]+)(?:\s*[,.]\s*лл?\.?\s*([\d\-–, об.]+))?', re.I)
n_cite = 0
for (pid, lang), p in sorted(PAGES.items()):
    if lang != 'ru' or pid == 42458: continue
    for m in CITE.finditer(p.get('text_md') or ''):
        fid = fond('gavko', m.group(2))['id']
        file_(fid, m.group(3), m.group(4), l=(m.group(5) or '').strip(' .,') or None, src=pid)
        n_cite += 1
for r in REC.values():
    if r['k'] == 'file' and r.get('refs') and not r.get('ds'):
        titles = [clean((PIDX.get(x) or [0, ''])[1]) for x in r['refs'][:3]]
        titles = [x for x in titles if x]
        if titles:
            r['ds'] = 'Дело упоминается в публикациях архива: ' + '; '.join(f'«{x}»' for x in titles) + '.'
            text = ' '.join(titles)
            r['top'] = sorted(set(r.get('top', [])) | set(topics_of(text)))
            r['pl'] = sorted(set(r.get('pl', [])) | set(places_of(text)))

# ---------- 5. фотодокументы и карты: альбомы фотокаталога ----------
MAPRX = re.compile(r'\bкарт[аые]\b|\bплан\b|план-схем|схем[аы]\b|чертёж|чертеж', re.I)
n_ph = 0
for a in SITE.get('galleryAlbums', []):
    at = a['t'].get('ru', '')
    for i, ph in enumerate(a.get('ph', [])):
        cap = clean((ph.get('c') or {}).get('ru', ''))
        title = one_line(cap, 160) if cap else f'{at}, фото {i + 1}'
        dt, y = date_of(cap)
        y0, y1 = (y, y) if y else years(cap)
        add({'id': f'ph-{a["id"]}-{i + 1}', 'k': 'map' if MAPRX.search(cap) else 'photo', 't': {'ru': title}, 'a': 'gavko',
             'col': at, 'ds': cap if len(cap) > len(title) else None, 'dt': dt or (str(y0) if y0 and y0 == y1 else None), 'y0': y0, 'y1': y1,
             'img': [ph['s']], 'acc': 'open', 'alb': a['id'], 'ai': i,
             'top': sorted(set(topics_of(cap + ' ' + at)))})
        n_ph += 1

# ---------- 6. письменные источники: публикации и доклады ----------
def find_pid(title):
    tt = re.sub(r'[«»"“”]', '', clean(title)).lower()[:60]
    for r in SITE.get('pidx', []):
        rt = re.sub(r'[«»"“”]', '', r[1] or '').lower()
        if rt and (rt[:50] in tt or tt[:50] in rt): return r[0]
    return None

for i, a in enumerate(SITE.get('articles', [])):
    t = clean(a['t']).strip()
    if t.startswith('«') and t.count('«') == 1 and t.endswith('»'): t = t[1:-1]
    pid = find_pid(t)
    add({'id': f'pub-{pid or "a" + str(i)}', 'k': 'pub', 't': {'ru': one_line(t, 240)}, 'au': a.get('a'), 'a': 'gavko', 'src': pid, 'acc': 'open', 'lang': 'ru',
         'nt': 'Публикация сотрудников архива на основе документов фондов.'})
for i, a in enumerate(SITE.get('talks', [])):
    t = clean(a['t'])
    pid = find_pid(t)
    add({'id': f'talk-{i}', 'k': 'pub', 't': {'ru': one_line(t, 240)}, 'au': a.get('a'), 'a': 'gavko', 'src': pid, 'acc': 'open', 'lang': 'ru', 'gr': a.get('k')})

# справочники прежнего сайта, которые можно скачать (перечни фондов и газет)
for pid in (1340,):
    p = page(pid)
    for m in re.finditer(r'\[\*\*([^*\]]+)\*\*\]\((http://e-arhiv\.vko\.gov\.kz/[^)]+)\)|\*\*\[([^\]]+)\]\((http://e-arhiv\.vko\.gov\.kz/[^)]+)\)\*\*', p['text_md'] if p else ''):
        title = clean(m.group(1) or m.group(3)); url = m.group(2) or m.group(4)
        add({'id': f'ref-{len(REC)}', 'k': 'pub', 't': {'ru': title}, 'a': 'gavko', 'gr': 'справочник', 'url': url.replace('http://e-arhiv.vko.gov.kz', 'old'),
             'acc': 'open', 'src': pid, 'ds': 'Справочный перечень архива. Файл прежнего сайта, доступен для скачивания.', 'top': ['org']})

# ---------- 7. аудио- и видеодокументы: «Архивные видеоматериалы» (страница 1603) ----------
p = page(1603)
n_av = 0
if p:
    cur = None; series = None
    for line in p['text_md'].split('\n'):
        s = line.strip()
        if not s: continue
        mm = re.match(r'\[media:\s*https?://(?:www\.)?youtube\.com/embed/([\w\-]+)\]', s)
        if mm:
            title = cur or series or 'Видеоматериал архива'
            if series and cur and cur.lower().startswith('часть'):
                title = f'{series}: {cur}'
            n_av += 1
            add({'id': f'av-{mm.group(1)}', 'k': 'av', 't': {'ru': one_line(title, 200)}, 'yt': mm.group(1), 'acc': 'open', 'src': 1603, 'a': 'gavko',
                 'gr': 'видео', 'nt': 'Видеоматериал из раздела «Архивные видеоматериалы» прежнего сайта.'})
            cur = None
            continue
        if s.startswith('**'):
            series = clean(s).strip('«»" '); cur = None; continue
        if s.startswith('/'): continue
        if s.startswith('♦'): cur = clean(s.lstrip('♦ ')); continue

# ---------- уточнения для фондов: тема по названию, сводка дел ----------
for r in REC.values():
    if r['k'] == 'fond':
        kids = [x for x in REC.values() if x.get('f') == r['f'] and x.get('a') == r['a'] and x['k'] in ('file', 'doc')]
        if kids and not r.get('ds'):
            r['ds'] = f'Дела и документы фонда, опубликованные или упомянутые на сайте архива: {len(kids)}.'
        if 'sub' not in r:
            r['sub'] = 'org'

cat = list(REC.values())
counts = defaultdict(int)
for r in cat: counts[r['k']] += 1
out = {'v': 1, 'src': 'e-arhiv.vko.gov.kz (выгрузка 2026-11-07)', 'arch': ARCH, 'items': cat}
(ROOT / 'pages').mkdir(exist_ok=True)
(ROOT / 'pages' / 'catalog.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('catalog', len(cat), dict(counts), 'personal table', n_pers, 'declassified', n_doc, 'citations', n_cite, 'photos', n_ph, 'video', n_av)

# ======================= онлайн-выставки =======================
def split_expo(text):
    """Страница «Выставки»: заголовки жирным, иногда в две строки подряд."""
    parts, cur = [], None
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        s = lines[i].strip()
        m = re.fullmatch(r'\*\*(.+?)\*\*', s)
        if m and len(clean(m.group(1))) < 120 and not re.search(r'РЕЕСТР|ТІЗІЛІМ', s):
            head = [clean(m.group(1))]
            while i + 1 < len(lines) and re.fullmatch(r'\*\*(.+?)\*\*', lines[i + 1].strip()) and len(clean(lines[i + 1])) < 120:
                i += 1; head.append(clean(lines[i].strip()))
            cur = {'t': head, 'x': []}; parts.append(cur)
        elif cur is not None and s and not s.startswith('[**'):
            cur['x'].append(clean(s))
        i += 1
    return parts

def nice(h):
    if len(h) > 1:
        out = [nice([x]) for x in h]
        return ' '.join([out[0]] + [x[:1].lower() + x[1:] if x[:1].isupper() and x[1:2].islower() else x for x in out[1:]])
    s = ' '.join(h).strip()
    if s.upper() == s:
        s = s.capitalize()
        s = re.sub(r'\b(вко|рк)\b', lambda m: m.group(1).upper(), s, flags=re.I)
        s = re.sub(r'(восточн\w*)-(казахстан\w*)', lambda m: m.group(1).capitalize() + '-' + m.group(2).capitalize(), s, flags=re.I)
        s = re.sub(r'(?<=[:.]\s)(\w)', lambda m: m.group(1).upper(), s)
        s = re.sub(r'(?<=:)(\w)', lambda m: ' ' + m.group(1).upper(), s)
    return s

ALB = {a['id']: a for a in SITE.get('galleryAlbums', [])}
exhibits = []
ru = split_expo((page(1376) or {}).get('text_md', ''))
kk = split_expo((page(1376, 'kk') or {}).get('text_md', ''))
# заголовок в две строки («ВЕЛИКИЙ ПОДВИГ…» + «к 70-летию…»): склеиваем, если вместе они дают название из списка выставок
CANON = [str(x) for x in SITE.get('exhibitions', [])]
def canon(s):
    k = re.sub(r'[^а-яёәғқңөұүһіa-z0-9]', '', s.lower())
    for c in CANON:
        if re.sub(r'[^а-яёәғқңөұүһіa-z0-9]', '', c.lower()).startswith(k[:40]) and len(k) > 10: return c
    return None
i = 0
while i < len(ru) - 1:
    joined = ' '.join(ru[i]['t'] + ru[i + 1]['t'])
    if not ru[i]['x'] and canon(joined) and not canon(' '.join(ru[i + 1]['t'])):
        ru[i]['t'] += ru[i + 1]['t']; ru[i]['x'] += ru[i + 1]['x']; del ru[i + 1]
        if i < len(kk) - 1:
            kk[i]['t'] += kk[i + 1]['t']; kk[i]['x'] += kk[i + 1]['x']; del kk[i + 1]
        continue
    i += 1
KK_PROPER = {'қазақстан': 'Қазақстан', 'шқо': 'ШҚО', 'мәскеу': 'Мәскеу', 'өскемен': 'Өскемен', 'шығыс': 'Шығыс', 'кеңес': 'Кеңес'}
def nice_kk(h):
    s = nice(h)
    for a, b in KK_PROPER.items(): s = re.sub(r'(?<![\wәғқңөұүһі])' + a, b, s, flags=re.I)
    return s
RELATED = {   # подборка материалов по теме из фотокаталога и видеоархива (не экспонаты той выставки)
    'Усть-Каменогорск в фотографиях': {'alb': [36, 37]},
    'Великий подвиг советского народа': {'alb': [38], 'av': ['JKFNzhXCVf8', 'xT4wAsIX0FU']},
    'Подвиг – наследие народа': {'alb': [39], 'av': ['UL-vyErrT68']},
    'Государственному архиву ВКО': {'alb': [43]},
}
for i, x in enumerate(ru):
    if not x['x'] and not any(title_key.lower() in ' '.join(x['t']).lower() for title_key in RELATED): continue
    title = canon(' '.join(x['t'])) or nice(x['t'])
    k = kk[i] if i < len(kk) else None
    text = '\n\n'.join(x['x'])
    y0, y1 = years(title + ' ' + text)
    rel = next((v for key, v in RELATED.items() if title.lower().startswith(key.lower())), {})
    exhibits.append({'id': f'x{i + 1}', 'kind': 'doc', 't': {'ru': title, 'kk': nice_kk(k['t']) if k else None}, 'tx': {'ru': text, 'kk': '\n\n'.join(k['x']) if k else None},
                     'top': topics_of(title + ' ' + text)[:4], 'y0': y0, 'y1': y1, 'src': 1376, 'rel': rel,
                     'note': 'Выставка подготовлена архивом. Текст — со страницы «Выставки» прежнего сайта.'})
for a in SITE.get('galleryAlbums', []):
    caps = [clean((p.get('c') or {}).get('ru', '')) for p in a.get('ph', [])]
    intro = next((c for c in caps if len(c) > 160), '')
    ys = [y for c in caps for y in years(c) if y]
    exhibits.append({'id': f'a{a["id"]}', 'kind': 'photo', 't': {'ru': a['t'].get('ru'), 'kk': a['t'].get('kk')}, 'alb': a['id'], 'n': len(a.get('ph', [])),
                     'th': a.get('th'), 'intro': intro, 'top': topics_of(a['t'].get('ru', '') + ' ' + ' '.join(caps[:30]))[:4],
                     'y0': min(ys) if ys else None, 'y1': max(ys) if ys else None,
                     'note': 'Фотовыставка из фотогалереи прежнего сайта архива. Подписи — авторские.'})
expo = {'v': 1, 'items': [{k: v for k, v in e.items() if v not in (None, '', [], {})} for e in exhibits],
        'files': [{'t': 'Реестр экспозиций, выставочных комплексов районных музеев и архивов ВКО, посвящённых памяти жертв политических репрессий', 'u': 'old/dl/20105'}]}
(ROOT / 'pages' / 'expo.json').write_text(json.dumps(expo, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('expo', len(expo['items']))

# ======================= «Архив памяти»: люди, хронология =======================
def initials_key(name):
    w = re.findall(r'[А-ЯЁӘҒҚҢӨҰҮҺІ][а-яёәғқңөұүһі\-]+|[А-ЯЁ]\.', name)
    if not w: return None
    sur = w[0].lower(); ini = ''.join(x[0] for x in w[1:3])
    return sur + ':' + ini

people = OrderedDict()
GROUP = {38: 'Герои Советского Союза', 39: 'Полные кавалеры ордена Славы', 42: 'Герои Социалистического Труда', 44: 'Почётные граждане Усть-Каменогорска',
         41: 'Они прославили Восточный Казахстан', 45: 'Акимы Восточно-Казахстанской области', 53: 'Художники', 59: 'Фотографы'}
for aid, grp in GROUP.items():
    a = ALB.get(aid)
    if not a: continue
    for i, ph in enumerate(a.get('ph', [])):
        cap = clean((ph.get('c') or {}).get('ru', ''))
        if aid in (53, 59):
            if i > 0 or len(cap) < 40: continue
        m = re.match(r'([А-ЯЁӘҒҚҢӨҰҮҺІ][^\d,(]{3,60}?)(?=\s*(?:\(|,|\d|родил|-|–|—|$))', cap)
        if not m: continue
        name = m.group(1).strip(' .-–')
        if len(name.split()) < 2 or len(name) > 60: continue
        key = initials_key(name)
        b0, b1 = None, None
        mb = re.search(r'(?:родил\w*|г\.р\.|р\.)\D{0,40}?(1[89]\d\d)', cap) or re.search(r'\((1[89]\d\d)\s*[-–]', cap)
        if mb: b0 = int(mb.group(1))
        md = re.search(r'[-–]\s*(19\d\d|20[0-2]\d)\s*(?:гг?\.?)?\)', cap)
        if md: b1 = int(md.group(1))
        pr = people.setdefault(key, {'id': f'm{len(people) + 1}', 'n': name, 'g': [], 'img': None, 'bio': '', 'alb': []})
        if grp not in pr['g']: pr['g'].append(grp)
        if not pr['img']: pr['img'] = ph['s']
        if len(cap) > len(pr['bio']) and len(cap) > len(name) + 5: pr['bio'] = cap
        pr['alb'].append([aid, i])
        if b0: pr['b0'] = b0
        if b1: pr['b1'] = b1
for r in REC.values():
    if r['k'] == 'fond' and r.get('sub') == 'pers' and r.get('au'):
        key = initials_key(r['au'])
        pr = people.get(key)
        if not pr:
            pr = people.setdefault(key or r['id'], {'id': f'm{len(people) + 1}', 'n': r['au'], 'g': [], 'img': None, 'bio': '', 'alb': []})
        if 'Фондообразователи' not in pr['g']: pr['g'].append('Фондообразователи')
        pr.setdefault('fonds', []).append(r['id'])
        if r.get('src') and not pr.get('src'): pr['src'] = r['src']
for pr in people.values():
    text = pr['n'] + ' ' + pr['bio']
    pr['top'] = sorted(set(topics_of(text)) | ({'war'} if any('Геро' in g and 'Совет' in g or 'Слав' in g for g in pr['g']) else set()))
    pr['pl'] = places_of(text)

events = []
for y, txt in SITE.get('history', []):
    events.append({'y': int(str(y)[:4]), 't': txt, 'g': 'archive'})
p = page(1474)
if p:
    txt = clean(p['text_md']).replace('\n', ' ')
    sents, cur = [], ''
    for tok in re.split(r'(?<=[.!?])\s+', txt):
        cur = (cur + ' ' + tok).strip()
        last = re.findall(r'(\S+)$', cur[:-1] if cur.endswith('.') else cur)
        lw = last[0] if last else ''
        if re.search(r'(?:^|\s)(?:г|гг|Каз|ст|см|т|им|обл|р-н|с|ул|тыс|кв|км|п|ч|т\.е|др)\.$', cur) or re.search(r'\b[А-ЯЁ]\.$', cur):
            continue
        sents.append(cur); cur = ''
    if cur: sents.append(cur)
    for s in sents:
        if re.search(r'\bС\.\s*\d|Алма-Ата,|Алматы,|гг\.\)\.?$|^Население|\d\)\s|газета «', s): continue
        s = re.sub(r'\(\d+\)', '', s).strip()
        m = re.search(r'(1[6-9]\d\d)', s[:70])
        if m and 50 <= len(s) <= 420:
            events.append({'y': int(m.group(1)), 't': s, 'g': 'region', 'src': 1474})
seen = set()
for (pid, lang), p in PAGES.items():
    if lang != 'ru': continue
    for m in re.finditer(r'([А-ЯЁ][\w\-]+ск\w+ район)[^.\n]{0,40}?образован\w*\s+в\s+(\d{4})', p['text_md'] or ''):
        k = (m.group(1), m.group(2))
        if k in seen: continue
        seen.add(k)
        events.append({'y': int(m.group(2)), 't': f'Образован {m.group(1)}.', 'g': 'district', 'src': pid})
p = page(1481)
if p: events.append({'y': 1720, 't': clean(p['title']), 'g': 'region', 'src': 1481})
events.sort(key=lambda e: (e['y'], e['g']))

# сколько материалов приходится на каждое десятилетие — для наглядной шкалы
dec = defaultdict(lambda: defaultdict(int))
for r in REC.values():
    if r.get('y0'):
        y = r['y0'] if not r.get('y1') or r['y1'] - r['y0'] > 30 else (r['y0'] + r['y1']) // 2
        dec[y // 10 * 10][r['k']] += 1
memory = {'v': 1, 'people': list(people.values()), 'events': events, 'dec': {str(k): dict(v) for k, v in sorted(dec.items())},
          'themes': list(TOPICS.keys())}
(ROOT / 'pages' / 'memory.json').write_text(json.dumps(memory, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('memory people', len(people), 'events', len(events), 'decades', len(dec))

# ======================= для главной: «История в документах» и выставки =======================
docs = [r for r in REC.values() if r['k'] == 'doc'][:3]
maps = [r for r in REC.values() if r['k'] == 'map'][:2]
old_ph = sorted([r for r in REC.values() if r['k'] == 'photo' and r.get('y0') and r['y0'] < 1960 and r.get('alb') in (36, 47)], key=lambda r: r['y0'])
pick = docs + maps + old_ph[:: max(1, len(old_ph) // 3)][:3]
home = {'docs': [{'id': r['id'], 't': r['t'], 'c': r.get('c', ''), 'y': r.get('dt') or yr(r), 'img': (r.get('img') or [None])[0]} for r in pick] if False else [],
        'expo': []}
def yr(r):
    return str(r['y0']) if r.get('y0') and r.get('y0') == r.get('y1') else (f"{r['y0']}–{r['y1']}" if r.get('y0') else '')
home['docs'] = [{k: v for k, v in {'id': r['id'], 't': r['t'], 'c': r.get('c', '') or r.get('col', ''), 'y': r.get('dt') or yr(r), 'img': (r.get('img') or [None])[0]}.items() if v} for r in pick]
ex_items = expo['items']
home['expo'] = [x for x in ex_items if x['kind'] == 'doc' and (x.get('rel') or {}).get('alb')][:2] + [x for x in ex_items if x['kind'] == 'photo' and x.get('alb') in (36, 40, 38, 52)][:2]
(ROOT / 'pages' / 'home.json').write_text(json.dumps(home, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('home', len(home['docs']), len(home['expo']))
