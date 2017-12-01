'use strict';

import ol from 'openlayers/build/ol.custom';
import { TILE_LYR_GR_TITLE } from '../variables';

 const tileLayerGroup = new ol.layer.Group({
  title: 'basemaps',
  layers: [
    new ol.layer.Tile({
      title: 'Carto Light',
      type: 'base',
      visible: true,
      source: new ol.source.XYZ({
        url: 'https://cartodb-basemaps-{a-c}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        crossOrigin: 'Anonymous',
        maxZoom: 18,
        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>',
        extent: ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857')
      })
    }),
    new ol.layer.Tile({
      title: 'OSM',
      type: 'base',
      visible: false,
      source: new ol.source.XYZ({
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        crossOrigin: 'Anonymous',
        maxZoom: 19,
        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        extent: ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857')
      })
    }),
    new ol.layer.Tile({
      title: 'OSM HOT',
      type: 'base',
      visible: false,
      source: new ol.source.XYZ({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        crossOrigin: 'Anonymous',
        maxZoom: 19,
        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
        extent: ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857')
      })
    }),
    new ol.layer.Tile({
      title: 'ESRI Imagery',
      type: 'base',
      visible: false,
      source: new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'Anonymous',
        attributions: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        extent: ol.proj.transformExtent([-122.445717, -47.576989, 122.218094, 47.71623], 'EPSG:4326', 'EPSG:3857')
      })
    })
  ]
});

export default tileLayerGroup; 