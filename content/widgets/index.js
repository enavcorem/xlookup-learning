// ===== רישום הבלוקים וסוגי השאלות הייחודיים ללומדת XLOOKUP =====
// זה הקובץ היחיד שמחבר בין הקורס למנוע. js/router.js מייבא אותו פעם אחת
// לפני הניתוב הראשון, כך שכל קובץ תוכן יכול להשתמש בסוגים שנרשמו כאן.
//
// כל לומדה חייבת קובץ כזה — גם ריק. ראו "README - איך להקים לומדה חדשה.md".

import { registerBlockRenderer } from '../../js/engine/blocks.js';
import { registerQuestionType } from '../../js/engine/question-types.js';

import { renderXlookupDemo } from './xlookup-demo.js';
import { renderFormula, renderTwoTables, renderTimeline, renderCompare, renderErrorDemo, renderDownload } from './blocks-extra.js';
import { practiceFormulaParts, examFormulaParts } from './formula-parts.js';

registerBlockRenderer('xlookup-demo', renderXlookupDemo);
registerBlockRenderer('formula', renderFormula);
registerBlockRenderer('two-tables', renderTwoTables);
registerBlockRenderer('timeline', renderTimeline);
registerBlockRenderer('compare', renderCompare);
registerBlockRenderer('error-demo', renderErrorDemo);
registerBlockRenderer('download', renderDownload);

registerQuestionType('formula-parts', {
  practice: practiceFormulaParts,
  exam: examFormulaParts,
});
