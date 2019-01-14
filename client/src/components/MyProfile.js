// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import MyCases from './CaseList.js';
import NewCase from './NewCase';

class MyProfile extends Component<{}, { isEditing: boolean }> {
  state = { isEditing: false };

  user = { name: 'Ola Norman', epost: '123@asd.abc', tlf: '12312312', rolle: 'Mordi' };
  render() {
    return <div>{this.state.isEditing ? this.getDisplayInfoVersion() : this.getEditFormVersion()}</div>;
  }

  changToEditVersion(arg: boolean) {
    this.setState({ isEditing: arg });
    console.log(this.state);
    console.log(this.state.isEditing);
  }
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'name':
        this.user.name = event.target.value;
        console.log('changed name to ' + event.target.value);
        break;
      case 'email':
        this.user.epost = event.target.value;
        console.log('changed email to ' + event.target.value);
        break;
      case 'tlf':
        this.user.tlf = event.target.value;
        console.log('changed email to ' + event.target.value);
        break;
    }
    console.log(this.user);
  }
  getEditFormVersion() {
    return (
      <form id="form-inline">
        <legend>Profil</legend>
        <label>Naaaaavn: </label>
        <input
          type="text"
          id="name"
          required
          defaultValue={this.user.name}
          onChange={this.handleChange}
          className="form-control"
        />
        <label>Epost :</label>
        <input
          type="email"
          required
          id="email"
          defaultValue={this.user.epost}
          onChange={this.handleChange}
          className="form-control"
        />
        <label>Tlf</label>
        <input type="tel" id="tlf" defaultValue={this.user.tlf} onChange={this.handleChange} className="form-control" />
        <label>Rolle (???????????)</label>
        <input type="text" defaultValue={this.user.rolle} onChange={this.handleChange} className="form-control" />
        <button className="btn btn-primary" onClick={() => this.changToEditVersion(true)}>
          Send Endringer
        </button>

        <button className="btn btn-danger" onClick={() => this.changToEditVersion(true)}>
          Avbryt
        </button>
      </form>
    );
  }

  getDisplayInfoVersion() {
    return (
      <form id="form-inline">
        <legend>Profil</legend>
        <label>Navn: </label>
        <p>{this.user.name}</p>
        <label>Epost :</label>
        <p>{this.user.epost}</p>
        <label>Tlf</label>
        <p>{this.user.tlf}</p>
        <label>Rolle (???????????)</label>
        <p>{this.user.rolle}</p>
        <button className="btn btn-primary" onClick={() => this.changToEditVersion(false)}>
          Rediger Profil
        </button>
      </form>
    );
  }
}

export default MyProfile;
