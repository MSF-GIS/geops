'use strict';

import '../../styles/viz.css';
import { treemap, hierarchy } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { MISSION_COLORS } from '../../variables';

const MARGIN_TOP = 20;
const MARGIN_RIGHT = 20;
const MARGIN_BOTTOM = 20;
const MARGIN_LEFT = 20;

export default function (model) {
  const keys = Object.keys(model.missions);
  const staffs = keys.map((k, i) => { return { name: k, NS: model.missions[k].NS, IS: model.missions[k].IS } })
    .sort((a, b) => a.NS + a.IS < b.NS + b.IS ? 1 : -1)
    .map((s, i) => {
      s.color = MISSION_COLORS[i % MISSION_COLORS.length]
      return s;
    });

  const svg = select('div#dataviz-container')
    .append('svg')
    .attr('width', 400)
    .attr('height', 400);

  const width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
  const height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;

  const data = { name: 'tree', children: staffs };

  const treemapViz = treemap()
    .size([width, height])
    .round(true)
    .paddingInner(1);

  const root = hierarchy(data)
    .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
    .sum(d => d.NS + d.IS)

  treemapViz(root);
  
  const cell = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
      .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');  

  cell.append('rect')
      .attr('id', d => d.data.id)
      .attr('width', d => d.x1 - d.x0)
      .attr('height',d => d.y1 - d.y0)
      .attr('fill', d => d.data.color);

  cell.append('clipPath')
      .attr("id", d => 'clip-' + d.data.id)
    .append('use')
      .attr('xlink:href', d => '#' + d.data.id);

  cell.append('text')
    .attr('clip-path', d => 'url(#clip-' + d.data.id + ')')
    .attr('fill', d => '#fff')
    //.style('font-size', d => Math.max(0.8, 0.0013 * d.value) + 'rem')
  .selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
  .enter().append('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 13 + i * 10)
    .text(d => d);

  return {
    destroy: () => {
      svg.remove();
    }
  }          
}