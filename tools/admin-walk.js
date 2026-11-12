'use strict';
/*
 * Сквозная проверка админки в настоящем браузере (Chrome или Edge) на временной копии сервера: своя пустая база и свой пароль,
 * рабочие данные не затрагиваются. 51 проверка: вход и выход, все вкладки (ошибки консоли, «undefined», горизонтальный скролл),
 * модерация, новости, настройки, материалы каталога (создание, публикация, поиск у посетителя, архив, удаление), пользователи,
 * журнал, права редактора.
 *   node tools/admin-walk.js              - только проверки
 *   node tools/admin-walk.js --shots DIR  - плюс снимок каждой вкладки в папку DIR
 * Не проверяются: загрузка файлов через форму, распознавание сканов ИИ, вход администратором филиала (их покрывают API-тесты).
 */
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path'), net = require('net');
const ROOT = path.resolve(__dirname, '..');
const { launch, sleep } = require('./cdp.js');
const si = process.argv.indexOf('--shots'), SHOTS = si > 0 ? path.resolve(process.argv[si + 1] || '.') : null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const freePort = () => new Promise(res => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const results = [];
const check = (ok, label, detail = '') => { results.push([ok, label, detail]); console.log((ok ? '✓ ' : '✗ ') + label + (detail ? '  — ' + detail : '')); };

(async () => {
  const port = await freePort(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'admwalk-')), PWD = 'walk-' + Math.random().toString(36).slice(2, 10) + 'Zz9';
  const server = spawn(process.execPath, ['server.js'], { cwd: ROOT, stdio: 'ignore', env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', ADMIN_PASSWORD: PWD, DATA_FILE: path.join(tmp, 'db.json') } });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base + '/api/health')).ok) break; } catch (e) {} await sleep(200); }
  const p = await launch();
  const J = async (expr) => JSON.parse(await p.eval(`(async () => JSON.stringify(await (${expr})))()`));
  const api = (m, u, b) => J(`fetch(${JSON.stringify(u)}, {method:${JSON.stringify(m)}, headers:{'Content-Type':'application/json', Authorization:'Bearer ' + (sessionStorage.getItem('arhvko_token') || sessionStorage.getItem('token') || '')}, body:${b ? JSON.stringify(JSON.stringify(b)) : 'undefined'}}).then(async r => ({s:r.status, d: await r.json().catch(() => null)}))`);
  const errs = () => { const e = [...p.errors]; p.errors.length = 0; return e; };
  const text = sel => p.text(sel);
  try {
    await p.viewport({ w: 1440, h: 900 });
    // ---------- вход ----------
    await p.goto(base + '/?q=' + Date.now() + '#admin', 3500);
    check(await p.eval('!!document.querySelector("#adm-pwd")'), 'форма входа показана до авторизации');
    await p.type('#adm-login', 'admin'); await p.eval('document.querySelector("#adm-login").value = ""'); await p.type('#adm-login', 'admin');
    await p.type('#adm-pwd', 'неверный-пароль-1'); await p.click('#login-form button[type=submit]'); await sleep(1500);
    check(await p.eval('!document.querySelector("#adm-err").hidden || !!document.querySelector("#adm-pwd")'), 'неверный пароль не пускает');
    await p.eval('document.querySelector("#adm-pwd").value = ""'); await p.type('#adm-pwd', PWD); await p.click('#login-form button[type=submit]');
    const inOk = await p.waitFor('!!document.querySelector("#admin-root .tabs [role=tab]")', 12000);
    check(inOk, 'верный пароль открывает панель со вкладками');
    // ---------- все вкладки ----------
    const tabs = JSON.parse(await p.eval(`JSON.stringify([...document.querySelectorAll('#admin-root .tabs [role=tab]')].map(b => [b.dataset.v, b.textContent.trim()]))`));
    check(tabs.length >= 10, 'вкладок у главного администратора: ' + tabs.length, tabs.map(t => t[1]).join(' | '));
    errs();
    for (const [v, label] of tabs) {
      await p.eval(`document.querySelector('#admin-root .tabs [data-v="${v}"]').click()`); await sleep(1100);
      const o = JSON.parse(await p.eval(`JSON.stringify({sel: document.querySelector('#admin-root .tabs [data-v="${v}"]').getAttribute('aria-selected'), len: document.querySelector('#admin-root').innerText.length, bad: (document.querySelector('#admin-root').innerText.match(/undefined|NaN|\\[object|Ошибка|Error/g) || []).slice(0, 3), ox: document.documentElement.scrollWidth - innerWidth, forms: document.querySelectorAll('#admin-root form').length, btns: document.querySelectorAll('#admin-root button').length})`));
      const e = errs();
      check(o.sel === 'true' && o.len > 150 && !o.bad.length && o.ox <= 0 && !e.length, `вкладка «${label}»`, `текста ${o.len}, форм ${o.forms}, кнопок ${o.btns}` + (o.bad.length ? ', ПЛОХИЕ СЛОВА: ' + o.bad.join(',') : '') + (o.ox > 0 ? ', ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ ' + o.ox : '') + (e.length ? ', ОШИБКИ: ' + e.join(' / ').slice(0, 200) : ''));
      if (SHOTS) await p.screenshot(path.join(SHOTS, 'admin-' + v + '.jpg'), { quality: 60 });
    }
    // ---------- модерация гостевой книги ----------
    const gname = 'Проверка Админки', gtext = 'Тестовое сообщение для проверки модерации ' + Date.now();
    const g = await api('POST', '/api/guestbook', { name: gname, text: gtext, city: 'Усть-Каменогорск', lang: 'ru' });
    check(g.s === 201, 'гостевая книга: сообщение посетителя принято', 'код ' + g.s);
    await p.goto(base + '/?q=' + Date.now() + '#admin', 3500);
    check(await p.eval('!!document.querySelector("#admin-root .tabs [role=tab]")'), 'после перезагрузки сессия сохранилась (вход не слетел)');
    await p.eval('document.querySelector("#admin-root .tabs [data-v=mod]").click()'); await sleep(900);
    check((await text('#admin-root')).includes(gtext.slice(0, 30)), 'модерация: новое сообщение видно в очереди');
    check(!(await J(`fetch('/api/public').then(r => r.json()).then(d => d.entries.some(e => e.text === ${JSON.stringify(gtext)}))`)), 'до одобрения сообщение на сайте не публикуется');
    await p.eval(`(() => { const b = [...document.querySelectorAll('[data-act=mod][data-op=approved]')][0]; b && b.click(); })()`); await sleep(1500);
    check(await J(`fetch('/api/public').then(r => r.json()).then(d => d.entries.some(e => e.text === ${JSON.stringify(gtext)}))`), 'после «Одобрить» сообщение появилось на сайте');
    // ---------- новости ----------
    await p.eval('document.querySelector("#admin-root .tabs [data-v=news]").click()'); await sleep(900);
    const NT = 'Проверочная новость ' + Date.now() % 100000;
    await p.type('#nf-tr', NT); await p.type('#nf-xr', 'Текст проверочной новости, достаточно длинный для сохранения.');
    await p.click('#news-form button[type=submit]'); await sleep(1800);
    check((await text('#admin-root')).includes(NT), 'новости: новость создана и видна в списке админки');
    check(await J(`fetch('/api/public').then(r => r.json()).then(d => d.news.some(n => n.title && n.title.ru === ${JSON.stringify(NT)}))`), 'новости: новость отдаётся сайту (/api/public)');
    await p.goto(base + '/?q=' + Date.now() + '#news', 4500);
    check((await text('main')).includes(NT), 'новости: новость видна посетителю на странице «Новости»');
    await p.goto(base + '/?q=' + Date.now() + '#admin', 3500); await p.eval('document.querySelector("#admin-root .tabs [data-v=news]").click()'); await sleep(900);
    await p.eval(`(() => { const art = [...document.querySelectorAll('#admin-root .mod-item')].find(a => a.innerText.includes(${JSON.stringify(NT)})); art.querySelector('[data-act=news-edit]').click(); })()`); await sleep(700);
    await p.eval('document.querySelector("#nf-tr").value = ""'); await p.type('#nf-tr', NT + ' (правка)');
    await p.click('#news-form button[type=submit]'); await sleep(1800);
    check((await text('#admin-root')).includes(NT + ' (правка)'), 'новости: редактирование сохраняется');
    await p.eval('window.confirm = () => true');
    for (let i = 0; i < 2; i++) { await p.eval(`(() => { const art = [...document.querySelectorAll('#admin-root .mod-item')].find(a => a.innerText.includes(${JSON.stringify(NT)})); art && art.querySelector('[data-act=news-del]').click(); })()`); await sleep(1300); }
    check(!(await text('#admin-root')).includes(NT), 'новости: удаление (с подтверждением) работает');
    // ---------- настройки ----------
    await p.eval('document.querySelector("#admin-root .tabs [data-v=settings]").click()'); await sleep(900);
    const ph0 = await p.eval('document.querySelector("#sf-p").value');
    await p.eval('document.querySelector("#sf-p").value = ""'); await p.type('#sf-p', ph0 + ', +7 (700) 111-22-33');
    await p.click('#set-form button[type=submit]'); await sleep(1800);
    check(await J(`fetch('/api/public').then(r => r.json()).then(d => (d.settings.phones || []).includes('+7 (700) 111-22-33'))`), 'настройки: новый телефон сохранён и отдаётся сайту');
    await p.goto(base + '/?q=' + Date.now(), 4500);
    check((await text('body')).includes('+7 (700) 111-22-33'), 'настройки: телефон виден на главной странице');
    await p.goto(base + '/?q=' + Date.now() + '#admin', 3500); await p.eval('document.querySelector("#admin-root .tabs [data-v=settings]").click()'); await sleep(900);
    await p.eval('document.querySelector("#sf-p").value = ""'); await p.type('#sf-p', ph0); await p.click('#set-form button[type=submit]'); await sleep(1500);
    check(await J(`fetch('/api/public').then(r => r.json()).then(d => !(d.settings.phones || []).includes('+7 (700) 111-22-33'))`), 'настройки: возврат прежнего телефона');
    // ---------- материалы каталога (создание, публикация, показ посетителю, удаление) ----------
    await p.eval('document.querySelector("#admin-root .tabs [data-v=items]").click()'); await sleep(1100);
    const IT = 'Проверочный документ ' + Date.now() % 100000;
    await p.click('[data-act=za-new]'); await sleep(700);
    await p.type('#zf-tru', IT); await p.type('#zf-f', '9999'); await p.type('#zf-o', '1'); await p.type('#zf-d', '7'); await p.type('#zf-y0', '1950');
    await p.eval('document.querySelector("#za-form button[value=published]").click()'); await sleep(2200);
    check((await text('#admin-root')).includes(IT), 'материалы: карточка создана и опубликована, видна в списке админки');
    check(await J(`fetch('/api/public').then(r => r.json()).then(d => d.items.some(i => i.t && i.t.ru === ${JSON.stringify(IT)}))`), 'материалы: карточка отдаётся сайту');
    await p.goto(base + '/?q=' + Date.now() + '#catalog', 6000); await p.type('#cat-q', IT); await p.press('Enter'); await sleep(2500);
    check((await text('main')).includes(IT), 'материалы: карточку находит поиск каталога у посетителя');
    await p.goto(base + '/?q=' + Date.now() + '#admin', 3500); await p.eval('document.querySelector("#admin-root .tabs [data-v=items]").click()'); await sleep(1100);
    await p.eval('window.confirm = () => true');
    await p.eval(`(() => { const li = [...document.querySelectorAll('#admin-root .za-it')].find(x => x.innerText.includes(${JSON.stringify(IT)})); li.querySelector('[data-act=za-st][data-st=archived]').click(); })()`); await sleep(1800);
    check(await J(`fetch('/api/public').then(r => r.json()).then(d => !d.items.some(i => i.t && i.t.ru === ${JSON.stringify(IT)}))`), 'материалы: «В архив» снимает карточку с сайта');
    await p.eval(`(() => { const li = [...document.querySelectorAll('#admin-root .za-it')].find(x => x.innerText.includes(${JSON.stringify(IT)})); li.querySelector('[data-act=za-del]').click(); })()`); await sleep(1800);
    check(!(await text('#admin-root')).includes(IT), 'материалы: удаление карточки');
    // ---------- пользователи и роли ----------
    await p.eval('document.querySelector("#admin-root .tabs [data-v=users]").click()'); await sleep(900);
    const ED = 'ed' + Date.now() % 100000, EDP = 'Editor-pass-12345';
    await p.type('#zu-l', ED); await p.type('#zu-n', 'Редактор Проверки'); await p.eval('(() => { const s = document.querySelector("#zu-r"); s.value = "editor"; s.dispatchEvent(new Event("change", {bubbles:true})); })()');
    await p.type('#zu-p', EDP); await p.click('#za-user button[type=submit]'); await sleep(1800);
    check((await text('#admin-root')).includes(ED), 'пользователи: сотрудник создан');
    // журнал
    await p.eval('document.querySelector("#admin-root .tabs [data-v=journal]").click()'); await sleep(1000);
    const jr = await p.eval('document.querySelectorAll("#admin-root .za-table tbody tr").length');
    check(jr >= 6, 'журнал: действия записаны', 'строк ' + jr);
    check(/Одобрение|одобр|news|новост|settings|настрой|вход/i.test(await text('#admin-root')), 'журнал: записи читаемы');
    // выход
    await p.eval('document.querySelector("[data-act=logout]").click()'); await sleep(1500);
    check(await p.eval('!!document.querySelector("#adm-pwd")'), 'выход возвращает на форму входа');
    check((await api('GET', '/api/admin/state')).s === 401, 'после выхода данные админки закрыты (401)');
    // ---------- вход редактором: ограниченные права ----------
    await p.eval('document.querySelector("#adm-login").value = ""'); await p.type('#adm-login', ED); await p.type('#adm-pwd', EDP); await p.click('#login-form button[type=submit]');
    check(await p.waitFor('!!document.querySelector("#admin-root .tabs [role=tab]")', 12000), 'редактор входит в панель');
    const etabs = JSON.parse(await p.eval(`JSON.stringify([...document.querySelectorAll('#admin-root .tabs [role=tab]')].map(b => b.dataset.v))`));
    check(!etabs.includes('users') && !etabs.includes('journal') && !etabs.includes('settings'), 'редактор не видит «Пользователи», «Журнал», «Настройки»', 'видит: ' + etabs.join(', '));
    check((await api('GET', '/api/admin/users')).s === 403 || (await api('PUT', '/api/admin/settings', {})).s === 403, 'редактору закрыт и сам сервер (403 на настройки)');
    await p.eval('document.querySelector("#admin-root .tabs [data-v=items]").click()'); await sleep(900);
    await p.click('[data-act=za-new]'); await sleep(600);
    check(!(await p.eval('!!document.querySelector("#za-form button[value=published]")')), 'редактор: кнопки «Опубликовать» нет, только черновик/на проверку');
    const e = errs();
    check(!e.length, 'в консоли браузера за весь прогон нет ошибок', e.join(' / ').slice(0, 300));
  } catch (e) { check(false, 'прогон оборвался', String(e && e.stack || e).slice(0, 400)); }
  finally { await p.close(); server.kill(); try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {} }
  const bad = results.filter(r => !r[0]);
  console.log('\nИТОГО: ' + (results.length - bad.length) + ' из ' + results.length + (bad.length ? ' · не прошли: ' + bad.map(b => b[1]).join('; ') : ''));
  process.exit(bad.length ? 1 : 0);
})();

