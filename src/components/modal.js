'use strict';

import '../styles/modal.css';
import h from 'snabbdom/h';

function view(model, handler) {

  return h('div#obfuscator', { class: { 'd-none': !model.openModal } }, [
    h('div#modal-container', [
      h('div#modal-content', [
        h('p', model.modalMsg)
      ])
    ])
  ]);
}

export default { view };