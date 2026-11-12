"""Календарь памятных дат Восточно-Казахстанской области (данные заказчика от 10.11.2026) -> pages/calendar.json.

Источник: data/customer-2026-11-10/calendar/календарь <год> год каз рус.docx. В каждом файле две таблицы: русская и казахская.
Строки сопоставляются по порядку; если число строк в таблицах не совпало, казахский текст не привязывается (kk = null) и год попадает в отчёт.
Тексты берутся дословно (в том числе опечатки источника, например «18 маусым» в русской таблице): это данные заказчика.
Запуск: python dev/import_calendar.py"""
import json, re, sys, zipfile, pathlib
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
here = pathlib.Path(__file__).resolve().parent
root = here.parent
src_dir = root.parent / 'data' / 'customer-2026-11-10' / 'calendar'
out = root / 'pages' / 'calendar.json'

MONTHS_RU = {'январ': 1, 'феврал': 2, 'март': 3, 'апрел': 4, 'мая': 5, 'май': 5, 'июн': 6, 'июл': 7, 'август': 8, 'сентябр': 9, 'октябр': 10, 'ноябр': 11, 'декабр': 12, 'маусым': 6}
MONTHS_KK = {'қаңтар': 1, 'ақпан': 2, 'наурыз': 3, 'сәуір': 4, 'мамыр': 5, 'маусым': 6, 'шілде': 7, 'тамыз': 8, 'қыркүйек': 9, 'қазан': 10, 'қараша': 11, 'желтоқсан': 12}
KK_LETTERS = set('әғқңөұүһі')


def cell_text(tc):
    parts = []
    for p in tc.iter(W + 'p'):
        t = ''.join(x.text or '' for x in p.iter(W + 't')).strip()
        if t:
            parts.append(t)
    return re.sub(r'\s+', ' ', ' '.join(parts)).strip()


def tables(path):
    with zipfile.ZipFile(path) as z:
        body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    res = []
    for tbl in body.findall(W + 'tbl'):
        rows = []
        for tr in tbl.findall(W + 'tr'):
            cells = [cell_text(tc) for tc in tr.findall(W + 'tc')]
            if len(cells) >= 2:
                rows.append((cells[0], ' '.join(cells[1:]).strip()))
        res.append(rows)
    return res


def is_kk(rows):
    txt = ' '.join(a + ' ' + b for a, b in rows[:12])
    return sum(1 for ch in txt.lower() if ch in KK_LETTERS) > 20


def sort_key(date, kk=False):
    """(месяц, день, группа): группа 0 — дата с числом, 1 — только месяц, 2 — только год. Для сортировки внутри года."""
    d = date.strip().lower()
    m = re.match(r'^(\d{1,2})\s*([^\d\s]+)', d)
    table = MONTHS_KK if kk else MONTHS_RU
    def month(word):
        for k, v in table.items():
            if word.startswith(k):
                return v
        for k, v in MONTHS_KK.items():      # в русских таблицах встречается «маусым»
            if word.startswith(k):
                return v
        return None
    if m and month(m.group(2)):
        return (month(m.group(2)), int(m.group(1)), 0)
    if re.match(r'^[^\d\s]+$', d) and month(d):
        return (month(d), 0, 1)
    return (13, 0, 2)


years, report = [], []
for f in sorted(src_dir.glob('*.docx')):
    ym = re.search(r'(20\d\d)', f.name)
    if not ym:
        continue
    y = int(ym.group(1))
    tbs = [t for t in tables(f) if len(t) > 3]
    ru = next((t for t in tbs if not is_kk(t)), [])
    kk = next((t for t in tbs if is_kk(t)), [])
    ru = [r for r in ru if r[0] or r[1]]
    kk = [r for r in kk if r[0] or r[1]]
    # шапка таблицы: пустая первая ячейка и «2026 год» / «2026 жыл»
    ru = [r for r in ru if not (not r[0] and re.search(r'20\d\d', r[1]))]
    kk = [r for r in kk if not (not r[0] and re.search(r'20\d\d', r[1]))]
    hdr = re.compile(r'^(дата( события)?|оқиға күні)$', re.I)   # строка-шапка «Дата | Событие» / «Оқиға күні | Оқиға атауы»
    ru = [r for r in ru if not hdr.match(r[0])]
    kk = [r for r in kk if not hdr.match(r[0])]
    aligned = len(ru) == len(kk) and len(ru) > 0
    pair = {}
    if aligned:
        pair = {i: i for i in range(len(ru))}
    else:   # число строк разное: сопоставляем по (месяц, число), каждая казахская строка — не более одного раза
        used = set()
        for i, (d, tx) in enumerate(ru):
            k = sort_key(d)
            cand = [j for j, (dk, _) in enumerate(kk) if j not in used and sort_key(dk, kk=True)[:2] == k[:2] and k[2] == 0]
            if len(cand) >= 1:
                pair[i] = cand[0]; used.add(cand[0])
        unmatched = [j for j in range(len(kk)) if j not in used]
        if unmatched:
            report.append('  %d: казахские строки без пары: %s' % (y, '; '.join(kk[j][0] + ' ' + kk[j][1][:50] for j in unmatched)))
    rows = []
    for i, (d, tx) in enumerate(ru):
        j = pair.get(i)
        row = {'d': d, 't': tx, 'dk': kk[j][0] if j is not None else None, 'tk': kk[j][1] if j is not None else None}
        row['m'], row['day'], row['g'] = sort_key(d)
        rows.append(row)
    rows.sort(key=lambda r: (r['m'], r['day'], r['g']))
    years.append({'y': y, 'rows': [{k: v for k, v in r.items() if k not in ('day',)} | {'n': r['day']} for r in rows]})
    report.append('%d: ru %d, kk %d, %s' % (y, len(ru), len(kk), 'сопоставлено по порядку' if aligned else 'сопоставлено по дате: %d из %d' % (len(pair), len(ru))))

years.sort(key=lambda x: -x['y'])
out.write_text(json.dumps({'source': 'Календарь юбилейных и памятных дат ВКО, данные заказчика от 10.11.2026', 'years': years}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('\n'.join(report))
print('записано:', out.name, out.stat().st_size, 'байт; строк всего:', sum(len(y['rows']) for y in years))
