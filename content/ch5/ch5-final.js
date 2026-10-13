// מבחן מסכם. מכסה את כל הקורס, עם דגש על מה שמופיע במבחנים: זיהוי
// המזהה שמחבר, בניית הנוסחה, וההבחנה בין מדויק ללא מדויק.

export default {
  title: 'מבחן מסכם — XLOOKUP',
  passMark: 75,
  questions: [
    {
      type: 'mc',
      topic: 'זיהוי המזהה',
      prompt: 'במבחן נתונים שני גיליונות: "משלוחים" (מספר הזמנה, כתובת, משקל) ו"הזמנות" (מספר הזמנה, מספר לקוח, מק"ט). לפי מה מחברים ביניהם?',
      options: [
        { text: 'מספר לקוח', correct: false },
        { text: 'כתובת', correct: false },
        { text: 'מספר הזמנה', correct: true },
        { text: 'מק"ט', correct: false },
      ],
      explanation: 'המזהה חייב להופיע בשתי הטבלאות. מספר לקוח ומק"ט קיימים רק באחת מהן.',
    },
    {
      type: 'mc',
      topic: 'זיהוי המזהה',
      prompt: 'איזה מהבאים הוא מזהה <b>גרוע</b>?',
      options: [
        { text: 'מספר תעודת זהות', correct: false },
        { text: 'שם פרטי ושם משפחה', correct: true },
        { text: 'מק"ט מוצר', correct: false },
        { text: 'מספר הזמנה', correct: false },
      ],
      explanation: 'שמות חוזרים על עצמם ורגישים לרווחים ולכתיב. מזהה טוב הוא כמעט תמיד מספר.',
    },
    {
      type: 'mc',
      topic: 'בניית הנוסחה',
      prompt: 'גיליון "עובדים": A = מחלקה, B = מספר עובד, C = שם, D = שכר (שורות 2 עד 40). בתא <span class="ltr">G2</span> מספר עובד. איזו נוסחה תחזיר את <b>השכר</b>?',
      options: [
        { text: '<span class="ltr">=XLOOKUP(G2,$A$2:$A$40,$D$2:$D$40)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP(G2,$B$2:$B$40,4)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP($B$2:$B$40,G2,$D$2:$D$40)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP(G2,$B$2:$B$40,$D$2:$D$40)</span>', correct: true },
      ],
      explanation: 'מחפשים בעמודה שמכילה מספרי עובדים (B), ומחזירים מעמודת השכר (D).',
    },
    {
      type: 'formula-parts',
      topic: 'בניית הנוסחה',
      prompt: 'הרכיבו נוסחה שמחזירה את <b>שם הספק</b> לפי מק"ט.',
      scenario: `גיליון "מלאי": עמודה <b class="ltr">A</b> = שם ספק, <b class="ltr">B</b> = מק"ט,
        <b class="ltr">C</b> = כמות במלאי. שורות 2 עד 60.
        המק"ט שמחפשים נמצא בתא <b class="ltr">F7</b>.
        <br>שימו לב לסדר העמודות.`,
      parts: {
        value: [
          { ref: 'F7', text: 'F7 — המק"ט שמחפשים', correct: true },
          { ref: '$B$2:$B$60', text: 'עמודת המק"טים — $B$2:$B$60' },
          { ref: '$A$2:$A$60', text: 'עמודת הספקים — $A$2:$A$60' },
        ],
        lookup: [
          { ref: '$B$2:$B$60', text: 'עמודת המק"טים — $B$2:$B$60', correct: true },
          { ref: '$A$2:$A$60', text: 'עמודת הספקים — $A$2:$A$60' },
          { ref: '$A$2:$C$60', text: 'כל טבלת המלאי — $A$2:$C$60' },
        ],
        ret: [
          { ref: '$A$2:$A$60', text: 'עמודת הספקים — $A$2:$A$60', correct: true },
          { ref: '$C$2:$C$60', text: 'עמודת הכמויות — $C$2:$C$60' },
          { ref: '1', text: '1 — הספק הוא העמודה הראשונה' },
        ],
      },
      explanation: 'עמודת התשובה נמצאת לפני עמודת החיפוש — וזה לא משנה כלום ב-XLOOKUP.',
    },
    {
      type: 'mc',
      topic: 'קיבוע וגרירה',
      prompt: 'מה חייב להיות מקובע בדולרים כשגוררים את הנוסחה על עמודה שלמה?',
      options: [
        { text: 'שני הטווחים, אבל לא ערך החיפוש', correct: true },
        { text: 'שלושת החלקים', correct: false },
        { text: 'רק ערך החיפוש', correct: false },
        { text: 'כלום', correct: false },
      ],
      explanation: 'ערך החיפוש חייב לזוז שורה-שורה. הטווחים חייבים להישאר במקום.',
    },
    {
      type: 'mc',
      topic: 'מדויק מול לא מדויק',
      prompt: 'באיזה מהמקרים הבאים צריך חיפוש <b>לא מדויק</b>?',
      options: [
        { text: 'מציאת שם מוצר לפי מק"ט', correct: false },
        { text: 'מציאת טלפון של לקוח לפי מספר לקוח', correct: false },
        { text: 'מציאת אחוז מס לפי גובה ההכנסה', correct: true },
        { text: 'מציאת כיתה של תלמידה לפי ת"ז', correct: false },
      ],
      explanation: 'טבלת מס מגדירה מדרגות, לא כל סכום אפשרי. בשאר המקרים הערך קיים בטבלה במדויק.',
    },
    {
      type: 'mc',
      topic: 'חיפוש לא מדויק',
      prompt: 'איזו נוסחה מבקשת "התאמה מדויקת, ואם אין — המדרגה שמתחת"?',
      options: [
        { text: '<span class="ltr">=XLOOKUP(A2,$D$2:$D$9,$E$2:$E$9,-1)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP(A2,$D$2:$D$9,$E$2:$E$9,,1)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP(A2,$D$2:$D$9,$E$2:$E$9,TRUE)</span>', correct: false },
        { text: '<span class="ltr">=XLOOKUP(A2,$D$2:$D$9,$E$2:$E$9,,-1)</span>', correct: true },
      ],
      explanation: 'שני פסיקים (דילוג על if_not_found), ואז 1- — מינוס, כי יורדים למדרגה שמתחת.',
    },
    {
      type: 'numeric',
      topic: 'חישוב מדרגות',
      prompt: 'מדרגות דמי משלוח לפי משקל: 0 ק"ג→15 ₪, 5→25 ₪, 10→39 ₪, 25→60 ₪. חבילה שוקלת 18 ק"ג. כמה יעלה המשלוח?',
      answer: 39,
      unitLabel: '₪',
      explanation: '18 עבר את מדרגת ה-10 אך לא הגיע ל-25, ולכן 39 ₪.',
    },
    {
      type: 'mc',
      topic: 'שגיאות',
      prompt: 'איזו שגיאה מעידה שעמודת החיפוש ועמודת התוצאה אינן באותו גודל?',
      options: [
        { text: '<span class="ltr">#N/A</span>', correct: false },
        { text: '<span class="ltr">#VALUE!</span>', correct: true },
        { text: '<span class="ltr">#NAME?</span>', correct: false },
        { text: '<span class="ltr">#SPILL!</span>', correct: false },
      ],
      explanation: '#N/A = לא נמצא. #NAME? = גרסת אקסל ישנה. #SPILL! = אין מקום פנוי לתוצאה רחבה.',
    },
    {
      type: 'mc',
      topic: 'שגיאות',
      prompt: 'מה ההבדל המסוכן בין <span class="ltr">#N/A</span> לבין תוצאה של <span class="ltr">0</span>?',
      options: [
        { text: '<span class="ltr">0</span> תמיד אומר שהערך לא נמצא', correct: false },
        { text: 'אין הבדל — שתיהן שגיאות', correct: false },
        { text: '<span class="ltr">#N/A</span> מונעת מהקובץ להישמר', correct: false },
        { text: '<span class="ltr">#N/A</span> צועקת שיש בעיה, ואילו 0 נראה כמו נתון אמיתי ולכן עובר בלי שמישהו יבדוק', correct: true },
      ],
      explanation: 'אפס מופיע כשהחיפוש הצליח אבל התא שנמצא היה ריק. זו הסיבה לבדוק אפסים מפתיעים.',
    },
  ],
};
