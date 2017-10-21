'use strict';

import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL } from '../variables';
import { getMissionFromLevel, getProjectFromLevel } from '../helpers';
import typeGroups from '../typeGroups';

function all(model, feature) {
  return true;
}

function filterByCoordination(model, feature) {
  return feature.get('type') === 'coordination';
}

function filterByCurrentMission(model, feature) {
  const mission = getMissionFromLevel(model.level);
  return feature.get('mission') === mission;
}

function filterByCurrentProject(model, feature) {
  const project = getProjectFromLevel(model.level);
  return feature.get('project_code') === project;
}

function filterByTypeAndContext(model, feature) {
  const keys = Object.keys(typeGroups);
  const group = keys.reduce((acc, curr) => {
    typeGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const type = group[feature.get('type')] || feature.get('type');
  const keepType = model.additionalFilters.types.indexOf(type) > -1;
  const keepContext = model.additionalFilters.contexts.indexOf(feature.get('context')) > -1;
  return keepType && keepContext;
}

const opsFilters = {
  [GLOBAL_LEVEL]: {
    'Type of projects': filterByTypeAndContext,
    'Default/choice': filterByTypeAndContext
  },
  [MISSION_LEVEL]: {
    'Type of projects': filterByTypeAndContext,
    'Default/choice': filterByTypeAndContext
  },
  [PROJECT_LEVEL]: {
    'Type of projects': filterByTypeAndContext,
    'Default/choice': filterByTypeAndContext
  }
};

const filters = {
  'ops': opsFilters
};

export default filters;