'use strict';

import '../styles/viz.css';
import h from 'snabbdom/h';

function view(model, handler, children) {
  return h('div#dataviz-container', children);
}

export default { view };
