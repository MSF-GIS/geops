'use strict';

import ol from 'openlayers/build/ol.custom';
import { typeColors, contextColors, choiceColors } from '../../../variables';
import { parseInteger } from '../../../util';

export function stockCluster(cluster, res) {
  const feature = cluster.get('features')[0];
  const supply = feature.get('supply');
  const stock = parseInteger(supply['Value of stocks'].replace('€ ',''));

  const circle = new ol.style.Circle({
    radius: 8 + (stock / 200000),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: feature.get('color')
    })
  });

  circle.setOpacity(0.8);

  return new ol.style.Style({ image: circle });
}

export function procurementCluster(cluster, res) {
  const feature = cluster.get('features')[0];
  const totalProcurements = parseInteger(feature.get('supply')['Total purchased'].replace('€ ',''));
  const localProcurment = parseInteger(feature.get('supply')['Local'].replace('€ ',''));
  const intlProcurment = parseInteger(feature.get('supply')['International'].replace('€ ',''));
  const radius = 8 + totalProcurements / 180000;

  const regShape = new ol.style.RegularShape({
    radius: radius + 2,
    snapToPixel: false,
    fill: new ol.style.Fill({
      color: [43, 131, 186, 0.7]
    }) 
  });

  const canvas = regShape.getImage();
  const context = (canvas.getContext('2d'));

  context.clearRect(0,0,canvas.width, canvas.height);
  context.lineJoin = 'round';
  context.setTransform(1,0,0,1,0,0);
  context.translate(0,0);

  let a, a0 = Math.PI * -0.5, c = canvas.width / 2;
  context.strokeStyle = '#fff';
  context.lineWidth = 2;
  context.save();

  context.beginPath();
  context.moveTo(c,c);
  context.fillStyle = 'rgba(209, 33, 33, 0.5)';

  a = a0 + 2 * Math.PI * localProcurment / totalProcurements;
  context.arc(c,c,radius,a0,a);
  context.closePath();
  context.fill();
  context.stroke();
  a0 = a;

  context.beginPath();
  context.moveTo(c,c);
  context.fillStyle = 'rgba(209, 33, 33, 0.8)';

  a = a0 + 2 * Math.PI * intlProcurment / totalProcurements;
  context.arc(c,c,radius,a0,a);
  context.closePath();
  context.fill();
  context.stroke();
  a0 = a;

  context.restore();

  return new ol.style.Style({ image: regShape });
}