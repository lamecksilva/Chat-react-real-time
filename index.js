const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log(`socket: ${socket.id}`);
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
