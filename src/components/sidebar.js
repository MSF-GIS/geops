'use strict';

import '../styles/sidebar.css';
import h from 'snabbdom/h';
import PubSub from '../PubSub';
import { setFilter } from '../actions';
import { typeColors, contextColors, choiceColors } from '../variables';

export function sidebar(children) {
  return h('div#sidebar', children);
}

function sendAction(type, ev) {

  if(ev.target.value === 'all') {
    Array.from(ev.currentTarget.querySelectorAll('.form-check-input'))
    .forEach(elm => { elm.checked = ev.target.checked });
  }

  const filterValues = Array.from(ev.currentTarget.querySelectorAll('.form-check-input'))
    .filter(elm => !elm.checked)
    .map(elm => elm.value);
    
  PubSub.publish('ACTIONS', setFilter({
    filterAttr: type,
    filterValues: filterValues 
  }));
}

export function typeFilterItem() {
  function change(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    sendAction('superType', ev);
  }

  const elements = Object.keys(typeColors)
    .map((key, index) => {
      return h('div.form-check',[
        h('label.form-check-label',[
          h('input#type-input-' + index + '.form-check-input', { attrs: { type: 'checkbox', value: key, checked: true } }),
          h('div.fill-color', { style: { 'background-color': typeColors[key] } }),
          key
        ])      
      ])
    });

  elements.unshift(h('div.form-check',[
    h('label.form-check-label',[
      h('input.form-check-input.all', { attrs: { type: 'checkbox', value: 'all', checked: true } }),
      'Select all'
    ])      
  ]));

  elements.unshift(h('h3', 'Types'));  
  return h('div#type-filter.sidebar-item', { on: { change: change } }, elements);
}

export function contextFilterItem() {
  function change(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    sendAction('superContext', ev);
  }

  const elements = Object.keys(contextColors)
    .map((key, index) => {
      return h('div.form-check',[
        h('label.form-check-label',[
          h('input#context-input-' + index + '.form-check-input', { attrs: { type: 'checkbox', value: key, checked: true } }),
          h('div.stroke-color', { style: { 'border': '2px solid ' + contextColors[key] } }),
          key
        ])   
      ]);
    });
  elements.unshift(h('h3', 'Contexts'));
  return h('div#context-filter.sidebar-item', { on: { change: change } }, elements);
}

export function choiceFilterItem() {
  function change(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    sendAction('superChoice', ev);
  }

  const elements = Object.keys(choiceColors)
    .map((key, index) => {
      return h('div.form-check',[
        h('label.form-check-label',[
          h('input#choice-input-' + index + '.form-check-input', { attrs: { type: 'checkbox', value: key, checked: true } }),
          h('div.fill-color', { style: { 'background-color': choiceColors[key] } }),
          key
        ])      
      ])
    });
  elements.unshift(h('h3', 'Default/choice'));  
  return h('div#type-filter.sidebar-item', { on: { change: change } }, elements);
}