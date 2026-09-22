// ===== בלוקים נוספים של לומדת XLOOKUP =====
// כולם "טיפשים": מקבלים אובייקט מקובץ תוכן ומחזירים אלמנט. אין כאן מצב,
// אין רשת, ואין תלות במנוע מלבד ההרשמה ב-index.js.

import { el, esc, formulaHtml, legendHtml } from './shared.js';

// ---------- formula: נוסחה צבועה עומדת בפני עצמה ----------
// { type: 'formula', value, lookup, ret, matchMode, note, legend }
export function renderFormula(block) {
  const wrap = el('div', 'block');
  const f = el('div', 'xl-formula');
  f.innerHTML = formulaHtml({
    value: block.value,
    lookup: block.lookup,
    ret: block.ret,
    matchMode: block.matchMode,
  });
  wrap.appendChild(f);
  if (block.legend !== false) wrap.insertAdjacentHTML('beforeend', legendHtml());
  if (block.note) wrap.appendChild(el('div', 'xl-formula-note', block.note));
  return wrap;
}

// ---------- two-tables: שתי טבלאות והמזהה שמחבר ביניהן ----------
// { type: 'two-tables', left: {caption, headers, rows, keyCol}, right: {...}, link }
function miniTable(side) {
  const box = el('div', 'xl-two-side');
  if (side.caption) box.appendChild(el('div', 'xl-two-caption', esc(side.caption)));
  const t = el('table', 'content-table');
  if (side.headers) {
    const thead = el('thead');
    const tr = el('tr');
    side.headers.forEach((h, c) => tr.appendChild(el('th', c === side.keyCol ? 'key-col' : null, esc(h))));
    thead.appendChild(tr);
    t.appendChild(thead);
  }
  const tbody = el('tbody');
  (side.rows || []).forEach((row) => {
    const tr = el('tr');
    row.forEach((cell, c) => tr.appendChild(el('td', c === side.keyCol ? 'key-col' : null, esc(cell))));
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);
  box.appendChild(t);
  return box;
}

export function renderTwoTables(block) {
  const wrap = el('div', 'block xl-two');
  wrap.appendChild(miniTable(block.left || {}));
  wrap.appendChild(el('div', 'xl-two-link', block.link || '🔗'));
  wrap.appendChild(miniTable(block.right || {}));
  return wrap;
}

// ---------- timeline: ציר הזמן של פונקציות החיפוש ----------
// { type: 'timeline', items: [{ year, name, body, hero }] }
export function renderTimeline(block) {
  const wrap = el('div', 'block xl-timeline');
  (block.items || []).forEach((it) => {
    const row = el('div', `xl-tl-item${it.hero ? ' is-hero' : ''}`);
    row.appendChild(el('div', 'xl-tl-year', esc(it.year)));
    const right = el('div');
    right.appendChild(el('div', 'xl-tl-name', esc(it.name)));
    if (it.body) right.appendChild(el('div', 'xl-tl-body', it.body));
    row.appendChild(right);
    wrap.appendChild(row);
  });
  return wrap;
}

// ---------- compare: מה היה צריך פעם מול מה שצריך היום ----------
// { type: 'compare', oldTitle, oldItems: [], newTitle, newItems: [] }
export function renderCompare(block) {
  const wrap = el('div', 'block xl-compare');

  const oldSide = el('div', 'xl-compare-side old');
  oldSide.appendChild(el('div', 'xl-compare-head', esc(block.oldTitle || 'VLOOKUP')));
  const oldUl = el('ul');
  (block.oldItems || []).forEach((t) => oldUl.appendChild(el('li', null, t)));
  oldSide.appendChild(oldUl);

  const newSide = el('div', 'xl-compare-side new');
  newSide.appendChild(el('div', 'xl-compare-head', esc(block.newTitle || 'XLOOKUP')));
  const newUl = el('ul');
  (block.newItems || []).forEach((t) => newUl.appendChild(el('li', null, t)));
  newSide.appendChild(newUl);

  wrap.appendChild(oldSide);
  wrap.appendChild(newSide);
  return wrap;
}

// ---------- error-demo: שגיאה, למה היא קרתה, ואיך מתקנים ----------
// { type: 'error-demo', code: '#N/A', meaning, causes: [], fix }
export function renderErrorDemo(block) {
  const wrap = el('div', 'block xl-error');
  wrap.appendChild(el('div', 'xl-error-head', esc(block.code || '#N/A')));
  if (block.meaning) {
    wrap.appendChild(el('div', 'xl-error-row', `<b>מה אקסל מנסה להגיד:</b> ${block.meaning}`));
  }
  (block.causes || []).forEach((c) => {
    wrap.appendChild(el('div', 'xl-error-row', `🔸 ${c}`));
  });
  if (block.fix) {
    wrap.appendChild(el('div', 'xl-error-row fix', `<b>✅ איך מתקנים:</b> ${block.fix}`));
  }
  return wrap;
}

// ---------- download: כפתור הורדה לקובץ תרגול ----------
// { type: 'download', file: 'תרגול 1 - מחסן החלפים.xlsx', label: '...', note: '...' }
//
// הקבצים יושבים ב-downloads/ שליד index.html. גיליונות הפתרונות *אינם*
// שם בכוונה — הם בקובץ נפרד למורה, מחוץ לאתר, כדי שאי אפשר יהיה להוריד
// אותם מכאן.
export function renderDownload(block) {
  const wrap = el('div', 'block xl-download');
  const a = el('a', 'xl-download-btn');
  a.href = 'downloads/' + encodeURIComponent(block.file);
  a.setAttribute('download', block.file);
  a.innerHTML = `
    <span class="xl-download-icon">⬇️</span>
    <span class="xl-download-text">
      <span class="xl-download-label">${esc(block.label || block.file)}</span>
      <span class="xl-download-note">${esc(block.note || 'קובץ אקסל · נפתח גם בגוגל שיטס')}</span>
    </span>`;
  wrap.appendChild(a);
  return wrap;
}
