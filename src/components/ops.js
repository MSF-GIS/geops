'use strict';

import h from 'snabbdom/h';
import webmap from './webmap';
import layerSwitcher from './layerSwitcher';
import filtersSidebar from './filtersSidebar';
import misssionFilter from './missionFilter';
import projectFilter from './projectFilter';
import indicatorFilter from './indicatorFilter';
import additionalFiltersSidebar from './additionalFiltersSidebar';
import datavizContainer from './datavizContainer';
import budgetPartByType from './budgetPartByType';
import budgetPartByChoice from './budgetPartByChoice';

function view(model, handler) {

  let filters = [
    misssionFilter.view(model, handler),
    indicatorFilter.view(model, handler)
  ];

  let vizs = [
    budgetPartByType.view(model, handler)
  ];

  let tabContent = [
    webmap.view(model, handler),
    layerSwitcher.view(model, handler),
    filtersSidebar.view(model, handler, filters),
    additionalFiltersSidebar.view(model, handler),
    datavizContainer.view(model, handler, vizs)
  ];

  if(model.indicator === 'Default/choice') {
    vizs = [
      budgetPartByChoice.view(model, handler)
    ];

    tabContent = [
      webmap.view(model, handler),
      layerSwitcher.view(model, handler),
      filtersSidebar.view(model, handler, filters),
      datavizContainer.view(model, handler, vizs)
    ];        
  }

  return h('div#ops-tab', tabContent);
}

export default { view };