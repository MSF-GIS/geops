'use strict';

import '../../../styles/webmapping.css';
import ol from 'openlayers/build/ol.custom';
import '../../flyToExtent';
import PubSub from '../../../PubSub';
import tileLayerGroup from '../../tileLayerGroup';
import ScrollControl from '../../controls/ScrollControl';
import ExportControl from '../../controls/ExportControl';
import TileLayerSwitcherControl from '../../controls/TileLayerSwitcherControl';
import OptionsControl from '../../controls/OptionsControl';
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
    features: appState.projects.map(toFeature)
  };

  const vectorLayerSource = new ol.source.Vector({
    features: geojsonReader.readFeatures(geojson)
  });

  const clusterSource = new ol.source.Cluster({
    source: vectorLayerSource,
    distance: 30,
    wrapX: false
  });

  const vectorLayer = new ol.layer.Vector({
    title: 'vector',
    source: clusterSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    style: styles.typeContextCluster
  });

  const controls = [
    new ol.control.Zoom({ duration: 500 }),
    new ol.control.Attribution({ collapsible: false }),
    new ScrollControl(),
    new TileLayerSwitcherControl({ tileLayerGroup: tileLayerGroup }),
    new ExportControl(),
    new OptionsControl()
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
    padding: [50, 100, 10, 100]
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
      map.getView().fit(extent, { duration: 700, constrainResolution: false, padding: [50, 100, 10, 100] });
      return;
    }

    map.getView().flyToExtent(extent, [50, 50, 50, 50], map.getSize(), minZoom, 11);
  }

  function handleStyle(appState) {

    if(appState.currentIndicator === 'Type of projects' && !appState.budgetDisplay) {
      vectorLayer.setStyle(styles.typeContextCluster);
      return;
    }

    if(appState.currentIndicator === 'Type of projects' && appState.budgetDisplay) {
      vectorLayer.setStyle(styles.typeContextBudgetCluster);
      return;
    }

    if(appState.currentIndicator !== 'Type of projects' && !appState.budgetDisplay) {
      vectorLayer.setStyle(styles.defaultChoiceCluster);
      return;
    }

    if(appState.currentIndicator !== 'Type of projects' && appState.budgetDisplay) {
      vectorLayer.setStyle(styles.defaultChoiceBudgetCluster);
      return;
    }
  }

  function handleFilters(appState) {
    const geojson = { type: 'FeatureCollection' };
    const toKeep = appState.projects.slice(0);

    const filteredProjects = Object.keys(appState.filters).reduce((acc, curr) => {
      const attr = curr;
      const values = appState.filters[attr];
      const results = [];
      acc.filter(p => values.indexOf(p[attr]) < 0)
        .forEach(p => { results.push(p) });
      return results; 
    }, toKeep);

    geojson.features = filteredProjects.map(toFeature);
    vectorLayerSource.clear();
    vectorLayerSource.addFeatures(geojsonReader.readFeatures(geojson));
  }

  const token = PubSub.subscribe('STATE', (evt, payload) => {
    switch(payload.key) {
      case 'currentMission':
        handleMapView(payload.appState);
        break;
      case 'currentIndicator':
        handleFilters(payload.appState);
        declusterInteraction.declusterAll();
        handleStyle(payload.appState);
        break;
      case 'filters':
        handleFilters(payload.appState);
        declusterInteraction.declusterAll();
        break;    
      case 'budgetDisplay':
        handleStyle(payload.appState);
        declusterInteraction.declusterAll();
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