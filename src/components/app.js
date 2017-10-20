'use strict';
import '../styles/app.css';
import h from 'snabbdom/h';
import navbar from './navbar';
import modal from './modal';
import home from './home';
import ops from './ops';
import notFound from './notFound';

function view(model, handler) {

  console.log(model);

  const router = {'home': home, 'ops': ops, '404': notFound};
  const tab = router[model.currentTab]; 

  if(model.loadingData) {
    return h('div#app', [
      navbar.view(model, handler),
      modal.view(model, handler)
    ]);
  }

  return h('div#app', [
    navbar.view(model, handler),
    h('main', tab.view(model, handler)),
    modal.view(model, handler)
  ]);
}

export default { view };