'use strict';

import '../styles/accordion.css';
import h from 'snabbdom/h';
import PubSub from '../PubSub';
import { setMission, setIndicator, setProject } from '../actions';
import { getMissionFromLevel, getProjectFromLevel } from '../helpers';
import { GLOBAL_LEVEL, ALL_PROJECTS, ALL_MISSIONS } from '../variables';

export function accordion(children, key) {
  return h('div#accordion-container', { key: key }, [
    h('div#accordion', { dataset: { children: '.accodion-item' } }, children)
  ]);
}

export function missionItem(missionList, actMission) {
  const activeMission = actMission || ALL_MISSIONS;
  const missionListItems = missionList.map(mapMissionItem.bind(this, activeMission));
  
  function selectMission(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    PubSub.publish('ACTIONS', setMission(ev.target.innerText));
  }

  function mapMissionItem(currMission, mission) {
    return h('a.mission-link', {
      on: { click : selectMission},
      attrs: { href: '#' } }, [
        h('li', { class: { 'current-mission': currMission === mission } }, mission)
      ]);
  }

  return h('div#accordion-mission-item.accordion-item', [
    h('a.filter-link', {
      attrs: { href: '#accordion-mission-item-content', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Mission'),
      h('div.current-filter-item', activeMission)
    ]),
    h('div#accordion-mission-item-content.collapse.show', { attrs: { role: 'tabpanel' } }, [
      h('ul.filter-list', missionListItems)
    ])
  ]);
}

export function indicatorItem(indicatorList, currentIndicator) {
  const indicatorListItems = indicatorList.map(mapIndicatorItem.bind(this, currentIndicator));

  function selectIndicator(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    PubSub.publish('ACTIONS', setIndicator(ev.target.innerText));
  }

  function mapIndicatorItem(currIndicator, indicator) {
    return h('a.indicator-link', {
      on: { click : selectIndicator },
      attrs: { href: '#' } }, [
        h('li', { class: { 'current-indicator': currIndicator === indicator } }, indicator)
      ]);
  }

  return h('div#accordion-indicator-item.accordion-item', [
    h('a.filter-link', {
      attrs: { href: '#accordion-indicator-item-content', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Indicator'),
      h('div.current-filter-item', currentIndicator)
    ]),
    h('div#accordion-indicator-item-content.collapse', { attrs: { role: 'tabpanel' } }, [
      h('ul.filter-list', indicatorListItems)
    ])
  ]);
}

export function yearItem(model) {
  return h('div#accordion-year-item.accordion-item', [
    h('a.filter-link', {
      attrs: { href: '#accordion-year-item-content', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Years'),
      h('div.current-filter-item', model.startYear + ' to ' + model.endYear)
    ]),
    h('div#accordion-year-item-content.collapse', { attrs: { role: 'tabpanel' } }, [
      h('fieldset', { attrs: { disabled: true } }, [
        h('div.form-group', [
          h('label', { attrs: { for: 'start-year-select' } }, 'Start Year'),
          h('select#start-year-select.form-control', [
            h('option', { attrs: { value: '2012' } }, '2012')
          ])
        ]),
        h('div.form-group', [
          h('label', { attrs: { for: 'end-year-select' } }, 'End Year'),
          h('select#end-year-select.form-control', [
            h('option', { attrs: { value: '2018' } }, '2018')
          ])
        ])
      ])
    ])
  ]); 
}

export function projectItem(currentProject, projects, active) {
  const projectListItems = projects.map(mapProjectItem.bind(this, currentProject));
  
  function selectProject(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    PubSub.publish('ACTIONS', setProject(ev.target.innerText));
  }

  function mapProjectItem(currProject, project) {
    return h('a.project-link', {
      on: { click : selectProject },
      attrs: { href: '#' } }, [
      h('li', { class: { 'current-project': currProject === project } }, project)
    ]);
  }

  return h('div#accordion-project-item.accordion-item', { class: { disabled: !active } }, [
    h('a.filter-link', {
      attrs: { href: '#accordion-project-item-content', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Project'),
      h('div.current-filter-item', currentProject)
    ]),
    h('div#accordion-project-item-content.collapse', { attrs: { role: 'tabpanel' } }, [
      h('ul.filter-list', projectListItems)
    ])
  ]);
}
