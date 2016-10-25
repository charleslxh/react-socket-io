import React from 'react';

import { warning } from './utils';

class Event extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { event, handler } = this.props;
    const { socket } = this.context;

    if (!socket) {
      warning('Socket IO connection has not been established.');
      return;
    }

    socket.on(event, handler);
  }

  componentWillUnmount() {
    const { event, handler } = this.props;
    const { socket } = this.context;

    if (!socket) {
      warning('Socket IO connection has not been established.');
      return;
    }

    socket.off(event, handler);
  }

  render() {
    return false;
  }
};

Event.contextTypes = {
  socket: React.PropTypes.object.isRequired
};

Event.propTypes = {
  event: React.PropTypes.string.isRequired,
  handler: React.PropTypes.func.isRequired
};

export default Event;
