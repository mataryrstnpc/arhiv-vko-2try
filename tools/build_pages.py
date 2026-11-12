"""Собирает полные страницы старого сайта для arhiv-vko.

Запуск из папки arhiv-vko:
  python tools/build_pages.py ../data/old-site/vko_site_data.json ../content/site-ready/news.json .
  python dev/build.py

Вход:  data/old-site/vko_site_data.json (выгрузка агента 2), content/site-ready/news.json (даты новостей)
Выход: arhiv-vko/pages/c{N}.json — тексты страниц пачками;
       SITE.pidx / SITE.pver в arhiv-vko/dev/content.js — оглавление всех страниц.

Картинки и документы старого сайта переписываются на /old/… — их отдаёт server.js
(берёт со старого сайта и кладёт в кэш на диске). Ссылки на страницы старого сайта
становятся ссылками на #p/{id} внутри нового сайта.
"""
import json, re, sys, hashlib
from pathlib import Path
from urllib.parse import urlparse, parse_qs

SRC = Path(sys.argv[1])          # vko_site_data.json
NEWS = Path(sys.argv[2])         # news.json
SITE_DIR = Path(sys.argv[3])     # arhiv-vko
OUT = SITE_DIR / 'pages'
CHUNK = 110_000                  # примерный размер пачки, байт

d = json.loads(SRC.read_text(encoding='utf-8'))
pages = [p for p in d['pages'] if p['status'] == 200 and not p['broken']]
news_date = {int(n['pageId']): n['date'] for n in json.loads(NEWS.read_text(encoding='utf-8')) if n.get('pageId')}

PID = re.compile(r'^/(ru|kk)/Page/Index/(\d+)(?:/[\w]+)?/?$')
def pid_of(path):
    m = PID.match(path or '')
    return int(m.group(2)) if m else None

# ---------- одна запись на (язык, pageId): главный архив важнее филиалов ----------
PRI = {'main': 0, 'vko': 1}
best = {}
for p in pages:
    key = None
    if p['pageId']:
        key = (p['lang'], int(p['pageId']))
    elif re.match(r'^/(ru|kk)/NamedContent\?type=Law$', p['path']):
        key = (p['lang'], 'law')
    if not key: continue
    cur = best.get(key)
    if cur is None or PRI.get(p['branch'], 9) < PRI.get(cur['branch'], 9):
        best[key] = p

# ---------- дерево: родитель и порядок из меню старого сайта ----------
parent, order, news_ids, branch_of, main_ids = {}, [], set(), {}, set()
def walk(node, par, top_news, branch):
    p = node['p']
    pid = 'law' if 'NamedContent?type=Law' in p else pid_of(p)
    is_news_root = node.get('t') == 'Новости' or p in ('/ru', '/kk')
    if pid is not None:
        if pid not in parent:
            parent[pid] = par if par is not None else 0
            order.append(pid)
        if top_news: news_ids.add(pid)
        if branch in ('main', 'vko'): main_ids.add(pid)
        else: branch_of.setdefault(pid, set()).add(branch)
    nxt = pid if pid is not None else par
    for c in node.get('ch', []):
        walk(c, None if is_news_root else nxt, top_news or is_news_root, branch)

for key in ['ru:main', 'ru:vko', 'ru:uka', 'ru:zaisan', 'ru:ridder', 'ru:zirian', 'ru:jarma', 'ru:ajaguz',
            'kk:main', 'kk:vko', 'kk:uka', 'kk:zaisan', 'kk:ridder', 'kk:zirian', 'kk:jarma', 'kk:ajaguz']:
    T = d['trees'].get(key)
    if not T: continue
    for r in T['roots']:
        walk(r, None, False, key.split(':')[1])

branch_of = {k: v for k, v in branch_of.items() if k not in main_ids}
all_ids = []
seen = set()
for pid in order + [k[1] for k in best]:
    if pid in seen or not (('ru', pid) in best or ('kk', pid) in best): continue
    seen.add(pid); all_ids.append(pid)
news_ids |= {pid for pid in all_ids if isinstance(pid, int) and pid in news_date}

# ---------- переписываем ссылки и картинки ----------
OLD_HOSTS = {'e-arhiv.vko.gov.kz', ''}
FILE_EXT = r'(?:jpe?g|png|gif|bmp|webp|pdf|docx?|xlsx?|xlsb|pptx?|rtf|txt|zip|rar|mp4)'
def old_asset(u):
    """URL ресурса старого сайта -> путь через прокси сервера или None."""
    x = urlparse(u.strip())
    if x.netloc not in OLD_HOSTS: return None
    path = x.path
    m = re.match(r'^/(ru|kk)/NamedContent/DownloadFile$', path, re.I)
    if m:
        q = (parse_qs(x.query).get('Id') or parse_qs(x.query).get('id') or [''])[0]
        return f'old/nc/{m.group(1).lower()}/{q}' if q.isdigit() else None
    if re.match(r'^/Admin/ToolsFileUpload/DownloadFile$', path, re.I):
        q = parse_qs(x.query).get('id', [''])[0]
        return f'old/dl/{q}' if q.isdigit() else None
    if re.match(r'^/(akimsemey|images|Content)/', path) and re.search(r'\.' + FILE_EXT + r'$', path.rstrip(' %20'), re.I):
        return 'old' + path.replace(' ', '%20')
    return None

def page_link(u):
    x = urlparse(u.strip())
    if x.netloc not in OLD_HOSTS: return None
    pid = pid_of(x.path)
    if pid: return f'#p/{pid}'
    if re.match(r'^/(ru|kk)/SiteGallery', x.path): return '#region/photo'
    if re.match(r'^/(ru|kk)/NamedContent$', x.path) and 'type=Law' in x.query: return '#p/law'
    if re.match(r'^/(ru|kk)/GuestBook', x.path): return '#home'
    if re.match(r'^/(ru|kk)/?$', x.path): return '#news/news'
    return None

IMG = re.compile(r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
LNK = re.compile(r'(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
stats = {'img': 0, 'img_drop': 0, 'lnk_page': 0, 'lnk_file': 0, 'lnk_ext': 0, 'lnk_drop': 0}
def fix_md(md):
    imgs = []
    def im(m):
        alt, u = m.group(1), m.group(2)
        if u.startswith('EMBEDDED_IMAGE'): stats['img_drop'] += 1; return ''
        loc = old_asset(u)
        if not loc:
            if u.startswith('https://'): imgs.append(u); return m.group(0)
            stats['img_drop'] += 1; return ''
        stats['img'] += 1; imgs.append(loc)
        return f'![{alt}]({loc})'
    md = re.sub(r'\[media:\s*https?://(?:www\.)?youtube(?:-nocookie)?\.com/embed/([\w-]{6,20})[^\]]*\]', lambda m: (stats.__setitem__('video', stats.get('video', 0) + 1), f'\n\n[[yt:{m.group(1)}]]\n\n')[1], md)
    md = re.sub(r'\[media:[^\]]*\]', '', md)
    md = IMG.sub(im, md)
    def lk(m):
        txt, u = m.group(1), m.group(2)
        card = '\n' in txt.strip()          # ссылка-карточка: название и дата на разных строках (законы, документы)
        txt = re.sub(r'\s*\n+\s*', ' — ', txt.strip())
        out = lk2(txt, u)
        return f'\n- {out}\n' if card and out != txt else out
    def lk2(txt, u):
        if 'facebook.com/sharer' in u: stats['lnk_drop'] += 1; return ''
        pl = page_link(u)
        if pl: stats['lnk_page'] += 1; return f'[{txt}]({pl})'
        fa = old_asset(u)
        if fa: stats['lnk_file'] += 1; return f'[{txt}]({fa})'
        if u.startswith(('http://', 'https://', 'mailto:')): stats['lnk_ext'] += 1; return f'[{txt}]({u})'
        stats['lnk_drop'] += 1; return txt
    md = LNK.sub(lk, md)
    md = re.sub(r'\n{3,}', '\n\n', md).strip()
    return md, imgs

# ---------- собираем ----------
recs, index = {}, []
for pid in all_ids:
    rec = {}
    nimg = 0
    for lang in ('ru', 'kk'):
        p = best.get((lang, pid))
        if not p: continue
        md, imgs = fix_md(p['text_md'] or '')
        t = (p['title'] or '').strip()
        if lang == 'ru': nimg = len(imgs)
        rec[lang] = {'t': t, 'md': md}
        if lang == 'ru' or 'u' not in rec: rec['u'] = p['url']
    if not rec.get('ru', {}).get('md') and not rec.get('kk', {}).get('md') and pid not in parent: continue
    kind = 'n' if pid in news_ids else 'p'
    rec['d'] = news_date.get(pid, '') if kind == 'n' else ''
    if pid in branch_of: rec['b'] = sorted(branch_of[pid])
    recs[pid] = rec
    index.append([pid, rec.get('ru', {}).get('t', ''), rec.get('kk', {}).get('t', ''), parent.get(pid, 0),
                  0, kind, rec['d'], nimg, (rec.get('b') or [''])[0]])

# пачки: соседние страницы вместе
OUT.mkdir(exist_ok=True)
for f in OUT.glob('c*.json'): f.unlink()
chunk, size, n, where = {}, 0, 0, {}
def flush():
    global chunk, size, n
    if not chunk: return
    (OUT / f'c{n}.json').write_text(json.dumps(chunk, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    chunk, size, n = {}, 0, n + 1
for row in index:
    pid = row[0]
    s = len(json.dumps(recs[pid], ensure_ascii=False).encode())
    if size and size + s > CHUNK: flush()
    chunk[str(pid)] = recs[pid]; size += s; where[pid] = n
flush()
for row in index: row[4] = where[row[0]]

h = hashlib.sha1()
for f in sorted(OUT.glob('c*.json')): h.update(f.read_bytes())
pver = h.hexdigest()[:10]

cj = SITE_DIR / 'dev' / 'content.js'
raw = cj.read_text(encoding='utf-8')
head, body = raw.split('=', 1)
site = json.loads(body.strip().rstrip(';'))
site['pidx'] = index
site['pver'] = pver
site['branchNames'] = {k: v for k, v in d['branches'].items() if k not in ('main', 'vko')}
cj.write_text(head + '= ' + json.dumps(site, ensure_ascii=False, separators=(',', ':')) + ';', encoding='utf-8')

print('pages', len(index), 'news', sum(1 for r in index if r[5] == 'n'), 'chunks', n, 'pver', pver)
print('kk texts', sum(1 for r in recs.values() if 'kk' in r), 'branch-only', len(branch_of))
print(stats)
print('pidx bytes', len(json.dumps(index, ensure_ascii=False).encode()))
print('chunks total KB', sum(f.stat().st_size for f in OUT.glob('c*.json')) // 1024)
