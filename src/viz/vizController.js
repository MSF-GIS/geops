'use strict';

import PubSub from '../PubSub';
import budgetPartByTypeViz from './ops/budgetPartByTypeViz';
import budgetPartByChoiceViz from './ops/budgetPartByChoiceViz';
import HRbyMissionViz from './hr/HRbyMissionViz';

export function init() {
  
  const vizRouter = {
    'home' : {},
    'ops': {
      'Type of projects': [budgetPartByTypeViz],
      'Default/choice': [budgetPartByChoiceViz]
    },
    'hr': {
      'Global Workforce': [HRbyMissionViz]
    }
  }

  let vizs = undefined;

  PubSub.subscribe('STATE', (evt, payload) => {
    const key = payload.key;
    const appState = payload.appState;
    if(appState.projects && (key == 'currentTab' || key == 'extents' || key == 'currentIndicator')) {
      if(vizs !== undefined) {
        vizs.forEach(viz => { viz.destroy(); });
      }
      vizs = vizRouter[appState.currentTab][appState.currentIndicator];
      if(vizs !== undefined) {
        vizs = vizs.map(viz => viz(payload.appState));  
      }
    }
  });
}