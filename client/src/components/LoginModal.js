//@flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { withRouter } from 'react-router-dom';
import UserService from '../services/UserService.js';
import Notify from './Notify';
import Alert from './Alert.js';
import VerificationModal from './VerificationModal';
import ForgottenPWModal from './ForgottenPWModal';

/**
 * This component is renderin the login form of the webpage.
 */

class LoginModal extends Component {
  error = null;
  constructor() {
    super();
    this.submit = this.submit.bind(this); //Function to submit the login
    this.emailChange = this.emailChange.bind(this); //Function to register the changes in email-input (username)
    this.pwChange = this.pwChange.bind(this); //Function to register the changes in the password-input
  }

  /**
   * Rendering the login form.
   * @returns {*} HTML element returning the login form.
   */

  render() {
    return (
      <div
        className="modal fade"
        id={this.props.modal_id}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="loginmodal-container modal-content">
            <h1>Logg inn</h1>
            <br />
            {this.error}
            <input type="text" name="user" placeholder="Epost" onKeyPress={this.keyCheck} onChange={this.emailChange} />
            <input
              type="password"
              name="pass"
              placeholder="Passord"
              onKeyPress={this.keyCheck}
              onChange={this.pwChange}
            />
            <input
              name="login"
              className="btn btn-primary"
              value="Logg inn"
              onChange={this.submit}
              onClick={this.submit}
            />
            <div className="login-help">
              <div
                className={'nav-link'}
                style={{ cursor: 'pointer' }}
                onClick={event => this.forgottenPasswordModal()}
              >
                Glemt passordet ditt?
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Function to submit the login.
   * @param event Triggered by a button-click.
   */

  submit(event) {
    this.error = false;
    event.preventDefault();
    let data = {
      email: this.email,
      password: this.password
    };

    if (this.valid(data)) {
      let userService = new UserService();
      userService
        .login(this.email, this.password)
        .then((user: User) => {
          //document.getElementsByClassName("loading")[0].style.display = "none";
          $('#' + this.props.modal_id).modal('hide');
          //this.props.history.push('/');
          this.props.onLogin();
        })
        .catch((error: Error) => {
          this.error = <Alert type="danger" text="Brukernavn og/eller passord er feil" />;
        });
    } else {
      this.error = <Alert type="danger" text="Du må fylle inn begge feltene for å sende skjemaet" />;
    }
  }

  /**
   * Function to available push of 'enter'-button for submitting login.
   * @param event To be triggered by 'enter'-button click.
   */

  keyCheck(event) {
    if (event.key === 'Enter') {
      this.submit(event);
    }
  }

  /**
   * Function to register the changes in email-input (username).
   * @param event Triggered by onChange field.
   */

  pwChange(event) {
    this.password = event.target.value;
    this.error = null;
  }

  /**
   * Function to register the changes in the password-input.
   * @param event Triggered by onChange field.
   */

  emailChange(event) {
    this.email = event.target.value;
    this.error = null;
  }

  /**
   * Function to validate the input data.
   * @param data  Data registered by the user.
   * @returns {boolean}   Returning true or false, depending on the recived data.
   */

  valid(data) {
    if (data.email && data.password) {
      if (data.email !== undefined && data.email !== '') {
        if (data.password !== undefined && data.password !== '') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Prompts the user with a forgotten password pop-up modal.
   */
  forgottenPasswordModal() {
    $('#' + this.props.modal_id).modal('hide');
    let modal_header = 'Skriv inn eposten din';
    let modal_body = (
      <ForgottenPWModal
        onSubmitted={() => {
          $('#verify-modal').modal('hide');
        }}
      />
    );
    let modal_footer = (
      <div>
        <strong>VIKTIG:</strong> Endre passordet ditt så snart du har fått logget inn igjen!
      </div>
    );
    VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    $('#verify-modal').modal('show');
  }
}
export default withRouter(LoginModal);
