// Babel polyfill to support all ES6 features
require("babelify/polyfill.js");

import blockade from './game';

// Kick it off after window object has loaded (all resources were loaded)
window.onload = () => blockade();