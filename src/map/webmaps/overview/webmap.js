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
import * as styles from './styles';
import * as popupTpls from './popupTpls';
import { ALL_MISSIONS, ALL_PROJECTS } from '../../../variables';

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

function getFeatures(appState) {
  const geojson = { type: 'FeatureCollection', features: [] };

  if(appState.currentMission === ALL_MISSIONS) {
    geojson.features = Object.keys(appState.missions)
      .map(key => appState.missions[key])
      .map(toFeature);
    return geojson;  
  }

  if(appState.currentProject === ALL_PROJECTS) {
    geojson.features = appState.projects
      .filter(p => p.mission === appState.currentMission)
      .map(toFeature);
    return geojson;  
  }

  geojson.features = appState.projects
    .filter(p => p.code === appState.currentProject)
    .map(toFeature);

  return geojson;
}

function handlePopup(popupOverlay, popupContent, popupTpl, evt) {
  const map = evt.map;
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

  if(!feature) {
    popupOverlay.setPosition(null);
    return;
  }

  const coord = feature.get('geometry').getCoordinates();
  const props = feature.get('features') ? feature.get('features')[0].getProperties()
    : feature.getProperties()
  popupContent.innerHTML = popupTpl(props);
  popupOverlay.setPosition(coord);
}

export default function(appState) {
  const geojsonReader = new ol.format.GeoJSON();

  const vectorLayerSource = new ol.source.Vector({
    features: geojsonReader.readFeatures(getFeatures(appState))
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
    style: styles.MSFIconStyle
  });

  const controls = [
    new ol.control.Zoom({ duration: 500 }),
    new ol.control.Attribution({ collapsible: false }),
    new ScrollControl(),
    new TileLayerSwitcherControl({ tileLayerGroup: tileLayerGroup }),
    new ExportControl(),
  ];

  const declusterInteraction = new DeclusterInteraction({ layer: vectorLayer });

  const interactions = [
    new ol.interaction.DoubleClickZoom({ duration: 500 }),
    new ol.interaction.MouseWheelZoom({ duration: 500 }),
    declusterInteraction
  ];

  const popupContent = document.createElement('div');
  popupContent.id = 'popup-content';

  const popupCloser = document.createElement('a');
  popupCloser.id = 'popup-closer';
  popupCloser.setAttribute('class', 'ol-popup-closer');
  popupCloser.setAttribute('href', '#');  

  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.setAttribute('class', 'ol-popup');
  popup.appendChild(popupCloser);
  popup.appendChild(popupContent);

  const popupOverlay = new ol.Overlay({
    element: popup,
    autoPan: true,
    offset: [0, -37],
    autoPanMargin: 30,
    positioning: 'center-center',
    autoPanAnimation: {
      duration: 250
    }
  });

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
    overlays: [popupOverlay],
    view: view
  });

  popupCloser.onclick = () => {
    popupOverlay.setPosition(null);
    popupCloser.blur();
    return false;
  }

  view.fit(vectorLayerSource.getExtent(), {
    constrainResolution: false,
    padding: [50, 100, 10, 100]
  });

  view.setMinZoom(view.getZoom());

  let popupTpl = popupTpls.missionTpl;

  map.on('click', handlePopup.bind(this, popupOverlay, popupContent, popupTpl));

  function handleCluster(currentMission) {
    declusterInteraction.declusterAll();
    clusterSource.setDistance(currentMission == ALL_MISSIONS ? 0 : 30);
  }

  function handleFeatures(appState) {
    const features = getFeatures(appState);
    vectorLayerSource.clear();
    vectorLayerSource.addFeatures(geojsonReader.readFeatures(features));        
  }

  function handleMapView(appState) {
    const minZoom = appState.currentProject === ALL_PROJECTS ? 4 : 8;
    const extent = appState.currentMission === ALL_MISSIONS ? vectorLayerSource.getExtent()
      : appState.currentProject !== ALL_PROJECTS ? vectorLayerSource.getExtent()
      : appState.extents 
        .filter(e => e.ISO === vectorLayerSource.getFeatures()[0].getProperties().ISO3)
        .map(e => ol.proj.transformExtent(e.extent, 'EPSG:4326', 'EPSG:3857'))
        .shift();

    if(appState.currentMission == ALL_MISSIONS || !map.getView().getZoom() || map.getView().getZoom() < 3) {
      map.getView().fit(extent, { duration: 700, constrainResolution: false, padding: [50, 0, 10, 100] });
      return;
    }

    map.getView().flyToExtent(extent, [50, 50, 50, 50], map.getSize(), minZoom, 11);
  }

  function handlePopupTemplate(appState) {
    popupTpl = appState.currentMission === ALL_MISSIONS ? popupTpls.missionTpl
      : popupTpls.projectTpl;
  }

  const token = PubSub.subscribe('STATE', (evt, payload) => {
    switch(payload.key) {
      case 'currentMission':
        handleFeatures(appState);
        handleCluster(payload.value);
        handleMapView(appState);
        handlePopupTemplate(appState);
        break;
      case 'currentProject':
        handleFeatures(appState);
        handleMapView(appState);
        break;  
    }
  });

  return {
    destroy: () => {
      PubSub.unsubscribe(token);
      popupCloser.onclick = undefined;
      popup.remove();
      map.setTarget(null);
    }
  }  
}