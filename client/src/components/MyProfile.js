// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import MyCases from './MyCases.js';
import NewCase from './NewCase';

class MyProfile extends Component<{}, { isEditing: boolean }> {
  state = { isEditing: false };

  user = null
  render() {
    if (this.user == null) { return <div>404</div> }
    return <div>{this.state.isEditing ? this.getEditFormVersion() : this.getDisplayInfoVersion()}</div>;
  }


  mounted() {
    //get user
    this.user = { name: 'Ola Norman', epost: '123@asd.abc', tlf: '12312312', password: "1" };
  }

  changToEditVersion(event, arg: boolean) {
    event.preventDefault()
    this.setState({ isEditing: arg });
  }
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'name':
        this.user.name = event.target.value;
        break;
      case 'email':
        this.user.epost = event.target.value;
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
        <label>Navn: </label>
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
        <input type="tel" required id="tlf" defaultValue={this.user.tlf} onChange={this.handleChange} className="form-control" />
        <label>Nytt Passord</label>
        <input type="password" required id='password1' onChange={this.handleChange} className="form-control" />
        <label>Gjenta Passord</label>
        <input type="password" required id="password2" onChange={this.handleChange} className="form-control" />
        <button className="btn btn-primary" onClick={this.validateForm}>
          Send Endringer
        </button>

        <button className="btn btn-danger" onClick={(e) => this.changToEditVersion(e, false)}>
          Avbryt
        </button>
      </form>
    );
  }
  validateForm(event: Event) {
    event.preventDefault()
    let form = event.target.parentNode
    let children = Array.prototype.slice.call(form.children, 0);

    if (this.arePasswordsEqual(children)) {

      console.log("form is valid, this is where you send the data to te server");
      console.log("you also get the newest profile data from the server");

      this.setState({ isEditing: false })
      console.log(this.state);

    } else {
      let passwordInputs = children.filter(e => e.id.includes("password"));
      passwordInputs.map(e => e.setCustomValidity("Passwords must match"))
      console.log("her we allert the user that the passwords dont match")
    }

  }

  arePasswordsEqual(children: HTMLElement) {
    let passwordInputs = children.filter(e => e.id.includes("password"));
    return (passwordInputs[1].value === passwordInputs[0].value)
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
        <button className="btn btn-primary" onClick={(e) => this.changToEditVersion(e, true)}>
          Rediger Profil
        </button>
      </form>
    );
  }
}



export default MyProfile;
