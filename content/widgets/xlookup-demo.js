// ===== ההנפשה: איך XLOOKUP באמת עובד =====
// הבלוק המרכזי של הלומדה. התלמידה בוחרת ערך חיפוש, וההנפשה מראה את שלושת
// השלבים שקורים בפועל: סריקה של עמודת החיפוש (🟠), עצירה על ההתאמה, וקפיצה
// אופקית לעמודה המקבילה (🟢) כדי להביא את התשובה.
//
// למה זה כאן ולא ב-js/engine/blocks.js: המנוע משותף לכל הלומדות ולא מכיר
// נושאים. בלוק ייחודי לנושא נרשם מ-content/widgets/index.js.
//
// שני מצבים:
//   matchMode: 0  — חיפוש מדויק. עוצרים על ההתאמה הראשונה.
//   matchMode: -1 — "או הערך הקטן שמתחת". סורקים את *כל* השורות ושומרים את
//                   המועמד הגדול ביותר שעדיין לא עובר את הערך המבוקש. זה
//                   בדיוק מה שהפונקציה עושה במצב ברירת המחדל של search_mode
//                   (סריקה לינארית), ולכן טבלה לא ממוינת לא "שוברת" אותה.

import { el, esc, formulaHtml, legendHtml, prefersReducedMotion, sleep } from './shared.js';

// מהירות הסריקה. מספיק איטי כדי לעקוב בעיניים, מספיק מהיר כדי לא לשעמם.
const SCAN_MS = 430;
const PAUSE_MS = 650;

// השוואה כמו באקסל: לא רגיש לאותיות גדולות/קטנות, ומתעלם מרווחים בקצוות.
// (הרווחים הם בדיוק מה שמייצר #N/A בחיים האמיתיים — זה נלמד ביחידה נפרדת,
// וכאן אנחנו מדמים את ההתנהגות ה"נקייה" של הפונקציה.)
function sameValue(a, b) {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

function toNumber(v) {
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ''));
  return Number.isNaN(n) ? null : n;
}

function fmt(v) {
  return `<span class="n-num">${esc(v)}</span>`;
}

export function renderXlookupDemo(block) {
  const {
    headers = [],
    rows = [],
    lookupCol = 0,
    returnCol = 1,
    matchMode = 0,
    formula = {},
    ask = 'מה מחפשים?',
    choices = rows.map((r) => r[lookupCol]),
  } = block;

  const wrap = el('div', 'block xl-demo');

  // --- הנוסחה למעלה, בשלושת הצבעים ---
  const formulaEl = el('div', 'xl-formula');
  formulaEl.innerHTML = formulaHtml({
    value: formula.value || 'ערך',
    lookup: formula.lookup || 'עמודת החיפוש',
    ret: formula.ret || 'עמודת התוצאה',
    matchMode,
  });
  wrap.appendChild(formulaEl);
  wrap.appendChild(el('div', '', legendHtml()));

  // --- כפתורי הבחירה ---
  wrap.appendChild(el('div', 'xl-demo-ask', esc(ask)));
  const choicesEl = el('div', 'xl-demo-choices');
  wrap.appendChild(choicesEl);

  // --- הבמה: טבלה + שכבת חיצים מעליה ---
  const stage = el('div', 'xl-demo-stage');
  const canvas = el('div', 'xl-demo-canvas');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'xl-demo-arrows');
  svg.innerHTML = `<defs><marker id="xl-arrow-head" viewBox="0 0 10 10" refX="9" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--xl-return)"></path>
    </marker></defs>`;
  canvas.appendChild(svg);

  const table = el('table', 'xl-demo-table');
  const thead = el('thead');
  const htr = el('tr');
  headers.forEach((h, c) => {
    const th = el('th', c === lookupCol ? 'col-lookup' : c === returnCol ? 'col-return' : null, esc(h));
    htr.appendChild(th);
  });
  thead.appendChild(htr);
  table.appendChild(thead);

  const tbody = el('tbody');
  rows.forEach((row, r) => {
    const tr = el('tr');
    tr.dataset.r = String(r);
    row.forEach((cell, c) => {
      const td = el('td', c === lookupCol || c === returnCol ? 'cell-code' : null, esc(cell));
      td.dataset.r = String(r);
      td.dataset.c = String(c);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  canvas.appendChild(table);
  stage.appendChild(canvas);
  wrap.appendChild(stage);

  // --- תיבת התוצאה ---
  const resultRow = el('div', 'xl-demo-result');
  resultRow.appendChild(el('div', 'xl-demo-result-label', 'התוצאה שתתקבל בתא:'));
  const resultBox = el('div', 'xl-demo-result-box', '—');
  resultRow.appendChild(resultBox);
  wrap.appendChild(resultRow);

  // --- שורת ההסבר החיה ---
  const narration = el('div', 'xl-demo-narration');
  narration.setAttribute('aria-live', 'polite');
  wrap.appendChild(narration);

  const actions = el('div', 'xl-demo-actions');
  const replayBtn = el('button', 'btn btn-ghost', '↻ עוד פעם');
  replayBtn.type = 'button';
  replayBtn.style.display = 'none';
  actions.appendChild(replayBtn);
  wrap.appendChild(actions);

  // ===================== מצב והנפשה =====================

  let runId = 0;
  let lastChoice = null;

  const cellAt = (r, c) => tbody.querySelector(`td[data-r="${r}"][data-c="${c}"]`);

  function reset() {
    tbody.querySelectorAll('td').forEach((td) => {
      td.classList.remove('scanning', 'rejected', 'candidate', 'matched', 'returned');
    });
    svg.querySelectorAll('path.arrow').forEach((p) => p.remove());
    resultBox.textContent = '—';
    resultBox.classList.remove('filled');
    narration.innerHTML = '';
  }

  function say(html) {
    narration.innerHTML = html;
  }

  function drawArrow(fromCell, toCell) {
    const base = canvas.getBoundingClientRect();
    const a = fromCell.getBoundingClientRect();
    const b = toCell.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - base.left;
    const y1 = a.top + a.height / 2 - base.top;
    // החץ נעצר על *שפת* תא היעד ולא במרכזו: אחרת ראש החץ נבלע מתחת לצבע
    // המילוי של התא, והתנועה נראית כאילו היא מסתיימת באמצע שום מקום.
    const goingLeft = b.left < a.left;
    const x2 = (goingLeft ? b.right + 5 : b.left - 5) - base.left;
    const y2 = b.top + b.height / 2 - base.top;

    const d = `M ${x1} ${y1} L ${x2} ${y2}`;

    // שני קווים זה על זה: לבן עבה מתחת, ירוק דק מעל. בלי ההילה הלבנה
    // החץ נעלם ברגע שתא היעד מתמלא בירוק — כלומר בדיוק ברגע שהוא הכי חשוב.
    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    halo.setAttribute('class', 'arrow');
    halo.setAttribute('d', d);
    halo.setAttribute('stroke', '#fff');
    halo.setAttribute('stroke-width', '7');
    halo.setAttribute('stroke-linecap', 'round');
    halo.setAttribute('fill', 'none');
    svg.appendChild(halo);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'arrow');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'var(--xl-return)');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#xl-arrow-head)');
    svg.appendChild(path);

    if (prefersReducedMotion()) return;
    const len = path.getTotalLength();
    [halo, path].forEach((p) => {
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    // שני רבדי requestAnimationFrame: הראשון נותן לדפדפן לקבע את המצב
    // ההתחלתי, השני מפעיל את המעבר. בלי זה המעבר "נבלע" והחץ פשוט מופיע.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      [halo, path].forEach((p) => {
        p.style.transition = 'stroke-dashoffset 420ms var(--ease)';
        p.style.strokeDashoffset = '0';
      });
    }));
  }

  async function run(choice) {
    const myRun = ++runId;
    const alive = () => myRun === runId && wrap.isConnected;
    const step = prefersReducedMotion() ? 0 : SCAN_MS;
    const pause = prefersReducedMotion() ? 0 : PAUSE_MS;

    reset();
    lastChoice = choice;
    replayBtn.style.display = '';
    choicesEl.querySelectorAll('.xl-demo-choice').forEach((b) => {
      b.classList.toggle('is-chosen', b.dataset.value === String(choice));
    });

    say(`אקסל מחזיק ביד את הערך ${fmt(choice)} — ומתחיל לרדת על <b style="color:var(--xl-lookup)">עמודת החיפוש</b> שורה-שורה.`);
    await sleep(pause);
    if (!alive()) return;

    const target = toNumber(choice);
    let matchedRow = -1;
    let candidateRow = -1;

    for (let r = 0; r < rows.length; r++) {
      if (!alive()) return;
      const cell = cellAt(r, lookupCol);
      const raw = rows[r][lookupCol];
      cell.classList.add('scanning');
      await sleep(step);
      if (!alive()) return;
      cell.classList.remove('scanning');

      if (matchMode === 0) {
        if (sameValue(raw, choice)) {
          matchedRow = r;
          cell.classList.add('matched');
          say(`מצאנו! ${fmt(raw)} זה בדיוק מה שחיפשנו. עוצרים כאן.`);
          break;
        }
        cell.classList.add('rejected');
        say(`${fmt(raw)} זה לא ${fmt(choice)} — ממשיכים לשורה הבאה.`);
      } else {
        // חיפוש לא מדויק: כל ערך שעדיין לא עובר את המבוקש הוא מועמד, והאחרון
        // שכזה הוא הזוכה. מראים את זה במפורש כדי שהכלל "יורדים למדרגה
        // שמתחת" יהיה משהו שראו קורה, ולא משפט לשנן.
        const val = toNumber(raw);
        if (val !== null && target !== null && val <= target) {
          if (candidateRow !== -1) cellAt(candidateRow, lookupCol).classList.remove('candidate');
          candidateRow = r;
          cell.classList.add('candidate');
          say(`${fmt(raw)} לא עובר את ${fmt(choice)} — אז בינתיים זו המדרגה שלנו. אבל ממשיכים לבדוק, אולי יש מדרגה גבוהה יותר שעדיין מתאימה.`);
        } else {
          cell.classList.add('rejected');
          say(`${fmt(raw)} כבר <b>גדול מ-</b>${fmt(choice)} — זו מדרגה שעוד לא הגענו אליה. פוסלים.`);
        }
      }
      await sleep(step);
    }

    if (!alive()) return;

    if (matchMode !== 0 && candidateRow !== -1) {
      matchedRow = candidateRow;
      const cell = cellAt(matchedRow, lookupCol);
      cell.classList.remove('candidate');
      cell.classList.add('matched');
      say(`סיימנו לעבור על הכול. המדרגה הגבוהה ביותר שעדיין לא עברה את ${fmt(choice)} היא ${fmt(rows[matchedRow][lookupCol])} — <b>זו התשובה</b>.`);
      await sleep(pause);
    }

    if (!alive()) return;

    if (matchedRow === -1) {
      resultBox.textContent = '#N/A';
      resultBox.classList.add('filled');
      resultBox.style.color = 'var(--danger)';
      say(`עברנו על כל העמודה ולא מצאנו את ${fmt(choice)}. כשאקסל לא מוצא — הוא מחזיר <b>N/A#</b>, שזו בעצם הדרך שלו להגיד "אין לי את זה".`);
      return;
    }

    await sleep(pause / 2);
    if (!alive()) return;

    const fromCell = cellAt(matchedRow, lookupCol);
    const toCell = cellAt(matchedRow, returnCol);
    say('עכשיו השלב השני: נשארים <b>באותה שורה בדיוק</b>, וקופצים לעמודה שממנה ביקשנו את התשובה.');
    drawArrow(fromCell, toCell);
    await sleep(prefersReducedMotion() ? 0 : 500);
    if (!alive()) return;

    toCell.classList.add('returned');
    const answer = rows[matchedRow][returnCol];
    await sleep(prefersReducedMotion() ? 0 : 300);
    if (!alive()) return;

    resultBox.textContent = answer;
    resultBox.classList.add('filled');
    resultBox.style.color = '';
    say(`זהו. הערך ${fmt(answer)} נכנס לתא. <b>שימו לב מה אקסל לא עשה:</b> הוא לא ספר עמודות ולא התעניין מי מימין ומי משמאל — רק "איפה לחפש" ו"מה להחזיר".`);
  }

  // --- כפתורים ---
  choices.forEach((c) => {
    const value = typeof c === 'object' ? c.value : c;
    const label = typeof c === 'object' ? c.label : c;
    const btn = el('button', 'xl-demo-choice', esc(label));
    btn.type = 'button';
    btn.dataset.value = String(value);
    btn.addEventListener('click', () => run(value));
    choicesEl.appendChild(btn);
  });

  replayBtn.addEventListener('click', () => { if (lastChoice !== null) run(lastChoice); });

  say('בחרו ערך למעלה — ותראו בדיוק מה אקסל עושה מאחורי הקלעים.');
  return wrap;
}
