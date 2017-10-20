'use strict';

import h from 'snabbdom/h';
import { setProject } from '../actions';
import { GLOBAL_LEVEL, ALL_PROJECTS } from '../variables';
import { getMissionFromLevel, getProjectFromLevel } from '../helpers';

function selectProject(handler, ev) {
  ev.preventDefault();
  ev.stopPropagation();
  handler.publish('ACTIONS', setProject(ev.target.innerText));
}

function mapProjectItem(handler, currProject, project) {
  const pCode = project['Project code'];
  return h('a.project-link', {
    on: { click : selectProject.bind(this, handler) },
    attrs: { href: '#' } }, [
    h('li', { class: { 'current-project': currProject === pCode } }, pCode)
  ]);
}

function view(model, handler) {
  const active = model.level !== GLOBAL_LEVEL;
  const mission = getMissionFromLevel(model.level);
  const currentProject = getProjectFromLevel(model.level);
  const currentProjects = model.projects.filter(p => p['Mission'].toUpperCase() === mission.toUpperCase());
  const projectListItems = currentProjects.map(mapProjectItem.bind(this, handler, currentProject));
  projectListItems.unshift(mapProjectItem(handler, currentProject, { 'Project code': ALL_PROJECTS }));

  return h('div.accordion-item', { class: { disabled: !active } }, [
    h('a.filter-link', {
      attrs: { href: '#accordion-project', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Project'),
      h('div.current-filter-item', currentProject)
    ]),
    h('div#accordion-project.collapse', { attrs: { role: 'tabpanel' } }, [
      h('ul.filter-list', projectListItems)
    ])
  ]);
}

export default { view };