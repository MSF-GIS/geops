'use strict';

export function setCurrentTab(tab) {
  return {
    type: 'SET_CURRENT_TAB',
    payload: tab
  }
};