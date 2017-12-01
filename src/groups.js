'use strict';

export const superTypes = {
  'general hosp': 'Hospitals',
  'surgery hosp': 'Hospitals',
  'HIV': 'Infectious chr deseases',
  'TB': 'Infectious chr deseases',
  'Hep C': 'Infectious chr deseases',
  'unitaid': 'Infectious chr deseases',
  'PHC': 'PHC',
  'malaria': 'PHC',
  'wash': 'Other',
  'VXS': 'Other',
  'NCDs': 'Other',
  'Other': 'Other'
};

export const contextGroups = {
  'direct': ['coordination','support','association', '', '#NAME?']
};

export const defaultChoiceGroups = {
  'choice': ['c','explo'],
  'default': ['d','association','coordination','eprep','support','','#NAME?']
};