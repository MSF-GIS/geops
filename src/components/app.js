'use strict';

import h from 'snabbdom/h';
import navbar from './navbar';
import webmap from './webmap';
import layerSwitcher from './layerSwitcher';
import home from './home';
import ops from './ops';
import notFound from './notFound';

function view(model, handler) {

  console.log(model);

  const router = {'home': home, 'ops': ops, '404': notFound};

  // router[model.currentTab].view(model, handler)

  return h('div#app', [
    navbar.view(model, handler),
    webmap.view(model, handler),
    layerSwitcher.view(model, handler)
  ]);
}

export default { view };