import swarm from 'webrtc-swarm';
import signalingClient from 'signalhub';
import session from './session';

function init() {

  const up = document.querySelector('.move-up');
  const left = document.querySelector('.move-left');
  const right = document.querySelector('.move-right');
  const down = document.querySelector('.move-down');

  try {

    const signaling = signalingClient(session.signalingNamespace, session.signalingHub);

    const rtc = swarm(signaling);

    rtc.on('peer', function(peer, id) {

      up.addEventListener('click', () => peer.send('up'));
      left.addEventListener('click', () => peer.send('left'));
      right.addEventListener('click', () => peer.send('right'));
      down.addEventListener('click', () => peer.send('down'));

    });

  } catch (error) {

    console.error('Signaling not working', session.signalingHub, error);

  }

}


window.onload = () => init();