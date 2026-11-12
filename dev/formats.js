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
