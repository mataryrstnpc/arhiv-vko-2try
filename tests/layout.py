"""Проверка вёрстки: ничего не вылезает за рамки и не наползает друг на друга.

Запуск из папки проекта (нужны Python 3 и Playwright):
    pip install playwright && python -m playwright install chromium
    python tests/layout.py            # три языка, все ширины, все страницы (~10–15 минут)
    python tests/layout.py ru quick   # быстрый прогон: один язык, 3 ширины

Проверяет на ширинах 320–1920 px, в трёх языках, во всех разделах и окнах, в тёмной, светлой
и контрастной схемах, с крупным шрифтом 130% и 150%:
горизонтальную прокрутку, элементы за краем экрана, обрезанный и вылезающий из блока текст,
наложение текста на текст и кнопок на кнопки, загрузку встроенных шрифтов.
Код выхода 0 — замечаний нет; 1 — есть (подробности в tests/layout-report.json).
"""
import asyncio, subprocess, os, sys, time, tempfile, json, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
ARGS = [a for a in sys.argv[1:]]
QUICK = 'quick' in ARGS
LANGS = [a for a in ARGS if a in ('ru', 'kz', 'en')] or ['ru', 'kz', 'en']
LANG = LANGS[0]
PORT = os.environ.get('PORT_TEST', '3999')
DIR = str(ROOT)
T = tempfile.mkdtemp()
env = dict(os.environ, PORT=PORT, ADMIN_PASSWORD='test', DATA_FILE=T + '/db.json')
srv = subprocess.Popen(['node', 'server.js'], cwd=DIR, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
U = f'http://localhost:{PORT}/'

HUBS = {
    'visitors': ['site', 'guide', 'cert', 'genealogy', 'reading', 'faq', 'links'],
    'fonds': ['store', 'personal', 'db', 'pubs', 'gloss'],
    'region': ['essays', 'expo', 'photo', 'articles', 'districts'],
    'about': ['intro', 'history', 'team', 'activity', 'docs'],
    'news': ['news', 'ann'],
}
TZ = ['catalog', 'catalog?adv=1&q=%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8+1960-%D1%85', 'catalog/d-42458-1', 'catalog/ph-36-89', 'catalog/f-gavko-77',
      'memory', 'memory/people', 'memory/person/m1', 'memory/cols', 'expo', 'expo/x7', 'expo/x1', 'privacy']   # разделы по ТЗ
ROUTES = ['home', 'contacts'] + [f'{h}/{t}' for h, ts in HUBS.items() for t in ts] + TZ + ['@search', '@chat', '@drawer', '@a11y', '@admin']
WIDTHS = [320, 360, 390, 414, 600, 768, 900, 1024, 1280, 1440, 1920]
if QUICK:
    WIDTHS = [360, 768, 1440]
EXTRA = [  # (scheme, fs, widths)
    ('dark', 0, [390, 1440]),
    ('contrast', 0, [390, 1440]),
    ('', 3, [320, 390, 768, 1440]),
    ('', 2, [360, 1024]),
]
if QUICK:
    EXTRA = [('', 3, [390, 1440])]

CHECK = r"""
() => {
  const W = document.documentElement.clientWidth, H = innerHeight;
  const out = {docOver: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - W,
               off: [], clipH: [], clipV: [], textOut: [], overlap: [], ctlOverlap: [], fonts: []};
  const desc = el => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.classList && el.classList.length) s += '.' + [...el.classList].slice(0, 3).join('.'); return s; };
  const path = el => { const p = []; let e = el; for (let i = 0; i < 4 && e && e !== document.body; i++) { p.unshift(desc(e)); e = e.parentElement; } return p.join('>'); };
  const csCache = new Map();
  const cs = el => { let c = csCache.get(el); if (!c) { c = getComputedStyle(el); csCache.set(el, c); } return c; };
  const shown = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = cs(e); if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < .02) return false; if (e.hidden) return false;
      const pe = e.parentElement; if (pe && pe.tagName === 'DETAILS' && !pe.open && e.tagName !== 'SUMMARY') return false; } return true; };
  const isFixed = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const p = cs(e).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
  const srOnly = el => { const r = el.getBoundingClientRect(); return r.width <= 2 && r.height <= 2; };
  // прямоугольник после обрезки предками (кроме html/body)
  function clipOf(el, includeSelf, noScrollers) {
    let L = -1e9, T = -1e9, R = 1e9, B = 1e9;
    let e = includeSelf ? el : el.parentElement;
    while (e && e !== document.body && e !== document.documentElement) {
      const c = cs(e);
      let ox = c.overflowX !== 'visible', oy = c.overflowY !== 'visible';
      if (noScrollers) { if (['auto','scroll'].includes(c.overflowX)) ox = false; if (['auto','scroll'].includes(c.overflowY)) oy = false; }
      if (ox || oy) {
        const pr = e.getBoundingClientRect();
        if (ox) { L = Math.max(L, pr.left); R = Math.min(R, pr.right); }
        if (oy) { T = Math.max(T, pr.top); B = Math.min(B, pr.bottom); }
      }
      if (c.position === 'fixed') break;
      e = e.parentElement;
    }
    return {L, T, R, B};
  }
  const all = [...document.body.querySelectorAll('*')].filter(el => !(el.closest('svg') && el.tagName.toLowerCase() !== 'svg'));
  const vis = all.filter(el => el.getClientRects().length && shown(el) && !srOnly(el));
  // 1) элементы за краем экрана
  for (const el of vis) {
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const c = clipOf(el, false);
    const L = Math.max(r.left, c.L), R = Math.min(r.right, c.R), Tt = Math.max(r.top, c.T), B = Math.min(r.bottom, c.B);
    if (R - L < 1 || B - Tt < 1) continue; // полностью скрыт обрезкой
    if (R > W + 1 || L < -1) out.off.push({el: path(el), l: Math.round(L), r: Math.round(R), w: W});
  }
  // 2) обрезанный текст внутри overflow:hidden/auto
  for (const el of vis) {
    const c = cs(el);
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || el.querySelector(':scope > span, :scope > b, :scope > a, :scope > small');
    if (!hasText) continue;
    if (c.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
      out.clipH.push({el: path(el), ov: c.overflowX, sw: el.scrollWidth, cw: el.clientWidth, te: c.textOverflow, txt: el.textContent.trim().slice(0, 50)});
    const clamped = (c.webkitLineClamp && c.webkitLineClamp !== 'none');   // намеренное сокращение до 2–3 строк
    if (!clamped && c.overflowY !== 'visible' && el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 0 && !['auto','scroll'].includes(c.overflowY))
      out.clipV.push({el: path(el), ov: c.overflowY, sh: el.scrollHeight, ch: el.clientHeight, txt: el.textContent.trim().slice(0, 50)});
  }
  // 3) текст, вылезающий за свой блок / за обрезку (включая глифы при line-height < 1)
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: n => n.textContent.trim() ? 1 : 2});
  const lines = [];
  let n;
  while ((n = tw.nextNode())) {
    const p = n.parentElement; if (!p || p.closest('svg,script,style,noscript,textarea,option,.marquee')) continue;
    if (!shown(p) || srOnly(p)) continue;
    let blk = p; while (blk && cs(blk).display.startsWith('inline') && blk.parentElement) blk = blk.parentElement;
    const br = blk.getBoundingClientRect();
    const rg = document.createRange(); rg.selectNodeContents(n);
    const rects = [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1);
    const clip = clipOf(p, true, true);
    const fixed = isFixed(p);
    const deco = !!p.closest('[aria-hidden="true"]');
    for (const r of rects) {
      const over = Math.max(r.right - br.right, br.left - r.left);
      if (over > 2 && !(cs(blk).overflowX !== 'visible'))
        out.textOut.push({el: path(p), blk: desc(blk), over: Math.round(over), txt: n.textContent.trim().slice(0, 40)});
      // обрезка глифов по вертикали/горизонтали
      const vis2 = !(r.right < clip.L || r.left > clip.R || r.bottom < clip.T || r.top > clip.B);
      if (vis2) {
        const cut = Math.max(clip.L - r.left, r.right - clip.R, clip.T - r.top, r.bottom - clip.B);
        const inScroller = !!p.closest('.chat-log, .search-results, .drawer-body, [data-scroll]');
        const fsz = parseFloat(cs(p).fontSize) || 16;
        if (cut > 1.5 && !(deco && cut <= Math.max(4, fsz * .2)) && !inScroller) out.clipV.push({el: path(p), glyphCut: Math.round(cut), deco, txt: n.textContent.trim().slice(0, 40)});
      }
      if (!fixed && !deco && vis2) lines.push({r: {l: r.left, t: r.top + scrollY, rr: r.right, b: r.bottom + scrollY}, p, n});
    }
  }
  // 4) наложение текста на текст
  lines.sort((a, b) => a.r.t - b.r.t);
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i];
    for (let j = i + 1; j < lines.length; j++) {
      const b = lines[j]; if (b.r.t >= a.r.b) break;
      if (a.n === b.n) continue;
      const iw = Math.min(a.r.rr, b.r.rr) - Math.max(a.r.l, b.r.l);
      const ih = Math.min(a.r.b, b.r.b) - Math.max(a.r.t, b.r.t);
      const minH = Math.min(a.r.b - a.r.t, b.r.b - b.r.t);
      if (iw > 3 && ih > Math.max(4, minH * .35)) {
        out.overlap.push({a: path(a.p), at: a.n.textContent.trim().slice(0, 30), b: path(b.p), bt: b.n.textContent.trim().slice(0, 30), iw: Math.round(iw), ih: Math.round(ih)});
        if (out.overlap.length > 40) break;
      }
    }
    if (out.overlap.length > 40) break;
  }
  // 5) наложение кнопок/ссылок
  const ctl = vis.filter(el => el.matches('a[href],button,input:not([type=hidden]),select,textarea,[role=tab]') && !isFixed(el));
  const cr = [];
  ctl.forEach(el => [...el.getClientRects()].forEach(r => { if (r.width > 1 && r.height > 1) cr.push({el, l: r.left, t: r.top + scrollY, r: r.right, b: r.bottom + scrollY}); }));
  for (let i = 0; i < cr.length; i++) for (let j = i + 1; j < cr.length; j++) {
    const a = cr[i], b = cr[j];
    if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const iw = Math.min(a.r, b.r) - Math.max(a.l, b.l), ih = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    if (iw > 2 && ih > 2) { const ca = clipOf(a.el, false), cb = clipOf(b.el, false); if (a.r < ca.L || a.l > ca.R || b.r < cb.L || b.l > cb.R) continue; out.ctlOverlap.push({a: path(a.el), b: path(b.el), iw: Math.round(iw), ih: Math.round(ih)}); }
  }
  // 6) горизонтальные полосы прокрутки, где часть содержимого спрятана за краем
  out.hscroll = vis.filter(el => ['auto','scroll'].includes(cs(el).overflowX) && el.scrollWidth > el.clientWidth + 2 && !el.closest('.marquee, .chat-log, pre, .map-full, .gl-map, .map-box, .pg-table'))   // .pg-table: широкие таблицы прежнего сайта листаются внутри рамки
    .map(el => ({el: path(el), sw: el.scrollWidth, cw: el.clientWidth}));
  // 7) плавающие кнопки поверх элементов управления первого экрана
  out.fixedOver = [];
  if (scrollY < 2) {
    const home = !location.hash || location.hash.startsWith('#home');
    const fx = vis.filter(el => el.matches('a[href],button') && (cs(el).position === 'fixed' || el.closest('.fab-dock')) && (home || !el.closest('.fab-dock')));
    const under = ctl.filter(el => { const r = el.getBoundingClientRect(); return r.top < H && r.bottom > 0; });
    for (const f of fx) { const a = f.getBoundingClientRect();
      for (const u of under) { const b = u.getBoundingClientRect();
        const iw = Math.min(a.right, b.right) - Math.max(a.left, b.left), ih = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (iw > 2 && ih > 2) out.fixedOver.push({a: path(f), b: path(u), iw: Math.round(iw), ih: Math.round(ih)}); } }
  }
  out.fonts = [...document.fonts].map(f => f.family.replace(/"/g, '') + ' ' + f.weight + ' ' + f.status);
  // дедупликация
  for (const k of ['off', 'clipH', 'clipV', 'textOut', 'overlap', 'ctlOverlap', 'fixedOver', 'hscroll']) {
    const seen = new Set(); out[k] = out[k].filter(x => { const key = JSON.stringify(x.el || x.a) + (x.b || '') + (x.txt || ''); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 25);
  }
  return out;
}
"""

async def open_route(pg, route):
    if route.startswith('@'):
        await pg.evaluate("location.hash = 'home'"); await pg.wait_for_timeout(250)
        if route == '@search':
            await pg.click('.nav-search'); await pg.fill('#search-q', 'Риддер' if LANG != 'en' else 'Ridder'); await pg.wait_for_timeout(400)
        elif route == '@chat':
            await pg.evaluate("document.querySelector('#fab').click()"); await pg.wait_for_timeout(250)
            await pg.evaluate("q => { const i = document.querySelector('#chat-input'); i.value = q; document.querySelector('#chat-form').requestSubmit(); }",
                              {'ru': 'Как получить архивную справку о стаже?', 'kz': 'Еңбек өтілі туралы анықтаманы қалай алуға болады?', 'en': 'How do I get an archive certificate?'}[LANG])
            await pg.wait_for_timeout(900)
        elif route == '@drawer':
            await pg.evaluate("document.querySelector('#side-tab').click()"); await pg.wait_for_timeout(400)
        elif route == '@a11y':
            await pg.click('[data-act="a11y-toggle"]'); await pg.wait_for_timeout(300)
        elif route == '@admin':
            await pg.evaluate("location.hash = 'admin'"); await pg.wait_for_timeout(500)
    else:
        await pg.evaluate("h => { location.hash = h; }", route); await pg.wait_for_timeout(900 if route.split('/')[0].split('?')[0] in ('catalog', 'memory', 'expo') else 450)
        await pg.evaluate("window.scrollTo(0,0)")

async def close_overlays(pg):
    await pg.keyboard.press('Escape'); await pg.wait_for_timeout(120)
    await pg.evaluate("""() => { document.querySelectorAll('[data-act=chat-close],[data-act=drawer-close]').forEach(b => { if (b.offsetParent) b.click(); });
      const p = document.querySelector('#a11y-panel'); if (p && !p.hidden) document.querySelector('[data-act="a11y-toggle"]').click(); }""")
    await pg.wait_for_timeout(150)

async def run_combo(b, scheme, fs, widths, results):
    ctx = await b.new_context(viewport={'width': widths[0], 'height': 860}, locale={'ru': 'ru-RU', 'kz': 'kk-KZ', 'en': 'en-US'}[LANG], reduced_motion='reduce')
    prefs = {'lang': LANG, 'fs': fs, 'scheme': scheme, 'spacing': False, 'panel': False, 'autoSpeak': False}
    await ctx.add_init_script(f"try{{localStorage.setItem('arhvko_prefs', {json.dumps(json.dumps(prefs))})}}catch(e){{}}")
    pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.clock.set_fixed_time('2026-11-10T06:20:00Z')
    await pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    await pg.goto(U + '#home'); await pg.wait_for_timeout(1500)
    for w in widths:
        await pg.set_viewport_size({'width': w, 'height': 860 if w >= 600 else 780})
        await pg.wait_for_timeout(300)
        for route in ROUTES:
            try:
                await open_route(pg, route)
                res = await pg.evaluate(CHECK)
            except Exception as e:
                res = {'error': str(e)[:300]}
            key = f'{LANG}|{scheme or "dark"}|fs{fs}|{w}|{route}'
            bad = {k: v for k, v in res.items() if k not in ('fonts', 'docOver') and v}
            if res.get('docOver', 0) > 0: bad['docOver'] = res['docOver']
            if any('loaded' not in f for f in res.get('fonts', [])): bad['fonts'] = res['fonts']
            if bad: results[key] = bad
            if route.startswith('@'): await close_overlays(pg)
    results[f'{LANG}|{scheme or "dark"}|fs{fs}|errors'] = errs
    await ctx.close()

async def main():
    global LANG
    results = {}
    async with async_playwright() as p:
        kw = {'executable_path': os.environ['CHROME_PATH']} if os.environ.get('CHROME_PATH') else {}
        b = await p.chromium.launch(args=['--no-sandbox'], **kw)
        for LANG in LANGS:
            await run_combo(b, '', 0, WIDTHS, results)
            for scheme, fs, ws in EXTRA:
                await run_combo(b, scheme, fs, ws, results)
        await b.close()
    issues = {k: v for k, v in results.items() if not k.endswith('errors')}
    errs = {k: v for k, v in results.items() if k.endswith('errors') and v}
    (ROOT / 'tests' / 'layout-report.json').write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding='utf-8')
    total = len(ROUTES) * (len(WIDTHS) + sum(len(w) for _, _, w in EXTRA)) * len(LANGS)
    print(f'Проверено экранов: {total}. С замечаниями: {len(issues)}. Ошибок JS: {sum(len(v) for v in errs.values())}.')
    for k, v in list(issues.items())[:15]:
        print(' -', k, json.dumps(v, ensure_ascii=False)[:220])
    return 1 if issues or errs else 0

try:
    code = asyncio.run(main())
finally:
    srv.terminate()
sys.exit(code)
