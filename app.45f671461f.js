(() => {
'use strict';

/* ================= CONFIG ================= */
const CONFIG = {
  // Свой сервер для ИИ: POST {system, messages, lang} → {text}. Пусто: Claude (в артефакте) или встроенный бот.
  aiEndpoint: '',
  adminPassword: 'arhiv2026',  // только для демо; в рабочей версии вход через сервер
  tzOffsetHours: 5,            // Казахстан, UTC+5
  // Ключ 2ГИС для карты (Менеджер Платформы 2ГИС). Ключ карты виден в коде страницы — так устроены все карты для сайтов;
  // ограничьте его своим доменом в кабинете 2ГИС. Свой ключ можно вписать в панели сотрудников: «Настройки».
  gisKey: 'bee55bb5-2e16-45c8-b18b-52550e972030'   // демо-ключ
};
const IN_PREVIEW = !!(window.claude && typeof window.claude.use === 'function');

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => o[k] ?? m);
const safeId = s => String(s).replace(/[^A-Za-z0-9_\-.~:@+]/g, '_').slice(0, 180);
const LS = {
  get(k, d) { try { const v = localStorage.getItem('arhvko_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('arhvko_' + k, JSON.stringify(v)); } catch (e) {} }
};
const SS = {
  get(k) { try { return sessionStorage.getItem('arhvko_' + k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem('arhvko_' + k, v); } catch (e) {} },
  del(k) { try { sessionStorage.removeItem('arhvko_' + k); } catch (e) {} }
};

/* ================= i18n: [ru, kz, en] ================= */
const T = {
  skip:["Перейти к содержанию","Мазмұнға өту","Skip to content"],
  rk:["Республика Казахстан","Қазақстан Республикасы","Republic of Kazakhstan"],
  eye:["Версия для слабовидящих","Көзі нашар көретіндерге","Low-vision version"],
  emblemAlt:["Государственный герб Республики Казахстан","Қазақстан Республикасының Мемлекеттік Елтаңбасы","State Emblem of the Republic of Kazakhstan"],
  fontSize:["Размер шрифта","Қаріп өлшемі","Text size"],
  fsDec:["Уменьшить шрифт","Қаріпті кішірейту","Smaller text"],
  fsReset:["Обычный шрифт","Қалыпты қаріп","Normal text"],
  fsInc:["Увеличить шрифт","Қаріпті үлкейту","Larger text"],
  theme:["Цвет","Түсі","Colours"],
  themeLight:["Светлый","Ашық","Light"],
  themeDark:["Тёмный","Қараңғы","Dark"],
  themeContrast:["Чёрно-жёлтый","Қара-сары","Black and yellow"],
  spacing:["Шире интервал","Кең аралық","Wider spacing"],
  lang:["Язык","Тіл","Language"],
  speak:["Озвучить страницу","Бетті дауыстап оқу","Read the page aloud"],
  stop:["Остановить","Тоқтату","Stop"],
  ttsNo:["Озвучивание не поддерживается в этом браузере","Бұл браузерде дауыстап оқу қолжетімсіз","Read-aloud isn't supported in this browser"],
  close:["Закрыть","Жабу","Close"],
  orgName:["Государственный архив Восточно-Казахстанской области","Шығыс Қазақстан облысының мемлекеттік архиві","State Archive of East Kazakhstan Region"],
  orgName2:["Шығыс Қазақстан облысының мемлекеттік архиві","Государственный архив Восточно-Казахстанской области","Шығыс Қазақстан облысының мемлекеттік архиві"],
  stOpen:["Открыто до {t}","{t} дейін ашық","Open until {t}"],
  stLunch:["Обед до {t}","{t} дейін түскі үзіліс","Lunch break until {t}"],
  stOpensToday:["Закрыто, откроется в {t}","Жабық, сағат {t} ашылады","Closed, opens at {t}"],
  stOpensTomorrow:["Закрыто, откроется завтра в {t}","Жабық, ертең сағат {t} ашылады","Closed, opens tomorrow at {t}"],
  stOpensOn:["Закрыто, откроется {d} в {t}","Жабық, {d} күні сағат {t} ашылады","Closed, opens {d} at {t}"],
  days:[["в воскресенье","в понедельник","во вторник","в среду","в четверг","в пятницу","в субботу"],["жексенбі","дүйсенбі","сейсенбі","сәрсенбі","бейсенбі","жұма","сенбі"],["on Sunday","on Monday","on Tuesday","on Wednesday","on Thursday","on Friday","on Saturday"]],
  navHome:["Главная","Басты бет","Home"],
  navAbout:["Об архиве","Архив туралы","About"],
  navHistory:["История","Тарих","History"],
  navNews:["Новости","Жаңалықтар","News"],
  navContacts:["Контакты и карта","Байланыс және карта","Contacts and map"],
  menu:["Меню","Мәзір","Menu"],
  heroKicker:["Восточно-Казахстанская область · Усть-Каменогорск","Шығыс Қазақстан облысы · Өскемен","East Kazakhstan Region · Oskemen"],
  heroLead:["Храним документы о жизни нашего края с 1940 года.", "1940 жылдан бері өлкеміздің өмірі туралы құжаттарды сақтаймыз.", "Keeping records of our region's life since 1940."],
  heroIll:["Рисунок: здание архива на фоне гор Алтая, рядом река Иртыш","Сурет: Алтай таулары аясындағы архив ғимараты, жанында Ертіс өзені","Illustration: the archive building against the Altai mountains, with the Irtysh river nearby"],
  btnAbout:["Подробнее об архиве","Архив туралы толығырақ","More about the archive"],
  btnMap:["Где мы находимся","Біз қайдамыз","Where we are"],
  f1k:["год основания архива","архив құрылған жыл","year the archive was founded"],
  f2k:["филиала в области","облыстағы филиал","branches in the region"],
  f3k:["пн–пт, обед {lf}–{lt}","дс–жм, түскі үзіліс {lf}–{lt}","Mon–Fri, lunch {lf}–{lt}"],
  f4k:["ул. Бейбітшілік, Усть-Каменогорск","Бейбітшілік көшесі, Өскемен","Beibitshilik St, Oskemen"],
  aboutKicker:["Кто мы","Біз кімбіз","Who we are"],
  aboutTitle:["Об архиве","Архив туралы","About the archive"],
  aboutLeadPage:["Кто мы, история архива, руководство, планы и отчёты, нормативные документы.","Біз кімбіз, архив тарихы, басшылық, жоспарлар мен есептер, нормативтік құжаттар.","Who we are, our history, management, plans and reports, regulations."],
  aboutP1:["Государственный архив ВКО хранит документы органов власти, предприятий и жителей области и делает их доступными для людей.", "ШҚО мемлекеттік архиві билік органдарының, кәсіпорындардың және облыс тұрғындарының құжаттарын сақтайды және оларды халыққа қолжетімді етеді.", "The State Archive of EKR keeps records of government bodies, enterprises and residents of the region and makes them available to people."],
  aboutP2:["Работает в составе Управления цифровизации и архивов ВКО, имеет 13 филиалов.", "ШҚО цифрландыру және архивтер басқармасының құрамында жұмыс істейді, он үш филиалы бар.", "Part of the EKR Department of Digitalization and Archives, with 13 branches."],
  aboutP3:["Главное здание: Усть-Каменогорск, ул. Бейбітшілік (бывш. Головкова), 26/1. Здание бывшего партийного архива передано архиву в 1991 году.", "Бас ғимарат: Өскемен, Бейбітшілік көшесі (бұрынғы Головков), 26/1. Бұрынғы партия архивінің ғимараты архивке 1991 жылы берілді.", "Main building: 26/1 Beibitshilik St (formerly Golovkov), Oskemen. The former party archive building was handed to the archive in 1991."],
  more:["Подробнее","Толығырақ","Read more"],
  whyTitle:["Для чего нужен архив","Архив не үшін керек","Why the archive matters"],
  storeKicker:["Фонды","Қорлар","Holdings"],
  storeTitle:["Что хранится в архиве","Архивте не сақталады","What the archive keeps"],
  storeLead:["Документы, важные для истории края и его жителей.", "Өлке тарихы мен тұрғындары үшін маңызды құжаттар.", "Records that matter for the region and its people."],
  histKicker:["Тарих","Тарих","History"],
  histTitle:["История архива","Архив тарихы","History of the archive"],
  histLead:["От образования области в 1932 году до наших дней.", "1932 жылы облыстың құрылуынан бүгінге дейін.", "From the region's founding in 1932 to today."],
  histAll:["Вся история архива","Архивтің толық тарихы","The full history"],
  logoAlt:["Логотип Государственного архива ВКО", "ШҚО мемлекеттік архивінің логотипі", "State Archive of EKR logo"],
  armsAlt:["Герб города Усть-Каменогорска", "Өскемен қаласының елтаңбасы", "Coat of arms of Oskemen (Ust-Kamenogorsk)"],
  flagAlt:["Государственный флаг Республики Казахстан", "Қазақстан Республикасының Мемлекеттік Туы", "State Flag of the Republic of Kazakhstan"],
  emblemNote:["Шанырак в круге с лучами-уыками и крылатые тулпары.", "Уықтары күн шұғыласындай тараған шаңырақ және қанатты тұлпарлар.", "A shanyrak with radiating uyks and winged tulpars in a circle."],
  flagNote:["Голубое полотнище, золотое солнце, парящий беркут и орнамент у древка.", "Көгілдір матадағы алтын күн, қалықтаған қыран және сабының жанындағы ою-өрнек.", "A sky-blue field with a golden sun, a soaring eagle and an ornament by the staff."],
  armsNote:["Горы Алтая, вода, башня с флагом и год основания города: 1720.", "Алтай таулары, су, туы бар мұнара және қала құрылған жыл: 1720.", "Altai mountains, water, a tower with a flag and the city's founding year, 1720."],
  symKicker:["Символика", "Рәміздер", "Symbols"],
  symTitle:["Символы страны, города и архива", "Ел, қала және архив рәміздері", "Symbols of the country, the city and the archive"],
  logoTitle:["Логотип архива", "Архив логотипі", "The archive logo"],
  navFaq:["Вопросы", "Сұрақтар", "Questions"],
  faqKicker:["Помощь", "Көмек", "Help"],
  faqTitle:["Частые вопросы", "Жиі қойылатын сұрақтар", "Frequently asked questions"],
  faqLead:["Короткие ответы на то, о чём чаще всего спрашивают.", "Жиі қойылатын сұрақтарға қысқа жауаптар.", "Short answers to what people ask most often."],
  glossTitle:["Словарь архивных слов", "Архив сөздігі", "Archive glossary"],
  glossLead:["Что значат слова, которые встречаются в архиве и в справках.", "Архивте және анықтамаларда кездесетін сөздердің мағынасы.", "What the words you meet in the archive and on certificates mean."],
  heroIllCap:["Рисунок: здание архива. Фото появится после загрузки.", "Сурет: архив ғимараты. Фото жүктелген соң шығады.", "Illustration: the archive building. A photo will appear once uploaded."],
  memoKicker:["Памятка посетителю", "Келушіге жадынама", "Visitor card"],
  memoBtn:["Памятка для печати", "Басып шығаруға жадынама", "Printable visitor card"],
  memoBring:["Возьмите с собой", "Өзіңізбен алыңыз", "Bring with you"],
  memoBringText:["удостоверение личности; если вопрос о родственнике, документ о родстве", "жеке куәлік; туысыңыз туралы болса, туыстықты растайтын құжат", "your ID card; for a relative, a document proving the relationship"],
  memoQr:["Наведите камеру телефона: откроется маршрут в 2ГИС","Телефон камерасын бағыттаңыз: 2ГИС-те бағыт ашылады","Point your phone camera to open the route in 2GIS"],
  print:["Распечатать", "Басып шығару", "Print"],
  printNo:["Печать здесь недоступна. Откройте сайт в браузере или сделайте снимок экрана.", "Мұнда басып шығару мүмкін емес. Сайтты браузерде ашыңыз немесе экранды суретке түсіріңіз.", "Printing isn't available here. Open the site in a browser or take a screenshot."],
  waShare:["Отправить адрес в WhatsApp", "Мекенжайды WhatsApp-қа жіберу", "Send the address via WhatsApp"],
  waText:["Государственный архив ВКО: {a}. Тел.: {p}. Карта: {m}", "ШҚО мемлекеттік архиві: {a}. Тел.: {p}. Карта: {m}", "State Archive of EKR: {a}. Tel.: {p}. Map: {m}"],
  bbCall:["Позвонить", "Қоңырау", "Call"],
  bbMap:["Карта", "Карта", "Map"],
  bbFeedback:["Отзыв", "Пікір", "Feedback"],
  quick:["Быстрые действия", "Жылдам әрекеттер", "Quick actions"],
  mic:["Сказать голосом", "Дауыспен айту", "Speak your question"],
  micNo:["Голосовой ввод недоступен в этом браузере", "Бұл браузерде дауыспен енгізу қолжетімсіз", "Voice input isn't available in this browser"],
  listening:["Слушаю…", "Тыңдап тұрмын…", "Listening…"],
  icAddrT:["Адрес", "Мекенжай", "Address"],
  icHoursT:["Когда работаем", "Жұмыс уақыты", "Opening hours"],
  icPhoneT:["Телефон", "Телефон", "Phone"],
  showMap:["Показать на карте", "Картадан көрсету", "Show on the map"],
  callBtn:["Позвонить", "Қоңырау шалу", "Call"],
  howGo:["Как добраться", "Қалай жетуге болады", "How to get here"],
  weekendShort:["Суббота, воскресенье: выходной", "Сенбі, жексенбі: демалыс", "Closed Saturday and Sunday"],
  lunchShort:["Обед {lf}–{lt}", "Түскі үзіліс {lf}–{lt}", "Lunch {lf}–{lt}"],
  weekShort:["Понедельник – пятница", "Дүйсенбі – жұма", "Monday – Friday"],
  keyDates:["Главные даты", "Негізгі даталар", "Key dates"],
  route2gis:["Маршрут в 2ГИС", "2ГИС-те бағыт", "Route in 2GIS"],
  otherMaps:["Другие карты:", "Басқа карталар:", "Other maps:"],
  cityName:["Усть-Каменогорск", "Өскемен", "Oskemen (Ust-Kamenogorsk)"],
  addrShort:["ул. Бейбітшілік, 26/1", "Бейбітшілік көшесі, 26/1", "26/1 Beibitshilik St"],
  addrOld:["бывшая улица Головкова", "бұрынғы Головков көшесі", "formerly Golovkov St"],
  stHoliday:["Сегодня выходной: {h}", "Бүгін демалыс: {h}", "Closed today: {h}"],
  stShift:["перенос за {h}", "{h} үшін ауыстырылған демалыс", "day off in lieu of {h}"],
  extraDay:["дополнительный выходной", "қосымша демалыс", "additional day off"],
  nextOpen:["Откроется {d} в {t}", "{d} сағат {t} ашылады", "Opens {d} at {t}"],
  tomorrow:["завтра", "ертең", "tomorrow"],
  nextHoliday:["Ближайший праздничный выходной: {d}, {h}", "Жақын мереке демалысы: {d}, {h}", "Next public holiday: {d}, {h}"],
  holidaysNote:["В праздничные дни архив не работает.", "Мереке күндері архив жұмыс істемейді.", "The archive is closed on public holidays."],
  sExtra:["Дополнительные выходные (каждая дата с новой строки: ГГГГ-ММ-ДД и название)", "Қосымша демалыс күндері (әр күн жаңа жолдан: ЖЖЖЖ-АА-КК және атауы)", "Extra days off (one per line: YYYY-MM-DD and a name)"],
  sExtraHint:["Государственные праздники учитываются сами. Сюда вносите Курбан айт и переносы, которые объявляет правительство.", "Мемлекеттік мерекелер өздігінен ескеріледі. Мұнда Құрбан айтты және үкімет жариялайтын ауыстыруларды енгізіңіз.", "Public holidays are built in. Add Kurban Ait and government-announced transfers here."],
  autoSpeak:["Читать ответы вслух", "Жауаптарды дауыстап оқу", "Read answers aloud"],
  aContent:["Тексты", "Мәтіндер", "Texts"],
  aPhotos:["Фото", "Фото", "Photos"],
  cAbout:["Тексты «Об архиве»", "«Архив туралы» мәтіндері", "“About” texts"],
  cPara:["Абзац {n}", "{n}-азат жол", "Paragraph {n}"],
  cRu:["по-русски", "орысша", "Russian"],
  cKz:["по-казахски", "қазақша", "Kazakh"], cEn:["по-английски", "ағылшынша", "English"],
  cBranches:["Филиалы: каждый с новой строки, «по-русски | қазақша»", "Филиалдар: әрқайсысы жаңа жолдан, «орысша | қазақша»", "Branches: one per line, “Russian | Kazakh”"],
  cFaq:["Частые вопросы", "Жиі қойылатын сұрақтар", "FAQ"],
  cQ:["Вопрос", "Сұрақ", "Question"],
  cA:["Ответ", "Жауап", "Answer"],
  cAddQ:["Добавить вопрос", "Сұрақ қосу", "Add a question"],
  cRemove:["Убрать", "Алып тастау", "Remove"],
  cReset:["Вернуть исходные тексты", "Бастапқы мәтіндерді қайтару", "Restore the original texts"],
  phUpload:["Загрузить фото", "Фото жүктеу", "Upload a photo"],
  phFile:["Файл с фото", "Фото файлы", "Photo file"],
  phSlot:["Где показать", "Қай жерде көрсету", "Where to show it"],
  slotPHome:["Панорама на главной","Басты беттегі панорама","Home panorama"], slotPVis:["Панорама: Посетителям","Панорама: Келушілерге","Panorama: Visitors"],
  slotPFonds:["Панорама: Фонды","Панорама: Қорлар","Panorama: Holdings"], slotPRegion:["Панорама: История края","Панорама: Өлке тарихы","Panorama: Local history"],
  slotPAbout:["Панорама: Об архиве","Панорама: Архив туралы","Panorama: About"], slotPNews:["Панорама: Новости","Панорама: Жаңалықтар","Panorama: News"], slotPContacts:["Панорама: Контакты","Панорама: Байланыс","Panorama: Contacts"],
  slotHero:["Главная, рядом с названием", "Басты бет, атауының жанында", "Home, next to the title"],
  slotAbout:["«Об архиве»", "«Архив туралы»", "About page"],
  slotContacts:["«Контакты»", "«Байланыс»", "Contacts page"],
  slotGallery:["Галерея на главной", "Басты беттегі галерея", "Home page gallery"],
  phCapRu:["Подпись (рус.)", "Қолтаңба (орыс.)", "Caption (Russian)"],
  phCapKz:["Подпись (каз.)", "Қолтаңба (қаз.)", "Caption (Kazakh)"],
  phHint:["Фото само уменьшится до 1280 пикселей, чтобы сайт быстро открывался.", "Сайт тез ашылуы үшін фото 1280 пиксельге дейін өзі кішірейеді.", "The photo is resized to 1280 px so the site stays fast."],
  phEmpty:["Загруженных фото пока нет. На сайте показываются встроенные.", "Жүктелген фото әзірге жоқ. Сайтта кірістірілген фотолар көрсетіледі.", "No uploaded photos yet. The built-in ones are shown."],
  phNoFile:["Выберите файл с фото", "Фото файлын таңдаңыз", "Choose a photo file"],
  phTooBig:["Не удалось уменьшить фото до нужного размера. Выберите другое.", "Фотоны қажетті өлшемге кішірейту мүмкін болмады. Басқасын таңдаңыз.", "Couldn't shrink the photo enough. Please choose another."],
  pubKicker:["Издания", "Басылымдар", "Publications"],
  pubTitle:["Издания архива", "Архив басылымдары", "Archive publications"],
  pubLead:["Архив выпускает сборники документов по истории края.", "Архив өлке тарихы бойынша құжаттар жинақтарын шығарады.", "The archive publishes document collections on the region's history."],
  pubRead:["Сборники на сайте архива", "Архив сайтындағы жинақтар", "Collections on the archive's site"],
  earliest:["Самые ранние документы рассказывают об установлении советской власти в Усть-Каменогорске: фонды уездного ревкома, исполкома и военкомата.", "Ең ерте құжаттар Өскеменде кеңес өкіметінің орнауы туралы: уездік ревкомның, атқару комитетінің және әскери комиссариаттың қорлары.", "The earliest records cover the establishment of Soviet power in Oskemen: the district revolutionary committee, executive committee and military commissariat."],
  pwdServer:["Пароль задан на сервере.", "Құпиясөз серверде орнатылған.", "The password is set on the server."],
  modeApi:["Данные хранятся на сервере сайта и общие для всех посетителей.", "Деректер сайт серверінде сақталады және барлық келушілерге ортақ.", "Data is stored on the site's server and shared by all visitors."],
  shelfCap:["Рисунок: архивные стеллажи","Сурет: архив сөрелері","Illustration: archive shelves"],
  galKicker:["Фотографии","Фотосуреттер","Photos"],
  galTitle:["Архив в фотографиях","Архив фотосуреттерде","The archive in photos"],
  shelfIll:["Рисунок: архивные стеллажи с коробками документов и рабочий стол","Сурет: құжат қораптары бар архив сөрелері және жұмыс үстелі","Illustration: archive shelves with document boxes and a desk"],
  bookIll:["Рисунок: открытая книга с фотографией и печатью","Сурет: фотосуреті мен мөрі бар ашық кітап","Illustration: an open book with a photograph and a stamp"],
  brTitle:["Структура и филиалы","Құрылымы және филиалдары","Structure and branches"],
  brLead:["Главное здание в Усть-Каменогорске и 13 филиалов в области.", "Бас ғимарат Өскеменде, облыста он үш филиал бар.", "The main building is in Oskemen, with 13 branches across the region."],
  brBuildings:["Здания в Усть-Каменогорске: Бейбітшілік, 26/1 (главное), Потанина, 12/2, Крылова, 39.", "Өскемендегі ғимараттар: Бейбітшілік, 26/1 (бас ғимарат), Потанин, 12/2, Крылов, 39.", "Buildings in Oskemen: 26/1 Beibitshilik (main), 12/2 Potanin, 39 Krylov."],
  mapPickLabel:["На карте:","Картада:","On the map:"],
  mapMain:["Главное здание","Бас ғимарат","Main building"],
  mapAll:["Все здания в 2ГИС","Барлық ғимараттар 2ГИС-те","All buildings in 2GIS"],
  otherBuildings:["Другие здания архива в городе","Архивтің қаладағы басқа ғимараттары","Other archive buildings in the city"],
  otherBuildingsNote:["Какой отдел где принимает, уточните по телефону.","Қай бөлім қай жерде қабылдайтынын телефон арқылы нақтылаңыз.","Please call to check which department receives visitors where."],
  sOther:["Другие здания в городе","Қаладағы басқа ғимараттар","Other buildings in the city"],
  regKicker:["Наш край","Біздің өлке","Our region"],
  regTitle:["Восточный Казахстан","Шығыс Қазақстан","East Kazakhstan"],
  regLead:["Самый восток страны, граница с Россией и Китаем. Центр области, Усть-Каменогорск, основан в 1720 году у впадения Ульбы в Иртыш.", "Еліміздің ең шығысы, Ресеймен және Қытаймен шекара. Облыс орталығы Өскемен 1720 жылы Үлбі Ертіске құятын жерде негізделген.", "The far east of the country, bordering Russia and China. Its centre, Oskemen, was founded in 1720 where the Ulba flows into the Irtysh."],
  mapKicker:["Адрес","Мекенжай","Address"],
  mapTitle:["Как нас найти","Бізді қалай табуға болады","How to find us"],
  mapLead:["Главное здание архива в Усть-Каменогорске.", "Архивтің бас ғимараты Өскеменде.", "The archive's main building in Oskemen."],
  hours:["Режим работы","Жұмыс уақыты","Opening hours"],
  hoursShort:["Пн–Пт {o}–{c}, обед {lf}–{lt}","Дс–Жм {o}–{c}, түскі үзіліс {lf}–{lt}","Mon–Fri {o}–{c}, lunch {lf}–{lt}"],
  weekdays:["Понедельник – пятница","Дүйсенбі – жұма","Monday – Friday"],
  lunch:["Обед","Түскі үзіліс","Lunch break"],
  weekend:["Суббота и воскресенье","Сенбі және жексенбі","Saturday and Sunday"],
  dayOff:["Выходной","Демалыс","Closed"],
  address:["Адрес","Мекенжай","Address"],
  phones:["Телефоны","Телефондар","Phones"],
  routeTitle:["Проложить маршрут","Бағыт құру","Get directions"],
  g2gis:["2ГИС","2GIS","2GIS"],
  gYandex:["Яндекс Карты","Яндекс Карталар","Yandex Maps"],
  gGoogle:["Google Карты","Google Карталар","Google Maps"],
  mapFallback:["Схема расположения зданий. Нажмите на здание — откроется маршрут в 2ГИС.","Ғимараттардың орналасу сызбасы. Ғимаратты басыңыз — 2ГИС-те бағыт ашылады.","Layout of the buildings. Tap a building to open the route in 2GIS."],
  mapFrameTitle:["Карта: Государственный архив ВКО","Карта: ШҚО мемлекеттік архиві","Map: State Archive of EKR"],
  copyAddr:["Скопировать адрес","Мекенжайды көшіру","Copy address"],
  copied:["Адрес скопирован","Мекенжай көшірілді","Address copied"],
  copyFail:["Не получилось скопировать. Выделите адрес и скопируйте вручную.","Көшіру мүмкін болмады. Мекенжайды белгілеп, қолмен көшіріңіз.","Couldn't copy. Select the address and copy it manually."],
  newsKicker:["Жаңалықтар","Жаңалықтар","Updates"],
  newsTitle:["Новости архива","Архив жаңалықтары","Archive news"],
  allNews:["Все новости","Барлық жаңалықтар","All news"], hImpT:["Важно","Маңызды","Important"],
  noNews:["Новостей пока нет.","Әзірге жаңалық жоқ.","No news yet."],
  example:["Пример","Мысал","Example"],
  linksTitle:["Полезные ссылки","Пайдалы сілтемелер","Useful links"],
  l1x:["Электронное правительство: архивные справки и другие госуслуги","Электрондық үкімет: архивтік анықтамалар және басқа мемлекеттік қызметтер","E-government: archive certificates and other public services"],
  l2x:["Обращения в государственные органы","Мемлекеттік органдарға өтініштер","Requests to government bodies"],
  l3t:["Управление цифровизации и архивов ВКО","ШҚО цифрландыру және архивтер басқармасы","EKR Department of Digitalization and Archives"],
  l3x:["Вышестоящий орган архива","Архивтің жоғары тұрған органы","The archive's parent body"],
  sideTab:["Оставить отзыв","Пікір қалдыру","Leave feedback"],
  gbTitle:["Отзывы и гостевая книга","Пікірлер және қонақ кітабы","Feedback and guestbook"],
  gbLead:["Оцените сайт или оставьте запись. Записи публикуются после проверки. Для обращений есть eOtinish.kz.", "Сайтты бағалаңыз немесе жазба қалдырыңыз. Жазбалар тексерілгеннен кейін жарияланады. Өтініштер үшін eOtinish.kz бар.", "Rate the site or leave an entry. Entries are published after review. For official requests, use eOtinish.kz."],
  rateTitle:["Удобен ли этот сайт?","Бұл сайт ыңғайлы ма?","Is this website easy to use?"],
  r1:["Очень неудобно","Мүлде ыңғайсыз","Very hard to use"],
  r2:["Неудобно","Ыңғайсыз","Hard to use"],
  r3:["Нормально","Орташа","It's OK"],
  r4:["Удобно","Ыңғайлы","Easy"],
  r5:["Очень удобно","Өте ыңғайлы","Very easy"],
  starN:["Оценка {n} из 5","5-тен {n} баға","Rating {n} of 5"],
  rateComment:["Что можно улучшить? (необязательно)","Нені жақсартуға болады? (міндетті емес)","What could be better? (optional)"],
  rateSend:["Отправить оценку","Бағаны жіберу","Send rating"],
  rateThanks:["Спасибо за оценку!","Бағаңызға рақмет!","Thank you for your rating!"],
  rateChoose:["Сначала выберите оценку от 1 до 5","Алдымен 1-ден 5-ке дейін баға таңдаңыз","Please choose a rating from 1 to 5 first"],
  votesN:["Оценок: {n}","Бағалар саны: {n}","Ratings: {n}"],
  noVotes:["Оценок пока нет. Ваша будет первой.","Әзірге баға жоқ. Сіздікі бірінші болады.","No ratings yet. Yours will be the first."],
  writeTitle:["Запись в гостевую книгу","Қонақ кітабына жазба","Guestbook entry"],
  name:["Ваше имя","Атыңыз","Your name"],
  city:["Город или село (необязательно)","Қала немесе ауыл (міндетті емес)","Town or village (optional)"],
  message:["Сообщение","Хабарлама","Message"],
  send:["Отправить","Жіберу","Send"],
  gbThanks:["Спасибо! Запись появится после проверки.","Рақмет! Жазба тексерілгеннен кейін шығады.","Thank you! Your entry will appear after review."],
  savedLocal:["Запись сохранена только в этом браузере (демо-режим).","Жазба тек осы браузерде сақталды (демо режим).","Saved in this browser only (demo mode)."],
  errName:["Напишите, как вас зовут","Атыңызды жазыңыз","Please enter your name"],
  errText:["Напишите сообщение, хотя бы несколько слов","Хабарлама жазыңыз, кем дегенде бірнеше сөз","Please write a message, at least a few words"],
  tabEntries:["Гостевая книга","Қонақ кітабы","Guestbook"],
  tabComments:["Отзывы о сайте","Сайт туралы пікірлер","Site comments"],
  entriesEmpty:["Опубликованных записей пока нет. Ваша может стать первой.","Әзірге жарияланған жазба жоқ. Сіздікі бірінші болуы мүмкін.","No published entries yet. Yours could be the first."],
  reviewsEmpty:["Опубликованных отзывов пока нет.","Әзірге жарияланған пікір жоқ.","No published comments yet."],
  reply:["Ответ архива","Архив жауабы","Archive's reply"],
  loading:["Загрузка…","Жүктелуде…","Loading…"],
  loadFail:["Не удалось загрузить записи. Попробуйте позже.","Жазбаларды жүктеу мүмкін болмады. Кейінірек көріңіз.","Couldn't load entries. Please try later."],
  chars:["{n} из {m} знаков","{m} таңбадан {n}","{n} of {m} characters"],
  chatTitle:["Помощник архива","Архив көмекшісі","Archive assistant"],
  chatSub:["Справки, предки, адрес, поиск по сайту","Анықтамалар, ата-баба, мекенжай, сайттан іздеу","Certificates, family history, address, site search"],
  chatHello:["Здравствуйте! Я помощник архива. Спросите, как получить справку, как найти сведения о предках, где находится архив или что в нём хранится. Могу найти и любую информацию на сайте.","Сәлеметсіз бе! Мен архив көмекшісімін. Анықтаманы қалай алуға, ата-баба туралы мәліметті қалай табуға болатынын, архивтің қайда орналасқанын немесе онда не сақталатынын сұраңыз. Сайттағы кез келген ақпаратты да таба аламын.","Hello! I'm the archive assistant. Ask how to get a certificate, how to trace your ancestors, where the archive is or what it keeps. I can also find anything on the site."],
  chip1:["Где находится архив?","Архив қайда орналасқан?","Where is the archive?"],
  chip2:["Когда вы работаете?","Қашан жұмыс істейсіздер?","When are you open?"],
  chip3:["Как получить справку о стаже?","Өтіл туралы анықтаманы қалай алуға болады?","How do I get an employment certificate?"],
  chip4:["Как найти сведения о предках?","Ата-баба туралы мәліметті қалай табуға болады?","How do I trace my ancestors?"],
  chatPh:["Напишите вопрос…","Сұрағыңызды жазыңыз…","Type your question…"],
  listen:["Озвучить","Тыңдау","Listen"],
  thinking:["Помощник пишет ответ","Көмекші жауап жазып жатыр","The assistant is writing"],
  chatNoteAI:["Ответы готовит ИИ по открытым материалам сайта и каталога, со ссылками на источники. Важное уточняйте по телефону.","Жауаптарды ЖИ сайттың және каталогтың ашық материалдары бойынша дереккөздерге сілтеме жасап дайындайды. Маңыздысын телефон арқылы нақтылаңыз.","Answers are AI-generated from the open material of the site and catalog, with links to sources. Check anything important by phone."],
  chatNoteLocal:["Помощник отвечает на частые вопросы, ищет по сайту и в открытом каталоге. Важное уточняйте по телефону.","Көмекші жиі қойылатын сұрақтарға жауап беріп, сайттан және ашық каталогтан іздейді. Маңыздысын телефон арқылы нақтылаңыз.","The assistant answers common questions and searches the site and the open catalog. Check anything important by phone."],
  chip5:["Что есть про Риддер в 1941 году?","1941 жылы Риддер туралы не бар?","What is there about Ridder in 1941?"],
  aiSite:["Ещё на сайте по вашему вопросу","Сұрағыңыз бойынша сайттан тағы","More on the site for your question"],
  aiSrc:["Найдено на сайте (источники)","Сайттан табылғаны (дереккөздер)","Found on the site (sources)"],
  aiAlbP:["в альбоме есть фото найденных людей: {n}","альбомда табылған адамдардың фотосы бар: {n}","the album has photos of the people found: {n}"],
  aiMoreFound:["Также найдено по запросу","Сұрау бойынша тағы табылғаны","Also found for the query"],
  aiTExpo:["Выставка","Көрме","Exhibition"],
  aiTAlbum:["Фотоальбом","Фотоальбом","Photo album"],
  aiAlbN:["фото в альбоме: {n}","альбомдағы фото: {n}","photos in the album: {n}"],
  aiAll:["Все результаты в каталоге","Каталогтағы барлық нәтиже","All results in the catalog"],
  aiAuto:["Ответ сформирован автоматически (ИИ) по открытым материалам. Это не архивная справка и не юридический документ.","Жауап ашық материалдар бойынша автоматты түрде (ЖИ) жасалды. Бұл архив анықтамасы да, заңды құжат та емес.","This answer was generated automatically (AI) from open material. It is not an archival certificate or a legal document."],
  aiAutoLocal:["Ответ подобран автоматически по шаблонам и поиску. Это не архивная справка и не юридический документ.","Жауап үлгілер мен іздеу бойынша автоматты түрде таңдалды. Бұл архив анықтамасы да, заңды құжат та емес.","This answer was picked automatically from templates and search. It is not an archival certificate or a legal document."],
  aiFound:["Нашёл на сайте (каталог, «Архив памяти», выставки, фотоальбомы): {n}. Первые записи:","Сайттан табылды (каталог, «Жады архиві», көрмелер, фотоальбомдар): {n}. Алғашқы жазбалар:","Found on the site (catalog, Memory archive, exhibitions, photo albums): {n}. First records:"],
  aiNone:["В каталоге, «Архиве памяти» и выставках по этому запросу ничего подходящего не нашлось. Уточните место, годы или тему либо позвоните в приёмную: {ph}.","Каталогтан, «Жады архивінен» және көрмелерден бұл сұрау бойынша ештеңе табылмады. Орынды, жылдарды немесе тақырыпты нақтылаңыз немесе қабылдау бөлмесіне қоңырау шалыңыз: {ph}.","Nothing suitable was found in the catalog, the Memory archive or the exhibitions for this request. Add a place, years or a topic, or call reception: {ph}."],
  aiLimited:["Есть записи с ограниченным доступом ({n}): их содержание здесь не показывается.","Қолжетімділігі шектеулі жазбалар бар ({n}): олардың мазмұны мұнда көрсетілмейді.","There are records with restricted access ({n}): their content is not shown here."],
  aiRestr:["Личные дела, закрытые документы и персональные данные на сайте не выдаются: помощник работает только с открытыми материалами. Законный путь: архивная справка на eGov.kz или в ЦОН, либо работа в читальном зале. Телефон приёмной: {ph}.","Жеке істер, жабық құжаттар мен жеке деректер сайтта берілмейді: көмекші тек ашық материалдармен жұмыс істейді. Заңды жол: eGov.kz немесе ХҚКО арқылы архив анықтамасы не оқу залында жұмыс. Қабылдау бөлмесінің телефоны: {ph}.","Personal files, closed documents and personal data are not issued on the site: the assistant works with open material only. The lawful route is an archival certificate on eGov.kz or at the public service center, or work in the reading room. Reception phone: {ph}."],
  aiWarn:["Номера фондов в ответе не подтверждены найденными записями. Сверьте их по карточкам источников.","Жауаптағы қор нөмірлері табылған жазбалармен расталмаған. Оларды дереккөз карточкалары бойынша тексеріңіз.","Fond numbers in the answer are not confirmed by the records found. Check them on the source cards."],
  fab:["Помощник","Көмекші","Assistant"],
  wdShort:[["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],["Жс","Дс","Сс","Ср","Бс","Жм","Сн"],["Su","Mo","Tu","We","Th","Fr","Sa"]],
  showAllN:["Показать все ({n})","Барлығын көрсету ({n})","Show all ({n})"],
  clear:["Заново","Қайта","Restart"],
  routeTo:["Маршрут до архива","Архивке дейінгі бағыт","Route to the archive"],
  adminTitle:["Панель администрации","Әкімшілік панелі","Admin panel"],
  login:["Войти","Кіру","Sign in"],
  password:["Пароль","Құпиясөз","Password"],
  pwdHint:["Демо-пароль: arhiv2026. В рабочей версии вход будет через сервер.","Демо құпиясөз: arhiv2026. Жұмыс нұсқасында кіру сервер арқылы болады.","Demo password: arhiv2026. The live version will sign in through a server."],
  pwdWrong:["Неверный пароль","Құпиясөз қате","Wrong password"],
  logout:["Выйти","Шығу","Sign out"],
  backSite:["На сайт","Сайтқа","Back to site"],
  aSummary:["Сводка","Жиынтық","Summary"],
  aMod:["Модерация","Модерация","Moderation"],
  aNews:["Новости","Жаңалықтар","News"],
  aSettings:["Настройки","Баптаулар","Settings"],
  aQuestions:["Вопросы помощнику","Көмекшіге сұрақтар","Assistant questions"],
  statAvg:["Средняя оценка сайта","Сайттың орташа бағасы","Average site rating"],
  statVotes:["Всего оценок","Барлық бағалар","Total ratings"],
  statPending:["Ждут проверки","Тексеруді күтуде","Awaiting review"],
  statPublished:["Опубликовано записей","Жарияланған жазбалар","Published entries"],
  statQ:["Вопросов помощнику","Көмекшіге сұрақтар","Assistant questions"],
  distTitle:["Как оценивают сайт","Сайтты қалай бағалайды","How people rate the site"],
  recentQ:["Последние вопросы помощнику","Көмекшіге соңғы сұрақтар","Latest assistant questions"],
  fPending:["На проверке","Тексеруде","Pending"],
  fApproved:["Опубликованы","Жарияланған","Published"],
  fHidden:["Скрыты","Жасырылған","Hidden"],
  approve:["Опубликовать","Жариялау","Publish"],
  hide:["Скрыть","Жасыру","Hide"],
  del:["Удалить","Жою","Delete"],
  delConfirm:["Точно удалить?","Шынымен жою?","Really delete?"],
  replyPh:["Ответ архива (необязательно)","Архив жауабы (міндетті емес)","Archive reply (optional)"],
  saveReply:["Сохранить ответ","Жауапты сақтау","Save reply"],
  kindGb:["Гостевая книга","Қонақ кітабы","Guestbook"],
  kindRv:["Отзыв о сайте","Сайт туралы пікір","Site feedback"],
  emptyHere:["Здесь пока пусто.","Мұнда әзірге бос.","Nothing here yet."],
  newsAdd:["Добавить новость","Жаңалық қосу","Add a post"],
  newsEdit:["Изменить новость","Жаңалықты өзгерту","Edit post"],
  fTitleRu:["Заголовок (рус.)","Тақырып (орыс.)","Title (Russian)"],
  fTitleKz:["Заголовок (каз.)","Тақырып (қаз.)","Title (Kazakh)"],
  fTextRu:["Текст (рус.)","Мәтін (орыс.)","Text (Russian)"],
  fTextKz:["Текст (каз.)","Мәтін (қаз.)","Text (Kazakh)"],
  fDate:["Дата","Күні","Date"],
  save:["Сохранить","Сақтау","Save"],
  cancel:["Отмена","Болдырмау","Cancel"],
  edit:["Изменить","Өзгерту","Edit"],
  saved:["Сохранено","Сақталды","Saved"],
  saveFail:["Не удалось сохранить. Проверьте права доступа и связь.","Сақтау мүмкін болмады. Қол жеткізу құқығы мен байланысты тексеріңіз.","Couldn't save. Check access rights and connection."],
  needTitle:["Заполните заголовок на русском","Орыс тіліндегі тақырыпты толтырыңыз","Fill in the Russian title"],
  sBannerRu:["Объявление на главной (рус.)","Басты беттегі хабарландыру (орыс.)","Home page notice (Russian)"],
  sBannerKz:["Объявление на главной (каз.)","Басты беттегі хабарландыру (қаз.)","Home page notice (Kazakh)"],
  sBannerHint:["Оставьте пустым, чтобы не показывать.","Көрсетпеу үшін бос қалдырыңыз.","Leave empty to hide it."],
  sOpen:["Начало работы","Жұмыс басталуы","Opens"],
  sClose:["Конец работы","Жұмыс аяқталуы","Closes"],
  sLunchFrom:["Обед с","Түскі үзіліс басы","Lunch from"],
  sLunchTo:["Обед до","Түскі үзіліс соңы","Lunch until"],
  sPhones:["Телефоны (через запятую)","Телефондар (үтір арқылы)","Phones (comma-separated)"],
  modeDb:["Данные общие для всех посетителей и хранятся на сервере.","Деректер барлық келушілерге ортақ және серверде сақталады.","Data is shared by all visitors and stored on the server."],
  modeLocal:["Демо-режим: данные хранятся только в этом браузере.","Демо режим: деректер тек осы браузерде сақталады.","Demo mode: data is stored in this browser only."],
  qEmpty:["Вопросов пока не было.","Әзірге сұрақ болған жоқ.","No questions yet."],
  footNav:["Разделы","Бөлімдер","Sections"],
  footDemo:["Демо-версия сайта","Сайттың демо нұсқасы","Website demo"],
  footAdmin:["Вход для администрации","Әкімшілікке кіру","Staff sign-in"],
  heroTitle:["Государственный архив|Восточно-Казахстанской области","Шығыс Қазақстан облысының|мемлекеттік архиві","State Archive|of East Kazakhstan Region"],
  photosN:["{n} фото","{n} фото","Photos: {n}"],
  pgRead:["Читать полностью","Толығырақ оқу","Read in full"], pgReadArt:["Читать статью","Мақаланы оқу","Read the article"],
  pgKids:["Разделы и материалы","Бөлімдер мен материалдар","Sections and articles"], pgAllNews:["Все новости: {n}","Барлық жаңалықтар: {n}","All news: {n}"],
  pgOffline:["Полный текст открывается, когда сайт запущен через start-site.bat.","Толық мәтін сайт start-site.bat арқылы іске қосылғанда ашылады.","The full text opens when the site runs via start-site.bat."],
  pgNotFound:["Страница не найдена","Бет табылмады","Page not found"], pgEmpty:["На прежнем сайте эта страница была без текста.","Бұрынғы сайтта бұл бетте мәтін болмаған.","This page had no text on the old site."],
  pgBranches:["Страницы филиалов","Филиалдардың беттері","Branch pages"], pgBranchOf:["Страница филиала: {b}","Филиал беті: {b}","Branch page: {b}"],
  pgOldT:["Материалы архива","Архив материалдары","Archive materials"], pgFile:["Файл","Файл","File"], pgHasPhoto:["есть фото","фото бар","has photos"],
  crumbsL:["Где вы находитесь","Сіз қай жердесіз","You are here"],
  hcLabel:["Фотографии из фондов архива","Архив қорларынан фотосуреттер","Photos from the archive holdings"], hcPrev:["Предыдущее фото","Алдыңғы фото","Previous photo"], hcNext:["Следующее фото","Келесі фото","Next photo"],
  hcPause:["Остановить смену фото","Фото ауысуын тоқтату","Pause the slideshow"], hcPlay:["Включить смену фото","Фото ауысуын қосу","Play the slideshow"], hcSlide:["Фото {i} из {n}","{n} фотоның {i}-сі","Photo {i} of {n}"],
  wkToday:["Сегодня","Бүгін","Today"], wkOff:["выходной","демалыс","closed"],
  pgVideo:["Смотреть видео","Бейнені көру","Watch the video"],
  lbPrev:["Предыдущее фото","Алдыңғы фото","Previous photo"],
  lbNext:["Следующее фото","Келесі фото","Next photo"],
  lbClose:["Закрыть просмотр","Қарауды жабу","Close viewer"],
  lbCount:["{i} из {n}","{n} ішінен {i}","{i} of {n}"],
  artPhotosT:["Статьи с фотографиями","Фотосуреттері бар мақалалар","Articles with photos"],
  moreAlbumsT:["Другие альбомы прежнего сайта","Бұрынғы сайттың басқа альбомдары","Other albums from the old site"],
  oldPage:["Страница на прежнем сайте","Бұрынғы сайттағы бет","Page on the old site"],
  allArticlesT:["Все статьи и доклады","Барлық мақалалар мен баяндамалар","All articles and talks"],
  heroCap:["Из фотоальбома архива «Мой град Устькаменный»","Архивтің «Мой град Устькаменный» фотоальбомынан","From the archive photo album “Moi grad Ustkamenny”"],
  tHistoryLink:["История архива","Архив тарихы","History of the archive"],
  mosaicCap:["Снимки из альбомов архива «Мой град Устькаменный» и «История гиревого спорта в ВКО»","Архивтің «Мой град Устькаменный» және «История гиревого спорта в ВКО» альбомдарынан алынған суреттер","Photos from the archive albums “Moi grad Ustkamenny” and “History of kettlebell sport in EKR”"],
  mAltMap:["Старинная карта: крепость Усть-Каменогорская на Иртыше","Ескі карта: Ертіс жағасындағы Өскемен бекінісі","Old map: the Ust-Kamenogorsk fortress on the Irtysh"],
  mAltPier:["Люди на берегу Иртыша у пристани с пароходами","Ертіс жағасындағы айлақ маңындағы адамдар мен пароходтар","People on the bank of the Irtysh by a pier with steamers"],
  mAltYurt:["Семья у юрты","Киіз үй жанындағы отбасы","A family by a yurt"],
  mAltSport:["Гиревик в спортивном зале","Спорт залындағы гір көтеруші","A kettlebell lifter in a gym"],
  footSite:["Разделы","Бөлімдер","Sections"],
  footArchive:["Государственный архив ВКО","ШҚО мемлекеттік архиві","State Archive of EKR"],
  heroKick:["Управление цифровизации и архивов ВКО","ШҚО цифрландыру және архивтер басқармасы","EKR Department of Digitalization and Archives"],
  storyKicker:["С 1940 года","1940 жылдан бері","Since 1940"],
  storyT1:["Хранитель памяти","Шығыс Қазақстан","Keeper of the memory"],
  storyT2:["Восточного Казахстана","жадының сақтаушысы","of East Kazakhstan"],
  storyLead:["Больше тысячи фондов и 610 тысяч дел: документы власти и предприятий, личные архивы земляков, фотографии и кинохроника.","Мыңнан астам қор және 610 мың іс: билік пен кәсіпорындардың құжаттары, жерлестердің жеке мұрағаттары, фотосуреттер мен кинохроника.","Over a thousand fonds and 610,000 files: government and company records, personal papers, photographs and newsreels."],
  footVisit:["Информация для посетителей","Келушілерге ақпарат","Visitor information"],
  footWord:["Архив ВКО","ШҚО архиві","EKR Archive"],
  searchTry:["Например:","Мысалы:","Try:"],
  searchAsk:["Спросить помощника: «{q}»","Көмекшіден сұрау: «{q}»","Ask the assistant: “{q}”"],
  searchNone:["Ничего не найдено.","Ештеңе табылмады.","Nothing found."],
  searchNotIt:["Не то? Спросите помощника или позвоните:","Бұл емес пе? Көмекшіден сұраңыз немесе қоңырау шалыңыз:","Not it? Ask the assistant or call:"],
  sGisKey:["Ключ 2ГИС для карты","Карта үшін 2ГИС кілті","2GIS map key"],
  sGisKeyHint:["Пусто — встроенный демо-ключ. Свой ключ выдают в Менеджере Платформы 2ГИС.","Бос болса — кіріктірілген демо-кілт. Өз кілтіңізді 2ГИС Платформа менеджері береді.","Empty: the built-in demo key. Get your own in the 2GIS Platform Manager."],
  sKeywords:["Ключевые слова для поисковиков","Іздеу жүйелеріне арналған түйін сөздер","Search-engine keywords"],
  sKeywordsHint:["Через запятую, до 500 знаков. Попадают в метатег keywords всех страниц сайта, например: архив, Усть-Каменогорск, ВКО, архивные документы.","Үтір арқылы, 500 таңбаға дейін. Сайттың барлық беттерінің keywords метатегіне енеді, мысалы: архив, Өскемен, ШҚО, архив құжаттары.","Comma-separated, up to 500 characters. Added to the keywords meta tag of every page, e.g. archive, Ust-Kamenogorsk, East Kazakhstan, archival records."],
  mapRoutes:["Маршрут в 2ГИС:","2ГИС-те бағыт:","Route in 2GIS:"],
  gisCard:["Карточка в 2ГИС","2ГИС-тегі карточка","Open in 2GIS"],
  mapSchemeT:["Схема: главное здание и другие здания архива в Усть-Каменогорске","Сызба: архивтің Өскемендегі бас және басқа ғимараттары","Scheme: the main and other archive buildings in Oskemen"],
  navVisitors:["Посетителям","Келушілерге","Visitors"],
  navFonds:["Фонды","Қорлар","Holdings"],
  navRegion:["История края","Өлке тарихы","Local history"],
  navContactsShort:["Контакты","Байланыс","Contacts"],
  navSearch:["Поиск","Іздеу","Search"],
  visKicker:["Справки, поиск, читальный зал","Анықтамалар, іздеу, оқу залы","Certificates, research, reading room"],
  visLead:["Как получить справку, найти сведения о предках и поработать с документами самому.","Анықтаманы қалай алуға, ата-бабалар туралы мәлімет табуға және құжаттармен өзіңіз жұмыс істеуге болады.","How to get a certificate, trace your ancestors and work with documents yourself."],
  fondsKicker:["Что хранится","Не сақталады","What we keep"],
  fondsTitle:["Фонды и коллекции","Қорлар мен жинақтар","Holdings and collections"],
  fondsLead:["Документы от первых лет советской власти до наших дней: фонды организаций, личные фонды, базы данных и издания архива.","Кеңес өкіметінің алғашқы жылдарынан бүгінге дейінгі құжаттар: ұйымдардың қорлары, жеке қорлар, деректер базалары және архив басылымдары.","Records from the first years of Soviet power to today: organisational fonds, personal papers, databases and the archive's publications."],
  regionKicker:["По документам архива","Архив құжаттары бойынша","From the archive's records"],
  regionTitle:["История края","Өлке тарихы","Local history"],
  regionLead:["Очерки, выставки, фотоальбомы и статьи о Восточном Казахстане.","Шығыс Қазақстан туралы очерктер, көрмелер, фотоальбомдар мен мақалалар.","Essays, exhibitions, photo albums and articles about East Kazakhstan."],
  tCert:["Архивная справка","Архивтік анықтама","Archive certificate"],
  tGenea:["Поиск предков","Ата-баба іздеу","Family history"],
  tReading:["Читальный зал","Оқу залы","Reading room"],
  tBranches:["Здания и филиалы","Ғимараттар мен филиалдар","Buildings and branches"],
  tServices:["Услуги и приём","Қызметтер және қабылдау","Services"],
  tFaq:["Частые вопросы","Жиі қойылатын сұрақтар","FAQ"],
  tStore:["Что хранится","Не сақталады","What we keep"],
  tPersonal:["Личные фонды","Жеке қорлар","Personal papers"],
  tDb:["Базы данных","Деректер базалары","Databases"],
  tPubs:["Издания","Басылымдар","Publications"],
  tGloss:["Словарь","Сөздік","Glossary"],
  tEssays:["Очерки","Очерктер","Essays"],
  tExpo:["Выставки","Көрмелер","Exhibitions"],
  tPhoto:["Фотоальбомы","Фотоальбомдар","Photo albums"],
  tArticles:["Статьи и доклады","Мақалалар мен баяндамалар","Articles and talks"],
  tDistricts:["Районы области","Облыс аудандары","Districts"],
  tIntro:["Об архиве","Архив туралы","About us"],
  tHistory:["История","Тарих","History"],
  tTeam:["Руководство","Басшылық","Management"],
  tActivity:["Планы и отчёты","Жоспарлар мен есептер","Plans and reports"],
  tDocs:["Документы","Құжаттар","Documents"],
  tNews:["Новости","Жаңалықтар","News"],
  tAnn:["Объявления","Хабарландырулар","Announcements"],
  misKicker:["Об архиве","Архив туралы","About the archive"], misTitle:["Миссия и задачи","Миссия және міндеттер","Mission and tasks"],
  misNote:["Официальная формулировка миссии архиву ещё не передана. Ниже задачи так, как они названы в материалах архива; официальный текст можно добавить в админке.","Архивтің ресми миссия мәтіні әлі берілген жоқ. Төменде міндеттер архив материалдарында айтылғандай берілген; ресми мәтінді әкімшілік панелінде қосуға болады.","The official mission statement has not been provided by the archive yet. Below are the tasks as the archive’s own materials word them; the official text can be added in the admin panel."],
  misSrc:["Источник:","Дереккөз:","Source:"], misAuthor:["И. Ю. Носова, руководитель отдела информационных технологий госархива ВКО","И. Ю. Носова, ШҚО мемлекеттік архивінің ақпараттық технологиялар бөлімінің басшысы","I. Yu. Nosova, head of the information technology department of the EKR state archive"],
  igKicker:["Фото","Фото","Photos"], igTitle:["Фотогалерея учреждения","Мекеме фотогалереясы","Institution gallery"],
  igBuilding:["Главное здание архива","Архивтің бас ғимараты","The main building of the archive"], igReading:["Читальный зал","Оқу залы","Reading room"],
  slotInst:["Фотогалерея учреждения («Об архиве»)","Мекеме фотогалереясы («Архив туралы»)","Institution gallery (About)"],
  cMission:["Миссия и задачи (официальный текст)","Миссия және міндеттер (ресми мәтін)","Mission and tasks (official text)"],
  cMissionHint:["Пока поле пусто, на сайте показаны задачи из материалов архива. Если архив передал официальную формулировку, вставьте её сюда: абзацы разделяйте пустой строкой.","Өріс бос болса, сайтта архив материалдарындағы міндеттер көрсетіледі. Архив ресми мәтін берген болса, осында қойыңыз: абзацтарды бос жолмен бөліңіз.","While the field is empty, the site shows the tasks from the archive’s materials. If the archive has given an official statement, paste it here; separate paragraphs with a blank line."],
  trOnly:["Перевод на английский подготовлен автоматически и не вычитан носителем языка.","Қазақ тіліндегі аударма автоматты түрде дайындалған және тіл иесі оқып тексермеген.","This English version was machine-translated and has not been reviewed by a native speaker."],
  ruOnly:["","Бұл бөлімнің мазмұны әзірге тек орыс тілінде.","This section is in Russian for now."],
  filterPh:["Найти в списке…","Тізімнен іздеу…","Filter the list…"],
  found:["Найдено: {n}","Табылды: {n}","Found: {n}"],
  nothingFound:["Ничего не найдено. Попробуйте другое слово.","Ештеңе табылмады. Басқа сөзбен көріңіз.","Nothing found. Try another word."],
  readingRoom:["читальный зал","оқу залы","reading room"],
  readingRoomCap:["Читальный зал","Оқу залы","Reading room"],
  zone:["Обслуживает","Қызмет көрсетеді","Serves"],
  headPerson:["Руководитель","Басшы","Head"],
  cityBuildings:["Здания в Усть-Каменогорске","Өскемендегі ғимараттар","Buildings in Oskemen"],
  regionBranches:["Филиалы в районах","Аудандардағы филиалдар","Branches in the region"],
  statFonds:["фондов","қор","fonds"],
  statUnits:["единиц хранения","сақтау бірлігі","storage units"],
  statPersonal:["личных фондов","жеке қор","personal fonds"],
  statAv:["фото- и кинодокументов","фото және кино құжат","photo and film items"],
  statFounded:["год основания","құрылған жылы","year founded"],
  statBranches:["филиала в области","облыстағы филиал","branches in the region"],
  statsAsOf:["Сведения на {d}.","{d} жағдай бойынша.","As of {d}."],
  personalLead:["Документы известных земляков: учёных, писателей, педагогов, ветеранов. Начните вводить фамилию.","Белгілі жерлестердің құжаттары: ғалымдар, жазушылар, педагогтар, ардагерлер. Тегін тере бастаңыз.","Papers of notable local people: scholars, writers, teachers, veterans. Start typing a surname."],
  dbNote:["Базы доступны в читальном зале.","Базалар оқу залында қолжетімді.","The databases are available in the reading room."],
  essaysLead:["Документальные очерки по материалам архива.","Архив материалдары бойынша деректі очерктер.","Documentary essays based on the archive's records."],
  photoLead:["Темы фотоальбомов, собранных архивом.","Архив жинаған фотоальбомдардың тақырыптары.","Topics of the archive's photo albums."],
  articlesLead:["Публикации и доклады сотрудников архива. Введите фамилию автора или тему.","Архив қызметкерлерінің басылымдары мен баяндамалары. Автордың тегін немесе тақырыпты енгізіңіз.","Publications and talks by archive staff. Type an author or a topic."],
  districtsNow:["Города и районы сегодня","Қалалар мен аудандар бүгін","Towns and districts today"],
  districtsGone:["Упразднённые районы","Таратылған аудандар","Abolished districts"],
  histDetail:["Подробная хронология","Толық хронология","Detailed chronology"],
  branchHeads:["Руководители филиалов","Филиал басшылары","Branch heads"],
  structNote:["Адреса и телефоны филиалов во вкладке «Здания и филиалы» раздела «Посетителям».","Филиалдардың мекенжайлары мен телефондары «Келушілерге» бөліміндегі «Ғимараттар мен филиалдар» бетінде.","Branch addresses and phones are under Visitors → Buildings and branches."],
  pubsEd:["Издания архива","Мұрағат басылымдары","Archive publications"], vidPart:["Часть","Бөлім","Part"],
  planYear:["Год","Жыл","Year"], planL:["План работы","Жұмыс жоспары","Work plan"], reportL:["Отчёт","Есеп","Report"], planNone:["нет файла","файл жоқ","no file"],
  planCap:["Планы работы и отчёты архива по годам: файлы для скачивания","Мұрағаттың жылдар бойынша жұмыс жоспарлары мен есептері: жүктеп алуға арналған файлдар","Archive work plans and reports by year: files to download"],
  activityLead:["Файлы планов и отчётов переносятся с прежнего сайта.","Жоспарлар мен есептердің файлдары бұрынғы сайттан көшірілуде.","Plan and report files are being moved from the old site."],
  planY:["план работы","жұмыс жоспары","work plan"],
  reportY:["отчёт","есеп","report"],
  lawsTitle:["Законы и нормативные акты","Заңдар мен нормативтік актілер","Laws and regulations"],
  lawsNote:["Полные тексты законов и приказов в базе «Әділет»:","Заңдар мен бұйрықтардың толық мәтіндері «Әділет» базасында:","Full texts are in the Adilet database:"],
  antiTitle:["Противодействие коррупции","Сыбайлас жемқорлыққа қарсы іс-қимыл","Anti-corruption"],
  paidTitle:["Платные услуги","Ақылы қызметтер","Paid services"],
  paidNote:["Цены утверждены постановлением акимата ВКО о прейскуранте. Стоимость уточняйте в приёмной: {ph}.","Бағалар ШҚО әкімдігінің прейскурант туралы қаулысымен бекітілген. Құнын қабылдау бөлмесінен біліңіз: {ph}.","Prices are set by an EKR akimat resolution. Ask reception for details: {ph}."],
  olderNews:["Архив новостей","Жаңалықтар мұрағаты","Older news"],
  needTitle:["Что вам нужно?","Сізге не керек?","What do you need?"],
  need1:["Получить справку","Анықтама алу","Get a certificate"],
  need1x:["о стаже, зарплате, копию или выписку","өтіл, жалақы туралы, көшірме немесе үзінді","employment, salary, a copy or an extract"],
  need2:["Найти предков","Ата-бабаны іздеу","Trace ancestors"],
  need2x:["с чего начать и где искать","неден бастау және қайдан іздеу","where to start and where to look"],
  need3:["Что хранится","Не сақталады","What we keep"],
  need3x:["фонды, личные фонды, базы данных","қорлар, жеке қорлар, деректер базалары","fonds, personal papers, databases"],
  need4:["История края","Өлке тарихы","Local history"],
  need4x:["очерки, выставки, фотоальбомы","очерктер, көрмелер, фотоальбомдар","essays, exhibitions, photo albums"],
  searchPh:["Фамилия, район, тема…","Тегі, аудан, тақырып…","Surname, district, topic…"],
  searchBtn:["Найти","Іздеу","Search"],
  searchTitle:["Поиск по сайту","Сайттан іздеу","Search the site"],
  searchHint:["Введите слово: фамилию, название района или тему.","Сөз енгізіңіз: тегі, аудан атауы немесе тақырып.","Type a word: a surname, a district or a topic."],
  glossFull:["Полный словарь архивных терминов","Архив терминдерінің толық сөздігі","Full glossary of archive terms"],
  readCallT:["Перед визитом позвоните","Келер алдында қоңырау шалыңыз","Call before you come"],
  readCallX:["Сотрудники заранее подготовят нужные дела и подскажут, где вас примут.","Қызметкерлер қажетті істерді алдын ала дайындап, қай жерде қабылдайтынын айтады.","Staff will prepare the files in advance and tell you where to come."],
  readGlossX:["Фонд, опись, дело: что значат слова из справок и описей.","Қор, тізімдеме, іс: анықтамалар мен тізімдемелердегі сөздердің мағынасы.","Fonds, inventory, file: what the terms mean."],
  emailL:["Электронная почта","Электрондық пошта","Email"],
  persShort:["Справки о стаже","Өтіл туралы анықтамалар","Employment certificates"],
  readMore:["Читать полностью","Толық оқу","Read more"],
  sEmail:["Электронная почта","Электрондық пошта","Email"],
  sReading:["Часы читального зала","Оқу залының уақыты","Reading room hours"],
  sOtherHint:["Каждое здание с новой строки: адрес | назначение | телефоны через запятую","Әр ғимарат жаңа жолдан: мекенжай | мақсаты | телефондар үтір арқылы","One building per line: address | purpose | phones separated by commas"]
};
const LANGS = ['ru','kz','en'];
const LOC = {ru:'ru-RU', kz:'kk-KZ', en:'en-GB'};
const HTML_LANG = {ru:'ru', kz:'kk', en:'en'};
const EGOV = {ru:'https://egov.kz/cms/ru', kz:'https://egov.kz/cms/kk', en:'https://egov.kz/cms/en'};
let lang = 'ru';
const li = () => LANGS.indexOf(lang);
function t(k) { const v = T[k]; if (!v) return k; return v[li()] ?? v[0]; }
function L(x) { if (x == null) return ''; if (Array.isArray(x)) return x[li()] || x[0] || ''; if (typeof x === 'object') return x[lang] || x.ru || ''; return String(x); }

/* ================= content ================= */
const DEFAULT_SETTINGS = {
  address: {ru:'070004, г. Усть-Каменогорск, ул. Бейбітшілік (бывшая Головкова), 26/1', kz:'070004, Өскемен қ., Бейбітшілік көшесі (бұрынғы Головков көшесі), 26/1', en:'26/1 Beibitshilik St (formerly Golovkov St), Oskemen (Ust-Kamenogorsk) 070004'},
  mapQuery: 'Усть-Каменогорск, улица Бейбитшилик, 26/1',
  phones: ['+7 (7232) 25-59-76'],
  email: 'arhiv-ukg@yandex.kz',
  reading: '09:00–16:00',   // «Контакты.docx» от 10.11.2026: читальный зал пн–пт 9:00–16:00
  otherAddresses: [
    {a:'Потанина, 12/2', n:{ru:'Филиал по личному составу: справки о стаже и зарплате', kz:'Жеке құрам бойынша филиал: өтіл мен жалақы туралы анықтамалар', en:'Personnel records branch: employment and salary certificates'}, p:['+7 (7232) 76-65-60']},
    {a:'Крылова, 39', n:{ru:'Здание архива', kz:'Архив ғимараты', en:'Archive building'}, p:['+7 (7232) 25-13-47']}
  ],
  open: '08:00', close: '17:00', lunchFrom: '13:00', lunchTo: '14:00',   // «Контакты.docx» от 10.11.2026: пн–пт 8:00–17:00 (обед — со старого сайта, в документе не упомянут: подтвердить)
  days: [1,2,3,4,5],
  banner: {ru:'', kz:'', en:''},
  extraDays: '2026-05-27 Курбан айт',
  // «Контакты.docx» от 10.11.2026. Instagram: в документе разовая ссылка-приглашение, ниже адрес профиля по имени @arhiv_vko (подтвердить)
  socials: [{net:'instagram', url:'https://www.instagram.com/arhiv_vko/', name:'@arhiv_vko'}]
};
const DEMO_NEWS = ((window.SITE && window.SITE.news) || []).map(n => ({...n}));   // новости с прежнего сайта (content.js)
const WHY = [
  {icon:'d-scroll', t:['Хранит память края','Өлке жадын сақтайды','Keeps the region\'s memory'], x:['События, сёла и люди Восточного Казахстана.','Шығыс Қазақстанның оқиғалары, ауылдары мен адамдары.','Events, villages and people of East Kazakhstan.']},
  {icon:'d-stamp', t:['Подтверждает права людей','Адамдардың құқығын растайды','Confirms people\'s rights'], x:['Стаж, зарплата и награды по документам архива.','Архив құжаттары бойынша өтіл, жалақы және марапаттар.','Employment, salary and awards, from archive records.']},
  {icon:'d-lens', t:['Помогает исследователям','Зерттеушілерге көмектеседі','Helps researchers'], x:['Читальный зал для историков и краеведов.','Тарихшылар мен өлкетанушыларға арналған оқу залы.','A reading room for historians and local researchers.']},
  {icon:'d-frame', t:['Рассказывает об истории','Тарихты таныстырады','Shares history'], x:['Выставки и сборники документов, например о коллективизации в крае.','Көрмелер мен құжаттар жинақтары, мысалы өлкедегі ұжымдастыру туралы.','Exhibitions and document collections, for example on collectivisation in the region.']}
];
const CATS = [
  {icon:'d-gov', t:['Органы власти и управления','Билік және басқару органдары','Government bodies'], x:['Решения и протоколы исполкомов, акиматов, районных и сельских советов.','Атқару комитеттерінің, әкімдіктердің, аудандық және ауылдық кеңестердің шешімдері мен хаттамалары.','Decisions and minutes of executive committees, akimats, district and village councils.']},
  {icon:'d-factory', t:['Промышленность и сельское хозяйство','Өнеркәсіп және ауыл шаруашылығы','Industry and agriculture'], x:['Документы заводов, комбинатов, совхозов и колхозов области.','Облыстың зауыттары, комбинаттары, совхоздары мен колхоздарының құжаттары.','Records of the region\'s factories, plants, state farms and collective farms.']},
  {icon:'d-people', t:['Документы по личному составу','Жеке құрам бойынша құжаттар','Personnel records'], x:['Приказы о приёме и увольнении, сведения о зарплате работников закрытых организаций.','Таратылған ұйымдардың жұмысқа қабылдау және жұмыстан шығару туралы бұйрықтары, жалақы туралы мәліметтер.','Hiring and dismissal orders and pay records of organisations that have closed.']},
  {icon:'d-edu', t:['Образование, культура, медицина','Білім, мәдениет, медицина','Education, culture and health'], x:['Документы школ, училищ, техникумов, больниц и учреждений культуры.','Мектептердің, училищелердің, техникумдардың, ауруханалар мен мәдениет мекемелерінің құжаттары.','Records of schools, colleges, hospitals and cultural institutions.']},
  {icon:'d-camera', t:['Фото- и кинодокументы','Фото және кино құжаттар','Photos and film'], x:['Фотографии и съёмки городов, сёл и событий области.','Облыстың қалалары, ауылдары мен оқиғаларының фотосуреттері мен түсірілімдері.','Photographs and footage of the region\'s towns, villages and events.']},
  {icon:'d-letter', t:['Личные фонды','Жеке қорлар','Personal collections'], x:['Письма, рукописи и фотографии известных земляков.','Белгілі жерлестеріміздің хаттары, қолжазбалары мен фотосуреттері.','Letters, manuscripts and photographs of notable people from the region.']}
];
const TIMELINE = [
  {y:'1932', key:true, t:['Образована Восточно-Казахстанская область','Шығыс Қазақстан облысы құрылды','East Kazakhstan Region is formed'], x:['Центр области сначала был в Семипалатинске. Фонды Семипалатинского архива позже стали основой архивов Восточного Казахстана.','Облыс орталығы алғашында Семей болды. Кейін Семей архивінің қорлары Шығыс Қазақстан архивтерінің негізі болды.','The region was first centred in Semipalatinsk. Its archive later became the basis for East Kazakhstan\'s archives.']},
  {y:'1939', t:['Центр области в Усть-Каменогорске','Облыс орталығы Өскеменде','Oskemen becomes the regional centre'], x:['14 октября 1939 года центр области перенесён из Семипалатинска в Усть-Каменогорск.','1939 жылғы 14 қазанда облыс орталығы Семейден Өскеменге көшірілді.','On 14 October 1939 the regional centre moved from Semipalatinsk to Oskemen.']},
  {y:'1940', key:true, t:['Создан Государственный архив ВКО','ШҚО мемлекеттік архиві құрылды','The State Archive of EKR is founded'], x:['Через год после переноса центра области. Архив подчинён архивному отделу Управления НКВД по ВКО.','Облыс орталығы көшірілгеннен кейін бір жылдан соң. Архив ШҚО бойынша НКВД басқармасының архив бөліміне бағынды.','A year after the regional centre moved. Placed under the archival department of the regional NKVD Directorate.']},
  {y:'1946', t:['В системе МВД','ІІМ жүйесінде','Under the Interior Ministry'], x:['Архив подчинён МВД Казахской ССР.','Архив Қазақ КСР ІІМ-не бағынды.','Placed under the Kazakh SSR Interior Ministry.']},
  {y:'1960', t:['Архивное управление республики','Республиканың архив басқармасы','The republic\'s Archival Administration'], x:['Архивы переданы Архивному управлению при Совмине Казахской ССР.','Архивтер Қазақ КСР Министрлер Кеңесі жанындағы Архив басқармасына берілді.','Archives transferred to the Archival Administration of the Kazakh SSR.']},
  {y:'1991', key:true, t:['Новое здание','Жаңа ғимарат','A new building'], x:['13 ноября архиву передано здание бывшего партийного архива.','13 қарашада архивке бұрынғы партия архивінің ғимараты берілді.','On 13 November the archive receives the former party archive building.']},
  {y:'1998', t:['Закон об архивах','Архивтер туралы заң','The archives law'], x:['Принят закон «О Национальном архивном фонде и архивах».','«Ұлттық архив қоры және архивтер туралы» заң қабылданды.','The Law on the National Archival Fund and Archives is adopted.']},
  {y:'2009', key:true, t:['Самостоятельное учреждение','Дербес мекеме','An independent institution'], x:['Архив и филиалы стали самостоятельными учреждениями.','Архив пен филиалдар дербес мекеме болды.','The archive and its branches become independent institutions.']},
  {y:'2025', t:['85 лет архиву','Архивке 85 жыл','85 years'], x:['85 лет со дня основания.','Құрылғанына 85 жыл.','85 years since its founding.']},
  {y:'2026', key:true, t:['Новые филиалы','Жаңа филиалдар','New branches'], x:['Постановление акимата № 142: созданы девять районных филиалов, четыре действующих переименованы.','Әкімдіктің № 142 қаулысы: тоғыз аудандық филиал құрылды, төрт филиал қайта аталды.','Akimat resolution No. 142: nine district branches created, four existing ones renamed.']},
  {y:['Сегодня','Бүгін','Today'], t:['Архив и 13 филиалов','Архив және он үш филиал','The archive and 13 branches'], x:['Усть-Каменогорск, Риддер, Алтай, Зайсан и ещё девять районных филиалов.','Өскемен, Риддер, Алтай, Зайсан және тағы тоғыз аудандық филиал.','Oskemen, Ridder, Altai, Zaysan and nine more district branches.']}
];
const BRANCHES = [
  {t:['Усть-Каменогорский филиал по личному составу','Жеке құрам бойынша Өскемен филиалы','Oskemen personnel records branch'], x:['г. Усть-Каменогорск. Документы по личному составу закрытых организаций.','Өскемен қ. Таратылған ұйымдардың жеке құрамы бойынша құжаттар.','Oskemen. Personnel records of organisations that have closed.']},
  {t:['Зайсанский филиал','Зайсан филиалы','Zaysan branch'], x:['г. Зайсан','Зайсан қ.','Zaysan']},
  {t:['Риддерский филиал','Риддер филиалы','Ridder branch'], x:['г. Риддер','Риддер қ.','Ridder']},
  {t:['Филиал «Алтай»','«Алтай» филиалы','Altai branch'], x:['г. Алтай','Алтай қ.','Altai (town)']}
];
const REGION = [
  {icon:'d-mountain', t:['Алтай','Алтай','Altai'], x:['горы на востоке области','облыстың шығысындағы таулар','mountains in the east of the region']},
  {icon:'d-river', t:['Иртыш','Ертіс','Irtysh'], x:['главная река края','өлкенің басты өзені','the region\'s main river']},
  {icon:'d-lake', t:['Маркаколь и Зайсан','Марқакөл мен Зайсан','Markakol and Zaysan'], x:['озёра области','облыс көлдері','lakes of the region']},
  {icon:'d-cal', t:['1932','1932','1932'], x:['год образования области','облыс құрылған жыл','year the region was formed']},
  {icon:'d-gov', t:['1720','1720','1720'], x:['год основания Усть-Каменогорска','Өскемен негізделген жыл','year Oskemen was founded']}
];
const LINKS = [
  {href:() => EGOV[lang], t:() => 'eGov.kz', x:'l1x', icon:'d-egov'},
  {href:() => 'https://eotinish.kz', t:() => 'eOtinish.kz', x:'l2x', icon:'d-letter'},
  {href:() => 'https://www.gov.kz/memleket/entities/vko-uca', t:() => t('l3t'), x:'l3x', icon:'d-gov'}
];

const FAQS = [
  {q:['Где находится архив?','Архив қайда орналасқан?','Where is the archive?'], a:() => [`Главное здание: ${L(S().address)}. Карта и маршрут в разделе <a href="#contacts">«Контакты и карта»</a>.`, `Бас ғимарат: ${L(S().address)}. Карта мен бағыт <a href="#contacts">«Байланыс және карта»</a> бөлімінде.`, `Main building: ${L(S().address)}. Map and route in <a href="#contacts">Contacts and map</a>.`]},
  {q:['Когда работает архив?','Архив қашан жұмыс істейді?','When is the archive open?'], a:() => { const s = S(); return [`Понедельник – пятница, ${s.open}–${s.close}, обед ${s.lunchFrom}–${s.lunchTo}. Суббота, воскресенье и праздничные дни: выходной.`, `Дүйсенбі – жұма, ${s.open}–${s.close}, түскі үзіліс ${s.lunchFrom}–${s.lunchTo}. Сенбі, жексенбі және мереке күндері: демалыс.`, `Monday – Friday, ${s.open}–${s.close}, lunch ${s.lunchFrom}–${s.lunchTo}. Closed on Saturdays, Sundays and public holidays.`]; }},
  {q:['Как получить архивную справку?','Архивтік анықтаманы қалай алуға болады?','How do I get an archive certificate?'], a:() => [`Через портал <a href="${EGOV.ru}" target="_blank" rel="noopener">eGov.kz</a> или в любом ЦОН. Справки о стаже и зарплате готовит филиал по личному составу (ул. Потанина, 12/2). Подробно во вкладке <a href="#visitors/cert">«Архивная справка»</a>.`, `<a href="${EGOV.kz}" target="_blank" rel="noopener">eGov.kz</a> порталы арқылы немесе кез келген ХҚКО-да. Өтіл мен жалақы туралы анықтамаларды жеке құрам бойынша филиал (Потанин к., 12/2) дайындайды. Толығырақ <a href="#visitors/cert">«Архивтік анықтама»</a> бетінде.`, `Via the <a href="${EGOV.en}" target="_blank" rel="noopener">eGov.kz</a> portal or at any Public Service Center. Employment and salary certificates come from the personnel records branch (12/2 Potanin St). Details: <a href="#visitors/cert">Archive certificate</a>.`]},
  {q:['Как найти сведения о предках?','Ата-бабалар туралы мәліметті қалай табуға болады?','How do I trace my ancestors?'], a:() => ['Соберите всё, что известно о человеке, проверьте базы архива и закажите архивную справку на eGov.kz. Пошаговая инструкция во вкладке <a href="#visitors/genealogy">«Поиск предков»</a>.', 'Адам туралы белгілі мәліметті жинап, архив базаларын қарап, eGov.kz арқылы архивтік анықтама сұратыңыз. Қадамдық нұсқаулық <a href="#visitors/genealogy">«Ата-баба іздеу»</a> бетінде.', 'Collect what you know about the person, check the archive databases and order a certificate on eGov.kz. Step by step: <a href="#visitors/genealogy">Family history</a>.']},
  {q:['Что взять с собой в архив?','Архивке не алып бару керек?','What should I bring?'], a:() => ['Удостоверение личности. Если вопрос о родственнике, документ о родстве. Запишите, где и в какие годы работали или учились.', 'Жеке куәлік. Туысыңыз туралы болса, туыстықты растайтын құжат. Қай жерде және қай жылдары жұмыс істегеніңізді немесе оқығаныңызды жазып алыңыз.', 'Your ID card. For a relative, a document proving the relationship. Note where and in which years you worked or studied.']},
  {q:['Можно ли самому поработать с документами?','Құжаттармен өзім жұмыс істей аламын ба?','Can I work with documents myself?'], a:() => [`Да, в читальном зале: понедельник – пятница, ${S().reading || '10:00–17:00'}. Подробнее во вкладке <a href="#visitors/reading">«Читальный зал»</a>.`, `Иә, оқу залында: дүйсенбі – жұма, ${S().reading || '10:00–17:00'}. Толығырақ <a href="#visitors/reading">«Оқу залы»</a> бетінде.`, `Yes, in the reading room: Monday – Friday, ${S().reading || '10:00–17:00'}. See <a href="#visitors/reading">Reading room</a>.`]},
  {q:['Как подать обращение или жалобу?','Өтініш немесе шағымды қалай беруге болады?','How do I submit a request or complaint?'], a:() => ['Через сервис <a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish.kz</a>. На этом сайте обращения не принимаются.', '<a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish.kz</a> сервисі арқылы. Бұл сайт өтініш қабылдамайды.', 'Through <a href="https://eotinish.kz" target="_blank" rel="noopener">eOtinish.kz</a>. This website doesn\'t accept requests.']},
  {q:['Есть ли у архива филиалы?','Архивтің филиалдары бар ма?','Does the archive have branches?'], a:() => ['Да, 13: Усть-Каменогорский городской (по личному составу), Риддерский городской и районные — Алтай, Глубоковский, Зайсанский, Катон-Карагайский, Курчумский, Марқакөл, Самар, Тарбагатайский, Уланский, Үлкен-Нарын, Шемонаихинский. Адреса и телефоны — в разделе <a href="#contacts">«Филиалы и контакты»</a>.', 'Иә, он үшеу: жеке құрам бойынша Өскемен қалалық, Риддер қалалық және аудандық — Алтай, Глубокое, Зайсан, Катонқарағай, Күршім, Марқакөл, Самар, Тарбағатай, Ұлан, Үлкен Нарын, Шемонаиха. Мекенжайлар мен телефондар — <a href="#contacts">«Филиалдар және байланыс»</a> бөлімінде.', 'Yes, 13: Oskemen city (personnel records), Ridder city and district branches — Altai, Glubokoye, Zaysan, Katon-Karagay, Kurchum, Markakol, Samar, Tarbagatai, Ulan, Ulken-Naryn, Shemonaikha. Addresses and phones: <a href="#contacts">Branches and contacts</a>.']},
  {q:['Как оставить отзыв?','Пікірді қалай қалдыруға болады?','How do I leave feedback?'], a:() => ['Нажмите «Оставить отзыв». Можно оценить сайт и сделать запись в гостевой книге.', '«Пікір қалдыру» батырмасын басыңыз. Сайтты бағалап, қонақ кітабына жазба қалдыруға болады.', 'Press “Leave feedback”. You can rate the site and write in the guestbook.']}
];
const PUBS = [
  {t:'«Эвакуация в Восточно-Казахстанскую область в годы Великой Отечественной войны (1941–1945 гг.)»', x:['Сборник документов из фондов архива об эвакуации людей и предприятий в область.','Облысқа адамдар мен кәсіпорындарды эвакуациялау туралы архив қорларындағы құжаттар жинағы.','Archive documents on the evacuation of people and factories to the region.']},
  {t:['Биографический справочник руководителей Восточно-Казахстанской области','Шығыс Қазақстан облысы басшыларының өмірбаяндық анықтамалығы','Biographical directory of East Kazakhstan Region leaders'], x:['Биографии людей, руководивших областью.','Облысты басқарған адамдардың өмірбаяндары.','Biographies of the people who led the region.']},
  {t:['Сборники о коллективизации и о миграции казахов в Китай в 1920-е годы','Ұжымдастыру және 1920 жылдардағы қазақтардың Қытайға көшуі туралы жинақтар','Collections on collectivisation and the 1920s Kazakh migration to China'], x:['Документы о трудных страницах истории края.','Өлке тарихының ауыр беттері туралы құжаттар.','Records on difficult chapters of the region\'s history.']}
];
const GLOSS = [
  {t:['Фонд','Қор','Fonds'], x:['Все документы одной организации или одного человека, которые хранятся вместе.','Бір ұйымның немесе бір адамның бірге сақталатын барлық құжаттары.','All the records of one organisation or one person, kept together.']},
  {t:['Опись','Тізімдеме','Inventory'], x:['Список дел фонда с номерами и названиями. По нему ищут нужное дело.','Қордағы істердің нөмірлері мен атаулары бар тізімі. Керекті іс сол арқылы ізделеді.','A numbered list of the files in a fonds, used to find the right file.']},
  {t:['Дело (единица хранения)','Іс (сақтау бірлігі)','File (storage unit)'], x:['Папка с документами по одному вопросу, которую учитывают как одно целое.','Бір мәселе бойынша құжаттары бар, бір бүтін ретінде есепке алынатын папка.','A folder of documents on one matter, counted as a single unit.']},
  {t:['Личный состав','Жеке құрам','Personnel records'], x:['Документы о работниках: приказы о приёме и увольнении, личные карточки, расчётные ведомости.','Қызметкерлер туралы құжаттар: қабылдау және босату бұйрықтары, жеке карточкалар, есеп айырысу ведомостары.','Records about employees: hiring and dismissal orders, personal cards, payroll sheets.']},
  {t:['Архивная справка','Архивтік анықтама','Archive certificate'], x:['Официальный документ, который подтверждает факт по документам архива, например стаж или зарплату.','Архив құжаттары бойынша деректі, мысалы өтілді немесе жалақыны растайтын ресми құжат.','An official document confirming a fact from archive records, such as employment or salary.']},
  {t:['ЭЦП и ЦОН','ЭЦҚ және ХҚКО','Digital signature and PSC'], x:['ЭЦП: электронная подпись для входа на eGov.kz. ЦОН: Центр обслуживания населения.','ЭЦҚ: eGov.kz-ке кіруге арналған электрондық қолтаңба. ХҚКО: Халыққа қызмет көрсету орталығы.','A digital signature lets you sign in to eGov.kz. A PSC is a Public Service Center.']}
];
const LOGO_MEANING = [
  ['Надпись по кругу: «Шығыс Қазақстан облысының мемлекеттік архиві». В центре: стеллажи архивохранилища, свиток и перо с чернильницей.',
   'Шеңбер бойындағы жазу: «Шығыс Қазақстан облысының мемлекеттік архиві». Ортасында: архив қоймасының сөрелері, шиыршықталған қолжазба және сия сауыты бар қауырсын қалам.',
   'The inscription around the circle reads “Шығыс Қазақстан облысының мемлекеттік архиві”. In the centre: the shelves of an archive repository, a scroll and a quill with an inkwell.']
];

/* ================= photos =================
   Фото здания и заставка лежат в img/ и вшиваются при сборке. Фото читального зала, хранилища и «из жизни архива» сюда не вписаны:
   файлов у нас нет, а проверка несуществующих файлов давала по 404 в консоли на каждой загрузке. Новые фото грузят в админке, вкладка «Фото»;
   пока фото нет, на его месте остаётся рисунок. */
const PHOTOS = [
  {src:'img/hero-archive.jpg', slots:['hero'], alt:['Старая фотография: площадь с церковью и торговыми рядами, повозки и прохожие','Ескі фотосурет: шіркеуі мен сауда қатарлары бар алаң, арбалар мен жүргіншілер','Old photograph: a square with a church and market stalls, carts and passers-by'], cap:['Из фотоальбома архива «Мой град Устькаменный»','Архивтің «Мой град Устькаменный» фотоальбомынан','From the archive photo album “Moi grad Ustkamenny”']},
  {src:'img/building.jpg',     slots:['contacts'],      cap:['Здание Государственного архива ВКО','ШҚО мемлекеттік архивінің ғимараты','The State Archive building']},
];
const CORNERS = '<span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>';
const Photos = {
  loaded: [],
  probe(src) { return new Promise(res => { const im = new Image(); im.onload = () => res(im.naturalWidth > 0); im.onerror = () => res(false); im.src = src; }); },
  init() {
    this.loaded = PHOTOS.slice();   // файлы лежат в img/ рядом с сайтом; браузер возьмёт их сам, когда они понадобятся (loading=lazy)
    this.apply();
  },
  pick(slot) {
    const up = (Store.data.photos || []).filter(p => p.src);
    const mine = up.find(p => p.slot === slot) || (slot === 'about2' ? up.find(p => p.slot === 'about') : null);
    if (mine) return {src:mine.src, cap:mine.cap || {}, slots:[slot]};
    const PANO_FB = {'p-visitors':[], 'p-fonds':[], 'p-about':[], 'p-news':[], 'p-contacts':[], 'p-region':[]};   // шапки разделов — без фото, пока его не загрузят в панели
    if (PANO_FB[slot]) { const own = this.loaded.find(p => p.slots.includes(slot)); if (own) return own;
      for (const f of PANO_FB[slot]) { const q = this.pick(f); if (q) return q; } return null; }
    return this.loaded.find(p => p.slots.includes(slot))
      || (slot === 'about2' ? this.loaded.find(p => p.slots.includes('about')) : null)
      || (slot === 'about' ? this.loaded.find(p => p.slots.includes('about2')) : null);
  },
  apply() {
    $$('[data-photo-slot]').forEach(el => {
      const p = this.pick(el.dataset.photoSlot);
      if (!p) return;
      const img = el.querySelector('img'); const fb = el.querySelector('svg.fallback, .ph > svg');
      const cap = el.querySelector('.photo-cap') || el.querySelector('figcaption');
      if (img.getAttribute('src') !== p.src) { img.loading = 'lazy'; img.decoding = 'async'; img.src = p.src; }
      img.alt = L(p.alt || p.cap); img.hidden = false;
      if (fb) fb.style.display = 'none';
      if (cap) { cap.removeAttribute('data-i'); cap.textContent = L(p.cap) || ''; cap.hidden = !L(p.cap); }
      if (el.hasAttribute('data-photo-only')) el.hidden = false;
      if (el.dataset.photoSlot === 'hero') $('#hero').classList.add('has-photo');
      el.classList.add('has-img');
    });
    const all = (Store.data.photos || []).filter(p => p.src && p.slot !== 'branch').map(p => ({src:p.src, cap:p.cap || {}}));   // галерея — только то, что загрузили сотрудники; фото зданий филиалов — в их карточках
    $('#gallery-sec').hidden = all.length < 2;
    $('#gallery').innerHTML = all.map(p => `<figure class="album"><div class="ph"><img src="${esc(p.src)}" alt="${esc(L(p.cap))}" loading="lazy">${CORNERS}</div><figcaption>${esc(L(p.cap))}</figcaption></figure>`).join('');
  }
};


/* ================= карусель на главной =================
   Нейтральные снимки без людей в трёх темах: история края, природа, город и здание архива.
   Только чёткие и уместные: склады, промзоны, базы отдыха и мелкие фото сюда не ставим (проверка — tests/hero.py).
   Снимки людей с мероприятий и личные документы на главную не ставим — они в разделах сайта.
   При каждом заходе — случайные 10, темы по очереди, не с того же фото, что в прошлый раз.
   p — страница-источник (#p/ID); g — [альбом, фото] фотогалереи, подпись открывает альбом на этом фото.
   q — ширина исходника: фото не увеличиваем больше чем в 1,5 раза, иначе по краям размытый фон.
   Мелкие исходники сначала увеличиваем нейросетью: python tools/upscale.py --hero ИМЯ фото.jpg (там же q = ширина результата).
   Фото без искажений: у каждого отмечена область «главного» (b: x0,y0,x1,y1 в долях кадра), режимы кадра — в Hero.place.
   Файлы: img/hero/{f}-2400.jpg и -1200.jpg (длинная сторона до 2400/2000 px), w×h — размер большого файла. */
const HERO_POOL = [
  {f:'building', c:'city', w:2400, h:1800, sw:1200, q:2400, b:[0.1,0.05,0.8,0.97], p:1332,
    cap:['Здание Государственного архива Восточно-Казахстанской области, Усть-Каменогорск', 'Шығыс Қазақстан облысы мемлекеттік архивінің ғимараты, Өскемен', 'The State Archive of East Kazakhstan Region building, Oskemen'],
    alt:['Светлое здание архива с узкими вертикальными окнами и пожарной лестницей, у входа деревья', 'Тар тік терезелері мен өрт сатысы бар ақшыл архив ғимараты, кіреберісте ағаштар', 'A pale archive building with narrow vertical windows and a fire escape, trees by the entrance']},
  {f:'mine', c:'hist', w:2400, h:1714, sw:1200, q:3379, b:[0.08,0.24,0.97,0.8], p:42629,
    cap:['Обогатительная фабрика в Риддере. Из фондов Риддерского филиала', 'Риддердегі байыту фабрикасы. Риддер филиалының қорынан', 'Ore-dressing mill in Ridder. Ridder branch holdings'],
    alt:['Длинные деревянные корпуса фабрики на склоне горы, дымовая труба', 'Тау беткейіндегі фабриканың ұзын ағаш ғимараттары, мұржа', 'Long wooden mill buildings on a hillside with a chimney']},
  {f:'forest', c:'hist', w:2400, h:1452, sw:1200, q:2763, b:[0.06,0.26,0.99,0.72], p:32268,
    cap:['Казахская лесная школа, 1948–1954 гг. Из фондов Риддерского филиала', 'Қазақ орман мектебі, 1948–1954 жж. Риддер филиалының қорынан', 'Kazakh Forestry School, 1948–1954. Ridder branch holdings'],
    alt:['Деревянное здание школы среди сосен, всё в снегу', 'Қарлы қарағайлар арасындағы мектептің ағаш ғимараты', 'A wooden school building among snowy pines']},
  {f:'flood', c:'hist', w:2400, h:1559, sw:1200, q:2400, b:[0,0.08,1,0.7], g:[36,1792],
    cap:['Центр Усть-Каменогорска во время наводнения 10 марта 1929 г.', '1929 жылғы 10 наурыздағы су тасқыны кезіндегі Өскемен орталығы', 'Central Ust-Kamenogorsk during the flood of 10 March 1929'],
    alt:['Затопленные улицы старого города, вдали собор', 'Ескі қаланың су басқан көшелері, алыста собор', 'Flooded streets of the old town with a cathedral in the distance']},
  {f:'plan', c:'hist', w:2400, h:1725, sw:1200, q:2400, b:[0.03,0.03,0.97,0.97], g:[36,1794],
    cap:['Опорный план города Усть-Каменогорска', 'Өскемен қаласының тірек жоспары', 'Base plan of the city of Ust-Kamenogorsk'],
    alt:['Старый план города: кварталы между Иртышом и Ульбой', 'Қаланың ескі жоспары: Ертіс пен Үлбі арасындағы кварталдар', 'An old city plan: blocks between the Irtysh and Ulba rivers']},
  {f:'oldridder', c:'hist', w:2400, h:1392, sw:1200, q:2400, b:[0,0.15,1,0.75], p:32294,
    cap:['Старый Лениногорск (ныне Риддер). Из фондов Риддерского филиала', 'Ескі Лениногор (қазіргі Риддер). Риддер филиалының қорынан', 'Old Leninogorsk (now Ridder). Ridder branch holdings'],
    alt:['Каменные дома и заводская труба у подножия гор, старое фото', 'Тау етегіндегі тас үйлер мен зауыт мұржасы, ескі фото', 'Stone buildings and a factory chimney at the foot of the mountains, an old photo']},
  {f:'fortmap', c:'hist', w:1548, h:2000, sw:852, q:1548, b:[0.05,0.03,0.97,0.97], g:[36,1787],
    cap:['Схематическая карта Усть-Каменогорской крепости', 'Өскемен бекінісінің сызба картасы', 'Schematic map of the Ust-Kamenogorsk fortress'],
    alt:['Рисованная карта: крепость у слияния рек, роза ветров', 'Қолдан салынған карта: өзендер қосылысындағы бекініс, жел раушаны', 'A hand-drawn map: the fortress at a river confluence, with a compass rose']},
  {f:'rocks', c:'land', w:2400, h:1490, sw:1200, q:3937, b:[0.24,0.06,0.76,0.84], p:42368,
    cap:['Скалы Восточного Казахстана. С выставки фотоклуба «Кристалл»', 'Шығыс Қазақстан жартастары. «Кристалл» фотоклубының көрмесінен', 'Rocks of East Kazakhstan. From the Kristall photo club exhibition'],
    alt:['Охристые скалы на зелёном склоне, за ними горы со снегом', 'Жасыл беткейдегі сары жартастар, артында қарлы таулар', 'Ochre rocks on a green slope with snowy mountains behind']},
  {f:'mountains', c:'land', w:2400, h:1599, sw:1200, q:2400, b:[0.05,0.15,1,0.85], g:[40,2034],
    cap:['Горы и тайга Восточного Казахстана. Из фотогалереи архива', 'Шығыс Қазақстанның таулары мен тайгасы. Архив фотогалереясынан', 'Mountains and taiga of East Kazakhstan. From the archive photo gallery'],
    alt:['Ели на горном лугу, за ними горы со снегом и облаками', 'Таулы шалғындағы шыршалар, артында қарлы таулар мен бұлттар', 'Firs on a mountain meadow with snowy peaks and clouds behind']},
  {f:'meadow', c:'land', w:2400, h:1599, sw:1200, q:2400, b:[0,0.25,1,0.9], g:[40,2017],
    cap:['Цветущий горный луг. Природа Восточного Казахстана', 'Гүлденген таулы шалғын. Шығыс Қазақстан табиғаты', 'A mountain meadow in bloom. Nature of East Kazakhstan'],
    alt:['Розовые цветы и кусты на склоне, одинокая ель, вдали горы в дымке', 'Беткейдегі қызғылт гүлдер мен бұталар, жалғыз шырша, алыста тұманды таулар', 'Pink flowers and shrubs on a slope, a lone fir, hazy mountains beyond']},
  {f:'lakemeadow', c:'land', w:2400, h:1599, sw:1200, q:2400, b:[0,0.1,1,0.85], g:[40,2055],
    cap:['Горная речка среди лугов. Природа Восточного Казахстана', 'Шалғын арасындағы тау өзені. Шығыс Қазақстан табиғаты', 'A mountain stream among meadows. Nature of East Kazakhstan'],
    alt:['Ручей в высокой траве и цветах, на горизонте пологие горы', 'Биік шөп пен гүлдер арасындағы бұлақ, көкжиекте жайпақ таулар', 'A stream in tall grass and flowers, gentle mountains on the horizon']},
  {f:'rockpine', c:'land', w:2400, h:1599, sw:1200, q:2400, b:[0.15,0.05,1,0.85], g:[40,2026],
    cap:['Скала и сосна. Природа Восточного Казахстана', 'Жартас пен қарағай. Шығыс Қазақстан табиғаты', 'A rock and a pine. Nature of East Kazakhstan'],
    alt:['Выветренная скала с нишами, рядом молодая сосна, ясное небо', 'Үңгірлері бар мүжілген жартас, жанында жас қарағай, ашық аспан', 'A weathered rock with hollows beside a young pine under a clear sky']},
  {f:'daisies', c:'land', w:2400, h:1800, sw:1200, q:2400, b:[.05,.15,.95,.85], g:[40,2050],
    cap:['Ромашки на лугу. Природа Восточного Казахстана', 'Шалғындағы түймедақтар. Шығыс Қазақстан табиғаты', 'Daisies in a meadow. Nature of East Kazakhstan'],
    alt:['Белые ромашки среди зелёной травы', 'Жасыл шөп арасындағы ақ түймедақтар', 'White daisies among green grass']},
  {f:'brook', c:'land', w:2400, h:1476, sw:1200, q:2400, b:[0,0.15,1,0.9], g:[40,2028],
    cap:['Горный ручей среди камней. Природа Восточного Казахстана', 'Тастар арасындағы тау бұлағы. Шығыс Қазақстан табиғаты', 'A mountain brook among stones. Nature of East Kazakhstan'],
    alt:['Ручей бежит по камням, рядом зонтичные растения, вдали скалистые горы', 'Бұлақ тастардың үстімен ағып жатыр, жанында шатыргүлді өсімдіктер, алыста жартасты таулар', 'A brook running over stones beside umbellifers, rocky mountains beyond']},
  {f:'frost', c:'land', w:2400, h:1600, sw:1200, q:2400, b:[.1,.02,.9,.74], g:[40,2016],
    cap:['Заиндевелая ветка над ручьём. Природа Восточного Казахстана', 'Бұлақ үстіндегі қырау басқан бұтақ. Шығыс Қазақстан табиғаты', 'A frosted branch over a stream. Nature of East Kazakhstan'],
    alt:['Покрытая инеем ветка над сугробами и тёмной водой', 'Қар үйінділері мен қара су үстіндегі қырау басқан бұтақ', 'A frost-covered branch above snowdrifts and dark water']},
  {f:'wintertree', c:'land', w:2400, h:1599, sw:1200, q:2400, b:[0.15,0.1,0.75,0.9], g:[40,2021],
    cap:['Дерево на скале зимним вечером. Природа Восточного Казахстана', 'Қысқы кеште жартастағы ағаш. Шығыс Қазақстан табиғаты', 'A tree on a rock on a winter evening. Nature of East Kazakhstan'],
    alt:['Корявое дерево на камне в снегу, освещённое закатом, вдали горы', 'Күн батқанда жарықталған қардағы тас үстіндегі қисық ағаш, алыста таулар', 'A gnarled tree on a snowy rock lit by the sunset, mountains beyond']},
  {f:'buhrock', c:'land', w:2400, h:1800, sw:1200, q:2400, b:[0,0.15,1,0.9], g:[40,2044],
    cap:['Бухтарма: скалы и сосны. Фото Л. Рифель', 'Бұқтырма: жартастар мен қарағайлар. Суретті түсірген Л. Рифель', 'Bukhtarma: rocks and pines. Photo by L. Rifel'],
    alt:['Слоистая скала, поросшая соснами', 'Қарағай өскен қабатты жартас', 'A layered rock face overgrown with pines']},
  {f:'buhpine', c:'land', w:2400, h:1800, sw:1200, q:2400, b:[0.05,0.15,0.95,0.85], g:[40,2045],
    cap:['Бухтарма на закате. Фото Л. Рифель', 'Күн батардағы Бұқтырма. Суретті түсірген Л. Рифель', 'Bukhtarma at sunset. Photo by L. Rifel'],
    alt:['Ветки сосен над тихой водой, розовое вечернее небо', 'Тынық су үстіндегі қарағай бұтақтары, қызғылт кешкі аспан', 'Pine branches over still water under a pink evening sky']},
  {f:'stonelake', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0.05,0.15,0.95,0.95], g:[40,2054],
    cap:['Горное озеро среди камней. Природа Восточного Казахстана', 'Тастар арасындағы тау көлі. Шығыс Қазақстан табиғаты', 'A mountain lake among boulders. Nature of East Kazakhstan'],
    alt:['Валуны в прозрачной воде, ели и скалистые вершины', 'Мөлдір судағы тастар, шыршалар мен жартасты шыңдар', 'Boulders in clear water, firs and rocky peaks']},
  {f:'taigalake', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0,0.2,1,0.85], g:[40,2027],
    cap:['Таёжное озеро. Природа Восточного Казахстана', 'Тайга көлі. Шығыс Қазақстан табиғаты', 'A taiga lake. Nature of East Kazakhstan'],
    alt:['Ели отражаются в тёмной воде, по берегу жёлтая трава', 'Шыршалар қара суда шағылысады, жағада сары шөп', 'Firs reflected in dark water, yellow grass along the shore']},
  {f:'giant', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0.25,0.15,0.85,0.6], g:[40,2015],
    cap:['Скала «Задумчивый великан». Природа Восточного Казахстана', '«Ойлы алып» жартасы. Шығыс Қазақстан табиғаты', 'The “Pensive Giant” rock. Nature of East Kazakhstan'],
    alt:['Одинокая скала-останец над склоном с красной травой', 'Қызыл шөпті беткей үстіндегі жалғыз қалдық жартас', 'A lone rock pillar above a slope of red grass']},
  {f:'columbine', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0,0.1,0.85,0.75], g:[40,2020],
    cap:['Водосбор на горном лугу. Природа Восточного Казахстана', 'Таулы шалғындағы көк гүлдер. Шығыс Қазақстан табиғаты', 'Columbines in a mountain meadow. Nature of East Kazakhstan'],
    alt:['Крупные синие цветы на фоне травы и леса', 'Шөп пен орман аясындағы ірі көк гүлдер', 'Large blue flowers against grass and forest']},
  {f:'globeflower', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0.1,0.25,0.75,0.65], g:[40,2030],
    cap:['Купальница алтайская. Природа Восточного Казахстана', 'Алтай купальницасы (Trollius altaicus). Шығыс Қазақстан табиғаты', 'Altai globeflower. Nature of East Kazakhstan'],
    alt:['Оранжевые шаровидные цветы на тонких стеблях', 'Жіңішке сабақтағы қызғылт сары шар тәрізді гүлдер', 'Orange globe-shaped flowers on slender stems']},
  {f:'larch', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0.1,0.15,0.9,0.85], g:[40,2029],
    cap:['Лиственница над Риддером. Природа Восточного Казахстана', 'Риддер үстіндегі балқарағай. Шығыс Қазақстан табиғаты', 'A larch above Ridder. Nature of East Kazakhstan'],
    alt:['Старая лиственница на каменистой вершине над долиной', 'Аңғар үстіндегі тасты шыңдағы кәрі балқарағай', 'An old larch on a stony summit above a valley']},
  {f:'winterlarch', c:'land', w:1333, h:2000, sw:733, q:1333, b:[0,0.05,1,0.85], g:[40,2023],
    cap:['Зимний лиственничный лес. Природа Восточного Казахстана', 'Қысқы балқарағай орманы. Шығыс Қазақстан табиғаты', 'A larch forest in winter. Nature of East Kazakhstan'],
    alt:['Лиственницы и пни в снегу под синим небом', 'Көк аспан астындағы қардағы балқарағайлар мен түбірлер', 'Larches and stumps in snow under a blue sky']},
  {f:'strelka', c:'city', w:2400, h:1673, sw:1200, q:2400, b:[0.1,0.48,0.97,0.85], g:[37,1910],
    cap:['Усть-Каменогорск: высотки на Стрелке у Иртыша', 'Өскемен: Ертіс жағасындағы Стрелкадағы биік үйлер', 'Oskemen: high-rises at the Strelka on the Irtysh'],
    alt:['Многоэтажные дома на берегу реки под голубым небом с облаками', 'Бұлтты көк аспан астындағы өзен жағасындағы көпқабатты үйлер', 'Apartment towers on a riverbank under a blue sky with clouds']},
  {f:'panorama', c:'city', w:2400, h:1488, sw:1200, q:2400, b:[0,0.05,1,0.85], g:[37,1880],
    cap:['Улица К. Кайсенова (бывшая Урицкого), Усть-Каменогорск', 'Қ. Қайсенов көшесі (бұрынғы Урицкий), Өскемен', 'K. Kaisenov Street (formerly Uritsky), Oskemen'],
    alt:['Вид сверху на центр города: улица, деревья, дома, на горизонте горы', 'Қала орталығына жоғарыдан көрініс: көше, ағаштар, үйлер, көкжиекте таулар', 'A view from above of the city centre: a street, trees, buildings, mountains on the horizon']},
  {f:'baiterek', c:'city', w:2400, h:1591, sw:1200, q:2400, b:[0.22,0.2,0.8,0.92], g:[37,1881],
    cap:['Копия монумента «Байтерек» у Иртышского моста, Усть-Каменогорск', 'Ертіс көпірі жанындағы «Бәйтерек» монументінің көшірмесі, Өскемен', 'A replica of the Baiterek monument by the Irtysh bridge, Oskemen'],
    alt:['Белая башня с золотым шаром на площади с клумбами', 'Гүл алаңындағы алтын шарлы ақ мұнара', 'A white tower topped with a golden sphere on a square with flowerbeds']},
  {f:'fountain', c:'city', w:2400, h:1535, sw:1200, q:2400, b:[0.05,0.3,1,0.72], g:[37,1884],
    cap:['Фонтан на Ульбинском мосту ночью, Усть-Каменогорск', 'Түнгі Үлбі көпіріндегі субұрқақ, Өскемен', 'The fountain on the Ulba bridge at night, Oskemen'],
    alt:['Струи фонтана, подсвеченные синим, зелёным и фиолетовым, и фонари на мосту', 'Көк, жасыл және күлгін түспен жарықталған субұрқақ ағындары мен көпірдегі шамдар', 'Fountain jets lit blue, green and purple, with lamps along the bridge']}
];
const HERO_N = 10;
const HERO_PHOTOS = false;   // по итогам мониторинга: на главном экране нужен строгий официальный вид без фотографий; true возвращает карусель
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const Hero = {
  list: [], i: 0, n: 0, t: null, start: 0, left: 0, DUR: 7000, user: false, hover: false,
  get running() { return this.n > 1 && !this.user && !this.hover && !document.hidden; },
  /* случайные 10 из 18, темы чередуются, первое фото не то, что в прошлый раз */
  pick() {
    const cats = {};
    shuffle(HERO_POOL.slice()).forEach(s => (cats[s.c] = cats[s.c] || []).push(s));
    const keys = shuffle(Object.keys(cats)), out = [];
    while (out.length < HERO_N && keys.some(k => cats[k].length)) keys.forEach(k => { if (cats[k].length && out.length < HERO_N) out.push(cats[k].shift()); });
    let last = ''; try { last = localStorage.getItem('hcLast') || ''; } catch (e) {}
    const boot = window.HERO0 && HERO_POOL.find(s => s.f === window.HERO0);   // первое фото уже показано встроенным скриптом
    if (boot) { const j = out.indexOf(boot); if (j >= 0) out.splice(j, 1); else out.pop(); out.unshift(boot); }
    else if (out.length > 1 && out[0].f === last) out.push(out.shift());
    try { localStorage.setItem('hcLast', out[0].f); } catch (e) {}
    return out;
  },
  /* высота: весь экран под шапкой (на телефоне — над нижней панелью) */
  height() {
    const fig = $('#hc'); if (!fig) return;
    const top = fig.getBoundingClientRect().top + window.scrollY;
    const bb = $('.bottom-bar'), bbh = bb && getComputedStyle(bb).display !== 'none' ? bb.offsetHeight : 0;
    fig.style.setProperty('--hc-h', Math.max(320, Math.round(window.innerHeight - top - bbh)) + 'px');
  },
  /* сколько снизу занимают заголовок и подпись: главное на фото поднимаем над ними */
  reserve() {
    const box = $('#hc-slides').getBoundingClientRect(); let r = 0;
    ['.hc-over .hero-title', '#hc-cap'].forEach(q => { const e = $(q); if (e && e.offsetHeight > 4) r = Math.max(r, box.bottom - e.getBoundingClientRect().top); });
    this.R = Math.min(Math.max(0, r), box.height * .55);
  },
  layout(force) {
    const w = innerWidth, h = innerHeight;
    /* на телефоне при прокрутке прячется адресная строка — из-за этого кадр не перестраиваем */
    if (!force && w === this.vw && Math.abs(h - this.vh) < 140) return;
    this.vw = w; this.vh = h;
    this.height(); this.reserve();
    $$('#hc-slides .hs').forEach(el => this.place(el));
    this.pan();
  },
  /* кадр без искажений: фото всегда в своих пропорциях.
     cover — заполняет экран, если «главное» (s.b) видно целиком;
     pan — экран уже фото (телефон): фото на весь экран и медленно проезжает от левого края главного до правого;
     fit — иначе главное целиком на размытой копии того же фото */
  place(el) {
    const s = this.list[+el.dataset.k], box = $('#hc-slides'), W = box.clientWidth, H = box.clientHeight, R = this.R || 0;
    if (!s || !W || !H) return;
    const [x0, y0, x1, y1] = s.b, img = el.querySelector('.hs-img'), bw = (x1 - x0) * s.w, bh = (y1 - y0) * s.h;
    const clamp = (v, a, b) => Math.min(Math.max(v, Math.min(a, b)), Math.max(a, b));
    let sc = Math.max(W / s.w, H / s.h), mode = 'cover';
    const over = bw * sc / W;
    if (bh * sc > H * 1.04) mode = 'fit';
    else if (over > 1.04) mode = !this.still && over <= 3 ? 'pan' : 'fit';
    if (mode === 'fit') sc = Math.max(Math.min(W / bw, H / bh) * .96, Math.min(W / s.w, H / s.h));
    const cap = (s.q || s.w) * 1.5 / s.w;                 // не растягивать исходник больше чем в 1,5 раза
    if (sc > cap) { sc = cap; mode = 'fit'; }
    const dw = s.w * sc, dh = s.h * sc, sx0 = x0 * dw, sx1 = x1 * dw, sy0 = y0 * dh, sy1 = y1 * dh;
    let left = mode === 'pan' ? -sx0 : dw >= W ? W / 2 - (sx0 + sx1) / 2 : (W - dw) / 2;
    left = clamp(left, W - dw, 0);
    const dx = mode === 'pan' ? clamp(W - sx1, W - dw, 0) - left : 0;
    let top = dh >= H ? H / 2 - (sy0 + sy1) / 2 : (H - dh) / 2;
    const need = top + sy1 - (H - R);                       // низ главного под заголовком — поднимаем,
    if (need > 0) top -= Math.max(0, Math.min(need, top + sy0));   // но верх главного не обрезаем
    top = clamp(top, H - dh, 0);
    Object.assign(img.style, {width: dw + 'px', height: dh + 'px', left: left + 'px', top: top + 'px'});
    img.sizes = Math.ceil(dw) + 'px';
    el.dataset.dx = Math.round(dx);
    el.classList.toggle('pan', Math.abs(dx) > 2);
    el.classList.toggle('fit', dw < W - 1 || dh < H - 1);
    if (el.classList.contains('fit')) { const bg = el.querySelector('.hs-bg'); if (!bg.getAttribute('src')) bg.src = `img/hero/${s.f}-1200.jpg`; }
  },
  /* проезд текущего фото; у уходящего фото проезд доигрывает, чтобы оно не прыгало во время смены */
  pan() {
    const el = $(`#hc-slides .hs[data-k="${this.i}"]`); if (!el || !this.n) return;
    const img = el.querySelector('.hs-img');
    if (img._a) { img._a.cancel(); img._a = null; }
    if (!el.classList.contains('pan') || !img.animate) return;
    img._a = img.animate([{transform:'translateX(0)'}, {transform:`translateX(${el.dataset.dx}px)`}], {duration:this.DUR + 1200, easing:'ease-in-out', fill:'both'});
    if (!this.running) img._a.pause();
  },
  init() {
    if (!HERO_PHOTOS) return;
    const box = $('#hc-slides'); if (!box) return;
    this.still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.user = this.still;   // «меньше движения»: сами не листаем и не двигаем фото
    this.list = this.pick();
    $$('#hc-slides > :not(.hs-boot)').forEach(x => x.remove());   // временный кадр (.hs-boot) остаётся, пока не загрузится первое фото
    box.insertAdjacentHTML('beforeend', this.list.map((s, k) => `<div class="hs" data-k="${k}" role="group" aria-roledescription="slide"><img class="hs-bg" alt="" aria-hidden="true" decoding="async"><img class="hs-img" alt="" decoding="async"></div>`).join(''));
    this.height(); this.reserve(); this.vw = innerWidth; this.vh = innerHeight;
    $$('#hc-slides .hs').forEach(el => {
      const img = el.querySelector('.hs-img');
      img.addEventListener('error', () => this.drop(el));
      if (+el.dataset.k === 0) this.place(el);   // остальные кадры расставляются, когда до них дойдёт показ (go) или изменится размер окна
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.layout(true));
    const first = box.querySelector('.hs-img');
    first.addEventListener('load', () => { this.n = this.list.length; $('#hero').classList.add('has-photo'); $('#hc-ctrl').hidden = false; this.go(0, true); this.unboot(); }, {once:true});
    this.load(0, true);
    let rz = 0;
    addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => this.layout()); });
    const fig = $('#hc');
    fig.addEventListener('mouseenter', () => { this.hover = true; this.tick(); });
    fig.addEventListener('mouseleave', () => { this.hover = false; this.tick(); });
    fig.addEventListener('focusin', () => { this.hover = true; this.tick(); });
    fig.addEventListener('focusout', e => { if (!fig.contains(e.relatedTarget)) { this.hover = false; this.tick(); } });
    document.addEventListener('visibilitychange', () => this.tick());
    let x0 = null;
    box.addEventListener('pointerdown', e => { x0 = e.clientX; });
    box.addEventListener('pointerup', e => { if (x0 === null) return; const d = e.clientX - x0; x0 = null; if (Math.abs(d) > 40) this.go(this.i + (d < 0 ? 1 : -1)); });
    box.addEventListener('pointercancel', () => { x0 = null; });
  },
  load(k, hi) {
    const el = $(`#hc-slides .hs[data-k="${(k + this.list.length) % this.list.length}"]`); if (!el || el.dataset.ld) return;
    const s = this.list[+el.dataset.k], img = el.querySelector('.hs-img');
    el.dataset.ld = '1'; if (hi) img.fetchPriority = 'high';
    const bi = +el.dataset.k === 0 && $('#hc-slides .hs-boot img');   // первое фото уже качает временный кадр — берём тот же файл, без второй загрузки
    if (bi && bi.currentSrc && bi.currentSrc.includes('/img/hero/' + s.f + '-')) { img.src = bi.currentSrc; return; }
    img.srcset = `img/hero/${s.f}-1200.jpg ${s.sw}w, img/hero/${s.f}-2400.jpg ${s.w}w`;
    img.src = `img/hero/${s.f}-2400.jpg`;
  },
  /* следующее фото заготавливаем после загрузки страницы и паузы в 2,5 с: на слабой сети оно мешало бы главному кадру */
  preload(k) {
    const run = () => this.load(k), idle = () => setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(run, {timeout:3000}) : run()), 2500);
    if (document.readyState === 'complete') idle(); else addEventListener('load', idle, {once:true});
  },
  /* временный первый кадр убираем после того, как настоящий проявился (переход 1,2 с) */
  unboot() { const b = $('#hc-slides .hs-boot'); if (b) setTimeout(() => b.remove(), 1400); },
  /* фото не загрузилось — убираем его из показа; если не загрузилось ни одно — показываем вшитое в страницу */
  drop(el) {
    const k = +el.dataset.k, wasFirst = !this.n;
    el.remove(); this.list.splice(k, 1);
    $$('#hc-slides .hs').forEach((x, j) => { x.dataset.k = j; });
    if (!this.list.length) return this.fallback();
    if (wasFirst) { const f = $('#hc-slides .hs-img'); f.addEventListener('load', () => { this.n = this.list.length; $('#hero').classList.add('has-photo'); $('#hc-ctrl').hidden = false; this.go(0, true); this.unboot(); }, {once:true}); this.load(0, true); }
    else { this.n = this.list.length; if (this.i >= this.n) this.i = 0; this.texts(); }
  },
  texts() {
    const s = this.list[this.i]; if (!s) return;
    $$('#hc-slides .hs').forEach((el, j) => { const on = j === this.i; el.classList.toggle('on', on); el.setAttribute('aria-hidden', on ? 'false' : 'true'); el.setAttribute('aria-label', fmt(t('hcSlide'), {i:j + 1, n:this.list.length})); el.querySelector('.hs-img').alt = on ? L(this.list[j].alt) : ''; });
    $('#hc-cap').innerHTML = s.g ? `<button type="button" class="hc-link" data-act="hc-album">${esc(L(s.cap))}</button>` : `<a href="#p/${s.p}">${esc(L(s.cap))}</a>`;
    $('#hc-count').textContent = String(this.i + 1).padStart(2, '0') + ' / ' + String(this.list.length).padStart(2, '0');
    const pb = $('#hc-pause'); pb.classList.toggle('paused', this.user); pb.setAttribute('aria-pressed', String(this.user)); pb.setAttribute('aria-label', t(this.user ? 'hcPlay' : 'hcPause'));
  },
  go(k, auto) {
    if (!this.n) return;
    this.i = (k + this.n) % this.n;
    this.load(this.i); this.preload(this.i + 1);
    const el = $(`#hc-slides .hs[data-k="${this.i}"]`); if (el) this.place(el);
    this.texts(); this.pan();
    if (!auto) $('#hc-live').textContent = fmt(t('hcSlide'), {i:this.i + 1, n:this.n}) + '. ' + L(this.list[this.i].cap);
    const bar = $('#hc-bar'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = `hcBar ${this.DUR}ms linear forwards`;
    this.start = 0; this.left = this.DUR; this.tick();
  },
  tick() {
    const now = performance.now();
    if (this.start) { this.left = Math.max(600, this.left - (now - this.start)); this.start = 0; }
    clearTimeout(this.t); this.t = null;
    const bar = $('#hc-bar');
    const el = $(`#hc-slides .hs[data-k="${this.i}"]`), a = el && el.querySelector('.hs-img')._a;
    if (this.running) { this.start = now; this.t = setTimeout(() => this.go(this.i + 1, true), this.left); if (bar) bar.style.animationPlayState = 'running'; if (a && a.playState === 'paused') a.play(); }
    else { if (bar) bar.style.animationPlayState = 'paused'; if (a && a.playState === 'running') a.pause(); }
  },
  toggle() { this.user = !this.user; this.texts(); this.tick(); },
  /* подпись фото из фотогалереи открывает альбом на этом снимке */
  album() {
    const s = this.list[this.i], a = s && s.g && (SITE.galleryAlbums || []).find(x => x.id === s.g[0]); if (!a) return;
    this.user = true; this.texts(); this.tick();
    LB.open(a.ph, L(a.t), '', Math.max(0, a.ph.findIndex(x => x.s === 'old/ph/' + s.g[1])));
  },
  refresh() { if (this.n) { this.texts(); this.layout(true); } },
  fallback() {
    const p = PHOTOS.find(x => x.slots.includes('hero'));
    $('#hc-slides').innerHTML = `<div class="hs on fit-off"><img class="hs-one" src="img/hero-archive.jpg" alt="${esc(L(p.alt))}"></div>`;
    $('#hc-cap').textContent = L(p.cap); $('#hc-ctrl').hidden = true; $('#hero').classList.add('has-photo'); this.n = 0;
  }
};

/* ================= state & prefs ================= */
function detectLang() {
  const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map(x => String(x).toLowerCase());
  for (const l of list) { if (l.startsWith('kk')) return 'kz'; if (l.startsWith('ru')) return 'ru'; if (l.startsWith('en')) return 'en'; }
  return 'kz';
}
const prefs = Object.assign({fs:0, scheme:'', spacing:false, panel:false, autoSpeak:false}, LS.get('prefs', {}));
if (!LANGS.includes(prefs.lang)) prefs.lang = detectLang();
lang = prefs.lang;
const VIEWS = ['home','visitors','fonds','region','about','news','contacts','admin','page'];
const ALIAS = {history:'about/history', faq:'visitors/faq', gloss:'fonds/gloss', branches:'visitors/branches'};
let current = 'home';
const UI = { dtab:'gb', rating:{d:0} };

/* ================= store ================= */
const Store = {
  mode: 'local', db: null, user: null, uid: null,
  ready: false, failed: false,
  data: { entries:[], reviews:[], mod:{}, news:[], settings:{...DEFAULT_SETTINGS}, questions:[], photos:[] },
  apiInfo: null,
  async api(path, opts) {
    opts = opts || {};
    const h = {'Content-Type':'application/json'}; const tok = SS.get('token'); if (tok) h.Authorization = 'Bearer ' + tok;
    const r = await fetch(path, {method:opts.method || 'GET', headers:h, body:opts.body ? JSON.stringify(opts.body) : undefined});
    if (r.status === 401) { SS.del('token'); Admin.ok = false; }
    if (!r.ok) throw new Error('api ' + r.status);
    return r.status === 204 ? null : r.json();
  },
  async apiLoad() {
    const admin = !!SS.get('token');
    const d = admin ? await this.api('/api/admin/state').catch(() => this.api('/api/public')) : await this.api('/api/public');
    this.last = d;   // tz.js берёт материалы из этого же ответа, без второго запроса (ТЗ 7.2)
    Object.assign(this.data, {entries:(d.entries || []).map(e => ({...e, kind:'gb'})), reviews:(d.reviews || []).map(r => ({...r, kind:'review'})), mod:d.mod || {}, news:d.news && d.news.length ? d.news : [], settings:mergeSettings(d.settings || {}), questions:d.questions || [], photos:d.photos || [], brEdits:d.brEdits || {}});
    this.ready = true; this.failed = false; this.emit();
  },
  myQ: null, qChain: Promise.resolve(), qSub: null,
  listeners: [],
  on(f) { this.listeners.push(f); },
  emit() { this.listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } }); },
  async init() {
    const c = window.claude;
    if (c && typeof c.use === 'function') {
      try {
        const [db, user] = await Promise.all([c.use('db').catch(() => null), c.use('user').catch(() => null)]);
        this.user = user;
        if (db) {
          this.db = db; this.mode = 'db';
          try { this.uid = user ? await user.id() : null; } catch (e) { this.uid = null; }
          this.subscribe();
          return;
        }
      } catch (e) {}
    }
    if (/^https?:$/.test(location.protocol)) {
      try {
        const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 2500);
        const r = await fetch('/api/health', {signal:ctl.signal}); clearTimeout(tm);
        if (r.ok) { this.apiInfo = await r.json(); this.mode = 'api'; if (this.apiInfo.ai) CONFIG.aiEndpoint = '/api/assistant'; await this.apiLoad(); Chat.renderNote(); return; }
      } catch (e) {}
    }
    this.loadLocal();
  },
  subscribe() {
    const need = new Set(['gb','rv','mod','news','set']);
    const timer = setTimeout(() => { if (!this.ready) { this.failed = true; this.emit(); } }, 10000);
    const got = k => { need.delete(k); if (!need.size && !this.ready) { this.ready = true; this.failed = false; clearTimeout(timer); } this.emit(); };
    const err = k => e => { console.warn('db', k, e && e.code); got(k); };
    const db = this.db;
    db.collection('guestbook').onSnapshot(s => {
      const all = [];
      s.docs.forEach(d => { const b = d.data() || {}; (Array.isArray(b.entries) ? b.entries : []).forEach(en => { if (en && en.id) all.push({...en, owner:d.id, kind:'gb'}); }); });
      this.data.entries = all; got('gb');
    }, err('gb'));
    db.collection('reviews').onSnapshot(s => {
      this.data.reviews = s.docs.map(d => { const b = d.data() || {}; return {...b, owner:d.id, id:safeId('r_' + d.id + '_' + (b.ts || 0)), kind:'review'}; }).filter(r => r.stars >= 1 && r.stars <= 5);
      got('rv');
    }, err('rv'));
    db.collection('mod').onSnapshot(s => { const m = {}; s.docs.forEach(d => { m[d.id] = d.data(); }); this.data.mod = m; got('mod'); }, err('mod'));
    db.collection('news').onSnapshot(s => { const list = s.docs.map(d => ({...d.data(), id:d.id})); this.data.news = list.length ? list : DEMO_NEWS.map(n => ({...n})); got('news'); }, err('news'));   // пустая база: новости прежнего сайта
    db.doc('content/settings').onSnapshot(d => { this.data.settings = mergeSettings(d.exists ? d.data() : {}); got('set'); }, err('set'));
    db.collection('photos').onSnapshot(s => { this.data.photos = s.docs.map(d => ({...d.data(), id:d.id})); this.emit(); }, e => console.warn('photos', e && e.code));
  },
  subscribeQuestions() {
    if (this.mode !== 'db' || this.qSub) return;
    this.qSub = this.db.collection('questions').onSnapshot(s => {
      const all = []; s.docs.forEach(d => { const b = d.data() || {}; (b.items || []).forEach(i => all.push(i)); });
      this.data.questions = all; this.emit();
    }, e => console.warn('questions', e && e.code));
  },
  loadLocal() {
    this.mode = 'local';
    const d = this.data;
    d.entries = LS.get('gb', []).map(e => ({...e, kind:'gb', owner:'local'}));
    d.reviews = LS.get('rv', []).map(r => ({...r, kind:'review', owner:'local'}));
    d.mod = LS.get('mod', {});
    d.news = LS.get('news', null) || DEMO_NEWS;
    d.settings = mergeSettings(LS.get('settings', {}));
    d.questions = LS.get('qs', []);
    d.photos = LS.get('photos', []);
    this.ready = true; this.emit();
  },
  async addEntry(e) {
    e.ts = Date.now();
    if (this.mode === 'api') { try { await this.api('/api/guestbook', {method:'POST', body:e}); return 'api'; } catch (err) { console.warn(err); } }
    if (this.mode === 'db' && this.uid) {
      e.id = safeId('g_' + this.uid + '_' + e.ts);
      const mine = this.data.entries.filter(x => x.owner === safeId(this.uid)).map(({owner, kind, ...r}) => r);
      try { await this.db.doc('guestbook/' + safeId(this.uid)).set({entries:[...mine, e].slice(-10)}); return 'db'; }
      catch (err) { console.warn(err); }
    }
    e.id = safeId('g_local_' + e.ts);
    const arr = LS.get('gb', []); arr.push(e); LS.set('gb', arr.slice(-300));
    if (this.mode === 'local') this.loadLocal();
    return this.mode === 'local' ? 'local' : 'fallback';
  },
  async addReview(r) {
    r.ts = Date.now();
    if (this.mode === 'api') { try { await this.api('/api/reviews', {method:'POST', body:r}); await this.apiLoad(); return 'api'; } catch (err) { console.warn(err); } }
    if (this.mode === 'db' && this.uid) {
      try { await this.db.doc('reviews/' + safeId(this.uid)).set(r); return 'db'; }
      catch (err) { console.warn(err); }
    }
    r.id = safeId('r_local_' + r.ts);
    const arr = LS.get('rv', []); arr.push(r); LS.set('rv', arr.slice(-500));
    if (this.mode === 'local') this.loadLocal();
    return this.mode === 'local' ? 'local' : 'fallback';
  },
  logQuestion(q) {
    const item = {q:String(q).slice(0, 300), ts:Date.now(), lang};
    if (this.mode === 'api') { this.api('/api/questions', {method:'POST', body:item}).catch(() => {}); return; }
    if (this.mode === 'db' && this.uid) {
      this.qChain = this.qChain.then(async () => {
        const ref = this.db.doc('questions/' + safeId(this.uid));
        if (!this.myQ) { try { const s = await ref.get(); this.myQ = (s.exists && s.data().items) || []; } catch (e) { this.myQ = []; } }
        this.myQ = [...this.myQ, item].slice(-20);
        await ref.set({items:this.myQ});
      }).catch(e => console.warn('q', e && e.code));
      return;
    }
    const arr = LS.get('qs', []); arr.push(item); LS.set('qs', arr.slice(-200));
    if (this.mode === 'local') this.data.questions = arr;
  },
  async setMod(id, patch) {
    const next = {...(this.data.mod[id] || {}), ...patch, at:Date.now()};
    if (this.mode === 'api') { await this.api('/api/admin/mod', {method:'POST', body:{id, ...next}}); return this.apiLoad(); }
    if (this.mode === 'db') { await this.db.doc('mod/' + safeId(id)).set(next); return; }
    const m = LS.get('mod', {}); m[id] = next; LS.set('mod', m); this.loadLocal();
  },
  async delItem(item) {
    if (this.mode === 'api') { await this.api('/api/admin/item', {method:'DELETE', body:{kind:item.kind, id:item.id}}); return this.apiLoad(); }
    if (this.mode === 'db') {
      if (item.kind === 'gb') {
        const rest = this.data.entries.filter(x => x.owner === item.owner && x.id !== item.id).map(({owner, kind, ...r}) => r);
        await this.db.doc('guestbook/' + safeId(item.owner)).set({entries:rest});
      } else {
        await this.db.doc('reviews/' + safeId(item.owner)).delete();
      }
      try { await this.db.doc('mod/' + safeId(item.id)).delete(); } catch (e) {}
      return;
    }
    if (item.kind === 'gb') LS.set('gb', LS.get('gb', []).filter(x => x.id !== item.id));
    else LS.set('rv', LS.get('rv', []).filter(x => x.id !== item.id));
    const m = LS.get('mod', {}); delete m[item.id]; LS.set('mod', m);
    this.loadLocal();
  },
  async saveNews(n) {
    if (this.mode === 'api') { await this.api('/api/admin/news', {method:'PUT', body:n}); return this.apiLoad(); }
    if (this.mode === 'db') { const {id, ...body} = n; await this.db.doc('news/' + safeId(id)).set(body); return; }
    const list = (LS.get('news', null) || DEMO_NEWS).filter(x => x.id !== n.id); list.push(n); LS.set('news', list); this.loadLocal();
  },
  async delNews(id) {
    if (this.mode === 'api') { await this.api('/api/admin/news', {method:'DELETE', body:{id}}); return this.apiLoad(); }
    if (this.mode === 'db') { await this.db.doc('news/' + safeId(id)).delete(); return; }
    LS.set('news', (LS.get('news', null) || DEMO_NEWS).filter(x => x.id !== id)); this.loadLocal();
  },
  async saveSettings(s) {
    if (this.mode === 'api') { await this.api('/api/admin/settings', {method:'PUT', body:s}); return this.apiLoad(); }
    if (this.mode === 'db') { await this.db.doc('content/settings').set(s); return; }
    LS.set('settings', s); this.loadLocal();
  },
  async savePhoto(p) {
    if (this.mode === 'api') { await this.api('/api/admin/photos', {method:'POST', body:p}); return this.apiLoad(); }
    if (this.mode === 'db') { const {id, ...body} = p; await this.db.doc('photos/' + safeId(id)).set(body); return; }
    const list = LS.get('photos', []).filter(x => x.id !== p.id); list.push(p); LS.set('photos', list);
    if (!LS.get('photos', []).some(x => x.id === p.id)) throw new Error('storage full');
    this.loadLocal();
  },
  async delPhoto(id) {
    if (this.mode === 'api') { await this.api('/api/admin/photos', {method:'DELETE', body:{id}}); return this.apiLoad(); }
    if (this.mode === 'db') { await this.db.doc('photos/' + safeId(id)).delete(); return; }
    LS.set('photos', LS.get('photos', []).filter(x => x.id !== id)); this.loadLocal();
  }
};
function mergeSettings(s) {
  s = s || {};
  return {...DEFAULT_SETTINGS, ...s,
    address:{...DEFAULT_SETTINGS.address, ...(s.address || {})},
    banner:{...DEFAULT_SETTINGS.banner, ...(s.banner || {})},
    phones: Array.isArray(s.phones) && s.phones.length ? s.phones : DEFAULT_SETTINGS.phones,
    otherAddresses: Array.isArray(s.otherAddresses) ? s.otherAddresses : DEFAULT_SETTINGS.otherAddresses,
    days: Array.isArray(s.days) && s.days.length ? s.days : DEFAULT_SETTINGS.days};
}
const S = () => Store.data.settings;
const statusOf = id => (Store.data.mod[id] && Store.data.mod[id].status) || 'pending';
const replyOf = id => (Store.data.mod[id] && Store.data.mod[id].reply) || '';

/* ================= holidays (Республика Казахстан) =================
   Государственные праздники. Если праздник выпадает на субботу или воскресенье,
   выходным становится следующий рабочий день. Рождество и Курбан айт без переносов.
   Курбан айт и переносы правительства вносятся в админке (Настройки). */
const HOLIDAYS = [
  {md:'01-01', n:['Новый год','Жаңа жыл','New Year']},
  {md:'01-02', n:['Новый год','Жаңа жыл','New Year']},
  {md:'01-07', n:['Православное Рождество','Православиелік Рождество','Orthodox Christmas'], rel:true},
  {md:'03-08', n:['Международный женский день','Халықаралық әйелдер күні','International Women\'s Day']},
  {md:'03-21', n:['Наурыз мейрамы','Наурыз мейрамы','Nauryz']},
  {md:'03-22', n:['Наурыз мейрамы','Наурыз мейрамы','Nauryz']},
  {md:'03-23', n:['Наурыз мейрамы','Наурыз мейрамы','Nauryz']},
  {md:'05-01', n:['Праздник единства народа Казахстана','Қазақстан халқының бірлігі мерекесі','Unity Day of the People of Kazakhstan']},
  {md:'05-07', n:['День защитника Отечества','Отан қорғаушы күні','Defender of the Fatherland Day']},
  {md:'05-09', n:['День Победы','Жеңіс күні','Victory Day']},
  {md:'07-06', n:['День столицы','Астана күні','Capital Day']},
  {md:'08-30', n:['День Конституции','Конституция күні','Constitution Day']},
  {md:'10-25', n:['День Республики','Республика күні','Republic Day']},
  {md:'12-16', n:['День Независимости','Тәуелсіздік күні','Independence Day']}
];
const isoDay = d => d.toISOString().slice(0, 10);
const holCache = {};
function stateHolidays(year) {
  if (holCache[year]) return holCache[year];
  const map = {};
  const fixed = HOLIDAYS.map(h => ({d:new Date(Date.UTC(year, +h.md.slice(0, 2) - 1, +h.md.slice(3))), h}));
  fixed.forEach(({d, h}) => { map[isoDay(d)] = {n:h.n}; });
  fixed.forEach(({d, h}) => {
    const wd = d.getUTCDay();
    if (h.rel || (wd !== 0 && wd !== 6)) return;
    const x = new Date(d);
    do { x.setUTCDate(x.getUTCDate() + 1); } while (x.getUTCDay() === 0 || x.getUTCDay() === 6 || map[isoDay(x)]);
    map[isoDay(x)] = {shift:h.n};
  });
  return holCache[year] = map;
}
function extraDays() {
  const out = {};
  String(S().extraDays || '').split(/\n|;/).forEach(line => {
    const m = line.trim().match(/^(\d{4}-\d{2}-\d{2})\s*(.*)$/);
    if (m) out[m[1]] = {extra:m[2].trim()};
  });
  return out;
}
function holidayOn(key) { return extraDays()[key] || stateHolidays(+key.slice(0, 4))[key] || null; }
function holidayName(h) {
  if (!h) return '';
  if (h.n) return L(h.n);
  if (h.shift) return fmt(t('stShift'), {h:L(h.shift)});
  return h.extra || t('extraDay');
}

/* ================= time & status ================= */
const toMin = s => { const [h, m] = String(s || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
function localNow() { return new Date(Date.now() + CONFIG.tzOffsetHours * 3600e3); }
function isWorkDay(d) { return S().days.includes(d.getUTCDay()) && !holidayOn(isoDay(d)); }
function nextOpenText(now) {
  const s = S();
  for (let i = 1; i <= 40; i++) {
    const d = new Date(now); d.setUTCDate(d.getUTCDate() + i);
    if (!isWorkDay(d)) continue;
    const when = i === 1 ? t('tomorrow') : (i <= 6 ? t('days')[d.getUTCDay()] : fmtDate(d, {day:'numeric', month:'long', timeZone:'UTC'}));
    return fmt(t('nextOpen'), {d:when, t:s.open});
  }
  return '';
}
function openStatus() {
  const s = S();
  const now = localNow();
  const min = now.getUTCHours() * 60 + now.getUTCMinutes();
  const o = toMin(s.open), c = toMin(s.close), lf = toMin(s.lunchFrom), lt = toMin(s.lunchTo);
  const hol = holidayOn(isoDay(now));
  if (hol && s.days.includes(now.getUTCDay())) return {k:'closed', text:fmt(t('stHoliday'), {h:holidayName(hol)}), next:nextOpenText(now)};
  if (isWorkDay(now)) {
    if (min >= o && min < c) {
      if (s.lunchFrom && s.lunchTo && min >= lf && min < lt) return {k:'lunch', text:fmt(t('stLunch'), {t:s.lunchTo})};
      return {k:'open', text:fmt(t('stOpen'), {t:s.close})};
    }
    if (min < o) return {k:'closed', text:fmt(t('stOpensToday'), {t:s.open})};
  }
  for (let i = 1; i <= 40; i++) {
    const d = new Date(now); d.setUTCDate(d.getUTCDate() + i);
    if (!isWorkDay(d)) continue;
    if (i === 1) return {k:'closed', text:fmt(t('stOpensTomorrow'), {t:s.open})};
    const when = i <= 6 ? t('days')[d.getUTCDay()] : fmtDate(d, {day:'numeric', month:'long', timeZone:'UTC'});
    return {k:'closed', text:fmt(t('stOpensOn'), {d:when, t:s.open})};
  }
  return {k:'closed', text:t('dayOff')};
}
function upcomingHolidays(daysAhead) {
  const now = localNow(); const out = [];
  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(now); d.setUTCDate(d.getUTCDate() + i);
    const h = holidayOn(isoDay(d));
    if (h && S().days.includes(d.getUTCDay())) out.push({d, h});
  }
  return out;
}
const hoursLine = () => { const s = S(); return fmt(t('hoursShort'), {o:s.open, c:s.close, lf:s.lunchFrom, lt:s.lunchTo}); };
const tel = p => 'tel:+' + String(p).replace(/\D/g, '');
const KZ_MONTHS = ['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан'];
const fmtDate = (v, opts) => {
  opts = opts || {day:'numeric', month:'long', year:'numeric'};
  try {
    const d = new Date(v); if (isNaN(d)) return String(v);
    if (lang === 'kz' && opts.month) {   // браузеры не знают казахских месяцев — собираем дату сами
      const u = opts.timeZone === 'UTC', g = (a, b) => u ? d['getUTC' + a]() : d['get' + b]();
      let mm = KZ_MONTHS[g('Month', 'Month')]; if (opts.month === 'short') mm = mm.slice(0, 3) + '.';
      let out = (opts.day ? g('Date', 'Date') + ' ' : '') + mm + (opts.year ? ' ' + g('FullYear', 'FullYear') + ' ж.' : '');
      if (opts.hour) out += ', ' + String(g('Hours', 'Hours')).padStart(2, '0') + ':' + String(g('Minutes', 'Minutes')).padStart(2, '0');
      return out;
    }
    return d.toLocaleDateString(LOC[lang], opts);
  } catch (e) { return String(v); }
};
const fmtNum = n => n.toLocaleString(lang === 'kz' ? 'ru-RU' : LOC[lang], {minimumFractionDigits:1, maximumFractionDigits:1});   // в браузерах нет казахских числовых правил: «4,5», как в русском

/* ================= maps: 2ГИС =================
   Координаты и карточки зданий взяты из 2ГИС (организация «Государственный архив ВКО», 3 филиала).
   Карта: MapGL JS API 2ГИС с ключом (векторная). Если она не загрузилась — RasterJS API 2ГИС,
   без сети или в превью — схема с теми же точками. */
const GIS_CITY = 'https://2gis.kz/ust-kamenogorsk';
const ORG_2GIS = GIS_CITY + '/branches/12807648311246876';   // все здания архива одной организацией
const GEO_MAIN = {lat:49.945469, lon:82.622059, firm:'12807639721312284'};
const GEO_OTHER = [
  {re:/потанин/i, lat:49.958791, lon:82.598212, firm:'12807639721312285'},
  {re:/крылов/i, lat:49.944907, lon:82.61588, firm:'12807639721326081'}
];
const gisSearch = a => GIS_CITY + '/search/' + encodeURIComponent(a);
const gisFirm = p => p && p.firm ? GIS_CITY + '/firm/' + p.firm : gisSearch(p ? (p.gisq || p.short) : 'Государственный архив ВКО');
const gisRoute = p => p && p.lat ? `${GIS_CITY}/directions/points/%7C${p.lon}%2C${p.lat}` + (p.firm ? `%3B${p.firm}` : '') : gisSearch(p ? (p.gisq || p.short) : '');
/* все здания архива в городе: главное первым */
function places() {
  const s = S();
  const main = {id:0, main:true, name:t('mapMain'), short:t('addrShort'), addr:L(s.address).replace(/^\d{6},\s*/, ''), phones:s.phones, ...GEO_MAIN};
  return [main].concat(blds().map((b, k) => {
    const g = GEO_OTHER.find(x => x.re.test(b.a)) || {};
    return {id:k + 1, main:false, name:L(b.n) || bLoc(b.a), short:bLoc(b.a), ruShort:b.a, addr:lang === 'ru' ? 'ул. ' + b.a : bLoc(b.a), phones:b.p, lat:g.lat, lon:g.lon, firm:g.firm};
  }));
}
const mainPlace = () => places()[0];
const routeBtn = (p, cls, label) => `<a class="${cls || 'btn'}" href="${esc(gisRoute(p))}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-pin"/></svg>${esc(label || (p.main ? t('route2gis') : p.short))}<svg class="ic"><use href="#i-ext"/></svg></a>`;
function mapBtnsHTML() { return routeBtn(mainPlace(), 'btn sm'); }
const pinHTML = p => `<span class="pin2${p.main ? ' main' : ''}" data-pid="${p.id}"><svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 41S2 25.6 2 15.5a14 14 0 0 1 28 0C30 25.6 16 41 16 41z"/><circle cx="16" cy="15.5" r="${p.main ? 6 : 5}"/></svg><b>${esc(p.main ? t('mapMain') : p.short)}</b></span>`;
const gisKey = () => String(S().gisKey || CONFIG.gisKey || '').trim();
const popHTML = p => `<div class="mpop"><b>${esc(p.name)}</b><span>${esc(p.addr)}</span>${p.phones && p.phones.length ? `<span>${telLinks(p.phones)}</span>` : ''}
  <a class="btn sm" href="${esc(gisRoute(p))}" target="_blank" rel="noopener">${esc(t('route2gis'))}</a><a href="${esc(gisFirm(p))}" target="_blank" rel="noopener">${esc(t('gisCard'))}</a></div>`;
/* схема без сети: те же точки в правильном взаимном расположении */
function mapSchemeSVG() {
  const ps = places().filter(p => p.lat);
  const W = 600, H = 380, pad = 70;
  const k = Math.cos(49.95 * Math.PI / 180);
  const xs = ps.map(p => p.lon * k), ys = ps.map(p => p.lat);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const sc = Math.min((W - 2 * pad) / ((maxX - minX) || 1), (H - 2 * pad) / ((maxY - minY) || 1));
  const ox = (W - (maxX - minX) * sc) / 2, oy = (H - (maxY - minY) * sc) / 2;
  const pos = p => [ox + (p.lon * k - minX) * sc, H - (oy + (p.lat - minY) * sc)];
  const pins = ps.map(p => { const [x, y] = pos(p); const r = p.main ? 1.25 : 1;
    const right = p.main;
    return `<a href="${esc(gisRoute(p))}" target="_blank" rel="noopener" aria-label="${esc(t('route2gis') + ': ' + p.name)}"><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${r})">
      <path d="M0 0C-3-6-13-14-13-25a13 13 0 0 1 26 0C13-14 3-6 0 0z" fill="${p.main ? 'var(--primary)' : 'var(--leather)'}" stroke="#fff" stroke-width="2.5"/><circle cy="-25" r="${p.main ? 5.5 : 4.5}" fill="#fff"/></g>
      <text x="${(x + (right ? 22 : -22)).toFixed(1)}" y="${(y - 24).toFixed(1)}" text-anchor="${right ? 'start' : 'end'}" class="${p.main ? 'm' : ''}">${esc(p.main ? t('mapMain') : p.short)}</text></a>`; }).join('');
  return `<svg class="map-scheme" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('mapSchemeT'))}" style="overflow:visible">
    <g stroke="var(--il-street)" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"><path d="M-900 290L1500 170M-900 140L1500 70M140 -400L260 800M380 -400L460 800M-200 -400L-40 800M700 -400L760 800"/></g>
    <path d="M-900 360C-500 330 -200 380 120 340S420 390 640 330S1100 300 1500 330V900H-900Z" fill="var(--il-river)" opacity=".6"/>
    ${pins}</svg>`;
}
const MapGis = {
  libs: {}, inst: [],
  script(src, ready) {
    if (this.libs[src]) return this.libs[src];
    return (this.libs[src] = new Promise((res, rej) => {
      if (ready()) { res(true); return; }
      const sc = document.createElement('script'); sc.src = src; sc.async = true;
      sc.onload = () => ready() ? res(true) : rej(new Error('no lib'));
      sc.onerror = () => rej(new Error('load'));
      setTimeout(() => rej(new Error('timeout')), 15000);
      document.head.appendChild(sc);
    }));
  },
  /* у DG есть метод then, поэтому ждём DG.then отдельно и берём DG из window */
  loadRaster() { return this.script('https://maps.api.2gis.ru/2.0/loader.js?pkg=full', () => !!(window.DG && window.DG.then)).then(() => new Promise(res => window.DG.then(() => res(true)))); },
  loadGL() { return this.script('https://mapgl.2gis.com/api/js/v1', () => !!(window.mapgl && window.mapgl.Map)); },
  fallback(box) {
    box.classList.add('scheme');
    box.innerHTML = (box.dataset.scope === 'region' ? regionSchemeSVG() : mapSchemeSVG()) + `<p class="map-cap"><svg class="ic"><use href="#i-info"/></svg><span>${esc(t('mapFallback'))}</span></p>`;
  },
  frame(box) { box.innerHTML = ''; const el = document.createElement('div'); el.className = 'gis-map'; box.appendChild(el); return el; },
  /* карта создаётся, когда блок ещё растёт (справа догружается карточка с адресами).
     Следим за размером: пересчитываем карту и, пока посетитель её не трогал, заново вписываем все здания */
  watch(el, resize, fit) {
    let touched = false, t = 0, last = el.clientWidth + 'x' + el.clientHeight;
    ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(ev => el.addEventListener(ev, () => { touched = true; }, {passive:true}));
    if (!('ResizeObserver' in window)) return () => {};
    const ro = new ResizeObserver(() => {
      const now = el.clientWidth + 'x' + el.clientHeight; if (now === last || !el.clientWidth || !el.clientHeight) return; last = now;
      clearTimeout(t); t = setTimeout(() => { try { resize(); if (!touched) fit(); } catch (e) {} }, 120);
    });
    ro.observe(el);
    return () => { clearTimeout(t); ro.disconnect(); };
  },
  /* векторная карта MapGL: метки — HTML, попап — своя карточка над меткой */
  buildGL(box) {
    const mg = window.mapgl; const ps = placesFor(box).filter(p => p.lat); const region = box.dataset.scope === 'region';
    if (typeof mg.isSupported === 'function' && !mg.isSupported()) throw new Error('webgl');
    const el = this.frame(box);
    const map = new mg.Map(el, {center:[GEO_MAIN.lon, GEO_MAIN.lat], zoom:14, key:gisKey(), lang:lang === 'en' ? 'en' : 'ru', zoomControl:'topRight', disableZoomOnScroll:true});
    ps.forEach(p => new mg.HtmlMarker(map, {coordinates:[p.lon, p.lat], html:pinHTML(p), anchor:p.main ? [20, 52] : [16, 42], interactive:true, zIndex:p.main ? 20 : 10}));
    let pop = null;
    const close = () => { if (pop) { pop.destroy(); pop = null; } };
    const open = p => { close(); try { map.setCenter([p.lon, p.lat], {duration:300}); } catch (e) {} pop = new mg.HtmlMarker(map, {coordinates:[p.lon, p.lat], html:`<div class="mpop-at${p.main ? ' main' : ''}">${popHTML(p).replace('<div class="mpop">', '<div class="mpop gl"><button type="button" class="mpop-x" aria-label="' + esc(t('close')) + '">×</button>')}</div>`, anchor:[0, 0], interactive:true, zIndex:100}); };
    el.addEventListener('click', e => {
      const pin = e.target.closest('[data-pid]'); if (pin) { const p = ps.find(x => String(x.id) === pin.dataset.pid); if (p) { open(p); if (region) Br.select(p.key, true); } return; }
      if (e.target.closest('.mpop-x') || !e.target.closest('.mpop')) close();
    });
    const lons = ps.map(p => p.lon), lats = ps.map(p => p.lat);
    const fit = () => { if (ps.length > 1) map.fitBounds({southWest:[Math.min(...lons), Math.min(...lats)], northEast:[Math.max(...lons), Math.max(...lats)]}, {padding:{top:80, bottom:40, left:70, right:70}}); };
    fit();
    const unwatch = this.watch(el, () => map.invalidateSize(), fit);
    /* браузер может отобрать WebGL у карты (много карт на странице, сбой видеокарты): тогда видны метки без подложки — пересоздаём карту */
    el.addEventListener('webglcontextlost', e => { e.preventDefault(); this.lost(box); }, true);
    /* готова — когда догрузились плитки (событие idle), а не только стиль: иначе пустая подложка не заменится растровой картой */
    return {kill: () => { unwatch(); map.destroy(); }, map, open: p => { open(p); try { map.setZoom(region ? 15 : map.getZoom(), {duration:400}); } catch (e) {} }, ready: new Promise(res => { map.on('idle', () => res(true)); })};
  },
  /* запасной вариант: растровая карта RasterJS (Leaflet), стандартные попапы */
  buildRaster(box) {
    const DG = window.DG; const ps = placesFor(box).filter(p => p.lat); const region = box.dataset.scope === 'region'; const mk = {};
    const el = this.frame(box);
    const map = DG.map(el, {center:[GEO_MAIN.lat, GEO_MAIN.lon], zoom:14, fullscreenControl:false, scrollWheelZoom:false});
    ps.forEach(p => {
      const icon = DG.divIcon({className:'pin2-wrap', html:pinHTML(p), iconSize:p.main ? [40, 52] : [32, 42], iconAnchor:p.main ? [20, 52] : [16, 42], popupAnchor:[0, p.main ? -48 : -38]});
      mk[p.key || p.id] = DG.marker([p.lat, p.lon], {icon, title:p.name, zIndexOffset:p.main ? 1000 : 0}).addTo(map).bindPopup(popHTML(p)).on('click', () => { if (region) Br.select(p.key, true); });
    });
    const fit = () => map.fitBounds(DG.latLngBounds(ps.map(p => [p.lat, p.lon])), {padding:[60, 60], maxZoom:16});
    fit();
    const unwatch = this.watch(el, () => map.invalidateSize(), fit);
    return {kill: () => { unwatch(); map.remove(); }, map, open: p => { const m = mk[p.key || p.id]; if (m) { map.setView([p.lat, p.lon], 15); m.openPopup(); } }};
  },
  lost(box) {
    const x = this.inst.find(i => i.box === box); if (!x || x.dead) return;
    x.dead = true; try { x.kill(); } catch (e) {} this.inst = this.inst.filter(i => i !== x);
    const n = +(box.dataset.lost || 0) + 1; box.dataset.lost = String(n);
    delete box.dataset.ready; box.innerHTML = '';
    if (n > 1) { box.dataset.ready = '1'; this.raster(box); } else this.mount(box);   // второй раз подряд — растровая карта, ей WebGL не нужен
  },
  raster(box) {
    this.loadRaster().then(() => { try { this.inst.push({box, ...this.buildRaster(box)}); } catch (e) { console.warn('2gis raster', e); this.fallback(box); } })
      .catch(() => this.fallback(box));
  },
  mount(box) {
    if (box.dataset.ready) return; box.dataset.ready = '1';
    if (IN_PREVIEW) { this.fallback(box); return; }
    box.innerHTML = `<p class="map-loading">${esc(t('loading'))}</p>`;
    if (!gisKey()) { this.raster(box); return; }
    this.loadGL().then(() => {
      let x;
      try { x = this.buildGL(box); } catch (e) { console.warn('2gis gl', e); this.raster(box); return; }
      x.box = box; this.inst.push(x);
      let ok = false; x.ready.then(() => { ok = true; });
      setTimeout(() => {   // ключ не подошёл или плитки не пришли за 15 секунд: растровая карта
        if (ok || x.dead || !box.isConnected) return;
        x.dead = true; try { x.kill(); } catch (e) {} this.inst = this.inst.filter(i => i.box !== box); this.raster(box);
      }, 15000);
    }).catch(() => this.raster(box));
  },
  refresh() {   // язык или настройки поменялись: перерисовать подписи и попапы
    this.inst.forEach(x => { x.dead = true; try { x.kill(); } catch (e) {} delete x.box.dataset.ready; });
    this.inst = []; $$('.map-slot.scheme').forEach(b => { b.classList.remove('scheme'); delete b.dataset.ready; });
    mountMaps();
  }
};
/* под каждой картой: точные маршруты в 2ГИС до каждого здания */
function renderMapPicks() {
  const list = places();
  $$('.map-slot').forEach(box => {
    if (box.dataset.scope === 'region') return;
    let row = box.nextElementSibling;
    if (!row || !row.classList.contains('map-routes')) { row = document.createElement('div'); row.className = 'map-routes'; box.after(row); }
    row.innerHTML = `<span class="map-pick-l">${esc(t('mapRoutes'))}</span>` + list.map(p => routeBtn(p, p.main ? 'btn' : 'btn ghost', p.main ? t('mapMain') : p.short)).join('') +
      `<a class="map-pick-all" href="${ORG_2GIS}" target="_blank" rel="noopener">${esc(t('mapAll'))}<svg class="ic"><use href="#i-ext"/></svg></a>`;
  });
}
function mountMaps() {
  // карты, чей блок уже убран со страницы, закрываем: иначе копятся WebGL-контексты и браузер гасит самую старую карту
  MapGis.inst = MapGis.inst.filter(x => { if (x.box && x.box.isConnected) return true; x.dead = true; try { x.kill(); } catch (e) {} return false; });
  const boxes = $$('.map-slot').filter(b => !b.dataset.ready);
  if (!boxes.length) return;
  if (!('IntersectionObserver' in window)) { boxes.forEach(b => MapGis.mount(b)); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); MapGis.mount(e.target); } }), {rootMargin:'400px'});
  boxes.forEach(b => io.observe(b));
}
function waLink() {
  const s = S();
  return 'https://wa.me/?text=' + encodeURIComponent(fmt(t('waText'), {a:L(s.address), p:s.phones[0], m:gisFirm(mainPlace())}));
}
/* QR-код рисуется прямо на странице (SVG), без внешних библиотек и без интернета */
function qrSVG(text) {
  try {
    if (!window.QRLib) return '';
    const qr = new window.QRLib(-1, 0);           // размер подбирается сам, коррекция ошибок M
    qr.addData(String.fromCharCode(...new TextEncoder().encode(text)));
    qr.make();
    const n = qr.getModuleCount(), m = 4; let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n + 2 * m} ${n + 2 * m}" role="img" aria-label="${esc(t('memoQr'))}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#FFFDF8"/><path d="${d}" fill="#2A2420"/></svg>`;
  } catch (e) { return ''; }
}
const Memo = {
  open() {
    const s = S();
    $('#memo-body').innerHTML = `<p class="k">${esc(t('address'))}</p><p class="v">${esc(L(s.address))}</p>
      <p class="k">${esc(t('hours'))}</p><p class="v">${esc(hoursLine())}</p><p>${esc(t('holidaysNote'))}</p>
      <p class="k">${esc(t('phones'))}</p><p class="v">${esc(s.phones.join(', '))}</p>
      <p class="k">${esc(t('memoBring'))}</p><p>${esc(t('memoBringText'))}</p>`;
    const q = $('#memo-qr'); q.innerHTML = '';
    const svg = qrSVG(gisRoute(mainPlace()));
    if (svg) q.innerHTML = svg + `<p>${esc(t('memoQr'))}</p>`;
    $('#memo-modal').hidden = false;
    setTimeout(() => { const b = $('#memo-modal [data-act="memo-print"]'); b && b.focus(); }, 30);
  },
  close() { $('#memo-modal').hidden = true; },
  print() { try { window.print(); } catch (e) { toast(t('printNo')); } }
};
const Voice = {
  rec: null, on: false,
  supported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  toggle() {
    if (this.on && this.rec) { try { this.rec.stop(); } catch (e) {} return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast(t('micNo')); return; }
    try {
      const r = new SR(); this.rec = r;
      r.lang = {ru:'ru-RU', kz:'kk-KZ', en:'en-US'}[lang]; r.interimResults = true; r.maxAlternatives = 1;
      const input = $('#chat-input'); const before = input.value;
      r.onresult = ev => { let txt = ''; for (let i = 0; i < ev.results.length; i++) txt += ev.results[i][0].transcript; input.value = (before ? before + ' ' : '') + txt; autoGrow(input); };
      r.onerror = () => { toast(t('micNo')); };
      r.onend = () => { this.on = false; $('#mic-btn').setAttribute('aria-pressed', 'false'); const v = $('#chat-input').value.trim(); if (v && v !== before.trim()) { Chat.viaVoice = true; $('#chat-form').requestSubmit(); } };
      r.start(); this.on = true; $('#mic-btn').setAttribute('aria-pressed', 'true'); toast(t('listening'));
    } catch (e) { toast(t('micNo')); }
  }
};
function hoursBlockHTML() {   // режим работы: таблица, примечание о праздниках, памятка и WhatsApp
  const s = S();
  return `<p class="eyebrow">${esc(t('hours'))}</p>
    <table class="hours"><tbody>
      <tr><th scope="row">${esc(t('weekdays'))}</th><td>${esc(s.open)}–${esc(s.close)}</td></tr>
      ${s.lunchFrom && s.lunchTo ? `<tr><th scope="row">${esc(t('lunch'))}</th><td>${esc(s.lunchFrom)}–${esc(s.lunchTo)}</td></tr>` : ''}
      <tr><th scope="row">${esc(t('weekend'))}</th><td>${esc(t('dayOff'))}</td></tr>
      ${s.reading ? `<tr><th scope="row">${esc(t('readingRoomCap'))}</th><td>${esc(s.reading)}</td></tr>` : ''}
    </tbody></table>
    <p class="muted" style="font-size:.88rem;margin:.4rem 0 0">${esc(t('holidaysNote'))}</p>
    <div class="btn-row" style="margin-top:.4rem">
      <button class="btn ghost sm" type="button" data-act="memo"><svg class="ic"><use href="#i-print"/></svg>${esc(t('memoBtn'))}</button>
      <a class="btn ghost sm" href="${esc(waLink())}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-share"/></svg>${esc(t('waShare'))}</a>
    </div>`;
}
function renderContactCards() {}   // оставлена для вызовов из старого кода: панель часов теперь в карточке главного здания

/* ================= prefs / a11y ================= */
function hostDark() {
  const r = document.documentElement;
  if (r.dataset.theme === 'dark') return true;
  if (r.dataset.theme === 'light') return false;
  return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
}
function applyPrefs() {
  const r = document.documentElement;
  r.dataset.fs = String(prefs.fs);
  r.dataset.scheme = prefs.scheme || 'light';
  if (prefs.spacing) r.dataset.spacing = 'wide'; else delete r.dataset.spacing;
  const eff = prefs.scheme || 'light';   // по умолчанию — светлая схема
  $$('[data-act="scheme"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === eff)));
  $$('[data-act="fs"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === '0' && prefs.fs === 0)));
  $$('[data-act="spacing"]').forEach(b => b.setAttribute('aria-pressed', String(!!prefs.spacing)));
  $$('[data-act="lang"]').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.v === lang)); });
  const lc = $('#lang-cur'); if (lc) lc.textContent = ({ru:'RU', kz:'KZ', en:'EN'})[lang] || 'RU';
  $('#a11y-panel').hidden = !prefs.panel;
  const as = $('#auto-speak'); if (as) { as.setAttribute('aria-pressed', String(!!prefs.autoSpeak)); as.title = t('autoSpeak'); }
  $('[data-act="a11y-toggle"]').setAttribute('aria-expanded', String(!!prefs.panel));
  LS.set('prefs', prefs);
  if (typeof Pano !== 'undefined') Pano.refresh();
}

const TTS = {
  on: false,
  ok: 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined',
  speak(text) {
    if (!this.ok) { toast(t('ttsNo')); return; }
    try {
      speechSynthesis.cancel();
      const code = {ru:'ru-RU', kz:'kk-KZ', en:'en-US'}[lang];
      const voices = speechSynthesis.getVoices() || [];
      const voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(code.slice(0, 2))) || (lang === 'kz' ? voices.find(v => v.lang && v.lang.startsWith('ru')) : null);
      const parts = String(text).replace(/\s+/g, ' ').match(/[^.!?…]+[.!?…]*/g) || [];
      const chunks = []; let buf = '';
      parts.forEach(p => { if ((buf + p).length > 220) { if (buf) chunks.push(buf); buf = p; } else buf += p; });
      if (buf.trim()) chunks.push(buf);
      chunks.forEach((c, i) => {
        const u = new SpeechSynthesisUtterance(c.trim());
        u.lang = voice ? voice.lang : code; if (voice) u.voice = voice; u.rate = .92;
        if (i === chunks.length - 1) u.onend = () => this.set(false);
        speechSynthesis.speak(u);
      });
      this.set(true);
    } catch (e) { toast(t('ttsNo')); }
  },
  stop() { try { speechSynthesis.cancel(); } catch (e) {} this.set(false); },
  set(v) {
    this.on = v;
    const b = $('#speak-btn'); if (!b) return;
    b.setAttribute('aria-pressed', String(v));
    b.querySelector('use').setAttribute('href', v ? '#i-stop' : '#i-sound');
    b.querySelector('span').textContent = v ? t('stop') : t('speak');
  }
};

let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 3800);
}

function applyI18n() {
  document.documentElement.lang = HTML_LANG[lang];
  $$('[data-i]').forEach(el => { el.textContent = t(el.dataset.i); });
  $$('[data-ip]').forEach(el => { el.placeholder = t(el.dataset.ip); });
  $$('[data-ia]').forEach(el => { el.setAttribute(el.tagName === 'IFRAME' ? 'title' : 'aria-label', t(el.dataset.ia)); });
  $$('[data-egov]').forEach(el => { el.href = EGOV[lang]; });
  $$('[data-ia-alt]').forEach(el => { el.alt = t(el.dataset.iaAlt); });
  document.title = lang === 'ru' ? 'Государственный архив ВКО' : t('orgName');
  TTS.set(TTS.on);
}

/* ================= renderers ================= */
function renderStatus() {
  const st = openStatus(); const s = S();
  const hs = $('#head-status'); hs.className = 'status' + (st.k === 'open' ? '' : ' ' + st.k);
  // на телефоне — коротко («Закрыто»), полный текст в подсказке и для экранного диктора
  hs.innerHTML = `<span class="st-long">${esc(st.text)}</span><span class="st-short" aria-hidden="true">${esc(st.k === 'closed' ? t('stClosedS') : st.text)}</span>`; hs.title = st.text;
  const hp = $('#head-phone'); hp.href = tel(s.phones[0] || ''); hp.querySelector('span').textContent = s.phones[0] || '';
  $('#bb-call').href = tel(s.phones[0] || '');
  const ics = $('#ic-status'); ics.className = 'status' + (st.k === 'open' ? '' : ' ' + st.k); ics.textContent = st.text;
  { const h = $('#hero-status'); if (h) { h.className = 'status' + (st.k === 'open' ? '' : ' ' + st.k); h.textContent = st.text; } }
  $('#ic-hours').textContent = s.open + ' – ' + s.close;
  const nx = $('#ic-next'); nx.hidden = !st.next; nx.textContent = st.next || '';
  const up = upcomingHolidays(21)[0]; const ih = $('#ic-holiday');
  ih.hidden = !up; ih.textContent = up ? fmt(t('nextHoliday'), {d:fmtDate(up.d, {day:'numeric', month:'long', timeZone:'UTC'}), h:holidayName(up.h)}) : '';
  $('#ic-lunch').textContent = fmt(t('lunchShort'), {lf:s.lunchFrom, lt:s.lunchTo});
  { const wk = $('#ic-week'); if (wk) { const today = localNow().getUTCDay(), names = t('wdShort');
      wk.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<span class="${s.days.includes(d) ? 'on' : 'off'}${d === today ? ' today' : ''}">${esc(names[d])}</span>`).join('');
      const wn = new Intl.DateTimeFormat({ru:'ru-RU', kz:'kk-KZ', en:'en-GB'}[lang] || 'ru-RU', {weekday:'long', timeZone:'UTC'}).format(localNow());
      const key = $('#ic-week-key'); if (key) key.innerHTML = `<span class="wk-dot" aria-hidden="true"></span>${esc(t('wkToday'))}: ${esc(wn)}${s.days.includes(today) ? '' : ', ' + esc(t('wkOff'))}`; } }
  $('#ic-phones').innerHTML = s.phones.map(p => `<a class="phone-xl" href="${esc(tel(p))}">${esc(p)}</a>`).join('');
  { const pb = persBld(); $('#ic-pers').innerHTML = pb && pb.p.length ? `${esc(t('persShort'))}: <a href="${esc(tel(pb.p[0]))}">${esc(pb.p[0])}</a>` : ''; }
  $('#ic-call').href = tel(s.phones[0] || ''); $('#hero-call').href = tel(s.phones[0] || '');
  $('#foot-addr').textContent = L(s.address);
  $('#foot-phones').textContent = s.phones.join(', ');
  $('#foot-hours').textContent = hoursLine();
  renderContactCards();
  renderMapPicks();
}
const linkify = h => h.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g, '<br>');
const put = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
/* частые вопросы: правки сотрудников (settings.content.faq, ответ — лёгкая разметка, как в md()) или стандартные из FAQS */
function faqItems() {
  const C = S().content || {};
  return Array.isArray(C.faq) && C.faq.length ? C.faq.map(f => ({q:f.q, html:md(L(f.a))})) : FAQS.map(f => ({q:f.q, html:L(f.a())}));
}
const iconCard = (icon, title, text) => `<article class="card"><svg class="ic2" aria-hidden="true"><use href="#${icon}"/></svg><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`;
function renderContent() {
  const minis = CATS.map(c => `<div class="mini"><svg class="ic2" aria-hidden="true"><use href="#${c.icon}"/></svg><span>${esc(L(c.t))}</span></div>`).join('');
  put('#cats-about', minis);
  const keyDates = TIMELINE.filter(x => x.key).map(x => `<li><b>${esc(L(x.y))}</b><span>${esc(L(x.t))}</span></li>`).join('');
  put('#tl-about', keyDates);
  put('#tl-full', TIMELINE.map(x => `<li><span class="yr">${esc(L(x.y))}</span><div><h3>${esc(L(x.t))}</h3><p>${esc(L(x.x))}</p></div></li>`).join(''));
  const C = S().content || {};
  try { put('#mis-body', About.missionHTML()); put('#inst-gal', About.galleryHTML()); } catch (e) {}   // миссия и фотогалерея «Об архиве» (About из tz.js; при первом запуске его ещё нет: их рисует Home.render)
  ['aboutP1','aboutP2','aboutP3'].forEach((k, i) => { const o = C.about && C.about['p' + (i + 1)]; if (o && L(o)) $$(`[data-i="${k}"]`).forEach(el => { el.textContent = L(o); }); });
  const branches = Array.isArray(C.branches) && C.branches.length ? C.branches.map(b => ({t:b})) : BRANCHES;
  const br = branches.map(b => `<li><svg class="ic"><use href="#i-pin"/></svg><span>${esc(L(b.t))}</span></li>`).join('');
  put('#pubs', PUBS.map(p => `<li class="bl-card"><svg class="ic2" aria-hidden="true"><use href="#d-scroll"/></svg><b>${esc(L(p.t))}</b><span>${esc(L(p.x))}</span></li>`).join('') + `<li><a class="bl-card" href="#memory/pubs"><svg class="ic2" aria-hidden="true"><use href="#d-letter"/></svg><b>${esc(t('pubsMoreT'))}</b><span>${esc(t('pubsMoreD'))}</span><em class="bl-go">${esc(t('dbRead'))}</em></a></li>`);
  void br; if (0) put('#branches-c', `<h2>${esc(t('regionBranches'))}</h2><ul class="brief">${(SITE.branches || []).filter(b => !/Потанин/.test(b.a)).map(b => `<li><b>${esc(b.n)}</b><span>${esc(b.a.replace(/^\d{6},\s*/, ''))}</span>${telLinks(b.p.slice(0, 1))}</li>`).join('')}</ul><p style="margin-top:.8rem"><a href="#visitors/branches">${esc(t('tBranches'))} →</a></p>`);
  const faqs = faqItems();
  put('#faq-list', faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(L(f.q))}</summary><div class="ans">${f.html}</div></details>`).join(''));
  put('#gloss', lang === 'ru' ? '' : GLOSS.map(g => `<div><dt>${esc(L(g.t))}</dt><dd>${esc(L(g.x))}</dd></div>`).join(''));
  put('#logo-meaning', LOGO_MEANING.map(m => `<li>${L(m)}</li>`).join(''));
}
function newsSorted() { return [...Store.data.news].sort((a, b) => String(b.date).localeCompare(String(a.date))); }
function newsItemHTML(n) {
  const txt = L(n.text); let head = txt, rest = '';
  if (txt.length > 420) { const cut = txt.slice(0, 380).lastIndexOf('. '); const k = cut > 150 ? cut + 1 : 380; head = txt.slice(0, k).trim(); rest = txt.slice(k).trim(); }
  const ps = x => x.split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');
  const cover = n.img ? `<figure class="news-cover"><img src="${esc(n.img)}" alt="" loading="lazy" decoding="async"></figure>` : '';
  const pid = (String(n.id || '').match(/^old-(\d+)$/) || [])[1], full = pid && typeof PIDX !== 'undefined' && PIDX.has(pid);
  return `<article class="news-item${n.img ? ' has-cover' : ''}"${n.cat ? ` data-cat="${esc(n.cat)}"` : ''}>${cover}<div class="news-body"><p class="news-date">${esc(fmtDate(n.date))}</p><h3>${full ? `<a href="#p/${pid}">${esc(L(n.title))}</a>` : esc(L(n.title))} ${n.demo ? `<span class="pill">${esc(t('example'))}</span>` : ''}</h3>${full ? ps(head) + `<p class="news-more"><a class="more-link" href="#p/${pid}">${esc(t('pgRead'))}<svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a></p>` : ps(head) + (rest ? `<details><summary>${esc(t('readMore'))}</summary>${ps(rest)}</details>` : '')}${n.yt ? `<div class="cat-video"><button type="button" class="cat-yt" data-act="cat-yt" data-v="${esc(n.yt)}"><img src="https://i.ytimg.com/vi/${esc(n.yt)}/hqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="btn"><svg class="ic" aria-hidden="true"><use href="#i-play"/></svg>${esc(t('cWatch'))}</span></button></div>` : ''}</div></article>`;
}
function renderNews() {
  const list = newsSorted();
  const loading = !Store.ready && !Store.failed;
  const empty = `<p class="empty">${esc(loading ? t('loading') : (Store.failed ? t('loadFail') : t('noNews')))}</p>`;
  /* главная: блочная сетка. Крупная новость и две карточки — только с фото, справа список следующих новостей, ещё правее «Важно» */
  const nHref = n => { const pid = (String(n.id || '').match(/^old-(\d+)$/) || [])[1]; return pid && PIDX.has(pid) ? '#p/' + pid : '#news'; };
  const nTime = n => `<time datetime="${esc(n.date)}">${esc(fmtDate(n.date))}</time>`;
  if ($('#home-feat')) {
    const top = list.filter(n => n.img).slice(0, 3), rest = list.filter(n => !top.includes(n)).slice(0, 4);
    const ph = (n, hi) => `<span class="blk-ph pf">${pfImg(n.img, '', hi)}</span>`;
    const cards = top.slice(1).map(n => `<a class="blk blk-card" href="${nHref(n)}">${ph(n)}<b>${esc(L(n.title))}</b>${nTime(n)}</a>`).join('');
    /* первую новость сервер кладёт в HTML заранее (server.js, newsBoot): картинку не пересоздаём, иначе главный элемент страницы (LCP) рисуется заново только после скриптов */
    const pre = $('#home-feat > a[data-pre]'), pim = pre && pre.querySelector('img.pf-img');
    if (pre && !top.length) { /* данные ещё идут или не пришли: готовый блок остаётся */ }
    else if (pre && pim && top.length && pim.getAttribute('src') === top[0].img) {
      pre.setAttribute('href', nHref(top[0]));
      const bb = pre.querySelector('.blk-ov b'), tm = pre.querySelector('.blk-ov time');
      if (bb) bb.textContent = L(top[0].title);
      if (tm) { tm.setAttribute('datetime', top[0].date); tm.textContent = fmtDate(top[0].date); }
      while (pre.nextSibling) pre.nextSibling.remove();
      pre.insertAdjacentHTML('afterend', cards);
      if (window.tzFit && !pim.dataset.fit) { pim.dataset.fit = '1'; if (pim.complete) tzFit(pim); else pim.addEventListener('load', () => tzFit(pim), {once:true}); }
    } else {
      $('#home-feat').innerHTML = top.length
        ? `<a class="blk blk-feat" href="${nHref(top[0])}">${ph(top[0], true)}<span class="blk-ov"><b>${esc(L(top[0].title))}</b>${nTime(top[0])}</span></a>` + cards
        : empty;
    }
    $('#home-list').innerHTML = rest.map(n => `<li><a href="${nHref(n)}">${nTime(n)}<b>${esc(L(n.title))}</b></a></li>`).join('');
    $('#home-imp').innerHTML = [['#catalog', t('navCatalog')], ['#visitors/cert', t(TAB_T.cert)], ['#visitors/genealogy', t(TAB_T.genealogy)], ['#visitors/reading', t(TAB_T.reading)], ['#visitors/guide', t(TAB_T.guide)]]
      .map(([h, n]) => `<li><a href="${h}">${esc(n)}</a></li>`).join('');
  }
  $('#news-list').innerHTML = list.length ? list.map(newsItemHTML).join('') : empty;
}
function starsHTML(n) {
  let h = '<span class="stars-static" role="img" aria-label="' + esc(fmt(t('starN'), {n})) + '">';
  for (let i = 1; i <= 5; i++) h += `<svg class="ic${i <= n ? ' on' : ''}" aria-hidden="true"><use href="#i-star"/></svg>`;
  return h + '</span>';
}
function ratingStats() {
  const r = Store.data.reviews; const n = r.length;
  const dist = [0,0,0,0,0]; let sum = 0;
  r.forEach(x => { const s = Math.round(x.stars); if (s >= 1 && s <= 5) { dist[s - 1]++; sum += s; } });
  return {n, avg: n ? sum / n : 0, dist};
}
function rateSumHTML() {
  const st = ratingStats();
  if (!Store.ready && !Store.failed) return `<p class="empty">${esc(t('loading'))}</p>`;
  if (!st.n) return `<p class="empty">${esc(t('noVotes'))}</p>`;
  const max = Math.max(...st.dist, 1);
  let bars = '';
  for (let i = 5; i >= 1; i--) bars += `<span>${i}</span><span class="bar"><i style="width:${(st.dist[i - 1] / max * 100).toFixed(1)}%"></i></span><span>${st.dist[i - 1]}</span>`;
  return `<div class="rate-sum"><div><p class="rate-big">${esc(fmtNum(st.avg))}</p>${starsHTML(Math.round(st.avg))}<p class="muted" style="font-size:.8rem">${esc(fmt(t('votesN'), {n:st.n}))}</p></div><div class="dist" aria-hidden="true">${bars}</div></div>`;
}
function mountRating(sfx) {
  const host = $('#rate-' + sfx);
  const v = UI.rating[sfx] || 0;
  let btns = '';
  for (let i = 1; i <= 5; i++) btns += `<button type="button" role="radio" aria-checked="${i === v}" class="${i <= v ? 'on' : ''}" data-act="star" data-sfx="${sfx}" data-v="${i}" aria-label="${esc(fmt(t('starN'), {n:i}) + ': ' + t('r' + i))}"><svg class="ic"><use href="#i-star"/></svg><span class="n" aria-hidden="true">${i}</span></button>`;
  host.innerHTML = `<form class="form" data-rate="${sfx}" novalidate>
      <div class="star-pick" role="radiogroup" aria-label="${esc(t('rateTitle'))}">${btns}</div>
      <p class="star-label" id="star-label-${sfx}" aria-live="polite">${v ? esc(t('r' + v)) : ''}</p>
      <div class="field"><label for="rate-c-${sfx}">${esc(t('rateComment'))}</label><textarea id="rate-c-${sfx}" maxlength="600" style="min-height:4rem"></textarea></div>
      <button class="btn" type="submit" style="align-self:flex-start"><svg class="ic"><use href="#i-send"/></svg>${esc(t('rateSend'))}</button>
      <div class="success" id="rate-ok-${sfx}" hidden><svg class="ic"><use href="#i-check"/></svg><span></span></div>
    </form>`;
}
function setStar(sfx, v) {
  UI.rating[sfx] = v;
  $$(`[data-act="star"][data-sfx="${sfx}"]`).forEach(b => { const n = +b.dataset.v; b.classList.toggle('on', n <= v); b.setAttribute('aria-checked', String(n === v)); });
  const lbl = $('#star-label-' + sfx); if (lbl) lbl.textContent = t('r' + v);
}
function entryHTML(e, withStars) {
  const reply = replyOf(e.id);
  const meta = [e.city, fmtDate(e.ts)].filter(Boolean).map(esc).join(' · ');
  return `<article class="entry"><header>${withStars ? starsHTML(e.stars) : ''}${e.name ? `<strong>${esc(e.name)}</strong>` : ''}<span>${meta}</span></header>${e.text ? `<p>${esc(e.text)}</p>` : ''}${reply ? `<div class="reply"><b>${esc(t('reply'))}</b>${esc(reply)}</div>` : ''}</article>`;
}
function renderGuest() {
  const loading = !Store.ready && !Store.failed;
  const pub = Store.data.entries.filter(e => statusOf(e.id) === 'approved').sort((a, b) => b.ts - a.ts);
  $('#gb-list').innerHTML = loading ? `<p class="empty">${esc(t('loading'))}</p>` : (pub.length ? pub.map(e => entryHTML(e)).join('') : `<p class="empty">${esc(Store.failed ? t('loadFail') : t('entriesEmpty'))}</p>`);
  const rv = Store.data.reviews.filter(r => r.text && statusOf(r.id) === 'approved').sort((a, b) => b.ts - a.ts);
  $('#rv-list').innerHTML = loading ? `<p class="empty">${esc(t('loading'))}</p>` : (rv.length ? rv.map(r => entryHTML(r, true)).join('') : `<p class="empty">${esc(t('reviewsEmpty'))}</p>`);
  $('#rate-sum-d').innerHTML = rateSumHTML();
}
/* крупные слова (АРХИВ, 1940, подпись в подвале) — точно по ширине блока, по реальным метрикам шрифта */
const Fit = {
  keys: new WeakMap(),
  run(force) {
    $$('[data-fit]').forEach(el => {
      const inner = el.querySelector('.fit-in'); if (!inner || !el.getClientRects().length) return;
      const cs = getComputedStyle(el);
      const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (avail <= 0) return;
      const key = Math.round(avail) + '|' + innerHeight + '|' + inner.textContent;
      if (!force && this.keys.get(el) === key) return;
      el.style.fontSize = '100px';
      const w = inner.getBoundingClientRect().width; if (!w) return;
      let fs = avail / w * 100 * .995;
      const max = parseFloat(cs.getPropertyValue('--fit-max')), vh = parseFloat(cs.getPropertyValue('--fit-vh'));
      if (max) fs = Math.min(fs, max);
      if (vh) fs = Math.min(fs, Math.max(innerHeight * vh, 64));
      el.style.fontSize = fs.toFixed(2) + 'px';
      this.keys.set(el, key);
    });
  },
  init() {
    let raf = 0; const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => this.run()); };
    addEventListener('resize', go);
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(go); $$('[data-fit]').forEach(el => ro.observe(el)); }
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(() => this.run(true));
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => this.run(true));
    }
    this.run(true);
  }
};

function renderAll() {
  if (typeof SiteTr !== 'undefined') { SiteTr.apply(); if (lang !== 'ru' && !SiteTr.data && !SiteTr.asked) SiteTr.ensure(); }
  Search.idx = null; Tabs.renderBars(); Tabs.refresh(); renderNeed(); if (current === 'page' && Page.id) Page.open(Page.id); if (typeof Hero !== 'undefined') Hero.refresh();
  renderStatus(); renderContent(); renderNews(); renderGuest();
  mountRating('d');
  Photos.apply();
  if (current === 'admin') renderAdmin(true);
  Chat.renderNote();
  TZ.renderAll();
  Fit.run(true);
}

/* ================= разделы с вкладками: содержание прежнего сайта ================= */
const SITE = window.SITE || {};
const HUBS = {
  visitors: ['cert', 'genealogy', 'reading', 'branches', 'services', 'faq'],
  fonds: ['store', 'personal', 'db', 'pubs', 'gloss'],
  region: ['essays', 'expo', 'photo', 'articles', 'districts'],
  about: ['intro', 'history', 'team', 'activity', 'docs'],
  news: ['news', 'ann']
};
const TAB_T = {cert:'tCert', genealogy:'tGenea', reading:'tReading', branches:'tBranches', services:'tServices', faq:'tFaq',
  store:'tStore', personal:'tPersonal', db:'tDb', pubs:'tPubs', gloss:'tGloss',
  essays:'tEssays', expo:'tExpo', photo:'tPhoto', articles:'tArticles', districts:'tDistricts',
  intro:'tIntro', history:'tHistory', team:'tTeam', activity:'tActivity', docs:'tDocs', news:'tNews', ann:'tAnn'};
const HUB_T = {visitors:'navVisitors', fonds:'navFonds', region:'navRegion', about:'navAbout', news:'navNews'};
const hubTab = {};
/* обзор раздела (адрес без вкладки, например #fonds): карточки вкладок с короткими пояснениями. Это «уровень выше» вкладки: на него ведёт название раздела в хлебных крошках */
const HUB_D = {
  'visitors/site':['Для чего этот сайт и что на нём можно найти.', 'Бұл сайт не үшін және онда не табуға болады.', 'What this site is for and what you can find on it.'],
  'visitors/guide':['Как искать документы и пользоваться каталогом.', 'Құжаттарды қалай іздеуге және каталогты қалай пайдалануға болады.', 'How to search for documents and use the catalogue.'],
  'visitors/cert':['Как получить архивную справку.', 'Архив анықтамасын қалай алуға болады.', 'How to get an archival certificate.'],
  'visitors/genealogy':['С чего начать поиск сведений о предках.', 'Ата-баба туралы мәліметтерді іздеуді неден бастау керек.', 'Where to start looking for information about ancestors.'],
  'visitors/reading':['Порядок работы в читальном зале.', 'Оқу залында жұмыс істеу тәртібі.', 'Rules for working in the reading room.'],
  'visitors/branches':['Филиалы архива в районах области.', 'Облыс аудандарындағы мұрағат филиалдары.', 'Archive branches across the region.'],
  'visitors/services':['Государственная услуга и платные услуги архива.', 'Мемлекеттік қызмет және мұрағаттың ақылы қызметтері.', "The state service and the archive's paid services."],
  'visitors/faq':['Ответы на частые вопросы.', 'Жиі қойылатын сұрақтарға жауаптар.', 'Answers to common questions.'],
  'visitors/links':['Нормативные документы и полезные ссылки.', 'Нормативтік құжаттар мен пайдалы сілтемелер.', 'Regulations and useful links.'],
  'fonds/store':['Обзор документов, которые хранит архив.', 'Мұрағат сақтайтын құжаттарға шолу.', 'An overview of the documents the archive holds.'],
  'fonds/personal':['Фонды личного происхождения.', 'Жеке шығу тегі қорлары.', 'Collections of personal origin.'],
  'fonds/db':['Базы данных архива.', 'Мұрағаттың деректер қорлары.', "The archive's databases."],
  'fonds/pubs':['Издания, доклады и архивные видеоматериалы.', 'Басылымдар, баяндамалар және мұрағаттық бейнематериалдар.', 'Publications, reports and archive videos.'],
  'fonds/gloss':['Архивные термины простыми словами.', 'Мұрағат терминдері қарапайым тілде.', 'Archive terms in plain words.'],
  'region/essays':['Очерки по истории края.', 'Өлке тарихы бойынша очерктер.', "Essays on the region's history."],
  'region/expo':['Выставки архива.', 'Мұрағат көрмелері.', 'Archive exhibitions.'],
  'region/calendar':['Юбилейные и памятные даты области.', 'Облыстың мерейтойлық және атаулы күндері.', 'Anniversaries and memorable dates of the region.'],
  'region/photo':['Фотоальбомы из фондов архива.', 'Мұрағат қорларындағы фотоальбомдар.', "Photo albums from the archive's collections."],
  'region/articles':['Статьи и доклады.', 'Мақалалар мен баяндамалар.', 'Articles and reports.'],
  'region/districts':['Районы области: нынешние и бывшие.', 'Облыс аудандары: қазіргі және бұрынғы.', 'Districts of the region: current and former.'],
  'about/intro':['Миссия, задачи и фотографии учреждения.', 'Мекеме миссиясы, міндеттері және фотосуреттері.', 'Mission, tasks and photographs of the institution.'],
  'about/history':['История архива по годам.', 'Мұрағат тарихы жылдар бойынша.', "The archive's history by year."],
  'about/team':['Руководство, отделы и контакты.', 'Басшылық, бөлімдер және байланыстар.', 'Leadership, departments and contacts.'],
  'about/activity':['Планы работы и отчёты по годам.', 'Жылдар бойынша жұмыс жоспарлары мен есептер.', 'Work plans and reports by year.'],
  'about/docs':['Законы и документы, по которым работает архив.', 'Мұрағат жұмыс істейтін заңдар мен құжаттар.', 'Laws and documents the archive works under.'],
  'about/compliance':['Комплаенс-служба и противодействие коррупции.', 'Комплаенс-қызмет және сыбайлас жемқорлыққа қарсы іс-қимыл.', 'Compliance service and anti-corruption.'],
  'news/news':['Новости архива.', 'Мұрағат жаңалықтары.', 'Archive news.'],
  'news/ann':['Объявления.', 'Хабарландырулар.', 'Announcements.']
};
const LAW_LINKS = {'О Национальном архивном фонде и архивах': 'https://adilet.zan.kz/rus/docs/Z980000326_'};
const fmtInt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const trNote = () => `<p class="ru-note"><svg class="ic"><use href="#i-info"/></svg><span>${esc(t('trOnly'))}</span></p>`;
const blockNote = key => lang === 'ru' ? '' : (typeof SiteTr !== 'undefined' && SiteTr.has(key)) ? trNote() : ruNote();
const ruNote = () => lang === 'ru' ? '' : `<p class="ru-note"><svg class="ic"><use href="#i-info"/></svg><span>${esc(t('ruOnly'))}</span></p>`;
const telLinks = arr => (arr || []).map(p => `<a href="${esc(tel(p))}">${esc(p)}</a>`).join(', ');
const hcard = (title, body, icon) => `<div class="hcard">${icon ? `<svg class="ic2" aria-hidden="true"><use href="#${icon}"/></svg>` : ''}<div><h3>${title}</h3>${body}</div></div>`;
/* улицы двух городских зданий (настройки хранят русский адрес): на казахском и английском показываем по-своему, для остальных адресов остаётся как введено */
const STREETS_L = [[/^Потанина,\s*(.+)$/, 'Потанин көшесі, $1', '$1 Potanin St.'], [/^Крылова,\s*(.+)$/, 'Крылов көшесі, $1', '$1 Krylov St.']];
const bLoc = a => { if (lang === 'ru') return a; const s = STREETS_L.find(x => x[0].test(a)); return s ? a.replace(s[0], lang === 'kz' ? s[1] : s[2]) : a; };
function blds() {
  return (S().otherAddresses || []).map(b => typeof b === 'string' ? {a:b, n:'', p:[]} : {a:b.a || '', n:b.n || '', p:Array.isArray(b.p) ? b.p : []}).filter(b => b.a);
}
const persBld = () => blds().find(b => /потанин/i.test(b.a)) || {a:'Потанина, 12/2', p:['+7 (7232) 76-65-60']};

/* тексты раздела «Посетителям» на трёх языках (markdown для md()) */
const VTXT = {
  certH: ["Как получить архивную справку","Архивтік анықтаманы қалай алуға болады","How to get an archive certificate"],
  cert: ["Справка, копия или выписка из архивного документа — госуслуга.\n\n1. **Онлайн:** [eGov.kz]({eg}) или [e-vko.gov.kz](https://e-vko.gov.kz/).\n2. **В ЦОН** с удостоверением личности.\n3. **Вопросы:** приёмная архива {ph}.\n\nЗаявления и жалобы — через [eOtinish.kz](https://eotinish.kz).","Архивтік анықтама, көшірме немесе үзінді — мемлекеттік қызмет.\n\n1. **Онлайн:** [eGov.kz]({eg}) немесе [e-vko.gov.kz](https://e-vko.gov.kz/).\n2. **ХҚКО-да** жеке куәлікпен.\n3. **Сұрақтар:** архивтің қабылдау бөлмесі {ph}.\n\nӨтініштер мен шағымдар — [eOtinish.kz](https://eotinish.kz) арқылы.","An archive certificate, copy or extract is a public service.\n\n1. **Online:** [eGov.kz]({eg}) or [e-vko.gov.kz](https://e-vko.gov.kz/).\n2. **At a Public Service Center** with your ID.\n3. **Questions:** archive reception {ph}.\n\nRequests and complaints go through [eOtinish.kz](https://eotinish.kz)."],
  stazhH: ["Справки о стаже и зарплате","Өтіл мен жалақы туралы анықтамалар","Employment and salary certificates"],
  stazh: ["Готовит **филиал по личному составу**: ул. {pa}, тел. {pp}.","Дайындайтын — **жеке құрам бойынша филиал**: {pa} көшесі, тел. {pp}.","Issued by the **personnel records branch**: {pa}, tel. {pp}."],
  geneaH: ["Как найти сведения о предках","Ата-бабалар туралы мәліметті қалай табуға болады","How to trace your ancestors"],
  genea: ["1. **Соберите данные:** ФИО (и прежние фамилии), год и место рождения, где человек жил и работал.\n2. **Проверьте базы** «Книга памяти» и «Оставь свой след в истории» во вкладке [«Базы данных»](#fonds/db).\n3. **Закажите справку** на [eGov.kz]({eg}).\n4. **Поработайте сами** в [читальном зале](#visitors/reading): пн–пт {rr}.","1. **Деректерді жинаңыз:** аты-жөні (бұрынғы тегі де), туған жылы мен жері, қайда тұрып, жұмыс істегені.\n2. [«Деректер базалары»](#fonds/db) бетіндегі «Еске алу кітабы» мен «Тарихта ізіңді қалдыр» **базаларын қараңыз**.\n3. [eGov.kz]({eg}) арқылы **анықтама сұратыңыз**.\n4. [Оқу залында](#visitors/reading) **өзіңіз жұмыс істеңіз**: дс–жм {rr}.","1. **Collect the details:** full name (and former surnames), year and place of birth, where the person lived and worked.\n2. **Check the databases** Book of Memory and “Leave your mark in history” under [Databases](#fonds/db).\n3. **Order a certificate** on [eGov.kz]({eg}).\n4. **Research yourself** in the [reading room](#visitors/reading): Mon–Fri {rr}."],
  readH: ["Читальный зал","Оқу залы","Reading room"],
  read: ["**Пн–пт, {rr}.** Электронный каталог фондов, аппарат для микрофильмов, сканер для самостоятельной работы.\n\nИспользуете документы архива — ссылайтесь на Государственный архив ВКО.","**Дс–жм, {rr}.** Қорлардың электрондық каталогы, микрофильм аппараты, өзіңіз сканерлейтін сканер.\n\nАрхив құжаттарын пайдалансаңыз, ШҚО мемлекеттік архивіне сілтеме жасаңыз.","**Mon–Fri, {rr}.** Electronic fonds catalogue, a microfilm reader and a self-service scanner.\n\nIf you use the archive’s records, please cite the State Archive of EKR."],
  servH: ["Услуги и приём граждан","Қызметтер және азаматтарды қабылдау","Services and reception"],
  serv: ["- **Справки, копии, выписки** — [госуслуга](#visitors/cert).\n- **Платные услуги** — по прейскуранту акимата ВКО, цены в приёмной: {ph}.\n- **Личный приём руководства** — по записи: {ph}.\n- **Передать документы на хранение** — см. [объявления](#news/ann).","- **Анықтамалар, көшірмелер, үзінділер** — [мемлекеттік қызмет](#visitors/cert).\n- **Ақылы қызметтер** — ШҚО әкімдігінің прейскуранты бойынша, бағасы қабылдау бөлмесінде: {ph}.\n- **Басшылықтың жеке қабылдауы** — жазылу арқылы: {ph}.\n- **Құжаттарды сақтауға тапсыру** — [хабарландыруларды](#news/ann) қараңыз.","- **Certificates, copies, extracts** — a [public service](#visitors/cert).\n- **Paid services** — per the EKR akimat price list; ask reception: {ph}.\n- **Personal reception by management** — by appointment: {ph}.\n- **Donate documents** — see [announcements](#news/ann)."]
};
function vsub(k) {   // текст справки с подставленными адресом, телефонами и часами
  const s = S(); const pb = persBld();
  return L(VTXT[k]).replace(/\{eg\}/g, EGOV[lang]).replace(/\{addr\}/g, L(s.address)).replace(/\{ph\}/g, s.phones[0] || '')
    .replace(/\{rr\}/g, s.reading || '10:00–17:00').replace(/\{pa\}/g, pb.a).replace(/\{pp\}/g, (pb.p || []).join(', '));
}
function vtxt(k) {
  return md(vsub(k))
    .replace(/\+7 \(\d+\) [\d-]+/g, m => `<span class="nw">${m}</span>`);
}

/* список с фильтром */
/* карточки альбомов и статей с фото; клик открывает просмотр */
function phCard(act, i, th, title, n) {
  return `<li><button type="button" class="ph-card" data-act="${act}" data-k="${i}"><span class="ph-img"><img src="${esc(th)}" alt="" loading="lazy" decoding="async"></span><b>${esc(title)}</b><small>${esc(fmt(t('photosN'), {n}))}</small></button></li>`;
}
function sameTitle(a, b) {   // «Президент РК Назарбаев Н.А. …» и «Президент РК Н. А. Назарбаев …» — один альбом
  const w = x => new Set(norm(x).split(/[^a-zа-яёәғқңөұүһі0-9]+/i).filter(z => z.length > 2));
  const A = w(a), B = w(b); let k = 0; A.forEach(z => { if (B.has(z)) k++; });
  return k / Math.max(1, Math.min(A.size, B.size)) >= .7;
}
const LB = {
  list: [], i: 0, title: '', src: '',
  open(list, title, src, start) {
    const d = $('#lb'); if (!d || !list.length) return;
    this.list = list; this.i = Math.min(start || 0, list.length - 1); this.title = title; this.src = src || ''; this.back = document.activeElement;
    $('#lb-t').textContent = title;
    const a = $('#lb-src'); a.hidden = !this.src;
    if (this.src) { const inn = this.src.startsWith('#'); a.href = this.src; if (inn) a.removeAttribute('target'); else a.target = '_blank'; a.firstElementChild.textContent = t(inn ? 'pgReadArt' : 'oldPage'); }
    this.show(); if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  },
  show() {
    const p = this.list[this.i], img = $('#lb-img');
    img.src = p.s; img.alt = L(p.c) || this.title;
    $('#lb-cap').textContent = L(p.c) || '';
    $('#lb-n').textContent = fmt(t('lbCount'), {i:this.i + 1, n:this.list.length});
    $$('#lb .lb-nav').forEach(b => b.hidden = this.list.length < 2);
    const nx = this.list[(this.i + 1) % this.list.length]; if (nx) { const pre = new Image(); pre.src = nx.s; }
  },
  go(d) { this.i = (this.i + d + this.list.length) % this.list.length; this.show(); },
  close() { const d = $('#lb'); if (d && d.open) { d.close ? d.close() : d.removeAttribute('open'); } }
};
document.addEventListener('keydown', e => { const d = $('#lb'); if (!d || !d.open) return; if (e.key === 'ArrowRight') LB.go(1); else if (e.key === 'ArrowLeft') LB.go(-1); });
((f) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f())(() => {   // код запускается и после загрузки страницы (ТЗ 7.2)
  const d = $('#lb'); if (!d) return;
  d.addEventListener('close', () => { $('#lb-img').removeAttribute('src'); if (LB.back && LB.back.focus) LB.back.focus(); });
  d.addEventListener('click', e => { if (e.target === d) LB.close(); });
  $('#lb-src').addEventListener('click', () => { if (LB.src.startsWith('#')) LB.close(); });
  let x0 = null; d.addEventListener('pointerdown', e => { x0 = e.clientX; }); d.addEventListener('pointerup', e => { if (x0 != null && Math.abs(e.clientX - x0) > 60 && !e.target.closest('button,a')) LB.go(e.clientX < x0 ? 1 : -1); x0 = null; });
});
function flist(id, items, row, textOf, cls) {
  return `<div class="flist" data-flist="${id}">
    <label class="ffield"><svg class="ic"><use href="#i-search"/></svg><input type="search" data-filter="${id}" placeholder="${esc(t('filterPh'))}" aria-label="${esc(t('filterPh'))}" autocomplete="off"></label>
    <p class="fcount" aria-live="polite">${esc(fmt(t('found'), {n:items.length}))}</p>
    <ul class="frows${cls ? ' ' + cls : ''}">${items.map(it => `<li data-txt="${esc(norm(textOf(it)))}">${row(it)}</li>`).join('')}</ul>
    <p class="fnone" hidden>${esc(t('nothingFound'))}</p></div>`;
}
/* длинные списки показываем частями: меньше текста на экране, остальное — по кнопке или через фильтр */
function limitLists(root) {
  root.querySelectorAll('ul.frows, ul.dotlist, ul.ph-grid, ul.vgrid').forEach(ul => {
    if (ul.dataset.lim) return;
    const k = ul.classList.contains('frows') ? 12 : ul.classList.contains('ph-grid') || ul.classList.contains('vgrid') ? 9 : 8, n = ul.children.length;
    if (n <= k + 3) return;
    ul.dataset.lim = String(k); ul.classList.add('lim');
    [...ul.children].forEach((li, i) => { if (i >= k) li.classList.add('cut'); });
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost more-btn'; b.dataset.act = 'list-all';
    b.textContent = fmt(t('showAllN'), {n}); ul.after(b);
  });
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-act="list-all"]');
  if (b) { const ul = b.previousElementSibling; if (ul) { ul.dataset.open = '1'; ul.classList.add('all'); } b.hidden = true; return; }
  const li = e.target.closest && e.target.closest('.frows > li, .glist > li');
  if (li && !e.target.closest('a, button')) li.classList.toggle('x');
});
document.addEventListener('input', e => {
  const inp = e.target.closest && e.target.closest('[data-filter]'); if (!inp) return;
  const box = inp.closest('.flist'); const words = norm(inp.value).split(/\s+/).filter(Boolean);
  let n = 0;
  box.querySelectorAll('.frows > li').forEach(li => { const ok = words.every(w => li.dataset.txt.includes(w)); li.hidden = !ok; if (ok) n++; });
  box.querySelector('.fcount').textContent = fmt(t('found'), {n});
  box.querySelector('.fnone').hidden = n > 0;
  const ul = box.querySelector('.frows');
  if (ul && ul.dataset.lim) { const on = words.length > 0 || ul.dataset.open === '1'; ul.classList.toggle('all', on); const mb = ul.nextElementSibling; if (mb && mb.classList.contains('more-btn')) mb.hidden = on; }
});

const PANELS = {
  visitors: {
    cert: () => `<div class="hub-grid"><div class="hub-main">${vtxt('cert')}</div><aside class="hub-side">${hcard(esc(L(VTXT.stazhH)), vtxt('stazh'), 'd-people')}</aside></div>`,
    genealogy: () => `<div class="hub-main">${vtxt('genea')}</div>`,
    reading: () => `<div class="hub-grid"><div class="hub-main">${vtxt('read')}</div>
      <aside class="hub-side">${hcard(esc(t('readCallT')), `<p>${telLinks(S().phones)}${blds().filter(b => /крылов/i.test(b.a) && b.p.length).map(b => `<br>${telLinks(b.p)} <span class="muted">(${esc(bLoc(b.a))})</span>`).join('')}</p>`, 'i-phone')}</aside></div>`,
    branches: () => {
      const s = S();
      const city = [{n:t('mapMain'), a:L(s.address), p:s.phones, e:s.email, h:`${s.open}–${s.close}` + (s.reading ? ` · ${t('readingRoom')} ${s.reading}` : '')}]
        .concat(blds().map(b => ({n:L(b.n) || bLoc(b.a), a:lang === 'ru' ? 'ул. ' + b.a : bLoc(b.a), p:b.p})));
      const card = b => `<div class="bcard"><h3>${esc(b.n)}</h3><p><svg class="ic"><use href="#i-pin"/></svg><span>${esc(b.a)}</span></p>
        ${b.p && b.p.length ? `<p><svg class="ic"><use href="#i-phone"/></svg><span>${telLinks(b.p)}</span></p>` : ''}
        ${b.e ? `<p><svg class="ic"><use href="#i-send"/></svg><span><a href="mailto:${esc(b.e)}">${esc(b.e)}</a></span></p>` : ''}
        ${b.h ? `<p><svg class="ic"><use href="#i-clock"/></svg><span>${esc(b.h)}</span></p>` : ''}
        ${b.z ? `<p class="muted">${esc(b.z)}</p>` : ''}</div>`;
      const reg = (SITE.branches || []).filter(b => !/Потанин/.test(b._a || b.a)).map(b => ({n:b.n, a:b.a.replace(/^\d{6},\s*/, ''), p:b.p, e:b.e, h:b.h, z:b.z}));
      return `<h2>${esc(t('cityBuildings'))}</h2><div class="bgrid">${city.map(card).join('')}</div>
        <h2 style="margin-top:2rem">${esc(t('regionBranches'))}</h2><div class="bgrid">${reg.map(card).join('')}</div>`;
    },
    services: () => `<div class="hub-main">${vtxt('serv')}</div>`
  },
  fonds: {
    store: () => {
      const st = SITE.stats || {};
      setTimeout(() => FondsFiles.fill(), 0);
      return `${blockNote('fondsGroups')}<div class="stats-strip">
        <div><b>${fmtInt(st.fonds)}</b><span>${esc(t('statFonds'))}</span></div><div><b>${fmtInt(st.units)}</b><span>${esc(t('statUnits'))}</span></div>
        <div><b>${fmtInt(st.personal)}</b><span>${esc(t('statPersonal'))}</span></div><div><b>${fmtInt(st.av)}</b><span>${esc(t('statAv'))}</span></div></div>
        <p class="muted" style="margin:.4rem 0 1.4rem;font-size:.88rem">${esc(fmt(t('statsAsOf'), {d:st.asOf || ''}))}</p>
        <ul class="bl-grid bl-groups">${(SITE.fondsGroups || []).map(g => `<li class="bl-card"><b>${esc(g.t)}</b><span>${esc(g.d)}</span></li>`).join('')}</ul>
        <div id="fonds-files-box" hidden><h3 class="bl-h">${esc(t('fFilesT'))}</h3><ul class="bl-grid" id="fonds-files"></ul></div>`;
    },
    personal: () => {
      const ppl = SITE.personal || []; if (!ppl.length) return '';
      const kids = PIDX.size ? pKids('1352') : [], low = x => String(x || '').toLowerCase().replace(/ё/g, 'е');
      const used = new Set();
      /* строки списка сопоставляются со страницами личных фондов по фамилии и инициалам; казахские буквы и опечатки в фамилии не мешают */
      const kz = x => low(x).replace(/ө/g, 'о').replace(/[үұ]/g, 'у').replace(/қ/g, 'к').replace(/ғ/g, 'г').replace(/ң/g, 'н').replace(/ә/g, 'а').replace(/і/g, 'и').replace(/һ/g, 'х');
      const parts = x => kz(String(x || '').replace(/\(.*?\)/g, '')).split(/[\s,.]+/).filter(Boolean);
      const lev = (x, y) => { const m = Array.from({length:x.length + 1}, (_, i) => [i]); for (let j = 1; j <= y.length; j++) m[0][j] = j; for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1)); return m[x.length][y.length]; };
      const kp = kids.map(r => ({r, w:parts(r[1] || pTitle(r))}));
      const link = p => {
        const w = parts(p.n), sn = w[0] || '', ini = w[1] ? w[1][0] : '';
        const near = kp.filter(k => k.w[0] && sn && (k.w[0] === sn || k.w[0].startsWith(sn) || (sn.length > 4 && lev(k.w[0], sn) <= 2 && (k.w[1] ? k.w[1][0] === ini : lev(k.w[0], sn) <= 1))));
        const k = near.find(x => !used.has(x.r[0]) && x.w[1] && x.w[1][0] === ini) || near.find(x => x.w[1] && x.w[1][0] === ini) || near.find(x => !used.has(x.r[0])) || near[0];
        if (k) used.add(k.r[0]);
        return k ? '#p/' + k.r[0] : '';
      };
      const rows = ppl.map(p => ({n:p.n, s:p.s || '', d:p.d || '', h:link(p)}));
      kids.filter(r => !used.has(r[0])).forEach(r => rows.push({n:pTitle(r), s:'', d:'', h:'#p/' + r[0]}));   // страницы, которым не нашлась строка списка, тоже остаются доступны
      return ruNote() + flist('personal', rows,
        p => `<b>${p.h ? `<a href="${esc(p.h)}">${esc(p.n)}</a>` : esc(p.n)}</b>${p.s ? `<small>${esc(p.s)}</small>` : ''}${p.d ? `<span>${esc(p.d)}</span>` : ''}`, p => p.n + ' ' + p.d + ' ' + p.s, 'bl-grid');
    },
    db: () => {
      const dbs = SITE.databases || [], OLD = 'http://e-arhiv.vko.gov.kz/ru/DataBases/';
      const U = [OLD + 'BaseAreas', OLD + 'BaseBooks', OLD + 'BaseHistMark', '#catalog'], IC = ['d-branch', 'd-scroll', 'd-people', 'd-lens'];
      const card = (u, ic, title, d, act) => { const ext = /^https?:/.test(u); return `<li><a class="bl-card bl-db" href="${esc(u)}"${ext ? ' target="_blank" rel="noopener"' : ''}><svg class="ic2" aria-hidden="true"><use href="#${ic}"/></svg><b>${esc(title)}</b><span>${esc(d)}</span><em class="bl-go">${esc(act)}${ext ? '<svg class="ic" aria-hidden="true"><use href="#i-ext"/></svg>' : ''}</em></a></li>`; };
      const mr = PIDX.get('1926');
      return `${blockNote('databases')}<ul class="bl-grid bl-dbs">${dbs.map((d, i) => card(U[i] || '#catalog', IC[i] || 'd-scroll', d.t, d.d, t('dbOpen'))).join('')}${mr ? card('#p/1926', 'd-stamp', pTitle(mr), t('dbMetricD'), t('dbRead')) : ''}</ul>
      <p class="muted" style="margin-top:1rem">${esc(t('dbNote'))}</p>`;
    },
    gloss: () => (lang === 'ru' ? '' : `<div style="margin-top:2rem">${blockNote('gloss')}</div>`) + flist('gloss', SITE.gloss || [], g => `<b>${esc(g.t)}</b><span>${esc(g.d)}</span>`, g => g.t + ' ' + g.d)
  },
  region: {
    essays: () => ruNote() + (SITE.essays || []).map(e => `<h2>${esc(e.t)}</h2><ul class="dotlist">${e.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`).join(''),
    expo: () => `${ruNote()}<ul class="dotlist">${(SITE.exhibitions || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`,
    photo: () => {
      const A = SITE.galleryAlbums || [], rest = (SITE.albums || []).filter(x => !A.some(a => sameTitle(L(a.t), x)));
      return `<ul class="ph-grid">${A.map((a, i) => phCard('lb-album', i, a.th, L(a.t), a.ph.length)).join('')}</ul>`
        + (rest.length ? `<h2>${esc(t('moreAlbumsT'))}</h2>${ruNote()}<ul class="tagcloud">${rest.map(a => `<li><svg class="ic"><use href="#d-camera"/></svg>${esc(a)}</li>`).join('')}</ul>` : '');
    },
    articles: () => {
      const all = (SITE.talks || []).map(x => ({a:x.a, t:x.t, k:x.k})).concat((SITE.articles || []).map(x => ({a:x.a, t:x.t, k:'статья'})));
      const AP = SITE.articlePhotos || [];
      return (AP.length ? `<h2>${esc(t('artPhotosT'))}</h2><ul class="ph-grid">${AP.map((a, i) => phCard('lb-art', i, a.th, L(a.t), a.ph.length)).join('')}</ul><h2>${esc(t('allArticlesT'))}</h2>` : '')
        + ruNote() + flist('articles', all, x => `<b>${esc(x.t)}</b><small>${esc([x.a, x.k].filter(Boolean).join(' · '))}</small>`, x => x.a + ' ' + x.t);
    },
    districts: () => `${blockNote('districts')}<div class="two"><div><h2>${esc(t('districtsNow'))}</h2><ul class="dotlist">${(SITE.districts && SITE.districts.now || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><h2>${esc(t('districtsGone'))}</h2><ul class="dotlist">${(SITE.districts && SITE.districts.gone || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`
  },
  about: {
    history: () => (SITE.history || []).length ? `<details class="more"><summary>${esc(t('histDetail'))}</summary>${blockNote('history')}<ol class="tl">${SITE.history.map(h => `<li><span class="yr">${esc(h[0])}</span><div><p>${esc(h[1])}</p></div></li>`).join('')}</ol></details>` : '',
    team: () => `${blockNote('leaders')}<div class="bgrid">${orgLeaders().map(p => `<div class="bcard"><p class="eyebrow">${esc(p.r)}</p><h3>${esc(p.n)}</h3>${p.p ? `<p><svg class="ic"><use href="#i-phone"/></svg><span>${telLinks([p.p])}</span></p>` : ''}${p.e ? `<p><a href="mailto:${esc(p.e)}">${esc(p.e)}</a></p>` : ''}</div>`).join('')}</div>
      ${orgTeamExtra()}
      <h2 style="margin-top:2rem">${esc(t('branchHeads'))}</h2><ul class="dotlist">${(SITE.branches || []).filter(b => b.head).map(b => `<li><b>${esc(b.n)}:</b> ${esc(b.head)}</li>`).join('')}</ul>`,
    activity: () => `<ul class="yearlist">${(SITE.reports || []).map(r => `<li><b>${r.y}</b><span>${r.plan ? esc(t('planY')) : ''}${r.plan && r.report ? ' · ' : ''}${r.report ? esc(t('reportY')) : ''}</span></li>`).join('')}</ul>
      <p class="muted" style="margin-top:.8rem;font-size:.9rem">${esc(t('activityLead'))}</p>${orgReports()}`,
    docs: () => blockNote('laws') + flist('laws', orgDocs().concat(SITE.laws || []), x => {
        const k = x.url ? '' : Object.keys(LAW_LINKS).find(k2 => x.t.includes(k2)), href = x.url || (k ? LAW_LINKS[k] : '');
        return `<b>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(x.t)}</a>` : esc(x.t)}</b>${x.d ? `<small>${esc(x.d)}</small>` : ''}`;
      }, x => x.t + ' ' + x.d, 'bl-grid') +
      `<p class="muted" style="margin-top:.6rem;font-size:.9rem">${esc(t('lawsNote'))} <a href="https://adilet.zan.kz/rus" target="_blank" rel="noopener">adilet.zan.kz</a></p>`
  },
  news: {
    news: () => (SITE.olderNews || []).length ? `<details class="more"><summary>${esc(t('olderNews'))} (${SITE.olderNews.length})</summary>${ruNote()}<ul class="yearlist">${SITE.olderNews.map(n => `<li><b>${esc(fmtDate(n.d))}</b><span>${esc(n.t)}</span></li>`).join('')}</ul></details>` : '',
    ann: () => `${blockNote('announcements')}<div class="hgrid">${(SITE.announcements || []).map(a => hcard(esc(a.t), `<p>${esc(a.d)}</p>${a.u ? `<p><a href="${esc(a.u)}" target="_blank" rel="noopener">${esc(a.u.replace(/^https?:\/\//, '').split('/')[0])}</a></p>` : ''}`, 'd-scroll')).join('')}</div>`
  }
};
const Tabs = {
  renderBars() {
    $$('[data-tabs]').forEach(bar => {
      const hub = bar.dataset.tabs;
      bar.setAttribute('aria-label', t(HUB_T[hub]));
      /* из «Фондов» есть путь назад в каталог (из каталога в «Фонды» он уже есть): первой идёт вкладка-переход, своей панели у неё нет */
      bar.innerHTML = (hub === 'fonds' ? `<button type="button" role="tab" id="tab-fonds-catalog" data-act="tab" data-v="catalog">${esc(t('catTitle'))}</button>` : '') + HUBS[hub].map(id => `<button type="button" role="tab" id="tab-${hub}-${id}" aria-controls="tp-${hub}-${id}" data-act="tab" data-v="${hub}/${id}">${esc(t(TAB_T[id]))}</button>`).join('');
      if (!bar.parentElement.querySelector(':scope > .hub-over')) bar.insertAdjacentHTML('afterend', `<div class="hub-over" data-hub-over="${hub}" hidden></div>`);
    });
    this.sync();
  },
  ov: {},   // раздел → открыт ли его обзор (адрес без вкладки)
  sync(only) {
    (only ? [only] : Object.keys(HUBS)).forEach(h => {
      const cur = hubTab[h] || HUBS[h][0], ov = !!this.ov[h];
      $$(`[data-tabs="${h}"] [role="tab"]`).forEach(b => { const on = !ov && b.dataset.v === h + '/' + cur; b.setAttribute('aria-selected', String(on)); b.tabIndex = (ov ? b.dataset.v === h + '/' + HUBS[h][0] : on) ? 0 : -1; });
      $$(`[data-hub-panels="${h}"] > .tab-panel`).forEach(p => { p.hidden = ov || p.dataset.tab !== cur; });
      const o = $(`[data-hub-over="${h}"]`); if (o) o.hidden = !ov;
    });
  },
  hasOverview: hub => !!HUBS[hub] && HUBS[hub].length > 3,   // у раздела из двух вкладок (новости) обзор не нужен: адрес без вкладки открывает первую
  overview(hub) {
    if (!HUBS[hub]) return;
    if (!this.hasOverview(hub)) return this.select(hub, HUBS[hub][0]);
    this.ov[hub] = true; this.sync(hub);
    const o = $(`[data-hub-over="${hub}"]`); if (!o) return;
    o.innerHTML = `<h2 class="sr">${esc(t(HUB_T[hub]))}</h2><ul class="hub-cards">${hub === 'fonds' ? `<li><a class="hub-card" href="#catalog"><b>${esc(t('catTitle'))}</b><span>${esc(t('catLead'))}</span></a></li>` : ''}${HUBS[hub].map(id => { const d = HUB_D[hub + '/' + id]; return `<li><a class="hub-card" href="#${hub}/${id}"><b>${esc(t(TAB_T[id]))}</b>${d ? `<span>${esc(L(d))}</span>` : ''}</a></li>`; }).join('')}</ul>`;
  },
  select(hub, id, updateHash) {
    if (!HUBS[hub]) return;
    if (!HUBS[hub].includes(id)) id = HUBS[hub][0];
    this.ov[hub] = false;
    const prev = hubTab[hub]; hubTab[hub] = id; this.sync(hub); this.fill(hub, id);
    if (vtReady && prev && prev !== id && !RM()) { const p = document.getElementById(`tp-${hub}-${id}`); if (p) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); } }
    if (updateHash) try { history.replaceState(null, '', '#' + hub + '/' + id); } catch (e) {}
  },
  fill(hub, id) {
    OldSrc.fill(hub, id);
    const box = $(`[data-dyn="${hub}/${id}"]`); const fn = PANELS[hub] && PANELS[hub][id];
    if (!box || !fn || box.dataset.lang === lang) return;
    box.innerHTML = fn(); box.dataset.lang = lang; limitLists(box);
  },
  refresh() {
    $$('[data-dyn]').forEach(b => { b.dataset.lang = ''; });
    // собираем только открытый раздел: панели остальных соберутся при первом заходе (Tabs.select → fill). Так главная не строит тысячи лишних узлов (ТЗ 7.2)
    if (HUBS[current]) { if (this.ov[current]) this.overview(current); else this.fill(current, hubTab[current] || HUBS[current][0]); }
  }
};
document.addEventListener('keydown', e => {
  const tab = e.target.closest && e.target.closest('[role="tab"]'); if (!tab) return;
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
  const all = [...tab.parentElement.querySelectorAll('[role="tab"]')]; let i = all.indexOf(tab);
  i = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length;
  all[i].focus(); all[i].click(); e.preventDefault();
});

/* главная: «Что вам нужно?» */
function renderNeed() {
  put('#hero-try', `<span>${esc(t('searchTry'))}</span>${tryChips('search-try-home')}`);
  put('#hero-h1', t('heroTitle').split('|').map(x => `<span>${esc(x)}</span>`).join(' '));
  { const ha = $('#hero-alt'); if (ha) { ha.textContent = t('heroLead'); ha.removeAttribute('lang'); } }
  const tiles = [['#visitors/cert', 'need1'], ['#visitors/genealogy', 'need2'], ['#fonds/store', 'need3'], ['#region/essays', 'need4']];
  put('#need-grid', tiles.map(([h, a]) => `<a class="need" href="${h}"><b>${esc(t(a))}</b><span class="need-d">${esc(t(a + 'x'))}</span></a>`).join(''));
  put('#story-dates', TIMELINE.filter(x => x.key).slice(0, 4).map(x => `<li><b>${esc(L(x.y))}</b><span>${esc(L(x.t))}</span></li>`).join(''));
  { const D = SITE.districts || {}, cnt = {essays:(SITE.essays || []).reduce((n, e) => n + (e.items || []).length, 0), expo:(SITE.exhibitions || []).length, photo:(SITE.albums || []).length,
      articles:(SITE.articles || []).length + (SITE.talks || []).length, districts:(D.now || []).length + (D.gone || []).length};
    put('#region-links', HUBS.region.map(id => `<li><a href="#region/${id}"><span>${esc(t(TAB_T[id]))}</span>${cnt[id] ? `<small>${cnt[id]}</small>` : ''}</a></li>`).join('')); }
}

/* ================= полные страницы прежнего сайта (#p/ID) =================
   Тексты всех страниц старого сайта лежат в pages/c{N}.json (собирает tools/build_pages.py),
   оглавление — в SITE.pidx: [id, заголовок ru, заголовок kk, родитель, пачка, вид (p|n), дата, фото, филиал].
   Картинки и документы старого сайта идут через server.js (/old/…), он же хранит их копии на диске. */
const PIDX = new Map((SITE.pidx || []).map(r => [String(r[0]), r]));
/* машинный перевод основных страниц на английский (pages/tr.json, tools/build_translations.py): не вычитан носителем языка, над текстом стоит пометка */
let TR = {}, TR_ASKED = null;
const loadTR = () => TR_ASKED || (TR_ASKED = fetch('pages/tr.json', {cache:'no-cache'}).then(r => r.ok ? r.json() : {}).then(j => { TR = j || {}; }).catch(() => {}));   // переводы грузим, только когда выбран не русский язык
const pTitle = r => r ? ((lang === 'kz' && r[2]) || (lang === 'en' && TR[r[0]] && TR[r[0]].en && TR[r[0]].en.t) || r[1] || r[2] || '') : '';
const pKids = id => (SITE.pidx || []).filter(r => String(r[3]) === String(id) && pTitle(r));
/* какие страницы прежнего сайта показываем во вкладках разделов */
const OLD_TABS = {
  'visitors/reading':[1338], 'visitors/services':[22187, 52679, 52762, 52697], 'visitors/branches':['@branches'],
  'fonds/store':[1340], 'fonds/personal':[1352], 'fonds/db':[1350, 1926], 'fonds/pubs':[1588, 1603], 'fonds/gloss':[1478],
  'region/essays':[1354], 'region/expo':[1376, 1362], 'region/articles':[1348, 1749],
  'about/intro':[1336], 'about/history':[1332], 'about/activity':[1342], 'about/docs':['law', 52670, 32297, 42569],
  'news/news':['@news'], 'news/ann':[1479]
};
const HUB_OF = {};
Object.entries(OLD_TABS).forEach(([k, ids]) => ids.forEach(x => { if (!HUB_OF[x]) HUB_OF[x] = k; }));
const Pages = {
  cache: {},
  chunk(n) {
    if (!this.cache[n]) this.cache[n] = fetch(`pages/c${n}.json?v=${SITE.pver || ''}`)
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .catch(e => { delete this.cache[n]; throw e; });
    return this.cache[n];
  },
  get(id) { const r = PIDX.get(String(id)); return r ? Promise.all([this.chunk(r[4]), lang === 'ru' ? 0 : loadTR()]).then(([c]) => { const p = c[String(id)] || null, tr = TR[String(id)]; return p && tr ? {...p, en:tr.en || p.en, kk:tr.kk || p.kk} : p; }) : Promise.resolve(null); }
};
/* текст на языке сайта; если казахского нет — русский с пометкой */
const pBody = p => {
  const kz = lang === 'kz' && p.kk && p.kk.md;
  const en = lang === 'en' && p.en && p.en.md;   // английский: машинный перевод основных страниц, с пометкой
  const md = en ? p.en.md : kz ? p.kk.md : ((p.ru && p.ru.md) || (p.kk && p.kk.md) || '');
  return {md, note: !kz && !en && lang !== 'ru' && !!(p.ru && p.ru.md), tr: !!en};
};
/* markdown прежнего сайта: абзацы, списки, таблицы, картинки, ссылки */
function mdx(src) {
  const keep = [];
  src = String(src || '').replace(/\\([\\`*_{}\[\]()#+\-.!|>~])/g, (m, c) => `\u0000${keep.push(c) - 1}\u0000`);
  src = src.replace(/^[ \t]*\.(?:jpe?g|png|gif|webp)\)[ \t]*$/gim, '');   // хвост «.jpg)» от картинок со скобками в имени файла (артефакт выгрузки): отдельной строкой не нужен
  src = src.replace(/^\*\*([►♦•▪●])\*\*[ \t]*/gm, '$1 ');   // «**►** текст» и «► текст» — один и тот же значок списка
  const url = u => /^(#|old\/|https?:\/\/|mailto:)/i.test(u) ? u : '';
  const inline = s => s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, u) => (u = url(u)) ? `<img class="pg-img" src="${u}" alt="${alt}" loading="lazy" decoding="async">` : '')
    .replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (m, txt, u) => {
      const pm = u.match(/^https?:\/\/(?:www\.)?e-arhiv\.vko\.gov\.kz\/(\d{3,6})\/?$/); if (pm && PIDX.has(pm[1])) u = '#p/' + pm[1];   // короткий адрес статьи старого сайта → страница нового
      if (!(u = url(u))) return txt;
      const out = !u.startsWith('#'), doc = /^old\/(dl\/|nc\/|.+\.(pdf|docx?|xlsx?|xlsb|pptx?|rtf|zip|rar)$)/i.test(u);
      return `<a href="${u}"${out ? ' target="_blank" rel="noopener"' : ''}${doc ? ' class="doc"' : ''}>${txt.trim() || esc(t('pgFile'))}</a>`;
    })
    .replace(/\*\*\*([^*]+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, '$1<em>$2</em>');
  const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const sep = r => /^[|\s:-]+$/.test(r) && /-{2,}/.test(r);
  const table = rows => {
    let head = null, body = rows;
    if (rows.length > 1 && sep(rows[1])) { head = cells(rows[0]); body = rows.slice(2); }
    body = body.filter(r => !sep(r));
    return `<div class="pg-table"><table>${head ? `<thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : ''}<tbody>${body.map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  };
  const lines = esc(src).split('\n'), para = [];
  let html = '', i = 0;
  const flush = () => {
    if (!para.length) return;
    let body = para.map(inline).join('<br>'); para.length = 0;
    if (!body.replace(/<br>/g, '').trim()) return;
    if (/^(\s*\[\[yt:[\w-]+\]\]\s*(<br>)?)+$/.test(body)) { html += body.replace(/<br>/g, '').replace(/\[\[yt:([\w-]+)\]\]/g, (m, v) => `<div class="pg-video"><button type="button" class="yt" data-yt="${v}" aria-label="${esc(t('pgVideo'))}"><img src="https://i.ytimg.com/vi/${v}/hqdefault.jpg" alt="" loading="lazy" decoding="async"><span class="yt-play" aria-hidden="true"></span></button></div>`); return; }
    let hm;   // строка из одного жирного слова — подзаголовок, а не абзац; под ним может стоять пояснение
    if ((hm = body.match(/^<strong>([^<]{2,140})<\/strong>:?$/))) { html += `<h3>${hm[1].replace(/:$/, '')}</h3>`; return; }
    if ((hm = body.match(/^<strong>([^<]{2,140})<\/strong><br>([^<]{1,160})$/))) { html += `<h3>${hm[1]}</h3><p class="muted">${hm[2]}</p>`; return; }
    html += /^(\s*<img[^>]+>\s*(<br>)?)+$/.test(body) ? `<div class="pg-pics">${body.replace(/<br>/g, '')}</div>` : `<p>${body}</p>`;
  };
  const LI = /^\s*(?:[-*]\s+|\d+[.)]\s+|[•♦►▪●]\s*)/;
  while (i < lines.length) {
    const l = lines[i].trim(); let m;
    if (!l) { flush(); i++; continue; }
    if (/^\|.*\|$/.test(l)) { flush(); const rows = []; while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) rows.push(lines[i++].trim()); html += table(rows); continue; }
    if ((m = l.match(/^(#{1,6})\s+(.*)/))) { flush(); const h = m[1].length <= 2 ? 'h2' : 'h3'; html += `<${h}>${inline(m[2])}</${h}>`; i++; continue; }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(l)) { flush(); html += '<hr>'; i++; continue; }
    if ((m = l.match(/^►\s*([^\[\]]+)$/)) && !/[a-zа-яёәғқңөұүһі]/.test(m[1].replace(/&[a-z#0-9]+;/gi, ''))) { flush(); html += `<h3>${inline(m[1].trim())}</h3>`; i++; continue; }   // «► КРАЙ СОКРОВИЩ» — заголовок раздела
    if (LI.test(l)) {
      flush(); const ol = /^\d/.test(l); let items = '';
      while (i < lines.length) {
        if (LI.test(lines[i])) { items += `<li>${inline(lines[i].trim().replace(LI, ''))}</li>`; i++; continue; }
        if (!lines[i].trim() && i + 1 < lines.length && LI.test(lines[i + 1])) { i++; continue; }   // пустая строка между пунктами
        break;
      }
      html += ol ? `<ol>${items}</ol>` : `<ul>${items}</ul>`; continue;
    }
    if (/^&gt;\s?/.test(l)) {
      flush(); const q = [];
      while (i < lines.length && /^&gt;\s?/.test(lines[i].trim())) q.push(inline(lines[i++].trim().replace(/^&gt;\s?/, '')));
      html += `<blockquote>${q.join('<br>')}</blockquote>`; continue;
    }
    para.push(l); i++;
  }
  flush();
  /* оглавление из отдельных абзацев «ссылка (пояснение)» — одним списком */
  html = html.replace(/(?:<p><a [^>]*>[^<]*<\/a>[^<]*<\/p>){2,}/g, run => `<ul class="linklist">${run.replace(/<p>(<a [^>]*>[^<]*<\/a>)([^<]*)<\/p>/g, (m2, a, rest) => `<li>${a}${rest.trim() ? `<small>${rest.trim()}</small>` : ''}</li>`)}</ul>`);
  return html.replace(/\u0000(\d+)\u0000/g, (m, k) => esc(keep[+k]));
}
/* «Деятельность архива» (страница 1342): на старом сайте это сломанная таблица со звёздочками. Достаём из неё год и ссылки на файлы
   и показываем таблицей «год → план → отчёт». Названия файлов и ссылки те же, что на старом сайте, ничего не дописано. */
const PLAN_PAGE = '1342';
function planRows(md) {
  const by = new Map(), LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g, strip = s => s.replace(/[*_]+/g, '').replace(/\s+/g, ' ').trim();
  String(md || '').split('\n').forEach(line => {
    if (!/^\s*\|.*\|\s*$/.test(line)) return;
    const cells = line.trim().replace(/^\||\|$/g, '').split('|'), y = (cells[0].match(/\b(20[0-2]\d|19\d\d)\b/) || [])[1];
    const links = [...line.matchAll(LINK)].filter(m => /^old\/|^https?:\/\//i.test(m[2])).map(m => ({t:strip(m[1]), u:m[2]}));
    if (!y || !links.length) return;   // повторные строки «2025 год» без ссылок пропускаем
    const row = by.get(y) || by.set(y, {y, plan:[], report:[]}).get(y);
    links.forEach((x, i) => (i === 0 && !/отч[её]т|есеп/i.test(x.t) ? row.plan : row.report).push(x));
  });
  return [...by.values()].sort((a, b) => b.y - a.y);
}
function planHtml(md) {
  const rows = planRows(md); if (!rows.length) return '';
  const ext = u => ((decodeURIComponent(u).match(/\.([a-z0-9]{2,5})$/i) || [])[1] || '').toUpperCase();
  const link = (x, label) => `<a class="doc" href="${esc(x.u)}" target="_blank" rel="noopener" title="${esc(x.t)}">${esc(label)}${ext(x.u) ? ` <small>${esc(ext(x.u))}</small>` : ''}</a>`;
  const cell = (list, key) => list.length ? list.map((x, i) => link(x, t(key) + (list.length > 1 ? ' ' + (i + 1) : ''))).join('') : `<span class="none" data-l="${esc(t(key))}">${esc(t('planNone'))}</span>`;
  return `<table class="plans"><caption class="sr">${esc(t('planCap'))}</caption><thead><tr><th scope="col">${esc(t('planYear'))}</th><th scope="col">${esc(t('planL'))}</th><th scope="col">${esc(t('reportL'))}</th></tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${esc(r.y)}</th><td data-l="${esc(t('planL'))}">${cell(r.plan, 'planL')}</td><td data-l="${esc(t('reportL'))}">${cell(r.report, 'reportL')}</td></tr>`).join('')}</tbody></table>`;
}
/* «Издания»: две страницы старого сайта пришли сплошным текстом. Доклады (ссылка, под ней автор) показываем списком «название — автор»,
   видеоматериалы (подпись ♦ и ролик YouTube) — сеткой по группам. Слова те же, что на старом сайте. */
const REPORT_PAGES = ['1588', '1749'], VIDEO_PAGE = '1603';   // доклады, информации и выступления: ссылка, под ней автор
/* дочерние страницы, которых нет в тексте самой страницы: те, что в тексте есть ссылкой, второй раз не перечисляем */
const restKids = (kids, md) => { const s = String(md || ''); return kids.filter(k => !s.includes('#p/' + k[0] + ')') && !s.includes('vko.gov.kz/' + k[0] + ')')); };
function reportRows(md) {
  const rows = [], lines = String(md || '').split('\n').map(s => s.trim()).filter(Boolean), clean = s => s.replace(/[*_]+/g, '').replace(/\s+/g, ' ').trim();
  lines.forEach((l, i) => {
    const m = l.match(/^[►▶•♦\-\s]*\[([^\]]+)\]\(([^)\s]+)\)\s*$/);
    if (m && /^(#|old\/|https?:\/\/)/i.test(m[2])) rows.push({t:clean(m[1]), u:m[2], a:lines[i + 1] && !/\]\(/.test(lines[i + 1]) ? clean(lines[i + 1]) : ''});
  });
  return rows;
}
function reportsHtml(md) {
  const rows = reportRows(md);
  return rows.length ? `<ul class="reps">${rows.map(r => `<li><a href="${esc(r.u)}">${esc(r.t)}</a>${r.a ? `<small>${esc(r.a)}</small>` : ''}</li>`).join('')}</ul>` : '';
}
function videoGroups(md) {
  const groups = [{t:'', d:[], v:[]}], last = () => groups[groups.length - 1]; let cap = '';
  String(md || '').split('\n').forEach(raw => {
    const l = raw.trim(); if (!l || /^!\[/.test(l)) return;
    const yt = l.match(/^\[\[yt:([\w-]+)\]\]$/);
    if (yt) { last().v.push({id:yt[1], c:cap}); cap = ''; return; }
    const txt = l.replace(/[*_]+/g, '').replace(/^[♦►•\-\/\s]+|[\/\s]+$/g, '').replace(/\s+/g, ' ').trim(); if (!txt) return;   // «**» и пустые обрывки со старого сайта пропускаем
    const bullet = /^[♦►•]/.test(l);
    if (!bullet && /^\*\*[^*].*\*\*$/.test(l)) { groups.push({t:txt.replace(/:$/, ''), d:[], v:[]}); cap = ''; return; }
    if (!bullet && !last().v.length && last().t) { last().d.push(txt); return; }
    cap = cap ? cap + ' ' + txt : txt;
  });
  return groups.filter(g => g.v.length);
}
function videosHtml(md) {
  const gs = videoGroups(md); if (!gs.length) return '';
  const cards = gs.flatMap(g => g.v.map((v, i) => `<li><div class="pg-video"><button type="button" class="yt" data-yt="${esc(v.id)}" aria-label="${esc(t('pgVideo'))}"><img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy" decoding="async"><span class="yt-play" aria-hidden="true"></span></button></div>${g.t ? `<b>${esc(g.t)}</b>` : ''}${v.c || g.v.length > 1 ? `<p>${esc(v.c || t('vidPart') + ' ' + (i + 1))}</p>` : ''}</li>`));
  return `<ul class="vgrid">${cards.join('')}</ul>`;
}
/* начало длинного текста: целыми абзацами */
function cutMd(md, n) {
  const out = []; let len = 0;
  for (const b of md.split(/\n{2,}/)) { out.push(b); len += b.replace(/!\[[^\]]*\]\([^)]*\)/g, '').length; if (len > n) break; }
  return out.join('\n\n');
}
function pageRow(r) {
  return `<a class="prow" href="#p/${esc(r[0])}"><span>${esc(pTitle(r))}</span>${r[7] ? `<svg class="ic" aria-label="${esc(t('pgHasPhoto'))}" role="img"><use href="#d-camera"/></svg>` : ''}${r[6] ? `<small>${esc(fmtDate(r[6]))}</small>` : ''}</a>`;
}
function pageList(key, rows) {
  if (!rows.length) return '';
  return rows.length > 12 ? flist('pg-' + key, rows, pageRow, r => pTitle(r) + ' ' + (r[6] || ''))
    : `<ul class="plist">${rows.map(r => `<li>${pageRow(r)}</li>`).join('')}</ul>`;
}
function newsAll() {
  const rows = (SITE.pidx || []).filter(r => r[5] === 'n' && pTitle(r)).sort((a, b) => String(b[6]).localeCompare(String(a[6])));
  return rows.length ? `<h2>${esc(fmt(t('pgAllNews'), {n:rows.length}))}</h2>${flist('pg-news', rows, pageRow, r => pTitle(r) + ' ' + r[6])}` : '';
}
function branchPages() {
  const B = SITE.branchNames || {}, by = {};
  (SITE.pidx || []).forEach(r => { if (r[8] && pTitle(r) && !(PIDX.get(String(r[3])) || [])[8]) (by[r[8]] = by[r[8]] || []).push(r); });
  const keys = Object.keys(B).filter(k => by[k]);
  return keys.length ? `<h2>${esc(t('pgBranches'))}</h2><div class="pg-branches">${keys.map(k => `<div><h3>${esc(B[k])}</h3><ul class="plist">${by[k].map(r => `<li>${pageRow(r)}</li>`).join('')}</ul></div>`).join('')}</div>` : '';
}
/* блоки прежнего сайта во вкладках разделов */
const OLD_FOLD = {'visitors/reading':'rdRulesT', 'visitors/services':'svcMoreT', 'about/docs':'docsMoreT', 'about/intro':'introMoreT', 'about/history':'histMoreT'};
const OLD_DROP = {'fonds/pubs':[1588]};   // доклады теперь в «Архиве памяти → Публикации и воспоминания» (там все 11 и с фильтрами)
const OLD_SKIP = new Set(['fonds/store', 'fonds/personal', 'fonds/db', 'fonds/gloss']);   // эти вкладки собраны блоками из данных сайта; страницы прежнего сайта (HUB_OF для хлебных крошек остаётся) второй раз не подмешиваем
const FondsFiles = {
  fill() {
    const box = $('#fonds-files-box'); if (!box || !PIDX.size) return;
    Pages.get('1340').then(p => {
      const md = (p && ((p.ru && p.ru.md) || (p.kk && p.kk.md))) || '', seen = new Set(), rows = [];
      for (const m of md.matchAll(/\[\*{0,2}([^\]]+?)\*{0,2}\]\((old\/[^)\s]+)\)/g)) { if (seen.has(m[2])) continue; seen.add(m[2]); rows.push([m[1].replace(/\*+/g, '').trim(), m[2]]); }
      const ul = $('#fonds-files'); if (!ul || !rows.length) return;
      ul.innerHTML = rows.map(([n, u]) => `<li><a class="bl-card bl-file" href="${esc(u)}" target="_blank" rel="noopener"><i class="bl-ext">${esc((u.match(/\.(\w{2,5})$/) || [0, 'FILE'])[1].toUpperCase())}</i><b>${esc(n)}</b></a></li>`).join('');
      box.hidden = false;
    }).catch(() => {});
  }
};
const OldSrc = {
  fill(hub, id) {
    if (OLD_SKIP.has(hub + '/' + id)) return;
    const ids = (OLD_TABS[hub + '/' + id] || []).filter(x => !((OLD_DROP[hub + '/' + id] || []).includes(x))), panel = document.getElementById(`tp-${hub}-${id}`);
    if (!ids.length || !panel || !PIDX.size) return;
    let box = panel.querySelector(':scope > .oldsrc, :scope > .oldfold > .oldsrc');
    if (!box) {
      box = document.createElement('div'); box.className = 'oldsrc';
      if (OLD_FOLD[hub + '/' + id]) { const d = document.createElement('details'); d.className = 'oldfold'; d.innerHTML = `<summary></summary>`; d.appendChild(box); panel.appendChild(d); }   // длинные нормативные тексты — под заголовком, раскрываются по клику
      else panel.appendChild(box);
    }
    const fold = box.parentNode.classList.contains('oldfold') ? box.parentNode.firstChild : null; if (fold) fold.textContent = t(OLD_FOLD[hub + '/' + id]);
    if (box.dataset.lang === lang) return;
    box.dataset.lang = lang;
    box.innerHTML = ids.map(x => `<section class="oldsec" data-old="${esc(x)}"></section>`).join('');
    box.querySelectorAll('.oldsec').forEach(sec => this.one(sec, sec.dataset.old));
  },
  async one(sec, x) {
    if (x === '@news') { sec.innerHTML = newsAll(); limitLists(sec); return; }
    if (x === '@branches') { sec.innerHTML = branchPages(); return; }
    const r = PIDX.get(String(x)); if (!r) return;
    const kids = pKids(x), l = lang;
    let p = null; try { p = await Pages.get(x); } catch (e) {}
    if (l !== lang) return;
    const b = p ? pBody(p) : {md:'', note:false}, plans = String(x) === PLAN_PAGE ? planHtml(b.md) : '';
    const rich = plans || (REPORT_PAGES.includes(String(x)) ? reportsHtml(b.md) : String(x) === VIDEO_PAGE ? videosHtml(b.md) : ''), long = !rich && b.md.length > 1800;
    if (rich && !plans) {   // доклады и видео: заголовок со счётчиком и готовая вёрстка вместо сплошного текста
      sec.innerHTML = `<h2><a href="#p/${esc(r[0])}">${esc(pTitle(r))}</a> <small class="cnt">${REPORT_PAGES.includes(String(x)) ? reportRows(b.md).length : videoGroups(b.md).reduce((n, g) => n + g.v.length, 0)}</small></h2>${b.note ? ruNote() : b.tr ? trNote() : ''}${rich}`;
      limitLists(sec); return;
    }
    sec.innerHTML = `<h2><a href="#p/${esc(r[0])}">${esc(pTitle(r))}</a></h2>${b.note ? ruNote() : b.tr ? trNote() : ''}
      ${plans ?`<div class="prose pg-body">${mdx(b.md.split('\n').filter(l => !/^\s*\|/.test(l)).join('\n'))}</div>${plans}` : b.md ? `<div class="prose pg-body">${mdx(long ? cutMd(b.md, 1100) : b.md)}</div>` : ''}
      ${long ? `<p><a class="more-link" href="#p/${esc(r[0])}">${esc(t('pgRead'))}<svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a></p>` : ''}
      ${pageList(String(x), restKids(kids, long ? cutMd(b.md, 1100) : b.md))}
      ${!p && !kids.length ? `<p class="muted">${esc(t('pgOffline'))}</p>` : ''}`;
    limitLists(sec);
  }
};
/* отдельная страница */
const Page = {
  id: null,
  crumbs(id) {
    const chain = []; let r = PIDX.get(String(id)), g = 0;
    while (r && g++ < 8) { chain.unshift(r); r = r[3] ? PIDX.get(String(r[3])) : null; }
    const top = chain[0], tab = top && (HUB_OF[String(top[0])] || (top[5] === 'n' ? 'news/news' : ''));
    const items = [`<li><a href="#home">${esc(t('navHome'))}</a></li>`];
    if (tab) { const [h, k] = tab.split('/'); items.push(`<li><a href="#${tab}">${esc(t(HUB_T[h]))}: ${esc(t(TAB_T[k]))}</a></li>`); }
    chain.slice(0, -1).forEach(c => items.push(`<li><a href="#p/${esc(c[0])}">${esc(pTitle(c))}</a></li>`));
    return `<ol>${items.join('')}</ol>`;
  },
  async open(id) {
    id = String(id); this.id = id;
    const r = PIDX.get(id), box = $('#pg'); if (!box) return;
    $('#pg-crumbs').setAttribute('aria-label', t('crumbsL'));
    $('#pg-crumbs').innerHTML = this.crumbs(id);
    if (!r) { box.innerHTML = `<h1>${esc(t('pgNotFound'))}</h1><p><a href="#home">${esc(t('navHome'))}</a></p>`; return; }
    box.innerHTML = `<h1>${esc(pTitle(r))}</h1><p class="muted">${esc(t('loading'))}</p>`;
    let p = null; try { p = await Pages.get(id); } catch (e) {}
    if (this.id !== id) return;
    const kids = pKids(id), src = p ? p.u : `http://e-arhiv.vko.gov.kz/ru/Page/Index/${id}`;
    const b = p ? pBody(p) : {md:'', note:false}, B = SITE.branchNames || {};
    box.innerHTML = `${r[6] ? `<p class="news-date">${esc(fmtDate(r[6]))}</p>` : ''}<h1>${esc(pTitle(r))}</h1>
      ${p && p.b && B[p.b[0]] ? `<p class="eyebrow">${esc(fmt(t('pgBranchOf'), {b:B[p.b[0]]}))}</p>` : ''}${b.note ? ruNote() : b.tr ? trNote() : ''}
      ${id === PLAN_PAGE && planHtml(b.md) ? `<div class="prose pg-body">${mdx(b.md.split('\n').filter(l => !/^\s*\|/.test(l)).join('\n'))}</div>${planHtml(b.md)}` : b.md ? `<div class="prose pg-body">${mdx(b.md)}</div>` : (p ? (kids.length ? '' :`<p class="muted">${esc(t('pgEmpty'))}</p>`) : `<p class="muted">${esc(t('pgOffline'))}</p>`)}
      ${restKids(kids, b.md).length ? `<h2>${esc(t('pgKids'))}</h2>${pageList(id, restKids(kids, b.md))}` : ''}
      <p class="pg-src"><a href="${esc(src)}" target="_blank" rel="noopener">${esc(t('oldPage'))}</a></p>`;
    limitLists(box);
  }
};
if (PIDX.size) {
  /* списки, которые теперь строятся из страниц прежнего сайта со ссылками, не дублируем */
  PANELS.region.essays = () => '';
  PANELS.news.news = () => '';
  PANELS.about.activity = () => orgReports();   // годы без ссылок заменила таблица планов и отчётов со ссылками на файлы
  PANELS.region.articles = () => { const AP = SITE.articlePhotos || []; return AP.length ? `<h2>${esc(t('artPhotosT'))}</h2><ul class="ph-grid">${AP.map((a, i) => phCard('lb-art', i, a.th, L(a.t), a.ph.length)).join('')}</ul>` : ''; };
}
/* фото в тексте открываются в просмотрщике; битые картинки старого сайта прячем */
document.addEventListener('click', e => {
  const img = e.target.closest && e.target.closest('img.pg-img'); if (!img) return;
  const root = img.closest('.pg, .oldsec') || document, imgs = [...root.querySelectorAll('img.pg-img')].filter(x => !x.hidden);
  const h = root.querySelector('h1, h2');
  LB.open(imgs.map(x => x.alt ? {s:x.currentSrc || x.src, c:{ru:x.alt}} : {s:x.currentSrc || x.src}), h ? h.textContent.trim() : '', '', Math.max(0, imgs.indexOf(img)));
});
document.addEventListener('error', e => { const el = e.target; if (el && el.classList && el.classList.contains('pg-img')) el.hidden = true; }, true);
/* видео с прежнего сайта: сначала картинка, плеер YouTube загружается только по нажатию */
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('button.yt'); if (!b) return;
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.yt)}?autoplay=1&rel=0`;
  f.title = t('pgVideo'); f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.loading = 'lazy';
  b.replaceWith(f);
});

/* поиск по сайту */
const Search = {
  idx: null,
  build() {
    const r = []; const add = (t_, x, h, k) => r.push({t:String(t_ || ''), x:String(x || ''), h, k});
    /* результат должен вести на сам материал, а не на вкладку раздела: название сопоставляем со страницами старого сайта (#p/…) и выставками (#expo/…);
       если такой страницы нет, остаётся вкладка раздела */
    const nn = s => norm(String(s || '')).replace(/\([^)]*\)/g, ' ').replace(/[^a-zа-яәғқңөұүһі0-9]+/g, ' ').trim();
    const PT = new Map(), EX = new Map(), used = new Set();
    (SITE.pidx || []).forEach(p => [p[1], p[2]].forEach(tt => { const k = nn(tt); if (k && !PT.has(k)) PT.set(k, p[0]); }));
    ((this.expo && this.expo.items) || []).forEach(x => { const k = nn(x.t && (x.t.ru || x.t.kk)); if (k && !EX.has(k)) EX.set(k, x.id); });
    const near_ = (map, k) => { if (map.has(k)) return map.get(k); if (k.length >= 14) for (const [pk, id] of map) if (pk.length >= 14 && (pk.includes(k) || k.includes(pk))) return id; return null; };
    const addP = (t_, x, h, k) => {
      const k2 = nn(t_), eid = k2 && near_(EX, k2), pid = PIDX.size && k2 ? near_(PT, k2) : null;
      if (eid) add(t_, x, '#expo/' + eid, k);
      else if (pid) { used.add(String(pid)); add(t_, x, '#p/' + pid, k); }
      else add(t_, x, h, k);
    };
    Object.keys(HUBS).forEach(hub => HUBS[hub].forEach(id => add(t(TAB_T[id]), t(HUB_T[hub]), '#' + hub + '/' + id, t(HUB_T[hub]))));
    Object.keys(VTXT).forEach(k => { if (!/H$/.test(k) && VTXT[k + 'H']) { const tab = {cert:'cert', stazh:'cert', dist:'cert', genea:'genealogy', read:'reading', serv:'services'}[k]; add(L(VTXT[k + 'H']), vsub(k).replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'), '#visitors/' + tab, t('navVisitors')); } });
    add(L(VTXT.stazhH), vsub('stazh').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'), '#visitors/cert', t('navVisitors'));
    faqItems().forEach(f => add(L(f.q), f.html.replace(/<[^>]+>/g, ' '), '#visitors/faq', t('tFaq')));
    (SITE.branches || []).forEach(b => add(b.n, [b.a, 'тел. ' + (b.p || []).join(', '), b.z, b.head].filter(Boolean).join(' · '), '#visitors/branches', t('tBranches')));
    blds().forEach(b => add(L(b.n) || b.a, [b.a, b.p.join(', ')].filter(Boolean).join(' · '), '#visitors/branches', t('tBranches')));
    (SITE.fondsGroups || []).forEach(g => add(g.t, g.d, '#fonds/store', t('tStore')));
    (SITE.personal || []).forEach(p => addP(p.n, (p.d || '') + ' ' + p.s, '#fonds/personal', t('tPersonal')));
    (SITE.databases || []).forEach(d => add(d.t, d.d, '#fonds/db', t('tDb')));
    PUBS.forEach(p => add(L(p.t), L(p.x), '#fonds/pubs', t('tPubs')));
    (SITE.gloss || []).forEach(g => add(g.t, g.d, '#fonds/gloss', t('tGloss')));
    (SITE.essays || []).forEach(e => e.items.forEach(x => addP(x, e.t, '#region/essays', t('tEssays'))));
    (SITE.exhibitions || []).forEach(x => addP(x, '', '#region/expo', t('tExpo')));
    (SITE.albums || []).forEach(x => addP(x, '', '#region/photo', t('tPhoto')));
    (SITE.articles || []).concat(SITE.talks || []).forEach(x => addP(x.t, x.a, '#region/articles', t('tArticles')));
    ((SITE.districts && SITE.districts.now) || []).concat((SITE.districts && SITE.districts.gone) || []).forEach(x => add(x, '', '#region/districts', t('tDistricts')));
    TIMELINE.forEach(x => add(L(x.t), L(x.y) + ' ' + L(x.x), '#about/history', t('tHistory')));
    (SITE.history || []).forEach(h => add(h[0] + ': ' + h[1].slice(0, 60), h[1], '#about/history', t('tHistory')));
    orgLeaders().forEach(p => add(p.n, p.r + ' ' + p.p, '#about/team', t('tTeam')));
    orgStaff().forEach(p => add(p.n, [p.r, p.p, p.e].filter(Boolean).join(' '), '#about/team', t('tTeam')));
    (SITE.laws || []).forEach(x => add(x.t, x.d, '#about/docs', t('tDocs')));
    add(t('tActivity'), (SITE.reports || []).map(r => r.y).join(' ') + ' ' + t('planY') + ' ' + t('reportY'), '#about/activity', t('navAbout'));
    newsSorted().forEach(n => { const m = String(n.id || '').match(/^old-(\d+)$/); if (m && PIDX.has(m[1])) { used.add(m[1]); add(L(n.title), L(n.text), '#p/' + m[1], t('tNews')); } else add(L(n.title), L(n.text), '#news/news', t('tNews')); });
    if (PIDX.size) (SITE.pidx || []).forEach(r => { const tt = pTitle(r); if (tt && !used.has(String(r[0]))) add(tt, r[6] || '', '#p/' + r[0], r[5] === 'n' ? t('tNews') : t('pgOldT')); });
    else (SITE.olderNews || []).forEach(n => add(n.t, n.d, '#news/news', t('tNews')));
    (SITE.announcements || []).forEach(a => add(a.t, a.d, '#news/ann', t('tAnn')));
    add(t('navContacts'), L(S().address) + ' ' + S().phones.join(' ') + ' ' + (S().email || ''), '#contacts', t('navContacts'));
    return r.map(x => Object.assign(x, {nt:norm(x.t), nx:norm(x.x)}));
  },
  terms(q) {
    const words = norm(q).split(/[^a-zа-яәғқңөұүһі0-9]+/i).filter(w => (w.length > 2 || /^\d{2,}$/.test(w)) && !STOP.has(w));
    return words.map(w => w.length > 5 ? w.slice(0, w.length - 2) : w);
  },
  query(q, n) {
    if (!this.idx) this.idx = this.build();
    const stems = this.terms(q);
    if (!stems.length) return [];
    const need = Math.ceil(stems.length / 2);
    const pass = fuzzy => {
      const res = [];
      this.idx.forEach(x => {
        let sc = 0, hit = 0;
        stems.forEach(st => {
          if (x.nt.includes(st)) { sc += 3; hit++; }
          else if (x.nx.includes(st)) { sc += 1; hit++; }
          else if (fuzzy && st.length >= 5 && near(st, x.toks || (x.toks = toksOf(x.nt + ' ' + x.nx)))) { sc += 0.5; hit++; }
        });
        if (hit && hit >= need) res.push({x, sc: sc + hit * 2});
      });
      return res;
    };
    let res = pass(false);
    if (res.length < 3) { const seen = new Set(res.map(r => r.x)); res = res.concat(pass(true).filter(r => !seen.has(r.x))); }   // опечатки — только если точных совпадений мало
    return res.sort((a, b) => b.sc - a.sc).slice(0, n || 12).map(r => Object.assign({score:r.sc}, r.x));
  },
  last: null, q: '',
  open(q) {
    const d = $('#search-dlg'); if (d.hidden) this.last = document.activeElement;
    if (!this.expo && typeof TZD !== 'undefined') TZD.get('expo').then(e => { this.expo = e; this.idx = null; if (!$('#search-dlg').hidden) this.render($('#search-q').value); }).catch(() => {});   // выставки нужны, чтобы вести результат на саму выставку
    d.hidden = false; $('#site-nav').classList.remove('open'); $('#menu-btn').setAttribute('aria-expanded', 'false');
    const inp = $('#search-q'); inp.value = q || ''; this.render(inp.value); setTimeout(() => inp.focus(), 20);
  },
  close(keepFocus) {
    const d = $('#search-dlg'); if (d.hidden) return; d.hidden = true;
    if (!keepFocus && this.last && this.last.focus) this.last.focus();
  },
  go(href) {
    const q = this.q; this.close(true);
    if (location.hash === href) onHash(); else location.hash = href;
    setTimeout(() => {
      const m = href.match(/^#(\w+)\/(\w+)$/); if (!m) return;
      const inp = $(`[data-dyn="${m[1]}/${m[2]}"] [data-filter]`); if (!inp) return;
      inp.value = q; inp.dispatchEvent(new Event('input', {bubbles:true}));
      if (inp.closest('.flist').querySelector('.fnone').hidden === false) { inp.value = ''; inp.dispatchEvent(new Event('input', {bubbles:true})); }
    }, 30);
  },
  render(q) {
    this.q = q.trim();
    const qq = this.q, list = qq ? this.query(qq, 20) : [], st = this.terms(qq);
    $('#search-count').textContent = qq ? fmt(t('found'), {n:list.length}) : '';
    const ask = `<li class="search-more">${list.length ? '' : `<span>${esc(t('searchNone'))}</span>`}<div class="btn-row">
      <button type="button" class="btn sm" data-act="search-ask"><svg class="ic"><use href="#i-chat"/></svg>${esc(fmt(t('searchAsk'), {q:qq.length > 40 ? qq.slice(0, 40) + '…' : qq}))}</button></div></li>`;
    put('#search-res', !qq ? `<li class="search-tips">${tryChips('search-try')}</li>` :
      list.map(r => `<li><a href="${esc(r.h)}" data-act="search-go"><span class="k">${esc(r.k)}</span><b>${hl(r.t, st)}</b>${r.x && r.x !== r.k ? `<small>${hl(snip(r.x, st), st)}</small>` : ''}</a></li>`).join('') + ask +
      (list.length ? '' : `<li class="search-tips">${tryChips('search-try')}</li>`));
  }
};
/* опечатки: расстояние Левенштейна с ранним выходом */
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({length:b.length + 1}, (_, k) => k);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let k = 1; k <= b.length; k++) { cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1)); if (cur[k] < best) best = cur[k]; }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
const toksOf = x => [...new Set(x.split(/[^a-zа-яәғқңөұүһі0-9]+/i).filter(w => w.length >= 4))];
function near(st, toks) {
  const max = st.length >= 8 ? 2 : 1;
  return toks.some(w => { for (let d = -1; d <= 1; d++) { const p = w.slice(0, st.length + d); if (p.length >= 4 && lev(st, p, max) <= max) return true; } return false; });
}
/* подсветка найденного: границы считаются по norm(), длина строки та же */
function hl(text, stems) {
  const n = norm(text); const marks = [];
  stems.forEach(st => { let k = n.indexOf(st); while (k >= 0 && marks.length < 30) { let e = k + st.length; while (e < n.length && /[a-zа-яәғқңөұүһі0-9]/i.test(n[e])) e++; marks.push([k, e]); k = n.indexOf(st, e); } });
  marks.sort((a, b) => a[0] - b[0]);
  let out = '', pos = 0;
  marks.forEach(([a, b]) => { if (a < pos) return; out += esc(text.slice(pos, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>'; pos = b; });
  return out + esc(text.slice(pos));
}
/* фрагмент текста вокруг первого совпадения */
function snip(text, stems) {
  const n = norm(text); let k = -1;
  stems.forEach(st => { const p = n.indexOf(st); if (p >= 0 && (k < 0 || p < k)) k = p; });
  if (text.length <= 150) return text;
  let a = k < 0 ? 0 : Math.max(0, k - 50); if (a > 0) { const sp = text.lastIndexOf(' ', a); a = sp > 0 ? sp + 1 : a; }
  const piece = text.slice(a, a + 150);
  return (a > 0 ? '…' : '') + piece + (a + 150 < text.length ? '…' : '');
}
const TRY = {ru:['справка о стаже', 'читальный зал', 'Риддер', 'коллективизация', 'писатель'], kz:['өтіл туралы анықтама', 'оқу залы', 'Риддер', 'ұжымдастыру'], en:['employment certificate', 'reading room', 'Ridder', 'collectivisation']};
const tryChips = act => (TRY[lang] || TRY.ru).slice(0, 4).map(x => `<button type="button" class="chip" data-act="${act}" data-v="${esc(x)}">${esc(x)}</button>`).join('');
const STOP = new Set(['где','как','что','это','для','или','мне','мой','моя','про','при','его','ее','её','кто','чем','когда','какой','какие','есть','нужно','надо','можно','архив','архива','архиве','вас','ваш','the','and','what','where','how','қалай','қайда','бар','керек']);
document.addEventListener('input', e => { if (e.target && e.target.id === 'search-q') Search.render(e.target.value); });

/* ================= появление блоков при прокрутке ================= */
const Reveal = {
  io: null,
  init() {
    return;   // без появления блоков при прокрутке: одно движение — на первом экране
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); this.io.unobserve(e.target); } }), {rootMargin:'0px 0px -6% 0px', threshold:.06});
    this.scan();
  },
  scan() {
    if (!this.io) return;
    $$('.view:not([hidden]) :is(.sec-head, .fact, .need, .story > *, .news-mini li, .map-full, .page-head, .hub-tabs, .tab-panel:not([hidden]) > *, .contact-card, .map-col)').forEach(el => {
      if (el.classList.contains('rv')) return;
      const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty('--d', Math.min(sib, 5)); el.classList.add('rv'); this.io.observe(el);
    });
  }
};
const RM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* сложная геометрия: розетка-шаңырақ — окружности, 36 лучей, восьмиконечная звезда, звёзды {12/5} и {16/7}, уықтар */
function geoSVG(cls) {
  const T = Math.PI * 2, P = (r, a) => (r * Math.cos(a)).toFixed(2) + ' ' + (r * Math.sin(a)).toFixed(2);
  let k = 0, h = '';
  const el = (tag, a) => `<${tag} ${a} pathLength="100" style="--k:${k++}"/>`;
  [100, 93, 79, 62, 45, 28, 15].forEach(r => { h += el('circle', `r="${r}"`); });
  let sp = ''; for (let i = 0; i < 36; i++) { const a = i * T / 36; sp += `M${P(28, a)}L${P(93, a)}`; } h += el('path', `d="${sp}"`);
  h += el('rect', 'x="-62" y="-62" width="124" height="124"') + el('rect', 'x="-62" y="-62" width="124" height="124" transform="rotate(45)"');
  const star = (n, step, r) => { let d = ''; for (let i = 0; i < n; i++) d += (i ? 'L' : 'M') + P(r, ((i * step) % n) * T / n - T / 4); return el('path', `d="${d}Z"`); };
  h += star(12, 5, 79) + star(16, 7, 45);
  [0, 60, 120].forEach(rot => { h += el('path', `d="M-93 0A132 132 0 0 1 93 0A132 132 0 0 1 -93 0" transform="rotate(${rot})"`); });
  return `<svg class="geo ${cls}" viewBox="-104 -104 208 208" aria-hidden="true" focusable="false"><g class="geo-spin">${h}</g></svg>`;
}
/* панорамы кодом: хребты Алтая с Иртышом (линии рельефа) и архивные стеллажи */
function rng(seed) { let x = seed % 2147483647; if (x <= 0) x += 2147483646; return () => (x = x * 16807 % 2147483647) / 2147483647; }
function altaiSVG(seed, light) {
  const W = 1600, H = 600, r = rng(seed), f = n => n.toFixed(1), T = 6.2832;
  const C = light ? {sky:['#FBF8F2', '#F1E8D8', '#E6D7BB'], fills:['#E9DFCC', '#DED0B6', '#D0BE9C', '#C2AC84', '#B39B70'], line:'#8F6E33', river:'#7A5C26', sun:'#B08D4A', lo:.62}
                  : {sky:['#0B0A08', '#231C12', '#3A2E1B'], fills:['#2B2418', '#221C13', '#1A150F', '#13100B', '#0D0B08'], line:'#C9A24A', river:'#E2C27A', sun:'#C9A24A', lo:.72};
  const ridge = (base, amp) => { const ph = [0, 0, 0, 0, 0].map(() => r() * T), pts = [];
    for (let i = 0; i <= 200; i++) { const x = i / 200;
      const y = base - amp * (.5 * Math.sin(x * T * 1.1 + ph[0]) + .28 * Math.sin(x * T * 2.7 + ph[1]) + .14 * Math.sin(x * T * 6.1 + ph[2]) + .06 * Math.sin(x * T * 14 + ph[3]) + .03 * Math.sin(x * T * 31 + ph[4]));
      pts.push(f(x * W) + ' ' + f(y)); } return 'M' + pts.join('L'); };
  let g = '';
  [[250, 130], [320, 118], [390, 100], [455, 80], [522, 56]].forEach(([b, a], i) => { const c = C.fills[i];
    const top = ridge(b, a);
    g += `<path d="${top}L${W} ${H}L0 ${H}Z" fill="${c}"/><path d="${top}" fill="none" stroke="${C.line}" stroke-opacity="${(C.lo - i * .1).toFixed(2)}"/>`;
    for (let k = 1; k <= 3; k++) g += `<path d="${top}" transform="translate(0 ${k * 13})" fill="none" stroke="${C.line}" stroke-opacity="${(.2 - i * .02 - k * .035).toFixed(2)}"/>`;
  });
  g += `<path d="M-20 574C260 540 470 592 760 557S1250 528 1620 562" fill="none" stroke="${C.river}" stroke-opacity=".85" stroke-width="1.6"/>`;
  const id = `alt-sky-${seed}-${light ? 'l' : 'd'}`;
  return `<svg class="fallback pano-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky[0]}"/><stop offset=".55" stop-color="${C.sky[1]}"/><stop offset="1" stop-color="${C.sky[2]}"/></linearGradient></defs>`
    + `<rect width="${W}" height="${H}" fill="url(#${id})"/><g fill="none" stroke="${C.sun}" stroke-opacity=".5"><circle cx="1160" cy="186" r="74"/><circle cx="1160" cy="186" r="50"/></g><g stroke-width="1">${g}</g></svg>`;
}
function shelvesSVG(seed, light) {
  const W = 1600, H = 600, r = rng(seed), f = n => n.toFixed(1); let g = '';
  const C = light ? {bg:'#F3EEE5', box:'#FCFAF6', line:'#9C7B3E', rail:'#E4DACA', vig:'#C9B48A', vo:.35} : {bg:'#0E0C09', box:'#16130E', line:'#C9A24A', rail:'#0B0907', vig:'#000', vo:.8};
  [92, 206, 320, 434, 548].forEach(y => {
    let x = -10;
    while (x < W) {
      if (r() < .05) { x += 24 + r() * 46; continue; }
      const box = r() < .3, w = box ? 36 + r() * 22 : 12 + r() * 14, h = box ? 66 + r() * 14 : 74 + r() * 22;
      g += `<rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" fill="${C.box}" stroke="${C.line}" stroke-opacity="${(.3 + r() * .25).toFixed(2)}"/>`;
      if (box) g += `<rect x="${f(x + 7)}" y="${f(y - h + 13)}" width="${f(w - 14)}" height="11" fill="none" stroke="${C.line}" stroke-opacity=".55"/>`;
      else if (r() < .55) g += `<path d="M${f(x + 2)} ${f(y - h + 11)}H${f(x + w - 2)}M${f(x + 2)} ${f(y - 12)}H${f(x + w - 2)}" stroke="${C.line}" stroke-opacity=".42"/>`;
      x += w + (r() < .85 ? 2 : 9);
    }
    g += `<path d="M0 ${y + 2}H${W}" stroke="${C.line}" stroke-opacity=".6"/><rect x="0" y="${y + 3}" width="${W}" height="12" fill="${C.rail}"/>`;
  });
  for (let x = 0; x <= W; x += 400) g += `<rect x="${x - 5}" y="0" width="10" height="${H}" fill="${C.rail}" stroke="${C.line}" stroke-opacity=".35"/>`;
  const id = `sh-v-${seed}-${light ? 'l' : 'd'}`;
  return `<svg class="fallback pano-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="${W}" height="${H}" fill="${C.bg}"/><g stroke-width="1">${g}</g>`
    + `<defs><radialGradient id="${id}" cx=".5" cy=".45" r=".75"><stop offset=".3" stop-color="${C.vig}" stop-opacity="0"/><stop offset="1" stop-color="${C.vig}" stop-opacity="${C.vo}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/></svg>`;
}
const Pano = {
  mode: '',
  init() {
    return;   // панорамы кодом выключены: шапки разделов — чистая типографика
    const light = document.documentElement.dataset.scheme !== 'dark'; this.mode = light ? 'l' : 'd';
    $$('.pano').forEach(p => { const ph = p.querySelector('.ph'); if (!ph) return; const old = ph.querySelector('svg.fallback');
      const shown = !old || old.style.display !== 'none'; if (old) old.remove();
      ph.insertAdjacentHTML('afterbegin', p.dataset.shelves ? shelvesSVG(+p.dataset.shelves, light) : altaiSVG(+(p.dataset.alt || 1991), light));
      if (!shown) ph.querySelector('svg.fallback').style.display = 'none'; });
  },
  refresh() { const m = document.documentElement.dataset.scheme !== 'dark' ? 'l' : 'd'; if (this.mode && m !== this.mode) this.init(); }
};
const Geo = {
  io: null,
  init() {
    return;   // геометрия выключена: минимализм
    const add = (sel, cls, where) => $$(sel).forEach(n => { if (!n.querySelector(':scope > .geo')) n.insertAdjacentHTML(where, geoSVG(cls)); });
    const hero = $('#hero'); if (hero && !hero.querySelector('.geo-clip')) hero.insertAdjacentHTML('beforeend', `<div class="geo-clip" aria-hidden="true">${geoSVG('geo-hero')}</div>`); add('.story', 'geo-story', 'afterbegin'); add('.site-foot', 'geo-foot', 'beforeend');
    if (!document.querySelector('.progress')) document.body.insertAdjacentHTML('afterbegin', '<div class="progress" aria-hidden="true"></div>');
    if (RM() || !('IntersectionObserver' in window)) { $$('.geo').forEach(g => g.classList.add('in')); return; }
    this.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); this.io.unobserve(e.target); } }), {threshold:.15});
    this.scan();
  },
  scan() { if (this.io) $$('.view:not([hidden]) .geo:not(.in), .site-foot .geo:not(.in)').forEach(g => this.io.observe(g)); }
};
/* цифры набегают при появлении: фонды, ключевые даты */
const CountUp = {
  io: null,
  scan() {
    return;   // цифры не набегают
    if (RM() || !('IntersectionObserver' in window)) return;
    if (!this.io) this.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { this.io.unobserve(e.target); this.run(e.target); } }), {threshold:.6});
    $$('.view:not([hidden]) :is(.stats-strip b, .story-dates b, .story-stats b):not([data-cu])').forEach(b => {
      const fin = b.textContent.trim(), n = +fin.replace(/\D/g, ''); if (!n || fin.replace(/[\d\s ]/g, '')) return;
      b.dataset.cu = fin; this.io.observe(b);
    });
  },
  run(b) {
    const fin = b.dataset.cu, n = +fin.replace(/\D/g, ''), year = /^(1[89]|20)\d\d$/.test(fin), from = year ? n - 80 : 0, t0 = performance.now(), D = 1500;
    const step = now => { const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3), v = Math.round(from + (n - from) * e);
      b.textContent = p < 1 ? (year ? String(v) : fmtInt(v)) : fin; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
};
/* переход между страницами: геометрическая «шторка» (View Transitions API), без неё — обычная смена */
let vtReady = false;
function withTransition(fn) {
  if (!vtReady || RM() || !document.startViewTransition) { fn(); return; }
  try { document.startViewTransition(fn); } catch (e) { fn(); }
}

/* пока виден первый экран, плавающие кнопки убраны: не закрывают поиск и слово «АРХИВ» */
const HeroFloat = {
  init() {
    const hero = $('#hero'); if (!hero || !('IntersectionObserver' in window)) return;
    if (!location.hash || /^#home\b/.test(location.hash)) document.documentElement.classList.add('hero-on');
    new IntersectionObserver(es => es.forEach(e => {
      document.documentElement.classList.toggle('hero-on', e.isIntersecting && e.intersectionRatio > .3);
    }), {threshold:[0, .3, .6]}).observe(hero);
  }
};
/* ================= router ================= */
function parseHash(h) {
  h = String(h || '').replace(/^#/, '');
  let qs = ''; const qi = h.indexOf('?'); if (qi >= 0) { qs = h.slice(qi + 1); h = h.slice(0, qi); }
  try { h = decodeURIComponent(h); } catch (e) {}
  if (ALIAS[h]) h = ALIAS[h];
  const [v, tab] = h.split('/'); const rest = h.split('/').slice(1).join('/'); return {v, tab, rest, qs};
}
function show(v, focus) {
  if (!VIEWS.includes(v)) v = 'home';
  current = v; document.documentElement.dataset.view = v;   // для стилей, зависящих от страницы
  $$('.view').forEach(s => { s.hidden = s.dataset.view !== v; });
  { const nv = TZ.navFor(v); $$('#nav-list a').forEach(a => { if (a.getAttribute('href') === '#' + nv) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  document.title = (v === 'home' ? '' : (($(`.view[data-view="${v}"] h1`) || {}).textContent || '') + ' — ') + t('orgName');
  $('#site-nav').classList.remove('open'); $('#menu-btn').setAttribute('aria-expanded', 'false');
  TTS.stop();
  if (v === 'admin') { Admin.check().then(() => renderAdmin(true)); renderAdmin(true); }
  if (focus) {
    window.scrollTo({top:0});
    const h = $(`.view[data-view="${v}"] h1`);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); }
  }
}
function onHash() {
  const {v, tab, rest, qs} = parseHash(location.hash);
  if (v === 'p' && tab) { const go = () => { show('page', true); Page.open(tab); }; if (current !== 'page') withTransition(go); else go(); return; }
  if (!VIEWS.includes(v)) return;
  const deep = ['catalog', 'memory', 'expo'].includes(v) && current === v;
  const go = () => { if (HUBS[v]) { if (tab) Tabs.select(v, tab); else Tabs.overview(v); } show(v, !deep); TZ.route(v, rest, qs); if (deep) { const r = $(`.view[data-view="${v}"] .tz-head`); if (r && rest) window.scrollTo({top:Math.max(0, r.getBoundingClientRect().top + scrollY - 20)}); } Reveal.scan(); Geo.scan(); CountUp.scan(); };
  if (v !== current) withTransition(go); else go();
  requestAnimationFrame(() => { Reveal.scan(); Geo.scan(); CountUp.scan(); });
  setTimeout(() => { Geo.scan(); CountUp.scan(); }, 700);
}

/* ================= drawer ================= */
const Drawer = {
  open() {
    Chat.close(true);
    $('#drawer').hidden = false; $('#scrim').hidden = false;
    $('#side-tab').setAttribute('aria-expanded', 'true');
    setTimeout(() => { const b = $('#drawer .drawer-head button'); b && b.focus(); }, 30);
  },
  close() {
    if ($('#drawer').hidden) return;
    $('#drawer').hidden = true; $('#scrim').hidden = true;
    $('#side-tab').setAttribute('aria-expanded', 'false');
    $('#side-tab').focus();
  }
};

/* ================= assistant ================= */
const FAQ = [
  {id:'route', kw:['проех','доех','добрат','доберус','маршрут','адрес','где наход','где вы','где архив','автобус','остановк','бейбіт','бейбит','головков','мекенжай','жету','баруға','қалай бар','қайда','аялдама','address','route','bus','get there','get to','where is','where are','directions']},
  {id:'hours', kw:['режим','врем','часы','работаете','открыт','выходн','обед','когда вы','жұмыс уақ','уақыт','ашық','үзіліс','қашан жұмыс','hours','open','lunch','when are']},
  {id:'phone', kw:['телефон','позвон','номер','звон','почт','email','e-mail','қоңырау','пошта','phone','call','mail']},
  {id:'genealogy', kw:['предк','предок','родослов','родствен','прадед','дедушк','бабушк','метрическ','шежіре','ата-баба','атабаба','туыс','ancestor','genealog','family tree','relative','grandfather','grandmother']},
  {id:'reading', kw:['читальн','исследовател','поработать с','работать с документ','оқу зал','зерттеуші','reading room','researcher']},
  {id:'history', kw:['истори','основан','создан','год основ','когда основ','тарих','құрылған','қашан құрыл','history','founded','established']},
  {id:'branches', kw:['филиал','зайсан','риддер','алтай','структур','филиалы','құрылым','branch','structure']},
  {id:'store', kw:['хран','фонд','что есть','какие документ','сақтал','қор','не сақ','keep','holdings','what records','collection']},
  {id:'about', kw:['что такое','чем занима','для чего','зачем','кто вы','не үшін','не істейді','what is','what do you','why']},
  {id:'cert', kw:['справк','стаж','зарплат','пенси','анықтама','өтіл','жалақы','зейнет','certificate','pension','salary']},
  {id:'appeal', kw:['обращен','жалоб','заявлен','өтініш','шағым','complaint','appeal','request']},
  {id:'review', kw:['отзыв','оцен','гостев','пікір','баға','қонақ','review','rate','guestbook','feedback']},
  {id:'hello', kw:['здравств','привет','добрый','сәлем','салем','hello','hi ','good morning']},
  {id:'thanks', kw:['спасибо','благодар','рақмет','рахмет','thank']}
];
function faqAnswer(id) {
  const s = S(); const ph = s.phones[0]; const phs = s.phones.join(', '); const pb = persBld();
  const st = openStatus().text; const addr = L(s.address); const eg = EGOV[lang];
  const A = {
    hours:[`**Режим работы:** понедельник – пятница, ${s.open}–${s.close}, обед ${s.lunchFrom}–${s.lunchTo}. Суббота и воскресенье: выходной.\n\nСейчас: ${st}.\n\nТелефон: ${ph}`,
           `**Жұмыс уақыты:** дүйсенбі – жұма, ${s.open}–${s.close}, түскі үзіліс ${s.lunchFrom}–${s.lunchTo}. Сенбі мен жексенбі: демалыс.\n\nҚазір: ${st}.\n\nТелефон: ${ph}`,
           `**Opening hours:** Monday – Friday, ${s.open}–${s.close}, lunch ${s.lunchFrom}–${s.lunchTo}. Closed on Saturday and Sunday.\n\nRight now: ${st}.\n\nPhone: ${ph}`],
    route:[`Главное здание архива: **${addr}**.\n\nНиже кнопка «Маршрут в 2ГИС»: там видно, на каком автобусе ехать и где выходить. Карта со всеми зданиями архива в разделе [«Контакты и карта»](#contacts).`,
           `Архивтің бас ғимараты: **${addr}**.\n\nТөмендегі «2ГИС-те бағыт» батырмасын басыңыз: онда қай автобуспен баруға және қай жерде түсуге болатыны көрінеді. Архивтің барлық ғимараттары бар карта [«Байланыс және карта»](#contacts) бөлімінде.`,
           `The main building is at **${addr}**.\n\nTap “Route in 2GIS” below: it shows which bus to take and where to get off. A map with all archive buildings is in [Contacts and map](#contacts).`],
    phone:[`**Приёмная:** ${phs}${s.email ? `, эл. почта ${s.email}` : ''}.\n\n**Справки о стаже и зарплате:** филиал по личному составу, ${pb.p.join(', ')}.\n\nЗвонить можно в рабочее время: пн – пт, ${s.open}–${s.close}. Телефоны филиалов во вкладке [«Здания и филиалы»](#visitors/branches).`,
           `**Қабылдау бөлмесі:** ${phs}${s.email ? `, эл. пошта ${s.email}` : ''}.\n\n**Өтіл мен жалақы туралы анықтамалар:** жеке құрам бойынша филиал, ${pb.p.join(', ')}.\n\nЖұмыс уақытында қоңырау шалыңыз: дс – жм, ${s.open}–${s.close}. Филиал телефондары [«Ғимараттар мен филиалдар»](#visitors/branches) бетінде.`,
           `**Reception:** ${phs}${s.email ? `, email ${s.email}` : ''}.\n\n**Employment and salary certificates:** personnel records branch, ${pb.p.join(', ')}.\n\nCall during opening hours: Mon – Fri, ${s.open}–${s.close}. Branch phones: [Buildings and branches](#visitors/branches).`],
    genealogy:[`Как искать сведения о предках:\n1. Соберите всё, что известно: ФИО (и прежние фамилии), год и место рождения, где жил и работал.\n2. Проверьте базы архива «Книга памяти» и «Оставь свой след в истории».\n3. Закажите архивную справку или копию документа на [eGov.kz](${eg}).\n4. Поработайте в читальном зале: пн – пт, ${s.reading || '10:00–17:00'}.\n\nПодробно во вкладке [«Поиск предков»](#visitors/genealogy).`,
               `Ата-баба туралы мәліметті қалай іздеу керек:\n1. Белгілі мәліметтің бәрін жинаңыз: аты-жөні (бұрынғы тегі де), туған жылы мен жері, қайда тұрып, жұмыс істегені.\n2. Архивтің «Еске алу кітабы» және «Тарихта ізіңді қалдыр» базаларын қараңыз.\n3. [eGov.kz](${eg}) арқылы архивтік анықтама немесе құжат көшірмесін сұратыңыз.\n4. Оқу залында жұмыс істеңіз: дс – жм, ${s.reading || '10:00–17:00'}.\n\nТолығырақ [«Ата-баба іздеу»](#visitors/genealogy) бетінде.`,
               `How to trace your ancestors:\n1. Collect what you know: full name (and former surnames), year and place of birth, where they lived and worked.\n2. Check the archive databases: the Book of Memory and notable people.\n3. Order an archive certificate or a copy on [eGov.kz](${eg}).\n4. Research in the reading room: Mon – Fri, ${s.reading || '10:00–17:00'}.\n\nStep by step: [Family history](#visitors/genealogy).`],
    reading:[`**Читальный зал** работает понедельник – пятница, ${s.reading || '10:00–17:00'}. Там есть электронный каталог фондов, аппарат для микрофильмов и сканер. Перед визитом позвоните: ${ph}. Подробнее во вкладке [«Читальный зал»](#visitors/reading).`,
             `**Оқу залы** дүйсенбі – жұма, ${s.reading || '10:00–17:00'} жұмыс істейді. Онда қорлардың электрондық каталогы, микрофильм аппараты және сканер бар. Келер алдында қоңырау шалыңыз: ${ph}. Толығырақ [«Оқу залы»](#visitors/reading) бетінде.`,
             `The **reading room** is open Monday – Friday, ${s.reading || '10:00–17:00'}, with an electronic fonds catalogue, a microfilm reader and a scanner. Call before you come: ${ph}. See [Reading room](#visitors/reading).`],
    history:[`Государственный архив ВКО образован в **1940 году**. Область появилась раньше, в 1932 году. В 1991 году архиву передали здание бывшего партийного архива, а с 2009 года архив и его филиалы работают как самостоятельные учреждения. Подробнее во вкладке [«История»](#about/history).`,
             `ШҚО мемлекеттік архиві **1940 жылы** құрылды. Облыс одан бұрын, 1932 жылы құрылған. 1991 жылы архивке бұрынғы партия архивінің ғимараты берілді, ал 2009 жылдан бастап архив пен оның филиалдары дербес мекеме ретінде жұмыс істейді. Толығырақ [«Тарих»](#about/history) бетінде.`,
             `The State Archive of EKR was founded in **1940**; the region itself dates from 1932. In 1991 the archive received the former party archive building, and since 2009 the archive and its branches have worked as independent institutions. More in [History](#about/history).`],
    branches:[`У архива ${(SITE.branches || []).length} филиалов:\n` + (SITE.branches || []).map(b => `- **${b.n}**: ${b.a.replace(/^\d{6},\s*/, '')}${b.p && b.p[0] ? ', тел. ' + b.p[0] : ''}`).join('\n') + `\n\nВсе адреса и телефоны — в разделе [«Филиалы и контакты»](#contacts).`,
              `Архивтің төрт филиалы бар: жеке құрам бойынша Өскемен, Зайсан, Риддер және «Алтай». Мекенжайлар мен телефондар [«Ғимараттар мен филиалдар»](#visitors/branches) бетінде.`,
              `The archive has four branches: Oskemen personnel records, Zaysan, Ridder and Altai. Addresses and phones: [Buildings and branches](#visitors/branches).`],
    store:[`В архиве хранятся:\n- документы органов власти: решения исполкомов, акиматов, советов;\n- документы заводов, совхозов и колхозов;\n- документы по личному составу закрытых организаций;\n- документы школ, больниц, учреждений культуры;\n- фотографии и киносъёмки;\n- личные фонды известных земляков.\n\nПодробнее во вкладке [«Что хранится»](#fonds/store), личные фонды можно найти по фамилии во вкладке [«Личные фонды»](#fonds/personal).`,
           `Архивте мыналар сақталады:\n- билік органдарының құжаттары: атқару комитеттерінің, әкімдіктердің, кеңестердің шешімдері;\n- зауыттардың, совхоздар мен колхоздардың құжаттары;\n- таратылған ұйымдардың жеке құрамы бойынша құжаттар;\n- мектептердің, ауруханалардың, мәдениет мекемелерінің құжаттары;\n- фотосуреттер мен кинотүсірілімдер;\n- белгілі жерлестеріміздің жеке қорлары.\n\nТолығырақ [«Не сақталады»](#fonds/store) бетінде.`,
           `The archive keeps:\n- records of government bodies: executive committees, akimats, councils;\n- records of factories, state farms and collective farms;\n- personnel records of organisations that have closed;\n- records of schools, hospitals and cultural institutions;\n- photographs and film;\n- personal collections of notable local people.\n\nMore in [What we keep](#fonds/store).`],
    about:[`Государственный архив ВКО собирает и хранит документы о жизни Восточного Казахстана, следит за их сохранностью и делает их доступными для людей. По документам архива подтверждают стаж и зарплату, с ними работают историки и краеведы. Подробнее в разделе [«Об архиве»](#about).`,
           `ШҚО мемлекеттік архиві Шығыс Қазақстанның өмірі туралы құжаттарды жинап, сақтайды, олардың сақталуын қадағалайды және халыққа қолжетімді етеді. Архив құжаттары бойынша өтіл мен жалақы расталады, олармен тарихшылар мен өлкетанушылар жұмыс істейді. Толығырақ [«Архив туралы»](#about) бөлімінде.`,
           `The State Archive of EKR collects and keeps records of life in East Kazakhstan, looks after them and makes them available. Its records are used to confirm employment and salary, and historians work with them. More in [About](#about).`],
    cert:[`Архивная справка, копия или выписка: это госуслуга. Закажите её на [eGov.kz](${eg}) или в ЦОН.\n\nСправки о **стаже и зарплате** готовит филиал по личному составу: ул. ${pb.a}, тел. ${pb.p.join(', ')}.\n\nПодробно во вкладке [«Архивная справка»](#visitors/cert).`,
          `Архивтік анықтама, көшірме немесе үзінді: бұл мемлекеттік қызмет. Оны [eGov.kz](${eg}) арқылы немесе ХҚКО-да сұратыңыз.\n\n**Өтіл мен жалақы** туралы анықтамаларды жеке құрам бойынша филиал дайындайды: ${pb.a} көшесі, тел. ${pb.p.join(', ')}.\n\nТолығырақ [«Архивтік анықтама»](#visitors/cert) бетінде.`,
          `An archive certificate, copy or extract is a public service: order it on [eGov.kz](${eg}) or at a Public Service Center.\n\n**Employment and salary** certificates come from the personnel records branch: ${pb.a}, tel. ${pb.p.join(', ')}.\n\nDetails: [Archive certificate](#visitors/cert).`],
    appeal:[`Этот сайт не принимает обращения. Обращения в государственные органы подаются через [eOtinish.kz](https://eotinish.kz), справки оформляются на [eGov.kz](${eg}).`,
            `Бұл сайт өтініш қабылдамайды. Мемлекеттік органдарға өтініштер [eOtinish.kz](https://eotinish.kz) арқылы беріледі, анықтамалар [eGov.kz](${eg}) сайтында рәсімделеді.`,
            `This website doesn't accept requests. Requests to government bodies go through [eOtinish.kz](https://eotinish.kz); certificates are handled on [eGov.kz](${eg}).`],
    review:[`Нажмите «Оставить отзыв» справа на экране. Там можно оценить сайт и сделать запись в гостевой книге.`,
            `Экранның оң жағындағы «Пікір қалдыру» батырмасын басыңыз. Онда сайтты бағалап, қонақ кітабына жазба қалдыруға болады.`,
            `Press “Leave feedback” on the right of the screen. You can rate the site and write in the guestbook there.`],
    hello:[`Здравствуйте! Чем помочь? Подскажу, как получить справку и искать сведения о предках, где находится архив и когда он работает. Могу найти и любую информацию на сайте.`,
           `Сәлеметсіз бе! Қалай көмектесейін? Анықтаманы қалай алуға, ата-баба туралы мәліметті қалай іздеуге болатынын, архивтің қайда екенін және қашан жұмыс істейтінін айтамын. Сайттан кез келген ақпаратты да таба аламын.`,
           `Hello! How can I help? I can explain how to get a certificate or trace your ancestors, where the archive is and when it's open, and find anything on the site.`],
    thanks:[`Пожалуйста! Если появятся вопросы, пишите.`, `Оқасы жоқ! Сұрақтарыңыз болса, жазыңыз.`, `You're welcome! Write any time.`],
    none:[`Точного ответа я не нашёл. Спросите, например: «как получить справку о стаже», «как найти сведения о предках» или «где находится архив». Можно поискать по сайту кнопкой «Поиск» в меню. Или позвоните: ${ph} (пн – пт, ${s.open}–${s.close}).`,
          `Нақты жауап таба алмадым. Мысалы, былай сұраңыз: «архив қайда орналасқан», «қашан жұмыс істейсіздер» немесе «архивте не сақталады». Немесе қоңырау шалыңыз: ${ph} (дс – жм, ${s.open}–${s.close}).`,
          `I couldn't find an exact answer. Try asking “where is the archive”, “when are you open” or “what does the archive keep”. Or call: ${ph} (Mon – Fri, ${s.open}–${s.close}).`]
  };
  return L(A[id] || A.none);
}
const norm = s => String(s || '').toLowerCase().replace(/ё/g, 'е');
function detectMode(q) { const n = norm(q); if (/(машин|такси|авто|көлік|car|taxi|drive)/.test(n)) return 'car'; if (/(пешк|жаяу|walk|foot)/.test(n)) return 'walk'; return 'bus'; }
function glossAnswer(q) {
  const n = norm(q);
  if (!/(что такое|что значит|что означает|значение слов|деген не|дегеніміз|мағынасы|what is|what does|meaning of)/.test(n)) return null;
  const all = (lang === 'ru' ? (SITE.gloss || []).map(g => ({t:g.t, d:g.d})) : []).concat(GLOSS.map(g => ({t:L(g.t), d:L(g.x)})));
  let best = null;
  all.forEach(g => {
    const k = norm(g.t).replace(/\s*\(.*\)/, '').trim(); const stem = k.length > 5 ? k.slice(0, k.length - 2) : k;
    if (stem.length > 2 && n.includes(stem) && (!best || stem.length > best.len)) best = {g, len:stem.length};
  });
  return best ? `**${best.g.t}**: ${best.g.d}\n\n` + L(['Другие термины в [словаре](#fonds/gloss).', 'Басқа терминдер [сөздікте](#fonds/gloss).', 'More terms in the [glossary](#fonds/gloss).']) : null;
}
const hitLine = h => `- [${String(h.t).replace(/[\[\]]/g, '')}](${h.h}): ${h.k}`;
function localBot(q) {
  const g = glossAnswer(q); if (g) return {text:g, route:null, kind:'gloss'};
  const n = ' ' + norm(q) + ' ';
  let best = null, bestScore = 0;
  FAQ.forEach(f => { const sc = f.kw.reduce((a, k) => a + (n.includes(k) ? 1 : 0), 0); if (sc > bestScore) { best = f; bestScore = sc; } });
  const hits = Search.query(q, 5);
  if (!best) {
    if (hits.length) return {text: L(['Вот что нашлось на сайте:', 'Сайттан табылғаны:', 'Here is what I found on the site:']) + '\n' + hits.map(hitLine).join('\n') + '\n\n' + fmt(L(['Если это не то, позвоните в приёмную: {ph}.', 'Бұл емес болса, қабылдау бөлмесіне қоңырау шалыңыз: {ph}.', 'If this isn\'t it, call reception: {ph}.']), {ph:S().phones[0] || ''}), route:null, kind:'search'};
    return {text:faqAnswer('none'), route:null, kind:'none'};
  }
  const id = best.id;
  let text = faqAnswer(id);
  if (!['hello', 'thanks', 'route', 'hours', 'review', 'appeal'].includes(id)) {
    const extra = hits.filter(h => h.score >= 8 && h.k !== t('tNews') && !text.includes('(' + h.h + ')')).slice(0, 2);   // только близкие по смыслу, без новостей
    if (extra.length) text += '\n\n' + L(['Ещё на сайте:', 'Сайтта тағы:', 'Also on the site:']) + '\n' + extra.map(hitLine).join('\n');
  }
  return {text, route: id === 'route' ? {mode:detectMode(q), from:''} : null, kind:'faq'};
}
/* запасной бот и каталог: те же три ситуации, что у ИИ (ответ с источниками, «не нашлось», закрытые данные), но без обращения к модели */
function localWithCatalog(r, src) {
  if (!src || !src.ok) return r;
  const ph = S().phones[0] || '';
  if (src.restricted) return {...r, text:fmt(t('aiRestr'), {ph}), route:null, sources:[], total:0, q:src.q};
  if (r.kind !== 'none' && r.kind !== 'search' && !(r.kind === 'faq' && src.strong && src.hits.length)) return r;
  if (src.hits.length) return {...r, text: fmt(t('aiFound'), {n:src.total}) + (src.limited ? '\n\n' + fmt(t('aiLimited'), {n:src.limited}) : ''), sources:src.hits, total:(src.counts || {}).cat || 0, q:src.q, route:null};
  if (src.asked) return {...r, text: (r.kind === 'search' ? r.text + '\n\n' : '') + fmt(t('aiNone'), {ph}) + (src.limited ? '\n\n' + fmt(t('aiLimited'), {n:src.limited}) : ''), sources:[], total:0, q:src.q};
  return r;
}
function systemPrompt(q, src, intent) {
  const s = S(); const st = openStatus(); const pb = persBld(); const ss = SITE.stats || {};
  const wantsNews = /новост|объявлен|событи|мероприят|акци|жаңалық|news|announce/i.test(String(q || ''));
  const news = !wantsNews ? '' : newsSorted().slice(0, 5).map(n => '- ' + n.date + ', ' + L(n.title) + ': ' + L(n.text).slice(0, 280)).join('\n');
  const langName = {ru:'русский', kz:'казахский', en:'английский'}[lang];
  const hits = q ? Search.query(q, 8).filter(h => h.score >= 8 && (wantsNews || h.k !== t('tNews'))).slice(0, 4) : [];   // слабые совпадения в запрос не берём: по ним модель начинала отвечать о чём попало
  const gl = glossAnswer(q), here = (document.title || '').replace(/\s+[—-]\s+Государственный архив.*$/i, '').trim();
  return [
    'Ты помощник на информационном сайте Государственного архива Восточно-Казахстанской области (г. Усть-Каменогорск / Өскемен). Тебе пишут разные люди: жители области, которым нужна справка, исследователи, историки, студенты, краеведы.',
    'Правила:',
    `- Отвечай на языке вопроса. Если язык непонятен, отвечай на языке интерфейса: ${langName}.`,
    '- Пиши просто и по делу: 2–5 коротких предложений или короткий список. Без канцелярита.',
    '- Сайт только информационный: он не выдаёт справки и не принимает обращения. Справки оформляют на eGov.kz, e-vko.gov.kz или в ЦОН, обращения в госорганы подают через eOtinish.kz.',
    '- Опирайся на факты и фрагменты сайта ниже. Не выдумывай номера автобусов, сроки, стоимость, имена, номера фондов. Если сведений нет, предложи позвонить в приёмную.',
    '- На вопрос «как проехать» вызови инструмент route_links и скажи, что кнопка маршрута в 2ГИС появится под ответом. Маршруты до других зданий — кнопками под картой в разделе [«Контакты»](#contacts).',
    '- Если посетителю поможет раздел сайта, дай ссылку вида [название](#раздел/вкладка) или открой его инструментом open_page.',
    '- Внешние ссылки пиши так: [текст](https://адрес).',
    '- Ты отвечаешь только о Государственном архиве ВКО, его услугах, фондах, истории края по документам архива и о том, как пользоваться этим сайтом. На посторонние вопросы (погода, политика, советы, программирование, другие организации) вежливо скажи, что помогаешь только по архиву, и предложи подходящий раздел.',
    '- Если вопрос короткий и похож на уточнение («а в Зайсане?», «а фото есть?», «а адрес?»), он относится к предыдущему вопросу диалога: учти его. Не меняй тему сам.',
    '- Не добавляй от себя списки «ещё можно посмотреть», подборки разделов и новости, если посетитель о них не просил. Одна нужная ссылка лучше пяти лишних. Это не касается найденных записей каталога: их перечисляй по правилам про источники.',
    intent && intent.kind === 'info' ? '- ТИП ВОПРОСА: справочный (про работу архива, услуги, адреса, правила). Ответь по фактам ниже и дай одну ссылку на нужный раздел. Не перечисляй материалы каталога, выставки и людей: об этом не спрашивали.' : '',
    intent && intent.kind === 'search' ? '- ТИП ВОПРОСА: поиск материалов. Опирайся на найденные записи в конце запроса, только на них.' : '',
    here ? `- Посетитель сейчас на странице сайта: «${here}» (${location.hash || '#home'}). Если вопрос явно про эту страницу или раздел («что здесь», «как это работает»), отвечай по её теме.` : '',
    '',
    'Факты:',
    `- Главное здание: ${L(s.address)}. Приёмная: ${s.phones.join(', ')}.` + (s.email ? ` Эл. почта: ${s.email}.` : ''),
    blds().length ? '- Другие здания в городе: ' + blds().map(b => 'ул. ' + b.a + (L(b.n) ? ' (' + ((b.n && b.n.ru) || L(b.n)) + ')' : '') + (b.p.length ? ', тел. ' + b.p.join(', ') : '')).join('; ') + '.' : '',
    `- Режим работы: понедельник – пятница ${s.open}–${s.close}, обед ${s.lunchFrom}–${s.lunchTo}; суббота и воскресенье выходной. Читальный зал: пн–пт ${s.reading || '10:00–17:00'}. Сейчас: ${st.text}.`,
    '- Праздничные выходные в ближайшие 60 дней: ' + (upcomingHolidays(60).map(x => isoDay(x.d) + ' (' + holidayName(x.h) + ')').join(', ') || 'нет') + '. В праздники архив закрыт.',
    '- Архив является коммунальным государственным учреждением в составе Управления цифровизации и архивов ВКО.',
    orgLeaders().length ? '- Руководство: ' + orgLeaders().map(p => p.r + ': ' + p.n + ', тел. ' + p.p).join('; ') + '.' : '',
    '- Филиалы: ' + (SITE.branches || []).map(b => `${b.n}: ${b.a}, тел. ${b.p.join(', ')}${b.e ? ', ' + b.e : ''}; ${b.h}; ${b.z}`).join(' | '),
    `- Справки о стаже и зарплате, копии и выписки: госуслуга «Выдача архивных справок, копий архивных документов или архивных выписок» на eGov.kz, e-vko.gov.kz или в ЦОН. Документы по личному составу хранит филиал на ул. ${pb.a}, тел. ${pb.p.join(', ')}.`,
    '- Поиск предков: собрать данные о человеке, проверить базы «Книга памяти» и «Оставь свой след в истории», заказать справку на eGov.kz, поработать в читальном зале.',
    ss.fonds ? `- Объём: ${ss.fonds} фондов, ${ss.units} единиц хранения, ${ss.personal} личных фондов, ${ss.av} фото- и кинодокументов (на ${ss.asOf}).` : '',
    '- История: ' + TIMELINE.map(x => (Array.isArray(x.y) ? x.y[0] : x.y) + ': ' + x.t[0] + '. ' + x.x[0]).join(' | '),
    '- Группы фондов: ' + (SITE.fondsGroups || []).map(g => g.t).join('; ') + '.',
    '- Регион: ВКО на востоке страны, граничит с Россией и Китаем; область образована в 1932 году с центром в Семипалатинске, 14 октября 1939 года центр перенесён в Усть-Каменогорск; Усть-Каменогорск основан в 1720 году у впадения Ульбы в Иртыш; горы Алтая, озёра Маркаколь и Зайсан.',
    '- Архив издаёт сборники документов, например об эвакуации в годы войны, о коллективизации и о миграции казахов в Китай в 1920-е годы.',
    L(s.banner) ? '- Объявление на сайте: ' + L(s.banner) : '',
    news ? 'Новости сайта:\n' + news : '',
    gl ? 'Определение из словаря сайта (дай его по сути, своими словами): ' + gl.replace(/\n\n.*$/s, '') : '',
    hits.length ? 'Фрагменты сайта, найденные по вопросу посетителя (используй, если подходят; ссылку давай на указанный раздел):\n' + hits.map(h => `- ${h.t} [${h.k}; ${h.h}]: ${String(h.x).slice(0, 260)}`).join('\n') : '',
    'Разделы сайта (для ссылок и open_page): home (главная), contacts (контакты, карта, памятка для печати), ' + Object.keys(HUBS).map(h => HUBS[h].map(x => `${h}/${x} (${T[TAB_T[x]][0]})`).join(', ')).join(', ') + '. Отзыв оставляют кнопкой «Оставить отзыв» справа на экране.',
    src ? AiSrc.prompt(src) : ''
  ].filter(Boolean).join('\n');
}
const Chat = {
  history: [], busy: false, sample: undefined, samplePromise: null, viaVoice: false,
  init() {
    const c = window.claude;
    this.samplePromise = (c && typeof c.use === 'function') ? c.use('sample').catch(() => null) : Promise.resolve(null);
    this.samplePromise.then(s => { this.sample = s || null; this.renderNote(); });
    this.greet();
  },
  aiReady() { return !!(CONFIG.aiEndpoint || this.sample); },
  renderNote() { const n = $('#chat-note'); if (n) n.textContent = this.aiReady() ? t('chatNoteAI') : t('chatNoteLocal'); },
  greet() {
    $('#chat-log').innerHTML = ''; this.history = [];
    const m = this.add('bot', t('chatHello'));
    const sug = document.createElement('div'); sug.className = 'chips';
    sug.innerHTML = ['chip1','chip5','chip3','chip4'].map(k => `<button class="chip" type="button" data-act="ask" data-q="${k}">${esc(t(k))}</button>`).join('');
    m.appendChild(sug);
  },
  open() {
    Drawer.close();
    $('#chat').hidden = false; $('#fab').hidden = true; $('#fab').setAttribute('aria-expanded', 'true');
    setTimeout(() => $('#chat-input').focus(), 30);
  },
  close(silent) {
    if ($('#chat').hidden) return;
    $('#chat').hidden = true; $('#fab').hidden = false; $('#fab').setAttribute('aria-expanded', 'false');
    if (!silent) $('#fab').focus();
    TTS.stop();
  },
  add(who, text, opts) {
    const el = document.createElement('div');
    el.className = 'msg ' + who;
    if (who === 'me') el.textContent = text; else this.fill(el, text, opts);
    $('#chat-log').appendChild(el);
    /* окно помощника скрыто, пока его не откроют: прокрутка в скрытом окне (приветствие при запуске) заставляла браузер пересчитывать раскладку всей страницы, на телефоне ≈0,3 с */
    if (!$('#chat').hidden) el.scrollIntoView({block:'end', behavior:'smooth'});
    return el;
  },
  fill(el, text, opts) {
    opts = opts || {};
    if (opts.thinking) { el.innerHTML = `<span class="typing" role="status">${esc(t('thinking'))} <i></i><i></i><i></i></span>`; return; }
    let html = `<div>${md(text)}</div>`;
    if (opts.route) html += `<div class="route-card"><b>${esc(t('routeTo'))}</b><div class="map-links">${mapBtnsHTML()}</div></div>`;
    if (opts.final) html += this.srcHTML(opts);
    if (opts.final && text) html += `<div class="tools"><button type="button" data-act="listen"><svg class="ic"><use href="#i-sound"/></svg>${esc(t('listen'))}</button></div>`;
    el.innerHTML = html; el.dataset.text = this.plain(text);
  },
  /* ссылки на разделы нашего сайта под каждым ответом: найденные поиском по сайту, а если ничего нет — «Как искать» и «Контакты» */
  siteLinks(q, text, intent) {
    const out = [], seen = new Set(), has = h => String(text || '').includes('(' + h + ')'), anyLink = /\]\(#/.test(String(text || ''));
    intent = intent || {kind:'search'};
    if (intent.kind === 'chat') return out;
    if (intent.kind === 'info') {   // справочный вопрос: одна ссылка на раздел, если в ответе нет ни одной
      const h = AiSrc.FAQ_LINK[intent.faq];
      if (h && !anyLink && !has(h)) { const {v, tab} = parseHash(h); out.push({t:tab && TAB_T[tab] ? t(TAB_T[tab]) : t(HUB_T[v] || (v === 'contacts' ? 'navContacts' : 'navAbout')), h, k:HUBS[v] ? t(HUB_T[v]) : ''}); }
      return out;
    }
    const news = /новост|объявлен|событи|мероприят|жаңалық|news/i.test(String(q || ''));
    Search.query(q, 8).filter(h => h.score >= 8 && (news || h.k !== t('tNews')) && !has(h.h)).forEach(h => { if (out.length < 2 && !seen.has(h.h)) { seen.add(h.h); out.push({t:h.t, h:h.h, k:h.k}); } });
    if (!out.length && !anyLink && /(не нашл|ничего подходящ|не найден|табылмады|couldn.t find|nothing suitable|no suitable|did not find)/i.test(String(text || '')) && !has('#visitors/guide')) out.push({t:t('tGuide'), h:'#visitors/guide', k:t('navVisitors')});   // поиск ничего не дал: одна подсказка, как искать
    return out;
  },
  plain(text) { return String(text || '').replace(/\s*\[\d+\]\(#[^)]*\)/g, ''); },
  /* блок «Источники из каталога», предупреждение и пометка «сформировано автоматически» (ТЗ, доп. 3.4) */
  srcHTML(o) {
    const list = o.sources || []; let h = '';
    if (list.length || (o.more && o.more.length) || (o.total > 0 && o.cq)) {
      h += '<div class="ai-src">';
      const li = s => `<li><a href="${esc(s.href)}">${s.n}. ${esc(String(s.t).slice(0, 150))}</a><small>${esc([s.kind, s.c, s.y, s.arch].filter(Boolean).join(' · '))}${s.alt ? ` · <a href="${esc(s.alt.h)}">${esc(s.alt.l)}</a>` : ''}</small></li>`;
      if (list.length) h += `<b>${esc(t('aiSrc'))}</b><ol>${list.map(li).join('')}</ol>`;
      if (o.more && o.more.length) h += `<b>${esc(t(list.length ? 'aiMoreFound' : 'aiSrc'))}</b><ol>${o.more.map(li).join('')}</ol>`;   // найденное, но не названное в тексте: список полный, даже если ИИ что-то пропустил
      if (o.total > 0 && o.cq) h += `<a class="more" href="#catalog?q=${encodeURIComponent(o.cq)}">${esc(t('aiAll'))}</a>`;
      h += '</div>';
    }
    if (o.site && o.site.length) h += `<div class="ai-src"><b>${esc(t('aiSite'))}</b><ul>${o.site.map(x => `<li><a href="${esc(x.h)}">${esc(String(x.t).slice(0, 110))}</a>${x.k ? `<small>${esc(x.k)}</small>` : ''}</li>`).join('')}</ul></div>`;
    if (o.warn) h += `<div class="ai-mark"><b>${esc(t('aiWarn'))}</b></div>`;
    if (o.mark) h += `<div class="ai-mark" data-ai="${o.mark}">${esc(t(o.mark === 'ai' ? 'aiAuto' : 'aiAutoLocal'))}</div>`;
    return h;
  },
  async ask(q) {
    q = String(q || '').trim();
    if (!q || this.busy) return;
    this.open();
    this.add('me', q);
    Store.logQuestion(q);
    this.history.push({role:'user', content:q});
    const bubble = this.add('bot', '', {thinking:true});
    this.busy = true;
    let text = '', route = null, src = null, sources = [], total = 0, warn = false, mark = 'ai';
    // записи открытого каталога по вопросу: они уходят ИИ как единственные разрешённые источники (при сбое поиска отвечаем без них)
    const intent = AiSrc.intent(q);
    if (intent.kind === 'search') { try { src = await Promise.race([AiSrc.find(q), new Promise(res => setTimeout(() => res(null), 7000))]); } catch (e) { src = null; } }   // справочным вопросам каталог не нужен
    try {
      if (CONFIG.aiEndpoint) {
        const r = await fetch(CONFIG.aiEndpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({system:systemPrompt(q, src, intent), messages:this.history.slice(-10), lang})});
        if (!r.ok) throw new Error('http ' + r.status);
        const j = await r.json(); text = j.text || ''; if (j.route) route = j.route;
        if (!route) { const lb = localBot(q); if (lb.route) route = lb.route; }
      } else {
        if (this.sample === undefined) this.sample = await this.samplePromise;
        if (!this.sample) throw {code:'no_ai'};
        const msgs = this.history.slice(-10).map((m, i, arr) => i === arr.length - 1 ? {role:'user', content: systemPrompt(q, src, intent) + '\n\n---\nСообщение посетителя:\n' + m.content} : m);
        while (msgs.length && msgs[0].role !== 'user') msgs.shift();
        const res = await this.sample(msgs, {
          cache:false,
          onText: ({text:tx}) => { if (tx && tx !== 'Thinking...') { text = tx; this.fill(bubble, AiSrc.cite(tx, src).text.replace(/\s*\[S\d*$/, ''), {route}); } },
          tools: this.tools(r => { route = r; })
        });
        text = (res && res.text) || text;
      }
      if (!text.trim()) throw {code:'empty'};
      const c = AiSrc.cite(text, src); text = c.text; sources = c.used; warn = c.warn; total = src && src.counts ? src.counts.cat : 0;
    } catch (err) {
      if (err && err.code === 'not_granted') { this.sample = null; this.renderNote(); }
      const r = localWithCatalog(localBot(q), src); text = r.text; if (r.route) route = r.route;
      sources = r.sources || []; total = r.total || 0; warn = false; mark = 'local';
    }
    // если ответ ссылается на найденное, остальные найденные записи показываем ниже: список полный, даже если ИИ что-то не назвал
    const more = mark === 'ai' && src ? src.hits.filter(h => !sources.includes(h)) : [];
    this.fill(bubble, text, {route, final:true, sources, more, total, cq:src && src.cq, warn, mark, site:this.siteLinks(q, text, intent)});
    bubble.scrollIntoView({block:'end', behavior:'smooth'});
    const plain = this.plain(text);
    this.history.push({role:'assistant', content:plain});
    this.busy = false;
    if (prefs.autoSpeak || this.viaVoice) TTS.speak(plain.replace(/\*\*|\[|\]\([^)]*\)/g, ''));
    this.viaVoice = false;
  },
  tools(onRoute) {
    return [
      {name:'route_links', description:'Показать посетителю кнопку маршрута до главного здания архива в 2ГИС (там можно выбрать автобус, машину или пешком). Вызывай на любой вопрос «как проехать / как добраться / где находится».',
       inputSchema:{type:'object', properties:{mode:{type:'string', enum:['bus','car','walk'], description:'bus: общественный транспорт, car: машина или такси, walk: пешком'}, from:{type:'string', description:'Адрес отправления в Усть-Каменогорске, если посетитель его назвал. Пусто: от текущего местоположения.'}}},
       execute: inp => { const mode = (inp && inp.mode) || 'bus'; const from = (inp && inp.from) || ''; onRoute({mode, from}); return {address:L(S().address), shown:true}; }},
      {name:'open_page', description:'Открыть раздел сайта на экране посетителя.',
       inputSchema:{type:'object', properties:{page:{type:'string', enum:['home', 'contacts', ...Object.keys(HUBS).flatMap(h => HUBS[h].map(x => h + '/' + x))], description:'Раздел или раздел/вкладка'}}, required:['page']},
       execute: inp => { const p = String((inp && inp.page) || ''); const {v} = parseHash(p); if (!VIEWS.includes(v) || v === 'admin') throw new Error('unknown page'); location.hash = p; return {opened:p}; }}
    ];
  }
};
function md(src) {
  const inline = s => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|#)[^\s)]+)\)/g, (m, txt, url) => url.startsWith('#') ? `<a href="${url}">${txt}</a>` : `<a href="${url}" target="_blank" rel="noopener">${txt}</a>`)
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  let html = '', list = null;
  esc(src).split('\n').forEach(raw => {
    const l = raw.trim();
    const ul = l.match(/^[-•*]\s+(.*)/), ol = l.match(/^\d+[.)]\s+(.*)/);
    if (ul || ol) {
      const type = ul ? 'ul' : 'ol';
      if (list !== type) { if (list) html += `</${list}>`; html += `<${type}>`; list = type; }
      html += `<li>${inline((ul || ol)[1])}</li>`; return;
    }
    if (list) { html += `</${list}>`; list = null; }
    if (!l) return;
    const h = l.match(/^#{1,4}\s+(.*)/);
    html += h ? `<p><strong>${inline(h[1])}</strong></p>` : `<p>${inline(l)}</p>`;
  });
  if (list) html += `</${list}>`;
  return html;
}

/* ================= admin ================= */
const Admin = {
  ok: SS.get('admin') === '1' || !!SS.get('token'), tab:'summary', filter:'pending', armed:null, editNews:null, dirty:false,
  async check() {
    if (this.ok) return true;
    const u = Store.user;
    if (u && typeof u.canEdit === 'function') { try { if (await u.canEdit()) this.ok = true; } catch (e) {} }
    return this.ok;
  }
};
function modItems() {
  const items = [...Store.data.entries, ...Store.data.reviews.filter(r => r.text)];
  return items.map(i => ({...i, status:statusOf(i.id)})).sort((a, b) => b.ts - a.ts);
}
function renderAdmin(force) {
  const root = $('#admin-root');
  if (!force && root.contains(document.activeElement) && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { Admin.dirty = true; return; }
  Admin.dirty = false;
  if (!Admin.ok) {
    root.innerHTML = `<h1>${esc(t('adminTitle'))}</h1>
      <form class="panel form" id="login-form" novalidate style="max-width:26rem">
        ${Store.mode === 'api' ? `<div class="field"><label for="adm-login">${esc(t('aLogin'))}</label><input id="adm-login" type="text" autocomplete="username" autocapitalize="off" spellcheck="false" value="admin"></div>` : ''}
        <div class="field"><label for="adm-pwd">${esc(t('password'))}</label><input id="adm-pwd" type="password" autocomplete="current-password"><span class="hint">${esc(Store.mode === 'api' ? t('pwdServer') : t('pwdHint'))}</span><span class="err" id="adm-err" hidden>${esc(t('pwdWrong'))}</span></div>
        <div class="btn-row"><button class="btn" type="submit">${esc(t('login'))}</button><a class="btn ghost" href="#home">${esc(t('backSite'))}</a></div>
      </form>`;
    return;
  }
  Store.subscribeQuestions();
  const tabs = TZA.extend([['summary','aSummary'],['mod','aMod'],['news','aNews'],['content','aContent'],['photos','aPhotos'],['settings','aSettings'],['questions','aQuestions']]);
  if (!tabs.some(x => x[0] === Admin.tab)) Admin.tab = tabs[0][0];
  const pending = modItems().filter(i => i.status === 'pending').length;
  let body = '';
  if (Admin.tab === 'summary') body = adminSummary();
  else if (Admin.tab === 'mod') body = adminMod();
  else if (Admin.tab === 'news') body = adminNews();
  else if (Admin.tab === 'settings') body = adminSettings();
  else if (Admin.tab === 'content') body = adminContent();
  else if (Admin.tab === 'photos') body = adminPhotos();
  else if (TZA.has(Admin.tab)) body = TZA.body(Admin.tab);
  else body = adminQuestions();
  root.innerHTML = `<div class="admin-top"><h1>${esc(t('adminTitle'))}</h1><div class="btn-row"><a class="btn ghost sm" href="#home">${esc(t('backSite'))}</a><button class="btn ghost sm" type="button" data-act="logout">${esc(t('logout'))}</button></div></div>
    <p class="note"><svg class="ic"><use href="#i-shield"/></svg><span>${esc(Store.mode === 'db' ? t('modeDb') : Store.mode === 'api' ? t('modeApi') : t('modeLocal'))}</span></p>
    ${TZA.notesBar()}
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${Admin.tab === k}" data-act="atab" data-v="${k}">${esc(t(l))}${k === 'mod' && pending ? ` <span class="pill warn">${pending}</span>` : ''}${k === 'items' && TZA.reviewN() ? ` <span class="pill warn" title="${esc(t('aToReview'))}">${TZA.reviewN()}</span>` : ''}</button>`).join('')}</div>
    ${body}`;
}
function adminSummary() {
  const st = ratingStats(); const items = modItems();
  const pending = items.filter(i => i.status === 'pending').length;
  const pub = items.filter(i => i.status === 'approved').length;
  const qs = [...Store.data.questions].sort((a, b) => b.ts - a.ts);
  return `<div class="tiles">
      <div class="tile"><span class="v">${st.n ? esc(fmtNum(st.avg)) : '—'}</span><span class="k">${esc(t('statAvg'))}</span></div>
      <div class="tile"><span class="v">${st.n}</span><span class="k">${esc(t('statVotes'))}</span></div>
      <div class="tile${pending ? ' attn' : ''}"><span class="v">${pending}</span><span class="k">${esc(t('statPending'))}</span></div>
      <div class="tile"><span class="v">${pub}</span><span class="k">${esc(t('statPublished'))}</span></div>
      <div class="tile"><span class="v">${qs.length}</span><span class="k">${esc(t('statQ'))}</span></div>
    </div>
    <div class="map-wrap" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))">
      <section class="panel"><h2 style="font-size:1.2rem">${esc(t('distTitle'))}</h2>${rateSumHTML()}</section>
      <section class="panel"><h2 style="font-size:1.2rem">${esc(t('recentQ'))}</h2>${qs.length ? `<ul class="qlist">${qs.slice(0, 6).map(q => `<li>${esc(q.q)}<span>${esc(fmtDate(q.ts, {day:'numeric', month:'short'}))}</span></li>`).join('')}</ul>` : `<p class="empty">${esc(t('qEmpty'))}</p>`}</section>
    </div>`;
}
function adminMod() {
  const all = modItems(); const f = Admin.filter;
  const list = all.filter(i => i.status === f);
  const cnt = k => all.filter(i => i.status === k).length;
  const pills = {pending:'warn', approved:'ok', hidden:'bad'};
  const lbl = {pending:'fPending', approved:'fApproved', hidden:'fHidden'};
  return `<div class="seg">${['pending','approved','hidden'].map(k => `<button type="button" aria-pressed="${f === k}" data-act="afilter" data-v="${k}">${esc(t(lbl[k]))} (${cnt(k)})</button>`).join('')}</div>
    <div class="entries">${list.length ? list.map(i => `<article class="mod-item">
        <div class="meta"><span class="pill">${esc(t(i.kind === 'gb' ? 'kindGb' : 'kindRv'))}</span><span class="pill ${pills[i.status]}">${esc(t(lbl[i.status]))}</span><strong>${esc(i.name || '')}</strong><span>${esc([i.city, fmtDate(i.ts)].filter(Boolean).join(' · '))}</span>${i.kind === 'review' ? starsHTML(i.stars) : ''}</div>
        <p style="white-space:pre-line;overflow-wrap:anywhere">${esc(i.text)}</p>
        <div class="field"><label class="sr" for="reply-${esc(i.id)}">${esc(t('replyPh'))}</label><textarea id="reply-${esc(i.id)}" placeholder="${esc(t('replyPh'))}" style="min-height:4rem">${esc(replyOf(i.id))}</textarea></div>
        <div class="btn-row">
          ${i.status !== 'approved' ? `<button class="btn sm" type="button" data-act="mod" data-op="approved" data-id="${esc(i.id)}"><svg class="ic"><use href="#i-check"/></svg>${esc(t('approve'))}</button>` : ''}
          ${i.status !== 'hidden' ? `<button class="btn ghost sm" type="button" data-act="mod" data-op="hidden" data-id="${esc(i.id)}">${esc(t('hide'))}</button>` : ''}
          <button class="btn ghost sm" type="button" data-act="mod" data-op="reply" data-id="${esc(i.id)}">${esc(t('saveReply'))}</button>
          <button class="btn danger sm" type="button" data-act="mod" data-op="del" data-id="${esc(i.id)}">${esc(Admin.armed === i.id ? t('delConfirm') : t('del'))}</button>
        </div></article>`).join('') : `<p class="empty">${esc(t('emptyHere'))}</p>`}</div>`;
}
function adminNews() {
  const n = Admin.editNews ? Store.data.news.find(x => x.id === Admin.editNews) : null;
  const v = (o, k) => esc((o && o[k]) || '');
  const today = new Date(Date.now() + CONFIG.tzOffsetHours * 3600e3).toISOString().slice(0, 10);
  return `<section class="panel"><h2 style="font-size:1.2rem">${esc(t(n ? 'newsEdit' : 'newsAdd'))}</h2>
      <form class="form" id="news-form" novalidate>
        <div class="row2"><div class="field"><label for="nf-tr">${esc(t('fTitleRu'))}</label><input id="nf-tr" type="text" value="${v(n && n.title, 'ru')}"></div><div class="field"><label for="nf-tk">${esc(t('fTitleKz'))}</label><input id="nf-tk" type="text" value="${v(n && n.title, 'kz')}"></div></div>
        <div class="row2"><div class="field"><label for="nf-xr">${esc(t('fTextRu'))}</label><textarea id="nf-xr">${v(n && n.text, 'ru')}</textarea></div><div class="field"><label for="nf-xk">${esc(t('fTextKz'))}</label><textarea id="nf-xk">${v(n && n.text, 'kz')}</textarea></div></div>
        <div class="row2"><div class="field"><label for="nf-d">${esc(t('fDate'))}</label><input id="nf-d" type="date" value="${esc((n && n.date) || today)}"></div><div class="field"><label for="nf-c">${esc(t('nfCat'))}</label><select id="nf-c">${[['', 'nfCatNone'], ['expo', 'nwExpo'], ['events', 'nwEvents'], ['branches', 'nwBranches'], ['fonds', 'nwFonds'], ['awards', 'nwAwards']].map(([cv, ck]) => `<option value="${cv}"${((n && n.cat) || '') === cv ? ' selected' : ''}>${esc(t(ck))}</option>`).join('')}</select></div></div>
        <div class="row2"><div class="field"><label for="nf-img">${esc(t('nfImg'))}</label><input id="nf-img" type="file" accept="image/jpeg,image/png,image/webp">${n && n.img ? `<span class="hint nf-cur"><img src="${esc(n.img)}" alt="" style="height:3rem;vertical-align:middle;border-radius:6px"> <label><input type="checkbox" id="nf-img-del"> ${esc(t('nfImgDel'))}</label></span>` : `<span class="hint">${esc(t('nfImgHint'))}</span>`}</div><div class="field"><label for="nf-yt">${esc(t('nfYt'))}</label><input id="nf-yt" type="url" inputmode="url" placeholder="https://youtu.be/…" value="${esc(n && n.yt ? 'https://youtu.be/' + n.yt : '')}"><span class="hint">${esc(t('nfYtHint'))}</span></div></div>
        <div class="btn-row"><button class="btn" type="submit">${esc(t('save'))}</button>${n ? `<button class="btn ghost" type="button" data-act="news-cancel">${esc(t('cancel'))}</button>` : ''}</div>
      </form></section>
    <div class="entries">${newsSorted().map(x => `<article class="mod-item"><div class="meta"><strong>${esc(L(x.title))}</strong><span>${esc(fmtDate(x.date))}</span>${x.demo ? `<span class="pill">${esc(t('example'))}</span>` : ''}</div><p>${esc(L(x.text))}</p>
        <div class="btn-row"><button class="btn ghost sm" type="button" data-act="news-edit" data-id="${esc(x.id)}">${esc(t('edit'))}</button><button class="btn danger sm" type="button" data-act="news-del" data-id="${esc(x.id)}">${esc(Admin.armed === 'n:' + x.id ? t('delConfirm') : t('del'))}</button></div></article>`).join('') || `<p class="empty">${esc(t('noNews'))}</p>`}</div>`;
}
function adminSettings() {
  const s = S();
  return `<form class="panel form" id="set-form" novalidate>
      <div class="field"><label for="sf-br">${esc(t('sBannerRu'))}</label><textarea id="sf-br" style="min-height:4rem">${esc(s.banner.ru)}</textarea><span class="hint">${esc(t('sBannerHint'))}</span></div>
      <div class="field"><label for="sf-bk">${esc(t('sBannerKz'))}</label><textarea id="sf-bk" style="min-height:4rem">${esc(s.banner.kz)}</textarea></div>
      <div class="row2">
        <div class="field"><label for="sf-o">${esc(t('sOpen'))}</label><input id="sf-o" type="time" value="${esc(s.open)}"></div>
        <div class="field"><label for="sf-c">${esc(t('sClose'))}</label><input id="sf-c" type="time" value="${esc(s.close)}"></div>
        <div class="field"><label for="sf-lf">${esc(t('sLunchFrom'))}</label><input id="sf-lf" type="time" value="${esc(s.lunchFrom)}"></div>
        <div class="field"><label for="sf-lt">${esc(t('sLunchTo'))}</label><input id="sf-lt" type="time" value="${esc(s.lunchTo)}"></div>
      </div>
      <div class="field"><label for="sf-p">${esc(t('sPhones'))}</label><input id="sf-p" type="text" value="${esc(s.phones.join(', '))}"></div>
      <div class="row2">
        <div class="field"><label for="sf-em">${esc(t('sEmail'))}</label><input id="sf-em" type="email" value="${esc(s.email || '')}"></div>
        <div class="field"><label for="sf-rr">${esc(t('sReading'))}</label><input id="sf-rr" type="text" value="${esc(s.reading || '')}" placeholder="10:00–17:00"></div>
      </div>
      <div class="field"><label for="sf-gk">${esc(t('sGisKey'))}</label><input id="sf-gk" type="text" value="${esc(s.gisKey || '')}" autocomplete="off" spellcheck="false"><span class="hint">${esc(t('sGisKeyHint'))}</span></div>
      <div class="field"><label for="sf-kw">${esc(t('sKeywords'))}</label><input id="sf-kw" type="text" maxlength="500" value="${esc(s.seoKeywords || '')}"><span class="hint">${esc(t('sKeywordsHint'))}</span></div>
      <div class="field"><label for="sf-oa">${esc(t('sOther'))}</label><textarea id="sf-oa" style="min-height:5rem">${esc(blds().map(b => [b.a, L(b.n), b.p.join(', ')].join(' | ')).join('\n'))}</textarea><span class="hint">${esc(t('sOtherHint'))}</span></div>
      <div class="field"><label for="sf-x">${esc(t('sExtra'))}</label><textarea id="sf-x" style="min-height:5rem">${esc(s.extraDays || '')}</textarea><span class="hint">${esc(t('sExtraHint'))}</span></div>
      <button class="btn" type="submit" style="align-self:flex-start">${esc(t('save'))}</button>
    </form>`;
}
function adminQuestions() {
  const qs = [...Store.data.questions].sort((a, b) => b.ts - a.ts).slice(0, 150);
  return `<section class="panel">${qs.length ? `<ul class="qlist">${qs.map(q => `<li>${esc(q.q)}<span>${esc((q.lang || '').toUpperCase())} · ${esc(fmtDate(q.ts, {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}))}</span></li>`).join('')}</ul>` : `<p class="empty">${esc(t('qEmpty'))}</p>`}</section>`;
}

const stripTags = h => String(h || '').replace(/<[^>]+>/g, '');
function faqRowHTML(f) {
  const v = (o, k) => esc((o && o[k]) || '');
  return `<div class="mod-item faq-row">
    <div class="row2"><div class="field"><label>${esc(t('cQ'))} · ${esc(t('cRu'))}</label><input class="fq-ru" type="text" value="${v(f.q, 'ru')}"></div><div class="field"><label>${esc(t('cQ'))} · ${esc(t('cKz'))}</label><input class="fq-kz" type="text" value="${v(f.q, 'kz')}"></div></div>
    <div class="row2"><div class="field"><label>${esc(t('cA'))} · ${esc(t('cRu'))}</label><textarea class="fa-ru" style="min-height:4.5rem">${v(f.a, 'ru')}</textarea></div><div class="field"><label>${esc(t('cA'))} · ${esc(t('cKz'))}</label><textarea class="fa-kz" style="min-height:4.5rem">${v(f.a, 'kz')}</textarea></div></div>
    <div class="row2"><div class="field"><label>${esc(t('cQ'))} · ${esc(t('cEn'))}</label><input class="fq-en" type="text" value="${v(f.q, 'en')}"></div><div class="field"><label>${esc(t('cA'))} · ${esc(t('cEn'))}</label><textarea class="fa-en" style="min-height:4.5rem">${v(f.a, 'en')}</textarea></div></div>
    <div class="btn-row"><button class="btn danger sm" type="button" data-act="faq-remove">${esc(t('cRemove'))}</button></div></div>`;
}
function adminContent() {
  const C = S().content || {};
  const para = i => { const o = C.about && C.about['p' + i]; const d = T['aboutP' + i]; return {ru:(o && o.ru) || d[0], kz:(o && o.kz) || d[1]}; };
  const branches = (Array.isArray(C.branches) && C.branches.length ? C.branches : BRANCHES.map(b => ({ru:b.t[0], kz:b.t[1]}))).map(b => (b.ru || '') + ' | ' + (b.kz || '')).join('\n');
  return `<form class="admin-stack" id="content-form" novalidate>
    <section class="panel"><h2 style="font-size:1.2rem">${esc(t('cAbout'))}</h2>
      ${[1, 2, 3].map(i => { const p = para(i); return `<div class="row2"><div class="field"><label for="cp${i}r">${esc(fmt(t('cPara'), {n:i}))} · ${esc(t('cRu'))}</label><textarea id="cp${i}r" style="min-height:4.5rem">${esc(p.ru)}</textarea></div><div class="field"><label for="cp${i}k">${esc(fmt(t('cPara'), {n:i}))} · ${esc(t('cKz'))}</label><textarea id="cp${i}k" style="min-height:4.5rem">${esc(p.kz)}</textarea></div></div>`; }).join('')}
    </section>
    <section class="panel"><h2 style="font-size:1.2rem">${esc(t('cMission'))}</h2><p class="muted sm">${esc(t('cMissionHint'))}</p>
      ${[['r', 'cRu', 'ru'], ['k', 'cKz', 'kz'], ['e', 'cEn', 'en']].map(([s, k, l]) => `<div class="field"><label for="cm${s}">${esc(t(k))}</label><textarea id="cm${s}" style="min-height:6rem">${esc((C.mission || {})[l] || '')}</textarea></div>`).join('')}
    </section>
    <section class="panel"><div class="field"><label for="c-br">${esc(t('cBranches'))}</label><textarea id="c-br" style="min-height:7rem">${esc(branches)}</textarea></div></section>
    <p class="note"><svg class="ic"><use href="#i-info"/></svg><span>${esc(t('cFaqMoved'))}</span></p>
    <div class="btn-row"><button class="btn" type="submit">${esc(t('save'))}</button><button class="btn ghost" type="button" data-act="content-reset">${esc(t('cReset'))}</button></div>
  </form>`;
}
function adminPhotos() {
  const ph = (Store.data.photos || []).filter(p => p.slot !== 'branch');   // фото зданий — во вкладке «Фото зданий»
  const slots = [['hero','slotHero'],['about','slotAbout'],['inst','slotInst'],['contacts','slotContacts'],['gallery','slotGallery'],['p-visitors','slotPVis'],['p-fonds','slotPFonds'],['p-region','slotPRegion'],['p-about','slotPAbout'],['p-news','slotPNews'],['p-contacts','slotPContacts']];
  return `<form class="panel form" id="photo-form" novalidate>
      <h2 style="font-size:1.2rem">${esc(t('phUpload'))}</h2>
      <div class="field"><label for="ph-file">${esc(t('phFile'))}</label><input id="ph-file" type="file" accept="image/*"><span class="hint">${esc(t('phHint'))}</span></div>
      <div class="field"><label for="ph-slot">${esc(t('phSlot'))}</label><select id="ph-slot">${slots.map(([v, k]) => `<option value="${v}">${esc(t(k))}</option>`).join('')}</select></div>
      <div class="row2"><div class="field"><label for="ph-cr">${esc(t('phCapRu'))}</label><input id="ph-cr" type="text" maxlength="120"></div><div class="field"><label for="ph-ck">${esc(t('phCapKz'))}</label><input id="ph-ck" type="text" maxlength="120"></div></div>
      <button class="btn" type="submit" style="align-self:flex-start">${esc(t('phUpload'))}</button>
    </form>
    ${ph.length ? `<div class="gallery">${ph.map(p => `<figure class="album"><div class="ph"><img src="${esc(p.src)}" alt="">${CORNERS}</div><figcaption>${esc(t({hero:'slotHero', about:'slotAbout', inst:'slotInst', contacts:'slotContacts', gallery:'slotGallery'}[p.slot] || 'slotGallery'))}${L(p.cap) ? ' · ' + esc(L(p.cap)) : ''}<br><button class="btn danger sm" type="button" data-act="photo-del" data-id="${esc(p.id)}" style="margin-top:.4rem">${esc(Admin.armed === 'p:' + p.id ? t('delConfirm') : t('del'))}</button></figcaption></figure>`).join('')}</div>` : `<p class="empty">${esc(t('phEmpty'))}</p>`}`;
}
async function compressImage(file, opt) {
  opt = opt || {};   // sides — длинные стороны по очереди, max — предел размера data-URL (для фото зданий меньше: они едут в /api/public)
  const url = URL.createObjectURL(file), max = opt.max || 235000;
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    for (const side of opt.sides || [1280, 1024, 820]) {
      const k = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      for (const q of [0.82, 0.72, 0.62, 0.5]) { const d = c.toDataURL('image/jpeg', q); if (d.length < max) return d; }
    }
    return null;
  } finally { URL.revokeObjectURL(url); }
}
async function adminDo(fn) {
  try { await fn(); toast(t('saved')); } catch (e) { console.warn(e); toast(t('saveFail')); }
  renderAdmin(true);
}

/* ================= events ================= */
function langMenu(open) { const b = $('#lang-btn'), l = $('#lang-list'); if (!b || !l) return; l.hidden = !open; b.setAttribute('aria-expanded', String(open)); }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#lang-list') && !$('#lang-list').hidden) { langMenu(false); $('#lang-btn').focus(); } });
document.addEventListener('click', async e => {
  if (!e.target.closest('.lang-dd')) langMenu(false);   // клик вне списка языков — закрыть
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act, v = el.dataset.v;
  switch (act) {
    case 'a11y-toggle': prefs.panel = !prefs.panel; applyPrefs(); break;
    case 'fs': { const d = +v; prefs.fs = d === 0 ? 0 : Math.max(-1, Math.min(3, prefs.fs + d)); applyPrefs(); break; }
    case 'scheme': prefs.scheme = v; applyPrefs(); break;
    case 'spacing': prefs.spacing = !prefs.spacing; applyPrefs(); break;
    case 'lang-menu': langMenu($('#lang-list').hidden); break;
    case 'lang': langMenu(false); lang = prefs.lang = v; applyPrefs(); applyI18n(); renderAll(); MapGis.refresh(); if (Chat.history.length === 0) Chat.greet(); break;
    case 'speak': {
      if (TTS.on) { TTS.stop(); break; }
      const sel = String(window.getSelection ? window.getSelection() : '').trim();
      const view = $(`.view[data-view="${current}"]`);
      TTS.speak(sel || (view ? view.innerText : '').slice(0, 5000));
      break;
    }
    case 'tab': { if (v === 'catalog') { location.hash = '#catalog'; break; } const [h, id] = String(v).split('/'); Tabs.select(h, id, true); requestAnimationFrame(() => { Reveal.scan(); CountUp.scan(); }); break; }
    case 'search-open': Search.open(''); break;
    case 'search-close': Search.close(); break;
    case 'search-close-bg': if (e.target === el) Search.close(); break;
    case 'search-go': e.preventDefault(); Search.go(el.getAttribute('href')); break;
    case 'search-try': { const i = $('#search-q'); i.value = v; Search.render(v); i.focus(); break; }
    case 'search-try-home': Search.open(v); break;
    case 'search-ask': { const q = Search.q; Search.close(true); if (q) Chat.ask(q); else Chat.open(); break; }
    case 'ask': { e.preventDefault(); const q = el.dataset.q ? t(el.dataset.q) : (el.dataset.text || ''); if (q) Chat.ask(q); else Chat.open(); break; }
    case 'chat-close': Chat.close(); break;
    case 'chat-clear': if (!Chat.busy) Chat.greet(); break;
    case 'listen': { const m = el.closest('.msg'); if (m && m.dataset.text) TTS.speak(m.dataset.text.replace(/\*\*|\[|\]\([^)]*\)/g, '')); break; }
    case 'drawer': Drawer.open(); break;
    case 'chat-open': Chat.open(); break;
    case 'lb-album': { const a = (SITE.galleryAlbums || [])[+el.dataset.k]; if (a) LB.open(a.ph, L(a.t)); break; }
    case 'lb-art': { const a = (SITE.articlePhotos || [])[+el.dataset.k]; if (a) LB.open(a.ph.map(x => ({s:x})), L(a.t), PIDX.has(String(a.id)) ? '#p/' + a.id : a.src); break; }
    case 'hc-album': Hero.album(); break;
    case 'hc-prev': Hero.go(Hero.i - 1); break; case 'hc-next': Hero.go(Hero.i + 1); break; case 'hc-pause': Hero.toggle(); break;
      case 'lb-close': LB.close(); break;
    case 'lb-prev': LB.go(-1); break;
    case 'lb-next': LB.go(1); break;
    case 'bb-map': e.preventDefault(); location.hash = 'contacts'; break;
    case 'memo': Memo.open(); break;
    case 'memo-close': Memo.close(); break;
    case 'memo-close-bg': if (e.target === el) Memo.close(); break;
    case 'memo-print': Memo.print(); break;
    case 'mic': Voice.toggle(); break;
    case 'auto-speak': prefs.autoSpeak = !prefs.autoSpeak; applyPrefs(); if (!prefs.autoSpeak) TTS.stop(); break;
    case 'drawer-close': Drawer.close(); break;
    case 'dtab': UI.dtab = v; $('#dtab-gb').setAttribute('aria-selected', String(v === 'gb')); $('#dtab-rv').setAttribute('aria-selected', String(v === 'rv')); $('#gb-list').hidden = v !== 'gb'; $('#rv-list').hidden = v !== 'rv'; break;
    case 'copy-addr': { const a = L(S().address); try { await navigator.clipboard.writeText(a); toast(t('copied')); } catch (err) { toast(t('copyFail')); } break; }
    case 'star': setStar(el.dataset.sfx, +v); break;
    case 'logout': if (SS.get('token')) Store.api('/api/admin/logout', {method:'POST', body:{}}).catch(() => {}); Admin.ok = false; SS.del('admin'); SS.del('token'); SS.del('me'); SS.del('perms'); if (Store.mode === 'api') Store.apiLoad(); renderAdmin(true); break;
    case 'atab': Admin.tab = v; Admin.armed = null; Admin.editNews = null; renderAdmin(true); break;
    case 'afilter': Admin.filter = v; Admin.armed = null; renderAdmin(true); break;
    case 'mod': {
      const id = el.dataset.id, op = el.dataset.op;
      const item = modItems().find(i => i.id === id); if (!item) break;
      const replyEl = document.getElementById('reply-' + id);
      const reply = replyEl ? replyEl.value.trim() : '';
      if (op === 'del') { if (Admin.armed !== id) { Admin.armed = id; renderAdmin(true); break; } Admin.armed = null; await adminDo(() => Store.delItem(item)); break; }
      Admin.armed = null;
      if (op === 'reply') await adminDo(() => Store.setMod(id, {status:item.status, reply}));
      else await adminDo(() => Store.setMod(id, {status:op, reply}));
      break;
    }
    case 'news-edit': Admin.editNews = el.dataset.id; renderAdmin(true); $('#nf-tr') && $('#nf-tr').focus(); break;
    case 'faq-add': $('#faq-edit').insertAdjacentHTML('beforeend', faqRowHTML({q:{}, a:{}})); break;
    case 'faq-remove': el.closest('.faq-row').remove(); break;
    case 'content-reset': { const keep = (S().content || {}).faq; await adminDo(() => Store.saveSettings({...S(), content:keep ? {faq:keep} : null})); renderContent(); break; }   // вопросы живут во вкладке «Справка и FAQ» и здесь не сбрасываются
    case 'photo-del': { const id = el.dataset.id; if (Admin.armed !== 'p:' + id) { Admin.armed = 'p:' + id; renderAdmin(true); break; } Admin.armed = null; await adminDo(() => Store.delPhoto(id)); Photos.apply(); break; }
    case 'news-cancel': Admin.editNews = null; renderAdmin(true); break;
    case 'news-del': { const id = el.dataset.id; if (Admin.armed !== 'n:' + id) { Admin.armed = 'n:' + id; renderAdmin(true); break; } Admin.armed = null; await adminDo(() => Store.delNews(id)); break; }
  }
});
document.addEventListener('submit', async e => {
  if (e.target.id === 'home-search') { e.preventDefault(); const q = $('#home-q').value.trim(); if (e.submitter && e.submitter.id === 'hs-cat') { location.hash = '#catalog' + (q ? '?q=' + encodeURIComponent(q) : ''); return; } Search.open(q); return; }
  const f = e.target; e.preventDefault();
  if (f.id === 'chat-form') { const i = $('#chat-input'); const q = i.value.trim(); if (q) { i.value = ''; autoGrow(i); Chat.ask(q); } }
  else if (f.id === 'gb-form') {
    const name = $('#gb-name').value.trim(), city = $('#gb-city').value.trim(), text = $('#gb-text').value.trim();
    $('#gb-name-err').hidden = name.length >= 2; $('#gb-name-err').textContent = t('errName');
    $('#gb-text-err').hidden = text.length >= 5; $('#gb-text-err').textContent = t('errText');
    if (name.length < 2) { $('#gb-name').focus(); return; }
    if (text.length < 5) { $('#gb-text').focus(); return; }
    const btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
    const where = await Store.addEntry({name, city, text, lang});
    btn.disabled = false; f.reset(); updateCount();
    const ok = $('#gb-ok'); ok.hidden = false; ok.querySelector('span').textContent = where === 'fallback' ? t('savedLocal') : t('gbThanks');
  }
  else if (f.dataset.rate) {
    const sfx = f.dataset.rate; const stars = UI.rating[sfx] || 0;
    if (!stars) { toast(t('rateChoose')); const b = f.querySelector('[data-act="star"]'); b && b.focus(); return; }
    const text = ($('#rate-c-' + sfx).value || '').trim();
    const btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
    const where = await Store.addReview({stars, text, name:'', lang});
    btn.disabled = false; UI.rating[sfx] = 0; mountRating(sfx);
    const ok = $('#rate-ok-' + sfx); ok.hidden = false; ok.querySelector('span').textContent = where === 'fallback' ? t('savedLocal') : t('rateThanks');
  }
  else if (f.id === 'login-form') {
    if (Store.mode === 'api') {
      try { const r = await Store.api('/api/login', {method:'POST', body:{login:($('#adm-login') || {}).value || 'admin', password:$('#adm-pwd').value}}); SS.set('token', r.token); if (r.user) { SS.set('me', JSON.stringify(r.user)); SS.set('perms', JSON.stringify(r.perms || [])); } Admin.ok = true; await Store.apiLoad(); renderAdmin(true); }
      catch (err) { $('#adm-err').hidden = false; $('#adm-pwd').focus(); }
    } else if ($('#adm-pwd').value === CONFIG.adminPassword) { Admin.ok = true; SS.set('admin', '1'); renderAdmin(true); }
    else { $('#adm-err').hidden = false; $('#adm-pwd').focus(); }
  }
  else if (f.id === 'news-form') {
    const tr = $('#nf-tr').value.trim();
    if (!tr) { toast(t('needTitle')); $('#nf-tr').focus(); return; }
    const n = {id: Admin.editNews || ('n' + Date.now()), date: $('#nf-d').value || new Date().toISOString().slice(0, 10),
      title:{ru:tr, kz:$('#nf-tk').value.trim()}, text:{ru:$('#nf-xr').value.trim(), kz:$('#nf-xk').value.trim()}};
    const old = (S().news || Store.data.news || []).find(x => x.id === n.id) || newsSorted().find(x => x.id === n.id) || {};
    n.cat = $('#nf-c').value || '';
    const ytv = $('#nf-yt').value.trim(), ytm = ytv.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || ytv.match(/^([\w-]{11})$/);
    if (ytv && !ytm) { toast(t('nfYtBad')); $('#nf-yt').focus(); return; }
    if (ytm) n.yt = ytm[1];
    const fl = $('#nf-img').files && $('#nf-img').files[0];
    if (fl) { if (!/^image\/(jpeg|png|webp)$/.test(fl.type) || fl.size > 15e6) { toast(t('nfImgHint')); return; } try { n.img = await compressImage(fl); } catch (er) { toast(t('nfImgHint')); return; } }
    else if (old.img && !($('#nf-img-del') || {}).checked) n.img = old.img;
    Admin.editNews = null;
    await adminDo(() => Store.saveNews(n));
  }
  else if (f.id === 'content-form') {
    const about = {}; [1, 2, 3].forEach(i => { about['p' + i] = {ru:$('#cp' + i + 'r').value.trim(), kz:$('#cp' + i + 'k').value.trim()}; });
    const branches = $('#c-br').value.split('\n').map(l => l.split('|').map(x => x.trim())).filter(x => x[0]).map(([ru, kz]) => ({ru, kz:kz || ''}));
    const faq = (S().content || {}).faq;   // вопросы правятся во вкладке «Справка и FAQ» (tz.js) — здесь сохраняем как есть
    const mission = {ru:$('#cmr').value.trim().slice(0, 4000), kz:$('#cmk').value.trim().slice(0, 4000), en:$('#cme').value.trim().slice(0, 4000)};   // официальная формулировка миссии (если архив передал)
    await adminDo(() => Store.saveSettings({...S(), content:{about, branches, faq, mission}}));
    renderContent();
  }
  else if (f.id === 'photo-form') {
    const file = $('#ph-file').files[0];
    if (!file) { toast(t('phNoFile')); return; }
    const src = await compressImage(file).catch(() => null);
    if (!src) { toast(t('phTooBig')); return; }
    const p = {id:'ph' + Date.now(), src, slot:$('#ph-slot').value, cap:{ru:$('#ph-cr').value.trim(), kz:$('#ph-ck').value.trim()}, ts:Date.now()};
    await adminDo(() => Store.savePhoto(p));
    Photos.apply();
  }
  else if (f.id === 'set-form') {
    const s = S();
    const next = {...s,
      banner:{ru:$('#sf-br').value.trim(), kz:$('#sf-bk').value.trim(), en:''},
      open:$('#sf-o').value || s.open, close:$('#sf-c').value || s.close, lunchFrom:$('#sf-lf').value, lunchTo:$('#sf-lt').value,
      phones:$('#sf-p').value.split(',').map(x => x.trim()).filter(Boolean), extraDays:$('#sf-x').value.trim(),
      email:$('#sf-em').value.trim(), reading:$('#sf-rr').value.trim(), gisKey:$('#sf-gk').value.trim(), seoKeywords:$('#sf-kw').value.trim(),
      otherAddresses:$('#sf-oa').value.split('\n').map(x => x.split('|').map(y => y.trim())).filter(x => x[0]).map(([a, n, p]) => ({a, n:n || '', p:(p || '').split(',').map(y => y.trim()).filter(Boolean)}))};
    await adminDo(() => Store.saveSettings(next));
    MapGis.refresh();
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'gb-text') updateCount();
  else if (e.target.id === 'chat-input') autoGrow(e.target);
});
document.addEventListener('focusout', () => { if (Admin.dirty) setTimeout(() => { if (Admin.dirty) renderAdmin(); }, 50); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (!$('#search-dlg').hidden) Search.close(); else if (!$('#memo-modal').hidden) Memo.close(); else if (!$('#chat').hidden) Chat.close(); else Drawer.close(); }
  if (e.target.id === 'chat-input' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chat-form').requestSubmit(); }
  if (e.target.id === 'search-q' && e.key === 'Enter') { e.preventDefault(); const a = $('#search-res a[data-act="search-go"]'); if (a) Search.go(a.getAttribute('href')); }
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target.closest && e.target.closest('#search-dlg')) {
    const items = [$('#search-q'), ...$$('#search-res a, #search-res button')]; const k = items.indexOf(e.target);
    if (k >= 0) { e.preventDefault(); const nx = items[Math.max(0, Math.min(items.length - 1, k + (e.key === 'ArrowDown' ? 1 : -1)))]; nx && nx.focus(); }
  }
});
function updateCount() { const v = $('#gb-text').value.length; $('#gb-count').textContent = fmt(t('chars'), {n:v, m:1000}); }
function autoGrow(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 180) + 'px'; }

$('#fab').addEventListener('click', () => Chat.open());
$('#menu-btn').addEventListener('click', () => { const n = $('#site-nav'); const o = !n.classList.contains('open'); n.classList.toggle('open', o); $('#menu-btn').setAttribute('aria-expanded', String(o)); });
$('#skip').addEventListener('click', () => { const h = $(`.view[data-view="${current}"] h1`); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } else $('#main').focus(); });
window.addEventListener('hashchange', onHash);
if (window.matchMedia) { try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyPrefs); } catch (e) {} }
new MutationObserver(applyPrefs).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});

/* ================= форматы без библиотек: TIFF (облегчённая копия скана), XLSX (импорт и экспорт каталога) =================
   Только стандартные API: DataView, DecompressionStream, TextDecoder/TextEncoder, Blob/Response.
   Работает и в браузере, и в Node 18+ (проверка: node tests/formats.js). Сборщик dev/build.py вставляет файл перед tz.js. */
const Formats = (() => {
  async function inflate(bytes, fmt) {   // fmt: 'deflate' (zlib, TIFF) или 'deflate-raw' (zip)
    const out = new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream(fmt)));
    return new Uint8Array(await out.arrayBuffer());
  }

  /* ---------- TIFF: первая страница, полосы (strips); без сжатия, LZW, PackBits, Deflate; 1/2/4/8/16 бит;
     ч/б, оттенки серого, RGB(A), палитра. Сразу уменьшает до maxSide усреднением, чтобы не держать в памяти весь скан. */
  const TIFF_COMP = {1:'нет', 5:'LZW', 8:'Deflate', 32946:'Deflate', 32773:'PackBits'};
  function lzw(src, expected) {
    const out = new Uint8Array(expected);
    const prefix = new Int32Array(4096), suffix = new Uint8Array(4096), lens = new Uint16Array(4096), first = new Uint8Array(4096);
    for (let i = 0; i < 256; i++) { prefix[i] = -1; suffix[i] = i; lens[i] = 1; first[i] = i; }
    let next = 258, width = 9, old = -1, bit = 0, op = 0;
    const read = () => {
      const by = bit >> 3; if (by >= src.length) return 257;
      const w = (src[by] << 16) | ((src[by + 1] || 0) << 8) | (src[by + 2] || 0);
      const v = (w >> (24 - (bit & 7) - width)) & ((1 << width) - 1); bit += width; return v;
    };
    const emit = code => {
      const L = lens[code]; let p = op + L - 1, c = code;
      while (c >= 0) { if (p < out.length) out[p] = suffix[c]; p--; c = prefix[c]; }
      op += L;
    };
    const add = (pre, ch) => {
      if (next >= 4096) return;
      prefix[next] = pre; suffix[next] = ch; lens[next] = lens[pre] + 1; first[next] = first[pre]; next++;
      if (next === 511) width = 10; else if (next === 1023) width = 11; else if (next === 2047) width = 12;   // «раннее» переключение ширины, как в TIFF
    };
    while (op < expected) {
      const code = read();
      if (code === 257) break;
      if (code === 256) { next = 258; width = 9; old = -1; continue; }
      if (old === -1) { if (code > 255) break; emit(code); old = code; continue; }
      if (code < next) { emit(code); add(old, first[code]); }
      else if (code === next) { add(old, first[old]); emit(code); }
      else break;   // повреждённые данные
      old = code;
    }
    return out;
  }
  function packbits(src, expected) {
    const out = new Uint8Array(expected); let i = 0, o = 0;
    while (i < src.length && o < expected) {
      const n = (src[i++] << 24) >> 24;
      if (n >= 0) { for (let k = 0; k <= n && o < expected; k++) out[o++] = src[i++]; }
      else if (n !== -128) { const v = src[i++]; for (let k = 0; k < 1 - n && o < expected; k++) out[o++] = v; }
    }
    return out;
  }
  async function decodeTIFF(buf, maxSide) {
    const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    const le = u8[0] === 0x49 && u8[1] === 0x49;
    if (!le && !(u8[0] === 0x4D && u8[1] === 0x4D)) throw new Error('это не TIFF');
    const u16 = o => dv.getUint16(o, le), u32 = o => dv.getUint32(o, le);
    if (u16(2) === 43) throw new Error('BigTIFF не поддерживается');
    const ifd = u32(4), n = u16(ifd), tags = {};
    const SZ = {1:1, 2:1, 3:2, 4:4, 6:1, 7:1, 8:2, 9:4, 16:8};
    for (let i = 0; i < n; i++) {
      const e = ifd + 2 + i * 12, tag = u16(e), type = u16(e + 2), cnt = u32(e + 4);
      if (!SZ[type]) continue;   // дробные значения (разрешение) не нужны
      const off = SZ[type] * cnt > 4 ? u32(e + 8) : e + 8, vals = [];
      for (let k = 0; k < cnt && k < 1e6; k++) vals.push(type === 3 || type === 8 ? u16(off + k * 2) : type === 4 || type === 9 ? u32(off + k * 4) : type === 16 ? Number(dv.getBigUint64(off + k * 8, le)) : u8[off + k]);
      tags[tag] = vals;
    }
    const g = (t, d) => (tags[t] ? tags[t][0] : d);
    const w = g(256), h = g(257), comp = g(259, 1), photo = g(262, 1), spp = g(277, 1), bits = (tags[258] || [1])[0];
    const rps = Math.min(g(278, h), h), pred = g(317, 1), offs = tags[273], cnts = tags[279], cmap = tags[320];
    if (!w || !h) throw new Error('нет размеров изображения');
    if (tags[322] || tags[324]) throw new Error('TIFF с плитками (tiles) не поддерживается');
    if (!offs || !cnts) throw new Error('нет данных изображения');
    if (!TIFF_COMP[comp]) throw new Error('сжатие TIFF ' + ({4:'CCITT G4', 3:'CCITT G3', 7:'JPEG', 6:'old JPEG'}[comp] || comp) + ' не поддерживается');
    if (g(284, 1) !== 1) throw new Error('раздельные плоскости цвета не поддерживаются');
    if (![0, 1, 2, 3].includes(photo)) throw new Error('цветовая модель TIFF ' + photo + ' не поддерживается');
    if (![1, 2, 4, 8, 16].includes(bits) || (g(339, 1) === 3)) throw new Error('глубина цвета ' + bits + ' бит не поддерживается');
    if (photo === 2 && spp < 3) throw new Error('RGB без трёх каналов');
    const k = Math.min(1, (maxSide || 1800) / Math.max(w, h)), ow = Math.max(1, Math.round(w * k)), oh = Math.max(1, Math.round(h * k));
    const sum = new Float32Array(ow * oh * 3), cnt = new Float32Array(ow * oh), xmap = new Int32Array(w);
    for (let x = 0; x < w; x++) xmap[x] = Math.min(ow - 1, Math.floor(x * ow / w));
    const rowBytes = Math.ceil(w * spp * bits / 8), maxV = (1 << Math.min(bits, 8)) - 1, pal = cmap ? cmap.length / 3 : 0;
    for (let s = 0; s < offs.length; s++) {
      const y0 = s * rps; if (y0 >= h) break;
      const rows = Math.min(rps, h - y0), need = rows * rowBytes;
      const raw = u8.subarray(offs[s], offs[s] + cnts[s]);
      const data = comp === 1 ? raw : comp === 5 ? lzw(raw, need) : comp === 32773 ? packbits(raw, need) : await inflate(raw, 'deflate');
      for (let r = 0; r < rows; r++) {
        const y = y0 + r, oy = Math.min(oh - 1, Math.floor(y * oh / h)), base = r * rowBytes;
        if (base + rowBytes > data.length) break;
        const row = data.subarray(base, base + rowBytes);
        if (pred === 2) {   // горизонтальная разность: восстанавливаем значения строки
          if (bits === 8) for (let i = spp; i < rowBytes; i++) row[i] = (row[i] + row[i - spp]) & 255;
          else if (bits === 16) for (let i = spp; i < w * spp; i++) { const a = i * 2, b = (i - spp) * 2; const v = ((le ? row[a] | (row[a + 1] << 8) : (row[a] << 8) | row[a + 1]) + (le ? row[b] | (row[b + 1] << 8) : (row[b] << 8) | row[b + 1])) & 0xFFFF; if (le) { row[a] = v & 255; row[a + 1] = v >> 8; } else { row[a] = v >> 8; row[a + 1] = v & 255; } }
        }
        const sample = (x, c) => {   // значение канала c пикселя x, приведённое к 0–255 (для палитры — индекс)
          const idx = x * spp + c;
          if (bits === 8) return row[idx];
          if (bits === 16) return le ? row[idx * 2 + 1] : row[idx * 2];
          const bitPos = idx * bits, v = (row[bitPos >> 3] >> (8 - bits - (bitPos & 7))) & maxV;
          return photo === 3 ? v : Math.round(v * 255 / maxV);
        };
        const ob = oy * ow;
        for (let x = 0; x < w; x++) {
          let R, G, B;
          if (photo === 2) { R = sample(x, 0); G = sample(x, 1); B = sample(x, 2); }
          else if (photo === 3) { const i = bits === 8 ? row[x * spp] : bits === 16 ? 0 : sample(x, 0); R = cmap[i] >> 8; G = cmap[i + pal] >> 8; B = cmap[i + 2 * pal] >> 8; }
          else { let v = sample(x, 0); if (photo === 0) v = 255 - v; R = G = B = v; }
          const o = ob + xmap[x]; sum[o * 3] += R; sum[o * 3 + 1] += G; sum[o * 3 + 2] += B; cnt[o]++;
        }
      }
    }
    const rgba = new Uint8ClampedArray(ow * oh * 4);
    for (let i = 0; i < ow * oh; i++) { const c = cnt[i] || 1; rgba[i * 4] = sum[i * 3] / c; rgba[i * 4 + 1] = sum[i * 3 + 1] / c; rgba[i * 4 + 2] = sum[i * 3 + 2] / c; rgba[i * 4 + 3] = 255; }
    return {width:w, height:h, outW:ow, outH:oh, rgba, info:{compression:TIFF_COMP[comp], bits, spp, photo}};
  }

  /* ---------- ZIP (для XLSX): чтение (без сжатия и deflate) и запись (без сжатия) ---------- */
  async function unzip(buf) {
    const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf), dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), td = new TextDecoder();
    let e = u8.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error('это не файл .xlsx');
    const total = dv.getUint16(e + 10, true), files = new Map(); let p = dv.getUint32(e + 16, true);
    for (let i = 0; i < total; i++) {
      if (dv.getUint32(p, true) !== 0x02014b50) throw new Error('повреждённый файл .xlsx');
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), loff = dv.getUint32(p + 42, true);
      files.set(td.decode(u8.subarray(p + 46, p + 46 + nl)), {method, csize, loff});
      p += 46 + nl + xl + cl;
    }
    const read = async name => {
      const f = files.get(name); if (!f) return null;
      const start = f.loff + 30 + dv.getUint16(f.loff + 26, true) + dv.getUint16(f.loff + 28, true), data = u8.subarray(start, start + f.csize);
      if (f.method === 0) return data;
      if (f.method === 8) return inflate(data, 'deflate-raw');
      throw new Error('способ сжатия ' + f.method + ' внутри .xlsx не поддерживается');
    };
    return {names:[...files.keys()], read, text:async name => { const b = await read(name); return b ? td.decode(b) : null; }};
  }
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = (c >>> 8) ^ CRC[(c ^ u8[i]) & 255]; return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(files) {
    const enc = new TextEncoder(), parts = [], central = []; let off = 0;
    for (const f of files) {
      const nm = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data), sz = data.length;
      const lh = new Uint8Array(30 + nm.length), lv = new DataView(lh.buffer);
      lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true); lv.setUint16(12, 0x21, true);
      lv.setUint32(14, crc, true); lv.setUint32(18, sz, true); lv.setUint32(22, sz, true); lv.setUint16(26, nm.length, true); lh.set(nm, 30);
      const ch = new Uint8Array(46 + nm.length), cv = new DataView(ch.buffer);
      cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true); cv.setUint16(14, 0x21, true);
      cv.setUint32(16, crc, true); cv.setUint32(20, sz, true); cv.setUint32(24, sz, true); cv.setUint16(28, nm.length, true); cv.setUint32(42, off, true); ch.set(nm, 46);
      parts.push(lh, data); central.push(ch); off += lh.length + sz;
    }
    const cd = central.reduce((a, c) => a + c.length, 0), end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true); ev.setUint32(12, cd, true); ev.setUint32(16, off, true);
    const all = [...parts, ...central, end], out = new Uint8Array(all.reduce((a, c) => a + c.length, 0)); let o = 0;
    for (const c of all) { out.set(c, o); o += c.length; }
    return out;
  }

  /* ---------- XLSX: первый лист в массив строк; запись массива строк в .xlsx (первая строка — заголовок, жирная) ---------- */
  const unesc = s => s.replace(/&(lt|gt|amp|quot|apos|#\d+|#x[0-9a-fA-F]+);/g, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : {lt:'<', gt:'>', amp:'&', quot:'"', apos:"'"}[e]);
  const tText = s => { let out = ''; s.replace(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g, (m, x) => { out += unesc(x); return m; }); return out; };
  const colIdx = s => [...s].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
  async function readXLSX(buf) {
    const z = await unzip(buf);
    const wb = await z.text('xl/workbook.xml'); if (!wb) throw new Error('это не файл .xlsx (нет книги Excel)');
    const rels = (await z.text('xl/_rels/workbook.xml.rels')) || '';
    const sid = (/<sheet\b[^>]*\br:id="([^"]+)"/.exec(wb) || [])[1];
    let target = 'worksheets/sheet1.xml';
    if (sid) { const rel = new RegExp('<Relationship\\b[^>]*\\bId="' + sid.replace(/[^\w]/g, '') + '"[^>]*>').exec(rels); const tm = rel && /\bTarget="([^"]+)"/.exec(rel[0]); if (tm) target = tm[1]; }
    const sheetPath = target.startsWith('/') ? target.slice(1) : 'xl/' + target.replace(/^\.\//, '');
    const ssx = await z.text('xl/sharedStrings.xml');
    const ss = ssx ? [...ssx.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(m => tText(m[1])) : [];
    const sx = await z.text(sheetPath); if (!sx) throw new Error('в файле не найден лист');
    const rows = [];
    for (const rm of sx.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
      const rn = /\br="(\d+)"/.exec(rm[1]), ri = rn ? +rn[1] - 1 : rows.length, cells = [];
      for (const cm of (rm[2] || '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const a = cm[1], body = cm[2] || '', ref = /\br="([A-Z]+)\d+"/.exec(a), ci = ref ? colIdx(ref[1]) : cells.length;
        const tp = (/\bt="(\w+)"/.exec(a) || [])[1], v = (/<v>([\s\S]*?)<\/v>/.exec(body) || [])[1];
        cells[ci] = tp === 's' ? (ss[+v] ?? '') : tp === 'inlineStr' ? tText(body) : tp === 'b' ? (v === '1' ? 'TRUE' : 'FALSE') : v != null ? unesc(v) : '';
      }
      rows[ri] = Array.from(cells, x => x ?? '');
    }
    return Array.from(rows, r => r || []);
  }
  const xesc = s => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
  const colName = i => { let s = ''; for (i++; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s; return s; };
  function writeXLSX(rows, sheetName) {
    const NS = 'http://schemas.openxmlformats.org/', X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    const cell = (v, ref, bold) => v == null || v === '' ? '' : typeof v === 'number' && isFinite(v) ? `<c r="${ref}"${bold ? ' s="1"' : ''}><v>${v}</v></c>` : `<c r="${ref}" t="inlineStr"${bold ? ' s="1"' : ''}><is><t xml:space="preserve">${xesc(v)}</t></is></c>`;
    const sheet = X + `<worksheet xmlns="${NS}spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetData>` +
      rows.map((r, ri) => `<row r="${ri + 1}">` + r.map((v, ci) => cell(v, colName(ci) + (ri + 1), ri === 0)).join('') + '</row>').join('') + '</sheetData></worksheet>';
    const styles = X + `<styleSheet xmlns="${NS}spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
    const R = `${NS}officeDocument/2006/relationships`;
    return zip([
      {name:'[Content_Types].xml', data:X + `<Types xmlns="${NS}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`},
      {name:'_rels/.rels', data:X + `<Relationships xmlns="${NS}package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>`},
      {name:'xl/workbook.xml', data:X + `<workbook xmlns="${NS}spreadsheetml/2006/main" xmlns:r="${R}"><sheets><sheet name="${xesc(String(sheetName || 'Лист1').slice(0, 31).replace(/[\\/?*[\]:]/g, ' '))}" sheetId="1" r:id="rId1"/></sheets></workbook>`},
      {name:'xl/_rels/workbook.xml.rels', data:X + `<Relationships xmlns="${NS}package/2006/relationships"><Relationship Id="rId1" Type="${R}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${R}/styles" Target="styles.xml"/></Relationships>`},
      {name:'xl/styles.xml', data:styles},
      {name:'xl/worksheets/sheet1.xml', data:sheet}
    ]);
  }
  /* тип файла по первым байтам — как на сервере */
  function sniff(u8) {
    if (!u8 || u8.length < 12) return null;
    if (u8[0] === 0xFF && u8[1] === 0xD8 && u8[2] === 0xFF) return 'jpg';
    if (u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4E && u8[3] === 0x47) return 'png';
    const s = (a, b) => String.fromCharCode(...u8.subarray(a, b));
    if (s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return 'webp';
    if (s(0, 4) === 'II*\0' || s(0, 4) === 'MM\0*') return 'tif';
    if (s(0, 5) === '%PDF-') return 'pdf';
    if (s(0, 4) === 'PK\u0003\u0004') return 'zip';
    if (s(4, 8) === 'ftyp') return /^M4[AB] $/.test(s(8, 12)) ? 'm4a' : 'mp4';
    if (u8[0] === 0x1A && u8[1] === 0x45 && u8[2] === 0xDF && u8[3] === 0xA3) return 'webm';
    if (s(0, 4) === 'OggS') return 'ogg';
    if (s(0, 4) === 'RIFF' && s(8, 12) === 'WAVE') return 'wav';
    if (s(0, 3) === 'ID3' || (u8[0] === 0xFF && (u8[1] & 0xE0) === 0xE0 && ((u8[1] >> 3) & 3) !== 1 && ((u8[1] >> 1) & 3) !== 0)) return 'mp3';
    return null;
  }
  return {decodeTIFF, readXLSX, writeXLSX, unzip, zip, crc32, sniff};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Formats;

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

/* ================= Разделы из дополнения к ТЗ от 10.11.2026 (разд. 2 и 9) =================
   «Услуги» (справка), «Антикоррупция» (комплаенс-служба), «Календарь дат» и блок основных нормативных актов.
   Склеивается с tz.js в dev/build.py и видит все его имена (esc, t, L, S, tzIc, TZD, Pages …).
   Все данные — от заказчика (dev/customer*.json, pages/calendar.json) или со старого сайта; незаполненное помечено прямо в тексте. */

Object.assign(T, {
  tSvc:["Услуги","Қызметтер","Services"], tCompl:["Антикоррупция","Сыбайлас жемқорлыққа қарсы іс-қимыл","Anti-corruption"], tCal:["Календарь дат","Күндер күнтізбесі","Calendar of dates"],
  // услуги
  svcNote:["Справочный раздел. Заявления, запросы, заказы и платежи на сайте не принимаются. Государственные услуги оформляются на eGov.kz, обращения — на eOtinish.kz: это внешние сайты, переход на них обозначен значком.","Анықтамалық бөлім. Сайтта өтініштер, сұраулар, тапсырыстар және төлемдер қабылданбайды. Мемлекеттік қызметтер eGov.kz-те, өтініштер eOtinish.kz-те ресімделеді: бұл сыртқы сайттар, оларға өту белгімен көрсетілген.","A reference section. Applications, requests, orders and payments are not accepted on this site. State services are arranged on eGov.kz and appeals on eOtinish.kz: these are external sites, marked with an icon."],
  svcGovT:["Государственная услуга","Мемлекеттік қызмет","State service"],
  svcGovL:["Архив оказывает государственную услугу по выдаче архивных справок, копий и выписок. Здесь собраны закон, правила и отчёты; оформление — на внешних ресурсах.","Мұрағат архив анықтамаларын, көшірмелері мен үзінді көшірмелерін беру жөніндегі мемлекеттік қызмет көрсетеді. Мұнда заң, қағидалар және есептер жиналған; ресімдеу — сыртқы ресурстарда.","The archive provides the state service of issuing archival certificates, copies and extracts. The law, rules and reports are collected here; the service itself is arranged on external resources."],
  svcName:["Услуга","Қызмет","Service"], svcHow:["Как обратиться","Қалай жүгінуге болады","How to apply"], svcContacts:["Приёмная архива","Мұрағат қабылдау бөлмесі","Archive reception"], svcTerms:["Условия, сроки, стоимость","Шарттар, мерзімдер, құны","Terms, deadlines, cost"],
  svcNameV:["«Выдача архивных справок, копий архивных документов или архивных выписок»","«Архивтік анықтамалар, архивтік құжаттардың көшірмелерін немесе архивтік үзінді көшірмелерді беру»","“Issuing archival certificates, copies of archival documents or archival extracts”"],
  svcHowV:["Через eGov.kz (государственные услуги) или eOtinish.kz (обращения), либо лично через приёмную архива. На этом сайте заявление подать нельзя.","eGov.kz (мемлекеттік қызметтер) немесе eOtinish.kz (өтініштер) арқылы не мұрағаттың қабылдау бөлмесі арқылы жеке өзіңіз. Бұл сайтта өтініш беру мүмкін емес.","Through eGov.kz (state services) or eOtinish.kz (appeals), or in person at the archive reception. An application cannot be submitted on this site."],
  svcTermsV:["Сроки, перечень документов и стоимость указываются по утверждённому регламенту. Утверждённые сведения заказчик ещё не передал, поэтому здесь они не публикуются; порядок получения справок описан на странице «Архивная справка».","Мерзімдер, құжаттар тізбесі және құны бекітілген регламент бойынша көрсетіледі. Тапсырыс беруші бекітілген мәліметтерді әлі бермегендіктен, олар мұнда жарияланбайды; анықтама алу тәртібі «Архив анықтамасы» бетінде сипатталған.","Deadlines, the list of documents and the cost are given under the approved regulation. The customer has not yet supplied the approved details, so they are not published here; the procedure for certificates is described on the “Archival certificate” page."],
  svcCertLink:["Как получить архивную справку","Архив анықтамасын қалай алуға болады","How to get an archival certificate"], svcLaw:["Закон РК «О государственных услугах» — Әділет","«Мемлекеттік көрсетілетін қызметтер туралы» ҚР Заңы — Әділет","Law “On State Services” — Adilet"],
  svcPaidT:["Платные услуги","Ақылы қызметтер","Paid services"],
  svcPaidL:["Цены на товары (работы, услуги), которые реализуют государственные архивы управления цифровизации и архивов ВКО, утверждены постановлением; прейскурант опубликован ниже вместе с ним. Это справочные сведения: сайт не оформляет заказы, не считает стоимость и не принимает платежи.","ШҚО цифрландыру және архивтер басқармасының мемлекеттік архивтері өткізетін тауарлардың (жұмыстардың, қызметтердің) бағалары қаулымен бекітілген; бағалар тізімі төменде қаулымен бірге жарияланған. Бұл анықтамалық мәлімет: сайт тапсырыс ресімдемейді, құнын есептемейді және төлем қабылдамайды.","Prices for goods (works, services) sold by the state archives of the EKR Department of Digitalisation and Archives are set by a resolution; the price list is published below with it. This is reference information: the site does not take orders, calculate costs or accept payments."],
  svcChecked:["Сведения перенесены с прежнего сайта и дополнены данными заказчика. Дата последней проверки: {d}. Актуальные редакции документов проверяйте на adilet.zan.kz.","Мәліметтер бұрынғы сайттан көшірілген және тапсырыс берушінің деректерімен толықтырылған. Соңғы тексерілген күні: {d}. Құжаттардың өзекті редакцияларын adilet.zan.kz сайтынан тексеріңіз.","The information was moved from the former site and supplemented with the customer's data. Last checked: {d}. Check current versions of documents on adilet.zan.kz."],
  extSite:["внешний сайт","сыртқы сайт","external site"],
  // нормативные акты
  normT:["Основные нормативные акты","Негізгі нормативтік актілер","Key regulations"], normL:["Реквизиты — по дополнению к ТЗ от 10.11.2026. Действующие редакции и изменения проверяйте в ИПС «Әділет».","Деректемелер — 10.11.2026 жылғы ТТ толықтыруы бойынша. Қолданыстағы редакциялар мен өзгерістерді «Әділет» АҚЖ-да тексеріңіз.","Details are from the TZ addendum of 10.11.2026. Check current versions and amendments in the Adilet legal database."],
  normAdilet:["Поиск актов в ИПС «Әділет»","«Әділет» АҚЖ-да актілерді іздеу","Search acts in Adilet"],
  // антикоррупция
  cmpT:["Комплаенс-служба и противодействие коррупции","Комплаенс-қызмет және сыбайлас жемқорлыққа қарсы іс-қимыл","Compliance service and anti-corruption"],
  cmpOfficer:["Комплаенс-офицер","Комплаенс-офицер","Compliance officer"], cmpPhone:["Контактный телефон","Байланыс телефоны","Contact phone"],
  cmpPhoneNo:["будет указан после подтверждения; общий телефон архива — {p}","расталғаннан кейін көрсетіледі; мұрағаттың жалпы телефоны — {p}","will be given after confirmation; the archive's general phone is {p}"],
  cmpDocs:["Документы","Құжаттар","Documents"], cmpNotices:["Информация","Ақпарат","Information"], cmpLinks:["Официальные ресурсы","Ресми ресурстар","Official resources"],
  cmpAgency:["Агентство РК по противодействию коррупции — gov.kz","ҚР Сыбайлас жемқорлыққа қарсы іс-қимыл агенттігі — gov.kz","Anti-Corruption Agency of Kazakhstan — gov.kz"], cmpLaw:["Закон РК «О противодействии коррупции» — Әділет","«Сыбайлас жемқорлыққа қарсы іс-қимыл туралы» ҚР Заңы — Әділет","Law “On Combating Corruption” — Adilet"],
  cmpOld:["Материалы с прежнего сайта","Бұрынғы сайттың материалдары","Materials from the former site"], cmpRu:["рус.","орыс.","RU"], cmpKk:["қаз.","қаз.","KK"],
  // календарь
  calT:["Календарь юбилейных и памятных дат Восточно-Казахстанской области","Шығыс Қазақстан облысының мерейтойлық және атаулы күндер күнтізбесі","Calendar of anniversaries and memorable dates of East Kazakhstan Region"],
  calL:["Даты из истории края по годам: рождения людей, основание городов, газет, учреждений. Данные заказчика (Государственный архив ВКО).","Өлке тарихынан жылдар бойынша күндер: адамдардың туған күндері, қалалардың, газеттердің, мекемелердің құрылуы. Тапсырыс беруші деректері (ШҚО мемлекеттік архиві).","Dates from the region's history by year: birthdays of notable people, foundings of towns, newspapers and institutions. Data supplied by the State Archive of EKR."],
  calAllM:["Все месяцы","Барлық айлар","All months"], calFind:["Поиск по тексту","Мәтін бойынша іздеу","Search the text"], calNone:["По этому запросу дат нет","Бұл сұрау бойынша күндер жоқ","No dates for this query"],
  calNear:["Ближайшие даты","Жақын күндер","Coming up"], calNoDay:["Без точного числа","Нақты күнсіз","No exact day"], calPast:["Календари прошлых лет (прежний сайт)","Өткен жылдардың күнтізбелері (бұрынғы сайт)","Calendars of earlier years (former site)"],
  calN:["Дат: {n}","Күндер: {n}","Dates: {n}"], calYear:["год","жыл","year"]
});

/* --- вкладки: «Услуги» в справке, «Антикоррупция» в «Об архиве», «Календарь дат» в «Истории края» --- */
HUBS.visitors = ['cert', 'genealogy', 'reading', 'services', 'guide', 'faq'];   // «О сайте» и «Документы и ссылки» убраны как лишние: законы — в «Об архиве», адреса — в «Филиалах»
HUBS.about = ['intro', 'history', 'team', 'activity', 'docs', 'compliance'];
HUBS.region = ['essays', 'expo', 'calendar', 'photo', 'articles', 'districts'];
Object.assign(TAB_T, {services:'tSvc', compliance:'tCompl', calendar:'tCal'});
// страницы старого сайта, которые теперь показывает свой раздел: антикоррупция — во вкладке «Антикоррупция», календари — в «Календаре дат»
OLD_TABS['about/docs'] = ['law', 52670, 42569];
OLD_TABS['region/expo'] = [1376];
const SEC_CHECKED = '11.11.2026';
const extLink = (u, txt, cls) => `<a class="${cls || 'btn ghost sm'}" href="${esc(u)}" target="_blank" rel="noopener">${esc(txt)} <span class="sr">(${esc(t('extSite'))})</span>${tzIc('i-ext')}</a>`;
const ADILET = 'https://adilet.zan.kz/rus';

/* --- услуги --- */
function svcHTML() {
  setTimeout(() => Prc.render(), 0);
  const s = S(), ph = (s.phones && s.phones[0]) || '', em = s.email || '';
  return `<div class="svc">
    <section class="svc-sec" aria-labelledby="svc-gov-h"><h2 id="svc-gov-h">${esc(t('svcGovT'))}</h2>
      <p><b>${esc(t('svcNameV'))}</b></p>
      <p class="btn-row">${extLink(EGOV[lang], 'eGov.kz')}${extLink('https://eotinish.kz', 'eOtinish.kz')}<a class="btn ghost sm" href="#visitors/cert">${esc(t('svcCertLink'))}</a></p>
      <p class="muted sm">${ph ? telLinks([ph]) : ''}${em ? ` · <a href="mailto:${esc(em)}">${esc(em)}</a>` : ''}</p>
    </section>
    <section class="svc-sec" aria-labelledby="svc-paid-h"><h2 id="svc-paid-h">${esc(t('svcPaidT'))}</h2><div id="prc-root" class="prc"></div></section>
  </div>`;
}
Object.assign(PANELS.visitors, {services:svcHTML});

/* --- прейскурант платных услуг: постановление ВКО акимата от 15.12.2023 № 289 (dev/customer-prices.json, PDF в public-docs/prices/) ---
   Строка данных: [номер, название ru, единица ru, цена, название kk, единица kk]. Строка без цены — заголовок группы. */
Object.assign(T, {
  prcT:["Прейскурант платных услуг","Ақылы қызметтер прейскуранты","Price list for paid services"],
  prcDoc:["Утверждён постановлением Восточно-Казахстанского областного акимата от 15.12.2023 № 289. Это справочные сведения: сайт не оформляет заказы и не принимает платежи.","Шығыс Қазақстан облысы әкімдігінің 2023 жылғы 15 желтоқсандағы № 289 қаулысымен бекітілген. Бұл анықтамалық мәлімет: сайт тапсырыс ресімдемейді және төлем қабылдамайды.","Approved by resolution No. 289 of the East Kazakhstan Regional Akimat dated 15 December 2023. This is reference information: the site does not take orders or accept payments."],
  prcKnow:["Что важно знать","Білу маңызды","Good to know"], prcRestT:["Категории сложности реставрации","Қалпына келтіру күрделілігінің санаттары","Restoration complexity categories"],
  prcFind:["Поиск по прейскуранту","Прейскурант бойынша іздеу","Search the price list"], prcAll:["Все разделы","Барлық бөлімдер","All sections"],
  prcQuick:["Частые запросы","Жиі сұралатындар","Popular"], prcN:["Позиций с ценой: {n}","Бағасы бар позициялар: {n}","Priced items: {n}"],
  prcNone:["По этому запросу позиций нет","Бұл сұрау бойынша позициялар жоқ","No items for this query"],
  prcColI:["Номер","Нөмір","No."], prcColN:["Наименование","Атауы","Item"], prcColU:["Единица","Өлшем бірлігі","Unit"], prcColP:["Цена, ₸","Бағасы, ₸","Price, ₸"],
  prcCur:["Цены в тенге, как в постановлении (валюта и НДС в документе не оговорены). Точную стоимость уточняйте в архиве. Нумерация строк — по тексту постановления.","Бағалар қаулыдағыдай теңгемен (құжатта валюта мен ҚҚС көрсетілмеген). Нақты құнын мұрағаттан нақтылаңыз. Жолдардың нөмірленуі — қаулы мәтініне сәйкес.","Prices are in tenge as in the resolution (the document does not state currency or VAT). Confirm the exact cost with the archive. Row numbering follows the resolution."],
  prcKkPart:["Часть строк раздела 2 на казахском не приведена: они показаны на русском, полный казахский текст — в PDF.","2-бөлімнің кейбір жолдары қазақша берілмеген: олар орысша көрсетілген, толық қазақша мәтін — PDF-те.","Some rows of section 2 are shown in Russian only."]
});
const PRC_QUICK = [   // [подпись ru, kk, en, запрос ru, запрос kk]
  ['Ксерокопия', 'Ксерокөшірме', 'Photocopy', 'ксерокоп', 'ксерокөшір'],
  ['Цифровая копия', 'Цифрлық көшірме', 'Digital copy', 'цифровая коп', 'цифрлық көшір'],
  ['Архивная справка', 'Архив анықтамасы', 'Archival certificate', 'справк', 'анықтама'],
  ['Генеалогический запрос', 'Генеалогиялық сұрау', 'Genealogical query', 'генеалог', 'генеалог'],
  ['Консультация', 'Кеңес беру', 'Consultation', 'консульт', 'кеңес бер']
];
const Prc = {
  q: '', sec: 0, flat: null,
  P() { return SITE.prices || null; },
  depth(i) { return String(i).replace(/\.$/, '').split('.').length; },
  prep() {   // один раз: глубина строки, цепочка заголовков-родителей и строка для поиска (ru + kk)
    const P = this.P(); if (this.flat && this.src === P) return this.flat;
    this.src = P;   // SiteTr при смене языка подставляет новый объект с переводом — строки поиска пересобираем
    if (!P) return (this.flat = []);
    return (this.flat = P.secs.map(s => { const stack = [];
      return s.rows.map((r, k, all) => { const d = this.depth(r[0]), leaf = !!r[3];
        stack.length = Math.min(stack.length, d);
        const anc = stack.filter(a => a != null);
        const hay = norm([r[0], r[1], r[4] || '', r[6] || '', ...anc.map(a => all[a][1] + ' ' + (all[a][4] || '') + ' ' + (all[a][6] || ''))].join(' '));
        if (!leaf) stack[d] = k;
        return {r, d, leaf, anc, hay}; }); }));
  },
  vis(si) {
    const rows = this.prep()[si], toks = norm(this.q).split(' ').filter(Boolean);
    if (!toks.length) return {rows, n:rows.filter(x => x.leaf).length};
    const keep = new Set(); rows.forEach((x, k) => { if (x.leaf && toks.every(w => x.hay.includes(w))) { keep.add(k); x.anc.forEach(a => keep.add(a)); } });
    const out = rows.filter((x, k) => keep.has(k)); return {rows:out, n:out.filter(x => x.leaf).length};
  },
  rowHTML(x) {
    const r = x.r, kz = lang === 'kz', en = lang === 'en' && r[6], kk = kz && r[4], name = en ? r[6] : kk ? r[4] : r[1], unit = en ? (r[7] || '') : kk ? (r[5] || r[2]) : r[2], la = (kz && !r[4]) || (lang === 'en' && !r[6]) ? ' lang="ru"' : '';
    const two = r[3].includes(' / '), br = v => esc(v).replace(/ \/ /g, '<br>');
    return `<tr class="${x.leaf ? 'l' : 'h'} d${Math.max(0, Math.min(4, x.d - 2))}"><td class="prc-i">${esc(r[0])}</td><td class="prc-n"${la}>${esc(name)}</td><td class="prc-u"${la}>${two ? br(unit) : esc(unit)}</td><td class="prc-p">${two ? br(r[3]) : esc(r[3])}</td></tr>`;
  },
  list() {
    const box = $('#prc-list'), P = this.P(); if (!box || !P) return;
    const kz = lang === 'kz', filt = !!norm(this.q).trim(); let total = 0;
    const html = P.secs.map((s, si) => {
      if (this.sec && this.sec !== si + 1) return '';
      const v = this.vis(si); if (!v.rows.length) return ''; total += v.n;
      const title = s.t[lang === 'en' ? 2 : kz ? 1 : 0] || s.t[0], open = filt || this.sec;
      return `<details class="prc-sec"${open ? ' open' : ''}><summary><span class="prc-sn">${esc(s.i)}</span><span class="prc-st">${esc(title)}</span><small>${v.n}</small></summary>
        <table class="prc-t"><caption class="sr">${esc(title)}</caption><thead><tr><th scope="col">${esc(t('prcColI'))}</th><th scope="col">${esc(t('prcColN'))}</th><th scope="col">${esc(t('prcColU'))}</th><th scope="col">${esc(t('prcColP'))}</th></tr></thead><tbody>${v.rows.map(x => this.rowHTML(x)).join('')}</tbody></table></details>`;
    }).join('');
    box.innerHTML = html || `<p class="note">${tzIc('i-info')}<span>${esc(t('prcNone'))}</span></p>`;
    const cnt = $('#prc-n'); if (cnt) cnt.textContent = fmt(t('prcN'), {n:total});
  },
  render() {
    const root = $('#prc-root'), P = this.P(); if (!root || !P) return;
    const kz = lang === 'kz', pick = o => lang === 'en' && o.en ? o.en : o[kz ? 'kk' : 'ru'], li = lg => lang === 'en' ? 2 : kz ? 1 : 0, qi = kz ? 4 : 3;
    const order = kz ? ['kz', 'ru'] : ['ru', 'kz'];
    const know = P.notes.map(n => `<li>${esc(pick(n))}${n.id === 'rest' && P.restor ? `<details class="prc-rest"><summary>${esc(t('prcRestT'))}</summary><ul>${pick(P.restor).map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}</li>`).join('');
    root.innerHTML = `${lang === 'en' ? blockNote('prices') : ''}
      <h3>${esc(t('prcT'))}</h3>
      <p class="muted">${esc(t('prcDoc'))}</p>
      <p class="btn-row">${order.map(k => `<a class="btn ghost sm" href="${esc(P.pdf[k])}" target="_blank" rel="noopener">PDF · ${esc(t(k === 'kz' ? 'cmpKk' : 'cmpRu'))} <small>${esc(fmtNum(P.pdf.mb[k]))} ${esc(t('mb'))}</small></a>`).join('')}</p>
      <aside class="note prc-note">${tzIc('i-info')}<div><details><summary><b>${esc(t('prcKnow'))}</b></summary><ul class="prc-know">${know}</ul></details></div></aside>
      <div class="prc-ctl"><label class="cat-sel"><span class="sr">${esc(t('prcAll'))}</span><select id="prc-sec"><option value="0">${esc(t('prcAll'))}</option>${P.secs.map((s, i) => { const tt = s.t[lang === 'en' ? 2 : kz ? 1 : 0] || s.t[0]; return `<option value="${i + 1}"${this.sec === i + 1 ? ' selected' : ''}>${esc(s.i + '. ' + (tt.length > 64 ? tt.slice(0, 61) + '…' : tt))}</option>`; }).join('')}</select></label>
        <label class="ffield"><span class="sr">${esc(t('prcFind'))}</span><input type="search" id="prc-q" value="${esc(this.q)}" placeholder="${esc(t('prcFind'))}" autocomplete="off"></label><span class="muted" id="prc-n" aria-live="polite"></span></div>
      <div class="chips prc-quick" role="group" aria-label="${esc(t('prcQuick'))}">${PRC_QUICK.map(c => `<button type="button" class="chip" data-prc-q="${esc(c[qi])}" aria-pressed="${norm(this.q) === norm(c[qi])}">${esc(c[li()])}</button>`).join('')}</div>
      <div id="prc-list"></div>
      <p class="muted sm">${esc(t('prcCur'))}${kz ? ' ' + esc(t('prcKkPart')) : ''}</p>`;
    this.list();
  }
};
document.addEventListener('input', e => { if (e.target.id === 'prc-q') { Prc.q = e.target.value; clearTimeout(Prc.t); Prc.t = setTimeout(() => { Prc.list(); document.querySelectorAll('[data-prc-q]').forEach(b => b.setAttribute('aria-pressed', String(norm(Prc.q) === norm(b.dataset.prcQ)))); }, 150); } });
document.addEventListener('change', e => { if (e.target.id === 'prc-sec') { Prc.sec = +e.target.value; Prc.list(); } });
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-prc-q]'); if (!b) return;
  Prc.q = norm(Prc.q) === norm(b.dataset.prcQ) ? '' : b.dataset.prcQ;
  const inp = $('#prc-q'); if (inp) inp.value = Prc.q;
  document.querySelectorAll('[data-prc-q]').forEach(x => x.setAttribute('aria-pressed', String(norm(Prc.q) === norm(x.dataset.prcQ))));
  Prc.list();
});

/* --- основные нормативные акты (над списком актов со старого сайта) --- */
const NORMS = [
  [['Закон РК «О Национальном архивном фонде и архивах»', 'Қазақстан Республикасының «Ұлттық архив қоры және архивтер туралы» Заңы', 'Law of the Republic of Kazakhstan “On the National Archival Fonds and Archives”'], ['от 22.12.1998 № 326-I', '22.12.1998 ж. № 326-I', 'of 22.12.1998 No. 326-I'], ADILET + '/docs/Z980000326_'],
  [['Правила комплектования, хранения, учёта и использования документов Национального архивного фонда и других архивных документов государственными и специальными государственными архивами', 'Ұлттық архив қорының және басқа да архив құжаттарын мемлекеттік және арнайы мемлекеттік архивтердің жинақтау, сақтау, есепке алу және пайдалану қағидалары', 'Rules for acquisition, storage, accounting and use of documents of the National Archival Fonds and other archival documents by state and special state archives'], ['приказ от 09.08.2023 № 215', '09.08.2023 ж. № 215 бұйрық', 'order of 09.08.2023 No. 215'], ''],
  [['Правила оказания государственных услуг в области архивного дела', 'Архив ісі саласындағы мемлекеттік қызметтер көрсету қағидалары', 'Rules for providing state services in the field of archival affairs'], ['приказ от 29.05.2020 № 159', '29.05.2020 ж. № 159 бұйрық', 'order of 29.05.2020 No. 159'], ''],
  [['Закон РК «О государственных услугах»', 'Қазақстан Республикасының «Мемлекеттік көрсетілетін қызметтер туралы» Заңы', 'Law of the Republic of Kazakhstan “On State Services”'], '', 'https://adilet.zan.kz/rus/docs/Z1300000088'],
  [['Закон РК «О персональных данных и их защите»', 'Қазақстан Республикасының «Дербес деректер және оларды қорғау туралы» Заңы', 'Law of the Republic of Kazakhstan “On Personal Data and Their Protection”'], ['от 21.05.2013 № 94-V', '21.05.2013 ж. № 94-V', 'of 21.05.2013 No. 94-V'], ''],
  [['Закон РК «О противодействии коррупции»', 'Қазақстан Республикасының «Сыбайлас жемқорлыққа қарсы іс-қимыл туралы» Заңы', 'Law of the Republic of Kazakhstan “On Combating Corruption”'], '', 'https://adilet.zan.kz/rus/docs/Z1500000410']
];
function normHTML() {
  return `<section class="norm" aria-labelledby="norm-h"><h2 id="norm-h">${esc(t('normT'))}</h2><p class="muted">${esc(t('normL'))}</p>
    <ul class="bl-grid">${NORMS.map(([n0, d0, u]) => { const n = L(n0), d = d0 ? L(d0) : ''; return `<li class="bl-card"><b>${u ? extLink(u, n, 'text-link') : esc(n)}</b>${d ? `<small>${esc(d)}</small>` : ''}</li>`; }).join('')}</ul>
    <p>${extLink(ADILET, t('normAdilet'))}</p></section>`;
}
{ const d0 = PANELS.about.docs; PANELS.about.docs = () => normHTML() + (d0 ? d0() : ''); }

/* --- антикоррупция --- */
function complHTML() {
  const C = SITE.compliance; if (!C) return `<p class="note">${esc(t('catNone'))}</p>`;
  const kz = lang === 'kz', en = lang === 'en', pick = o => en && o.en && o.en.length ? o.en : kz && o.kz && o.kz.length ? o.kz : o.ru, one = o => (en && o.en) || (kz && o.kz) || o.ru;
  const o = C.officer || {}, ph = (S().phones || [])[0] || '';
  return `<div class="cmp">
    ${en ? blockNote('compliance') : ''}
    <h2>${esc(t('cmpT'))}</h2>
    <dl class="cat-dl cmp-off">
      <div><dt>${esc(t('cmpOfficer'))}</dt><dd><b>${esc(o.n || '')}</b></dd></div>
      <div><dt>${esc(t('cmpPhone'))}</dt><dd>${o.p ? telLinks([o.p]) : esc(fmt(t('cmpPhoneNo'), {p:ph}))}</dd></div>
    </dl>
    <h3>${esc(t('cmpNotices'))}</h3>
    ${(C.notices || []).map(n => `<article class="cmp-n"><h4>${esc(one(n.t))}</h4>${pick(n.d).map(p => `<p>${esc(p)}</p>`).join('')}</article>`).join('')}
    <h3>${esc(t('cmpDocs'))}</h3>
    <ul class="cmp-docs">${(C.docs || []).map(d => { const first = kz ? 'kz' : 'ru', second = kz ? 'ru' : 'kz', lbl = k => t(k === 'kz' ? 'cmpKk' : 'cmpRu');
      return `<li><a class="doc" href="${esc(d[first])}" target="_blank" rel="noopener">${esc(one(d.t))}</a> <small class="muted">PDF, ${esc(fmtNum(d.mb[first]))} ${esc(t('mb'))}</small>
        <span class="cmp-alt">${esc(lbl(second))}: <a href="${esc(d[second])}" target="_blank" rel="noopener">PDF, ${esc(fmtNum(d.mb[second]))} ${esc(t('mb'))}</a></span></li>`; }).join('')}</ul>
    <h3>${esc(t('cmpLinks'))}</h3>
    <ul class="cat-kids"><li>${extLink('https://www.gov.kz/memleket/entities/anticorruption?lang=' + (lang === 'kz' ? 'kk' : lang === 'en' ? 'en' : 'ru'), t('cmpAgency'), 'text-link')}</li>
      <li>${extLink('https://adilet.zan.kz/rus/docs/Z1500000410', t('cmpLaw'), 'text-link')}</li>
      <li><a class="text-link" href="#p/32297">${esc(t('cmpOld'))}</a></li></ul>
    <p class="muted sm">${esc(fmt(t('svcChecked'), {d:SEC_CHECKED}))}</p>
  </div>`;
}
Object.assign(PANELS.about, {compliance:complHTML});
Object.assign(T, {mb:["МБ","МБ","MB"]});

/* --- календарь памятных дат --- */
const Cal = {
  data: null, y: 0, m: 0, q: '', old: null,
  async open() {
    const root = $('#cal-root'); if (!root) return;
    if (!this.data) {
      root.innerHTML = `<p class="cat-loading">${esc(t('catLoading'))}</p>`;
      try { this.data = await TZD.get('calendar'); } catch (e) { root.innerHTML = `<p class="note">${tzIc('i-info')}<span>${esc(t('catFail'))}</span></p>`; return; }
      const yrs = this.data.years.map(x => x.y), now = new Date().getFullYear(); this.y = yrs.includes(now) ? now : yrs[0];
      Pages.get('1362').then(p => { const md = p ? ((p.ru && p.ru.md) || '') : ''; this.old = [...md.matchAll(/\[(\d{4}) год\]\((https?:\/\/[^)\s]+)\)/g)].map(m => [+m[1], m[2]]).filter(([y]) => y <= 2021); if (this.data && $('#cal-old')) this.renderOld(); }).catch(() => {});
    }
    this.render();
  },
  month(m) { const s = new Date(2026, m - 1, 1).toLocaleString(LOC[lang], {month:'long'}); return s.charAt(0).toUpperCase() + s.slice(1); },
  rows() {
    const Y = this.data.years.find(x => x.y === this.y); if (!Y) return [];
    const q = norm(this.q);
    return Y.rows.filter(r => (!this.m || r.m === this.m) && (!q || norm((r.d || '') + ' ' + (r.t || '') + ' ' + (r.dk || '') + ' ' + (r.tk || '')).includes(q)));
  },
  rowHTML(r) { const kz = lang === 'kz' && r.tk; return `<li><b class="cal-d">${esc(kz ? (r.dk || r.d) : r.d)}</b><span>${esc(kz ? r.tk : r.t)}</span></li>`; },
  list() {
    const box = $('#cal-list'); if (!box) return;
    const rows = this.rows(), by = new Map(); rows.forEach(r => { const k = r.g === 2 ? 13 : r.m; if (!by.has(k)) by.set(k, []); by.get(k).push(r); });
    $('#cal-n').textContent = fmt(t('calN'), {n:rows.length});
    box.innerHTML = rows.length ? [...by].map(([k, rs]) => `<section class="cal-m"><h3>${esc(k === 13 ? t('calNoDay') : this.month(k))}</h3><ul class="cal-rows">${rs.map(r => this.rowHTML(r)).join('')}</ul></section>`).join('') : `<p class="note">${esc(t('calNone'))}</p>`;
  },
  render() {
    const root = $('#cal-root'); if (!root || !this.data) return;
    const now = new Date(), Y = this.data.years.find(x => x.y === this.y);
    const near = now.getFullYear() === this.y && Y ? Y.rows.filter(r => r.g === 0 && (r.m > now.getMonth() + 1 || (r.m === now.getMonth() + 1 && r.n >= now.getDate()))).slice(0, 3) : [];
    root.innerHTML = `${lang === 'en' ? ruNote() : ''}
      <div class="chips cal-years" role="group" aria-label="${esc(t('calYear'))}">${this.data.years.map(x => `<button type="button" class="chip" data-cal-y="${x.y}" aria-pressed="${x.y === this.y}">${x.y}</button>`).join('')}</div>
      <div class="cal-ctl"><label class="cat-sel"><span class="sr">${esc(t('calAllM'))}</span><select id="cal-m"><option value="0">${esc(t('calAllM'))}</option>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => `<option value="${m}"${this.m === m ? ' selected' : ''}>${esc(this.month(m))}</option>`).join('')}</select></label>
        <label class="ffield"><span class="sr">${esc(t('calFind'))}</span><input type="search" id="cal-q" value="${esc(this.q)}" placeholder="${esc(t('calFind'))}" autocomplete="off"></label><span class="muted" id="cal-n" aria-live="polite"></span></div>
      ${near.length ? `<aside class="cal-near"><h3>${esc(t('calNear'))}</h3><ul class="cal-rows">${near.map(r => this.rowHTML(r)).join('')}</ul></aside>` : ''}
      <div id="cal-list"></div>
      <div id="cal-old"></div>`;
    this.list(); this.renderOld();
  },
  renderOld() { const b = $('#cal-old'); if (!b) return; b.innerHTML = this.old && this.old.length ? `<h3 class="cal-oldh">${esc(t('calPast'))}</h3><p class="chips">${this.old.map(([y, u]) => `<a class="chip" href="${esc(u)}" target="_blank" rel="noopener">${y}</a>`).join('')}</p>` : ''; }
};
Object.assign(PANELS.region, {calendar:() => { setTimeout(() => Cal.open(), 0); return `<div class="cal"><h2>${esc(t('calT'))}</h2><p class="muted">${esc(t('calL'))}</p><div id="cal-root"></div></div>`; }});
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-cal-y]'); if (!b) return; Cal.y = +b.dataset.calY; Cal.render(); });
document.addEventListener('change', e => { if (e.target.id === 'cal-m') { Cal.m = +e.target.value; Cal.list(); } });
document.addEventListener('input', e => { if (e.target.id === 'cal-q') { Cal.q = e.target.value; clearTimeout(Cal.t); Cal.t = setTimeout(() => Cal.list(), 200); } });

/* --- полезные ссылки: Ақорда, ветераны, погода и календарь (дополнение к ТЗ, разд. 2) --- */
RES_LINKS.push(
  ['https://www.akorda.kz/', ['Официальный сайт Президента РК — Ақорда', 'ҚР Президентінің ресми сайты — Ақорда', 'Official website of the President of Kazakhstan — Akorda']],
  ['https://podvignaroda.ru/', ['«Подвиг народа» — открытые сведения о наградах ветеранов ВОВ', '«Халық ерлігі» — ҰОС ардагерлерінің марапаттары туралы ашық мәліметтер', '“Podvig naroda” — open records of awards to WWII veterans']],
  ['https://obd-memorial.ru/', ['ОБД «Мемориал» — сведения о защитниках Отечества', 'ОБД «Мемориал» — Отан қорғаушылары туралы мәліметтер', 'OBD “Memorial” — records of defenders of the homeland']],
  ['https://www.kazhydromet.kz/', ['Казгидромет — прогноз погоды', 'Қазгидромет — ауа райы болжамы', 'Kazhydromet — weather forecast']]
);

/* --- хлебные крошки (дополнение к ТЗ, п. 2): «Главная / раздел / вкладка / материал» на внутренних страницах.
   У страниц прежнего сайта (#p/…) цепочка уже есть (Page.crumbs); здесь — для остальных разделов. --- */
const Crumbs = {
  views: ['visitors', 'fonds', 'region', 'about', 'news', 'contacts', 'catalog', 'memory', 'expo', 'my', 'privacy', 'stats'],
  own: {catalog:'catTitle', memory:'memTitle', expo:'expoTitle', contacts:'navContacts', my:'myTitle', privacy:'privacy', stats:'statsT'},
  trail() {
    const {v, tab, rest} = parseHash(location.hash);
    if (!this.views.includes(v)) return null;
    const out = [{l:t('navHome'), h:'#home'}];
    if (HUBS[v]) {
      if (!tab && Tabs.hasOverview(v)) { out.push({l:t(HUB_T[v])}); return out; }   // обзор раздела: «Главная / Фонды»
      const k = tab && HUBS[v].includes(tab) ? tab : HUBS[v][0];
      out.push({l:t(HUB_T[v]), h:'#' + v + (Tabs.hasOverview(v) ? '' : '/' + HUBS[v][0])}, {l:TAB_T[k] ? t(TAB_T[k]) : k});
    } else {
      out.push({l:t(this.own[v]), h:'#' + v});
      const id = decodeURIComponent(String(rest || '').split('/')[0] || '');
      if (id && v === 'catalog') { const r = Cat.byId && Cat.byId.get(id); if (r) out.push({l:LK(r.t)}); }
      else if (id && v === 'expo') { const x = Expo.data && Expo.data.items.find(e => e.id === id); if (x) out.push({l:LK(x.t)}); }
    }
    return out;
  },
  html(tr) { return `<ol>${tr.map((c, i) => i === tr.length - 1 ? `<li aria-current="page">${esc(c.l)}</li>` : `<li><a href="${esc(c.h)}">${esc(c.l)}</a></li>`).join('')}</ol>`; },
  update() {
    const {v} = parseHash(location.hash), tr = this.trail();
    $$('.crumbs-v').forEach(n => { n.hidden = true; });
    if (!tr) return;
    const view = $(`.view[data-view="${v}"]`), host = view && view.querySelector('.wrap.page'); if (!host) return;
    let nav = host.querySelector(':scope > .crumbs-v');
    if (!nav) { nav = document.createElement('nav'); nav.className = 'crumbs crumbs-v'; host.insertBefore(nav, host.firstChild); }
    nav.setAttribute('aria-label', t('crumbsL')); nav.hidden = false; nav.innerHTML = this.html(tr);
  },
  init() {
    const upd = () => setTimeout(() => this.update(), 0);
    window.addEventListener('hashchange', upd); window.addEventListener('load', upd); upd();
    new MutationObserver(upd).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});   // смена языка
    ['#cat-root', '#expo-root'].forEach(s => { const r = $(s); if (r) new MutationObserver(() => { clearTimeout(this.t); this.t = setTimeout(() => this.update(), 80); }).observe(r, {childList:true}); });   // название материала появляется после загрузки данных
  }
};
Crumbs.init();

/* --- лента Instagram (ТЗ 5.12): окошко от иконки Instagram. Снимок последних публикаций публичной страницы @arhiv_vko (pages/social.json, снят 11.11.2026):
   превью (img/ig-*.jpg), дата и начало подписи. Публикация открывается на instagram.com в новой вкладке; сам сайт к Instagram не обращается.
   Это не живая лента: чтобы обновить, нужно повторить снимок (HANDOFF) или подключить API Instagram с токеном архива. --- */
Object.assign(T, {
  sfT:["Последние публикации","Соңғы жарияланымдар","Latest posts"],
  sfPhoto:["Фото","Фото","Photo"], sfVideo:["Видео","Бейне","Video"], sfNoCap:["Публикация без подписи","Жарияланым жазбасыз","Post without a caption"],
  sfOpen:["Открыть Instagram @{h}","Instagram @{h} ашу","Open Instagram @{h}"], sfClose:["Закрыть","Жабу","Close"],
  sfNote:["Снимок от {d}: превью и подписи с публичной страницы. Публикация откроется на instagram.com.","{d} күнгі көшірме: ашық беттегі превью мен жазбалар. Жарияланым instagram.com сайтында ашылады.","A snapshot from {d}: previews and captions from the public page. A post opens on instagram.com."]
});
const SocFeed = {
  data: null, trigger: null,
  item(x) {
    return `<li><a class="sf-it" href="${esc(x.u)}" target="_blank" rel="noopener"><img src="${esc(x.img || '')}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true">
      <span class="sf-b"><span class="sf-m"><span class="pill">${esc(t(x.k === 'video' ? 'sfVideo' : 'sfPhoto'))}</span><time datetime="${esc(x.d)}">${esc(fmtDate(x.d))}</time></span><span class="sf-t${x.t ? '' : ' muted'}">${esc(x.t || t('sfNoCap'))}</span></span></a></li>`;
  },
  el() {
    let p = document.getElementById('sf-pop');
    if (!p) { document.body.insertAdjacentHTML('beforeend', '<div id="sf-pop" class="sf-pop" role="dialog" aria-labelledby="sf-h" hidden></div>'); p = document.getElementById('sf-pop'); }
    return p;
  },
  html() {
    const d = this.data;
    return `<div class="sf-hd"><h2 id="sf-h">${tzIc('i-ig')}${esc(t('sfT'))}</h2><button type="button" class="sf-x" data-act="sf-close" aria-label="${esc(t('sfClose'))}">×</button></div>
      <ul class="sf-list">${d.items.map(x => this.item(x)).join('')}</ul>
      <div class="sf-ft"><p class="muted">${esc(fmt(t('sfNote'), {d:fmtDate(d.snapshot)}))}</p><a class="btn sm" href="${esc(d.url)}" target="_blank" rel="noopener">${tzIc('i-ig')}${esc(fmt(t('sfOpen'), {h:d.handle}))}</a></div>`;
  },
  async open(trigger) {
    if (!this.data) { try { this.data = await TZD.get('social'); } catch (e) { location.href = trigger.href; return; } }
    if (!(this.data.items || []).length) { location.href = trigger.href; return; }
    const p = this.el(); p.innerHTML = this.html(); this.trigger = trigger; this.w = innerWidth; trigger.setAttribute('aria-expanded', 'true');
    p.hidden = false;
    const r = trigger.getBoundingClientRect(), w = Math.min(23 * 16, innerWidth - 24);
    p.style.width = w + 'px'; p.style.left = Math.max(12, Math.min(r.right - w, innerWidth - w - 12)) + 'px';
    if (r.top > innerHeight / 2) { p.style.top = 'auto'; p.style.bottom = (innerHeight - r.top + 8) + 'px'; p.style.maxHeight = Math.max(240, r.top - 20) + 'px'; }
    else { p.style.bottom = 'auto'; p.style.top = (r.bottom + 8) + 'px'; p.style.maxHeight = Math.max(240, innerHeight - r.bottom - 20) + 'px'; }
    const x = p.querySelector('.sf-x'); if (x) x.focus({preventScroll:true});
  },
  close(back) {
    const p = document.getElementById('sf-pop'); if (!p || p.hidden) return;
    p.hidden = true;
    if (this.trigger) { this.trigger.setAttribute('aria-expanded', 'false'); if (back && this.trigger.focus) this.trigger.focus(); }
  },
  init() {
    // иконка Instagram в шапке, на главной и в подвале открывает окошко; Ctrl/⌘-щелчок и средняя кнопка по-прежнему открывают сам Instagram
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('.soc a[href*="instagram.com"]');
      if (a) { if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return; e.preventDefault(); const p = document.getElementById('sf-pop'); if (p && !p.hidden && this.trigger === a) this.close(true); else this.open(a); return; }
      if (e.target.closest && e.target.closest('[data-act="sf-close"]')) { this.close(true); return; }
      const p = document.getElementById('sf-pop'); if (p && !p.hidden && !p.contains(e.target)) this.close(false);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(true); });
    window.addEventListener('hashchange', () => this.close(false)); window.addEventListener('resize', () => { if (innerWidth !== this.w) this.close(false); });   // на телефоне при прокрутке меняется только высота (адресная строка): окошко не закрываем
    new MutationObserver(() => this.close(false)).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
    new MutationObserver(() => { $$('.soc a[href*="instagram.com"]').forEach(a => { if (!a.hasAttribute('aria-haspopup')) { a.setAttribute('aria-haspopup', 'dialog'); a.setAttribute('aria-expanded', 'false'); } }); }).observe(document.body, {childList:true, subtree:true});
  }
};
SocFeed.init();


/* --- опрос посетителей, оценка страницы, публичная статистика (доп. к ТЗ, п. 2): демонстрационный прототип, без подтверждения заказчика.
   Данные обезличены (только счётчики), выбор запоминается в браузере; накрутку это не исключает. Сервер: /api/poll, /api/rate, /api/public-stats. --- */
Object.assign(T, {
  rateQ:["Была ли эта страница полезной?","Бұл бет пайдалы болды ма?","Was this page helpful?"], rateStar:["Оценка {n} из 5","{n} баға (5-тен)","Rating {n} of 5"],
  rateThanks:["Спасибо за оценку! Средняя оценка страницы: {a} (оценок: {n}).","Бағаңыз үшін рахмет! Беттің орташа бағасы: {a} (бағалар: {n}).","Thank you! The page's average rating: {a} (ratings: {n})."],
  rateDone:["Вы уже оценили эту страницу: {v} из 5.","Сіз бұл бетті бағалағансыз: {v} (5-тен).","You have already rated this page: {v} out of 5."],
  rateFail:["Не удалось сохранить оценку. Попробуйте позже.","Бағаны сақтау мүмкін болмады. Кейінірек қайталаңыз.","Could not save the rating. Please try later."],
  pollT:["Опрос посетителей","Келушілер сауалнамасы","Visitor poll"], pollThanks:["Спасибо, ваш голос учтён. Всего голосов: {n}.","Рахмет, дауысыңыз есепке алынды. Барлық дауыс: {n}.","Thank you, your vote is counted. Total votes: {n}."],
  pollVoted:["Результаты опроса. Всего голосов: {n}.","Сауалнама нәтижелері. Барлық дауыс: {n}.","Poll results. Total votes: {n}."], pollMore:["Статистика сайта","Сайт статистикасы","Site statistics"],
  statsT:["Статистика сайта","Сайт статистикасы","Site statistics"],
  statsLead:["Публичная обезличенная статистика: только счётчики, без имён, адресов и текстов запросов. Демонстрационный прототип: данные накапливаются с запуска демонстрационной версии.","Жария анонимді статистика: тек есептегіштер, аты-жөні, мекенжайлары және сұрау мәтіндері жоқ. Демонстрациялық прототип: деректер демонстрациялық нұсқа іске қосылғаннан бері жиналады.","Public anonymised statistics: counters only, with no names, addresses or search texts. A demonstration prototype: data has been accumulating since the demo version was launched."],
  stViews:["Просмотров разделов","Бөлімдерді қарау","Section views"], stSearch:["Поисковых запросов","Іздеу сұраулары","Search queries"], stCards:["Открытий карточек каталога","Каталог карточкаларын ашу","Catalogue cards opened"],
  stRatings:["Оценок страниц","Бет бағалары","Page ratings"], stAvg:["Средняя оценка","Орташа баға","Average rating"], stVotes:["Голосов в опросе","Сауалнамадағы дауыстар","Poll votes"],
  stTop:["Самые посещаемые разделы","Ең көп қаралатын бөлімдер","Most visited sections"], stDays:["Действия посетителей по дням","Күндер бойынша келушілер әрекеті","Visitor activity by day"],
  stLangs:["Языки интерфейса","Интерфейс тілдері","Interface languages"], stBest:["Лучше всего оценены","Ең жоғары бағаланғандар","Best rated pages"], stNone:["Пока нет данных","Әзірге деректер жоқ","No data yet"],
  stNote:["Это демонстрация: посетитель может оценить страницу и проголосовать один раз в браузере, частота запросов с одного адреса ограничена, но от накрутки это не защищает.","Бұл демонстрация: келуші браузерде бір рет баға беріп, дауыс бере алады, бір мекенжайдан сұраулар жиілігі шектелген, бірақ бұл жалған санаудан қорғамайды.","This is a demo: a visitor can rate a page and vote once per browser, and request frequency from one address is limited, but this does not protect against vote stuffing."]
});
const VIEW_LABEL = {catalog:'navCatalog', memory:'navMemory', expo:'navExpo', contacts:'navBranches', visitors:'navGuide', privacy:'privacy', stats:'statsT'};
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
async function apiJSON(url, body) {
  const r = await fetch(url, body ? {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)} : undefined);
  if (!r.ok) throw new Error(String(r.status)); return r.json();
}
const fmtAvg = a => String(a).replace('.', lang === 'en' ? '.' : ',');
function pollBars(d) {
  const mx = Math.max(1, ...d.opts.map(o => o.n));
  return `<ul class="poll-res">${d.opts.map(o => `<li><span>${esc(L(o.t))}</span><b>${o.n}${d.total ? ' · ' + Math.round(o.n / d.total * 100) + '%' : ''}</b><i style="--w:${Math.round(o.n / mx * 100)}%"></i></li>`).join('')}</ul>`;
}
const POLL_ON_HOME = false;   // опрос с главной убран по просьбе заказчика; true возвращает его
const Poll = {
  d: null,
  async render() {
    const home = $('[data-view="home"]'); if (!home) return;
    if (!POLL_ON_HOME) { const old = $('#poll-box'); if (old) old.remove(); return; }
    let box = $('#poll-box'); if (!box) { box = document.createElement('section'); box.id = 'poll-box'; box.className = 'poll-sec'; const at = home.querySelector('.story-sec') || home.querySelector('.hexpo-sec'); if (at) at.before(box); else home.appendChild(box); }   // сразу после первых блоков под большим фото: внизу страницы опрос никто бы не увидел
    if (!this.d) { try { this.d = await apiJSON('/api/poll'); } catch (e) { box.hidden = true; return; } }
    const d = this.d, voted = lsGet('poll:' + d.id);
    box.hidden = false;
    const wasOpen = !!box.querySelector('details.poll-card[open]');   // после голоса блок остаётся раскрытым
    box.innerHTML = `<div class="wrap"><details class="poll-card"${wasOpen ? ' open' : ''}><summary><span class="eyebrow">${esc(t('pollT'))}</span><span class="poll-q" id="poll-q">${esc(L(d.q))}</span></summary>` + (voted
      ? `${pollBars(d)}<p class="muted sm">${esc(fmt(t('pollVoted'), {n:d.total}))} <a class="text-link" href="#stats">${esc(t('pollMore'))}</a></p>`
      : `<div class="poll-opts" role="group" aria-labelledby="poll-q">${d.opts.map(o => `<button type="button" class="btn ghost sm" data-act="poll-vote" data-v="${esc(o.id)}">${esc(L(o.t))}</button>`).join('')}</div>`) + '</details></div>';
  },
  async vote(opt) {
    try { this.d = await apiJSON('/api/poll', {opt}); lsSet('poll:' + this.d.id, opt); } catch (e) { toast(t('rateFail')); return; }
    this.render(); const q = $('#poll-box .poll-res'); if (q) toast(fmt(t('pollThanks'), {n:this.d.total}));
  }
};
const Rate = {
  key() { const h = decodeURIComponent((location.hash || '#home').replace(/^#/, '').split('?')[0]) || 'home'; return h.length > 80 ? h.slice(0, 80) : h; },
  render() {
    const foot = $('.site-foot'); if (!foot) return;
    let box = $('#rate-box'); if (!box) { box = document.createElement('aside'); box.id = 'rate-box'; box.className = 'wrap rate'; foot.before(box); }
    const k = this.key(); box.hidden = /^admin/.test(k);
    if (box.hidden) return;
    box.dataset.k = k; const v = lsGet('rate:' + k);
    box.innerHTML = v ? `<p class="rate-done">${tzIc('i-star')}${esc(fmt(t('rateDone'), {v}))}</p>`
      : `<p class="rate-q" id="rate-q">${esc(t('rateQ'))}</p><div class="rate-stars" role="group" aria-labelledby="rate-q">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-act="rate-set" data-v="${n}" aria-label="${esc(fmt(t('rateStar'), {n}))}">${tzIc('i-star')}</button>`).join('')}</div>`;
  },
  async set(v) {
    const k = ($('#rate-box') || {dataset:{}}).dataset.k || this.key();
    try { const r = await apiJSON('/api/rate', {k, v:+v}); lsSet('rate:' + k, String(v)); const box = $('#rate-box'); if (box) box.innerHTML = `<p class="rate-done">${tzIc('i-star')}${esc(fmt(t('rateThanks'), {a:fmtAvg(r.avg), n:r.n}))}</p>`; }
    catch (e) { toast(t('rateFail')); }
  }
};
function keyTitle(k) {
  const m = k.match(/^p\/(\d+)/); if (m && PIDX.has(m[1])) return pTitle(PIDX.get(m[1])) || k;
  const [h, tab] = k.split('/'); if (HUBS[h]) return t(HUB_T[h]) + (tab && TAB_T[tab] ? ': ' + t(TAB_T[tab]) : '');
  if (VIEW_LABEL[h]) return t(VIEW_LABEL[h]) + (/^(catalog|expo)$/.test(h) && tab ? ' · ' + decodeURIComponent(tab).slice(0, 30) : '');
  return k === 'home' ? t('navHome') : k;
}
const PubStats = {
  async render() {
    const root = $('#stats-root'); if (!root) return;
    let d; try { d = await apiJSON('/api/public-stats'); } catch (e) { root.innerHTML = `<p class="note">${esc(t('rateFail'))}</p>`; return; }
    const card = (n, k) => `<div class="st-card"><b>${esc(n)}</b><span>${esc(t(k))}</span></div>`;
    const mx = Math.max(1, ...d.topViews.map(x => x[1])), md = Math.max(1, ...d.days.map(x => x[1])), ln = Object.values(d.langs).reduce((a, n) => a + n, 0) || 1;
    const LN = {ru:'Русский', kz:'Қазақша', en:'English'};
    root.innerHTML = `<p class="muted st-lead">${esc(t('statsLead'))}</p>
      <div class="st-cards">${card(d.views, 'stViews')}${card(d.searches, 'stSearch')}${card(d.cards, 'stCards')}${card(d.ratings.n, 'stRatings')}${card(d.ratings.n ? fmtAvg(d.ratings.avg) : '—', 'stAvg')}${card(d.poll.total, 'stVotes')}</div>
      <div class="st-cols"><section><h2 class="h3">${esc(t('stTop'))}</h2>${d.topViews.length ? `<ul class="poll-res">${d.topViews.map(([k, n]) => `<li><span>${esc(VIEW_LABEL[k] ? t(VIEW_LABEL[k]) : HUB_T[k] ? t(HUB_T[k]) : k === 'home' ? t('navHome') : k)}</span><b>${n}</b><i style="--w:${Math.round(n / mx * 100)}%"></i></li>`).join('')}</ul>` : `<p class="muted">${esc(t('stNone'))}</p>`}</section>
        <section><h2 class="h3">${esc(t('stDays'))}</h2>${d.days.length ? `<ol class="st-days">${d.days.map(([day, n]) => `<li><span class="sr">${esc(day)}: ${n}</span><i style="--h:${Math.max(6, Math.round(n / md * 100))}%" title="${esc(day)}: ${n}"></i></li>`).join('')}</ol>` : `<p class="muted">${esc(t('stNone'))}</p>`}</section>
        <section><h2 class="h3">${esc(t('pollT'))}</h2><p class="poll-q">${esc(L(d.poll.q))}</p>${pollBars(d.poll)}</section>
        <section><h2 class="h3">${esc(t('stBest'))}</h2>${d.ratings.top.length ? `<ul class="st-best">${d.ratings.top.map(r => `<li><a href="#${esc(r.k)}">${esc(keyTitle(r.k))}</a><b>${fmtAvg(r.avg)} ★ <small>(${r.n})</small></b></li>`).join('')}</ul>` : `<p class="muted">${esc(t('stNone'))}</p>`}
          <h2 class="h3" style="margin-top:1.4rem">${esc(t('stLangs'))}</h2><ul class="poll-res">${Object.entries(d.langs).map(([l, n]) => `<li><span>${esc(LN[l] || l)}</span><b>${Math.round(n / ln * 100)}%</b><i style="--w:${Math.round(n / ln * 100)}%"></i></li>`).join('') || ''}</ul></section></div>
      <p class="muted sm">${esc(t('stNote'))}</p>`;
  }
};
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-act="poll-vote"], [data-act="rate-set"]'); if (!b) return;
  if (b.dataset.act === 'poll-vote') Poll.vote(b.dataset.v); else Rate.set(b.dataset.v);
});
{ const upd = () => setTimeout(() => { Rate.render(); Poll.render(); }, 0);
  window.addEventListener('hashchange', upd); window.addEventListener('load', upd); upd();
  new MutationObserver(upd).observe(document.documentElement, {attributes:true, attributeFilter:['lang']}); }


/* --- переводы блоков данных SITE на казахский и английский (pages/site-tr.json, tools/build_site_tr.py): машинный перевод, не вычитан носителем языка.
   Оригинал (русский) хранится как есть; при смене языка блоки подменяются переводом, чего нет в переводе, остаётся по-русски. --- */
const SiteTr = {
  data: null, orig: {},
  keys: ['fondsGroups', 'branches', 'history', 'announcements', 'databases', 'districts', 'anti', 'leaders', 'branchNames', 'gloss', 'laws', 'org', 'prices', 'compliance'],
  code() { return lang === 'kz' ? 'kk' : lang === 'en' ? 'en' : ''; },
  has(key) { const c = this.code(); return !!(c && this.data && this.data[c] && this.data[c][key]); },
  merge(k, base, tr) {
    if (k === 'org') return {...base, depts:(base.depts || []).map((d, i) => tr.depts[i] ? {...d, ...tr.depts[i], n:{...d.n, ...tr.depts[i].n}} : d), staff:(base.staff || []).map((s, i) => tr.staff[i] ? {...s, ...tr.staff[i]} : s)};
    if (k === 'compliance') return {...base, officer:{...base.officer, ...tr.officer},
      notices:(base.notices || []).map((n, i) => tr.notices[i] ? {...n, t:{...n.t, en:tr.notices[i].t}, d:{...n.d, en:tr.notices[i].d}} : n),
      docs:(base.docs || []).map((d, i) => tr.docs[i] ? {...d, t:{...d.t, en:tr.docs[i].t}} : d)};
    if (k === 'prices') {   // английский — в хвосте строки: [номер, ru, ед. ru, цена, kk, ед. kk, en, ед. en]; название раздела — s.t[2]
      base.doc = {...base.doc, en:tr.doc};
      base.secs.forEach((s, i) => { if (!tr.rows[i]) return; s.t[2] = tr.t[i];
        s.rows.forEach((r, j) => { const x = tr.rows[i][j]; if (!x) return; while (r.length < 6) r.push(''); r[6] = x[0]; r[7] = x[1]; }); });
      (base.notes || []).forEach(n => { if (tr.notes[n.id]) n.en = tr.notes[n.id]; });
      if (base.restor) base.restor.en = tr.restor;
      return base;
    }
    if (Array.isArray(base)) {
      if (k === 'history') return base.map((h, i) => tr[i] ? [h[0], tr[i][1]] : h);
      if (k === 'anti') return tr.slice();
      if (k === 'branches') return base.map((b, i) => tr[i] ? {...b, ...tr[i], _n:b.n, _a:b.a} : b);   // _n, _a: русские название и адрес для привязки к карте и поиска зданий
      return base.map((b, i) => tr[i] ? {...b, ...tr[i]} : b);
    }
    if (k === 'districts') return {now:tr.now.slice(), gone:tr.gone.slice()};
    return {...base, ...tr};   // branchNames
  },
  apply() {
    const c = this.code();
    for (const k of this.keys) if (!(k in this.orig) && SITE[k] !== undefined) this.orig[k] = JSON.parse(JSON.stringify(SITE[k]));
    for (const k of this.keys) { if (!(k in this.orig)) continue; const base = JSON.parse(JSON.stringify(this.orig[k])), tr = c && this.data && this.data[c] && this.data[c][k]; SITE[k] = tr ? this.merge(k, base, tr) : base; }
  },
  asked: false,
  ensure() {
    this.asked = true;
    loadTR().then(() => { const j = TR && TR._site; if (!j) return; this.data = j; this.apply(); renderAll(); });   // переводы лежат в pages/tr.json вместе с переводами страниц
  }
};
if (lang !== 'ru') SiteTr.ensure();

/* ================= boot ================= */
applyPrefs();
applyI18n();
Store.on(() => { Search.idx = null; Tabs.refresh(); renderStatus(); renderContent(); renderNews(); renderGuest(); Photos.apply(); if (current === 'admin') renderAdmin(); Chat.renderNote(); });
Pano.init();
renderAll();
mountMaps();
Photos.init();
Hero.init();
window.__hero = {Hero, HERO_POOL};   // для тестов карусели (tests/hero.py)
updateCount();
Chat.init();
if (Voice.supported()) $('#mic-btn').hidden = false;
{ const {v, tab, rest, qs} = parseHash(location.hash); if (v === 'p' && tab) { show('page', false); Page.open(tab); } else { if (HUBS[v]) { if (tab) Tabs.select(v, tab); else Tabs.overview(v); } show(VIEWS.includes(v) ? v : 'home', false); TZ.route(VIEWS.includes(v) ? v : 'home', rest, qs); } }
Reveal.init();
Fit.init();
HeroFloat.init();
Geo.init();
CountUp.scan();
setTimeout(() => { vtReady = true; }, 600);
Store.init();
setInterval(renderStatus, 60000);
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !IN_PREVIEW) { const reg = () => { navigator.serviceWorker.register('sw.js').catch(() => {}); }; if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg); }
if (!TTS.ok) { const b = $('#speak-btn'); if (b) b.hidden = true; const a2 = $('#auto-speak'); if (a2) a2.hidden = true; } else { try { speechSynthesis.getVoices(); } catch (e) {} }
})();
