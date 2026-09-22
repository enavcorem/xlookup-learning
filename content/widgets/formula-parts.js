// ===== סוג שאלה: "שלושת החלקים" =====
// התלמידה לא מקלידה תחביר — היא עונה על שלוש השאלות של XLOOKUP בשלושה
// תפריטים, והנוסחה נבנית מול העיניים שלה בזמן אמת.
//
// למה לא שאלת טקסט חופשי: המנוע הסיר שאלות כאלה בכוונה (ראו ההערה בראש
// js/engine/question-types.js) — קשה לכתוב תחביר מדויק בלי אקסל מול
// העיניים, והטעויות שמתקבלות הן טעויות הקלדה ולא טעויות הבנה. ההקלדה
// האמיתית קורית בחוברות האקסל; כאן בודקים את ההבנה: *מה* נכנס לכל מקום.
//
// מבנה השאלה בקובץ תוכן:
// {
//   type: 'formula-parts',
//   prompt: 'איך נמשוך את שם החלק?',
//   scenario: '<p>...HTML שמתאר את הטבלאות...</p>',   // רשות
//   matchMode: -1,                                     // רשות
//   parts: {
//     value:  [{ ref: 'B13', text: 'B13 — המק"ט שהוקלד', correct: true }, { ref: 'A2', text: '...', hint: '...' }],
//     lookup: [...],
//     ret:    [...],
//   },
// }

import { el, esc, formulaHtml } from './shared.js';

const ROLES = [
  { key: 'value',  cls: 'r-value',  chip: '🔵 מה מחפשים?',  aria: 'מה מחפשים' },
  { key: 'lookup', cls: 'r-lookup', chip: '🟠 איפה מחפשים?', aria: 'איפה מחפשים' },
  { key: 'ret',    cls: 'r-return', chip: '🟢 מה מחזירים?',  aria: 'מה מחזירים' },
];

const PLACEHOLDER = '— בחרי —';

// בונה את שלוש השורות ואת תצוגת הנוסחה המתעדכנת. משותף ל-practice ול-exam
// כדי ששני המצבים ייראו ויתנהגו אותו דבר — רק המשוב שונה.
function buildBody(question) {
  const wrap = el('div');

  if (question.scenario) {
    wrap.appendChild(el('div', 'xl-fparts-scenario', question.scenario));
  }

  const preview = el('div', 'xl-fparts-preview');
  const formulaEl = el('div', 'xl-formula');
  preview.appendChild(formulaEl);

  const rows = {};
  const selects = {};

  ROLES.forEach((role) => {
    const opts = (question.parts && question.parts[role.key]) || [];
    const row = el('div', `xl-fparts-row ${role.cls}`);
    row.appendChild(el('div', 'xl-fparts-chip', role.chip));

    const sel = el('select', 'xl-fparts-select');
    sel.setAttribute('aria-label', role.aria);
    const ph = el('option', null, PLACEHOLDER);
    ph.value = '';
    sel.appendChild(ph);
    opts.forEach((o, i) => {
      const op = el('option', null, esc(o.text));
      op.value = String(i);
      sel.appendChild(op);
    });
    row.appendChild(sel);

    wrap.appendChild(row);
    rows[role.key] = row;
    selects[role.key] = sel;
  });

  function chosen(key) {
    const sel = selects[key];
    if (!sel.value) return null;
    return (question.parts[key] || [])[Number(sel.value)] || null;
  }

  function refresh() {
    formulaEl.innerHTML = formulaHtml({
      value: chosen('value')?.ref ?? '?',
      lookup: chosen('lookup')?.ref ?? '?',
      ret: chosen('ret')?.ref ?? '?',
      matchMode: question.matchMode,
    });
  }

  ROLES.forEach((role) => selects[role.key].addEventListener('change', () => {
    rows[role.key].classList.remove('is-ok', 'is-bad');
    refresh();
  }));
  refresh();

  // הנוסחה מוצגת *אחרי* התפריטים: קודם עונים על שלוש השאלות, ואז רואים
  // מה יצא. הסדר ההפוך הופך את זה ל"להעתיק נוסחה" במקום "להבין מה נכנס".
  wrap.appendChild(preview);

  const allCorrect = () => ROLES.every((r) => chosen(r.key)?.correct === true);
  const allAnswered = () => ROLES.every((r) => chosen(r.key) !== null);

  return { wrap, rows, selects, chosen, allCorrect, allAnswered, formulaEl };
}

function assembledText(body, question) {
  const t = (k) => body.chosen(k)?.ref ?? '?';
  const tail = (question.matchMode === -1 || question.matchMode === 1) ? `,,${question.matchMode}` : '';
  return `=XLOOKUP(${t('value')},${t('lookup')},${t('ret')}${tail})`;
}

// ===================== מצב שיעור =====================

export function practiceFormulaParts(question, onSolved) {
  const container = el('div', 'question-block');
  container.appendChild(el('div', 'question-prompt', question.prompt));

  const body = buildBody(question);
  container.appendChild(body.wrap);

  const checkBtn = el('button', 'btn btn-primary', 'בדקי');
  checkBtn.type = 'button';
  container.appendChild(checkBtn);

  const feedback = el('div', 'feedback');
  container.appendChild(feedback);

  let solved = false;

  checkBtn.addEventListener('click', () => {
    if (solved) return;

    if (!body.allAnswered()) {
      feedback.className = 'feedback hint';
      feedback.textContent = 'צריך לענות על שלוש השאלות לפני הבדיקה.';
      return;
    }

    // מסמנים כל שורה בנפרד: החלק שנכון נשאר ירוק והתלמידה לא מאבדת אותו,
    // והרמז מדבר רק על החלק שבאמת שגוי. זה ההבדל בין "טעית" לבין "שתיים
    // מתוך שלוש כבר נכונות, תסתכלי שוב על עמודת החיפוש".
    const wrong = [];
    ROLES.forEach((role) => {
      const pick = body.chosen(role.key);
      const ok = pick && pick.correct === true;
      body.rows[role.key].classList.toggle('is-ok', !!ok);
      body.rows[role.key].classList.toggle('is-bad', !ok);
      if (!ok) wrong.push({ role, pick });
    });

    if (wrong.length === 0) {
      solved = true;
      feedback.className = 'feedback ok';
      feedback.textContent = 'כל הכבוד! 🎉 שלושת החלקים במקום.';
      ROLES.forEach((r) => { body.selects[r.key].disabled = true; });
      checkBtn.disabled = true;
      onSolved(true);
      return;
    }

    const first = wrong[0];
    feedback.className = 'feedback hint';
    // innerHTML ולא textContent: הרמזים כאן מודגשים בכוונה ("רק <b>עמודה
    // אחת</b>"), וההדגשה היא בדיוק מה שהתלמידה צריכה לראות. המקור היחיד
    // של הטקסט הזה הוא קבצי התוכן שלנו — אין כאן קלט של משתמשת.
    feedback.innerHTML = first.pick && first.pick.hint
      ? `💡 ${first.pick.hint}`
      : `💡 ${wrong.length === 1 ? 'חלק אחד עוד לא במקום' : 'שני חלקים עוד לא במקום'} — הסתכלי על מה שמסומן באדום.`;
  });

  return container;
}

// ===================== מצב מבחן =====================
// חובה לממש גם אותו: המנוע מציג אזהרה גלויה לסוג שאלה שלא נתמך במבחן,
// במקום לנקד אותו שגוי בשקט.

export function examFormulaParts(question, index) {
  const wrap = el('div', 'question-block');
  wrap.appendChild(el('div', 'question-prompt', `${index + 1}. ${question.prompt}`));

  const body = buildBody(question);
  wrap.appendChild(body.wrap);

  return {
    el: wrap,
    getAnswer: () => ROLES.map((r) => body.chosen(r.key)),
    reveal: () => {
      const isCorrect = body.allCorrect();
      ROLES.forEach((role) => {
        const pick = body.chosen(role.key);
        const ok = pick && pick.correct === true;
        body.rows[role.key].classList.add(ok ? 'is-ok' : 'is-bad');
        body.selects[role.key].disabled = true;
      });
      return {
        isCorrect,
        userAnswerText: body.allAnswered() ? assembledText(body, question) : '(לא נענתה)',
      };
    },
  };
}
