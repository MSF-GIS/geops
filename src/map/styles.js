'use strict';

import ol from 'openlayers/build/ol.custom';

const hide = new ol.style.Style({ image: '' });

const budgetMission = function(budget, feature, res) {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8 + (budget / 500000),
      stroke: new ol.style.Stroke({
        color: '#fff'
      }),
      fill: new ol.style.Fill({
        color: [43, 131, 186, 0.7]
      })
    })
  });
}

const budgetProject = function(budget, feature, res) {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8 + (budget / 200000),
      stroke: new ol.style.Stroke({
        color: '#fff'
      }),
      fill: new ol.style.Fill({
        color: [43, 131, 186, 0.7]
      })
    })
  });
}

export { hide, budgetMission, budgetProject }; 