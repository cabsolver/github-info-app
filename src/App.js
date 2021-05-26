import { Component } from 'react';
import React from 'react';
import './App.css';
import ReactPaginate from 'react-paginate';

class App extends Component {
  constructor(props){
    super(props);
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.getRepositiories = this.getRepositiories.bind(this);
    this.getUser = this.getUser.bind(this);
    this.displayState = this.displayState.bind(this);
    this.displayUserInfo = this.displayUserInfo.bind(this);
    this.state = {
      isUserExisting: false,
      desiredUser: '',
      repos: [],
      reposPerPage: 4,
      currentPage: 1,
    };
  }

  displayState(state) {
    let imageUrl;
    let message;
    switch (state){
      case "initial": {
        imageUrl = "/img/loupe-ico.svg"; 
        message = "Start with searching a GitHub user"
        break;
      } 

      case "not-found": {
        imageUrl = "/img/user-not-found-ico.svg";
        message = "User not found" 
        break;
      } 

      case "empty": {
        imageUrl = "/img/empty-list.svg";
        message = "Repository list is empty" 
        break;
      } 

      default: imageUrl = "/img/loupe-ico.svg";
    }

    return(
        <div className={"state-wrapper " + state}>
          <div className={"state-hint " + state}>
            <img className={"state-ico " + state} src={imageUrl} alt="loupe" />
            <p className={"state-text " + state}>{message}</p>
          </div>
        </div>
    );
  }

  displayUserInfo() {
    if(this.state.desiredUser === '') {
      return this.displayState("initial");
    } else if(!this.state.isUserExisting) {
      return this.displayState("not-found");
    } else {
      return <div className="User">
       <UserInformation 
        className="User-info"
        isExisting={this.state.isUserExisting}
        user={this.state.receivedUser}/>

        <UserRepositories 
          repos={this.state.repos}
          displayState={this.displayState}
          />

        <ReactPaginate 
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    }
  }

  async getUser(desiredUser) {
    return fetch(`https://api.github.com/users/${desiredUser}`)
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

  async getRepositiories(desiredUser) {
    let perPage = this.state.reposPerPage;
    let page = this.state.currentPage;

    return fetch(
      `https://api.github.com/users/${desiredUser}/repos?per_page=${perPage}&page=${page}`)
    .then(response => {
      if(!response.ok) {
        return null;
      } else {
        return response.json();
      }
    })
    .then(response => {
      this.setState({
        repos: response,
        pageCount: Math.ceil(this.state.receivedUser.public_repos / 4)
      });
    });
  }

  handlePageClick = (data) => {
    let selected = data.selected + 1;

    this.setState({ currentPage: selected }, () => {
      this.getRepositiories(this.state.desiredUser);
    });
  };

  async handleUsernameSubmit(desiredUser) {
    let reseivedUser = await this.getUser(desiredUser);
    

    if (reseivedUser !== null) {
      this.setState({
        isUserExisting: true,
        desiredUser: desiredUser,
        receivedUser: reseivedUser,
        },
        () => {
          this.getRepositiories(this.state.desiredUser);
        });
    } else {
      this.setState({
        isUserExisting: false,
        desiredUser: desiredUser,
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
          <UserSearchForm 
            username={this.state.desiredUser}
            onUsernameSubmit={this.handleUsernameSubmit} />
        </div>

        <div className="App-main">
          {this.displayUserInfo()}
        </div>

      </div>
    );
  }   
}

class UserInformation extends Component {
  render() {
      let user = this.props.user;
      return(
        <div className="User-info">
          <img className="User-avatar" src={user.avatar_url} alt="Avatar"/>
          <ul >
            <li>{user.name}</li>
            <li><a href={user.html_url} target="_blank" rel="noreferrer">{user.login}</a></li>
            <li>Followers {user.followers}</li>
          </ul>
        </div>
      );
    }
}

class UserRepositories extends Component {
  render() {
    const repos = this.props.repos;
    if(repos.length === 0) {
      return this.props.displayState("empty");
    }

    return (
      <div> 
        <ul>
          <li>Repos {this.props.repos.length}</li>
          {repos.map(repo => {
            return (
              <li>{repo.name}</li>
            )
          })}
        </ul>

      </div>
    );
  }
}

class UserSearchForm extends Component {
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


export default App;