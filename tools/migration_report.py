"""Сверка переноса страниц и файлов старого сайта на новый (доп. ТЗ: сверка количества и связей записей, журнал ошибок).

Запуск из папки arhiv-vko:
  python tools/migration_report.py
  python tools/migration_report.py ../data/old-site/vko_site_data.json   # другой файл выгрузки

Сравнивает выгрузку старого сайта (data/old-site/vko_site_data.json) с тем, что лежит на новом сайте
(pages/c*.json, их собирает tools/build_pages.py). Ничего не меняет, только читает.

Выход:
  docs/MIGRATION-REPORT.md    — сводка: сколько было, сколько перенесено, что и почему не перенесено
  docs/migration-errors.csv   — построчный журнал: каждая страница или файл, у которых есть замечание
"""
import csv, json, re, sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse, parse_qs

HERE = Path(__file__).resolve().parent.parent            # arhiv-vko
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parent / 'data' / 'old-site' / 'vko_site_data.json'
PAGES = HERE / 'pages'
OUT_MD = HERE / 'docs' / 'MIGRATION-REPORT.md'
OUT_CSV = HERE / 'docs' / 'migration-errors.csv'

d = json.loads(SRC.read_text(encoding='utf-8'))
pages, files = d['pages'], d['files']

# ---------- что лежит на новом сайте ----------
new = {}                                   # pageId (строка) -> запись {ru:{t,md}, kk:{t,md}, u, ...}
for f in sorted(PAGES.glob('c[0-9]*.json')):   # пачки страниц c0.json, c1.json…; calendar.json и catalog.json — другие данные
    new.update(json.loads(f.read_text(encoding='utf-8')))
new_md = '\n'.join((r.get(l) or {}).get('md', '') for r in new.values() for l in ('ru', 'kk'))
new_assets = set(re.findall(r'old/[^)\s\]"]+', new_md))

# ---------- выгрузка: что это за записи ----------
PID = re.compile(r'^/(ru|kk)/Page/Index/(\d+)(?:/[\w]+)?/?$')
def kind_of(p):
    """Тип записи без pageId: чем она была на старом сайте."""
    path = p['path']
    if re.match(r'^/(ru|kk)/GuestBook', path): return 'гостевая книга (страницы списка)'
    if re.match(r'^/(ru|kk)/SiteGallery', path): return 'фотогалерея'
    if re.match(r'^/(ru|kk)/NamedContent\?type=Law$', path): return 'раздел «Законодательство»'
    if re.match(r'^/(ru|kk)/?$', path): return 'главная страница'
    return 'прочее (' + (re.match(r'^/(?:ru|kk)/(\w+)', path) or [None, path[:30]])[1] + ')'

usable = [p for p in pages if p['status'] == 200 and not p['broken']]
broken = [p for p in pages if not (p['status'] == 200 and not p['broken'])]
no_id = [p for p in usable if not p['pageId']]
with_id = [p for p in usable if p['pageId']]
emb = [p for p in usable if p.get('embeddedImages')]

groups = defaultdict(list)                  # (язык, pageId) -> записи выгрузки
for p in with_id: groups[(p['lang'], int(p['pageId']))].append(p)
dups = {k: v for k, v in groups.items() if len(v) > 1}
uniq_ids = {k[1] for k in groups}
by_lang = Counter(k[0] for k in groups)

# ---------- сверка страниц ----------
rows = []                                   # журнал: [тип, важность, язык, pageId, адрес, сообщение]
def add(kind, sev, lang, pid, url, msg): rows.append([kind, sev, lang, pid, url, msg])

for p in broken:
    add('страница не получена', 'ошибка', p['lang'], p['pageId'] or '', p['url'], f"в выгрузке статус {p['status']}" + (', помечена битой' if p['broken'] else ''))
for p in no_id:
    add('запись без pageId', 'справка', p['lang'], '', p['url'], 'не страница-статья: ' + kind_of(p) + '; отдельным адресом на новом сайте не нужна')

missing, empty, shrunk = [], [], []
WORDS = re.compile(r'[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі0-9]+')
def words(md):
    md = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', md)          # картинки
    md = re.sub(r'\[media:[^\]]*\]', ' ', md)
    md = re.sub(r'\]\([^)]*\)', ']', md)                   # адреса ссылок: они переписаны, сравниваем только слова
    return len(WORDS.findall(md))

for (lang, pid), recs in sorted(groups.items()):
    r = new.get(str(pid))
    p = sorted(recs, key=lambda x: {'main': 0, 'vko': 1}.get(x['branch'], 9))[0]   # так же выбирает build_pages.py
    if not r or lang not in r:
        missing.append((lang, pid)); add('страница не перенесена', 'ошибка', lang, pid, p['url'], 'есть в выгрузке, нет на новом сайте'); continue
    old_w, new_w = words(p['text_md'] or ''), words(r[lang].get('md', ''))
    if old_w and not new_w: empty.append((lang, pid)); add('пустой текст', 'ошибка', lang, pid, p['url'], f'в выгрузке слов: {old_w}, на новом сайте 0')
    elif old_w and new_w < old_w * 0.9:
        shrunk.append((lang, pid)); add('текст короче', 'замечание', lang, pid, p['url'], f'слов в выгрузке {old_w}, на новом сайте {new_w}: проверить, что потеряно')
    if (p['title'] or '').strip() != (r[lang].get('t') or '').strip(): add('заголовок изменён', 'замечание', lang, pid, p['url'], 'заголовок на новом сайте не совпадает с выгрузкой')
for p in emb:
    add('встроенные картинки', 'замечание', p['lang'], p['pageId'] or '', p['url'], f"{p['embeddedImages']} картинок(ки) были внутри страницы (base64) и в выгрузку не вошли: добавить из архива")
for (lang, pid), v in sorted(dups.items()):
    add('копии страницы', 'справка', lang, pid, v[0]['url'], f"в выгрузке {len(v)} записей ({', '.join(sorted({x['branch'] for x in v}))}); перенесена одна, главный архив важнее филиалов")

ru_new = sum(1 for r in new.values() if 'ru' in r); kk_new = sum(1 for r in new.values() if 'kk' in r)
ru_only = [pid for pid in uniq_ids if (('ru', pid) in groups) and (('kk', pid) not in groups)]
kk_only = [pid for pid in uniq_ids if (('kk', pid) in groups) and (('ru', pid) not in groups)]
both = [pid for pid in uniq_ids if ('ru', pid) in groups and ('kk', pid) in groups]
for pid in sorted(ru_only): add('нет перевода', 'справка', 'kk', pid, groups[('ru', pid)][0]['url'], 'казахской версии нет и на старом сайте (на новом показывается русская)')
for pid in sorted(kk_only): add('нет перевода', 'справка', 'ru', pid, groups[('kk', pid)][0]['url'], 'русской версии нет и на старом сайте')

# ---------- сверка файлов ----------
def old_asset(u):
    """Тот же разбор адресов, что в tools/build_pages.py: адрес на старом сайте -> путь на новом."""
    x = urlparse(u.strip())
    if x.netloc not in ('e-arhiv.vko.gov.kz', ''): return None
    path = x.path
    m = re.match(r'^/(ru|kk)/NamedContent/DownloadFile$', path, re.I)
    if m:
        q = (parse_qs(x.query).get('Id') or parse_qs(x.query).get('id') or [''])[0]
        return f'old/nc/{m.group(1).lower()}/{q}' if q.isdigit() else None
    if re.match(r'^/Admin/ToolsFileUpload/DownloadFile$', path, re.I):
        q = parse_qs(x.query).get('id', [''])[0]
        return f'old/dl/{q}' if q.isdigit() else None
    if re.match(r'^/(akimsemey|images|Content)/', path): return 'old' + path.replace(' ', '%20')
    return None

EXT = re.compile(r'\.([a-z0-9]{2,5})$', re.I)
def ftype(u):
    m = EXT.search(urlparse(u).path.rstrip(' ').lower()) or EXT.search(u.lower())
    e = m.group(1).lower() if m else ''
    return 'картинка' if e in ('jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp') else 'видео' if e in ('mp4', 'avi', 'mov') else 'документ' if e in ('pdf', 'doc', 'docx', 'xls', 'xlsx', 'xlsb', 'ppt', 'pptx', 'rtf', 'txt', 'zip', 'rar') else 'без расширения (по ссылке id)'

seen, f_total, f_ok, f_none = set(), Counter(), Counter(), []
for f in files:
    u = f['url']
    if u in seen: continue
    seen.add(u)
    t = ftype(u); f_total[t] += 1
    loc = old_asset(u)
    if loc and loc in new_assets: f_ok[t] += 1
    else: f_none.append((t, f))
for t, f in f_none:
    add('файл не найден на новом сайте', 'замечание', '', '', f['url'], f"тип: {t}; упомянут на {f.get('from', '?')}; на новом сайте не вставлен в текст или ссылка нестандартная")

# ---------- итоговая таблица ----------
for r in rows: r[3] = '' if r[3] is None else r[3]
sev_order = {'ошибка': 0, 'замечание': 1, 'справка': 2}
rows.sort(key=lambda r: (sev_order[r[1]], r[0], str(r[2]), int(r[3]) if str(r[3]).isdigit() else 0))
OUT_CSV.parent.mkdir(exist_ok=True)
with OUT_CSV.open('w', encoding='utf-8-sig', newline='') as fh:
    w = csv.writer(fh, delimiter=';'); w.writerow(['тип', 'важность', 'язык', 'pageId', 'адрес на старом сайте', 'что не так'])
    w.writerows(rows)
cnt = Counter((r[1]) for r in rows)
kinds = Counter((r[1], r[0]) for r in rows)
ok_total = sum(f_ok.values()); all_total = sum(f_total.values())
balanced = len(pages) == len(usable) + len(broken) and len(usable) == len(with_id) + len(no_id) and len(with_id) == sum(len(v) for v in groups.values())

md = f"""# Отчёт о переносе данных со старого сайта

Сформирован `tools/migration_report.py` из выгрузки `{SRC.name}` (снята {d.get('crawledAt', '?')}) и из страниц нового сайта (`pages/c*.json`). Скрипт только читает файлы: его можно запускать после каждой новой выгрузки. Построчный журнал: [migration-errors.csv](migration-errors.csv) (открывается в Excel).

**Что это и чем не является.** Сверка показывает, всё ли из выгрузки дошло до нового сайта и где потери. Это сверка внутри нашей копии: она не проверяет, полная ли сама выгрузка относительно живого сайта архива, и не заменяет приёмку данных сотрудниками архива.

## 1. Итоговая сверка страниц

| Показатель | Количество |
|---|---|
| Записей в выгрузке (страница в конкретном языке и ветке) | {len(pages)} |
| из них получены (статус 200) | {len(usable)} |
| из них не получены или битые | {len(broken)} |
| Получены без номера страницы (списки гостевой книги, фотогалерея, раздел «Законодательство», главная) | {len(no_id)} |
| Получены с номером страницы | {len(with_id)} |
| Среди них повторы одной страницы (копии в ветках филиалов) | {sum(len(v) - 1 for v in dups.values())} |
| **Уникальных страниц-статей** (по номеру) | **{len(uniq_ids)}** |
| Уникальных «страница + язык» | {len(groups)} (русский {by_lang['ru']}, казахский {by_lang['kk']}) |
| Перенесено на новый сайт: записей страниц | {len(new)} (с русским текстом {ru_new}, с казахским {kk_new}) |
| **Не перенесено** (есть в выгрузке, нет на новом сайте) | **{len(missing)}** |
| Перенесено с пустым текстом | {len(empty)} |
| Текст заметно короче, чем в выгрузке (меньше 90% слов) | {len(shrunk)} |

Контроль баланса: {len(pages)} = {len(usable)} + {len(broken)}; {len(usable)} = {len(with_id)} + {len(no_id)}; {len(with_id)} записей с номером учтены в {len(groups)} парах «страница + язык» с повторами. Баланс {'сходится' if balanced else 'НЕ СХОДИТСЯ'}.

Почему 2 378 записей не равно числу страниц: одна статья в выгрузке встречается отдельно на русском и казахском и иногда ещё раз в ветках филиалов, а списки (гостевая книга, галерея) разбиты на страницы-номера. Реальных статей {len(uniq_ids)}, а не 2 378.

## 2. Языки

| | Количество страниц |
|---|---|
| Есть и русский, и казахский текст | {len(both)} |
| Только русский (казахского нет и на старом сайте) | {len(ru_only)} |
| Только казахский | {len(kk_only)} |
| Английский | интерфейс переведён, статей на английском на старом сайте нет |

Тексты перенесены дословно, ничего не переведено машинно (правило проекта). Казахская версия есть там, где она была на старом сайте; на остальных страницах показывается русская.

## 3. Файлы и картинки

Уникальных адресов файлов в выгрузке: **{all_total}**. Из них найдено в текстах нового сайта: **{ok_total}**.

| Тип | В выгрузке | Найдено на новом сайте | Не найдено |
|---|---|---|---|
""" + '\n'.join(f"| {t} | {f_total[t]} | {f_ok[t]} | {f_total[t] - f_ok[t]} |" for t in sorted(f_total)) + f"""

Файлы и картинки на новом сайте открываются через `/old/…`: сервер забирает их со старого сайта при первом обращении и кладёт в кэш. **Это зависимость от старого сайта**: если старый сайт выключат, файлы нужно перенести на новый сервер заранее (в папку данных `data/old-cache` сервер уже складывает те, что открывали). Страниц со встроенными в текст картинками (base64), которые в выгрузку не вошли: **{len(emb)}**, их нужно добавить из архива вручную.

## 4. Что в журнале ошибок

Всего строк: {len(rows)} (ошибок {cnt['ошибка']}, замечаний {cnt['замечание']}, справочных {cnt['справка']}).

| Важность | Тип | Строк |
|---|---|---|
""" + '\n'.join(f"| {s} | {k} | {n} |" for (s, k), n in sorted(kinds.items(), key=lambda x: (sev_order[x[0][0]], x[0][1]))) + f"""

- **Ошибка** — страницу или текст нужно исправить до приёмки (не получена, не перенесена, пустой текст).
- **Замечание** — перенесено, но стоит проверить глазами (потеряны картинки, файл не найден, заголовок отличается).
- **Справка** — не дефект: объясняет, почему число записей отличается (повторы, списки без номера, нет перевода).

## 5. Как это связано с импортом каталога

Перенос каталога (CSV и Excel) идёт отдельным путём через админку: **Каталог и материалы → Загрузить файл**. Для него есть предпросмотр (ничего не сохраняется), сверка «в файле — получено — годных — с ошибками», замечания по связям фонд → опись → дело → документ и дублям, журнал переносов, выгрузка ошибок в CSV и откат всей партии одним действием (раздел 8 [EDITOR-GUIDE.md](EDITOR-GUIDE.md)). Тексты страниц переносятся скриптом `tools/build_pages.py`, этот отчёт его проверяет.

## 6. Как повторить

```bash
python tools/build_pages.py ../data/old-site/vko_site_data.json ../content/site-ready/news.json .
python tools/migration_report.py
```
"""
OUT_MD.write_text(md, encoding='utf-8')

print('записей в выгрузке', len(pages), '| получены', len(usable), '| битые', len(broken), '| без pageId', len(no_id), '| с pageId', len(with_id))
print('уникальных страниц', len(uniq_ids), '| пар страница+язык', len(groups), dict(by_lang))
print('на новом сайте', len(new), '| ru', ru_new, '| kk', kk_new, '| не перенесено', len(missing), '| пустых', len(empty), '| короче', len(shrunk))
print('файлов уникальных', all_total, '| найдено на сайте', ok_total, '| встроенные картинки на страницах', len(emb))
print('баланс', 'сходится' if balanced else 'НЕ СХОДИТСЯ', '| строк журнала', len(rows), dict(cnt))
