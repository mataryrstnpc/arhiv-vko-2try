/* ================= Разделы по ТЗ: электронный каталог, «Архив памяти», онлайн-выставки,
   «Филиалы и контакты», справка для посетителей, политика конфиденциальности.
   Данные — pages/catalog.json, memory.json, expo.json, home.json (собирает tools/build_tz.py
   из выгрузки прежнего сайта). Вшивается в index.html сборщиком (dev/build.py). ================= */
Object.assign(T, {
  navCatalog:["Фонды и каталог","Қорлар және каталог","Fonds & catalogue"],
  navMemory:["Архив памяти","Жад мұрағаты","Memory archive"],
  navExpo:["Выставки","Көрмелер","Exhibitions"],
  navBranches:["Филиалы и контакты","Филиалдар және байланыс","Branches & contacts"],
  navGuide:["Справка","Анықтама","Help"],
  catBtn:["Электронный каталог","Электрондық каталог","Electronic catalogue"],
  themeToggle:["Тёмная тема","Қараңғы тақырып","Dark theme"],
  themeToggleL:["Светлая тема","Ашық тақырып","Light theme"],
  // каталог
  catTitle:["Электронный каталог","Электрондық каталог","Electronic catalogue"],
  catLead:["Фонды, описи, дела, документы и фотографии архива — в одном поиске.","Архивтің қорлары, тізімдемелері, істері, құжаттары мен фотосуреттері — бір іздеуде.","Fonds, inventories, files, documents and photographs of the archive in one search."],
  catQ:["Что ищете? Например: фотографии Усть-Каменогорска 1960-х","Не іздейсіз? Мысалы: 1960 жылдардағы Өскемен фотосуреттері","What are you looking for? E.g. photos of Ust-Kamenogorsk in the 1960s"],
  catFind:["Найти","Табу","Search"],
  docsMoreT:["Файлы законов и приказов, государственные символы","Заңдар мен бұйрықтар файлдары, мемлекеттік рәміздер","Files of laws and orders, state symbols"],
  introMoreT:["Структура и функции архива","Мұрағаттың құрылымы мен функциялары","Structure and functions of the archive"], histMoreT:["История архива подробно","Мұрағат тарихы толығырақ","Archive history in detail"],
  pubsMoreT:["Доклады, статьи и воспоминания","Баяндамалар, мақалалар және естеліктер","Talks, articles and memoirs"],
  pubsMoreD:["Все доклады и статьи сотрудников архива: поиск, фильтры и ссылки на сами тексты.","Мұрағат қызметкерлерінің барлық баяндамалары мен мақалалары: іздеу, сүзгілер және мәтіндерге сілтемелер.","All talks and articles by archive staff: search, filters and links to the texts."],
  rdRulesT:["Правила работы исследователей","Зерттеушілердің жұмыс ережелері","Rules for researchers"], svcMoreT:["Нормативные документы, отчёты, график приёма","Нормативтік құжаттар, есептер, қабылдау кестесі","Regulations, reports, reception schedule"],
  memGroupsT:["Категория","Санат","Category"],
  pubArt:["Статья","Мақала","Article"], pubTalk:["Доклад","Баяндама","Talk"], pubArts:["Статьи и воспоминания","Мақалалар мен естеліктер","Articles and memoirs"], pubTalks:["Доклады","Баяндамалар","Talks"],
  pubAu:["Автор","Автор","Author"], pubFind:["Поиск по названию или автору","Атауы немесе авторы бойынша іздеу","Search by title or author"], sAuthor:["по автору","автор бойынша","by author"],
  fFilters:["Фильтры","Сүзгілер","Filters"], fExact:["Точный поиск","Нақты іздеу","Exact search"],
  fFilesT:["Перечни фондов","Қорлар тізімдері","Fonds lists"], dbOpen:["Открыть базу","Дерекқорды ашу","Open database"], dbRead:["Читать","Оқу","Read"],
  dbMetricD:["Метрические книги церквей: записи о рождении, браке и смерти (Томская и Омская духовные консистории).","Шіркеулердің метрикалық кітаптары: туу, неке және өлім туралы жазбалар (Томск және Омбы діни консисториялары).","Parish registers: records of births, marriages and deaths (Tomsk and Omsk spiritual consistories)."],
  catAdv:["Расширенный поиск","Кеңейтілген іздеу","Advanced search"],
  catAdvHide:["Скрыть расширенный поиск","Кеңейтілген іздеуді жасыру","Hide advanced search"],
  catReset:["Сбросить","Тазалау","Reset"],
  catAll:["Все материалы","Барлық материалдар","All records"],
  catN:["Найдено: {n}","Табылды: {n}","Found: {n}"],
  catNone:["Ничего не нашлось. Попробуйте убрать часть фильтров или написать запрос короче.","Ештеңе табылмады. Сүзгілердің бірін алып тастап немесе сұрауды қысқартып көріңіз.","Nothing found. Try removing some filters or shortening the query."],
  catLoading:["Загружаем каталог…","Каталог жүктелуде…","Loading the catalogue…"],
  catFail:["Каталог не загрузился. Проверьте соединение и обновите страницу.","Каталог жүктелмеді. Байланысты тексеріп, бетті жаңартыңыз.","The catalogue failed to load. Check your connection and reload."],
  catUnder:["Понял запрос так:","Сұрау былай түсінілді:","Understood as:"],
  catTry:["Похожие запросы:","Ұқсас сұраулар:","Related searches:"],
  fTitle:["Название или слова","Атауы немесе сөздер","Title or words"],
  fFond:["Фонд №","Қор №","Fond no."],
  fInv:["Опись №","Тізімдеме №","Inventory no."],
  fFile:["Дело №","Іс №","File no."],
  fFrom:["Год с","Жылдан","Year from"],
  fTo:["Год по","Жылға дейін","Year to"],
  fAuthor:["Автор или организация","Автор немесе ұйым","Author or organisation"],
  fTopic:["Тема","Тақырып","Topic"],
  fPlace:["Населённый пункт","Елді мекен","Place"],
  fKw:["Ключевые слова","Түйін сөздер","Keywords"],
  fType:["Тип материала","Материал түрі","Record type"],
  fBranch:["Архив или филиал","Архив немесе филиал","Archive or branch"],
  fAny:["любой","кез келген","any"],
  fSort:["Сортировка","Сұрыптау","Sort by"],
  sRel:["по соответствию","сәйкестігі бойынша","relevance"],
  sNew:["сначала поздние","алдымен кейінгілер","newest first"],
  sOld:["сначала ранние","алдымен ертеректер","oldest first"],
  sTitle:["по названию","атауы бойынша","title"],
  sCode:["по шифру","шифр бойынша","archival code"],
  fFav:["Только избранное","Тек таңдаулылар","Favourites only"],
  pgPrev:["Назад","Артқа","Previous"],
  pgNext:["Дальше","Әрі қарай","Next"],
  pgOf:["Страница {i} из {n}","{n} беттің {i}-сі","Page {i} of {n}"],
  kFond:["Фонды","Қорлар","Fonds"], kInv:["Описи","Тізімдемелер","Inventories"], kFile:["Дела","Істер","Files"], kDoc:["Документы","Құжаттар","Documents"],
  kPhoto:["Фотодокументы","Фотоқұжаттар","Photographs"], kMap:["Карты и чертежи","Карталар мен сызбалар","Maps & drawings"], kPub:["Письменные источники и публикации","Жазба деректер мен жарияланымдар","Written sources & publications"],
  kOrg:["Документы организаций","Ұйымдардың құжаттары","Records of organisations"], kPers:["Документы личного происхождения","Жеке тектес құжаттар","Personal papers"], kAv:["Аудио- и видеодокументы","Аудио және бейне құжаттар","Audio & video"],
  // карточка
  cCode:["Архивный шифр","Архивтік шифр","Archival code"], cFond:["Фонд","Қор","Fond"], cInv:["Опись","Тізімдеме","Inventory"], cFileN:["Дело","Іс","File"], cSheets:["Листы","Парақтар","Sheets"],
  cUnits:["Единиц хранения","Сақтау бірлігі","Storage units"], cDate:["Дата","Күні","Date"], cPeriod:["Период","Кезең","Period"], cType:["Тип","Түрі","Type"], cLang:["Язык","Тілі","Language"],
  cStore:["Место хранения","Сақталатын орны","Held at"], cAccess:["Доступ","Қолжетімділік","Access"], cDigital:["Цифровая копия","Цифрлық көшірме","Digital copy"], cAuthor:["Автор, фондообразователь","Автор, қор құрушы","Author or creator"],
  cDesc:["Описание","Сипаттама","Description"], cNote:["Историческая справка","Тарихи анықтама","Historical note"], cText:["Текст документа","Құжат мәтіні","Document text"], cTopics:["Темы","Тақырыптар","Topics"], cPlaces:["Места","Орындар","Places"],
  cCol:["Коллекция","Жинақ","Collection"], cSrc:["Источник публикации","Жарияланым көзі","Published in"], cRefs:["Упоминается в публикациях","Жарияланымдарда аталады","Cited in"], cGrif:["Гриф","Гриф","Classification"],
  cParent:["Входит в","Құрамына кіреді","Part of"], cKids:["Состав","Құрамы","Contents"], cSame:["Похожие материалы","Ұқсас материалдар","Related records"], cExpoRel:["Выставки по теме","Тақырып бойынша көрмелер","Exhibitions on this topic"], cNo:["не указано","көрсетілмеген","not stated"],
  cYes:["есть","бар","available"], cNoCopy:["нет, документ в архиве","жоқ, құжат архивте","no, the record is held in the archive"], cBack:["← К результатам","← Нәтижелерге","← Back to results"],
  cCopy:["Скопировать шифр","Шифрды көшіру","Copy code"], cCopied:["Шифр скопирован","Шифр көшірілді","Code copied"], cShare:["Поделиться","Бөлісу","Share"], cLinkCopied:["Ссылка скопирована","Сілтеме көшірілді","Link copied"],
  cFav:["В избранное","Таңдаулыларға","Add to favourites"], cFavOn:["В избранном","Таңдаулыларда","In favourites"], cOpen:["Открыть публикацию","Жарияланымды ашу","Open the publication"], cDownload:["Скачать файл","Файлды жүктеу","Download the file"],
  cWatch:["Смотреть видео","Бейнені көру","Watch the video"], cCite:["Как сослаться","Қалай сілтеме жасау","How to cite"], cAi:["Кратко с помощью ИИ","ЖИ көмегімен қысқаша","AI summary"],
  aOpen:["Открытый","Ашық","Open"], aDeclass:["Рассекречен, открытый","Құпиясыздандырылған, ашық","Declassified, open"], aLimited:["Ограниченный","Шектеулі","Restricted"],
  zIn:["Увеличить","Үлкейту","Zoom in"], zOut:["Уменьшить","Кішірейту","Zoom out"], zFit:["По размеру окна","Терезе өлшеміне","Fit to window"], pagePrev:["Предыдущий лист","Алдыңғы парақ","Previous sheet"], pageNext:["Следующий лист","Келесі парақ","Next sheet"],
  favTitle:["Избранное","Таңдаулылар","Favourites"], favEmpty:["Здесь появятся материалы, которые вы отметите звёздочкой. Список хранится только в этом браузере.","Жұлдызшамен белгілеген материалдар осында шығады. Тізім тек осы браузерде сақталады.","Records you star appear here. The list is kept only in this browser."],
  catMore:["Состав фондов","Қорлар құрамы","Holdings overview"], catPersonal:["Личные фонды","Жеке қорлар","Personal fonds"], catDb:["Базы данных","Деректер базалары","Databases"], catGloss:["Словарь терминов","Терминдер сөздігі","Glossary"],
  catHow:["Как искать в каталоге","Каталогтан қалай іздеу керек","How to search the catalogue"],
  // темы
  topWar:["Война и военная история","Соғыс және әскери тарих","War and military history"], topIndustry:["Промышленность","Өнеркәсіп","Industry"], topEdu:["Образование","Білім","Education"],
  topCulture:["Культура и искусство","Мәдениет және өнер","Culture and the arts"], topPeople:["Известные люди","Белгілі адамдар","Notable people"], topCity:["Усть-Каменогорск","Өскемен","Ust-Kamenogorsk"],
  topRegion:["История края","Өлке тарихы","Regional history"], topRepress:["Политические репрессии","Саяси қуғын-сүргін","Political repression"], topSport:["Спорт","Спорт","Sport"],
  topOrg:["Организации и учреждения","Ұйымдар мен мекемелер","Organisations"], topFamily:["Семейная история","Отбасы тарихы","Family history"], topNature:["Природа края","Өлке табиғаты","Nature"],
  // архив памяти
  memTitle:["Архив памяти","Жад мұрағаты","Memory archive"],
  memLead:["Люди, события, фотографии и документы Восточного Казахстана.","Шығыс Қазақстанның адамдары, оқиғалары, фотосуреттері мен құжаттары.","People, events, photographs and records of East Kazakhstan."],
  memTime:["Хронология","Хронология","Timeline"], memPeople:["Люди","Адамдар","People"], memCols:["Коллекции","Жинақтар","Collections"], memPubs:["Публикации и воспоминания","Жарияланымдар мен естеліктер","Publications & memoirs"],
  memViz:["Материалы по десятилетиям","Онжылдықтар бойынша материалдар","Records by decade"], memVizHint:["Нажмите на столбик — откроются материалы этого десятилетия в каталоге.","Бағанды басыңыз — сол онжылдықтың материалдары каталогта ашылады.","Click a bar to open that decade’s records in the catalogue."],
  memAllPeople:["Все люди","Барлық адамдар","Everyone"], memFindP:["Поиск по имени","Аты бойынша іздеу","Search by name"], memBio:["Биография","Өмірбаяны","Biography"], memFonds:["Личный фонд в каталоге","Каталогтағы жеке қоры","Personal fond in the catalogue"],
  memPhotos:["Фотографии","Фотосуреттер","Photographs"], memPage:["Страница о человеке на сайте архива","Архив сайтындағы адам туралы бет","Page about this person on the archive site"], memEvG:{archive:["История архива","Архив тарихы","Archive history"], region:["История края","Өлке тарихы","Regional history"], district:["Районы","Аудандар","Districts"]},
  memPeriod:["Период","Кезең","Period"], memTheme:["Тема","Тақырып","Theme"], memPlace:["Место","Орын","Place"], memGallery:["Галерея","Галерея","Gallery"], memList:["Список","Тізім","List"],
  memNoBio:["Биография на сайте пока не опубликована.","Өмірбаяны сайтта әлі жарияланбаған.","No biography has been published yet."],
  perPre:["до 1917","1917 жылға дейін","before 1917"], per1917:["1917–1940","1917–1940","1917–1940"], per1941:["1941–1945","1941–1945","1941–1945"], per1946:["1946–1991","1946–1991","1946–1991"], per1991:["с 1991","1991 жылдан бері","since 1991"],
  // выставки
  expoTitle:["Онлайн-выставки","Онлайн көрмелер","Online exhibitions"],
  aVers:["Версии","Нұсқалар","Versions"], aResult:["Результат","Нәтиже","Result"], aObj:["Объект","Нысан","Object"], aVerS:["Версия","Нұсқа","Version"],
  aJrAll:["Все","Барлығы","All"], aJrBad:["Отказы и ошибки","Бас тартулар мен қателер","Denied and failed"], aJrLogin:["Входы","Кірулер","Sign-ins"], aJrItems:["Материалы","Материалдар","Records"],
  aJrOk:["выполнено","орындалды","done"], aJrDenied:["отказано","бас тартылды","denied"], aJrErr:["ошибка","қате","error"],
  aJrHint:["Показаны последние 500 записей, на сервере хранятся последние 5 000. В записи: кто, что и с каким объектом сделал, версия записи и результат. Пароли и ключи в журнал не попадают. Записи, сделанные до введения результата, показывают прочерк.","Соңғы 500 жазба көрсетілген, серверде соңғы 5 000 сақталады. Жазбада: кім, нені және қандай нысанмен жасады, жазба нұсқасы және нәтиже. Құпиясөздер мен кілттер журналға түспейді. Нәтиже енгізілгенге дейінгі жазбаларда сызықша тұр.","The last 500 entries are shown; the server keeps the last 5,000. Each entry has who did what to which object, the record version and the result. Passwords and keys never reach the log. Entries made before results were recorded show a dash."],
  expoAllP:["Все периоды","Барлық кезеңдер","All periods"], expoByTopic:["Тематика","Тақырып","Topic"], expoByPeriod:["Исторический период","Тарихи кезең","Historical period"], perBefore:["До 1917 г.","1917 ж. дейін","Before 1917"], perAfter:["С 1992 г.","1992 ж. бастап","From 1992"],
  aVideoFiles:["Видео и аудио выставки (MP4, WebM, MP3, M4A, OGG, WAV)","Көрменің бейне және аудиофайлдары (MP4, WebM, MP3, M4A, OGG, WAV)","Exhibition video and audio files (MP4, WebM, MP3, M4A, OGG, WAV)"],
  aVideoHint:["Файл до 100 МБ показывается на странице выставки с перемоткой: видео в плеере, аудио в проигрывателе. Если файл больше или это ролик с YouTube, вставьте ссылку в поле выше. Не забудьте сохранить выставку.","100 МБ-қа дейінгі файл көрме бетінде шолумен көрсетіледі: бейне плеерде, аудио ойнатқышта. Файл үлкенірек болса немесе бұл YouTube ролигі болса, жоғарыдағы өріске сілтеме қойыңыз. Көрмені сақтауды ұмытпаңыз.","A file up to 100 MB is shown on the exhibition page with seeking: video in a player, audio in an audio player. If the file is larger or it is a YouTube video, paste the link in the field above. Remember to save the exhibition."],
  aVideoOnly:["Здесь принимаются только видео и аудио: MP4, WebM, MP3, M4A, OGG, WAV. Фото и сканы добавляйте в экспонаты.","Мұнда тек бейне мен аудио қабылданады: MP4, WebM, MP3, M4A, OGG, WAV. Фото мен скандарды экспонаттарға қосыңыз.","Only video and audio are accepted here: MP4, WebM, MP3, M4A, OGG, WAV. Add photos and scans as exhibits."],
  expoAudio:["Аудио","Аудио","Audio"],
  expoLead:["Документальные выставки и фотовыставки архива.","Архивтің деректі көрмелері мен фотокөрмелері.","Documentary and photo exhibitions of the archive."],
  expoDoc:["Выставки архива","Архив көрмелері","Archive exhibitions"], expoPhoto:["Фотовыставки","Фотокөрмелер","Photo exhibitions"], expoN:["{n} экспонатов","{n} экспонат","{n} exhibits"],
  expoRel:["Материалы по теме из фотокаталога и видеоархива","Фотокаталог пен бейнемұрағаттан тақырып бойынша материалдар","Related items from the photo catalogue and video archive"],
  expoBack:["← Все выставки","← Барлық көрмелер","← All exhibitions"], expoSrc:["Источник","Дереккөз","Source"], expoOpen:["Открыть выставку","Көрмені ашу","Open the exhibition"],
  expoFiles:["Документы","Құжаттар","Documents"], expoAllT:["Все темы","Барлық тақырыптар","All topics"], expoNoImg:["Изображение загрузится, когда сервер сайта подключён к интернету.","Сурет сайт сервері интернетке қосылғанда жүктеледі.","The image loads when the site server is online."],
  // филиалы
  brTitle:["Филиалы и контакты","Филиалдар және байланыс","Branches & contacts"],
  brLead:["Главное здание архива, здания в Усть-Каменогорске и филиалы в районах области. Выберите место — покажем адрес, часы работы и маршрут.","Архивтің бас ғимараты, Өскемендегі ғимараттар және облыс аудандарындағы филиалдар. Орынды таңдаңыз — мекенжайы, жұмыс уақыты және бағыты көрсетіледі.","The archive’s main building, its other buildings in Ust-Kamenogorsk and branches across the region. Pick a place to see its address, hours and route."],
  brFind:["Поиск: название или город","Іздеу: атауы немесе қала","Search by name or town"], brAll:["Все","Барлығы","All"], brMain:["Главное здание","Бас ғимарат","Main building"], brCity:["Здания в Усть-Каменогорске","Өскемендегі ғимараттар","Buildings in Ust-Kamenogorsk"], brBranch:["Филиалы","Филиалдар","Branches"],
  brAddr:["Адрес","Мекенжайы","Address"], brPhone:["Телефон","Телефон","Phone"], brMail:["Эл. почта","Эл. пошта","Email"], brHours:["Часы работы","Жұмыс уақыты","Opening hours"], brZone:["Территория и документы","Аумағы мен құжаттары","Area and records"],
  brHead:["Руководитель","Басшысы","Head"], brNoPin:["Метки на карте нет: координаты не указаны. Маршрут строится по адресу.","Картада белгі жоқ: координаттар көрсетілмеген. Бағыт мекенжай бойынша құрылады.","No map marker: coordinates are not given. The route is built from the address."], brCoords:["Координаты","Координаттары","Coordinates"], brFonds:["Фонды в каталоге","Каталогтағы қорлар","Fonds in the catalogue"], brApprox:["Точка на карте приблизительная: дом не отмечен на карте 2ГИС.","Картадағы нүкте шамамен: үй 2ГИС картасында белгіленбеген.","The map point is approximate: the house isn’t marked on 2GIS."],
  brRoute:["Как добраться","Қалай жетуге болады","Getting there"], brFrom:["Откуда","Қайдан","From"], brFromPh:["Ваш адрес, например: Усть-Каменогорск, проспект Независимости, 1","Мекенжайыңыз, мысалы: Өскемен, Тәуелсіздік даңғылы, 1","Your address, e.g. Ust-Kamenogorsk, Nezavisimosti 1"],
  brGeo:["Моё местоположение","Менің орным","My location"], brMode:["Способ","Тәсілі","Mode"], brCar:["на машине","көлікпен","by car"], brBus:["транспортом","қоғамдық көлікпен","public transport"], brFoot:["пешком","жаяу","on foot"],
  brShow:["Построить маршрут","Бағыт құру","Get directions"], brDist:["По прямой: {d} км","Тура жолмен: {d} км","Straight-line distance: {d} km"], brIn2gis:["Открыть в 2ГИС","2ГИС-те ашу","Open in 2GIS"], brInGoogle:["Открыть в Google Картах","Google Maps-те ашу","Open in Google Maps"],
  brGeoFail:["Не удалось определить местоположение. Введите адрес вручную.","Орныңызды анықтау мүмкін болмады. Мекенжайды қолмен енгізіңіз.","Couldn’t get your location. Type an address instead."], brAddrFail:["Адрес не найден. Уточните город и улицу.","Мекенжай табылмады. Қала мен көшені нақтылаңыз.","Address not found. Add the town and street."],
  brNear:["Ближайшее к вам: {n}, {d} км по прямой","Сізге ең жақыны: {n}, тура жолмен {d} км","Nearest to you: {n}, {d} km straight-line"], brNone:["Ничего не найдено","Ештеңе табылмады","Nothing found"], brSel:["Выбрано","Таңдалды","Selected"],
  // справка
  tSite:["О сайте","Сайт туралы","About the site"], tGuide:["Как искать","Қалай іздеу керек","How to search"], tLinks:["Документы и ссылки","Құжаттар мен сілтемелер","Laws & links"],
  // главная
  inCat:["В каталоге","Каталогтан","In catalogue"], inCatA:["Искать в электронном каталоге","Электрондық каталогтан іздеу","Search the electronic catalogue"], aStruct:["Структура и функции архива","Архивтің құрылымы мен функциялары","Archive structure and functions"], aboutMore:["Подробнее об архиве","Архив туралы толығырақ","More about the archive"], tDocsA:["Нормативные документы","Нормативтік құжаттар","Regulatory documents"], tTeamA:["Руководство","Басшылық","Management"], tHistA:["История архива","Архив тарихы","History of the archive"],
  aDups:["Найти дубли","Қайталанатындарды табу","Find duplicates"], aDupsHide:["Скрыть дубли","Жасыру","Hide duplicates"], aDupsNone:["Дублей не найдено","Қайталанатын жазбалар жоқ","No duplicates found"], aDupsT:["Совпадают название и шифр","Атауы мен шифры сәйкес","Same title and code"], aDupsNew:["новая запись","жаңа жазба","new record"], cLimNote:["Документ ограниченного доступа: описание открыто, цифровая копия выдаётся в читальном зале по письменному запросу.","Қолжетімділігі шектеулі құжат: сипаттамасы ашық, цифрлық көшірме оқу залында жазбаша сұрау бойынша беріледі.","Restricted document: the description is open; the digital copy is available in the reading room on written request."], cLimHow:["Как попасть в читальный зал","Оқу залына қалай баруға болады","How to visit the reading room"],
  nfCat:["Категория","Санат","Category"], nfCatNone:["Определить автоматически","Автоматты түрде","Detect automatically"], nfImg:["Фото","Фото","Photo"], nfImgHint:["JPG, PNG или WebP до 15 МБ — сожмём автоматически","JPG, PNG немесе WebP, 15 МБ дейін — автоматты түрде сығылады","JPG, PNG or WebP up to 15 MB — compressed automatically"], nfImgDel:["убрать фото","фотоны алып тастау","remove photo"], nfYt:["Видео (ссылка YouTube)","Бейне (YouTube сілтемесі)","Video (YouTube link)"], nfYtHint:["Необязательно","Міндетті емес","Optional"], nfYtBad:["Не похоже на ссылку YouTube","YouTube сілтемесіне ұқсамайды","This does not look like a YouTube link"],
  qlCat:["Электронный каталог","Электрондық каталог","Electronic catalogue"], qlExpo:["Онлайн-выставки","Онлайн көрмелер","Online exhibitions"], qlBr:["Филиалы на карте","Филиалдар картада","Branches on the map"], qlMem:["Архив памяти","Жад мұрағаты","Memory archive"],
  homeAdv:["Расширенный поиск по каталогу","Каталог бойынша кеңейтілген іздеу","Advanced catalogue search"],
  hDocsT:["История в документах","Құжаттардағы тарих","History in documents"], hDocsL:["Документы и снимки из фондов архива с шифрами — откройте карточку, чтобы увидеть описание и цифровую копию.","Архив қорларынан шифрлары бар құжаттар мен суреттер — сипаттамасы мен цифрлық көшірмесін көру үшін карточканы ашыңыз.","Records and photographs from the archive with their codes: open a card to see the description and digital copy."],
  hExpoT:["Онлайн-выставки","Онлайн көрмелер","Online exhibitions"], hAllExpo:["Все выставки","Барлық көрмелер","All exhibitions"], hAllCat:["Весь каталог","Бүкіл каталог","Full catalogue"],
  hBrT:["Наши филиалы","Біздің филиалдар","Our branches"], hBrAll:["Все филиалы и маршруты","Барлық филиалдар мен бағыттар","All branches & directions"],
  hInfoT:["Полезная информация","Пайдалы ақпарат","Useful information"], hSocT:["Мы в социальных сетях","Біз әлеуметтік желілердеміз","Follow us"],
  socNone:["Официальные страницы архива в социальных сетях добавляет администрация сайта. Новости управления — на странице gov.kz.","Архивтің әлеуметтік желілердегі ресми беттерін сайт әкімшілігі қосады. Басқарма жаңалықтары — gov.kz бетінде.","Official social pages are added by the site administrators. Department news is on its gov.kz page."],
  shareT:["Поделиться страницей","Бетпен бөлісу","Share this page"],
  // подвал и политика
  privacy:["Политика конфиденциальности","Құпиялылық саясаты","Privacy policy"], copy:["© {y} Государственный архив Восточно-Казахстанской области","© {y} Шығыс Қазақстан облысының мемлекеттік архиві","© {y} State Archive of East Kazakhstan Region"],
  footSoc:["Социальные сети","Әлеуметтік желілер","Social media"],
  // ИИ
  aiSumT:["Кратко","Қысқаша","Summary"], aiDates:["Даты","Күндер","Dates"], aiNames:["Имена","Есімдер","Names"], aiRel:["Связанные материалы","Байланысты материалдар","Related records"],
  aiLocal:["Составлено автоматически по тексту страницы. Проверяйте по первоисточнику.","Бет мәтіні бойынша автоматты түрде құрастырылды. Түпнұсқамен тексеріңіз.","Generated automatically from the page text. Check against the source."],
  aiWait:["Читаю материал…","Материалды оқып жатырмын…","Reading…"]
});
VIEWS.push('catalog', 'memory', 'expo', 'privacy', 'my', 'stats');
Object.assign(ALIAS, {branches:'contacts', katalog:'catalog', faq:'visitors/faq', guide:'visitors/guide', exhibitions:'expo', memory:'memory'});
HUBS.visitors = ['cert', 'genealogy', 'reading', 'services', 'guide', 'faq'];
Object.assign(TAB_T, {site:'tSite', guide:'tGuide', links:'tLinks'});
HUB_T.visitors = 'navGuide';

/* ---------- общие помощники ---------- */
const TZD = {
  cache: {}, wait: {},
  get(name) {
    if (this.cache[name]) return Promise.resolve(this.cache[name]);
    // каталог сервер отдаёт с правками сотрудников (скрытые записи, исправления): каждый раз сверяем по ETag, а не берём из кэша на неделю
    if (!this.wait[name]) this.wait[name] = fetch('pages/' + name + '.json', {cache:name === 'catalog' || name === 'social' ? 'no-cache' : 'force-cache'}).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(j => (this.cache[name] = j)).catch(e => { delete this.wait[name]; throw e; });
    return this.wait[name];
  }
};
const tzIc = (id, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;
const tzImg = s => s ? String(s) : '';
const yRange = (a, b) => a && b && a !== b ? `${a}–${b}` : (a || b ? String(a || b) : '');
const TOPIC_T = {war:'topWar', industry:'topIndustry', edu:'topEdu', culture:'topCulture', people:'topPeople', city:'topCity', region:'topRegion', repress:'topRepress', sport:'topSport', org:'topOrg', family:'topFamily', nature:'topNature'};
const KIND_T = {fond:'kFond', inv:'kInv', file:'kFile', doc:'kDoc', photo:'kPhoto', map:'kMap', pub:'kPub', org:'kOrg', pers:'kPers', av:'kAv'};
const KINDS = ['fond', 'inv', 'file', 'doc', 'photo', 'map', 'pub', 'org', 'pers', 'av'];
/* «Усть-Каменогорск» и «Область» в списке тем — это места, а не темы: в фильтрах тем их нет, место выбирается в «Месте» (иначе «тема: Усть-Каменогорск + место: Семей» — противоречие) */
const GEO_TOP = ['city', 'region'];
const PERIODS = [['pre', 0, 1916, 'perPre'], ['1917', 1917, 1940, 'per1917'], ['1941', 1941, 1945, 'per1941'], ['1946', 1946, 1991, 'per1946'], ['1991', 1991, 2100, 'per1991']];
function tzCopy(text, okMsg) {
  const done = () => toast(okMsg);
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallback());
  else fallback();
  function fallback() { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); }
}
/* понятный адрес текущей страницы: /catalog/…, /expo/…, /p/123 (сервер отдаёт по нему сайт с заголовком страницы) */
function pageURL() {
  const base = /^https?:$/.test(location.protocol) ? location.origin : 'https://e-arhiv.vko.gov.kz';
  const path = location.hash.replace(/^#/, '').split('?')[0];
  return base + '/' + (path && path !== 'home' && !/^(admin)/.test(path) ? path.split('/').map(encodeURIComponent).join('/') : '');
}
function tzShare(title) {
  const url = pageURL();
  if (navigator.share) { navigator.share({title, url}).catch(() => {}); return; }
  tzCopy(url, t('cLinkCopied'));
}
const Fav = {
  ids() { return LS.get('fav', []); },
  has(id) { return this.ids().includes(id); },
  toggle(id) { const a = this.ids(); const i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.unshift(id); LS.set('fav', a.slice(0, 500)); return i < 0; }
};
/* ================= «Мой кабинет» (ТЗ 8.1) =================
   Только для работы с открытыми материалами: избранное, свои подборки, сохранённые ссылки, история поиска, «что нового».
   Всё хранится в этом браузере (localStorage), на сервер ничего не уходит; перенос на другое устройство — файлом. */
const My = {
  get(k, d) { return LS.get('my_' + k, d); },
  set(k, v) { LS.set('my_' + k, v); },
  addQ(href, q) { if (this.get('qoff', false)) return; const a = this.get('q', []).filter(x => x.q !== q); a.unshift({q:String(q).slice(0, 200), href, at:Date.now()}); this.set('q', a.slice(0, 30)); },
  btn(href, title) { return `<button type="button" class="btn ghost sm" data-act="my-save" data-v="${esc(href)}" data-t="${esc(String(title || '').slice(0, 200))}">${tzIc('i-star')}${esc(t('mySave'))}</button>`; },
  saveLink(href, title) { const a = this.get('links', []).filter(x => x.href !== href); a.unshift({href, t:title || href, at:Date.now()}); this.set('links', a.slice(0, 200)); },
  cols() { return this.get('cols', []); },
  /* «что нового»: новости и выставки, которых не было при прошлом просмотре кабинета */
  feed(e) {
    const news = (Store.data.news || []).filter(n => !n.demo).map(n => ({id:'n:' + n.id, kind:'news', t:L(n.title), d:n.date}));
    const ex = (Store.data.items || []).filter(x => x.type === 'expo').concat((e && e.items) || []).map(x => ({id:'x:' + x.id, kind:'expo', t:LK(x.t), x}));
    return news.concat(ex);
  },
  render() {
    const root = $('#my-root'); if (!root) return;
    if (!Cat.data || !this.ex) {
      root.innerHTML = `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
      Promise.all([Cat.data ? null : Cat.load(), TZD.get('expo')]).then(([, e]) => { this.ex = e; if (current === 'my') this.render(); })
        .catch(() => { this.ex = this.ex || {items:[]}; if (current === 'my') this.render(); });
      return;
    }
    const sub = this.get('sub', {news:true, expo:true}), all = this.feed(this.ex);
    let seen = this.get('seen', null); if (!seen) { seen = all.map(x => x.id); this.set('seen', seen); }   // первый визит: всё текущее считаем просмотренным
    const fresh = all.filter(x => !seen.includes(x.id) && sub[x.kind]);
    const recT = id => { const r = Cat.byId && Cat.byId.get(id); return r ? LK(r.t) : null; };
    const favs = Fav.ids().filter(id => recT(id));
    const cols = this.cols(), links = this.get('links', []), qs = this.get('q', []), qoff = this.get('qoff', false);
    const colSel = id => `<select class="my-addto" data-my-addto="${esc(id)}" aria-label="${esc(t('myAddTo'))}"><option value="">${esc(t('myAddTo'))}</option>${cols.map(c => `<option value="${esc(c.id)}">${esc(c.n)}</option>`).join('')}<option value="+">${esc(t('myNewCol'))}</option></select>`;
    const rec = (id, extra) => `<li><a href="#catalog/${encodeURIComponent(id)}">${esc(recT(id) || id)}</a><span class="my-act">${extra}</span></li>`;
    root.innerHTML = `
      <section class="panel my-sec"><h2 class="h4">${tzIc('i-info')}${esc(t('myNew'))}${fresh.length ? ` <span class="pill warn">${fresh.length}</span>` : ''}</h2>
        <p class="my-subs"><label><input type="checkbox" data-my-sub="news"${sub.news ? ' checked' : ''}> ${esc(t('mySubNews'))}</label><label><input type="checkbox" data-my-sub="expo"${sub.expo ? ' checked' : ''}> ${esc(t('mySubExpo'))}</label></p>
        ${fresh.length ? `<ul class="my-list">${fresh.map(x => `<li><a href="${x.kind === 'news' ? '#news' : '#expo/' + encodeURIComponent(x.x.id)}">${esc(x.t)}</a><small class="muted">${esc(t(x.kind === 'news' ? 'mySubNews' : 'mySubExpo'))}${x.d ? ' · ' + esc(fmtDate(x.d)) : ''}</small></li>`).join('')}</ul>
          <p><button type="button" class="btn ghost sm" data-act="my-seen">${esc(t('mySeen'))}</button></p>` : `<p class="muted">${esc(t('myNoNew'))}</p>`}
        <p class="muted sm">${esc(t('myRss'))} <a href="/feed.xml" target="_blank" rel="noopener">${esc(location.origin)}/feed.xml</a></p></section>
      ${(() => { const rc = this.recs(this.ex);
        return `<section class="panel my-sec"><h2 class="h4">${tzIc('i-book')}${esc(t('myRecs'))}</h2>${!rc || (!rc.docs.length && !rc.ex.length) ? `<p class="muted">${esc(t('myRecsNone'))}</p>` : `
          ${rc.why.length ? `<p class="muted sm my-why">${esc(t('myRecsWhy'))} ${esc(rc.why.join(', '))}</p>` : ''}
          ${rc.docs.length ? `<ol class="cat-res sm">${rc.docs.map(r => Cat.item(r)).join('')}</ol>` : ''}
          ${rc.ex.length ? `<h3 class="h4">${esc(t('cExpoRel'))}</h3><ul class="expo-grid">${rc.ex.map(x => Expo.cardHTML(x)).join('')}</ul>` : ''}`}</section>`; })()}
      <section class="panel my-sec"><h2 class="h4">${tzIc('i-star')}${esc(t('myFav'))} <small class="muted">${favs.length}</small></h2>
        ${favs.length ? `<ul class="my-list">${favs.map(id => rec(id, `${colSel(id)}<button type="button" class="btn ghost sm" data-act="my-unfav" data-v="${esc(id)}">${esc(t('myRemove'))}</button>`)).join('')}</ul>` : `<p class="muted">${esc(t('myFavNone'))} <a href="#catalog">${esc(t('navCatalog'))}</a></p>`}</section>
      <section class="panel my-sec"><h2 class="h4">${tzIc('i-book')}${esc(t('myCols'))} <small class="muted">${cols.length}</small></h2>
        <form class="my-form" id="my-col-new"><label class="sr" for="my-col-n">${esc(t('myColName'))}</label><input id="my-col-n" maxlength="80" placeholder="${esc(t('myColName'))}" required><button class="btn sm" type="submit">${esc(t('myColAdd'))}</button></form>
        ${cols.map(c => `<details class="my-col"${this.open === c.id ? ' open' : ''} data-col="${esc(c.id)}"><summary><b>${esc(c.n)}</b> <small class="muted">${c.ids.length}</small></summary>
          ${c.ids.length ? `<ul class="my-list">${c.ids.map(id => rec(id, `<button type="button" class="btn ghost sm" data-act="my-colrm" data-v="${esc(c.id)}" data-k="${esc(id)}">${esc(t('myRemove'))}</button>`)).join('')}</ul>` : `<p class="muted sm">${esc(t('myColEmpty'))}</p>`}
          <p class="btn-row"><button type="button" class="btn ghost sm" data-act="my-colcopy" data-v="${esc(c.id)}">${tzIc('i-copy')}${esc(t('myColCopy'))}</button><button type="button" class="btn ghost sm" data-act="my-coldel" data-v="${esc(c.id)}">${esc(this.armed === c.id ? t('delConfirm') : t('myColDel'))}</button></p></details>`).join('')}</section>
      <section class="panel my-sec"><h2 class="h4">${tzIc('i-share')}${esc(t('myLinks'))} <small class="muted">${links.length}</small></h2>
        ${links.length ? `<ul class="my-list">${links.map((l, i) => `<li><a href="${esc(l.href)}">${esc(l.t)}</a><span class="my-act"><button type="button" class="btn ghost sm" data-act="my-linkrm" data-v="${i}">${esc(t('myRemove'))}</button></span></li>`).join('')}</ul>` : `<p class="muted">${esc(t('myLinksNone'))}</p>`}
        <form class="my-form" id="my-link-new"><input id="my-link-t" maxlength="200" placeholder="${esc(t('myLinkT'))}" aria-label="${esc(t('myLinkT'))}"><input id="my-link-u" maxlength="500" placeholder="${esc(location.origin)}/catalog/…" aria-label="${esc(t('myLinkU'))}" required><button class="btn sm" type="submit">${esc(t('myLinkAdd'))}</button></form></section>
      <section class="panel my-sec"><h2 class="h4">${tzIc('i-search')}${esc(t('myHist'))}</h2>
        ${qs.length ? `<ul class="chips my-q">${qs.map(x => `<li><a class="chip" href="${esc(x.href)}">${esc(x.q)}</a></li>`).join('')}</ul>` : `<p class="muted">${esc(t(qoff ? 'myHistOff' : 'myHistNone'))}</p>`}
        <p class="btn-row"><label class="my-chk"><input type="checkbox" data-my-qoff${qoff ? ' checked' : ''}> ${esc(t('myHistStop'))}</label>${qs.length ? `<button type="button" class="btn ghost sm" data-act="my-qclear">${esc(t('myHistClear'))}</button>` : ''}</p></section>
      <section class="panel my-sec"><h2 class="h4">${tzIc('i-shield')}${esc(t('myWhere'))}</h2><p class="muted">${esc(t('myWhereT'))}</p>
        <p class="btn-row"><button type="button" class="btn ghost sm" data-act="my-export">${tzIc('i-download')}${esc(t('myExport'))}</button><label class="btn ghost sm"><input type="file" class="sr" accept="application/json,.json" data-my-import>${esc(t('myImport'))}</label></p></section>`;
    this.badge();
  },
  /* рекомендации (ТЗ 8.4): по истории поиска и избранному — темы, места и слова запросов; открытые документы и выставки,
     которых ещё нет в избранном. Всё считается в браузере, на сервер ничего не уходит */
  recs(e) {
    const top = {}, pl = {}, words = new Set(), add = (o, k, w) => { if (k) o[k] = (o[k] || 0) + w; };
    for (const x of this.get('q', []).slice(0, 10)) { const p = SemQ.parse(x.q); add(top, p.top, 2); add(pl, p.pl, 2); p.words.forEach(w => { const s = SemQ.stem(norm(w)); if (s.length > 3) words.add(s); }); }
    const fav = new Set(Fav.ids());
    for (const id of fav) { const r = Cat.byId && Cat.byId.get(id); if (r) { (r.top || []).forEach(k => add(top, k, 1)); (r.pl || []).forEach(k => add(pl, k, 1)); } }
    if (!Object.keys(top).length && !Object.keys(pl).length && !words.size) return null;
    const score = r => (r.top || []).reduce((s, k) => s + (top[k] || 0), 0) + (r.pl || []).reduce((s, k) => s + (pl[k] || 0), 0) + [...words].filter(w => r._h && r._h.includes(w)).length * 2;
    const docs = (Cat.data || []).filter(r => !fav.has(r.id) && r.acc !== 'limited' && ['doc', 'photo', 'map', 'pub', 'av'].includes(r.k)).map(r => ({r, s:score(r)})).filter(o => o.s >= 3)
      .sort((a, b) => b.s - a.s || (b.r.img && b.r.img.length ? 1 : 0) - (a.r.img && a.r.img.length ? 1 : 0)).slice(0, 8).map(o => o.r);
    const ex = (Store.data.items || []).filter(x => x.type === 'expo').concat((e && e.items) || []).filter(x => Expo.hasCover(x)).map(x => ({x, s:(x.top || []).reduce((s, k) => s + (top[k] || 0), 0)})).filter(o => o.s > 0).sort((a, b) => b.s - a.s).slice(0, 3).map(o => o.x);
    const why = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => t(TOPIC_T[k])).concat(Object.entries(pl).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k));
    return {docs, ex, why};
  },
  badge() {   // число нового — у ссылки «Мой кабинет» в шапке
    const el = $('#my-new'); if (!el) return;
    const seen = this.get('seen', null), sub = this.get('sub', {news:true, expo:true}); if (!seen || !this.ex) { el.hidden = true; return; }
    const n = this.feed(this.ex).filter(x => !seen.includes(x.id) && sub[x.kind]).length;
    el.hidden = !n; el.textContent = n ? String(n) : '';
  },
  dump() { const o = {v:1, fav:Fav.ids()}; for (const k of ['cols', 'links', 'q', 'sub', 'seen', 'qoff']) o[k] = this.get(k, null); return o; },
  load(o) {
    if (!o || o.v !== 1) throw new Error('format');
    const strs = (a, n) => Array.isArray(a) ? a.filter(x => typeof x === 'string' && x.length < 300).slice(0, n) : [];
    const safeHref = h => typeof h === 'string' && /^(#|\/(?!\/))/.test(h) ? h.slice(0, 500) : null;
    LS.set('fav', strs(o.fav, 500));
    this.set('cols', (Array.isArray(o.cols) ? o.cols : []).filter(c => c && typeof c.n === 'string').slice(0, 100).map(c => ({id:String(c.id || Date.now()).slice(0, 40), n:c.n.slice(0, 80), ids:strs(c.ids, 500)})));
    this.set('links', (Array.isArray(o.links) ? o.links : []).map(l => l && safeHref(l.href) ? {href:safeHref(l.href), t:String(l.t || l.href).slice(0, 200), at:+l.at || 0} : null).filter(Boolean).slice(0, 200));
    this.set('q', (Array.isArray(o.q) ? o.q : []).map(x => x && typeof x.q === 'string' && safeHref(x.href) ? {q:x.q.slice(0, 200), href:safeHref(x.href), at:+x.at || 0} : null).filter(Boolean).slice(0, 30));
    if (o.sub && typeof o.sub === 'object') this.set('sub', {news:o.sub.news !== false, expo:o.sub.expo !== false});
    if (Array.isArray(o.seen)) this.set('seen', strs(o.seen, 5000));
    this.set('qoff', o.qoff === true);
  }
};
Object.assign(T, {
  myTitle:["Мой кабинет","Жеке кабинет","My space"], myShort:["Кабинет","Кабинет","My space"],
  myLead:["Избранные документы, свои подборки, сохранённые ссылки, история поиска и новое на сайте. Без регистрации: всё хранится только в этом браузере.","Таңдаулы құжаттар, өз жинақтарыңыз, сақталған сілтемелер, іздеу тарихы және сайттағы жаңалықтар. Тіркелусіз: бәрі тек осы браузерде сақталады.","Saved records, your own collections, saved links, search history and what is new. No sign-up: everything stays in this browser."],
  myNew:["Новое с прошлого визита","Соңғы кіруден бергі жаңалықтар","New since your last visit"], mySubNews:["Новости","Жаңалықтар","News"], mySubExpo:["Выставки","Көрмелер","Exhibitions"],
  mySeen:["Отметить как просмотренное","Қаралды деп белгілеу","Mark as seen"], myNoNew:["Ничего нового. Здесь появятся новости и выставки, вышедшие после вашего прошлого визита.","Жаңа ештеңе жоқ. Мұнда соңғы кіруіңізден кейін шыққан жаңалықтар мен көрмелер пайда болады.","Nothing new. News and exhibitions published after your last visit will appear here."],
  myRss:["Подписка через RSS (в любой программе для чтения новостей):","RSS арқылы жазылу (жаңалық оқитын кез келген бағдарламада):","Subscribe via RSS in any feed reader:"],
  myRecs:["Рекомендуем вам","Сізге ұсынамыз","Recommended for you"], myRecsWhy:["По вашим поискам и избранному:","Іздеулеріңіз бен таңдаулыларыңыз бойынша:","Based on your searches and saved records:"],
  myRecsNone:["Ищите в каталоге и отмечайте документы звёздочкой — здесь появятся похожие документы и выставки.","Каталогтан іздеп, құжаттарды жұлдызшамен белгілеңіз — мұнда ұқсас құжаттар мен көрмелер пайда болады.","Search the catalogue and star records: similar records and exhibitions will appear here."],
  myFav:["Избранное","Таңдаулылар","Saved records"], myFavNone:["Пока пусто. Отмечайте документы звёздочкой в каталоге:","Әзірге бос. Каталогта құжаттарды жұлдызшамен белгілеңіз:","Nothing yet. Star records in the catalogue:"], myRemove:["Убрать","Алып тастау","Remove"],
  myAddTo:["В подборку…","Жинаққа…","Add to collection…"], myNewCol:["+ новая подборка","+ жаңа жинақ","+ new collection"],
  myCols:["Мои подборки","Менің жинақтарым","My collections"], myColName:["Название подборки, например «Моя семья в документах»","Жинақ атауы, мысалы «Менің отбасым құжаттарда»","Collection name, e.g. “My family in the records”"], myColAdd:["Создать","Құру","Create"],
  myColEmpty:["Пусто. Добавляйте документы из избранного.","Бос. Таңдаулылардан құжаттар қосыңыз.","Empty. Add records from your saved list."], myColCopy:["Скопировать список ссылок","Сілтемелер тізімін көшіру","Copy list of links"], myColDel:["Удалить подборку","Жинақты жою","Delete collection"],
  myLinks:["Сохранённые ссылки","Сақталған сілтемелер","Saved links"], myLinksNone:["Пока пусто. Кнопка «В кабинет» есть на страницах выставок и людей «Архива памяти».","Әзірге бос. «Кабинетке» батырмасы көрмелер мен «Жад мұрағаты» адамдарының беттерінде бар.","Nothing yet. Use “Save” on exhibition and Memory archive person pages."],
  myLinkT:["Название","Атауы","Title"], myLinkU:["Адрес страницы этого сайта","Осы сайт бетінің мекенжайы","Address of a page on this site"], myLinkAdd:["Сохранить","Сақтау","Save"], myLinkBad:["Можно сохранить только страницу этого сайта","Тек осы сайттың бетін сақтауға болады","Only pages of this site can be saved"],
  mySave:["В кабинет","Кабинетке","Save"], mySaved:["Сохранено в «Мой кабинет»","«Жеке кабинетке» сақталды","Saved to My space"],
  myHist:["История поиска в каталоге","Каталогтағы іздеу тарихы","Catalogue search history"], myHistNone:["Пока пусто.","Әзірге бос.","Nothing yet."], myHistOff:["История не сохраняется.","Тарих сақталмайды.","History is not saved."],
  myHistStop:["Не сохранять историю","Тарихты сақтамау","Don't keep history"], myHistClear:["Очистить","Тазалау","Clear"],
  myWhere:["Где хранятся данные","Деректер қайда сақталады","Where the data is kept"], myWhereT:["Только в этом браузере на этом устройстве: на сервер архива ничего не передаётся. Чтобы перенести кабинет на другое устройство, скачайте файл и загрузите его там. Очистка данных браузера удалит кабинет.","Тек осы құрылғыдағы осы браузерде: мұрағат серверіне ештеңе жіберілмейді. Кабинетті басқа құрылғыға көшіру үшін файлды жүктеп алып, сонда жүктеңіз. Браузер деректерін тазалау кабинетті жояды.","Only in this browser on this device; nothing is sent to the archive's server. To move it to another device, download the file and load it there. Clearing browser data deletes it."],
  myExport:["Скачать файл кабинета","Кабинет файлын жүктеп алу","Download my data"], myImport:["Загрузить файл кабинета","Кабинет файлын жүктеу","Load my data"], myImported:["Кабинет загружен","Кабинет жүктелді","Loaded"], myImportBad:["Это не файл кабинета","Бұл кабинет файлы емес","Not a My space file"]
});
document.addEventListener('click', async e => {
  const b = e.target.closest && e.target.closest('[data-act^="my-"]'); if (!b) return;
  const a = b.dataset.act, v = b.dataset.v;
  if (a === 'my-save') { My.saveLink(v, b.dataset.t); toast(t('mySaved')); return; }
  if (a === 'my-seen') { My.set('seen', My.feed(My.ex).map(x => x.id)); }
  else if (a === 'my-unfav') { Fav.toggle(v); }
  else if (a === 'my-colrm') { My.set('cols', My.cols().map(c => c.id === v ? {...c, ids:c.ids.filter(x => x !== b.dataset.k)} : c)); My.open = v; }
  else if (a === 'my-coldel') { if (My.armed !== v) { My.armed = v; My.open = v; } else { My.set('cols', My.cols().filter(c => c.id !== v)); My.armed = null; } }
  else if (a === 'my-colcopy') { const c = My.cols().find(x => x.id === v); if (c) tzCopy([c.n].concat(c.ids.map(id => { const r = Cat.byId && Cat.byId.get(id); return (r ? LK(r.t) + ' — ' : '') + location.origin + '/catalog/' + encodeURIComponent(id); })).join('\n'), t('cLinkCopied')); return; }
  else if (a === 'my-linkrm') { const l = My.get('links', []); l.splice(+v, 1); My.set('links', l); }
  else if (a === 'my-qclear') { My.set('q', []); }
  else if (a === 'my-export') { TZA.download('moy-kabinet-arhiv-vko.json', JSON.stringify(My.dump(), null, 1), 'application/json'); return; }
  else return;
  My.render();
});
document.addEventListener('change', async e => {
  const el = e.target; if (!el.closest || !el.closest('#my-root')) return;
  if (el.dataset.mySub) { const s = My.get('sub', {news:true, expo:true}); s[el.dataset.mySub] = el.checked; My.set('sub', s); My.render(); }
  else if (el.hasAttribute('data-my-qoff')) { My.set('qoff', el.checked); if (el.checked) My.set('q', []); My.render(); }
  else if (el.dataset.myAddto != null && el.value) {
    let cols = My.cols(), id = el.value;
    if (id === '+') { const n = (prompt(t('myColName')) || '').trim().slice(0, 80); if (!n) { el.value = ''; return; } id = 'c' + Date.now().toString(36); cols = cols.concat({id, n, ids:[]}); }
    My.set('cols', cols.map(c => c.id === id && !c.ids.includes(el.dataset.myAddto) ? {...c, ids:c.ids.concat(el.dataset.myAddto)} : c)); My.open = id; toast(t('saved')); My.render();
  } else if (el.hasAttribute('data-my-import') && el.files && el.files[0]) {
    try { My.load(JSON.parse(await el.files[0].text())); toast(t('myImported')); } catch (er) { toast(t('myImportBad')); }
    My.render();
  }
});
document.addEventListener('submit', e => {
  const f = e.target; if (f.id !== 'my-col-new' && f.id !== 'my-link-new') return; e.preventDefault();
  if (f.id === 'my-col-new') { const n = $('#my-col-n').value.trim().slice(0, 80); if (!n) return; const id = 'c' + Date.now().toString(36); My.set('cols', My.cols().concat({id, n, ids:[]})); My.open = id; }
  else {
    let u = $('#my-link-u').value.trim(); const tt = $('#my-link-t').value.trim();
    try { if (/^https?:\/\//i.test(u)) { const x = new URL(u); if (x.origin !== location.origin) throw 0; u = x.pathname + x.search + x.hash; } } catch (er) { toast(t('myLinkBad')); return; }
    if (!/^(#|\/(?!\/))/.test(u)) { toast(t('myLinkBad')); return; }
    My.saveLink(u.slice(0, 500), tt || u);
  }
  My.render();
});
Store.on(() => { if (My.ex) My.badge(); else if (My.get('seen', null) && !My.exLoading) { My.exLoading = true; TZD.get('expo').then(e => { My.ex = e; My.badge(); }).catch(() => {}); } });

/* обезличенная статистика: какие разделы открывают и какие запросы ничего не нашли (без адресов и имён) */
const Stat = {
  q: [], t: 0,
  push(kind, v) {
    if (IN_PREVIEW || !/^https?:$/.test(location.protocol)) return;
    this.q.push({k:kind, v:String(v || '').slice(0, 120), l:lang}); clearTimeout(this.t);
    this.t = setTimeout(() => { const b = this.q.splice(0, 40); fetch('/api/stat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({e:b}), keepalive:true}).catch(() => {}); }, 1500);
  }
};

/* ---------- смысловой поиск: тема, период, место, тип; синонимы и казахские/русские варианты ---------- */
const SemQ = {
  syn: [
    [/фото|фотк|фоточк|снимк|сурет|картинк|photo|picture/, {k:'photo'}],
    [/карт[аыу]\b|карты|план\b|схем|чертеж|чертёж|карта|map|drawing/, {k:'map'}],
    [/видео|фильм|кино|бейне|video|film/, {k:'av'}],
    [/публикац|стать|доклад|мақала|жарияла|article|publication/, {k:'pub'}],
    [/личн\w* фонд|фондообраз|жеке қор|personal (fond|papers)/, {k:'pers'}],
    [/фонд|қор\b|қорлар|fond/, {k:'fond'}],
    [/опис[ьи]|тізімдеме|inventor/, {k:'inv'}],
    [/\bдел[оа]\b|іс\b|file/, {k:'file'}],
    [/документ|құжат|рассекреч|document|declass/, {k:'doc'}]
  ],
  topics: {
    war:/войн|вов|фронт|воен|солдат|герой советского|победа|соғыс|майдан|ардагер|war|soldier|front/,
    industry:/завод|комбинат|фабрик|промышлен|рудник|металлург|гэс|өнеркәсіп|зауыт|industr|factory|plant|mine/,
    edu:/школ|образован|учител|институт|мектеп|білім|мұғалім|school|educat|teacher/,
    culture:/культур|театр|музе|художн|искусств|мәдениет|өнер|театр|culture|theatre|museum|art/,
    people:/люди|личност|биограф|героя|почетн|адам|тұлға|өмірбаян|people|biograph/,
    city:/усть-каменогорск|уст-каменогорск|устькаменогорск|өскемен|оскемен|ust-?kamenogorsk|oskemen/,
    repress:/репресс|реабилит|қуғын|repress/, sport:/спорт|sport/, nature:/природ|табиғат|nature|landscape/,
    family:/генеалог|предк|родослов|семь|ата-баба|шежіре|отбасы|ancest|family|genealog/, org:/исполком|акимат|совет|комитет|управлени|әкімдік|organi[sz]ation/
  },
  places: [['Усть-Каменогорск', /усть-каменогорск|өскемен|оскемен|ust-?kamenogorsk|oskemen/], ['Риддер', /риддер|лениногорск|ridder/], ['Алтай (Зыряновск)', /зырянов|алтай\b|altai/],
    ['Зайсан', /зайсан|zaisan|zaysan/], ['Семей', /семей|семипалатинск|semey/], ['Шемонаиха', /шемонаих/], ['Глубокое', /глубок/], ['Курчум', /курчум|күршім/], ['Катон-Карагай', /катон/], ['Кокпекты', /кокпект|көкпекті/], ['Тарбагатай', /тарбагат/], ['Уланский район', /уланск/], ['Серебрянск', /серебрянск/]],
  parse(raw) {
    let q = ' ' + String(raw || '').toLowerCase().replace(/ё/g, 'е') + ' ';
    const out = {words:[], k:null, top:null, pl:null, y0:null, y1:null, notes:[]};
    // век: «XIX век», «19 век»
    const rom = {xvii:17, xviii:18, xix:19, xx:20, xxi:21};
    q = q.replace(/\b(xvii|xviii|xix|xx|xxi|1[7-9]|2[01])\s*(?:век|ғасыр|century)\w*/g, (m, v) => { const c = rom[v] || +v; out.y0 = (c - 1) * 100 + 1; out.y1 = c * 100; return ' '; });
    // десятилетие: «1960-х», «60-х годов», «1960-шы жылдар», «1960s»
    q = q.replace(/\b(1[6-9]\d0|20[0-2]0)\s*(?:-?х|-?е|-?ых|s|-?шы|-?ші|-?жылдар)\w*/g, (m, y) => { out.y0 = +y; out.y1 = +y + 9; return ' '; });
    q = q.replace(/\b([2-9]0)\s*-?(?:х|ых|е)\s*(?:годов|гг|г\.)?/g, (m, y) => { out.y0 = 1900 + +y; out.y1 = 1909 + +y; return ' '; });
    // диапазон и год
    q = q.replace(/\b(1[6-9]\d\d|20[0-2]\d)\s*[-–—]\s*(1[6-9]\d\d|20[0-2]\d)\b/g, (m, a, b) => { out.y0 = +a; out.y1 = +b; return ' '; });
    q = q.replace(/\b(?:в|году|года|жылы|in)?\s*(1[6-9]\d\d|20[0-2]\d)\s*(?:году|года|г\.|гг|жылы|ж\.)?/g, (m, y) => { if (!out.y0) { out.y0 = +y; out.y1 = +y; } return ' '; });
    const cut = rx => { q = q.replace(new RegExp('[^\\s]*(?:' + rx.source + ')[^\\s]*', 'g'), ' '); };   // убираем слово целиком, а не только совпавший корень
    if (/великой отечественной|вов\b|ұлы отан|great patriotic/.test(q)) { if (!out.y0) { out.y0 = 1941; out.y1 = 1945; } if (!out.top) out.top = 'war'; cut(/великой|отечественн|вов\b|ұлы|отан\w*|great|patriotic/); }
    for (const [rx, v] of this.syn) if (rx.test(q)) { if (!out.k) out.k = v.k; cut(rx); }
    for (const [k, rx] of Object.entries(this.topics)) if (rx.test(q)) { if (k === 'city') { if (!out.pl) out.pl = 'Усть-Каменогорск'; } else if (!out.top) out.top = k; cut(rx); }
    for (const [name, rx] of this.places) if (rx.test(q)) { if (!out.pl) out.pl = name; cut(rx); }
    const stop = /^(в|во|на|и|по|о|об|из|за|для|с|со|к|у|от|до|года|годов|годы|гг|архив[а-яёa-z]*|найти|найди|найдите|покажи|покажите|нужн[а-яёa-z]*|все|всё|какие|есть|ли|the|of|in|and|for|мне|про|жылдардағы|жылғы|туралы|және|мен)$/;   // \w не видит кириллицу: «архивные» оставалось словом поиска
    out.words = q.split(/[^a-zа-яәғқңөұүһі0-9\-]+/i).map(w => w.trim()).filter(w => w.length > 1 && !stop.test(w));
    return out;
  },
  stem(w) { return w.length > 5 ? w.replace(/(ами|ями|ого|его|ому|ему|ыми|ими|ах|ях|ов|ев|ей|ий|ый|ой|ая|яя|ое|ее|ые|ие|ую|юю|ом|ем|ам|ям|ы|и|а|я|е|о|у|ю|ь|лар|лер|дар|дер|тар|тер|ның|нің|дың|дің|тың|тің)$/, '') : w; },
  hint(p) {
    const parts = [];
    if (p.k) parts.push(t(KIND_T[p.k]));
    if (p.top) parts.push(t(TOPIC_T[p.top]));
    if (p.pl) parts.push(p.pl);
    if (p.y0) parts.push(yRange(p.y0, p.y1));
    if (p.words.length) parts.push('«' + p.words.join(' ') + '»');
    return parts;
  },
  suggest(p) {
    const s = [];
    const place = p.pl || 'Усть-Каменогорск';
    if (p.k !== 'photo') s.push(lang === 'kz' ? `${p.y0 ? p.y0 + ' жылдардағы ' : ''}${place} фотосуреттері` : `фотографии ${place}${p.y0 ? ' ' + p.y0 + '-х' : ''}`);
    if (p.top !== 'war') s.push(lang === 'kz' ? 'Ұлы Отан соғысы құжаттары' : 'документы Великой Отечественной войны');
    if (p.k !== 'pers') s.push(lang === 'kz' ? 'жеке қорлар' : 'личные фонды');
    if (p.k !== 'map') s.push(lang === 'kz' ? 'карталар мен жоспарлар' : 'карты и планы');
    return s.slice(0, 3);
  }
};
const LK = x => { if (x == null) return ''; if (typeof x === 'object' && !Array.isArray(x)) return x[lang === 'kz' ? 'kk' : lang] || x.kz || x.ru || ''; return L(x); };

/* ================= электронный каталог ================= */
const Cat = {
  data: null, byId: null, st: {}, lastList: '#catalog', per: 20,
  fields: ['q', 'k', 'tt', 'f', 'o', 'd', 'y0', 'y1', 'au', 'top', 'pl', 'kw', 'a', 's', 'p', 'fav', 'adv'],
  load() {
    return TZD.get('catalog').then(j => {
      if (this.data) return this.data;
      const extra = (Store.data.items || []).filter(x => x && x.type === 'catalog' && x.id && x.k);   // опубликованные сотрудниками через админку
      const items = j.items.concat(extra.map(x => ({...x, staff:true})));
      items.forEach(r => {
        if (Array.isArray(r.files) && !r._fx) {   // цифровые копии из админки: сканы — в просмотрщик (облегчённые копии), PDF — отдельным блоком
          r._fx = 1; const sc = r.files.filter(f => f.k === 'img' && f.v !== 0).map(f => '/files/' + f.id + '/view');
          if (sc.length) r.img = (r.img || []).concat(sc);
          r.pdfs = r.files.filter(f => f.k === 'pdf');
        }
        r._t = norm([LK(r.t), r.t && r.t.ru].join(' '));
        r._h = norm([LK(r.t), r.t && r.t.ru, r.ds, r.nt, r.c, r.au, r.col, r.gr, (r.pl || []).join(' '), (r.top || []).map(x => T[TOPIC_T[x]] ? T[TOPIC_T[x]].join(' ') : '').join(' '), r.tx ? r.tx.slice(0, 4000) : ''].join(' '));
        r._y = r.y0 || r.y1 || 0;
      });
      this.data = items; this.arch = j.arch || {}; this.byId = new Map(items.map(r => [r.id, r]));
      this.kids = new Map(); items.forEach(r => { if (r.par) { if (!this.kids.has(r.par)) this.kids.set(r.par, []); this.kids.get(r.par).push(r); } });
      return items;
    });
  },
  kindOf(r) { return r.k; },
  archName(a) { const n = {gavko:['Государственный архив ВКО', 'ШҚО мемлекеттік архиві', 'State Archive of EKR'], uka:['Усть-Каменогорский филиал по личному составу', 'Жеке құрам бойынша Өскемен филиалы', 'Ust-Kamenogorsk personnel records branch'], ridder:['Риддерский филиал', 'Риддер филиалы', 'Ridder branch'], zirian:['Филиал Алтай', 'Алтай филиалы', 'Altai branch'], zaisan:['Зайсанский филиал', 'Зайсан филиалы', 'Zaisan branch']}[a]; return n ? L(n) : ((this.arch || {})[a] || ((allPlaces().find(x => (x.arch || x.key) === a) || {}).name) || a || ''); },
  accName(a) { return t(a === 'declass' ? 'aDeclass' : a === 'limited' ? 'aLimited' : 'aOpen'); },
  parseQS(qs) {
    const st = {}; new URLSearchParams(qs || '').forEach((v, k) => { if (this.fields.includes(k) && v) st[k] = v; });
    if (GEO_TOP.includes(st.top)) { if (st.top === 'city' && !st.pl) st.pl = 'Усть-Каменогорск'; delete st.top; }   // старые ссылки «тема=город» читаем как место
    return st;
  },
  toQS(st) { const u = new URLSearchParams(); this.fields.forEach(k => { if (st[k]) u.set(k, st[k]); }); const s = u.toString(); return s ? '?' + s : ''; },
  go(st, replace) { const h = '#catalog' + this.toQS(st); if (replace) { try { history.replaceState(null, '', h); } catch (e) {} this.route('', h.split('?')[1] || ''); } else location.hash = h; },
  matchKind(r, k) { return k === 'org' ? r.k === 'fond' && r.sub === 'org' || r.k !== 'fond' && false : k === 'pers' ? r.k === 'fond' && r.sub === 'pers' : r.k === k; },
  filter(st, opts = {}) {
    const p = SemQ.parse(st.q || '');
    const useSem = opts.sem !== false;
    const k = st.k || (useSem ? p.k : null), top = st.top || (useSem ? p.top : null), pl = st.pl || (useSem ? p.pl : null);
    const y0 = +st.y0 || (useSem ? p.y0 : 0) || 0, y1 = +st.y1 || (useSem ? p.y1 : 0) || 0;
    const words = (useSem ? p.words : norm(st.q || '').split(/\s+/).filter(Boolean)).map(w => SemQ.stem(norm(w))).filter(Boolean);
    const tt = norm(st.tt || '').split(/\s+/).filter(Boolean).map(w => SemQ.stem(w));
    const kw = norm(st.kw || '').split(/[\s,;]+/).filter(Boolean).map(w => SemQ.stem(w));
    const au = norm(st.au || ''); const fav = st.fav ? new Set(Fav.ids()) : null;
    const res = [];
    for (const r of this.data) {
      if (fav && !fav.has(r.id)) continue;
      if (k && !this.matchKind(r, k)) continue;
      if (st.a && r.a !== st.a) continue;
      if (st.f && String(r.f || '') !== String(st.f).trim()) continue;
      if (st.o && String(r.o || '') !== String(st.o).trim()) continue;
      if (st.d && String(r.d || '') !== String(st.d).trim()) continue;
      if (top && !(r.top || []).includes(top)) continue;
      if (pl && !(r.pl || []).includes(pl)) continue;
      if (y0 || y1) { const a = r.y0 || r.y1, b = r.y1 || r.y0; if (!a) continue; if (y1 && a > y1) continue; if (y0 && b < y0) continue; }
      if (au && !norm([r.au, r.col].join(' ')).includes(au)) continue;
      let sc = 0, ok = true;
      for (const w of tt) { if (!r._t.includes(w)) { ok = false; break; } sc += 3; }
      if (!ok) continue;
      for (const w of kw) { if (!r._h.includes(w)) { ok = false; break; } sc += 1; }
      if (!ok) continue;
      for (const w of words) { const inT = r._t.includes(w); if (!inT && !r._h.includes(w)) { ok = false; break; } sc += inT ? 3 : 1; }
      if (!ok) continue;
      if (r.img) sc += .3; if (r.k === 'doc') sc += .5;
      res.push([sc, r]);
    }
    const s = st.s || 'rel';
    const cmpY = (a, b) => (a[1]._y || 9999) - (b[1]._y || 9999);
    if (s === 'new') res.sort((a, b) => (b[1]._y || 0) - (a[1]._y || 0));
    else if (s === 'old') res.sort(cmpY);
    else if (s === 'title') res.sort((a, b) => LK(a[1].t).localeCompare(LK(b[1].t), 'ru'));
    else if (s === 'code') res.sort((a, b) => String(a[1].a || '').localeCompare(String(b[1].a || '')) || (+a[1].f || 1e9) - (+b[1].f || 1e9) || String(a[1].o || '').localeCompare(String(b[1].o || ''), 'ru', {numeric:true}) || String(a[1].d || '').localeCompare(String(b[1].d || ''), 'ru', {numeric:true}));
    else if (words.length || tt.length || kw.length) res.sort((a, b) => b[0] - a[0] || cmpY(a, b));
    else res.sort((a, b) => KINDS.indexOf(a[1].k) - KINDS.indexOf(b[1].k) || cmpY(a, b));
    return {list:res.map(x => x[1]), p, eff:{k, top, pl, y0, y1, words}};
  },
  route(rest, qs) {
    const root = $('#cat-root'); if (!root) return;
    if (!this.data) {
      root.innerHTML = `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
      this.load().then(() => this.route(rest, qs)).catch(() => { root.innerHTML = `<p class="note">${tzIc('i-info')}<span>${esc(t('catFail'))}</span></p>`; });
      return;
    }
    if (rest) { this.card(decodeURIComponent(rest)); return; }
    this.st = this.parseQS(qs); this.lastList = '#catalog' + this.toQS(this.st);
    if (this.st.q) My.addQ(this.lastList, this.st.q);   // история поиска — только в браузере посетителя
    this.renderList();
  },
  optList(pairs, cur) { return pairs.map(([v, l]) => `<option value="${esc(v)}"${String(cur || '') === String(v) ? ' selected' : ''}>${esc(l)}</option>`).join(''); },
  renderList() {
    const st = this.st, root = $('#cat-root');
    const {list, p, eff} = this.filter(st);
    let note = '';
    let shown = list;
    if (!list.length && st.q && !st.k && !st.top && !st.pl && !st.y0) {   // смысловые фильтры ничего не дали — ищем просто по словам
      const r2 = this.filter(st, {sem:false}); if (r2.list.length) { shown = r2.list; note = 'relaxed'; }
    }
    if (st.q) Stat.push(shown.length ? 'search' : 'search0', st.q);
    const pages = Math.max(1, Math.ceil(shown.length / this.per)), pg = Math.min(pages, Math.max(1, +st.p || 1));
    const counts = {}; KINDS.forEach(k => { counts[k] = 0; });
    const base = this.filter({...st, k:''}, {sem:true}).list;
    base.forEach(r => { counts[r.k] = (counts[r.k] || 0) + 1; if (r.k === 'fond') counts[r.sub === 'pers' ? 'pers' : 'org']++; });
    const hint = SemQ.hint({...p, k:eff.k, top:eff.top, pl:eff.pl, y0:eff.y0, y1:eff.y1});
    const topics = Object.keys(TOPIC_T).filter(k => !GEO_TOP.includes(k)), places = SemQ.places.map(x => x[0]);
    const arches = ['gavko', 'uka', 'ridder', 'zirian', 'zaisan'];
    const FL = {tt:'fTitle', f:'fFond', o:'fInv', d:'fFile', au:'fAuthor', kw:'fKw', pl:'fPlace'};
    const actv = [];
    if (st.k) actv.push(['k', KIND_T[st.k] ? t(KIND_T[st.k]) : st.k]);
    if (st.top) actv.push(['top', TOPIC_T[st.top] ? t(TOPIC_T[st.top]) : st.top]);
    if (st.a) actv.push(['a', this.archName(st.a)]);
    if (st.y0 || st.y1) actv.push(['per', [st.y0, st.y1].filter(Boolean).join('–')]);
    Object.keys(FL).forEach(k => { if (st[k]) actv.push([k, t(FL[k]) + ': ' + st[k]]); });
    if (st.fav) actv.push(['fav', t('fFav')]);
    const chips = (act, items, on) => items.map(([v, l, n]) => `<button type="button" class="chip" data-act="${act}" data-v="${esc(v)}" aria-pressed="${on(v)}">${esc(l)}${n != null ? ` <small>${n}</small>` : ''}</button>`).join('');
    const grp = (h, body) => `<div class="cat-grp"><p class="cat-grp-h">${esc(h)}</p><div class="chips">${body}</div></div>`;
    const exactOpen = ['tt', 'f', 'o', 'd', 'au', 'kw', 'pl'].some(k => st[k]);
    root.innerHTML = `
      <form class="cat-form" id="cat-form" role="search">
        <div class="cat-bar"><label for="cat-q" class="sr">${esc(t('catTitle'))}</label>${tzIc('i-search')}
          <input id="cat-q" name="q" type="search" value="${esc(st.q || '')}" placeholder="${esc(t('catQ'))}" autocomplete="off" enterkeyhint="search">
          <button class="btn" type="submit">${esc(t('catFind'))}</button></div>
        <div class="cat-tools">
          <button type="button" class="btn ghost sm" data-act="cat-adv" aria-expanded="${st.adv ? 'true' : 'false'}" aria-controls="cat-advbox">${tzIc('i-filter')}<span>${esc(t('fFilters'))}</span>${actv.length ? `<b class="cat-badge">${actv.length}</b>` : ''}</button>
          <p class="cat-n" id="cat-n" aria-live="polite">${esc(fmt(t('catN'), {n:fmtInt(shown.length)}))}</p>
          <a class="cat-how" href="#visitors/guide">${esc(t('catHow'))}</a>
        </div>
        ${actv.length ? `<div class="cat-act">${actv.map(([k, l]) => `<button type="button" class="chip on" data-act="cat-rm" data-v="${k}">${esc(l)} <span aria-hidden="true">×</span></button>`).join('')}<button type="button" class="cat-clear" data-act="cat-reset">${esc(t('catReset'))}</button></div>` : ''}
        <fieldset class="cat-panel" id="cat-advbox" aria-label="${esc(t('fFilters'))}"${st.adv ? '' : ' hidden'}>
          ${grp(t('fType'), chips('cat-k', [['', t('catAll'), base.length]].concat(KINDS.filter(k => counts[k]).map(k => [k, t(KIND_T[k]), counts[k]])), v => (st.k || '') === v))}
          ${grp(t('memPeriod'), chips('cat-per', PERIODS.map(([id, a, b, key]) => [a + '-' + b, t(key)]), v => { const [a, b] = v.split('-'); return +st.y0 === +a && +st.y1 === +b; }))}
          ${grp(t('fTopic'), chips('cat-top', topics.map(k => [k, t(TOPIC_T[k])]), v => st.top === v))}
          ${grp(t('fBranch'), chips('cat-arch', arches.map(a => [a, this.archName(a)]), v => st.a === v))}
          <div class="cat-row">
            <label class="cat-sel"><span>${esc(t('fSort'))}</span><select name="s" data-cat-auto>${this.optList([['rel', t('sRel')], ['new', t('sNew')], ['old', t('sOld')], ['title', t('sTitle')], ['code', t('sCode')]], st.s || 'rel')}</select></label>
            <label class="cat-chk"><input type="checkbox" name="fav" value="1" data-cat-auto${st.fav ? ' checked' : ''}> <span>${tzIc('i-star')} ${esc(t('fFav'))} (${Fav.ids().length})</span></label>
            <button type="button" class="cat-clear" data-act="cat-reset">${esc(t('catReset'))}</button>
          </div>
          <details class="cat-exact"${exactOpen ? ' open' : ''}><summary>${esc(t('fExact'))}</summary>
            <div class="cat-adv">
              <div class="field w2"><label for="cf-tt">${esc(t('fTitle'))}</label><input id="cf-tt" name="tt" value="${esc(st.tt || '')}"></div>
              <div class="field"><label for="cf-f">${esc(t('fFond'))}</label><input id="cf-f" name="f" inputmode="numeric" value="${esc(st.f || '')}"></div>
              <div class="field"><label for="cf-o">${esc(t('fInv'))}</label><input id="cf-o" name="o" value="${esc(st.o || '')}"></div>
              <div class="field"><label for="cf-d">${esc(t('fFile'))}</label><input id="cf-d" name="d" value="${esc(st.d || '')}"></div>
              <div class="field"><label for="cf-y0">${esc(t('fFrom'))}</label><input id="cf-y0" name="y0" inputmode="numeric" maxlength="4" value="${esc(st.y0 || '')}"></div>
              <div class="field"><label for="cf-y1">${esc(t('fTo'))}</label><input id="cf-y1" name="y1" inputmode="numeric" maxlength="4" value="${esc(st.y1 || '')}"></div>
              <div class="field"><label for="cf-pl">${esc(t('fPlace'))}</label><select id="cf-pl" name="pl"><option value="">${esc(t('fAny'))}</option>${this.optList(places.map(x => [x, x]), st.pl)}</select></div>
              <div class="field w2"><label for="cf-au">${esc(t('fAuthor'))}</label><input id="cf-au" name="au" value="${esc(st.au || '')}"></div>
              <div class="field w2"><label for="cf-kw">${esc(t('fKw'))}</label><input id="cf-kw" name="kw" value="${esc(st.kw || '')}"></div>
              <div class="cat-adv-go"><button class="btn" type="submit">${esc(t('catFind'))}</button></div>
            </div>
          </details>
          <input type="hidden" name="k" value="${esc(st.k || '')}"><input type="hidden" name="top" value="${esc(st.top || '')}"><input type="hidden" name="a" value="${esc(st.a || '')}">
        </fieldset>
      </form>
      ${hint.length && st.q ? `<p class="cat-under"><span>${esc(t('catUnder'))}</span> ${hint.map(h => `<b>${esc(h)}</b>`).join(' · ')}${note ? ` <span class="muted">(${esc(lang === 'kz' ? 'сөздер бойынша' : lang === 'en' ? 'by words only' : 'показано по словам')})</span>` : ''}</p>` : ''}
      <div class="cat-layout">
        <div class="cat-main">
          ${shown.length ? `<ol class="cat-res">${shown.slice((pg - 1) * this.per, pg * this.per).map(r => this.item(r)).join('')}</ol>` : `<p class="note">${tzIc('i-info')}<span>${esc(t(st.fav ? 'favEmpty' : 'catNone'))}</span></p>`}
          ${pages > 1 ? `<nav class="cat-pg" aria-label="${esc(fmt(t('pgOf'), {i:pg, n:pages}))}">
            <button type="button" class="btn ghost sm" data-act="cat-page" data-v="${pg - 1}"${pg <= 1 ? ' disabled' : ''}>${esc(t('pgPrev'))}</button>
            <span>${esc(fmt(t('pgOf'), {i:pg, n:pages}))}</span>
            <button type="button" class="btn ghost sm" data-act="cat-page" data-v="${pg + 1}"${pg >= pages ? ' disabled' : ''}>${esc(t('pgNext'))}</button></nav>` : ''}
          ${st.q ? `<p class="cat-try"><span>${esc(t('catTry'))}</span> ${SemQ.suggest(p).map(s => `<button type="button" class="chip" data-act="cat-try" data-v="${esc(s)}">${esc(s)}</button>`).join(' ')}</p>` : ''}
        </div>
      </div>`;
  },
  thumb(r) {
    if (r.acc === 'limited') return `<span class="cat-th cat-lock">${tzIc('i-shield')}</span>`;
    if (r.img && r.img[0]) return `<span class="cat-th"><img src="${esc(tzImg(r.img[0]))}" alt="" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('noimg');this.remove()"></span>`;
    if (r.yt) return `<span class="cat-th"><img src="https://i.ytimg.com/vi/${esc(r.yt)}/mqdefault.jpg" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg');this.remove()"></span>`;
    const ic = {fond:'i-box', inv:'i-list', file:'i-folder', doc:'i-doc', pub:'i-book', av:'i-play'}[r.k] || 'i-doc';
    return `<span class="cat-th ic-only">${tzIc(ic)}</span>`;
  },
  item(r) {
    const on = Fav.has(r.id);
    const kind = r.k === 'fond' ? t(r.sub === 'pers' ? 'kPers' : 'kOrg') : t(KIND_T[r.k]);
    const meta = [r.c, yRange(r.y0, r.y1) || r.dt, r.a ? this.archName(r.a) : ''].filter(Boolean);
    return `<li class="cat-it">${this.thumb(r)}<div class="cat-it-b"><span class="pill">${esc(kind)}</span>${r.acc === 'declass' || r.acc === 'limited' ? ` <span class="pill warn">${esc(this.accName(r.acc))}</span>` : ''}
      <a class="cat-it-t" href="#catalog/${encodeURIComponent(r.id)}">${esc(LK(r.t))}</a>
      <span class="cat-it-m">${meta.map(esc).join(' · ')}</span>${r.au && r.k !== 'fond' ? `<span class="cat-it-m">${esc(r.au)}</span>` : ''}</div>
      <button type="button" class="cat-star" data-act="cat-fav" data-v="${esc(r.id)}" aria-pressed="${on}" aria-label="${esc(t(on ? 'cFavOn' : 'cFav'))}" title="${esc(t(on ? 'cFavOn' : 'cFav'))}">${tzIc('i-star')}</button></li>`;
  },
  chain(r) { const out = []; let x = r; const seen = new Set(); while (x && x.par && !seen.has(x.par)) { seen.add(x.par); x = this.byId.get(x.par); if (x) out.unshift(x); } return out; },
  related(r) {
    const same = this.data.filter(x => x !== r && ((r.alb && x.alb === r.alb) || (r.f && x.f === r.f && x.a === r.a && x.k !== 'inv') || (r.src && x.src === r.src && x.k !== r.k)));
    const top = (r.top || [])[0];
    const more = top ? this.data.filter(x => x !== r && x.k === r.k && (x.top || []).includes(top) && !same.includes(x)) : [];
    const pool = same.slice(0, 4).concat(more.sort((a, b) => Math.abs((a._y || 0) - (r._y || 0)) - Math.abs((b._y || 0) - (r._y || 0))).slice(0, 6));
    return pool.slice(0, 6);
  },
  /* «Выставки по теме» (ТЗ 8.4): до трёх выставок с общими темами или из того же фотоальбома, что и запись; подгружаются после показа карточки */
  expoRel(r) {
    const tops = r.top || []; if (!tops.length && !r.alb) return;
    TZD.get('expo').then(e => {
      const box = $('#cat-expo-rel'); if (!box || box.dataset.for !== r.id) return;   // пока грузилось, посетитель мог уйти на другую карточку
      const extra = (Store.data.items || []).filter(x => x.type === 'expo').map(x => ({...x, kind:'doc'}));
      const list = extra.concat(e.items).filter(x => Expo.hasCover(x)).map(x => ({x, n:(x.top || []).filter(k => tops.includes(k)).length + (r.alb && x.alb === r.alb ? 10 : 0)})).filter(o => o.n)
        .sort((a, b) => b.n - a.n || Math.abs((a.x.y0 || 0) - (r._y || 0)) - Math.abs((b.x.y0 || 0) - (r._y || 0))).slice(0, 3).map(o => o.x);
      if (!list.length) return;
      box.innerHTML = `<h3>${esc(t('cExpoRel'))}</h3><ul class="expo-grid">${list.map(x => Expo.cardHTML(x)).join('')}</ul>`; box.hidden = false;
    }).catch(er => console.warn('expoRel', er && er.message || er));
  },
  card(id) {
    const r = this.byId.get(id), root = $('#cat-root');
    if (!r) { root.innerHTML = `<p class="note">${tzIc('i-info')}<span>${esc(t('catNone'))}</span></p><p><a href="#catalog">${esc(t('cBack'))}</a></p>`; return; }
    Stat.push('card', r.k);
    const on = Fav.has(r.id), no = `<span class="muted">${esc(t('cNo'))}</span>`;
    const kind = r.k === 'fond' ? t(r.sub === 'pers' ? 'kPers' : 'kOrg') : t(KIND_T[r.k]);
    const row = (k, v) => `<div><dt>${esc(t(k))}</dt><dd>${v || no}</dd></div>`;
    const chain = this.chain(r), kids = (this.kids.get(r.id) || []).slice(0, 60);
    const imgs = r.img || [];
    this.pgImgs = imgs; this.pg = 0;   // листание страниц (сканов) внутри одной записи
    const album = r.alb ? this.data.filter(x => x.alb === r.alb).sort((a, b) => a.ai - b.ai) : [];
    const ai = album.indexOf(r);
    const prev = ai > 0 ? album[ai - 1] : null, next = ai >= 0 && ai < album.length - 1 ? album[ai + 1] : null;
    const cite = [r.c, r.l && !/Л\./.test(r.c || '') ? 'Л. ' + r.l : ''].filter(Boolean).join('. ');
    const docLang = r.lang === 'kk' ? 'Қазақша' : r.lang === 'ru' ? (lang === 'kz' ? 'Орыс тілі' : lang === 'en' ? 'Russian' : 'Русский') : '';
    root.innerHTML = `
      <p class="cat-back"><a href="${esc(this.lastList)}">${esc(t('cBack'))}</a></p>
      <article class="cat-card">
        <header class="cat-card-h">
          <p class="cat-card-k"><span class="pill">${esc(kind)}</span> <span class="pill ${r.acc === 'declass' || r.acc === 'limited' ? 'warn' : 'ok'}">${esc(this.accName(r.acc))}</span></p>
          <h2 class="cat-card-t" id="cat-card-t" tabindex="-1">${esc(LK(r.t))}</h2>
          ${r.c ? `<p class="cat-code"><span>${esc(t('cCode'))}:</span> <code>${esc(cite || r.c)}</code></p>` : ''}
          <div class="btn-row cat-acts">
            ${r.c ? `<button type="button" class="btn ghost sm" data-act="cat-copy" data-v="${esc(cite || r.c)}">${tzIc('i-copy')}${esc(t('cCopy'))}</button>` : ''}
            <button type="button" class="btn ghost sm" data-act="cat-share" data-v="${esc(LK(r.t))}">${tzIc('i-share')}${esc(t('cShare'))}</button>
            <button type="button" class="btn ghost sm cat-favbtn" data-act="cat-fav" data-v="${esc(r.id)}" aria-pressed="${on}">${tzIc('i-star')}<span>${esc(t(on ? 'cFavOn' : 'cFav'))}</span></button>
            ${r.src && PIDX.has(String(r.src)) ? `<a class="btn ghost sm" href="#p/${r.src}">${tzIc('i-book')}${esc(t('cOpen'))}</a>` : ''}
            ${r.url && r.acc !== 'limited' ? `<a class="btn ghost sm" href="${esc(r.url)}" download>${tzIc('i-download')}${esc(t('cDownload'))}</a>` : ''}
            ${r.tx || (r.src && PIDX.has(String(r.src))) ? `<button type="button" class="btn ghost sm" data-act="ai-sum" data-v="${esc(r.id)}">${tzIc('i-sparkle')}${esc(t('cAi'))}</button>` : ''}
          </div>
          <div class="ai-box" id="ai-box" hidden></div>
        </header>
        ${r.acc === 'limited' ? `<p class="note cat-lim">${tzIc('i-shield')}<span>${esc(t('cLimNote'))} <a href="#visitors/reading">${esc(t('cLimHow'))}</a></span></p>` : imgs.length ? this.viewer(r, imgs, prev, next, ai, album.length) : ''}
        ${r.acc !== 'limited' && (r.pdfs || []).length ? this.pdfHTML(r.pdfs) : ''}
        ${r.yt ? `<div class="cat-video"><button type="button" class="cat-yt" data-act="cat-yt" data-v="${esc(r.yt)}"><img src="https://i.ytimg.com/vi/${esc(r.yt)}/hqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="btn">${tzIc('i-play')}${esc(t('cWatch'))}</span></button><p class="muted"><a href="https://www.youtube.com/watch?v=${esc(r.yt)}" target="_blank" rel="noopener">YouTube ${tzIc('i-ext')}</a></p></div>` : ''}
        <dl class="cat-dl">
          ${row('cCode', r.c ? `<code>${esc(cite || r.c)}</code>` : '')}
          ${r.f ? row('cFond', esc(r.f)) : ''}${r.o ? row('cInv', esc(r.o)) : ''}${r.d ? row('cFileN', esc(r.d)) : ''}${r.l ? row('cSheets', esc(r.l)) : ''}${r.u ? row('cUnits', esc(r.u)) : ''}
          ${row(r.y0 && r.y1 && r.y0 !== r.y1 ? 'cPeriod' : 'cDate', esc(r.dt || yRange(r.y0, r.y1)))}
          ${row('cType', esc(kind) + (r.gr && r.k !== 'doc' ? ' · ' + esc(r.gr) : ''))}
          ${r.gr && r.k === 'doc' ? row('cGrif', esc(r.gr)) : ''}
          ${row('cLang', esc(docLang))}
          ${row('cStore', esc(r.a ? this.archName(r.a) : ''))}
          ${row('cAccess', esc(this.accName(r.acc)))}
          ${row('cDigital', esc(t(imgs.length || (r.pdfs || []).length || r.yt || r.tx || r.url ? 'cYes' : 'cNoCopy')))}
          ${r.au ? row('cAuthor', esc(r.au)) : ''}
          ${r.col ? row('cCol', esc(r.col)) : ''}
          ${(r.top || []).length ? row('cTopics', r.top.map(k => `<a href="#catalog?top=${k}">${esc(t(TOPIC_T[k]))}</a>`).join(', ')) : ''}
          ${(r.pl || []).length ? row('cPlaces', r.pl.map(x => `<a href="#catalog?pl=${encodeURIComponent(x)}">${esc(x)}</a>`).join(', ')) : ''}
        </dl>
        ${r.ds ? `<section class="cr-sec"><h3>${esc(t('cDesc'))}</h3><p>${esc(r.ds)}</p></section>` : ''}
        ${r.nt ? `<section class="cr-sec"><h3>${esc(t('cNote'))}</h3><p>${esc(r.nt)}</p></section>` : ''}
        ${r.tx ? `<section class="cr-sec"><h3>${esc(t('cText'))}</h3><div class="cat-tx">${esc(r.tx).replace(/\n/g, '<br>')}</div></section>` : ''}
        ${chain.length ? `<section class="cr-sec"><h3>${esc(t('cParent'))}</h3><ol class="cat-chain">${chain.map(x => `<li><a href="#catalog/${encodeURIComponent(x.id)}">${esc(LK(x.t))}</a> <small>${esc(x.c || '')}</small></li>`).join('')}</ol></section>` : ''}
        ${kids.length ? `<section class="cr-sec"><h3>${esc(t('cKids'))}</h3><ul class="cat-kids">${kids.map(x => `<li><a href="#catalog/${encodeURIComponent(x.id)}">${esc(LK(x.t))}</a> <small>${esc(x.c || '')}</small></li>`).join('')}</ul></section>` : ''}
        ${(r.refs || []).length ? `<section class="cr-sec"><h3>${esc(t('cRefs'))}</h3><ul class="cat-kids">${r.refs.map(x => { const pr = PIDX.get(String(x)); return pr ? `<li><a href="#p/${x}">${esc(pTitle(pr) || pr[1])}</a></li>` : ''; }).join('')}</ul></section>` : ''}
        ${cite ? `<section class="cr-sec"><h3>${esc(t('cCite'))}</h3><p class="cat-cite"><code>${esc(this.archName(r.a))}. ${esc(cite.replace(/^ГАВКО\.\s*/, ''))}.</code></p></section>` : ''}
        ${(() => { const rel = this.related(r); return rel.length ? `<section class="cr-sec"><h3>${esc(t('cSame'))}</h3><ol class="cat-res sm">${rel.map(x => this.item(x)).join('')}</ol></section>` : ''; })()}
        <section class="cr-sec" id="cat-expo-rel" data-for="${esc(r.id)}" hidden></section>
      </article>`;
    const h = $('#cat-card-t'); if (h && vtReady) h.focus({preventScroll:true});
    this.zoomInit(); this.expoRel(r);
  },
  viewer(r, imgs, prev, next, ai, n) {
    return `<figure class="cat-view" id="cat-view">
      <div class="cat-stage" id="cat-stage" tabindex="0" aria-label="${esc(LK(r.t))}"><img id="cat-img" src="${esc(tzImg(imgs[0]))}" alt="${esc(LK(r.t))}" draggable="false" onerror="this.closest('.cat-stage').classList.add('noimg')"><p class="cat-noimg">${esc(t('expoNoImg'))}</p></div>
      <div class="cat-vbar">
        <button type="button" class="hc-btn" data-act="cat-zoom" data-v="-1" aria-label="${esc(t('zOut'))}" title="${esc(t('zOut'))}">${tzIc('i-minus')}</button>
        <button type="button" class="hc-btn" data-act="cat-zoom" data-v="0" aria-label="${esc(t('zFit'))}" title="${esc(t('zFit'))}">${tzIc('i-fit')}</button>
        <button type="button" class="hc-btn" data-act="cat-zoom" data-v="1" aria-label="${esc(t('zIn'))}" title="${esc(t('zIn'))}">${tzIc('i-plus')}</button>
        ${n > 1 ? `<span class="cat-vsep"></span>
        ${prev ? `<a class="hc-btn" href="#catalog/${encodeURIComponent(prev.id)}" aria-label="${esc(t('pagePrev'))}" title="${esc(t('pagePrev'))}">${tzIc('i-arrow', 'flip')}</a>` : ''}
        <span class="cat-vn">${ai + 1} / ${n}</span>
        ${next ? `<a class="hc-btn" href="#catalog/${encodeURIComponent(next.id)}" aria-label="${esc(t('pageNext'))}" title="${esc(t('pageNext'))}">${tzIc('i-arrow')}</a>` : ''}` : ''}
        ${imgs.length > 1 ? `<span class="cat-vsep"></span>
        <button type="button" class="hc-btn" data-act="cat-pg" data-v="-1" aria-label="${esc(t('cPgPrev'))}" title="${esc(t('cPgPrev'))}">${tzIc('i-arrow', 'flip')}</button>
        <span class="cat-vn" id="cat-pgn" aria-live="polite">${esc(fmt(t('cPgN'), {i:1, n:imgs.length}))}</span>
        <button type="button" class="hc-btn" data-act="cat-pg" data-v="1" aria-label="${esc(t('cPgNext'))}" title="${esc(t('cPgNext'))}">${tzIc('i-arrow')}</button>` : ''}
        <a class="hc-btn" id="cat-dl" href="${esc(tzImg(imgs[0]))}" target="_blank" rel="noopener" aria-label="${esc(t('cDownload'))}" title="${esc(t('cDownload'))}">${tzIc('i-download')}</a>
      </div>
      ${r.col ? `<figcaption>${esc(t('cCol'))}: ${esc(r.col)}</figcaption>` : ''}
    </figure>`;
  },
  z: {s:1, x:0, y:0},
  zoomInit() {
    const st = $('#cat-stage'), img = $('#cat-img'); if (!st || !img) return;
    this.z = {s:1, x:0, y:0};
    const apply = () => { img.style.transform = `translate(${this.z.x}px, ${this.z.y}px) scale(${this.z.s})`; st.classList.toggle('zoomed', this.z.s > 1); };
    this.zApply = apply; apply();
    let drag = null;
    st.addEventListener('pointerdown', e => { if (this.z.s <= 1) return; drag = {x:e.clientX - this.z.x, y:e.clientY - this.z.y}; st.setPointerCapture(e.pointerId); });
    st.addEventListener('pointermove', e => { if (!drag) return; this.z.x = e.clientX - drag.x; this.z.y = e.clientY - drag.y; apply(); });
    st.addEventListener('pointerup', () => { drag = null; });
    st.addEventListener('wheel', e => { if (!e.ctrlKey && this.z.s === 1) return; e.preventDefault(); this.zoom(e.deltaY < 0 ? 1 : -1); }, {passive:false});
    st.addEventListener('dblclick', () => this.zoom(this.z.s > 1 ? 0 : 1));
    st.addEventListener('keydown', e => { if (e.key === '+' || e.key === '=') this.zoom(1); else if (e.key === '-') this.zoom(-1); else if (e.key === '0') this.zoom(0); });
  },
  zoom(d) { if (!this.zApply) return; if (d === 0) this.z = {s:1, x:0, y:0}; else { this.z.s = Math.max(1, Math.min(6, this.z.s * (d > 0 ? 1.5 : 1 / 1.5))); if (this.z.s === 1) { this.z.x = 0; this.z.y = 0; } } this.zApply(); }
};

/* ================= историческая карта региона (ТЗ 8.3) =================
   Два вида меток: населённые пункты, которые упоминаются в каталоге (число записей, примеры, переход в каталог),
   и объекты, которые добавляют сотрудники в «Архиве памяти» (здание, предприятие, наследие, место, событие).
   Метка населённого пункта стоит по его центру, координаты приблизительные; районы без одного центра на карту не ставим. */
const HM_CATS = ['building', 'industry', 'heritage', 'place', 'event'];
const HM_TOWNS = {'Усть-Каменогорск':[49.9483, 82.6275], 'Риддер':[50.3335, 83.5008], 'Алтай (Зыряновск)':[49.7278, 84.2620], 'Семей':[50.4111, 80.2275], 'Самарское':[49.03, 83.37],
  'Глубокое':[50.14, 82.31], 'Шемонаиха':[50.63, 81.91], 'Маркаколь':[48.75, 85.75], 'Большенарымское':[49.20, 84.51], 'Зайсан':[47.4685, 84.8746], 'Катон-Карагай':[49.17, 85.61],
  'Курчум':[48.57, 83.66], 'Серебрянск':[49.69, 83.29], 'Кокпекты':[48.76, 82.37], 'Аягоз':[47.97, 80.44], 'Бородулиха':[50.71, 80.93], 'Урджар':[47.09, 81.63], 'Курчатов':[50.76, 78.54]};
Object.assign(T, {
  memMap:["Карта","Карта","Map"], hmLead:["Места, которые упоминаются в архивных документах, и исторические объекты края. Нажмите на метку: описание, фото и ссылки на материалы.","Мұрағат құжаттарында аталатын жерлер және өлкенің тарихи нысандары. Белгіні басыңыз: сипаттама, фото және материалдарға сілтемелер.","Places mentioned in archival records and historic sites of the region. Click a marker for a description, photos and links."],
  hmAll:["Все","Барлығы","All"], hm_town:["Населённые пункты в документах","Құжаттардағы елді мекендер","Places in the records"], hm_building:["Исторические здания","Тарихи ғимараттар","Historic buildings"], hm_industry:["Промышленные предприятия","Өнеркәсіп орындары","Industrial sites"],
  hm_heritage:["Объекты культурного наследия","Мәдени мұра нысандары","Cultural heritage"], hm_place:["Исторические места","Тарихи орындар","Historic places"], hm_event:["Места значимых событий","Маңызды оқиғалар орындары","Sites of notable events"],
  hmTownN:["записей в каталоге: {n}","каталогтағы жазбалар: {n}","catalogue records: {n}"], hmOpenCat:["Все материалы в каталоге","Каталогтағы барлық материалдар","All records in the catalogue"], hmList:["Все метки списком","Барлық белгілер тізіммен","All markers as a list"],
  hmNote:["Метки населённых пунктов стоят по их центру, координаты приблизительные. Районы без одного центра на карту не вынесены — ищите их в каталоге по фильтру «Место».","Елді мекен белгілері олардың орталығында тұр, координаттар шамамен алынған. Бір орталығы жоқ аудандар картаға шығарылмаған — оларды каталогтан «Орны» сүзгісімен іздеңіз.","Place markers sit at the town centre; coordinates are approximate. Districts without a single centre are not mapped; use the Place filter in the catalogue."],
  hmKind:["Вид объекта","Нысан түрі","Kind of site"], hmNone:["Пока нет меток для этого фильтра","Бұл сүзгі үшін әзірге белгі жоқ","No markers for this filter yet"],
  aMemPlace:["Объект на исторической карте","Тарихи картадағы нысан","Historic map site"], aMemPlaceN:["Название объекта","Нысан атауы","Site name"], aMemLL:["Координаты: широта, долгота (из 2ГИС или Google Maps)","Координаттар: ендік, бойлық (2ГИС немесе Google Maps-тен)","Coordinates: latitude, longitude (from 2GIS or Google Maps)"], aMemYears:["Год (постройки, события)","Жылы (салынған, оқиға)","Year (built, event)"]
});
const hmPin = p => `<span class="pin2 hm-${p.kind === 'town' ? 'town' : esc(p.hc)}${p.kind !== 'town' || p.rs.length >= 20 ? ' hm-big' : ''}" data-pid="${esc(p.id)}"><svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 41S2 25.6 2 15.5a14 14 0 0 1 28 0C30 25.6 16 41 16 41z"/><circle cx="16" cy="15.5" r="5"/></svg><b>${esc(p.short)}</b></span>`;
const hmRel = ids => (ids || []).map(id => { const r = Cat.byId && Cat.byId.get(id); return `<li><a href="#catalog/${encodeURIComponent(id)}">${esc(r ? LK(r.t) : id)}</a></li>`; }).join('');
function hmPop(p) {
  if (p.kind === 'town') {
    const ph = p.rs.find(r => r.img && r.img.length);
    return `<div class="mpop"><b>${esc(p.n)}</b><span>${esc(fmt(t('hmTownN'), {n:p.rs.length}))}</span>${ph ? `<img class="hm-ph" src="${esc(ph.img[0])}" alt="" loading="lazy" onerror="this.remove()">` : ''}
      <ul class="hm-recs">${hmRel(p.rs.slice(0, 3).map(r => r.id))}</ul><a class="btn sm" href="#catalog?pl=${encodeURIComponent(p.n)}">${esc(t('hmOpenCat'))}</a></div>`;
  }
  return `<div class="mpop"><b>${esc(p.n)}</b><span>${esc(t('hm_' + p.hc))}${p.y ? ', ' + esc(String(p.y)) : ''}</span>${p.img ? `<img class="hm-ph" src="${esc(p.img)}" alt="${esc(p.n)}" loading="lazy" onerror="this.remove()">` : ''}
    ${p.d ? `<span class="hm-d">${esc(p.d.length > 320 ? p.d.slice(0, 317) + '…' : p.d)}</span>` : ''}${(p.rel || []).length ? `<ul class="hm-recs">${hmRel(p.rel)}</ul>` : ''}${p.srcT ? `<small>${esc(t('expoSrc'))}: ${esc(p.srcT)}</small>` : ''}</div>`;
}

/* ================= «Архив памяти»: хронология, люди, коллекции, шкала по десятилетиям ================= */
const Mem = {
  data: null, st: {}, fo: {},   // fo — какие панели фильтров открыты
  route(rest, qs) {
    const root = $('#mem-root'); if (!root) return;
    if (!this.data) {
      root.innerHTML = `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
      Promise.all([TZD.get('memory'), TZD.get('expo')]).then(([m, e]) => {
        const its = (Store.data.items || []).filter(x => x.type === 'memory');   // опубликованное сотрудниками: события и люди
        const hp = its.filter(x => x.mt === 'place' && x.lat != null && x.lon != null).map(x => ({id:x.id, kind:'obj', n:LK(x.t), short:LK(x.t), hc:HM_CATS.includes(x.hc) ? x.hc : 'place', lat:+x.lat, lon:+x.lon, y:x.y, d:LK(x.ds), img:x.img, srcT:x.srcT, rel:x.rel || []}));
        const ev = its.filter(x => (!x.mt || x.mt === 'event') && x.y).map(x => ({y:+x.y, t:LK(x.t), g:x.g || 'region', d:LK(x.ds), srcT:x.srcT, rel:x.rel || [], top:x.top || []}));
        const pp = its.filter(x => x.mt === 'person').map(x => ({id:x.id, n:LK(x.t), g:(x.gr || []).length ? x.gr : [t('memStaffG')], b0:x.b0, b1:x.b1, bio:LK(x.bio), img:x.img, srcT:x.srcT, fd:x.fd || [], top:x.top || [], pl:x.pl || []}));
        /* темы и места события (ТЗ 8.2: фильтр по тематике): у события из админки — отмеченные сотрудником,
           у перенесённых — по словам в тексте, теми же правилами, что и смысловой поиск каталога */
        const events = m.events.map(x => ({...x})).concat(ev).sort((a, b) => a.y - b.y);
        // корень должен начинать слово (иначе «архивов» попадает в «вов»); без двусмысленных корней вроде «образован» (= «создан»)
        const head = rx => new RegExp('^(?:' + rx.source + ')'), PH = SemQ.places.map(([n, rx]) => [n, head(rx)]);
        const TH = Object.entries({war:/войн|вов$|фронт|воен|солдат|соғыс|майдан|ардагер/, industry:/завод|комбинат|фабрик|промышлен|рудник|металлург|гэс$|өнеркәсіп|зауыт/,
          edu:/школ|учител|институт|университет|училищ|мектеп|мұғалім/, culture:/культур|театр|музе|художн|искусств|мәдениет|өнер/, people:/биограф|почетн|почётн/,
          repress:/репресс|реабилит|қуғын/, sport:/спорт/, nature:/природ|табиғат|заповедн/, family:/генеалог|родослов|шежіре/, org:/исполком|акимат|комитет|управлени|әкімдік/}).map(([k, rx]) => [k, head(rx)]);
        events.forEach(x => { const ws = String(x.t + ' ' + (x.d || '')).toLowerCase().replace(/ё/g, 'е').split(/[^a-zа-яәғқңөұүһі0-9\-]+/i).filter(Boolean);
          x.tops = (x.top || []).length ? x.top : TH.filter(([, rx]) => ws.some(w => rx.test(w))).map(([k]) => k);
          x.pls = PH.filter(([, rx]) => ws.some(w => rx.test(w))).map(([n]) => n); });
        /* места коллекций (выставок-фотоальбомов): по названию теми же правилами, что у событий; метка «город» у выставки — это Усть-Каменогорск */
        e.items.forEach(x => {
          const ws = [x.t && x.t.ru, x.t && x.t.kk].join(' ').toLowerCase().replace(/ё/g, 'е').split(/[^a-zа-яәғқңөұүһі0-9\-]+/i).filter(Boolean);
          x.pls = PH.filter(([, rx]) => ws.some(w => rx.test(w))).map(([n]) => n);
          if ((x.top || []).includes('city') && !x.pls.includes('Усть-Каменогорск')) x.pls.push('Усть-Каменогорск');
        });
        this.data = {...m, events, people:pp.concat(m.people), places:hp}; this.expo = e; this.route(rest, qs); })   // люди из админки — первыми
        .catch(() => { root.innerHTML = `<p class="note">${tzIc('i-info')}<span>${esc(t('catFail'))}</span></p>`; });
      return;
    }
    const [sec, id] = String(rest || '').split('/');
    this.st = Cat.parseQS(qs); this.lim = 240;
    const grp = new URLSearchParams(qs || '').get('g'); if (grp) this.st.g = grp;   // группа людей: в общих полях каталога её нет
    const hc = new URLSearchParams(qs || '').get('hc'); if (hc) this.st.hc = hc;     // вид меток на карте
    const pk = new URLSearchParams(qs || '').get('pk'); if (pk) this.st.pk = pk;     // публикации: статьи или доклады
    if (sec === 'person' && id) return this.person(id);
    this.home(sec || 'time');
  },
  tabs(cur) {
    const tb = [['time', 'memTime'], ['people', 'memPeople'], ['map', 'memMap'], ['cols', 'memCols'], ['pubs', 'memPubs']];
    return `<div class="tabs mem-tabs" role="tablist" aria-label="${esc(t('memTitle'))}">${tb.map(([id, k]) => `<a role="tab" href="#memory/${id}" aria-selected="${cur === id}"${cur === id ? ' aria-current="page"' : ''}>${esc(t(k))}</a>`).join('')}</div>`;
  },
  viz() {
    const d = this.data.dec || {}; const keys = Object.keys(d).filter(k => +k >= 1850).sort();
    const tot = k => Object.values(d[k]).reduce((a, b) => a + b, 0);
    const max = Math.max(1, ...keys.map(tot));
    return `<section class="mem-viz" aria-labelledby="mem-viz-h"><h2 class="h3" id="mem-viz-h">${esc(t('memViz'))}</h2><p class="muted">${esc(t('memVizHint'))}</p>
      <ol class="mem-bars">${keys.map(k => { const n = tot(k); const parts = Object.entries(d[k]).sort((a, b) => b[1] - a[1]).map(([kk, v]) => `${t(KIND_T[kk])}: ${v}`).join(', ');
        return `<li><a href="#catalog?y0=${k}&y1=${+k + 9}" title="${esc(k + '–' + (+k + 9) + ': ' + parts)}"><span class="mem-n" aria-hidden="true">${n}</span><span class="mem-bar" style="--h:${Math.max(4, Math.round(n / max * 100))}%"></span><span class="mem-dec">${k.slice(2)}<span class="sr">${esc(k + '–' + (+k + 9) + '. ' + parts)}</span></span></a></li>`; }).join('')}</ol></section>`;
  },
  /* материалы вкладки без фильтров периода, темы и места: по ним считаем, сколько найдётся при каждом выборе */
  pool(kind) {
    const m = this.data, q = norm(this.st.q || ''), g = this.st.g || '';
    if (kind === 'time') return m.events.map(e => ({y0:e.y, y1:e.y, top:e.tops || [], pl:e.pls || []}));
    if (kind === 'people') return m.people.filter(p => (!g || p.g.includes(g)) && (!q || norm(p.n).includes(q))).map(p => ({y0:p.b0, y1:p.b1 || p.b0, top:p.top || [], pl:p.pl || []}));
    return this.expo.items.filter(x => x.kind === 'photo' && Expo.hasCover(x)).map(x => ({y0:x.y0, y1:x.y1, top:x.top || [], pl:x.pls || []}));
  },
  /* Фильтры зависят друг от друга: у каждого пункта в скобках число найденных материалов при уже выбранных остальных фильтрах,
     пункты с нулём не показываются. Противоречивое сочетание («Усть-Каменогорск» + «Семей») выбрать нельзя. */
  filters(kind) {
    const st = this.st, topics = Object.keys(TOPIC_T).filter(k => !GEO_TOP.includes(k)), pool = this.pool(kind);
    const n = (per, top, pl) => pool.filter(r => this.inPer(r.y0, r.y1, per) && (!top || r.top.includes(top)) && (!pl || r.pl.includes(pl))).length;
    const opt = (v, label, cnt, sel) => !cnt && !sel ? '' : `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(label)} (${cnt})</option>`;   // пункты, при которых ничего не найдётся, не показываем
    return `<form class="mem-filters" data-mem-form="${kind}">
      <label class="cat-sel"><span>${esc(t('memPeriod'))}</span><select name="per" data-mem-auto><option value="">${esc(t('fAny'))}</option>${PERIODS.map(([id, a, b, key]) => opt(id, t(key), n(id, st.top, st.pl), st.per === id)).join('')}</select></label>
      <label class="cat-sel"><span>${esc(t('memTheme'))}</span><select name="top" data-mem-auto><option value="">${esc(t('fAny'))}</option>${topics.map(k => opt(k, t(TOPIC_T[k]), n(st.per, k, st.pl), st.top === k)).join('')}</select></label>
      <label class="cat-sel"><span>${esc(t('memPlace'))}</span><select name="pl" data-mem-auto><option value="">${esc(t('fAny'))}</option>${SemQ.places.map(x => opt(x[0], x[0], n(st.per, st.top, x[0]), st.pl === x[0])).join('')}</select></label>
    </form>`;
  },
  /* строка поиска остаётся на виду, остальные фильтры — под кнопкой «Фильтры» (открытость запоминается, пока вкладка не закрыта) */
  qbar(kind, ph) {
    return `<form class="mem-q cat-form" data-mem-form="${kind}" role="search"><label class="cat-bar"><span class="sr">${esc(ph)}</span>${tzIc('i-search')}<input type="search" name="q" value="${esc(this.st.q || '')}" placeholder="${esc(ph)}" autocomplete="off" enterkeyhint="search"></label></form>`;
  },
  active() {
    const st = this.st, a = [], P = PERIODS.find(x => x[0] === st.per);
    if (P) a.push(['per', t(P[3])]);
    if (st.top) a.push(['top', TOPIC_T[st.top] ? t(TOPIC_T[st.top]) : st.top]);
    if (st.pl) a.push(['pl', st.pl]);
    if (st.g) a.push(['g', st.g]);
    if (st.au) a.push(['au', st.au]);
    if (st.pk) a.push(['pk', t(st.pk === 'talk' ? 'pubTalks' : 'pubArts')]);
    return a;
  },
  tools(kind, count, panel, act) {
    const open = !!this.fo[kind], n = act.length;
    return `<div class="cat-tools mem-tools"><button type="button" class="btn ghost sm" data-act="mem-f" data-v="${kind}" aria-expanded="${open}" aria-controls="mem-fp">${tzIc('i-filter')}<span>${esc(t('fFilters'))}</span>${n ? `<b class="cat-badge">${n}</b>` : ''}</button><p class="cat-n" aria-live="polite">${esc(fmt(t('catN'), {n:fmtInt(count)}))}</p></div>
      ${n ? `<div class="cat-act">${act.map(([k, l]) => `<button type="button" class="chip on" data-act="mem-rm" data-v="${k}">${esc(l)} <span aria-hidden="true">×</span></button>`).join('')}<button type="button" class="cat-clear" data-act="mem-rm" data-v="*">${esc(t('catReset'))}</button></div>` : ''}
      <div class="cat-panel mem-fp" id="mem-fp"${open ? '' : ' hidden'}>${panel}</div>`;
  },
  setSt(st) {
    this.st = st; const u = new URLSearchParams(st).toString();
    try { history.replaceState(null, '', '#memory/' + this.sec + (u ? '?' + u : '')); } catch (e) {}
    this.home(this.sec);
  },
  chipRow(title, key, items, on) {   // items: [[значение, подпись, число]]
    return `<div class="cat-grp"><p class="cat-grp-h">${esc(title)}</p><div class="chips">${items.map(([v, l, n]) => `<button type="button" class="chip" data-act="mem-set" data-k="${key}" data-v="${esc(v)}" aria-pressed="${on(v)}">${esc(l)}${n != null ? ` <small>${n}</small>` : ''}</button>`).join('')}</div></div>`;
  },
  /* публикации: записи каталога (у каждой своя страница-статья) и доклады; ссылка ведёт на саму статью, а если страницы нет — на карточку каталога */
  pubList() {
    const rows = Cat.data.filter(r => r.k === 'pub').map(r => ({t:LK(r.t), au:r.au || '', top:r.top || [], y:r.y0 || r.y1 || 0, kind:'art', href:r.src && PIDX.has(String(r.src)) ? '#p/' + r.src : '#catalog/' + encodeURIComponent(r.id)}));
    const key = x => norm(x).slice(0, 40), kids = PIDX.size ? pKids('1749') : [];
    (SITE.talks || []).forEach(x => {
      const same = rows.find(r => key(r.t) === key(x.t)); if (same) { same.kind = 'talk'; return; }
      const k = kids.find(r => key(r[1]) === key(x.t));
      rows.push({t:x.t, au:x.a || '', top:[], y:0, kind:'talk', href:k ? '#p/' + k[0] : ''});
    });
    return rows;
  },
  inPer(y0, y1, per = this.st.per) { const p = PERIODS.find(x => x[0] === per); if (!p) return true; const a = y0 || y1, b = y1 || y0; return a && !(a > p[2] || b < p[1]); },
  /* к событию хронологии: сколько материалов этого года в каталоге (тот же подсчёт, что у фильтра «годы» каталога)
     и до трёх фотографий этого года — сначала по теме события; фото с размытой датой (шире 3 лет) не берём */
  yearRel(e) {
    const y = +e.y; if (!y) return '';
    const hit = r => { const a = r.y0 || r.y1, b = r.y1 || r.y0; return a && a <= y && b >= y; };
    const recs = Cat.data.filter(hit); if (!recs.length) return '';
    const tops = e.tops || [], score = r => (r.top || []).filter(k => tops.includes(k)).length;
    const ph = recs.filter(r => r.k === 'photo' && r.img && r.img.length && Math.abs((r.y1 || r.y0) - (r.y0 || r.y1)) <= 3).sort((a, b) => score(b) - score(a)).slice(0, 3);
    return `<p class="mem-yr sm"><a href="#catalog?y0=${y}&y1=${y}">${tzIc('i-book')}${esc(fmt(t('memYearRecs'), {y, n:recs.length}))}</a></p>
      ${ph.length ? `<ul class="mem-ph3">${ph.map(r => `<li><a href="#catalog/${encodeURIComponent(r.id)}" title="${esc(LK(r.t))}"><img src="${esc(r.img[0])}" alt="${esc(LK(r.t).slice(0, 120))}" loading="lazy" decoding="async" onerror="this.closest('li').remove()"></a></li>`).join('')}</ul>` : ''}`;
  },
  mapView() {
    const root = $('#mem-root'), cat = this.st.hc || '';
    if (this.hmap) { this.hmap.kill(); this.hmap = null; }
    if (!Cat.data) {   // число записей по местам берём из каталога
      root.innerHTML = this.tabs('map') + `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
      Cat.load().then(() => { if (current === 'memory' && /^#memory\/map/.test(location.hash)) this.mapView(); }).catch(() => { root.innerHTML = this.tabs('map') + `<p class="note">${esc(t('catFail'))}</p>`; });
      return;
    }
    const by = new Map(); for (const r of Cat.data) for (const pl of (r.pl || [])) if (HM_TOWNS[pl]) { if (!by.has(pl)) by.set(pl, []); by.get(pl).push(r); }
    const towns = [...by].map(([n, rs]) => ({id:'t:' + n, kind:'town', n, short:n + ' · ' + rs.length, lat:HM_TOWNS[n][0], lon:HM_TOWNS[n][1], rs})).sort((a, b) => b.rs.length - a.rs.length);
    const objs = (this.data.places || []).map(p => ({...p, id:'o:' + p.id}));
    const pts = cat === 'town' ? towns : cat ? objs.filter(p => p.hc === cat) : objs.concat(towns);
    const chips = [['', 'hmAll'], ['town', 'hm_town']].concat(HM_CATS.filter(c => objs.some(o => o.hc === c)).map(c => [c, 'hm_' + c]));
    root.innerHTML = this.tabs('map') + `<p class="muted">${esc(t('hmLead'))}</p>
      <div class="chips hm-chips">${chips.map(([v, k]) => `<a class="chip" href="#memory/map${v ? '?hc=' + v : ''}" aria-pressed="${cat === v}">${esc(t(k))}</a>`).join('')}</div>
      ${pts.length ? `<div class="hmap-box" id="hmap"></div>` : `<p class="note">${esc(t('hmNone'))}</p>`}
      <details class="more hm-listbox"><summary>${esc(t('hmList'))} (${pts.length})</summary><ul class="hm-list">${pts.map(p => `<li><button type="button" class="text-link" data-act="hm-pick" data-v="${esc(p.id)}">${esc(p.n)}</button> <small class="muted">${esc(p.kind === 'town' ? fmt(t('hmTownN'), {n:p.rs.length}) : t('hm_' + p.hc) + (p.y ? ', ' + p.y : ''))}</small></li>`).join('')}</ul></details>
      <p class="muted sm">${esc(t('hmNote'))}</p>`;
    this.hpts = pts;
    const core = pts.filter(p => p.kind !== 'town' || p.rs.length >= 5);   // при открытии — основные места; редкие дальние видны прокруткой и в списке
    if (pts.length) try { this.hmap = TileMap.build($('#hmap'), pts, null, {pin:hmPin, pop:hmPop, fitTo:core}); } catch (e) { console.warn('hmap', e); }
  },
  home(sec) {
    const root = $('#mem-root'), m = this.data;
    this.sec = sec;
    if (sec === 'map') return this.mapView();
    if (this.hmap) { this.hmap.kill(); this.hmap = null; }
    let body = '';
    if (sec === 'time') {
      const st = this.st, groups = m.events.filter(e => this.inPer(e.y, e.y) && (!st.top || (e.tops || []).includes(st.top)) && (!st.pl || (e.pls || []).includes(st.pl)));
      body = this.viz() + this.tools('time', groups.length, this.filters('time'), this.active()) + (groups.length ? '' : `<p class="note">${esc(t('catNone'))}</p>`) + `<ol class="mem-tl">${groups.map(e => `<li class="g-${e.g}"><b class="mem-y">${e.y}</b><div><span class="pill">${esc(L(T.memEvG[e.g] || T.memEvG.region))}</span><p>${esc(e.t)}</p>${e.src && PIDX.has(String(e.src)) ? `<a href="#p/${e.src}" class="text-link sm">${esc(t('expoSrc'))}: ${esc(pTitle(PIDX.get(String(e.src))))}</a>` : ''}
        ${e.d ? `<p class="muted sm">${esc(e.d)}</p>` : ''}${e.srcT ? `<small class="muted">${esc(t('expoSrc'))}: ${esc(e.srcT)}</small>` : ''}
        ${(e.rel || []).length ? `<p class="sm">${esc(t('memRelT'))}: ${e.rel.map(id => `<a href="#catalog/${encodeURIComponent(id)}" data-rel="${esc(id)}">${esc(Cat.byId && Cat.byId.get(id) ? LK(Cat.byId.get(id).t) : id)}</a>`).join('; ')}</p>` : ''}${Cat.data ? this.yearRel(e) : ''}</div></li>`).join('')}</ol>`;
      // связанные документы и фото того же года (ТЗ 8.2) и названия связанных записей — из каталога; он грузится отдельно
      if (!Cat.data) Cat.load().then(() => { if (current === 'memory' && this.sec === 'time') this.home('time'); }).catch(() => {});
    } else if (sec === 'people') {
      const q = norm(this.st.q || '');
      const groups = [...new Set(m.people.flatMap(p => p.g))];
      const g = this.st.g || '';
      const list = m.people.filter(p => (!g || p.g.includes(g)) && (!q || norm(p.n).includes(q)) && (!this.st.top || (p.top || []).includes(this.st.top)) && (!this.st.pl || (p.pl || []).includes(this.st.pl)) && this.inPer(p.b0, p.b1 || p.b0));
      const grp = this.chipRow(t('memGroupsT'), 'g', [['', t('memAllPeople'), m.people.length]].concat(groups.map(x => [x, x, m.people.filter(p => p.g.includes(x)).length])), v => (g || '') === v);
      body = this.qbar('people', t('memFindP')) + this.tools('people', list.length, this.filters('people') + grp, this.active()) + `<ul class="mem-people">${list.slice(0, this.lim || 240).map(p => `<li><a href="#memory/person/${p.id}">${p.img ? `<span class="mem-ph"><img src="${esc(p.img)}" alt="" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('noimg');this.remove()"></span>` : `<span class="mem-ph noimg">${esc(p.n.slice(0, 1))}</span>`}<b>${esc(p.n)}</b><small>${esc(p.g.join(' · '))}${p.b0 ? ', ' + esc(yRange(p.b0, p.b1)) : ''}</small></a></li>`).join('')}</ul>
        ${list.length > (this.lim || 240) ? `<p class="btn-row"><button type="button" class="btn ghost" data-act="mem-more">${esc(fmt(t('memMore'), {n:list.length}))}</button></p>` : ''}`;
    } else if (sec === 'cols') {
      const ex = this.expo.items.filter(x => x.kind === 'photo' && Expo.hasCover(x) && (!this.st.top || (x.top || []).includes(this.st.top)) && (!this.st.pl || (x.pls || []).includes(this.st.pl)) && this.inPer(x.y0, x.y1));
      body = this.tools('cols', ex.length, this.filters('cols'), this.active()) + `<ul class="expo-grid">${ex.map(x => Expo.cardHTML(x)).join('')}</ul>`;
    } else {
      if (!Cat.data) {
        body = `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
        Cat.load().then(() => { if (current === 'memory' && this.sec === 'pubs') this.home('pubs'); }).catch(() => {});
      } else {
        const st = this.st, q = norm(st.q || ''), all = this.pubList();
        const list = all.filter(r => (!st.pk || r.kind === st.pk) && (!st.au || r.au === st.au) && (!st.top || r.top.includes(st.top)) && (!q || norm(r.t + ' ' + r.au).includes(q)));
        if (st.s === 'title') list.sort((x, y) => x.t.localeCompare(y.t, 'ru')); else if (st.s === 'author') list.sort((x, y) => x.au.localeCompare(y.au, 'ru') || x.t.localeCompare(y.t, 'ru'));
        const cnt = f => { const o = {}; all.forEach(r => f(r).forEach(k => { o[k] = (o[k] || 0) + 1; })); return Object.entries(o).sort((x, y) => y[1] - x[1]); };
        const authors = cnt(r => r.au ? [r.au] : []).filter(([, n]) => n > 1).slice(0, 14), tops = cnt(r => r.top).filter(([k]) => TOPIC_T[k] && !GEO_TOP.includes(k));
        const sel = `<form class="mem-filters" data-mem-form="pubs"><label class="cat-sel"><span>${esc(t('fSort'))}</span><select name="s" data-mem-auto>${Cat.optList([['', t('sRel')], ['title', t('sTitle')], ['author', t('sAuthor')]], st.s || '')}</select></label></form>`;
        const panel = this.chipRow(t('fType'), 'pk', [['', t('catAll'), all.length], ['art', t('pubArts'), all.filter(r => r.kind === 'art').length], ['talk', t('pubTalks'), all.filter(r => r.kind === 'talk').length]].filter(x => x[2]), v => (st.pk || '') === v)
          + (authors.length ? this.chipRow(t('pubAu'), 'au', authors.map(([k, n]) => [k, k, n]), v => st.au === v) : '')
          + (tops.length ? this.chipRow(t('fTopic'), 'top', tops.map(([k, n]) => [k, t(TOPIC_T[k]), n]), v => st.top === v) : '') + sel;
        const lim = this.lim === Infinity ? Infinity : 24;
        body = this.qbar('pubs', t('pubFind')) + this.tools('pubs', list.length, panel, this.active())
          + (list.length ? `<ul class="bl-grid mem-pubs2">${list.slice(0, lim).map(r => `<li>${r.href ? `<a class="bl-card" href="${esc(r.href)}">` : '<div class="bl-card">'}<i class="bl-ext">${esc(t(r.kind === 'talk' ? 'pubTalk' : 'pubArt'))}</i><b>${esc(r.t)}</b>${r.au || r.y ? `<small>${esc([r.au, r.y || ''].filter(Boolean).join(' · '))}</small>` : ''}${r.href ? '</a>' : '</div>'}</li>`).join('')}</ul>`
            + (list.length > lim ? `<p class="btn-row"><button type="button" class="btn ghost" data-act="mem-more">${esc(fmt(t('memMore'), {n:list.length}))}</button></p>` : '') : `<p class="note">${esc(t('catNone'))}</p>`);
      }
    }
    root.innerHTML = this.tabs(sec) + body;
  },
  person(id) {
    const p = this.data.people.find(x => x.id === id), root = $('#mem-root');
    if (!p) { root.innerHTML = this.tabs('people') + `<p class="note">${esc(t('catNone'))}</p>`; return; }
    const photos = (p.alb || []).map(([a, i]) => { const al = (SITE.galleryAlbums || []).find(x => x.id === a); return al && al.ph[i] ? {s:al.ph[i].s, c:al.ph[i].c, a:al.id, i} : null; }).filter(Boolean);
    const load = () => Cat.data ? Promise.resolve() : Cat.load();
    root.innerHTML = this.tabs('people') + `<p class="cat-back"><a href="#memory/people">${esc(t('memAllPeople'))}</a></p>
      <article class="mem-person">
        ${p.img ? `<figure class="mem-person-ph"><button type="button" data-act="mem-ph" data-v="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.n)}" onerror="this.closest('figure').classList.add('noimg')"></button></figure>` : ''}
        <div class="mem-person-b">
          <p class="cat-card-k">${p.g.map(g => `<span class="pill">${esc(g)}</span>`).join(' ')}</p>
          <h2 class="cat-card-t" id="mem-h" tabindex="-1">${esc(p.n)}</h2>
          ${p.b0 ? `<p class="muted">${esc(yRange(p.b0, p.b1))}</p>` : ''}
          <h3>${esc(t('memBio'))}</h3><p>${p.bio ? esc(p.bio) : `<span class="muted">${esc(t('memNoBio'))}</span>`}</p>
          ${p.src && PIDX.has(String(p.src)) ? `<p><a class="btn ghost sm" href="#p/${p.src}">${tzIc('i-book')}${esc(t('memPage'))}</a></p>` : ''}
          ${p.srcT ? `<p class="muted sm">${esc(t('expoSrc'))}: ${esc(p.srcT)}</p>` : ''}
          ${(p.fd || []).length ? `<p class="chips">${p.fd.map(n => `<a class="chip" href="#catalog?f=${encodeURIComponent(n)}">${esc(fmt(t('expoFondN'), {n}))}</a>`).join('')}</p>` : ''}
          <div id="mem-fonds"></div>
          <p class="btn-row"><button type="button" class="btn ghost sm" data-act="cat-share" data-v="${esc(p.n)}">${tzIc('i-share')}${esc(t('cShare'))}</button>${My.btn('#memory/person/' + p.id, p.n)}</p>
        </div>
      </article>
      ${photos.length > 1 ? `<section class="cr-sec"><h3>${esc(t('memPhotos'))}</h3><ul class="mem-strip">${photos.map((x, k) => `<li><button type="button" data-act="mem-ph" data-v="${esc(p.id)}" data-k="${k}"><img src="${esc(x.s)}" alt="" loading="lazy"></button></li>`).join('')}</ul></section>` : ''}`;
    if ((p.fonds || []).length) load().then(() => { const box = $('#mem-fonds'); if (box) box.innerHTML = `<h3>${esc(t('memFonds'))}</h3><ul class="cat-kids">${p.fonds.map(f => { const r = Cat.byId.get(f); return r ? `<li><a href="#catalog/${encodeURIComponent(r.id)}">${esc(LK(r.t))}</a> <small>${esc(r.c || '')}</small></li>` : ''; }).join('')}</ul>`; }).catch(() => {});
    const h = $('#mem-h'); if (h) h.focus({preventScroll:true});
  },
  photos(id, k) {
    const p = this.data.people.find(x => x.id === id); if (!p) return;
    const list = (p.alb || []).map(([a, i]) => { const al = (SITE.galleryAlbums || []).find(x => x.id === a); return al && al.ph[i] ? {s:al.ph[i].s, c:al.ph[i].c} : null; }).filter(Boolean);
    if (!list.length && p.img) list.push({s:p.img, c:p.n});   // человек из админки: одно фото без альбома
    if (list.length) LB.open(list, p.n, '', +k || 0);
  }
};

/* ================= онлайн-выставки ================= */
const Expo = {
  data: null, st: {}, fo: false,   // fo — открыта ли панель фильтров
  route(rest, qs) {
    const root = $('#expo-root'); if (!root) return;
    if (!this.data) {
      root.innerHTML = `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
      TZD.get('expo').then(e => { const extra = (Store.data.items || []).filter(x => x.type === 'expo').map(x => ({...x, kind:'doc'})); this.data = {...e, items:extra.concat(e.items)}; this.route(rest, qs); }).catch(() => { root.innerHTML = `<p class="note">${tzIc('i-info')}<span>${esc(t('catFail'))}</span></p>`; });
      return;
    }
    this.st = Cat.parseQS(qs);
    const [id, ex] = String(rest || '').split('/');
    if (id) return this.one(id, ex);
    this.list();
  },
  album(x) { return (SITE.galleryAlbums || []).find(a => a.id === x.alb); },
  cover(x) {
    if (x.th) return x.th;
    const al = x.alb ? this.album(x) : (x.rel && x.rel.alb ? (SITE.galleryAlbums || []).find(a => a.id === x.rel.alb[0]) : null);
    if (al) return al.th || (al.ph[0] && al.ph[0].s) || '';
    const ex = Array.isArray(x.ex) && x.ex.find(e => e && e.s);   // выставка из админки: первый загруженный экспонат
    return ex ? ex.s : '';
  },
  /* в списках показываем только выставки с обложкой (решение команды: без фото карточка портит вид); по прямой ссылке открываются все */
  hasCover(x) { return !!this.cover(x); },
  /* все возможные обложки: своя, затем снимки альбома и экспонаты — чтобы на главной не повторять один и тот же снимок */
  covers(x) {
    const out = [], c0 = this.cover(x); if (c0) out.push(c0);
    const al = x.alb ? this.album(x) : (x.rel && x.rel.alb ? (SITE.galleryAlbums || []).find(a => a.id === x.rel.alb[0]) : null);
    if (al) (al.ph || []).slice(0, 12).forEach(p => { if (p && p.s && !out.includes(p.s)) out.push(p.s); });
    if (Array.isArray(x.ex)) x.ex.slice(0, 12).forEach(e => { if (e && e.s && !out.includes(e.s)) out.push(e.s); });
    return out;
  },
  cardHTML(x, cov) {
    cov = cov || this.cover(x);
    return `<li><a class="expo-card" href="#expo/${x.id}"><span class="expo-cov${cov ? ' pf' : ''}">${cov ? pfImg(cov, '') : tzIc('i-doc')}</span>
      <span class="expo-cb"><span class="pill">${esc(t(x.kind === 'photo' ? 'expoPhoto' : 'expoDoc'))}</span><b>${esc(LK(x.t))}</b><small>${[x.n ? fmt(t('expoN'), {n:x.n}) : '', yRange(x.y0, x.y1), (x.top || []).slice(0, 2).map(k => t(TOPIC_T[k])).join(', ')].filter(Boolean).map(esc).join(' · ')}</small></span></a></li>`;
  },
  list() {
    const root = $('#expo-root'), top = this.st.top || '', y0 = +this.st.y0 || 0, y1 = +this.st.y1 || 0;
    const shown = this.data.items.filter(x => this.hasCover(x));   // без обложки в списке не показываем
    /* разделение по тематике и по историческим периодам (ТЗ 5.7): выставка попадает в период, если её годы пересекаются с ним */
    const inPer = (x, a, b) => { const lo = x.y0 || x.y1, hi = x.y1 || x.y0; return !!lo && !(b && lo > b) && !(a && hi < a); };
    const byTop = shown.filter(x => !top || (x.top || []).includes(top));
    const items = byTop.filter(x => (!y0 && !y1) || inPer(x, y0, y1));
    const topics = Object.keys(TOPIC_T).filter(k => !GEO_TOP.includes(k) && shown.some(x => (x.top || []).includes(k)));
    const PERIODS = [[1000, 1916, t('perBefore')], [1917, 1940, '1917–1940'], [1941, 1945, '1941–1945'], [1946, 1991, '1946–1991'], [1992, 2100, t('perAfter')]].filter(([a, b]) => byTop.some(x => inPer(x, a, b)) || (y0 === a && y1 === b));
    const hf = (tp, a, b) => '#expo' + ((tp || a) ? '?' + [tp ? 'top=' + tp : '', a ? 'y0=' + a + '&y1=' + b : ''].filter(Boolean).join('&') : '');
    const docs = items.filter(x => x.kind === 'doc'), phs = items.filter(x => x.kind === 'photo');
    const open = !!this.fo, act = [];
    if (top) act.push(['t', TOPIC_T[top] ? t(TOPIC_T[top]) : top]);
    if (y0 || y1) { const P = PERIODS.find(([a, b]) => y0 === a && y1 === b); act.push(['p', P ? P[2] : [y0 || '', y1 || ''].join('–')]); }
    const rm = k => hf(k === 't' ? '' : top, k === 'p' ? 0 : y0, k === 'p' ? 0 : y1);
    root.innerHTML = `<div class="cat-tools mem-tools"><button type="button" class="btn ghost sm" data-act="ex-f" aria-expanded="${open}" aria-controls="ex-fp">${tzIc('i-filter')}<span>${esc(t('fFilters'))}</span>${act.length ? `<b class="cat-badge">${act.length}</b>` : ''}</button><p class="cat-n" aria-live="polite">${esc(fmt(t('catN'), {n:items.length}))}</p></div>
      ${act.length ? `<div class="cat-act">${act.map(([k, l]) => `<a class="chip on" href="${rm(k)}">${esc(l)} <span aria-hidden="true">×</span></a>`).join('')}<a class="cat-clear" href="#expo">${esc(t('catReset'))}</a></div>` : ''}
      <div class="cat-panel mem-fp" id="ex-fp"${open ? '' : ' hidden'}>
        <div class="cat-grp"><p class="cat-grp-h">${esc(t('expoByTopic'))}</p><div class="chips"><a class="chip" href="${hf('', y0, y1)}" aria-pressed="${!top}">${esc(t('expoAllT'))}</a>${topics.map(k => `<a class="chip" href="${hf(k, y0, y1)}" aria-pressed="${top === k}">${esc(t(TOPIC_T[k]))}</a>`).join('')}</div></div>
        ${PERIODS.length ? `<div class="cat-grp"><p class="cat-grp-h">${esc(t('expoByPeriod'))}</p><div class="chips"><a class="chip" href="${hf(top, 0, 0)}" aria-pressed="${!y0 && !y1}">${esc(t('expoAllP'))}</a>${PERIODS.map(([a, b, l]) => `<a class="chip" href="${hf(top, a, b)}" aria-pressed="${y0 === a && y1 === b}">${esc(l)}</a>`).join('')}</div></div>` : ''}
      </div>
      ${!items.length ? `<p class="note">${esc(t('catNone'))}</p>` : ''}
      ${docs.length ? `<h2 class="h3 expo-h">${esc(t('expoDoc'))}</h2><ul class="expo-grid">${docs.map(x => this.cardHTML(x)).join('')}</ul>` : ''}
      ${phs.length ? `<h2 class="h3 expo-h">${esc(t('expoPhoto'))}</h2><ul class="expo-grid">${phs.map(x => this.cardHTML(x)).join('')}</ul>` : ''}
      ${(this.data.files || []).length ? `<h2 class="h3 expo-h">${esc(t('expoFiles'))}</h2><ul class="cat-kids">${this.data.files.map(f => `<li><a href="${esc(f.u)}" download>${tzIc('i-download')} ${esc(f.t)}</a></li>`).join('')}</ul>` : ''}`;
  },
  exhibits(x) {
    if (Array.isArray(x.ex)) return x.ex.filter(e => e && e.s);
    if (x.kind === 'photo') { const al = this.album(x); return al ? al.ph.map((p, i) => ({s:p.s, c:p.c, src:L(al.t), i})) : []; }
    const out = [];
    ((x.rel && x.rel.alb) || []).forEach(aid => { const al = (SITE.galleryAlbums || []).find(a => a.id === aid); if (al) al.ph.slice(0, 24).forEach((p, i) => out.push({s:p.s, c:p.c, src:L(al.t), i})); });
    return out;
  },
  one(id, exN) {
    const x = this.data.items.find(e => e.id === id), root = $('#expo-root');
    if (!x) { root.innerHTML = `<p class="note">${esc(t('catNone'))}</p><p><a href="#expo">${esc(t('expoBack'))}</a></p>`; return; }
    Stat.push('expo', id);
    const ex = this.exhibits(x);
    const txt = LK(x.tx) || (x.tx && x.tx.ru) || x.intro || '';
    const vids = ((x.rel && x.rel.av) || []), vfiles = (x.files || []).filter(f => f && f.k === 'video'), afiles = (x.files || []).filter(f => f && f.k === 'audio');   // собственные видео и аудио выставки (загружены в админке)
    root.innerHTML = `<p class="cat-back"><a href="#expo">${esc(t('expoBack'))}</a></p>
      <article class="expo-one">
        <header><p class="cat-card-k"><span class="pill">${esc(t(x.kind === 'photo' ? 'expoPhoto' : 'expoDoc'))}</span>${(x.top || []).map(k => ` <a class="pill" href="#expo?top=${k}">${esc(t(TOPIC_T[k]))}</a>`).join('')}</p>
          <h2 class="cat-card-t" id="expo-h" tabindex="-1">${esc(LK(x.t))}</h2>
          ${x.y0 ? `<p class="muted">${esc(yRange(x.y0, x.y1))}</p>` : ''}
          <p class="btn-row"><button type="button" class="btn ghost sm" data-act="cat-share" data-v="${esc(LK(x.t))}">${tzIc('i-share')}${esc(t('cShare'))}</button>${My.btn('#expo/' + x.id, LK(x.t))}${x.src && PIDX.has(String(x.src)) ? `<a class="btn ghost sm" href="#p/${x.src}">${tzIc('i-book')}${esc(t('expoSrc'))}</a>` : ''}</p></header>
        ${txt ? `<div class="expo-tx">${txt.split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
        ${x.kind === 'doc' && lang !== 'ru' && !(x.tx && x.tx[lang === 'kz' ? 'kk' : lang]) ? ruNote() : ''}
        ${ex.length ? `<h3 class="expo-h">${esc(x.kind === 'photo' ? fmt(t('expoN'), {n:ex.length}) : t('expoRel'))}</h3>
        <ol class="expo-ex">${ex.map((e, k) => `<li><button type="button" data-act="expo-ex" data-v="${esc(x.id)}" data-k="${k}"><span class="expo-exi"><img src="${esc(e.s)}" alt="" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('noimg');this.remove()"></span><span class="expo-exc"><b>${k + 1}.</b> ${esc((s2 => s2.length > 160 ? s2.slice(0, 150).replace(/\s+\S*$/, '') + '…' : s2)(LK(e.c) || ''))}</span></button></li>`).join('')}</ol>` : ''}
        ${vids.length ? `<h3 class="expo-h">${esc(t('kAv'))}</h3><ul class="expo-vids">${vids.map(v => `<li><a href="#catalog/av-${esc(v)}"><img src="https://i.ytimg.com/vi/${esc(v)}/mqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${esc(t('cWatch'))}</span></a></li>`).join('')}</ul>` : ''}
        ${(x.yt || []).length ? `<h3 class="expo-h">${esc(t('expoVideo'))}</h3><div class="expo-yts">${x.yt.map(v => `<div class="cat-video"><button type="button" class="cat-yt" data-act="cat-yt" data-v="${esc(v)}"><img src="https://i.ytimg.com/vi/${esc(v)}/hqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="btn">${tzIc('i-play')}${esc(t('cWatch'))}</span></button></div>`).join('')}</div>` : ''}
        ${vfiles.length ? `<h3 class="expo-h">${esc(t('expoVideo'))}</h3><div class="expo-yts">${vfiles.map(v => `<figure class="expo-vf"><video controls preload="metadata" playsinline src="/files/${esc(v.id)}/view" aria-label="${esc(v.n)}"></video><figcaption>${esc(String(v.n).replace(/\.[^.]+$/, ''))}</figcaption></figure>`).join('')}</div>` : ''}
        ${afiles.length ? `<h3 class="expo-h">${esc(t('expoAudio'))}</h3><div class="expo-yts">${afiles.map(a => `<figure class="expo-vf expo-af"><figcaption>${esc(String(a.n).replace(/\.[^.]+$/, ''))}</figcaption><audio controls preload="metadata" src="/files/${esc(a.id)}/view" aria-label="${esc(a.n)}"></audio></figure>`).join('')}</div>` : ''}
        ${(x.fd || []).length ? `<h3 class="expo-h">${esc(t('expoFonds'))}</h3><p class="chips">${x.fd.map(n => `<a class="chip" href="#catalog?f=${encodeURIComponent(n)}">${esc(fmt(t('expoFondN'), {n}))}</a>`).join('')}</p>` : ''}
        ${x.note ? `<p class="note">${tzIc('i-info')}<span>${esc(x.note)}</span></p>` : ''}
      </article>`;
    const h = $('#expo-h'); if (h && vtReady) h.focus({preventScroll:true});
    if (exN != null && exN !== '') this.open(id, +exN);
  },
  open(id, k) {
    const x = this.data.items.find(e => e.id === id); if (!x) return;
    const ex = this.exhibits(x); if (!ex.length) return;
    LB.open(ex.map(e => ({s:e.s, c:e.c})), LK(x.t), '', k);
  }
};

/* ---------- увеличение в просмотрщике фото (выставки, альбомы, коллекции) ---------- */
const LBZ = {
  s:1, x:0, y:0,
  init() {
    const d = $('#lb'); if (!d || $('#lb-zoom')) return;
    const bar = document.createElement('div'); bar.className = 'lb-zoom'; bar.id = 'lb-zoom';
    bar.innerHTML = `<button type="button" data-act="lb-z" data-v="-1" aria-label="${esc(t('zOut'))}">${tzIc('i-minus')}</button><button type="button" data-act="lb-z" data-v="0" aria-label="${esc(t('zFit'))}">${tzIc('i-fit')}</button><button type="button" data-act="lb-z" data-v="1" aria-label="${esc(t('zIn'))}">${tzIc('i-plus')}</button>`;
    $('.lb-top', d).insertBefore(bar, $('.lb-x', d));
    const img = $('#lb-img'); let drag = null;
    img.addEventListener('pointerdown', e => { if (this.s <= 1) return; e.stopPropagation(); drag = {x:e.clientX - this.x, y:e.clientY - this.y}; img.setPointerCapture(e.pointerId); });
    img.addEventListener('pointermove', e => { if (!drag) return; this.x = e.clientX - drag.x; this.y = e.clientY - drag.y; this.apply(); });
    img.addEventListener('pointerup', e => { if (drag) e.stopPropagation(); drag = null; });
    img.addEventListener('dblclick', () => this.zoom(this.s > 1 ? 0 : 1));
    d.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); this.zoom(e.deltaY < 0 ? 1 : -1); }, {passive:false});
    const show = LB.show.bind(LB); LB.show = () => { this.zoom(0); show(); };
    document.addEventListener('keydown', e => { if (!d.open) return; if (e.key === '+' || e.key === '=') this.zoom(1); else if (e.key === '-') this.zoom(-1); });
  },
  apply() { const img = $('#lb-img'); if (img) { img.style.transform = this.s > 1 ? `translate(${this.x}px, ${this.y}px) scale(${this.s})` : ''; img.style.cursor = this.s > 1 ? 'grab' : ''; } },
  zoom(dd) { if (dd === 0) { this.s = 1; this.x = 0; this.y = 0; } else { this.s = Math.max(1, Math.min(6, this.s * (dd > 0 ? 1.5 : 1 / 1.5))); if (this.s === 1) { this.x = 0; this.y = 0; } } this.apply(); }
};

/* ================= «Филиалы и контакты»: все здания и филиалы, поиск, фильтр, маршрут ================= */
/* 13 филиалов (постановление акимата № 142 от 02.06.2026). Точные координаты домов (по 2ГИС) — у Риддера и Алтая. Зайсан — точка у соседнего дома.
   У остальных точка по центру населённого пункта (approx): карточка честно пишет, что положение приблизительное.
   У Тарбагатайского и Уланского филиалов координат нет: они есть в списке и в карточке, маршрут строится по адресу, метки на карте нет. */
const BR_KEYS = [['ridder', /риддер/i], ['zirian', /алтай/i], ['zaisan', /зайсан/i], ['glubokoe', /глубок/i], ['katon', /катон/i], ['kurchum', /курчум/i], ['markakol', /мар[кқ]ак/i],
  ['samar', /самар/i], ['tarbagatai', /тарбагат/i], ['ulan', /уланск/i], ['ulken', /нарын/i], ['shemonaiha', /шемонаих/i]];
const brKey = n => (BR_KEYS.find(([, rx]) => rx.test(String(n || ''))) || [])[0] || '';
const BR_GEO = {
  ridder:{lat:50.333454, lon:83.500846, town:['Риддер', 'Риддер', 'Ridder']},
  zirian:{lat:49.727761, lon:84.262003, town:['Алтай (Зыряновск)', 'Алтай (Зыряновск)', 'Altai (Zyryanovsk)']},
  zaisan:{lat:47.468526, lon:84.874595, town:['Зайсан', 'Зайсан', 'Zaisan'], approx:true},
  glubokoe:{lat:50.14, lon:82.31, town:['Глубокое', 'Глубокое', 'Glubokoye'], approx:true},
  katon:{lat:49.17, lon:85.61, town:['Катон-Карагай', 'Катонқарағай', 'Katon-Karagay'], approx:true},
  kurchum:{lat:48.57, lon:83.66, town:['Курчум', 'Күршім', 'Kurchum'], approx:true},
  markakol:{lat:48.75, lon:85.75, town:['Маркаколь', 'Марқакөл', 'Markakol'], approx:true},
  samar:{lat:49.03, lon:83.37, town:['Самар', 'Самар', 'Samar'], approx:true},
  tarbagatai:{town:['Акжар (Тарбагатай)', 'Ақжар (Тарбағатай)', 'Akzhar (Tarbagatai)']},
  ulan:{town:['Уланский район', 'Ұлан ауданы', 'Ulan district']},
  ulken:{lat:49.20, lon:84.51, town:['Үлкен-Нарын', 'Үлкен Нарын', 'Ulken Naryn'], approx:true},
  shemonaiha:{lat:50.63, lon:81.91, town:['Шемонаиха', 'Шемонаиха', 'Shemonaikha'], approx:true}
};
/* адрес без повтора населённого пункта: «Глубокое, Глубоковский район, п. Глубокое, …» не нужно */
const brLine = p => /^г\.\s/.test(p.addr) || (p.town && norm(p.addr).includes(norm(p.town).split(' ')[0])) ? p.addr : p.town + ', ' + p.addr;
function allPlaces() {
  const city = places().map(p => ({...p, type:p.main ? 'main' : 'city', key:p.main ? 'main' : 'b' + p.id, town:L(['Усть-Каменогорск', 'Өскемен', 'Ust-Kamenogorsk'])}));
  const br = SITE.branches || [];
  city.forEach(p => { if (/потанин/i.test(p.ruShort || p.short || '')) { const b = br.find(x => /потанин/i.test(x._a || x.a)); if (b) Object.assign(p, {type:'branch', arch:'uka', name:b.n, hours:b.h, zone:b.z, email:b.e, head:b.head, phones:b.p && b.p.length ? b.p : p.phones}); } });
  const main = city.find(p => p.main); if (main) Object.assign(main, {name:t('orgName'), email:S().email || 'arhiv-ukg@yandex.kz', hours:`${t('weekShort')} ${S().open || '09:00'}–${S().close || '18:00'}`, arch:'gavko'});
  const regional = br.map(b => { if (/потанин/i.test(b._a || b.a)) return null; const key = brKey(b._n || b.n), g = key && BR_GEO[key]; if (!g) return null;
    const addr = b.a.replace(/^\d{6},\s*/, ''), addrRu = (b._a || b.a).replace(/^\d{6},\s*/, '');   // запрос в 2ГИС — по русскому адресу
    return {id:'r-' + key, key, type:'branch', arch:key, main:false, name:b.n, short:L(g.town), town:L(g.town), addr, gisq:'Восточно-Казахстанская область, ' + addrRu, phones:b.p, email:b.e, hours:b.h, zone:b.z, head:b.head, lat:g.lat, lon:g.lon, approx:g.approx}; }).filter(Boolean);
  return city.concat(regional);
}
/* фото здания в карточке (ТЗ 5.5): загруженное сотрудниками (photos: slot 'branch', id br-<код>), а у главного здания — фото команды из сборки */
const brPhotoId = p => 'br-' + (p.arch || p.key);
function placePhoto(p) {
  const up = (Store.data.photos || []).find(x => x.slot === 'branch' && x.id === brPhotoId(p) && x.src);
  if (up) return up.src;
  if (p.type === 'main') { const d = ((typeof Photos !== 'undefined' && Photos.loaded) || []).find(x => x.slots.includes('contacts')); return d ? d.src : ''; }
  return '';
}
const gRoute = (to, from, mode) => 'https://www.google.com/maps/dir/?api=1' + (from ? '&origin=' + encodeURIComponent(from.lat ? from.lat + ',' + from.lon : from.text) : '') + `&destination=${to.lat ? to.lat + ',' + to.lon : encodeURIComponent(to.gisq || to.addr || '')}&travelmode=${({car:'driving', bus:'transit', foot:'walking'})[mode] || 'driving'}`;
const gisRoute2 = (to, from, mode) => from && from.lat ? `https://2gis.kz/directions/tab/${({car:'car', bus:'bus', foot:'pedestrian'})[mode] || 'car'}/points/${from.lon}%2C${from.lat}%7C${to.lon}%2C${to.lat}` + (to.firm ? '%3B' + to.firm : '') : gisRoute(to);
function kmBetween(a, b) { const R = 6371, r = x => x * Math.PI / 180; const dLa = r(b.lat - a.lat), dLo = r(b.lon - a.lon); const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }
const Br = {
  sel:'main', f:'', q:'', from:null, mode:'car',
  render() {
    const root = $('#br-root'); if (!root) return;
    const ps = allPlaces();
    if (!ps.find(p => p.key === this.sel)) this.sel = 'main';
    // каркас с картой строим один раз на язык: повторный заход в раздел не создаёт новую карту (каждая держит WebGL)
    if (root.dataset.lang === lang && root.querySelector('.br .map-slot')) { const q = $('#br-q'); if (q) q.value = this.q; this.list(); this.card(); return; }
    root.dataset.lang = lang;
    root.innerHTML = `<div class="br">
      <div class="br-side">
        <label class="ffield"><svg class="ic"><use href="#i-search"/></svg><input type="search" id="br-q" value="${esc(this.q)}" placeholder="${esc(t('brFind'))}" aria-label="${esc(t('brFind'))}" autocomplete="off"></label>
        <div class="chips br-f" role="group" aria-label="${esc(t('fType'))}">${[['', 'brAll'], ['city', 'brCity'], ['branch', 'brBranch']].map(([v, k]) => `<button type="button" class="chip" data-act="br-f" data-v="${v}" aria-pressed="${this.f === v}">${esc(t(k))}</button>`).join('')}</div>
        <ul class="br-list" id="br-list"></ul>
      </div>
      <div class="br-map"><div class="map-box map-slot" data-scope="region" style="min-height:28rem"></div></div>
    </div>
    <div class="br-card" id="br-card" aria-live="polite"></div>`;
    this.list(); this.card();
    mountMaps();
  },
  visible() {
    const q = norm(this.q);
    return allPlaces().filter(p => (!this.f || p.type === this.f || (this.f === 'city' && (p.type === 'city' || (p.type === 'branch' && p.arch === 'uka')))) && (!q || norm([p.name, p.short, p.addr, p.town, p.zone].join(' ')).includes(q)));
  },
  list() {
    const box = $('#br-list'); if (!box) return;
    const vis = this.visible();
    box.innerHTML = vis.length ? vis.map(p => `<li><button type="button" data-act="br-sel" data-v="${esc(p.key)}" aria-pressed="${p.key === this.sel}"><b>${esc(p.name)}</b><span>${esc(brLine(p))}</span>${this.from && this.from.lat && p.lat ? `<small>${esc(fmt(t('brDist'), {d:fmtNum(kmBetween(this.from, p))}))}</small>` : ''}</button></li>`).join('') : `<li class="empty">${esc(t('brNone'))}</li>`;
  },
  card() {
    const box = $('#br-card'); if (!box) return;
    const p = allPlaces().find(x => x.key === this.sel); if (!p) { box.innerHTML = ''; return; }
    const fonds = Cat.data ? Cat.data.filter(r => r.k === 'fond' && r.a === p.arch).length : null;
    const d = this.from && this.from.lat && p.lat ? kmBetween(this.from, p) : null;
    const photo = placePhoto(p);
    box.innerHTML = `<div class="br-info">
      ${photo ? `<figure class="br-photo"><img src="${esc(photo)}" alt="${esc(p.name)}" loading="lazy" decoding="async"></figure>` : ''}
      <p class="cat-card-k"><span class="pill">${esc(t(p.type === 'main' ? 'brMain' : p.type === 'city' ? 'brCity' : 'brBranch'))}</span></p>
      <h2 class="h3">${esc(p.name)}</h2>
      <dl class="cat-dl">
        <div><dt>${esc(t('brAddr'))}</dt><dd>${esc(brLine(p))}${p.approx ? `<br><small class="muted">${esc(t('brApprox'))}</small>` : !p.lat ? `<br><small class="muted">${esc(t('brNoPin'))}</small>` : ''}</dd></div>
        ${p.phones && p.phones.length ? `<div><dt>${esc(t('brPhone'))}</dt><dd>${telLinks(p.phones)}</dd></div>` : ''}
        ${p.email ? `<div><dt>${esc(t('brMail'))}</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>` : ''}
        ${p.hours && p.type !== 'main' ? `<div><dt>${esc(t('brHours'))}</dt><dd>${esc(p.hours)}</dd></div>` : ''}
        ${p.zone ? `<div><dt>${esc(t('brZone'))}</dt><dd>${esc(p.zone)}</dd></div>` : ''}
        ${p.head ? `<div><dt>${esc(t('brHead'))}</dt><dd>${esc(p.head)}</dd></div>` : ''}
        ${p.arch && fonds ? `<div><dt>${esc(t('brFonds'))}</dt><dd><a href="#catalog?a=${esc(p.arch)}&k=fond">${fonds}</a></dd></div>` : ''}
      </dl>
      ${p.type === 'main' ? hoursBlockHTML() : ''}</div>
      <form class="br-route" id="br-route">
        <h3 class="h4">${esc(t('brRoute'))}</h3>
        <div class="field"><label for="br-from">${esc(t('brFrom'))}</label><input id="br-from" type="text" value="${esc(this.from && this.from.text || '')}" placeholder="${esc(t('brFromPh'))}" autocomplete="street-address"></div>
        <p class="btn-row"><button type="button" class="btn ghost sm" data-act="br-geo">${tzIc('i-locate')}${esc(t('brGeo'))}</button></p>
        <fieldset class="br-modes"><legend>${esc(t('brMode'))}</legend>${[['car', 'brCar'], ['bus', 'brBus'], ['foot', 'brFoot']].map(([v, k]) => `<label><input type="radio" name="br-mode" value="${v}"${this.mode === v ? ' checked' : ''}> ${esc(t(k))}</label>`).join('')}</fieldset>
        <p class="btn-row"><button class="btn sm" type="submit">${tzIc('i-route')}${esc(t('brShow'))}</button></p>
        <p class="br-dist" id="br-dist">${d != null ? esc(fmt(t('brDist'), {d:fmtNum(d)})) : ''}</p>
        <p class="btn-row br-links"><a class="btn ghost sm" target="_blank" rel="noopener" href="${esc(gisRoute2(p, this.from, this.mode))}">${esc(t('brIn2gis'))}${tzIc('i-ext')}</a><a class="btn ghost sm" target="_blank" rel="noopener" href="${esc(gRoute(p, this.from, this.mode))}">${esc(t('brInGoogle'))}${tzIc('i-ext')}</a></p>
      </form>`;
  },
  select(key, fromMap) {
    this.sel = key; this.list(); this.card();
    if (!fromMap) MapGis.focus(key);
  },
  geo() {
    if (!navigator.geolocation) { toast(t('brGeoFail')); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      this.from = {lat:pos.coords.latitude, lon:pos.coords.longitude, text:t('brGeo')};
      const near = allPlaces().filter(p => p.lat).map(p => [kmBetween(this.from, p), p]).sort((a, b) => a[0] - b[0])[0];
      if (near) { this.sel = near[1].key; toast(fmt(t('brNear'), {n:near[1].name, d:fmtNum(near[0])})); }
      this.list(); this.card(); MapGis.focus(this.sel);
    }, () => toast(t('brGeoFail')), {enableHighAccuracy:false, timeout:10000, maximumAge:600000});
  },
  async route(text) {
    text = String(text || '').trim();
    if (!text) { this.card(); return; }
    if (this.from && this.from.text === text && this.from.lat) { this.card(); return; }
    this.from = {text};
    try {
      const r = await fetch('https://catalog.api.2gis.com/3.0/items/geocode?fields=items.point&q=' + encodeURIComponent(text) + '&key=' + encodeURIComponent(gisKey())).then(r => r.json());
      const it = r && r.result && r.result.items && r.result.items.find(x => x.point);
      if (it) this.from = {text, lat:it.point.lat, lon:it.point.lon}; else toast(t('brAddrFail'));
    } catch (e) { /* без сети: ссылка на Google построит маршрут по тексту адреса */ }
    this.list(); this.card();
  }
};
/* карта в «Филиалах»: все точки области; выбор метки ↔ выбор в списке */
const placesFor = box => box && box.dataset.scope === 'region' ? allPlaces() : places();
MapGis.focus = function (key) {
  const x = this.inst.find(i => i.box && i.box.dataset.scope === 'region'); if (!x || !x.open) return;
  const p = allPlaces().find(q => q.key === key); if (p) x.open(p);
};

/* ================= справка для посетителей: о сайте, как искать, документы и ссылки ================= */
const GTXT = {
  site:[
`## Для чего этот сайт
Сайт Государственного архива Восточно-Казахстанской области — справочный: здесь публикуются сведения об архиве, его фондах, опубликованных документах, коллекциях, выставках и филиалах. **Заявления, запросы, заказы и платежи на сайте не принимаются** — для госуслуг есть [eGov.kz]({eg}), для обращений — [eOtinish.kz](https://eotinish.kz).

## Как устроен сайт
- **[Об архиве](#about)** — история, руководство, деятельность, нормативные документы и отчёты.
- **[Фонды и каталог](#catalog)** — электронный каталог: фонды, описи, дела, документы, фото, карты, публикации, видео.
- **[Справка](#visitors)** — этот раздел: как пользоваться сайтом и искать материалы.
- **[Архив памяти](#memory)** — хронология, люди, коллекции, публикации по истории края.
- **[Выставки](#expo)** — онлайн-выставки архива и фотовыставки.
- **[Новости](#news)** — события архива и объявления.
- **[Филиалы и контакты](#contacts)** — адреса, часы работы, карта и маршруты.
- **ИИ-помощник** — кнопка в правом нижнем углу: отвечает на казахском, русском и английском.

## Навигация
Поиск по всему сайту — кнопка «Поиск» в шапке или клавиша «/». Язык и тема (светлая или тёмная) переключаются в верхней строке; там же версия для слабовидящих.`,
`## Сайт не үшін керек
Шығыс Қазақстан облысының мемлекеттік архиві сайты — анықтамалық сайт: мұнда архив, оның қорлары, жарияланған құжаттары, жинақтары, көрмелері мен филиалдары туралы мәліметтер жарияланады. **Сайтта өтініштер, сұраулар, тапсырыстар мен төлемдер қабылданбайды** — мемлекеттік қызметтер үшін [eGov.kz]({eg}), өтініштер үшін [eOtinish.kz](https://eotinish.kz) бар.

## Сайт құрылымы
- **[Архив туралы](#about)** — тарихы, басшылығы, қызметі, нормативтік құжаттар мен есептер.
- **[Қорлар және каталог](#catalog)** — электрондық каталог: қорлар, тізімдемелер, істер, құжаттар, фото, карталар, жарияланымдар, бейне.
- **[Анықтама](#visitors)** — осы бөлім: сайтты пайдалану және материал іздеу.
- **[Жад мұрағаты](#memory)** — хронология, адамдар, жинақтар, өлке тарихы бойынша жарияланымдар.
- **[Көрмелер](#expo)** — архивтің онлайн көрмелері мен фотокөрмелер.
- **[Жаңалықтар](#news)** — архив оқиғалары мен хабарландырулар.
- **[Филиалдар және байланыс](#contacts)** — мекенжайлар, жұмыс уақыты, карта және бағыттар.
- **ЖИ-көмекші** — төменгі оң жақ бұрыштағы батырма: қазақ, орыс және ағылшын тілдерінде жауап береді.

## Навигация
Бүкіл сайт бойынша іздеу — тақырыптағы «Іздеу» батырмасы немесе «/» пернесі. Тіл мен тақырып (ашық немесе қараңғы) жоғарғы жолда ауыстырылады; көру қабілеті нашарларға арналған нұсқа да сонда.`,
`## What this site is for
The State Archive of East Kazakhstan Region site is informational: it publishes information about the archive, its fonds, published records, collections, exhibitions and branches. **No applications, requests, orders or payments are accepted here** — public services are on [eGov.kz]({eg}), requests on [eOtinish.kz](https://eotinish.kz).

## Site map
- **[About](#about)** — history, management, activities, regulations and reports.
- **[Fonds & catalogue](#catalog)** — the electronic catalogue: fonds, inventories, files, documents, photos, maps, publications, video.
- **[Help](#visitors)** — this section: how to use the site and search.
- **[Memory archive](#memory)** — timeline, people, collections, publications on regional history.
- **[Exhibitions](#expo)** — online exhibitions and photo exhibitions.
- **[News](#news)** — archive events and announcements.
- **[Branches & contacts](#contacts)** — addresses, hours, map and directions.
- **AI assistant** — the button in the lower right corner; it answers in Kazakh, Russian and English.

## Navigation
Site-wide search is the Search button in the header or the “/” key. Language and theme (light or dark) are in the top bar, together with the low-vision version.`],
  guide:[
`## Как читать архивный шифр
Шифр — «адрес» документа в архиве: **ГАВКО. Ф. 77. Оп. 1. Д. 19. Л. 152** — Государственный архив ВКО, фонд № 77, опись № 1, дело № 19, лист 152. Шифр нужен, чтобы сослаться на документ в работе или найти его в читальном зале. В карточке каталога его можно скопировать одной кнопкой.

## Как искать
- Напишите запрос своими словами: «фотографии Усть-Каменогорска 1960-х», «личный фонд Аксенова». Каталог сам распознаёт тип материала, тему, место и годы.
- Кнопка «Фильтры»: тип, период, тема, филиал, сортировка и точный поиск по номеру фонда, описи или дела.
- Звёздочка добавляет материал в **избранное** (хранится только в вашем браузере).

## Статусы доступа
- **Открытый** — материал опубликован, им можно пользоваться со ссылкой на архив.
- **Рассекречен, открытый** — документ имел гриф секретности, снят с режима ограничения и опубликован архивом.
- **Ограниченный** — сведения о документе есть, но копия не публикуется (персональные данные, сроки ограничения по закону). Познакомиться с ним можно в читальном зале в установленном законом порядке.`,
`## Архивтік шифрды қалай оқу керек
Шифр — құжаттың архивтегі «мекенжайы»: **ГАВКО. Ф. 77. Оп. 1. Д. 19. Л. 152** — ШҚО мемлекеттік архиві, № 77 қор, № 1 тізімдеме, № 19 іс, 152-парақ. Шифр құжатқа сілтеме жасау немесе оны оқу залынан табу үшін керек. Каталог карточкасында оны бір батырмамен көшіруге болады.

## Қалай іздеу керек
- Сұрауды өз сөзіңізбен жазыңыз: «1960 жылдардағы Өскемен фотосуреттері», «Аксеновтың жеке қоры». Каталог материал түрін, тақырыпты, орынды және жылдарды өзі таниды.
- «Сүзгілер» батырмасы: түрі, кезең, тақырып, филиал, сұрыптау және қор, тізімдеме немесе іс нөмірі бойынша нақты іздеу.
- Жұлдызша материалды **таңдаулыларға** қосады (тек сіздің браузеріңізде сақталады).

## Қолжетімділік мәртебелері
- **Ашық** — материал жарияланған, оны архивке сілтеме жасап пайдалануға болады.
- **Құпиясыздандырылған, ашық** — құжатта құпиялылық грифі болған, шектеу режимінен алынып, архивпен жарияланған.
- **Шектеулі** — құжат туралы мәлімет бар, бірақ көшірмесі жарияланбайды (дербес деректер, заңдағы шектеу мерзімдері). Онымен оқу залында заңда белгіленген тәртіппен танысуға болады.`,
`## Reading an archival code
The code is the record’s “address”: **ГАВКО. Ф. 77. Оп. 1. Д. 19. Л. 152** — State Archive of EKR, fond 77, inventory 1, file 19, sheet 152. Use it to cite the record or to order it in the reading room. The catalogue card has a one-click Copy button.

## How to search
- Type a request in your own words: “photos of Ust-Kamenogorsk in the 1960s”, “Aksenov personal fond”. The catalogue recognises the record type, topic, place and years.
- The Filters button: record type, period, topic, branch, sorting and exact search by fond, inventory or file number.
- The star adds a record to your **favourites** (kept in your browser only).

## Access statuses
- **Open** — published and free to use with a reference to the archive.
- **Declassified, open** — once classified, released from restriction and published by the archive.
- **Restricted** — the record is described but no copy is published (personal data, legal restriction periods). It can be consulted in the reading room as the law provides.`]
};
function mdH(src) { return String(src).split(/\n(?=## )/).map(b => { const m = b.match(/^## (.+)\n?([\s\S]*)$/); return m ? `<h2>${esc(m[1])}</h2>` + md(m[2]) : md(b); }).join(''); }
/* Тексты «О сайте» и «Как искать» и список открытых ресурсов сотрудники правят в админке («Справка и FAQ»):
   settings.guide = {site|guide: {ru, kz, en}}, settings.refLinks = [{url, t:{ru, kz, en}}]. Нет правки — показываем стандартные из кода. */
function guideText(k) {
  const o = (S().guide || {})[k], own = o && typeof o[lang] === 'string' ? o[lang].trim() : '';
  return (own || L(GTXT[k])).replace(/\{eg\}/g, EGOV[lang]);
}
function guideHTML(k) { return `<div class="hub-main prose-wide">${mdH(guideText(k))}</div>`; }
const RES_LINKS = [['https://adilet.zan.kz/rus/docs/Z980000326_', ['Закон РК «О Национальном архивном фонде и архивах» — Әділет', '«Ұлттық архив қоры және архивтер туралы» ҚР Заңы — Әділет', 'Law “On the National Archival Fund and Archives” — Adilet']],
    ['https://www.gov.kz/memleket/entities/vko-uca', ['Управление цифровизации и архивов ВКО — gov.kz', 'ШҚО цифрландыру және архивтер басқармасы — gov.kz', 'EKR Department of Digitalisation and Archives — gov.kz']],
    ['https://egov.kz/cms/ru/articles/department_of_archives', ['Контакты архивных управлений областей — eGov.kz', 'Облыстардың архив басқармаларының байланыстары — eGov.kz', 'Contacts of regional archive departments — eGov.kz']],
    ['https://archive.president.kz/', ['Архив Президента Республики Казахстан', 'Қазақстан Республикасы Президентінің Архиві', 'Archive of the President of Kazakhstan']],
    ['https://e-history.kz/', ['Портал «История Казахстана» e-history.kz', '«Қазақстан тарихы» порталы e-history.kz', 'History of Kazakhstan portal e-history.kz']]];
function refLinks() {   // [[url, [ru, kz, en]], …]; ссылки не http(s) отбрасываем и здесь: настройки приходят с сервера
  const c = S().refLinks;
  if (!Array.isArray(c) || !c.length) return RES_LINKS;
  const ok = c.filter(l => l && typeof l.url === 'string' && /^https?:\/\//.test(l.url) && l.t && l.t.ru).map(l => [l.url, [l.t.ru, l.t.kz || l.t.ru, l.t.en || l.t.ru]]);
  return ok.length ? ok : RES_LINKS;
}
function linksHTML() {
  const laws = (SITE.laws || []).slice(0, 12);
  const res = refLinks();
  return `<div class="hub-main">
    <h2 class="h3">${esc(L(['Нормативные документы', 'Нормативтік құжаттар', 'Regulations']))}</h2>
    <ul class="cat-kids">${laws.map(x => `<li>${LAW_LINKS[Object.keys(LAW_LINKS).find(k => x.t.includes(k))] ? `<a href="${esc(LAW_LINKS[Object.keys(LAW_LINKS).find(k => x.t.includes(k))])}" target="_blank" rel="noopener">${esc(x.t)}</a>` : esc(x.t)} <small>${esc(x.d || '')}</small></li>`).join('')}</ul>
    <p><a class="text-link" href="#about/docs">${esc(L(['Все документы — в разделе «Об архиве»', 'Барлық құжаттар — «Архив туралы» бөлімінде', 'All documents are in About']))}</a></p>
    <h2 class="h3">${esc(L(['Открытые ресурсы', 'Ашық ресурстар', 'Open resources']))}</h2>
    <ul class="cat-kids">${res.map(([u, tt]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(L(tt))} ${tzIc('i-ext')}</a></li>`).join('')}</ul>
    <h2 class="h3">${esc(t('navBranches'))}</h2>
    <p><a class="btn ghost sm" href="#contacts">${tzIc('i-pin')}${esc(L(['Адреса, часы работы и маршруты', 'Мекенжайлар, жұмыс уақыты және бағыттар', 'Addresses, hours and directions']))}</a></p>
  </div>`;
}
const FAQ_SITE = [
  {q:['Можно ли подать заявление или заказать справку на сайте?', 'Сайтта өтініш беруге немесе анықтама сұратуға бола ма?', 'Can I apply or order a certificate on this site?'],
   a:() => [`Нет, сайт справочный. Архивные справки оформляются на <a href="${EGOV.ru}" target="_blank" rel="noopener">eGov.kz</a> или в ЦОН, обращения — на <a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish.kz</a>.`, `Жоқ, сайт анықтамалық. Архивтік анықтамалар <a href="${EGOV.kz}" target="_blank" rel="noopener">eGov.kz</a> немесе ХҚКО арқылы, өтініштер <a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish.kz</a> арқылы ресімделеді.`, `No, the site is informational. Certificates are issued via <a href="${EGOV.en}" target="_blank" rel="noopener">eGov.kz</a> or a Public Service Centre; requests go through <a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish.kz</a>.`]},
  {q:['Как найти документ по номеру фонда?', 'Құжатты қор нөмірі бойынша қалай табуға болады?', 'How do I find a record by fond number?'],
   a:() => ['Откройте <a href="#catalog?adv=1">расширенный поиск</a> в каталоге и заполните поля «Фонд №», «Опись №», «Дело №».', 'Каталогтағы <a href="#catalog?adv=1">кеңейтілген іздеуді</a> ашып, «Қор №», «Тізімдеме №», «Іс №» өрістерін толтырыңыз.', 'Open <a href="#catalog?adv=1">advanced search</a> and fill in the fond, inventory and file numbers.']},
  {q:['Что означает шифр «ГАВКО. Ф. 77. Оп. 1. Д. 19»?', '«ГАВКО. Ф. 77. Оп. 1. Д. 19» шифры нені білдіреді?', 'What does “ГАВКО. Ф. 77. Оп. 1. Д. 19” mean?'],
   a:() => ['Государственный архив ВКО, фонд № 77, опись № 1, дело № 19. Подробнее — во вкладке <a href="#visitors/guide">«Как искать»</a>.', 'ШҚО мемлекеттік архиві, № 77 қор, № 1 тізімдеме, № 19 іс. Толығырақ — <a href="#visitors/guide">«Қалай іздеу керек»</a> бетінде.', 'State Archive of EKR, fond 77, inventory 1, file 19. See <a href="#visitors/guide">How to search</a>.']},
  {q:['Где хранится моё «Избранное»?', '«Таңдаулыларым» қайда сақталады?', 'Where are my favourites kept?'],
   a:() => ['Только в вашем браузере: сайт не собирает личные данные. Список открывается в каталоге флажком «Только избранное».', 'Тек сіздің браузеріңізде: сайт дербес деректерді жинамайды. Тізім каталогтағы «Тек таңдаулылар» белгісімен ашылады.', 'Only in your browser: the site collects no personal data. Open the list in the catalogue with “Favourites only”.']}
];
function regionSchemeSVG() {
  const ps = allPlaces(), W = 640, H = 420, pad = 60, k = Math.cos(49 * Math.PI / 180);
  const xs = ps.map(p => p.lon * k), ys = ps.map(p => p.lat);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const sc = Math.min((W - 2 * pad) / ((maxX - minX) || 1), (H - 2 * pad) / ((maxY - minY) || 1));
  const pos = p => [pad + (p.lon * k - minX) * sc, H - pad - (p.lat - minY) * sc];
  const towns = {};
  ps.forEach(p => { const key = p.town; (towns[key] = towns[key] || []).push(p); });
  return `<svg class="map-scheme" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('brTitle'))}">
    <path d="M30 380C150 300 260 330 330 250S520 120 610 40" fill="none" stroke="var(--il-river)" stroke-width="10" opacity=".5"/>
    ${Object.entries(towns).map(([name, list]) => { const [x, y] = pos(list[0]); return `<g><a href="#contacts" data-act="br-sel" data-v="${esc(list[0].key)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${list.length > 1 ? 11 : 8}" fill="var(--primary)" stroke="#fff" stroke-width="3"/>
      <text x="${(x + 16).toFixed(1)}" y="${(y + 5).toFixed(1)}" class="m">${esc(name)}${list.length > 1 ? ' · ' + list.length : ''}</text></a></g>`; }).join('')}</svg>`;
}

/* ================= главная: быстрые ссылки, «История в документах», выставки, филиалы, полезное, соцсети ================= */
const SOC_IC = {telegram:'i-tg', instagram:'i-ig', facebook:'i-fb', youtube:'i-yt', vk:'i-vk', tiktok:'i-tt', whatsapp:'i-wa'};
function socials() { return (Array.isArray(S().socials) ? S().socials : []).filter(x => x && /^https:\/\//.test(x.url || '')); }
function socialHTML(cls) {
  const list = socials();
  return list.length ? `<ul class="soc ${cls || ''}">${list.map(x => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener me" aria-label="${esc(x.name || x.net)}" title="${esc(x.name || x.net)}">${tzIc(SOC_IC[x.net] || 'i-ext')}<span>${esc(x.name || x.net)}</span></a></li>`).join('')}</ul>`
    : `<p class="muted soc-none">${esc(t('socNone'))} <a href="https://www.gov.kz/memleket/entities/vko-uca" target="_blank" rel="noopener">gov.kz ${tzIc('i-ext')}</a></p>`;
}
function shareHTML() {
  const u = encodeURIComponent(pageURL()), tt = encodeURIComponent(document.title || t('orgName'));
  return `<div class="share-row"><span>${esc(t('shareT'))}:</span>
    <a href="https://t.me/share/url?url=${u}&text=${tt}" target="_blank" rel="noopener" aria-label="Telegram">${tzIc('i-tg')}</a>
    <a href="https://wa.me/?text=${tt}%20${u}" target="_blank" rel="noopener" aria-label="WhatsApp">${tzIc('i-wa')}</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="Facebook">${tzIc('i-fb')}</a>
    <a href="https://vk.com/share.php?url=${u}" target="_blank" rel="noopener" aria-label="VK">${tzIc('i-vk')}</a>
    <button type="button" data-act="cat-share" data-v="${esc(t('orgName'))}" aria-label="${esc(t('cShare'))}">${tzIc('i-copy')}</button></div>`;
}
/* «умная» обложка карточки: снимок заполняет рамку, только если подходит к ней по пропорциям и размеру.
   Иначе (портрет в широкой рамке, маленький снимок) он показывается целиком, без увеличения, а поля заполняет размытая копия.
   Так архивные снимки любых пропорций не растягиваются и не режутся (замечание команды: «растягивает по %») */
function pfImg(src, alt, hi) {
  return `<img class="pf-bg" src="${esc(src)}" alt="" aria-hidden="true" loading="lazy" decoding="async"><img class="pf-img" src="${esc(src)}" alt="${esc(alt || '')}" ${hi ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async" onload="tzFit(this)" onerror="var b=this.parentNode;b.classList.add('noimg');var g=b.querySelector('.pf-bg');if(g)g.remove();this.remove()">`;
}
window.tzFit = function (img) {
  try {
    const box = img.parentNode, bw = box.clientWidth, bh = box.clientHeight, w = img.naturalWidth, h = img.naturalHeight;
    if (!bw || !bh || !w || !h) return;
    box.classList.toggle('pf-fit', w < bw * 0.8 || h < bh * 0.8 || Math.abs(Math.log((w / h) / (bw / bh))) > 0.3);
  } catch (e) {}
};
/* верхняя строка (время работы, языки) и шапка видны всегда: обе липкие, шапка — сразу под верхней строкой */
{
  const sync = () => { const tb = $('.topbar'), sh = $('.site-head'), r = document.documentElement.style; if (tb) r.setProperty('--tb-h', tb.offsetHeight + 'px'); if (sh) r.setProperty('--sh-h', sh.offsetHeight + 'px'); };
  sync(); addEventListener('resize', sync);
  if (window.ResizeObserver) { const ro = new ResizeObserver(sync); [$('.topbar'), $('.site-head')].forEach(el => el && ro.observe(el)); }
}
/* «Об архиве» (ТЗ 5.2): миссия и задачи, фотогалерея учреждения.
   Официальной формулировки миссии архив не передавал, а свои формулировки мы не придумываем: пока поле в админке пусто, показаны
   дословные цитаты материалов самого архива о его задачах (страница «Информационные технологии в архивных учреждениях ВКО»). */
const About = {
  list: [],
  QUOTES: ['На сегодняшний день в государственных архивах Восточно-Казахстанской области хранится более 2-х млн. дел на бумажной основе, из них около 50 тыс. дел являются особо ценными. Отсюда задача – грамотно управлять огромным объемом документов.',
    'Перед архивными учреждениями Восточно-Казахстанской области стоят 2 основные задачи в области информационных технологий: ввести массив имеющихся в архиве значимых документов и обеспечить возможность оперативного полнотекстового доступа к электронным документам.',
    'В основные функции отделов входит развитие и совершенствование информационных технологий для обеспечения сохранности архивных документов и их использования, создание электронного архива для обеспечения физических и юридических лиц быстрым и эффективным доступом к документам, разработка информационных систем, предназначенных для поиска, накопления, анализа, распространения, передачи информации.'],
  SRC_TITLE: 'Информационные технологии в архивных учреждениях Восточно-Казахстанской области',
  missionHTML() {
    const m = (S().content || {}).mission || {}, own = String((lang === 'kz' ? m.kz : lang === 'en' ? m.en : m.ru) || m.ru || '').trim();
    if (own) return `<div class="mis-lead">${own.split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('')}</div>`;
    return `<p class="mis-note">${esc(t('misNote'))}</p>${ruNote()}<div class="mis-cards">${this.QUOTES.map((q, i) => `<blockquote class="mis-q"><b>${String(i + 1).padStart(2, '0')}</b><p>«${esc(q)}»</p></blockquote>`).join('')}</div><p class="mis-src">${esc(t('misSrc'))} <a href="#p/1593">${esc(this.SRC_TITLE)}</a>, ${esc(t('misAuthor'))}.</p>`;
  },
  photos() {
    const cap = (k, n) => ({ru:T[k][0] + (n ? ' · ' + n : ''), kz:T[k][1] + (n ? ' · ' + n : ''), en:T[k][2] + (n ? ' · ' + n : '')});
    const own = (Store.data.photos || []).filter(p => p.slot === 'inst' && p.src).map(p => ({s:p.src, c:p.cap || {}}));   // добавленные сотрудниками в админке («Фото»)
    return [{s:'img/building.jpg', c:cap('igBuilding')}].concat([1, 2, 3, 4].map(i => ({s:'img/inst/reading-' + i + '.jpg', c:cap('igReading', i)})), own);
  },
  galleryHTML() {
    this.list = this.photos();
    return this.list.map((p, i) => `<li><button type="button" class="ig" data-act="inst-lb" data-v="${i}"><img src="${esc(p.s)}" alt="${esc(LK(p.c))}" loading="lazy" decoding="async"><span>${esc(LK(p.c))}</span></button></li>`).join('');
  }
};
const HOME_ITEMS = 1;   // ультраминимализм главной: в блоках с фото (документы, выставки) по одной записи
const Home = {
  render() {
    put('#mis-body', About.missionHTML()); put('#inst-gal', About.galleryHTML());
    put('#hero-ql', [['#catalog', 'qlCat', 'i-book'], ['#expo', 'qlExpo', 'i-frame'], ['#contacts', 'qlBr', 'i-pin'], ['#memory', 'qlMem', 'i-clock']].map(([h, k, ic]) => `<a class="hero-ql-a" href="${h}">${tzIc(ic)}<span>${esc(t(k))}</span></a>`).join(''));
    put('#hero-adv', `<a class="text-link sm" href="#catalog?adv=1">${esc(t('homeAdv'))}</a>`);
    put('#home-info', [['#visitors/guide', 'catHow', 'i-search'], ['#visitors/faq', 'tFaq', 'i-question'], ['#visitors/reading', 'tReading', 'i-book'], ['#about/docs', 'tDocs', 'i-doc']].map(([h, k, ic]) => `<li><a href="${h}">${tzIc(ic)}<span>${esc(t(k))}</span></a></li>`).join(''));
    put('#home-soc', socialHTML() + shareHTML());
    const hf = $('#home-search');
    if (hf && !hf.querySelector('#hs-cat')) hf.insertAdjacentHTML('beforeend', `<button class="btn ghost" id="hs-cat" type="submit">${tzIc('i-book')}<span></span></button>`);
    const hb = $('#hs-cat'); if (hb) { hb.querySelector('span').textContent = t('inCat'); hb.setAttribute('aria-label', t('inCatA')); hb.title = t('inCatA'); }
    put('#about-links', `<h3>${esc(t('aboutMore'))}</h3><ul>${[['#p/1336', 'aStruct', 'i-doc'], ['#about/history', 'tHistA', 'i-clock'], ['#about/team', 'tTeamA', 'i-shield'], ['#about/docs', 'tDocsA', 'i-doc']].map(([h, k, ic]) => `<li><a href="${h}">${tzIc(ic)}<span>${esc(t(k))}</span></a></li>`).join('')}</ul>`);
    const brs = allPlaces().filter(p => p.type === 'branch');
    put('#home-br', brs.map(p => `<li><a href="#contacts" data-act="br-go" data-v="${esc(p.key)}"><b>${esc(p.name)}</b><span>${esc(/^г\.\s/.test(p.addr) ? p.addr : p.town + ', ' + p.addr)}</span>${p.phones && p.phones[0] ? `<small>${esc(p.phones[0])}</small>` : ''}</a></li>`).join(''));
    /* главная: только карточки с фото, без повторов одного снимка, по HOME_ITEMS штук */
    Promise.all([TZD.get('home'), TZD.get('expo').catch(() => ({items:[]}))]).then(([h, e]) => {
      const docs = (h.docs || []).filter(r => r.img).slice(0, HOME_ITEMS);
      put('#home-docs', docs.map(r => `<li><a class="hdoc" href="#catalog/${encodeURIComponent(r.id)}"><span class="hdoc-i pf">${pfImg(r.img, '')}</span><span class="hdoc-b"><small>${esc(r.y || '')}</small><b>${esc((s2 => s2.length > 150 ? s2.slice(0, 140).replace(/\s+\S*$/, '') + '…' : s2)(LK(r.t)))}</b><code>${esc(r.c || '')}</code></span></a></li>`).join(''));
      const sd = $('#home-docs-sec'); if (sd) sd.hidden = !docs.length;
      const used = new Set(), seen = new Set(), pick = [];
      const pool = (h.expo || []).concat((Store.data.items || []).filter(x => x.type === 'expo').map(x => ({...x, kind:'doc'})), e.items || []);
      for (const x of pool) {
        if (pick.length >= HOME_ITEMS || !x || seen.has(x.id)) continue; seen.add(x.id);
        const c = Expo.covers(x).find(s => !used.has(s)); if (!c) continue;   // нет фото или все его снимки уже на других карточках
        used.add(c); pick.push(Expo.cardHTML(x, c));
      }
      put('#home-expo', pick.join(''));
    }).catch(() => { const s = $('#home-docs-sec'); if (s) s.hidden = true; });
  }
};

/* ================= ИИ: краткое содержание, даты, имена и связанные материалы ================= */
const AiSum = {
  async run(id) {
    const box = $('#ai-box'); if (!box) return;
    const r = Cat.byId && Cat.byId.get(id); if (!r) return;
    box.hidden = false; box.innerHTML = `<p class="muted">${esc(t('aiWait'))}</p>`;
    let text = r.tx || '';
    if (!text && r.src && PIDX.has(String(r.src))) { try { const p = await Pages.get(String(r.src)); text = (pBody(p).md || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*#|>_]/g, ' '); } catch (e) {} }
    text = String(text || LK(r.t)).slice(0, 12000);
    let ai = null;
    if (/^https?:$/.test(location.protocol) && !IN_PREVIEW) {
      try { const res = await fetch('/api/ai/summary', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title:LK(r.t), text, lang})}); if (res.ok) ai = await res.json(); } catch (e) {}
    }
    const loc = this.local(text);
    const rel = Cat.related(r);
    const sum = ai && ai.summary ? ai.summary : loc.summary;
    const dates = ai && Array.isArray(ai.dates) && ai.dates.length ? ai.dates : loc.dates;
    const names = ai && Array.isArray(ai.names) && ai.names.length ? ai.names : loc.names;
    box.innerHTML = `<h3>${tzIc('i-sparkle')} ${esc(t('aiSumT'))}</h3><p>${esc(sum)}</p>
      ${dates.length ? `<p><b>${esc(t('aiDates'))}:</b> ${dates.slice(0, 10).map(esc).join(', ')}</p>` : ''}
      ${names.length ? `<p><b>${esc(t('aiNames'))}:</b> ${names.slice(0, 12).map(esc).join(', ')}</p>` : ''}
      ${rel.length ? `<p><b>${esc(t('aiRel'))}:</b> ${rel.slice(0, 4).map(x => `<a href="#catalog/${encodeURIComponent(x.id)}">${esc(LK(x.t))}</a>`).join('; ')}</p>` : ''}
      <p class="muted sm">${esc(ai && ai.summary ? (lang === 'kz' ? 'ЖИ жасаған. Түпнұсқамен тексеріңіз.' : lang === 'en' ? 'Written by AI. Check against the source.' : 'Составлено ИИ. Проверяйте по первоисточнику.') : t('aiLocal'))}</p>`;
  },
  local(text) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    const sents = clean.split(/(?<=[.!?])\s+(?=[А-ЯЁA-ZӘҒҚҢӨҰҮҺІ])/).filter(s => s.length > 30);
    const summary = sents.slice(0, 2).join(' ').slice(0, 420) || clean.slice(0, 300);
    const dates = [...new Set((clean.match(/\b\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+\d{4}|\b\d{1,2}\.\d{1,2}\.\d{2,4}|\b(?:1[6-9]|20)\d{2}\s*(?:г\.|года|году|гг\.)/g) || []).map(s => s.trim()))];
    const names = [...new Set((clean.match(/\b[А-ЯЁ][а-яё]+(?:ов|ев|ин|ын|ий|ая|ова|ева|ина|ына|ский|ская|енко|ук|юк)\s+[А-ЯЁ]\.\s*[А-ЯЁ]\.|\b[А-ЯЁ]\.\s*[А-ЯЁ]\.\s*[А-ЯЁ][а-яё]{2,}/g) || []).map(s => s.replace(/\s+/g, ' ')))];
    return {summary, dates, names};
  }
};

/* ================= ИИ-помощник: поиск по каталогу и источники в ответах (ТЗ 3.4 доп.) =================
   Помощник отвечает по открытым материалам: перед вопросом ищем записи в электронном каталоге и отдаём ИИ их список с маркерами [S1], [S2]…
   Ссылаться можно только на них: маркеры в ответе проверяются и превращаются в ссылки на карточки, чужие ссылки и шифры, которых нет в списке, отсекаются или помечаются.
   Записи с ограниченным доступом в список не попадают: ИИ узнаёт только, что такие записи есть. */
const AiSrc = {
  RESTRICT: /личн[а-яёәғқңөұүһіa-z0-9]*\s+дел|закрыт[а-яёәғқңөұүһіa-z0-9]*\s+(?:дел|документ|архив|фонд|материал)|секретн|ограниченн[а-яёәғқңөұүһіa-z0-9]*\s+доступ|персональн[а-яёәғқңөұүһіa-z0-9]*\s+данн|конфиденц|(?:^|\s)дсп(?![а-яё])|жабық\s+құжат|құпия|restricted|classified|confidential|personal data/i,
  /* служебные слова вопроса: по ним в каталоге ничего искать не надо */
  NOISE: /^(что|как|где|когда|кто|какой|какая|какие|какое|каких|сколько|расскаж[а-яёәғқңөұүһіa-z0-9]*|подскаж[а-яёәғқңөұүһіa-z0-9]*|скаж[а-яёәғқңөұүһіa-z0-9]*|можно|можете|это|этот|эти|имеется|имеются|материал[а-яёәғқңөұүһіa-z0-9]*|информац[а-яёәғқңөұүһіa-z0-9]*|сведен[а-яёәғқңөұүһіa-z0-9]*|данн[а-яёәғқңөұүһіa-z0-9]*|хочу|хотел[а-яёәғқңөұүһіa-z0-9]*|интересу[а-яёәғқңөұүһіa-z0-9]*|покаж[а-яёәғқңөұүһіa-z0-9]*|дайте|дай|предостав[а-яёәғқңөұүһіa-z0-9]*|пожалуйста|what|which|show|tell|about|any|there|have|please|are|is|me|you|do|does|find|looking|documents?|нет|или|не|ли|мне|нам|также|еще|ещё|каталог[а-яёәғқңөұүһіa-z0-9]*|сайт[а-яёәғқңөұүһіa-z0-9]*|баз[аеуы][а-яёәғқңөұүһіa-z0-9]*|раздел[а-яёәғқңөұүһіa-z0-9]*|электронн[а-яёәғқңөұүһіa-z0-9]*|catalog[а-яёәғқңөұүһіa-z0-9]*|site|database|қандай|бар|барма|қанша|қайда|қашан|неше|не|жайлы|көрсет[а-яёәғқңөұүһіa-z0-9]*|айт[а-яёәғқңөұүһіa-z0-9]*|тап[а-яёәғқңөұүһіa-z0-9]*|маған|сізде|керек|жоқ)$/i,
  /* вопрос → запрос для каталога («Что есть про Риддер в 1941 году?» → «Риддер 1941»), чтобы ссылка «все результаты» давала тот же поиск */
  cleanQ(q) {
    const bare = w => w.replace(/^[«"(]+|[»"?!.,;:)]+$/g, '');
    return String(q || '').split(/\s+/).map(bare).filter(w => w && !this.NOISE.test(w) && !/^(в|во|на|и|по|о|об|из|за|для|с|со|к|у|от|до|про|есть|году|года|годах|годы)$/i.test(w)).join(' ');
  },
  /* Тип вопроса. Раньше любой вопрос шёл в каталог, и на «когда работает читальный зал» помощник приводил выставку «Усть-Каменогорск в фотографиях».
     info — справочный вопрос про архив, услуги, адреса, правила: отвечаем по фактам сайта, каталог и «Ещё на сайте» не трогаем;
     search — ищут материалы (вид, год, место, тема, человек): отвечаем по найденным записям с источниками;
     chat — приветствие, благодарность. Закрытые и персональные данные всегда идут по пути search: там их обрабатывает отдельное правило. */
  FAQ_LINK: {route:'#contacts', hours:'#contacts', phone:'#contacts', genealogy:'#visitors/genealogy', reading:'#visitors/reading', history:'#about/history', branches:'#visitors/branches', store:'#fonds/store', about:'#about', cert:'#visitors/cert', appeal:'#visitors/faq'},
  intent(q) {
    const s = String(q || ''), n = norm(s);
    if (this.RESTRICT.test(s)) return {kind:'search', faq:null};
    let faq = null, best = 0; const nn = ' ' + n + ' ';
    FAQ.forEach(f => { const sc = f.kw.reduce((a, k) => a + (nn.includes(k) ? 1 : 0), 0); if (sc > best) { faq = f.id; best = sc; } });
    if (faq === 'hello' || faq === 'thanks') return {kind:'chat', faq};
    const p = SemQ.parse(s), words = p.words.filter(w => !this.NOISE.test(w)).map(w => SemQ.stem(norm(w))).filter(w => w.length > 2);
    const serviceFaq = ['route', 'hours', 'phone', 'reading', 'cert', 'appeal', 'review', 'genealogy', 'about'].includes(faq);
    const how = /(как |где |когда |сколько |можно ли|нужно ли|какие правила|какой режим|что нужно|қалай|қайда|қашан|қанша|how |where |when |what do i need)/.test(nn);
    if (p.k || p.y0) return serviceFaq && how && !p.k ? {kind:'info', faq} : {kind:'search', faq};   // явно просят материалы вида или года
    if (p.pl && !['branches', 'route', 'hours', 'phone', 'cert', 'reading'].includes(faq)) return {kind:'search', faq};
    if (faq && best >= 1) return {kind:'info', faq};
    return {kind:words.length ? 'search' : 'chat', faq:null};
  },
  async find(q) {
    const out = {hits:[], total:0, limited:0, restricted:this.RESTRICT.test(String(q || '')), ok:false, q:String(q || ''), cq:this.cleanQ(q)};
    let items, mem = null, expo = null; try { items = await Cat.load(); } catch (e) { return out; }
    try { [mem, expo] = await Promise.all([TZD.get('memory'), TZD.get('expo')]); } catch (e) {}   // люди «Архива памяти» и выставки: без них ищем только по каталогу
    out.ok = true;
    const p = SemQ.parse(q), words = p.words.filter(w => !this.NOISE.test(w)).map(w => SemQ.stem(norm(w))).filter(w => w.length > 2), struct = !!(p.k || p.top || p.pl || p.y0);
    out.asked = !!(words.length || struct);
    out.strong = !!(p.y0 || p.k);   // явно просят материалы определённого вида или года: это вопрос к каталогу, а не к справочным ответам
    if (!out.asked) return out;
    const need = words.length <= 2 ? words.length : Math.ceil(words.length * 0.6), res = [];
    for (const r of items) {
      if (p.k && !Cat.matchKind(r, p.k)) continue;
      if (p.top && !(r.top || []).includes(p.top)) continue;
      if (p.pl && !(r.pl || []).includes(p.pl)) continue;
      if (p.y0 || p.y1) { const a = r.y0 || r.y1, b = r.y1 || r.y0; if (!a) continue; if (p.y1 && a > p.y1) continue; if (p.y0 && b < p.y0) continue; }
      let sc = 0, hit = 0;
      for (const w of words) { if (r._t.includes(w)) { sc += 3; hit++; } else if (r._h.includes(w)) { sc += 1; hit++; } }
      if (hit < need) continue;
      if (words.length >= 2 && !words.some(w => r._t.includes(w))) continue;   // совпали только слова описания: это случайная запись
      res.push([sc + (words.length && hit === words.length ? 2 : 0) + (r.img ? .3 : 0), r]);
    }
    res.sort((a, b) => b[0] - a[0] || (a[1]._y || 9999) - (b[1]._y || 9999));
    const open = res.filter(x => x[1].acc !== 'limited');
    out.limited = res.length - open.length;
    const cut = (x, n) => String(x || '').replace(/\s+/g, ' ').trim().slice(0, n);
    const tail = (ttl, d) => { const h = ttl.replace(/…$/, ''); return d.startsWith(h) ? d.slice(h.length).trim() : d; };   // описание часто повторяет начало названия: ИИ достаточно продолжения
    const catHits = open.slice(0, 8).map(([, r]) => ({type:'cat', id:r.id, href:'#catalog/' + encodeURIComponent(r.id), t:LK(r.t), c:r.c || '', y:yRange(r.y0, r.y1) || r.dt || '', kind:t(KIND_T[r.k] || 'kDoc'), arch:Cat.archName(r.a), f:String(r.f || ''), d:tail(cut(LK(r.t), 400), cut(r.ds || r.nt, 400)).slice(0, 150)}));

    // люди «Архива памяти», выставки и фотоальбомы: то, что ищут вопросом «фото Риддера» или «герои Риддера», лежит не только в каталоге
    const people = [], expos = [], albums = [];
    const placeRx = p.pl ? (SemQ.places.find(x => x[0] === p.pl) || [])[1] : null, topRx = p.top ? SemQ.topics[p.top] : null;
    const rank = (hay, ttl, pls, tops) => {
      if (p.pl && !(pls.includes(p.pl) || (placeRx && placeRx.test(hay)))) return -1;
      if (p.top && !(tops.includes(p.top) || (topRx && topRx.test(hay)))) return -1;
      let sc = 0, hit = 0;
      for (const w of words) { if (ttl.includes(w)) { sc += 3; hit++; } else if (hay.includes(w)) { sc += 1; hit++; } }
      if (words.length >= 2 && !words.some(w => ttl.includes(w)) && !p.pl) return -1;
      return hit < need ? -1 : sc + (p.pl ? 4 : 0) + (p.top ? 1 : 0);
    };
    if ((p.pl || p.top || words.length) && (!p.k || p.k === 'photo' || p.k === 'pers')) {
      const extra = (Store.data.items || []).filter(x => x.type === 'memory' && x.mt === 'person').map(x => ({id:x.id, n:LK(x.t), g:x.gr || [], b0:x.b0, b1:x.b1, bio:LK(x.bio), img:x.img, top:x.top || [], pl:x.pl || []}));
      for (const pe of (mem ? extra.concat(mem.people) : [])) {
        if (p.k === 'photo' && !pe.img) continue;
        const sc = rank(norm([pe.n, pe.bio, (pe.g || []).join(' '), (pe.pl || []).join(' ')].join(' ')), norm(pe.n), pe.pl || [], pe.top || []);
        if (sc >= 0) people.push([sc + (pe.img ? .3 : 0), pe]);
      }
      people.sort((a, b) => b[0] - a[0]);
    }
    if ((p.pl || p.top || words.length) && (!p.k || p.k === 'photo')) {
      const ex = (Store.data.items || []).filter(x => x.type === 'expo').map(x => ({...x, kind:'doc'})).concat(expo ? expo.items : []);
      for (const e of ex) {
        if (p.y0 || p.y1) { const a = e.y0 || e.y1, b = e.y1 || e.y0; if (a && ((p.y1 && a > p.y1) || (p.y0 && b < p.y0))) continue; }
        const sc = rank(norm([LK(e.t), LK(e.tx)].join(' ')), norm(LK(e.t)), [], e.top || []);
        if (sc >= 0) expos.push([sc, e]);
      }
      expos.sort((a, b) => b[0] - a[0]);
      const alPeople = new Map(); people.forEach(([, pe]) => (pe.alb || []).forEach(([aid]) => alPeople.set(aid, (alPeople.get(aid) || 0) + 1)));   // альбом, в котором лежат фото найденных людей
      for (const al of (window.SITE && SITE.galleryAlbums) || []) {
        const ttl = norm(LK(al.t)), sc = rank(ttl, ttl, [], []);
        if (sc >= 0 && (p.pl || words.length)) albums.push([sc, al, alPeople.get(al.id) || 0]);
        else if (alPeople.has(al.id)) albums.push([alPeople.get(al.id), al, alPeople.get(al.id)]);
      }
      albums.sort((a, b) => b[0] - a[0]);
    }
    // человек из «Архива памяти» и его фото в каталоге — один источник с двумя ссылками
    const used = new Set(), twin = ttl => people.find(([, x]) => norm(x.n).length > 5 && norm(ttl).startsWith(norm(x.n)));
    open.forEach(([, r]) => { const pe = twin(LK(r.t)); if (pe) used.add(pe[1].id); });   // учитываем весь найденный каталог, а не только показанное
    catHits.forEach(h => { const pe = twin(h.t); if (pe) h.alt = {h:'#memory/person/' + encodeURIComponent(pe[1].id), l:t('memTitle')}; });
    const pplLeft = people.filter(([, x]) => !used.has(x.id));
    const pplHits = pplLeft.slice(0, 6).map(([, x]) => ({type:'person', id:x.id, href:'#memory/person/' + encodeURIComponent(x.id), t:x.n, c:'', y:yRange(x.b0, x.b1), kind:t('memTitle') + ' · ' + (x.g || []).slice(0, 2).join(', '), arch:'', f:'', d:tail(x.n, cut(x.bio, 400)).slice(0, 150)}));
    const expoHits = expos.slice(0, 3).map(([, e]) => ({type:'expo', id:e.id, href:'#expo/' + encodeURIComponent(e.id), t:LK(e.t), c:'', y:yRange(e.y0, e.y1), kind:t('aiTExpo'), arch:'', f:'', d:cut(LK(e.tx), 170)}));
    const albHits = albums.slice(0, 2).map(([, a, k]) => ({type:'album', id:'al' + a.id, href:'#region/photo', t:LK(a.t), c:'', y:'', kind:t('aiTAlbum'), arch:'', f:'', d:[a.n ? fmt(t('aiAlbN'), {n:a.n}) : '', k ? fmt(t('aiAlbP'), {n:k}) : ''].filter(Boolean).join('; ')}));
    out.hits = catHits.concat(pplHits, expoHits, albHits).map((h, i) => ({...h, n:i + 1}));
    out.total = open.length + pplLeft.length + expos.length + albums.length;
    out.counts = {cat:open.length, people:people.length, expo:expos.length, albums:albums.length};
    return out;
  },
  /* кусок системного запроса: найденные записи и правила обращения с источниками */
  prompt(src) {
    if (!src || !src.ok) return '';
    const rules = [
      'Правила работы с источниками (обязательны):',
      '- Ссылаться на записи каталога можно только маркерами [S1], [S2] из списка выше (в конце утверждения, которое запись подтверждает). Маркеры [S1], [S2] ставь на любом языке ответа, в том числе по-казахски и по-английски. Не придумывай шифры, номера фондов и описей, годы, названия записей и ссылки: используй только написанное в списке.',
      '- Записи типа «Фотодокументы» и люди из «Архива памяти» с фотографиями — это архивные фотографии: так их и называй (например, «фотография Токаревой А. Н., 1966») и не говори, что фотографий нет или что записи «не про фото». Перечисляй найденное, а не рассуждай о том, чего в списке нет.',
      '- Лениногорск — прежнее название города Риддер (на сайте: «Лениногорский (ныне Риддерский)»): записи про Лениногорск относятся к Риддеру.',
      '- Если посетитель просит фотографии, материалы, людей или документы по месту, теме или годам, перечисли КАЖДУЮ запись из списка, ничего не пропуская (с именами людей, названиями выставок и альбомов, годами), по одной строке на запись, и в конце каждой строки поставь её маркер. Не отсылай посетителя искать самому там, где записи уже найдены. Если называешь число записей, оно должно совпадать с числом перечисленных. Не пересказывай того, чего нет в описании записи. Если записей больше, чем показано, скажи об этом.',
      '- Если ни одна запись не отвечает на вопрос или записей нет, прямо скажи: «в каталоге, Архиве памяти и выставках ничего подходящего не нашлось», и предложи уточнить запрос (место, годы, тема) или обратиться в читальный зал или приёмную. Не заменяй отсутствующий источник догадкой.',
      '- Отвечай только на последний вопрос посетителя и только по списку выше. Прежние ответы в диалоге опирались на другие списки записей: не исправляй, не комментируй и не повторяй их.',
      '- Не утверждай, что в архиве чего-то нет вообще или что тема не представлена: говори только о результате поиска по открытому каталогу.',
      '- Ты работаешь только с открытыми материалами. Личные дела, закрытые и персональные данные, сведения о конкретных людях не раскрывай и не пересказывай.'
    ];
    if (src.restricted || src.limited) rules.push('- ' + (src.restricted ? 'Вопрос касается закрытых или персональных данных: объясни, что помощник и сайт показывают только открытые материалы, такие сведения здесь не выдаются, а законный путь — архивная справка на eGov.kz или работа в читальном зале (телефон приёмной есть в фактах выше). ' : '') + (src.limited ? `По теме есть записи с ограниченным доступом (${src.limited}): их содержание не раскрывай, скажи только, что доступ к ним ограничен.` : ''));
    if (!src.hits.length) return 'Поиск по открытому каталогу, «Архиву памяти» (люди), выставкам и фотоальбомам: по вопросу ничего не найдено.\n' + rules.join('\n');
    const c = src.counts || {};
    return `Материалы сайта, найденные по вопросу (открытый каталог, «Архив памяти» с людьми, выставки, фотоальбомы): всего ${src.total} (каталог ${c.cat || 0}, люди ${c.people || 0}, выставки ${c.expo || 0}, альбомы ${c.albums || 0})${src.total > src.hits.length ? `, ниже первые ${src.hits.length}` : ''}.\n` +
      src.hits.map(h => `[S${h.n}] «${h.t}»; тип: ${h.kind}${h.c ? '; шифр: ' + h.c : ''}${h.y ? '; годы: ' + h.y : ''}${h.arch ? '; архив: ' + h.arch : ''}${h.alt ? '; есть и страница в «Архиве памяти»' : ''}${h.d ? '; описание: ' + h.d : ''}`).join('\n') + '\n' + rules.join('\n');
  },
  /* ссылки на разделы сайта в ответе ИИ: оставляем только существующие маршруты, выдуманные превращаем в обычный текст */
  fixLinks(s) {
    return String(s || '').replace(/\[([^\]]+)\]\((#[^)\s]*)\)/g, (m, tx, h) => {
      if (/^#(?:catalog|memory\/person|expo)\//.test(h)) return m;   // эти ссылки уже проверены по списку найденного
      const {v, tab} = parseHash(h);
      if (v === 'p') return m;
      if (!VIEWS.includes(v) || v === 'admin') return tx;
      if (HUBS[v] && tab && !HUBS[v].includes(tab)) return tx;
      return m;
    });
  },
  /* проверка ответа ИИ: маркеры → ссылки на найденные записи, чужие ссылки на каталог убираем, неизвестные номера фондов помечаем */
  cite(text, src) {
    const hits = (src && src.hits) || [], by = new Map(hits.map(h => [h.n, h])), dec = x => { try { return decodeURIComponent(x); } catch (e) { return x; } }, ok = new Set(), used = [];
    hits.forEach(h => { ok.add(dec(h.href)); if (h.alt) ok.add(dec(h.alt.h)); });
    let s = String(text || '').replace(/\[\s*(S\d+(?:\s*[,;]\s*S\d+)+)\s*\]/g, (m, g) => g.split(/\s*[,;]\s*/).map(x => `[${x}]`).join(' ')).replace(/[ \t]*[\[(]S(\d+)[\])]/g, (m, n) => { const h = by.get(+n); if (!h) return ''; if (!used.includes(h)) used.push(h); return ` [${h.n}](${h.href})`; });
    // ссылки на карточки каталога, людей и выставки: только те, что нашлись по этому вопросу
    s = s.replace(/\[([^\]]+)\]\((#(?:catalog|memory\/person|expo)\/[^)\s]+)\)/g, (m, tx, h) => ok.has(dec(h)) ? m : tx);
    const known = new Set(), asked = String(src && src.q || '');
    hits.forEach(h => [h.f, h.c, h.t, h.d].join(' ').replace(/\d+/g, n => { known.add(n); return ''; }));
    const bad = [...s.matchAll(/(?:^|[\s(«])Ф\.?\s*№?\s*(\d{1,5})(?!\d)/g)].map(x => x[1]).filter(n => !known.has(n) && !asked.includes(n));
    s = this.fixLinks(s);
    return {text:s, used, warn:bad.length > 0};
  }
};

/* ================= маршрутизация новых разделов ================= */
const TZ = {
  route(v, rest, qs) {
    if (v === 'catalog') Cat.route(rest, qs);
    else if (v === 'memory') Mem.route(rest, qs);
    else if (v === 'expo') Expo.route(rest, qs);
    else if (v === 'my') My.render();
    else if (v === 'stats') PubStats.render();
    else if (v === 'contacts') { Br.render(); if (rest) { Br.select(decodeURIComponent(rest)); } }
    if (v !== 'admin') Stat.push('view', v);   // все разделы, кроме панели сотрудников
  },
  navFor(v) { return ({fonds:'catalog', region:'memory', page:''})[v] ?? v; },
  theme() {   // переключатель светлой/тёмной темы в шапке; режим «чёрно-жёлтый» остаётся в версии для слабовидящих
    const dark = document.documentElement.dataset.scheme === 'dark';
    const b = $('#theme-btn'); if (!b) return;
    b.setAttribute('aria-pressed', String(dark)); b.title = t(dark ? 'themeToggleL' : 'themeToggle'); b.setAttribute('aria-label', b.title);
    b.innerHTML = tzIc(dark ? 'i-sun' : 'i-moon') + `<span class="t1">${esc(t(dark ? 'themeLight' : 'themeDark'))}</span>`;
  },
  foot() {
    { const has = socials().length; put('#foot-soc', has ? socialHTML('foot') : ''); const col = $('#foot-soc') && $('#foot-soc').parentElement; if (col) col.hidden = !has; }   // нет ссылок — столбца «Социальные сети» в подвале нет; появятся в админке — покажется
    put('#head-soc', socials().length ? socialHTML('head') : '');
    put('#foot-copy', esc(fmt(t('copy'), {y:new Date().getFullYear()})));
  },
  renderAll() {
    Home.render(); this.theme(); this.foot(); applySite();
    const v = current; const {rest, qs} = parseHash(location.hash);
    if (['catalog', 'memory', 'expo'].includes(v)) this.route(v, rest, qs);
    if (v === 'contacts') Br.render();
    LBZ.init();
    const sp = $('#tz-sprite'); if (!sp) document.body.insertAdjacentHTML('afterbegin', TZ_SPRITE);
  }
};
const TZ_SPRITE = `<svg id="tz-sprite" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/></symbol>
  <symbol id="i-box" viewBox="0 0 24 24"><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5L12 12l8.5-4.5M12 12v9"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></symbol>
  <symbol id="i-folder" viewBox="0 0 24 24"><path d="M3.5 6.5h6l2 2h9v10h-17z"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5c3-1.5 6-1.5 8 .5 2-2 5-2 8-.5v14c-3-1.5-6-1.5-8 .5-2-2-5-2-8-.5zM12 5.5v14"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></symbol>
  <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M16.5 16.5L21 21"/></symbol>
  <symbol id="i-minus" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M16.5 16.5L21 21"/></symbol>
  <symbol id="i-fit" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></symbol>
  <symbol id="i-frame" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M6.5 16l4-4.5 3 3 2-2 2.5 3.5"/><circle cx="15.5" cy="8.5" r="1.3"/></symbol>
  <symbol id="i-locate" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="7.5"/></symbol>
  <symbol id="i-route" viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/></symbol>
  <symbol id="i-tg" viewBox="0 0 24 24"><path d="M21 4.5L3 11.3l5.6 2 2.1 6.2 3.2-3.7 4.9 3.7z M8.6 13.3L18 7.2"/></symbol>
  <symbol id="i-ig" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24"><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5z"/></symbol>
  <symbol id="i-yt" viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9l5 3-5 3z"/></symbol>
  <symbol id="i-vk" viewBox="0 0 24 24"><path d="M3 7.5h3c.7 3.5 2.3 5.6 3.5 6V7.5h3v3.3c1.5-.2 2.8-1.8 3.4-3.3h2.9c-.5 2.2-2.3 3.9-3.4 4.6 1.2.6 3 2.1 3.8 4.4h-3.2c-.7-1.6-2.1-2.9-3.5-3v3H11C6.3 16.5 3.6 13 3 7.5z"/></symbol>
  <symbol id="i-tt" viewBox="0 0 24 24"><path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3M14 3.5c.5 2.5 2.4 4.3 5 4.5"/></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path d="M4 20l1.2-4A8.3 8.3 0 1 1 8.2 19z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2z"/></symbol>
</defs></svg>`;

/* события новых разделов */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, v = el.dataset.v;
  const upd = patch => { const st = {...Cat.st, ...patch}; Object.keys(st).forEach(k => { if (st[k] === '' || st[k] == null) delete st[k]; }); if (!('p' in patch)) delete st.p; Cat.go(st); };
  switch (act) {
    case 'cat-adv': { const box = $('#cat-advbox'); const open = box.hidden; box.hidden = !open; el.setAttribute('aria-expanded', String(open)); Cat.st.adv = open ? '1' : ''; try { history.replaceState(null, '', '#catalog' + Cat.toQS(Cat.st)); } catch (er) {} break; }
    case 'cat-rm': upd(v === 'per' ? {y0:'', y1:''} : {[v]:''}); break;
    case 'cat-reset': Cat.go({}); break;
    case 'cat-k': upd({k:v}); break;
    case 'cat-per': { const [a, b] = v.split('-'); const on = Cat.st.y0 === a && Cat.st.y1 === b; upd({y0:on ? '' : a, y1:on ? '' : b}); break; }
    case 'cat-top': upd({top:Cat.st.top === v ? '' : v}); break;
    case 'cat-arch': upd({a:Cat.st.a === v ? '' : v}); break;
    case 'cat-page': upd({p:v}); window.scrollTo({top:($('#cat-root') || document.body).offsetTop - 80}); break;
    case 'cat-try': Cat.go({q:v}); break;
    case 'cat-fav': { const now = Fav.toggle(v); $$(`[data-act="cat-fav"][data-v="${CSS.escape(v)}"]`).forEach(b => { b.setAttribute('aria-pressed', String(now)); const s = b.querySelector('span'); if (s) s.textContent = t(now ? 'cFavOn' : 'cFav'); else { b.setAttribute('aria-label', t(now ? 'cFavOn' : 'cFav')); b.title = t(now ? 'cFavOn' : 'cFav'); } }); toast(t(now ? 'cFavOn' : 'cFav')); break; }
    case 'cat-copy': tzCopy(v, t('cCopied')); break;
    case 'cat-share': tzShare(v); break;
    case 'cat-zoom': Cat.zoom(+v); break;
    case 'cat-yt': { const box = el.parentNode; box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v)}?autoplay=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`; break; }
    case 'expo-ex': Expo.open(v, +el.dataset.k); break;
    case 'mem-ph': Mem.photos(v, el.dataset.k); break;
    case 'mem-more': Mem.lim = Infinity; Mem.home(Mem.sec || 'people'); break;
    case 'mem-f': { Mem.fo[v] = !Mem.fo[v]; const p = $('#mem-fp'); if (p) p.hidden = !Mem.fo[v]; el.setAttribute('aria-expanded', String(!!Mem.fo[v])); break; }
    case 'mem-set': { const k = el.dataset.k, st = {...Mem.st}; if (!v || st[k] === v) delete st[k]; else st[k] = v; Mem.setSt(st); break; }
    case 'ex-f': { Expo.fo = !Expo.fo; const p = $('#ex-fp'); if (p) p.hidden = !Expo.fo; el.setAttribute('aria-expanded', String(Expo.fo)); break; }
    case 'mem-rm': { const st = {...Mem.st}; if (v === '*') ['per', 'top', 'pl', 'g', 'au', 'pk'].forEach(k => delete st[k]); else delete st[v]; Mem.setSt(st); break; }
    case 'hm-pick': { const p = (Mem.hpts || []).find(x => x.id === v); if (p && Mem.hmap) { Mem.hmap.open(p); const b = $('#hmap'); if (b) b.scrollIntoView({block:'center', behavior:'smooth'}); } break; }
    case 'lb-z': LBZ.zoom(+v); break;
    case 'br-f': Br.f = v; Br.list(); $$('[data-act="br-f"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); break;
    case 'br-sel': e.preventDefault(); Br.select(v); break;
    case 'br-go': e.preventDefault(); Br.sel = v; location.hash = '#contacts'; break;
    case 'br-geo': Br.geo(); break;
    case 'ai-sum': AiSum.run(v); break;
    case 'theme': prefs.scheme = document.documentElement.dataset.scheme === 'dark' ? 'light' : 'dark'; applyPrefs(); TZ.theme(); break;
  }
});
document.addEventListener('submit', e => {
  if (e.target.id === 'cat-form') {
    e.preventDefault();
    const fd = new FormData(e.target), st = {};
    fd.forEach((val, k) => { if (String(val).trim()) st[k] = String(val).trim(); });
    if (!$('#cat-advbox').hidden) st.adv = '1';
    Cat.go(st);
  } else if (e.target.id === 'br-route') {
    e.preventDefault();
    Br.mode = (e.target.querySelector('[name="br-mode"]:checked') || {}).value || 'car';
    Br.route($('#br-from').value);
  } else if (e.target.matches('[data-mem-form]')) e.preventDefault();
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.matches('[data-cat-auto]')) { const st = {...Cat.st}; if (el.type === 'checkbox') { if (el.checked) st[el.name] = '1'; else delete st[el.name]; } else { if (el.value) st[el.name] = el.value; else delete st[el.name]; } delete st.p; Cat.go(st); }
  else if (el.matches('[data-mem-auto]')) memFilter(el.form);
  else if (el.name === 'br-mode') { Br.mode = el.value; Br.card(); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'br-q') { Br.q = e.target.value; Br.list(); }
  else if (e.target.closest && e.target.closest('[data-mem-form]') && e.target.name === 'q') { clearTimeout(Mem.t); Mem.t = setTimeout(() => memFilter(e.target.form), 250); }
});
function memFilter(form) {
  const st = {...Mem.st}; new FormData(form).forEach((v, k) => { if (v) st[k] = v; else delete st[k]; });
  const sec = form.dataset.memForm; const u = new URLSearchParams(st).toString();
  try { history.replaceState(null, '', '#memory/' + sec + (u ? '?' + u : '')); } catch (er) {}
  Mem.st = st; const focus = document.activeElement && document.activeElement.name; Mem.home(sec);
  if (focus) { const el = $(`[data-mem-form] [name="${focus}"]`); if (el) { el.focus(); if (el.setSelectionRange && el.value) el.setSelectionRange(el.value.length, el.value.length); } }
}

/* ---------- вкладки справки и политика конфиденциальности ---------- */
Object.assign(PANELS.visitors, {site:() => guideHTML('site'), guide:() => guideHTML('guide'), links:linksHTML});
FAQS.unshift(...FAQ_SITE);
const PRIVACY = [
`Сайт Государственного архива Восточно-Казахстанской области — справочный ресурс. Он **не собирает и не хранит персональные данные** посетителей: здесь нет регистрации, личных кабинетов, заявлений и платежей.

## Что хранится в вашем браузере
Только настройки, которые вы выбрали сами: язык, тема, размер шрифта, список «Избранное». Они лежат в локальном хранилище браузера и никуда не передаются. Очистить их можно в настройках браузера.

## Что видит сервер сайта
- **Обезличенная статистика**: какие разделы открывают и какие поисковые запросы ничего не нашли. Без IP-адресов, имён и других сведений о посетителе. Она нужна, чтобы улучшать каталог и навигацию.
- **Вопросы ИИ-помощнику** передаются на сервер для ответа. Не пишите в вопросах личные данные.
- **Отзывы** публикуются только после проверки сотрудником.

## Сторонние сервисы
Карты загружаются с серверов 2ГИС, видео — с YouTube (только после нажатия «Смотреть»). Их правила обработки данных действуют на их стороне. Ссылки «Поделиться» открывают выбранную соцсеть.

## Законодательство
Обработка персональных данных в Республике Казахстан регулируется Законом РК «О персональных данных и их защите» от 21 мая 2013 года № 94-V. Вопросы — в приёмную архива.`,
`Шығыс Қазақстан облысының мемлекеттік архиві сайты — анықтамалық ресурс. Ол келушілердің **дербес деректерін жинамайды және сақтамайды**: мұнда тіркелу, жеке кабинет, өтініш және төлем жоқ.

## Браузеріңізде не сақталады
Тек өзіңіз таңдаған баптаулар: тіл, тақырып, қаріп өлшемі, «Таңдаулылар» тізімі. Олар браузердің жергілікті қоймасында тұрады және ешқайда жіберілмейді. Оларды браузер баптауларынан тазалауға болады.

## Сайт сервері нені көреді
- **Иесіз статистика**: қай бөлімдер ашылатыны және қай іздеу сұраулары ештеңе таппағаны. IP-мекенжайсыз, есімсіз және келуші туралы басқа мәліметсіз. Ол каталог пен навигацияны жақсарту үшін керек.
- **ЖИ-көмекшіге сұрақтар** жауап алу үшін серверге жіберіледі. Сұрақтарға дербес деректерді жазбаңыз.
- **Пікірлер** қызметкер тексергеннен кейін ғана жарияланады.

## Үшінші тарап қызметтері
Карталар 2ГИС серверлерінен, бейнелер YouTube-тан («Көру» басылғаннан кейін ғана) жүктеледі. Олардың деректерді өңдеу ережелері өз тарапында әрекет етеді.

## Заңнама
Қазақстан Республикасында дербес деректерді өңдеу «Дербес деректер және оларды қорғау туралы» 2013 жылғы 21 мамырдағы № 94-V ҚР Заңымен реттеледі. Сұрақтар — архивтің қабылдау бөлмесіне.`,
`The State Archive of East Kazakhstan Region site is an informational resource. It **does not collect or store visitors’ personal data**: there is no registration, no personal accounts, no applications and no payments.

## What your browser keeps
Only the settings you choose: language, theme, font size and your Favourites list. They stay in your browser’s local storage and are not sent anywhere. Clear them in your browser settings.

## What the site server sees
- **Anonymous statistics**: which sections are opened and which searches found nothing. No IP addresses, names or other visitor details. They help improve the catalogue and navigation.
- **Questions to the AI assistant** are sent to the server to be answered. Please don’t include personal data.
- **Reviews** are published only after staff moderation.

## Third-party services
Maps load from 2GIS servers and videos from YouTube (only after you press Watch). Their own data rules apply.

## Legislation
Personal data processing in Kazakhstan is governed by the Law “On Personal Data and Their Protection” No. 94-V of 21 May 2013. Questions go to the archive reception.`];
{ const ra = TZ.renderAll.bind(TZ); TZ.renderAll = () => { ra(); put('#privacy-root', mdH(L(PRIVACY))); }; }

/* понятные адреса (/catalog/…, /expo/…, /p/123) и ?lang=: сервер отдаёт index.html, здесь переводим путь в #-маршрут */
{
  const qp = new URLSearchParams(location.search);
  const ql = qp.get('lang'); if (ql && LANGS.includes(ql)) { lang = prefs.lang = ql; }
  const path = location.pathname.replace(/^\/+|\/+$/g, '').replace(/^index\.html$/, '');
  if (path && !location.hash && /^(about|catalog|visitors|memory|expo|news|contacts|privacy|fonds|region|p)(\/|$)/.test(path)) {
    try { history.replaceState(null, '', '/' + (ql ? '?lang=' + ql : '') + '#' + path); } catch (e) {}
  }
}
/* админка не должна попадать в поиск */
{ const sh = show; show = function (v, f) { sh(v, f); let m = $('meta[name="robots"]'); if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); } m.content = v === 'admin' ? 'noindex, nofollow' : 'index, follow'; }; }

/* ================= административная панель по ТЗ: роли, материалы с проверкой, импорт CSV,
   распознавание сканов ИИ, аналитика, пользователи, журнал действий ================= */
Object.assign(T, {
  aItems:["Каталог и материалы","Каталог және материалдар","Catalogue & content"], aOcr:["Распознавание (ИИ)","Тану (ЖИ)","Recognition (AI)"], aStats:["Аналитика","Талдау","Analytics"],
  aUsers:["Пользователи","Пайдаланушылар","Users"], aJournal:["Журнал действий","Әрекеттер журналы","Activity log"], aLogin:["Логин","Логин","Login"],
  aRole:["Роль","Рөлі","Role"], aBranchF:["Филиал","Филиал","Branch"], aActive:["Активен","Белсенді","Active"], aNewPwd:["Пароль (не короче 10 символов)","Құпиясөз (10 таңбадан кем емес)","Password (10+ characters)"],
  aSave:["Сохранить","Сақтау","Save"], aDel:["Удалить","Жою","Delete"], aEdit:["Изменить","Өзгерту","Edit"], aNew:["Новая запись","Жаңа жазба","New record"], aCancel:["Отмена","Болдырмау","Cancel"],
  aType:["Раздел","Бөлім","Section"], aTypeCat:["Каталог","Каталог","Catalogue"], aTypeExpo:["Выставка","Көрме","Exhibition"], aTypeMem:["Архив памяти: события и люди","Жад мұрағаты: оқиғалар мен адамдар","Memory archive: events and people"],
  aToReview:["На проверку","Тексеруге","Send for review"], aApprove:["Одобрить","Мақұлдау","Approve"], aPublish:["Опубликовать","Жариялау","Publish"], aRework:["На доработку","Пысықтауға","Return for rework"], aArchive:["В архив","Мұрағатқа","Archive"],
  aNote:["Комментарий к статусу","Мәртебеге түсініктеме","Status note"], aBy:["автор","автор","by"], aImport:["Импорт CSV","CSV импорттау","Import CSV"], aExport:["Экспорт CSV","CSV экспорттау","Export CSV"], aTemplate:["Шаблон CSV","CSV үлгісі","CSV template"],
  aIoTitle:["Импорт и экспорт: CSV и Excel","Импорт және экспорт: CSV және Excel","Import and export: CSV and Excel"], aImportAny:["Импорт CSV или Excel (.xlsx)","CSV немесе Excel (.xlsx) импорттау","Import CSV or Excel (.xlsx)"],
  aExportXlsx:["Экспорт Excel","Excel экспорттау","Export Excel"], aTemplateXlsx:["Шаблон Excel","Excel үлгісі","Excel template"],
  aXlsOld:["Этот формат Excel (.xls или двоичный .xlsb) не читается. В Excel выберите «Сохранить как» → «Книга Excel (.xlsx)» и загрузите снова.","Бұл Excel пішімі (.xls немесе екілік .xlsb) оқылмайды. Excel-де «Басқаша сақтау» → «Excel кітабы (.xlsx)» таңдап, қайта жүктеңіз.","This Excel format (.xls or binary .xlsb) can’t be read. In Excel choose Save As → Excel Workbook (.xlsx) and upload again."],
  impTitle:["Проверьте файл перед загрузкой","Жүктеу алдында файлды тексеріңіз","Check the file before uploading"],
  impFile:["Файл «{f}»: строк с данными {n}","«{f}» файлы: деректері бар жолдар {n}","File “{f}”: data rows {n}"],
  impStep1:["1. Сопоставьте колонки файла с полями каталога","1. Файл бағандарын каталог өрістерімен сәйкестендіріңіз","1. Match the file columns to catalogue fields"],
  impColFile:["Колонка в файле","Файлдағы баған","File column"], impColEx:["Пример значения","Мән үлгісі","Sample value"], impColField:["Поле каталога","Каталог өрісі","Catalogue field"],
  impSkip:["— не загружать —","— жүктемеу —","— do not import —"], impFieldFor:["Поле каталога для колонки «{c}»","«{c}» бағаны үшін каталог өрісі","Catalogue field for column “{c}”"],
  impStep2:["2. Предпросмотр: первые записи","2. Алдын ала қарау: алғашқы жазбалар","2. Preview: first records"],
  impPrev:[["Вид","Название","Архив","Шифр","Годы","Доступ","Проверка"],["Түрі","Атауы","Архив","Шифр","Жылдар","Қолжетімділік","Тексеру"],["Type","Title","Archive","Code","Years","Access","Check"]],
  impOk:["Можно загрузить: {ok} из {n}","Жүктеуге болады: {ok} / {n}","Ready to upload: {ok} of {n}"],
  impBad:["Не пройдут проверку: {n}. Их можно исправить в файле и загрузить заново; остальные уйдут на проверку редактору.","Тексеруден өтпейтіндер: {n}. Оларды файлда түзетіп, қайта жүктеуге болады; қалғаны редакторға тексеруге кетеді.","Will not pass the check: {n}. Fix them in the file and upload again; the rest go to the editor for review."],
  impMissing:["Не сопоставлено обязательное поле: {f}","Міндетті өріс сәйкестендірілмеген: {f}","Required field is not matched: {f}"],
  impGo:["Загрузить на проверку: {n}","Тексеруге жүктеу: {n}","Upload for review: {n}"], impCancel:["Отмена","Бас тарту","Cancel"],
  impLimit:["За один раз загружается не больше 5 000 строк.","Бір рет жүктеуде 5 000 жолдан көп емес.","No more than 5,000 rows are uploaded at once."],
  impLog:["Журнал переносов","Тасымалдау журналы","Import log"],
  impLogHint:["Каждая загрузка файла — партия: итоги, сверка количества, ошибки и замечания по связям. Партию можно откатить: записи из неё будут удалены.","Файлды әр жүктеу — партия: қорытынды, санды салыстыру, қателер және байланыстар бойынша ескертулер. Партияны кері қайтаруға болады: ондағы жазбалар жойылады.","Every file upload is a batch: totals, count reconciliation, errors and warnings about links. A batch can be rolled back: its records are deleted."],
  impBalOk:["сверка сходится","салыстыру сәйкес","reconciled"], impBalBad:["сверка не сходится","салыстыру сәйкес емес","does not reconcile"], impRolled:["откатан","кері қайтарылды","rolled back"],
  impCounts:["в файле {n}: загружено {ok}, с ошибками {e}, замечаний {w}","файлда {n}: жүктелді {ok}, қателермен {e}, ескертулер {w}","in file {n}: loaded {ok}, with errors {e}, warnings {w}"],
  impRolledBy:["откатил {by}, удалено записей {n}, {date}","кері қайтарған {by}, жойылған жазбалар {n}, {date}","rolled back by {by}, records deleted {n}, {date}"],
  impDetails:["Ошибки и замечания","Қателер мен ескертулер","Errors and warnings"], impErrCsv:["Ошибки (CSV)","Қателер (CSV)","Problems (CSV)"], impRollback:["Откатить","Кері қайтару","Roll back"],
  impRollbackAsk:["Откатить перенос «{f}»? Будут удалены записи из этого файла: {n}, в том числе опубликованных: {p}. Это нельзя отменить.","«{f}» тасымалдауын кері қайтарамыз ба? Осы файлдағы жазбалар жойылады: {n}, оның ішінде жарияланғаны: {p}. Мұны болдырмау мүмкін емес.","Roll back the import “{f}”? Records from this file will be deleted: {n}, including published: {p}. This cannot be undone."],
  impRbDone:["Откат выполнен: удалено записей {n}","Кері қайтару орындалды: жойылған жазбалар {n}","Rolled back: records deleted {n}"],
  impWarnTitle:["Замечания по связям и дублям: {n}. Они не мешают загрузке, но проверяющему стоит их увидеть.","Байланыстар мен қайталанулар бойынша ескертулер: {n}. Олар жүктеуге кедергі емес, бірақ тексерушіге көрінгені жөн.","Warnings about links and duplicates: {n}. They do not block the upload, but the reviewer should see them."],
  impRecon:["Сверка: в файле {fr}, получено сервером {rc}, годных {ok}, с ошибками {e}: {res}","Салыстыру: файлда {fr}, серверге келді {rc}, жарамды {ok}, қателермен {e}: {res}","Reconciliation: in file {fr}, received by server {rc}, valid {ok}, with errors {e}: {res}"], impReconOk:["сходится","сәйкес","matches"], impReconBad:["не сходится","сәйкес емес","does not match"],
  aImported:["Загружено на проверку: {n}","Тексеруге жүктелді: {n}","Uploaded for review: {n}"], aImpErr:["Строка {r}: {e}","{r}-жол: {e}","Row {r}: {e}"],
  aOcrLead:["Загрузите скан или фото документа. ИИ распознает текст и предложит название, дату, имена и места. Проверьте и исправьте поля — карточка уйдёт на проверку модератору.","Құжаттың сканын немесе фотосын жүктеңіз. ЖИ мәтінді танып, атауын, күнін, есімдер мен орындарды ұсынады. Өрістерді тексеріп түзетіңіз — карточка модераторға тексеруге жіберіледі.","Upload a scan or photo of a record. AI will read the text and suggest a title, date, names and places. Check and correct the fields; the card then goes to a moderator for review."],
  aOcrHw:["Рукописный документ (расшифровку вносит сотрудник вручную)","Қолжазба құжат (шифрлауды қызметкер қолмен енгізеді)","Handwritten document (a staff member types the transcription)"],
  aOcrHand:["Рукописный текст на сайте не распознаётся: автоматическое распознавание рукописей ненадёжно. Скан показан рядом, введите расшифровку вручную и создайте карточку.","Қолжазба мәтін сайтта танылмайды: қолжазбаны автоматты тану сенімсіз. Скан жанында көрсетілген, шифрлауды қолмен енгізіп, карточка жасаңыз.","Handwriting is not recognised on the site: automatic recognition of handwriting is unreliable. The scan is shown beside the field; type the transcription and create the card."],
  aOcrRun:["Распознать","Тану","Recognise"], aOcrWait:["Распознаю… это занимает до минуты","Танып жатырмын… бір минутқа дейін","Recognising… up to a minute"], aOcrMake:["Создать карточку и отправить на проверку","Карточка жасап, тексеруге жіберу","Create the card and send for review"],
  aOcrText:["Распознанный текст","Танылған мәтін","Recognised text"], aNoServer:["Этот раздел работает, когда сайт запущен через сервер (start-site.bat).","Бұл бөлім сайт сервер арқылы іске қосылғанда жұмыс істейді (start-site.bat).","This tab works when the site runs on its server (start-site.bat)."],
  aViews:["Популярные разделы","Танымал бөлімдер","Popular sections"], aTopQ:["Частые запросы","Жиі сұраулар","Frequent searches"], aZeroQ:["Запросы без результатов","Нәтижесіз сұраулар","Searches with no results"], aCards:["Открытые карточки по типам","Түрлері бойынша ашылған карточкалар","Cards opened by type"],
  aLangs:["Языки посетителей","Келушілердің тілдері","Visitor languages"], aTips:["Рекомендации","Ұсыныстар","Recommendations"], aTipsAi:["Рекомендации ИИ","ЖИ ұсыныстары","AI recommendations"], aSearches:["Поисков всего","Барлық іздеу","Searches total"], aNoData:["Пока нет данных","Әзірге дерек жоқ","No data yet"],
  aWhen:["Когда","Қашан","When"], aWho:["Кто","Кім","Who"], aWhat:["Действие","Әрекет","Action"],
  rChief:["Главный администратор","Бас әкімші","Chief administrator"], rAdmin:["Администратор сайта","Сайт әкімшісі","Site administrator"], rEditor:["Редактор контента","Мазмұн редакторы","Content editor"], rStaff:["Сотрудник архива","Архив қызметкері","Archive staff"],
  rBranch:["Администратор филиала","Филиал әкімшісі","Branch administrator"], rModerator:["Модератор","Модератор","Moderator"], rAnalyst:["Аналитик","Талдаушы","Analyst"],
  stDraft:["Черновик","Жоба","Draft"], stReview:["На проверке","Тексеруде","In review"], stRework:["Требует доработки","Пысықтауды қажет етеді","Needs rework"], stApproved:["Одобрено","Мақұлданды","Approved"], stPublished:["Опубликовано","Жарияланды","Published"], stArchived:["Архивировано","Мұрағатталды","Archived"]
});
const ROLE_T = {chief:'rChief', admin:'rAdmin', editor:'rEditor', staff:'rStaff', branch:'rBranch', moderator:'rModerator', analyst:'rAnalyst'};
const ST_T = {draft:'stDraft', review:'stReview', rework:'stRework', approved:'stApproved', published:'stPublished', archived:'stArchived'};
const ST_CLS = {draft:'', review:'warn', rework:'bad', approved:'ok', published:'ok', archived:''};
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const CSV_COLS = [['k', 'kind'], ['t.ru', 'title'], ['t.kk', 'title_kk'], ['a', 'archive'], ['f', 'fond'], ['o', 'inventory'], ['d', 'file'], ['l', 'sheets'], ['y0', 'year_from'], ['y1', 'year_to'], ['dt', 'date'], ['au', 'author'], ['ds', 'description'], ['nt', 'note'], ['top', 'topics'], ['pl', 'places'], ['acc', 'access'], ['img', 'image'], ['lang', 'lang'], ['c', 'code']];
/* коды архивов и филиалов для учётных записей и материалов каталога: те же, что ARCHES в server.js (главное здание, здание в Усть-Каменогорске, 12 районных филиалов) */
const ARCH_CODES = ['gavko', 'uka', 'ridder', 'zirian', 'zaisan', 'glubokoe', 'katon', 'kurchum', 'markakol', 'samar', 'tarbagatai', 'ulan', 'ulken', 'shemonaiha'];
const TZA = {
  tabs: [['items', 'aItems', 'items'], ['ocr', 'aOcr', 'ocr'], ['stats', 'aStats', 'stats'], ['users', 'aUsers', 'users'], ['journal', 'aJournal', 'journal']],
  perms() { if (Store.mode !== 'api') return SS.get('admin') === '1' ? ['items', 'settings', 'news', 'photos', 'mod', 'publish', 'questions'] : []; try { return JSON.parse(SS.get('perms') || '[]'); } catch (e) { return []; } },
  me() { try { return JSON.parse(SS.get('me') || 'null'); } catch (e) { return null; } },
  can(p) { return this.perms().includes(p); },
  has(tab) { return this.tabs.some(x => x[0] === tab); },
  extend(tabs) {
    const base = {summary:null, mod:'mod', news:'news', content:'settings', photos:'photos', settings:'settings', questions:'questions'};
    const out = Store.mode === 'api' ? tabs.filter(([k]) => !base[k] || this.can(base[k])) : tabs.slice();
    this.tabs.forEach(([k, l, p]) => { if (Store.mode !== 'api' ? ['items'].includes(k) : this.can(p)) out.push([k, l]); });
    return out;
  },
  st: {filter:'', type:'catalog', edit:null, form:null, ocr:null, tips:null},
  items() { return (Store.data.adminItems || []).filter(i => (!this.st.filter || i.st === this.st.filter) && (!this.st.type || i.type === this.st.type)).sort((a, b) => (b.at || 0) - (a.at || 0)); },
  body(tab) {
    if (Store.mode !== 'api' && tab !== 'items') return `<p class="note">${tzIc('i-info')}<span>${esc(t('aNoServer'))}</span></p>`;
    return this['tab_' + tab] ? this['tab_' + tab]() : '';
  },
  who() { const me = this.me(), rl = me ? t(ROLE_T[me.role] || 'rChief') : ''; return me ? `<p class="note">${tzIc('i-shield')}<span>${esc(!me.name || me.name === rl ? me.login : me.name)} · ${esc(rl)}${me.branch ? ' · ' + esc(Cat.archName(me.branch)) : ''}</span></p>` : ''; },
  tab_items() {
    if (Store.mode !== 'api') return `<p class="note">${tzIc('i-info')}<span>${esc(t('aNoServer'))}</span></p>` + this.csvBox(true);
    const list = this.items(), all = Store.data.adminItems || [];
    const sts = ['draft', 'review', 'rework', 'approved', 'published', 'archived'];
    return `${this.who()}
      <div class="chips" style="margin:1rem 0"><button type="button" class="chip" data-act="za-f" data-v="" aria-pressed="${!this.st.filter}">${esc(t('catAll'))} <small>${all.length}</small></button>${sts.map(s => `<button type="button" class="chip" data-act="za-f" data-v="${s}" aria-pressed="${this.st.filter === s}">${esc(t(ST_T[s]))} <small>${all.filter(i => i.st === s).length}</small></button>`).join('')}</div>
      <div class="cat-tools"><label class="cat-sel"><span>${esc(t('aType'))}</span><select id="za-type">${[['catalog', 'aTypeCat'], ['expo', 'aTypeExpo'], ['memory', 'aTypeMem']].map(([v, k]) => `<option value="${v}"${this.st.type === v ? ' selected' : ''}>${esc(t(k))}</option>`).join('')}</select></label>
        <button type="button" class="btn sm" data-act="za-new">${esc(t('aNew'))}</button>${this.st.type === 'catalog' ? `<button type="button" class="btn ghost sm" data-act="za-dups" aria-pressed="${!!this.st.dups}">${esc(t(this.st.dups ? 'aDupsHide' : 'aDups'))}</button>` : ''}</div>
      ${this.st.dups && this.st.type === 'catalog' ? this.dupsHTML() : ''}
      ${this.st.form ? this.form() : ''}
      <ul class="za-list">${list.length ? list.map(i => this.row(i)).join('') : `<li class="empty">${esc(t('aNoData'))}</li>`}</ul>
      ${this.st.type === 'catalog' ? this.csvBox() : ''}
      ${this.st.type === 'catalog' ? this.catEditBox() : ''}`;
  },
  reviewN() { return this.can('publish') ? (Store.data.adminItems || []).filter(i => i.st === 'review').length : 0; },
  dups() {
    const norm = v => String(v || '').toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const rows = (Store.data.adminItems || []).filter(i => i.type === 'catalog').map(i => ({id:i.id, t:LK((i.data || {}).t), c:(i.data || {}).c, st:i.st}))
      .concat((Array.isArray(Cat.data) ? Cat.data : []).map(r => ({id:r.id, t:LK(r.t), c:r.c})));
    const g = new Map();
    rows.forEach(r => { const nt = norm(r.t); if (nt.length < 9) return; const k = nt + '|' + norm(r.c); if (!g.has(k)) g.set(k, []); g.get(k).push(r); });
    return [...g.values()].filter(a => a.length > 1);
  },
  dupsHTML() {
    if (!Array.isArray(Cat.data)) return `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
    const gs = this.dups();
    if (!gs.length) return `<p class="note">${tzIc('i-check')}<span>${esc(t('aDupsNone'))}</span></p>`;
    return `<div class="za-dups"><p class="muted">${esc(t('aDupsT'))}: <b>${gs.length}</b></p><ol>${gs.slice(0, 100).map(a => `<li><b>${esc(a[0].t)}</b>${a[0].c ? ` <code>${esc(a[0].c)}</code>` : ''}<ul>${a.map(r => `<li>${r.st ? `${esc(t('aDupsNew'))} · ${esc(t(ST_T[r.st] || r.st))} · <code>${esc(r.id)}</code>` : `<a href="#catalog/${encodeURIComponent(r.id)}" target="_blank" rel="noopener">${esc(r.id)}</a>`}</li>`).join('')}</ul></li>`).join('')}</ol></div>`;
  },
  row(i) {
    const d = i.data || {}; const pub = this.can('publish');
    const mine = (this.me() || {}).login === i.by;
    const acts = [];
    if (pub || mine) acts.push(['za-edit', 'aEdit', 'ghost']);
    if (['draft', 'rework'].includes(i.st)) acts.push(['za-st:review', 'aToReview', 'ghost']);
    if (pub && ['review', 'rework', 'draft'].includes(i.st)) acts.push(['za-st:approved', 'aApprove', 'ghost'], ['za-st:rework', 'aRework', 'ghost']);
    if (pub && ['approved', 'review', 'archived'].includes(i.st)) acts.push(['za-st:published', 'aPublish', '']);
    if (pub && i.st === 'published') acts.push(['za-st:archived', 'aArchive', 'ghost']);
    if (pub || (mine && i.st === 'draft')) acts.push(['za-del', 'aDel', 'danger']);
    const last = (i.hist || []).slice(-1)[0];
    const vs = (i.vers || []).slice(-8).reverse();   // последние версии содержимого: кто и когда менял, какие поля
    return `<li class="za-it"><div><span class="pill ${ST_CLS[i.st] || ''}">${esc(t(ST_T[i.st] || 'stDraft'))}</span> <b>${esc(LK(d.t) || '—')}</b>
      <small>${esc([i.type === 'catalog' ? t(KIND_T[d.k] || 'kDoc') : t(i.type === 'expo' ? 'aTypeExpo' : 'aTypeMem'), d.c || (d.f ? code4(d) : ''), d.a ? Cat.archName(d.a) : '', i.ver ? 'v' + i.ver : '', t('aBy') + ' ' + (i.by || ''), new Date(i.at || i.created).toLocaleString(LOC[lang] || 'ru-RU')].filter(Boolean).join(' · '))}</small>
      ${last && last.note ? `<small class="za-note">${esc(last.note)}</small>` : ''}
      ${vs.length > 1 || (vs[0] && vs[0].v > 1) ? `<details class="za-vers"><summary>${esc(t('aVers'))}: v${esc(i.ver)}</summary><ul>${vs.map(v => `<li><b>v${esc(v.v)}</b> · ${esc(new Date(v.at).toLocaleString(LOC[lang] || 'ru-RU'))} · ${esc(v.by)} · ${esc((v.changed || []).join(', '))}</li>`).join('')}</ul></details>` : ''}</div>
      <div class="btn-row">${acts.map(([a, l, c]) => `<button type="button" class="btn sm ${c}" data-act="${a.split(':')[0]}" data-v="${esc(i.id)}"${a.includes(':') ? ` data-st="${a.split(':')[1]}"` : ''}>${esc(t(l))}</button>`).join('')}</div></li>`;
  },
  form() {
    const f = this.st.form, d = f.data || {}, ty = f.type;
    const me = this.me() || {};
    const inp = (id, label, val, extra) => `<div class="field"><label for="zf-${id}">${esc(label)}</label><input id="zf-${id}" name="${id}" value="${esc(val == null ? '' : val)}"${extra || ''}></div>`;
    const ta = (id, label, val) => `<div class="field w2"><label for="zf-${id}">${esc(label)}</label><textarea id="zf-${id}" name="${id}">${esc(val || '')}</textarea></div>`;
    let fields = '';
    if (ty === 'catalog') {
      fields = `<div class="field"><label for="zf-k">${esc(t('fType'))}</label><select id="zf-k" name="k">${KINDS.filter(k => !['org', 'pers'].includes(k)).map(k => `<option value="${k}"${d.k === k ? ' selected' : ''}>${esc(t(KIND_T[k]))}</option>`).join('')}</select></div>
        <div class="field"><label for="zf-a">${esc(t('fBranch'))}</label><select id="zf-a" name="a"${me.role === 'branch' ? ' disabled' : ''}>${ARCH_CODES.map(a => `<option value="${a}"${(d.a || me.branch || 'gavko') === a ? ' selected' : ''}>${esc(Cat.archName(a))}</option>`).join('')}</select></div>
        ${inp('tru', t('fTitle') + ' (RU)*', d.t && d.t.ru, ' required minlength="3"')}${inp('tkk', t('fTitle') + ' (KZ)', d.t && d.t.kk)}
        ${inp('f', t('fFond'), d.f)}${inp('o', t('fInv'), d.o)}${inp('d', t('fFile'), d.d)}${inp('l', t('cSheets'), d.l)}
        ${inp('y0', t('fFrom'), d.y0, ' inputmode="numeric" maxlength="4"')}${inp('y1', t('fTo'), d.y1, ' inputmode="numeric" maxlength="4"')}${inp('dt', t('cDate'), d.dt)}${inp('au', t('fAuthor'), d.au)}
        <div class="field"><label for="zf-acc">${esc(t('cAccess'))}</label><select id="zf-acc" name="acc">${['open', 'declass', 'limited'].map(a => `<option value="${a}"${(d.acc || 'open') === a ? ' selected' : ''}>${esc(Cat.accName(a))}</option>`).join('')}</select></div>
        <div class="field"><label for="zf-lang">${esc(t('cLang'))}</label><select id="zf-lang" name="lang">${[['ru', 'Русский'], ['kk', 'Қазақша'], ['other', '—']].map(([v, l]) => `<option value="${v}"${(d.lang || 'ru') === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
        ${inp('pl', t('cPlaces') + ' (через запятую)', (d.pl || []).join(', '))}${inp('img', 'URL изображения (https://, img/, old/)', (d.img || [])[0])}
        <fieldset class="field w2 za-tops"><legend>${esc(t('cTopics'))}</legend>${Object.keys(TOPIC_T).map(k => `<label><input type="checkbox" name="top" value="${k}"${(d.top || []).includes(k) ? ' checked' : ''}> ${esc(t(TOPIC_T[k]))}</label>`).join('')}</fieldset>
        ${ta('ds', t('cDesc'), d.ds)}${ta('nt', t('cNote'), d.nt)}${ta('tx', t('cText'), d.tx)}
        ${(f.files || (f.files = (d.files || []).map(x => ({...x}))), this.filesBlock('item'))}`;
    } else if (ty === 'expo') {
      fields = `${inp('tru', t('fTitle') + ' (RU)*', d.t && d.t.ru, ' required minlength="3"')}${inp('tkk', t('fTitle') + ' (KZ)', d.t && d.t.kk)}${inp('y0', t('fFrom'), d.y0)}${inp('y1', t('fTo'), d.y1)}
        ${ta('txru', 'Текст выставки (RU)', d.tx && d.tx.ru)}${ta('txkk', 'Текст выставки (KZ)', d.tx && d.tx.kk)}${ta('imgs', 'Экспонаты: по одному на строку «URL изображения | подпись»', (d.ex || []).map(e => e.s + ' | ' + (e.c && e.c.ru || '')).join('\n'))}${this.expoFilesBlock()}
        ${inp('yt', t('fYt'), (d.yt || []).map(v => 'https://youtu.be/' + v).join(', '))}
        ${(f.files || (f.files = (d.files || []).map(x => ({...x}))), this.filesBlock('item', true))}
        ${inp('fd', t('fFonds'), (d.fd || []).join(', '))}
        <fieldset class="field w2 za-tops"><legend>${esc(t('cTopics'))}</legend>${Object.keys(TOPIC_T).map(k => `<label><input type="checkbox" name="top" value="${k}"${(d.top || []).includes(k) ? ' checked' : ''}> ${esc(t(TOPIC_T[k]))}</label>`).join('')}</fieldset>`;
    } else {   // «Архив памяти»: событие хронологии или человек (биография) — ТЗ 6.6
      const mt = d.mt || 'event';
      const mtSel = `<div class="field"><label for="zf-mt">${esc(t('aMemKind'))}</label><select id="zf-mt" name="mt">${[['event', 'aMemEvent'], ['person', 'aMemPerson'], ['place', 'aMemPlace']].map(([v, k]) => `<option value="${v}"${mt === v ? ' selected' : ''}>${esc(t(k))}</option>`).join('')}</select></div>`;
      const tops = `<fieldset class="field w2 za-tops"><legend>${esc(t('cTopics'))}</legend>${Object.keys(TOPIC_T).map(k => `<label><input type="checkbox" name="top" value="${k}"${(d.top || []).includes(k) ? ' checked' : ''}> ${esc(t(TOPIC_T[k]))}</label>`).join('')}</fieldset>`;
      const photo = `<div class="field w2"><label for="zf-img">${esc(t('aMemPhoto'))}</label><input id="zf-img" name="img" value="${esc(d.img || '')}" placeholder="/files/… или https://…">
          <div class="btn-row"><label class="btn ghost sm"><input type="file" class="sr" accept="image/jpeg,image/png,image/webp,image/tiff,.tif,.tiff" data-zup="mem">${esc(t('aMemPhotoUp'))}</label></div><p class="sm za-up-st" id="za-up-mem" aria-live="polite"></p></div>`;
      if (mt === 'place') fields = mtSel + `${inp('tru', t('aMemPlaceN') + ' (RU)*', d.t && d.t.ru, ' required minlength="3"')}${inp('tkk', t('aMemPlaceN') + ' (KZ)', d.t && d.t.kk)}
        <div class="field"><label for="zf-hc">${esc(t('hmKind'))}</label><select id="zf-hc" name="hc">${HM_CATS.map(c => `<option value="${c}"${(d.hc || 'building') === c ? ' selected' : ''}>${esc(t('hm_' + c))}</option>`).join('')}</select></div>
        ${inp('ll', t('aMemLL') + '*', d.lat != null ? d.lat + ', ' + d.lon : '', ' required inputmode="decimal" placeholder="49.9483, 82.6275"')}${inp('y', t('aMemYears'), d.y, ' inputmode="numeric" maxlength="4"')}
        ${ta('dsru', t('cDesc') + ' (RU)', d.ds && d.ds.ru)}${ta('dskk', t('cDesc') + ' (KZ)', d.ds && d.ds.kk)}${photo}${inp('srcT', t('aMemSrc'), d.srcT)}${inp('rel', t('aMemRel'), (d.rel || []).join(', '))}`;
      else if (mt === 'person') fields = mtSel + `${inp('tru', t('aMemName') + ' (RU)*', d.t && d.t.ru, ' required minlength="3"')}${inp('tkk', t('aMemName') + ' (KZ)', d.t && d.t.kk)}
        ${inp('gr', t('aMemGroups'), (d.gr || []).join(', '))}${inp('b0', t('aMemBorn'), d.b0, ' inputmode="numeric" maxlength="4"')}${inp('b1', t('aMemDied'), d.b1, ' inputmode="numeric" maxlength="4"')}
        ${ta('bioru', t('memBio') + ' (RU)', d.bio && d.bio.ru)}${ta('biokk', t('memBio') + ' (KZ)', d.bio && d.bio.kk)}
        ${inp('srcT', t('aMemSrc'), d.srcT)}${inp('fd', t('fFonds'), (d.fd || []).join(', '))}${inp('pl', t('cPlaces') + ' (через запятую)', (d.pl || []).join(', '))}
        ${photo}${tops}`;
      else fields = mtSel + `${inp('y', 'Год*', d.y, ' inputmode="numeric" maxlength="4" required')}${inp('tru', 'Событие (RU)*', d.t && d.t.ru, ' required minlength="3"')}${inp('tkk', 'Событие (KZ)', d.t && d.t.kk)}
        <div class="field"><label for="zf-g">${esc(t('aType'))}</label><select id="zf-g" name="g">${['region', 'archive', 'district'].map(g => `<option value="${g}"${(d.g || 'region') === g ? ' selected' : ''}>${esc(L(T.memEvG[g]))}</option>`).join('')}</select></div>
        ${ta('dsru', t('cDesc') + ' (RU)', d.ds && d.ds.ru)}${ta('dskk', t('cDesc') + ' (KZ)', d.ds && d.ds.kk)}${inp('srcT', t('aMemSrc'), d.srcT)}${inp('rel', t('aMemRel'), (d.rel || []).join(', '))}${tops}`;
    }
    return `<form class="panel form za-form" id="za-form"><div class="cat-adv za-grid">${fields}
      ${f.id && this.can('publish') ? `<div class="field w2"><label for="zf-note">${esc(t('aNote'))}</label><input id="zf-note" name="note"></div>` : ''}</div>
      <div class="btn-row"><button class="btn" type="submit" name="go" value="draft">${esc(t('aSave'))}</button><button class="btn ghost" type="submit" name="go" value="review">${esc(t('aToReview'))}</button>${this.can('publish') ? `<button class="btn ghost" type="submit" name="go" value="published">${esc(t('aPublish'))}</button>` : ''}<button class="btn ghost" type="button" data-act="za-cancel">${esc(t('aCancel'))}</button></div></form>`;
  },
  collect(form) {
    const fd = new FormData(form), g = k => String(fd.get(k) || '').trim(), ty = this.st.form.type;
    const me = this.me() || {};
    if (ty === 'catalog') {
      const d = {k:g('k'), a:me.role === 'branch' ? me.branch : g('a'), t:{ru:g('tru'), kk:g('tkk') || undefined}, f:g('f'), o:g('o'), d:g('d'), l:g('l'), y0:g('y0') ? +g('y0') : undefined, y1:g('y1') ? +g('y1') : (g('y0') ? +g('y0') : undefined),
        dt:g('dt'), au:g('au'), acc:g('acc'), lang:g('lang'), pl:g('pl') ? g('pl').split(',').map(x => x.trim()).filter(Boolean) : [], img:g('img') ? [g('img')] : undefined, top:fd.getAll('top'), ds:g('ds'), nt:g('nt'), tx:g('tx'),
        files:(this.st.form.files || []).map(x => ({id:x.id, n:x.n}))};
      if (d.k === 'fond') d.sub = /личн/i.test(d.t.ru) ? 'pers' : 'org';
      d.c = code4(d);
      return d;
    }
    if (ty === 'expo') return {kind:'doc', t:{ru:g('tru'), kk:g('tkk') || undefined}, y0:+g('y0') || undefined, y1:+g('y1') || undefined, tx:{ru:g('txru'), kk:g('txkk') || undefined}, top:fd.getAll('top'),
      ex:g('imgs').split('\n').map(l => l.split('|')).filter(x => x[0] && x[0].trim()).map(([s2, c]) => ({s:s2.trim(), c:{ru:(c || '').trim()}})),
      yt:[...g('yt').matchAll(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})|^([\w-]{11})$/gm)].map(m => m[1] || m[2]),
      fd:g('fd').split(/[,;\s]+/).map(x => x.trim()).filter(Boolean), files:(this.st.form.files || []).map(x => ({id:x.id, n:x.n}))};
    const list = s2 => s2.split(/\s*,\s*/).map(x => x.trim()).filter(Boolean), num = k => g(k) ? +g(k) : undefined;
    if (g('mt') === 'person') return {mt:'person', t:{ru:g('tru'), kk:g('tkk') || undefined}, gr:list(g('gr')), b0:num('b0'), b1:num('b1'), bio:{ru:g('bioru'), kk:g('biokk') || undefined},
      srcT:g('srcT'), fd:list(g('fd')), pl:list(g('pl')), img:g('img') || undefined, top:fd.getAll('top')};
    if (g('mt') === 'place') { const ll = g('ll').split(/[,;\s]+/).filter(Boolean).map(Number);
      return {mt:'place', t:{ru:g('tru'), kk:g('tkk') || undefined}, hc:g('hc'), lat:ll[0], lon:ll[1], y:num('y'), ds:{ru:g('dsru'), kk:g('dskk') || undefined}, img:g('img') || undefined, srcT:g('srcT'), rel:list(g('rel'))}; }
    return {mt:'event', y:+g('y'), t:{ru:g('tru'), kk:g('tkk') || undefined}, g:g('g'), ds:{ru:g('dsru'), kk:g('dskk') || undefined}, srcT:g('srcT'), rel:list(g('rel')), top:fd.getAll('top')};
  },
  async save(st, note) {
    const f = this.st.form; const data = this.collect($('#za-form'));
    try { await Store.api('/api/admin/items', {method:'PUT', body:{id:f.id, type:f.type, data, st, note}}); this.st.form = null; toast(t('saved')); await Store.apiLoad(); }
    catch (e) { toast(e.msg || t('saveFail')); }
    renderAdmin(true);
  },
  async setSt(id, st) {
    const it = (Store.data.adminItems || []).find(i => i.id === id); if (!it) return;
    let note = '';
    if (st === 'rework') { note = prompt(t('aNote')) || ''; }
    try { await Store.api('/api/admin/items', {method:'PUT', body:{id, type:it.type, data:it.data, st, note}}); toast(t('saved')); await Store.apiLoad(); } catch (e) { toast(e.msg || t('saveFail')); }
    renderAdmin(true);
  },
  csvBox(localOnly) {
    return `<section class="panel za-csv"><h2 class="h4">${esc(t('aIoTitle'))}</h2>
      <p class="muted sm">${esc(lang === 'kz' ? 'Бағандар: ' : lang === 'en' ? 'Columns: ' : 'Колонки: ')}<code>${CSV_COLS.map(c => c[1]).join(';')}</code>. ${esc(lang === 'kz' ? 'Міндетті: kind, title, archive; қор/тізімдеме/іс үшін — нөмірлері.' : lang === 'en' ? 'Required: kind, title, archive; fond/inventory/file numbers for those types.' : 'Обязательные: kind, title, archive; для фондов, описей, дел и документов — их номера.')}</p>
      <div class="btn-row"><button type="button" class="btn ghost sm" data-act="za-export">${tzIc('i-download')}${esc(t('aExport'))}</button><button type="button" class="btn ghost sm" data-act="za-export-xlsx">${tzIc('i-download')}${esc(t('aExportXlsx'))}</button>
      <button type="button" class="btn ghost sm" data-act="za-template">${esc(t('aTemplate'))}</button><button type="button" class="btn ghost sm" data-act="za-template-xlsx">${esc(t('aTemplateXlsx'))}</button>
      ${localOnly ? '' : `<label class="btn sm"><input type="file" accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" id="za-csv" class="sr">${esc(t('aImportAny'))}</label>`}</div><div id="za-csv-res" aria-live="polite">${this.st.imp ? this.impHTML() : (this.st.csvRes || '')}</div></section>${localOnly ? '' : this.importsLog()}`;
  },
  /* журнал переносов: каждая загрузка — партия с итогами, сверкой, ошибками и замечаниями; её можно откатить */
  importsLog() {
    const list = (Store.data.imports || []).slice().reverse(), me = this.me() || {}, when = ts => new Date(ts).toLocaleString(LOC[lang] || 'ru-RU');
    if (!list.length) return '';
    return `<section class="panel za-imps"><h2 class="h4">${esc(t('impLog'))}</h2><p class="muted sm">${esc(t('impLogHint'))}</p><ul class="za-list">${list.map(x => {
      const rb = x.rolledBack, canRb = !rb && (this.can('publish') || x.by === me.login);
      const lines = (x.errors || []).slice(0, 15).map(e => `<li class="bad">${esc(fmt(t('aImpErr'), {r:e.row, e:e.error}))}${e.title ? ' · ' + esc(e.title) : ''}</li>`).concat((x.warnings || []).slice(0, 15).map(w => `<li>${esc(fmt(t('aImpErr'), {r:w.row, e:w.text}))}${w.title ? ' · ' + esc(w.title) : ''}</li>`));
      return `<li class="za-it"><div><b>${esc(x.file || x.id)}</b> <span class="pill ${rb ? 'bad' : x.balanced ? 'ok' : 'warn'}">${esc(t(rb ? 'impRolled' : x.balanced ? 'impBalOk' : 'impBalBad'))}</span>
        <small>${esc(when(x.at))} · ${esc(x.by)} · ${esc(fmt(t('impCounts'), {n:x.fileRows || x.total, ok:x.ok, e:x.errorCount, w:x.warnCount}))}${rb ? ' · ' + esc(fmt(t('impRolledBy'), {by:rb.by, n:rb.removed, date:when(rb.at)})) : ''}</small>
        ${lines.length ? `<details class="za-vers"><summary>${esc(t('impDetails'))}</summary><ul>${lines.join('')}</ul></details>` : ''}</div>
        <div class="btn-row">${x.errorCount || x.warnCount ? `<button type="button" class="btn ghost sm" data-act="za-imp-err" data-v="${esc(x.id)}">${esc(t('impErrCsv'))}</button>` : ''}${canRb ? `<button type="button" class="btn danger sm" data-act="za-imp-rb" data-v="${esc(x.id)}">${esc(t('impRollback'))}</button>` : ''}</div></li>`; }).join('')}</ul></section>`;
  },
  async impRollback(id) {
    const x = (Store.data.imports || []).find(i => i.id === id); if (!x) return;
    const its = (Store.data.adminItems || []).filter(i => i.batch === id), pub = its.filter(i => i.st === 'published').length;
    if (!confirm(fmt(t('impRollbackAsk'), {f:x.file || x.id, n:its.length, p:pub}))) return;
    try { const r = await Store.api('/api/admin/imports/rollback', {method:'POST', body:{id}}); toast(fmt(t('impRbDone'), {n:r.removed})); await Store.apiLoad(); } catch (e) { toast(e.msg || t('saveFail')); }
    renderAdmin(true);
  },
  impErrors(id) {   // ошибки и замечания партии — таблицей CSV, чтобы поправить файл и загрузить заново
    const x = (Store.data.imports || []).find(i => i.id === id); if (!x) return;
    const q = v => { const s2 = String(v == null ? '' : v); return /[;"\n]/.test(s2) ? '"' + s2.replace(/"/g, '""') + '"' : s2; };
    const rows = [['row', 'type', 'message', 'title']].concat((x.errors || []).map(e => [e.row, 'error', e.error, e.title || '']), (x.warnings || []).map(w => [w.row, 'warning', w.text, w.title || '']));
    this.download('import-problems-' + new Date(x.at).toISOString().slice(0, 10) + '.csv', '﻿' + rows.map(r => r.map(q).join(';')).join('\n'));
  },
  /* таблица для выгрузки: заголовок (имена колонок CSV_COLS) и строки; годы — числами, списки — через запятую */
  tableOf(rows) {
    const get = (r, path) => path.split('.').reduce((o, k) => o == null ? o : o[k], r);
    return [CSV_COLS.map(c => c[1])].concat(rows.map(r => CSV_COLS.map(([p]) => { const v = get(r, p);
      if (p === 'img') return (v || []).find(u => /^(https:\/\/|img\/|old\/)/.test(u)) || '';   // одна ссылка, которую примет обратный импорт
      return Array.isArray(v) ? v.join(', ') : v == null ? '' : ['y0', 'y1'].includes(p) && +v ? +v : String(v); })));
  },
  csvOf(rows) {
    const q = v => { const s2 = String(v); return /[;"\n]/.test(s2) ? '"' + s2.replace(/"/g, '""') + '"' : s2; };
    return '﻿' + this.tableOf(rows).map(r => r.map(q).join(';')).join('\n');
  },
  xlsxOf(rows) { return Formats.writeXLSX(this.tableOf(rows), lang === 'kz' ? 'Каталог' : lang === 'en' ? 'Catalogue' : 'Каталог'); },
  download(name, data, mime) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], {type:mime || 'text/csv;charset=utf-8'})); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); },
  TPL: [{k:'doc', t:{ru:'Приказ о …'}, a:'gavko', f:'77', o:'1', d:'19', l:'152', y0:1941, y1:1941, dt:'12.08.1941', acc:'open', lang:'ru', top:['war'], pl:['Риддер']}],
  parseCSV(text) { return this.rowsToItems(this.csvTable(text)); },
  csvTable(text) {   // CSV → строки таблицы (первая — заголовок)
    text = text.replace(/^﻿/, ''); const first = text.split('\n')[0]; const sep = (first.match(/;/g) || []).length >= (first.match(/,/g) || []).length ? ';' : ',';
    const rows = []; let row = [], cur = '', q = false;
    for (let i = 0; i < text.length; i++) { const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true; else if (ch === sep) { row.push(cur); cur = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; } else cur += ch; }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  },
  /* строки таблицы (первая — заголовок) → записи каталога. Из Excel дата может прийти числом-«серийным номером» дня: переводим в ДД.ММ.ГГГГ */
  rowsToItems(rows, fromExcel) {
    rows = rows.map(r => (r || []).map(x => x == null ? '' : String(x)));
    const head = (rows.shift() || []).map(h => h.trim().toLowerCase());
    const serial = v => { const d = new Date(Date.UTC(1899, 11, 30) + Math.round(+v) * 864e5); return String(d.getUTCDate()).padStart(2, '0') + '.' + String(d.getUTCMonth() + 1).padStart(2, '0') + '.' + d.getUTCFullYear(); };
    return rows.filter(r => r.some(x => x.trim())).map(r => { const d = {t:{}}; head.forEach((h, k) => { const col = CSV_COLS.find(c => c[1] === h); if (!col) return; let v = (r[k] || '').trim(); if (!v) return;
      if (fromExcel && col[0] === 'dt' && /^\d+(\.\d+)?$/.test(v) && +v > 2100 && +v < 80000) v = serial(v);
      const [a, b] = col[0].split('.'); if (b) d[a][b] = v; else if (['top', 'pl'].includes(a)) d[a] = v.split(/\s*,\s*/).filter(Boolean); else if (a === 'img') d.img = [v]; else if (['y0', 'y1'].includes(a)) d[a] = +v; else d[a] = v; });
      this.normVals(d);
      if (d.k === 'fond' && !d.sub) d.sub = /личн/i.test(d.t.ru || '') ? 'pers' : 'org'; if (!d.c) d.c = code4(d); return d; });
  },
  /* значения «по-человечески» → коды каталога: «Документ» → doc, «Открытый» → open, «Риддерский филиал» → ridder */
  KIND_WORDS: {'документ':'doc', 'документы':'doc', 'фонд':'fond', 'опись':'inv', 'дело':'file', 'фото':'photo', 'фотография':'photo', 'фотодокумент':'photo', 'карта':'map', 'план':'map', 'публикация':'pub', 'издание':'pub', 'аудио':'av', 'видео':'av', 'құжат':'doc', 'қор':'fond', 'тізімдеме':'inv', 'іс':'file', 'сурет':'photo', 'жарияланым':'pub'},
  ACC_WORDS: {'открытый':'open', 'открыто':'open', 'открыт':'open', 'свободный':'open', 'рассекречен':'declass', 'рассекреченный':'declass', 'ограниченный':'limited', 'закрытый':'limited', 'ограниченный доступ':'limited', 'ашық':'open', 'шектеулі':'limited'},
  normVals(d) {
    const low = v => String(v || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (d.k && this.KIND_WORDS[low(d.k)]) d.k = this.KIND_WORDS[low(d.k)];
    if (d.acc && this.ACC_WORDS[low(d.acc)]) d.acc = this.ACC_WORDS[low(d.acc)];
    if (d.a && !ARCH_CODES.includes(low(d.a))) {   // название архива или филиала: точное совпадение, затем единственное вхождение
      const n = low(d.a), names = ARCH_CODES.map(c => [c, low(Cat.archName(c))]);
      const hit = names.find(([, nm]) => nm === n) || (n.length > 4 && names.filter(([, nm]) => nm.includes(n)).length === 1 ? names.find(([, nm]) => nm.includes(n)) : null);
      if (hit) d.a = hit[0];
    } else if (d.a) d.a = low(d.a);
  },
  /* колонки файла → поля каталога: по английским именам шаблона и по русским и казахским названиям */
  FIELD_ALIAS: {kind:['вид', 'тип', 'түрі', 'type'], title:['название', 'наименование', 'заголовок', 'атауы', 'name'], title_kk:['название кз', 'название (кз)', 'название kk', 'название (kk)', 'атауы (қаз)'],
    archive:['архив', 'филиал', 'хранение'], fond:['фонд', 'қор', 'номер фонда'], inventory:['опись', 'тізімдеме', 'номер описи'], file:['дело', 'іс', 'номер дела'], sheets:['листы', 'лист', 'л.', 'парақ'],
    year_from:['год с', 'год от', 'с года', 'начальный год'], year_to:['год по', 'год до', 'по год', 'конечный год'], date:['дата', 'күні'], author:['автор', 'авторы', 'автор(ы)'],
    description:['описание', 'аннотация', 'сипаттама', 'содержание'], note:['примечание', 'заметка', 'комментарий', 'ескертпе'], topics:['темы', 'тема', 'тақырыптар'], places:['места', 'место', 'орындар'],
    access:['доступ', 'қолжетімділік'], image:['изображение', 'картинка', 'фото', 'ссылка на изображение'], lang:['язык', 'тіл'], code:['шифр', 'код']},
  FIELD_L: {kind:['Вид материала', 'Материал түрі', 'Material type'], title:['Название', 'Атауы', 'Title'], title_kk:['Название (казахский)', 'Атауы (қазақша)', 'Title (Kazakh)'], archive:['Архив или филиал', 'Архив немесе филиал', 'Archive or branch'],
    fond:['Номер фонда', 'Қор нөмірі', 'Fond number'], inventory:['Номер описи', 'Тізімдеме нөмірі', 'Inventory number'], file:['Номер дела', 'Іс нөмірі', 'File number'], sheets:['Листы', 'Парақтар', 'Sheets'],
    year_from:['Год с', 'Жыл бастап', 'Year from'], year_to:['Год по', 'Жыл дейін', 'Year to'], date:['Дата', 'Күні', 'Date'], author:['Автор', 'Автор', 'Author'], description:['Описание', 'Сипаттама', 'Description'],
    note:['Примечание', 'Ескертпе', 'Note'], topics:['Темы (через запятую)', 'Тақырыптар (үтір арқылы)', 'Topics (comma-separated)'], places:['Места (через запятую)', 'Орындар (үтір арқылы)', 'Places (comma-separated)'],
    access:['Доступ', 'Қолжетімділік', 'Access'], image:['Изображение (ссылка)', 'Сурет (сілтеме)', 'Image (link)'], lang:['Язык', 'Тіл', 'Language'], code:['Шифр', 'Шифр', 'Code']},
  autoMap(head) {
    const used = new Set(), names = CSV_COLS.map(c => c[1]);
    return head.map(h => { const x = String(h == null ? '' : h).trim().toLowerCase().replace(/\s+/g, ' ');
      let f = names.includes(x) ? x : (Object.keys(this.FIELD_ALIAS).find(k => this.FIELD_ALIAS[k].includes(x)) || '');
      if (f && used.has(f)) f = ''; if (f) used.add(f); return f; });
  },
  /* импорт в два шага (ТЗ 6.3–6.6): файл → сопоставление колонок и предпросмотр с проверкой строк → загрузка на проверку редактору */
  async importCSV(file) {
    const box = $('#za-csv-res'); let table, fromExcel = false;
    try {   // .xlsx — разбираем сами (dev/formats.js); старые .xls и двоичные .xlsb — просим пересохранить
      const head = new Uint8Array(await file.slice(0, 16).arrayBuffer()), kind = Formats.sniff(head);
      if (head[0] === 0xD0 && head[1] === 0xCF && head[2] === 0x11 && head[3] === 0xE0) throw new Error(t('aXlsOld'));
      if (kind === 'zip' || /\.xls[xmb]$/i.test(file.name)) {
        const buf = new Uint8Array(await file.arrayBuffer()); fromExcel = true;
        try { table = await Formats.readXLSX(buf); }
        catch (er) { const z = await Formats.unzip(buf).catch(() => null); throw new Error(z && z.names.includes('xl/workbook.bin') ? t('aXlsOld') : er.message); }
      } else table = this.csvTable(await file.text());
    } catch (er) { this.st.imp = null; this.st.csvRes = `<p class="note">${esc(er.message)}</p>`; if (box) box.innerHTML = this.st.csvRes; return; }
    table = table.map(r => (r || []).map(x => x == null ? '' : String(x))).filter((r, i) => i === 0 || r.some(x => x.trim()));
    this.st.csvRes = ''; this.st.imp = {name:file.name, table, fromExcel, map:this.autoMap(table[0] || []), items:[], dry:null, err:'', busy:false};
    this.impPaint(); await this.impDry();
  },
  fieldL(name) { return L(this.FIELD_L[name] || [name, name, name]); },
  reconText(r) { return fmt(t('impRecon'), {fr:r.fileRows == null ? '?' : r.fileRows, rc:r.received == null ? '?' : r.received, ok:r.ok, e:(r.errors || []).length, res:t(r.balanced ? 'impReconOk' : 'impReconBad')}); },   // сверка: файл → сервер → загружено + ошибки
  impItems() { const m = this.st.imp; return this.rowsToItems([m.map.map(f => f || '')].concat(m.table.slice(1)), m.fromExcel); },
  /* пробная проверка на сервере теми же правилами, что и при загрузке, но ничего не сохраняется */
  async impDry() {
    const m = this.st.imp; if (!m) return; const items = this.impItems(); m.items = items;
    try { m.dry = items.length ? await Store.api('/api/admin/items/bulk', {method:'POST', body:{rows:items, dry:true, file:m.name, fileRows:m.table.length - 1}}) : {ok:0, errors:[], warnings:[]}; m.err = ''; }
    catch (e) { m.dry = null; m.err = e.msg || t('saveFail'); }
    if (this.st.imp === m) this.impPaint();
  },
  impPaint(focusK) {
    const box = $('#za-csv-res'); if (!box) return;
    box.innerHTML = this.st.imp ? this.impHTML() : (this.st.csvRes || '');
    if (focusK != null) { const s = box.querySelector(`[data-za-map="${focusK}"]`); if (s) s.focus(); }
  },
  impMap(k, v) {
    const m = this.st.imp; if (!m) return;
    m.map[k] = v; if (v) m.map.forEach((f, i) => { if (i !== k && f === v) m.map[i] = ''; });   // одно поле — одна колонка
    m.items = this.impItems(); m.dry = null; this.impPaint(k);
    clearTimeout(this._imp); this._imp = setTimeout(() => this.impDry(), 250);
  },
  impHTML() {
    const m = this.st.imp, head = m.table[0] || [], n = Math.max(0, m.table.length - 1), items = m.items || [], dry = m.dry;
    const opts = cur => `<option value="">${esc(t('impSkip'))}</option>` + CSV_COLS.map(c => `<option value="${c[1]}"${cur === c[1] ? ' selected' : ''}>${esc(this.fieldL(c[1]))}</option>`).join('');
    const sample = k => { for (let i = 1; i < m.table.length && i < 40; i++) { const v = String((m.table[i] || [])[k] == null ? '' : m.table[i][k]).trim(); if (v) return v.length > 40 ? v.slice(0, 40) + '…' : v; } return ''; };
    const mapRows = head.map((h, k) => `<tr><th scope="row">${esc(String(h).trim() || '—')}</th><td class="muted">${esc(sample(k))}</td><td><select data-za-map="${k}" aria-label="${esc(fmt(t('impFieldFor'), {c:String(h)}))}">${opts(m.map[k])}</select></td></tr>`).join('');
    const mapped = new Set(m.map.filter(Boolean)), need = ['kind', 'title', 'archive'].filter(f => !mapped.has(f));
    const errAt = new Map(((dry && dry.errors) || []).map(e => [e.row - 2, e.error]));
    const ph = t('impPrev');
    const prev = items.slice(0, 5).map((d, i) => `<tr${errAt.has(i) ? ' class="bad"' : ''}><td>${esc(d.k || '')}</td><td>${esc((d.t && (d.t.ru || d.t.kk)) || '')}</td><td>${esc(d.a || '')}</td><td>${esc(d.c || '')}</td><td>${esc(yRange(d.y0, d.y1))}</td><td>${esc(d.acc || '')}</td><td>${errAt.has(i) ? esc(errAt.get(i)) : '✓'}</td></tr>`).join('');
    const bad = dry ? dry.errors.length : 0, go = dry && dry.ok > 0 && !need.length && !m.busy;
    return `<div class="za-imp"><h3 class="h4">${esc(t('impTitle'))}</h3>
      <p class="muted sm">${esc(fmt(t('impFile'), {f:m.name, n}))}${n > 5000 ? ' ' + esc(t('impLimit')) : ''}</p>
      <h4 class="za-imp-h">${esc(t('impStep1'))}</h4>
      <div class="za-scroll"><table class="za-map"><thead><tr><th>${esc(t('impColFile'))}</th><th>${esc(t('impColEx'))}</th><th>${esc(t('impColField'))}</th></tr></thead><tbody>${mapRows}</tbody></table></div>
      ${need.length ? `<p class="note">${esc(fmt(t('impMissing'), {f:need.map(f => this.fieldL(f)).join(', ')}))}</p>` : ''}
      <h4 class="za-imp-h">${esc(t('impStep2'))}</h4>
      <div class="za-scroll">${items.length ? `<table class="za-prev"><thead><tr>${ph.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${prev}</tbody></table>` : ''}</div>
      ${m.err ? `<p class="note">${esc(m.err)}</p>` : dry ? `<p class="note ok">${esc(fmt(t('impOk'), {ok:dry.ok, n:items.length}))}</p><p class="muted sm">${esc(this.reconText(dry))}</p>${(dry.warnings || []).length ? `<p class="note">${esc(fmt(t('impWarnTitle'), {n:dry.warnings.length}))}</p><ul class="za-errs">${dry.warnings.slice(0, 8).map(x => `<li>${esc(fmt(t('aImpErr'), {r:x.row, e:x.text}))}</li>`).join('')}</ul>` : ''}${bad ?`<p class="note">${esc(fmt(t('impBad'), {n:bad}))}</p><ul class="za-errs">${dry.errors.slice(0, 8).map(x => `<li>${esc(fmt(t('aImpErr'), {r:x.row, e:x.error}))}</li>`).join('')}</ul>` : ''}` : (items.length ? '<p class="muted sm">…</p>' : '')}
      <div class="btn-row"><button type="button" class="btn sm" data-act="za-imp-go"${go ? '' : ' disabled'}>${esc(fmt(t('impGo'), {n:dry ? dry.ok : 0}))}</button><button type="button" class="btn ghost sm" data-act="za-imp-cancel">${esc(t('impCancel'))}</button></div></div>`;
  },
  async impGo() {
    const m = this.st.imp; if (!m || !(m.items || []).length || m.busy) return;
    m.busy = true; this.impPaint();
    try { const r = await Store.api('/api/admin/items/bulk', {method:'POST', body:{rows:m.items, file:m.name, fileRows:m.table.length - 1}}); this.st.csvRes = `<p class="note ok">${esc(fmt(t('aImported'), {n:r.ok}))}</p><p class="muted sm">${esc(this.reconText(r))}</p>${(r.errors || []).length ? `<ul class="za-errs">${r.errors.map(x => `<li>${esc(fmt(t('aImpErr'), {r:x.row, e:x.error}))}</li>`).join('')}</ul>` : ''}`; this.st.imp = null; await Store.apiLoad(); }
    catch (e) { m.busy = false; m.err = e.msg || t('saveFail'); this.impPaint(); return; }
    renderAdmin(true);
  },
  tab_ocr() {
    const o = this.st.ocr;
    return `${this.who()}<p class="muted">${esc(t('aOcrLead'))}</p>
      <form class="panel form" id="za-ocr"><div class="field"><label for="za-ocr-f">JPG, PNG, WebP</label><input type="file" id="za-ocr-f" accept="image/jpeg,image/png,image/webp"></div>
      <label class="check"><input type="checkbox" id="za-ocr-hw"> ${esc(t('aOcrHw'))}</label>
      <div class="btn-row"><button class="btn" type="submit">${tzIc('i-sparkle')}${esc(t('aOcrRun'))}</button></div><div id="za-ocr-st" aria-live="polite"></div></form>
      ${o && o.res ? `<section class="panel"><div class="za-ocr-out">${o.img ? `<img src="${esc(o.img)}" alt="">` : ''}<div class="field"><label for="za-ocr-tx">${esc(t('aOcrText'))}</label><textarea id="za-ocr-tx" rows="10">${esc(o.res.text || '')}</textarea></div></div>
        ${o.res.notes ? `<p class="note">${esc(o.res.notes)}</p>` : ''}<p class="btn-row"><button type="button" class="btn" data-act="za-ocr-make">${esc(t('aOcrMake'))}</button></p></section>` : ''}`;
  },
  async ocr(file) {
    const st = $('#za-ocr-st'); if (!file) return;
    if (file.size > 5 * 1024 * 1024) { st.innerHTML = `<p class="note">5 MB max</p>`; return; }
    const img = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
    if (($('#za-ocr-hw') || {}).checked) { this.st.ocr = {img, res:{text:'', notes:t('aOcrHand')}}; renderAdmin(true); return; }   // рукописи на сайте не распознаются: скан остаётся рядом с полем, расшифровку вносит сотрудник
    st.innerHTML = `<p class="muted">${esc(t('aOcrWait'))}</p>`;
    try { const res = await Store.api('/api/admin/ocr', {method:'POST', body:{image:img}}); this.st.ocr = {img, res}; renderAdmin(true); }
    catch (e) { st.innerHTML = `<p class="note">${esc(e.msg || t('saveFail'))}</p>`; }
  },
  ocrMake() {
    const r = (this.st.ocr || {}).res || {}; const tx = ($('#za-ocr-tx') || {}).value || r.text || '';
    this.st.type = 'catalog'; Admin.tab = 'items';
    this.st.form = {type:'catalog', data:{k:['doc', 'photo', 'map', 'pub'].includes(r.type) ? r.type : 'doc', t:{ru:r.title || ''}, dt:r.date || '', y0:r.y0 || undefined, y1:r.y1 || undefined, au:r.author || '', pl:r.places || [], tx,
      ds:(r.names || []).length ? (lang === 'kz' ? 'Есімдер: ' : 'Имена: ') + r.names.join(', ') : '', nt:(r.keywords || []).length ? (lang === 'kz' ? 'Түйін сөздер: ' : 'Ключевые слова: ') + r.keywords.join(', ') : '', lang:r.lang === 'kk' ? 'kk' : 'ru', img:[]}};
    renderAdmin(true);
  },
  tab_stats() {
    const s2 = Store.data.stats || {};
    const top = (o, n) => Object.entries(o || {}).sort((a, b) => b[1] - a[1]).slice(0, n || 12);
    const bars = (o, map) => { const e = top(o); const mx = Math.max(1, ...e.map(x => x[1])); return e.length ? `<ul class="za-bars">${e.map(([k, v]) => `<li><span>${esc(map ? map(k) : k)}</span><i style="--w:${Math.round(v / mx * 100)}%"></i><b>${v}</b></li>`).join('')}</ul>` : `<p class="muted">${esc(t('aNoData'))}</p>`; };
    const vt = {catalog:t('navCatalog'), memory:t('navMemory'), expo:t('navExpo'), contacts:t('navBranches'), visitors:t('navGuide'), privacy:t('privacy'), my:t('myTitle')};
    const tips = [];
    const zero = top(s2.zero, 5); if (zero.length) tips.push((lang === 'kz' ? 'Нәтижесіз сұраулар бойынша каталогқа жазбалар немесе синонимдер қосыңыз: ' : 'Добавьте записи или синонимы для запросов без результатов: ') + zero.map(x => '«' + x[0] + '»').join(', '));
    const lg = s2.langs || {}; const totL = Object.values(lg).reduce((a, b) => a + b, 0); if (totL > 20 && (lg.kz || 0) / totL < .15) tips.push(lang === 'kz' ? 'Қазақ тіліндегі нұсқаны аз ашады: аудармалар мен сілтемелерді тексеріңіз.' : 'Казахскую версию открывают редко: проверьте переводы и переключатель языка.');
    const v = top(s2.views, 1); if (v.length) tips.push((lang === 'kz' ? 'Ең танымал бөлім: ' : 'Самый посещаемый раздел: ') + (vt[v[0][0]] || v[0][0]) + (lang === 'kz' ? '. Оны басты бетте көрсетіңіз.' : '. Держите его на виду на главной.'));
    return `<div class="tiles"><div class="tile"><span class="v">${s2.searches || 0}</span><span class="k">${esc(t('aSearches'))}</span></div><div class="tile"><span class="v">${Object.keys(s2.zero || {}).length}</span><span class="k">${esc(t('aZeroQ'))}</span></div></div>
      <div class="za-cols"><section class="panel"><h2 class="h4">${esc(t('aViews'))}</h2>${bars(s2.views, k => vt[k] || k)}</section>
      <section class="panel"><h2 class="h4">${esc(t('aZeroQ'))}</h2>${bars(s2.zero)}</section>
      <section class="panel"><h2 class="h4">${esc(t('aTopQ'))}</h2>${bars(s2.top)}</section>
      <section class="panel"><h2 class="h4">${esc(t('aCards'))}</h2>${bars(s2.cards, k => t(KIND_T[k] || 'kDoc'))}</section>
      <section class="panel"><h2 class="h4">${esc(t('aLangs'))}</h2>${bars(s2.langs, k => ({ru:'Русский', kz:'Қазақша', en:'English'})[k] || k)}</section>
      <section class="panel"><h2 class="h4">${esc(t('aTips'))}</h2>${tips.length ? `<ul class="cat-kids">${tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p class="muted">${esc(t('aNoData'))}</p>`}
        <p class="btn-row"><button type="button" class="btn ghost sm" data-act="za-tips">${tzIc('i-sparkle')}${esc(t('aTipsAi'))}</button></p><div id="za-tips">${this.st.tips ? `<ul class="cat-kids">${this.st.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></section></div>
      <p class="muted sm">${esc(lang === 'kz' ? 'Статистика иесіз: IP-мекенжайлар мен есімдер сақталмайды.' : lang === 'en' ? 'Statistics are anonymous: no IP addresses or names are stored.' : 'Статистика обезличена: IP-адреса и имена не сохраняются.')}</p>`;
  },
  tab_users() {
    const us = Store.data.users || []; const f = this.st.user || {};
    return `<form class="panel form" id="za-user"><h2 class="h4">${esc(f.id ? t('aEdit') : t('aNew'))}</h2><div class="cat-adv za-grid">
      <div class="field"><label for="zu-l">${esc(t('aLogin'))}</label><input id="zu-l" name="login" value="${esc(f.login || '')}" required pattern="[a-z0-9._\\-]{3,40}" autocomplete="off"></div>
      <div class="field"><label for="zu-n">${esc(lang === 'kz' ? 'Аты-жөні' : lang === 'en' ? 'Name' : 'Имя')}</label><input id="zu-n" name="name" value="${esc(f.name || '')}"></div>
      <div class="field"><label for="zu-r">${esc(t('aRole'))}</label><select id="zu-r" name="role">${Object.keys(ROLE_T).map(r => `<option value="${r}"${(f.role || 'staff') === r ? ' selected' : ''}>${esc(t(ROLE_T[r]))}</option>`).join('')}</select></div>
      <div class="field"><label for="zu-b">${esc(t('aBranchF'))}</label><select id="zu-b" name="branch"><option value="">—</option>${ARCH_CODES.map(a => `<option value="${a}"${f.branch === a ? ' selected' : ''}>${esc(Cat.archName(a))}</option>`).join('')}</select></div>
      <div class="field"><label for="zu-p">${esc(t('aNewPwd'))}</label><input id="zu-p" name="password" type="password" minlength="10" autocomplete="new-password"${f.id ? '' : ' required'}></div>
      <label class="cat-chk"><input type="checkbox" name="active" value="1"${f.active === false ? '' : ' checked'}> ${esc(t('aActive'))}</label></div>
      <div class="btn-row"><button class="btn" type="submit">${esc(t('aSave'))}</button>${f.id ? `<button class="btn ghost" type="button" data-act="za-user-new">${esc(t('aCancel'))}</button>` : ''}</div></form>
      <ul class="za-list">${us.map(u => `<li class="za-it"><div><b>${esc(u.login)}</b> <span class="pill">${esc(t(ROLE_T[u.role] || 'rStaff'))}</span>${u.active === false ? ` <span class="pill bad">off</span>` : ''}<small>${esc([u.name, u.branch ? Cat.archName(u.branch) : ''].filter(Boolean).join(' · '))}</small></div>
        <div class="btn-row"><button type="button" class="btn ghost sm" data-act="za-user-edit" data-v="${esc(u.id)}">${esc(t('aEdit'))}</button><button type="button" class="btn danger sm" data-act="za-user-del" data-v="${esc(u.id)}">${esc(t('aDel'))}</button></div></li>`).join('') || `<li class="empty">${esc(t('aNoData'))}</li>`}</ul>
      <p class="muted sm">${esc(lang === 'kz' ? 'Құпиясөздер шифрланып (scrypt) сақталады. Бас әкімші — .env файлындағы ADMIN_PASSWORD бар «admin» логині.' : 'Пароли хранятся только в виде хеша (scrypt). Главный администратор — логин «admin» с паролем ADMIN_PASSWORD из файла .env.')}</p>
      ${this.permsPanel()}`;
  },
  /* журнал действий (ТЗ 6.8 и дополнение 3.5): время, пользователь, тип операции, объект и версия записи, результат; фильтры */
  tab_journal() {
    const f = this.st.jf || '', all = (Store.data.journal || []).slice().reverse();
    const bad = e => e.res === 'denied' || e.res === 'error';
    const flt = {bad, login:e => /^(вход|выход)/.test(e.action), items:e => e.ver != null || /^(catalog|expo|memory|items)\b/.test(e.target || '')};
    const rows = flt[f] ? all.filter(flt[f]) : all;
    const chips = [['', 'aJrAll'], ['bad', 'aJrBad'], ['login', 'aJrLogin'], ['items', 'aJrItems']].map(([v, k]) => `<button type="button" class="chip" data-act="za-jf" data-v="${v}" aria-pressed="${f === v}">${esc(t(k))}${v ? ` <small>${all.filter(flt[v]).length}</small>` : ''}</button>`).join('');
    const res = e => !e.res ? '—' : e.res === 'denied' ? `<span class="pill bad">${esc(t('aJrDenied'))}${e.code ? ' ' + e.code : ''}</span>` : e.res === 'error' ? `<span class="pill bad">${esc(t('aJrErr'))}${e.code ? ' ' + e.code : ''}</span>` : e.res === 'pending' ? '…' : `<span class="pill ok">${esc(t('aJrOk'))}</span>`;
    return `<p class="muted sm">${esc(t('aJrHint'))}</p><div class="chips za-jf">${chips}</div>
      <div class="za-table-wrap"><table class="za-table"><thead><tr><th>${esc(t('aWhen'))}</th><th>${esc(t('aWho'))}</th><th>${esc(t('aRole'))}</th><th>${esc(t('aWhat'))}</th><th>${esc(t('aObj'))}</th><th>${esc(t('aVerS'))}</th><th>${esc(t('aResult'))}</th></tr></thead><tbody>
      ${rows.map(e => `<tr${bad(e) ? ' class="bad"' : ''}><td>${esc(new Date(e.ts).toLocaleString(LOC[lang] || 'ru-RU'))}</td><td>${esc(e.user)}</td><td>${e.role ? esc(t(ROLE_T[e.role] || 'rChief')) : '—'}</td><td>${esc(e.action)}</td><td>${esc(e.target || '')}${e.obj && !String(e.target || '').includes(e.obj) ? ` <code>${esc(e.obj)}</code>` : ''}</td><td>${e.ver ? 'v' + esc(e.ver) : ''}</td><td>${res(e)}</td></tr>`).join('') || `<tr><td colspan="7">${esc(t('aNoData'))}</td></tr>`}</tbody></table></div>`;
  }
};
function code4(d) { const pre = {gavko:'ГАВКО'}[d.a] || Cat.archName(d.a); return [pre, d.f ? 'Ф. ' + d.f : '', d.o ? 'Оп. ' + d.o : '', d.d ? 'Д. ' + d.d : '', d.l ? 'Л. ' + d.l : ''].filter(Boolean).join('. '); }

/* ответы сервера с текстом ошибки (например, «нет номера фонда») */
{ const api0 = Store.api.bind(Store); Store.api = async function (path, opts) {
    if (!/^\/api\/admin\/(items|users|ocr|insights|perms|settings|photos|catalog)/.test(path)) return api0(path, opts);
    opts = opts || {}; const h = {'Content-Type':'application/json'}; const tok = SS.get('token'); if (tok) h.Authorization = 'Bearer ' + tok;
    const r = await fetch(path, {method:opts.method || 'GET', headers:h, body:opts.body ? JSON.stringify(opts.body) : undefined});
    if (r.status === 401) { SS.del('token'); Admin.ok = false; }
    if (!r.ok) { let msg = ''; try { msg = (await r.json()).error || ''; } catch (e) {} throw Object.assign(new Error('api ' + r.status), {msg}); }
    return r.status === 204 ? null : r.json();
  };
  const load0 = Store.apiLoad.bind(Store); Store.apiLoad = async function () {
    await load0();
    const last = Store.last || null;   // ответ, который только что получил load0: второй запрос не нужен (ТЗ 7.2)
    const d = last && last.me ? last : null;   // ответ /api/admin/state (у него есть me); иначе это /api/public
    if (d) { Store.data.adminItems = d.items || []; Store.data.users = d.users || []; Store.data.journal = d.journal || []; Store.data.imports = d.imports || []; Store.data.stats = d.stats || {}; Store.data.roleMatrix = d.roleMatrix || null; Store.data.files = d.files || {}; Store.data.notes = d.notes || []; Store.data.noteSeen = d.noteSeen || 0; if (d.me) { SS.set('me', JSON.stringify(d.me)); SS.set('perms', JSON.stringify(d.perms || [])); } Store.data.items = (d.items || []).filter(i => i.st === 'published').map(i => ({...i.data, id:i.id, type:i.type})); }
    else Store.data.items = (last && last.items) || [];
    Cat.data = null; TZD.cache = {...TZD.cache};   // каталог перечитает опубликованные материалы
    Expo.data = null; Mem.data = null;   // выставки и события «Архива памяти» из админки тоже приходят здесь
    // если раздел уже открыт (например, по ссылке «Поделиться» на материал из админки), перерисовать: до загрузки этих материалов в нём не было
    if (typeof current !== 'undefined' && ['catalog', 'expo', 'memory'].includes(current)) { const ph = parseHash(location.hash); if (ph.v === current) TZ.route(current, ph.rest, ph.qs); }
    if (d && typeof current !== 'undefined' && current === 'admin') renderAdmin(true);   // права и материалы пришли — вкладки по правам
  };
}
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, v = el.dataset.v;
  switch (act) {
    case 'za-f': TZA.st.filter = v; renderAdmin(true); break;
    case 'za-dups': TZA.st.dups = !TZA.st.dups; if (TZA.st.dups && !Array.isArray(Cat.data)) Cat.load().then(() => renderAdmin(true)).catch(() => {}); renderAdmin(true); break;
    case 'za-new': TZA.st.form = {type:TZA.st.type, data:{}}; renderAdmin(true); break;
    case 'za-cancel': TZA.st.form = null; renderAdmin(true); break;
    case 'za-edit': { const it = (Store.data.adminItems || []).find(i => i.id === v); if (it) { TZA.st.type = it.type; TZA.st.form = {id:it.id, type:it.type, data:JSON.parse(JSON.stringify(it.data || {}))}; renderAdmin(true); } break; }
    case 'za-st': TZA.setSt(v, el.dataset.st); break;
    case 'za-del': if (confirm(t('aDel') + '?')) { try { await Store.api('/api/admin/items', {method:'DELETE', body:{id:v}}); await Store.apiLoad(); } catch (er) { toast(er.msg || t('saveFail')); } renderAdmin(true); } break;
    case 'za-export': { await Cat.load().catch(() => {}); TZA.download('catalog-' + new Date().toISOString().slice(0, 10) + '.csv', TZA.csvOf((Cat.data || []).filter(r => r.k !== 'photo' || true))); break; }
    case 'inst-lb': LB.open(About.list, t('igTitle'), '', +v); break;
    case 'za-jf': TZA.st.jf = v; renderAdmin(true); break;
    case 'za-imp-go': TZA.impGo(); break;
    case 'za-imp-rb': TZA.impRollback(v); break;
    case 'za-imp-err': TZA.impErrors(v); break;
    case 'za-imp-cancel': TZA.st.imp = null; TZA.impPaint(); break;
    case 'za-template': TZA.download('catalog-template.csv', TZA.csvOf(TZA.TPL)); break;
    case 'za-template-xlsx': TZA.download('catalog-template.xlsx', TZA.xlsxOf(TZA.TPL), XLSX_MIME); break;
    case 'za-export-xlsx': { await Cat.load().catch(() => {}); TZA.download('catalog-' + new Date().toISOString().slice(0, 10) + '.xlsx', TZA.xlsxOf(Cat.data || []), XLSX_MIME); break; }
    case 'za-ocr-make': TZA.ocrMake(); break;
    case 'za-tips': { const box = $('#za-tips'); box.innerHTML = `<p class="muted">${esc(t('aiWait'))}</p>`; try { const r = await Store.api('/api/admin/insights', {method:'POST', body:{}}); TZA.st.tips = r.tips || []; box.innerHTML = `<ul class="cat-kids">${TZA.st.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; } catch (er) { box.innerHTML = `<p class="note">${esc(er.msg || t('saveFail'))}</p>`; } break; }
    case 'za-user-edit': TZA.st.user = (Store.data.users || []).find(u => u.id === v) || null; renderAdmin(true); break;
    case 'za-user-new': TZA.st.user = null; renderAdmin(true); break;
    case 'za-user-del': if (confirm(t('aDel') + '?')) { try { await Store.api('/api/admin/users', {method:'DELETE', body:{id:v}}); await Store.apiLoad(); } catch (er) { toast(er.msg || t('saveFail')); } renderAdmin(true); } break;
  }
});
document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id === 'za-form') { e.preventDefault(); const go = e.submitter && e.submitter.value || 'draft'; TZA.save(go, ($('#zf-note') || {}).value || ''); }
  else if (f.id === 'za-ocr') { e.preventDefault(); TZA.ocr($('#za-ocr-f').files[0]); }
  else if (f.id === 'za-user') {
    e.preventDefault(); const fd = new FormData(f); const body = {id:(TZA.st.user || {}).id, login:fd.get('login'), name:fd.get('name'), role:fd.get('role'), branch:fd.get('branch'), password:fd.get('password') || undefined, active:!!fd.get('active')};
    try { await Store.api('/api/admin/users', {method:'PUT', body}); TZA.st.user = null; toast(t('saved')); await Store.apiLoad(); } catch (er) { toast(er.msg || t('saveFail')); }
    renderAdmin(true);
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'za-type') { TZA.st.type = e.target.value; TZA.st.form = null; renderAdmin(true); }
  else if (e.target.id === 'za-csv' && e.target.files[0]) { const f = e.target.files[0]; e.target.value = ''; TZA.importCSV(f); }   // сброс поля: тот же файл можно выбрать снова после «Отмены»
  else if (e.target.dataset && e.target.dataset.zaMap != null) TZA.impMap(+e.target.dataset.zaMap, e.target.value);
});

/* ================= новости: поиск, рубрики, похожие; «Поделиться» на страницах материалов ================= */
Object.assign(T, {
  nwRub:["Рубрика","Бөлім","Section"],
  nwFind:["Поиск по новостям","Жаңалықтардан іздеу","Search news"], nwAll:["Все","Барлығы","All"], nwExpo:["Выставки","Көрмелер","Exhibitions"], nwEvents:["Мероприятия","Іс-шаралар","Events"],
  nwBranches:["Филиалы","Филиалдар","Branches"], nwFonds:["Пополнение фондов","Қорларды толықтыру","New acquisitions"], nwAwards:["Награждения","Марапаттау","Awards"], nwRel:["Похожие материалы","Ұқсас материалдар","Related"], nwN:["Показано: {n}","Көрсетілді: {n}","Shown: {n}"]
});
const NEWS_CAT = {expo:/выставк|көрме|экспозиц/i, events:/день|праздн|мероприят|встреч|экскурс|лекц|семинар|конференц|акци|күні|кездесу|дәріс/i, branches:/филиал/i, fonds:/пополн|передал|передач|принят|документы участник|толықт|тапсыр/i, awards:/наград|грамот|благодар|марапат/i};
const NewsF = {q:'', c:'', fo:false,
  bar() {
    const list = $('#news-list'); if (!list) return;
    let bar = $('#news-tools');
    if (!bar) { bar = document.createElement('div'); bar.id = 'news-tools'; bar.className = 'news-tools'; list.before(bar); }
    const CATS = [['', 'nwAll'], ['expo', 'nwExpo'], ['events', 'nwEvents'], ['branches', 'nwBranches'], ['fonds', 'nwFonds'], ['awards', 'nwAwards']];
    const cur = CATS.find(([v]) => v && v === this.c);
    bar.innerHTML = `<label class="cat-bar"><span class="sr">${esc(t('nwFind'))}</span>${tzIc('i-search')}<input type="search" id="nw-q" value="${esc(this.q)}" placeholder="${esc(t('nwFind'))}" autocomplete="off" enterkeyhint="search"></label>
      <div class="cat-tools"><button type="button" class="btn ghost sm" data-act="nw-f" aria-expanded="${!!this.fo}" aria-controls="nw-fp">${tzIc('i-filter')}<span>${esc(t('fFilters'))}</span>${cur ? '<b class="cat-badge">1</b>' : ''}</button><p class="cat-n" id="nw-n" aria-live="polite"></p></div>
      ${cur ? `<div class="cat-act"><button type="button" class="chip on" data-act="nw-c" data-v="">${esc(t(cur[1]))} <span aria-hidden="true">×</span></button></div>` : ''}
      <div class="cat-panel mem-fp" id="nw-fp"${this.fo ? '' : ' hidden'}><div class="cat-grp"><p class="cat-grp-h">${esc(t('nwRub'))}</p><div class="chips" role="group">${CATS.map(([v, k]) => `<button type="button" class="chip" data-act="nw-c" data-v="${v}" aria-pressed="${this.c === v}">${esc(t(k))}</button>`).join('')}</div></div></div>`;
    this.apply();
  },
  apply() {
    const q = norm(this.q).trim(); let n = 0;
    $$('#news-list .news-item').forEach(a => { const txt = norm(a.textContent); const ok = (!q || q.split(/\s+/).every(w => txt.includes(SemQ.stem(w)))) && (!this.c || a.dataset.cat === this.c || (!a.dataset.cat && NEWS_CAT[this.c].test(a.textContent))); a.hidden = !ok; if (ok) n++; });
    const nn = $('#nw-n'); if (nn) nn.textContent = fmt(t('nwN'), {n});
  }
};
{ const rn = renderNews; renderNews = function () { rn(); NewsF.bar(); }; }
document.addEventListener('click', e => { const el = e.target.closest('[data-act="nw-c"], [data-act="nw-f"]'); if (!el) return; if (el.dataset.act === 'nw-f') NewsF.fo = !NewsF.fo; else NewsF.c = el.dataset.v; NewsF.bar(); });
document.addEventListener('input', e => { if (e.target.id === 'nw-q') { NewsF.q = e.target.value; NewsF.apply(); } });
{ const po = Page.open.bind(Page); Page.open = async function (id) {
    await po(id); const box = $('#pg'); if (!box || this.id !== String(id)) return;
    const r = PIDX.get(String(id)); if (!r) return;
    const words = new Set(norm(pTitle(r)).split(/[^a-zа-яәғқңөұүһі0-9]+/i).filter(w => w.length > 4).map(w => SemQ.stem(w)));
    const rel = r[5] === 'n' && words.size ? (SITE.pidx || []).filter(x => x[5] === 'n' && String(x[0]) !== String(id) && pTitle(x)).map(x => [norm(pTitle(x)).split(/[^a-zа-яәғқңөұүһі0-9]+/i).filter(w => w.length > 4 && words.has(SemQ.stem(w))).length, x]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0] || String(b[1][6]).localeCompare(String(a[1][6]))).slice(0, 5) : [];
    box.insertAdjacentHTML('beforeend', `${rel.length ? `<section class="cr-sec pg-rel"><h2>${esc(t('nwRel'))}</h2><ul class="cat-kids">${rel.map(([, x]) => `<li><a href="#p/${x[0]}">${esc(pTitle(x))}</a>${x[6] ? ` <small>${esc(fmtDate(x[6]))}</small>` : ''}</li>`).join('')}</ul></section>` : ''}${shareHTML().replace('<div class="share-row">', '<div class="share-row pg-share">')}`);
  };
}

/* ================= админка: филиалы (добавить, изменить, удалить, показывать на карте) и ссылки на соцсети ================= */
Object.assign(T, {
  aBranches:["Филиалы и соцсети","Филиалдар және әлеуметтік желілер","Branches & social"], aBrAdd:["Добавить филиал","Филиал қосу","Add a branch"], aBrShow:["Показывать на карте","Картада көрсету","Show on the map"],
  aBrTown:["Город или посёлок","Қала немесе кент","Town"], aBrLat:["Широта","Ендік","Latitude"], aBrLon:["Долгота","Бойлық","Longitude"], aSoc:["Официальные страницы в соцсетях","Әлеуметтік желілердегі ресми беттер","Official social pages"],
  aSocHint:["По одной на строку: сеть | ссылка https://… | подпись. Сети: telegram, instagram, facebook, youtube, vk, tiktok, whatsapp.","Әр жолға біреуден: желі | https://… сілтеме | жазу. Желілер: telegram, instagram, facebook, youtube, vk, tiktok, whatsapp.","One per line: network | https://… link | label. Networks: telegram, instagram, facebook, youtube, vk, tiktok, whatsapp."]
});
TZA.tabs.push(['branches', 'aBranches', 'settings']);
function branchList() {
  const s = S(), E = (Store.data && Store.data.brEdits) || {}, mix = b => { const e = E[b.id]; return e ? {...b, a:e.a, p:e.p, e:e.e, h:e.h} : b; };   // правки администраторов филиалов (контакты) видны и в полном списке
  if (Array.isArray(s.branchList) && s.branchList.length) return s.branchList.map(mix);
  return (SITE.branches || []).filter(b => !/потанин/i.test(b._a || b.a)).map(b => { const key = brKey(b._n || b.n); const g = BR_GEO[key] || {};
    return {id:key || ('b' + Math.random().toString(36).slice(2, 7)), n:b.n, town:g.town ? g.town[0] : '', a:b.a, p:b.p || [], e:b.e || '', h:b.h || '', z:b.z || '', head:b.head || '', lat:g.lat || '', lon:g.lon || '', approx:!!g.approx, show:true}; }).map(mix);
}
{ const ap = allPlaces; allPlaces = function () {   // филиалы из админки, если их там правили
    const s = S(); if (!(Array.isArray(s.branchList) && s.branchList.length)) return ap();
    const city = ap().filter(p => p.type !== 'branch' || p.arch === 'uka');
    const reg = s.branchList.filter(b => b.show !== false).map(b => ({id:'r-' + b.id, key:b.id, type:'branch', arch:BR_KEYS.some(k => k[0] === b.id) ? b.id : '', main:false, name:b.n, short:b.town || b.n, town:b.town || '',
      addr:String(b.a || '').replace(/^\d{6},\s*/, ''), gisq:'Восточно-Казахстанская область, ' + String(b.a || '').replace(/^\d{6},\s*/, ''), phones:Array.isArray(b.p) ? b.p : String(b.p || '').split(',').map(x => x.trim()).filter(Boolean), email:b.e, hours:b.h, zone:b.z, head:b.head, lat:+b.lat, lon:+b.lon, approx:!!b.approx}));
    return city.concat(reg);
  };
}
{ const ap2 = allPlaces; allPlaces = function () {   // контакты, которые поправил администратор филиала (Store.data.brEdits), накладываются поверх данных сайта и списка из админки
    const E = (Store.data && Store.data.brEdits) || {}; if (!Object.keys(E).length) return ap2();
    return ap2().map(p => { const e = p.type === 'branch' && E[p.arch || p.key]; if (!e) return p;
      const addr = String(e.a || p.addr).replace(/^\d{6},\s*/, '');
      return {...p, addr, ...(String(p.id).startsWith('r-') ? {gisq:'Восточно-Казахстанская область, ' + addr} : {}), phones:Array.isArray(e.p) && e.p.length ? e.p : p.phones, email:e.e || p.email, hours:e.h || p.hours}; });
  };
}
TZA.tab_branches = function () {
  const list = this.st.brEdit || (this.st.brEdit = JSON.parse(JSON.stringify(branchList())));
  const f = (b, i, k, label, extra) => `<div class="field"><label for="zb-${i}-${k}">${esc(label)}</label><input id="zb-${i}-${k}" data-br="${i}" data-k="${k}" value="${esc(Array.isArray(b[k]) ? b[k].join(', ') : (b[k] == null ? '' : b[k]))}"${extra || ''}></div>`;
  const soc = (Array.isArray(S().socials) ? S().socials : []).map(x => [x.net, x.url, x.name || ''].join(' | ')).join('\n');
  return `<form class="form" id="za-br">${list.map((b, i) => `<fieldset class="panel za-br"><legend>${esc(b.n || t('aBrAdd'))}</legend><div class="cat-adv za-grid">
      ${f(b, i, 'n', t('fTitle'), ' required')}${f(b, i, 'town', t('aBrTown'))}${f(b, i, 'a', t('brAddr'))}${f(b, i, 'p', t('brPhone') + ' (через запятую)')}${f(b, i, 'e', t('brMail'), ' type="email"')}${f(b, i, 'h', t('brHours'))}
      ${f(b, i, 'z', t('brZone'))}${f(b, i, 'head', t('brHead'))}${f(b, i, 'lat', t('aBrLat'), ' inputmode="decimal"')}${f(b, i, 'lon', t('aBrLon'), ' inputmode="decimal"')}
      <label class="cat-chk"><input type="checkbox" data-br="${i}" data-k="show"${b.show !== false ? ' checked' : ''}> ${esc(t('aBrShow'))}</label>
      <div class="btn-row"><button type="button" class="btn danger sm" data-act="za-br-del" data-v="${i}">${esc(t('aDel'))}</button></div></div></fieldset>`).join('')}
    <p class="btn-row"><button type="button" class="btn ghost" data-act="za-br-add">${esc(t('aBrAdd'))}</button></p>
    <section class="panel"><h2 class="h4">${esc(t('aSoc'))}</h2><div class="field"><label for="za-soc">${esc(t('aSocHint'))}</label><textarea id="za-soc" rows="5">${esc(soc)}</textarea></div></section>
    <p class="btn-row"><button class="btn" type="submit">${esc(t('aSave'))}</button></p></form>`;
};
document.addEventListener('input', e => {
  const el = e.target; if (!el.dataset || el.dataset.br == null || !TZA.st.brEdit) return;
  const b = TZA.st.brEdit[+el.dataset.br]; if (!b) return;
  b[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value;
});
document.addEventListener('change', e => { const el = e.target; if (el.type === 'checkbox' && el.dataset && el.dataset.br != null && TZA.st.brEdit) TZA.st.brEdit[+el.dataset.br].show = el.checked; });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.dataset.act === 'za-br-add') { TZA.st.brEdit.push({id:'b' + Date.now().toString(36), n:'', town:'', a:'', p:[], e:'', h:'', z:'', head:'', lat:'', lon:'', show:true}); renderAdmin(true); }
  else if (el.dataset.act === 'za-br-del') { if (confirm(t('aDel') + '?')) { TZA.st.brEdit.splice(+el.dataset.v, 1); renderAdmin(true); } }
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'za-br') return; e.preventDefault();
  const list = TZA.st.brEdit.map(b => ({...b, p:Array.isArray(b.p) ? b.p : String(b.p || '').split(',').map(x => x.trim()).filter(Boolean), lat:b.lat === '' ? '' : +String(b.lat).replace(',', '.'), lon:b.lon === '' ? '' : +String(b.lon).replace(',', '.')}))
    .filter(b => String(b.n || '').trim());
  const bad = list.find(b => (b.lat !== '' && !(b.lat > 40 && b.lat < 56)) || (b.lon !== '' && !(b.lon > 46 && b.lon < 88)));
  if (bad) { toast((lang === 'kz' ? 'Координаттарды тексеріңіз: ' : 'Проверьте координаты: ') + bad.n); return; }
  const socials = ($('#za-soc').value || '').split('\n').map(l => l.split('|').map(x => x.trim())).filter(x => x[0] && /^https:\/\//.test(x[1] || '')).map(([net, url, name]) => ({net:net.toLowerCase(), url, name:name || ''}));
  TZA.st.brEdit = null;
  await adminDo(() => Store.saveSettings({...S(), branchList:list, socials}));
  TZ.renderAll(); MapGis.refresh();
  // фото убранных из списка зданий больше никуда не ведут: удаляем (нужно право на фото зданий, иначе пропускаем)
  const valid = new Set(allPlaces().map(brPhotoId));
  for (const ph of (Store.data.photos || []).filter(x => x.slot === 'branch' && !valid.has(x.id))) { try { await Store.delPhoto(ph.id); } catch (er) { /* нет права — останется */ } }
});

/* ================= админка: права ролей, «Справка и FAQ», «Фото зданий» (ТЗ 6.1–6.2, 5.4, 5.5, 6.4) ================= */
Object.assign(T, {
  aPerms:["Права ролей","Рөлдердің құқықтары","Role permissions"],
  aPermsLead:["Отметьте, что может делать каждая роль. Главный администратор всегда имеет все права; управление пользователями и ролями передать нельзя. Изменения действуют сразу, в том числе у вошедших сотрудников.","Әр рөл не істей алатынын белгілеңіз. Бас әкімшіде барлық құқық әрқашан бар; пайдаланушылар мен рөлдерді басқаруды басқаға беруге болмайды. Өзгерістер бірден күшіне енеді, жүйеге кірген қызметкерлерге де.","Tick what each role may do. The chief administrator always has every permission; managing users and roles cannot be delegated. Changes apply immediately, including to staff who are already signed in."],
  aPermsRow:["Право","Құқық","Permission"], aPermsLocked:["только главный администратор","тек бас әкімші","chief administrator only"],
  aPermsReset:["Вернуть стандартные права","Стандартты құқықтарды қайтару","Restore default permissions"], aPermsResetQ:["Вернуть стандартные права всех ролей?","Барлық рөлдің стандартты құқықтарын қайтару керек пе?","Restore the default permissions of every role?"],
  permUsers:["Пользователи и роли","Пайдаланушылар мен рөлдер","Users and roles"], permJournal:["Журнал действий","Әрекеттер журналы","Activity log"], permSettings:["Настройки, справка, филиалы и соцсети","Баптаулар, анықтама, филиалдар және әлеуметтік желілер","Settings, help texts, branches and social links"],
  permNews:["Новости","Жаңалықтар","News"], permPhotos:["Фото страниц и галерея","Беттер фотолары және галерея","Page photos and gallery"], permBrphotos:["Фото зданий филиалов (администратор филиала — только своего)","Филиал ғимараттарының фотолары (филиал әкімшісі — тек өзінікін)","Branch building photos (branch administrator: own branch only)"],
  permMod:["Модерация отзывов и гостевой книги","Пікірлер мен қонақ кітабын модерациялау","Moderation of reviews and guestbook"], permItems:["Каталог, выставки, архив памяти (создание и правка)","Каталог, көрмелер, жад мұрағаты (жасау және түзету)","Catalogue, exhibitions, memory archive (create and edit)"],
  permPublish:["Согласование и публикация материалов","Материалдарды келісу және жариялау","Approving and publishing materials"], permStats:["Аналитика","Талдау","Analytics"], permQuestions:["Вопросы ассистенту","Көмекшіге қойылған сұрақтар","Questions to the assistant"], permOcr:["Распознавание сканов (ИИ)","Скандарды тану (ЖИ)","Scan recognition (AI)"],
  aGuideTab:["Справка и FAQ","Анықтама және FAQ","Help & FAQ"],
  aGuideLead:["Тексты раздела «Справка» для посетителей. Разметка: «## Заголовок», «- пункт списка», «**жирный**», «[текст](https://…)»; ссылка на раздел сайта: «[текст](#catalog)». Что не менялось, остаётся стандартным.","Посетителдерге арналған «Анықтама» бөлімінің мәтіндері. Белгілеу: «## Тақырып», «- тізім тармағы», «**жуан**», «[мәтін](https://…)»; сайт бөліміне сілтеме: «[мәтін](#catalog)». Өзгертілмегені стандартты күйінде қалады.","Texts of the visitors’ Help section. Markup: “## Heading”, “- list item”, “**bold**”, “[text](https://…)”; link to a site section: “[text](#catalog)”. Anything you leave unchanged stays standard."],
  aGuideSite:["Вкладка «О сайте»","«Сайт туралы» беті","“About the site” tab"], aGuideHow:["Вкладка «Как искать»","«Қалай іздеу керек» беті","“How to search” tab"],
  aGuideFaq:["Частые вопросы","Жиі қойылатын сұрақтар","Frequently asked questions"],
  aGuideFaqHint:["Ответы пишутся той же разметкой. Первые вопросы содержат адрес и часы работы: если они изменятся, поправьте и ответы.","Жауаптар сол белгілеумен жазылады. Алғашқы сұрақтарда мекенжай мен жұмыс уақыты бар: олар өзгерсе, жауаптарды да түзетіңіз.","Answers use the same markup. The first questions contain the address and opening hours: if those change, update the answers too."],
  aGuideLinks:["Открытые ресурсы","Ашық ресурстар","Open resources"],
  aGuideLinksHint:["По одной на строку: https://ссылка | название по-русски | по-казахски | по-английски. Если перевода нет, показывается русское название.","Әр жолға біреуден: https://сілтеме | орысша атауы | қазақша | ағылшынша. Аудармасы болмаса, орысша атауы көрсетіледі.","One per line: https://link | title in Russian | Kazakh | English. Without a translation the Russian title is shown."],
  aGuideReset:["Вернуть стандартные тексты","Стандартты мәтіндерді қайтару","Restore standard texts"], aGuideResetQ:["Вернуть стандартные тексты справки, вопросов и ссылок? Ваши правки будут удалены.","Анықтама, сұрақтар мен сілтемелердің стандартты мәтіндерін қайтару керек пе? Сіздің өзгерістеріңіз жойылады.","Restore the standard help texts, questions and links? Your edits will be removed."],
  aGuideBadLink:["Ссылка должна начинаться с https:// или http://. Строка: ","Сілтеме https:// немесе http:// деп басталуы керек. Жол: ","A link must start with https:// or http://. Line: "],
  cFaqMoved:["Частые вопросы и тексты «Справки» правятся во вкладке «Справка и FAQ».","Жиі қойылатын сұрақтар мен «Анықтама» мәтіндері «Анықтама және FAQ» бетінде өзгертіледі.","FAQ and Help texts are edited in the “Help & FAQ” tab."],
  aBrPhotos:["Фото зданий","Ғимарат фотолары","Building photos"],
  aBrPhLead:["Фото показывается в карточке здания или филиала на странице «Филиалы и контакты». JPG, PNG или WebP: сайт сам уменьшит снимок примерно до 150 КБ.","Фото «Филиалдар және байланыс» бетіндегі ғимарат немесе филиал карточкасында көрсетіледі. JPG, PNG немесе WebP: сайт суретті шамамен 150 КБ-қа дейін кішірейтеді.","The photo appears on the building or branch card in “Branches & contacts”. JPG, PNG or WebP: the site shrinks it to about 150 KB."],
  aBrPhUp:["Загрузить фото","Фото жүктеу","Upload a photo"], aBrPhRep:["Заменить фото","Фотоны ауыстыру","Replace photo"], aBrPhNone:["Фото нет","Фото жоқ","No photo"],
  aBrPhTeam:["Фото здания от команды проекта: можно заменить своим","Жоба тобының ғимарат фотосы: өзіңіздікімен ауыстыруға болады","Building photo from the project team: you can replace it with your own"],
  aBrPhBad:["Нужен файл JPG, PNG или WebP до 15 МБ.","JPG, PNG немесе WebP файлы керек, 15 МБ дейін.","A JPG, PNG or WebP file up to 15 MB is needed."], aBrPhBig:["Не удалось уменьшить снимок до 150 КБ. Выберите другой файл.","Суретті 150 КБ-қа дейін кішірейту мүмкін болмады. Басқа файл таңдаңыз.","Couldn’t shrink the picture to 150 KB. Choose another file."],
  aBrPhDelQ:["Удалить фото?","Фотоны жою керек пе?","Delete the photo?"]
});
TZA.tabs.push(['guide', 'aGuideTab', 'settings'], ['brphotos', 'aBrPhotos', 'brphotos']);

/* --- права ролей: таблица «право × роль» на вкладке «Пользователи»; видит и меняет только главный администратор --- */
const PERM_T = {users:'permUsers', journal:'permJournal', settings:'permSettings', news:'permNews', photos:'permPhotos', brphotos:'permBrphotos', brinfo:'permBrinfo', mod:'permMod', items:'permItems', publish:'permPublish', stats:'permStats', questions:'permQuestions', ocr:'permOcr'};
TZA.permsPanel = function () {
  const rm = Store.data.roleMatrix; if (!rm) return '';
  const pm = this.st.pm || (this.st.pm = JSON.parse(JSON.stringify(rm.matrix)));
  const head = rm.roles.map(r => `<th scope="col">${esc(t(ROLE_T[r] || r))}</th>`).join('');
  const rows = rm.perms.map(k => { const locked = rm.locked.includes(k), name = t(PERM_T[k] || k);
    return `<tr><th scope="row">${esc(name)}${locked ? `<small>${esc(t('aPermsLocked'))}</small>` : ''}</th>${rm.roles.map(r => `<td><input type="checkbox" data-pm="${esc(k)}" data-r="${esc(r)}" aria-label="${esc(name + ' — ' + t(ROLE_T[r] || r))}"${(pm[k] || []).includes(r) ? ' checked' : ''}${locked || r === 'chief' ? ' disabled' : ''}></td>`).join('')}</tr>`; }).join('');
  return `<section class="panel za-perms"><h2 class="h4">${esc(t('aPerms'))}</h2><p class="muted sm">${esc(t('aPermsLead'))}</p>
    <div class="za-table-wrap"><table class="za-table za-pm"><thead><tr><th scope="col">${esc(t('aPermsRow'))}</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <p class="btn-row"><button type="button" class="btn" data-act="za-pm-save">${esc(t('aSave'))}</button><button type="button" class="btn ghost" data-act="za-pm-reset">${esc(t('aPermsReset'))}</button></p></section>`;
};
document.addEventListener('change', e => {
  const el = e.target; if (!el.dataset || el.dataset.pm == null || !TZA.st.pm) return;
  const a = new Set(TZA.st.pm[el.dataset.pm] || []); if (el.checked) a.add(el.dataset.r); else a.delete(el.dataset.r);
  TZA.st.pm[el.dataset.pm] = [...a];
});

/* --- «Справка и FAQ»: тексты «О сайте» и «Как искать», частые вопросы, открытые ресурсы --- */
const GL = ['ru', 'kz', 'en'];
const guideDefault = (k, lg) => (GTXT[k][GL.indexOf(lg)] || '').replace(/\{eg\}/g, EGOV[lg]).trim();
const htmlToMd = h => String(h || '').replace(/<a\s[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (m, u, tx) => /^(https?:\/\/|#)/.test(u) ? `[${tx.replace(/<[^>]+>/g, '')}](${u})` : tx)
  .replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
const faqDefault = () => FAQS.map(f => { const a = f.a(); return {q:{ru:f.q[0], kz:f.q[1], en:f.q[2]}, a:{ru:htmlToMd(a[0]), kz:htmlToMd(a[1]), en:htmlToMd(a[2])}}; });
const faqCurrent = () => { const c = (S().content || {}).faq; return Array.isArray(c) && c.length ? c : faqDefault(); };
const refsDefault = () => RES_LINKS.map(([url, tt]) => ({url, t:{ru:tt[0], kz:tt[1], en:tt[2]}}));
TZA.tab_guide = function () {
  const own = S().guide || {};
  const area = (k, lg) => `<div class="field"><label for="zg-${k}-${lg}">${lg.toUpperCase()}</label><textarea id="zg-${k}-${lg}" rows="14" style="min-height:14rem">${esc(own[k] && typeof own[k][lg] === 'string' && own[k][lg].trim() ? own[k][lg] : guideDefault(k, lg))}</textarea></div>`;
  return `${this.who()}<form class="admin-stack" id="guide-form" novalidate><p class="muted">${esc(t('aGuideLead'))}</p>
    <section class="panel"><h2 class="h4">${esc(t('aGuideHow'))}</h2>${GL.map(lg => area('guide', lg)).join('')}</section>
    <section class="panel"><h2 class="h4">${esc(t('aGuideFaq'))}</h2><p class="muted sm">${esc(t('aGuideFaqHint'))}</p><div class="entries" id="faq-edit">${faqCurrent().map(faqRowHTML).join('')}</div>
      <button class="btn ghost sm" type="button" data-act="faq-add" style="align-self:flex-start">${esc(t('cAddQ'))}</button></section>
    <div class="btn-row"><button class="btn" type="submit">${esc(t('aSave'))}</button><button class="btn ghost" type="button" data-act="za-guide-reset">${esc(t('aGuideReset'))}</button></div></form>`;
};
async function saveGuide(next) {
  try { await Store.saveSettings(next); toast(t('saved')); } catch (er) { toast(er.msg || t('saveFail')); }
  TZ.renderAll(); if (typeof renderContent === 'function') renderContent(); renderAdmin(true);
}
document.addEventListener('submit', async e => {
  if (e.target.id !== 'guide-form') return; e.preventDefault();
  const f = e.target, val = sel => (($(sel, f) || {}).value || '').replace(/\r/g, '').trim();
  const guide = {};   // храним только то, что отличается от стандартного текста: остальное обновляется вместе с кодом сайта
  for (const k of ['guide']) for (const lg of GL) { const v = val(`#zg-${k}-${lg}`); if (v && v !== guideDefault(k, lg)) (guide[k] = guide[k] || {})[lg] = v; }
  const faq = $$('#faq-edit .faq-row', f).map(r => { const g = c => (($(c, r) || {}).value || '').trim(); return {q:{ru:g('.fq-ru'), kz:g('.fq-kz'), en:g('.fq-en')}, a:{ru:g('.fa-ru'), kz:g('.fa-kz'), en:g('.fa-en')}}; }).filter(x => x.q.ru);
  const next = {...S()}, C = {...(S().content || {})};
  if (Object.keys(guide).length) next.guide = guide; else delete next.guide;
  if (JSON.stringify(faq) !== JSON.stringify(faqDefault())) C.faq = faq; else delete C.faq;
  delete next.refLinks;   // вкладок «О сайте» и «Открытые ресурсы» больше нет
  next.content = Object.keys(C).length ? C : null;
  await saveGuide(next);
});

/* --- «Фото зданий»: фото для карточек на странице «Филиалы и контакты» --- */
TZA.tab_brphotos = function () {
  const me = this.me() || {};
  let ps = allPlaces();
  if (me.role === 'branch') ps = ps.filter(p => (p.arch || p.key) === me.branch);   // администратор филиала — только свой
  const own = id => (Store.data.photos || []).find(x => x.slot === 'branch' && x.id === id && x.src);
  return `${this.who()}<p class="muted">${esc(t('aBrPhLead'))}</p><ul class="za-list">${ps.map(p => {
    const id = brPhotoId(p), mine = own(id), src = placePhoto(p);
    return `<li class="za-it"><div><div class="za-brph-row"><span class="za-brph">${src ? `<img src="${esc(src)}" alt="">` : esc(t('aBrPhNone'))}</span>
      <span class="za-brph-tx"><b>${esc(p.name)}</b><small>${esc(p.town ? p.town + ', ' + p.addr : p.addr)}</small>${!mine && src ? `<small>${esc(t('aBrPhTeam'))}</small>` : ''}</span></div></div>
      <div class="btn-row"><label class="btn sm"><input type="file" class="sr" accept="image/jpeg,image/png,image/webp" data-brph="${esc(id)}" data-nm="${esc(p.name)}">${esc(t(mine ? 'aBrPhRep' : 'aBrPhUp'))}</label>${mine ? `<button type="button" class="btn danger sm" data-act="za-brph-del" data-v="${esc(id)}">${esc(t('aDel'))}</button>` : ''}</div></li>`; }).join('') || `<li class="empty">${esc(t('aNoData'))}</li>`}</ul>`;
};
document.addEventListener('change', async e => {
  const el = e.target; if (!el.dataset || el.dataset.brph == null || !el.files || !el.files[0]) return;
  const file = el.files[0], id = el.dataset.brph, nm = el.dataset.nm || '';
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 15e6) { toast(t('aBrPhBad')); el.value = ''; return; }
  const src = await compressImage(file, {sides:[960, 800, 640], max:150000}).catch(() => null);   // фото зданий едут в /api/public вместе со всеми: держим их лёгкими
  if (!src) { toast(t('aBrPhBig')); el.value = ''; return; }
  try { await Store.savePhoto({id, src, slot:'branch', cap:{ru:nm, kz:nm, en:nm}, ts:Date.now()}); toast(t('saved')); } catch (er) { toast(er.msg || t('saveFail')); }
  renderAdmin(true); if ($('#br-card')) Br.card();
});
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act === 'za-pm-save' || act === 'za-pm-reset') {
    if (act === 'za-pm-reset' && !confirm(t('aPermsResetQ'))) return;
    try { await Store.api('/api/admin/perms', {method:'PUT', body:act === 'za-pm-reset' ? {reset:true} : {matrix:TZA.st.pm}}); toast(t('saved')); await Store.apiLoad(); TZA.st.pm = null; } catch (er) { toast(er.msg || t('saveFail')); }   // pm сбрасываем после загрузки: пока она идёт, панель может перерисоваться и закешировать старую таблицу
    renderAdmin(true);
  } else if (act === 'za-guide-reset') {
    if (!confirm(t('aGuideResetQ'))) return;
    const next = {...S()}, C = {...(S().content || {})}; delete next.guide; delete next.refLinks; delete C.faq; next.content = Object.keys(C).length ? C : null;
    await saveGuide(next);
  } else if (act === 'za-brph-del') {
    if (!confirm(t('aBrPhDelQ'))) return;
    try { await Store.delPhoto(el.dataset.v); toast(t('saved')); } catch (er) { toast(er.msg || t('saveFail')); }
    renderAdmin(true); if ($('#br-card')) Br.card();
  }
});

/* ================= админка: «Контакты филиала» — адрес, телефоны, почта и часы; администратор филиала правит только свой (сценарий проверки ТЗ) ================= */
Object.assign(T, {
  aBrInfo:["Контакты филиала","Филиал байланыстары","Branch contacts"],
  aBrInfoLead:["Измените адрес, телефоны, почту и часы работы. Изменения сразу появятся на странице «Филиалы и контакты». Название, руководитель и положение на карте остаются прежними: их меняет администратор сайта.","Мекенжайды, телефондарды, поштаны және жұмыс уақытын өзгертіңіз. Өзгерістер «Филиалдар және байланыс» бетінде бірден көрінеді. Атауы, басшысы және картадағы орны өзгеріссіз қалады: оларды сайт әкімшісі өзгертеді.","Change the address, phones, email and opening hours. The changes appear at once on the “Branches & contacts” page. The name, head and map position stay as they are: the site administrator changes them."],
  aBrInfoMain:["Контакты главного здания меняет администратор сайта во вкладке «Настройки».","Бас ғимарат байланыстарын сайт әкімшісі «Баптаулар» бетінде өзгертеді.","The main building’s contacts are changed by the site administrator in the “Settings” tab."],
  aBrInfoPhones:["Телефоны (через запятую)","Телефондар (үтір арқылы)","Phones (comma-separated)"],
  aBrInfoReset:["Вернуть стандартные","Стандартты күйін қайтару","Restore standard"],
  aBrInfoResetQ:["Вернуть стандартные контакты этого филиала? Ваша правка будет удалена.","Осы филиалдың стандартты байланыстарын қайтару керек пе? Сіздің өзгерісіңіз жойылады.","Restore the standard contacts of this branch? Your edit will be removed."],
  aBrInfoEdited:["Последняя правка: {by}, {d}","Соңғы өзгеріс: {by}, {d}","Last edit: {by}, {d}"],
  permBrinfo:["Контакты филиалов (администратор филиала — только своего)","Филиал байланыстары (филиал әкімшісі — тек өзінікін)","Branch contacts (branch administrator: own branch only)"]
});
TZA.tabs.push(['brinfo', 'aBrInfo', 'brinfo']);
TZA.tab_brinfo = function () {
  const me = this.me() || {}, E = Store.data.brEdits || {};
  if (me.role === 'branch' && me.branch === 'gavko') return `${this.who()}<p class="note">${tzIc('i-info')}<span>${esc(t('aBrInfoMain'))}</span></p>`;
  let ps = allPlaces().filter(p => p.type === 'branch');
  if (me.role === 'branch') ps = ps.filter(p => (p.arch || p.key) === me.branch);   // администратор филиала — только свой
  const fld = (c, k, label, v, extra) => `<div class="field"><label for="bi-${esc(c)}-${k}">${esc(label)}</label><input id="bi-${esc(c)}-${k}" name="${k}" value="${esc(v)}"${extra || ''}></div>`;
  return `${this.who()}<p class="muted">${esc(t('aBrInfoLead'))}</p>${ps.map(p => { const c = p.arch || p.key, e = E[c];
    return `<form class="panel za-brinfo" data-brinfo="${esc(c)}"><h2 class="h4">${esc(p.name)}</h2><div class="cat-adv za-grid">${fld(c, 'a', t('brAddr'), p.addr, ' required maxlength="200"')}${fld(c, 'p', t('aBrInfoPhones'), (p.phones || []).join(', '), ' maxlength="200"')}${fld(c, 'e', t('brMail'), p.email || '', ' type="email" maxlength="80"')}${fld(c, 'h', t('brHours'), p.hours || '', ' maxlength="120"')}</div>
      <p class="btn-row"><button class="btn" type="submit">${esc(t('aSave'))}</button>${e ? `<button type="button" class="btn ghost" data-act="za-brinfo-reset" data-v="${esc(c)}">${esc(t('aBrInfoReset'))}</button>` : ''}</p>
      ${e ? `<p class="muted sm">${esc(fmt(t('aBrInfoEdited'), {by:e.by, d:new Date(e.at).toLocaleString(LOC[lang] || 'ru-RU')}))}</p>` : ''}</form>`; }).join('') || `<p class="note">${esc(t('aNoData'))}</p>`}`;
};
document.addEventListener('submit', async e => {
  const f = e.target.closest && e.target.closest('form[data-brinfo]'); if (!f) return; e.preventDefault();
  const g = k => (f.elements[k] ? f.elements[k].value : '').trim();
  try { await Store.api('/api/admin/branch', {method:'PUT', body:{id:f.dataset.brinfo, a:g('a'), p:g('p'), e:g('e'), h:g('h')}}); toast(t('saved')); await Store.apiLoad(); } catch (er) { toast(er.msg || t('saveFail')); }
  renderAdmin(true); if ($('#br-card')) Br.card();
});
document.addEventListener('click', async e => {
  const el = e.target.closest && e.target.closest('[data-act="za-brinfo-reset"]'); if (!el) return;
  if (!confirm(t('aBrInfoResetQ'))) return;
  try { await Store.api('/api/admin/branch', {method:'PUT', body:{id:el.dataset.v, reset:true}}); toast(t('saved')); await Store.apiLoad(); } catch (er) { toast(er.msg || t('saveFail')); }
  renderAdmin(true); if ($('#br-card')) Br.card();
});

/* ================= админка: перенесённые записи каталога — найти, исправить, скрыть (ТЗ 6.3) ================= */
Object.assign(T, {
  aCatTitle:["Перенесённые записи каталога","Көшірілген каталог жазбалары","Records migrated from the old site"],
  aCatLead:["Записи, перенесённые со старого сайта: исправьте описание, скройте ошибочную запись или верните исходное. Скрытая запись пропадает с сайта, из поиска и из sitemap, исходные данные не удаляются. Без запроса показаны уже изменённые и скрытые, по запросу — первые 40 найденных.","Ескі сайттан көшірілген жазбалар: сипаттамасын түзетіңіз, қате жазбаны жасырыңыз немесе бастапқысын қайтарыңыз. Жасырылған жазба сайттан, іздеуден және sitemap-тан жоғалады, бастапқы деректер жойылмайды. Сұраусыз өзгертілген және жасырылғандар көрсетіледі, сұрау бойынша алғашқы 40 табылғаны.","Records migrated from the old site: fix a description, hide a faulty record or restore the original. A hidden record disappears from the site, search and sitemap; the original data is kept. With no query the changed and hidden ones are shown, with a query the first 40 matches."],
  aCatFind:["Название, шифр, автор или номер","Атауы, шифры, авторы немесе нөмірі","Title, code, author or ID"], aCatSearch:["Найти","Іздеу","Search"],
  aCatHidden:["Скрыта","Жасырылған","Hidden"], aCatEdited:["Изменена","Өзгертілген","Edited"], aCatShow:["Показать","Көрсету","Show"], aCatHide:["Скрыть","Жасыру","Hide"], aCatReset:["Вернуть исходное","Бастапқысын қайтару","Restore original"],
  aCatResetQ:["Вернуть запись к исходному виду и показать её на сайте?","Жазбаны бастапқы күйіне қайтарып, сайтта көрсету керек пе?","Restore the record to its original state and show it on the site?"]
});
Object.assign(TZA, {
  catEditBox() {
    if (!this.can('publish')) return '';
    const c = this.st.cat || (this.st.cat = {q:'', res:null, edit:null});
    if (c.res === null && !c.loading) { c.loading = true; this.catLoad(); }
    const rows = (c.res || []).map(x => { const e = {...x.raw, ...x.patch}, edited = Object.keys(x.patch).length;
      return `<li class="za-it"><div><b>${esc(LK(e.t) || x.id)}</b>${x.hidden ? ` <span class="pill bad">${esc(t('aCatHidden'))}</span>` : ''}${edited ? ` <span class="pill warn">${esc(t('aCatEdited'))}</span>` : ''}
        <small>${esc([t(KIND_T[x.k] || 'kDoc'), x.c, x.a ? Cat.archName(x.a) : ''].filter(Boolean).join(' · '))}</small></div>
        <div class="btn-row"><button type="button" class="btn ghost sm" data-act="za-cat-edit" data-v="${esc(x.id)}">${esc(t('aEdit'))}</button>
        <button type="button" class="btn ghost sm" data-act="za-cat-hide" data-v="${esc(x.id)}" data-h="${x.hidden ? 0 : 1}">${esc(t(x.hidden ? 'aCatShow' : 'aCatHide'))}</button>
        ${x.hidden || edited ? `<button type="button" class="btn ghost sm" data-act="za-cat-reset" data-v="${esc(x.id)}">${esc(t('aCatReset'))}</button>` : ''}</div></li>`; }).join('');
    return `<section class="panel za-catedit"><h2 class="h4">${esc(t('aCatTitle'))}</h2><p class="muted sm">${esc(t('aCatLead'))}</p>
      <form class="cat-tools" id="za-cat-search"><input type="search" id="za-cq" value="${esc(c.q)}" placeholder="${esc(t('aCatFind'))}" aria-label="${esc(t('aCatFind'))}" autocomplete="off"><button class="btn sm" type="submit">${esc(t('aCatSearch'))}</button></form>
      ${c.edit ? this.catForm(c.edit) : ''}
      <ul class="za-list">${c.res ? (rows || `<li class="empty">${esc(t('aNoData'))}</li>`) : ''}</ul></section>`;
  },
  catForm(x) {
    const e = {...x.raw, ...x.patch}, tt = e.t || {};
    const inp = (id, label, val, extra) => `<div class="field"><label for="cf-${id}">${esc(label)}</label><input id="cf-${id}" name="${id}" value="${esc(val == null ? '' : val)}"${extra || ''}></div>`;
    const ta = (id, label, val) => `<div class="field w2"><label for="cf-${id}">${esc(label)}</label><textarea id="cf-${id}" name="${id}">${esc(val || '')}</textarea></div>`;
    return `<form class="panel form za-form" id="za-cat-form"><h3 class="h4">${esc(x.id)}${x.c ? ' · ' + esc(x.c) : ''}</h3><div class="cat-adv za-grid">
      ${inp('tru', t('fTitle') + ' (RU)*', tt.ru, ' required minlength="3"')}${inp('tkk', t('fTitle') + ' (KZ)', tt.kk)}
      ${inp('au', t('fAuthor'), e.au)}${inp('dt', t('cDate'), e.dt)}${inp('y0', t('fFrom'), e.y0, ' inputmode="numeric" maxlength="4"')}${inp('y1', t('fTo'), e.y1, ' inputmode="numeric" maxlength="4"')}
      <div class="field"><label for="cf-acc">${esc(t('cAccess'))}</label><select id="cf-acc" name="acc">${['open', 'declass', 'limited'].map(a => `<option value="${a}"${(e.acc || 'open') === a ? ' selected' : ''}>${esc(Cat.accName(a))}</option>`).join('')}</select></div>
      <div class="field"><label for="cf-lang">${esc(t('cLang'))}</label><select id="cf-lang" name="lang">${[['ru', 'Русский'], ['kk', 'Қазақша'], ['other', '—']].map(([v, l]) => `<option value="${v}"${(e.lang || 'ru') === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
      ${inp('pl', t('cPlaces') + ' (через запятую)', (e.pl || []).join(', '))}
      <fieldset class="field w2 za-tops"><legend>${esc(t('cTopics'))}</legend>${Object.keys(TOPIC_T).map(k => `<label><input type="checkbox" name="top" value="${k}"${(e.top || []).includes(k) ? ' checked' : ''}> ${esc(t(TOPIC_T[k]))}</label>`).join('')}</fieldset>
      ${ta('ds', t('cDesc'), e.ds)}${ta('nt', t('cNote'), e.nt)}${this.filesBlock('cat')}</div>
      <div class="btn-row"><button class="btn" type="submit">${esc(t('aSave'))}</button><button class="btn ghost" type="button" data-act="za-cat-cancel">${esc(t('aCancel'))}</button></div></form>`;
  },
  async catLoad(q) {
    const c = this.st.cat || (this.st.cat = {q:'', res:null, edit:null});
    if (q !== undefined) c.q = q;
    try { c.res = (await Store.api('/api/admin/catalog?q=' + encodeURIComponent(c.q))).items; } catch (er) { c.res = []; toast(er.msg || t('saveFail')); }
    c.loading = false; renderAdmin(true);
  },
  async catSave(body) {
    try { await Store.api('/api/admin/catalog', {method:'PUT', body}); toast(t('saved')); this.st.cat.edit = null; }
    catch (er) { toast(er.msg || t('saveFail')); return; }
    delete TZD.cache.catalog; delete TZD.wait.catalog; Cat.data = null;   // сайт перечитает каталог уже с правкой
    await this.catLoad();
  }
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return; const act = el.dataset.act, id = el.dataset.v;
  if (act === 'za-cat-edit') { const x = ((TZA.st.cat || {}).res || []).find(r => r.id === id); if (x) { TZA.st.cat.edit = {...x, files:(({...x.raw, ...x.patch}).files || []).map(f => ({...f}))}; renderAdmin(true); const f = $('#za-cat-form'); if (f) f.scrollIntoView({block:'nearest'}); } }
  else if (act === 'za-cat-cancel') { TZA.st.cat.edit = null; renderAdmin(true); }
  else if (act === 'za-cat-hide') TZA.catSave({id, hidden:el.dataset.h === '1'});
  else if (act === 'za-cat-reset') { if (confirm(t('aCatResetQ'))) TZA.catSave({id, reset:true}); }
});
document.addEventListener('submit', e => {
  if (e.target.id === 'za-cat-search') { e.preventDefault(); TZA.catLoad(($('#za-cq').value || '').trim()); }
  else if (e.target.id === 'za-cat-form') {
    e.preventDefault(); const fd = new FormData(e.target), g = k => String(fd.get(k) || '').trim(), id = TZA.st.cat.edit.id;
    TZA.catSave({id, patch:{t:{ru:g('tru'), kk:g('tkk')}, au:g('au'), dt:g('dt'), y0:g('y0') ? +g('y0') : null, y1:g('y1') ? +g('y1') : null, acc:g('acc'), lang:g('lang'),
      pl:g('pl') ? g('pl').split(',').map(x => x.trim()).filter(Boolean) : [], top:fd.getAll('top'), ds:g('ds'), nt:g('nt'),
      files:(TZA.st.cat.edit.files || []).map(f => ({id:f.id, n:f.n}))}});
  }
});

/* ================= админка: цифровые копии записей каталога — сканы (JPG, PNG, WebP, TIFF) и PDF (ТЗ 6.3, 7.7) =================
   Файл уходит на сервер как есть (мастер-копия); для изображений браузер сотрудника делает облегчённую копию JPEG до 1800 px.
   TIFF браузеры обычно не открывают — его разбирает Formats.decodeTIFF (dev/formats.js). */
Object.assign(T, {
  aFiles:["Цифровые копии: сканы и PDF","Цифрлық көшірмелер: скандар және PDF","Digital copies: scans and PDF"],
  aFilesAdd:["Добавить сканы или PDF","Скан немесе PDF қосу","Add scans or PDF"],
  aFilesHint:["JPG, PNG, WebP — до 25 МБ, TIFF — до 100 МБ, PDF — до 50 МБ; можно выбрать сразу несколько. Исходный файл хранится как мастер-копия (её видят только сотрудники), на сайте показывается облегчённая копия. Файлы прикрепятся после сохранения записи.","JPG, PNG, WebP — 25 МБ дейін, TIFF — 100 МБ дейін, PDF — 50 МБ дейін; бірнешеуін бірден таңдауға болады. Бастапқы файл мастер-көшірме ретінде сақталады (оны тек қызметкерлер көреді), сайтта жеңілдетілген көшірмесі көрсетіледі. Файлдар жазба сақталғаннан кейін бекітіледі.","JPG, PNG, WebP up to 25 MB, TIFF up to 100 MB, PDF up to 50 MB; several at once. The original is kept as the master copy (staff only); the site shows a lighter copy. Files are attached when the record is saved."],
  aFilesNone:["Файлов пока нет","Әзірге файл жоқ","No files yet"], aFilesUp:["Загружаю {i} из {n}: {name}","Жүктеп жатырмын {i} / {n}: {name}","Uploading {i} of {n}: {name}"],
  aFilesView:["Делаю облегчённую копию для показа…","Көрсетуге арналған жеңілдетілген көшірме жасап жатырмын…","Making a lighter copy for viewing…"],
  aFilesDone:["Загружено файлов: {n}. Не забудьте сохранить запись.","Жүктелген файлдар: {n}. Жазбаны сақтауды ұмытпаңыз.","Files uploaded: {n}. Remember to save the record."],
  aFilesType:["можно только JPG, PNG, WebP, TIFF или PDF","тек JPG, PNG, WebP, TIFF немесе PDF болады","only JPG, PNG, WebP, TIFF or PDF"], aFilesBig:["файл больше {n} МБ","файл {n} МБ-тан үлкен","file is over {n} MB"],
  aFilesNoView:["{name}: не удалось сделать копию для показа ({e}). Файл сохранён как мастер-копия; чтобы показать его на сайте, приложите ещё JPG.","{name}: көрсетуге көшірме жасалмады ({e}). Файл мастер-көшірме ретінде сақталды; сайтта көрсету үшін JPG те қосыңыз.","{name}: couldn’t make a viewing copy ({e}). Saved as the master copy; attach a JPG as well to show it on the site."],
  aFilesNoViewShort:["только мастер-копия","тек мастер-көшірме","master copy only"], aFilesMaster:["Скачать мастер-копию","Мастер-көшірмені жүктеу","Download master copy"],
  aFilesUpT:["Выше","Жоғары","Move up"], aFilesDownT:["Ниже","Төмен","Move down"], aFilesDel:["Убрать из записи","Жазбадан алып тастау","Remove from record"],
  aExpoAdd:["Загрузить фото экспонатов","Экспонат фотоларын жүктеу","Upload exhibit photos"],
  aExpoHint:["Фото и сканы (JPG, PNG, WebP, TIFF), можно сразу несколько. Каждый файл добавится строкой в список экспонатов выше — подпись после «|» можно поправить. Порядок строк — порядок экспонатов.","Фото мен скандар (JPG, PNG, WebP, TIFF), бірнешеуін бірден таңдауға болады. Әр файл жоғарыдағы экспонаттар тізіміне жол болып қосылады — «|» белгісінен кейінгі жазуды түзетуге болады. Жолдардың реті — экспонаттардың реті.","Photos and scans (JPG, PNG, WebP, TIFF), several at once. Each file is added as a line to the exhibit list above; edit the caption after “|”. Line order is exhibit order."],
  aExpoImgOnly:["в выставку добавляются только изображения","көрмеге тек суреттер қосылады","only images can be added to an exhibition"],
  fYt:["Видео YouTube: ссылки через запятую","YouTube бейнесі: сілтемелер үтір арқылы","YouTube videos: links, comma-separated"], fFonds:["Связанные фонды: номера через запятую","Байланысты қорлар: нөмірлері үтір арқылы","Related fonds: numbers, comma-separated"],
  expoVideo:["Видео","Бейне","Video"], expoFonds:["Связанные фонды","Байланысты қорлар","Related fonds"], expoFondN:["Фонд № {n}","№ {n} қор","Fond {n}"],
  aMemKind:["Вид материала","Материал түрі","Kind of item"], aMemEvent:["Событие хронологии","Хронология оқиғасы","Timeline event"], aMemPerson:["Человек (биография)","Адам (өмірбаян)","Person (biography)"],
  aMemName:["Фамилия, имя, отчество","Тегі, аты, әкесінің аты","Full name"], aMemGroups:["Группы через запятую, например: Герои, Почётные граждане","Топтар үтір арқылы, мысалы: Батырлар, Құрметті азаматтар","Groups, comma-separated, e.g. Heroes, Honorary citizens"],
  aMemBorn:["Год рождения","Туған жылы","Year of birth"], aMemDied:["Год смерти","Қайтыс болған жылы","Year of death"], aMemSrc:["Источник: откуда сведения","Дереккөз: мәлімет қайдан алынды","Source of the information"],
  aMemRel:["Связанные записи каталога: номера через запятую (из адреса карточки, например d-42458-1)","Байланысты каталог жазбалары: нөмірлері үтір арқылы (карточка мекенжайынан, мысалы d-42458-1)","Related catalogue records: IDs, comma-separated (from the card address, e.g. d-42458-1)"],
  aMemPhoto:["Фото: адрес или загрузите файл","Фото: мекенжай немесе файл жүктеңіз","Photo: address or upload a file"], aMemPhotoUp:["Загрузить фото","Фото жүктеу","Upload a photo"],
  stClosedS:["Закрыто","Жабық","Closed"],
  protoPill:["Прототип","Прототип","Prototype"],
  protoNote:["Прототип команды 2try для CODEMASTERS HACKATHON 9.0 — не официальный сайт Государственного архива ВКО","2try командасының CODEMASTERS HACKATHON 9.0 үшін прототипі — ШҚО мемлекеттік архивінің ресми сайты емес","Prototype by team 2try for CODEMASTERS HACKATHON 9.0 — not the official website of the State Archive of East Kazakhstan Region"], memStaffG:["Люди края","Өлке адамдары","People of the region"], memYearRecs:["Материалы {y} года в каталоге: {n}","Каталогтағы {y} жылғы материалдар: {n}","Catalogue records from {y}: {n}"], memMore:["Показать всех ({n})","Барлығын көрсету ({n})","Show all ({n})"], memRelT:["Материалы в каталоге","Каталогтағы материалдар","Catalogue records"]
});
const UP_LIM = {jpg:25, png:25, webp:25, tif:100, pdf:50, mp4:100, webm:100, mp3:100, m4a:100, ogg:100, wav:100};
const MEDIA_EXT = ['mp4', 'webm', 'mp3', 'm4a', 'ogg', 'wav'];   // видео и аудио выставок
const fmtSize = b => b < 1048576 ? Math.max(1, Math.round(b / 1024)) + ' КБ' : (b / 1048576).toFixed(1).replace('.', ',') + ' МБ';
async function upRaw(url, body) {   // тело — сам файл; токен сотрудника в заголовке
  const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/octet-stream', Authorization:'Bearer ' + (SS.get('token') || '')}, body});
  let j = null; try { j = await r.json(); } catch (e) {}
  if (!r.ok) throw new Error((j && j.error) || ('ошибка ' + r.status));
  return j;
}
async function makeViewCopy(file, ext) {   // облегчённая копия JPEG до 1800 px по длинной стороне
  let src, ow, oh;
  try { src = await createImageBitmap(file); ow = src.width; oh = src.height; }
  catch (e) {
    if (ext !== 'tif') throw new Error('браузер не смог открыть изображение');
    const d = await Formats.decodeTIFF(new Uint8Array(await file.arrayBuffer()), 1800);
    src = new ImageData(d.rgba, d.outW, d.outH); ow = d.width; oh = d.height;
  }
  const k = Math.min(1, 1800 / Math.max(src.width, src.height)), w = Math.max(1, Math.round(src.width * k)), h = Math.max(1, Math.round(src.height * k));
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.imageSmoothingQuality = 'high';
  if (src instanceof ImageData) { const tmp = document.createElement('canvas'); tmp.width = src.width; tmp.height = src.height; tmp.getContext('2d').putImageData(src, 0, 0); g.drawImage(tmp, 0, 0, w, h); }
  else { g.drawImage(src, 0, 0, w, h); if (src.close) src.close(); }
  for (const q of [0.85, 0.75, 0.6]) { const b = await new Promise(r => c.toBlob(r, 'image/jpeg', q)); if (b && b.size <= 3.8 * 1048576) return {blob:b, w, h, ow, oh}; }
  throw new Error('копия получилась слишком большой');
}
Object.assign(TZA, {
  thumbs: {},
  fileList(scope) { return scope === 'cat' ? (this.st.cat && this.st.cat.edit && this.st.cat.edit.files) : (this.st.form && this.st.form.files); },
  fileRows(scope) {
    const list = this.fileList(scope) || [], meta = Store.data.files || {};
    return list.map((f, i) => {
      const m = meta[f.id] || {}, ext = String(f.ext || m.ext || (f.k === 'pdf' ? 'pdf' : '')).toUpperCase(), size = f.s || m.size;
      const noView = f.noView || f.v === 0 || (m.ext === 'tif' && !m.view && !f.s);
      const b = (zf, label, txt, cls) => `<button type="button" class="btn ${cls || 'ghost'} sm" data-zf="${zf}" data-s="${scope}" data-i="${i}" aria-label="${esc(label)}" title="${esc(label)}">${txt}</button>`;
      return `<li class="za-f"><span class="za-fth"${f.k === 'img' && !noView ? ` data-fth="${esc(f.id)}"` : ''}>${esc(ext || '…')}</span>
        <span class="za-fn"><b>${esc(f.n)}</b><small>${esc([ext, size ? fmtSize(size) : '', noView ? t('aFilesNoViewShort') : ''].filter(Boolean).join(' · '))}</small></span>
        <span class="btn-row">${i > 0 ? b('up', t('aFilesUpT'), '↑') : ''}${i < list.length - 1 ? b('down', t('aFilesDownT'), '↓') : ''}${b('master', t('aFilesMaster'), tzIc('i-download'))}${b('del', t('aFilesDel'), '✕', 'danger')}</span></li>`;
    }).join('') || `<li class="empty">${esc(t('aFilesNone'))}</li>`;
  },
  filesBlock(scope, video) {   // video — блок видеофайлов выставки (MP4, WebM), иначе цифровые копии записи каталога
    setTimeout(() => this.fillThumbs());
    return `<div class="field w2 za-files"><span class="za-files-h">${esc(t(video ? 'aVideoFiles' : 'aFiles'))}</span>
      <ul class="za-flist" id="za-flist-${scope}">${this.fileRows(scope)}</ul>
      <div class="btn-row"><label class="btn ghost sm"><input type="file" class="sr" multiple accept="${video ? 'video/mp4,video/webm,audio/mpeg,audio/mp4,audio/ogg,audio/wav,.mp4,.webm,.mp3,.m4a,.ogg,.wav' :'image/jpeg,image/png,image/webp,image/tiff,.tif,.tiff,application/pdf'}" data-zup="${scope}">${esc(t('aFilesAdd'))}</label></div>
      <p class="sm za-up-st" id="za-up-${scope}" aria-live="polite"></p><small class="muted">${esc(t(video ? 'aVideoHint' : 'aFilesHint'))}</small></div>`;
  },
  renderFiles(scope) { const ul = $('#za-flist-' + scope); if (ul) ul.innerHTML = this.fileRows(scope); this.fillThumbs(); },
  fillThumbs() {   // миниатюры: файл ещё не опубликован, поэтому берём его с токеном сотрудника
    $$('[data-fth]').forEach(async el => {
      const id = el.dataset.fth; if (el.querySelector('img')) return;
      let u = this.thumbs[id];
      if (!u) { try { const r = await fetch('/files/' + id + '/view', {headers:{Authorization:'Bearer ' + (SS.get('token') || '')}}); if (!r.ok) return; u = this.thumbs[id] = URL.createObjectURL(await r.blob()); } catch (e) { return; } }
      el.innerHTML = `<img src="${u}" alt="">`;
    });
  },
  /* выставка: фото и сканы экспонатов; каждый файл добавляется строкой «адрес | подпись» в список экспонатов (#zf-imgs) */
  expoFilesBlock() {
    return `<div class="field w2 za-files"><div class="btn-row"><label class="btn ghost sm"><input type="file" class="sr" multiple accept="image/jpeg,image/png,image/webp,image/tiff,.tif,.tiff" data-zup="expo">${esc(t('aExpoAdd'))}</label></div>
      <p class="sm za-up-st" id="za-up-expo" aria-live="polite"></p><small class="muted">${esc(t('aExpoHint'))}</small></div>`;
  },
  async upload(files, scope) {
    const st = $('#za-up-' + scope), list = ['expo', 'mem', 'org'].includes(scope) ? [] : this.fileList(scope); if (!list) return;
    const say = s => { if (st) st.textContent = s; }, errs = []; let ok = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i]; say(fmt(t('aFilesUp'), {i:i + 1, n:files.length, name:f.name}));
      try {
        const ext = Formats.sniff(new Uint8Array(await f.slice(0, 16).arrayBuffer()));
        if (!UP_LIM[ext]) throw new Error(t('aFilesType'));
        if (f.size > UP_LIM[ext] * 1048576) throw new Error(fmt(t('aFilesBig'), {n:UP_LIM[ext]}));
        if ((scope === 'expo' || scope === 'mem') && (ext === 'pdf' || MEDIA_EXT.includes(ext))) throw new Error(t('aExpoImgOnly'));
        const isExpoForm = scope === 'item' && this.st.form && this.st.form.type === 'expo';   // в выставку этим блоком грузим только видео и аудио; в каталог их не принимаем
        if (isExpoForm && !MEDIA_EXT.includes(ext)) throw new Error(t('aVideoOnly'));
        if (!isExpoForm && MEDIA_EXT.includes(ext)) throw new Error(t('aFilesType'));
        const meta = await upRaw('/api/admin/files?name=' + encodeURIComponent(f.name), f);
        if (meta.k === 'img') {
          say(t('aFilesView'));
          try { const v = await makeViewCopy(f, ext); await upRaw(`/api/admin/files/${meta.id}/view?w=${v.w}&h=${v.h}&ow=${v.ow}&oh=${v.oh}`, v.blob); }
          catch (er) { if (ext === 'tif') { meta.noView = true; errs.push(fmt(t('aFilesNoView'), {name:f.name, e:er.message})); } }   // JPG/PNG/WebP сервер покажет и без копии
        }
        if (scope === 'mem') { if (!meta.noView) { const im = $('#zf-img'); if (im) im.value = `/files/${meta.id}/view`; ok++; } continue; }   // фото человека в «Архиве памяти»
        if (scope === 'org') {   // файл отчёта «Об архиве»: строка «год | название | | ссылка», год и название поправит сотрудник
          if (meta.noView) continue;
          const ta = $('#zo-rep'); if (ta) ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + `${new Date().getFullYear()} | ${meta.n.replace(/\.[^.]+$/, '')} |  | /files/${meta.id}/view`;
          ok++; continue;
        }
        if (scope === 'expo') {   // экспонат без копии для показа (TIFF, который не разобрался) на сайте не покажется — не добавляем
          if (meta.noView) continue;
          const ta = $('#zf-imgs'); if (ta) ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + `/files/${meta.id}/view | ${meta.n.replace(/\.[^.]+$/, '')}`;
          ok++; continue;
        }
        list.push({id:meta.id, k:meta.k, n:meta.n, s:meta.s, ext:meta.ext, noView:meta.noView}); ok++;
        this.renderFiles(scope);
      } catch (er) { errs.push(f.name + ': ' + er.message); }
    }
    if (st) st.innerHTML = esc(fmt(t('aFilesDone'), {n:ok})) + errs.map(x => '<br><span class="za-up-err">' + esc(x) + '</span>').join('');
  }
});
document.addEventListener('change', e => {   // «Архив памяти»: смена вида материала перестраивает форму
  if (e.target.id !== 'zf-mt' || !TZA.st.form) return;
  TZA.st.form.data = {...TZA.st.form.data, mt:e.target.value}; renderAdmin(true);
});
document.addEventListener('change', e => {
  const el = e.target; if (!el.dataset || el.dataset.zup == null || !el.files || !el.files.length) return;
  const files = [...el.files]; el.value = ''; TZA.upload(files, el.dataset.zup);
});
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-zf]'); if (!el) return;
  const scope = el.dataset.s, i = +el.dataset.i, list = TZA.fileList(scope); if (!list || !list[i]) return;
  const act = el.dataset.zf;
  if (act === 'master') {
    try { const r = await fetch('/files/' + list[i].id + '/master', {headers:{Authorization:'Bearer ' + (SS.get('token') || '')}}); if (!r.ok) throw new Error(r.status);
      const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = list[i].n; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
    catch (er) { toast(t('saveFail')); }
    return;
  }
  if (act === 'up' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
  else if (act === 'down' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
  else if (act === 'del') list.splice(i, 1);
  TZA.renderFiles(scope);
});

/* ================= карточка каталога: листание сканов внутри записи и PDF на странице (ТЗ 5.3) ================= */
Object.assign(T, {
  cPdf:["Электронная копия (PDF)","Электрондық көшірме (PDF)","Digital copy (PDF)"], cPdfOpen:["Открыть в новой вкладке","Жаңа бетте ашу","Open in a new tab"], cPdfShow:["Показать здесь","Осында көрсету","Show here"],
  cPdfNote:["Если PDF не отображается на странице (так бывает на телефонах), откройте его в новой вкладке.","PDF бетте көрінбесе (телефондарда болады), оны жаңа бетте ашыңыз.","If the PDF does not show on the page (common on phones), open it in a new tab."],
  cPgPrev:["Предыдущая страница","Алдыңғы бет","Previous page"], cPgNext:["Следующая страница","Келесі бет","Next page"], cPgN:["Стр. {i} из {n}","{n} беттің {i}-сі","Page {i} of {n}"]
});
Object.assign(Cat, {
  pdfHTML(pdfs) {
    const src = f => '/files/' + encodeURIComponent(f.id) + '/view';
    return `<section class="cr-sec cat-pdfs"><h3>${esc(t('cPdf'))}</h3>
      ${pdfs.map((f, i) => `<p class="cat-pdf-h"><b>${esc(f.n)}</b>${pdfs.length > 1 ? `<button type="button" class="btn ghost sm" data-act="cat-pdf" data-v="${esc(src(f))}" data-n="${esc(f.n)}"${i === 0 ? ' aria-pressed="true"' : ''}>${esc(t('cPdfShow'))}</button>` : ''}<a class="btn ghost sm" href="${esc(src(f))}" target="_blank" rel="noopener">${esc(t('cPdfOpen'))}${tzIc('i-ext')}</a></p>`).join('')}
      <iframe class="cat-pdf-f" id="cat-pdf-f" src="${esc(src(pdfs[0]))}" title="${esc(pdfs[0].n)}" loading="lazy"></iframe>
      <p class="muted sm">${esc(t('cPdfNote'))}</p></section>`;
  },
  page(d) {
    const n = (this.pgImgs || []).length; if (n < 2) return;
    this.pg = (this.pg + d + n) % n; const u = tzImg(this.pgImgs[this.pg]);
    const img = $('#cat-img'), st = $('#cat-stage'), dl = $('#cat-dl'), lb = $('#cat-pgn');
    if (st) st.classList.remove('noimg'); if (img) img.src = u; if (dl) dl.href = u;
    if (lb) lb.textContent = fmt(t('cPgN'), {i:this.pg + 1, n});
    this.zoom(0);
  }
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act="cat-pg"], [data-act="cat-pdf"]'); if (!el) return;
  if (el.dataset.act === 'cat-pg') { Cat.page(+el.dataset.v); return; }
  const f = $('#cat-pdf-f'); if (!f) return; f.src = el.dataset.v; f.title = el.dataset.n || '';
  $$('[data-act="cat-pdf"]').forEach(b => b.setAttribute('aria-pressed', String(b === el)));
});
document.addEventListener('keydown', e => {   // ← → листают страницы, когда фокус на изображении
  if (!e.target.closest || !e.target.closest('#cat-stage') || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
  if ((Cat.pgImgs || []).length > 1) { e.preventDefault(); Cat.page(e.key === 'ArrowRight' ? 1 : -1); }
});

/* ================= своя лёгкая карта на плитках 2ГИС =================
   Векторная MapGL и растровый Raster JS API 2ГИС берут плитки с серверов tile*-sdk.maps.2gis.com,
   а они из сети архива подвисают (запросы «висят» без ответа) — карта оставалась пустой бежевой подложкой.
   Классические плитки tile0–3.maps.2gis.com отвечают за ~0,2 с. Карта ниже показывает их напрямую:
   без внешних скриптов и ключей, с метками, подсказками, перетаскиванием и масштабом. */
const TileMap = {
  TS: 256,
  url: (x, y, z) => `https://tile${(x + y) % 4}.maps.2gis.com/tiles?x=${x}&y=${y}&z=${z}&v=1`,
  proj(lat, lon, z) { const s = this.TS * 2 ** z, sin = Math.sin(lat * Math.PI / 180); return [(lon + 180) / 360 * s, (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * s]; },
  build(box, ps, onPick, opt) {
    const TS = this.TS, self = this, pinF = (opt && opt.pin) || pinHTML, popF = (opt && opt.pop) || popHTML;   // свои метки и подписи — для исторической карты
    box.innerHTML = '';
    const el = document.createElement('div'); el.className = 'gis-map tmap'; el.tabIndex = 0;
    el.setAttribute('role', 'application'); el.setAttribute('aria-label', t('mapTitle') + '. ' + L(['Перетаскивайте карту, клавиши + и − меняют масштаб.', 'Картаны сүйреңіз, + және − пернелері масштабты өзгертеді.', 'Drag the map; + and − keys zoom.']));
    el.innerHTML = `<div class="tmap-tiles"></div><div class="tmap-pins"></div><div class="tmap-pop"></div>
      <div class="tmap-zoom"><button type="button" data-tz="1" aria-label="${esc(t('zIn'))}">+</button><button type="button" data-tz="-1" aria-label="${esc(t('zOut'))}">−</button></div>
      <a class="tmap-attr" href="https://2gis.kz/ust-kamenogorsk" target="_blank" rel="noopener">© 2ГИС</a>`;
    box.appendChild(el);
    const tilesEl = el.querySelector('.tmap-tiles'), pinsEl = el.querySelector('.tmap-pins'), popEl = el.querySelector('.tmap-pop');
    let z = 14, cx = 0, cy = 0, raf = 0, popP = null, loaded = 0, failed = 0, okRes;
    const ready = new Promise(res => { okRes = res; });
    const cache = new Map();
    const W = () => el.clientWidth, H = () => el.clientHeight;
    const center = (lat, lon) => { [cx, cy] = self.proj(lat, lon, z); };
    const fitPs = (opt && opt.fitTo && opt.fitTo.length) ? opt.fitTo : ps;   // по каким точкам подбирать масштаб при открытии
    const fit = () => {
      const w = W(), h = H(); if (!w || !h || !fitPs.length) return;
      for (let zz = 16; zz >= 3; zz--) {
        const pts = fitPs.map(p => self.proj(p.lat, p.lon, zz));
        const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
        if (Math.max(...xs) - Math.min(...xs) <= w - 150 && Math.max(...ys) - Math.min(...ys) <= h - 120 || zz === 3) {
          z = zz; cx = (Math.max(...xs) + Math.min(...xs)) / 2; cy = (Math.max(...ys) + Math.min(...ys)) / 2 - 16; break;
        }
      }
      draw();
    };
    const draw = () => {
      cancelAnimationFrame(raf); raf = 0;
      const w = W(), h = H(); if (!w || !h) return;
      const n = 2 ** z, ox = cx - w / 2, oy = cy - h / 2;
      el.classList.toggle('far', z < 12);   // мелкий масштаб: здания Усть-Каменогорска сливаются — подписи только у главного здания и филиалов
      const x0 = Math.floor(ox / TS), x1 = Math.floor((ox + w) / TS), y0 = Math.max(0, Math.floor(oy / TS)), y1 = Math.min(n - 1, Math.floor((oy + h) / TS));
      const need = new Set();
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        const wx = ((tx % n) + n) % n, key = z + '/' + tx + '/' + ty; need.add(key);
        let img = cache.get(key);
        if (!img) {
          img = new Image(TS, TS); img.alt = ''; img.decoding = 'async'; img.draggable = false; img.className = 'tmap-t';
          img.onload = () => { img.classList.add('on'); loaded++; okRes(true); }; img.onerror = () => { failed++; };
          img.src = self.url(wx, ty, z); cache.set(key, img); tilesEl.appendChild(img);
        }
        img.style.transform = `translate(${Math.round(tx * TS - ox)}px, ${Math.round(ty * TS - oy)}px)`;
      }
      for (const [k, img] of cache) if (!need.has(k)) { img.remove(); cache.delete(k); }
      pinsEl.innerHTML = ps.map(p => { const [px, py] = self.proj(p.lat, p.lon, z); return `<div class="tmap-pin${p.main ? ' main' : (p.type === 'branch' && p.arch !== 'uka' && p.town && !/Усть|Өскемен|Ust/.test(p.town) ? ' reg' : ' city')}" style="transform:translate(${Math.round(px - ox)}px, ${Math.round(py - oy)}px)">${pinF(p)}</div>`; }).join('');
      if (popP) { const [px, py] = self.proj(popP.lat, popP.lon, z); popEl.style.transform = `translate(${Math.round(px - ox)}px, ${Math.round(py - oy)}px)`; }
    };
    const later = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const zoom = (d, ax, ay) => {
      const nz = Math.max(3, Math.min(18, z + d)); if (nz === z) return;
      const w = W(), h = H(); ax = ax == null ? w / 2 : ax; ay = ay == null ? h / 2 : ay;
      const k = 2 ** (nz - z), wx = cx - w / 2 + ax, wy = cy - h / 2 + ay;
      cx = wx * k - ax + w / 2; cy = wy * k - ay + h / 2; z = nz; draw();
    };
    const open = p => {
      popP = p;
      popEl.innerHTML = `<div class="mpop-at${p.main ? ' main' : ''}">${popF(p).replace('<div class="mpop">', '<div class="mpop gl"><button type="button" class="mpop-x" aria-label="' + esc(t('close')) + '">×</button>')}</div>`;
      draw();
      /* метка у края карты: карточка не должна обрезаться рамкой, поэтому сдвигаем карту, пока она не поместится */
      const g = popEl.querySelector('.mpop.gl');
      if (g) {
        const pr = g.getBoundingClientRect(), er = el.getBoundingClientRect(); let dx = 0, dy = 0;
        if (pr.top < er.top + 8) dy = er.top + 8 - pr.top;
        if (pr.left < er.left + 8) dx = er.left + 8 - pr.left; else if (pr.right > er.right - 8) dx = er.right - 8 - pr.right;
        if (dx || dy) { cx -= dx; cy -= dy; draw(); }
      }
    };
    const close = () => { popP = null; popEl.innerHTML = ''; };
    // перетаскивание
    let drag = null;
    el.addEventListener('pointerdown', e => { if (e.button !== 0 || e.target.closest('button, a, .mpop, .pin2')) return; drag = {x:e.clientX, y:e.clientY, cx, cy, moved:false}; el.setPointerCapture(e.pointerId); el.classList.add('drag'); });
    el.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true; cx = drag.cx - dx; cy = drag.cy - dy; later(); });
    const up = () => { if (drag && !drag.moved) close(); drag = null; el.classList.remove('drag'); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('dblclick', e => { if (e.target.closest('button, a, .mpop')) return; const r = el.getBoundingClientRect(); zoom(1, e.clientX - r.left, e.clientY - r.top); });
    el.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); const r = el.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1 : -1, e.clientX - r.left, e.clientY - r.top); }, {passive:false});   // колесо крутит страницу, с Ctrl — масштаб
    el.addEventListener('keydown', e => {
      if (e.target !== el) return;
      const step = 80, map = {ArrowLeft:[-step, 0], ArrowRight:[step, 0], ArrowUp:[0, -step], ArrowDown:[0, step]};
      if (e.key === '+' || e.key === '=') { zoom(1); e.preventDefault(); } else if (e.key === '-') { zoom(-1); e.preventDefault(); }
      else if (map[e.key]) { cx += map[e.key][0]; cy += map[e.key][1]; draw(); e.preventDefault(); }
    });
    el.addEventListener('click', e => {
      const zb = e.target.closest('[data-tz]'); if (zb) { zoom(+zb.dataset.tz); return; }
      if (e.target.closest('.mpop-x')) { close(); return; }
      const pin = e.target.closest('[data-pid]'); if (pin) { const p = ps.find(x => String(x.id) === pin.dataset.pid); if (p) { open(p); if (onPick) onPick(p); } }
    });
    if (ps[0]) center(ps[0].lat, ps[0].lon);
    fit();
    const unwatch = MapGis.watch(el, draw, fit);
    // плитки не пришли совсем (нет сети): схема вместо пустого поля
    const guard = setTimeout(() => { if (!loaded && failed && box.isConnected) { unwatch(); MapGis.inst = MapGis.inst.filter(i => i.box !== box); MapGis.fallback(box); } }, 9000);
    return {kill: () => { clearTimeout(guard); unwatch(); cancelAnimationFrame(raf); el.remove(); }, ready,
      open: p => { const w = W(), h = H(); z = Math.max(z, 15); center(p.lat, p.lon); cy -= Math.min(90, h / 5); void w; open(p); }};
  }
};
/* карта по умолчанию — своя на классических плитках; MapGL и Raster JS остаются в коде, но не используются */
MapGis.mount = function (box) {
  if (box.dataset.ready) return; box.dataset.ready = '1';
  if (IN_PREVIEW) { this.fallback(box); return; }
  try {
    const region = box.dataset.scope === 'region';
    const x = TileMap.build(box, placesFor(box).filter(p => p.lat), region ? p => Br.select(p.key, true) : null);
    x.box = box; this.inst.push(x);
  } catch (e) { console.warn('tilemap', e); this.fallback(box); }
};

/* ================= Структура сайта, языковые версии, интеграции (ТЗ 6.2) =================
   Меню в index.html статичное; порядок, показ и свои названия пунктов хранятся в настройках (S().nav) и применяются здесь.
   Скрытый пункт пропадает из меню и подвала, но страница остаётся доступной по ссылке. */
const NAV_IDS = ['about', 'catalog', 'visitors', 'memory', 'expo', 'news', 'contacts'];
const NAV_T = {about:'navAbout', catalog:'navCatalog', visitors:'navGuide', memory:'navMemory', expo:'navExpo', news:'navNews', contacts:'navBranches'};
const NAV_L = ['ru', 'kz', 'en'];
const navConf = () => { const own = (Array.isArray(S().nav) ? S().nav : []).filter(n => n && NAV_IDS.includes(n.id)); return own.concat(NAV_IDS.filter(id => !own.some(n => n.id === id)).map(id => ({id}))); };
const langOn = l => l === 'ru' || (S().langs || {})[l] !== false;
function applySite() {
  const ul = $('#nav-list');
  for (const n of navConf()) {
    const name = (n.t && String(n.t[lang] || '').trim()) || t(NAV_T[n.id]), off = n.on === false;
    const a = ul && ul.querySelector(`a[href="#${n.id}"]`);
    if (a) { const li = a.closest('li'); ul.appendChild(li); li.hidden = off; a.textContent = name; }
    $$(`.site-foot li > a[href="#${n.id}"][data-i]`).forEach(f => { f.textContent = name; f.parentNode.hidden = off; });
  }
  const myLi = ul && ul.querySelector('.nav-my-li'); if (myLi) ul.appendChild(myLi);   // «Мой кабинет» в меню телефона — всегда последним
  $$('[data-act="lang"]').forEach(b => { const li = b.closest('li'); (li || b).hidden = !langOn(b.dataset.v); });
  if (!langOn(lang)) { lang = prefs.lang = 'ru'; applyPrefs(); applyI18n(); renderAll(); }   // язык выключили — посетитель переходит на русский
}
Store.on(applySite);
Store.on(() => { if (current === 'contacts') { try { Br.render(); } catch (e) { console.warn('br', e); } } });   // данные пришли после первого показа «Филиалов»: обновить карточку (контакты, которые поправили администраторы филиалов)

Object.assign(T, {
  aSiteTab:["Структура и языки","Құрылым және тілдер","Structure and languages"], aIntTab:["Интеграции","Интеграциялар","Integrations"],
  aNav:["Главное меню","Басты мәзір","Main menu"], aNavLead:["Порядок пунктов, показ в меню и свои названия. Пустое название — стандартное. Скрытый пункт пропадает из меню и подвала, но страница открывается по ссылке.","Тармақтардың реті, мәзірде көрсету және өз атаулары. Бос атау — стандартты. Жасырылған тармақ мәзір мен төменгі бөліктен жоғалады, бірақ бет сілтеме арқылы ашылады.","Order, visibility and custom names. An empty name means the standard one. A hidden item leaves the menu and footer, but the page still opens by link."],
  aNavItem:["Пункт","Тармақ","Item"], aNavOn:["В меню","Мәзірде","In menu"], aNavName:["Своё название","Өз атауы","Custom name"], aNavMove:["Порядок","Реті","Order"], aNavUp:["Выше","Жоғары","Up"], aNavDown:["Ниже","Төмен","Down"],
  aLangVer:["Языковые версии","Тіл нұсқалары","Language versions"], aLangsLead:["Выключенный язык пропадает из переключателя и из адресов для поисковиков; посетитель с этим языком переходит на русский. Русский включён всегда.","Өшірілген тіл ауыстырғыштан және іздеу жүйелеріне арналған мекенжайлардан жоғалады; осы тілдегі келуші орыс тіліне ауысады. Орыс тілі әрқашан қосулы.","A disabled language leaves the switcher and the search-engine links; visitors using it switch to Russian. Russian is always on."],
  aLangAlways:["включён всегда","әрқашан қосулы","always on"], aSiteReset:["Вернуть стандартные","Стандарттыға қайтару","Restore defaults"], aNavNone:["В меню должен остаться хотя бы один пункт","Мәзірде кемінде бір тармақ қалуы керек","Keep at least one menu item"],
  aIntLead:["Внешние сервисы, с которыми работает сайт. Ключи доступа хранятся на сервере и в браузер не передаются.","Сайт жұмыс істейтін сыртқы қызметтер. Кіру кілттері серверде сақталады және браузерге берілмейді.","External services the site uses. Access keys stay on the server and never reach the browser."],
  aIntSvc:["Сервис","Қызмет","Service"], aIntState:["Состояние","Күйі","Status"], aIntWhat:["Что даёт","Не береді","What it does"],
  aIntOn:["работает","жұмыс істейді","on"], aIntOff:["выключен в админке","әкімшілікте өшірілген","turned off here"], aIntNoKey:["нет ключа на сервере","серверде кілт жоқ","no key on the server"], aIntNone:["не заданы","берілмеген","not set"], aIntSet:["задан","берілген","set"],
  aIntAi:["ИИ (Claude, Anthropic)","ЖИ (Claude, Anthropic)","AI (Claude, Anthropic)"], aIntAiNote:["Чат-помощник, краткое содержание документов, распознавание текста. Ключ ANTHROPIC_API_KEY — в файле .env на сервере.","Чат-көмекші, құжаттардың қысқаша мазмұны, мәтінді тану. ANTHROPIC_API_KEY кілті — сервердегі .env файлында.","Chat assistant, document summaries, text recognition. The ANTHROPIC_API_KEY lives in .env on the server."],
  aIntAiOff:["Выключить ИИ для посетителей (чат и краткое содержание). Чат останется со встроенными ответами.","Келушілер үшін ЖИ-ді өшіру (чат және қысқаша мазмұн). Чат кірістірілген жауаптармен қалады.","Turn AI off for visitors (chat and summaries). The chat keeps its built-in answers."],
  aIntMap:["Карта 2ГИС","2ГИС картасы","2GIS map"], aIntMapNote:["Карта архива и филиалов на плитках 2ГИС, ключ для неё не нужен.","Мұрағат пен филиалдар картасы 2ГИС тайлдарында, оған кілт қажет емес.","Archive and branch map on 2GIS tiles; no key is needed."],
  aIntSoc:["Социальные сети","Әлеуметтік желілер","Social networks"], aIntSocN:["ссылок: {n}","сілтеме: {n}","links: {n}"], aIntSocNote:["Ссылки в подвале сайта и кнопка «Поделиться». Меняются на вкладке «Филиалы и соцсети».","Сайттың төменгі бөлігіндегі сілтемелер және «Бөлісу» батырмасы. «Филиалдар және әлеуметтік желілер» қойындысында өзгертіледі.","Footer links and the Share button. Edited on the Branches and social tab."],
  aIntGov:["eGov и eOtinish","eGov және eOtinish","eGov and eOtinish"], aIntGovNote:["Ссылки на госуслуги архива и подачу обращений.","Мұрағаттың мемлекеттік қызметтеріне және өтініш беруге сілтемелер.","Links to the archive's public services and to appeals."],
  aIntYt:["YouTube","YouTube","YouTube"], aIntYtNote:["Видео в новостях и выставках, встраиваются с youtube-nocookie.com.","Жаңалықтар мен көрмелердегі бейнелер youtube-nocookie.com арқылы енгізіледі.","Videos in news and exhibitions, embedded from youtube-nocookie.com."],
  aIntSe:["Google и Яндекс: подтверждение сайта","Google және Яндекс: сайтты растау","Google and Yandex: site verification"], aIntSeNote:["Нужно, чтобы видеть сайт в Google Search Console и Яндекс.Вебмастере. Выберите способ «HTML-тег» и вставьте сюда значение content.","Сайтты Google Search Console және Яндекс.Вебмастерде көру үшін қажет. «HTML-тег» тәсілін таңдап, content мәнін осында қойыңыз.","Lets you see the site in Google Search Console and Yandex Webmaster. Choose the HTML tag method and paste its content value here."],
  aIntG:["Код Google Search Console","Google Search Console коды","Google Search Console code"], aIntY:["Код Яндекс.Вебмастера","Яндекс.Вебмастер коды","Yandex Webmaster code"], aIntBad:["Код: латиница, цифры, «-» и «_», от 8 знаков","Код: латын әріптері, сандар, «-» және «_», 8 таңбадан","Code: Latin letters, digits, - and _, at least 8 characters"]
});

TZA.tabs.push(['site', 'aSiteTab', 'settings'], ['integr', 'aIntTab', 'settings']);

/* --- «Об архиве» (ТЗ 5.2): руководство, отделы, сотрудники и контактные лица, отчёты, нормативные документы.
   Хранится в настройках (S().org). Пока сотрудники ничего не внесли, показывается перенесённое со старого сайта. --- */
const orgOf = k => { const o = S().org; return o && Array.isArray(o[k]) && o[k].length ? o[k] : ((SITE.org || {})[k] || []); };
const canon = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort()) : x);   // сравнение без учёта порядка полей
const orgSame = (k, arr) => canon(arr) === canon((SITE.org || {})[k] || []);   // совпало с данными заказчика — в настройках не храним
const LO = o => o ? ((lang === 'en' && o.en) || (lang === 'kz' && o.kz) || o.ru || o.kz || '') : '';
function orgLeaders() { const own = orgOf('leaders'); return own.length ? own : (SITE.leaders || []); }
function orgStaff() { return orgOf('staff'); }
function orgDocs() { return orgOf('docs'); }
function orgTeamExtra() {
  const dep = orgOf('depts'), st = orgOf('staff');
  const deps = dep.length ? `<h2 style="margin-top:2rem">${esc(t('orgDepts'))}</h2><div class="bgrid">${dep.map(d => `<div class="bcard">${d.head ? `<p class="eyebrow">${esc(t('orgHead'))}: ${esc(d.head)}</p>` : ''}<h3>${esc(LO(d.n))}</h3>${LO(d.d) ? `<p>${esc(LO(d.d))}</p>` : ''}${d.p ? `<p><svg class="ic"><use href="#i-phone"/></svg><span>${telLinks([d.p])}</span></p>` : ''}${d.e ? `<p><a href="mailto:${esc(d.e)}">${esc(d.e)}</a></p>` : ''}</div>`).join('')}</div>`
    : `<p class="muted" style="margin-top:1.4rem">${esc(t('orgStructOld'))} <a href="#p/1336">${esc(t('aStruct'))}</a></p>`;
  const staff = st.length ? `<h2 style="margin-top:2rem">${esc(t('orgStaff'))}</h2><div class="za-table-wrap"><table class="za-table org-staff"><thead><tr><th scope="col">${esc(t('orgFio'))}</th><th scope="col">${esc(t('orgRole'))}</th><th scope="col">${esc(t('orgPhone'))}</th><th scope="col">E-mail</th></tr></thead><tbody>
    ${st.map(p => `<tr><th scope="row">${esc(p.n)}</th><td>${esc(p.r || '')}</td><td>${p.p ? telLinks([p.p]) : ''}</td><td>${p.e ? `<a href="mailto:${esc(p.e)}">${esc(p.e)}</a>` : ''}</td></tr>`).join('')}</tbody></table></div>` : '';
  return deps + staff;
}
function orgReports() {
  const r = orgOf('reports'); if (!r.length) return '';
  return `<h2 style="margin-top:2rem">${esc(t('orgReports'))}</h2><ul class="yearlist">${r.slice().sort((a, b) => (+b.y || 0) - (+a.y || 0)).map(x => `<li><b>${esc(String(x.y || ''))}</b><span>${x.url ? `<a class="doc" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(LO(x.t))}</a>` : esc(LO(x.t))}</span></li>`).join('')}</ul>`;
}
Object.assign(T, {
  orgDepts:["Отделы и подразделения","Бөлімдер мен бөлімшелер","Departments"], orgHead:["Руководитель","Басшысы","Head"], orgStaff:["Сотрудники и контактные лица","Қызметкерлер мен байланыс тұлғалары","Staff and contacts"],
  orgFio:["ФИО","Аты-жөні","Name"], orgRole:["Должность, отдел","Лауазымы, бөлімі","Position, department"], orgPhone:["Телефон","Телефон","Phone"], orgReports:["Отчёты и планы (файлы)","Есептер мен жоспарлар (файлдар)","Reports and plans (files)"],
  orgStructOld:["Структура архива — на странице прежнего сайта:","Мұрағат құрылымы — бұрынғы сайт бетінде:","Archive structure is on the former site page:"],
  aOrgTab:["Об архиве","Мұрағат туралы","About the archive"], aOrgLead:["Одна строка — одна запись, поля через «|». Пустое поле руководства — показывается список со старого сайта. Тексты «Об архиве» (абзацы) — на вкладке «Тексты».","Бір жол — бір жазба, өрістер «|» арқылы. Басшылық өрісі бос болса — бұрынғы сайттағы тізім көрсетіледі. «Мұрағат туралы» мәтіндері — «Мәтіндер» қойындысында.","One line per entry, fields separated by “|”. Empty leadership shows the list from the former site. About texts are on the Texts tab."],
  aOrgLeaders:["Руководство: Должность | ФИО | Телефон | E-mail","Басшылық: Лауазымы | Аты-жөні | Телефон | E-mail","Leadership: Position | Name | Phone | E-mail"],
  aOrgDepts:["Отделы: Название RU | Название KZ | Руководитель | Телефон | Чем занимается | E-mail","Бөлімдер: Атауы RU | Атауы KZ | Басшысы | Телефон | Немен айналысады | E-mail","Departments: Name RU | Name KZ | Head | Phone | What it does | E-mail"],
  aOrgStaff:["Сотрудники и контактные лица: ФИО | Должность, отдел | Телефон | E-mail","Қызметкерлер мен байланыс тұлғалары: Аты-жөні | Лауазымы, бөлімі | Телефон | E-mail","Staff and contacts: Name | Position, department | Phone | E-mail"],
  aOrgReports:["Отчёты и планы: Год | Название RU | Название KZ | Ссылка (https://… или загруженный файл)","Есептер мен жоспарлар: Жылы | Атауы RU | Атауы KZ | Сілтеме (https://… немесе жүктелген файл)","Reports and plans: Year | Title RU | Title KZ | Link (https://… or an uploaded file)"],
  aOrgUp:["Загрузить файл отчёта (PDF, JPG, PNG)","Есеп файлын жүктеу (PDF, JPG, PNG)","Upload a report file (PDF, JPG, PNG)"],
  aOrgDocs:["Нормативные документы (добавляются к списку): Название | Дата, номер | Ссылка","Нормативтік құжаттар (тізімге қосылады): Атауы | Күні, нөмірі | Сілтеме","Regulations (added to the list): Title | Date, number | Link"],
  aOrgBad:["Ошибка в строке: ","Жолда қате: ","Error in line: "]
});
TZA.tabs.push(['org', 'aOrgTab', 'settings']);
const ORG_URL = /^(https:\/\/[^\s"'<>]{3,500}|\/files\/[a-f0-9]{24}\/view)$/;
TZA.tab_org = function () {
  const ln = (rows, f) => rows.map(x => f(x).map(v => String(v == null ? '' : v).trim()).join(' | ').replace(/(\s\|\s)+$/, '')).join('\n');
  const area = (id, label, val, extra) => `<section class="panel"><div class="field"><label for="${id}">${esc(t(label))}</label><textarea id="${id}" rows="7" spellcheck="false">${esc(val)}</textarea></div>${extra || ''}</section>`;
  return `${this.who()}<form class="admin-stack" id="za-org" novalidate><p class="muted">${esc(t('aOrgLead'))}</p>
    ${area('zo-lead', 'aOrgLeaders', ln(orgLeaders(), p => [p.r, p.n, p.p, p.e]))}
    ${area('zo-dep', 'aOrgDepts', ln(orgOf('depts'), d => [d.n && d.n.ru, d.n && d.n.kz, d.head, d.p, d.d && d.d.ru, d.e]))}
    ${area('zo-staff', 'aOrgStaff', ln(orgOf('staff'), p => [p.n, p.r, p.p, p.e]))}
    ${area('zo-rep', 'aOrgReports', ln(orgOf('reports'), r => [r.y, r.t && r.t.ru, r.t && r.t.kz, r.url]), `<div class="btn-row"><label class="btn ghost sm"><input type="file" class="sr" accept="application/pdf,image/jpeg,image/png" multiple data-zup="org">${esc(t('aOrgUp'))}</label></div><p class="sm za-up-st" id="za-up-org" aria-live="polite"></p>`)}
    ${area('zo-docs', 'aOrgDocs', ln(orgDocs(), d => [d.t, d.d, d.url]))}
    <div class="btn-row"><button class="btn" type="submit">${esc(t('aSave'))}</button></div></form>`;
};
document.addEventListener('submit', async e => {
  if (e.target.id !== 'za-org') return; e.preventDefault();
  const rows = id => ($('#' + id).value || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split('|').map(x => x.trim()));
  const bad = l => { toast(t('aOrgBad') + l.join(' | ').slice(0, 80)); return null; };
  const url = (v, l) => !v || ORG_URL.test(v) ? v || undefined : bad(l);
  const org = {};
  const lead = rows('zo-lead').map(([r, n, p, em]) => ({r:r || '', n:n || '', p:p || '', ...(em ? {e:em} : {})}));
  if (lead.some(x => !x.n)) return bad(rows('zo-lead').find(l => !l[1]));
  if (canon(lead) !== canon((SITE.leaders || []).map(x => ({r:x.r || '', n:x.n || '', p:x.p || '', ...(x.e ? {e:x.e} : {})})))) org.leaders = lead;   // совпадает с данными сайта — не храним
  org.depts = []; for (const l of rows('zo-dep')) { const [ru, kz, head, p, d, em] = l; if (!ru || (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))) return bad(l); org.depts.push({n:{ru, ...(kz ? {kz} : {})}, ...(head ? {head} : {}), ...(p ? {p} : {}), ...(d ? {d:{ru:d}} : {}), ...(em ? {e:em} : {})}); }
  org.staff = []; for (const l of rows('zo-staff')) { const [n, r, p, em] = l; if (!n || (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))) return bad(l); org.staff.push({n, ...(r ? {r} : {}), ...(p ? {p} : {}), ...(em ? {e:em} : {})}); }
  org.reports = []; for (const l of rows('zo-rep')) { const [y, ru, kz, u] = l; if (!/^\d{4}$/.test(y || '') || !ru) return bad(l); const v = url(u, l); if (v === null) return; org.reports.push({y:+y, t:{ru, ...(kz ? {kz} : {})}, ...(v ? {url:v} : {})}); }
  org.docs = []; for (const l of rows('zo-docs')) { const [tt, d, u] = l; if (!tt) return bad(l); const v = url(u, l); if (v === null) return; org.docs.push({t:tt, ...(d ? {d} : {}), ...(v ? {url:v} : {})}); }
  for (const k of Object.keys(org)) if (!org[k].length || (k !== 'leaders' && orgSame(k, org[k]))) delete org[k];   // пусто или как у заказчика — не храним
  const next = {...S()}; if (Object.keys(org).length) next.org = org; else delete next.org;
  try { await Store.saveSettings(next); toast(t('saved')); } catch (er) { toast(er.msg || t('saveFail')); return; }
  renderAll();
});

/* --- уведомления о согласовании (ТЗ 6.7): редактору — «на проверку», автору — решение редактора --- */
Object.assign(T, {
  aNotes:["Уведомления","Хабарландырулар","Notifications"], aNotesNew:["новых: {n}","жаңа: {n}","new: {n}"], aNotesSeen:["Отметить прочитанными","Оқылды деп белгілеу","Mark as read"], aNotesOpen:["Открыть","Ашу","Open"],
  aNoteReview:["На проверку: «{t}» — {by}","Тексеруге: «{t}» — {by}","For review: “{t}” by {by}"], aNoteRework:["Вернули на доработку: «{t}» — {by}","Пысықтауға қайтарылды: «{t}» — {by}","Sent back for rework: “{t}” by {by}"],
  aNoteApproved:["Одобрено: «{t}» — {by}","Мақұлданды: «{t}» — {by}","Approved: “{t}” by {by}"], aNotePublished:["Опубликовано: «{t}» — {by}","Жарияланды: «{t}» — {by}","Published: “{t}” by {by}"], aNoteArchived:["В архиве: «{t}» — {by}","Мұрағатта: «{t}» — {by}","Archived: “{t}” by {by}"],
  aNoteImport:["Импорт: записей ждут проверки — {n} ({by})","Импорт: тексеруді күтетін жазбалар — {n} ({by})","Import: {n} records await review ({by})"], aNoteTg:["Копия «на проверку» уходит в Telegram, если на сервере заданы TG_BOT_TOKEN и TG_CHAT_ID.","«Тексеруге» көшірмесі серверде TG_BOT_TOKEN және TG_CHAT_ID берілсе, Telegram-ға жіберіледі.","A copy of “for review” goes to Telegram when TG_BOT_TOKEN and TG_CHAT_ID are set on the server."]
});
const NOTE_K = {review:'aNoteReview', rework:'aNoteRework', approved:'aNoteApproved', published:'aNotePublished', archived:'aNoteArchived', import:'aNoteImport'};
TZA.notesBar = function () {
  const list = (Store.data.notes || []).slice().reverse(); if (Store.mode !== 'api' || !list.length) return '';
  const seen = Store.data.noteSeen || 0, fresh = list.filter(n => n.at > seen).length;
  return `<details class="panel za-notes"${fresh ? ' open' : ''}><summary>${tzIc('i-info')}<b>${esc(t('aNotes'))}</b>${fresh ? ` <span class="pill warn">${esc(fmt(t('aNotesNew'), {n:fresh}))}</span>` : ''}</summary>
    <ul class="za-notes-l">${list.slice(0, 20).map(n => `<li${n.at > seen ? ' class="new"' : ''}><small>${esc(fmtDate(n.at, {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}))}</small>
      <span>${esc(fmt(t(NOTE_K[n.kind] || 'aNoteReview'), {t:n.title || n.item || '', by:n.by || '', n:n.n || 0}))}${n.note ? ` <i>— ${esc(n.note)}</i>` : ''}</span>
      ${n.item ? `<button type="button" class="btn ghost sm" data-act="za-note-open" data-v="${esc(n.item)}">${esc(t('aNotesOpen'))}</button>` : ''}</li>`).join('')}</ul>
    <p class="btn-row">${fresh ? `<button type="button" class="btn ghost sm" data-act="za-notes-seen">${esc(t('aNotesSeen'))}</button>` : ''}<small class="muted">${esc(t('aNoteTg'))}</small></p></details>`;
};
document.addEventListener('click', async e => {
  const b = e.target.closest && e.target.closest('[data-act="za-notes-seen"], [data-act="za-note-open"]'); if (!b) return;
  if (b.dataset.act === 'za-notes-seen') {
    try { await Store.api('/api/admin/notes/seen', {method:'POST', body:{}}); Store.data.noteSeen = Date.now(); } catch (er) { toast(er.msg || t('saveFail')); }
    renderAdmin(true); return;
  }
  const it = (Store.data.adminItems || []).find(i => i.id === b.dataset.v);
  Admin.tab = 'items'; TZA.st.filter = ''; if (it) TZA.st.type = it.type; TZA.st.form = null; renderAdmin(true);
  const ed = $(`[data-act="za-edit"][data-v="${CSS.escape(b.dataset.v)}"]`); if (ed) ed.click(); else if (!it) toast(t('catNone'));
});
TZA.readNav = function () {
  const rows = $$('#za-nav tr[data-nav]'); if (!rows.length) return;
  this.st.nav = rows.map(tr => { const tt = {}; NAV_L.forEach(l => { const v = ($(`[data-nv="${l}"]`, tr).value || '').trim(); if (v) tt[l] = v; });
    return {id:tr.dataset.nav, on:$('[data-nv="on"]', tr).checked, ...(Object.keys(tt).length ? {t:tt} : {})}; });
};
TZA.tab_site = function () {
  const conf = this.st.nav || (this.st.nav = JSON.parse(JSON.stringify(navConf())));
  const rows = conf.map((n, i) => { const nm = t(NAV_T[n.id]);
    return `<tr data-nav="${n.id}"><th scope="row">${i + 1}. ${esc(nm)}</th>
      <td><input type="checkbox" data-nv="on" aria-label="${esc(t('aNavOn') + ': ' + nm)}"${n.on === false ? '' : ' checked'}></td>
      ${NAV_L.map((l, k) => `<td><input type="text" maxlength="40" data-nv="${l}" value="${esc((n.t || {})[l] || '')}" placeholder="${esc((T[NAV_T[n.id]] || [])[k] || '')}" aria-label="${esc(t('aNavName') + ' ' + l.toUpperCase() + ': ' + nm)}"></td>`).join('')}
      <td class="za-nav-mv"><button type="button" class="btn ghost sm" data-act="za-nav-mv" data-v="${i}" data-k="-1" aria-label="${esc(t('aNavUp') + ': ' + nm)}"${i ? '' : ' disabled'}>↑</button><button type="button" class="btn ghost sm" data-act="za-nav-mv" data-v="${i}" data-k="1" aria-label="${esc(t('aNavDown') + ': ' + nm)}"${i < conf.length - 1 ? '' : ' disabled'}>↓</button></td></tr>`; }).join('');
  const lg = (id, name) => `<label class="za-chk"><input type="checkbox" id="zl-${id}"${id === 'ru' ? ' checked disabled' : langOn(id) ? ' checked' : ''}> ${esc(name)}${id === 'ru' ? ` <small class="muted">${esc(t('aLangAlways'))}</small>` : ''}</label>`;
  return `${this.who()}<div class="admin-stack">
    <section class="panel"><h2 class="h4">${esc(t('aNav'))}</h2><p class="muted sm">${esc(t('aNavLead'))}</p>
      <div class="za-table-wrap"><table class="za-table" id="za-nav"><thead><tr><th scope="col">${esc(t('aNavItem'))}</th><th scope="col">${esc(t('aNavOn'))}</th>${NAV_L.map(l => `<th scope="col">${esc(t('aNavName'))} ${l.toUpperCase()}</th>`).join('')}<th scope="col">${esc(t('aNavMove'))}</th></tr></thead><tbody>${rows}</tbody></table></div></section>
    <section class="panel"><h2 class="h4">${esc(t('aLangVer'))}</h2><p class="muted sm">${esc(t('aLangsLead'))}</p>
      <div class="za-langs">${lg('ru', 'Русский (РУС)')}${lg('kz', 'Қазақша (ҚАЗ)')}${lg('en', 'English (ENG)')}</div></section>
    <div class="btn-row"><button type="button" class="btn" data-act="za-site-save">${esc(t('aSave'))}</button><button type="button" class="btn ghost" data-act="za-site-reset">${esc(t('aSiteReset'))}</button></div></div>`;
};
TZA.tab_integr = function () {
  const s = S(), info = Store.apiInfo || {}, vf = s.verify || {}, soc = (Array.isArray(s.socials) ? s.socials : []).length;
  const row = (name, state, ok, note) => `<tr><th scope="row">${esc(name)}</th><td><span class="pill${ok ? '' : ' warn'}">${esc(state)}</span></td><td class="sm">${note}</td></tr>`;
  const ai = info.aiKey ? (s.aiOff ? t('aIntOff') : t('aIntOn')) : t('aIntNoKey');
  const seN = [vf.google, vf.yandex].filter(Boolean).length;
  return `${this.who()}<div class="admin-stack"><p class="muted">${esc(t('aIntLead'))}</p>
    <section class="panel"><div class="za-table-wrap"><table class="za-table za-int"><thead><tr><th scope="col">${esc(t('aIntSvc'))}</th><th scope="col">${esc(t('aIntState'))}</th><th scope="col">${esc(t('aIntWhat'))}</th></tr></thead><tbody>
      ${row(t('aIntAi'), ai, info.aiKey && !s.aiOff, esc(t('aIntAiNote')))}
      ${row(t('aIntMap'), t('aIntOn'), true, esc(t('aIntMapNote')))}
      ${row(t('aIntSoc'), soc ? fmt(t('aIntSocN'), {n:soc}) : t('aIntNone'), soc > 0, `${esc(t('aIntSocNote'))} <button type="button" class="btn ghost sm" data-act="atab" data-v="branches">${esc(t('aBranches'))}</button>`)}
      ${row(t('aIntGov'), t('aIntOn'), true, `${esc(t('aIntGovNote'))} <a href="${esc(EGOV[lang])}" target="_blank" rel="noopener">eGov</a> · <a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish</a>`)}
      ${row(t('aIntYt'), t('aIntOn'), true, esc(t('aIntYtNote')))}
      ${row(t('aIntSe'), seN ? t('aIntSet') + ': ' + seN + '/2' : t('aIntNone'), seN > 0, esc(t('aIntSeNote')))}
    </tbody></table></div></section>
    <form class="panel form" id="za-int" novalidate>
      <label class="za-chk"><input type="checkbox" id="zi-aioff"${s.aiOff ? ' checked' : ''}${info.aiKey ? '' : ' disabled'}> ${esc(t('aIntAiOff'))}</label>
      <div class="row2"><div class="field"><label for="zi-g">${esc(t('aIntG'))}</label><input id="zi-g" type="text" maxlength="100" autocomplete="off" spellcheck="false" value="${esc(vf.google || '')}"></div>
        <div class="field"><label for="zi-y">${esc(t('aIntY'))}</label><input id="zi-y" type="text" maxlength="100" autocomplete="off" spellcheck="false" value="${esc(vf.yandex || '')}"></div></div>
      <p class="hint">${esc(t('aIntSeNote'))}</p>
      <button class="btn" type="submit" style="align-self:flex-start">${esc(t('aSave'))}</button></form></div>`;
};
async function saveSite(next) {
  try { await Store.saveSettings(next); toast(t('saved')); } catch (er) { toast(er.msg || t('saveFail')); return false; }
  applySite(); renderAdmin(true); return true;
}
document.addEventListener('click', async e => {
  const b = e.target.closest && e.target.closest('[data-act^="za-nav-"], [data-act^="za-site-"]'); if (!b) return;
  const act = b.dataset.act;
  if (act === 'za-nav-mv') {
    TZA.readNav(); const i = +b.dataset.v, j = i + +b.dataset.k, a = TZA.st.nav;
    if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; renderAdmin(true);
    const nb = $(`#za-nav tr[data-nav="${a[j].id}"] [data-act="za-nav-mv"][data-k="${b.dataset.k}"]`) || $(`#za-nav tr[data-nav="${a[j].id}"] [data-act="za-nav-mv"]:not([disabled])`); if (nb) nb.focus();
  } else if (act === 'za-site-save') {
    TZA.readNav(); const nav = TZA.st.nav;
    if (!nav.some(n => n.on)) { toast(t('aNavNone')); return; }
    const next = {...S(), langs:{kz:$('#zl-kz').checked, en:$('#zl-en').checked}};
    const plain = nav.every((n, i) => n.id === NAV_IDS[i] && n.on && !n.t);   // всё стандартное — не храним
    if (plain) delete next.nav; else next.nav = nav;
    if (next.langs.kz && next.langs.en) delete next.langs;
    TZA.st.nav = null; await saveSite(next);
  } else if (act === 'za-site-reset') {
    const next = {...S()}; delete next.nav; delete next.langs; TZA.st.nav = null; await saveSite(next);
  }
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'za-int') return; e.preventDefault();
  const g = ($('#zi-g').value || '').trim(), y = ($('#zi-y').value || '').trim(), ok = v => !v || /^[A-Za-z0-9_-]{8,100}$/.test(v);
  if (!ok(g) || !ok(y)) { toast(t('aIntBad')); return; }
  const next = {...S()}; const aoff = $('#zi-aioff');
  if (g || y) next.verify = {...(g ? {google:g} : {}), ...(y ? {yandex:y} : {})}; else delete next.verify;
  if (aoff && aoff.checked) next.aiOff = true; else delete next.aiOff;
  if (await saveSite(next) && Store.apiInfo) Store.apiInfo.ai = !!Store.apiInfo.aiKey && !next.aiOff;
});
