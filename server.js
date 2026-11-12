/*
 * Сервер сайта Государственного архива ВКО.
 * Без внешних зависимостей: нужен только Node.js 20+.
 *
 * Запуск:  node --env-file=.env server.js   (или просто: node server.js)
 * Переменные окружения (см. .env.example):
 *   PORT               порт, по умолчанию 3000
 *   HOST               адрес для прослушивания; tools/launch.js ставит 127.0.0.1
 *   ADMIN_PASSWORD     пароль администрации (обязательно смените)
 *   ANTHROPIC_API_KEY  ключ для ИИ-помощника (без него работает встроенный бот)
 *   AI_MODEL           модель, по умолчанию claude-haiku-5-5
 *   DATA_FILE          где хранить данные, по умолчанию ./data/db.json
 *   OLD_CACHE          где хранить копии картинок и документов прежнего сайта, по умолчанию ./data/old-cache
 */
'use strict';
// места для фотографий: совпадают со списком в админке (src.html → slots)
const PHOTO_SLOTS = ['hero', 'about', 'inst', 'contacts', 'gallery', 'p-home', 'p-visitors', 'p-fonds', 'p-region', 'p-about', 'p-news', 'p-contacts', 'branch'];   // 'branch' — фото зданий в карточках «Филиалов»; id вида br-<код здания>
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const net = require('node:net');
const zlib = require('node:zlib');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const AI_KEY = process.env.ANTHROPIC_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'claude-haiku-5-5';
const DATA_FILE = process.env.DATA_FILE || path.join(ROOT, 'data', 'db.json');
const MAX_BODY = 1024 * 1024;

if (!ADMIN_PASSWORD) console.warn('! ADMIN_PASSWORD не задан: вход в админку отключён. Задайте его в .env');

/* ---------- хранилище: один JSON-файл, запись через временный файл ---------- */
/* стартовые новости (перенесены с прежнего сайта); используются, только пока нет своей базы */
const SEED_NEWS = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'news-seed.json'), 'utf8')); } catch (e) { return []; } })();
let db = {entries:[], reviews:[], mod:{}, news:SEED_NEWS, settings:{}, questions:[], photos:[], users:[], items:[], journal:[], imports:[], stats:{}, poll:{votes:{}}, ratings:{}, catOverrides:{}, files:{}, notes:[], noteSeen:{}, brEdits:{}};
try {
  db = {...db, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))};
  for (const k of ['users', 'items', 'journal', 'imports']) if (!Array.isArray(db[k])) db[k] = [];   // imports — журнал партий импорта (перенос данных, откат)
  if (!db.stats || typeof db.stats !== 'object') db.stats = {};
  if (!db.catOverrides || typeof db.catOverrides !== 'object' || Array.isArray(db.catOverrides)) db.catOverrides = {};
  if (!db.files || typeof db.files !== 'object' || Array.isArray(db.files)) db.files = {};
  if (!Array.isArray(db.notes)) db.notes = [];
  if (!db.noteSeen || typeof db.noteSeen !== 'object' || Array.isArray(db.noteSeen)) db.noteSeen = {};
  if (!db.brEdits || typeof db.brEdits !== 'object' || Array.isArray(db.brEdits)) db.brEdits = {};
} catch (e) {
  fs.mkdirSync(path.dirname(DATA_FILE), {recursive:true});
}
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, DATA_FILE);
    backup();
  }, 150);
}
/* резервная копия раз в сутки: data/backups/db-ГГГГ-ММ-ДД.json, хранится 30 последних */
let lastBackup = '';
function backup() {
  const day = new Date().toISOString().slice(0, 10); if (day === lastBackup) return; lastBackup = day;
  try {
    const dir = path.join(path.dirname(DATA_FILE), 'backups'); fs.mkdirSync(dir, {recursive:true});
    const f = path.join(dir, 'db-' + day + '.json'); if (!fs.existsSync(f)) fs.copyFileSync(DATA_FILE, f);
    fs.readdirSync(dir).filter(x => /^db-\d{4}-\d\d-\d\d\.json$/.test(x)).sort().slice(0, -30).forEach(x => fs.unlinkSync(path.join(dir, x)));
  } catch (e) { console.warn('backup', e.message); }
  setTimeout(cleanOrphanFiles, 1000).unref();   // раз в сутки — убрать загруженные, но так и не прикреплённые файлы
}

/* ---------- помощники ---------- */
const id = p => p + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const langOk = l => ['ru', 'kz', 'en'].includes(l) ? l : 'ru';
/* Опрос посетителей, оценки страниц и публичная статистика: демонстрационный прототип (доп. к ТЗ, п. 2). Без имён и адресов;
   повторы ограничены только частотой запросов с одного адреса и запоминанием выбора в браузере, накрутку это не исключает. */
const POLL = {id:'p1',
  q:['Что вы чаще всего ищете на сайте архива?', 'Мұрағат сайтынан не жиі іздейсіз?', 'What do you look for most often on the archive website?'],
  opts:[['catalog', ['Документы в каталоге', 'Каталогтағы құжаттар', 'Documents in the catalogue']], ['cert', ['Архивную справку', 'Архив анықтамасы', 'An archival certificate']],
    ['expo', ['Выставки и фотографии', 'Көрмелер мен фотосуреттер', 'Exhibitions and photographs']], ['genea', ['Сведения о предках', 'Ата-баба туралы мәліметтер', 'Information about ancestors']],
    ['news', ['Новости и объявления', 'Жаңалықтар мен хабарландырулар', 'News and announcements']]]};
const pollOut = () => { const v = (db.poll = db.poll || {votes:{}}).votes; return {id:POLL.id, q:POLL.q, opts:POLL.opts.map(([k, t]) => ({id:k, t, n:v[k] || 0})), total:POLL.opts.reduce((a, [k]) => a + (v[k] || 0), 0)}; };
const rateKey = s => { s = String(s || '').replace(/^#/, '').split('?')[0]; return /^[\w\-./%]{1,80}$/.test(s) ? s : ''; };
const rateOut = k => { const r = (db.ratings || {})[k]; return {n:r ? r.n : 0, avg:r && r.n ? Math.round(r.s / r.n * 10) / 10 : 0}; };
function send(res, code, obj, headers) {
  const body = obj === undefined ? '' : JSON.stringify(obj);
  res.writeHead(code, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', ...headers});
  res.end(body);
}
function readBody(req, max) {
  max = max || MAX_BODY;
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > max) { reject(Object.assign(new Error('too large'), {code:413})); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch (e) { reject(Object.assign(new Error('bad json'), {code:400})); } });
    req.on('error', reject);
  });
}
// за туннелем Cloudflare настоящий адрес посетителя приходит в cf-connecting-ip
const ipOf = req => String(req.headers['cf-connecting-ip'] || '').trim() || (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';

/* ---------- ограничение частоты запросов ---------- */
const buckets = new Map();
function limited(req, key, max, windowMs) {
  const k = key + '|' + ipOf(req); const now = Date.now();
  const b = buckets.get(k) || {n:0, t:now};
  if (now - b.t > windowMs) { b.n = 0; b.t = now; }
  b.n++; buckets.set(k, b);
  return b.n > max;
}
setInterval(() => { const now = Date.now(); for (const [k, b] of buckets) if (now - b.t > 3600e3) buckets.delete(k); }, 600e3).unref();

/* ---------- сессии и роли администрации ---------- */
/* Роли по ТЗ: главный администратор, администратор сайта, редактор контента, сотрудник архива,
   администратор филиала, модератор, аналитик. Что кому можно — PERMS. */
const ROLES = ['chief', 'admin', 'editor', 'staff', 'branch', 'moderator', 'analyst'];
/* Стандартные права. Главный администратор может изменить их в «Пользователи → Права ролей» (ТЗ 6.1–6.2):
   таблица сохраняется в db.rolePerms. Главный администратор имеет все права всегда, а право users
   (создание учётных записей и назначение ролей) нельзя передать никому: иначе можно выдать себе роль chief. */
const DEFAULT_PERMS = {
  users:['chief'], journal:['chief', 'admin'], settings:['chief', 'admin'], news:['chief', 'admin', 'editor'], photos:['chief', 'admin', 'editor'],
  brphotos:['chief', 'admin', 'editor', 'branch'],   // фото зданий филиалов; администратор филиала — только своего
  brinfo:['chief', 'admin', 'branch'],               // контакты филиала (адрес, телефоны, почта, часы); администратор филиала — только своего
  mod:['chief', 'admin', 'moderator'], items:['chief', 'admin', 'editor', 'staff', 'branch', 'moderator'], publish:['chief', 'admin', 'moderator'],
  stats:['chief', 'admin', 'analyst'], questions:['chief', 'admin', 'moderator', 'analyst'], ocr:['chief', 'admin', 'editor', 'staff', 'branch']
};
const LOCKED_PERMS = ['users'];
let PERMS = DEFAULT_PERMS;
function applyPerms(saved) {
  const out = {};
  for (const k of Object.keys(DEFAULT_PERMS)) {
    const s = saved && Array.isArray(saved[k]) ? saved[k] : null;
    out[k] = LOCKED_PERMS.includes(k) || !s ? DEFAULT_PERMS[k].slice() : ROLES.filter(r => r === 'chief' || s.includes(r));
  }
  PERMS = out;
}
applyPerms(db.rolePerms);
const can = (sess, perm) => !!sess && (PERMS[perm] || []).includes(sess.user.role);
const permsOf = role => Object.keys(PERMS).filter(k => PERMS[k].includes(role));
const IDLE_MS = 60 * 60e3, ABS_MS = 12 * 3600e3;   // выход после часа бездействия и не позже чем через 12 часов
const sessions = new Map();
function isAdmin(req) {
  const m = /^Bearer\s+(\S+)$/.exec(req.headers.authorization || '');
  if (!m) return null;
  const s = sessions.get(m[1]); const now = Date.now();
  if (!s || s.exp < now || s.last + IDLE_MS < now) { sessions.delete(m[1]); return null; }
  s.last = now; return s;
}
setInterval(() => { const now = Date.now(); for (const [k, s] of sessions) if (s.exp < now || s.last + IDLE_MS < now) sessions.delete(k); }, 600e3).unref();
const hashPwd = (p, salt) => crypto.scryptSync(String(p), salt, 32).toString('hex');
function checkUser(login, password) {
  const u = (db.users || []).find(x => x.login === login && x.active !== false);
  if (!u || !u.salt) return null;
  const a = Buffer.from(hashPwd(password, u.salt), 'hex'), b = Buffer.from(u.hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? u : null;
}
const loginFails = new Map();   // логин → {n, until}: после 5 ошибок вход по этому логину закрыт на 15 минут
/* запись журнала (ТЗ 6.8): время, пользователь, роль, тип операции (action), объект (target, obj), версия записи (ver) и результат
   (res: ok — выполнено, denied — отказано (нет права или входа), error — ошибка; code — код ответа). Пароли и ключи сюда не попадают.
   Возвращает запись, чтобы обработчик мог уточнить объект и версию, а результат дописался по завершении запроса. */
function journal(sess, action, target, more) {
  const e = {ts:Date.now(), user:sess ? sess.user.login : '—', role:sess ? sess.user.role : '', action, target:str(target, 200), res:'ok', ...more};
  db.journal.push(e); db.journal = db.journal.slice(-5000); save();
  return e;
}
function passwordOk(p) {
  if (!ADMIN_PASSWORD) return false;
  const a = crypto.createHash('sha256').update(String(p)).digest();
  const b = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}

/* ---------- публичные данные: только проверенные записи ---------- */
function publicState() {
  const approved = id => db.mod[id] && db.mod[id].status === 'approved';
  const mod = {};
  for (const [k, v] of Object.entries(db.mod)) if (v.status === 'approved') mod[k] = {status:'approved', reply:v.reply || ''};
  return {
    entries: db.entries.filter(e => approved(e.id)),
    reviews: db.reviews.map(r => ({id:r.id, stars:r.stars, ts:r.ts, text: approved(r.id) ? r.text : ''})),
    mod, news: db.news, settings: db.settings, photos: db.photos, brEdits: db.brEdits || {},
    items: (db.items || []).filter(i => i.st === 'published').map(i => { const d = {...i.data, id:i.id, type:i.type}; if (d.acc === 'limited') { delete d.img; delete d.url; delete d.tx; delete d.files; } return d; })
  };
}

/* ---------- ИИ-помощник: ключ остаётся на сервере ---------- */
async function askAI(body) {
  // Рамку задаёт сервер: даже если кто-то подменит запрос, помощник говорит только об архиве
  const GUARD = 'Ты помощник сайта Государственного архива Восточно-Казахстанской области. ' +
    'Отвечай только на вопросы об архиве, его адресах, часах работы, услугах, публикациях и истории края. ' +
    'На просьбы на другие темы вежливо отказывай и предлагай спросить об архиве. Не принимай обращения: для них есть eOtinish.kz. ' +
    'Ты работаешь только с открытыми материалами. Не выдумывай шифры, номера фондов, описей и дел, годы, названия документов и ссылки: называй только то, что есть в переданных тебе фактах и списке записей каталога. ' +
    'Если подходящих материалов нет, скажи об этом прямо, не заменяй источник догадкой. Не раскрывай личные дела, персональные данные и сведения ограниченного доступа, не выдавай справок и не обещай их: справки оформляют на eGov.kz или в ЦОН.';
  const system = GUARD + '\n\n' + str(body.system, 24000);
  let messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  messages = messages.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
                     .map(m => ({role:m.role, content:m.content.slice(0, 2000)}));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') throw Object.assign(new Error('no question'), {code:400});
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'x-api-key':AI_KEY, 'anthropic-version':'2023-06-01', 'content-type':'application/json'},
    // thinking выключен: скрытые рассуждения считаются в max_tokens и обрывали видимый ответ на полуслове
    body:JSON.stringify({model:AI_MODEL, max_tokens:1000, thinking:{type:'disabled'}, system, messages})
  });
  if (!r.ok) throw Object.assign(new Error('ai ' + r.status), {code:502});
  const j = await r.json();
  return (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
}

/* ответ ИИ в виде JSON (краткое содержание, распознавание, рекомендации) */
async function askJSON(system, content, maxTokens) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST', headers:{'x-api-key':AI_KEY, 'anthropic-version':'2023-06-01', 'content-type':'application/json'},
    body:JSON.stringify({model:AI_MODEL, max_tokens:maxTokens || 900, thinking:{type:'disabled'}, system, messages:[{role:'user', content}]})
  });
  if (!r.ok) throw Object.assign(new Error('ai ' + r.status), {code:502});
  const j = await r.json();
  const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
  const m = /\{[\s\S]*\}/.exec(text);
  try { return JSON.parse(m ? m[0] : text); } catch (e) { return {summary:text.trim().slice(0, 1500)}; }
}
/* обязательные поля карточки каталога (ТЗ: проверка при импорте и сохранении) */
const KINDS = ['fond', 'inv', 'file', 'doc', 'photo', 'map', 'pub', 'av'];
const ARCHES = ['gavko', 'uka', 'ridder', 'zirian', 'zaisan', 'glubokoe', 'katon', 'kurchum', 'markakol', 'samar', 'tarbagatai', 'ulan', 'ulken', 'shemonaiha'];   // главное здание, здание в Усть-Каменогорске и 12 районных филиалов (коды как BR_KEYS в dev/tz.js)
function validateItem(type, d) {
  if (!d || typeof d !== 'object') return 'нет данных';
  const title = d.t && (d.t.ru || d.t.kk || d.t.en);
  if (!title || String(title).trim().length < 3) return 'нет названия';
  if (d.yt !== undefined && (!Array.isArray(d.yt) || d.yt.length > 20 || d.yt.some(v => !/^[\w-]{11}$/.test(String(v))))) return 'видео: нужны ссылки YouTube (до 20)';
  if (d.fd !== undefined && (!Array.isArray(d.fd) || d.fd.length > 30 || d.fd.some(v => !/^[\wа-яА-ЯёЁ\-]{1,12}$/.test(String(v))))) return 'фонды: номера через запятую (до 30)';
  if (type === 'memory') {   // «Архив памяти»: событие (год обязателен) или человек
    if (d.mt !== undefined && !['event', 'person', 'place'].includes(d.mt)) return 'неизвестный вид материала';
    if ((d.mt === undefined || d.mt === 'event') && !(Number.isInteger(+d.y) && +d.y >= 1000 && +d.y <= 2100)) return 'год события: 1000–2100';
    if (d.mt === 'place') {   // объект исторической карты (ТЗ 8.3): координаты в пределах Казахстана и соседних районов
      if (!(typeof d.lat === 'number' && d.lat >= 40 && d.lat <= 56 && typeof d.lon === 'number' && d.lon >= 46 && d.lon <= 96)) return 'координаты: широта 40–56, долгота 46–96 (через точку)';
      if (!['building', 'industry', 'heritage', 'place', 'event'].includes(d.hc)) return 'неизвестный вид объекта';
      if (d.y != null && d.y !== '' && !(Number.isInteger(+d.y) && +d.y >= 1000 && +d.y <= 2100)) return 'год: 1000–2100';
    }
    for (const k of ['b0', 'b1']) if (d[k] != null && d[k] !== '' && !(Number.isInteger(+d[k]) && +d[k] >= 1000 && +d[k] <= 2100)) return 'годы жизни: 1000–2100';
    if (d.img != null && d.img !== '' && !/^(https:\/\/|img\/|old\/|\/files\/[a-f0-9]{24}\/view$)/.test(String(d.img))) return 'недопустимая ссылка на фото';
    for (const [k, n] of [['rel', 30], ['gr', 10], ['pl', 30], ['top', 30]]) if (d[k] != null && (!Array.isArray(d[k]) || d[k].length > n || d[k].some(v => String(v).length > 120))) return 'слишком длинный список: ' + k;
  }
  if (type === 'expo' && d.files !== undefined) { const fe = cleanFileList(d.files); if (fe.error) return fe.error; d.files = fe.list; }   // видеофайлы выставки
  if (type !== 'catalog') return null;
  if (!KINDS.includes(d.k)) return 'неизвестный тип материала';
  if (!ARCHES.includes(d.a)) return 'не указан архив или филиал';
  if (['fond', 'inv', 'file', 'doc'].includes(d.k) && !/^\d{1,6}[а-яА-Яa-zA-Z\-]?$/.test(String(d.f || ''))) return 'нет номера фонда';
  if (['inv', 'file', 'doc'].includes(d.k) && !String(d.o || '').trim()) return 'нет номера описи';
  if (['file', 'doc'].includes(d.k) && !String(d.d || '').trim()) return 'нет номера дела';
  for (const y of ['y0', 'y1']) if (d[y] != null && d[y] !== '' && !(Number.isInteger(+d[y]) && +d[y] >= 1500 && +d[y] <= 2100)) return 'год вне диапазона 1500–2100';
  if (d.img && (!Array.isArray(d.img) || d.img.some(u => !/^(https:\/\/|img\/|old\/|data:image\/(jpeg|png|webp);base64,)/.test(String(u))))) return 'недопустимая ссылка на изображение';
  if (d.acc && !['open', 'declass', 'limited'].includes(d.acc)) return 'неизвестный статус доступа';
  if (d.files !== undefined) { const fe = cleanFileList(d.files); if (fe.error) return fe.error; d.files = fe.list; }
  return null;
}

/* ---------- перенос данных: ключи записей, родители, дубли ----------
   Иерархия каталога: фонд → опись → дело → документ. Ключ записи — архив, фонд, опись, дело; родитель ищем среди уже имеющихся
   записей (перенесённые со старого сайта и добавленные из админки) и среди строк того же файла. */
const hkey = {fond:d => `fond:${d.a}|${d.f}`, inv:d => `inv:${d.a}|${d.f}|${d.o}`, file:d => `file:${d.a}|${d.f}|${d.o}|${d.d}`};
const PARENT_OF = {inv:d => hkey.fond(d), file:d => hkey.inv(d), doc:d => hkey.file(d)};
const parentMissing = d => d.k === 'inv' ? `нет фонда ${d.f} в каталоге и в файле` : d.k === 'file' ? `нет описи ${d.o} фонда ${d.f} в каталоге и в файле` : `нет дела ${d.d} (фонд ${d.f}, опись ${d.o}) в каталоге и в файле`;
const rowTitle = d => str((d && d.t && (d.t.ru || d.t.kk)) || '', 80);
function catIndex() {
  const m = new Map();
  try { for (const r of catRaw().items) if (hkey[r.k]) m.set(hkey[r.k](r), r.id); } catch (e) {}
  for (const i of db.items) if (i.type === 'catalog' && i.st !== 'archived' && i.data && hkey[i.data.k]) m.set(hkey[i.data.k](i.data), i.id);
  return m;
}

/* ---------- цифровые копии: сканы (JPG, PNG, WebP, TIFF) и PDF (ТЗ 6.3, 7.7) ----------
   Файлы лежат на диске в data/files/<id>.<тип>, в базе только описание (db.files). Тип определяется по первым байтам,
   имя файла от пользователя на диск не попадает. Исходник (мастер-копия) хранится как есть; для показа на сайте
   браузер сотрудника делает облегчённую копию JPEG (<id>.view.jpg). Посетителю файл отдаётся, только если он прикреплён
   к опубликованной открытой записи; мастер-копии — только сотрудникам. */
const FILES_DIR = process.env.FILES_DIR || path.join(path.dirname(DATA_FILE), 'files');
const MB = 1024 * 1024;
const FILE_TYPES = {
  jpg:{mime:'image/jpeg', kind:'img', max:25 * MB}, png:{mime:'image/png', kind:'img', max:25 * MB}, webp:{mime:'image/webp', kind:'img', max:25 * MB},
  tif:{mime:'image/tiff', kind:'img', max:100 * MB}, pdf:{mime:'application/pdf', kind:'pdf', max:50 * MB},
  mp4:{mime:'video/mp4', kind:'video', max:100 * MB}, webm:{mime:'video/webm', kind:'video', max:100 * MB},   // видео выставок: без обработки, отдаётся кусками (Range), чтобы работала перемотка
  mp3:{mime:'audio/mpeg', kind:'audio', max:100 * MB}, m4a:{mime:'audio/mp4', kind:'audio', max:100 * MB}, ogg:{mime:'audio/ogg', kind:'audio', max:100 * MB}, wav:{mime:'audio/wav', kind:'audio', max:100 * MB}   // аудио выставок: так же
};
const VIEW_MAX = 4 * MB;
function sniffFile(b) {
  if (b.length < 12) return null;
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'jpg';
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) return 'png';
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  const h = b.toString('latin1', 0, 4); if (h === 'II*\0' || h === 'MM\0*') return 'tif';
  if (b.toString('latin1', 0, 5) === '%PDF-') return 'pdf';
  if (b.toString('latin1', 4, 8) === 'ftyp') return /^M4[AB] $/.test(b.toString('latin1', 8, 12)) ? 'm4a' : 'mp4';   // контейнер MP4/MOV: блок ftyp сразу после длины; бренд «M4A » — аудио
  if (b[0] === 0x1A && b[1] === 0x45 && b[2] === 0xDF && b[3] === 0xA3) return 'webm';   // EBML: WebM и Matroska
  if (b.toString('latin1', 0, 4) === 'OggS') return 'ogg';
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WAVE') return 'wav';
  if (b.toString('latin1', 0, 3) === 'ID3' || (b[0] === 0xFF && (b[1] & 0xE0) === 0xE0 && ((b[1] >> 3) & 3) !== 1 && ((b[1] >> 1) & 3) !== 0)) return 'mp3';   // метка ID3 или заголовок кадра MPEG (синхрослово 11 бит, версия и слой не «зарезервировано»)
  return null;
}
/* PDF с действиями (JavaScript, запуск программ, вложенные файлы, мультимедиа) не принимаем. Это проверка по открытому тексту
   файла, а не антивирус: внутри сжатых потоков объектов она такие действия не увидит. */
function pdfRisk(b) { const m = /\/(JavaScript|Launch|EmbeddedFile|RichMedia)\b/.exec(b.toString('latin1')); return m ? m[1] : null; }
/* Проверка загрузок. Это не полноценный антивирус, а два уровня:
   1) встроенная: тестовая сигнатура EICAR и исполняемый код Windows внутри файла (картинка или PDF с вшитой программой). Работает всегда, без установки.
   2) ClamAV: если задана переменная CLAMD=хост:порт (демон clamd), файл целиком проверяется по базе сигнатур. Если демон задан, но не отвечает, загрузка отклоняется (лучше отказать, чем пропустить непроверенное).
   Возвращает текст причины отказа или null. */
const EICAR = ['X5O!P%@AP[4\\PZX54(P^)7CC)7}$', 'EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'].join('');   // собираем из двух частей, чтобы сам исходник не принимали за вирус антивирусы
function builtinScan(b) {
  if (b.indexOf(EICAR) >= 0) return 'тестовый вирус EICAR';
  if (b.indexOf('This program cannot be run in DOS mode') >= 0 || b.indexOf('This program must be run under Win32') >= 0) return 'внутри файла исполняемая программа';
  return null;
}
function clamScan(b) {
  return new Promise((resolve, reject) => {
    const [host, port] = String(process.env.CLAMD).split(':'); let out = '';
    const sock = net.connect({host:host || '127.0.0.1', port:+port || 3310}); sock.setTimeout(30000);
    sock.on('connect', () => { sock.write('zINSTREAM\0'); for (let i = 0; i < b.length; i += 1 << 20) { const c = b.subarray(i, i + (1 << 20)), h = Buffer.alloc(4); h.writeUInt32BE(c.length); sock.write(h); sock.write(c); } sock.write(Buffer.alloc(4)); });
    sock.on('data', d => { out += d.toString('latin1'); });
    sock.on('end', () => { const m = /stream:\s*(.*?)\s*(FOUND|OK|ERROR)/.exec(out.replace(/\0/g, ' ')); if (!m) return reject(new Error('нет ответа ClamAV')); resolve(m[2] === 'FOUND' ? m[1] || 'угроза' : m[2] === 'OK' ? null : (() => { throw new Error('ошибка ClamAV'); })()); });
    sock.on('timeout', () => { sock.destroy(); reject(new Error('ClamAV не ответил')); });
    sock.on('error', reject);
  });
}
async function scanUpload(b) {
  const own = builtinScan(b); if (own) return own;
  if (process.env.CLAMD) { try { const r = await clamScan(b); if (r) return 'ClamAV: ' + r; } catch (e) { return 'unavailable'; } }
  return null;
}
const fileName = s => str(s, 120).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_') || 'file';
function readRaw(req, max) {
  return new Promise((resolve, reject) => {
    const len = Number(req.headers['content-length'] || 0);
    if (len > max) { req.resume(); return reject(Object.assign(new Error('too large'), {code:413})); }
    const chunks = []; let size = 0, done = false;
    req.on('data', c => { if (done) return; size += c.length; if (size > max) { done = true; req.resume(); reject(Object.assign(new Error('too large'), {code:413})); } else chunks.push(c); });
    req.on('end', () => { if (!done) { done = true; resolve(Buffer.concat(chunks)); } });
    req.on('error', e => { if (!done) { done = true; reject(e); } });
  });
}
/* список файлов записи: [{id, k:'img'|'pdf', n:имя}] — только существующие файлы */
function cleanFileList(list) {
  if (!Array.isArray(list) || list.length > 60) return {error:'слишком много файлов (до 60 на запись)'};
  const out = [];
  for (const f of list) {
    const id = f && String(f.id || ''); const meta = /^[a-f0-9]{24}$/.test(id) && db.files[id];
    if (!meta) return {error:'файл не найден: ' + str(id, 30)};
    if (!out.some(x => x.id === id)) out.push({id, k:meta.kind, n:fileName(f.n || meta.name), ...(meta.ext === 'tif' && !meta.view ? {v:0} : {})});   // v:0 — TIFF без копии для показа: на сайте не выводится
  }
  return {list:out};
}
/* где используются файлы: all — в любых записях (в том числе черновиках), pub — в опубликованных открытых */
function fileUse() {
  const all = new Set(), pub = new Set();
  const scan = (obj, isPub) => {
    if (!obj) return;
    const s = JSON.stringify(obj), re = /\/files\/([a-f0-9]{24})\b/g; let mm;
    while ((mm = re.exec(s))) { all.add(mm[1]); if (isPub) pub.add(mm[1]); }
    (Array.isArray(obj.files) ? obj.files : []).forEach(f => { if (f && f.id) { all.add(f.id); if (isPub) pub.add(f.id); } });
  };
  for (const i of db.items || []) scan(i.data, i.st === 'published' && (i.data || {}).acc !== 'limited');
  scan((db.settings || {}).org, true);   // файлы отчётов «Об архиве» открыты всем
  let raw = null; try { raw = new Map(catRaw().items.map(r => [r.id, r])); } catch (e) { raw = new Map(); }
  for (const [rid, o] of Object.entries(db.catOverrides || {})) { const acc = (o.patch && o.patch.acc) || (raw.get(rid) || {}).acc; scan(o.patch, !o.hidden && acc !== 'limited'); }
  return {all, pub};
}
function fileDel(id) {
  for (const f of [id + '.' + (db.files[id] || {}).ext, id + '.view.jpg']) { try { fs.unlinkSync(path.join(FILES_DIR, f)); } catch (e) {} }
  delete db.files[id];
}
function cleanOrphanFiles() {
  try {
    const used = fileUse().all, old = Date.now() - 3 * 86400e3; let n = 0;
    for (const f of Object.values(db.files)) if (!used.has(f.id) && f.at < old) { fileDel(f.id); n++; }
    if (n) { console.log('Удалено непривязанных файлов: ' + n); save(); }
  } catch (e) { console.warn('files', e.message); }
}
setTimeout(cleanOrphanFiles, 5000).unref();
function serveFile(req, res, url) {
  const mm = /^\/files\/([a-f0-9]{24})\/(view|master)$/.exec(url.pathname);
  const f = mm && db.files[mm[1]];
  if (!f) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
  const sess = isAdmin(req), staff = !!sess && (can(sess, 'items') || can(sess, 'publish'));
  if (!staff && (mm[2] === 'master' || !fileUse().pub.has(f.id))) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
  // для показа: облегчённая копия; у PDF и картинок без копии — сам файл; TIFF браузер не покажет
  let file = path.join(FILES_DIR, f.id + '.' + f.ext), mime = FILE_TYPES[f.ext].mime, tag = f.sha.slice(0, 20) + 'm';
  if (mm[2] === 'view') {
    if (f.view) { file = path.join(FILES_DIR, f.id + '.view.jpg'); mime = 'image/jpeg'; tag = f.view.sha.slice(0, 20) + 'v'; }
    else if (f.ext === 'tif') { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Нет копии для просмотра'); }
  }
  fs.stat(file, (err, st) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
    const etag = '"' + tag + '"';
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, {ETag:etag}); return res.end(); }
    const nm = mm[2] === 'view' && f.view ? f.name.replace(/\.[^.]*$/, '') + '.jpg' : f.name;
    // видео отдаём кусками (Range): без этого браузер не перематывает ролик, а Safari не воспроизводит его вовсе
    let start = 0, end = st.size - 1, status = 200;
    const media = f.kind === 'video' || f.kind === 'audio';
    const rg = media && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (rg && (rg[1] !== '' || rg[2] !== '')) {
      if (rg[1] === '') start = Math.max(0, st.size - Number(rg[2])); else { start = Number(rg[1]); if (rg[2] !== '') end = Math.min(end, Number(rg[2])); }
      if (start > end || start >= st.size) { res.writeHead(416, {'Content-Range':'bytes */' + st.size}); return res.end(); }
      status = 206;
    }
    const hd = {'Content-Type':mime, 'Content-Length':end - start + 1, ETag:etag, 'Cache-Control':staff ? 'private, no-store' : 'no-cache',
      'Content-Disposition':(mm[2] === 'master' ? 'attachment' : 'inline') + "; filename*=UTF-8''" + encodeURIComponent(nm)};
    if (media) hd['Accept-Ranges'] = 'bytes';
    if (status === 206) hd['Content-Range'] = `bytes ${start}-${end}/${st.size}`;
    res.writeHead(status, hd);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file, {start, end}).pipe(res);
  });
}

/* Настройки видят все посетители, поэтому новые поля проверяем: ссылки справки только http(s), тексты — только строки.
   (Разметка текстов справки экранируется при показе, ссылки внутри — только http(s) и #.) */
const GUIDE_KEYS = ['site', 'guide'];
/* ---------- уведомления о согласовании (ТЗ 6.7) ----------
   «на проверку» — всем, у кого есть право publish; решение редактора (доработка, одобрено, опубликовано, в архиве) — автору.
   Своё действие себе не показываем. Если в .env заданы TG_BOT_TOKEN и TG_CHAT_ID, сообщение «на проверку» уходит и в Telegram. */
const TG_TOKEN = process.env.TG_BOT_TOKEN || '', TG_CHAT = process.env.TG_CHAT_ID || '';
const ITEM_KIND = {catalog:'каталог', expo:'выставка', memory:'архив памяти'};
const itemTitle = it => { const tt = (it.data || {}).t || {}; return str(typeof tt === 'string' ? tt : (tt.ru || tt.kk || tt.kz || it.id), 120); };
function addNote(n) {
  db.notes.push({id:id('n'), at:Date.now(), ...n});
  if (db.notes.length > 1000) db.notes = db.notes.slice(-1000);
  if (TG_TOKEN && TG_CHAT && n.to === 'publish') {
    const text = n.kind === 'import' ? `Архив ВКО: ${n.n} записей каталога ждут проверки (импорт, ${n.by})` : `Архив ВКО: на проверку — «${n.title}» (${ITEM_KIND[n.type] || n.type}, ${n.by})`;
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({chat_id:TG_CHAT, text}), signal:AbortSignal.timeout(10000)})
      .then(r => { if (!r.ok) console.warn('telegram', r.status); }).catch(e => console.warn('telegram', e.message));
  }
}
function notifyStatus(it, by, note) {
  const base = {kind:it.st, item:it.id, type:it.type, title:itemTitle(it), by};
  if (it.st === 'review') addNote({...base, to:'publish'});
  else if (['rework', 'approved', 'published', 'archived'].includes(it.st) && it.by && it.by !== by) addNote({...base, to:it.by, note});
}
const notesFor = sess => db.notes.filter(n => n.by !== sess.user.login && (n.to === 'publish' ? can(sess, 'publish') : n.to === sess.user.login)).slice(-60);

const NAV_IDS = ['about', 'catalog', 'visitors', 'memory', 'expo', 'news', 'contacts'];   // пункты главного меню (index.html, #nav-list)
const langOn = l => l === 'ru' || ((db.settings || {}).langs || {})[l === 'kk' ? 'kz' : l] !== false;
const aiOn = () => !!AI_KEY && !(db.settings || {}).aiOff;   // ИИ для посетителей: ключ есть и не выключен в админке
function validateSettings(b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return 'Неверный формат настроек';
  if (b.refLinks != null) {
    if (!Array.isArray(b.refLinks) || b.refLinks.length > 40) return 'Ссылок справки может быть не больше 40';
    for (const l of b.refLinks) if (!l || typeof l.url !== 'string' || !/^https?:\/\/[^\s"'<>]{3,500}$/.test(l.url) || !l.t || typeof l.t !== 'object' || !String(l.t.ru || '').trim()) return 'Недопустимая ссылка: ' + str(l && l.url, 80);
  }
  if (b.seoKeywords != null && (typeof b.seoKeywords !== 'string' || b.seoKeywords.length > 500)) return 'Ключевые слова: строка до 500 знаков';
  /* структура сайта (ТЗ 6.2): порядок пунктов меню, показ, свои названия */
  if (b.nav != null) {
    if (!Array.isArray(b.nav) || b.nav.length > NAV_IDS.length) return 'Неверная структура меню';
    const seen = new Set();
    for (const n of b.nav) {
      if (!n || !NAV_IDS.includes(n.id) || seen.has(n.id)) return 'Неизвестный или повторный пункт меню'; seen.add(n.id);
      if (n.on != null && typeof n.on !== 'boolean') return 'Пункт меню: показ — да или нет';
      if (n.t != null && (typeof n.t !== 'object' || Object.keys(n.t).some(l => !['ru', 'kz', 'en'].includes(l) || typeof n.t[l] !== 'string' || n.t[l].length > 40))) return 'Название пункта меню: до 40 знаков, языки ru, kz, en';
    }
    if (!b.nav.some(n => n.on !== false)) return 'В меню должен остаться хотя бы один пункт';
  }
  /* языковые версии: русский есть всегда, казахский и английский можно выключить */
  if (b.langs != null && (typeof b.langs !== 'object' || Array.isArray(b.langs) || Object.keys(b.langs).some(l => !['kz', 'en'].includes(l) || typeof b.langs[l] !== 'boolean'))) return 'Языки: можно выключить только kz и en';
  /* интеграции: коды подтверждения Google Search Console и Яндекс.Вебмастера, выключатель ИИ для посетителей */
  if (b.verify != null) {
    if (typeof b.verify !== 'object' || Array.isArray(b.verify)) return 'Неверные коды подтверждения';
    for (const k of Object.keys(b.verify)) if (!['google', 'yandex'].includes(k) || !(b.verify[k] === '' || /^[A-Za-z0-9_-]{8,100}$/.test(String(b.verify[k])))) return 'Код подтверждения: латиница, цифры, «-» и «_», 8–100 знаков';
  }
  if (b.aiOff != null && typeof b.aiOff !== 'boolean') return 'Выключатель ИИ: да или нет';
  /* «Об архиве» (ТЗ 5.2): руководство, отделы, сотрудники, отчёты, документы. Ссылки — только https:// или загруженный файл */
  if (b.org != null) {
    if (typeof b.org !== 'object' || Array.isArray(b.org)) return 'Неверный формат раздела «Об архиве»';
    const LIM = {leaders:50, depts:100, staff:500, reports:200, docs:300};
    const okStr = v => v == null || (typeof v === 'string' && v.length <= 1000);
    const okL = o => o == null || (typeof o === 'object' && !Array.isArray(o) && Object.keys(o).every(l => ['ru', 'kz', 'en'].includes(l) && okStr(o[l])));
    for (const [k, list] of Object.entries(b.org)) {
      if (!LIM[k]) return 'Неизвестный блок «Об архиве»: ' + k;
      if (!Array.isArray(list) || list.length > LIM[k]) return 'Слишком много записей: ' + k;
      for (const x of list) {
        if (!x || typeof x !== 'object' || Array.isArray(x)) return 'Неверная запись: ' + k;
        for (const [f, v] of Object.entries(x)) {
          if (['n', 't', 'd'].includes(f) && v && typeof v === 'object') { if (!okL(v)) return 'Неверный текст: ' + k; }
          else if (f === 'y') { if (!(Number.isInteger(v) && v >= 1900 && v <= 2100)) return 'Год отчёта: 1900–2100'; }
          else if (f === 'url') { if (!/^(https:\/\/[^\s"'<>]{3,500}|\/files\/[a-f0-9]{24}\/view)$/.test(String(v))) return 'Ссылка: только https:// или загруженный файл'; }
          else if (f === 'e') { if (!/^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+$/.test(String(v))) return 'Неверный e-mail'; }
          else if (!['r', 'n', 'p', 'head', 't', 'd'].includes(f) || !okStr(v)) return 'Неизвестное поле: ' + k + '.' + f;
        }
      }
    }
  }
  if (b.guide != null) {
    if (typeof b.guide !== 'object' || Array.isArray(b.guide)) return 'Неверные тексты справки';
    for (const k of Object.keys(b.guide)) {
      if (!GUIDE_KEYS.includes(k)) return 'Неизвестный текст справки: ' + k;
      const o = b.guide[k]; if (!o || typeof o !== 'object') return 'Неверный текст справки: ' + k;
      for (const lg of Object.keys(o)) if (!['ru', 'kz', 'en'].includes(lg) || typeof o[lg] !== 'string' || o[lg].length > 20000) return 'Текст справки «' + k + '»: до 20 000 знаков, языки ru, kz, en';
    }
  }
  return null;
}

/* ---------- API ---------- */
async function api(req, res, url) {
  const p = url.pathname; const m = req.method;
  if (p === '/api/health' && m === 'GET') return send(res, 200, {ok:true, ai:aiOn(), aiKey:!!AI_KEY});
  if (p === '/api/public' && m === 'GET') return send(res, 200, publicState());

  if (p === '/api/guestbook' && m === 'POST') {
    if (limited(req, 'gb', 5, 600e3)) return send(res, 429, {error:'Слишком часто. Попробуйте позже.'});
    const b = await readBody(req);
    const name = str(b.name, 60), text = str(b.text, 1000);
    if (name.length < 2 || text.length < 5) return send(res, 400, {error:'Заполните имя и сообщение'});
    db.entries.push({id:id('g'), name, city:str(b.city, 60), text, lang:langOk(b.lang), ts:Date.now()});
    db.entries = db.entries.slice(-2000); save();
    return send(res, 201, {ok:true});
  }
  if (p === '/api/reviews' && m === 'POST') {
    if (limited(req, 'rv', 5, 600e3)) return send(res, 429, {error:'Слишком часто. Попробуйте позже.'});
    const b = await readBody(req);
    const stars = Math.round(Number(b.stars));
    if (!(stars >= 1 && stars <= 5)) return send(res, 400, {error:'Оценка от 1 до 5'});
    db.reviews.push({id:id('r'), stars, text:str(b.text, 600), lang:langOk(b.lang), ts:Date.now()});
    db.reviews = db.reviews.slice(-5000); save();
    return send(res, 201, {ok:true});
  }
  if (p === '/api/questions' && m === 'POST') {
    if (limited(req, 'q', 60, 600e3)) return send(res, 429, {});
    const b = await readBody(req);
    const q = str(b.q, 300); if (!q) return send(res, 400, {});
    db.questions.push({q, lang:langOk(b.lang), ts:Date.now()});
    db.questions = db.questions.slice(-2000); save();
    return send(res, 201, {ok:true});
  }
  if (p === '/api/assistant' && m === 'POST') {
    if (!aiOn()) return send(res, 503, {error:'ИИ не подключён'});
    if (limited(req, 'ai', 20, 600e3)) return send(res, 429, {error:'Слишком много вопросов подряд. Подождите немного.'});
    const text = await askAI(await readBody(req));
    return send(res, 200, {text});
  }
  if (p === '/api/login' && m === 'POST') {
    if (limited(req, 'login', 8, 600e3)) return send(res, 429, {error:'Слишком много попыток'});
    const b = await readBody(req);
    const login = str(b.login, 40).toLowerCase() || 'admin';
    const f = loginFails.get(login); if (f && f.until > Date.now()) return send(res, 429, {error:'Вход временно закрыт: много неверных попыток'});
    let user = checkUser(login, b.password);
    if (!user && login === 'admin' && passwordOk(b.password)) user = {id:'root', login:'admin', name:'Главный администратор', role:'chief'};
    if (!user) { const x = loginFails.get(login) || {n:0, until:0}; x.n++; if (x.n >= 5) { x.until = Date.now() + 15 * 60e3; x.n = 0; } loginFails.set(login, x);
      journal(null, 'вход', 'неверный логин или пароль', {user:login, res:'denied', code:401});   // сам пароль не записываем; число попыток и так ограничено
      return send(res, 401, {error:'Неверный логин или пароль'}); }
    loginFails.delete(login);
    const token = crypto.randomBytes(32).toString('hex'); const now = Date.now();
    const sess = {exp:now + ABS_MS, last:now, user:{id:user.id, login:user.login, name:user.name || user.login, role:user.role, branch:user.branch || ''}};
    sessions.set(token, sess); journal(sess, 'вход', '');
    return send(res, 200, {token, user:sess.user, perms:permsOf(user.role)});
  }
  /* обезличенная статистика: разделы, поиск, ничего не найдено — без адресов и имён */
  if (p === '/api/stat' && m === 'POST') {
    if (limited(req, 'stat', 300, 600e3)) return send(res, 429, {});
    const b = await readBody(req, 32 * 1024);
    const st = db.stats = db.stats || {};
    const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
    for (const e of (Array.isArray(b.e) ? b.e.slice(0, 40) : [])) {
      const k = str(e.k, 12), v = str(e.v, 120).toLowerCase(), l = langOk(e.l);
      inc(st.days = st.days || {}, new Date().toISOString().slice(0, 10)); inc(st.langs = st.langs || {}, l);
      if (k === 'view') inc(st.views = st.views || {}, v);
      else if (k === 'search') { inc(st, 'searches'); inc(st.top = st.top || {}, v); }
      else if (k === 'search0') { inc(st, 'searches'); inc(st.zero = st.zero || {}, v); }
      else if (k === 'card') inc(st.cards = st.cards || {}, v);
      else if (k === 'expo') inc(st.expo = st.expo || {}, v);
    }
    for (const key of ['top', 'zero']) { const o = st[key] || {}; const ks = Object.keys(o); if (ks.length > 600) ks.sort((a, z) => o[a] - o[z]).slice(0, ks.length - 500).forEach(x => delete o[x]); }
    save(); return send(res, 204);
  }
  /* опрос, оценки страниц, публичная статистика */
  if (p === '/api/poll' && m === 'GET') return send(res, 200, pollOut());
  if (p === '/api/poll' && m === 'POST') {
    if (limited(req, 'poll', 20, 3600e3)) return send(res, 429, {error:'Слишком часто. Попробуйте позже.'});
    const b = await readBody(req, 1024), o = POLL.opts.find(x => x[0] === b.opt);
    if (!o) return send(res, 400, {error:'Нет такого варианта'});
    const v = (db.poll = db.poll || {votes:{}}).votes; v[o[0]] = (v[o[0]] || 0) + 1; save(); return send(res, 200, pollOut());
  }
  if (p === '/api/rate' && m === 'GET') { const k = rateKey(url.searchParams.get('k')); return k ? send(res, 200, rateOut(k)) : send(res, 400, {}); }
  if (p === '/api/rate' && m === 'POST') {
    if (limited(req, 'rate', 30, 600e3)) return send(res, 429, {error:'Слишком часто. Попробуйте позже.'});
    const b = await readBody(req, 1024), k = rateKey(b.k), v = Math.round(+b.v);
    if (!k || !(v >= 1 && v <= 5)) return send(res, 400, {error:'Оценка от 1 до 5'});
    const R = db.ratings = db.ratings || {};
    if (!R[k] && Object.keys(R).length >= 3000) return send(res, 429, {error:'Слишком много оценённых страниц'});
    const r = R[k] = R[k] || {n:0, s:0}; r.n++; r.s += v; save(); return send(res, 200, rateOut(k));
  }
  if (p === '/api/public-stats' && m === 'GET') {   // только счётчики: без адресов, имён и текстов запросов
    const st = db.stats || {}, R = db.ratings || {}, sum = o => Object.values(o || {}).reduce((a, n) => a + n, 0);
    const rated = Object.entries(R).filter(([, r]) => r.n).map(([k, r]) => ({k, n:r.n, avg:Math.round(r.s / r.n * 10) / 10}));
    const rn = rated.reduce((a, r) => a + r.n, 0), rs = Object.values(R).reduce((a, r) => a + r.s, 0);
    return send(res, 200, {views:sum(st.views), searches:st.searches || 0, cards:sum(st.cards), expo:sum(st.expo), langs:st.langs || {}, days:Object.entries(st.days || {}).sort().slice(-14),
      topViews:Object.entries(st.views || {}).sort((a, z) => z[1] - a[1]).slice(0, 8), ratings:{n:rn, avg:rn ? Math.round(rs / rn * 10) / 10 : 0, top:rated.sort((a, z) => z.avg - a.avg || z.n - a.n).slice(0, 6)}, poll:pollOut()});
  }
  /* ИИ: краткое содержание материала (дата, имена) — ответ проверяется по первоисточнику */
  if (p === '/api/ai/summary' && m === 'POST') {
    if (!aiOn()) return send(res, 503, {error:'ИИ не подключён'});
    if (limited(req, 'aisum', 20, 600e3)) return send(res, 429, {error:'Слишком часто'});
    const b = await readBody(req, 64 * 1024);
    const out = await askJSON('Ты помогаешь посетителям сайта Государственного архива ВКО разобраться в архивном материале. Отвечай строго JSON без пояснений: {"summary": "2–3 предложения на языке ' + ({kz:'казахском', en:'английском'}[langOk(b.lang)] || 'русском') + '", "dates": ["ключевые даты из текста"], "names": ["имена людей и названия организаций из текста"]}. Бери только то, что есть в тексте, ничего не придумывай.',
      [{type:'text', text:'Название: ' + str(b.title, 300) + '\n\nТекст:\n' + str(b.text, 12000)}]);
    return send(res, 200, out);
  }

  /* ----- ниже только для администрации ----- */
  if (p.startsWith('/api/admin/')) {
    const sess = isAdmin(req);
    if (!sess) return send(res, 401, {error:'Нужно войти'});
    const deny = () => send(res, 403, {error:'Недостаточно прав'});
    if (p === '/api/admin/me' && m === 'GET') return send(res, 200, {user:sess.user, perms:permsOf(sess.user.role)});
    if (p === '/api/admin/notes/seen' && m === 'POST') { db.noteSeen[sess.user.login] = Date.now(); save(); return send(res, 200, {ok:true}); }
    if (p === '/api/admin/state' && m === 'GET') {
      const {users, journal: jr, stats, rolePerms, notes, noteSeen, ...rest} = db;
      const roleMatrix = can(sess, 'users') ? {roles:ROLES, perms:Object.keys(DEFAULT_PERMS), matrix:PERMS, defaults:DEFAULT_PERMS, locked:LOCKED_PERMS} : null;
      return send(res, 200, {...rest, imports:(db.imports || []).filter(x => sess.user.role !== 'branch' || x.by === sess.user.login).slice(-30), notes:notesFor(sess), noteSeen:noteSeen[sess.user.login] || 0, users:can(sess, 'users') ? users.map(({hash, salt, ...u}) => u) : [], journal:can(sess, 'journal') ? jr.slice(-500) : [], stats:can(sess, 'stats') ? stats : {}, roleMatrix, me:sess.user, perms:permsOf(sess.user.role)});
    }
    if (p === '/api/admin/logout' && m === 'POST') { const tk = /^Bearer\s+(\S+)$/.exec(req.headers.authorization || ''); if (tk) sessions.delete(tk[1]); journal(sess, 'выход', ''); return send(res, 200, {ok:true}); }
    /* цифровые копии: тело запроса — сам файл (не JSON), имя — в ?name=. Право items: те же сотрудники, что ведут каталог */
    if (p === '/api/admin/files' && m === 'POST') {
      if (!can(sess, 'items')) return deny();
      const buf = await readRaw(req, 100 * MB).catch(e => e);
      if (buf instanceof Error) return send(res, 413, {error:'Файл больше 100 МБ'});
      const ext = sniffFile(buf);
      if (!ext) return send(res, 415, {error:'Можно загрузить JPG, PNG, WebP, TIFF, PDF, MP4, WebM, MP3, M4A, OGG или WAV'});
      const FT = FILE_TYPES[ext];
      if (buf.length > FT.max) return send(res, 413, {error:`${ext.toUpperCase()}: не больше ${FT.max / MB} МБ`});
      { const bad = await scanUpload(buf); if (bad === 'unavailable') return send(res, 503, {error:'Проверка файла на вирусы сейчас недоступна. Попробуйте позже.'}); if (bad) return send(res, 422, {error:`Файл не принят: ${bad}.`}); }
      if (ext === 'pdf') { const risk = pdfRisk(buf); if (risk) return send(res, 422, {error:`PDF содержит активное содержимое (${risk}) и не принят. Сохраните его заново как обычный PDF.`}); }
      const fid = crypto.randomBytes(12).toString('hex');
      fs.mkdirSync(FILES_DIR, {recursive:true}); fs.writeFileSync(path.join(FILES_DIR, fid + '.' + ext), buf);
      const name = fileName(url.searchParams.get('name') || ('file.' + ext));
      db.files[fid] = {id:fid, name, ext, kind:FT.kind, size:buf.length, sha:crypto.createHash('sha256').update(buf).digest('hex'), by:sess.user.login, at:Date.now(), view:null};
      journal(sess, 'загрузка файла', `${name} (${ext.toUpperCase()}, ${Math.round(buf.length / 1024)} КБ)`); save();
      return send(res, 201, {id:fid, k:FT.kind, ext, n:name, s:buf.length});
    }
    {
      const vm = /^\/api\/admin\/files\/([a-f0-9]{24})\/view$/.exec(p), dm = /^\/api\/admin\/files\/([a-f0-9]{24})$/.exec(p);
      const f = (vm || dm) && db.files[(vm || dm)[1]];
      if ((vm && m === 'POST') || (dm && m === 'DELETE')) {
        if (!f) return send(res, 404, {error:'Файл не найден'});
        if (f.by !== sess.user.login && !can(sess, 'publish')) return deny();
      }
      if (vm && m === 'POST') {   // облегчённая копия для показа: JPEG, её делает браузер сотрудника
        if (f.kind !== 'img') return send(res, 400, {error:'Копия для просмотра нужна только изображениям'});
        const buf = await readRaw(req, VIEW_MAX).catch(e => e);
        if (buf instanceof Error) return send(res, 413, {error:'Копия для просмотра: не больше 4 МБ'});
        if (sniffFile(buf) !== 'jpg') return send(res, 415, {error:'Копия для просмотра должна быть JPEG'});
        fs.writeFileSync(path.join(FILES_DIR, f.id + '.view.jpg'), buf);
        const dim = k => Math.max(0, Math.min(30000, Math.round(+url.searchParams.get(k) || 0)));
        f.view = {size:buf.length, sha:crypto.createHash('sha256').update(buf).digest('hex'), w:dim('w'), h:dim('h')}; f.w = dim('ow') || f.w; f.h = dim('oh') || f.h;
        save(); return send(res, 200, {ok:true});
      }
      if (dm && m === 'DELETE') {
        if (fileUse().all.has(f.id)) return send(res, 409, {error:'Файл прикреплён к записи: сначала уберите его из записи'});
        fileDel(f.id); journal(sess, 'удаление файла', f.name); save(); return send(res, 200, {ok:true});
      }
    }
    const b = m === 'GET' ? {} : await readBody(req, p === '/api/admin/ocr' ? 8 * 1024 * 1024 : p === '/api/admin/items/bulk' ? 4 * 1024 * 1024 : MAX_BODY);
    // журнал пишем до проверки прав: отказ — тоже действие; результат допишется, когда запрос завершится (пробный импорт не журналируем)
    if (m !== 'GET' && !['/api/admin/ocr', '/api/admin/insights', '/api/admin/perms'].includes(p) && !(p === '/api/admin/items/bulk' && b.dry === true)) {
      const jr = req.jr = journal(sess, {POST:'изменение', PUT:'сохранение', DELETE:'удаление'}[m] || m, p.replace('/api/admin/', '') + (b.id ? ' ' + b.id : b.title && b.title.ru ? ' ' + b.title.ru : b.type ? ' ' + b.type : ''), {res:'pending'});
      res.on('finish', () => { jr.code = res.statusCode; jr.res = res.statusCode < 300 ? 'ok' : (res.statusCode === 401 || res.statusCode === 403) ? 'denied' : 'error'; save(); });
    }
    const R = {'/api/admin/mod':'mod', '/api/admin/item':'mod', '/api/admin/news':'news', '/api/admin/settings':'settings', '/api/admin/users':'users', '/api/admin/perms':'users', '/api/admin/catalog':'publish', '/api/admin/stats':'stats', '/api/admin/insights':'stats', '/api/admin/ocr':'ocr', '/api/admin/items':'items', '/api/admin/items/bulk':'items', '/api/admin/imports/rollback':'items', '/api/admin/branch':'brinfo'}[p];
    if (R && !can(sess, R)) return deny();
    if (p === '/api/admin/photos' && !can(sess, 'photos') && !can(sess, 'brphotos')) return deny();   // какое именно право нужно (фото страниц или фото зданий) — ниже, по слоту
    /* материалы с проверкой: каталог, выставки, архив памяти. Статусы по ТЗ */
    if (p === '/api/admin/items' && m === 'PUT') {
      const ST = ['draft', 'review', 'rework', 'approved', 'published', 'archived'];
      const type = ['catalog', 'expo', 'memory'].includes(b.type) ? b.type : 'catalog';
      const data = b.data && typeof b.data === 'object' ? b.data : {};
      if (req.jr) Object.assign(req.jr, {action:'сохранение материала', target:type + ' ' + (b.id || itemTitle({data, id:'новый'})), obj:b.id ? String(b.id) : ''});   // уточнится после успеха; при отказе останется как есть
      if (JSON.stringify(data).length > 200000) return send(res, 413, {error:'Слишком большой материал'});
      const err = validateItem(type, data); if (err) return send(res, 400, {error:err});
      if (sess.user.role === 'branch' && type === 'catalog' && data.a !== sess.user.branch) return send(res, 403, {error:'Администратор филиала добавляет материалы только своего филиала'});
      let it = b.id ? db.items.find(x => x.id === b.id) : null;
      let st = ST.includes(b.st) ? b.st : (it ? it.st : 'draft');
      if (['approved', 'published', 'archived', 'rework'].includes(st) && !can(sess, 'publish') && (!it || it.st !== st)) return send(res, 403, {error:'Опубликовать или вернуть на доработку может модератор или администратор'});
      const isNew = !it;
      if (!it) { it = {id:id(type === 'catalog' ? 'c' : type === 'expo' ? 'x' : 'm'), type, created:Date.now(), by:sess.user.login, hist:[]}; db.items.push(it); }
      const changed = it.st !== st;
      /* версии содержимого: номер растёт, когда меняются сами данные (не статус), и запоминается, какие поля менялись и кем; хранятся последние 30 */
      const old = it.data || {}, diff = isNew ? [] : Object.keys({...old, ...data}).filter(k => JSON.stringify(old[k]) !== JSON.stringify(data[k]));
      if (isNew) it.ver = 1; else if (!it.ver) it.ver = 1;   // записи, созданные до введения версий, считаются версией 1
      if (isNew || diff.length) { if (!isNew) it.ver++; it.vers = (it.vers || []).concat({v:it.ver, at:Date.now(), by:sess.user.login, st, changed:isNew ? ['создание'] : diff.slice(0, 20)}).slice(-30); }
      if (changed) it.hist.push({st, by:sess.user.login, at:Date.now(), note:str(b.note, 500), ver:it.ver});
      Object.assign(it, {data, st, at:Date.now(), editor:sess.user.login});
      if (changed) notifyStatus(it, sess.user.login, str(b.note, 500));
      if (req.jr) Object.assign(req.jr, {action:(isNew ? 'создание' : diff.length ? 'изменение' : 'смена статуса') + (changed ? ' → ' + st : ''), target:type + ' ' + itemTitle(it), obj:it.id, ver:it.ver});
      save(); return send(res, 200, {ok:true, id:it.id, ver:it.ver});
    }
    if (p === '/api/admin/items' && m === 'DELETE') {
      const it = db.items.find(x => x.id === b.id); if (!it) return send(res, 404, {});
      if (req.jr) Object.assign(req.jr, {action:'удаление', target:it.type + ' ' + itemTitle(it), obj:it.id, ver:it.ver});
      if (!can(sess, 'publish') && !(it.by === sess.user.login && it.st === 'draft')) return deny();
      db.items = db.items.filter(x => x.id !== b.id); save(); return send(res, 200, {ok:true});
    }
    /* перенос данных (дополнение к ТЗ, 3.5): проверка строк, связи (фонд → опись → дело → документ), дубли, сверка количества, журнал партий и откат.
       Пробный запуск (dry) ничего не сохраняет. Партия хранится в db.imports, её записи помечены полем batch — по нему перенос откатывается. */
    if (p === '/api/admin/items/bulk' && m === 'POST') {
      const all = Array.isArray(b.rows) ? b.rows : [], rows = all.slice(0, 5000), dry = b.dry === true;
      const errors = [], warns = [], good = [], exist = catIndex(), now = Date.now(), batchId = id('i');
      rows.forEach((data, i) => {
        const err = validateItem('catalog', data); if (err) { errors.push({row:i + 2, error:err, title:rowTitle(data)}); return; }
        if (sess.user.role === 'branch' && data.a !== sess.user.branch) { errors.push({row:i + 2, error:'чужой филиал', title:rowTitle(data)}); return; }
        good.push({i, data, nid:dry ? '' : id('c')});
      });
      const inBatch = new Map(); for (const g of good) if (hkey[g.data.k]) inBatch.set(hkey[g.data.k](g.data), g.nid || 'в этом файле');
      for (const g of good) {   // дубли и связи: предупреждаем, но не блокируем (решает проверяющий)
        const d = g.data, own = hkey[d.k] && hkey[d.k](d), row = g.i + 2;
        if (own && exist.has(own)) warns.push({row, text:'уже есть в каталоге: ' + exist.get(own), title:rowTitle(d)});
        const pk = PARENT_OF[d.k] && PARENT_OF[d.k](d);
        if (pk) { const pid = exist.get(pk) || inBatch.get(pk); if (pid) { if (!dry && !d.par && pid !== 'в этом файле') d.par = pid; } else warns.push({row, text:parentMissing(d), title:rowTitle(d)}); }
      }
      const fileRows = Number(b.fileRows) || all.length;   // строк с данными в самом файле (считает браузер), для сверки с тем, что дошло до сервера и что обработано
      const balanced = fileRows === all.length && all.length === rows.length && good.length + errors.length === rows.length;
      const info = {ok:good.length, errors:errors.slice(0, 200), warnings:warns.slice(0, 200), total:rows.length, received:all.length, fileRows, balanced};
      if (dry) return send(res, 200, {...info, dry:true});
      for (const g of good) db.items.push({id:g.nid, type:'catalog', data:g.data, st:'review', created:now, at:now, by:sess.user.login, batch:batchId, ver:1, vers:[{v:1, at:now, by:sess.user.login, st:'review', changed:['импорт']}], hist:[{st:'review', by:sess.user.login, at:now, note:'импорт CSV', ver:1}]});
      db.imports.push({id:batchId, at:now, by:sess.user.login, file:str(b.file, 120), total:rows.length, received:all.length, fileRows, ok:good.length, errorCount:errors.length, warnCount:warns.length, errors:info.errors, warnings:info.warnings, balanced, rolledBack:null});
      db.imports = db.imports.slice(-100);
      if (req.jr) Object.assign(req.jr, {action:'импорт', target:`каталог: загружено ${good.length}, с ошибками ${errors.length}, замечаний ${warns.length}`, obj:batchId});
      if (good.length) addNote({kind:'import', n:good.length, by:sess.user.login, to:'publish'});
      save(); return send(res, 200, {...info, batch:batchId});
    }
    /* откат переноса: удаляет записи партии. Модератор и администратор — любую; автор — свою, пока в ней нет опубликованных записей */
    if (p === '/api/admin/imports/rollback' && m === 'POST') {
      const bt = db.imports.find(x => x.id === b.id);
      if (!bt) return send(res, 404, {error:'Перенос не найден'});
      if (bt.rolledBack) return send(res, 409, {error:'Этот перенос уже откатан'});
      const its = db.items.filter(i => i.batch === bt.id), pub = its.filter(i => i.st === 'published').length;
      if (!can(sess, 'publish') && !(bt.by === sess.user.login && its.every(i => ['draft', 'review', 'rework'].includes(i.st)))) return deny();
      db.items = db.items.filter(i => i.batch !== bt.id);
      bt.rolledBack = {at:Date.now(), by:sess.user.login, removed:its.length, published:pub};
      if (req.jr) Object.assign(req.jr, {action:'откат переноса', target:`каталог: ${bt.file || bt.id}, удалено ${its.length}`, obj:bt.id});
      save(); return send(res, 200, {ok:true, removed:its.length, published:pub});
    }
    /* пользователи и роли */
    if (p === '/api/admin/users' && m === 'PUT') {
      const login = str(b.login, 40).toLowerCase();
      if (req.jr) Object.assign(req.jr, {action:b.id ? 'пользователь: изменение' : 'пользователь: создание', target:'users ' + login, obj:login});   // пароль в журнал не попадает
      if (!/^[a-z0-9._\-]{3,40}$/.test(login) || login === 'admin') return send(res, 400, {error:'Логин: латиница, цифры, точка, дефис; 3–40 символов; не «admin»'});
      if (!ROLES.includes(b.role)) return send(res, 400, {error:'Неизвестная роль'});
      let u = b.id ? db.users.find(x => x.id === b.id) : null;
      if (!u && db.users.some(x => x.login === login)) return send(res, 400, {error:'Такой логин уже есть'});
      if (!u) { if (String(b.password || '').length < 10) return send(res, 400, {error:'Пароль не короче 10 символов'}); u = {id:id('u'), created:Date.now()}; db.users.push(u); }
      Object.assign(u, {login, name:str(b.name, 80), role:b.role, branch:b.role === 'branch' ? str(b.branch, 20) : '', active:b.active !== false});
      if (b.password) { if (String(b.password).length < 10) return send(res, 400, {error:'Пароль не короче 10 символов'}); u.salt = crypto.randomBytes(16).toString('hex'); u.hash = hashPwd(b.password, u.salt); for (const [k, s2] of sessions) if (s2.user.id === u.id) sessions.delete(k); }
      save(); return send(res, 200, {ok:true, id:u.id});
    }
    if (p === '/api/admin/users' && m === 'DELETE') { const du = db.users.find(x => x.id === b.id); if (req.jr) Object.assign(req.jr, {action:'пользователь: удаление', target:'users ' + (du ? du.login : b.id), obj:du ? du.login : String(b.id || '')}); db.users =db.users.filter(x => x.id !== b.id); for (const [k, s2] of sessions) if (s2.user.id === b.id) sessions.delete(k); save(); return send(res, 200, {ok:true}); }
    /* перенесённые записи каталога: найти, исправить, скрыть, вернуть исходное (ТЗ 6.3). Нужно право publish: это меняет опубликованное */
    if (p === '/api/admin/catalog' && m === 'GET') {
      const raw = catRaw(), q = nz(url.searchParams.get('q') || '').trim();
      const toks = q ? q.split(/\s+/) : [];
      const list = (toks.length ? raw.items.filter(r => { const h = nz([r.id, r.c, r.au, r.t && r.t.ru, r.t && r.t.kk].join(' ')); return toks.every(w => h.includes(w)); }) : raw.items.filter(r => db.catOverrides[r.id])).slice(0, toks.length ? 40 : 200);
      return send(res, 200, {total:raw.items.length, items:list.map(r => { const o = db.catOverrides[r.id] || {}; return {id:r.id, k:r.k, c:r.c, a:r.a, raw:CAT_PICK(r), patch:o.patch || {}, hidden:!!o.hidden}; })});
    }
    if (p === '/api/admin/catalog' && m === 'PUT') {
      const rid = str(b.id, 120), raw = catRaw().items.find(r => r.id === rid);
      if (!raw) return send(res, 404, {error:'Запись не найдена'});
      let next = b.reset ? {} : {...(db.catOverrides[rid] || {})};
      if (b.hidden !== undefined) { if (b.hidden) next.hidden = true; else delete next.hidden; }
      if (b.patch !== undefined) { const r2 = catCleanPatch(b.patch, raw); if (r2.error) return send(res, 400, {error:r2.error}); if (Object.keys(r2.patch).length) next.patch = r2.patch; else delete next.patch; }
      if (!next.hidden && !Object.keys(next.patch || {}).length) delete db.catOverrides[rid];
      else db.catOverrides[rid] = {...next, by:sess.user.login, at:Date.now()};
      catVer++; save();
      const o = db.catOverrides[rid] || {};
      return send(res, 200, {ok:true, hidden:!!o.hidden, edited:!!Object.keys(o.patch || {}).length});
    }
    /* права ролей (ТЗ 6.1–6.2): таблица «право × роль». Только главный администратор (право users не передаётся).
       Главный администратор остаётся во всех строках, строка users не меняется. Права действуют сразу, в том числе в открытых сессиях. */
    if (p === '/api/admin/perms' && m === 'PUT') {
      const before = PERMS;
      if (b.reset) { delete db.rolePerms; applyPerms(null); }
      else {
        if (!b.matrix || typeof b.matrix !== 'object' || Array.isArray(b.matrix)) return send(res, 400, {error:'Нет таблицы прав'});
        const saved = {};
        for (const k of Object.keys(DEFAULT_PERMS)) {
          if (LOCKED_PERMS.includes(k)) continue;
          if (!Array.isArray(b.matrix[k])) return send(res, 400, {error:'Нет строки права «' + k + '»'});
          saved[k] = b.matrix[k].map(String);
        }
        applyPerms(saved); db.rolePerms = PERMS;
      }
      const diff = [];
      for (const k of Object.keys(PERMS)) {
        const add = PERMS[k].filter(r => !before[k].includes(r)), del = before[k].filter(r => !PERMS[k].includes(r));
        if (add.length || del.length) diff.push(k + ': ' + [...add.map(r => '+' + r), ...del.map(r => '−' + r)].join(' '));
      }
      journal(sess, b.reset ? 'права ролей: сброс к стандартным' : 'права ролей', diff.join('; ') || 'без изменений');
      save(); return send(res, 200, {ok:true, matrix:PERMS});
    }
    /* аналитика качества сайта и рекомендации ИИ (только обезличенные цифры) */
    if (p === '/api/admin/stats' && m === 'GET') return send(res, 200, db.stats || {});
    if (p === '/api/admin/insights' && m === 'POST') {
      if (!AI_KEY) return send(res, 503, {error:'ИИ не подключён'});
      const st = db.stats || {}; const topN = (o, n) => Object.entries(o || {}).sort((a, z) => z[1] - a[1]).slice(0, n);
      const out = await askJSON('Ты аналитик сайта Государственного архива ВКО. По обезличенной статистике дай 3–6 конкретных рекомендаций по улучшению навигации, каталога и переводов. Ответ строго JSON: {"tips": ["…"]} на русском.',
        [{type:'text', text:JSON.stringify({views:topN(st.views, 15), searches:st.searches || 0, top:topN(st.top, 25), zero:topN(st.zero, 25), cards:st.cards, langs:st.langs})}]);
      return send(res, 200, out);
    }
    /* ИИ: распознавание текста и метаданных со скана; сотрудник проверяет и только потом сохраняет */
    if (p === '/api/admin/ocr' && m === 'POST') {
      if (!AI_KEY) return send(res, 503, {error:'ИИ не подключён: добавьте ANTHROPIC_API_KEY в .env'});
      const mm = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(String(b.image || ''));
      if (!mm || mm[2].length > 7 * 1024 * 1024) return send(res, 400, {error:'Нужен скан JPG, PNG или WebP до 5 МБ'});
      const out = await askJSON('Ты помогаешь сотруднику архива описать скан документа. Распознай текст и предложи метаданные. Ответ строго JSON: {"text": "распознанный текст", "title": "краткое название документа", "date": "дата как в документе", "y0": год или null, "y1": год или null, "type": "doc|photo|map|pub", "author": "автор или организация", "places": ["населённые пункты"], "names": ["имена"], "keywords": ["ключевые слова"], "lang": "ru|kk|other", "notes": "что разобрать не удалось"}. Не придумывай: если чего-то нет в документе, оставь пустым.',
        [{type:'image', source:{type:'base64', media_type:mm[1], data:mm[2]}}, {type:'text', text:'Распознай этот архивный документ.'}], 2000);
      return send(res, 200, out);
    }
    if (p === '/api/admin/mod' && m === 'POST') {
      const key = str(b.id, 80); if (!key) return send(res, 400, {});
      db.mod[key] = {status:['approved', 'hidden', 'pending'].includes(b.status) ? b.status : 'pending', reply:str(b.reply, 1000), at:Date.now()};
      save(); return send(res, 200, {ok:true});
    }
    if (p === '/api/admin/item' && m === 'DELETE') {
      const list = b.kind === 'gb' ? 'entries' : 'reviews';
      db[list] = db[list].filter(x => x.id !== b.id); delete db.mod[b.id];
      save(); return send(res, 200, {ok:true});
    }
    if (p === '/api/admin/news' && m === 'PUT') {
      const n = {id:str(b.id, 60) || id('n'), date:str(b.date, 10), title:b.title || {}, text:b.text || {}};
      const img = String(b.img || ''); if (/^data:image\/(jpeg|png|webp);base64,/.test(img) && img.length <= 600000 || /^(img|old)\/[\w\-./%]+$/.test(img)) n.img = img;
      if (['expo', 'events', 'branches', 'fonds', 'awards'].includes(b.cat)) n.cat = b.cat;
      if (/^[\w-]{11}$/.test(String(b.yt || ''))) n.yt = b.yt;
      db.news = db.news.filter(x => x.id !== n.id); db.news.push(n);
      save(); return send(res, 200, {ok:true});
    }
    if (p === '/api/admin/news' && m === 'DELETE') { db.news = db.news.filter(x => x.id !== b.id); save(); return send(res, 200, {ok:true}); }
    if (p === '/api/admin/settings' && m === 'PUT') {
      if (JSON.stringify(b).length > 300000) return send(res, 413, {});
      const bad = validateSettings(b); if (bad) return send(res, 400, {error:bad});
      /* администратор сайта изменил контакты филиала в полном списке «Филиалы» — правка администратора филиала для него снимается,
         иначе она бы молча перекрывала новые данные; пока он эти поля не менял, правка филиала остаётся */
      { const old = (db.settings || {}).branchList, nw = b.branchList;
        if (Array.isArray(old) && Array.isArray(nw)) for (const id of Object.keys(db.brEdits)) {
          const ob = old.find(x => x && x.id === id), nb = nw.find(x => x && x.id === id);
          if (ob && (!nb || ['a', 'p', 'e', 'h'].some(k => JSON.stringify(ob[k] == null ? '' : ob[k]) !== JSON.stringify(nb[k] == null ? '' : nb[k])))) delete db.brEdits[id];
        } }
      db.settings = b; save(); return send(res, 200, {ok:true});
    }
    /* контакты филиала (ТЗ, «Работа администратора филиала»): адрес, телефоны, почта, часы. Администратор филиала — только своего;
       главное здание (gavko) правится в «Настройках». Правка хранится отдельно (db.brEdits) и накладывается на данные сайта */
    if (p === '/api/admin/branch' && m === 'PUT') {
      const bid = str(b.id, 20);
      if (!ARCHES.includes(bid)) return send(res, 400, {error:'Неизвестный филиал'});
      if (bid === 'gavko') return send(res, 400, {error:'Контакты главного здания меняет администратор сайта во вкладке «Настройки»'});
      if (sess.user.role === 'branch' && bid !== sess.user.branch) return send(res, 403, {error:'Администратор филиала правит контакты только своего филиала'});
      if (b.reset === true) { delete db.brEdits[bid]; save(); return send(res, 200, {ok:true}); }
      const a = str(b.a, 200), h = str(b.h, 120), e = str(b.e, 80);
      const ph = (Array.isArray(b.p) ? b.p : String(b.p || '').split(',')).map(x => str(x, 40)).filter(Boolean).slice(0, 5);
      if (!a) return send(res, 400, {error:'Укажите адрес'});
      if (e && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(e)) return send(res, 400, {error:'Проверьте адрес почты'});
      if (ph.some(x => !/^[\d+()\s\-–,.]{5,40}$/.test(x))) return send(res, 400, {error:'Телефон: цифры, пробелы, + ( ) -'});
      db.brEdits[bid] = {a, p:ph, e, h, at:Date.now(), by:sess.user.login};
      save(); return send(res, 200, {ok:true});
    }
    /* фото: страницы сайта и галерея — право photos; здания филиалов (slot 'branch', id br-<код>) — право brphotos,
       а администратор филиала может менять только фото своего филиала */
    if (p === '/api/admin/photos' && m === 'POST') {
      const slot = PHOTO_SLOTS.includes(b.slot) ? b.slot : 'gallery';
      const pid = str(b.id, 60) || id('ph');
      if (slot === 'branch') {
        if (!can(sess, 'brphotos')) return deny();
        if (!/^br-[\w-]{1,40}$/.test(pid)) return send(res, 400, {error:'Недопустимый код здания'});
        if (sess.user.role === 'branch' && pid !== 'br-' + sess.user.branch) return send(res, 403, {error:'Администратор филиала меняет фото только своего филиала'});
        if (!db.photos.some(x => x.id === pid) && db.photos.filter(x => x.slot === 'branch').length >= 60) return send(res, 400, {error:'Слишком много фото зданий'});
      } else {
        if (!can(sess, 'photos')) return deny();
        if (pid.startsWith('br-')) return send(res, 400, {error:'Код «br-…» зарезервирован для фото зданий'});
      }
      const src = String(b.src || '');
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(src) || src.length > (slot === 'branch' ? 200000 : 600000)) return send(res, 400, {error:slot === 'branch' ? 'Фото здания: до 150 КБ после сжатия' : 'Нужна картинка до 450 КБ'});
      const cap = {}; for (const k of ['ru', 'kz', 'en']) if (b.cap && typeof b.cap[k] === 'string') cap[k] = b.cap[k].slice(0, 200);
      const ph = {id:pid, src, slot, cap, ts:Date.now()};
      db.photos = db.photos.filter(x => x.id !== ph.id); db.photos.push(ph);
      save(); return send(res, 200, {ok:true});
    }
    if (p === '/api/admin/photos' && m === 'DELETE') {
      const ph = db.photos.find(x => x.id === b.id); if (!ph) return send(res, 200, {ok:true});
      if (ph.slot === 'branch') { if (!can(sess, 'brphotos') || (sess.user.role === 'branch' && ph.id !== 'br-' + sess.user.branch)) return deny(); }
      else if (!can(sess, 'photos')) return deny();
      db.photos = db.photos.filter(x => x.id !== b.id); save(); return send(res, 200, {ok:true});
    }
  }
  return send(res, 404, {error:'Не найдено'});
}


/* ---------- картинки и документы прежнего сайта ----------
   Тексты страниц перенесены (pages/), а их фото и файлы берём с e-arhiv.vko.gov.kz по запросу:
   только картинки и документы, только с этого адреса, без переадресаций; копия остаётся в OLD_CACHE,
   и в следующий раз файл отдаётся с диска, даже если прежний сайт недоступен. */
const OLD_ORIGIN = 'http://e-arhiv.vko.gov.kz';
const OLD_CACHE = process.env.OLD_CACHE || path.join(ROOT, 'data', 'old-cache');
const OLD_TYPES = {'.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.gif':'image/gif', '.bmp':'image/bmp', '.webp':'image/webp',
  '.pdf':'application/pdf', '.doc':'application/msword', '.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls':'application/vnd.ms-excel', '.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xlsb':'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  '.ppt':'application/vnd.ms-powerpoint', '.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.rtf':'application/rtf', '.txt':'text/plain; charset=utf-8', '.zip':'application/zip', '.rar':'application/vnd.rar', '.mp4':'video/mp4'};
const OLD_MAX = 60 * 1024 * 1024;
const oldMiss = new Map(), oldBusy = new Map();
let oldActive = 0; const oldQueue = [];
const oldSlot = () => new Promise(r => { if (oldActive < 4) { oldActive++; r(); } else oldQueue.push(r); });
const oldFree = () => { const n = oldQueue.shift(); if (n) n(); else oldActive--; };
function notFound(res) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Не найдено'); }
async function oldDownload(upstream, file, ext, onlyImage) {
  await oldSlot();
  try {
    const r = await fetch(upstream, {redirect:'manual', signal:AbortSignal.timeout(30000), headers:{'User-Agent':'arhiv-vko-site'}});
    if (r.status !== 200) throw new Error('status ' + r.status);
    const len = Number(r.headers.get('content-length') || 0);
    if (len > OLD_MAX) throw new Error('too large');
    let type = (r.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (/^text\/html/.test(type)) throw new Error('html instead of file');
    const buf = Buffer.from(await r.arrayBuffer());
    if (!buf.length || buf.length > OLD_MAX) throw new Error('bad size');
    let name = '';
    const cd = r.headers.get('content-disposition') || '';
    const m = /filename\*=UTF-8''([^;]+)/i.exec(cd) || /filename="?([^";]+)"?/i.exec(cd);
    if (m) { try { name = decodeURIComponent(m[1]); } catch (e) { name = m[1]; } }
    if (!ext && name) ext = path.extname(name).toLowerCase();
    if (onlyImage && !/^\.(jpe?g|png|gif|bmp|webp)$/.test(ext)) throw new Error('not an image');
    const meta = {type: OLD_TYPES[ext] || type || 'application/octet-stream', name, ext: ext || ''};
    await fs.promises.mkdir(path.dirname(file), {recursive:true});
    await fs.promises.writeFile(file + '.tmp', buf); await fs.promises.rename(file + '.tmp', file);
    await fs.promises.writeFile(file + '.json', JSON.stringify(meta));
    return {meta, buf};
  } finally { oldFree(); }
}
async function serveOld(req, res, url) {
  if (limited(req, 'old', 1500, 600e3)) { res.writeHead(429); return res.end(); }
  const raw = url.pathname.slice(4).replace(/(?:%20|\s)+$/i, '');   // после /old; хвостовые пробелы в именах из старого сайта отбрасываем
  let upstream, ext = '';
  const dl = /^\/dl\/(\d{1,9})$/.exec(raw), nc = /^\/nc\/(ru|kk)\/(\d{1,9})$/.exec(raw), ph = /^\/ph\/(\d{1,9})$/.exec(raw);
  if (dl) upstream = `${OLD_ORIGIN}/Admin/ToolsFileUpload/DownloadFile?count=false&id=${dl[1]}`;
  else if (nc) upstream = `${OLD_ORIGIN}/${nc[1]}/NamedContent/DownloadFile?Id=${nc[2]}`;   // документы раздела «Законодательство»
  else if (ph) upstream = `${OLD_ORIGIN}/ru/SiteGallery/GetPhoto?id=${ph[1]}`;               // фото альбомов фотогалереи
  else {
    let dec; try { dec = decodeURIComponent(raw); } catch (e) { return notFound(res); }
    if (!/^\/(akimsemey|images|Content)\//.test(dec) || dec.split('/').some(seg => seg === '..' || seg === '.') || /[\\\0?#]/.test(dec) || raw.length > 600) return notFound(res);
    ext = path.extname(dec.trim()).toLowerCase();
    if (!OLD_TYPES[ext]) return notFound(res);
    upstream = OLD_ORIGIN + raw;
  }
  const key = crypto.createHash('sha1').update(upstream).digest('hex');
  const file = path.join(OLD_CACHE, key.slice(0, 2), key);
  let got = null;
  try { got = {meta: JSON.parse(await fs.promises.readFile(file + '.json', 'utf8')), buf: await fs.promises.readFile(file)}; } catch (e) {}
  if (!got) {
    const miss = oldMiss.get(key); if (miss && Date.now() - miss < 600e3) return notFound(res);
    let job = oldBusy.get(key);
    if (!job) { job = oldDownload(upstream, file, ext, !!ph).finally(() => oldBusy.delete(key)); oldBusy.set(key, job); }
    try { got = await job; } catch (e) { oldMiss.set(key, Date.now()); return notFound(res); }
  }
  const {meta, buf} = got;
  const headers = {'Content-Type': meta.type, 'Content-Length': buf.length, 'Cache-Control':'public, max-age=2592000, immutable'};
  if (!/^image\//.test(meta.type)) {
    const name = meta.name || decodeURIComponent(path.basename(raw)) || ('file' + meta.ext);
    headers['Content-Disposition'] = `attachment; filename*=UTF-8''${encodeURIComponent(name)}`;
  }
  res.writeHead(200, headers); res.end(req.method === 'HEAD' ? undefined : buf);
}
setInterval(() => { const now = Date.now(); for (const [k, t] of oldMiss) if (now - t > 600e3) oldMiss.delete(k); }, 600e3).unref();

/* ---------- статические файлы ---------- */
const TYPES = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.webmanifest':'application/manifest+json', '.json':'application/json', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.pdf':'application/pdf', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.css':'text/css; charset=utf-8', '.woff':'font/woff', '.woff2':'font/woff2'};
const PUBLIC = new Set(['/index.html', '/sw.js', '/manifest.webmanifest']);
function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/index.html';
  const allowed = PUBLIC.has(p) || /^\/(img|icons)\/[\w.\-]+$/.test(p) || /^\/img\/(news|articles|gallery|hero|inst)\/(?:[\w\-]+\/)?[\w\-]+\.jpg$/.test(p)   // фото новостей, статей и альбомов лежат в подпапках img/
    || /^\/img\/symbols\/[\w\-]+\.(?:jpg|webp)$/.test(p) || /^\/fonts\/[\w\-]+\.woff2?$/.test(p) || /^\/(?:site-data|app|qr)\.[a-f0-9]{10}\.js$/.test(p) || /^\/pages\/(?:c\d{1,4}|catalog|memory|expo|home|calendar|social|tr)\.json$/.test(p) || /^\/docs\/(?:compliance|prices)\/[\w\-]+\.pdf$/.test(p);   // календарь памятных дат; документы комплаенс-службы и прейскурант платных услуг (public-docs/)   // тексты страниц прежнего сайта; каталог, архив памяти, выставки                                    // флаг и герб; тексты страниц прежнего сайта
  if (!allowed) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
  const file = p.startsWith('/docs/') ? path.join(ROOT, 'public-docs', p.slice(6)) : path.join(ROOT, p);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
    if (p.startsWith('/docs/')) {   // большие PDF не читаем целиком в память: отдаём потоком, открываются в браузере
      const hd = {'Content-Type':'application/pdf', 'Content-Length':st.size, 'Content-Disposition':'inline', 'Cache-Control':'public, max-age=86400', 'X-Content-Type-Options':'nosniff'};
      res.writeHead(200, hd);
      if (req.method === 'HEAD') return res.end();
      const rs = fs.createReadStream(file); rs.on('error', () => res.destroy()); return rs.pipe(res);
    }
    fs.readFile(file, (err2, data) => {
      if (err2) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
      const ext = path.extname(file).toLowerCase();
      const headers = {'Content-Type':TYPES[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' || p === '/sw.js' ? 'no-cache'
        : /^\/(?:site-data|app|qr)\./.test(p) ? 'public, max-age=31536000, immutable' : 'public, max-age=604800'};   // имя с хешем: файл с этим именем не меняется
      // текст сжимаем: через туннель страница грузится в несколько раз быстрее
      if (['.html', '.js', '.json', '.webmanifest', '.css'].includes(ext)) data = packText(req, data, headers, file + '|' + st.mtimeMs, 9);
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
}
const gzCache = new Map();
/* Сжатие текста: brotli, если браузер его принимает (файл меньше примерно на 15–25% против gzip: на телефоне и через туннель это быстрее), иначе gzip.
   С ключом cacheKey сжатое хранится в памяти (файлы сайта и данные), без ключа сжимается на лету (главная: фото заставки в ней выбирается заново на каждый запрос) */
function packText(req, data, headers, cacheKey, q) {
  const ae = req.headers['accept-encoding'] || '', br = /\bbr\b/.test(ae);
  if (!br && !/\bgzip\b/.test(ae)) return data;
  headers['Content-Encoding'] = br ? 'br' : 'gzip'; headers['Vary'] = 'Accept-Encoding';
  const pack = quality => br ? zlib.brotliCompressSync(data, {params:{[zlib.constants.BROTLI_PARAM_QUALITY]:quality, [zlib.constants.BROTLI_PARAM_SIZE_HINT]:data.length}}) : zlib.gzipSync(data, {level:6});
  if (!cacheKey) return pack(5);
  const k = cacheKey + (br ? '|br' : '|gz'); let z = gzCache.get(k);
  if (!z) { z = pack(q || 9); gzCache.set(k, z); if (gzCache.size > 300) gzCache.delete(gzCache.keys().next().value); }
  return z;
}

/* ---------- правки перенесённых записей каталога (ТЗ 6.3) ----------
   1 712 записей лежат в pages/catalog.json и сами не меняются. Правки и скрытие хранятся отдельно (db.catOverrides)
   и накладываются здесь, на сервере: скрытая запись пропадает из catalog.json, из адресов и из sitemap,
   а у закрытой (acc: limited) вырезаются изображения, ссылка и текст: иначе их можно было бы взять прямо из файла. */
const CAT_FILE = path.join(ROOT, 'pages', 'catalog.json');
let catRawData = null, catRawMtime = 0, catVer = 0, catCache = null;
function catRaw() {
  const mt = fs.statSync(CAT_FILE).mtimeMs;
  if (!catRawData || mt !== catRawMtime) { catRawData = JSON.parse(fs.readFileSync(CAT_FILE, 'utf8')); catRawMtime = mt; catCache = null; }
  return catRawData;
}
function catEffective(r) {
  const o = db.catOverrides[r.id]; if (!o) return r;
  if (o.hidden) return null;
  const e = {...r, ...(o.patch || {})};
  if (e.acc === 'limited') { delete e.img; delete e.url; delete e.tx; delete e.files; }
  return e;
}
function catView() {
  const raw = catRaw(), key = catRawMtime + ':' + catVer;
  if (catCache && catCache.key === key) return catCache;
  const items = raw.items.map(catEffective).filter(Boolean);
  const json = Buffer.from(JSON.stringify({...raw, items})), gz = zlib.gzipSync(json, {level:6});
  const tag = b => '"' + crypto.createHash('sha1').update(b).digest('hex').slice(0, 24) + '"';
  catCache = {key, items, map:new Map(items.map(r => [r.id, r])), json, gz, etag:tag(json), etagGz:tag(gz).replace(/"$/, '-gz"')};
  return catCache;
}
function serveCatalog(req, res) {
  let v; try { v = catView(); } catch (e) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Не найдено'); }
  const gz = /\bgzip\b/.test(req.headers['accept-encoding'] || ''), tag = gz ? v.etagGz : v.etag;
  if (req.headers['if-none-match'] === tag) { res.writeHead(304, {'ETag':tag, 'Cache-Control':'no-cache'}); return res.end(); }
  const headers = {'Content-Type':'application/json', 'Cache-Control':'no-cache', 'ETag':tag, 'Vary':'Accept-Encoding'};
  if (gz) headers['Content-Encoding'] = 'gzip';
  res.writeHead(200, headers); res.end(req.method === 'HEAD' ? undefined : (gz ? v.gz : v.json));
}
const nz = s => String(s == null ? '' : s).toLowerCase().replace(/ё/g, 'е');
const CAT_PICK = r => ({t:r.t, ds:r.ds, nt:r.nt, dt:r.dt, y0:r.y0, y1:r.y1, au:r.au, acc:r.acc, lang:r.lang, pl:r.pl, top:r.top, files:r.files});
function catCleanPatch(p, raw) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return {error:'Нет данных для правки'};
  const s = (v, n) => String(v == null ? '' : v).trim().slice(0, n), out = {};
  if (p.t !== undefined) {
    const t = {...(raw.t || {})};
    if (p.t && typeof p.t === 'object') { if (p.t.ru !== undefined) t.ru = s(p.t.ru, 400); if (p.t.kk !== undefined) { const k = s(p.t.kk, 400); if (k) t.kk = k; else delete t.kk; } }
    if (!t.ru || t.ru.length < 3) return {error:'Название по-русски: не короче 3 знаков'};
    out.t = t;
  }
  for (const [k, n] of [['ds', 4000], ['nt', 4000], ['dt', 60], ['au', 200]]) if (p[k] !== undefined) out[k] = s(p[k], n);
  if (p.acc !== undefined) { if (!['open', 'declass', 'limited'].includes(p.acc)) return {error:'Неизвестный статус доступа'}; out.acc = p.acc; }
  if (p.lang !== undefined) { if (!['ru', 'kk', 'other'].includes(p.lang)) return {error:'Неизвестный язык документа'}; out.lang = p.lang; }
  for (const k of ['y0', 'y1']) if (p[k] !== undefined) { if (p[k] === null || p[k] === '') out[k] = null; else if (Number.isInteger(+p[k]) && +p[k] >= 1500 && +p[k] <= 2100) out[k] = +p[k]; else return {error:'Год вне диапазона 1500–2100'}; }
  for (const k of ['pl', 'top']) if (p[k] !== undefined) { if (!Array.isArray(p[k]) || p[k].length > 30) return {error:'Слишком длинный список'}; out[k] = p[k].map(x => s(x, 60)).filter(x => x && (k === 'pl' || /^[a-z]{2,16}$/.test(x))); }
  if (p.files !== undefined) { const fe = cleanFileList(p.files); if (fe.error) return {error:'Файлы: ' + fe.error}; out.files = fe.list; }
  const emp = v => v == null || v === '' || (Array.isArray(v) && !v.length);
  for (const k of Object.keys(out)) if ((emp(out[k]) && emp(raw[k])) || JSON.stringify(out[k]) === JSON.stringify(raw[k])) delete out[k];   // то, что совпадает с исходным, правкой не считается
  return {patch:out};
}

/* ---------- поисковики: robots.txt, sitemap.xml и понятные адреса ---------- */
const SEO_VIEWS = {'':'Главная', about:'Об архиве', catalog:'Электронный каталог', visitors:'Справка для посетителей', memory:'Архив памяти', expo:'Онлайн-выставки', news:'Новости', contacts:'Филиалы и контакты', privacy:'Политика конфиденциальности'};
const SEO_DESC = {catalog:'Электронный каталог Государственного архива ВКО: фонды, описи, дела, документы, фотографии, карты, публикации и видео.', memory:'Архив памяти Восточного Казахстана: хронология, люди, коллекции фотографий и документов.', expo:'Онлайн-выставки Государственного архива ВКО: документальные выставки и фотовыставки.', contacts:'Адреса, телефоны и часы работы Государственного архива ВКО и его филиалов, карта и маршруты.', visitors:'Справка для посетителей: структура сайта, как искать в электронном каталоге, архивные шифры, статусы доступа, вопросы и ответы.'};
const seoData = {};
function seoLoad(name) {
  if (seoData[name] !== undefined) return seoData[name];
  try {
    if (name === 'pidx') {   // данные сайта лежат в site-data.<хеш>.js (ТЗ 7.2); в старых сборках — внутри index.html
      const dataFile = fs.readdirSync(ROOT).find(n => /^site-data\.[a-f0-9]{10}\.js$/.test(n));
      const src = fs.readFileSync(path.join(ROOT, dataFile || 'index.html'), 'utf8'); const m = /"pidx":(\[\[[\s\S]*?\]\])\s*,\s*"pver"/.exec(src); seoData.pidx = m ? new Map(JSON.parse(m[1]).map(r => [String(r[0]), r])) : new Map(); }
    else { const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages', name + '.json'), 'utf8')); seoData[name] = new Map((j.items || j.people || []).map(r => [String(r.id), r])); }
  } catch (e) { seoData[name] = null; }
  return seoData[name];
}
const xmlEsc = s => String(s).replace(/[<>&"']/g, c => ({'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;'}[c]));
const originOf = req => (req.headers['x-forwarded-proto'] === 'https' || req.headers['cf-visitor'] ? 'https' : 'http') + '://' + String(req.headers.host || 'localhost').replace(/[^\w.:\-]/g, '');
/* опубликованная в админке запись каталога или выставка: у неё тоже есть свой адрес и место в sitemap (ТЗ 7.5) */
const dbItem = (type, id) => (db.items || []).find(i => i.id === id && i.type === type && i.st === 'published');
function seoRoute(p) {
  const m = /^\/(about|catalog|visitors|memory|expo|news|contacts|privacy|fonds|region|p)(?:\/([\w\-.%]{1,120}))?(?:\/([\w\-.%]{1,60}))?\/?$/.exec(p);
  if (!m) return null;
  const [, v, a] = m; let title = SEO_VIEWS[v] || '', desc = SEO_DESC[v] || '', noindex = false;
  const id = a ? decodeURIComponent(a) : '';
  if (v === 'catalog' && id) { let cm; try { cm = catView().map; } catch (e) { cm = new Map(); } const r = cm.get(id) || (dbItem('catalog', id) || {}).data; if (!r) return null; noindex = r.acc === 'limited'; title = (r.t && (r.t.ru || r.t.kk)) || title; desc = [r.c, r.dt, r.ds].filter(Boolean).join(' · ').slice(0, 300) || desc; }
  else if (v === 'expo' && id) { const r = (seoLoad('expo') || new Map()).get(id) || (dbItem('expo', id) || {}).data; if (!r) return null; title = (r.t && (r.t.ru || r.t.kk)) || title; desc = String((r.tx && (r.tx.ru || r.tx.kk)) || r.intro || desc).slice(0, 300); }
  else if (v === 'p' && id) { const r = (seoLoad('pidx') || new Map()).get(id); if (!r) return null; title = r[1] || title; }
  return {title, desc, noindex};
}
/* общее для всех страниц: полный адрес картинки превью (для WhatsApp и Telegram), og:url, ключевые слова из админки,
   закрытые материалы — noindex (ТЗ 7.5: закрытые документы не индексируются) */
function seoHead(html, o, canon, noindex) {
  html = html.replace(/(<meta property="og:image" content=")(?!https?:\/\/)\/?([^"]*)"/, (mm, a, p2) => `${a}${xmlEsc(o)}/${p2}"`);
  const kw = String((db.settings || {}).seoKeywords || '').trim();
  const vf = (db.settings || {}).verify || {};
  const extra = [`<meta property="og:url" content="${xmlEsc(canon)}">`, kw ? `<meta name="keywords" content="${xmlEsc(kw)}">` : '', noindex ? '<meta name="robots" content="noindex, follow">' : '',
    vf.google ? `<meta name="google-site-verification" content="${xmlEsc(vf.google)}">` : '', vf.yandex ? `<meta name="yandex-verification" content="${xmlEsc(vf.yandex)}">` : '',
    `<link rel="alternate" type="application/rss+xml" title="Новости и выставки" href="${xmlEsc(o)}/feed.xml">`].filter(Boolean).join('\n');
  html = html.replace(/<link rel="alternate" hreflang="(kk|en)"[^>]*>\n?/g, (mm, l) => langOn(l) ? mm : '');   // выключенные в админке языки не объявляем
  return html.replace('<head>', `<head>\n${extra}`);
}
function serveRoute(req, res, url, r) {
  fs.readFile(path.join(ROOT, 'index.html'), 'utf8', (err, html) => {
    if (err) { res.writeHead(500); return res.end(); }
    const o = originOf(req), canon = o + url.pathname;
    const title = xmlEsc(r.title + ' — Государственный архив ВКО'), desc = xmlEsc(r.desc || '');
    html = html.replace('<head>', `<head>\n<base href="/">\n<link rel="canonical" href="${xmlEsc(canon)}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`);
    if (desc) html = html.replace(/(<meta name="description" content=")[^"]*/, `$1${desc}`).replace(/(<meta property="og:description" content=")[^"]*/, `$1${desc}`);
    html = html.replace(/(<link rel="alternate" hreflang="(?:ru|kk|en|x-default)" href=")\/(\?lang=\w+)?"/g, (mm, a, q) => `${a}${xmlEsc(canon)}${q || ''}"`);
    html = seoHead(html, o, canon, r.noindex);
    let data = Buffer.from(html);
    const headers = {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache'};
    data = packText(req, data, headers);
    res.writeHead(200, headers); res.end(req.method === 'HEAD' ? undefined : data);
  });
}
/* ТЗ 7.2: первое фото заставки — готовым тегом <img> в разметке главной, чтобы браузер качал его сразу (раньше его создавал скрипт).
   Список фото [имя, ширина, ширина -1200] берётся из самой index.html (его туда пишет dev/build.py) */
const heroSizes = new Map();
const heroSize = name => { if (!heroSizes.has(name)) { let n = 1e9; try { n = fs.statSync(path.join(ROOT, 'img', 'hero', name + '-1200.jpg')).size; } catch (e) {} heroSizes.set(name, n); } return heroSizes.get(name); };
function heroBoot(html) {
  const m = /var P = (\[\[[^;]*?\]\]),/.exec(html); if (!m || !html.includes('<!--HERO_BOOT-->')) return html;
  let list; try { list = JSON.parse(m[1]); } catch (e) { return html; }
  /* первым ставим лёгкое фото (файл -1200 до 150 КБ): главный элемент страницы (LCP) на телефоне грузится быстрее и не зависит от того, какое фото выпало */
  const light = list.filter(x => x && /^[\w-]+$/.test(x[0]) && heroSize(x[0]) <= 150 * 1024), pool = light.length ? light : list;
  const s = pool[crypto.randomInt(pool.length)]; if (!s || !/^[\w-]+$/.test(s[0])) return html;
  const tag = `<div class="hs-boot" aria-hidden="true" data-f="${s[0]}"><img alt="" decoding="async" fetchpriority="high" sizes="100vw" srcset="img/hero/${s[0]}-1200.jpg ${+s[2]}w, img/hero/${s[0]}-2400.jpg ${+s[1]}w" src="img/hero/${s[0]}-2400.jpg"></div>`;
  /* то же фото заранее объявляем в <head>: браузер начинает качать его, не дожидаясь разбора разметки; srcset и sizes те же, что у тега <img>, поэтому файл берётся один раз.
     Ставим ПОСЛЕ <meta name="viewport">: до неё 100vw считается от ширины 980 px и выбирается файл -2400 (лишние 325 КБ) */
  const pre = `<link rel="preload" as="image" fetchpriority="high" imagesizes="100vw" imagesrcset="img/hero/${s[0]}-1200.jpg ${+s[2]}w, img/hero/${s[0]}-2400.jpg ${+s[1]}w" href="img/hero/${s[0]}-2400.jpg">`;
  html = html.replace('<!--HERO_BOOT-->', tag);
  return /<meta name="viewport"[^>]*>/.test(html) ? html.replace(/<meta name="viewport"[^>]*>/, m => m + '\n' + pre) : html;
}
/* Главная: первая новость с фото — готовой разметкой в HTML и предзагрузка её картинки.
   Раньше блок рисовал скрипт после загрузки данных, и картинку браузер узнавал только тогда: на телефоне главный элемент страницы (LCP) появлялся примерно через 8 с.
   Подписи на трёх языках лежат рядом (.lg), нужную показывает CSS по <html lang> (его ставит ранний скрипт шапки). Скрипт сайта берёт блок как есть (renderNews, data-pre) и картинку не пересоздаёт.
   Порядок и выбор новости те же, что на клиенте: новости по дате, первая из тех, у кого есть фото */
const KZ_MON = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
function newsDate(v, l) {
  const d = new Date(v); if (isNaN(d)) return String(v);
  if (l === 'kz') return d.getUTCDate() + ' ' + KZ_MON[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ' ж.';
  return d.toLocaleDateString(l === 'en' ? 'en-GB' : 'ru-RU', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'});
}
function newsBoot(html) {
  const mark = '<div class="blk-main" id="home-feat"></div>';
  if (!html.includes(mark)) return html;
  const n = [...(db.news || [])].filter(x => x && x.img).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!n || !/^img\/news\/[\w.\-]+$/.test(String(n.img))) return html;   // только свои файлы news/: загруженные через админку (data:) в разметку не кладём
  const t = n.title || {}, ru = t.ru || '';
  const tri = (a, b, c) => a === b && a === c ? xmlEsc(a) : `<span class="lg ru">${xmlEsc(a)}</span><span class="lg kz">${xmlEsc(b)}</span><span class="lg en">${xmlEsc(c)}</span>`;
  const pid = (String(n.id || '').match(/^old-(\d+)$/) || [])[1], pidx = seoLoad('pidx');
  const href = pid && pidx && pidx.has(pid) ? '#p/' + pid : '#news', img = xmlEsc(n.img);
  const block = `<div class="blk-main" id="home-feat"><a class="blk blk-feat" href="${href}" data-pre="${xmlEsc(n.id)}"><span class="blk-ph pf">` +
    `<img class="pf-bg" src="${img}" alt="" aria-hidden="true" loading="lazy" decoding="async">` +
    `<img class="pf-img" src="${img}" alt="" loading="eager" fetchpriority="high" decoding="async" onerror="var b=this.parentNode;b.classList.add('noimg');var g=b.querySelector('.pf-bg');if(g)g.remove();this.remove()"></span>` +
    `<span class="blk-ov"><b>${tri(ru, t.kz || ru, t.en || ru)}</b><time datetime="${xmlEsc(n.date)}">${tri(newsDate(n.date, 'ru'), newsDate(n.date, 'kz'), newsDate(n.date, 'en'))}</time></span></a></div>`;
  html = html.replace(mark, () => block);
  const pre = `<link rel="preload" as="image" fetchpriority="high" href="${img}">`;
  return /<meta name="viewport"[^>]*>/.test(html) ? html.replace(/<meta name="viewport"[^>]*>/, m => m + '\n' + pre) : html;
}
/* Главная: адреса языковых версий (hreflang) должны быть полными, а в index.html они относительные.
   Для /catalog и других страниц это делает serveRoute; здесь то же самое для «/». */
function serveHome(req, res) {
  fs.readFile(path.join(ROOT, 'index.html'), 'utf8', (err, html) => {
    if (err) { res.writeHead(500); return res.end(); }
    const o = originOf(req);
    html = html.replace(/(<link rel="alternate" hreflang="(?:ru|kk|en|x-default)" href=")\/(\?lang=\w+)?"/g, (mm, a, q) => `${a}${xmlEsc(o)}/${q || ''}"`);
    html = seoHead(html, o, o + '/', false);
    html = heroBoot(html);
    html = newsBoot(html);
    let data = Buffer.from(html);
    const headers = {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache'};
    data = packText(req, data, headers);
    res.writeHead(200, headers); res.end(req.method === 'HEAD' ? undefined : data);
  });
}
/* RSS: подписка на новости и новые выставки (ТЗ 8.1) без сбора почты — в любой программе для чтения лент */
function feed(req, res) {
  const o = originOf(req), tt = x => (x && (x.ru || x.kk || x.kz)) || '', day = d => { const t2 = Date.parse(d); return isNaN(t2) ? '' : new Date(t2).toUTCString(); };
  const rows = [];
  for (const n of (db.news || []).filter(n => n && !n.demo).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 30))
    rows.push({t:tt(n.title), link:o + '/news', guid:'news-' + n.id, date:day(n.date), desc:String(tt(n.text)).replace(/\s+/g, ' ').slice(0, 400), cat:'Новости'});
  for (const i of (db.items || []).filter(i => i.type === 'expo' && i.st === 'published').sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 20))
    rows.push({t:tt(i.data && i.data.t), link:o + '/expo/' + encodeURIComponent(i.id), guid:'expo-' + i.id, date:i.at ? new Date(i.at).toUTCString() : '', desc:String(tt(i.data && i.data.ds) || '').slice(0, 400), cat:'Выставки'});
  for (const r of [...(seoLoad('expo') || new Map()).values()].slice(0, 30))
    rows.push({t:tt(r.t), link:o + '/expo/' + encodeURIComponent(r.id), guid:'expo-' + r.id, date:'', desc:'', cat:'Выставки'});
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Государственный архив ВКО: новости и выставки</title><link>${xmlEsc(o)}/</link><description>Новости и онлайн-выставки Государственного архива Восточно-Казахстанской области</description><language>ru</language>\n` +
    rows.filter(r => r.t).map(r => `<item><title>${xmlEsc(r.t)}</title><link>${xmlEsc(r.link)}</link><guid isPermaLink="false">${xmlEsc(r.guid)}</guid>${r.date ? `<pubDate>${r.date}</pubDate>` : ''}<category>${r.cat}</category>${r.desc ? `<description>${xmlEsc(r.desc)}</description>` : ''}</item>`).join('\n') + '\n</channel></rss>\n';
  res.writeHead(200, {'Content-Type':'application/rss+xml; charset=utf-8', 'Cache-Control':'public, max-age=600'}); res.end(req.method === 'HEAD' ? undefined : body);
}
function robots(req, res) {
  res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':'public, max-age=86400'});
  res.end(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /old/\nDisallow: /data/\n\nSitemap: ${originOf(req)}/sitemap.xml\n`);
}
function sitemap(req, res) {
  const o = originOf(req), urls = Object.keys(SEO_VIEWS).map(v => '/' + v);
  for (const r of (seoLoad('expo') || new Map()).values()) urls.push('/expo/' + r.id);
  try { for (const r of catView().items) if (['fond', 'doc', 'av', 'map'].includes(r.k) && r.acc !== 'limited') urls.push('/catalog/' + encodeURIComponent(r.id)); } catch (e) { /* нет pages/catalog.json */ }
  // опубликованное через админку; закрытые (acc: limited) в sitemap не попадают
  for (const i of db.items || []) if (i.st === 'published' && i.data && i.data.acc !== 'limited') {
    if (i.type === 'expo') urls.push('/expo/' + encodeURIComponent(i.id));
    else if (i.type === 'catalog' && ['fond', 'doc', 'av', 'map'].includes(i.data.k)) urls.push('/catalog/' + encodeURIComponent(i.id));
  }
  for (const id of (seoLoad('pidx') || new Map()).keys()) urls.push('/p/' + id);
  const alt = u => ['ru', 'kk', 'en'].filter(langOn).map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${xmlEsc(o + u + '?lang=' + (l === 'kk' ? 'kz' : l))}"/>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.map(u => `<url><loc>${xmlEsc(o + u)}</loc>${alt(u)}</url>`).join('\n') + '\n</urlset>\n';
  res.writeHead(200, {'Content-Type':'application/xml; charset=utf-8', 'Cache-Control':'public, max-age=3600'}); res.end(body);
}

http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(self)');
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    if (url.pathname.startsWith('/old/')) return await serveOld(req, res, url);
    if (url.pathname.startsWith('/files/')) return serveFile(req, res, url);   // цифровые копии: только прикреплённые к открытым опубликованным записям
    if (url.pathname === '/pages/catalog.json') return serveCatalog(req, res);   // с наложенными правками и скрытием (см. catView)
    if (url.pathname === '/admin' || url.pathname === '/admin/') { res.writeHead(302, {Location:'/#admin', 'Cache-Control':'no-store'}); return res.end(); }   // админка живёт на #admin; адрес /admin раньше отвечал голым 404
    if (url.pathname === '/robots.txt') return robots(req, res);
    if (url.pathname === '/sitemap.xml') return sitemap(req, res);
    if (url.pathname === '/feed.xml') return feed(req, res);
    { const r = seoRoute(url.pathname); if (r) return serveRoute(req, res, url, r); }
    if (url.pathname === '/' || url.pathname === '/index.html') return serveHome(req, res);
    serveStatic(req, res, url);
  } catch (e) {
    const code = e.code && Number.isInteger(e.code) ? e.code : 500;
    if (code === 500) console.error(e);
    if (!res.headersSent) send(res, code, {error: code === 502 ? 'ИИ сейчас недоступен' : 'Ошибка'});
  }
}).listen(PORT, process.env.HOST || undefined, () => console.log(`Сайт архива: http://localhost:${PORT}`));
