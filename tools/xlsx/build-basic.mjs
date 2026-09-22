// בונה את "תרגול XLOOKUP - חוברת בסיס.xlsx".
// שלוש תחנות + גיליון פתיחה + פתרונות, עם בדיקה עצמית בכל תחנה.
// מוסכמת הצבעים זהה לזו של "מבצע 5787": כחול = נתון קבוע, צהוב = כאן כותבים.

import ExcelJS from 'exceljs';
import path from 'path';

const OUT = process.argv[2];

// ---------- פלטה ומוסכמות ----------
const BLUE = 'FFDCE9F7';   // נתון קבוע
const BLUE_TXT = 'FF1F4E79';
const YELLOW = 'FFFFF2CC'; // כאן כותבים
const HEAD = 'FF4472C4';
const HEAD_TXT = 'FFFFFFFF';
const GREY = 'FFF2F2F2';
const GREEN = 'FFE2EFDA';

const wb = new ExcelJS.Workbook();
wb.creator = 'לומדת XLOOKUP — מידע ונתונים';
wb.calcProperties.fullCalcOnLoad = true; // כדי שהנוסחאות יחושבו מיד בפתיחה

const thin = { style: 'thin', color: { argb: 'FFBFBFBF' } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

function fill(cell, argb) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function assertFree(ws, row, span) {
  for (let c = 1; c <= span; c++) {
    const v = ws.getCell(row, c).value;
    if (v !== null && v !== undefined && v !== '') {
      throw new Error(`מיזוג בשורה ${row} (עד עמודה ${span}) בגיליון "${ws.name}" היה דורס את ${ws.getCell(row, c).address} = ${JSON.stringify(v)}`);
    }
  }
}

function title(ws, row, text, span = 10) {
  assertFree(ws, row, span);
  ws.mergeCells(row, 1, row, span);
  const c = ws.getCell(row, 1);
  c.value = text;
  c.font = { bold: true, size: 16, color: { argb: BLUE_TXT } };
  c.alignment = { horizontal: 'right', vertical: 'middle' };
  ws.getRow(row).height = 26;
}

function note(ws, row, text, span = 10, color = 'FF404040') {
  assertFree(ws, row, span);
  ws.mergeCells(row, 1, row, span);
  const c = ws.getCell(row, 1);
  c.value = text;
  c.font = { size: 11, color: { argb: color } };
  c.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };
}

function headerRow(ws, row, startCol, labels) {
  labels.forEach((label, i) => {
    const c = ws.getCell(row, startCol + i);
    c.value = label;
    c.font = { bold: true, color: { argb: HEAD_TXT }, size: 11 };
    fill(c, HEAD);
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = border;
  });
  ws.getRow(row).height = 28;
}

function dataCell(ws, row, col, value, opts = {}) {
  const c = ws.getCell(row, col);
  c.value = value;
  c.border = border;
  c.alignment = { horizontal: opts.align || 'center', vertical: 'middle' };
  if (opts.numFmt) c.numFmt = opts.numFmt;
  if (opts.kind === 'given') { fill(c, BLUE); c.font = { color: { argb: BLUE_TXT }, bold: true }; }
  if (opts.kind === 'write') fill(c, YELLOW);
  if (opts.kind === 'calc') fill(c, GREEN);
  return c;
}

function newSheet(name, widths) {
  const ws = wb.addWorksheet(name, {
    views: [{ rightToLeft: true, showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  });
  widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  return ws;
}

// ============================================================
// גיליון 0 — התחלה כאן
// ============================================================
const intro = newSheet('🏁 התחלה כאן', [4, 26, 26, 22, 18, 18, 18, 18]);
title(intro, 2, '🔧 תרגול XLOOKUP — חוברת בסיס');
note(intro, 3, 'מידע ונתונים · כיתה יא · שלוש תחנות, בסדר הזה. כל תחנה בודקת את עצמה.');

intro.getRow(5).height = 8;
headerRow(intro, 6, 2, ['תחנה', 'מה מתרגלים', 'מתי']);
const stations = [
  ['תחנה 1 — מחסן החלפים 🔧', 'חיפוש מדויק: שם, מחיר ומדף לפי מק"ט', 'אחרי פרק 2 בלומדה'],
  ['תחנה 2 — מדרגות הבונוס 💰', 'חיפוש לא מדויק: אחוז בונוס לפי מכירות', 'אחרי פרק 3 בלומדה'],
  ['תחנה 3 — הטבלה ההפוכה 🔄', 'עמודת התשובה לפני עמודת החיפוש', 'רשות — למי שרוצה עוד'],
];
stations.forEach((s, i) => {
  s.forEach((v, j) => dataCell(intro, 7 + i, 2 + j, v, { align: j === 0 ? 'right' : 'right' }));
  intro.getRow(7 + i).height = 22;
});

note(intro, 12, '🔑  מקרא הצבעים', 8, BLUE_TXT);
fill(intro.getCell(13, 2), BLUE);
intro.getCell(13, 2).border = border;
intro.getCell(13, 3).value = 'נתון קבוע — לא נוגעים';
intro.getCell(13, 3).alignment = { horizontal: 'right' };
fill(intro.getCell(14, 2), YELLOW);
intro.getCell(14, 2).border = border;
intro.getCell(14, 3).value = 'כאן, ורק כאן, כותבים נוסחה';
intro.getCell(14, 3).alignment = { horizontal: 'right' };
fill(intro.getCell(15, 2), GREEN);
intro.getCell(15, 2).border = border;
intro.getCell(15, 3).value = 'מחושב אוטומטית — בדיקה עצמית';
intro.getCell(15, 3).alignment = { horizontal: 'right' };

note(intro, 17, '💡  תזכורת לפני שמתחילים: כותבים את הנוסחה בשורה הראשונה, מקבעים את הטווחים ב-F4, וגוררים למטה.');
note(intro, 18, '⚠️  XLOOKUP קיימת ב-Microsoft 365 וב-Excel 2021 ומעלה. אם מופיע ‎#NAME?‎ — הגרסה ישנה מדי, והנוסחה שלכן דווקא תקינה.');

// ============================================================
// תחנה 1 — מחסן החלפים (חיפוש מדויק)
// ============================================================
const PARTS = [
  ['M-101', 'פילטר שמן', 45, 'A1'],
  ['M-102', 'פלאגים (סט)', 120, 'A2'],
  ['B-200', 'רפידות בלם', 180, 'B1'],
  ['B-205', 'דיסק בלם', 260, 'B2'],
  ['L-300', 'נורה ראשית', 35, 'C1'],
  ['L-310', 'נורת איתות', 18, 'C2'],
  ['F-400', 'מסנן אוויר', 62, 'D1'],
  ['F-410', 'מסנן דלק', 88, 'D2'],
  ['W-500', 'מגב קדמי', 40, 'E1'],
  ['W-505', 'מגב אחורי', 30, 'E2'],
  ['T-600', 'צמיג 15 אינץ׳', 410, 'F1'],
  ['T-610', 'צמיג 16 אינץ׳', 520, 'F2'],
];
const ASKED1 = ['F-410', 'T-600', 'W-505'];

const s1 = newSheet('תחנה 1 - מחסן החלפים', [14, 20, 14, 12, 18, 3, 14, 20, 16, 14, 3, 16, 12, 10]);
title(s1, 1, '🔧 תחנה 1 — מחסן החלפים (חיפוש מדויק)');
note(s1, 2, 'במוסך הוקלדו שלושה מק"טים. משכו לכל אחד את שם החלק, המחיר והמדף — מתוך בסיס הנתונים שמשמאל.');
note(s1, 3, 'כותבים נוסחה אחת בשורה 7, מקבעים את הטווחים (F4), וגוררים למטה עד שורה 9.');

headerRow(s1, 6, 1, ['מק"ט', 'שם חלק', 'מחיר ליחידה', 'מדף', 'בדיקה']);
headerRow(s1, 6, 7, ['מק"ט', 'שם חלק', 'מחיר ליחידה', 'מדף במחסן']);
s1.getCell(5, 7).value = 'בסיס הנתונים — מחסן החלפים';
s1.getCell(5, 7).font = { bold: true, color: { argb: BLUE_TXT } };
s1.getCell(5, 1).value = 'אזור העבודה';
s1.getCell(5, 1).font = { bold: true, color: { argb: BLUE_TXT } };

PARTS.forEach((p, i) => {
  const r = 7 + i;
  dataCell(s1, r, 7, p[0], { kind: 'given' });
  dataCell(s1, r, 8, p[1], { kind: 'given', align: 'right' });
  dataCell(s1, r, 9, p[2], { kind: 'given', numFmt: '#,##0 ₪' });
  dataCell(s1, r, 10, p[3], { kind: 'given' });
});

ASKED1.forEach((code, i) => {
  const r = 7 + i;
  const src = PARTS.find((p) => p[0] === code);
  dataCell(s1, r, 1, code, { kind: 'given' });
  dataCell(s1, r, 2, null, { kind: 'write', align: 'right' });
  dataCell(s1, r, 3, null, { kind: 'write', numFmt: '#,##0 ₪' });
  dataCell(s1, r, 4, null, { kind: 'write' });
  // מפתח נסתר לבדיקה העצמית
  s1.getCell(r, 12).value = src[1];
  s1.getCell(r, 13).value = src[2];
  s1.getCell(r, 14).value = src[3];
  dataCell(s1, r, 5, {
    formula: `IF(COUNTA(B${r}:D${r})=0,"",IF(AND(B${r}=L${r},C${r}=M${r},D${r}=N${r}),"✔ נכון","✖ צריך תיקון"))`,
  }, { kind: 'calc' });
});
[12, 13, 14].forEach((c) => { s1.getColumn(c).hidden = true; });

s1.getCell(11, 1).value = 'סכום המחירים:';
s1.getCell(11, 1).font = { bold: true };
s1.getCell(11, 1).alignment = { horizontal: 'right' };
dataCell(s1, 11, 3, { formula: 'IF(COUNT(C7:C9)<3,"",SUM(C7:C9))' }, { kind: 'calc', numFmt: '#,##0 ₪' });
note(s1, 12, '☝️ את המספר הזה מקלידים בלומדה, ביחידה "תחנה 1: מחסן החלפים".', 5);

note(s1, 20, '💡 רמז: "מה מחפשים" הוא תא בודד (A7). "איפה מחפשים" ו"מה מחזירים" הם עמודות — אחת כל אחת, לא כל הטבלה.', 10);

// ============================================================
// תחנה 2 — מדרגות הבונוס (חיפוש לא מדויק)
// ============================================================
const TIERS = [[0, 0], [5000, 0.03], [10000, 0.05], [20000, 0.08], [50000, 0.12]];
const STAFF = [['דני', 7500], ['יעל', 22000], ['רון', 4200], ['שרה', 51000]];

const s2 = newSheet('תחנה 2 - מדרגות הבונוס', [14, 18, 14, 16, 18, 3, 20, 14, 3, 12, 12]);
title(s2, 1, '💰 תחנה 2 — מדרגות הבונוס (חיפוש לא מדויק)');
note(s2, 2, 'לכל עובד סכום מכירות חודשי. משכו את אחוז הבונוס מטבלת המדרגות, ואז חשבו את הבונוס בשקלים.');
note(s2, 3, '⚠️ שימו לב: סכום המכירות המדויק לא מופיע בטבלת המדרגות — ובכוונה. צריך "את המדרגה שמתחת".');

s2.getCell(5, 1).value = 'אזור העבודה';
s2.getCell(5, 1).font = { bold: true, color: { argb: BLUE_TXT } };
s2.getCell(5, 7).value = 'טבלת המדרגות';
s2.getCell(5, 7).font = { bold: true, color: { argb: BLUE_TXT } };

headerRow(s2, 6, 1, ['שם עובד', 'סך מכירות החודש', 'אחוז בונוס', 'בונוס בשקלים', 'בדיקה']);
headerRow(s2, 6, 7, ['סכום מכירות (מ-)', 'אחוז בונוס']);

TIERS.forEach((t, i) => {
  const r = 7 + i;
  dataCell(s2, r, 7, t[0], { kind: 'given', numFmt: '#,##0 ₪' });
  dataCell(s2, r, 8, t[1], { kind: 'given', numFmt: '0%' });
});

function tierPct(sales) {
  let best = 0;
  for (const [from, pct] of TIERS) if (from <= sales) best = pct;
  return best;
}

STAFF.forEach(([name, sales], i) => {
  const r = 7 + i;
  dataCell(s2, r, 1, name, { kind: 'given', align: 'right' });
  dataCell(s2, r, 2, sales, { kind: 'given', numFmt: '#,##0 ₪' });
  dataCell(s2, r, 3, null, { kind: 'write', numFmt: '0%' });
  dataCell(s2, r, 4, null, { kind: 'write', numFmt: '#,##0 ₪' });
  s2.getCell(r, 10).value = tierPct(sales);
  s2.getCell(r, 11).value = sales * tierPct(sales);
  dataCell(s2, r, 5, {
    formula: `IF(COUNT(C${r}:D${r})=0,"",IF(AND(ROUND(C${r},4)=ROUND(J${r},4),ROUND(D${r},2)=ROUND(K${r},2)),"✔ נכון","✖ צריך תיקון"))`,
  }, { kind: 'calc' });
});
[10, 11].forEach((c) => { s2.getColumn(c).hidden = true; });

s2.getCell(12, 1).value = 'סך כל הבונוסים:';
s2.getCell(12, 1).font = { bold: true };
s2.getCell(12, 1).alignment = { horizontal: 'right' };
dataCell(s2, 12, 4, { formula: 'IF(COUNT(D7:D10)<4,"",SUM(D7:D10))' }, { kind: 'calc', numFmt: '#,##0 ₪' });
note(s2, 13, '☝️ את המספר הזה מקלידים בלומדה, ביחידה "תחנה 2: מדרגות הבונוס".', 5);

note(s2, 15, '💡 רמז 1: אחרי "מה מחזירים" צריך שני פסיקים ברצף, ורק אז ‎-1‎. הפסיק השני מסמן מקום שדילגנו עליו.', 10);
note(s2, 16, '💡 רמז 2: מינוס = יורדים למדרגה שמתחת. בלי המינוס לא תהיה שגיאה — רק תשובות שגויות, וזה הרבה יותר גרוע.', 10);
note(s2, 17, '🔍 בדיקה בעיניים: קחו את רון (4,200) — הוא לא עבר את 5,000, אז מגיע לו 0%. אם יצא לכן 3% — יש מינוס חסר.', 10);

// ============================================================
// תחנה 3 — הטבלה ההפוכה
// ============================================================
const EMPLOYEES = [
  ['שיווק', '01/03/2022', 10234, 'דניאל כהן', 14500],
  ['כספים', '15/07/2021', 10567, 'מיכל לוי', 17200],
  ['לוגיסטיקה', '02/01/2023', 10891, 'רועי גולן', 11800],
  ['שיווק', '20/11/2020', 11045, 'נועה שחר', 15600],
  ['הנהלה', '05/05/2019', 11302, 'יוסי אבני', 24000],
];
const ASKED3 = [10891, 11302, 10567];

const s3 = newSheet('תחנה 3 - הטבלה ההפוכה', [14, 18, 16, 14, 18, 16, 3, 14, 14, 14, 18, 14, 3, 16, 14, 14, 14]);
title(s3, 1, '🔄 תחנה 3 — הטבלה ההפוכה (רשות)', 12);
note(s3, 2, 'שימו לב לסדר העמודות בבסיס הנתונים: המחלקה נמצאת לפני מספר העובד. ב-VLOOKUP זה היה אתגר. כאן — לא.', 12);
note(s3, 3, 'עלות שנתית כוללת = שכר חודשי × 12 × 1.3 (מקדם עלות סוציאלית).', 12);

s3.getCell(5, 1).value = 'אזור העבודה';
s3.getCell(5, 1).font = { bold: true, color: { argb: BLUE_TXT } };
s3.getCell(5, 8).value = 'בסיס הנתונים — עובדי החברה';
s3.getCell(5, 8).font = { bold: true, color: { argb: BLUE_TXT } };

headerRow(s3, 6, 1, ['מספר עובד', 'שם מלא', 'מחלקה', 'שכר ברוטו', 'עלות שנתית כוללת', 'בדיקה']);
headerRow(s3, 6, 8, ['מחלקה', 'תאריך קליטה', 'מספר עובד', 'שם מלא', 'שכר ברוטו']);

EMPLOYEES.forEach((e, i) => {
  const r = 7 + i;
  dataCell(s3, r, 8, e[0], { kind: 'given', align: 'right' });
  dataCell(s3, r, 9, e[1], { kind: 'given' });
  dataCell(s3, r, 10, e[2], { kind: 'given' });
  dataCell(s3, r, 11, e[3], { kind: 'given', align: 'right' });
  dataCell(s3, r, 12, e[4], { kind: 'given', numFmt: '#,##0 ₪' });
});

ASKED3.forEach((num, i) => {
  const r = 7 + i;
  const src = EMPLOYEES.find((e) => e[2] === num);
  dataCell(s3, r, 1, num, { kind: 'given' });
  dataCell(s3, r, 2, null, { kind: 'write', align: 'right' });
  dataCell(s3, r, 3, null, { kind: 'write', align: 'right' });
  dataCell(s3, r, 4, null, { kind: 'write', numFmt: '#,##0 ₪' });
  dataCell(s3, r, 5, null, { kind: 'write', numFmt: '#,##0 ₪' });
  s3.getCell(r, 14).value = src[3];
  s3.getCell(r, 15).value = src[0];
  s3.getCell(r, 16).value = src[4];
  s3.getCell(r, 17).value = src[4] * 12 * 1.3;
  dataCell(s3, r, 6, {
    formula: `IF(COUNTA(B${r}:E${r})=0,"",IF(AND(B${r}=N${r},C${r}=O${r},D${r}=P${r},ROUND(E${r},2)=ROUND(Q${r},2)),"✔ נכון","✖ צריך תיקון"))`,
  }, { kind: 'calc' });
});
[14, 15, 16, 17].forEach((c) => { s3.getColumn(c).hidden = true; });

note(s3, 12, '💡 שלוש העמודות הראשונות הן XLOOKUP רגיל. העמודה הרביעית היא חישוב על התוצאה: ‎=D7*12*1.3‎', 12);

// ============================================================
// פתרונות
// ============================================================
const sol = newSheet('✅ פתרונות', [4, 16, 46, 40]);
title(sol, 1, '✅ פתרונות — תרגול XLOOKUP', 4);
note(sol, 2, 'לפתוח רק אחרי שניסיתם. נוסחה שמבינים שווה יותר מנוסחה שמעתיקים.', 4);

let sr = 4;
function solBlock(heading, rows) {
  sol.mergeCells(sr, 2, sr, 4);
  const c = sol.getCell(sr, 2);
  c.value = heading;
  c.font = { bold: true, size: 13, color: { argb: HEAD_TXT } };
  fill(c, HEAD);
  c.alignment = { horizontal: 'right', vertical: 'middle' };
  sol.getRow(sr).height = 22;
  sr++;
  headerRow(sol, sr, 2, ['תא', 'הנוסחה', 'מה היא אומרת']);
  sr++;
  rows.forEach(([cell, formula, expl]) => {
    dataCell(sol, sr, 2, cell);
    const f = dataCell(sol, sr, 3, formula, { align: 'left' });
    f.font = { name: 'Consolas', size: 10 };
    fill(f, GREY);
    dataCell(sol, sr, 4, expl, { align: 'right' });
    sol.getRow(sr).height = 20;
    sr++;
  });
  sr++;
}

solBlock('תחנה 1 — מחסן החלפים (חיפוש מדויק)', [
  ['B7', '=XLOOKUP(A7,$G$7:$G$18,$H$7:$H$18)', 'המק"ט שבתא A7, בעמודת המק"טים, מחזיר את שם החלק'],
  ['C7', '=XLOOKUP(A7,$G$7:$G$18,$I$7:$I$18)', 'אותו דבר — רק שעמודת התשובה היא המחיר'],
  ['D7', '=XLOOKUP(A7,$G$7:$G$18,$J$7:$J$18)', 'ושוב — הפעם עמודת המדף'],
  ['', 'סכום המחירים = 528 ₪', '88 + 410 + 30'],
]);

solBlock('תחנה 2 — מדרגות הבונוס (חיפוש לא מדויק)', [
  ['C7', '=XLOOKUP(B7,$G$7:$G$11,$H$7:$H$11,,-1)', 'שני פסיקים, ואז ‎-1‎ — "המדרגה שמתחת"'],
  ['D7', '=B7*C7', 'מכירות כפול אחוז הבונוס'],
  ['', 'דני 3% · יעל 8% · רון 0% · שרה 12%', 'סך כל הבונוסים = 8,105 ₪'],
]);

solBlock('תחנה 3 — הטבלה ההפוכה', [
  ['B7', '=XLOOKUP(A7,$J$7:$J$11,$K$7:$K$11)', 'מספר עובד ← שם מלא'],
  ['C7', '=XLOOKUP(A7,$J$7:$J$11,$H$7:$H$11)', 'מספר עובד ← מחלקה. עמודת התשובה לפני עמודת החיפוש — ועובד'],
  ['D7', '=XLOOKUP(A7,$J$7:$J$11,$L$7:$L$11)', 'מספר עובד ← שכר ברוטו'],
  ['E7', '=D7*12*1.3', 'עלות שנתית כוללת'],
]);

await wb.xlsx.writeFile(OUT);
console.log('✔ נוצר:', path.basename(OUT));
