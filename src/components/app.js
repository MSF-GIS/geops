'use strict';

import h from 'snabbdom/h';
import navbar from './navbar';
import home from './home';
import ops from './ops';


function view(model, handler) {

  console.log(model);

  const router = {
    'home': home,
    'ops': ops,
  }

  return h('div#app', [
    navbar.view(model, handler),
    router[model.currentTab].view(model, handler)
  ]);
}

export default { view };