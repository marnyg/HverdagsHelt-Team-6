// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, withRouter } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/loginmodal.css';
import '../styles/registermodal.css';
import '../styles/grid-list-toggle.css';
import '../styles/simple-sidebar.css';
import '../styles/carousel.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faEdit,
  faUsers,
  faChartLine,
  faPlus,
  faCheck,
  faTrashAlt,
  faKey,
  faTh,
  faCoffee,
  faListUl,
  faBell
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faEdit,
  faUsers,
  faChartLine,
  faPlus,
  faCheck,
  faTrashAlt,
  faKey,
  faTh,
  faCoffee,
  faListUl,
  faBell
);
import Navbar from './Navbar.js';
import ContentWrapper from './ContentWrapper.js';
import Footer from './Footer.js';
import MyPage from './MyPage.js';
import ViewCase from './ViewCase.js';
import NewCase from './NewCase.js';
import axios from 'axios';
import Notify from './Notify.js';
import Subscriptions from './Subscriptions.js';
import InfoPage from './InfoPage.js';
import About from './About.js';
import Notifications from './Notifications.js';
import UserService from '../services/UserService';
import LoginService from '../services/LoginService';
import EmployeePage from './Employee/EmployeePage';
import AdminPage from './Admin/AdminPage';
import VerificationModal from './VerificationModal';

import Loader from 'react-loader-spinner'; //https://www.npmjs.com/package/react-loader-spinner
axios.interceptors.response.use(response => response.data);

/**
 * This component is used run the the system. In this component all the gets rendered onto
 * the webpage.
 */

class App extends Component {
  logged_in: boolean = false;

  /**
   * The render method is rendering all the components onto the webpage.
   */

  render() {
    let visited = JSON.parse(localStorage.getItem('visited'));
    if (!visited) {
      localStorage.setItem('visited', JSON.stringify({ visited: true }));
    }

    return (
      <HashRouter>
        <div className={'h-100 w-100'}>
          <div id={'spinner'}>
            <Loader type="Oval" color="#428bca" height="200" width="200" />
          </div>
          <div className={'h-100 w-100'}>
            <Navbar logged_in={this.logged_in} onLogin={() => this.onLogin()} logout={event => this.logout(event)} />
            <VerificationModal />
            <Route path="/my-page" render={() => <MyPage />} />
            <Route path="/employee" render={() => <EmployeePage />} />
            <Route path="/admin" render={() => <AdminPage />} />
            <Route exact path="/subscriptions" render={() => <Subscriptions />} />
            <div className="content-wrapper">
              <Notify />
              {visited ? (
                <Route
                  exact
                  path="/"
                  render={() => <ContentWrapper logged_in={this.logged_in} onLogin={() => this.onLogin()} />}
                />
              ) : (
                <Route exact path="/" render={() => <InfoPage />} />
              )}
              <Route
                exact
                path="/case/:case_id"
                render={() => <ViewCase onCaseOpened={c => Navbar.onCaseOpened(c)} />}
              />
              <Route exact path="/notifications" render={() => <Notifications />} />
              <Route exact path="/new-case" render={() => <NewCase />} />
              <Route exact path="/search/:query" component={ContentWrapper} />
              <Route exact path="/welcome" render={() => <InfoPage />} />
              <Route exact path="/about" render={() => <About />} />
            </div>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }

  /**
   * This method is handling the loginService.
   */

  mounted() {
    let loginService = new LoginService();
    loginService
      .isLoggedIn()
      .then((logged_in: boolean) => {
        this.logged_in = logged_in;
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * This method is handling the logout from the system.
   * @param event Triggered by a button
   */

  logout(event) {
    let userService = new UserService();
    userService
      .logout()
      .then(res => {
        this.logged_in = false;
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * This method is handling the login and setting variable this.logged_id = true.
   */

  onLogin = () => {
    console.log('App Logged in');
    this.logged_in = true;
  };
}
export default App;
