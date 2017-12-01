'use strict';

import ol from 'openlayers/build/ol.custom';
import { typeColors, contextColors, choiceColors } from '../../../variables';

function getCamenbert(radius, length, parts, colors) {
  const regShape = new ol.style.RegularShape({
    radius: radius,
    snapToPixel: false,
    fill: new ol.style.Fill({
      color: [43, 131, 186, 0.7]
    }) 
  });

  const canvas = regShape.getImage();
  const context = (canvas.getContext('2d'));

  parts.sort((p1, p2) => p1.type > p2.type ? 1 : -1);
  context.clearRect(0,0,canvas.width, canvas.height);
  context.lineJoin = 'round';
  context.setTransform(1,0,0,1,0,0);
  context.translate(0,0);

  let a, a0 = Math.PI * -0.5, c = canvas.width / 2;
  context.strokeStyle = '#fff';
  context.lineWidth = 1;
  context.save();

  parts.forEach(part => {
    context.beginPath();
    context.moveTo(c,c);
    context.fillStyle = colors[part.attr];

    a = a0 + 2 * Math.PI * part.weight;
    context.arc(c,c,radius,a0,a);
    context.closePath();
    context.fill();
    context.stroke();
    a0 = a;
  });

  context.restore();

  const camenbert = new ol.style.Style({
    image: regShape,
    text: new ol.style.Text({
      text: '' + length,
      textAlign: 'center',
      textBaseline: 'middle',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0)',
        width: 3
      })
    })
  });

  const round = new ol.style.Style({
    image: new ol.style.Circle({
      radius: (radius - 5), // faire un calcul proportionel
      fill: new ol.style.Fill({
        color: [255, 255, 255, 1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 0],
        width: 10
      })
    })
  });

  return [camenbert, round];
}

function typeContextBudget(feature) {
  const budget = feature.get('financial').initial + feature.get('financial').COPRO;

  const circle = new ol.style.Circle({
    radius: 8 + (budget / 500000),
    stroke: new ol.style.Stroke({
      color: contextColors[feature.get('superContext')],
      width: 2
    }),
    fill: new ol.style.Fill({
      color: typeColors[feature.get('superType')]
    })
  });

  circle.setOpacity(0.8);

  return new ol.style.Style({ image: circle });
}

export function typeContextBudgetCluster(cluster, res) {
  
  if(!cluster.get) {
    return null;
  }

  if(!cluster.get('features')) {
    return typeContextBudget(cluster);
  }

  const features = cluster.get('features');

  if(features.length === 1) {
    return typeContextBudget(features[0]);
  }

  const totalBudget = features.reduce((acc, curr) => {
    return acc + (curr.get('financial').initial + curr.get('financial').COPRO);
  }, 0);

  const budgets = features.reduce((acc, curr) => {
    const type = curr.get('superType');
    const budget = acc[type] || 0;
    acc[type] = budget + (curr.get('financial').initial + curr.get('financial').COPRO);
    return acc;
  }, {});

  const parts = Object.keys(budgets).map(key => {
    const budget = budgets[key];
    return { attr: key, weight: Math.round((budget / totalBudget) * 1000 ) / 1000 };
  });

  const radius = 15 + (totalBudget / 1000000); // faire un calccul proportionnel à l'aire

  return getCamenbert(radius, features.length, parts, typeColors);
}

function typeContext(feature) {
  const circle = new ol.style.Circle({
    radius: 8,
    stroke: new ol.style.Stroke({
      color: contextColors[feature.get('superContext')],
      width: 2
    }),
    fill: new ol.style.Fill({
      color: typeColors[feature.get('superType')]
    })
  });
  circle.setOpacity(0.7);
  return new ol.style.Style({ image: circle });
}

export function typeContextCluster(cluster, res) {

  if(!cluster.get) {
    return null;
  }

  if(!cluster.get('features')) {
    return typeContext(cluster);
  }

  const features = cluster.get('features');

  if(features.length === 1) {
    return typeContext(features[0]);
  }

  const totalFeatures = features.length;

  const weights = features.reduce((acc, curr) => {
    const type = curr.get('superType');
    const weight = acc[type] || 0;
    acc[type] = weight + 1;
    return acc;
  }, {});

  const parts = Object.keys(weights).map(key => {
    const weight = weights[key];
    return { attr: key, weight: Math.round((weight / totalFeatures) * 1000 ) / 1000 };
  });

  const radius = 15 + totalFeatures; // faire un calccul proportionnel à l'aire

  return getCamenbert(radius, features.length, parts, typeColors);
}

function defaultChoice(feature) {
  const circle = new ol.style.Circle({
    radius: 8,
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: choiceColors[feature.get('superChoice')]
    })
  });
  circle.setOpacity(0.7);
  return new ol.style.Style({ image: circle });
}

export function defaultChoiceCluster(cluster, res) {

  if(!cluster.get) {
    return null;
  }

  if(!cluster.get('features')) {
    return defaultChoice(cluster);
  }

  const features = cluster.get('features');

  if(features.length === 1) {
    return defaultChoice(features[0]);
  }

  const totalFeatures = features.length;

  const weights = features.reduce((acc, curr) => {
    const type = curr.get('superChoice');
    const weight = acc[type] || 0;
    acc[type] = weight + 1;
    return acc;
  }, {});

  const parts = Object.keys(weights).map(key => {
    const weight = weights[key];
    return { attr: key, weight: Math.round((weight / totalFeatures) * 1000 ) / 1000 };
  });

  const radius = 15 + totalFeatures; // faire un calccul proportionnel à l'aire

  return getCamenbert(radius, features.length, parts, choiceColors);
}

function defaultChoiceBudget(feature) {
  const budget = feature.get('financial').initial + feature.get('financial').COPRO;

  const circle = new ol.style.Circle({
    radius: 8 + (budget / 500000),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: choiceColors[feature.get('superChoice')]
    })
  });

  circle.setOpacity(0.7);

  return new ol.style.Style({ image: circle });
}

export function defaultChoiceBudgetCluster(cluster, res) {
  
  if(!cluster.get) {
    return null;
  }

  if(!cluster.get('features')) {
    return defaultChoiceBudget(cluster);
  }

  const features = cluster.get('features');

  if(features.length === 1) {
    return defaultChoiceBudget(features[0]);
  }

  const totalBudget = features.reduce((acc, curr) => {
    return acc + (curr.get('financial').initial + curr.get('financial').COPRO);
  }, 0);

  const budgets = features.reduce((acc, curr) => {
    const type = curr.get('superChoice');
    const budget = acc[type] || 0;
    acc[type] = budget + (curr.get('financial').initial + curr.get('financial').COPRO);
    return acc;
  }, {});

  const parts = Object.keys(budgets).map(key => {
    const budget = budgets[key];
    return { attr: key, weight: Math.round((budget / totalBudget) * 1000 ) / 1000 };
  });

  const radius = 15 + (totalBudget / 1000000); // faire un calccul proportionnel à l'aire

  return getCamenbert(radius, features.length, parts, choiceColors); 
}
