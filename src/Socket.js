import React from 'react'
import SocketIO from 'socket.io-client'

import { warning } from './utils'

class Socket extends React.Component {
  getChildContext() {
    return { socket: this.socket }
  }

  state = {
    state: 'initialized'
  }

  constructor(props, context) {
    super(props, context)
    this.options = props.options ? props.options : {}
    this.mergeOptions = this.mergeOptions.bind(this)
  }

  componentDidMount() {
    const socket = SocketIO(this.props.uri, this.mergeOptions())

    this.setState({state: 'connecting'})

    socket.on('connect', (data) =>
      this.socket = socket
      this.setState({state: 'connected'})
      console.log('connected')
    )

    socket.on('disconnect', (data) =>
      this.socket = null
      this.setState({state: 'disconnected'})
      console.log('disconnect')
    )

    socket.on('error', (err) =>
      this.socket = null
      this.setState({state: 'failed'})
      warning('error', err)
    )

    socket.on('reconnect', (data) =>
      this.setState({state: 'connected'})
      this.socket = socket
      console.log('reconnect', data)
    )

    socket.on('reconnect_attempt', (data) =>
      console.log('reconnect_attempt')
    )

    socket.on('reconnecting', (data) =>
      this.setState({state: 'reconnecting'})
      console.log('reconnecting')
    )

    socket.on('reconnect_failed', (data) =>
      this.setState({state: 'failed'})
      warning('reconnect_failed')
    )
  }

  mergeOptions() {
    const options = {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1 * 1000,
      reconnectionDelayMax: 10 * 1000,
      autoConnect: true,
      transports: ['polling'],
      rejectUnauthorized: true,
      extraHeaders: {},
      pfx: null,
      key: null,
      passphrase: null,
      cert: null,
      ca: null,
      ciphers: null
    }
    return { ...options, ...this.options }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

Socket.propTypes = {
  options: React.PropTypes.object,
  uri: React.PropTypes.string.isRequired,
  children: React.PropTypes.element.isRequired
}

export default Socket
