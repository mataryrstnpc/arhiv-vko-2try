"""Переводы данных заказчика (dev/customer.json и dev/customer-compliance.json) на казахский и английский.
Машинный перевод, не вычитан носителем языка. Фамилии на английском даются транслитерацией (tools/tr_pages.translit), на казахском остаются как есть.
Порядок элементов совпадает с оригиналом; build_site_tr.py это проверяет."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tr_pages import translit


def nm(s):
    """«Бисенова Гулсим Алдабергеновна» → «Bisenova Gulsim Aldabergenovna»."""
    return ' '.join('-'.join(translit(p).capitalize() for p in w.split('-')) for w in s.split())


# 13 филиалов: (название, адрес)
BRANCHES_EN = [
    ('Ust-Kamenogorsk city personnel records branch', '070003, Ust-Kamenogorsk, 12/2 Potanin St.'),
    ('Ridder city branch', 'Ridder, 44 Ch. Ualikhanov St.'),
    ('Altai district branch', 'Altai district, 33 M. Gorky St.'),
    ('Zaisan district branch', 'Zaisan district, Zaisan village, 52 D. A. Kunayev St.'),
    ('Glubokoye district branch', 'Glubokoye district, Glubokoye settlement, 6 Pirogov St.'),
    ('Katon-Karagay district branch', 'Katon-Karagay district, Katon-Karagay village, 19/1 Zhampeisov St.'),
    ('Kurchum district branch', 'Kurchum district, Kurchum village, 25 Barak Batyr St.'),
    ('Markakol district branch', 'Markakol district, Markakol village, 67 Krakhmal St.'),
    ('Samar district branch', 'Samar district, Samar village, 58 Gorokhov St.'),
    ('Tarbagatay district branch', 'Tarbagatay district, Akzhar village, 45 Dauletbay St.'),
    ('Ulan district branch', 'Ulan district, Kasym Kaisenov settlement, 5 Z. Akhmetov St., premises 5'),
    ('Ulken Naryn district branch', 'Ulken Naryn district, Ulken Naryn village, 40 Ognev St.'),
    ('Shemonaikha district branch', 'Shemonaikha district, Shemonaikha town, building 2 Zhukov St., premises 4'),
]
BRANCHES_KK = [
    ('Өскемен қалалық жеке құрам бойынша филиалы', '070003, Өскемен қ., Потанин көшесі, 12/2'),
    ('Риддер қалалық филиалы', 'Риддер қ., Ч. Уәлиханов көшесі, 44'),
    ('Алтай ауданының филиалы', 'Алтай ауданы, М. Горький көшесі, 33'),
    ('Зайсан аудандық филиалы', 'Зайсан ауданы, Зайсан ауылы, Д. А. Қонаев көшесі, 52'),
    ('Глубокое аудандық филиалы', 'Глубокое ауданы, Глубокое кенті, Пирогов көшесі, 6'),
    ('Катонқарағай аудандық филиалы', 'Катонқарағай ауданы, Катонқарағай ауылы, Жампейісов көшесі, 19/1'),
    ('Күршім аудандық филиалы', 'Күршім ауданы, Күршім ауылы, Барақ батыр көшесі, 25'),
    ('Марқакөл ауданының филиалы', 'Марқакөл ауданы, Марқакөл ауылы, Крахмаль көшесі, 67'),
    ('Самар ауданының филиалы', 'Самар ауданы, Самар ауылы, Горохов көшесі, 58'),
    ('Тарбағатай аудандық филиалы', 'Тарбағатай ауданы, Ақжар ауылы, Дәулетбай көшесі, 45'),
    ('Ұлан аудандық филиалы', 'Ұлан ауданы, Қасым Қайсенов кенті, З. Ахметов көшесі, 5, н.п. 5'),
    ('Үлкен Нарын ауданының филиалы', 'Үлкен Нарын ауданы, Үлкен Нарын ауылы, Огнев көшесі, 40'),
    ('Шемонаиха аудандық филиалы', 'Шемонаиха ауданы, Шемонаиха қаласы, Жуков көшесі, 2 ғимарат, н.п. 4'),
]
BRANCH_Z = {'en': 'Personnel records: certificates of employment and salary', 'kk': 'Жеке құрам бойынша құжаттар: еңбек өтілі мен жалақы туралы анықтамалар'}

LEADERS = {'en': ['Director', 'Deputy Director'], 'kk': ['Директор', 'Директордың орынбасары']}

# 7 отделов: (название, должность руководителя)
DEPTS_EN = [
    ('Department of Financial and Personnel Work', 'chief accountant'),
    ('Administrative and Economic Department', 'administrative and economic specialist'),
    ('Department for Ensuring the Safety and State Accounting of Documents', 'chief custodian of fonds'),
    ('Department of Acquisition and Control of Departmental Archives', ''),
    ('Department of Finding Aids, Publication and Scientific Use of Documents', ''),
    ('Department of Information Technology', ''),
    ('Department for Appraisal of the Value of Documents', ''),
]
DEPTS_KK = [
    ('Қаржы және кадр жұмысы бөлімі', 'бас бухгалтер'),
    ('Әкімшілік-шаруашылық бөлімі', 'әкімшілік-шаруашылық маманы'),
    ('Құжаттардың сақталуын қамтамасыз ету және мемлекеттік есепке алу бөлімі', 'бас қор сақтаушы'),
    ('Жинақтау және ведомстволық архивтерді бақылау бөлімі', ''),
    ('Ғылыми-анықтамалық аппарат, жариялау және құжаттарды ғылыми пайдалану бөлімі', ''),
    ('Ақпараттық технологиялар бөлімі', ''),
    ('Құжаттардың құндылығына сараптама бөлімі', ''),
]
STAFF = {'en': [('Personnel inspector, Department of Financial and Personnel Work',), ('General phone of the archive',)],
         'kk': [('Кадр жөніндегі инспектор, қаржы және кадр жұмысы бөлімі',), ('Архивтің жалпы телефоны',)]}
STAFF_NAMES = {'en': ['', 'Reception'], 'kk': ['', 'Қабылдау бөлмесі']}   # у первого имя — транслитерация, у «Приёмной» — перевод

HISTORY_2026 = {
    'en': 'By resolution of the East Kazakhstan Regional Akimat of 2 June 2026 No. 142, nine district branches were created at the archive: Glubokoye, Katon-Karagay, Kurchum, Markakol, Samar, Tarbagatay, Ulan, Ulken Naryn and Shemonaikha; four existing branches were renamed (Ust-Kamenogorsk city personnel records, Ridder city, Altai district, Zaisan district).',
    'kk': 'Шығыс Қазақстан облысы әкімдігінің 2026 жылғы 2 маусымдағы № 142 қаулысымен архив жанынан тоғыз аудандық филиал құрылды: Глубокое, Катонқарағай, Күршім, Марқакөл, Самар, Тарбағатай, Ұлан, Үлкен Нарын, Шемонаиха; жұмыс істеп тұрған төрт филиал қайта аталды (Өскемен қалалық жеке құрам бойынша, Риддер қалалық, Алтай аудандық, Зайсан аудандық).',
}

# комплаенс
COMPLIANCE_EN = {
    'role': 'Compliance officer',
    'notices': [
        ('On conducting an internal analysis of corruption risks',
         ['The Communal State Institution “State Archive of East Kazakhstan Region” of the Department of Digitalisation and Archives of East Kazakhstan Region, in order to prevent corruption offences and to identify the conditions and causes that contribute to corruption offences in organisational, managerial and core activity, begins an internal analysis of corruption risks on 11 September 2026.']),
        ('Information on the implementation of the internal analysis of corruption risks',
         ['The Communal State Institution “State Archive of East Kazakhstan Region” of the Department of Digitalisation and Archives of East Kazakhstan Region (hereinafter the Institution) has carried out an internal analysis of corruption risks, on the results of which an analytical note was prepared.',
          'In addition, within the analysis a list of positions exposed to corruption risks was drawn up, and an Action Plan to eliminate the causes and conditions contributing to corruption offences identified by the internal analysis of corruption risks in the Institution was developed and approved.',
          'These documents are posted on the information website “State Archive of East Kazakhstan Region and its branches”.',
          'In order to implement the Action Plan and ensure compliance with the requirements of anti-corruption legislation in the field of public procurement, persons responsible for organising and conducting public procurement were appointed (order of 21.10.2026 No. 123).',
          'In addition, in order to strengthen control over compliance with the established requirements when providing paid services, persons responsible for organising and providing paid services were appointed by order of 21.10.2026 No. 124.',
          'In order to prevent and avoid conflicts of interest when hiring, order of 22.10.2026 No. 125 “On the work of the personnel service” was approved.',
          'Thus, the Institution is taking the necessary organisational and preventive measures to eliminate the identified corruption risks, prevent corruption offences and ensure compliance with the requirements of anti-corruption legislation.']),
    ],
    'docs': [
        'Regulations on the anti-corruption compliance service',
        'Analytical note on the results of the internal analysis of corruption risks',
        'List of positions exposed to corruption risks',
        'Action plan to eliminate the causes and conditions contributing to corruption offences',
    ],
}
