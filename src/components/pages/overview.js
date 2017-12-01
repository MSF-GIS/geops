'use strict';

import h from 'snabbdom/h';
import { ALL_PROJECTS, ALL_MISSIONS } from '../../variables';
import webmapping from '../webmapping';
import { accordion, yearItem, missionItem, projectItem } from '../accordion';
import { projectViz, missionViz } from '../overviewDataviz';
import vizContainer from '../vizContainer';


export default function view(model) {
  const missionList = Object.keys(model.missions)
    .map(k => model.missions[k].name);
  
  const projects = model.projects
    .filter(p => p.mission === model.currentMission)
    .map(p => p.code);
  
  missionList.unshift(ALL_MISSIONS);
  projects.unshift(ALL_PROJECTS);

  const overviewViz = model.currentProject !== ALL_PROJECTS ? projectViz(model.projects
      .filter(p => p.code === model.currentProject)
      .shift())
    : model.currentMission !== ALL_MISSIONS ? missionViz(model.missions[model.currentMission])
    : null;  

  const accordionComponent = accordion([
    yearItem(model),
    missionItem(missionList, model.currentMission),
    projectItem(model.currentProject, projects, model.currentMission !== ALL_MISSIONS)
  ], 'overview');

  return h('div#content', [
    webmapping(model),
    accordionComponent,
    overviewViz,
    vizContainer()
  ]);
}