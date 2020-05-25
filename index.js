const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

const Message = require('./models/Message');

mongoose
	.connect('mongodb://localhost:27017/real-time-chat', {
		useNewUrlParser: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));

const getMessages = async () => {
	const messages = await Message.find({}, {}, { sort: { date: -1 } }).limit(10);

	return messages.map((message) => {
		return {
			...message._doc,
		};
	});
};

io.on('connection', async (socket) => {
	console.log(`socket: ${socket.id}`);

	socket.emit('previousMessages', await getMessages());

	socket.on('sendMessage', (data) => {
		new Message(data)
			.save()
			.then((result) => {
				console.log(result);

				socket.emit('receivedMessage', result);
				socket.broadcast.emit('receivedMessage', result);
			})
			.catch((err) => console.log(err));
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
