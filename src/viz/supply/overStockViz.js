'use strict';

import { select } from 'd3-selection';
import { max as d3max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { parseInteger } from '../../util';

const MARGIN_TOP = 0;
const MARGIN_RIGHT = 20;
const MARGIN_BOTTOM = 20;
const MARGIN_LEFT = 80;

export default function (model) {
  const keys = Object.keys(model.missions);
  const data = keys.map((k, i) => {
    return {
      name: k,
      value: parseInteger(model.missions[k].supply['Overstock'].replace('% ','')),
      color: model.missions[k].color
    }})
    .sort((a, b) => a.value < b.value ? -1 : 1);

  const col = select('div#dataviz-row')
    .append('div')
    .attr('id', 'dataviz-bars-col')
    .attr('class', 'col-md-4');

  const colWidth = col.node().getBoundingClientRect().width - 60;  

  const title = col
    .append('h3')
    .text('Over stocks per mission');    

  const svg = col
    .append('svg')
    .attr('width', colWidth)
    .attr('height', colWidth * 1.3);

  const width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
  const height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;

  const x = scaleLinear()
    .range([0, width])
    .domain([0, d3max(data, d => d.value)]);  

  const y = scaleBand()
    .range([height, 0])
    .domain(data.map(d => d.name))
    .padding(0.1);

  const xAxis = axisBottom(x)
    .ticks(3)
    .tickPadding(10)
    .tickFormat(d => d + '%')
    .tickSizeInner([-height]);

  const yAxis = axisLeft(y);  

  const g = svg.append('g')
    .attr('transform', 'translate(' + MARGIN_LEFT + ',' + MARGIN_TOP + ')');

  const bar = g.selectAll('.bar')
      .data(data)
    .enter().append('g');

  bar.append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('y', d => y(d.name))
    .attr('width', d => x(d.value))
    .attr('fill', d => d.color);

  bar.append('text')
    .attr('class', 'text')
    .attr('x', d => x(d.value) - (d.value < 10 ? 20 : 25))
    .attr('y', d => y(d.name) + y.bandwidth() / 2)
    .attr('dy', '.35em')
    .attr('fill', '#fff')
    .style('font-size', '0.7rem')
    .text(d => d.value > 1 ? d.value + '%' : '');

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(customXAxis);  

  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);  

  function customXAxis(g) {
    g.call(xAxis);
    g.selectAll('.tick:not(:first-of-type) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');
  }

  return {
    destroy: () => {
      col.remove();
    }
  }
}