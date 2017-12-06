'use strict';

import '../../styles/supplyViz.css';
import 'd3-transition';
import { select, event as d3event } from 'd3-selection';
import { max as d3max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { parseInteger } from '../../util';

const LOCAL_COLOR = 'rgba(209, 33, 33, 0.5)';
const INTL_COLOR = 'rgba(209, 33, 33, 0.8)';

const MARGIN_TOP = 0;
const MARGIN_RIGHT = 60;
const MARGIN_BOTTOM = 20;
const MARGIN_LEFT = 80;

export default function (model) {

  const data = Object.keys(model.missions).reduce((acc, curr) => {
    acc.push({
      mission: curr,
      intl: parseInteger(model.missions[curr].supply['International'].replace('€ ','')),
      local: parseInteger(model.missions[curr].supply['Local'].replace('€ ',''))
    });
    return acc;
  }, []);

  const allValues = Object.keys(model.missions).reduce((acc, curr) => {
    acc.push(parseInteger(model.missions[curr].supply['International'].replace('€ ','')));
    acc.push(parseInteger(model.missions[curr].supply['Local'].replace('€ ','')));
    return acc;
  }, []);

  const col = select('div#dataviz-row')
    .append('div')
    .attr('class', 'col-md-4');

  const colWidth = col.node().getBoundingClientRect().width - 60;  

  const div = select('body')
    .append('div')
    .attr('class', 'tooltip proc-tooltip')       
    .style('opacity', 0);

  const title = col
    .append('h3')
    .text('Procurements per mission');    

  const hint = col
    .append('p')
    .attr('class', 'hint')
    .text('Hover over bars to display additional data');

  const svg = col
    .append('svg')
    .attr('width', colWidth)
    .attr('height', colWidth * 1.5);

  const width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
  const height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;  

  const x = scaleLinear()
    .range([0, width])
    .domain([0, d3max(allValues)]);

  const y0 = scaleBand()
      .range([0, height])
      .paddingInner(0.1)
      .domain(data.map(d => d.mission));

  const y1 = scaleBand()
      .padding(0.05)  
      .domain(['intl', 'local'])
      .rangeRound([y0.bandwidth(), 0]);

  const xAxis = axisBottom(x)
    .ticks(3)
    .tickPadding(10)
    .tickFormat(d => d.toLocaleString('de-DE'))
    .tickSizeInner([-height]);    

  const keys = ['intl', 'local'];    

  const g = svg.append('g')
    .attr('transform', 'translate(' + MARGIN_LEFT + ',' + MARGIN_TOP + ')');

  g.append('g')
    .selectAll('g')
    .data(data)
    .enter().append('g')
      .attr('transform', d => 'translate(0,' + y0(d.mission) + ')')
    .on('mousemove', onMouseEnter)
    .on('mouseout', onMouseLeave)
    .selectAll('rect')
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append('rect')
      .attr('x', 0)
      .attr('y', d => y1(d.key))
      .attr('height', y1.bandwidth())
      .attr('width', d => x(d.value))
      .attr('fill', d => d.key === 'intl' ? INTL_COLOR : LOCAL_COLOR)

    g.append('g')
      .attr('class', 'y axis')
      .call(axisLeft(y0));

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(customXAxis);

  const legend = g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
    .selectAll('g')
    .data(['intl', 'local'].slice().reverse())
    .enter().append('g')
      .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

  legend.append('rect')
      .attr('x', width + 10)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => d === 'intl' ? INTL_COLOR : LOCAL_COLOR);

  legend.append('text')
      .attr('x', width + 34)
      .attr('y', 14.5)
      .attr('dy', '0.32em')
      .text(d => d === 'intl' ? 'Int.' : 'Local');

  function onMouseEnter(d) {
    div.transition()    
      .duration(200)    
      .style('opacity', .9);    
    div.html(tooltipTpl(d))  
      .style('left', (d3event.pageX) + 'px')   
      .style('top', (d3event.pageY + 20) + 'px');
  }

  function onMouseLeave(d) {
    div.transition()    
      .duration(50)    
      .style('opacity', 0);
  }

  function tooltipTpl(data) {
    return `
      <dl>
        <dt>Mission:</dt>
        <dd>` + data.mission + `</dd>
        <dt>Local Procurements:</dt>
        <dd>€ ` + data.local.toLocaleString('de-DE') + `</dd>
        <dt>Int. Procurements:</dt>
        <dd>€ ` + data.intl.toLocaleString('de-DE') + `</dd>
      </dl>`;
  }

  function customXAxis(g) {
    g.call(xAxis);
    g.selectAll('.tick:not(:first-of-type) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');
  }    

  return {
    destroy: () => {
      col.remove();
      div.remove();
    }
  }
}