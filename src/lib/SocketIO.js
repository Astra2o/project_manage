import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: '*', // set your frontend origin here
      },
    });

    io.on('connection', (socket) => {
      console.log('User connected', socket.id);

      socket.on('registerUser', (userId) => {
        socket.userId = userId; // assign userId to socket
        console.log(`User registered with ID: ${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
      });
    });
  }

  return io;
}

export function getSocketInstance() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
