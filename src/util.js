'use strict';

export function sendXHR(url, callBack) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = callBack;
  xhr.send();
}

export function parseInteger(string) {
  if(string === '') {
    return 0;
  }
  return parseInt(string.replace(/,/g, ''));  
}