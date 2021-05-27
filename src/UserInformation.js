import { Component } from 'react';
import React from 'react';

export default class UserInformation extends Component {
    constructor(props) {
      super(props);
      this.displayInShortFormat = this.displayInShortFormat.bind(this);
    }
  
    displayInShortFormat(amount) {
      if (amount > 1000) {
        return `${(amount / 1000).toFixed(1)}k`;
      }
      return amount;
    }
  
    render() {
        let user = this.props.user;
        return(
          <div className="User-info">
            <img className="User-avatar" src={user.avatar_url} alt="Avatar"/>
              <div className="User-name">{user.name}</div>
              <div className="User-login">
                <a className="User-url" 
                  href={user.html_url} 
                  target="_blank" 
                  rel="noreferrer">
                    {user.login}
                </a>
              </div>
              <div className="User-follow">
                <div className="User-followers">{this.displayInShortFormat(user.followers)} followers</div>
                <div className="User-following">{this.displayInShortFormat(user.following)} following</div>
              </div>
          </div>
        );
      }
  }