'use strict';

export function setCurrentTab(tab) {
  return {
    type: 'SET_CURRENT_TAB',
    payload: tab
  }
};

export function setLayerSwitherCollapsed(collapsed) {
  return {
    type: 'SET_LAYER_SWITCHER_COLLAPSED',
    payload: collapsed
  }
};

export function setLayerSwitherChecked(checked) {
  return {
    type: 'SET_LAYER_SWITCHER_CHECKED',
    payload: checked
  }
};

export function setPresences(presences) {
  return {
    type: 'SET_PRESENCES',
    payload: presences
  }
};

export function setProjects(projects) {
  return {
    type: 'SET_PROJECTS',
    payload: projects
  }
};

export function setMission(mission) {
  return {
    type: 'SET_MISSION',
    payload: mission
  }
}

export function setProject(project) {
  return {
    type: 'SET_PROJECT',
    payload: project
  }
}

export function setExtents(extents) {
  return {
    type: 'SET_EXTENTS',
    payload: extents
  }
}

export function setIndicator(indicator) {
  return {
    type: 'SET_INDICATOR',
    payload: indicator
  }
}

export function setFinancials(financials) {
  return {
    type: 'SET_FINANCIALS',
    payload: financials
  } 
}

export function openPopup(data) {
  return {
    type: 'OPEN_POPUP',
    payload: {
      data: data
    }
  } 
}

export function closePopup() {
  return {
    type: 'CLOSE_POPUP'
  } 
}

export function setFilter(filter) {
  return {
    type: 'SET_FILTER',
    payload: filter
  }
}

export function setBudgetDisplay(display) {
  return {
    type: 'SET_BUDGET_DISPLAY',
    payload: display
  }
}

export function setSupply(supply) {
  return {
    type: 'SET_SUPPLY',
    payload: supply
  }
}