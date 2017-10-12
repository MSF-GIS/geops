'use strict';

import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/collapse';
import {init} from 'snabbdom';
import h from 'snabbdom/h';
import PubSub from './PubSub';
import routes from './routes';
import { setCurrentTab } from './actions';
import app from './components/app';

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/dataset').default
]);

const firstState = {
  currentTab: 'home'
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

function reduce(state, action) {

  switch (action.type) {
    case 'SET_CURRENT_TAB' :
      state.currentTab = action.payload;
      return state;
  }

  return state;
}

function main(initState, initVnode, app) {

  const update = function(msg, action) {
    state = reduce(state, action);
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
