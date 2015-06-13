import WebSocket from 'ws';
import session from './session';

function connection() {

  const ws = new WebSocket(session.wsLocation);

  ws.onmessage = event => {

    if (event.data === 'up') return session.direction = 'up';

    if (event.data === 'down') return session.direction = 'down';

    if (event.data === 'left') return session.direction = 'left';

    if (event.data === 'right') return session.direction = 'right';

  };

  ws.onopen = () => ws.send('gameClient');

  ws.onclose = () => setTimeout(() => connection(), 1000);

  ws.onerror = () => setTimeout(() => connection(), 1000);

  return ws;

};

export
default

function() {

  try {

    connection();

  } catch (error) {

    console.error('WS not working', session.ws, error);

  }

}