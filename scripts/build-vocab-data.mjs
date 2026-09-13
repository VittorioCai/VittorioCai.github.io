import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const dir = new URL('./public/deutsch-woerter/', `file://${process.cwd()}/`);
const encoded = readFileSync(new URL('cards.txt', dir), 'utf8').trim();
const compressed = Buffer.from(encoded, 'base64');
const rows = JSON.parse(gunzipSync(compressed).toString('utf8'));
if (!Array.isArray(rows) || rows.length !== 5452) {
  throw new Error(`Vocabulary build failed: expected 5452 rows, got ${Array.isArray(rows) ? rows.length : 'invalid data'}`);
}
writeFileSync(new URL('cards.json', dir), JSON.stringify(rows));
console.log(`Generated public/deutsch-woerter/cards.json with ${rows.length} rows.`);
