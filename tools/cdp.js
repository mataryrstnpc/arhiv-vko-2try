'use strict';
/*
 * Минимальный клиент Chrome DevTools Protocol без зависимостей (нужен Node.js 22+ с встроенным WebSocket
 * и установленный Chrome, Edge или Chromium). Им пользуется tools/visual-check.js.
 *
 *   const { launch } = require('./cdp');
 *   const page = await launch();               // безголовый браузер
 *   await page.goto('http://localhost:3000/'); // дождаться загрузки
 *   await page.click('button.btn');            // настоящий щелчок мышью (событие isTrusted)
 *   await page.type('#home-q', 'Риддер 1941'); // ввод с клавиатуры
 *   await page.press('Enter');
 *   await page.screenshot('shot.jpg');
 *   await page.close();
 */
const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');

const sleep = ms => new Promise(r => setTimeout(r, ms));

function findBrowser() {
  if (process.env.BROWSER && fs.existsSync(process.env.BROWSER)) return process.env.BROWSER;
  const pf = process.env.ProgramFiles || 'C:\\Program Files', pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', local = process.env.LOCALAPPDATA || '';
  const list = {
    win32: [pf + '\\Google\\Chrome\\Application\\chrome.exe', pf86 + '\\Google\\Chrome\\Application\\chrome.exe', local + '\\Google\\Chrome\\Application\\chrome.exe',
      pf86 + '\\Microsoft\\Edge\\Application\\msedge.exe', pf + '\\Microsoft\\Edge\\Application\\msedge.exe'],
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium'],
    linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge']
  }[process.platform] || [];
  return list.find(p => fs.existsSync(p)) || null;
}

const freePort = () => new Promise(res => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });

async function launch(opts = {}) {
  if (typeof WebSocket === 'undefined') throw new Error('Нужен Node.js 22 или новее (встроенный WebSocket)');
  const exe = findBrowser();
  if (!exe) throw new Error('Не найден Chrome, Edge или Chromium. Укажите путь в переменной BROWSER');
  const port = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'arhiv-cdp-'));
  const proc = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--mute-audio', '--remote-allow-origins=*',
    '--remote-debugging-port=' + port, '--user-data-dir=' + profile, ...(opts.args || []), 'about:blank'], { stdio: 'ignore' });
  let target = null;
  for (let i = 0; i < 80 && !target; i++) {
    try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); target = l.find(t => t.type === 'page'); } catch (e) {}
    if (!target) await sleep(250);
  }
  if (!target) { proc.kill(); throw new Error('Браузер не запустился'); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  let id = 0; const wait = new Map(); const listeners = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } else if (m.method) listeners.forEach(f => f(m));
  });
  const send = (method, params = {}) => new Promise(res => { const n = ++id; wait.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');

  const errors = [];
  listeners.push(m => {
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push((m.params.args || []).map(a => a.value || a.description || '').join(' '));
  });

  const page = {
    errors,
    async viewport({ w = 1440, h = 900, dsf = 1, mobile = false } = {}) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dsf, mobile }); },
    async scheme(s) { await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: s }] }); },
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.result && r.result.exceptionDetails) throw new Error('Ошибка в странице: ' + (r.result.exceptionDetails.exception && r.result.exceptionDetails.exception.description || r.result.exceptionDetails.text));
      return r.result && r.result.result ? r.result.result.value : undefined;
    },
    async goto(url, settle = 2500) {
      errors.length = 0;
      await send('Page.navigate', { url });
      await sleep(600);
      for (let i = 0; i < 60; i++) { if (await page.eval('document.readyState') === 'complete') break; await sleep(250); }
      await sleep(settle);
    },
    async waitFor(cond, timeout = 15000) {   // cond: строка-селектор или выражение, возвращающее истину
      const expr = /^[#.\[a-zA-Z][^()]*$/.test(cond) && !/[=&|!<>]/.test(cond) ? `!!document.querySelector(${JSON.stringify(cond)})` : cond;
      const t0 = Date.now();
      while (Date.now() - t0 < timeout) { try { if (await page.eval(expr)) return true; } catch (e) {} await sleep(250); }
      return false;
    },
    async rect(selector) {
      return page.eval(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null; e.scrollIntoView({block:'center', inline:'center', behavior:'instant'}); const r = e.getBoundingClientRect(); return {x:r.x + r.width / 2, y:r.y + r.height / 2, w:r.width, h:r.height}; })()`);
    },
    async click(selector) {
      const r = await page.rect(selector);
      if (!r || !r.w) throw new Error('Нет видимого элемента: ' + selector);
      await sleep(150);
      const r2 = await page.rect(selector);
      for (const [type, extra] of [['mouseMoved', {}], ['mousePressed', { button: 'left', clickCount: 1 }], ['mouseReleased', { button: 'left', clickCount: 1 }]]) await send('Input.dispatchMouseEvent', { type, x: r2.x, y: r2.y, ...extra });
      await sleep(300);
    },
    async clickText(text, scope = 'button, a, [role=button], summary') {   // щелчок по первому видимому элементу с таким текстом
      const ok = await page.eval(`(() => { const t = ${JSON.stringify(text)}.toLowerCase(); const e = [...document.querySelectorAll(${JSON.stringify(scope)})].find(x => x.offsetParent && x.textContent.trim().toLowerCase().includes(t)); if (!e) return false; e.setAttribute('data-vc-click', '1'); return true; })()`);
      if (!ok) throw new Error('Нет элемента с текстом: ' + text);
      await page.click('[data-vc-click="1"]');
      await page.eval(`document.querySelectorAll('[data-vc-click]').forEach(e => e.removeAttribute('data-vc-click'))`);
    },
    async type(selector, text) {
      await page.click(selector);
      await page.eval(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (e && 'value' in e) { e.value = ''; e.dispatchEvent(new Event('input', {bubbles:true})); } })()`);
      await send('Input.insertText', { text });
      await sleep(250);
    },
    async press(key) {
      const codes = { Enter: [13, '\r'], Escape: [27, ''], Tab: [9, ''] };
      const [vk, txt] = codes[key] || [0, ''];
      for (const type of [txt ? 'keyDown' : 'rawKeyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key, code: key, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, ...(type === 'keyDown' ? { text: txt, unmodifiedText: txt } : {}) });
      await sleep(250);
    },
    async text(selector = 'body') { return page.eval(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); return e ? e.innerText : ''; })()`); },
    async screenshot(file, { quality = 85, full = false, clip = null } = {}) {
      const params = { format: file.endsWith('.png') ? 'png' : 'jpeg', captureBeyondViewport: full };
      if (params.format === 'jpeg') params.quality = quality;
      if (clip) params.clip = { ...clip, scale: 1 };
      const r = await send('Page.captureScreenshot', params);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'));
      return file;
    },
    async close() { try { ws.close(); } catch (e) {} proc.kill(); await sleep(400); try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {} }
  };
  return page;
}

module.exports = { launch, sleep, findBrowser };
