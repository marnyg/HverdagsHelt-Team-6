// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditProfile from './EditProfile';
import DisplayProfile from './DisplayProfile'

class EditPassword extends Component {
    us = new UserService();
    user = JSON.parse(localStorage.getItem("user"))
    oldUser = JSON.parse(localStorage.getItem("user"))

    render() {
        if (this.user == null) {
            return <div>404</div>;
        }
        return <div>{this.getEditFormVersion()}</div>;
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        switch (event.target.id) {
            case 'password1':
                this.user.password = event.target.value;
                break;
        }
        console.log(this.user);
    }
    getEditFormVersion() {
        return (
            <form id="form-inline">

                <label>Nytt Passord</label>
                <input type="password" required id="password1" onChange={this.handleChange} className="form-control" />
                <label>Gjenta Passord</label>
                <input type="password" required id="password2" onChange={this.handleChange} className="form-control" />
                <button type="submit" className="btn btn-primary" onClick={this.validateForm}>
                    Send
                </button>
                <button className="btn btn-danger" onClick={e => this.props.returnHome(e)}>
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

            this.us.updatePassword(this.user.user_id, this.oldUser.password, this.user.password)
                .catch((error: Error) => console.error(error))
        } else {
            if (this.arePasswordsEqual(children)) {
                let passwordInputs = children.filter(e => e.id.includes('password'));
                passwordInputs.map(e => e.setCustomValidity('Passwords must match'));
            } else {
                let passwordInputs = children.filter(e => e.id.includes('password'));
                passwordInputs.map(e => e.setCustomValidity(''));
            }
            form.reportValidity();
        }


    }

    arePasswordsEqual(children: Array<HTMLInputElement>) {
        console.log(children);

        let passwordInputs = children.filter(e => e.id.includes('password'));
        console.log(passwordInputs);
        console.log(passwordInputs[0].value);
        console.log(passwordInputs[1].value);

        return (passwordInputs[1].value === passwordInputs[0].value);
    }


}

export default EditPassword;
