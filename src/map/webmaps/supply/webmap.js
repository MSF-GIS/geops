'use strict';

import '../../../styles/webmapping.css';
import ol from 'openlayers/build/ol.custom';
import '../../flyToExtent';
import PubSub from '../../../PubSub';
import tileLayerGroup from '../../tileLayerGroup';
import ScrollControl from '../../controls/ScrollControl';
import ExportControl from '../../controls/ExportControl';
import TileLayerSwitcherControl from '../../controls/TileLayerSwitcherControl';
import DeclusterInteraction from '../../interactions/DeclusterInteraction';
import { ALL_MISSIONS, ALL_PROJECTS } from '../../../variables';
import * as styles from './styles';

function toFeature(obj) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: ol.proj.transform([obj.lon, obj.lat], 'EPSG:4326', 'EPSG:3857')
    },
    properties: obj
  };
}

export default function(appState) {
  const geojsonReader = new ol.format.GeoJSON();
  const geojson = {
    type: 'FeatureCollection',
    features: []
  };

  geojson.features = Object.keys(appState.missions)
    .map(key => appState.missions[key])
    .map(toFeature);

  const vectorLayerSource = new ol.source.Vector({
    features: geojsonReader.readFeatures(geojson)
  });

  const clusterSource = new ol.source.Cluster({
    source: vectorLayerSource,
    distance: 0,
    wrapX: false
  });

  const vectorLayer = new ol.layer.Vector({
    title: 'vector',
    source: clusterSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    style: styles.stockCluster
  });

  const controls = [
    new ol.control.Zoom({ duration: 500 }),
    new ol.control.Attribution({ collapsible: false }),
    new ScrollControl(),
    new TileLayerSwitcherControl({ tileLayerGroup: tileLayerGroup }),
    new ExportControl()
  ];

  const declusterInteraction = new DeclusterInteraction({ layer: vectorLayer });

  const interactions = [
    new ol.interaction.DoubleClickZoom({ duration: 500 }),
    new ol.interaction.MouseWheelZoom({ duration: 500 }),
    declusterInteraction
  ];

  const view = new ol.View({
    center: [0, 0],
    zoom: 2.9,
    extent: ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857')
  });

  const map = new ol.Map({
    target: 'webmap',
    layers: [tileLayerGroup, vectorLayer],
    controls: ol.control.defaults({ attribution: false, zoom: false }).extend(controls),
    interactions: ol.interaction.defaults({ doubleClickZoom: false, mouseWheelZoom: false }).extend(interactions),
    view: view
  });

  view.fit(vectorLayerSource.getExtent(), {
    constrainResolution: false,
    padding: [50, 50, 10, 100]
  });

  view.setMinZoom(view.getZoom());

  function handleMapView(appState) {
    const minZoom = appState.currentProject === ALL_PROJECTS ? 4 : 8;      
    let extent;

    if(appState.currentMission === ALL_MISSIONS || appState.currentProject !== ALL_PROJECTS) {
      extent = vectorLayerSource.getExtent();
    } else {
      const ISO3 = appState.missions[appState.currentMission].ISO3;
      extent = appState.extents
        .filter(e => e.ISO === ISO3)
        .map(e => ol.proj.transformExtent(e.extent, 'EPSG:4326', 'EPSG:3857'))
        .shift();
    }

    if(appState.currentMission == ALL_MISSIONS || !map.getView().getZoom() || map.getView().getZoom() < 3) {
      map.getView().fit(extent, { duration: 700, constrainResolution: false, padding: [50, 50, 10, 100] });
      return;
    }

    map.getView().flyToExtent(extent, [50, 50, 50, 50], map.getSize(), minZoom, 11);
  }

  function handleStyle(appState) {

    if(appState.currentIndicator === 'Stocks') {
      vectorLayer.setStyle(styles.stockCluster);
      return;
    }

    if(appState.currentIndicator === 'Procurement') {
      vectorLayer.setStyle(styles.procurementCluster);
      return;
    }
    
  }

  const token = PubSub.subscribe('STATE', (evt, payload) => {
    switch(payload.key) {
      case 'currentMission':
        handleMapView(payload.appState);
        break;
      case 'currentIndicator':
        handleStyle(payload.appState);
        break;  
    }
  });
  
  return {
    destroy: () => {
      PubSub.unsubscribe(token);
      map.setTarget(null);
    }
  }  
}