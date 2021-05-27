import { Component } from 'react';
import React from 'react';

export default class UserSearchForm extends Component {
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
            className="search-input" 
            type="text" 
            name="username"
            ref={this.input}
            placeholder="Enter GitHub username"/>
        </form>
      );
    }
  }