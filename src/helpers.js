'use strict';

import { GLOBAL_LEVEL, MISSION_LEVEL, ALL_MISSIONS, ALL_PROJECTS, FILL_COLORS } from './variables';
import { typeGroups, contextGroups } from './groups';
import { parseInteger } from './util';

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
  const typeKeys = Object.keys(typeGroups);
  const typeGroup = typeKeys.reduce((acc, curr) => {
    typeGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const contextkeys = Object.keys(contextGroups);
  const contextGroup = contextkeys.reduce((acc, curr) => {
    contextGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const tempTypes = projects.map(p => typeGroup[p.type] || p.type);
  const types = tempTypes.filter((p, pos, array) => array.indexOf(p) === pos);

  const tempContexts = projects.map(p => contextGroup[p.context] || p.context);
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

export function getProjectsFromData(projectsData) {
  const projects = projectsData.map(p => {
    return {
      code: p['Code'],
      country: p['loc1_country'],
      ISO3: p['ISO_3'],
      location: p['loc2_name_place'],
      mission: p['Mission'],
      name: p['Project_name'],
      type: p['Def_project'],
      isCoordination: p['type'] === 'coordination',
      lat: p['loc3_lat_Y'],
      lon: p['loc3_Long_X']
    }
  });

  return projects.filter(p => {
    return p.type !== '#N/A' && p.lat !== '#REF!' && p.lon !== '#REF!';
  });
}

export function mergeProjectsAndFinancials(projects, financialsData) {
  const financials = financialsData.map(f => {
    return {
      projectCode: f['Project code'], 
      year: 2017,
      initial: parseInteger(f['Initial 2017 (Euro)']),
      COPRO: parseInteger(f['COPRO 2017 (Euro)']),
      forecast: parseInteger(f['New Project Forecast (Euro) - to update']),
      choice: f['default/choice'],
      context: f['conflict']
    }
  });

  const codes = projects.map(p => p.code);
  const filtFinancials = financials.filter(f => codes.indexOf(f.projectCode) > -1);

  const redFinanacials = filtFinancials.reduce((acc, curr) => {
    const tmpProjects = acc.filter(p => p.projectCode === curr.projectCode);
    if(tmpProjects.length > 0) {
      const project = acc.filter(p => p.projectCode === curr.projectCode)[0];
      project.initial += curr.initial;
      project.COPRO += curr.COPRO;
      project.forecast += curr.forecast;
    } else {
      acc.push(curr);
    } 
    return acc;
  }, []);

  projects.forEach(p => {
    const tmpFinancials = redFinanacials.filter(f => f.projectCode === p.code);
    if(tmpFinancials.length > 0) {
      const financial = tmpFinancials[0];
      p.choice = financial.choice;
      p.context = financial.context;
      p.financial = {};
      p.financial.initial = financial.initial;
      p.financial.COPRO = financial.COPRO;
      p.financial.forecast = financial.forecast;
    }
  });

  return projects.filter(p => p.financial !== undefined);
}

export function getMissions(projects) {
  return projects.reduce((acc, curr) => {
    const missionName = curr.mission;
    const mission = acc[missionName] || {
      name: missionName,
      ISO3: curr.ISO3,
      financial: {
        initial: 0,
        COPRO: 0,
        forecast: 0
      }
    };
    mission.financial.initial += curr.financial.initial;
    mission.financial.COPRO += curr.financial.COPRO;
    mission.financial.forecast += curr.financial.forecast;
    acc[missionName] = mission;
    return acc;
  }, {});
}