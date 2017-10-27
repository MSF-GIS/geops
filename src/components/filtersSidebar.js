'use strict';

import '../styles/filtersSidebar.css';
import h from 'snabbdom/h';

function view(model, handler, children) {
  return h('div#filter-sidebar-container', [
    h('div#accordion', { dataset: { children: '.accodion-item' } }, children)
  ]);
}

export default { view };
