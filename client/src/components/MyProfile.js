// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditPassword from './EditPassword';
import EditProfile from './EditProfile';
import DisplayProfile from './DisplayProfile';

/**
 * This component is representing the 'My profile'-page.
 */

class MyProfile extends Component {
  isEditing = false;
  us = new UserService();
  user = JSON.parse(localStorage.getItem('user'));  //Getting information about the signed in user from the localStorage.
  currentComponent = <DisplayProfile callback={this.setComponent} />;

    /**
     * Rendering the current component where the user has selected.
     * If there ain't found any user-data, the component will render the 404-error page
     * @returns {*}
     */

  render() {
    if (this.user == null) {
      return <div>404</div>;
    }
    return (
        <div style={{'maxWidth': '400px'}} className={'mx-3'}>
            {this.currentComponent}
        </div>
    );
  }

    /**
     * Function to set the current component where the user has selected.
     * @param e
     * @param comp  The component that the user has selected.
     */

  setComponent(e, comp) {
    console.log(e, comp);
    // e.preventDefault()

    this.currentComponent = comp;
  }
}

export default MyProfile;
