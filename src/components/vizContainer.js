'use strict';

import '../styles/viz.css';
import h from 'snabbdom/h';

export default function view(children) {
  return h('div#dataviz-container.container-fluid', { key: 'vizContainer' }, [
    h('div#dataviz-row.row', { key: 'vizRow' })
  ]);
}