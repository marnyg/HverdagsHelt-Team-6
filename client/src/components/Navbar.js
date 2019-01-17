import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import Content from './Content.js';
import UserService from '../services/UserService.js';
import LoginService from "../services/LoginService";
import CaseSubscriptionService from "../services/CaseSubscriptionService";
import CaseSubscription from "../classes/CaseSubscription";
import hverdagsheltLogo from '../../public/hverdagsheltLogo2Trans.png';

class Navbar extends Component {
  logged_in = false;
  notification_count = 1;
  notifications = [];
  constructor() {
    super();
    this.submitSearch = this.submitSearch.bind(this);
    this.logout = this.logout.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  render() {
    let registerlink = null;
    let user = JSON.parse(localStorage.getItem('user'));
    if(user === null){
        registerlink = (
            <div className="nav-link" data-toggle="modal" data-target="#register-modal">
                Registrer sak
            </div>
        );
    } else if(this.logged_in === false){
        registerlink = (
            <div className="nav-link" data-toggle="modal" data-target="#login-modal">
                Registrer sak
            </div>
        );
    } else {
        registerlink = (
            <NavLink to="/new-case" className="nav-link">
                Registrer sak
            </NavLink>
        );
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink to={'/'} className="navbar-left"><img src={hverdagsheltLogo} height={29.7} width={185}/></NavLink>
        {/*<NavLink to="/" className="navbar-brand">
          HverdagsHelt<span className="badge badge-primary mobile-notification">{this.notification_count > 0 ? this.notification_count:null}</span>
        </NavLink>*/}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link">
                Hjem
              </NavLink>
            </li>

            <li className="nav-item">{registerlink}</li>
            <li className="nav-item">
              {this.logged_in ? (
                <NavLink to="/subscriptions" className="nav-link">
                  Abonnement
                </NavLink>
              ) : null}
            </li>
            <li className="nav-item">
                {this.logged_in ? (
                    <NavLink to="/notifications" className="nav-link">
                        Varsler <span className="badge badge-primary fullbar-notification">{this.notification_count > 0 ? this.notification_count:null}</span>
                    </NavLink>
                ) : null}
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-1" onSubmit={this.submitSearch}>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={e => (this.search = e.target.value)}
            />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.submitSearch}>
              Søk
            </button>
          </form>
          <ul className="navbar-nav">{this.logincheck()}</ul>
        </div>
      </nav>
    );
  }

  mounted() {
    // Check if user is logged in
    //console.log('Navbar mounted');
    let loginService = new LoginService();
    loginService.isLoggedIn()
        .then((logged_in: Boolean) => {
          this.logged_in = logged_in;
          if(logged_in === true){
              // get notifications
              let subscriptionService = new CaseSubscriptionService();
              let user = JSON.parse(localStorage.getItem('user'));
              subscriptionService.getAllCaseSubscriptions(user.user_id)
                  .then((cs: CaseSubscription[]) => {
                      for (let i = 0; i < cs.length; i++) {
                        if(cs[i].is_up_to_date === false){
                            this.notification_count++;
                        }
                      }
                      this.notifications = cs;
                  })
                  .catch((error: Error) => console.error(error));
          }
        })
        .catch((error: Error) => console.error(error));
  }

  submitSearch(event) {
    event.preventDefault();
    console.log(this.search);
    if (this.search !== undefined && this.search !== '') {
      this.props.history.push('/search/' + this.search);
    }
  }

  logincheck() {
    if (this.logged_in) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/my-page" className="nav-link">
              Min Side
            </NavLink>
          </li>
          <li className="nav-item">
            <div className="nav-link" onClick={this.logout}>
              Logg ut
            </div>
            <LoginModal onLogin={() => this.onLogin()} />
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <div className="nav-link" data-toggle="modal" data-target="#register-modal">
              Ny bruker
            </div>
            <RegisterModal onLogin={() => this.onLogin()}/>
          </li>
          <li className="nav-item">
            <div className="nav-link" data-toggle="modal" data-target="#login-modal">
              Logg inn
            </div>
            <LoginModal onLogin={() => this.onLogin()} />
          </li>
        </ul>
      );
    }
  }

  logout(event) {
    console.log('Logging out');
    let userService = new UserService();
    userService.logout()
        .then(res => {
            console.log('Logout response:', res);
            this.logged_in = false;
            this.props.history.push('/');
        })
        .catch((error: Error) => console.error(error));
  }

  onLogin = () => {
    //console.log('onLogin');
    this.logged_in = true;
  };
}
export default withRouter(Navbar);
