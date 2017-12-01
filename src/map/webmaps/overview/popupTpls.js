'use strict';

export function missionTpl(props) {
  const budget =  Math.round(props.financial.initial + props.financial.COPRO).toLocaleString('de-DE');
  const staff = (Math.round((props.NS + props.IS) * 100 ) / 100).toLocaleString('de-DE');

  return `
    <h4> ${props.name} </h4>
    <ul>
      <li><strong>Budget:</strong> € ${budget}</li>
      <li><strong>Total HR:</strong> ${staff}</li>
    </ul> 
  `;
}

export function projectTpl(props) {
  const budget =  Math.round(props.financial.initial + props.financial.COPRO).toLocaleString('de-DE');
  const staff = (Math.round((props.NS + props.IS) * 100 ) / 100).toLocaleString('de-DE');

  return `
    <h4> ${props.code} </h4>
    <ul>
      <li><strong>Budget:</strong> € ${budget}</li>
      <li><strong>Total HR:</strong> ${staff}</li>
    </ul> 
  `;
}