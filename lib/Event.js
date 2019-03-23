'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _SocketContext = require('./SocketContext');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Event = function (_React$Component) {
  (0, _inherits3.default)(Event, _React$Component);

  function Event(props) {
    (0, _classCallCheck3.default)(this, Event);
    return (0, _possibleConstructorReturn3.default)(this, (Event.__proto__ || (0, _getPrototypeOf2.default)(Event)).call(this, props));
  }

  (0, _createClass3.default)(Event, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          event = _props.event,
          handler = _props.handler;

      var socket = this.context;

      if (!socket) {
        (0, _utils.warning)('Socket IO connection has not been established.');
        return;
      }

      socket.on(event, handler);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _props2 = this.props,
          event = _props2.event,
          handler = _props2.handler;

      var socket = this.context;

      if (!socket) {
        (0, _utils.warning)('Socket IO connection has not been established.');
        return;
      }

      socket.off(event, handler);
    }
  }, {
    key: 'render',
    value: function render() {
      return false;
    }
  }]);
  return Event;
}(_react2.default.Component);

Event.contextType = _SocketContext.SocketContext;

Event.propTypes = {
  event: _propTypes2.default.string.isRequired,
  handler: _propTypes2.default.func.isRequired
};

exports.default = Event;