"""Переводы отдельных страниц старого сайта: «Личные фонды» (1352), «Законодательные и нормативные акты» (law),
«Государственные символы РК» (42569), «Документы» (52670). Машинный перевод, не вычитан носителем языка.

Используется build_translations.py. Ссылки и картинки берутся из русской страницы и не меняются.
"""
import re

# ---------------------------------------------------------------- «Законодательные и нормативные акты»: строки, которых нет в SITE.laws дословно
LAW_EXTRA = {
    'Перечень МЗ РК 2020г. — Об утверждении форм учетной документации в области здравоохранения':
        ('List of the Ministry of Health, 2020 — On approval of forms of accounting documentation in the field of health care',
         'ҚР ДСМ 2020 жылғы тізбе — Денсаулық сақтау саласындағы есепке алу құжаттамасы нысандарын бекіту туралы'),
    'Перечень типовых документов, образующихся в деятельности государственных и негосударственных организаций, с указанием срока хранения — от 11 июля 2022 года № 184':
        ('List of standard documents generated in the activity of state and non-state organisations, with retention periods — of 11 July 2022 No. 184',
         'Мемлекеттік және мемлекеттік емес ұйымдар қызметінде түзілетін, сақтау мерзімдері көрсетілген типтік құжаттар тізбесі — 2022 жылғы 11 шілдедегі № 184'),
    'Перечень форм первичной учетной медицинской документации организаций здравоохранения и сроки их хранения (с изменениями и дополнениями по состоянию на 29.12.2018 г.) — Приложение 7 к приказу и.о. Министра здравоохранения Республики Казахстан от 23 ноября 2010 года № 907':
        ('List of forms of primary accounting medical documentation of health care organisations and their retention periods (as amended and supplemented as of 29 December 2018) — Appendix 7 to the order of the Acting Minister of Health of the Republic of Kazakhstan of 23 November 2010 No. 907',
         'Денсаулық сақтау ұйымдарының бастапқы есепке алу медициналық құжаттамасы нысандарының тізбесі және оларды сақтау мерзімдері (2018 жылғы 29 желтоқсандағы жағдай бойынша өзгерістер мен толықтырулармен) — Қазақстан Республикасы Денсаулық сақтау министрі міндетін атқарушының 2010 жылғы 23 қарашадағы № 907 бұйрығына 7-қосымша'),
    'Правила приема, хранения, учета и использования документов Национального архивного фонда и других архивных документов ведомственными и частными архивами — Утверждены постановлением Правительства Республики Казахстан от 19 сентября 2018 года №575':
        ('Rules for receipt, storage, accounting and use of documents of the National Archival Fonds and other archival documents by departmental and private archives — Approved by resolution of the Government of the Republic of Kazakhstan of 19 September 2018 No. 575',
         'Ұлттық архив қорының және басқа да архив құжаттарын ведомстволық және жеке архивтердің қабылдау, сақтау, есепке алу және пайдалану қағидалары — Қазақстан Республикасы Үкіметінің 2018 жылғы 19 қыркүйектегі № 575 қаулысымен бекітілген'),
    'Правил документирования, управления документацией и использования систем электронного документооборота в государственных и негосударственных организациях — Утверждены постановлением Правительства Республики Казахстан от 31 октября 2018 года № 703':
        ('Rules for documentation, records management and use of electronic document management systems in state and non-state organisations — Approved by resolution of the Government of the Republic of Kazakhstan of 31 October 2018 No. 703',
         'Мемлекеттік және мемлекеттік емес ұйымдарда құжаттау, құжаттаманы басқару және электрондық құжат айналымы жүйелерін пайдалану қағидалары — Қазақстан Республикасы Үкіметінің 2018 жылғы 31 қазандағы № 703 қаулысымен бекітілген'),
    'Перечень форм первичной учетной медицинской документации организаций здравоохранения и сроки их хранения (с изменениями и дополнениями по состоянию на 24.03.2017 г.) — Приложение 7 к приказу и.о. Министра здравоохранения Республики Казахстан от 23 ноября 2010 года № 907':
        ('List of forms of primary accounting medical documentation of health care organisations and their retention periods (as amended and supplemented as of 24 March 2017) — Appendix 7 to the order of the Acting Minister of Health of the Republic of Kazakhstan of 23 November 2010 No. 907',
         'Денсаулық сақтау ұйымдарының бастапқы есепке алу медициналық құжаттамасы нысандарының тізбесі және оларды сақтау мерзімдері (2017 жылғы 24 наурыздағы жағдай бойынша өзгерістер мен толықтырулармен) — Қазақстан Республикасы Денсаулық сақтау министрі міндетін атқарушының 2010 жылғы 23 қарашадағы № 907 бұйрығына 7-қосымша'),
    'Правила о порядке формирования, отбора, учета, временного хранения и передачи на постоянное хранение в государственные архивные учреждения документов Верховного Суда Республики Казахстан, местных и других судов, Департамента по обеспечению деятельности судов при Верховном Суде Республики Казахстан (аппарата Верховного Суда Республики Казахстан) и РГУ Администраторов судов — Утверждены распоряжением Председателя Верховного Суда Республики Казахстан от 16 мая 2016 года №6001-16-7-4/98':
        ('Rules on the procedure for forming, selecting, accounting, temporary storage and transfer for permanent storage to state archival institutions of the documents of the Supreme Court of the Republic of Kazakhstan, local and other courts, the Department for Ensuring the Activity of Courts under the Supreme Court of the Republic of Kazakhstan (the apparatus of the Supreme Court) and the Republican State Institution “Court Administrators” — Approved by order of the Chairman of the Supreme Court of the Republic of Kazakhstan of 16 May 2016 No. 6001-16-7-4/98',
         'Қазақстан Республикасы Жоғарғы Сотының, жергілікті және басқа соттарының, Қазақстан Республикасы Жоғарғы Соты жанындағы Соттардың қызметін қамтамасыз ету департаментінің (Қазақстан Республикасы Жоғарғы Сотының аппараты) және «Сот әкімшілері» РМҚК құжаттарын қалыптастыру, іріктеу, есепке алу, уақытша сақтау және мемлекеттік архив мекемелеріне тұрақты сақтауға беру тәртібі туралы қағидалар — Қазақстан Республикасы Жоғарғы Соты Төрағасының 2016 жылғы 16 мамырдағы № 6001-16-7-4/98 өкімімен бекітілген'),
    'Перечень документов, образующихся в деятельности Верховного Суда Республики Казахстан, местных и других судов Республики Казахстан, Департамента по обеспечению деятельности судов при Верховном Суде Республики Казахстан (аппарата Верховного Суда Республики Казахстан) иРГУ Администраторов судов, с указанием сроков хранения — Утвержден распоряжением Председателя Верховного Суда Республики Казахстан от 16 мая 2016 года №6001-16-7-4/98':
        ('List of documents generated in the activity of the Supreme Court of the Republic of Kazakhstan, local and other courts of the Republic of Kazakhstan, the Department for Ensuring the Activity of Courts under the Supreme Court of the Republic of Kazakhstan (the apparatus of the Supreme Court) and the Republican State Institution “Court Administrators”, with retention periods — Approved by order of the Chairman of the Supreme Court of the Republic of Kazakhstan of 16 May 2016 No. 6001-16-7-4/98',
         'Қазақстан Республикасы Жоғарғы Сотының, Қазақстан Республикасының жергілікті және басқа да соттарының, Қазақстан Республикасы Жоғарғы Соты жанындағы Соттардың қызметін қамтамасыз ету департаментінің (Қазақстан Республикасы Жоғарғы Сотының аппараты) және «Сот әкімшілері» РМҚК қызметінде түзілетін құжаттардың сақтау мерзімдері көрсетілген тізбесі — Қазақстан Республикасы Жоғарғы Соты Төрағасының 2016 жылғы 16 мамырдағы № 6001-16-7-4/98 өкімімен бекітілген'),
    'Положения об ЭК и ведомственном (частном) архиве — Утверждено протоколом заседания Методического совета по рассмотрению вопросов в области архивного дела и документации Министерства культуры и спорта Республики Казахстан от 23 октября 2015 года № 1':
        ('Regulations on the expert commission and the departmental (private) archive — Approved by minutes of the meeting of the Methodological Council on archival affairs and documentation of the Ministry of Culture and Sports of the Republic of Kazakhstan of 23 October 2015 No. 1',
         'Сараптама комиссиясы және ведомстволық (жеке) архив туралы ереже — Қазақстан Республикасы Мәдениет және спорт министрлігінің архив ісі және құжаттама саласындағы мәселелерді қарау жөніндегі Әдістемелік кеңесі отырысының 2015 жылғы 23 қазандағы № 1 хаттамасымен бекітілген'),
    'Типовые правила документирования и управления документацией в государственных и негосударственных организациях — Утверждены приказом Министра культуры и спорта Республики Казахстан от 22 декабря 2014 года № 144':
        ('Standard rules for documentation and records management in state and non-state organisations — Approved by order of the Minister of Culture and Sports of the Republic of Kazakhstan of 22 December 2014 No. 144',
         'Мемлекеттік және мемлекеттік емес ұйымдарда құжаттау және құжаттаманы басқарудың үлгілік қағидалары — Қазақстан Республикасы Мәдениет және спорт министрінің 2014 жылғы 22 желтоқсандағы № 144 бұйрығымен бекітілген'),
    'Дополнения к приказу Министерства Здравоохранения от 23.11.2010г. № 907 — дополнения от 06.03.2013г.':
        ('Additions to the order of the Ministry of Health of 23 November 2010 No. 907 — additions of 6 March 2013',
         'Денсаулық сақтау министрлігінің 2010 жылғы 23 қарашадағы № 907 бұйрығына толықтырулар — 2013 жылғы 6 наурыздағы толықтырулар'),
    'Перечень форм учетной документации органов и организаций санитарно-эпидемиологической службы (с изменениями, внесенными приказом Министра здравоохранения РК от 20.02.2013 № 95) — Приложение 1 к приказу Министра здравоохранения Республики Казахстан от 20 декабря 2011 года № 902':
        ('List of forms of accounting documentation of bodies and organisations of the sanitary and epidemiological service (as amended by order of the Minister of Health of the Republic of Kazakhstan of 20 February 2013 No. 95) — Appendix 1 to the order of the Minister of Health of the Republic of Kazakhstan of 20 December 2011 No. 902',
         'Санитариялық-эпидемиологиялық қызмет органдары мен ұйымдарының есепке алу құжаттамасы нысандарының тізбесі (ҚР Денсаулық сақтау министрінің 2013 жылғы 20 ақпандағы № 95 бұйрығымен енгізілген өзгерістермен) — Қазақстан Республикасы Денсаулық сақтау министрінің 2011 жылғы 20 желтоқсандағы № 902 бұйрығына 1-қосымша'),
    'Перечень документов, образующихся в деятельности органов, ведомств и учреждений прокуратуры Республики Казахстан, с указанием сроков хранения — Утвержден Приказом Генерального Прокурора Республики Казахстан от 29.11. 2012 года № 148':
        ('List of documents generated in the activity of bodies, agencies and institutions of the Prosecutor’s Office of the Republic of Kazakhstan, with retention periods — Approved by order of the Prosecutor General of the Republic of Kazakhstan of 29 November 2012 No. 148',
         'Қазақстан Республикасы прокуратура органдарының, ведомстволары мен мекемелерінің қызметінде түзілетін құжаттардың сақтау мерзімдері көрсетілген тізбесі — Қазақстан Республикасы Бас Прокурорының 2012 жылғы 29 қарашадағы № 148 бұйрығымен бекітілген'),
    'Дополнения к приказу Министерства Здравоохранения от 23.11.2010г. № 907 — дополнения от 31.07.2012г.':
        ('Additions to the order of the Ministry of Health of 23 November 2010 No. 907 — additions of 31 July 2012',
         'Денсаулық сақтау министрлігінің 2010 жылғы 23 қарашадағы № 907 бұйрығына толықтырулар — 2012 жылғы 31 шілдедегі толықтырулар'),
    'Перечень форм учетной документации органов и организаций санитарно-эпидемиологической службы — Приложение 1 к приказу Министра здравоохранения Республики Казахстан от 20 декабря 2011 года № 902':
        ('List of forms of accounting documentation of bodies and organisations of the sanitary and epidemiological service — Appendix 1 to the order of the Minister of Health of the Republic of Kazakhstan of 20 December 2011 No. 902',
         'Санитариялық-эпидемиологиялық қызмет органдары мен ұйымдарының есепке алу құжаттамасы нысандарының тізбесі — Қазақстан Республикасы Денсаулық сақтау министрінің 2011 жылғы 20 желтоқсандағы № 902 бұйрығына 1-қосымша'),
    'Правила учета обращений физических и юридических лиц — Приказ Генерального Прокурора Республики Казахстан от «16» ноября 2011 года № 109':
        ('Rules for accounting appeals of individuals and legal entities — Order of the Prosecutor General of the Republic of Kazakhstan of 16 November 2011 No. 109',
         'Жеке және заңды тұлғалардың өтініштерін есепке алу қағидалары — Қазақстан Республикасы Бас Прокурорының 2011 жылғы 16 қарашадағы № 109 бұйрығы'),
    'Стандарт государственной услуги «Выдача архивных справок» — Приложение 3 к постановлению Правительства Республики Казахстан от 22 июля 2011 года № 842':
        ('Standard of the state service “Issuing archival certificates” — Appendix 3 to the resolution of the Government of the Republic of Kazakhstan of 22 July 2011 No. 842',
         '«Архивтік анықтамалар беру» мемлекеттік қызмет стандарты — Қазақстан Республикасы Үкіметінің 2011 жылғы 22 шілдедегі № 842 қаулысына 3-қосымша'),
    'Приказ и.о. Министра здравоохранения Республики Казахстан от 11 мая 2011 года № 280 О внесении изменений и дополнений в приказ и.о. Министра здравоохранения Республики Казахстан от 23 ноября 2010 года № 907 «Об утверждении форм первичной медицинской документации организаций здравоохранения»':
        ('Order of the Acting Minister of Health of the Republic of Kazakhstan of 11 May 2011 No. 280 On amendments and additions to the order of the Acting Minister of Health of the Republic of Kazakhstan of 23 November 2010 No. 907 “On approval of the forms of primary medical documentation of health care organisations”',
         'Қазақстан Республикасы Денсаулық сақтау министрі міндетін атқарушының 2011 жылғы 11 мамырдағы № 280 бұйрығы Қазақстан Республикасы Денсаулық сақтау министрі міндетін атқарушының 2010 жылғы 23 қарашадағы № 907 «Денсаулық сақтау ұйымдарының бастапқы медициналық құжаттамасы нысандарын бекіту туралы» бұйрығына өзгерістер мен толықтырулар енгізу туралы'),
    'Стандарт государственной услуги «Апостилирование архивных справок и копий архивных документов, исходящих из государственных архивов Республики Казахстан и направляемых за рубеж» — Утвержден постановлением Правительства Республики Казахстан от «30» декабря 2009 года № 2315':
        ('Standard of the state service “Apostille of archival certificates and copies of archival documents issued by the state archives of the Republic of Kazakhstan and sent abroad” — Approved by resolution of the Government of the Republic of Kazakhstan of 30 December 2009 No. 2315',
         '«Қазақстан Республикасының мемлекеттік архивтерінен шығатын және шетелге жіберілетін архивтік анықтамалар мен архив құжаттарының көшірмелеріне апостиль қою» мемлекеттік қызмет стандарты — Қазақстан Республикасы Үкіметінің 2009 жылғы 30 желтоқсандағы № 2315 қаулысымен бекітілген'),
    'Закон РК "О порядке обращений физических и юридических лиц" — Астана, Акорда, 12 января 2007 года № 221-III ЗРК':
        ('Law of the Republic of Kazakhstan “On the procedure for handling appeals of individuals and legal entities” — Astana, Akorda, 12 January 2007 No. 221-III',
         'Қазақстан Республикасының «Жеке және заңды тұлғалардың өтініштерін қарау тәртібі туралы» Заңы — Астана, Ақорда, 2007 жылғы 12 қаңтар, № 221-III ҚРЗ'),
    'Перечень типовых документов, образующихся в деятельности госкомитетов, министерств, ведомств и других учреждений, организаций, предприятий, с указанием сроков хранения — Утвержден Главным архивным управлением при Совмине СССР 15 августа 1988 г.':
        ('List of standard documents generated in the activity of state committees, ministries, agencies and other institutions, organisations and enterprises, with retention periods — Approved by the Main Archive Administration under the Council of Ministers of the USSR on 15 August 1988',
         'Мемлекеттік комитеттердің, министрліктердің, ведомстволардың және басқа да мекемелердің, ұйымдардың, кәсіпорындардың қызметінде түзілетін, сақтау мерзімдері көрсетілген типтік құжаттар тізбесі — КСРО Министрлер Кеңесі жанындағы Бас архив басқармасы 1988 жылғы 15 тамызда бекіткен'),
    'Перечень документов со сроками хранения Министерства просвещения СССР, органов, учреждений, организаций и предприятий системы просвещения — утвержден Министром просвещения СССР 27 ноября 1980 г. и Главным архивным управлением при Совете Министров СССР 15 декабря 1980 г.':
        ('List of documents with retention periods of the Ministry of Education of the USSR, bodies, institutions, organisations and enterprises of the education system — approved by the Minister of Education of the USSR on 27 November 1980 and the Main Archive Administration under the Council of Ministers of the USSR on 15 December 1980',
         'КСРО Ағарту министрлігінің, ағарту жүйесі органдарының, мекемелерінің, ұйымдары мен кәсіпорындарының сақтау мерзімдері көрсетілген құжаттар тізбесі — КСРО Ағарту министрі 1980 жылғы 27 қарашада және КСРО Министрлер Кеңесі жанындағы Бас архив басқармасы 1980 жылғы 15 желтоқсанда бекіткен'),
    'Выписка из "Перечня документов со сроком хранения Главного архивного управления при Совете Министров СССР и подведомственных ему организаций" — утвержден Главным архивным управлением при Совете Министров СССР от 29 апреля 1976 года':
        ('Extract from the “List of documents with retention periods of the Main Archive Administration under the Council of Ministers of the USSR and the organisations subordinate to it” — approved by the Main Archive Administration under the Council of Ministers of the USSR on 29 April 1976',
         '«КСРО Министрлер Кеңесі жанындағы Бас архив басқармасының және оған бағынышты ұйымдардың сақтау мерзімдері көрсетілген құжаттар тізбесінен» үзінді — КСРО Министрлер Кеңесі жанындағы Бас архив басқармасы 1976 жылғы 29 сәуірде бекіткен'),
    'Оказание государственной услуги областным государственным архивом через ЦОНы г.Усть-Каменогорска «Выдача архивных справок»':
        ('Provision of the state service “Issuing archival certificates” by the regional state archive through the Public Service Centres (CON) of Ust-Kamenogorsk',
         'Облыстық мемлекеттік архивтің Өскемен қаласының ХҚКО арқылы «Архивтік анықтамалар беру» мемлекеттік қызметін көрсетуі'),
}

_norm = lambda s: re.sub(r'\s+', ' ', s).strip().lower().replace('"', '«').replace('»', '«')


def law_page(md, laws, EN, KK):
    """Строки страницы: «название — дата» заменяются переводами из SITE.laws или из LAW_EXTRA. Возвращает (en, kk, не найдено)."""
    full = {}
    for i, x in enumerate(laws):
        full[_norm(x['t'] + (' — ' + x['d'] if x['d'] else ''))] = i
    extra = {_norm(k): v for k, v in LAW_EXTRA.items()}
    out = {'en': [], 'kk': []}
    miss = []
    for line in md.split('\n'):
        m = re.match(r'^(\s*-?\s*)\[(.*)\]\((.*?)\)(\s*)$', line)
        if not m:
            for lg in out:
                out[lg].append(line)
            continue
        pre, text, url, post = m.groups()
        key = _norm(text)
        if key in full:
            i = full[key]
            tr = {'en': (EN['laws'][i][0] + (' — ' + EN['laws'][i][1] if EN['laws'][i][1] else '')), 'kk': (KK['laws'][i][0] + (' — ' + KK['laws'][i][1] if KK['laws'][i][1] else ''))}
        elif key in extra:
            tr = {'en': extra[key][0], 'kk': extra[key][1]}
        else:
            miss.append(text[:80])
            tr = {'en': text, 'kk': text}
        for lg in out:
            out[lg].append('%s[%s](%s)%s' % (pre, tr[lg], url, post))
    return '\n'.join(out['en']), '\n'.join(out['kk']), miss


# ---------------------------------------------------------------- «Личные фонды»: фамилии и шифры
_C = {'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ы': 'y', 'э': 'e',
      'ә': 'a', 'ө': 'o', 'ұ': 'u', 'ү': 'u', 'ғ': 'g', 'қ': 'k', 'ң': 'n', 'һ': 'h', 'і': 'i'}
_VOW = set('аеёиоуыэюяәөұүі')


def translit(word):
    w = word.lower(); out = []
    for i, ch in enumerate(w):
        prev = w[i - 1] if i else ''
        soft = i == 0 or prev in _VOW or prev in 'ьъй'
        if ch == 'е':
            out.append('ye' if soft else 'e')
        elif ch == 'ё':
            out.append('yo' if soft else 'o')
        elif ch == 'ю':
            out.append('yu')
        elif ch == 'я':
            out.append('ya')
        elif ch in 'ьъ':
            continue
        else:
            out.append(_C.get(ch, ch))
    s = ''.join(out)
    return re.sub(r'skiy$', 'sky', s)


EN_NAMES = {'БЕЛОСЛЮДОВ': 'BELOSLUDOV'}   # так же, как на других страницах


KK_NAMES = {'АУБАКИРОВ': 'ӘУБӘКІРОВ', 'БИТИБАЕВА': 'БІТІБАЕВА', 'ГАБДУЛЛИН': 'ҒАБДУЛЛИН', 'ЖАНГОЗИН': 'ЖАНҒОЗИН'}


def name_en(txt):
    # «АКСЕНОВ В.С.» → «AKSENOV V. S.»: фамилия и инициалы латиницей
    txt = txt.replace('БӨКЕЕВ.О.', 'БӨКЕЕВ О.')
    txt = re.sub(r'([А-ЯЁӘӨҰҮҒҚҢҺІ])\.(?=[А-ЯЁӘӨҰҮҒҚҢҺІ])', r'\1. ', txt)   # В.С. → В. С.

    def one(m):
        tok = m.group(0); dot = '.' if tok.endswith('.') else ''; core = tok.rstrip('.')
        if len(core) == 1:
            return translit(core).upper() + dot
        return EN_NAMES.get(core, translit(core).upper()) + dot
    return re.sub(r'[А-ЯЁӘӨҰҮҒҚҢҺІ\-]+\.?', one, txt)


def name_kk(txt):
    return re.sub(r'[А-ЯЁӘӨҰҮҒҚҢҺІ]{3,}', lambda m: KK_NAMES.get(m.group(0), m.group(0)), txt)


def data_en(txt):
    s = txt
    s = s.replace('ГАВКО', 'SAEKR')
    s = re.sub(r'\(имеются документы за ([^)]*?) г\.г\. на казахском языке\)', r'(includes documents for \1 in Kazakh)', s)
    s = re.sub(r', имеются документы за ([\d, ]+) г\.г\.', r', includes documents for \1', s)
    s = s.replace('крайние даты не установлены', 'extreme dates not established')
    s = s.replace('конец XIXв. -', 'late 19th century –').replace('конец XIXв.', 'late 19th century')
    s = re.sub(r'\bф\.\s*', 'fonds ', s)
    s = re.sub(r'\b(?:оп\.|опись)\s*', 'inv. ', s)
    s = re.sub(r'ед\.\s*хр\.?', 'units', s)
    s = s.replace(', каталог', ', catalogue')
    s = re.sub(r'\s*г\.\s*г\.?', '', s)
    s = re.sub(r'(\d)\s*г\.(?=[,\s\)\]]|$)', r'\1', s)
    s = re.sub(r'(\d)г\.', r'\1', s)
    s = re.sub(r'(\d)\s*-\s*(\d)', r'\1–\2', s)
    return re.sub(r'\s{2,}', ' ', s).strip()


def data_kk(txt):
    s = txt
    s = s.replace('ГАВКО', 'ШҚОММ')
    s = re.sub(r'\(имеются документы за ([^)]*?) г\.г\. на казахском языке\)', r'(\1 ж.ж. қазақ тіліндегі құжаттар бар)', s)
    s = re.sub(r', имеются документы за ([\d, ]+) г\.г\.', r', \1 ж.ж. құжаттар бар', s)
    s = s.replace('крайние даты не установлены', 'аяққы мерзімдері анықталмаған')
    s = s.replace('конец XIXв. -', 'XIX ғ. соңы –').replace('конец XIXв.', 'XIX ғ. соңы')
    s = re.sub(r'\bф\.\s*', 'қ.', s)
    s = re.sub(r'\bопись\s*', 'т.', s)
    s = re.sub(r'\bоп\.\s*', 'т.', s)
    s = re.sub(r'ед\.\s*хр\.?', 'сақт.бірл.', s)
    s = s.replace(', каталог', ', каталог')
    s = re.sub(r'\s*г\.\s*г\.?', ' ж.ж.', s)
    s = re.sub(r'(\d)г\.', r'\1 ж.', s)
    return re.sub(r'\s{2,}', ' ', s).strip()


EN_INTRO = {
    'Документы личного происхождения в государственных архивах представляют собой одну из важнейших групп исторических источников, являются неотъемлемой частью историко-культурного наследия народа, несут в себе уникальную ретроспективную информацию, преломленную через призму личностного восприятия. Их значение особенно велико для изучения истории литературы, науки, искусства, то есть тех сторон человеческой деятельности и исторического процесса, где на первый план выступает индивидуальное творчество. С другой стороны особенностью документов личного происхождения является необыкновенное разнообразие и многоаспектность их содержания.':
        'Documents of personal origin in state archives are one of the most important groups of historical sources and an integral part of a people’s historical and cultural heritage; they carry unique retrospective information refracted through the prism of personal perception. Their significance is especially great for studying the history of literature, science and the arts, that is, those aspects of human activity and of the historical process in which individual creativity comes to the fore. On the other hand, a distinctive feature of documents of personal origin is the extraordinary variety and many-sidedness of their content.',
    'Межархивный путеводитель по фондам личного происхождения, хранящимся в государственном архиве Восточно-Казахстанской области - это реальный путь быстрого информирования исследователей о составе, содержании, месте хранения документов фондов и коллекций личного происхождения.':
        'The inter-archival guide to the fonds of personal origin held in the State Archive of East Kazakhstan Region is a practical way of quickly informing researchers about the composition, content and location of the documents of fonds and collections of personal origin.',
    'В государственном архиве Восточно-Казахстанской области насчитывается на хранении более 60 фондов личного происхождения.':
        'The State Archive of East Kazakhstan Region holds more than 60 fonds of personal origin.',
}
KK_INTRO = {
    'Документы личного происхождения в государственных архивах представляют собой одну из важнейших групп исторических источников, являются неотъемлемой частью историко-культурного наследия народа, несут в себе уникальную ретроспективную информацию, преломленную через призму личностного восприятия. Их значение особенно велико для изучения истории литературы, науки, искусства, то есть тех сторон человеческой деятельности и исторического процесса, где на первый план выступает индивидуальное творчество. С другой стороны особенностью документов личного происхождения является необыкновенное разнообразие и многоаспектность их содержания.':
        'Мемлекеттік архивтердегі жеке тектік құжаттар тарихи деректердің аса маңызды топтарының бірі болып табылады, халықтың тарихи-мәдени мұрасының ажырамас бөлігі болып саналады және жеке қабылдау призмасы арқылы өткен бірегей ретроспективті ақпаратты қамтиды. Олардың маңызы әдебиет, ғылым, өнер тарихын, яғни адам қызметі мен тарихи үдерістің жеке шығармашылық алдыңғы қатарға шығатын жақтарын зерттеуде ерекше зор. Екінші жағынан, жеке тектік құжаттардың ерекшелігі олардың мазмұнының ерекше алуан түрлілігі мен көпқырлылығында.',
    'Межархивный путеводитель по фондам личного происхождения, хранящимся в государственном архиве Восточно-Казахстанской области - это реальный путь быстрого информирования исследователей о составе, содержании, месте хранения документов фондов и коллекций личного происхождения.':
        'Шығыс Қазақстан облысының мемлекеттік архивінде сақталатын жеке тектік қорлар бойынша архив аралық нұсқаулық зерттеушілерге жеке тектік қорлар мен жинақтар құжаттарының құрамы, мазмұны, сақталатын орны туралы жылдам хабарлаудың нақты жолы болып табылады.',
    'В государственном архиве Восточно-Казахстанской области насчитывается на хранении более 60 фондов личного происхождения.':
        'Шығыс Қазақстан облысының мемлекеттік архивінде 60-тан астам жеке тектік қор сақталады.',
}


def personal_page(md):
    en, kk = md, md
    for ru, tr in EN_INTRO.items():
        en = en.replace(ru, tr)
    for ru, tr in KK_INTRO.items():
        kk = kk.replace(ru, tr)
    en = en.replace('КОЛЛЕКЦИИ ДОКУМЕНТОВ', 'DOCUMENT COLLECTIONS').replace('СРЕДИ ФОНДООБРАЗОВАТЕЛЕЙ:', 'AMONG THE FONDS CREATORS:')
    kk = kk.replace('КОЛЛЕКЦИИ ДОКУМЕНТОВ', 'ҚҰЖАТТАР ЖИНАҚТАРЫ').replace('СРЕДИ ФОНДООБРАЗОВАТЕЛЕЙ:', 'ҚОР ҚҰРУШЫЛАР АРАСЫНДА:')

    def fix(md_, name_fn, data_fn):
        def link(m):
            txt = m.group(1)
            if re.search(r'ГАВКО|ф\.\s*\d', txt):
                return '[' + data_fn(txt) + ']'
            if re.fullmatch(r'[А-ЯЁӘӨҰҮҒҚҢҺІ][А-ЯЁӘӨҰҮҒҚҢҺІ\s.,()\-]+\.?,?', txt):
                return '[' + name_fn(txt) + ']'
            return m.group(0)
        return re.sub(r'\[([^\]\n]+)\](?=\()', link, md_)
    return fix(en, name_en, data_en), fix(kk, name_kk, data_kk)


# ---------------------------------------------------------------- полные английские тексты: символы РК и «Документы» (ссылки подставляются по порядку)
FULL_PAGES = {
    '42569': {
        'title': 'State symbols of the Republic of Kazakhstan',
        'md': '''**State Flag of the Republic of Kazakhstan**

**![](@1)**

The State Flag of the Republic of Kazakhstan is a rectangular sky-blue cloth with the image of a sun with 32 rays in its centre, under which is a soaring steppe eagle. Along the hoist is a vertical band with a national ornament. The images of the sun, rays, eagle and ornament are golden. The ratio of the width of the Flag to its length is 1:2.

**State Emblem of the Republic of Kazakhstan**

![](@2)

The State Emblem of the Republic of Kazakhstan is circular in shape and is an image of a shanyrak (the upper vaulted part of a yurt) on a sky-blue background, from which uyks (supporting poles) radiate in all directions like sun rays. To the right and left of the shanyrak are images of mythical winged horses. In the upper part is a three-dimensional five-pointed star, and in the lower part the inscription “Қазақстан”. The images of the star, shanyrak, uyks, mythical winged horses and the inscription “Қазақстан” are golden.

**State Anthem of the Republic of Kazakhstan**

**Words:** Nursultan Nazarbayev, Zhumeken Nazhimedenov
 **Music:** Shamshi Kaldayakov

![](@3)

In its sky is a golden sun,
In its steppes is golden grain.
It is a poem of courage,
Look at my country!
In grey antiquity
Our glory was born.
Never losing honour,
Strong is my Kazakh people!

**Chorus:**

O my people! O my country!
I am a flower planted by you,
I am your flowing song, my country!
My native land is my Kazakhstan!
Opening the way for future generations
I have a wide, boundless land.
United in unity,
I have an independent country.
It greets the (new) time
Like an eternal friend.
Our country is happy,
Our country is such!

**Chorus:**

O my people! O my country!
I am a flower planted by you,
I am your flowing song, my country!
My native land is my Kazakhstan!''',
    },
    '52670': {
        'title': 'Documents',
        'md': '''[**Draft resolution of the East Kazakhstan Regional Akimat** **“On approval of the price list for goods** **(works, services) sold by the state archives of the Department of Digitalisation and Archives of East Kazakhstan Region”**](@1)''',
    },
}
