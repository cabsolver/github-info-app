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
    const repos = this.props.repos;
    if(this.props.username === '') {
      return this.showInitialState();
    } else if(!this.props.isExisting) {
      return <p>User does not extist!</p>
    } else {
      return(
        <div>
          User's
          <ul>
            <li>Login {this.props.login}</li>
            <li>Name {this.props.name}</li>
            {repos.map(item => {
              return <li>{item.name}</li>
            })}
          </ul>
        </div>
      );
    }
  }
}

class UsernameForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
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
          placeholder="Enter GitHub username"/>
      </form>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.getRepositiories = this.getRepositiories.bind(this);
    this.getUser = this.getUser.bind(this);
    this.state = {
      isExisting: false,
      username: '',
      repos: []
    };
  }

  async getUser(username) {
    return fetch(`https://api.github.com/users/${username}`)
    .then(response => {
      if(!response.ok) {
        return null;
      } else {
        return response.json();
      }
    })
    .then(response => {
      return response;
    });
  }

  async getRepositiories(username) {
    return fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => {
      if(!response.ok) {
        return null;
      } else {
        return response.json();
      }
    })
    .then(response => {
      return response;
    });
  }

  async handleUsernameSubmit(username) {
    let user = await this.getUser(username);
    let repos = await this.getRepositiories(username);
    if(user !== null) {
      this.setState({
        isExisting: true,
        username: username,
        login: user.login,
        name: user.name,
        repos: repos
      });
    } else {
      this.setState({
        isExisting: false,
        username: username,
      });
    }
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
          <UserDisplay 
            isExisting={this.state.isExisting}
            username={this.state.username}
            login={this.state.login}
            name={this.state.name}
            repos={this.state.repos}
          />
        </div>

      </div>
    );
  }   
}

export default App;