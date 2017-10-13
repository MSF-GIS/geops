'use strict';

import h from 'snabbdom/h';
import webmapping from '../map/webmapping';

function view(model, handler) {

  webmapping.update(model, handler);

  return h('div#webmap', {
    hook: {
      insert: webmapping.init.bind(this, model, handler),
      destroy: webmapping.destroy
    }
  })
}

export default { view }