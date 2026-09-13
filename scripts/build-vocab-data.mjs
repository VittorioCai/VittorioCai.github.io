import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const dir = new URL('./public/deutsch-woerter/', `file://${process.cwd()}/`);
const parts = Array.from({ length: 8 }, (_, i) =>
  readFileSync(new URL(`cards-mini-${String(i).padStart(2, '0')}.txt`, dir), 'utf8').trim(),
);
const compressed = Buffer.from(parts.join(''), 'base64');
const rows = JSON.parse(gunzipSync(compressed).toString('utf8'));
if (!Array.isArray(rows) || rows.length !== 5452) {
  throw new Error(`Vocabulary build failed: expected 5452 rows, got ${Array.isArray(rows) ? rows.length : 'invalid data'}`);
}
writeFileSync(new URL('cards.json', dir), JSON.stringify(rows));
console.log(`Generated public/deutsch-woerter/cards.json with ${rows.length} rows.`);

const learnUrl = new URL('learn.js', dir);
let learn = readFileSync(learnUrl, 'utf8');
const replaceOnce = (source, from, to, label) => {
  if (!source.includes(from)) throw new Error(`Vocabulary learning patch failed: ${label}`);
  return source.replace(from, to);
};
const replaceAllChecked = (source, from, to, expected, label) => {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`Vocabulary learning patch failed: ${label} (expected ${expected}, got ${count})`);
  return source.split(from).join(to);
};

// Inject the spelling wrong-book feature at build time so the source learning module
// stays readable and the deployed PWA receives the feature as one same-origin script.
if (!learn.includes('WRONGBOOK_ADDON_V1')) {
  const addon = readFileSync(new URL('wrongbook-addon.js', dir), 'utf8').trim();
  learn = replaceOnce(
    learn,
    'const ok=!show&&LspellAccepted(c,v);Lrecord(c,ok,"spell")',
    'const ok=!show&&LspellAccepted(c,v);LwrongSpellResult(c,v,show,ok);Lrecord(c,ok,"spell")',
    'spelling hook',
  );
  learn = replaceOnce(
    learn,
    '{version:3,exportedAt:new Date().toISOString(),quizProgress:progress,learnProgress}',
    '{version:4,exportedAt:new Date().toISOString(),quizProgress:progress,learnProgress,spellingWrongBook:wrongBook}',
    'backup export',
  );
  learn = replaceOnce(
    learn,
    'learnProgress=d.learnProgress||{}}else{',
    'learnProgress=d.learnProgress||{};if(d.spellingWrongBook&&typeof d.spellingWrongBook==="object")wrongBook=d.spellingWrongBook}else{',
    'backup import',
  );
  learn = replaceOnce(
    learn,
    'localStorage.setItem(LEARN_KEY,JSON.stringify(learnProgress));stats();',
    'localStorage.setItem(LEARN_KEY,JSON.stringify(learnProgress));localStorage.setItem(WRONG_KEY,JSON.stringify(wrongBook));stats();',
    'wrong-book persistence after import',
  );
  learn = replaceOnce(
    learn,
    'LbuildShell();Lready();',
    `${addon}\nLbuildShell();LinitWrongBookUI();Lready();`,
    'module initialization',
  );
}

// Extend zero-base learning from A1+A2 to the complete A1+A2+B1 bank.
// A1/A2 keep their Chinese helper glosses; B1 uses the official Klett English gloss
// until a vetted Chinese helper layer is added, without altering German/source fields.
if (!learn.includes('B1_LEARNING_V1')) {
  learn = replaceOnce(
    learn,
    'function Lmeaning(c){return ZH[c.id]||Lclean(c.en)}\nfunction Lenglish(c){return Lclean(c.en)}\nfunction LallLearningCards(){return CARDS.filter(c=>(c.level==="A1"||c.level==="A2")&&ZH[c.id])}',
    'function Lmeaning(c){return ZH[c.id]||Lclean(c.en)}\nfunction Lenglish(c){return Lclean(c.en)}\nfunction LhasZh(c){return !!ZH[c.id]}\nfunction LmeaningMeta(c){return LhasZh(c)?`Klett English: ${Lenglish(c)}`:"B1 · Klett English 主释义"}\nfunction LallLearningCards(){return CARDS.filter(c=>c.level==="A1"||c.level==="A2"||c.level==="B1")}',
    'A1-A2-B1 card scope',
  );
  learn = replaceOnce(
    learn,
    'message||`当前章节 ${cs.length} 个词。每 5 个新词做一次小复习：认识 → 看德语选中文 → 看中文选德语 → 最后才拼写。`',
    'message||`当前章节 ${cs.length} 个词。每 5 个新词做一次小复习：认识 → 看德语认意思 → 看意思认德语 → 最后才拼写。${Lscope().level==="B1"?" B1 已完整加入；当前先使用 Klett English 作为主释义。":""}`',
    'learning landing copy',
  );
  learn = replaceOnce(
    learn,
    '<div class="learnEn">Klett English: ${Lesc(Lenglish(c))}</div>',
    '<div class="learnEn">${Lesc(LmeaningMeta(c))}</div>',
    'intro meaning meta',
  );
  learn = replaceOnce(
    learn,
    '${Lesc(Lmeaning(x))}<div class="small">${Lesc(Lenglish(x))}</div>',
    '${Lesc(Lmeaning(x))}${LhasZh(x)?`<div class="small">${Lesc(Lenglish(x))}</div>`:""}',
    'recognition choice meaning',
  );
  learn = replaceAllChecked(
    learn,
    '<div class="learnEn">${Lesc(Lenglish(c))}</div>',
    '<div class="learnEn">${LhasZh(c)?Lesc(Lenglish(c)):"Klett English"}</div>',
    2,
    'reverse/spell English meta',
  );
  learn = replaceOnce(learn, 'A1 + A2 全章节：先认识意思，再做选择，最后才进入主动回忆与拼写。', 'A1 + A2 + B1 全章节：先认识意思，再做选择，最后才进入主动回忆与拼写。', 'home learning scope copy');
  learn = replaceOnce(learn, '学习进度 · A1 + A2', '学习进度 · A1 + A2 + B1', 'home stats title');
  learn = replaceOnce(learn, '<option value="A2">A2</option></select>', '<option value="A2">A2</option><option value="B1">B1</option></select>', 'B1 level option');
  learn = replaceOnce(
    learn,
    '<b>A1 + A2 已全部加入学习模式，共 3446 个词条。</b> 中文主释义根据 Klett English 释义整理为学习辅助；德语词形、语法信息和 Glossar 原句继续保留原资料。章节之间的学习进度彼此独立，原来 A1 Kapitel 1 的进度也会保留。',
    '<b>A1 + A2 + B1 已全部加入学习模式，共 5452 个词条。</b> A1/A2 保留中文主释义 + Klett English；B1 现已完整加入，并先以 Klett English 作为主释义。德语词形、语法信息和 Glossar 原句继续保留原资料。章节之间的学习进度彼此独立。',
    'coverage copy',
  );
  learn = replaceOnce(learn, '正在准备 A1 + A2', '正在准备 A1 + A2 + B1', 'loading copy');

  const readyStart = learn.indexOf('async function Lready()');
  const readyEnd = learn.indexOf('/* WRONGBOOK_ADDON_V1 */');
  if (readyStart < 0 || readyEnd < readyStart) throw new Error('Vocabulary learning patch failed: Lready boundaries');
  const ready = 'async function Lready(){let meanings;try{const files=["./zh-a1-1-6.json?v=1","./zh-a1-7-12.json?v=1","./zh-a2-1-6.json?v=1","./zh-a2-7-12.json?v=1"];const parts=await Promise.all(files.map(async u=>{const r=await fetch(u,{cache:"no-store"});if(!r.ok)throw new Error(`${u}: HTTP ${r.status}`);return r.json()}));const expected=[1076,888,685,797];parts.forEach((p,i)=>{if(!Array.isArray(p)||p.length!==expected[i])throw new Error(`unexpected meanings in part ${i+1}: ${Array.isArray(p)?p.length:"invalid"}`)});meanings=parts.flat();if(meanings.length!==3446)throw new Error(`unexpected meanings total: ${meanings.length}`)}catch(e){console.error("Chinese gloss load failed",e);return}let n=0;const timer=setInterval(()=>{n++;if(typeof CARDS!=="undefined"&&CARDS.length===5452){clearInterval(timer);const a12=CARDS.filter(c=>c.level==="A1"||c.level==="A2"),b1=CARDS.filter(c=>c.level==="B1");if(a12.length===3446&&b1.length===2006){ZH={};a12.forEach((c,i)=>ZH[c.id]=meanings[i]);LsyncChapters();L$("learnStartBtn").disabled=false;L$("learnStartBtn").textContent="开始学新词";L$("learnReviewBtn").disabled=false;Lstats();LhomeStats()}else{L$("learnStartBtn").textContent=`学习词库未就绪 (${a12.length+b1.length}/5452)`}}else if(n>80){clearInterval(timer);L$("learnStartBtn").textContent="词库未就绪"}},100)}\n';
  learn = learn.slice(0, readyStart) + ready + learn.slice(readyEnd);

  // Keep B1 spelling wrong-book cards readable without duplicating English twice.
  learn = replaceOnce(learn, 'zh:Lmeaning(c),en:Lenglish(c)', 'zh:LhasZh(c)?Lmeaning(c):"",en:Lenglish(c)', 'wrong-book B1 stored meaning');
  learn = replaceOnce(learn, '<div>${Lesc(e.zh)} <span class="wrongMeta">· ${Lesc(e.en)}</span></div>', '<div>${e.zh?`${Lesc(e.zh)} <span class="wrongMeta">· ${Lesc(e.en)}</span>`:Lesc(e.en)}</div>', 'wrong-book B1 list meaning');
  learn = replaceOnce(learn, '<div class="wrongPracticeMeaning">${Lesc(e.zh)}</div><div class="learnEn">${Lesc(e.en)}</div>', '<div class="wrongPracticeMeaning">${Lesc(e.zh||e.en)}</div>${e.zh?`<div class="learnEn">${Lesc(e.en)}</div>`:""}', 'wrong-book B1 practice meaning');

  learn = learn.replace('(()=>{', '(()=>{\n/* B1_LEARNING_V1 */', 1);
}

writeFileSync(learnUrl, learn);
console.log('Prepared public/deutsch-woerter/learn.js with wrong-book and A1-A2-B1 learning mode.');
