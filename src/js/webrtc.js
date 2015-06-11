import swarm from 'webrtc-swarm';
import signalingClient from 'signalhub';
import session from './session';

export
default

function() {

  try {

    const signaling = signalingClient(session.signalingNamespace, session.signalingHub);

    const rtc = swarm(signaling);

    rtc.on('peer', function(peer, id) {

      peer.on('data', function(data) {

        if (data === 'up') return session.direction = 'up';

        if (data === 'down') return session.direction = 'down';

        if (data === 'left') return session.direction = 'left';

        if (data === 'right') return session.direction = 'right';

      });

    });

  } catch (error) {

    console.error('Signaling not working', session.signalingHub, error);

  }

}