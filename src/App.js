import { Component } from 'react';
import './App.css';

class App extends Component {
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <div className="App-logo">
            <img src="/img/header-ico.svg" alt="logo"/>
          </div>
          <form className="search-form">
            <input type="text" name="username" className="search-input" placeholder="Enter GitHub username"/>
          </form>
        </div>

        <div className="App-main">

        </div>
      </div>
    );
  }   
}

export default App;