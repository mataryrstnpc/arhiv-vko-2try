"""Все альбомы фотогалереи прежнего сайта в SITE.galleryAlbums.

Запуск из папки arhiv-vko:
  python tools/build_gallery.py ../content/site-ready/gallery.json .
  python dev/build.py

Фото берутся по номеру со старого сайта через server.js (/old/ph/{id}) и сохраняются в data/old-cache.
Подписи — с прежнего сайта (gallery.json). Обложки 6 альбомов, уже сжатые в img/gallery/<slug>/t.jpg, сохраняются.
"""
import json, sys
from pathlib import Path

GAL = Path(sys.argv[1])
SITE_DIR = Path(sys.argv[2])
ORDER = [48, 36, 37, 38, 39, 45, 42, 40, 41, 43, 44, 47, 49, 50, 51, 52, 53, 59, 60, 61, 62]   # порядок на прежнем сайте

albums = json.loads(GAL.read_text(encoding='utf-8'))
cj = SITE_DIR / 'dev' / 'content.js'
head, body = cj.read_text(encoding='utf-8').split('=', 1)
site = json.loads(body.strip().rstrip(';'))
norm = lambda s: ''.join(ch for ch in (s or '').lower() if ch.isalnum())
old_th = {norm((a.get('t') or {}).get('ru')): a.get('th') for a in site.get('galleryAlbums', []) if a.get('th')}

rank = {aid: i for i, aid in enumerate(ORDER)}
out = []
for a in sorted(albums, key=lambda x: rank.get(x['album_id'], 999)):
    ph = []
    for p in a['photos']:
        c = {k: v.strip() for k, v in (p.get('caption') or {}).items() if v and v.strip()}
        if c.get('kk') == c.get('ru'): c.pop('kk', None)
        ph.append({'s': f"old/ph/{p['id']}", **({'c': c} if c else {})})
    if not ph: continue
    t = {k: v for k, v in a['title'].items() if v}
    out.append({'id': a['album_id'], 't': t, 'n': len(ph), 'th': old_th.get(norm(t.get('ru'))) or ph[0]['s'], 'ph': ph})

site['galleryAlbums'] = out
site['albums'] = [a['t'].get('ru') for a in out]
cj.write_text(head + '= ' + json.dumps(site, ensure_ascii=False, separators=(',', ':')) + ';', encoding='utf-8')
print('albums', len(out), 'photos', sum(a['n'] for a in out), 'captions', sum(1 for a in out for p in a['ph'] if 'c' in p),
      'local covers', sum(1 for a in out if a['th'].startswith('img/')))
