'use strict';

import h from 'snabbdom/h';
import webmap from './webmap';
import layerSwitcher from './layerSwitcher';
import filtersSidebar from './filtersSidebar';
import misssionFilter from './missionFilter';
import projectFilter from './projectFilter';

function view(model, handler) {

  const filters = [ misssionFilter.view(model, handler), projectFilter.view(model, handler) ];

  return h('div#ops-tab', [
    webmap.view(model, handler),
    layerSwitcher.view(model, handler),
    filtersSidebar.view(model, handler, filters),
  ]);
}

export default { view };