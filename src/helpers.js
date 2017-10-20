'use strict';

import { GLOBAL_LEVEL, MISSION_LEVEL, ALL_MISSIONS, ALL_PROJECTS } from './variables';

export function getMissionFromLevel(level) {
  return level === GLOBAL_LEVEL ? ALL_MISSIONS : level.split('@@')[1];
}

export function getProjectFromLevel(level) {
  return level === GLOBAL_LEVEL || level.startsWith(MISSION_LEVEL) ? ALL_PROJECTS : level.split('@@')[2];
}