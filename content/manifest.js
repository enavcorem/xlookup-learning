// ===== מקור האמת היחיד למבנה הקורס =====
// כל פרק ויחידה מוגדרים כאן פעם אחת. גם מפת המסלול (roadmap-render.js) וגם
// לוגיקת הנעילה/התקדמות (progress.js) קוראות מהרשימה הזאת בלבד.
//
// כדי להוסיף יחידה חדשה: הוסיפי אובייקט לרשימת ה-units של הפרק המתאים,
// וכתבי את קובץ התוכן שלה תחת content/chX/. זהו — אין צורך לגעת בשום
// קובץ אחר (לא ב-CSS, לא במנוע, לא בניתוב).
//
// type: 'lesson' | 'lab' | 'quiz' | 'reference' | 'bonus' | 'exemption'
//   bonus/exemption אינם נספרים לנעילה ול-XP (ראו progress.js).

// מזהה הקורס. שימושים: מפתחות ה-localStorage (כדי ששתי לומדות על אותו
// דומיין לא ידרסו זו את זו), וקידומת מזהי היחידות ב-Supabase — שם כל
// הלומדות חולקות פרויקט אחד ואותה טבלת תלמידות בכוונה.
export const COURSE_ID = 'xlookup';

// הטקסטים שמזהים את הקורס בממשק. הם יושבים כאן ולא במנוע, כי js/ ו-css/
// זהים בין כל הלומדות — בלי זה כל לומדה חדשה הייתה מקבלת את מסך הכניסה
// של לומדת הסטטיסטיקה.
export const COURSE = {
  title: 'לומדת XLOOKUP',
  icon: '🔗',
  welcome: {
    f: 'ברוכה הבאה ללומדת XLOOKUP! 🔗',
    m: 'ברוך הבא ללומדת XLOOKUP! 🔗',
  },
  finaleText: 'סיימת את כל יחידות הלומדה — ואת יודעת לחבר טבלאות 🔗',
  teacherTitle: '🔗 לוח מורה — לומדת XLOOKUP',

  // מאפשר "מצב כיתה": כניסה לכתובת עם ?class=1 פותחת את כל היחידות
  // במכשיר הזה ומסתירה את מונה ה-XP, לשיעור פרונטלי שבו המורה מקרינה
  // יחידה מסוימת. ?class=0 מכבה. הקישור לתלמידות הוא הרגיל, בלי
  // הפרמטר — אצלן הנעילה נשארת פעילה כרגיל.
  //
  // בקורס שלא מציין את הדגל הזה, ?class=1 לא עושה כלום.
  classMode: true,
};

export const CHAPTERS = [
  {
    id: 'xl-ch1',
    number: 1,
    title: 'למה בכלל לחבר טבלאות?',
    icon: '🔗',
    colorVar: 'chapter-1',
    units: [
      { id: 'xl-ch1-u1', title: 'החנות עם שתי המחברות', type: 'lesson', icon: '🏪', estMinutes: 6, modulePath: 'ch1/ch1-u1-two-notebooks.js' },
      { id: 'xl-ch1-u2', title: 'המזהה הייחודי — הדבק שמחבר', type: 'lesson', icon: '🔑', estMinutes: 5, modulePath: 'ch1/ch1-u2-unique-key.js' },
      { id: 'xl-ch1-u3', title: 'מי מחבר טבלאות באמת', type: 'lesson', icon: '🌍', estMinutes: 4, modulePath: 'ch1/ch1-u3-history.js' },
    ],
  },
  {
    id: 'xl-ch2',
    number: 2,
    title: 'XLOOKUP: שלוש שאלות',
    icon: '🎯',
    colorVar: 'chapter-2',
    units: [
      { id: 'xl-ch2-u1', title: 'שלוש השאלות', type: 'lesson', icon: '❓', estMinutes: 6, modulePath: 'ch2/ch2-u1-three-questions.js' },
      { id: 'xl-ch2-u2', title: 'הנוסחה הראשונה שלך', type: 'lesson', icon: '✍️', estMinutes: 7, modulePath: 'ch2/ch2-u2-first-formula.js' },
      { id: 'xl-ch2-u3', title: 'לגרור בלי לשבור ($ ו-F4)', type: 'lesson', icon: '📌', estMinutes: 5, modulePath: 'ch2/ch2-u3-anchoring.js' },
      { id: 'xl-ch2-u4', title: 'לא אכפת לו מהכיוון', type: 'lesson', icon: '🔄', estMinutes: 5, modulePath: 'ch2/ch2-u4-any-direction.js' },
      { id: 'xl-ch2-u5', title: 'כשמשהו משתבש', type: 'lesson', icon: '⚠️', estMinutes: 6, modulePath: 'ch2/ch2-u5-errors.js' },
      { id: 'xl-ch2-u6', title: 'כשפוגשים VLOOKUP בטבע', type: 'reference', icon: '🦖', estMinutes: 5, modulePath: 'ch2/ch2-u6-meeting-vlookup.js' },
      { id: 'xl-ch2-lab', title: 'תרגול 1: מחסן החלפים', type: 'lab', icon: '🔧', estMinutes: 8, modulePath: 'ch2/ch2-lab-station1.js' },
      { id: 'xl-ch2-quiz', title: 'מבחן פרק: החיפוש המדויק', type: 'quiz', icon: '📝', estMinutes: 8, modulePath: 'ch2/ch2-quiz.js' },
    ],
  },
  {
    id: 'xl-ch3',
    number: 3,
    title: 'חיפוש לא מדויק',
    icon: '📊',
    colorVar: 'chapter-3',
    units: [
      { id: 'xl-ch3-u1', title: 'כשהערך המדויק לא קיים', type: 'lesson', icon: '🪜', estMinutes: 6, modulePath: 'ch3/ch3-u1-no-exact-value.js' },
      { id: 'xl-ch3-u2', title: 'הפסיק הכפול והמינוס אחד', type: 'lesson', icon: '➖', estMinutes: 6, modulePath: 'ch3/ch3-u2-double-comma.js' },
      { id: 'xl-ch3-lab', title: 'תרגול 2: מדרגות הבונוס', type: 'lab', icon: '💰', estMinutes: 8, modulePath: 'ch3/ch3-lab-station2.js' },
      // התרגול היחיד שבו הקיבוע באמת נחוץ (150 שורות), והיחיד שבו התלמידה
      // מחליטה לבד איזה סוג חיפוש מתאים לכל עמודה. ראו ההערה בראש הקובץ.
      { id: 'xl-ch3-lab2', title: 'תרגול גדול: יום עבודה במחסן', type: 'lab', icon: '📦', estMinutes: 15, modulePath: 'ch3/ch3-lab2-big-table.js' },
      { id: 'xl-ch3-quiz', title: 'מבחן פרק: חיפוש לא מדויק', type: 'quiz', icon: '📝', estMinutes: 7, modulePath: 'ch3/ch3-quiz.js' },
    ],
  },
  {
    // פרק בונוס: כל היחידות בו מסומנות 'bonus', ולכן progress.js לא סופר
    // אותן לנעילה ולא ל-XP. אפשר לדלג עליו לגמרי ולהמשיך ישר לפרק 5.
    id: 'xl-ch4',
    number: 4,
    title: 'עוד קצת — לא חובה',
    icon: '⭐',
    colorVar: 'chapter-4',
    unordered: true,
    units: [
      { id: 'xl-ch4-b1', title: 'מה קורה כשלא נמצא?', type: 'bonus', icon: '🔍', estMinutes: 5, modulePath: 'ch4/ch4-b1-if-not-found.js' },
      { id: 'xl-ch4-b2', title: 'כמה עמודות בנוסחה אחת', type: 'bonus', icon: '✨', estMinutes: 5, modulePath: 'ch4/ch4-b2-spill.js' },
    ],
  },
  {
    id: 'xl-ch5',
    number: 5,
    title: 'מבצע: תיק 404',
    icon: '🕵️',
    colorVar: 'chapter-5',
    units: [
      { id: 'xl-ch5-mission', title: 'תיק 404 — חדר הבריחה', type: 'lab', icon: '🔓', estMinutes: 20, modulePath: 'ch5/ch5-mission.js' },
      { id: 'xl-ch5-final', title: 'מבחן מסכם', type: 'quiz', icon: '🏆', estMinutes: 10, modulePath: 'ch5/ch5-final.js', isGrandFinale: true },
    ],
  },
];

export function getFlatUnits() {
  const flat = [];
  CHAPTERS.forEach(ch => {
    ch.units.forEach(u => {
      flat.push({ ...u, chapterId: ch.id, chapterNumber: ch.number, chapterTitle: ch.title, colorVar: ch.colorVar });
    });
  });
  return flat;
}

export function findUnit(unitId) {
  return getFlatUnits().find(u => u.id === unitId) || null;
}

export function findChapter(chapterId) {
  return CHAPTERS.find(ch => ch.id === chapterId) || null;
}

// היחידה שבאה מיד אחרי unitId ברצף הכולל (לא לפי שם, לפי הסדר במניפסט) —
// null אם זו היחידה האחרונה בקורס.
export function getNextUnit(unitId) {
  const flat = getFlatUnits();
  const idx = flat.findIndex(u => u.id === unitId);
  if (idx === -1 || idx === flat.length - 1) return null;
  return flat[idx + 1];
}

// הפרק שבא מיד אחרי chapterId — null אם זה הפרק האחרון.
export function getNextChapter(chapterId) {
  const idx = CHAPTERS.findIndex(ch => ch.id === chapterId);
  if (idx === -1 || idx === CHAPTERS.length - 1) return null;
  return CHAPTERS[idx + 1];
}
