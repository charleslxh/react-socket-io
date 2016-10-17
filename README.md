# react-socket-io
A react provider for socket.io, http://socket.io/

# How to use

In app container file:

```js
import React from 'react';
import { Socket } from 'react-socket-io';

const uri = 'http://localhost/test'
const options = { transports: ['websocket'] }

export default class AppContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Socket uri={uri} options={options}> 
                { this.props.children }
            </Socket>
        );
    }
}
```

In other files:

```js
import React from 'react'
import { Event } from 'react-socket-io';

export default class MyComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onMessage = this.onMessage.bind(this)
    }

    onMessage(message) {
        console.log(message)
    }

    render() {
        <div>
            <h1>My React SocketIO Demo.</h1>
            <Event event='eventName' handler={this.onMessage}>
        </div>
    }
}

```

# As a contributer.

1. Clone this project.

```bash
git clone git@github.com:charleslxh/react-socket-io.git
```

2. Install third party packages

```bash
npm install
```

3. Run gulp

```bash
gulp
```

If you has not gulp command, Install it as global.
