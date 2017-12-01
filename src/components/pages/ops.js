'use strict';

import h from 'snabbdom/h';
import { ALL_MISSIONS } from '../../variables';
import webmapping from '../webmapping';
import { accordion, yearItem, missionItem, indicatorItem } from '../accordion';
import { sidebar, typeFilterItem, contextFilterItem, choiceFilterItem } from '../sidebar';
import vizContainer from '../vizContainer';
import { indicators } from '../../indicators';

export default function view(model) {

  const missionList = [ALL_MISSIONS];
  Object.keys(model.missions)  
    .map(k => model.missions[k].name)
    .forEach(val => { missionList.push(val); });

  const accordionComponent = accordion([
    yearItem(model),
    missionItem(missionList, model.currentMission),
    indicatorItem(indicators[model.currentTab], model.currentIndicator)
  ], 'ops');

  const sidebarContent = model.currentIndicator === 'Type of projects' ? [typeFilterItem(), contextFilterItem()]
    : [choiceFilterItem()]

  return h('div#content', [
    webmapping(model),
    accordionComponent,
    sidebar(sidebarContent),
    vizContainer()
  ]);
}