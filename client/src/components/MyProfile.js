// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditPassword from './EditPassword';
import EditProfile from './EditProfile';
import DisplayProfile from './DisplayProfile';

class MyProfile extends Component {
  isEditing = false;
  us = new UserService();
  user = JSON.parse(localStorage.getItem('user'));
  currentComponent = <DisplayProfile callback={this.setComponent} />;

  render() {
    if (this.user == null) {
      return <div>404</div>;
    }
    return <div>{this.currentComponent}</div>;
  }

  setComponent(e, comp) {
    console.log(e, comp);
    // e.preventDefault()

    this.currentComponent = comp;
  }
}

export default MyProfile;
