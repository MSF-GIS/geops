'use strict';

import '../styles/viz.css';
import { typeGroups } from '../groups';
import { parseInteger } from '../util';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { stack, stackOffsetExpand } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';

const MARGIN_TOP = 20;
const MARGIN_RIGHT = 160;
const MARGIN_BOTTOM = 30;
const MARGIN_LEFT = 40;

let svg = null,
  g = null,
  width = null,
  height = null,
  x = null,
  y = null,
  legend = null;

function init(model, handler, ev) {
  svg = select('svg#budget-part-type-viz');
  g = svg.append('g')
      .attr('transform', 'translate(' + MARGIN_LEFT + ',' + MARGIN_TOP + ')');
  
  width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
  height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;

  x = scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

  y = scaleLinear()
    .rangeRound([height, 0]);

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(axisLeft(y).ticks(10, '%'));

  legend = g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end');

  update(model, handler);

  // Pour ne pas à avoir de garder de variable globale, essayer de trouver une solution qui tire
  // profit du scope

}

function update(model, handler) {

  if(svg !== null) {
    const keys = Object.keys(typeGroups);
    const group = keys.reduce((acc, curr) => {
      typeGroups[curr].forEach(item => { acc[item] = curr });
      return acc;
    }, {});

    const filteredProjects = model.projects.filter(p => {
      const type = group[p.type] || p.type;
      return model.additionalFilters.types.indexOf(type) > -1;
    });

    const types = filteredProjects.reduce((acc, curr) => {
      const type = group[curr.type] || curr.type;
      const value = (curr.financial.initial + curr.financial.COPRO);
      const tmpArr = acc.filter(i => i.type === type);

      if(tmpArr.length > 0) {
        tmpArr[0].value += value;
      } else {
        acc.push({'type': type, 'value': value, 'year': 2017});  
      }
      return acc;

    }, []);

    const yearlyData = types.reduce((acc, curr) => {
      acc[curr['type']] = curr['value'];
      return acc;
    }, {});

    const typeKeys = Object.keys(yearlyData);
    yearlyData.year = 2017;
    const data = [yearlyData];
    
    const st = stack()
      .offset(stackOffsetExpand);

    x.domain(data.map(d => d.year));

    g.selectAll('.serie').remove();
    g.selectAll('.axis--x').remove();
    g.selectAll('.legend-color').remove();

    const serie = g.selectAll('.serie')
      .data(st.keys(typeKeys)(data))
      .enter().append('g')
        .attr('class', 'serie')
        .attr('fill', d => model.colors['types@' + d.key])

    serie.selectAll('rect')
      .data(d => d)  
      .enter().append('rect')
        .attr('x', d => x(d.data.year))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisBottom(x));    

    const items = legend.selectAll('g')
      .data(st.keys(typeKeys.reverse())(data))
      .enter().append('g')
        .attr('class', 'legend-color')
        .attr('transform', (d, i) => 'translate(0,' + (0 + (i * 20))  + ')');

    items.append('rect')
      .attr('x', width + MARGIN_RIGHT - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => model.colors['types@' + d.key]);

    items.append('text')
      .attr('x', width + MARGIN_RIGHT - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d.key + ' ' + Math.round( ( d[0][1] - d[0][0] ) * 100 ) + '%');
  
    items.exit().remove();
  }
}

function destroy() {
  // Verifier que la mémoire est bien libérée pour les constante une fois que le module est détruit
  console.log('destroy viz');
  svg = null; 
}

export default { init, update, destroy }