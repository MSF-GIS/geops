'use strict';

export const GLOBAL_LEVEL = 'GLOBAL';
export const MISSION_LEVEL = 'MISSION';
export const PROJECT_LEVEL = 'PROJECT';

export const ALL_MISSIONS = 'All Missions';
export const ALL_PROJECTS = 'All Projects';

export const TILE_LYR_GR_TITLE = 'basemaps';

export const superTypes = {
  'general hosp': 'Hospitals',
  'surgery hosp': 'Hospitals',
  'HIV': 'Infectious chr deseases',
  'TB': 'Infectious chr deseases',
  'Hep C': 'Infectious chr deseases',
  'unitaid': 'Infectious chr deseases',
  'PHC': 'PHC',
  'malaria': 'PHC',
  'wash': 'Other',
  'VXS': 'Other',
  'NCDs': 'Other',
  'Other': 'Other'
};

export const superContexts = {
  'coordination': 'direct',
  'support': 'direct',
  'association': 'direct',
  '': 'direct',
  '#NAME?': 'direct' 
};

export const superChoices = {
  'c': 'choice',
  'explo': 'choice',
  'd': 'default',
  'association': 'default',
  'coordination': 'default',
  'eprep': 'default',
  'support': 'default',
  '': 'default',
  '#NAME?': 'default'
}

/*
export const BUDGET_CHOICE_VIZ_ID = 'budget-choice-viz';
export const BUDGET_TYPE_VIZ_ID = 'budget-type-viz';
*/

export const MISSION_COLORS = [
  '#181991', // dark blue
  '#025302', // dark green
  '#d12121', // MSF red
  '#FF8A00', // orange
  '#671e8b', // purple
  '#e91b86', // pink
  '#616161', // dark grey
  '#367ABD', // blue
  '#56B949', // green
  '#f36162', // light red
  '#ffc410', // light orange
  '#A269EF', // light purple
  '#f58db6', // light pink
  '#9E9E9E', // grey
];

export const FILL_COLORS = [
  '#f36162', // light red
  '#ffc410', // light orange
  '#A269EF', // light purple
  '#f58db6', // light pink
  '#FF8A00', // orange
  '#671e8b', // purple
  '#e91b86', // pink
  '#367ABD', // blue
  '#56B949', // green
  '#9E9E9E', // grey,
  '#181991', // dark blue
  '#025302', // dark green
  '#d12121', // MSF red
  '#616161', // dark grey
];

export const typeColors = {
  'coordination': '#f36162',
  'Hospitals': '#ffc410',
  'maternity': '#A269EF',
  'support': '#f58db6',
  'association': '#FF8A00',
  'emergency': '#671e8b',
  'PHC': '#e91b86',
  'Infectious chr deseases': '#367ABD',
  'IDP/refugees': '#56B949',
  'eprep': '#9E9E9E',
  'migrant': '#181991',
  'preallocated': '#025302',
  'Sexual violence': '#d12121',
  'Other': '#616161'
};

export const contextColors = {
  'direct': '#d12121',
  'indirect': '#025302'
};

export const choiceColors = {
  'default': 'rgba(141,160,203,0.7)',
  'choice': 'rgba(231,138,195,0.7)'
};