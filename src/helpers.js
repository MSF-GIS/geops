'use strict';

import { superTypes, superContexts, superChoices } from './variables';
import { typeGroups, contextGroups } from './groups';
import { parseInteger } from './util';

export function getProjectsFromData(projectsData) {
  const projects = projectsData
    .map(p => {
      return {
        code: p['Code'],
        country: p['loc1_country'],
        ISO3: p['ISO_3'],
        location: p['loc2_name_place'],
        mission: p['Mission'],
        name: p['Project_name'],
        type: p['Def_project'],
        IS: p['International HR (FTEs)'],
        NS: p['National HR (FTEs)'],
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

  return projects.filter(p => p.financial !== undefined)
    .map(p => {
      p.superType = superTypes[p.type] || p.type;
      p.superContext = superContexts[p.context] || p.context;
      p.superChoice = superChoices[p.choice] || p.choice;
      return p;
    });
}

export function getMissions(projects) {
  return projects.reduce((acc, curr) => {
    const missionName = curr.mission;
    const mission = acc[missionName] || {
      name: missionName,
      ISO3: curr.ISO3,
      IS: 0,
      NS: 0,
      financial: {
        initial: 0,
        COPRO: 0,
        forecast: 0
      }
    };
    mission.financial.initial += curr.financial.initial;
    mission.financial.COPRO += curr.financial.COPRO;
    mission.financial.forecast += curr.financial.forecast;
    mission.IS += curr.IS;
    mission.NS += curr.NS;
    if(curr.isCoordination) {
      mission.lat = curr.lat;
      mission.lon = curr.lon;
      mission.location = curr.location;
    }
    acc[missionName] = mission;
    return acc;
  }, {});
}