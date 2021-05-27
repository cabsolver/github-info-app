import { Component } from 'react';
import React from 'react';

export default class UserRepositories extends Component {
    render() {
      const repos = this.props.repos;
      if(repos.length === 0) {
        return this.props.displayState("empty");
      }
  
      return (
        <div className="User-repos"> 
          <div className="Repos-amount">Repos ({this.props.reposAmount})</div>
          <ul className="Repos-list">
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
          </ul>
  
        </div>
      );
    }
  }