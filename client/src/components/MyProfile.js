// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';

class MyProfile extends Component<{}, { isEditing: boolean }> {
  state = { isEditing: false };
  us = new UserService();

  // user: User;
  user = new User();
  render() {
    if (this.user == null) {
      return <div>404</div>;
    }
    return <div>{this.state.isEditing ? this.getEditFormVersion() : this.getDisplayInfoVersion()}</div>;
  }

  mounted() {
    let a = localStorage.getItem("user")
    this.user = JSON.parse(a)
  }

  changToEditVersion(event, arg: boolean) {
    event.preventDefault();
    this.setState({ isEditing: arg });
  }
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'firstname':
        this.user.firstname = event.target.value;
        break;
      case 'lastname':
        this.user.lastname = event.target.value;
        break;
      case 'email':
        this.user.email = event.target.value;
        break;
      case 'tlf':
        this.user.tlf = event.target.value;
        break;
      case 'password1':
        this.user.password = event.target.value;
        break;
    }
    console.log(this.user);
  }
  getEditFormVersion() {
    return (
      <form id="form-inline">
        <legend>Profil</legend>
        <label>Fornavn: </label>
        <input
          type="text"
          id="firstname"
          required
          defaultValue={this.user.firstname}
          onChange={this.handleChange}
          className="form-control"
        />
        <label>Etternavn: </label>
        <input
          type="text"
          id="lastname"
          required
          defaultValue={this.user.lastname}
          onChange={this.handleChange}
          className="form-control"
        />
        <label>Epost :</label>
        <input
          type="email"
          required
          id="email"
          defaultValue={this.user.email}
          onChange={this.handleChange}
          className="form-control"
        />
        <label>Tlf</label>
        <input
          type="tel"
          required
          id="tlf"
          defaultValue={this.user.tlf}
          onChange={this.handleChange}
          className="form-control"
        />
        <label>Nytt Passord</label>
        <input type="password" required id="password1" onChange={this.handleChange} className="form-control" />
        <label>Gjenta Passord</label>
        <input type="password" required id="password2" onChange={this.handleChange} className="form-control" />
        <input type="submit" valie="asd" className="btn btn-primary" onClick={this.validateForm}>
          {/* Send Endringer */}
        </input>

        <button className="btn btn-danger" onClick={e => this.changToEditVersion(e, false)}>
          Avbryt
        </button>
      </form>
    );
  }
  validateForm(event: Event) {
    event.preventDefault();
    let form = event.target.parentNode;
    let children = Array.prototype.slice.call(form.children, 0);

    if (this.arePasswordsEqual(children) && form.checkValidity()) {

      this.us.updateUser(this.user.user_id, this.user)
        .then(() => {
          localStorage.setItem("user", JSON.stringify(this.user))
        }).catch(() => console.log("ERROR"))
      this.setState({ isEditing: false }); //shuld be false
    } else {
      if (this.arePasswordsEqual(children)) {
        let passwordInputs = children.filter(e => e.id.includes('password'));
        passwordInputs.map(e => e.setCustomValidity('Passwords must match'));
      }
      form.reportValidity();
    }


  }

  arePasswordsEqual(children: Array<HTMLInputElement>) {
    let passwordInputs = children.filter(e => e.id.includes('password'));
    return passwordInputs[1].value === passwordInputs[0].value;
  }

  getDisplayInfoVersion() {
    return (
      <form id="form-inline">
        <legend>Profil</legend>
        <label>Fornavn: </label>
        <p>{this.user.firstname}</p>
        <label>Etternavn: </label>
        <p>{this.user.lastname}</p>
        <label>Epost :</label>
        <p>{this.user.email}</p>
        <label>Tlf</label>
        <p>{this.user.tlf}</p>
        <button className="btn btn-primary" onClick={e => this.changToEditVersion(e, true)}>
          Rediger Profil
        </button>
      </form>
    );
  }
}

export default MyProfile;
