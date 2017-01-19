'use strict'

var Counter = React.createClass({
  getInitialState: function () {
    return { messages: [] };
  },
  contextTypes: {
    socket: React.PropTypes.object.isRequired
  },
  componentDidMount: function() {
    this.refs.chatTextarea.focus();
  },
  scrollToBottom: function(name) {
    if (this.refs[name]) {
      this.refs[name].scrollTop = this.refs.messages.scrollHeight;
    }
  },
  onMessage: function (message) {
    console.debug('Got event message_new: ', message);
    var messages = this.state.messages;
    messages.push(message);
    this.setState({messages: messages});
    this.scrollToBottom('messages');
  },
  sendMessage: function() {
    var msg = this.refs.chatTextarea.value;

    if (!this.context.socket || this.context.socket.status !== 'connected') {
      console.warn('Socket is unavailable!');
      return;
    }

    if (this.refs.chatTextarea.value.length <= 0) {
      console.warn('Can not send empty!');
      return;
    }

    var message = {
      content: this.refs.chatTextarea.value,
      from: 'Client',
      time: new Date().getTime()
    };

    this.context.socket.emit('message_send', message);

    message.isMine = true;
    var messages = this.state.messages;
    messages.push(message);
    this.setState({messages: messages}, function() {
      this.scrollToBottom('messages');
    });
    this.refs.chatTextarea.value = ''
  },
  handleKeyEvent: function (event) {
    var e = event || window.event;

    if (e.ctrlKey) {
      if (e.keyCode === 13) {
        var value = this.refs.chatTextarea.value;

        if (value && value.length > 0) {
          this.refs.chatTextarea.value += '\r\n';
          this.scrollToBottom('chatTextarea');
        } else {
          this.refs.chatTextarea.value = '\r\n';
        }
      }
    } else {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.sendMessage();
      }
    }
  },
  render: function () {
    var self = this;
    return (
      <div>
        <h1>React SocketIO Demo</h1>
        <ReactSocketIO.Event event="message_new" handler={this.onMessage} />
        <div className="chat" ref="chat">
          <div className="tip">Come on, chat with server... ...</div>
          <div className="messages" ref="messages">
            {
              self.state.messages.map(function (message, index) {
                var classes = "message";
                if (message.isMine) classes += " isMine"
                var time = new Date(message.time);
                return (
                  <div className={classes} key={index}>
                    <div className="title">
                      <span className="name">【{message.from}】</span>
                      <span className="time">{time.toLocaleTimeString()}</span>
                    </div>
                    <pre className="content">
                      {message.content}
                    </pre>
                  </div>
                )
              })
            }
          </div>
          <div className="footer">
            <textarea
              className="chat-textarea"
              placeholder='Input there, press "Enter" to send message or "Ctrl + Enter" to add a newline.'
              ref="chatTextarea"
              onKeyDown={ this.handleKeyEvent }
            >
            </textarea>
          </div>
        </div>
      </div>
    );
  }
});

var AppContainer = React.createClass({
  render() {
    var uri = 'http://localhost:8090'
    var options = { transports: ['websocket'] }

    return (
      <ReactSocketIO.Socket uri={uri} options={options}>
        <Counter />
      </ReactSocketIO.Socket>
    )
  }
});

ReactDOM.render(
  <AppContainer />,
  document.getElementById('container')
);
