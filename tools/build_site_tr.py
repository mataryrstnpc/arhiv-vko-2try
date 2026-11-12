"""Собирает pages/site-tr.json: переводы блоков SITE на казахский и английский.

Блоки со старого сайта (dev/content.js): tools/site_tr_en.py и tools/site_tr_kk.py.
Данные заказчика (dev/customer*.json): tools/customer_tr.py (филиалы, руководство, отделы, история 2026, комплаенс)
и tools/prices_en.py (прейскурант на английском; казахский в прейскуранте и комплаенсе уже есть в данных заказчика).
Перевод машинный (подготовлен ИИ), носителем языка не вычитан: сайт показывает над блоками пометку об этом.
Скрипт сверяет число элементов с оригиналом (так же, как его собирает dev/build.py) и останавливается при расхождении.

Запуск из папки arhiv-vko:  python tools/build_site_tr.py  (затем python tools/build_translations.py: он кладёт файл в pages/tr.json)
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from site_tr_en import EN
from site_tr_kk import KK
import customer_tr as CT
import prices_en as PE

DEV = ROOT / 'dev'
raw = (DEV / 'content.js').read_text(encoding='utf-8')
SITE = json.loads(raw.split('=', 1)[1].strip().rstrip(';'))
C = json.loads((DEV / 'customer.json').read_text(encoding='utf-8'))
COMP = json.loads((DEV / 'customer-compliance.json').read_text(encoding='utf-8'))
PR = json.loads((DEV / 'customer-prices.json').read_text(encoding='utf-8'))
OLD_HISTORY = [h for h in SITE['history'] if h[0] != '2026']   # как в dev/build.py: patched_site_data()

errors = []


def need(cond, msg):
    if not cond:
        errors.append(msg)


def pairs(src, keys):
    return [{k: v for k, v in zip(keys, x)} for x in src]


def count(v):
    return len(v) if not isinstance(v, dict) else {kk: len(vv) for kk, vv in v.items()}


def build(lang):
    en = lang == 'en'
    tr = EN if en else KK
    out = {}
    for k in ('fondsGroups', 'announcements', 'databases', 'gloss', 'laws'):
        need(count(tr[k]) == count(SITE[k]), '%s %s: %s в переводе, %s в оригинале' % (lang, k, count(tr[k]), count(SITE[k])))
        out[k] = pairs(tr[k], ('t', 'd'))
    for k in ('districts', 'anti'):
        need(count(tr[k]) == count(SITE[k]), '%s %s: %s в переводе, %s в оригинале' % (lang, k, count(tr[k]), count(SITE[k])))
        out[k] = tr[k]
    need(set(tr['branchNames']) == set(SITE['branchNames']), lang + ' branchNames: ключи не совпадают')
    out['branchNames'] = tr['branchNames']

    # история: старые события + запись 2026 из постановления № 142
    need(len(tr['history']) == len(OLD_HISTORY), '%s history: %s в переводе, %s в оригинале' % (lang, len(tr['history']), len(OLD_HISTORY)))
    out['history'] = [list(x) for x in tr['history']] + [[C['history_add'][0][0], CT.HISTORY_2026[lang]]]
    need(len(out['history']) == len(OLD_HISTORY) + len(C['history_add']), lang + ' history: запись 2026')

    # 13 филиалов заказчика
    bn = CT.BRANCHES_EN if en else CT.BRANCHES_KK
    need(len(bn) == len(C['branches']), '%s филиалов: %s в переводе, %s в оригинале' % (lang, len(bn), len(C['branches'])))
    br = []
    for b, (n, a) in zip(C['branches'], bn):
        d = {'n': n, 'a': a}
        if b.get('z'):
            d['z'] = CT.BRANCH_Z[lang]
        if en and b.get('head'):
            d['head'] = CT.nm(b['head'])
        br.append(d)
    out['branches'] = br

    # руководство
    need(len(CT.LEADERS[lang]) == len(C['leaders']), lang + ' руководство: число не совпадает')
    out['leaders'] = [({'r': r, 'n': CT.nm(l['n'])} if en else {'r': r}) for l, r in zip(C['leaders'], CT.LEADERS[lang])]

    # отделы и сотрудники
    dp = CT.DEPTS_EN if en else CT.DEPTS_KK
    need(len(dp) == len(C['org']['depts']), '%s отделов: %s в переводе, %s в оригинале' % (lang, len(dp), len(C['org']['depts'])))
    depts = []
    for d, (n, role) in zip(C['org']['depts'], dp):
        item = {'n': {'en' if en else 'kz': n}}
        if d.get('head'):
            name, _, r0 = d['head'].partition(', ')
            need(bool(r0) == bool(role), '%s отдел «%s»: должность руководителя в переводе и оригинале не совпадает' % (lang, n))
            item['head'] = (CT.nm(name) if en else name) + (', ' + role if role else '')
        depts.append(item)
    st = CT.STAFF[lang]
    need(len(st) == len(C['org']['staff']), lang + ' сотрудников: число не совпадает')
    staff = []
    for s, role, nm in zip(C['org']['staff'], [x[0] for x in st], CT.STAFF_NAMES[lang]):
        staff.append({'n': nm or (CT.nm(s['n']) if en else s['n']), 'r': role})
    out['org'] = {'depts': depts, 'staff': staff}

    if not en:
        return out

    # комплаенс: казахский текст в данных заказчика уже есть, нужен только английский
    cn = CT.COMPLIANCE_EN
    need(len(cn['notices']) == len(COMP['notices']), 'комплаенс: объявлений %s в переводе, %s в оригинале' % (len(cn['notices']), len(COMP['notices'])))
    for (t, d), n in zip(cn['notices'], COMP['notices']):
        need(len(d) == len(n['d']['ru']), 'комплаенс «%s»: абзацев %s в переводе, %s в оригинале' % (t, len(d), len(n['d']['ru'])))
    need(len(cn['docs']) == len(COMP['docs']), 'комплаенс: документов %s в переводе, %s в оригинале' % (len(cn['docs']), len(COMP['docs'])))
    out['compliance'] = {'officer': {'n': CT.nm(COMP['officer']['n'])},
                         'notices': [{'t': t, 'd': d} for t, d in cn['notices']],
                         'docs': [{'t': x} for x in cn['docs']]}

    # прейскурант: порядок строк как в оригинале
    need(len(PE.SECS) == len(PR['secs']), 'прейскурант: разделов %s в переводе, %s в оригинале' % (len(PE.SECS), len(PR['secs'])))
    need(set(PE.NOTES) == {n['id'] for n in PR['notes']}, 'прейскурант: примечания не совпадают')
    need(len(PE.RESTOR) == len(PR['restor']['ru']), 'прейскурант: пунктов о реставрации %s в переводе, %s в оригинале' % (len(PE.RESTOR), len(PR['restor']['ru'])))
    for si, (s, rows) in enumerate(zip(PR['secs'], PE.ROWS)):
        need(len(rows) == len(s['rows']), 'прейскурант, раздел %s: строк %s в переводе, %s в оригинале' % (s['i'], len(rows), len(s['rows'])))
        for r, (n_en, u_en) in zip(s['rows'], rows):
            need(bool(r[2]) == bool(u_en), 'прейскурант %s: единица измерения «%s» ↔ «%s»' % (r[0], r[2], u_en))
            need(bool(n_en), 'прейскурант %s: нет названия' % r[0])
    out['prices'] = {'doc': PE.DOC, 't': PE.SECS, 'notes': PE.NOTES, 'restor': PE.RESTOR,
                     'rows': [[[n, u] for n, u in sec] for sec in PE.ROWS]}
    return out


result = {'en': build('en'), 'kk': build('kk')}

# в английских блоках данных заказчика не должно остаться русских букв
CYR = re.compile(r'[А-Яа-яЁё]')
for k in ('branches', 'leaders', 'org', 'compliance', 'prices'):
    left = CYR.findall(json.dumps(result['en'][k], ensure_ascii=False))
    need(not left, 'en %s: русские буквы в переводе: %s' % (k, ''.join(left)[:40]))
need(not CYR.search(result['en']['history'][-1][1]), 'en history: русские буквы в записи 2026')

if errors:
    print('ОШИБКИ (%s):' % len(errors))
    for e in errors[:40]:
        print(' -', e)
    sys.exit(1)

out_file = ROOT / 'pages' / 'site-tr.json'
out_file.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('готово: pages/site-tr.json,', out_file.stat().st_size // 1024, 'КБ; блоков en %d, kk %d' % (len(result['en']), len(result['kk'])))
