import ExcelJS from 'exceljs';
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(process.argv[2]);
function v(ws, addr) {
  let c = wb.getWorksheet(ws).getCell(addr).value;
  while (c && typeof c === 'object') {
    if ('result' in c) c = c.result;
    else if ('richText' in c) c = c.richText.map(t => t.text).join('');
    else if ('text' in c) c = c.text;
    else return '(לא חושב) ' + (c.formula || JSON.stringify(c)).slice(0, 40);
  }
  return c;
}
const CB = '🕵️ לוח בקרה';
console.log('--- לוח בקרה ---');
for (let r = 7; r <= 12; r++) console.log(`תחנה ${r - 6}: ${v(CB,'C'+r)} | ניקוד ${v(CB,'D'+r)} | ספרה ${v(CB,'E'+r)}`);
console.log('ניקוד כולל: ' + v(CB, 'D13'));
console.log('הקוד: ' + v(CB, 'A16'));
console.log('--- משוב בתחנות ---');
for (let n = 1; n <= 6; n++) console.log(`תחנה ${n}: ${v('תחנה ' + n, 'C6')}`);
console.log('--- פתיחת התיק ---');
console.log(String(v('🔓 פתיחת התיק', 'A6')).split('\n')[0]);
