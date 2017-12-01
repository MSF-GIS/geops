'use strict';

import '../styles/viz.css';
import h from 'snabbdom/h';

export default function view(children) {
  // return h('div#dataviz-container', children);
  return h('div#dataviz-container', { key: 'vizContainer' });
}