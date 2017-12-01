'use strict';

import '../styles/overviewDataviz.css';
import h from 'snabbdom/h';

function header(title) {
  return h('div.row.details-head', [
    h('div.col-md-1'),
    h('div.col-md-10', [
      h('h2', title)
    ]),
    h('div.col-md-1')
  ]);
}

function financialTable(initial, COPRO, forecast) {
  return h('table#fin-table.table table-striped.table-condensed.table-responsive', [
    h('thead', [
      h('th', 'Initial'),
      h('th', 'COPRO'),
      h('th', 'Forecast')
    ]),
    h('tr', [
      h('td', initial.toLocaleString('de-DE')),
      h('td', COPRO.toLocaleString('de-DE')),
      h('td', forecast.toLocaleString('de-DE')),
    ])
  ]);
}

function HRTable(NS, IS) {
  return h('table#hr-table.table table-striped.table-condensed.table-responsive', [
    h('thead', [
      h('th', 'National Staff'),
      h('th', 'International Staff'),
      h('th', 'Total')
    ]),
    h('tr', [
      h('td', NS.toLocaleString('de-DE')),
      h('td', IS.toLocaleString('de-DE')),
      h('td', (Math.round((NS + IS) * 100) / 100).toLocaleString('de-DE')),
    ])
  ]);
}

function projectInfoTable(project) {
  return h('table#gen-infos-table.table table-striped.table-condensed.table-responsive', [
    h('thead', [
      h('th', 'Code'),
      h('th', 'Name'),
      h('th', 'Mission'),
      h('th', 'Type'),
      h('th', 'Location'),
    ]),
    h('tr', [
      h('td', project.code),
      h('td', project.name),
      h('td', project.mission),
      h('td', project.type),
      h('td', project.location)
    ])
  ]);
}

function missionInfoTable(mission) {
  return h('table#gen-infos-table.table table-striped.table-condensed.table-responsive', [
    h('thead', [
      h('th', 'Name'),
      h('th', 'Coordination location')
    ]),
    h('tr', [
      h('td', mission.name),
      h('td', mission.location)
    ])
  ]);
}

export function projectViz(project) {
  return h('div#dataviz-container.container-fluid', [
    header('Project Details'),
    h('div.row.details-content', [
      h('div.col-md-1'),
      h('div.col-md-2', [
        h('div#img-container')
      ]),
      h('div.col-md-8', [
        h('h3', 'General informations'),
        projectInfoTable(project),
        h('div.row', [
          h('div.col-md-6', [
            h('h3', 'Human Resources'),
            HRTable(project.NS, project.IS)
          ]),
          h('div.col-md-6', [
            h('h3', 'Financial'),
            financialTable(project.financial.initial, project.financial.COPRO, project.financial.forecast)
          ])
        ])
      ]),
      h('div.col-md-1')
    ])
  ]);
}

export function missionViz(mission) {
  return h('div#dataviz-container.container-fluid', [
    header('Mission Details'),
    h('div.row.details-content', [
      h('div.col-md-1'),
      h('div.col-md-2', [
        h('div#img-container')
      ]),
      h('div.col-md-8', [
        h('h3', 'General informations'),
        missionInfoTable(mission),
        h('div.row', [
          h('div.col-md-6', [
            h('h3', 'Human Resources'),
            HRTable(mission.NS, mission.IS)
          ]),
          h('div.col-md-6', [
            h('h3', 'Financial'),
            financialTable(mission.financial.initial, mission.financial.COPRO, mission.financial.forecast)
          ])
        ])
      ]),
      h('div.col-md-1')
    ])
  ]);
}    