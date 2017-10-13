'use strict';

import '../styles/webmapping.css';
import ol from 'openlayers/build/ol.custom';
import { carto, OSM, OSMHOT, esriIm } from './tileLayers';

let map = null;

function init(model, handler) {

  const baseLayersGroup = new ol.layer.Group({
    'title': 'Basemap',
    layers: [carto, OSM, OSMHOT, esriIm]
  });

  const attribution = new ol.control.Attribution({ collapsible: false });

  const view = new ol.View({
    center: [0, 0],
    zoom: 2,
    extent: ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857')
  })

  map = new ol.Map({
    target: 'webmap',
    layers: [baseLayersGroup],
    controls: ol.control.defaults({attribution: false}).extend([attribution]),
    view: view
  });
}

function updateBaseLayer(map, title) {
  const baseLayersGroup = map.getLayers().getArray().filter(l => l.get('title') === 'Basemap')[0];
  const currentBaseLayer = baseLayersGroup.getLayers().getArray().filter(l => l.get('visible'))[0];

  if(currentBaseLayer.get('title') !== title) {
    const newBaseLayer = baseLayersGroup.getLayers().getArray().filter(l => l.get('title') === title)[0];
    newBaseLayer.set('visible', true);
    currentBaseLayer.set('visible', false);
  }
}

function update(model, handler) {
  
  if(map !== null) {
    updateBaseLayer(map, model.layerSwitcherChecked);   
  }
}

export default { init, update }