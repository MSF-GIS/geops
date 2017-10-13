'use strict';
import '../styles/layerSwitcher.css';
import h from 'snabbdom/h';
import { setLayerSwitherCollapsed, setLayerSwitherChecked } from '../actions';

function setCollapsed(handler, collapsed) {
  handler.publish('ACTIONS', setLayerSwitherCollapsed(collapsed));
}

function setChecked(handler, ev) {
  handler.publish('ACTIONS', setLayerSwitherChecked(ev.target.value)); 
}

function view(model, handler) {
  const collapsed = model.layerSwitcherCollapsed;
  const checked = model.layerSwitcherChecked;

  const baseLayers = [{
    id: 'carto',
    name: 'Carto Light'
  },{
    id: 'esriIm',
    name: 'Esri Imagery'
  },{
    id: 'OSMHOT',
    name: 'OSM HOT'
  },{
    id: 'OSM',
    name: 'OSM' 
  }];

  const layerItems = baseLayers.map(layer => {
    return h('div.form-check', [
      h('div.form-check-label', [
        h('input.form-check-input', {
          attrs: { type: 'radio', name: 'base', value: layer.id, checked: checked === layer.id }
        }),
        layer.name
      ])
    ]);
  });

  return h('div#layer-switcher', [
    h('div#hamburger', { class: { 'd-none': collapsed }, on: { mouseenter: setCollapsed.bind(this, handler, true) } }),
    h('div#base-layers', { class: { 'd-none': !collapsed }, on: { mouseleave: setCollapsed.bind(this, handler, false) } }, [
      h('h3', 'Basemap'),
      h('div#base-layers-inputs', { on: { change: setChecked.bind(this, handler) } }, layerItems)
    ])
  ]);
}

export default { view };