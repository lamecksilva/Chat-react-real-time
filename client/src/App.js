import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

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

  componentDidMount() {
    socket = io('http://localhost:9000');
    socket.on('previousMessages', messages => this.setState({ messages }));
    socket.on('receivedMessage', message =>
      this.setState({ messages: [...this.state.messages, message] })
    );
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
      socket.emit('sendMessage', { author: username, message });
      this.setState({ message: '' });
    }
  };

  render() {
    return (
      <div className="App">
        <form id="chat" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Type your username"
            onChange={this.handleChange}
          />
          <div className="messages">
            {this.state.messages.map(msg => (
              <div className="message">
                <strong>{msg.author}: </strong>
                {msg.message}{' '}
              </div>
            ))}
          </div>
          <input
            type="text"
            name="message"
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
