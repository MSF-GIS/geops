'use strict';

import ol from 'openlayers/build/ol.custom';
import { typeGroups, contextGroups, defaultChoiceGroups } from '../groups';
import {
  GLOBAL_LEVEL,
  MISSION_LEVEL,
  PROJECT_LEVEL,
  DEFAULT_COLOR,
  CHOICE_COLOR
} from '../variables';

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
  const typeKeys = Object.keys(typeGroups);
  const typeGroup = typeKeys.reduce((acc, curr) => {
    typeGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const contextKeys = Object.keys(contextGroups);
  const contextGroup = contextKeys.reduce((acc, curr) => {
    contextGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const type = typeGroup[feature.get('type')] || feature.get('type');
  const context = contextGroup[feature.get('context')] || feature.get('context');
  const budget = feature.get('financial').initial + feature.get('financial').COPRO;

  const circle = new ol.style.Circle({
    radius: 8 + (budget / 500000),
    stroke: new ol.style.Stroke({
      color: model.colors['contexts@' + context],
      width: 2
    }),
    fill: new ol.style.Fill({
      color: model.colors['types@' + type]
    })
  });

  circle.setOpacity(0.8);

  return new ol.style.Style({ image: circle }); 
}

const defaultChoiceBudget = function(model, feature, res) {
  const keys = Object.keys(defaultChoiceGroups);
  const group = keys.reduce((acc, curr) => {
    defaultChoiceGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const defChoice = group[feature.get('choice')] || feature.get('choice');
  const budget = feature.get('financial').initial + feature.get('financial').COPRO;

  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8 + (budget / 500000),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      }),
      fill: new ol.style.Fill({
        color: defChoice === 'default' ? DEFAULT_COLOR : CHOICE_COLOR
      })
    })    
  });
};

const opsStyles = {
  [GLOBAL_LEVEL]: {
    'Type of projects': typeContextBudget,
    'Default/choice': defaultChoiceBudget
  },
  [MISSION_LEVEL]: {
    'Type of projects': typeContextBudget,
    'Default/choice': defaultChoiceBudget
  },
  [PROJECT_LEVEL]: {
    'Type of projects': typeContextBudget,
    'Default/choice': defaultChoiceBudget
  }
}

const styles = {
  'ops': opsStyles
}

export { styles, hide }; 