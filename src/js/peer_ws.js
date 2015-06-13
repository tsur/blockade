import WebSocket from 'ws';
import session from './session';

let ws;
let connected = false;

function connection() {

  ws = new WebSocket(location.origin.replace(/^http/, 'ws'));

  ws.onopen = () => connected = true;

  ws.onclose = () => {
    connected = false;
    setTimeout(() => ws = connection(), 1000);
  };

  ws.onerror = () => {
    connected = false;
    setTimeout(() => ws = connection(), 1000);
  };

};


function init() {

  const up = document.querySelector('.move-up');
  const left = document.querySelector('.move-left');
  const right = document.querySelector('.move-right');
  const down = document.querySelector('.move-down');

  try {

    connection();

    up.addEventListener('click', () => {

      if (connected) ws.send('up');

    });

    left.addEventListener('click', () => {

      if (connected) ws.send('left');

    });

    right.addEventListener('click', () => {

      if (connected) ws.send('right');

    });

    down.addEventListener('click', () => {

      if (connected) ws.send('down');

    });

  } catch (error) {

    console.error('WS not working', session.ws, error);

  }

}


window.onload = () => init();