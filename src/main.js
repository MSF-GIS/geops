'use strict';

import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/collapse';
import {init} from 'snabbdom';
import h from 'snabbdom/h';
import PubSub from './PubSub';
import routes from './routes';
import { setCurrentTab, setPresences, setProjects, setExtents } from './actions';
import app from './components/app';
import { sendXHR, parseInteger } from './util';
import { getMissionFromLevel } from './helpers';
import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL, ALL_MISSIONS, ALL_PROJECTS } from './variables';

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/dataset').default
]);

const firstState = {
  currentTab: 'home',
  layerSwitcherCollapsed: false,
  layerSwitcherChecked: 'carto',
  loadingData: true,
  openModal: true,
  modalMsg: 'Loading MSF presence ...',
  presences: null,
  projects: null,
  extents: null,
  missions: null,
  level: GLOBAL_LEVEL
};

function route(handler) {
  const routeId = window.location.hash.replace('#', '');
  const tempRoutes = routes.filter(r => !r.disabled)
    .filter(r => r.id === routeId);  

  if(routeId === '' || routeId === '#') {
    handler.publish('ACTIONS', setCurrentTab('home'));
    return;    
  }

  if(tempRoutes < 1){
    handler.publish('ACTIONS', setCurrentTab('404'));
    return;
  }

  handler.publish('ACTIONS', setCurrentTab(tempRoutes[0].id));
}

function getMissions(projects) {
  return projects.reduce((acc, curr) => {
    const missionName = curr['Mission'];
    const mission = acc[missionName] || { name: missionName, budget: 0};
    mission.budget = mission.budget + parseInteger(curr['Initial 2017 (Euro)']);
    acc[missionName] = mission;
    return acc;
  }, {});
}

function cleanPresences(presences, projects) {
  const projectsCodes = projects.map(p => p['Project code']);
  const features = presences.features;
  const cleanedFeatures = features.filter(f => projectsCodes.indexOf(f.attributes.project_code) > -1);
  presences.features = cleanedFeatures;
  return presences;
}

function reduce(state, action) {

  switch (action.type) {
    case 'SET_CURRENT_TAB':
      state.currentTab = action.payload;
      return state;
    case 'SET_LAYER_SWITCHER_COLLAPSED':
      state.layerSwitcherCollapsed = action.payload;
      return state;
    case 'SET_LAYER_SWITCHER_CHECKED':
      state.layerSwitcherChecked = action.payload;
      return state;     
    case 'SET_PRESENCES':
      state.presences = action.payload;
      state.modalMsg = 'Load MSF projects ...';
      return state;
    case 'SET_PROJECTS':
      state.projects = action.payload;
      state.presences = cleanPresences(state.presences, state.projects);
      state.missions = getMissions(state.projects);
      state.modalMsg = 'Load countries data ...';
      return state;
    case 'SET_EXTENTS':
      state.extents = action.payload;
      state.loadingData = false;
      state.openModal = false;
      return state;
    case 'SET_MISSION':
      state.level = action.payload === ALL_MISSIONS ? GLOBAL_LEVEL : MISSION_LEVEL + '@@' + action.payload;
      return state;
    case 'SET_PROJECT':
      const mission = getMissionFromLevel(state.level);

      console.log(ALL_PROJECTS);
      console.log(action.payload);

      const allProjects = action.payload === ALL_PROJECTS;
      state.level = allProjects ? MISSION_LEVEL + '@@' + mission : PROJECT_LEVEL + '@@' + mission + '@@' + action.payload;
      return state;  
  }

  return state;
}

function manageIO(state, handler) {

  // Mettre les post traitements dans des helpers


  if(state.loadingData) {
    if(state.presences === null) {
      sendXHR('/data/presences.json', ev => {
        const presences = JSON.parse(ev.target.responseText);
        const validFeatures = presences.features
          .filter(f => /[A-Z]{2}[0-9]-[0-9]{2}/.test(f.attributes.project_code));
        presences.features = validFeatures;  
        handler.publish('ACTIONS', setPresences(presences));
      }); 
    } else if(state.projects === null) {
      sendXHR('/data/projects.json', ev => {
        const projects = JSON.parse(ev.target.responseText);
        const projectCodes = state.presences.features.map(f => f.attributes.project_code);
        const validProjects = projects.filter(p => projectCodes.indexOf(p['Project code']) > -1);
        handler.publish('ACTIONS', setProjects(validProjects));
      });
    } else if(state.extents == null) {
      sendXHR('/data/extents.json', ev => {
        const extents = JSON.parse(ev.target.responseText);
        handler.publish('ACTIONS', setExtents(extents));
      });
    }
  }
}

function main(initState, initVnode, app) {

  const update = function(msg, action) {
    state = reduce(state, action);
    manageIO(state, PubSub);
    newVnode = app.view(state, PubSub);
    patch(oldVnode, newVnode);
    oldVnode = newVnode;
  }

  let newVnode = null, oldVnode = initVnode;
  let state = initState;

  PubSub.subscribe('ACTIONS', update);

  window.onhashchange = route.bind(this, PubSub);
  route(PubSub);
}

main(firstState, document.querySelector('#root'), app);
