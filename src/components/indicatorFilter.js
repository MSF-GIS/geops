'use strict';

import h from 'snabbdom/h';
import { indicators } from '../indicators';
import { setIndicator } from '../actions';

function selectIndicator(handler, ev) {
  ev.preventDefault();
  ev.stopPropagation();
  handler.publish('ACTIONS', setIndicator(ev.target.innerText));
}

function mapIndicatorItem(handler, currIndicator, indicator) {
  return h('a.indicator-link', {
    on: { click : selectIndicator.bind(this, handler) },
    attrs: { href: '#' } }, [
    h('li', { class: { 'current-indicator': currIndicator === indicator } }, indicator)
  ]);
}

function view(model, handler) {
  const tabIndicators = indicators[model.currentTab];
  const indicatorListItems = tabIndicators.map(mapIndicatorItem.bind(this, handler, model.indicator));

  return h('div.accordion-item', [
    h('a.filter-link', {
      attrs: { href: '#accordion-indicator', 'aria-expanded': 'true', 'aria-controls': 'accordion' },
      dataset: { toggle: 'collapse', parent: '#accordion' }
    }, [
      h('div.filter-name','Indicator'),
      h('div.current-filter-item', model.indicator)
    ]),
    h('div#accordion-indicator.collapse', { attrs: { role: 'tabpanel' } }, [
      h('ul.filter-list', indicatorListItems)
    ])
  ]);

}

export default { view };