'use strict';

import ol from 'openlayers/build/ol.custom';

const ScrollControl = function() {  
  const button = document.createElement('button');
  button.id = 'scroll-control-button';
  button.classList.add('btn', 'ol-control', 'ol-unselectable'); 
  button.innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>';

  button.addEventListener('click', () => {
    const webmapHeight = document.querySelector('#webmap').clientHeight;
    window.scroll({
      top: webmapHeight,
      left: 0,
      behavior: 'smooth'
    });
  });

  ol.control.Control.call(this, {
    element: button,
  });
}

ol.inherits(ScrollControl, ol.control.Control);

export default ScrollControl;