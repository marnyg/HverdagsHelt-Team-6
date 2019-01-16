// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditPassword from './EditPassword';
import DisplayProfile from './DisplayProfile'

class EditProfile extends Component<{}, { isEditing: boolean }> {
    isEditing = false
    us = new UserService();
    user = JSON.parse(localStorage.getItem("user"))

    render() {
        if (this.user == null) {
            return <div>404</div>;
        }
        { console.log(this.user) }
        return <div>{this.getForm()}</div>;
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
            case 'password':
                this.user.password = event.target.value;
                break;

        }
        console.log(this.user);
    }
    getForm() {
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
                <label>Etteravn: </label>
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
                <label>Bekreft Passord</label>
                <input type="password" required id="password" onChange={this.handleChange} className="form-control" />
                <button type="submit" valie="asd" className="btn btn-primary" onClick={this.validateForm}>
                    Send
                </button>

                <button className="btn btn-danger" onClick={e => this.props.callback(e, <DisplayProfile callback={this.props.callback} />)}>
                    Avbryt
        </button>
            </form >
        );
    }
    validateForm(event: Event) {
        event.preventDefault();
        let form = event.target.parentNode;

        if (form.checkValidity()) {
            this.us.updateUser(this.user.user_id, this.user)
                .then(() => {
                    localStorage.setItem("user", JSON.stringify(this.user))
                    this.props.callback(null, <DisplayProfile callback={this.callback}></DisplayProfile>)
                }).catch(Error => console.log(Error))
        } else {
            form.reportValidity();
        }
    }



}

export default EditProfile;
