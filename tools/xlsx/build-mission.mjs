// בונה את "מבצע XLOOKUP - תיק 404.xlsx" — חדר בריחה בשש תחנות.
//
// ⚠️ הקוד הסופי הוא 402917, והוא גם התשובה לשאלה ביחידה xl-ch5-mission
// בלומדה. כל שינוי בספרות כאן מחייב עדכון גם שם.
//
// כל נוסחת XLOOKUP שנכתבת לתוך תא חייבת להיכתב כ-_xlfn.XLOOKUP — כך היא
// נשמרת בפורמט xlsx. בלי הקידומת אקסל מציג ‎#NAME?‎ (זה נבדק בפועל).

import ExcelJS from 'exceljs';
import path from 'path';

const OUT = process.argv[2];

const BLUE = 'FFDCE9F7', BLUE_TXT = 'FF1F4E79';
const YELLOW = 'FFFFF2CC', HEAD = 'FF2F5597', HEAD_TXT = 'FFFFFFFF';
const GREEN = 'FFE2EFDA', DARK = 'FF1F3864', GOLD = 'FFFFE699';

const wb = new ExcelJS.Workbook();
wb.creator = 'לומדת XLOOKUP — מידע ונתונים';
wb.calcProperties.fullCalcOnLoad = true;

const thin = { style: 'thin', color: { argb: 'FFBFBFBF' } };
const border = { top: thin, left: thin, bottom: thin, right: thin };
const fill = (c, argb) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } }; };

// מיזוג דורס בשקט כל מה שכבר בטווח — לכן בודקים לפני.
function assertFree(ws, row, span) {
  for (let c = 1; c <= span; c++) {
    const v = ws.getCell(row, c).value;
    if (v !== null && v !== undefined && v !== '') {
      throw new Error(`מיזוג בשורה ${row} בגיליון "${ws.name}" היה דורס את ${ws.getCell(row, c).address}`);
    }
  }
}

function title(ws, row, text, span = 8, bg) {
  assertFree(ws, row, span);
  ws.mergeCells(row, 1, row, span);
  const c = ws.getCell(row, 1);
  c.value = text;
  c.font = { bold: true, size: 15, color: { argb: bg ? HEAD_TXT : DARK } };
  if (bg) fill(c, bg);
  c.alignment = { horizontal: 'right', vertical: 'middle' };
  ws.getRow(row).height = 28;
}

function note(ws, row, text, span = 8, opts = {}) {
  assertFree(ws, row, span);
  ws.mergeCells(row, 1, row, span);
  const c = ws.getCell(row, 1);
  c.value = text;
  c.font = { size: 11, color: { argb: opts.color || 'FF404040' }, bold: !!opts.bold };
  c.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };
  if (opts.height) ws.getRow(row).height = opts.height;
  if (opts.bg) fill(c, opts.bg);
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
  ws.getRow(row).height = 26;
}

function cell(ws, row, col, value, opts = {}) {
  const c = ws.getCell(row, col);
  c.value = value;
  c.border = border;
  c.alignment = { horizontal: opts.align || 'center', vertical: 'middle' };
  if (opts.numFmt) c.numFmt = opts.numFmt;
  if (opts.kind === 'given') { fill(c, BLUE); c.font = { color: { argb: BLUE_TXT }, bold: true }; }
  if (opts.kind === 'write') { fill(c, YELLOW); c.font = { bold: true, size: 12 }; }
  if (opts.kind === 'calc') fill(c, GREEN);
  return c;
}

function sheet(name, widths) {
  const ws = wb.addWorksheet(name, {
    views: [{ rightToLeft: true, showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  });
  widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  return ws;
}

// ============================================================
// הנתונים
// ============================================================
const ORDERS = [
  [401, 2044, 'K-118', 3], [402, 3187, 'K-305', 1], [403, 5521, 'K-220', 12],
  [404, 3187, 'K-220', 6], [405, 1290, 'K-410', 2], [406, 4763, 'K-118', 8],
  [407, 2044, 'K-512', 5], [408, 5521, 'K-305', 4], [409, 6108, 'K-220', 1],
  [410, 1290, 'K-410', 9], [411, 4763, 'K-512', 2], [412, 6108, 'K-118', 7],
];
// שימו לב לסדר: שם הלקוח *לפני* מספר הלקוח — זה מה שהופך את תחנה 3
// ל"טבלה הפוכה".
const CUSTOMERS = [
  ['דנה אלמוג', 1290, 6407, 'תל אביב'],
  ['יואב נחום', 2044, 3109, 'חיפה'],
  ['רותם אביב', 3187, 4520, 'רעננה'],
  ['שירה בן-דוד', 4763, 8410, 'באר שבע'],
  ['אלון כרמי', 5521, 1220, 'צפת'],
  ['מאיה שלו', 6108, 6120, 'תל אביב'],
];
const PRODUCTS = [
  ['K-118', 'מקלדת אלחוטית', 120, 0.8],
  ['K-220', 'רמקול שולחני', 52, 3],
  ['K-305', 'עכבר ארגונומי', 89, 0.4],
  ['K-410', 'מצלמת רשת', 210, 0.5],
  ['K-512', 'מעמד למחשב נייד', 145, 1.2],
];
const SHIPPING = [[0, 15], [5, 25], [10, 39], [25, 60], [50, 95]];
const ZONES = [[1000, 'צפון', 11], [3000, 'חיפה והסביבה', 22], [4000, 'מרכז', 33], [6000, 'תל אביב', 44], [8000, 'דרום', 55]];

// התשובות, והספרה שכל אחת חושפת
const STATIONS = [
  { n: 1, sheet: 'תחנה 1', answer: 3187, digit: 4, points: 15, numeric: true },
  { n: 2, sheet: 'תחנה 2', answer: 52, digit: 0, points: 15, numeric: true },
  { n: 3, sheet: 'תחנה 3', answer: 'רותם אביב', digit: 2, points: 15, numeric: false },
  { n: 4, sheet: 'תחנה 4', answer: 39, digit: 9, points: 15, numeric: true },
  { n: 5, sheet: 'תחנה 5', answer: 33, digit: 1, points: 15, numeric: true },
  { n: 6, sheet: 'תחנה 6', answer: 351, digit: 7, points: 25, numeric: true },
];
const CODE = STATIONS.map((s) => s.digit).join(''); // 402917

// ============================================================
// גיליון: לוח בקרה
// ============================================================
const cb = sheet('🕵️ לוח בקרה', [34, 16, 16, 14, 26, 10, 10, 10]);
title(cb, 1, '🕵️ מבצע XLOOKUP — תיק 404: ההזמנה שנעלמה', 8, HEAD);
note(cb, 2, 'הזמנה מספר 404 נעלמה ממערכת ההזמנות. הלקוח מתקשר, המנהלת לוחצת, ואף אחד לא מצליח לשחזר מה בדיוק הוזמן, על ידי מי, ולאן זה היה אמור להגיע.', 8, { height: 30 });
note(cb, 3, 'כל המידע עדיין קיים — אבל הוא מפוזר על פני חמש טבלאות נפרדות. וזה, במקרה, בדיוק מה שאתן יודעות לעשות.', 8, { height: 22 });
note(cb, 4, 'כל תשובה נכונה חושפת ספרה אחת מקוד בן שש ספרות. שש ספרות — והתיק נפתח.', 8, { bold: true, color: BLUE_TXT });

headerRow(cb, 6, 1, ['התחנה', 'סוג החיפוש', 'סטטוס', 'ניקוד', 'הספרה שנחשפה']);
const STATION_TITLES = [
  ['1️⃣  מי הלקוח שביצע את ההזמנה', 'מדויק'],
  ['2️⃣  מה הוזמן, ומה המחיר', 'מדויק'],
  ['3️⃣  השם שמאחורי המספר', 'מדויק — טבלה הפוכה'],
  ['4️⃣  דמי משלוח לפי משקל', 'לא מדויק'],
  ['5️⃣  אזור החלוקה לפי מיקוד', 'לא מדויק'],
  ['6️⃣  הסכום הסופי', 'הצלבה'],
];
STATIONS.forEach((s, i) => {
  const r = 7 + i;
  const ans = `'${s.sheet}'!B6`;
  const empty = `${ans}=""`;
  const ok = s.numeric ? `${ans}=${s.answer}` : `TRIM(${ans})="${s.answer}"`;
  cell(cb, r, 1, STATION_TITLES[i][0], { kind: 'given', align: 'right' });
  cell(cb, r, 2, STATION_TITLES[i][1], { align: 'right' });
  cell(cb, r, 3, { formula: `IF(${empty},"⬜ טרם",IF(${ok},"✔ הושלם","✖ בדקו שוב"))` }, { kind: 'calc' });
  cell(cb, r, 4, { formula: `IF(AND(NOT(${empty}),${ok}),${s.points},0)` }, { kind: 'calc' });
  cell(cb, r, 5, { formula: `IF(AND(NOT(${empty}),${ok}),"${s.digit}","🔒")` }, { kind: 'calc' });
  cb.getCell(r, 5).font = { bold: true, size: 16, color: { argb: DARK } };
  cb.getRow(r).height = 24;
});

cell(cb, 13, 1, 'סה"כ ניקוד (מתוך 100)', { kind: 'given', align: 'right' });
cell(cb, 13, 4, { formula: 'SUM(D7:D12)' }, { kind: 'calc' });
cb.getCell(13, 4).font = { bold: true, size: 14 };

title(cb, 15, '🔐 הקוד שנחשף עד כה', 8);
// שרשור עם & ולא CONCAT: CONCAT היא פונקציה חדשה שנשמרת כ-_xlfn.CONCAT,
// ובלי הקידומת אקסל מציג #NAME?. האופרטור & עובד בכל גרסה, בלי מלכודות.
const codeFormula = `IF(COUNTIF(E7:E12,"🔒")>0,IF(COUNTIF(E7:E12,"🔒")=1,"עדיין נעול — ספרה אחת חסרה","עדיין נעול — " & COUNTIF(E7:E12,"🔒") & " ספרות חסרות"),E7&E8&E9&E10&E11&E12)`;
cb.mergeCells(16, 1, 16, 4);
const codeCell = cb.getCell(16, 1);
codeCell.value = { formula: codeFormula };
fill(codeCell, GOLD);
codeCell.font = { bold: true, size: 22, color: { argb: DARK } };
codeCell.alignment = { horizontal: 'center', vertical: 'middle' };
codeCell.border = border;
cb.getRow(16).height = 40;

note(cb, 18, '🔑  כחול = נתון קבוע, אל תיגעו.   צהוב = כאן ואך ורק כאן כותבים.   ירוק = מתעדכן לבד.', 8, { color: BLUE_TXT });
note(cb, 19, '💡  נתקעתן? יש גיליון "עזרה" עם רמז עדין לכל תחנה. להשתמש בו זה לא לרמות — זה חלק מהמשחק.', 8);
note(cb, 20, '⚠️  תחנה 6 מסתמכת על תחנות 2 ו-4. אם היא לא מסתדרת — חזרו אחורה ובדקו אותן.', 8);

// ============================================================
// גיליון: נתוני המערכת
// ============================================================
const data = sheet('📁 נתוני המערכת', [22, 20, 20, 18, 16, 16]);
title(data, 1, '📁 נתוני המערכת — כל הראיות במקום אחד', 6, HEAD);
note(data, 2, 'חמש טבלאות. שימו לב לסדר העמודות בכל אחת — הוא לא תמיד מה שהייתן מצפות.', 6);

const RANGES = {}; // שם טבלה → { first, last } (שורות הנתונים בפועל)

function table(startRow, heading, headers, rows, formats = [], key) {
  note(data, startRow, heading, 6, { bold: true, color: BLUE_TXT });
  headerRow(data, startRow + 1, 1, headers);
  rows.forEach((row, i) => {
    row.forEach((v, j) => cell(data, startRow + 2 + i, 1 + j, v, {
      kind: 'given',
      align: typeof v === 'string' ? 'right' : 'center',
      numFmt: formats[j],
    }));
  });
  if (key) RANGES[key] = { first: startRow + 2, last: startRow + 1 + rows.length };
  return startRow + 2 + rows.length + 1;
}

// טווח עמודה בגיליון הנתונים, לפי שם טבלה. col הוא אות העמודה.
const DATA_SHEET = "'📁 נתוני המערכת'";
const rng = (key, col) => `${DATA_SHEET}!${col}${RANGES[key].first}:${col}${RANGES[key].last}`;

let r = 4;
r = table(r, 'טבלה א׳ — הזמנות', ['מספר הזמנה', 'מספר לקוח', 'מק"ט', 'כמות'], ORDERS, [], 'orders');
r = table(r, 'טבלה ב׳ — לקוחות', ['שם לקוח', 'מספר לקוח', 'מיקוד', 'עיר'], CUSTOMERS, [], 'customers');
r = table(r, 'טבלה ג׳ — מוצרים', ['מק"ט', 'שם מוצר', 'מחיר ליחידה', 'משקל ליחידה (ק"ג)'], PRODUCTS, [, , '#,##0 ₪', '0.0'], 'products');
r = table(r, 'טבלה ד׳ — מדרגות דמי משלוח', ['משקל מ- (ק"ג)', 'דמי משלוח'], SHIPPING, ['0', '#,##0 ₪'], 'shipping');
r = table(r, 'טבלה ה׳ — אזורי חלוקה לפי מיקוד', ['מיקוד מ-', 'אזור', 'קוד אזור'], ZONES, [], 'zones');

// ============================================================
// גיליונות התחנות
// ============================================================
function stationSheet(cfg) {
  const { n, lines, answerLabel, answer, numeric, numFmt, listOptions } = cfg;
  const ws = sheet(`תחנה ${n}`, [32, 22, 26, 16, 16, 8]);
  title(ws, 1, cfg.title, 5, HEAD);
  lines.forEach((line, i) => note(ws, 2 + i, line, 5, { height: line.length > 90 ? 30 : 20 }));

  const row = 6;
  ws.getCell(row, 1).value = answerLabel;
  ws.getCell(row, 1).font = { bold: true, size: 12 };
  ws.getCell(row, 1).alignment = { horizontal: 'right', vertical: 'middle' };
  ws.getRow(row).height = 30;

  const ansCell = cell(ws, row, 2, null, { kind: 'write', numFmt });
  if (listOptions) {
    ansCell.dataValidation = {
      type: 'list', allowBlank: true,
      formulae: [`"${listOptions.join(',')}"`],
      showErrorMessage: true, errorTitle: 'בחרו מהרשימה', error: 'יש לבחור אחד מהשמות ברשימה.',
    };
  }

  const ok = numeric ? `B${row}=${answer}` : `TRIM(B${row})="${answer}"`;
  cell(ws, row, 3, {
    formula: `IF(B${row}="","⬜ ממתין לתשובה",IF(${ok},"✔ נכון — ספרה נחשפה!","✖ לא מדויק, נסו שוב"))`,
  }, { kind: 'calc' });

  note(ws, 8, '💡 נתקעתן? גיליון "עזרה" ← תחנה ' + n, 5);
  note(ws, 9, '↩️ חזרה ל"לוח בקרה" כדי לראות אילו ספרות כבר נחשפו.', 5);
  return ws;
}

stationSheet({
  n: 1,
  title: '1️⃣ תחנה 1 — מי הלקוח שביצע את ההזמנה',
  lines: [
    'הדבר הראשון שרוצים לדעת על הזמנה 404: מי בכלל הזמין אותה.',
    'עברו לגיליון "נתוני המערכת", טבלה א׳ (הזמנות), וחפשו את הזמנה 404. מה מספר הלקוח שרשום לידה?',
    'כתבו נוסחת XLOOKUP בתא הצהוב — לא להעתיק בעיניים. זו כל הנקודה.',
  ],
  answerLabel: 'מספר הלקוח של הזמנה 404:',
  answer: 3187, numeric: true,
});

stationSheet({
  n: 2,
  title: '2️⃣ תחנה 2 — מה הוזמן, ומה המחיר',
  lines: [
    'עכשיו נגלה מה הלקוח בכלל הזמין. בטבלה א׳ רשום מק"ט לכל הזמנה, ובטבלה ג׳ (מוצרים) רשום מה כל מק"ט אומר.',
    'זה דורש שני חיפושים בשרשרת: קודם המק"ט של הזמנה 404, ואז המחיר של אותו מק"ט.',
    'אפשר לעשות את זה בשני שלבים (בשני תאים), או בנוסחה אחת מקוננת — שתיהן תשובות נכונות.',
  ],
  answerLabel: 'המחיר ליחידה של המוצר שהוזמן (₪):',
  answer: 52, numeric: true, numFmt: '#,##0 ₪',
});

stationSheet({
  n: 3,
  title: '3️⃣ תחנה 3 — השם שמאחורי המספר',
  lines: [
    'יש לנו מספר לקוח (מתחנה 1), ואנחנו רוצים שם.',
    '⚠️ שימו לב לטבלה ב׳ (לקוחות): עמודת השם נמצאת *לפני* עמודת מספר הלקוח. ב-VLOOKUP זה היה בלתי אפשרי בלי טריקים.',
    'ב-XLOOKUP לא צריך לעשות שום דבר מיוחד — רק לסמן את עמודת החיפוש ואת עמודת התשובה, בסדר הנכון.',
  ],
  answerLabel: 'שם הלקוח של הזמנה 404:',
  answer: 'רותם אביב', numeric: false,
  listOptions: CUSTOMERS.map((c) => c[0]),
});

stationSheet({
  n: 4,
  title: '4️⃣ תחנה 4 — דמי משלוח לפי משקל',
  lines: [
    'כדי לשחזר את ההזמנה צריך גם את דמי המשלוח. הם נקבעים לפי המשקל הכולל של החבילה.',
    'המשקל הכולל = הכמות שהוזמנה × משקל היחידה של המוצר (שתיהן בנתוני המערכת).',
    '⚠️ המשקל שיצא לכן כמעט בוודאות לא מופיע בטבלת המדרגות — ובכוונה. זו בדיוק המדרגה שמתחת.',
  ],
  answerLabel: 'דמי המשלוח של הזמנה 404 (₪):',
  answer: 39, numeric: true, numFmt: '#,##0 ₪',
});

stationSheet({
  n: 5,
  title: '5️⃣ תחנה 5 — אזור החלוקה',
  lines: [
    'לאן החבילה הייתה אמורה להגיע? לכל לקוח יש מיקוד (טבלה ב׳), ולכל טווח מיקודים יש קוד אזור (טבלה ה׳).',
    'קחו את המיקוד של הלקוח שמצאתן, ומצאו את קוד האזור שלו.',
    '⚠️ גם כאן: המיקוד המדויק לא מופיע בטבלת האזורים. הטבלה מגדירה נקודות פתיחה של טווחים.',
  ],
  answerLabel: 'קוד אזור החלוקה:',
  answer: 33, numeric: true,
});

stationSheet({
  n: 6,
  title: '6️⃣ תחנה 6 — הסכום הסופי',
  lines: [
    'התחנה האחרונה מחברת את הכול. הסכום שהלקוח היה אמור לשלם:',
    '(כמות × מחיר ליחידה) + דמי משלוח',
    'כל שלושת הנתונים כבר בידיכן — שניים מהם מתחנות קודמות. אם המספר לא מסתדר, בדקו קודם את תחנות 2 ו-4.',
  ],
  answerLabel: 'הסכום הכולל של הזמנה 404 (₪):',
  answer: 351, numeric: true, numFmt: '#,##0 ₪',
});

// ============================================================
// גיליון: פתיחת התיק
// ============================================================
const open = sheet('🔓 פתיחת התיק', [30, 24, 30, 16, 16]);
title(open, 1, '🔓 פתיחת התיק', 5, HEAD);
note(open, 2, 'כשכל שש הספרות נחשפו בלוח הבקרה — הקלידו כאן את הקוד המלא.', 5);

open.getCell(4, 1).value = 'הקוד בן שש הספרות:';
open.getCell(4, 1).font = { bold: true, size: 13 };
open.getCell(4, 1).alignment = { horizontal: 'right', vertical: 'middle' };
open.getRow(4).height = 34;
const codeInput = cell(open, 4, 2, null, { kind: 'write', numFmt: '000000' });
codeInput.font = { bold: true, size: 18 };

open.mergeCells(6, 1, 9, 5);
const reveal = open.getCell(6, 1);
reveal.value = {
  formula: `IF(B4="","🔒 התיק עדיין נעול. השלימו את שש התחנות, וקחו את הקוד מלוח הבקרה.",` +
    `IF(B4=${CODE},"🎉 התיק נפתח!" & CHAR(10) & CHAR(10) & ` +
    `"הזמנה 404: רותם אביב, 6 יחידות רמקול שולחני, 351 ₪ כולל משלוח, לאזור מרכז (קוד 33)." & CHAR(10) & ` +
    `"ההזמנה לא נעלמה — היא מעולם לא נמחקה. המידע היה שם כל הזמן, רק מפוזר על פני חמש טבלאות." & CHAR(10) & CHAR(10) & ` +
    `"וזה בדיוק מה ש-XLOOKUP עושה: לוקחת מידע שמפוזר, ומחזירה אותו לשורה אחת שאפשר לקרוא.",` +
    `"❌ הקוד שגוי. בדקו בלוח הבקרה אילו תחנות עדיין מסומנות ✖."))`,
};
fill(reveal, GREEN);
reveal.font = { bold: true, size: 13, color: { argb: DARK } };
reveal.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };
reveal.border = border;

note(open, 11, '🏆 סיימתן? חזרו ללומדה, ליחידה "תיק 404 — חדר הבריחה", והקלידו שם את הקוד.', 5, { bold: true, color: BLUE_TXT });

// ============================================================
// גיליון: עזרה
// ============================================================
const help = sheet('💡 עזרה', [14, 62, 26]);
title(help, 1, '💡 עזרה ורמזים', 3, HEAD);
note(help, 2, 'קודם נסו לבד. אם עדיין קשה — הרמז העדין כאן נועד לכוון, לא לפתור.', 3);
headerRow(help, 4, 1, ['תחנה', 'רמז עדין', 'איפה להסתכל']);
const HINTS = [
  ['1', 'מה מחפשים = מספר ההזמנה (404). איפה מחפשים = עמודת מספרי ההזמנה. מה מחזירים = עמודת מספרי הלקוח.', 'טבלה א׳'],
  ['2', 'שני שלבים: קודם מצאו את המק"ט של הזמנה 404, ואז חפשו את המק"ט הזה בטבלת המוצרים. אפשר להשתמש בתא ביניים.', 'טבלאות א׳ + ג׳'],
  ['3', 'עמודת החיפוש היא עמודת מספר הלקוח. עמודת התשובה היא עמודת השם — שנמצאת לפניה. זה לא משנה כלום.', 'טבלה ב׳'],
  ['4', 'קודם חשבו את המשקל: כמות × משקל ליחידה. רק אחר כך חפשו במדרגות — עם שני פסיקים ו-1- בסוף.', 'טבלאות א׳ + ג׳ + ד׳'],
  ['5', 'המיקוד נמצא בטבלת הלקוחות, לפי מספר הלקוח שמצאתן. ואז חיפוש לא מדויק בטבלת האזורים.', 'טבלאות ב׳ + ה׳'],
  ['6', 'זה כבר לא חיפוש — זה חשבון. כמות × מחיר, ועוד דמי משלוח.', 'התשובות שלכן מתחנות 2 ו-4'],
];
HINTS.forEach((h, i) => {
  const rr = 5 + i;
  cell(help, rr, 1, h[0], { kind: 'given' });
  cell(help, rr, 2, h[1], { align: 'right' });
  cell(help, rr, 3, h[2], { align: 'right' });
  help.getRow(rr).height = 34;
});

note(help, 12, '🛠️ תקלות נפוצות', 3, { bold: true, color: BLUE_TXT });
note(help, 13, '‎#N/A‎ — לא נמצא. בדקו שהערך שאתן מחפשות באמת קיים בעמודה שסימנתן, ושאין רווח מיותר.', 3);
note(help, 14, '‎#VALUE!‎ — עמודת החיפוש ועמודת התשובה לא באותו גודל. השוו את מספרי השורות בנוסחה.', 3);
note(help, 15, '‎#NAME?‎ — גרסת האקסל לא מכירה את XLOOKUP (2019 ומטה). הנוסחה שלכן תקינה; נסו בגוגל שיטס.', 3);
note(help, 16, 'תוצאה סבירה אבל שגויה במדרגות — כנראה נכתב 1 במקום ‎-1‎, או שחסר פסיק.', 3);

// ============================================================
// גיליון: פתרונות
// ============================================================
const sol = sheet('✅ פתרונות', [12, 58, 22]);
title(sol, 1, '✅ פתרונות — תיק 404', 3, HEAD);
note(sol, 2, 'למורה, ולמי שסיימה. הנוסחאות מניחות שהנתונים בגיליון "נתוני המערכת".', 3);
headerRow(sol, 4, 1, ['תחנה', 'נוסחה לדוגמה', 'התשובה']);
const SOLUTIONS = [
  ['1', `=XLOOKUP(404,${rng('orders', 'A')},${rng('orders', 'B')})`, '3187'],
  ['2', `=XLOOKUP(XLOOKUP(404,${rng('orders', 'A')},${rng('orders', 'C')}),${rng('products', 'A')},${rng('products', 'C')})`, '52 ₪'],
  ['3', `=XLOOKUP(3187,${rng('customers', 'B')},${rng('customers', 'A')})`, 'רותם אביב'],
  ['4', `משקל = 6 × 3 = 18 ק"ג   ואז:   =XLOOKUP(18,${rng('shipping', 'A')},${rng('shipping', 'B')},,-1)`, '39 ₪'],
  ['5', `מיקוד 4520   ואז:   =XLOOKUP(4520,${rng('zones', 'A')},${rng('zones', 'C')},,-1)`, '33'],
  ['6', '‎=6*52+39‎', '351 ₪'],
];
SOLUTIONS.forEach((s, i) => {
  const rr = 5 + i;
  cell(sol, rr, 1, s[0], { kind: 'given' });
  const f = cell(sol, rr, 2, s[1], { align: 'left' });
  f.font = { name: 'Consolas', size: 9 };
  cell(sol, rr, 3, s[2], { kind: 'calc' });
  sol.getRow(rr).height = 30;
});
note(sol, 12, `🔐 הקוד הסופי: ${CODE}`, 3, { bold: true, color: BLUE_TXT });
note(sol, 13, 'אותו קוד הוא התשובה לשאלה בלומדה, ביחידה "תיק 404 — חדר הבריחה".', 3);
note(sol, 14, 'ניקוד: תחנות 1-5 — 15 נקודות כל אחת. תחנה 6 — 25 נקודות. סה"כ 100.', 3);

await wb.xlsx.writeFile(OUT);
console.log('✔ נוצר:', path.basename(OUT), '| הקוד:', CODE);
