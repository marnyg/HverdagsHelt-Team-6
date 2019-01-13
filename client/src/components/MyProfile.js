// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import MyCases from './MyCases.js';
import NewCase from './NewCase';

class MyProfile extends Component {
  user = { name: 'Ola Norman', epost: '123@asd.abc', tlf: '12312312', rolle: 'Mordi' };

  render() {
    return (
      <form id="form-inline">
        <legend>Profil</legend>
        <label>Navn: </label>
        <p type="text" placeholder="Smith" class="input-xlarge">
          {this.user.name}
        </p>
        <label>Epost :</label>
        <p type="text" placeholder="Smith" class="input-xlarge">
          {this.user.epost}
        </p>
        <label>Tlf</label>
        <p type="text" placeholder="Smith" class="input-xlarge">
          {this.user.tlf}
        </p>
        <label>Rolle (???????????)</label>
        <p type="text" placeholder="Smith" class="input-xlarge">
          {this.user.rolle}
        </p>
        <button className="btn btn-primary"> Rediger Profil</button>
      </form>
    );
  }
}

export default MyProfile;
