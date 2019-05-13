import React from 'react';
import PropTypes from 'prop-types';
import SocketIO from 'socket.io-client';
import {SocketContext} from './SocketContext';
import {warning, debug} from './utils';

class Socket extends React.Component {
  constructor(props) {
    super(props);

    this.socket = SocketIO(props.uri, this.mergeOptions(props.options));

    this.socket.status = 'initialized';

    this.socket.on('connect', () => {
      this.socket.status = 'connected';
      debug('connected');
    });

    this.socket.on('disconnect', () => {
      this.socket.status = 'disconnected';
      debug('disconnect');
    });

    this.socket.on('error', (err) => {
      this.socket.status = 'failed';
      warning('error', err);
    });

    this.socket.on('reconnect', (data) => {
      this.socket.status = 'connected';
      debug('reconnect', data);
    });

    this.socket.on('reconnect_attempt', () => {
      debug('reconnect_attempt');
    });

    this.socket.on('reconnecting', () => {
      this.socket.status = 'reconnecting';
      debug('reconnecting');
    });

    this.socket.on('reconnect_failed', (error) => {
      this.socket.status = 'failed';
      warning('reconnect_failed', error);
    });
  }

  mergeOptions(options = {}) {
    const defaultOptions = {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1 * 1000,
      reconnectionDelayMax: 10 * 1000,
      autoConnect: true,
      transports: ['polling'],
      rejectUnauthorized: true
    };
    return {...defaultOptions, ...options};
  }

  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        {React.Children.only(this.props.children)}
      </SocketContext.Provider>
    );
  }
}

Socket.propTypes = {
  options: PropTypes.object,
  uri: PropTypes.string,
  children: PropTypes.element.isRequired
};

export default Socket;
