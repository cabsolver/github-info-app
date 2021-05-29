import { Component } from 'react';
import React from 'react';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader'
import './App.css';
import UserSearchForm from './UserSearchForm'
import UserInformation from './UserInformation'
import UserRepositories from './UserRepositories'

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
      isRepoLoaded: true,
      isLoaded: true,
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

  displayItemsNumber() {
    const items = this.state.reposPerPage;
    let reposAmount = this.state.receivedUser.public_repos;
    let page = this.state.currentPage;
    let repoStart = 1 + items * (page -1);
    let repoEnd = repoStart + items - 1;  

    if (repoEnd > reposAmount) {
      return <div className="Items-number">
        {repoStart} - {reposAmount} of {reposAmount} items
      </div>
    }

    return (
      <div className="Items-number">
        {repoStart} - {repoEnd} of {reposAmount} items
      </div>
    );
  }

  displayUserInfo() {
    if(this.state.desiredUser === '') {
      return this.displayState("initial");
    } else if(!this.state.isUserExisting) {
      return this.displayState("not-found");
    } else {
      let reposAmount = this.state.receivedUser.public_repos;

      return <div className="User-wrapper">
       <UserInformation
        isExisting={this.state.isUserExisting}
        user={this.state.receivedUser}/>

        <Loader className="Repo-loader" loaded={this.state.isRepoLoaded} color="grey">
          <UserRepositories 
            repos={this.state.repos}
            reposAmount={this.state.receivedUser.public_repos}
            displayState={this.displayState}/>
        </Loader>
          
        <div className="Nav">
          {reposAmount !== 0 ? this.displayItemsNumber() : null}
          <ReactPaginate 
            previousLabel={reposAmount !== 0 ? '<' : ''}
            nextLabel={reposAmount !== 0 ? '>' : ''}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}/>
        </div>  
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
      this.setState({
        isLoaded: true,
      });
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
        isRepoLoaded: true,
        repos: response,
        pageCount: Math.ceil(this.state.receivedUser.public_repos / 4)
      });
    });
  }

  handlePageClick = (data) => {
    let selected = data.selected + 1;

    this.setState({
       currentPage: selected, 
       isRepoLoaded: false
      },
      () => {
      this.getRepositiories(this.state.desiredUser);
    });
  };

  async handleUsernameSubmit(desiredUser) {
    this.setState({
      isLoaded: false,
    });
    let reseivedUser = await this.getUser(desiredUser);
    

    if (reseivedUser !== null) {
      this.setState({
        isUserExisting: true,
        isRepoLoaded: false,
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

        <Loader loaded={this.state.isLoaded} color="grey" >
          <div className="App-main-conteiner">
            {this.displayUserInfo()}
          </div>
        </Loader>

      </div>
    );
  }   
}

export default App;