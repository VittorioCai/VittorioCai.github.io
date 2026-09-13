import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const dir = new URL('./public/deutsch-woerter/', `file://${process.cwd()}/`);
const parts = Array.from({ length: 17 }, (_, i) =>
  readFileSync(new URL(`cards-chunk-${String(i).padStart(2, '0')}`, dir), 'utf8').trim(),
);
const compressed = Buffer.from(parts.join(''), 'base64');
const fullRows = JSON.parse(gunzipSync(compressed).toString('utf8'));
if (!Array.isArray(fullRows) || fullRows.length !== 5452) {
  throw new Error(`Vocabulary build failed: expected 5452 rows, got ${Array.isArray(fullRows) ? fullRows.length : 'invalid data'}`);
}
const rows = fullRows.map((c) => [
  c.level,
  String(c.chapter),
  c.de,
  c.en,
  c.grammar || '',
  c.example || '',
]);
writeFileSync(new URL('cards.json', dir), JSON.stringify(rows));
console.log(`Generated public/deutsch-woerter/cards.json with ${rows.length} rows.`);
