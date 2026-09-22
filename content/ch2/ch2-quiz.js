// מבחן פרק 2. topic על כל שאלה מזין את דוח "נושאים לחיזוק" שאחרי ההגשה,
// וגם את הדשבורד של המורה — לכן הנושאים כאן מנוסחים כמו שהמורה תרצה
// לקרוא אותם ("קיבוע וגרירה", ולא "שאלה 4").

export default {
  title: 'מבחן פרק: החיפוש המדויק',
  passMark: 70,
  questions: [
    {
      type: 'mc',
      topic: 'למה מחברים טבלאות',
      prompt: 'מדוע לא כדאי להעתיק ידנית מחירים מטבלה אחת לשנייה?',
      options: [
        { text: 'כי הערכים המודבקים קופאים בזמן — וכשהמקור מתעדכן, הם נשארים שגויים בשקט', correct: true },
        { text: 'כי זה תופס יותר מקום בקובץ', correct: false },
        { text: 'כי אקסל לא מאפשר להדביק יותר מ-100 שורות', correct: false },
        { text: 'כי אי אפשר למיין טבלה שהודבקה', correct: false },
      ],
      explanation: 'הסכנה האמיתית אינה הזמן שזה לוקח, אלא שהנתון הופך לשגוי בלי שום סימן על המסך.',
    },
    {
      type: 'mc',
      topic: 'המזהה הייחודי',
      prompt: 'איזו עמודה מתאימה לשמש מזהה לחיבור בין טבלת הזמנות לטבלת לקוחות?',
      options: [
        { text: 'מספר לקוח', correct: true },
        { text: 'שם הלקוח', correct: false },
        { text: 'עיר המשלוח', correct: false },
        { text: 'סכום ההזמנה', correct: false },
      ],
      explanation: 'מזהה טוב הוא ייחודי, קיים בשתי הטבלאות וכתוב בדיוק אותו דבר. שמות אינם ייחודיים.',
    },
    {
      type: 'mc',
      topic: 'שלוש השאלות',
      prompt: 'בגיליון "מוצרים": עמודה A = מק"ט, B = שם, C = מחיר (שורות 2 עד 50). בתא <span class="ltr">G3</span> הוקלד מק"ט. איזו נוסחה תחזיר את השם?',
      options: [
        { text: '<span class="ltr">=XLOOKUP(G3,$A$2:$A$50,$B$2:$B$50)</span>', correct: true },
        { text: '<span class="ltr">=XLOOKUP(G3,$A$2:$C$50,$B$2:$B$50)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP($A$2:$A$50,G3,$B$2:$B$50)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP(G3,$A$2:$A$50,2)</span>', correct: false },
      ],
      explanation: 'שלוש תשובות לפי הסדר: מה מחפשים (תא בודד), איפה מחפשים (עמודה אחת), מה מחזירים (עמודה אחת).',
    },
    {
      type: 'formula-parts',
      topic: 'שלוש השאלות',
      prompt: 'הרכיבו נוסחה שמחזירה את <b>העיר</b> של לקוח לפי מספר הלקוח.',
      scenario: `בגיליון "לקוחות": עמודה <b class="ltr">A</b> = מספר לקוח, <b class="ltr">B</b> = שם,
        <b class="ltr">C</b> = עיר, <b class="ltr">D</b> = טלפון. שורות 2 עד 30.
        מספר הלקוח שמחפשים נמצא בתא <b class="ltr">H4</b>.`,
      parts: {
        value: [
          { ref: 'H4', text: 'H4 — מספר הלקוח שמחפשים', correct: true },
          { ref: '$A$2:$A$30', text: 'עמודת מספרי הלקוחות — $A$2:$A$30' },
          { ref: '$C$2:$C$30', text: 'עמודת הערים — $C$2:$C$30' },
        ],
        lookup: [
          { ref: '$A$2:$A$30', text: 'עמודת מספרי הלקוחות — $A$2:$A$30', correct: true },
          { ref: '$A$2:$D$30', text: 'כל טבלת הלקוחות — $A$2:$D$30' },
          { ref: '$B$2:$B$30', text: 'עמודת השמות — $B$2:$B$30' },
        ],
        ret: [
          { ref: '$C$2:$C$30', text: 'עמודת הערים — $C$2:$C$30', correct: true },
          { ref: '$B$2:$B$30', text: 'עמודת השמות — $B$2:$B$30' },
          { ref: '3', text: '3 — העיר היא העמודה השלישית' },
        ],
      },
      explanation: 'מחפשים בעמודה שמכילה את סוג הערך שביד (מספר לקוח), ומחזירים מהעמודה שביקשו (עיר).',
    },
    {
      type: 'mc',
      topic: 'קיבוע וגרירה',
      prompt: 'הנוסחה עבדה בשורה הראשונה, אבל אחרי גרירה למטה כל השאר מציגות <span class="ltr">#N/A</span>. מה הסיבה?',
      options: [
        { text: 'הטווחים לא קובעו בדולרים, ולכן הם "החליקו" למטה עם הגרירה', correct: true },
        { text: 'הערכים המבוקשים לא קיימים בטבלה', correct: false },
        { text: 'הטבלה אינה ממוינת', correct: false },
        { text: 'צריך להוסיף FALSE בסוף הנוסחה', correct: false },
      ],
      explanation: 'מקבעים את שני הטווחים (F4). ערך החיפוש נשאר חופשי — הוא צריך לזוז שורה-שורה.',
    },
    {
      type: 'mc',
      topic: 'כיוון החיפוש',
      prompt: 'בטבלה, עמודת המזהה נמצאת <b>אחרי</b> העמודה שממנה רוצים תשובה. מה צריך לעשות?',
      options: [
        { text: 'כלום מיוחד — מסמנים את עמודת המזהה כ"איפה מחפשים" ואת השנייה כ"מה מחזירים"', correct: true },
        { text: 'להעתיק את עמודת המזהה לתחילת הטבלה', correct: false },
        { text: 'להשתמש ב-INDEX+MATCH', correct: false },
        { text: 'להוסיף 1- בסוף הנוסחה', correct: false },
      ],
      explanation: 'ב-XLOOKUP שתי העמודות נבחרות בנפרד, ולכן הכיוון ביניהן לא משנה. זו הייתה מגבלה של VLOOKUP בלבד.',
    },
    {
      type: 'mc',
      topic: 'שגיאות',
      prompt: 'מה המשמעות של <span class="ltr">#VALUE!</span> בנוסחת XLOOKUP?',
      options: [
        { text: 'עמודת החיפוש ועמודת התוצאה אינן באותו גודל', correct: true },
        { text: 'הערך המבוקש לא נמצא', correct: false },
        { text: 'גרסת האקסל לא מכירה את הפונקציה', correct: false },
        { text: 'התא שנמצא היה ריק', correct: false },
      ],
      explanation: '"לא נמצא" זה #N/A. גרסה ישנה זה #NAME?. תא ריק מחזיר 0 בלי שום שגיאה.',
    },
    {
      type: 'mc',
      topic: 'שגיאות',
      prompt: 'בדוח הופיע <span class="ltr">0</span> במקום מחיר, בלי שום הודעת שגיאה. מה קרה?',
      options: [
        { text: 'החיפוש הצליח, אבל התא שנמצא בטבלת המקור היה ריק', correct: true },
        { text: 'המק"ט לא נמצא בטבלה', correct: false },
        { text: 'הטווחים לא מקובעים', correct: false },
        { text: 'המחיר באמת אפס', correct: false },
      ],
      explanation: 'זו המלכודת השקטה של XLOOKUP: תא ריק חוזר כאפס, וזה נראה כמו נתון אמיתי.',
    },
  ],
};
