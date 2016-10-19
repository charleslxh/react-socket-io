import Socket from './Socket';
import Event from './Event';

if (window) window.ReactSocketIO = { Socket, Event };

export { Socket, Event };
