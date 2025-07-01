// socket.js
import io from 'socket.io-client';

const socket = io(
  'http://bojanalic-001-site1.ntempurl.com/bus-operator/current-state',
  {
    transports: ['websocket'],
    autoConnect: false, // You control when to connect
  },
);

export default socket;
