'use strict';

import '../../styles/supplyViz.css';
import { select } from 'd3-selection';
import { parseInteger } from '../../util';

export default function(model) {

  const totals = Object.keys(model.missions).reduce((acc, curr) => {
    const local = model.missions[curr].supply['Local'];
    const intl = model.missions[curr].supply['International'];
    acc.local = acc.local + parseInteger(local.replace('€ ',''));
    acc.intl = acc.intl + parseInteger(intl.replace('€ ',''));
    return acc;
  }, { intl: 0, local: 0 });

  const col = select('div#dataviz-row')
    .append('div')
    .attr('class', 'col-md-4');

  const totalIntl = col
    .append('div')
    .attr('class', 'poster')
    .append('p')
    .text('International Purchases: € ' + totals.intl.toLocaleString('de-DE'));  

  const totalLocal = col
    .append('div')
    .attr('class', 'poster')
    .append('p')
    .text('National Purchases: € ' + totals.local.toLocaleString('de-DE'));  

  return {
    destroy: () => {
      col.remove();
    }
  }
}