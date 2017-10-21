'use strict';

import '../styles/webmapping.css';
import ol from 'openlayers/build/ol.custom';
import { carto, OSM, OSMHOT, esriIm } from './tileLayers';
import { styles, hide } from './styles';
import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL } from '../variables';
import { parseInteger } from '../util';
import { getMissionFromLevel, getProjectFromLevel, getLevel } from '../helpers';
import featureFilters from './featureFilters';

let map = null;

function init(model, handler) {

  const projectsSource = new ol.source.Vector({});

  const projectsLayer = new ol.layer.Vector({
    title: 'Projects',
    source: projectsSource
  });

  const baseLayersGroup = new ol.layer.Group({
    title: 'Basemap',
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
    layers: [baseLayersGroup, projectsLayer],
    controls: ol.control.defaults({ attribution: false }).extend([attribution]),
    view: view
  });

  update(model, handler);
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

function loadData(map, presences, projects) {
  const layers = map.getLayers().getArray();
  const projectsLayer = layers.filter(l => l.get('title') === 'Projects')[0];
  const projectsSource = projectsLayer.getSource();

  if(projectsSource.getFeatures().length === 0 && presences !== null && projects !== null) {
 
    const format = new ol.format.EsriJSON();
    const baseFeatures = format.readFeatures(presences);

    const features = baseFeatures.map(f => {
      const tmpProjects = projects.filter(p => p['Project code'] === f.get('project_code'));
      if(tmpProjects.length > 0) {
        const project = tmpProjects[0];
        f.set('mission', project['Mission']);
        f.set('projectName', project['Project Name']);
        f.set('type', project['definition project']);
        f.set('context', project['conflict']);
        f.set('choice', project['default/choice']);
        f.set('initial', parseInteger(project['Initial 2017 (Euro)']));
        f.set('copro', parseInteger(project['COPRO 2017 (Euro)']));
      }
      return f;
    });

    projectsSource.addFeatures(features);
  } 
}

function updateVectorLayer(map, model) {
  const layers = map.getLayers().getArray();
  const projectsLayer = layers.filter(l => l.get('title') === 'Projects')[0];
  const features = projectsLayer.getSource().getFeatures();

  if(model.updateVectorLayer) {

    const fitFeatures = function(fs, map, model) {
      const coordinates = fs.map(f => f.get('geometry').getCoordinates());
      const extent = ol.extent.boundingExtent(coordinates);      
      map.getView().fit(extent);
    }

    const fitCountry = function(fs, map, model) {
      const mission = getMissionFromLevel(model.level);
      const extent = model.extents.filter(e => e.name.toUpperCase() === mission.toUpperCase())[0].extent; 
      map.getView().fit(ol.proj.transformExtent(extent,'EPSG:4326','EPSG:3857'));
    }

    const fitPoint = function(fs, map, model) {
      map.getView().fit(fs[0].get('geometry'), { maxZoom: 11 });      
    }

    const fitWorld = function(fs, map, model) { 
      map.getView().fit(ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857'));
    }

    const transitions = {
      [GLOBAL_LEVEL]: fitWorld,
      [MISSION_LEVEL]: fitCountry,
      [PROJECT_LEVEL]: fitPoint
    };

    const level = getLevel(model.level);
    const style = styles[model.currentTab][level][model.indicator];
    const filter = featureFilters[model.currentTab][level][model.indicator];
    const featuresToKeep = features.filter(filter.bind(this, model));

    features.forEach(f => { f.setStyle(hide); });
    featuresToKeep.forEach(f => f.setStyle(style.bind(this, model)));

    const transition = transitions[level].bind(this, featuresToKeep, map, model);
    transition();
  }

}

function update(model, handler) {
  
  if(map !== null) {
    
    loadData(map, model.presences, model.projects);

    updateBaseLayer(map, model.layerSwitcherChecked);

    updateVectorLayer(map, model);
  }
}

export default { init, update }