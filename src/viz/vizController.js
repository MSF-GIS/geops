'use strict';

import PubSub from '../PubSub';
import budgetPartByTypeViz from './ops/budgetPartByTypeViz';
import budgetPartByChoiceViz from './ops/budgetPartByChoiceViz';
import HRbyMissionViz from './hr/HRbyMissionViz';
import stockByMissionViz from './supply/stockByMissionViz';
import totalStockViz from './supply/totalStockViz';
import overStockViz from './supply/overStockViz';
import intlLocalProcurementViz from './supply/intlLocalProcurementViz';
import totalProcurementsViz from './supply/totalProcurementsViz';
import missionIntlForecastViz from './supply/missionIntlForecastViz';

export function init() {
  
  const vizRouter = {
    'home' : {},
    'ops': {
      'Type of projects': [budgetPartByTypeViz],
      'Default/choice': [budgetPartByChoiceViz]
    },
    'hr': {
      'Global Workforce': [HRbyMissionViz]
    },
    'supply': {
      'Stocks': [stockByMissionViz, totalStockViz, overStockViz],
      'Procurement': [stockByMissionViz, totalProcurementsViz, intlLocalProcurementViz, missionIntlForecastViz]
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