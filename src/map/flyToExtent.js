'use strict';

import ol from 'openlayers/build/ol.custom';

ol.View.prototype.flyToAnimation_ = function(center, startZoom, endZoom) {
  const duration = 3000;
  let parts = 2;
  let called = false;
  
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
    }
  }

  this.animate({
    center: center,
    duration: duration
  }, callback);

  this.animate({
    zoom: startZoom - 1,
    duration: duration / 2
  }, {
    zoom: endZoom,
    duration: duration / 2
  }, callback);
}

ol.View.prototype.flyToExtent = function(extent, padding, size, minZoom, maxZoom) {
  const newSize = [size[0] - padding[1] - padding[3], size[1] - padding[0] - padding[2]];
  const res = this.getResolutionForExtent(extent, newSize);
  const area = ol.extent.getArea(extent);
  const center = area > 1 ? ol.extent.getCenter(extent) : [extent[0], extent[1]];
  const startZoom = Math.min(minZoom, this.getZoom());
  const endZoom = area <= 1 ? maxZoom : Math.min(this.getZoomForResolution(res), maxZoom);

  this.flyToAnimation_(center, startZoom, endZoom);
}