"use strict";

import session from './session';
import _ from 'lodash';

export
default

function() {

  try {


    if (typeof webkitSpeechRecognition !== 'undefined') {

      const recognition = new webkitSpeechRecognition();

      const takeAction = voice => {

        // console.log(voice.transcript, voice.confidence);
        const movement = _.last(voice.transcript.split(' '));

        if (movement.indexOf('p') > -1) {

          return session.direction = 'up';

        }

        if (movement.indexOf('d') > -1) {

          return session.direction = 'down';

        }

        if (movement.indexOf('l') > -1) {

          return session.direction = 'left';

        }

        if (movement.indexOf('r') > -1) {

          return session.direction = 'right';

        }

      };

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = function(event) {

        const results = event.results;

        _.forEach(results, voices =>
          _.forEach(voices, voice => takeAction(voice)));

      }

      recognition.start();

    }

  } catch (error) {

    console.error('Voice recognition not working', error);

  }

}