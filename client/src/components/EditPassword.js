// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditProfile from './EditProfile';
import DisplayProfile from './DisplayProfile';

class EditPassword extends Component {
    us = new UserService();
    user = JSON.parse(localStorage.getItem('user'));
    // oldUser = JSON.parse(localStorage.getItem("user"))
    oldPass: string;
    oldPass = '';

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
            case 'oldPassword':
                this.oldPass = event.target.value;
                break;
        }
        console.log(this.user);
    }
    getEditFormVersion() {
        return (
            <form ref="form" className={'row list-group-item'}>
                <div className={'row'}>
                    <div className={'col-sm'}>Gammelt Passord:</div>
                    <div className={'col-lg'}>
                        <input type="password" required id="oldPassword" onChange={this.handleChange} className="form-control" />
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-sm'}>Passord:</div>
                    <div className={'col-lg'}>
                        <input
                            ref="passInput1"
                            type="password"
                            required
                            id="password1"
                            onChange={this.handleChange}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-sm'}>Gjenta passord:</div>
                    <div className={'col-lg'}>
                        <input
                            ref="passInput2"
                            type="password"
                            required
                            id="password2"
                            onChange={this.handleChange}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className={'d-flex'}>
                    <div className={'col-lg btn btn-primary'} onClick={this.validateForm}>
                        Lagre
                        {/* asd */}
                    </div>
                </div>
                <div
                    className={'col-md btn btn-danger'}
                    onClick={e => this.props.callback(e, <DisplayProfile callback={this.props.callback} />)}
                >
                    Avbryt
        </div>
            </form>
        );
    }
    validateForm(event: Event) {
        event.preventDefault();

        let passInput1 = this.refs.passInput1;
        let passInput2 = this.refs.passInput2;

        if (passInput1.value === passInput2.value && this.refs.form.checkValidity()) {
            console.log('pass OK');
            passInput2.setCustomValidity('');
            this.us
                .updatePassword(this.user.user_id, this.oldPass, this.user.password)
                .then(() => this.props.callback(null, <DisplayProfile callback={this.props.callback} />))
                .catch((error: Error) => console.error(error));
        } else {
            passInput2.setCustomValidity('Passwords must match');
            this.refs.form.reportValidity();
            passInput2.setCustomValidity('');
            console.log('pass NO OK');
        }
    }
}

export default EditPassword;
