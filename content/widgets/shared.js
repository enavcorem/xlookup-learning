// ===== עזרים משותפים לבלוקים של לומדת XLOOKUP =====
// שייך לקורס, לא למנוע. ראו content/widgets/index.js.

export function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

// לכל טקסט שמגיע מנתוני תוכן ומוזרק כ-HTML. קבצי התוכן נכתבים על ידינו,
// אבל עדיף שהמקום היחיד שמרכיב HTML ממחרוזות יברח אותן ממילא.
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// מחזיר את הנוסחה כ-HTML צבוע בשלושת צבעי התפקידים. זה הייצוג היחיד של
// נוסחת XLOOKUP בכל הקורס — בהנפשה, בבלוק formula ובשאלות — כדי שהצבע
// של כל חלק יהיה זהה בכל מקום שבו התלמידה רואה אותו.
export function formulaHtml({ value, lookup, ret, matchMode }) {
  let s = '=XLOOKUP(';
  s += `<span class="p-value">${esc(value)}</span>`;
  s += ',';
  s += `<span class="p-lookup">${esc(lookup)}</span>`;
  s += ',';
  s += `<span class="p-return">${esc(ret)}</span>`;
  if (matchMode === -1 || matchMode === 1) {
    // *שני* פסיקים, וזו כל הנקודה של פרק 3: הראשון סוגר את "מה מחזירים",
    // והשני מסמן את המקום הריק של if_not_found שדילגנו עליו. השני מסומן
    // בנפרד כדי שאפשר יהיה להצביע עליו — זו נקודת הכישלון מספר 1 בפרק.
    s += ',';
    s += '<span class="p-dim" title="כאן היה אמור לבוא if_not_found — דילגנו עליו, ולכן יש שני פסיקים">,</span>';
    s += `<span class="p-mode">${matchMode}</span>`;
  }
  s += ')';
  return s;
}

export function legendHtml() {
  return `<div class="xl-legend">
    <span class="l-value">🔵 מה מחפשים</span>
    <span class="l-lookup">🟠 איפה מחפשים</span>
    <span class="l-return">🟢 מה מחזירים</span>
  </div>`;
}

export const prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (e) { return false; }
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
