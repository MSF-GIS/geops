'use strict';

import h from 'snabbdom/h';
import { setMission } from '../actions';
import { getMissionFromLevel } from '../helpers';
import { ALL_MISSIONS } from '../variables';

function selectMission(handler, ev) {
  ev.preventDefault();
  ev.stopPropagation();
  handler.publish('ACTIONS', setMission(ev.target.innerText));
}

function mapMissionItem(handler, currMission, mission) {
  return h('a.mission-link', {
    on: { click : selectMission.bind(this, handler) },
    attrs: { href: '#' } }, [
    h('li', { class: { 'current-mission': currMission === mission.name } }, mission.name)
  ]);
}

function view(model, handler) {
  const currMission = getMissionFromLevel(model.level);
  const missionsArray = Object.keys(model.missions).map(k => model.missions[k]);
  const missionListItems = missionsArray.map(mapMissionItem.bind(this, handler, currMission));
  missionListItems.unshift(mapMissionItem(handler, currMission, { name: ALL_MISSIONS }));

  return h('div.accordion-item', [
    h('a.filter-link', {
      attrs: { href: '#accordion-mission', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Missions'),
      h('div.current-filter-item', currMission)
    ]),
    h('div#accordion-mission.collapse.show', { attrs: { role: 'tabpanel' } }, [
      h('ul.filter-list', missionListItems)
    ])
  ]);
}

export default { view };