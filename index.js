const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

const Message = require('./models/Message');

mongoose
  .connect('mongodb://localhost:27017/real-time-chat', {
    useNewUrlParser: true
  })
  .then(result => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

console.log(
  Message.find()
    .sort({ date: -1 })
    .then(msgs => {
      if (msgs) {
        let arr = msgs.map(item => 
          return {
            item: item._id,
            message: item.message,
            author: item.author,
            date: item.date
          }
        );

        return arr;
      }
    })
);

const messages = [];

io.on('connection', socket => {
  console.log(`socket: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    new Message(data)
      .save()
      .then(result => {
        console.log(result);

        socket.emit('receivedMessage', result);
        socket.broadcast.emit('receivedMessage', result);
      })
      .catch(err => console.log(err));
  });
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
