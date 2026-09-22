import ExcelJS from 'exceljs';
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(process.argv[2]);
function v(ws, addr) {
  let c = wb.getWorksheet(ws).getCell(addr).value;
  while (c && typeof c === 'object') {
    if ('result' in c) c = c.result;
    else if ('richText' in c) c = c.richText.map(t => t.text).join('');
    else if ('text' in c) c = c.text;
    else { c = JSON.stringify(c); break; }
  }
  return c;
}
const S1 = 'תחנה 1 - מחסן החלפים', S2 = 'תחנה 2 - מדרגות הבונוס', S3 = 'תחנה 3 - הטבלה ההפוכה';
console.log('--- תחנה 1 ---');
for (let r = 7; r <= 9; r++) console.log(`שורה ${r}: ${v(S1,'B'+r)} | ${v(S1,'C'+r)} | ${v(S1,'D'+r)} → ${v(S1,'E'+r)}`);
console.log('סכום המחירים: ' + v(S1, 'C11'));
console.log('--- תחנה 2 ---');
for (let r = 7; r <= 10; r++) console.log(`שורה ${r}: ${v(S2,'C'+r)} | ${v(S2,'D'+r)} → ${v(S2,'E'+r)}`);
console.log('סך הבונוסים: ' + v(S2, 'D12'));
console.log('--- תחנה 3 ---');
for (let r = 7; r <= 9; r++) console.log(`שורה ${r}: ${v(S3,'B'+r)} | ${v(S3,'C'+r)} | ${v(S3,'D'+r)} | ${v(S3,'E'+r)} → ${v(S3,'F'+r)}`);
