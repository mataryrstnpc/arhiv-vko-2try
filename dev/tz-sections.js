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
