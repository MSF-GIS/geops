'use strict';

import { GLOBAL_LEVEL, MISSION_LEVEL, PROJECT_LEVEL } from '../variables';
import { getMissionFromLevel, getProjectFromLevel } from '../helpers';
import { typeGroups, contextGroups } from '../groups';

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
  const keepType = model.additionalFilters.types.indexOf(type) > -1;
  const keepContext = model.additionalFilters.contexts.indexOf(context) > -1;
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