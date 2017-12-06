'use strict';

import PubSub from './PubSub';
import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL, ALL_MISSIONS, ALL_PROJECTS } from './variables';
import { defaultIndicators } from './indicators';
import { getProjectsFromData, mergeProjectsAndFinancials, getMissions, mergeSupplyData } from './helpers';

function reduce(state, action) {

  switch (action.type) {
    case 'SET_PRESENCES':
      state.presences = action.payload;
      state.modalMsg = 'Load projects data ...';
      return state;
    case 'SET_PROJECTS':
      state.projects = getProjectsFromData(action.payload);
      state.modalMsg = 'Load financials data ...';
      return state;
    case 'SET_FINANCIALS':
      const haveCoordination = [];
      const tempProjects = mergeProjectsAndFinancials(state.projects, action.payload)
        .filter(p => !isNaN(p.lon) && !isNaN(p.lat));      
      tempProjects
        .filter(p => p.isCoordination)
        .forEach(p => { haveCoordination.push(p.mission); });  
      state.projects = tempProjects
        .filter(p => haveCoordination.indexOf(p.mission) > -1)
      state.missions = getMissions(state.projects);
      state.modalMsg = 'Load supply data ...';
      return state;
    case 'SET_SUPPLY':
      state.missions = mergeSupplyData(state.missions, action.payload);
      state.modalMsg = 'Load extent data ...';
      return state;
    case 'SET_EXTENTS':
      state.extents = action.payload;
      state.loadingData = false;
      state.openModal = false;
      return state;
    case 'SET_CURRENT_TAB':
      state.currentTab = action.payload;
      state.currentMission = ALL_MISSIONS;
      state.currentProject = ALL_PROJECTS;
      state.currentIndicator = defaultIndicators[state.currentTab];
      state.budgetDisplay = false;
      return state;  
    case 'SET_MISSION':
      state.currentMission = action.payload === ALL_MISSIONS ? ALL_MISSIONS : action.payload;
      state.currentProject = ALL_PROJECTS;
      return state;
    case 'SET_PROJECT':
      const allProjects = action.payload === ALL_PROJECTS;
      state.currentProject = action.payload === ALL_PROJECTS ? ALL_PROJECTS : action.payload;
    case 'SET_INDICATOR':
      state.currentIndicator = action.payload;
      state.filters = {};
      return state;
    case 'SET_FILTER':
      state.filters[action.payload.filterAttr] = action.payload.filterValues;
      return state;
    case 'SET_BUDGET_DISPLAY':
      state.budgetDisplay = action.payload;
      return state;  
  }

  return state;
}

function publishChangeEvents(action, newState) {

  let key = null;

  switch (action.type) {  
    case 'SET_EXTENTS':  
      key = 'extents';
      break;
    case 'SET_CURRENT_TAB':
      key = 'currentTab';
      break;
    case 'SET_MISSION':
      key = 'currentMission';
      break;
    case 'SET_PROJECT':
      key = 'currentProject';
      break;
    case 'SET_INDICATOR':
      key = 'currentIndicator';
      break;
    case 'SET_FILTER':
      key = 'filters';
      break;
    case 'SET_BUDGET_DISPLAY':
      key = 'budgetDisplay'  
  }

  if(key !== null) {
    PubSub.publish('STATE', {
      key: key,
      value: newState[key],
      appState: newState
    });  
  }
} 

export function update(state, action) {
  const newState = reduce(state, action);
  publishChangeEvents(action, newState, state);
  return newState;
}

export const firstState = {
  loadingData: true,
  openModal: true,
  modalMsg: 'Loading MSF presence ...',
  projects: null,
  extents: null,
  missions: null,
  startYear: 2012,
  endYear: 2018,
  filters: {},
  currentTab: 'home',
  currentMission: ALL_MISSIONS,
  currentProjects: ALL_PROJECTS,
  currentIndicator: '',
  budgetDisplay: false
};