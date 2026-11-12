"""Базовый английский перевод основных страниц раздела «Справка» (pages/tr.json).

Решение команды 11.11.2026: перевод нужен только для основных страниц, статьи переводят сами, если решат использовать сайт.
Перевод машинный (подготовлен ИИ) и НЕ вычитан носителем языка: сайт показывает над текстом пометку об этом.
Скрипт берёт русский текст страницы из pages/c*.json и заменяет русские фразы на английские по словарю ниже;
ссылки, картинки и видео остаются как в оригинале. Если в тексте осталась непереведённая русская фраза, скрипт остановится.

Запуск из папки arhiv-vko:  python tools/build_translations.py
"""
import json, re, sys, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
pages = {}
for f in sorted(glob.glob(str(ROOT / 'pages' / 'c[0-9]*.json'))):
    pages.update(json.loads(Path(f).read_text(encoding='utf-8')))

RPT = 'Отчет о деятельности КГУ «Государственный архив» управления цифровизации и архивов Восточно-Казахстанской области и его филиалов по вопросам оказания государственной услуги за {} год'
RPT_EN = 'Report on the activities of the Communal State Institution “State Archive” of the Department of Digitalisation and Archives of East Kazakhstan Region and its branches on the provision of the state service for {}'
OLD = 'Отчет о деятельности государственного архива Восточно-Казахстанской области и его филиалов по вопросам оказания государственной услуги за {} год'
OLD_EN = 'Report on the activities of the State Archive of East Kazakhstan Region and its branches on the provision of the state service for {}'

COMMON = {}
for y in ['2025', '2024', '2023']:
    COMMON[RPT.format(y)] = RPT_EN.format(y)
for y in ['2020', '2019', '2018', '2017']:
    COMMON[OLD.format(y)] = OLD_EN.format(y)

PAGES = {
    '1336': {
        'title': 'Structure and functions',
        'map': {'Структура КГУ «Государственный архив» управления цифровизации и архивов ВКО': 'Structure of the Communal State Institution “State Archive” of the Department of Digitalisation and Archives of East Kazakhstan Region'},
    },
    '1338': {
        'title': 'Reading room',
        'drop': ['\n\n.jpg)'],
        'map': {
            'Правила работы исследователей в читальных залах государственных архивов Республики Казахстан': 'Rules for researchers working in the reading rooms of the state archives of the Republic of Kazakhstan',
            'Утверждены приказом Председателя Комитета по управлению архивами и документацией Министерства культуры, информации и общественного согласия Республики Казахстан от 2 октября 2000 г. № 58': 'Approved by order of the Chairman of the Committee for Archives and Documentation Management of the Ministry of Culture, Information and Public Accord of the Republic of Kazakhstan No. 58 of 2 October 2000',
            'Современные информационные технологии все больше внедряются в деятельность архива. Так, чтобы надежнее обеспечивать сохранность документов, несколько лет назад в госархиве ВКО провели систему слежения за перемещением дел в читальном зале.': 'Modern information technologies are increasingly used in the archive’s work. To ensure the safety of documents more reliably, the East Kazakhstan State Archive installed, a few years ago, a system for tracking the movement of files in the reading room.',
            'Для фондов, которые переведены на микрофильмы, архив приобрел более совершенный аппарат для их чтения. В читальном зале для исследователей имеется отдельный компьютер для просмотра «Электронного фондового каталога», «Регистратора архива», имеется возможность самостоятельного сканирования на планшетном сканере.': 'For collections that have been transferred to microfilm, the archive has acquired a more advanced reading device. The reading room has a separate computer for researchers to view the “Electronic Fonds Catalogue” and the “Archive Registrar”, and researchers can scan documents themselves on a flatbed scanner.',
            'Для проведения мультимедийных презентаций, показа слайдов, видеофильмов был приобретен мультимедийный проектор и экран.': 'A multimedia projector and screen have been acquired for multimedia presentations, slide shows and films.',
            'Внедрение современных технологий намного облегчает работу архивистов и исследователей читального зала госархива.': 'The introduction of modern technology makes the work of archivists and researchers in the State Archive reading room much easier.',
        },
    },
    '22187': {
        'title': 'State services',
        'map': {**COMMON,
            'Закон Республики Казахстан "О государственных услугах" (с изменениями дополнениями по состоянию на 13.06.2018 г.)': 'Law of the Republic of Kazakhstan “On State Services” (with amendments and additions as of 13.06.2018)',
            'Закон Республики Казахстан "О государственных услугах"': 'Law of the Republic of Kazakhstan “On State Services”',
            'Правила оказания государственных услуг в области архивного дела': 'Rules for providing state services in the field of archival affairs',
            'Правила оказания государственной услуги "Выдача архивных справок, копий архивных документов или архивных выписок"': 'Rules for providing the state service “Issuing archival certificates, copies of archival documents or archival extracts”',
            'Отчеты об оказанных государственных услугах': 'Reports on the state services provided',
            'Диаграммы': 'Charts',
            'Количество государственной услуги, оказанной в 2020году': 'Number of state services provided in 2020',
            'Количество государственной услуги, оказанной в 2019 году': 'Number of state services provided in 2019',
            'Адреса и телефоны ЦОН по ВКО': 'Addresses and phone numbers of Public Service Centres (CON) in East Kazakhstan Region',
            'Инструкция о порядке исполнения запросов в государственных архивах Восточно-Казахстанской области': 'Instruction on the procedure for handling requests in the state archives of East Kazakhstan Region',
            'Памятка по получению услуг - «Выдача архивных справок, копий архивных документов или архивных выписок» через ЦЕНТР ЭЛЕКТРОННЫХ УСЛУГ': 'Guide to obtaining the service “Issuing archival certificates, copies of archival documents or archival extracts” through the ELECTRONIC SERVICES CENTRE',
            'Инструкция по регистрации пользователя в мобильном правительстве': 'Instruction for registering a user in Mobile Government',
            'Инструкция по работе с мобильным приложением EGOV.KZ для пользователей смартфона ANDROID': 'Instruction for using the EGOV.KZ mobile app on Android smartphones',
            'Не удовлетворяет качество оказания госуслуг?\nРешите свою проблему легко и быстро с помощью TELEGRAM - БОТА': 'Not satisfied with the quality of state services?\nSolve your problem quickly and easily with the TELEGRAM BOT',
            'Если у вас имеется жалоба на качество оказания госуслуг или предложения по повышению качества оказания госуслуг Вы можете обратится в Telegram EgovKzBot2.0 чат бот': 'If you have a complaint about the quality of state services, or suggestions for improving it, you can contact the Telegram chatbot EgovKzBot2.0',
            'Информационный видеоролик «Государственная услуга «Выдача архивных справок, копий архивных документов или архивных выписок»': 'Information video: the state service “Issuing archival certificates, copies of archival documents or archival extracts”',
            'Обучающий и информационный видеоролик «Государственная услуга «Выдача архивных справок»': 'Training and information video: the state service “Issuing archival certificates”',
            'Видеоролик о способах получения государственных услуг в электронном виде через портал "электронного правительства" без ЭЦП': 'Video on how to obtain state services in electronic form through the “e-government” portal without an electronic digital signature',
            'Видеоролик о способах получения государственных услуг в электронном виде через портал "электронного правительства"': 'Video on how to obtain state services in electronic form through the “e-government” portal',
        },
    },
    '52679': {
        'title': 'Paid services',
        'map': {'Постановление "Об утверждении прейскуранта цен на товары (работы, услуги), реализуемые государственными архивами управления цифровизации и архивов Восточно Казахстанской области"': 'Resolution “On approval of the price list for goods (works, services) sold by the state archives of the Department of Digitalisation and Archives of East Kazakhstan Region”'},
    },
    '52762': {'title': 'SCHEDULE of personal reception of citizens', 'map': {}},
    '52697': {'title': 'Screen reader system for the visually impaired', 'map': {'Ссылка на систему экранного диктора': 'Link to the screen reader system'}},
}

CYR = re.compile(r'[А-Яа-яЁё]')
out, bad = {}, []
for pid, spec in PAGES.items():
    rec = pages.get(pid)
    if not rec:
        print('нет страницы', pid)
        sys.exit(1)
    md = rec['ru']['md']
    for d in spec.get('drop', []):
        md = md.replace(d, '')
    for ru, en in sorted(spec['map'].items(), key=lambda kv: -len(kv[0])):
        md = md.replace(ru, en)
    text_only = re.sub(r'\]\([^)]*\)|\(old/[^)]*\)|\[\[yt:[^\]]*\]\]', ' ', md)   # адреса файлов и ссылки не считаем
    if CYR.search(text_only):
        bad.append((pid, re.findall(r'[^\n]{0,40}[А-Яа-яЁё][^\n]{0,40}', text_only)[:3]))
    out[pid] = {'en': {'t': spec['title'], 'md': md.strip()}}

# полные переводы (tools/tr_full.py): ссылки подставляются из русской страницы по порядку
sys.path.insert(0, str(Path(__file__).resolve().parent))
from tr_full import FULL
from tr_glossary import FULL as FULL_GLOSSARY
from tr_pages import FULL_PAGES, law_page, personal_page
FULL = {**FULL, **FULL_GLOSSARY, **FULL_PAGES}
LINK = re.compile(r'\((?:old/|https?://|#)[^)]*\)')
for pid, spec in FULL.items():
    rec = pages.get(pid)
    if not rec:
        print('нет страницы', pid)
        sys.exit(1)
    urls = LINK.findall(rec['ru']['md'])
    marks = re.findall(r'\(@(\d+)\)', spec['md'])
    if sorted(map(int, marks)) != list(range(1, len(urls) + 1)):
        print('число ссылок в переводе не совпадает с оригиналом:', pid, len(marks), len(urls))
        sys.exit(1)
    md = re.sub(r'\(@(\d+)\)', lambda m: urls[int(m.group(1)) - 1], spec['md'])
    chk = LINK.sub(' ', md).replace('Қазақстан', ' ')   # надпись на гербе по-казахски остаётся как есть
    if CYR.search(chk):
        bad.append((pid, re.findall(r'[^\n]{0,40}[А-Яа-яЁё][^\n]{0,40}', chk)[:3]))
    out[pid] = {'en': {'t': spec['title'], 'md': md.strip()}}

# страницы, где переводятся фамилии, шифры и перечни актов: «Личные фонды» (1352) и «Законодательные и нормативные акты» (law)
from site_tr_en import EN
from site_tr_kk import KK
SITE_JS = json.loads((ROOT / 'dev' / 'content.js').read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
en_md, kk_md, miss = law_page(pages['law']['ru']['md'], SITE_JS['laws'], EN, KK)
if miss:
    print('не найдено в переводах актов:', miss)
    sys.exit(1)
out['law'] = {'en': {'t': 'Legislative and regulatory acts', 'md': en_md}, 'kk': {'t': (pages['law'].get('kk') or {}).get('t') or 'Заңнамалық және нормативтік актілер', 'md': kk_md}}
en_md, kk_md = personal_page(pages['1352']['ru']['md'])
out['1352'] = {'en': {'t': 'Personal fonds', 'md': en_md}, 'kk': {'t': (pages['1352'].get('kk') or {}).get('t') or 'Жеке қорлар', 'md': kk_md}}
for pid in ('law', '1352'):
    left = CYR.findall(LINK.sub(' ', out[pid]['en']['md']))
    if left:
        bad.append((pid, 'en: русские буквы в переводе', ''.join(left)[:60]))

if bad:
    for b in bad:
        print('осталось по-русски:', b)
    sys.exit(1)
site_tr = ROOT / 'pages' / 'site-tr.json'   # переводы блоков SITE (tools/build_site_tr.py) кладём в тот же файл: он уже открыт для сайта
if site_tr.exists():
    out['_site'] = json.loads(site_tr.read_text(encoding='utf-8'))
(ROOT / 'pages' / 'tr.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('готово: страниц', len(out) - 1, '| знаков', sum(len(v['en']['md']) for k, v in out.items() if k != '_site'))
