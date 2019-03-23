import React from 'react';
import PropTypes from 'prop-types';
import {SocketContext} from './SocketContext';
import {warning} from './utils';

class Event extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {event, handler} = this.props;
    const socket = this.context;

    if (!socket) {
      warning('Socket IO connection has not been established.');
      return;
    }

    socket.on(event, handler);
  }

  componentWillUnmount() {
    const {event, handler} = this.props;
    const socket = this.context;

    if (!socket) {
      warning('Socket IO connection has not been established.');
      return;
    }

    socket.off(event, handler);
  }

  render() {
    return false;
  }
}

Event.contextType = SocketContext;

Event.propTypes = {
  event: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired
};

export default Event;
