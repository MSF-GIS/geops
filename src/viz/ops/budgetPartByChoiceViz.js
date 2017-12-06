'use strict';

import '../../styles/viz.css';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import PubSub from '../../PubSub';
import { choiceColors } from '../../variables';
import { parseInteger } from '../../util';
import { defaultChoiceGroups } from '../../groups';

const MARGIN_TOP = 60;
const MARGIN_RIGHT = 30;
const MARGIN_BOTTOM = 30;
const MARGIN_LEFT = 40;

export default function(model) {

  const svg = select('div#dataviz-container')
    .append('svg')
    .attr('width', 300)
    .attr('height', 500);

  const g = svg.append('g')
    .attr('transform', 'translate(' + MARGIN_LEFT + ',' + MARGIN_TOP + ')');
  
  const width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
  const height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;

  const x0 = scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  const x1 = scaleBand()
    .padding(0.05);

  const y = scaleLinear()
    .rangeRound([height, 0]);

  const legend = g.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')

  update(model);  

  function update(model) {

    const keys = ['choice', 'default'];

    const filteredProjects = !model.filters['superChoice'] ? model.projects
      : model.projects
        .filter(p => model.filters['superChoice'].indexOf(p.superChoice) < 0 );

    const choices = filteredProjects.reduce((acc, curr) => {
      const choice = curr.superChoice;
      const value = (curr.financial.initial + curr.financial.COPRO);
      const tmpArr = acc.filter(i => i.choice === choice);    

      if(tmpArr.length > 0) {
        tmpArr[0].value += value;
      } else {
        acc.push({'choice': choice, 'value': value, 'year': 2017});  
      }
      return acc;

    }, []);

    const yearlyData = choices.reduce((acc, curr) => {
      acc[curr['choice']] = curr['value'];
      return acc;
    }, {});

    const choiceKeys = Object.keys(yearlyData);
    yearlyData.year = 2017;
    const data = [yearlyData];

    x0.domain(data.map(d => d.year));
    x1.domain(choiceKeys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, max(data, d => max(keys, key => d[key]))]);

    g.selectAll('.bar').remove();
    g.selectAll('.axis').remove();
    g.selectAll('.legend-rect').remove();

    g.append('g')
      .selectAll('g')
      .data(data)
      .enter().append('g')
        .attr('transform', d => 'translate(' + x0(d.year) + ',0)')
      .selectAll('rect')
      .data(d => keys.map(key => { return { key: key, value: d[key] } }))
      .enter().append('rect')
        .attr('x', d => x1(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', d => choiceColors[d.key])
        .attr('class', 'bar');

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisBottom(x0));

    g.append('g')
        .attr('class', 'axis')
        .call(axisLeft(y).ticks(null, 's'))
      .append('text')
        .attr('x', 5)
        .attr('y', -15)
        .attr('dy', '-0.32em')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text('Euros');

    const rect = legend.selectAll('g')
      .data(choiceKeys)
      .enter().append('g')
        .attr('class', 'legend-rect')
        .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');    

    rect.append('rect')
      .attr('x', width + MARGIN_RIGHT - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => choiceColors[d]);

    rect.append('text')
      .attr('x', width + MARGIN_RIGHT - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
  }

  const token = PubSub.subscribe('STATE', (evt, payload) => {
    switch(payload.key) {
      case 'filters':
        // update(payload.appState); not sure we have to do that
        break;    
    }
  });

  return {
    destroy: () => {
      PubSub.unsubscribe(token);
      svg.remove();
    }
  }
}
