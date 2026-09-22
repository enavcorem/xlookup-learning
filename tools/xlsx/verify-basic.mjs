// אימות החוברת: ממלאים את התאים הצהובים בנוסחאות הפתרון, נותנים
// ל-LibreOffice לחשב, וקוראים חזרה. כך בודקים בבת אחת גם שהפתרון עובד
// וגם שמפתח הבדיקה העצמית נכון — ולא רק שהקובץ נוצר.
import ExcelJS from 'exceljs';

const [, , SRC, SOLVED] = process.argv;

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(SRC);

const s1 = wb.getWorksheet('תחנה 1 - מחסן החלפים');
for (let r = 7; r <= 9; r++) {
  s1.getCell(`B${r}`).value = { formula: `_xlfn.XLOOKUP(A${r},$G$7:$G$18,$H$7:$H$18)` };
  s1.getCell(`C${r}`).value = { formula: `_xlfn.XLOOKUP(A${r},$G$7:$G$18,$I$7:$I$18)` };
  s1.getCell(`D${r}`).value = { formula: `_xlfn.XLOOKUP(A${r},$G$7:$G$18,$J$7:$J$18)` };
}

const s2 = wb.getWorksheet('תחנה 2 - מדרגות הבונוס');
for (let r = 7; r <= 10; r++) {
  s2.getCell(`C${r}`).value = { formula: `_xlfn.XLOOKUP(B${r},$G$7:$G$11,$H$7:$H$11,,-1)` };
  s2.getCell(`D${r}`).value = { formula: `B${r}*C${r}` };
}

const s3 = wb.getWorksheet('תחנה 3 - הטבלה ההפוכה');
for (let r = 7; r <= 9; r++) {
  s3.getCell(`B${r}`).value = { formula: `_xlfn.XLOOKUP(A${r},$J$7:$J$11,$K$7:$K$11)` };
  s3.getCell(`C${r}`).value = { formula: `_xlfn.XLOOKUP(A${r},$J$7:$J$11,$H$7:$H$11)` };
  s3.getCell(`D${r}`).value = { formula: `_xlfn.XLOOKUP(A${r},$J$7:$J$11,$L$7:$L$11)` };
  s3.getCell(`E${r}`).value = { formula: `D${r}*12*1.3` };
}

wb.calcProperties.fullCalcOnLoad = true;
await wb.xlsx.writeFile(SOLVED);
console.log('✔ נוצר עותק פתור');
