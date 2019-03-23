'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _SocketContext = require('./SocketContext');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Socket = function (_React$Component) {
  (0, _inherits3.default)(Socket, _React$Component);

  function Socket(props) {
    (0, _classCallCheck3.default)(this, Socket);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Socket.__proto__ || (0, _getPrototypeOf2.default)(Socket)).call(this, props));

    _this.socket = (0, _socket2.default)(props.uri, _this.mergeOptions(props.options));

    _this.socket.status = 'initialized';

    _this.socket.on('connect', function () {
      _this.socket.status = 'connected';
      (0, _utils.debug)('connected');
    });

    _this.socket.on('disconnect', function () {
      _this.socket.status = 'disconnected';
      (0, _utils.debug)('disconnect');
    });

    _this.socket.on('error', function (err) {
      _this.socket.status = 'failed';
      (0, _utils.warning)('error', err);
    });

    _this.socket.on('reconnect', function (data) {
      _this.socket.status = 'connected';
      (0, _utils.debug)('reconnect', data);
    });

    _this.socket.on('reconnect_attempt', function () {
      (0, _utils.debug)('reconnect_attempt');
    });

    _this.socket.on('reconnecting', function () {
      _this.socket.status = 'reconnecting';
      (0, _utils.debug)('reconnecting');
    });

    _this.socket.on('reconnect_failed', function (error) {
      _this.socket.status = 'failed';
      (0, _utils.warning)('reconnect_failed', error);
    });
    return _this;
  }

  (0, _createClass3.default)(Socket, [{
    key: 'mergeOptions',
    value: function mergeOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var defaultOptions = {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1 * 1000,
        reconnectionDelayMax: 10 * 1000,
        autoConnect: true,
        transports: ['polling'],
        rejectUnauthorized: true
      };
      return (0, _extends3.default)({}, defaultOptions, options);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _SocketContext.SocketContext.Provider,
        { value: this.socket },
        _react2.default.Children.only(this.props.children)
      );
    }
  }]);
  return Socket;
}(_react2.default.Component);

Socket.propTypes = {
  options: _propTypes2.default.object,
  uri: _propTypes2.default.string,
  children: _propTypes2.default.element.isRequired
};

exports.default = Socket;