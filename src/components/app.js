'use strict';

import h from 'snabbdom/h';
import navbar from './navbar';
import home from './home';
import ops from './ops';
import notFound from './notFound';

function view(model, handler) {

  console.log(model);

  const router = {'home': home, 'ops': ops, '404': notFound};

  return h('div#app', [
    navbar.view(model, handler),
    router[model.currentTab].view(model, handler)
  ]);
}

export default { view };