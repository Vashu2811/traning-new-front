import { io } from 'socket.io-client';

const socket = io("https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io", {
  transports: ['websocket'],
  // other configurations like authentication can go here
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

export default socket;
