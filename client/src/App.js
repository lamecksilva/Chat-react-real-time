import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';
import Shot from './shot.mp3';

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
    Shot
  );

  play() {
    this.audio.play();
  }

  componentDidMount() {
    socket = io('http://192.168.25.10:9000');
    socket.on('previousMessages', async messages => {
      await messages.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log(messages);
      await this.setState({ messages });
    });

    socket.on('receivedMessage', async message => {
      console.log(message);
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
    console.log(this.state);

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
      <div className="container">
        <div className="row">
          <div className="col-md-12 d-flex col-xs-12">
            <div className="mx-auto col-md-8">
              <h4 className="text-center mt-3">Chat App</h4>
              <form onSubmit={this.handleSubmit} className="col-xs-12">
                <div className="form-group col-xs-12">
                  <label htmlFor="usernameInput">Username</label>
                  <input
                    name="username"
                    id="usernameInput"
                    className="form-control"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Enter your username"
                  />
                </div>

                <div
                  ref={div => {
                    this.messageList = div;
                  }}
                  className="list-group list-group-flush messages"
                >
                  {this.state.messages.map(msg => (
                    <div key={msg._id} className="list-group-item">
                      <small>
                        {new Date(msg.date).getHours()}:
                        {new Date(msg.date).getMinutes()}
                      </small>
                      {'  '}
                      <strong>{msg.author}: </strong>
                      {msg.message}
                      {'  '}
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label htmlFor="messageInput">Message</label>
                  <input
                    type="input"
                    name="message"
                    value={this.state.message}
                    placeholder="Type your message"
                    onChange={this.handleChange}
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block mb-3"
                  onClick={this.handleSubmit}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
