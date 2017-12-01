'use strict';
import '../../styles/TileLayerSwitcher.css';
import ol from 'openlayers/build/ol.custom';

const TileLayerSwitcherControl = function(opts) {
  const layers = opts.tileLayerGroup.getLayers().getArray();
  const items = layers.map(layer => {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'baselayers');
    input.setAttribute('value', layer.get('title'));
    input.classList.add('form-check-input');
    if(layer.get('visible')) { input.setAttribute('checked', 'checked'); }  

    const labelText = document.createTextNode(layer.get('title'));

    const label = document.createElement('label');
    label.classList.add('form-check-label');
    label.appendChild(input);
    label.appendChild(labelText);

    const div = document.createElement('div');
    div.classList.add('form-check');
    div.appendChild(label);

    const li = document.createElement('li');
    li.appendChild(div);

    return li;
  });

  const tileLayerList = document.createElement('ul');
  tileLayerList.classList.add('d-none');
  items.forEach(item => { tileLayerList.appendChild(item); });

  const button = document.createElement('button');
  button.id = 'layer-switcher-control-button';
  button.innerHTML = '<i class="fa fa-angle-double-down" aria-hidden="true"></i>';

  const container = document.createElement('div');
  container.id = 'layer-switcher-control';
  container.classList.add('ol-control', 'ol-unselectable');
  container.appendChild(button);
  container.appendChild(tileLayerList);

  button.addEventListener('mouseenter', () => {
    tileLayerList.classList.remove('d-none');
  });

  container.addEventListener('mouseleave', () => {
    tileLayerList.classList.add('d-none');
  });

  tileLayerList.addEventListener('change', ev => {
    const value = ev.target.value;
    layers.forEach(layer => { layer.set('visible', false); });
    layers.filter(layer => layer.get('title') === value)
      .forEach(layer => { layer.set('visible', true); });
  });

  ol.control.Control.call(this, {
    element: container,
  });
}

ol.inherits(TileLayerSwitcherControl, ol.control.Control);

export default TileLayerSwitcherControl;