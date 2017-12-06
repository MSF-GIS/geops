'use strict';

import '../../styles/supplyViz.css';
import 'd3-transition';
import { treemap, hierarchy } from 'd3-hierarchy';
import { select, event as d3event } from 'd3-selection';
import { MISSION_COLORS } from '../../variables';
import { parseInteger } from '../../util';

const MARGIN_TOP = 40;
const MARGIN_RIGHT = 40;
const MARGIN_BOTTOM = 40;
const MARGIN_LEFT = 40;

export default function (model) {
  const keys = Object.keys(model.missions);
  const stocks = keys.map((k, i) => {
    return {
      code: model.missions[k].code,
      name: model.missions[k].name,
      color: model.missions[k].color,
      stock: parseInteger(model.missions[k].supply['Value of stocks'].replace('€ ',''))
    }})
    .sort((a, b) => a.stock < b.stock ? 1 : -1);  

  const data = { name: 'tree', children: stocks };  

  const div = select('body').append('div')
    .attr('class', 'tooltip')       
    .style('opacity', 0);

  const col = select('div#dataviz-row')
    .append('div')
    .attr('id', 'dataviz-squares-col')
    .attr('class', 'col-md-4');  

  const colWidth = col.node().getBoundingClientRect().width;  

  const title = col
    .append('h3')
    .text('Volume of medical stock per mission');  

  const hint = col
    .append('p')
    .attr('class','hint')
    .text('Hover over a rectangle to display additional data');

  const svg = col
    .append('svg')
    .attr('width', colWidth)
    .attr('height', colWidth);

  const width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
  const height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;

  const treemapViz = treemap()
    .size([width, height])
    .round(true)
    .paddingInner(1);
    
  const root = hierarchy(data)
    .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
    .sum(d => d.stock)

  treemapViz(root);

  const cell = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
      .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')')
    .on('mousemove', d => {
        div.transition()    
          .duration(200)    
          .style('opacity', .9);    
        div.html(tooltipTpl(d.data))  
          .style('left', (d3event.pageX) + 'px')   
          .style('top', (d3event.pageY + 20) + 'px');
      })
      .on('mouseout', d => {   
        div.transition()    
          .duration(500)    
          .style('opacity', 0);
      });

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
      .style('font-size', d => Math.max(0.8, 0.0000013 * d.value) + 'rem')
    .selectAll('tspan')
      .data(d => [{ code: d.data.code, value: d.value }])
    .enter().append('tspan')
      .attr('x', 4)
      .attr('y', (d, i) => Math.max(13, 13 * 0.0000013 * d.value))
      .text(d => d.code);

  function tooltipTpl(data) {
    return `
      <dl>
        <dt>Mission:</dt>
        <dd>` + data.name + `</dd>
        <dt>Code:</dt>
        <dd>` + data.code + `</dd>
        <dt>Stock:</dt>
        <dd>€ ` + data.stock.toLocaleString('de-DE') + `</dd>
      </dl>`;
  }  

  return {
    destroy: () => {
      col.remove();
      div.remove();
    }
  }
}