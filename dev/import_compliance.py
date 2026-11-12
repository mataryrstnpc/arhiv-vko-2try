"""Комплаенс-служба: тексты уведомлений (docx заказчика от 10.11.2026) -> dev/customer-compliance.json. Тексты — дословно.
Файлы (PDF) лежат в public-docs/compliance/ и отдаются сервером по адресу /docs/compliance/<имя>.pdf.
Запуск: python dev/import_compliance.py"""
import json, zipfile, pathlib
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
here = pathlib.Path(__file__).resolve().parent
src = here.parent.parent / 'data' / 'customer-2026-11-10' / 'compliance'
pub = here.parent / 'public-docs' / 'compliance'


def paragraphs(name):
    with zipfile.ZipFile(src / name) as z:
        body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    out = []
    for p in body.iter(W + 'p'):
        t = ''.join(x.text or '' for x in p.iter(W + 't')).strip()
        if t:
            out.append(t)
    return out


def mb(name):
    return round((pub / name).stat().st_size / 1048576, 1)


def body(ps):   # заголовок документа — короткие строки в начале; текст начинается с первого длинного абзаца
    i = 0
    while i < len(ps) and len(ps[i]) < 150:
        i += 1
    return ps[i:]


info_ru = body(paragraphs('Информация о работе комплаенс службы.docx'))
info_kk = body(paragraphs('Информация каз.docx'))
about_ru = paragraphs('О проведении внутреннего анализа коррупционных рисков.docx')
about_kk = paragraphs('Сыбайлас жемқорлық тәуекелдеріне ішкі талдау жүргізу туралы.docx')

doc = lambda ru, kz, tr, tk: {'t': {'ru': tr, 'kz': tk}, 'ru': '/docs/compliance/' + ru, 'kz': '/docs/compliance/' + kz, 'mb': {'ru': mb(ru), 'kz': mb(kz)}}
data = {
    '_about': 'Данные заказчика (папка «тз и данные для архива», 10.11.2026), подпапка «Комплаенс служба». Телефон комплаенс-офицера в материалах не указан: ждём от заказчика.',
    'officer': {'role': 'Комплаенс-офицер', 'n': 'Ешенгельдиев Тырек Молболович', 'p': ''},
    'notices': [
        {'t': {'ru': 'О проведении внутреннего анализа коррупционных рисков', 'kz': 'Сыбайлас жемқорлық тәуекелдеріне ішкі талдау жүргізу туралы'},
         'd': {'ru': about_ru, 'kz': about_kk}},
        {'t': {'ru': 'Информация об исполнении внутреннего анализа коррупционных рисков', 'kz': 'Сыбайлас жемқорлық тәуекелдеріне ішкі талдауды орындау туралы ақпарат'},
         'd': {'ru': info_ru, 'kz': info_kk}},
    ],
    'docs': [
        doc('regulation-ru.pdf', 'regulation-kk.pdf', 'Положение об антикоррупционной комплаенс-службе', 'Сыбайлас жемқорлыққа қарсы комплаенс қызметі туралы ереже'),
        doc('analysis-ru.pdf', 'analysis-kk.pdf', 'Аналитическая справка по итогам внутреннего анализа коррупционных рисков', 'Сыбайлас жемқорлық тәуекелдеріне ішкі талдау қорытындысы бойынша талдау анықтамасы'),
        doc('positions-ru.pdf', 'positions-kk.pdf', 'Перечень должностей, подверженных коррупционным рискам', 'Сыбайлас жемқорлық тәуекелдеріне бейім лауазымдардың тізбесі'),
        doc('plan-ru.pdf', 'plan-kk.pdf', 'План мероприятий по устранению причин и условий, способствующих совершению коррупционных правонарушений', 'Сыбайлас жемқорлық құқық бұзушылықтарды жасауға ықпал ететін себептер мен жағдайларды жою жөніндегі іс-шаралар жоспары'),
    ],
}
(here / 'customer-compliance.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
print('уведомлений:', len(data['notices']), '| документов:', len(data['docs']), '| абзацев в «Информации» ru/kk:', len(info_ru), len(info_kk), '| «О проведении» ru/kk:', len(about_ru), len(about_kk))
