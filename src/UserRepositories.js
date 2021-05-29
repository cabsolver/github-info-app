import { Component } from 'react';
import React from 'react';

export default class UserRepositories extends Component {
  displayReposList() {
    const repos = this.props.repos;

    return <div className="Repos-list">
      {repos.map(repo => {
        return (
          <ul className="Repo-unit">
            <li className="Repo-name">
              <a className="Repo-url" 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer">
                  {repo.name}
              </a>
            </li>
            <li className="Repo-description">
              {repo.description}
            </li>
          </ul>
        )
      })}
    </div>
  }

  render() {
    if(this.props.reposAmount === 0) {
      return this.props.displayState("empty");
    }

    return (
      <div className="Repos"> 
        <div className="Repos-amount">Repositories ({this.props.reposAmount})</div>
        {this.displayReposList()}
      </div>
    );
  }
}