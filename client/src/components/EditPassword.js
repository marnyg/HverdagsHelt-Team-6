// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditProfile from './EditProfile';
import DisplayProfile from './DisplayProfile';
import Alert from './Alert.js';

/**
 * This component is representing the area where to change you own password.
 */

class EditPassword extends Component {
    us = new UserService();
    user = JSON.parse(localStorage.getItem('user'));
    // oldUser = JSON.parse(localStorage.getItem("user"))
    oldPass: string;
    oldPass = '';
    error = null;

    /**
     * If user does not exist, render 404 page
     * @returns {*} HTML element presenting 404 page, or the editform for password change.
     */

    render() {
        if (this.user == null) {
            return <div>404</div>;
        }
        return <div>{this.getEditFormVersion()}</div>;
    }

    /**
     * This function is used to set both old and new password from form.
     * @param event To be triggered by change in input-fields.
     */

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        switch (event.target.id) {
            case 'password1':
                this.user.password = event.target.value;
                break;
            case 'oldPassword':
                this.oldPass = event.target.value;
                break;
        }
    }

    /**
     * This function is the change password form.
     * @returns {*} HTML element containing the edit password form.
     */


    getEditFormVersion() {
        return (
            <form ref="form" className={'row list-group-item mx-5'}>
                {this.error}
                <div className={'row'}>
                    <div className={'col-sm'}>Gammelt Passord:</div>
                    <div className={'col-lg'}>
                        <input type="password" required id="oldPassword" onChange={this.handleChange}
                            className="form-control" />
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-sm'}><small className={"text-muted"}>Passord må inneholde liten og stor bosktav og minst et tall </small></div>
                </div>
                <div className={'row'}>
                    <div className={'col-sm'}>Passord: </div>
                    <div className={'col-lg'}>
                        <input
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
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
                        </div>
                    <div
                        className={'col-md btn btn-danger'} onClick={e => this.props.callback(e, <DisplayProfile callback={this.props.callback} />)}>
                        Avbryt
                    </div>

                </div>
            </form>
        );

    }

    /**
     * Function to validate if the change password action will be accepted or not.
     * @param event To be triggered by button-click
     */

    validateForm(event: Event) {
        event.preventDefault();

        let passInput1 = this.refs.passInput1;
        let passInput2 = this.refs.passInput2;

        if (passInput1.value === passInput2.value && this.refs.form.checkValidity()) {
            console.log('pass OK');
            this.error = <Alert
                type='success'
                text='Passord ble oppdatert!'
            />
            passInput2.setCustomValidity('');
            this.us
                .updatePassword(this.user.user_id, this.oldPass, this.user.password)
                .then(() => this.props.callback(null, <DisplayProfile callback={this.props.callback} />))
                .catch((error: Error) => {
                    this.error = <Alert
                        type='danger'
                        text='Feil oppstod! Var gammelt passord riktig?'
                    />
                });
            //console.error(error));

        } else {
            this.error = <Alert
                type='danger'
                text='Feil oppstod! Passord ble ikke oppdatert, prøv igjen.'
            />
            passInput2.setCustomValidity('Passwords must match');
            this.refs.form.reportValidity();
            passInput2.setCustomValidity('');
            console.log('pass NO OK');
        }
    }
}

export default EditPassword;
