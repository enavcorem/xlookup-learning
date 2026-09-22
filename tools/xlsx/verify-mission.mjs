import ExcelJS from 'exceljs';
const [, , SRC, SOLVED, MODE] = process.argv;
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(SRC);

// ממלאים את התאים הצהובים. במצב "wrong" משאירים תחנה אחת שגויה, כדי
// לוודא שלוח הבקרה באמת נועל ספרה ולא רק מציג הכול ירוק.
const answers = { 1: 3187, 2: 52, 3: 'רותם אביב', 4: 39, 5: 33, 6: 351 };
if (MODE === 'wrong') answers[4] = 25; // המדרגה שמתחת, אבל הלא נכונה
for (const [n, a] of Object.entries(answers)) {
  wb.getWorksheet(`תחנה ${n}`).getCell('B6').value = a;
}
if (MODE !== 'wrong') wb.getWorksheet('🔓 פתיחת התיק').getCell('B4').value = 402917;
wb.calcProperties.fullCalcOnLoad = true;
await wb.xlsx.writeFile(SOLVED);
console.log('✔ עותק פתור' + (MODE === 'wrong' ? ' (עם תחנה 4 שגויה)' : ''));
