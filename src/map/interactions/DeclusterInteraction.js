'use strict';

import ol from 'openlayers/build/ol.custom';
import { clusterLineStyle, invisibleStyle } from './styles';

const DeclusterInteraction = function(opt_options) {
  const options = opt_options || {};

  this.clusteredLayer = options.layer;
  this.clusterLines = new ol.geom.MultiLineString([]);

  this.clusterLinesSource = new ol.source.Vector({
    features: [ new ol.Feature({ geometry: this.clusterLines })]
  });

  this.expandedClusterSource = new ol.source.Vector({});

  this.clusterLinesLayer = new ol.layer.Vector({
    source: this.clusterLinesSource,
    style: clusterLineStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  });

  this.expandedClusterLayer = new ol.layer.Vector({
    source: this.expandedClusterSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  });

  ol.interaction.Interaction.call(this, {
    handleEvent: DeclusterInteraction.handleEvent
  });

  this.clusteredLayer.getSource().on('clear', () => {
    this.declusterAll();
  });
}

ol.inherits(DeclusterInteraction, ol.interaction.Interaction);

DeclusterInteraction.prototype.setMap = function(map) {
  this.map = map;
  map.addLayer(this.clusterLinesLayer);
  map.addLayer(this.expandedClusterLayer);
};

DeclusterInteraction.prototype.declusterAll = function() {
  this.clusterLines.setCoordinates([]);
  this.expandedClusterSource.clear();
  this.clusteredLayer.getSource().getFeatures()
    .filter( f => f.get('expanded'))
    .forEach(f => {
      f.set('expanded', false);
      f.setStyle(null);
    });

  this.clusteredLayer.setStyle(this.clusteredLayer.getStyle());
}

DeclusterInteraction.prototype.clean = function(map) {
  map.removeLayer(this.clusterLinesLayer);
  map.removeLayer(this.expandedClusterLayer);
}

function generateClusterPoints(count, centerPixel) {
  const separation = 25;
  const twoPi = Math.PI * 2;
  const start_angle = twoPi / 12;
  const circumference = separation * (2 + count);
  const legLength = circumference / twoPi;  //radius from circumference
  const angleStep = twoPi / count;
  const res = [];
  
  let i, angle;
  
  res.length = count;

  for (i = count - 1; i >= 0; i--) {
    angle = start_angle + i * angleStep;
    res[i] = [
      centerPixel[0] + legLength * Math.cos(angle), 
      centerPixel[1] + legLength * Math.sin(angle)
    ];
  }
  return res;
}

DeclusterInteraction.handleEvent = function(mapBrowserEvent) {
  const type = mapBrowserEvent.type;
  const map = mapBrowserEvent.map;

  if(type == 'click' || type == 'pointermove') {
    const cluster = map.forEachFeatureAtPixel(mapBrowserEvent.pixel, f => f);
    const length = !cluster ? 0
      : !cluster.get('features') ? 1
      : cluster.get('features').length

    if(type === 'click' && (length === 0 || !cluster.get('expandedFeature'))) {
      this.declusterAll();
      return true;  
    }  

    if(cluster && length > 1) {
      const coord = cluster.get('geometry').getCoordinates();
      const pixel = map.getPixelFromCoordinate(coord);
      const points = generateClusterPoints(length, pixel);
      const geom = cluster.getGeometry();
      
      this.declusterAll();
      cluster.setStyle(invisibleStyle);
      cluster.set('expanded', true);

      cluster.get('features').forEach((f, index) => {
        const end = map.getCoordinateFromPixel(points[index]);
        const props = f.getProperties();
        const feature = new ol.Feature({ geometry: geom });
        feature.setProperties(props);
        feature.set('expandedFeature', true);
        feature.setGeometry(new ol.geom.Point(end));
        feature.setStyle(this.clusteredLayer.getStyle());            
        this.expandedClusterSource.addFeature(feature);
        this.clusterLines.appendLineString( new ol.geom.LineString([coord, end]) );
      });
    }
  }

  return true;
};

export default DeclusterInteraction;