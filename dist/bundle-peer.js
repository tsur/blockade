(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],3:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var session = new Object();

session.snake = new Array();
session.snakeLength = 15;

session.gameLoop = null;

session.score = 0;
session.scoreIncrement = 10;

session.width = null;
session.height = null;
session.cellSize = 10;

session.direction = 'right';
session.speed = 80;
session.changeColorSpeed = 1500;

session.canvas = null;
session.canvasCtx = null;
session.snakeColor = '#42C155';
session.bgColor = '#3A3536';
session.bgRandomColors = ['#3A3536', 'transparent', '#7AA6E1', '#D64042', '#96BAD5', '#DADDC3', '#A26DA0', '#D50C14', '#FFD78E', '#F4DAF4', '#E7B646', '#979060', '#BF9F6D', '#FA04AF', '#BA6FB5', '#BA7AA6', '#778127', '#CFC5D7', '#458687', '#BCBDEB', '#DA5603', '#88E01B', '#FFB38A', '#D7179E', '#FC3A49'];

session.signalingNamespace = 'blockade-ns2';
session.signalingHub = ['http://localhost:9000/signaling', 'https://blockade-tsur.herokuapp.com/signaling'];

session.ws = process.env.WS;
// session.wsLocation = 'ws://localhost:8080';
session.wsLocation = 'wss://blockade-tsur.herokuapp.com';

exports['default'] = session;
module.exports = exports['default'];

}).call(this,require('_process'))
},{"_process":1}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

var ws = undefined;
var connected = false;

function connection() {

  ws = new _ws2['default'](_session2['default'].wsLocation);

  ws.onopen = function () {
    return connected = true;
  };

  ws.onclose = function () {
    connected = false;
    setTimeout(function () {
      return ws = connection();
    }, 1000);
  };

  ws.onerror = function () {
    connected = false;
    setTimeout(function () {
      return ws = connection();
    }, 1000);
  };
};

function init() {

  var up = document.querySelector('.move-up');
  var left = document.querySelector('.move-left');
  var right = document.querySelector('.move-right');
  var down = document.querySelector('.move-down');

  try {

    connection();

    up.addEventListener('click', function () {

      if (connected) ws.send('up');
    });

    left.addEventListener('click', function () {

      if (connected) ws.send('left');
    });

    right.addEventListener('click', function () {

      if (connected) ws.send('right');
    });

    down.addEventListener('click', function () {

      if (connected) ws.send('down');
    });
  } catch (error) {

    console.error('WS not working', _session2['default'].ws, error);
  }
}

window.onload = function () {
  return init();
};

},{"./session":3,"ws":2}]},{},[4]);
