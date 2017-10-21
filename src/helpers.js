'use strict';

import { GLOBAL_LEVEL, MISSION_LEVEL, ALL_MISSIONS, ALL_PROJECTS, FILL_COLORS } from './variables';
import typeGroups from './typeGroups';

export function getMissionFromLevel(level) {
  return level === GLOBAL_LEVEL ? ALL_MISSIONS : level.split('@@')[1];
}

export function getProjectFromLevel(level) {
  return level === GLOBAL_LEVEL || level.startsWith(MISSION_LEVEL) ? ALL_PROJECTS : level.split('@@')[2];
}

export function getLevel(level) {
  return level === GLOBAL_LEVEL ? GLOBAL_LEVEL : level.split('@@')[0];
}

export function getAdditionalFilters(projects) {
  const keys = Object.keys(typeGroups);
  const group = keys.reduce((acc, curr) => {
    typeGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const tempTypes = projects.map(p => group[p['definition project']] || p['definition project']);
  const types = tempTypes.filter((p, pos, array) => array.indexOf(p) === pos);

  const tempContexts = projects.map(p => p.conflict);
  const contexts = tempContexts.filter((p, pos, array) => array.indexOf(p) === pos);

  return { types: types, contexts: contexts };
}

export function setAdditionalFiltersColors(addFilters, colors) {
  const filterNames = Object.keys(addFilters);
  filterNames.forEach(fname => {
    const values = addFilters[fname];
    values.forEach((val, index) => {
      const key = fname + '@' + val;
      colors[key] = FILL_COLORS[index];
    });
  });

  return colors;
}