'use strict';
/*
 * Запуск сайта архива с этого компьютера одной командой.
 * 1) Создаёт .env с паролем панели (при первом запуске).
 * 2) Запускает server.js на этом компьютере.
 * 3) Открывает публичную https-ссылку через Cloudflare Tunnel (без регистрации).
 * 4) Записывает ссылку и пароль в файл site-access.txt.
 *
 * Обычно его вызывает start-site.bat (Windows) или start-site.sh (macOS, Linux).
 * Без внешних библиотек: нужен только Node.js 20.6+.
 */
const fs = require('fs');
const path = require('path');
const net = require('net');
const crypto = require('crypto');
const readline = require('readline');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(ROOT, '.env');
const OUT_FILE = path.join(ROOT, 'site-access.txt');
const BIN_DIR = path.join(__dirname, 'bin');
const NO_OPEN = process.env.NO_OPEN === '1';
const CF_RELEASES = 'https://github.com/cloudflare/cloudflared/releases/latest/download/';

const say = (...a) => console.log(...a);
const line = () => say('—'.repeat(60));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const children = [];

function parseEnv(text) {
  const o = {};
  for (const l of text.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) o[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return o;
}

function ask(question) {
  if (!process.stdin.isTTY) return Promise.resolve('');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(question, a => { rl.close(); res(a.trim()); }));
}

async function ensureEnv() {
  if (fs.existsSync(ENV_FILE)) {
    const env = parseEnv(fs.readFileSync(ENV_FILE, 'utf8'));
    if (env.ADMIN_PASSWORD && env.ADMIN_PASSWORD !== 'смените-этот-пароль') return env;
    say('В .env не задан пароль панели: придумываю новый.');
    const pwd = crypto.randomBytes(9).toString('base64url');
    let text = fs.readFileSync(ENV_FILE, 'utf8');
    text = /^\s*ADMIN_PASSWORD\s*=.*$/m.test(text) ? text.replace(/^\s*ADMIN_PASSWORD\s*=.*$/m, 'ADMIN_PASSWORD=' + pwd) : text + '\nADMIN_PASSWORD=' + pwd + '\n';
    fs.writeFileSync(ENV_FILE, text, 'utf8');
    return parseEnv(text);
  }
  say('Первый запуск: создаю файл настроек .env');
  const pwd = crypto.randomBytes(9).toString('base64url');
  say('');
  say('Ключ ИИ нужен, чтобы помощник отвечал своими словами. Без ключа он отвечает готовыми ответами.');
  const key = process.env.ANTHROPIC_API_KEY || await ask('Вставьте ключ ИИ (Anthropic API) или просто нажмите Enter: ');
  const text = [
    '# Настройки сайта архива. Файл создан автоматически, никому его не пересылайте.',
    'PORT=3000',
    '# Пароль для входа в панель сотрудников',
    'ADMIN_PASSWORD=' + pwd,
    '# Ключ ИИ для помощника (можно вписать позже и перезапустить)',
    'ANTHROPIC_API_KEY=' + key,
    'AI_MODEL=claude-haiku-5-5',
    ''
  ].join('\n');
  fs.writeFileSync(ENV_FILE, text, { encoding: 'utf8', mode: 0o600 });
  return parseEnv(text);
}

function portFree(port) {
  return new Promise(res => {
    const s = net.createServer();
    s.once('error', () => res(false));
    s.once('listening', () => s.close(() => res(true)));
    s.listen(port, '127.0.0.1');
  });
}
async function pickPort(want) {
  for (let p = want; p < want + 20; p++) if (await portFree(p)) return p;
  throw new Error('Не нашёл свободный порт рядом с ' + want);
}

async function waitHealth(base, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { const r = await fetch(base + '/api/health', { signal: AbortSignal.timeout(4000) }); if (r.ok) return await r.json(); } catch (e) { /* ещё запускается */ }
    await sleep(700);
  }
  return null;
}

/* ---------- cloudflared ---------- */
function cfAssetName() {
  const a = process.arch;
  if (process.platform === 'win32') return a === 'ia32' ? 'cloudflared-windows-386.exe' : 'cloudflared-windows-amd64.exe';
  if (process.platform === 'linux') return { x64: 'cloudflared-linux-amd64', arm64: 'cloudflared-linux-arm64', arm: 'cloudflared-linux-arm', ia32: 'cloudflared-linux-386' }[a] || null;
  return null; // macOS: brew install cloudflared
}
function works(cmd) {
  try { return spawnSync(cmd, ['--version'], { stdio: 'ignore', timeout: 15000 }).status === 0; } catch (e) { return false; }
}
async function download(url, dest) {
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok || !r.body) throw new Error('HTTP ' + r.status);
  const total = Number(r.headers.get('content-length')) || 0;
  const tmp = dest + '.part';
  const out = fs.createWriteStream(tmp);
  let got = 0, shown = -1;
  for await (const chunk of r.body) {
    got += chunk.length;
    if (!out.write(chunk)) await new Promise(res => out.once('drain', res));
    const pct = total ? Math.floor(got / total * 100) : -1;
    if (pct >= 0 && pct !== shown && pct % 10 === 0) { shown = pct; process.stdout.write(`  загружено ${pct}%\r`); }
  }
  await new Promise((res, rej) => out.end(err => err ? rej(err) : res()));
  fs.renameSync(tmp, dest);
  process.stdout.write('\n');
}
async function findCloudflared() {
  const local = path.join(BIN_DIR, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared');
  if (fs.existsSync(local) && works(local)) return local;
  if (works('cloudflared')) return 'cloudflared';
  const asset = cfAssetName();
  if (!asset) {
    say('Для публичной ссылки нужна программа cloudflared. На macOS: brew install cloudflared');
    return null;
  }
  say('Скачиваю cloudflared (бесплатная программа Cloudflare для публичной ссылки, около 60 МБ)…');
  fs.mkdirSync(BIN_DIR, { recursive: true });
  try {
    await download(CF_RELEASES + asset, local);
    if (process.platform !== 'win32') fs.chmodSync(local, 0o755);
    if (works(local)) return local;
    say('cloudflared скачан, но не запускается. Возможно, его заблокировал антивирус.');
  } catch (e) {
    say('Не удалось скачать cloudflared: ' + e.message);
  }
  return null;
}
function startTunnel(cf, port) {
  return new Promise(res => {
    const t = spawn(cf, ['tunnel', '--no-autoupdate', '--url', `http://127.0.0.1:${port}`], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    children.push(t);
    let done = false, log = '';
    const finish = url => { if (!done) { done = true; clearTimeout(timer); res({ url, proc: t, log }); } };
    const onData = d => {
      const s = d.toString(); log = (log + s).slice(-4000);
      const m = s.match(/https:\/\/(?!api\.)[a-z0-9-]+\.trycloudflare\.com/i);   // api.trycloudflare.com — служебный адрес Cloudflare из сообщения об ошибке, а не ссылка на сайт
      if (m) finish(m[0]);
    };
    t.stdout.on('data', onData); t.stderr.on('data', onData);
    t.on('exit', () => finish(null));
    t.on('error', () => finish(null));
    const timer = setTimeout(() => finish(null), 90000);
  });
}

/* постоянный туннель: токен из панели Cloudflare (Networking → Tunnels), адрес — публичное имя, привязанное к туннелю.
   Токен передаём через переменную окружения, чтобы он не попал в список процессов, и стираем его из любого вывода. */
const scrubToken = s => String(s || '').replace(/eyJ[A-Za-z0-9_\-=.]{20,}/g, '***');
const normUrl = u => { u = String(u || '').trim().replace(/\/+$/, ''); return u ? (/^https?:\/\//i.test(u) ? u : 'https://' + u) : null; };
function startNamedTunnel(cf, token) {
  return new Promise(res => {
    const t = spawn(cf, ['tunnel', '--no-autoupdate', 'run'], { env: { ...process.env, TUNNEL_TOKEN: token }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    children.push(t);
    let done = false, log = '';
    const finish = ok => { if (!done) { done = true; clearTimeout(timer); res({ ok, proc: t, log: scrubToken(log) }); } };
    const onData = d => { log = (log + d.toString()).slice(-4000); if (/Registered tunnel connection/i.test(log)) finish(true); };
    t.stdout.on('data', onData); t.stderr.on('data', onData);
    t.on('exit', () => finish(false));
    t.on('error', () => finish(false));
    const timer = setTimeout(() => finish(false), 60000);
  });
}

function openThing(target) {
  if (NO_OPEN) return;
  try {
    if (process.platform === 'win32') spawn('cmd', ['/c', 'start', '', target], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    else spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [target], { detached: true, stdio: 'ignore' }).unref();
  } catch (e) { /* не страшно */ }
}

function writeAccess({ publicUrl, localUrl, password, ai, checked, named }) {
  const now = new Date().toLocaleString('ru-RU');
  const lines = [
    'САЙТ ГОСУДАРСТВЕННОГО АРХИВА ВКО: ДОСТУП',
    'Запущен: ' + now,
    '',
    publicUrl ? 'Ссылка для всех (работает, пока открыто окно запуска и компьютер не спит):' : 'Публичной ссылки нет: туннель не запустился (см. окно запуска). Сайт работает только на этом компьютере.',
    publicUrl ? '  ' + publicUrl + (checked ? '' : '   (если не открывается сразу, подождите минуту)') : '',
    '',
    'Панель сотрудников:',
    '  ' + (publicUrl || localUrl) + '/#admin',
    '  Пароль: ' + password,
    '',
    'На этом компьютере:',
    '  ' + localUrl,
    '',
    'Помощник ИИ: ' + (ai ? 'подключён.' : 'работает на готовых ответах (ключ ИИ не задан в файле .env).'),
    '',
    'Важно:',
    named ? '- Адрес постоянный (туннель Cloudflare): он не меняется при перезапуске.' : '- Ссылка меняется при каждом запуске.',
    '- Пароль давайте только тем, кто ведёт сайт. Сменить его: строка ADMIN_PASSWORD в файле .env, затем перезапуск.',
    '- Наружу открыты только файлы сайта; остальные файлы компьютера недоступны.',
    '- Чтобы остановить сайт, закройте окно запуска.',
    ''
  ];
  fs.writeFileSync(OUT_FILE, lines.join(process.platform === 'win32' ? '\r\n' : '\n'), 'utf8');
}

function stopAll() { for (const c of children) { try { c.kill(); } catch (e) {} } }
process.on('SIGINT', () => { stopAll(); process.exit(0); });
process.on('SIGTERM', () => { stopAll(); process.exit(0); });
process.on('exit', stopAll);

(async function main() {
  line(); say('Сайт Государственного архива ВКО: запуск'); line();
  if (!fs.existsSync(path.join(ROOT, 'server.js'))) { say('Не найден server.js. Запускайте из папки сайта.'); process.exit(1); }
  const env = await ensureEnv();
  const port = await pickPort(Number(env.PORT) || 3000);
  const localUrl = `http://localhost:${port}`;

  say('Запускаю сервер сайта…');
  const srvEnv = { ...process.env, ...env, PORT: String(port), HOST: '127.0.0.1' };
  delete srvEnv.TUNNEL_TOKEN;   // токен туннеля серверу сайта не нужен
  const srv = spawn(process.execPath, ['server.js'], {
    cwd: ROOT, env: srvEnv,
    stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true
  });
  children.push(srv);
  let srvLog = '';
  srv.stdout.on('data', d => { srvLog += d; }); srv.stderr.on('data', d => { srvLog += d; });
  srv.on('exit', code => { say('\nСервер остановился (код ' + code + ').'); if (srvLog.trim()) say(srvLog.trim().slice(-1500)); stopAll(); process.exit(1); });
  const health = await waitHealth(`http://127.0.0.1:${port}`, 20000);
  if (!health) { say('Сервер не ответил. Подробности:\n' + srvLog.slice(-1500)); stopAll(); process.exit(1); }
  say('Сервер работает: ' + localUrl);

  let publicUrl = null, checked = false, named = false;
  const cf = await findCloudflared();
  if (cf && env.TUNNEL_TOKEN) {
    say('Подключаю постоянный туннель Cloudflare…');
    const n = await startNamedTunnel(cf, env.TUNNEL_TOKEN);
    if (n.ok) {
      named = true;
      publicUrl = normUrl(env.PUBLIC_URL);
      if (publicUrl) {
        for (let i = 0; i < 12 && !checked; i++) {
          try { const r = await fetch(publicUrl + '/api/health', { signal: AbortSignal.timeout(5000) }); checked = r.ok; } catch (e) {}
          if (!checked) await sleep(2500);
        }
        if (!checked) say('Туннель подключён, но ' + publicUrl + ' пока не отвечает. Проверьте в панели Cloudflare, что у туннеля есть публичный адрес с сервисом HTTP и адресом localhost:' + port + ', и подождите минуту.');
      } else {
        say('Туннель подключён, но в .env не указан PUBLIC_URL (например, https://arhiv.ваш-домен.com): ссылку записать некуда.');
      }
      n.proc.on('exit', () => say('\nПостоянный туннель отключился. Сайт пока доступен только на этом компьютере. Перезапустите start-site.'));
    } else {
      say('Не удалось подключить постоянный туннель. Проверьте TUNNEL_TOKEN в .env (токен берётся в панели Cloudflare: Networking → Tunnels → ваш туннель → Add a replica) и интернет.');
      if (n.log) say(n.log.trim().split(/\r?\n/).slice(-6).join('\n'));
      say('Пробую временную ссылку вместо постоянной…');
    }
  }
  if (cf && !named) {
    say('Открываю публичную ссылку (до минуты)…');
    let t = await startTunnel(cf, port);
    const limited = x => /429|too many|rate.?limit/i.test(x.log || '');
    for (let i = 0; i < 2 && !t.url && !limited(t); i++) {   // Cloudflare иногда не успевает ответить: пробуем ещё два раза (при 429 не долбим: это лимит на число запусков)
      say('Ссылка не создалась, пробую ещё раз…');
      await sleep(4000);
      t = await startTunnel(cf, port);
    }
    publicUrl = t.url;
    if (publicUrl) {
      for (let i = 0; i < 12 && !checked; i++) {
        try { const r = await fetch(publicUrl + '/api/health', { signal: AbortSignal.timeout(5000) }); checked = r.ok; } catch (e) {}
        if (!checked) await sleep(2500);
      }
      t.proc.on('exit', () => say('\nПубличная ссылка перестала работать (туннель закрылся). Сайт пока доступен только на этом компьютере. Перезапустите start-site.'));
    } else {
      say(limited(t)
        ? 'Cloudflare временно ограничил создание бесплатных ссылок (ошибка 429: слишком много запусков с этого адреса). Подождите 15–60 минут и запустите снова. Сайт при этом работает на этом компьютере.'
        : 'Не удалось получить ссылку. Проверьте интернет; иногда мешает антивирус или сеть организации.');
      if (t.log) say(t.log.trim().split(/\r?\n/).slice(-6).join('\n'));
    }
  }

  writeAccess({ publicUrl, localUrl, password: env.ADMIN_PASSWORD, ai: !!health.ai, checked, named });
  line();
  if (publicUrl) say('ГОТОВО. Ссылка для всех:\n  ' + publicUrl);
  else say('Сайт работает на этом компьютере:\n  ' + localUrl);
  say('Панель сотрудников: ' + (publicUrl || localUrl) + '/#admin');
  say('Пароль панели и ссылка записаны в файл: ' + OUT_FILE);
  say('Помощник ИИ: ' + (health.ai ? 'подключён' : 'готовые ответы (ключ ИИ не задан)'));
  line();
  say('Не закрывайте это окно, пока сайт нужен. Чтобы остановить, закройте окно.');
  openThing(publicUrl || localUrl);
  if (process.platform === 'win32' && !NO_OPEN) { try { spawn('notepad', [OUT_FILE], { detached: true, stdio: 'ignore' }).unref(); } catch (e) {} }
})().catch(e => { say('Ошибка: ' + (e && e.message || e)); stopAll(); process.exit(1); });
