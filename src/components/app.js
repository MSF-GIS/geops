'use strict';

import '../styles/app.css';
import h from 'snabbdom/h';
import navbar from './navbar';
import modal from './modal';
import overview from './pages/overview';
import ops from './pages/ops';
import hr from './pages/hr';
import notFound from './pages/notFound';
import supply from './pages/supply';
import webmapping from './webmapping';
import vizContainer from './vizContainer';

function view(model, handler) {

  const router = {
    'home': overview,
    'ops': ops,
    'hr': hr,
    'supply': supply,
    '404': notFound
  };
  
  const page = router[model.currentTab]; 
  const defaultContent = h('div#content', [ webmapping(model), vizContainer() ]);

  if(model.loadingData) {
    return h('div#app', [
      navbar.view(model, handler),
      h('main', defaultContent),
      modal.view(model, handler)
    ]);
  }

  return h('div#app', [
    navbar.view(model, handler),
    h('main', page(model, handler)),
    modal.view(model, handler)
  ]);
}

export default { view };