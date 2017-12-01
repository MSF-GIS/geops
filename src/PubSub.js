'use strict';

// Heavily inspire on https://github.com/mroderick/PubSubJS/

const messages = {};
let lastUid = -1;

function subscribe(message, func) {
  if(typeof func !== 'function') {
    return false;
  }

  if(!messages.hasOwnProperty(message)) {
    messages[message] = {};
  }

  const token = 'uid_' + String(++lastUid);
  messages[message][token] = func;

  return token;
}

function publish(message, data) {
  if(!messages.hasOwnProperty(message)) {
    return false;
  }

  const subscribers = messages[message];
  for(let sub in subscribers) {
    subscribers[sub](message, data);
  }
}

function unsubscribe(token) {
  for (let m in messages ){
    if ( messages.hasOwnProperty( m ) ){
      let message = messages[m];
      if ( message[token] ){
        delete message[token];
        // tokens are unique, so we can just stop here
        break;
      }        
    }
  }
}

export default { publish, subscribe, unsubscribe };