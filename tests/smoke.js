'use strict';
/*
 * Быстрая проверка сервера без внешних библиотек: npm test
 * Поднимает server.js с временной базой на свободном порту и проходит по главным сценариям:
 * статика и закрытые файлы, гостевая книга с модерацией, оценка, вход сотрудника, настройки, лимиты.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const PASS = 'test-' + Math.random().toString(36).slice(2);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'arhiv-test-'));

const freePort = () => new Promise(res => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let passed = 0;
async function step(name, fn) { await fn(); passed++; console.log('  ✓ ' + name); }

(async () => {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const srv = spawn(process.execPath, ['server.js'], {
    cwd: ROOT, stdio: 'ignore',
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', ADMIN_PASSWORD: PASS, ANTHROPIC_API_KEY: '', DATA_FILE: path.join(tmp, 'db.json') }
  });
  const stop = () => { try { srv.kill(); } catch (e) {} fs.rmSync(tmp, { recursive: true, force: true }); };
  const j = async (method, url, body, token) => {
    const r = await fetch(base + url, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
    let data = null; try { data = await r.json(); } catch (e) {}
    return { status: r.status, data };
  };
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch(base + '/api/health')).ok) break; } catch (e) {} await sleep(150); }
    console.log('Сервер архива: проверки');

    await step('здоровье сервера и режим ИИ', async () => {
      const r = await j('GET', '/api/health'); assert.strictEqual(r.status, 200); assert.strictEqual(r.data.ok, true); assert.strictEqual(r.data.ai, false);
    });
    await step('главная страница отдаётся', async () => {
      const r = await fetch(base + '/'); const html = await r.text();
      assert.strictEqual(r.status, 200); assert.match(html, /Государственный архив/);
      assert.strictEqual(r.headers.get('x-content-type-options'), 'nosniff');
      // языковые версии (hreflang) с полными адресами: относительные Lighthouse считает ошибкой
      assert.match(html, /hreflang="kk" href="http:\/\/[^"\/]+\/\?lang=kz"/); assert.match(html, /hreflang="x-default" href="http:\/\/[^"\/]+\/"/);
    });
    await step('служебные файлы закрыты (server.js, .env, исходники)', async () => {
      for (const p of ['/server.js', '/.env', '/package.json', '/dev/src.html', '/tools/launch.js', '/data/db.json', '/%2e%2e/etc/passwd']) {
        const r = await fetch(base + p); assert.strictEqual(r.status, 404, p);
      }
    });
    await step('переводы данных заказчика (en, kk) отдаются и совпадают с оригиналом по числу строк', async () => {
      const dev = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'dev', f), 'utf8'));
      const cu = dev('customer.json'), pr = dev('customer-prices.json'), co = dev('customer-compliance.json');
      const r = await fetch(base + '/pages/tr.json'); assert.strictEqual(r.status, 200);
      const s = (await r.json())._site; assert.ok(s && s.en && s.kk, 'нет блока _site в pages/tr.json: python tools/build_site_tr.py, затем tools/build_translations.py');
      for (const lg of ['en', 'kk']) {
        assert.strictEqual(s[lg].branches.length, cu.branches.length, lg + ': филиалы');
        assert.strictEqual(s[lg].leaders.length, cu.leaders.length, lg + ': руководство');
        assert.strictEqual(s[lg].org.depts.length, cu.org.depts.length, lg + ': отделы');
        assert.strictEqual(s[lg].org.staff.length, cu.org.staff.length, lg + ': сотрудники');
        assert.ok(s[lg].history.some(h => h[0] === '2026'), lg + ': запись 2026 в истории');
      }
      assert.deepStrictEqual(s.en.prices.rows.map(x => x.length), pr.secs.map(x => x.rows.length), 'en: строки прейскуранта');
      assert.strictEqual(s.en.compliance.notices.length, co.notices.length, 'en: объявления комплаенса');
      assert.strictEqual(s.en.compliance.docs.length, co.docs.length, 'en: документы комплаенса');
      assert.ok(!/[А-Яа-яЁё]/.test(JSON.stringify([s.en.branches, s.en.leaders, s.en.org, s.en.prices, s.en.compliance])), 'en: в переводе остались русские буквы');
    });
    await step('запись в гостевую книгу ждёт проверки', async () => {
      assert.strictEqual((await j('POST', '/api/guestbook', { name: 'Тест', city: 'Өскемен', text: 'Спасибо архиву!', lang: 'ru' })).status, 201);
      assert.strictEqual((await j('POST', '/api/guestbook', { name: 'Т', text: '' })).status, 400);
      const pub = await j('GET', '/api/public'); assert.strictEqual(pub.data.entries.length, 0);
    });
    await step('оценка: звёзды видны сразу, текст после проверки', async () => {
      assert.strictEqual((await j('POST', '/api/reviews', { stars: 5, text: 'Всё понятно' })).status, 201);
      assert.strictEqual((await j('POST', '/api/reviews', { stars: 9 })).status, 400);
      const pub = await j('GET', '/api/public'); assert.strictEqual(pub.data.reviews[0].stars, 5); assert.strictEqual(pub.data.reviews[0].text, '');
    });
    await step('без ключа ИИ помощник на сервере честно отключён', async () => {
      assert.strictEqual((await j('POST', '/api/assistant', { messages: [{ role: 'user', content: 'Где архив?' }] })).status, 503);
    });
    let token;
    await step('вход сотрудника: неверный пароль отклонён, верный даёт токен', async () => {
      assert.strictEqual((await j('POST', '/api/login', { password: 'nope' })).status, 401);
      const r = await j('POST', '/api/login', { password: PASS }); assert.strictEqual(r.status, 200); token = r.data.token; assert.ok(token && token.length === 64);
      assert.strictEqual((await j('GET', '/api/admin/state')).status, 401);
    });
    await step('модерация: одобренная запись появляется у всех', async () => {
      const st = await j('GET', '/api/admin/state', null, token); const e = st.data.entries[0];
      assert.strictEqual((await j('POST', '/api/admin/mod', { id: e.id, status: 'approved' }, token)).status, 200);
      const pub = await j('GET', '/api/public'); assert.strictEqual(pub.data.entries.length, 1); assert.strictEqual(pub.data.entries[0].name, 'Тест');
    });
    await step('настройки: телефоны и адреса меняются из панели', async () => {
      const settings = { phones: ['+7 (7232) 76-65-60'], otherAddresses: ['Потанина, 12/2', 'Крылова, 39'], open: '09:00', close: '18:00' };
      assert.strictEqual((await j('PUT', '/api/admin/settings', settings, token)).status, 200);
      const pub = await j('GET', '/api/public'); assert.deepStrictEqual(pub.data.settings.otherAddresses, settings.otherAddresses);
    });
    await step('фото: принимается только картинка', async () => {
      assert.strictEqual((await j('POST', '/api/admin/photos', { src: 'javascript:alert(1)' }, token)).status, 400);
    });
    /* новые правила: права ролей, фото зданий, проверка настроек справки. Идут до проверки лимита входа: после неё вход закрыт */
    const NP = 'Test-pass-12345';
    const mkUser = (login, role, branch) => j('PUT', '/api/admin/users', { login, name: login, role, branch, password: NP, active: true }, token);
    const loginAs = async login => (await j('POST', '/api/login', { login, password: NP })).data.token;
    let edTok = '';   // токен редактора из шага «уведомления…»: лимит входа (8 попыток за 10 минут) к концу набора уже выбран, лишних входов не делаем
    await step('права ролей: меняет только главный админ, users не передать, действуют сразу', async () => {
      assert.strictEqual((await mkUser('t-editor', 'editor', '')).status, 200);
      const ed = await loginAs('t-editor');
      assert.strictEqual((await j('PUT', '/api/admin/perms', { reset: true }, ed)).status, 403);
      const rm = (await j('GET', '/api/admin/state', null, token)).data.roleMatrix;
      assert.ok(rm.locked.includes('users') && rm.matrix.news.includes('editor'));
      assert.strictEqual((await j('GET', '/api/admin/state', null, ed)).data.roleMatrix, null);
      const m = JSON.parse(JSON.stringify(rm.matrix)); m.news = m.news.filter(r => r !== 'editor'); m.users = ['chief', 'editor']; m.settings = [];
      const r = await j('PUT', '/api/admin/perms', { matrix: m }, token);
      assert.strictEqual(r.status, 200); assert.deepStrictEqual(r.data.matrix.users, ['chief']); assert.ok(r.data.matrix.settings.includes('chief'));
      const news = { id: 'n1', date: '2026-01-01', title: { ru: 'x' }, text: { ru: 'x' } };
      assert.strictEqual((await j('PUT', '/api/admin/news', news, ed)).status, 403);
      assert.strictEqual((await j('PUT', '/api/admin/perms', { matrix: { news: ['chief'] } }, token)).status, 400);
      assert.strictEqual((await j('PUT', '/api/admin/perms', { reset: true }, token)).status, 200);
      assert.strictEqual((await j('PUT', '/api/admin/news', news, ed)).status, 200);
    });
    await step('фото зданий: админ филиала — только свой филиал; код br-… зарезервирован', async () => {
      assert.strictEqual((await mkUser('t-branch', 'branch', 'ridder')).status, 200);
      const br = await loginAs('t-branch'), src = 'data:image/jpeg;base64,AAAA';
      const post = (tk, id, slot) => j('POST', '/api/admin/photos', { id, slot, src }, tk);
      assert.strictEqual((await post(br, 'br-ridder', 'branch')).status, 200);
      assert.strictEqual((await post(br, 'br-zaisan', 'branch')).status, 403);
      assert.strictEqual((await post(br, 'x1', 'gallery')).status, 403);
      assert.strictEqual((await post(token, 'br-evil', 'gallery')).status, 400);
      assert.strictEqual((await post(token, 'br-../x', 'branch')).status, 400);
      assert.strictEqual((await post(token, 'br-gavko', 'branch')).status, 200);
      assert.strictEqual((await j('DELETE', '/api/admin/photos', { id: 'br-gavko' }, br)).status, 403);
      const pub = await j('GET', '/api/public'); assert.deepStrictEqual(pub.data.photos.filter(p => p.slot === 'branch').map(p => p.id).sort(), ['br-gavko', 'br-ridder']);
    });
    await step('контакты филиала: администратор филиала правит только свой, чужой и главное здание закрыты, поля проверяются, сброс, полный список «Филиалы» снимает правку', async () => {
      const br = await loginAs('t-branch'), put = (tk, b) => j('PUT', '/api/admin/branch', b, tk);
      const ok = { id: 'ridder', a: 'г. Риддер, ул. Тестовая, 1', p: '+7 (72336) 1-11-11, +7 (72336) 2-22-22', e: 'ridder@example.kz', h: 'пн–пт 8:00–17:00' };
      assert.strictEqual((await put(br, ok)).status, 200);
      assert.strictEqual((await put(br, { ...ok, id: 'zaisan' })).status, 403);
      assert.strictEqual((await put(br, { ...ok, id: 'nope' })).status, 400);
      assert.strictEqual((await put(token, { ...ok, id: 'gavko' })).status, 400);
      for (const bad of [{ e: 'не почта' }, { a: '' }, { p: 'abc' }]) assert.strictEqual((await put(br, { ...ok, ...bad })).status, 400, JSON.stringify(bad));
      let pub = (await j('GET', '/api/public')).data;
      assert.deepStrictEqual(pub.brEdits.ridder.p, ['+7 (72336) 1-11-11', '+7 (72336) 2-22-22']); assert.strictEqual(pub.brEdits.ridder.by, 't-branch'); assert.ok(!pub.brEdits.zaisan);
      assert.strictEqual((await put(token, { ...ok, id: 'zaisan', a: 'г. Зайсан, ул. Тестовая, 2' })).status, 200);   // главный администратор правит любой филиал
      const cur = (await j('GET', '/api/public')).data.settings || {}, bl = (id, a) => ({ id, n: id, a, p: [], e: '', h: '' });
      assert.strictEqual((await j('PUT', '/api/admin/settings', { ...cur, branchList: [bl('ridder', 'старый'), bl('zaisan', 'старый')] }, token)).status, 200);   // прежнего списка не было: правки филиалов остаются
      assert.ok((await j('GET', '/api/public')).data.brEdits.ridder);
      assert.strictEqual((await j('PUT', '/api/admin/settings', { ...cur, branchList: [bl('ridder', 'новый'), bl('zaisan', 'старый')] }, token)).status, 200);   // контакты ridder изменены в полном списке: правка филиала снята, zaisan остаётся
      pub = (await j('GET', '/api/public')).data; assert.ok(!pub.brEdits.ridder && pub.brEdits.zaisan);
      assert.strictEqual((await put(token, { id: 'zaisan', reset: true })).status, 200);
      assert.deepStrictEqual((await j('GET', '/api/public')).data.brEdits, {});
      assert.strictEqual((await j('PUT', '/api/admin/settings', cur, token)).status, 200);   // настройки как были
    });
    await step('настройки справки: ссылки только http(s), тексты — только известные ключи и языки', async () => {
      const put = b => j('PUT', '/api/admin/settings', b, token);
      assert.strictEqual((await put({ refLinks: [{ url: 'javascript:alert(1)', t: { ru: 'x' } }] })).status, 400);
      assert.strictEqual((await put({ guide: { evil: { ru: 'x' } } })).status, 400);
      assert.strictEqual((await put({ guide: { site: { ru: 'x'.repeat(20001) } } })).status, 400);
      assert.strictEqual((await put({ guide: { site: { ru: '## Тест' } }, refLinks: [{ url: 'https://example.kz/a', t: { ru: 'Пример' } }] })).status, 200);
      assert.strictEqual((await j('GET', '/api/public')).data.settings.guide.site.ru, '## Тест');
    });
    await step('адрес /admin ведёт на вход в админку, чужие адреса дают 404', async () => {
      const r = await fetch(base + '/admin', { redirect: 'manual' });
      assert.strictEqual(r.status, 302); assert.strictEqual(r.headers.get('location'), '/#admin');
      assert.strictEqual((await fetch(base + '/nope-404')).status, 404);
    });
    await step('SEO: полные адреса превью, ключевые слова, карточки из админки в sitemap, закрытые — noindex', async () => {
      const html0 = await (await fetch(base + '/')).text();
      assert.match(html0, /property="og:image" content="http:\/\/[^"\/]+\/img\/building\.jpg"/); assert.match(html0, /property="og:url" content="http:\/\/[^"\/]+\/"/);
      const st = (await j('GET', '/api/public')).data.settings;
      assert.strictEqual((await j('PUT', '/api/admin/settings', { ...st, seoKeywords: 'архив, Өскемен' }, token)).status, 200);
      assert.match(await (await fetch(base + '/')).text(), /<meta name="keywords" content="архив, Өскемен">/);
      assert.strictEqual((await j('PUT', '/api/admin/settings', { ...st, seoKeywords: 'x'.repeat(501) }, token)).status, 400);
      const mk = (title, acc) => j('PUT', '/api/admin/items', { type: 'catalog', st: 'published', data: { k: 'doc', a: 'gavko', t: { ru: title }, f: '77', o: '1', d: '19', acc } }, token);
      const open = (await mk('Открытый тестовый документ', 'open')).data.id, closed = (await mk('Закрытый тестовый документ', 'limited')).data.id;
      const p1 = await fetch(base + '/catalog/' + open), h1 = await p1.text();
      assert.strictEqual(p1.status, 200); assert.match(h1, /<title>Открытый тестовый документ — /); assert.doesNotMatch(h1, /name="robots" content="noindex/);
      assert.match(await (await fetch(base + '/catalog/' + closed)).text(), /name="robots" content="noindex/);
      const sm = await (await fetch(base + '/sitemap.xml')).text();
      assert.ok(sm.includes('/catalog/' + open)); assert.ok(!sm.includes('/catalog/' + closed));
    });
    await step('каталог: правка и скрытие перенесённых записей, закрытая без копии, возврат исходного', async () => {
      const get = async () => { const r = await fetch(base + '/pages/catalog.json', { headers: { 'Accept-Encoding': 'identity' } }); return { j: await r.json(), etag: r.headers.get('etag') }; };
      const c0 = await get(); const rec = c0.j.items.find(r => r.k === 'doc' && r.img && r.img.length) || c0.j.items.find(r => r.k === 'doc');
      assert.ok(rec && c0.etag);
      assert.strictEqual((await fetch(base + '/pages/catalog.json', { headers: { 'If-None-Match': c0.etag, 'Accept-Encoding': 'identity' } })).status, 304);
      assert.strictEqual((await j('GET', '/api/admin/catalog?q=x', null, await loginAs('t-editor'))).status, 403);   // нужно право publish
      const found = (await j('GET', '/api/admin/catalog?q=' + encodeURIComponent(rec.c || rec.id), null, token)).data;
      assert.ok(found.items.some(x => x.id === rec.id));
      const NEW = 'Исправленное название для теста';
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, patch: { t: { ru: NEW }, acc: 'limited' } }, token)).status, 200);
      const r1 = (await get()).j.items.find(r => r.id === rec.id);
      assert.strictEqual(r1.t.ru, NEW); assert.strictEqual(r1.acc, 'limited'); assert.ok(!r1.img && !r1.url && !r1.tx);   // копия и текст закрытой записи не отдаются
      assert.match(await (await fetch(base + '/catalog/' + encodeURIComponent(rec.id))).text(), /name="robots" content="noindex/);
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, hidden: true }, token)).status, 200);
      const c2 = (await get()).j; assert.ok(!c2.items.some(r => r.id === rec.id)); assert.strictEqual(c2.items.length, c0.j.items.length - 1);
      assert.strictEqual((await fetch(base + '/catalog/' + encodeURIComponent(rec.id))).status, 404);
      assert.ok(!(await (await fetch(base + '/sitemap.xml')).text()).includes('/catalog/' + encodeURIComponent(rec.id)));
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, patch: { t: { ru: 'ab' } } }, token)).status, 400);
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: 'нет-такой-записи', hidden: true }, token)).status, 404);
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, reset: true }, token)).status, 200);
      assert.deepStrictEqual((await get()).j.items.find(r => r.id === rec.id), c0.j.items.find(r => r.id === rec.id));
    });
    await step('цифровые копии: тип по содержимому, PDF без скриптов, посетителю — только прикреплённое к открытой записи', async () => {
      const up = async (buf, name, path = '/api/admin/files?name=' + encodeURIComponent(name)) => { const r = await fetch(base + path, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/octet-stream' }, body: buf }); return { status: r.status, data: await r.json().catch(() => null) }; };
      const pub = (u, tk) => fetch(base + u, tk ? { headers: { Authorization: 'Bearer ' + tk } } : {});
      const JPG = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==', 'base64');
      const PDF = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n', 'latin1');
      assert.strictEqual((await up(Buffer.from('<html><script>alert(1)</script></html>'), 'scan.jpg')).status, 415);   // расширение не важно, важен тип по содержимому
      assert.strictEqual((await up(Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00', 'latin1'), 'scan.pdf')).status, 415);
      assert.strictEqual((await up(Buffer.from('%PDF-1.4\n1 0 obj<</OpenAction<</S/JavaScript/JS(app.alert(1))>>>>endobj\n%%EOF', 'latin1'), 'x.pdf')).status, 422);
      const img = await up(JPG, 'скан: лист 1?.jpg'), pdf = await up(PDF, 'дело 19.pdf'), tif = await up(Buffer.concat([Buffer.from('II*\0', 'latin1'), Buffer.alloc(16)]), 'master.tif');
      assert.strictEqual(img.status, 201); assert.strictEqual(img.data.k, 'img'); assert.strictEqual(img.data.n, 'скан_ лист 1_.jpg');
      assert.strictEqual(pdf.data.k, 'pdf'); assert.strictEqual(tif.data.ext, 'tif');
      const V = id => '/files/' + id + '/view', M = id => '/files/' + id + '/master';
      assert.strictEqual((await pub(V(img.data.id))).status, 404);              // ещё не прикреплён — посетителю не виден
      assert.strictEqual((await pub(V(img.data.id), token)).status, 200);       // сотруднику виден
      assert.strictEqual((await up(PDF, '', '/api/admin/files/' + img.data.id + '/view')).status, 415);   // копия для показа — только JPEG
      assert.strictEqual((await up(JPG, '', '/api/admin/files/' + img.data.id + '/view?w=1&h=1&ow=1&oh=1')).status, 200);
      const data = { k: 'doc', a: 'gavko', t: { ru: 'Документ со сканом' }, f: '77', o: '1', d: '20', files: [{ id: img.data.id }, { id: pdf.data.id }, { id: tif.data.id }] };
      assert.strictEqual((await j('PUT', '/api/admin/items', { type: 'catalog', st: 'published', data: { ...data, files: [{ id: '0'.repeat(24) }] } }, token)).status, 400);
      const it = await j('PUT', '/api/admin/items', { type: 'catalog', st: 'published', data }, token); assert.strictEqual(it.status, 200);
      const r1 = await pub(V(img.data.id)); assert.strictEqual(r1.status, 200); assert.strictEqual(r1.headers.get('content-type'), 'image/jpeg');
      const r2 = await pub(V(pdf.data.id)); assert.strictEqual(r2.headers.get('content-type'), 'application/pdf'); assert.match(r2.headers.get('content-disposition'), /^inline/);
      assert.strictEqual((await pub(V(tif.data.id))).status, 404);              // у TIFF нет копии для показа — браузер его не покажет
      assert.strictEqual((await pub(M(img.data.id))).status, 404);              // мастер-копия — только сотрудникам
      const rm = await pub(M(tif.data.id), token); assert.strictEqual(rm.status, 200); assert.match(rm.headers.get('content-disposition'), /^attachment/);
      const item = (await j('GET', '/api/public')).data.items.find(x => x.id === it.data.id); assert.deepStrictEqual(item.files.map(f => f.k), ['img', 'pdf', 'img']);
      assert.strictEqual((await j('DELETE', '/api/admin/files/' + img.data.id, {}, token)).status, 409);   // прикреплённый не удалить
      assert.strictEqual((await j('PUT', '/api/admin/items', { id: it.data.id, type: 'catalog', st: 'published', data: { ...data, acc: 'limited' } }, token)).status, 200);
      assert.strictEqual((await pub(V(pdf.data.id))).status, 404);              // запись стала закрытой — копии не отдаются
      assert.ok(!(await j('GET', '/api/public')).data.items.find(x => x.id === it.data.id).files);
      // к перенесённой записи тоже можно прикрепить: доступ по её статусу
      const extra = await up(JPG, 'к перенесённой.jpg'), rec = (await (await fetch(base + '/pages/catalog.json')).json()).items.find(r => r.k === 'doc');
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, patch: { files: [{ id: extra.data.id }] } }, token)).status, 200);
      assert.strictEqual((await pub(V(extra.data.id))).status, 200);
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, hidden: true }, token)).status, 200);
      assert.strictEqual((await pub(V(extra.data.id))).status, 404);
      assert.strictEqual((await j('PUT', '/api/admin/catalog', { id: rec.id, reset: true }, token)).status, 200);
      assert.strictEqual((await j('DELETE', '/api/admin/files/' + extra.data.id, {}, token)).status, 200);   // больше нигде не прикреплён — удаляется
    });
    await step('«Архив памяти»: событие с годом, человек с биографией, плохие данные отклонены', async () => {
      const put = data => j('PUT', '/api/admin/items', { type: 'memory', st: 'published', data }, token);
      assert.strictEqual((await put({ mt: 'event', t: { ru: 'Без года' } })).status, 400);
      assert.strictEqual((await put({ mt: 'event', y: 3000, t: { ru: 'Год вне диапазона' } })).status, 400);
      assert.strictEqual((await put({ mt: 'alien', y: 1950, t: { ru: 'Неизвестный вид' } })).status, 400);
      assert.strictEqual((await put({ mt: 'person', t: { ru: 'Фото-скрипт' }, img: 'javascript:alert(1)' })).status, 400);
      assert.strictEqual((await put({ mt: 'person', t: { ru: 'Много групп' }, gr: Array(11).fill('x') })).status, 400);
      const ev = await put({ mt: 'event', y: 1950, t: { ru: 'Тестовое событие' }, g: 'region', rel: ['d-1-1'] }); assert.strictEqual(ev.status, 200);
      const pp = await put({ mt: 'person', t: { ru: 'Тестовый Человек' }, gr: ['Герои'], b0: 1900, b1: 1970, bio: { ru: 'Биография' }, img: 'img/building.jpg' }); assert.strictEqual(pp.status, 200);
      // объект исторической карты: координаты числами в пределах региона, известный вид
      assert.strictEqual((await put({ mt: 'place', t: { ru: 'Здание' }, hc: 'building', lat: '49.9', lon: 82.6 })).status, 400);
      assert.strictEqual((await put({ mt: 'place', t: { ru: 'Здание' }, hc: 'building', lat: 10, lon: 82.6 })).status, 400);
      assert.strictEqual((await put({ mt: 'place', t: { ru: 'Здание' }, hc: 'castle', lat: 49.9, lon: 82.6 })).status, 400);
      const pl = await put({ mt: 'place', t: { ru: 'Тестовое здание' }, hc: 'building', lat: 49.95, lon: 82.62, y: 1910 }); assert.strictEqual(pl.status, 200);
      const items = (await j('GET', '/api/public')).data.items;
      assert.strictEqual(items.find(x => x.id === pl.data.id).lat, 49.95);
      assert.strictEqual(items.find(x => x.id === pp.data.id).mt, 'person'); assert.deepStrictEqual(items.find(x => x.id === ev.data.id).rel, ['d-1-1']);
    });
    await step('уведомления: редактор видит «на проверку», автор — решение; своё себе не приходит; журнал: объект, версия, результат', async () => {
      const ed = await loginAs('t-editor'); assert.ok(ed); edTok = ed;
      const it = await j('PUT', '/api/admin/items', { type: 'memory', st: 'review', data: { mt: 'event', y: 1960, t: { ru: 'Событие на проверку' } } }, ed); assert.strictEqual(it.status, 200);
      const chief = (await j('GET', '/api/admin/state', null, token)).data;
      const n1 = chief.notes.find(n => n.item === it.data.id); assert.ok(n1); assert.strictEqual(n1.kind, 'review'); assert.strictEqual(n1.by, 't-editor'); assert.strictEqual(n1.title, 'Событие на проверку');
      assert.ok(!(await j('GET', '/api/admin/state', null, ed)).data.notes.some(n => n.item === it.data.id));   // своё действие себе не приходит
      assert.strictEqual((await j('PUT', '/api/admin/items', { id: it.data.id, type: 'memory', st: 'rework', note: 'уточните год', data: { mt: 'event', y: 1960, t: { ru: 'Событие на проверку' } } }, token)).status, 200);
      const es = (await j('GET', '/api/admin/state', null, ed)).data;
      const n2 = es.notes.find(n => n.item === it.data.id && n.kind === 'rework'); assert.ok(n2); assert.strictEqual(n2.note, 'уточните год');
      assert.ok(!(await j('GET', '/api/admin/state', null, token)).data.notes.some(n => n.kind === 'rework'));
      assert.strictEqual(es.noteSeen, 0);
      assert.strictEqual((await j('POST', '/api/admin/notes/seen', {}, ed)).status, 200);
      assert.ok((await j('GET', '/api/admin/state', null, ed)).data.noteSeen > 0);
      // журнал (ТЗ 6.8): объект, версия и результат; отказ и неудачный вход тоже записаны; пароли не пишем
      const body = year => ({ id: it.data.id, type: 'memory', st: 'review', data: { mt: 'event', y: year, t: { ru: 'Событие на проверку' } } });
      assert.strictEqual((await j('PUT', '/api/admin/items', { ...body(1960), st: 'published' }, ed)).status, 403);   // редактор публиковать не может
      const e2 = await j('PUT', '/api/admin/items', body(1961), ed); assert.strictEqual(e2.status, 200); assert.strictEqual(e2.data.ver, 2);   // данные изменились: версия 2
      assert.strictEqual((await j('POST', '/api/login', { login: 't-editor', password: 'неверный-пароль-журнал' })).status, 401);
      const sj = (await j('GET', '/api/admin/state', null, token)).data, jr = sj.journal, mine = jr.filter(e => e.obj === it.data.id);
      assert.ok(mine.some(e => e.action.startsWith('создание') && e.res === 'ok' && e.ver === 1 && e.user === 't-editor' && e.code === 200));
      assert.ok(mine.some(e => e.action.startsWith('изменение') && e.res === 'ok' && e.ver === 2));
      assert.ok(jr.some(e => e.user === 't-editor' && e.res === 'denied' && e.code === 403));   // отказ записан
      assert.ok(jr.some(e => e.action === 'вход' && e.user === 't-editor' && e.res === 'denied' && e.code === 401));
      assert.ok(!JSON.stringify(jr).includes('неверный-пароль-журнал') && !JSON.stringify(jr).includes(NP));   // пароли в журнал не попадают
      const rec = sj.items.find(i => i.id === it.data.id); assert.strictEqual(rec.ver, 2); assert.deepStrictEqual(rec.vers.map(v => v.v), [1, 2]); assert.deepStrictEqual(rec.vers[1].changed, ['y']);
    });
    await step('данные заказчика: 13 филиалов, PDF комплаенса отдаются, календарь памятных дат, чужие пути закрыты', async () => {
      const pdf = await fetch(base + '/docs/compliance/positions-ru.pdf');
      assert.strictEqual(pdf.status, 200); assert.strictEqual(pdf.headers.get('content-type'), 'application/pdf');
      const head = Buffer.from(await pdf.arrayBuffer()); assert.strictEqual(head.subarray(0, 4).toString(), '%PDF'); assert.strictEqual(String(head.length), pdf.headers.get('content-length'));
      assert.strictEqual((await fetch(base + '/docs/compliance/positions-ru.pdf', { method: 'HEAD' })).status, 200);
      for (const bad of ['/docs/compliance/net.pdf', '/docs/prices/net.pdf', '/docs/prices/..%2Fserver.js','/docs/compliance/..%2Fserver.js', '/docs/other/x.pdf', '/docs/compliance/plan-ru.txt', '/public-docs/compliance/plan-ru.pdf', '/dev/customer.json'])
        assert.strictEqual((await fetch(base + bad)).status, 404, bad);
      const cal = await (await fetch(base + '/pages/calendar.json')).json();
      assert.deepStrictEqual(cal.years.map(y => y.y), [2026, 2025, 2024, 2023, 2022]);
      assert.ok(cal.years[0].rows.length > 30 && cal.years.every(y => y.rows.every(r => r.t && r.d && r.tk)));   // у каждой даты есть русский и казахский текст
      const html = await (await fetch(base + '/')).text(); const file = /\/(site-data\.[a-f0-9]{10}\.js)/.exec(html)[1];
      const data = await (await fetch(base + '/' + file)).text();
      assert.match(data, /Филиал района Алтай/); assert.match(data, /Шемонаихинский районный филиал/); assert.doesNotMatch(data, /Жангельдина/);
      const site = JSON.parse(data.slice(data.indexOf('{'), data.lastIndexOf('}') + 1)), branches = site.branches; assert.strictEqual(branches.length, 13);
      assert.ok(branches.every(b => !/@.*(alimvko|\.qov\.)/.test(b.e)));   // почты с опечатками в домене не публикуем
      assert.strictEqual(site.compliance.officer.n, 'Ешенгельдиев Тырек Молболович'); assert.ok(site.org.depts.length >= 7 && site.leaders.every(l => l.e));
      const pr = site.prices, prRows = pr.secs.flatMap(s => s.rows);   // прейскурант платных услуг (постановление № 289 от 15.12.2023)
      assert.strictEqual(pr.doc.no, '289'); assert.strictEqual(pr.secs.length, 8); assert.ok(prRows.length > 200 && prRows.filter(r => r[3]).length > 150);
      assert.ok(prRows.filter(r => r[3]).every(r => /^\d{1,3}( \d{3})*,\d( \/ \d{1,3}( \d{3})*,\d)?$/.test(r[3])), 'цены в виде «20 304,0»');
      assert.ok(prRows.every(r => r[0] && r[1] && r.length >= 4)); assert.ok(pr.secs.every(s => s.t[0] && s.t[1]));
      for (const k of ['ru', 'kz']) { const f = await fetch(base + pr.pdf[k]); assert.strictEqual(f.status, 200); assert.strictEqual(Buffer.from(await f.arrayBuffer()).subarray(0, 4).toString(), '%PDF'); }
    });
    await step('опрос, оценка страницы, публичная статистика: голос и оценка считаются, лишнее отклоняется, в статистике только счётчики', async () => {
      const post = (u, b) => j('POST', u, b);
      const p0 = (await j('GET', '/api/poll')).data; assert.ok(p0.opts.length >= 3 && p0.q.length === 3); assert.strictEqual(p0.total, 0);
      assert.strictEqual((await post('/api/poll', { opt: 'нет такого' })).status, 400);
      const p1 = await post('/api/poll', { opt: p0.opts[0].id }); assert.strictEqual(p1.status, 200); assert.strictEqual(p1.data.total, 1); assert.strictEqual(p1.data.opts[0].n, 1);
      assert.strictEqual((await post('/api/rate', { k: 'visitors/reading', v: 5 })).data.n, 1);
      const r2 = await post('/api/rate', { k: 'visitors/reading', v: 4 }); assert.strictEqual(r2.data.n, 2); assert.strictEqual(r2.data.avg, 4.5);
      assert.strictEqual((await post('/api/rate', { k: 'visitors/reading', v: 6 })).status, 400);   // оценка от 1 до 5
      assert.strictEqual((await post('/api/rate', { k: '<script>', v: 3 })).status, 400);   // ключ страницы — только безопасные знаки
      const st = (await j('GET', '/api/public-stats')).data;
      assert.strictEqual(st.ratings.n, 2); assert.strictEqual(st.ratings.avg, 4.5); assert.strictEqual(st.poll.total, 1); assert.deepStrictEqual(st.ratings.top[0], { k: 'visitors/reading', n: 2, avg: 4.5 });
      assert.ok(!JSON.stringify(st).match(/"ip"|password|login/i), 'в публичной статистике нет адресов и учётных данных');
    });
    await step('импорт: предпросмотр (dry) проверяет строки теми же правилами и ничего не сохраняет', async () => {
      const count = async () => (await j('GET', '/api/admin/state', null, token)).data.items.length, n0 = await count();
      const rows = [{ k: 'doc', a: 'gavko', t: { ru: 'Приказ по военкомату' }, f: '77', o: '1', d: '9999' }, { k: 'fond', a: 'gavko', t: { ru: 'Фонд без номера' } }];
      const dry = await j('POST', '/api/admin/items/bulk', { rows, dry: true, fileRows: 2 }, token);
      assert.strictEqual(dry.status, 200); assert.strictEqual(dry.data.dry, true); assert.strictEqual(dry.data.ok, 1); assert.strictEqual(dry.data.total, 2);
      assert.deepStrictEqual(dry.data.errors, [{ row: 3, error: 'нет номера фонда', title: 'Фонд без номера' }]);   // у ошибки есть номер строки и название — понятно, что править
      assert.strictEqual(dry.data.received, 2); assert.strictEqual(dry.data.fileRows, 2); assert.strictEqual(dry.data.balanced, true);   // сверка: в файле 2, дошло 2, годных 1 + ошибок 1
      assert.ok(dry.data.warnings.some(w => w.row === 2 && /нет дела 9999/.test(w.text)), 'документ без дела в каталоге — замечание, а не ошибка');
      const dup = await j('POST', '/api/admin/items/bulk', { rows: [{ k: 'file', a: 'gavko', t: { ru: 'Дело, которое уже есть' }, f: '77', o: '1', d: '19' }], dry: true }, token);
      assert.strictEqual(dup.data.ok, 1); assert.ok(dup.data.warnings.some(w => /уже есть в каталоге/.test(w.text)), 'дубль дела — замечание');
      assert.strictEqual((await j('POST', '/api/admin/items/bulk', { rows, dry: true, fileRows: 5 }, token)).data.balanced, false);   // в файле 5 строк, дошло 2 — сверка не сходится
      assert.strictEqual(await count(), n0);   // предпросмотр ничего не записал
      assert.strictEqual((await j('GET', '/api/admin/state', null, token)).data.imports.length, 0);   // и в журнал переносов не попал
      const real = await j('POST', '/api/admin/items/bulk', { rows, file: 'test.csv', fileRows: 2 }, token);
      assert.strictEqual(real.data.ok, 1); assert.strictEqual(real.data.dry, undefined); assert.strictEqual(await count(), n0 + 1);   // настоящая загрузка — то же самое, но с записью
      const batch = real.data.batch; assert.ok(batch);
      const bt = (await j('GET', '/api/admin/state', null, token)).data.imports.find(x => x.id === batch);
      assert.ok(bt && bt.file === 'test.csv' && bt.ok === 1 && bt.errorCount === 1 && bt.balanced === true && !bt.rolledBack);   // партия записана в журнал переносов с итогами
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: batch })).status, 401);   // без входа откат недоступен
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: 'нет такого' }, token)).status, 404);
      const rb = await j('POST', '/api/admin/imports/rollback', { id: batch }, token);
      assert.strictEqual(rb.status, 200); assert.strictEqual(rb.data.removed, 1); assert.strictEqual(await count(), n0);   // откат убрал записи партии и только их
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: batch }, token)).status, 409);   // дважды откатить нельзя
      assert.strictEqual((await j('GET', '/api/admin/state', null, token)).data.imports.find(x => x.id === batch).rolledBack.removed, 1);
      /* права на откат: редактор — только свою партию и пока в ней нет опубликованного; чужую и опубликованную откатывает администратор */
      const ed = edTok, one = t => [{ k: 'doc', a: 'gavko', t: { ru: t }, f: '77', o: '1', d: '19' }];
      const e1 = (await j('POST', '/api/admin/items/bulk', { rows: one('Документ редактора 1'), file: 'ed1.csv', fileRows: 1 }, ed)).data;
      const e2 = (await j('POST', '/api/admin/items/bulk', { rows: one('Документ редактора 2'), file: 'ed2.csv', fileRows: 1 }, ed)).data;
      const a1 = (await j('POST', '/api/admin/items/bulk', { rows: one('Документ администратора'), file: 'adm.csv', fileRows: 1 }, token)).data;
      assert.ok(e1.batch && e2.batch && a1.batch); assert.strictEqual(await count(), n0 + 3);
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: a1.batch }, ed)).status, 403);   // чужую партию редактор не откатывает
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: e1.batch }, ed)).data.removed, 1);   // свою, пока всё на проверке, — может
      const rec = (await j('GET', '/api/admin/state', null, token)).data.items.find(i => i.batch === e2.batch); assert.ok(rec, 'запись партии видна в состоянии');
      assert.strictEqual((await j('PUT', '/api/admin/items', { id: rec.id, type: 'catalog', st: 'published', data: rec.data }, token)).status, 200);   // администратор публикует запись из партии редактора
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: e2.batch }, ed)).status, 403);   // теперь в партии есть опубликованное: редактору нельзя
      const rbp = await j('POST', '/api/admin/imports/rollback', { id: e2.batch }, token); assert.strictEqual(rbp.data.removed, 1); assert.strictEqual(rbp.data.published, 1);   // администратору можно, и ответ говорит, что было опубликовано
      assert.strictEqual((await j('POST', '/api/admin/imports/rollback', { id: a1.batch }, token)).data.removed, 1); assert.strictEqual(await count(), n0);   // всё убрано, состояние как до проверки
      assert.strictEqual((await j('POST', '/api/admin/items/bulk', { rows, dry: true })).status, 401);   // без входа предпросмотр недоступен
    });
    await step('выставка: видео (MP4, WebM) и аудио (MP3, M4A, OGG, WAV) — тип по содержимому, посетителю только после публикации, отдаётся кусками (Range)', async () => {
      const up = async (buf, name) => fetch(base + '/api/admin/files?name=' + name, { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: buf });
      const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypmp42'), Buffer.alloc(4), Buffer.from('mp42isom'), Buffer.from(Array.from({ length: 2000 }, (_, i) => i % 251))]);
      const r1 = await up(mp4, 'video.mp4'); assert.strictEqual(r1.status, 201); const m1 = await r1.json(); assert.strictEqual(m1.k, 'video'); assert.strictEqual(m1.ext, 'mp4');
      const r2 = await up(Buffer.concat([Buffer.from([0x1A, 0x45, 0xDF, 0xA3]), Buffer.alloc(3000, 9)]), 'clip.webm'); assert.strictEqual((await r2.json()).ext, 'webm');
      assert.strictEqual((await up(Buffer.from('просто текст, не видео, достаточно длинный'), 'fake.mp4')).status, 415);
      /* проверка загрузок: тестовая сигнатура EICAR и вшитая программа отклоняются, обычный файл проходит */
      const eic = ['X5O!P%@AP[4' + String.fromCharCode(92) + 'PZX54(P^)7CC)7}$', 'EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'].join(''), jpgHead = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0, 16, 0x4A, 0x46, 0x49, 0x46, 0, 1]);
      const v1 = await up(Buffer.concat([jpgHead, Buffer.alloc(40, 1), Buffer.from(eic)]), 'virus.jpg'); assert.strictEqual(v1.status, 422); assert.match((await v1.json()).error, /EICAR/);
      assert.strictEqual((await up(Buffer.concat([jpgHead, Buffer.from('MZ....This program cannot be run in DOS mode.')]), 'exe.jpg')).status, 422);
      assert.strictEqual((await up(Buffer.concat([jpgHead, Buffer.alloc(200, 7)]), 'ok.jpg')).status, 201);   // обычная картинка проходит   // расширение не важно: смотрим на содержимое
      const data = { kind: 'doc', t: { ru: 'Выставка с видео' }, files: [{ id: m1.id, n: 'video.mp4' }] };
      assert.strictEqual((await j('PUT', '/api/admin/items', { type: 'expo', st: 'draft', data: { ...data, files: [{ id: '0'.repeat(24) }] } }, token)).status, 400);   // файла нет
      const put = await j('PUT', '/api/admin/items', { type: 'expo', st: 'draft', data }, token); assert.strictEqual(put.status, 200);
      assert.strictEqual((await fetch(base + '/files/' + m1.id + '/view')).status, 404);   // черновик: посетителю не отдаём
      assert.strictEqual((await j('PUT', '/api/admin/items', { id: put.data.id, type: 'expo', st: 'published', data }, token)).status, 200);
      const full = await fetch(base + '/files/' + m1.id + '/view'); assert.strictEqual(full.status, 200);
      assert.strictEqual(full.headers.get('content-type'), 'video/mp4'); assert.strictEqual(full.headers.get('accept-ranges'), 'bytes'); assert.strictEqual(Buffer.from(await full.arrayBuffer()).length, mp4.length);
      const part = await fetch(base + '/files/' + m1.id + '/view', { headers: { Range: 'bytes=100-199' } });
      assert.strictEqual(part.status, 206); assert.strictEqual(part.headers.get('content-range'), 'bytes 100-199/' + mp4.length); assert.ok(Buffer.from(await part.arrayBuffer()).equals(mp4.subarray(100, 200)));
      const tail = await fetch(base + '/files/' + m1.id + '/view', { headers: { Range: 'bytes=-50' } }); assert.strictEqual(tail.status, 206); assert.ok(Buffer.from(await tail.arrayBuffer()).equals(mp4.subarray(mp4.length - 50)));
      assert.strictEqual((await fetch(base + '/files/' + m1.id + '/view', { headers: { Range: 'bytes=999999-' } })).status, 416);
      assert.ok((await j('GET', '/api/public')).data.items.find(x => x.id === put.data.id).files[0].k === 'video');   // страница выставки получает файл
      // аудио: тип по содержимому (MP3 с меткой ID3 и без неё, M4A, OGG, WAV), а webp по-прежнему картинка
      const mp3 = Buffer.concat([Buffer.from('ID3'), Buffer.from([3, 0, 0, 0, 0, 0, 0x21]), Buffer.alloc(1500, 5)]);
      const frame = Buffer.concat([Buffer.from([0xFF, 0xFB, 0x90, 0x00]), Buffer.alloc(1500, 6)]);
      const m4a = Buffer.concat([Buffer.from([0, 0, 0, 0x20]), Buffer.from('ftypM4A '), Buffer.alloc(1500, 7)]);
      const ogg = Buffer.concat([Buffer.from('OggS'), Buffer.alloc(1500, 8)]);
      const wav = Buffer.concat([Buffer.from('RIFF'), Buffer.from([0xE0, 0x05, 0, 0]), Buffer.from('WAVEfmt '), Buffer.alloc(1500, 9)]);
      const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.from([0x20, 0, 0, 0]), Buffer.from('WEBPVP8 '), Buffer.alloc(100, 1)]);
      const kinds = {};
      for (const [name, buf] of [['a.mp3', mp3], ['b.mp3', frame], ['c.m4a', m4a], ['d.ogg', ogg], ['e.wav', wav], ['f.webp', webp]]) { const r = await up(buf, name); kinds[name] = r.status === 201 ? (await r.json()).ext : r.status; }
      assert.deepStrictEqual(kinds, { 'a.mp3': 'mp3', 'b.mp3': 'mp3', 'c.m4a': 'm4a', 'd.ogg': 'ogg', 'e.wav': 'wav', 'f.webp': 'webp' });
      const am = await (await up(mp3, 'sound.mp3')).json(); assert.strictEqual(am.k, 'audio');
      const adata = { ...data, files: [{ id: m1.id, n: 'video.mp4' }, { id: am.id, n: 'sound.mp3' }] };
      assert.strictEqual((await j('PUT', '/api/admin/items', { id: put.data.id, type: 'expo', st: 'published', data: adata }, token)).status, 200);
      const af = await fetch(base + '/files/' + am.id + '/view'); assert.strictEqual(af.status, 200);
      assert.strictEqual(af.headers.get('content-type'), 'audio/mpeg'); assert.strictEqual(af.headers.get('accept-ranges'), 'bytes');
      const ap = await fetch(base + '/files/' + am.id + '/view', { headers: { Range: 'bytes=10-19' } }); assert.strictEqual(ap.status, 206); assert.ok(Buffer.from(await ap.arrayBuffer()).equals(mp3.subarray(10, 20)));
    });
    await step('RSS: новости и выставки, ссылка на ленту в заголовке страницы', async () => {
      const r = await fetch(base + '/feed.xml'); const x = await r.text();
      assert.strictEqual(r.status, 200); assert.match(r.headers.get('content-type'), /rss\+xml/);
      assert.match(x, /^<\?xml/); assert.match(x, /<rss version="2.0">/); assert.match(x, /<item><title>/);
      assert.match(await (await fetch(base + '/')).text(), /<link rel="alternate" type="application\/rss\+xml"[^>]*\/feed\.xml">/);
    });
    await step('структура, языки, интеграции: проверка настроек, hreflang и sitemap без выключенного языка, коды поисковиков', async () => {
      const put = b => j('PUT', '/api/admin/settings', b, token);
      assert.strictEqual((await put({ nav: [{ id: 'evil' }] })).status, 400);
      assert.strictEqual((await put({ nav: [{ id: 'about', on: false }, { id: 'about' }] })).status, 400);
      assert.strictEqual((await put({ nav: [{ id: 'about', on: false }] })).status, 400);          // в меню не осталось ни одного пункта
      assert.strictEqual((await put({ langs: { ru: false } })).status, 400);
      assert.strictEqual((await put({ verify: { google: '"><script>' } })).status, 400);
      assert.strictEqual((await put({ nav: [{ id: 'news', on: true, t: { ru: 'События' } }, { id: 'about', on: false }], langs: { en: false }, verify: { google: 'abcDEF123_-x' }, aiOff: true })).status, 200);
      const html = await (await fetch(base + '/')).text();
      assert.match(html, /<meta name="google-site-verification" content="abcDEF123_-x">/);
      assert.match(html, /hreflang="kk"/); assert.doesNotMatch(html, /hreflang="en"/);
      const sm = await (await fetch(base + '/sitemap.xml')).text(); assert.doesNotMatch(sm, /hreflang="en"/); assert.match(sm, /hreflang="kk"/);
      assert.strictEqual((await j('GET', '/api/health')).data.ai, false);
      // «Об архиве»: только известные блоки и поля, ссылки https:// или загруженный файл
      assert.strictEqual((await put({ org: { evil: [] } })).status, 400);
      assert.strictEqual((await put({ org: { reports: [{ y: 2024, t: { ru: 'Отчёт' }, url: 'javascript:alert(1)' }] } })).status, 400);
      assert.strictEqual((await put({ org: { staff: [{ n: 'Иванов', e: 'не почта' }] } })).status, 400);
      assert.strictEqual((await put({ org: { staff: [{ n: 'Иванов', x: 1 }] } })).status, 400);
      assert.strictEqual((await put({ org: { depts: [{ n: { ru: 'Отдел' }, head: 'Петров', d: { ru: 'Хранение' } }], staff: [{ n: 'Иванов', r: 'архивист', e: 'a@b.kz' }], reports: [{ y: 2024, t: { ru: 'Отчёт' }, url: 'https://example.kz/r.pdf' }], docs: [{ t: 'Приказ', d: '01.01.2024', url: '/files/' + 'a'.repeat(24) + '/view' }] } })).status, 200);
      assert.strictEqual((await j('GET', '/api/public')).data.settings.org.staff[0].e, 'a@b.kz');
      assert.strictEqual((await put({})).status, 200);
      assert.match(await (await fetch(base + '/')).text(), /hreflang="en"/);
    });
    await step('защита от подбора пароля (лимит попыток)', async () => {
      let last = 0; for (let i = 0; i < 9; i++) last = (await j('POST', '/api/login', { password: 'x' + i })).status;
      assert.strictEqual(last, 429);
    });
    console.log(`\nГотово: ${passed} проверок пройдено.`);
    stop(); process.exit(0);
  } catch (e) {
    console.error('\n✗ Ошибка: ' + (e && e.message || e)); stop(); process.exit(1);
  }
})();
