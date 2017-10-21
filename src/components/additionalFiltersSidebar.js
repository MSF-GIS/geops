'use strict';

import '../styles/additionalFiltersSidebar.css';
import h from 'snabbdom/h';
import typeGroups from '../typeGroups';
import { setAdditionalFilters } from '../actions';

function onChange(handler, ev) {
  const typesInputs = ev.currentTarget.querySelectorAll('#type-fieldset input:checked');
  const typesValues = Array.prototype.slice.call(typesInputs).map(i => i.value);
  
  const contextInputs = ev.currentTarget.querySelectorAll('#context-fieldset input:checked');
  const contextValues = Array.prototype.slice.call(contextInputs).map(i => i.value);
  
  handler.publish('ACTIONS', setAdditionalFilters({ types: typesValues, contexts: contextValues }));
}

function mapTypeCheckboxItem(colors, item) {
  const colorKey = 'types@' + item;
  return h('div.form-check',[
    h('label.form-check-label',[
      h('input.form-check-input', { attrs: { type: 'checkbox', value: item, checked: true } }),
      h('div.fill-color', { style: { 'background-color': colors[colorKey] } }),
      item
    ])      
  ]);
}

function mapContextCheckboxItem(colors, item) {
  const colorKey = 'contexts@' + item;
  const colorBorder = '1px solid ' + colors[colorKey];
  return h('div.form-check',[
    h('label.form-check-label',[
      h('input.form-check-input', { attrs: { type: 'checkbox', value: item, checked: true } }),
      h('div.stroke-color', { style: { 'border': colorBorder } }),
      item
    ])      
  ]);
}

function view(model, handler) {
  const keys = Object.keys(typeGroups);
  const group = keys.reduce((acc, curr) => {
    typeGroups[curr].forEach(item => { acc[item] = curr });
    return acc;
  }, {});

  const tempTypes = model.projects.map(p => group[p['definition project']] || p['definition project']);
  const types = tempTypes.filter((p, pos, array) => array.indexOf(p) === pos);
  const typeItems = types.map(mapTypeCheckboxItem.bind(this, model.colors));
  typeItems.unshift(h('legend', 'Types'));

  const tempContexts = model.projects.map(p => p.conflict);
  const contexts = tempContexts.filter((p, pos, array) => array.indexOf(p) === pos);
  const contextItems = contexts.map(mapContextCheckboxItem.bind(this, model.colors));
  contextItems.unshift(h('legend', 'Contexts'));

  return h('div#add-filters-sidebar', [
    h('form#add-filters-form', { on: { change: onChange.bind(this, handler) } }, [
      h('fieldset#type-fieldset', typeItems),
      h('fieldset#context-fieldset', contextItems)
    ])
  ]);
}

export default { view };