"""Проверка контраста текста по WCAG 2.1 (уровень AA).

Запуск из папки проекта (нужны Python 3 и Playwright):
    python tests/contrast.py          # все страницы и окна, светлая, тёмная и контрастная схемы
    python tests/contrast.py quick    # только светлая и тёмная схемы

Для каждого видимого текста считает цвет текста и цвет фона под ним (с учётом
полупрозрачных слоёв) и сравнивает контраст с нормой: 4.5:1 для обычного текста,
3:1 для крупного (от 24 px или от 18.7 px жирным).
Текст поверх фотографий и градиентов перечисляется отдельно: его контраст
обеспечивают затемняющие слои, и автоматически он не оценивается.
Код выхода 0 — нарушений нет; 1 — есть (подробности в tests/contrast-report.json).
"""
import asyncio, subprocess, os, sys, time, tempfile, json, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
QUICK = 'quick' in sys.argv[1:]
PORT = os.environ.get('PORT_TEST', '3998')
T = tempfile.mkdtemp()
env = dict(os.environ, PORT=PORT, ADMIN_PASSWORD='test', DATA_FILE=T + '/db.json')
srv = subprocess.Popen(['node', 'server.js'], cwd=str(ROOT), env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
U = f'http://localhost:{PORT}/'

HUBS = {
    'visitors': ['site', 'guide', 'cert', 'genealogy', 'reading', 'faq', 'links'],
    'fonds': ['store', 'personal', 'db', 'pubs', 'gloss'],
    'region': ['essays', 'expo', 'photo', 'articles', 'districts'],
    'about': ['intro', 'history', 'team', 'activity', 'docs'],
    'news': ['news', 'ann'],
}
TZ = ['catalog', 'catalog/d-42458-1', 'catalog/ph-36-89', 'memory', 'memory/people', 'expo', 'expo/x7', 'privacy']   # разделы по ТЗ
ROUTES = ['home', 'contacts'] + [f'{h}/{t}' for h, ts in HUBS.items() for t in ts] + TZ + ['@search', '@chat', '@drawer', '@a11y', '@admin']
SCHEMES = ['light', 'dark'] if QUICK else ['light', 'dark', 'contrast']
WIDTHS = [390, 1440]
LANG = 'ru'

CHECK = r"""
() => {
  const cs = el => getComputedStyle(el);
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1}; };
  const over = (top, bot) => { const a = top.a + bot.a * (1 - top.a); if (!a) return {r: 0, g: 0, b: 0, a: 0};
    const f = k => (top[k] * top.a + bot[k] * bot.a * (1 - top.a)) / a; return {r: f('r'), g: f('g'), b: f('b'), a}; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const desc = el => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.classList && el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.'); return s; };
  const path = el => { const p = []; let e = el; for (let i = 0; i < 4 && e && e !== document.body; i++) { p.unshift(desc(e)); e = e.parentElement; } return p.join('>'); };
  const shown = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = cs(e);
      if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < .05 || e.hidden) return false;
      const pe = e.parentElement; if (pe && pe.tagName === 'DETAILS' && !pe.open && e.tagName !== 'SUMMARY') return false; } return true; };
  const media = e => e.matches('img, svg, video, canvas, picture, iframe') && !e.closest('button, a.btn, .ic');
  // есть ли под текстом картинка: соседние позиционированные слои с картинкой, перекрывающие текст
  function overImage(el) {
    const r = el.getBoundingClientRect();
    const hit = x => { const q = x.getBoundingClientRect(); return q.width > 40 && q.height > 40 && q.left < r.right && q.right > r.left && q.top < r.bottom && q.bottom > r.top; };
    for (let child = el, a = el.parentElement; a && a !== document.documentElement; child = a, a = a.parentElement) {
      for (const sib of a.children) {
        if (sib === child || sib.contains(child)) continue;
        const pos = cs(sib).position; if (pos !== 'absolute' && pos !== 'fixed') continue;
        if (!shown(sib)) continue;
        const ms = media(sib) ? [sib] : [...sib.querySelectorAll('img, svg, video, canvas')].filter(m => !m.hidden && shown(m) && !m.closest('.ic'));
        if (ms.some(hit)) return true;
      }
    }
    return false;
  }
  const out = {fail: [], image: [], checked: 0};
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (el.closest('script, style, noscript, svg, [aria-hidden="true"], .sr, option')) continue;
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect(); if (r.width <= 2 || r.height <= 2) continue;
    const c = cs(el);
    if (el.closest('[disabled], [aria-disabled="true"]')) continue;
    let fg = parse(c.color); if (!fg) continue;
    let op = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) op *= parseFloat(cs(e).opacity);
    // фон: слои от элемента вверх
    const layers = []; let complex = '';
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const s = cs(e);
      // фон-«заливка» нулевого размера (кнопки, которые заливаются при наведении) не мешает
      if (s.backgroundImage && s.backgroundImage !== 'none' && !/^0(%|px)/.test(s.backgroundSize)) { complex = 'gradient:' + desc(e); break; }
      const bg = parse(s.backgroundColor); if (bg && bg.a > 0) { layers.push(bg); if (bg.a >= 1) break; }
    }
    if (!complex && overImage(el)) complex = 'image';
    const size = parseFloat(c.fontSize), bold = parseInt(c.fontWeight) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    const text = n.nodeValue.trim().slice(0, 40);
    if (complex) { out.image.push({p: path(el), t: text, why: complex}); continue; }
    let bg = {r: 255, g: 255, b: 255, a: 1};
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    const f = over({...fg, a: fg.a * op}, bg);
    const k = ratio(f, bg);
    out.checked++;
    if (k < need) out.fail.push({p: path(el), t: text, k: +k.toFixed(2), need, fs: size,
      fg: c.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`});
  }
  return out;
}
"""

async def open_route(pg, route):
    if route.startswith('@'):
        await pg.evaluate("location.hash = 'home'"); await pg.wait_for_timeout(250)
        if route == '@search':
            await pg.click('.nav-search'); await pg.fill('#search-q', 'Риддер'); await pg.wait_for_timeout(400)
        elif route == '@chat':
            await pg.evaluate("document.querySelector('#fab').click()"); await pg.wait_for_timeout(250)
            await pg.evaluate("() => { const i = document.querySelector('#chat-input'); i.value = 'Как получить архивную справку о стаже?'; document.querySelector('#chat-form').requestSubmit(); }")
            await pg.wait_for_timeout(900)
        elif route == '@drawer':
            await pg.evaluate("document.querySelector('#side-tab').click()"); await pg.wait_for_timeout(400)
        elif route == '@a11y':
            await pg.click('[data-act="a11y-toggle"]'); await pg.wait_for_timeout(300)
        elif route == '@admin':
            await pg.evaluate("location.hash = 'admin'"); await pg.wait_for_timeout(500)
    else:
        await pg.evaluate("h => { location.hash = h; }", route); await pg.wait_for_timeout(900 if route.split("/")[0] in ("catalog", "memory", "expo") else 450)
        await pg.evaluate("window.scrollTo(0,0)")

async def close_overlays(pg):
    await pg.keyboard.press('Escape'); await pg.wait_for_timeout(120)
    await pg.evaluate("""() => { document.querySelectorAll('[data-act=chat-close],[data-act=drawer-close]').forEach(b => { if (b.offsetParent) b.click(); });
      const p = document.querySelector('#a11y-panel'); if (p && !p.hidden) document.querySelector('[data-act="a11y-toggle"]').click(); }""")
    await pg.wait_for_timeout(150)

async def run(b, scheme, results, images):
    ctx = await b.new_context(viewport={'width': WIDTHS[0], 'height': 860}, locale='ru-RU', reduced_motion='reduce')
    prefs = {'lang': LANG, 'fs': 0, 'scheme': scheme, 'spacing': False, 'panel': False, 'autoSpeak': False}
    await ctx.add_init_script(f"try{{localStorage.setItem('arhvko_prefs', {json.dumps(json.dumps(prefs))})}}catch(e){{}}")
    pg = await ctx.new_page()
    await pg.clock.set_fixed_time('2026-11-10T06:20:00Z')
    await pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    await pg.goto(U + '#home'); await pg.wait_for_timeout(1500)
    checked = 0
    for w in WIDTHS:
        await pg.set_viewport_size({'width': w, 'height': 860}); await pg.wait_for_timeout(300)
        for route in ROUTES:
            try:
                await open_route(pg, route)
                res = await pg.evaluate(CHECK)
            except Exception as e:
                res = {'fail': [{'error': str(e)[:200]}], 'image': [], 'checked': 0}
            checked += res['checked']
            for f in res['fail']:
                key = (scheme, f.get('p'), f.get('t'))
                results.setdefault(key, {**f, 'scheme': scheme, 'where': []})['where'].append(f'{w}|{route}')
            for f in res['image']:
                images.setdefault((scheme, f['p']), {**f, 'scheme': scheme})
            if route.startswith('@'): await close_overlays(pg)
    await ctx.close()
    return checked

async def main():
    results, images = {}, {}
    async with async_playwright() as p:
        kw = {'executable_path': os.environ['CHROME_PATH']} if os.environ.get('CHROME_PATH') else {}
        b = await p.chromium.launch(args=['--no-sandbox'], **kw)
        total = 0
        for s in SCHEMES: total += await run(b, s, results, images)
        await b.close()
    fails = sorted(results.values(), key=lambda x: (x['scheme'], x.get('k', 0)))
    (ROOT / 'tests' / 'contrast-report.json').write_text(json.dumps({'fail': fails, 'overImage': list(images.values())}, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'Проверено текстов: {total}. Ниже нормы WCAG AA: {len(fails)}. Поверх фото и градиентов (вне автопроверки): {len(images)}.')
    for f in fails[:40]:
        print(f" - [{f['scheme']}] {f.get('k')}:1 (нужно {f.get('need')}) {f.get('fs')}px «{f.get('t')}» {f.get('p')}  {f.get('fg')} на {f.get('bg')}  ({f['where'][0]}{' …' if len(f['where']) > 1 else ''})")
    return 1 if fails else 0

try:
    code = asyncio.run(main())
finally:
    srv.terminate()
sys.exit(code)
