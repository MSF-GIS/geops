'use strict';

import h from 'snabbdom/h';
import budgetPartByTypeViz from '../viz/budgetPartByTypeViz';

function view(model, handler) {
  budgetPartByTypeViz.update(model, handler);
  return h('svg#budget-part-type-viz', {
    attrs: {
      width: 300,
      height: 500
    },
    hook: {
      insert: budgetPartByTypeViz.init.bind(this, model, handler),
      destroy: budgetPartByTypeViz.destroy
    }
  })
}

export default { view }
