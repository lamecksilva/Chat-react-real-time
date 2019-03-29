import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';
import Tiro from './tiro.mp3';

let socket;
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      messages: []
    };
  }

  audio = new Audio(
    // 'https://notificationsounds.com/soundfiles/1728efbda81692282ba642aafd57be3a/file-sounds-1101-plucky.mp3'
    Tiro
  );

  play() {
    this.audio.play();
  }

  componentDidMount() {
    socket = io('http://192.168.11.12:9000');
    socket.on('previousMessages', messages => this.setState({ messages }));

    socket.on('receivedMessage', message => {
      this.play();
      this.setState({ messages: [...this.state.messages, message] });
      this.scrollToBottom();
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { username, message } = this.state;

    if (username.length && message.length) {
      socket.emit('sendMessage', { author: username, message: message });
      this.setState({ message: '' });
    }
  };

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    return (
      <div className="App">
        <form id="chat" onSubmit={this.handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            placeholder="Type your username"
            onChange={this.handleChange}
          />
          <div
            className="messages"
            ref={div => {
              this.messageList = div;
            }}
          >
            {this.state.messages.map(msg => (
              <div key={msg._id} className="message">
                <strong>{msg.author}: </strong>
                {msg.message}
              </div>
            ))}
          </div>
          <label>Message</label>
          <input
            type="text"
            name="message"
            value={this.state.message}
            placeholder="Type your message"
            onChange={this.handleChange}
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    );
  }
}

export default App;
