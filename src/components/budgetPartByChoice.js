'use strict';

import h from 'snabbdom/h';
import budgetPartByChoiceViz from '../viz/budgetPartByChoiceViz';

function view(model, handler) {
  budgetPartByChoiceViz.update(model, handler);
  return h('svg#budget-part-choice-viz', {
    attrs: {
      width: 200,
      height: 500
    },
    hook: {
      insert: budgetPartByChoiceViz.init.bind(this, model, handler),
      destroy: budgetPartByChoiceViz.destroy
    }
  })
}

export default { view }
