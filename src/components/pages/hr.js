'use strict';

import h from 'snabbdom/h';
import { ALL_MISSIONS } from '../../variables';
import webmapping from '../webmapping';
import { accordion, yearItem, missionItem } from '../accordion';
import vizContainer from '../vizContainer';

export default function view(model) {

  const missionList = [ALL_MISSIONS];
  Object.keys(model.missions)  
    .map(k => model.missions[k].name)
    .forEach(val => { missionList.push(val); });  

  const accordionComponent = accordion([
    yearItem(model),
    missionItem(missionList, model.currentMission),
  ]);

  return h('div#content', [
    webmapping(model),
    accordionComponent,
    vizContainer()
  ]);
}