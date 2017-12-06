'use strict';

import PubSub from '../PubSub';
import overviewWebmap from './webmaps/overview/webmap';
import opsWebmap from './webmaps/ops/webmap';
import hrWebmap from './webmaps/hr/webmap';
import supplyWebmap from './webmaps/supply/webmap';

export function init() {
  
  const webmapRouter = {
    'home': overviewWebmap,
    'ops': opsWebmap,
    'hr': hrWebmap,
    'supply': supplyWebmap
  }

  let webmap = null;

  PubSub.subscribe('STATE', (evt, payload) => {
    if(payload.appState.projects && (payload.key === 'currentTab' || payload.key === 'extents')) {
      if(webmap !== null) {
        webmap.destroy();
      }
      webmap = webmapRouter[payload.appState.currentTab](payload.appState);
    }
  });
}