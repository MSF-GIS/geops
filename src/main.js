'use strict';

import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/collapse';
import { init } from 'snabbdom';
import h from 'snabbdom/h';
import PubSub from './PubSub';
import routes from './routes';
import { setCurrentTab, setPresences, setProjects, setExtents, setFinancials } from './actions';
import app from './components/app';
import { sendXHR, parseInteger } from './util';
import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL, ALL_MISSIONS, ALL_PROJECTS } from './variables';
import * as AppState from './AppState';
import * as webmapController from './map/webmapController';
import * as vizController from './viz/vizController';

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/dataset').default,
  require('snabbdom/modules/style').default
]);

function route() {
  const routeId = window.location.hash.replace('#', '');
  const tempRoutes = routes.filter(r => !r.disabled)
    .filter(r => r.id === routeId);  

  if(routeId === '' || routeId === '#') {
    PubSub.publish('ACTIONS', setCurrentTab('home'));
    return;    
  }

  if(tempRoutes < 1){
    PubSub.publish('ACTIONS', setCurrentTab('404'));
    return;
  }

  PubSub.publish('ACTIONS', setCurrentTab(tempRoutes[0].id));
}

function manageIO(state, handler) {

  if(state.loadingData) {
    if(state.projects === null) {
      sendXHR('/data/projects.json', ev => {
        const projectsData = JSON.parse(ev.target.responseText);
        handler.publish('ACTIONS', setProjects(projectsData));
      });
    } else if(state.missions === null) {  
      sendXHR('/data/financials.json', ev => {
        const financialsData = JSON.parse(ev.target.responseText);
        handler.publish('ACTIONS', setFinancials(financialsData));
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
    state = AppState.update(state, action);
    manageIO(state, PubSub);
    newVnode = app.view(state, PubSub);
    patch(oldVnode, newVnode);
    oldVnode = newVnode;
  }

  let newVnode = null, oldVnode = initVnode;
  let state = initState;

  PubSub.subscribe('ACTIONS', update);

  webmapController.init();
  vizController.init();

  window.onhashchange = route;
  route();
}

main(AppState.firstState, document.querySelector('#root'), app);
