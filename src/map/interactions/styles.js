'use strict';

import ol from 'openlayers/build/ol.custom';

export const clusterLineStyle = [
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 3,
      color: [238, 238, 238, 0.7]
    }),
    zIndex: 1
  }),
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 1,
      color: [37, 37, 37, 1]
    }),
    zIndex: 2
  })
];

export const invisibleStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(256, 256, 256, 0)'
  })
});