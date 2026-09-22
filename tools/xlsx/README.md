# הסקריפטים שבנו את חוברות האקסל

שתי החוברות (`תרגול XLOOKUP - חוברת בסיס.xlsx` ו-`מבצע XLOOKUP - תיק 404.xlsx`)
נוצרו מהסקריפטים כאן. **אפשר לגמרי לערוך את החוברות ישירות באקסל** — הסקריפטים
נשמרו למקרה שתרצי לשנות נתונים בכמות, לבנות גרסה נוספת, או להחליף את הקוד הסודי.

## הרצה

```bash
npm install exceljs
node build-basic.mjs "../../../תרגול XLOOKUP - חוברת בסיס.xlsx"
node build-mission.mjs "../../../מבצע XLOOKUP - תיק 404.xlsx"
```

## שלוש מלכודות שהתגלו בבנייה — שווה לדעת אם עורכים

1. **`XLOOKUP` בקובץ xlsx נשמרת כ-`_xlfn.XLOOKUP`.** אם כותבים נוסחה לתוך תא
   מקוד (לא ביד באקסל) בלי הקידומת — אקסל יציג `#NAME?`. אותו דבר לגבי `CONCAT`,
   `TEXTJOIN`, `IFS` וכל פונקציה שנוספה אחרי 2007. לכן קוד המבצע משרשר עם `&`
   ולא עם `CONCAT`.
2. **מיזוג תאים דורס בשקט.** שורת הערה ממוזגת מחקה שורה שלמה מבסיס הנתונים,
   וזה התגלה רק כי הרצנו את החוברת פתורה. לשני הסקריפטים יש `assertFree()`
   שמתפוצץ במקום לדרוס.
3. **טווחי הטבלאות נגזרים מהבנייה** (`RANGES` ב-`build-mission.mjs`) ולא נכתבים
   ביד, אחרת גיליון הפתרונות מצביע על שורות שגויות.

## אימות

```bash
node verify-basic.mjs   <קובץ> solved.xlsx        # ממלא את הפתרונות
node verify-mission.mjs <קובץ> m-ok.xlsx          # כל התשובות נכונות
node verify-mission.mjs <קובץ> m-bad.xlsx wrong   # תחנה אחת שגויה
```

ואז נותנים ל-LibreOffice לחשב, וקוראים חזרה:

```bash
soffice --headless --convert-to xlsx --outdir recalc solved.xlsx
node read-back.mjs recalc/solved.xlsx
node read-mission.mjs recalc/m-ok.xlsx
```

זה מה שתפס את שלוש המלכודות למעלה. שווה להריץ אחרי כל שינוי.

## הקוד הסודי של תיק 404

**402917** — והוא גם התשובה לשאלה בלומדה, ביחידה `xl-ch5-mission`
(`content/ch5/ch5-mission.js`). **משנים את אחד — חייבים לשנות גם את השני.**
