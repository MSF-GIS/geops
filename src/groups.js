'use strict';

export const typeGroups = {
  'Hospitals': ['general hosp','surgery hosp'],
  'Infectious chr deseases': ['HIV','TB','Hep C','unitaid'],
  'PHC': ['PHC','malaria'],
  'Other': ['wash','VXS','NCDs','Other']
};

export const contextGroups = {
  'direct': ['coordination','support','association', '', '#NAME?']
};

export const defaultChoiceGroups = {
  'choice': ['c','explo'],
  'default': ['d','association','coordination','eprep','support','','#NAME?']
};