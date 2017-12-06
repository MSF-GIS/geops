'use strict';

import { select, event as d3event } from 'd3-selection';
import { arc as d3arc, pie as d3pie } from 'd3-shape';
import PubSub from '../../PubSub';
import { ALL_MISSIONS } from '../../variables';

const MARGIN_TOP = 20;
const MARGIN_RIGHT = 20;
const MARGIN_BOTTOM = 20;
const MARGIN_LEFT = 20;

export default function(model) {

  const container = select('body')
    .append('div')
    .attr('id', 'mission-intl-forecast-container')

  const title = container
    .append('h3')
    .text('International Procurement Forecast Accuracy');

  const mission = container
    .append('h4')
    .text('mission'); 

  let svg = container.append('svg');
    
  const token = PubSub.subscribe('STATE', (evt, payload) => {
    switch(payload.key) {
      case 'currentMission':
        handleViz(payload.appState);
        break;
    }
  });

  handleViz(model);  

  function handleViz(appState) {
    const all = appState.currentMission === ALL_MISSIONS;  
    container.classed('d-none', all);

    if(!all) {
      const intlForecastAcc = appState.missions[appState.currentMission].supply['International forecast accuracy'];
      mission.text(appState.currentMission + ': ' + intlForecastAcc);
      drawPieChart(appState);
    }
  }

  function drawPieChart(appState) {
    const intlForecastAcc = appState.missions[appState.currentMission].supply['International forecast accuracy'];
    const value = parseInt(intlForecastAcc.replace('%',''));
    
    const data = [{
      part: 'done',
      value: value
    },{
      part: 'todo',
      value: (100 - value)
    }];

    const colors = { 'done': 'rgba(136, 197, 66, .7)', 'todo': 'rgba(240, 163, 47, .7)' };

    const ctnrWidth = container.node().getBoundingClientRect().width - 20;

    const scale = scaleLinear()
      .range([0, width])
      .domain([0, d3max(allValues)]); 

    // Remove last chart 
    svg.remove();
    
    svg = container
      .append('svg')
      .attr('width', ctnrWidth)
      .attr('height', ctnrWidth);

    const width = +svg.attr('width') - MARGIN_LEFT - MARGIN_RIGHT;
    const height = +svg.attr('height') - MARGIN_TOP - MARGIN_BOTTOM;  
    const radius = Math.min(width, height) / 2;

    const g = svg.append('g')
      .attr('transform', 'translate(' + ( width / 2 + MARGIN_LEFT ) + ',' + height / 2 + ')');

    const pie = d3pie()
      .sort(null)
      .value(d => d.value);

    const path = d3arc()
      .outerRadius(radius)
      .innerRadius(30)
      .padAngle(0.05);  

    const arc = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
        .attr('class', 'arc');

    arc.append('path')
        .attr('d', path)
        .attr('fill', d => colors[d.data.part]);  

  }

  return {
    destroy: () => {
      PubSub.unsubscribe(token);
      container.remove();
    }
  }
}