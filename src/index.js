import Socket from './Socket';
import Event from './Event';
import {SocketContext} from './SocketContext';

if (typeof window !== 'undefined') window.ReactSocketIO = {Socket, Event, SocketContext};

export {Socket, Event, SocketContext};
