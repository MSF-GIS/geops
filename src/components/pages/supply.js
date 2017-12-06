'use strict';

import h from 'snabbdom/h';
import { ALL_MISSIONS } from '../../variables';
import { indicators } from '../../indicators';
import { accordion, yearItem, missionItem, indicatorItem } from '../accordion';
import webmapping from '../webmapping';
import vizContainer from '../vizContainer';

export default function view(model) {

  const missionList = [ALL_MISSIONS];
  Object.keys(model.missions)  
    .map(k => model.missions[k].name)
    .forEach(val => { missionList.push(val); });

  const accordionComponent = accordion([
    yearItem(model),
    missionItem(missionList, model.currentMission),
    indicatorItem(indicators[model.currentTab], model.currentIndicator)
  ], 'supply');

  return h('div#content', [
    webmapping(model),
    accordionComponent,
    vizContainer()
  ]);

}