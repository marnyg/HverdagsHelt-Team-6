// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditPassword from './EditPassword';
import DisplayProfile from './DisplayProfile';

class EditProfile extends Component<{}, { isEditing: boolean }> {
  isEditing = false;
  us = new UserService();
  user = JSON.parse(localStorage.getItem('user'));

  render() {
    {
      console.log(this.user);
    }
    if (this.user == null) {
      return <div>404</div>;
    }
    {
      console.log(this.user);
    }
    return <div>{this.getForm()}</div>;
  }

  handleChange(event: React.ChangeEvent<HTMLInpuStElement>) {
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
      case 'password':
        this.user.password = event.target.value;
        break;
    }
    console.log(this.user);
  }

  getForm() {
    return (
      <div className={'card w-100'}>
        <form ref="form" className={'list-group list-group-flush mw-100'}>
          <div className={'container w-100'}>
            <div className={'row list-group-item d-flex'}>
              <div className={'col-sm'}>Fornavn:</div>
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
              <div className={'col-sm'}>Etternavn:</div>
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
              <div className={'col-sm'}>Tlf:</div>
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
            <div className={'row list-group-item d-flex'}>
              <div className={'col-sm'}>Passord:</div>
              <div className={'col-lg'}>
                <input type="password" required id="password" onChange={this.handleChange} className="form-control" />
              </div>
            </div>
          </div>
          <div className={'d-flex'}>
            <div className={'col-lg btn btn-primary'} onClick={this.validateForm}>
              Lagre
            </div>
            <div
              className={'col-md btn btn-danger'}
              onClick={e => this.props.callback(e, <DisplayProfile callback={this.props.callback} />)}
            >
              Avbryt
            </div>
          </div>
        </form>
      </div>
    );
  }
  validateForm(event: Event) {
    event.preventDefault();
    let form = this.refs.form;
    console.log('user:', this.user);

    if (form.checkValidity()) {
      this.user.tlf = Number(this.user.tlf);
      this.us
        .updateUser(this.user.user_id, this.user)
        .then(() => {
          localStorage.setItem('user', JSON.stringify(this.user));
          this.props.callback(null, <DisplayProfile callback={this.props.callback} />);
        })
        .catch(Error => console.log(Error));
    } else {
      form.reportValidity();
    }
  }
}

export default EditProfile;
