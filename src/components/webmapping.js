'use strict';

import h from 'snabbdom/h';
import PubSub from '../PubSub';

export default function view(model) {
  return h('div#webmapping', { key: 'webmapping' }, [
    h('div#webmap', { key: 'webmap' })
  ]);
}