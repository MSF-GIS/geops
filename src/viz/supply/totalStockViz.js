'use strict';

import '../../styles/supplyViz.css';
import { parseInteger } from '../../util';

export default function(model) {

  const totalStock = Object.keys(model.missions)
    .reduce((acc, curr) => {
      const missionStock = parseInteger(model.missions[curr].supply['Value of stocks'].replace('€ ',''));
      acc = acc + missionStock;
      return acc;
    }, 0);

  const p = document.createElement('p');
  p.innerHTML = 'Total Medical Stock: € ' + totalStock.toLocaleString('de-DE');

  const div = document.createElement('div');
  div.setAttribute('class', 'poster');
  div.appendChild(p);

  const col = document.createElement('div');
  col.setAttribute('class', 'col-md-4')
  col.appendChild(div);

  const row = document.getElementById('dataviz-row');
  row.appendChild(col);

  return {
    destroy: () => {
      row.removeChild(col);
    }
  }
}