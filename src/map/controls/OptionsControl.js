'use strict';

import '../../styles/controls.css';
import ol from 'openlayers/build/ol.custom';
import PubSub from '../../PubSub';
import { setBudgetDisplay } from '../../actions';

const OptionsControl = function() {

  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('name', 'budget-option');
  input.setAttribute('value', 'budget');
  input.classList.add('form-check-input');
  
  const labelText = document.createTextNode('Budget Display');

  const label = document.createElement('label');
  label.classList.add('form-check-label');
  label.appendChild(input);
  label.appendChild(labelText);

  const div = document.createElement('div');
  div.classList.add('form-check');
  div.appendChild(label);

  const li = document.createElement('li');
  li.appendChild(div);

  const optionList = document.createElement('ul');
  optionList.classList.add('d-none');
  optionList.appendChild(li);

  const button = document.createElement('button');
  button.id = 'options-control-button';
  button.innerHTML = '<i class="fa fa-cog" aria-hidden="true"></i>';

  const container = document.createElement('div');
  container.id = 'options-control';
  container.classList.add('ol-control', 'ol-unselectable');
  container.appendChild(button);
  container.appendChild(optionList);

  button.addEventListener('mouseenter', () => {
    optionList.classList.remove('d-none');
  });

  container.addEventListener('mouseleave', () => {
    optionList.classList.add('d-none');
  });

  const this_ = this;

  input.addEventListener('change', evt => {
    PubSub.publish('ACTIONS', setBudgetDisplay(evt.target.checked));
  });

  ol.control.Control.call(this, {
    element: container,
  });
}

ol.inherits(OptionsControl, ol.control.Control);

export default OptionsControl;