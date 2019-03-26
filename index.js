const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let messages = [];

io.on('connection', socket => {
  console.log(`socket: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);

    socket.emit('receivedMessage', data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
