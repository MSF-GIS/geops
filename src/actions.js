'use strict';

export function setCurrentTab(tab) {
  return {
    type: 'SET_CURRENT_TAB',
    payload: tab
  }
};

export function setLayerSwitherCollapsed(collapsed) {
  return {
    type: 'SET_LAYER_SWITCHER_COLLAPSED',
    payload: collapsed
  }
};

export function setLayerSwitherChecked(checked) {
  return {
    type: 'SET_LAYER_SWITCHER_CHECKED',
    payload: checked
  }
};