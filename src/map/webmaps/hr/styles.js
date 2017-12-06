'use strict';

import ol from 'openlayers/build/ol.custom';

const getWorkforceCamenbert = function(radius, NS, IS) {
  const totalStaff = NS + IS;
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

  a = a0 + 2 * Math.PI * IS / totalStaff;
  context.arc(c,c,radius,a0,a);
  context.closePath();
  context.fill();
  context.stroke();
  a0 = a;

  context.beginPath();
  context.moveTo(c,c);
  context.fillStyle = 'rgba(209, 33, 33, 0.8)';

  a = a0 + 2 * Math.PI * NS / totalStaff;
  context.arc(c,c,radius,a0,a);
  context.closePath();
  context.fill();
  context.stroke();
  a0 = a;

  context.restore();

  return regShape;  
}

export function missionWorkforceCluster(cluster, res) {
  const feature = cluster.get('features')[0];
  const mission = feature.get('mission');
  const totalStaff = feature.get('IS') + feature.get('NS');
  const radius = 8 + (totalStaff / 40);
  const regShape = getWorkforceCamenbert(radius, feature.get('NS'), feature.get('IS'));
  return new ol.style.Style({ image: regShape });
}

export function projectWorkforceCluster(cluster, res) {
  const feature = cluster.get('features')[0];
  const mission = feature.get('mission');
  const radius = 8 + (totalStaff / 30);
  const regShape = getWorkforceCamenbert(radius, feature.get('NS'), feature.get('IS'));
  return new ol.style.Style({ image: regShape });  
  
}