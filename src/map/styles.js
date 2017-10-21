'use strict';

import ol from 'openlayers/build/ol.custom';
import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL } from '../variables';
import typeGroups from '../typeGroups';

const hide = new ol.style.Style({ image: '' });

const budgetMission = function(model, feature, res) {
  const mission = feature.get('mission');
  const budget = model.missions[mission].budget;
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

const budgetProject = function(model, feature, res) {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8 + (feature.get('initial') / 200000),
      stroke: new ol.style.Stroke({
        color: '#fff'
      }),
      fill: new ol.style.Fill({
        color: [43, 131, 186, 0.7]
      })
    })
  });
}

const typeContextBudget = function(model, feature, res) {
  const keys = Object.keys(typeGroups);
  const group = keys.reduce((acc, curr) => {
    typeGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const type = group[feature.get('type')] || feature.get('type');

  const circle = new ol.style.Circle({
    radius: 8 + (feature.get('initial') / 500000),
    stroke: new ol.style.Stroke({
      color: model.colors['contexts@' + feature.get('context')]
    }),
    fill: new ol.style.Fill({
      color: model.colors['types@' + type]
    })
  });

  circle.setOpacity(0.5);

  return new ol.style.Style({ image: circle }); 
}

const opsStyles = {
  [GLOBAL_LEVEL]: {
    'Type of projects': typeContextBudget,
    'Default/choice': typeContextBudget
  },
  [MISSION_LEVEL]: {
    'Type of projects': typeContextBudget,
    'Default/choice': typeContextBudget
  },
  [PROJECT_LEVEL]: {
    'Type of projects': typeContextBudget,
    'Default/choice': typeContextBudget
  }
}

const styles = {
  'ops': opsStyles
}

export { styles, hide }; 