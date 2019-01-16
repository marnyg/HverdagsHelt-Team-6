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
    return(
        <div className={'ml-3 mt-3'}>
            {this.state.isEditing ? this.getEditFormVersion() : this.getDisplayInfoVersion()}
        </div>
    );
  }

  mounted() {
    let a = localStorage.getItem("user");
    this.user = JSON.parse(a);
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
        <div className={'card w-100'}>
            <div className={'list-group list-group-flush mw-100'}>
                <div className={'container w-100'}>
                    <div className={'row list-group-item d-flex'}>
                        <div className={'col-sm'}>
                            Fornavn:
                        </div>
                        <div className={'col-lg'}>
                            <input
                                type="text"
                                id="firstname"
                                required
                                defaultValue={this.user.firstname}
                                onChange={this.handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className={'row list-group-item d-flex'}>
                        <div className={'col-sm'}>
                            Etternavn:
                        </div>
                        <div className={'col-lg'}>
                            <input
                                type="text"
                                id="lastname"
                                required
                                defaultValue={this.user.lastname}
                                onChange={this.handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className={'row list-group-item'}>
                        <div className={'col-lg-auto'}>
                            Email:
                            <input
                                type="email"
                                required
                                id="email"
                                defaultValue={this.user.email}
                                onChange={this.handleChange}
                                className="form-control mt-2"
                            />
                        </div>
                    </div>
                    <div className={'row list-group-item d-flex'}>
                        <div className={'col-sm'}>
                            Tlf:
                        </div>
                        <div className={'col-lg'}>
                            <input
                                type="tel"
                                required
                                id="tlf"
                                defaultValue={this.user.tlf}
                                onChange={this.handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className={'row list-group-item'}>
                        <div className={'row'}>
                            <div className={'col-sm'}>
                                Passord:
                            </div>
                            <div className={'col-lg'}>
                                <input type="password" required id="password1" onChange={this.handleChange} className="form-control" />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm'}>
                                Gjenta passord:
                            </div>
                            <div className={'col-lg'}>
                                <input type="password" required id="password2" onChange={this.handleChange} className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'d-flex p-0'}>
                <div className={'col-lg btn btn-primary'} onClick={this.validateForm}>
                    Lagre
                </div>
                <div className={'col-md btn btn-danger'} onClick={e => this.changToEditVersion(e, false)}>
                    Avbryt
                </div>
            </div>
        </div>
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
      <div className={'card'}>
          <div className={'list-group list-group-flush'}>
              <div className={'container'}>
                  <div className={'row list-group-item d-flex'}>
                      <div className={'col-sm'}>
                          Fornavn:
                      </div>
                      <div className={'col-lg'}>
                          {this.user.firstname}
                      </div>
                  </div>
                  <div className={'row list-group-item d-flex'}>
                      <div className={'col-sm'}>
                          Etternavn:
                      </div>
                      <div className={'col-lg'}>
                          {this.user.lastname}
                      </div>
                  </div>
                  <div className={'row list-group-item d-flex'}>
                      <div className={'col-sm'}>
                          Epost:
                      </div>
                      <div className={'col-lg'}>
                          {this.user.email}
                      </div>
                  </div>
                  <div className={'row list-group-item d-flex'}>
                      <div className={'col-sm'}>
                          Tlf:
                      </div>
                      <div className={'col-lg'}>
                          {this.user.tlf}
                      </div>
                  </div>
              </div>
              <button className="btn btn-primary" onClick={e => this.changToEditVersion(e, true)}>
                  Rediger Profil
              </button>
          </div>
      </div>
    );
  }
}

export default MyProfile;
