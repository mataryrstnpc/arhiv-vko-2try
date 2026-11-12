'use strict';
/*
 * Проверка разбора TIFF и XLSX из dev/formats.js на файлах tests/fixtures (их сделали Pillow и zipfile; ожидаемое — expected.json).
 * Запуск: node tests/formats.js (входит в npm test).
 */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert');
const F = require('../dev/formats.js');
const dir = path.join(__dirname, 'fixtures'), exp = JSON.parse(fs.readFileSync(path.join(dir, 'expected.json'), 'utf8'));
const read = n => fs.readFileSync(path.join(dir, n));
let passed = 0;
async function step(name, fn) { await fn(); passed++; console.log('  ✓ ' + name); }
const rgbOf = r => { const b = Buffer.alloc(r.outW * r.outH * 3); for (let i = 0; i < r.outW * r.outH; i++) { b[i * 3] = r.rgba[i * 4]; b[i * 3 + 1] = r.rgba[i * 4 + 1]; b[i * 3 + 2] = r.rgba[i * 4 + 2]; } return b; };
const sha = b => crypto.createHash('sha256').update(b).digest('hex');

(async () => {
  console.log('Форматы: TIFF и XLSX');
  for (const [name, e] of Object.entries(exp)) {
    if (!name.endsWith('.tif')) continue;
    await step('TIFF ' + name + (e.error ? ' — понятная ошибка' : ''), async () => {
      if (e.error) { await assert.rejects(F.decodeTIFF(read(name), 4000), new RegExp(e.error)); return; }
      const r = await F.decodeTIFF(read(name), Math.max(e.w, e.h));   // без уменьшения: пиксель в пиксель
      assert.strictEqual(r.width, e.w); assert.strictEqual(r.height, e.h); assert.strictEqual(r.outW, e.w);
      const rgb = rgbOf(r);
      if (name === 'gray16-none.tif') {   // 16 бит: берём старший байт (Pillow при переводе в RGB просто обрезает, поэтому считаем сами)
        for (let y = 0; y < e.h; y++) for (let x = 0; x < e.w; x++) { const v = ((x * 2900 + y * 1300) % 65536) >> 8, i = (y * e.w + x) * 3; assert.deepStrictEqual([...rgb.subarray(i, i + 3)], [v, v, v], `пиксель ${x},${y}`); }
      } else assert.strictEqual(sha(rgb), e.sha, `пиксели не совпали: первые ${[...rgb.subarray(0, 6)]}, ожидались ${e.first}`);
    });
  }
  await step('TIFF: уменьшение скана до заданной стороны усреднением', async () => {
    const r = await F.decodeTIFF(read('big-lzw.tif'), 60);
    assert.strictEqual(r.outW, 60); assert.strictEqual(r.outH, 40);
    const rgb = rgbOf(r); assert.ok(rgb.some(v => v > 0) && rgb.some(v => v < 255));
  });
  await step('TIFF: не TIFF — ошибка', async () => { await assert.rejects(F.decodeTIFF(Buffer.from('not a tiff at all'), 100), /не TIFF/); });
  await step('XLSX как из Excel: общие строки, форматированный текст, пропуски, deflate', async () => {
    assert.deepStrictEqual(await F.readXLSX(read('excel-like.xlsx')), exp['excel-like.xlsx'].rows);
  });
  await step('XLSX: запись и чтение обратно (кириллица, казахские буквы, &<>", числа, пустые)', async () => {
    const rows = [['kind', 'title', 'year_from', 'places'], ['doc', 'Ағылшын «тест» & <b>"x"</b>', 1941, 'Өскемен, Риддер'], ['fond', '', 2026, ''], ['doc', 'Строка\nс переносом', '', 'Зайсан']];
    const back = await F.readXLSX(F.writeXLSX(rows, 'Каталог/2026'));
    assert.deepStrictEqual(back, rows.map(r => r.map(v => v === '' ? '' : String(v))).map(r => { while (r.length && r[r.length - 1] === '') r.pop(); return r; }));
  });
  await step('ZIP: контрольная сумма CRC-32 и структура архива', async () => {
    assert.strictEqual(F.crc32(new TextEncoder().encode('123456789')), 0xCBF43926);
    const z = await F.unzip(F.writeXLSX([['a']]));
    for (const n of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml', 'xl/worksheets/sheet1.xml']) assert.ok(z.names.includes(n), n);
  });
  await step('XLSX: не .xlsx — ошибка', async () => { await assert.rejects(F.readXLSX(Buffer.from('kind;title\ndoc;x')), /не файл \.xlsx/); });
  await step('тип файла по первым байтам', async () => {
    assert.strictEqual(F.sniff(read('rgb-none.tif')), 'tif'); assert.strictEqual(F.sniff(read('excel-like.xlsx')), 'zip');
    assert.strictEqual(F.sniff(Buffer.from('%PDF-1.7\n%âãÏÓ\n')), 'pdf'); assert.strictEqual(F.sniff(Buffer.from('<html>hello world</html>')), null);
  });
  console.log(`\nГотово: ${passed} проверок пройдено.`);
})().catch(e => { console.error('\n✗ Ошибка: ' + (e && e.message || e)); process.exit(1); });
