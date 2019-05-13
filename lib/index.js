'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketContext = exports.Event = exports.Socket = undefined;

var _Socket = require('./Socket');

var _Socket2 = _interopRequireDefault(_Socket);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _SocketContext = require('./SocketContext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window) window.ReactSocketIO = { Socket: _Socket2.default, Event: _Event2.default, SocketContext: _SocketContext.SocketContext };

exports.Socket = _Socket2.default;
exports.Event = _Event2.default;
exports.SocketContext = _SocketContext.SocketContext;