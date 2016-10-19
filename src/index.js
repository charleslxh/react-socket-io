import Socket from './Socket';
import Event from './Event';

if (window) window.ReactSocketIO = { Socket, Event };

export default { Socket, Event };
