'use strict';

var Chat = createReactClass({
  getInitialState: function () {
    return {
      user: null,
      users: [],
      currentUser: {
        messages: []
      }
    };
  },
  componentDidMount: function () {
    this.refs.chatTextarea.focus();
    this.context.emit('user:login');
  },
  scrollToBottom: function (name) {
    if (this.refs[name]) {
      this.refs[name].scrollTop = this.refs.messages.scrollHeight;
    }
  },
  selectUser: function (index) {
    var users = this.state.users;
    var selectedUser = this.state.users[index];
    selectedUser.unreadMessageCount = 0;
    users[index] = selectedUser;
    this.setState({users: users});
    this.setState({currentUser: this.state.users[index]});
  },
  loadOnlineUsers: function () {
    this.context.emit('users:get');
  },
  handleMessageNew: function (message) {
    console.info('Got event message_new: ', message);
    var currentUser = this.state.currentUser;
    var users = this.state.users;
    var index = users.findIndex(function (u) { return message.from === u.userId; });
    var messageFromUser = users[index];

    if (!messageFromUser) {
      console.warn('Not found user!');
      return;
    }

    messageFromUser.messages.push(message);

    if (currentUser && currentUser.nickname === messageFromUser.nickname) {
      this.scrollToBottom('messages');
    } else {
      if (messageFromUser.unreadMessageCount) {
        messageFromUser.unreadMessageCount += 1;
      } else {
        messageFromUser.unreadMessageCount = 1;
      }
    }
    console.log(messageFromUser);
    users.splice(index, 1);
    users.unshift(messageFromUser);
    this.setState({users: users});
  },
  handleEventResponse: function (response) {
    console.debug('Got response event: ', response.type, response.data);
    switch (response.type) {
      case 'user:login':
        this.setState({user: response.data});
        this.loadOnlineUsers();
        break;
      case 'users:get':
        var users = Array.isArray(response.data) ? response.data : [response.data];
        this.setState({users: users});
        break;
      case 'message:send':
        break;
      case 'user:logout':
        break;
    }
  },
  handleUserAdded: function (user) {
    console.info('Got user:added event: ', user);
    var users = this.state.users;
    user.messages = [];
    users.push(user);
    this.setState({users: users});
  },
  handleUserRemoved: function (user) {
    console.info('Got user:removed event: ', user);
    var users = this.state.users;
    var index = users.findIndex(function (u) { user.userId === u.userId; });
    users.splice(index, 1);
    this.setState({users: users});
  },
  sendMessage: function () {
    var msg = this.refs.chatTextarea.value;

    if (!this.state.user) {
      console.warn('Not logged in!');
      return;
    }

    if (!this.context || this.context.status !== 'connected') {
      console.warn('Socket is unavailable!');
      return;
    }

    if (this.refs.chatTextarea.value.length <= 0) {
      console.warn('Can not send empty!');
      return;
    }

    var currentUser = this.state.currentUser;

    var message = {
      content: this.refs.chatTextarea.value,
      from: this.state.user.userId,
      time: new Date().getTime(),
      to: currentUser.userId
    };

    this.context.emit('message:send', message);

    message.isMine = true;
    currentUser.messages.push(message);
    this.setState({currentUser: currentUser}, function () {
      this.scrollToBottom('messages');
    });
    this.refs.chatTextarea.value = '';
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
        <ReactSocketIO.Event event="message:new" handler={self.handleMessageNew}/>
        <ReactSocketIO.Event event="response" handler={self.handleEventResponse}/>
        <ReactSocketIO.Event event="user:added" handler={self.handleUserAdded}/>
        <ReactSocketIO.Event event="user:removed" handler={self.handleUserRemoved}/>

        <div className="chat-section" ref="chat">
          <div className="chat-users-section">
            <div className="title">Online Users</div>
            <div className="users">
              {
                self.state.users.map(function (user, index) {
                  var unreadMessageCountClass = 'unreadMessageCount';
                  var userClass = 'user';

                  if (user.unreadMessageCount <= 0) unreadMessageCountClass += ' hidden';
                  if (self.state.currentUser && user.nickname === self.state.currentUser.nickname) {
                    userClass += ' active';
                  }

                  return (
                    <div className={userClass} key={index} onClick={function (e) {self.selectUser(index);}}>
                      <img className="avatar" src="https://dn-daniujia.qbox.me/moren.png"/>
                      <div className="others">
                        <span className="username">{user.username}</span>
                      </div>
                      <div className={unreadMessageCountClass}>{user.unreadMessageCount}</div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="chat-body-section">
            <div className="title">{self.state.currentUser && self.state.currentUser.username}</div>
            <div className="messages" ref="messages">
              {
                self.state.currentUser.messages.map(function (message, index) {
                  var classes = 'message';
                  if (self.state.user && self.state.user.userId === message.from) classes += ' isMine';

                  var time = new Date(message.time);
                  return (
                    <div className={classes} key={index}>
                      <div className="info">
                        <span className="name"></span>
                        <span className="time">{time.toLocaleString()}</span>
                      </div>
                      <pre className="content">
                        {message.content}
                      </pre>
                    </div>
                  );
                })
              }
            </div>
            <div className="footer">
              <textarea
                className="chat-textarea"
                placeholder='Input there, press "Enter" to send message or "Ctrl + Enter" to add a newline.'
                ref="chatTextarea"
                onKeyDown={self.handleKeyEvent}
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Chat.contextType = ReactSocketIO.SocketContext;
var AppContainer = createReactClass({
  render() {
    var uri = 'http://localhost:8090';
    var options = {transports: ['websocket']};

    return (
      <ReactSocketIO.Socket uri={uri} options={options}>
        <Chat/>
      </ReactSocketIO.Socket>
    );
  }
});

ReactDOM.render(
  <AppContainer/>,
  document.getElementById('container')
);
