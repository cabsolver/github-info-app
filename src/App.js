import { Component } from 'react';
import React from 'react';
import './App.css';

class UserDisplay extends Component {
  constructor(props) {
    super(props);
    this.showInitialState = this.showInitialState.bind(this);
  }

  showInitialState() {
    return(
        <div className="initial-state-wrapper">
          <div className="initial-state-hint">
            <img className="initial-state-ico" src="/img/loupe-ico.svg" alt="loupe" />
            <p className="initial-state-text">Start with searching a GitHub user</p>
          </div>
        </div>
    );
  }

  render() {
    const username = this.props.username;
    if(username === '')
    {
      return this.showInitialState();
    } else {
      return(
        <h1>User {username}</h1>
      );
    }
  }
}

class UsernameForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.state = {username: this.props.username}
    this.input = React.createRef();
  }

  handleChange(event) {
    //this.setState({username: event.target.value})
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.props.onUsernameSubmit(this.input.current.value);
  }

  render() {
    return(
      <form className="search-form" 
            onSubmit={this.handleSubmit}
      >
        <input 
          type="text" 
          className="search-input" 
          name="username"
          ref={this.input}
          // value={this.state.username}
          // onChange={this.handleChange} 
          placeholder="Enter GitHub username"/>
      </form>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.state = {username: ''};
  }

  handleUsernameSubmit(username) {
    this.setState({username});
  }

  render() {
    
    return (
      <div className="App">

        <div className="App-header">
          <div className="App-logo">
            <img src="/img/header-ico.svg" alt="logo"/>
          </div>
          <UsernameForm 
            username={this.state.username}
            onUsernameSubmit={this.handleUsernameSubmit} />
        </div>

        <div className="App-main">
          <UserDisplay username={this.state.username}/>
        </div>

      </div>
    );
  }   
}

export default App;