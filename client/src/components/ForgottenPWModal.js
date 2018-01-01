//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import UserService from "../services/UserService";

class ForgottenPWModal extends Component{
    error = null;

    render() {
        return(
            <div>
                {this.error}
                <div className={'container'}>
                    Skriv inn eposten din, så sender vi deg et nytt passord.
                    <form ref={'forgottenPWForm'} className={'form-group mt-3'}>
                        <div className={'row'}>
                            <div className={'col-8'}>
                                <input id={'forgotten-pw-email'} className={'form-control'} type={'email'} placeholder={'Skriv inn din epostadresse'} required/>
                            </div>
                            <div className={'col-4'}>
                                <button className={'btn btn-primary'} onClick={(event) => this.submit(event)}>Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    submit(event) {
        event.preventDefault();
        let form = this.refs.forgottenPWForm;
        if(form.checkValidity()) {
            console.log('Sender nytt passord på epost');
            let email = document.querySelector('#forgotten-pw-email').value;
            console.log('Email:', email);
            let userService = new UserService();
            userService.forgottenPassword(email)
                .then(res => {
                    console.log(res);
                })
                .catch((error: Error) => {
                    console.error(error);
                })
        } else {
            form.reportValidity();
        }
    }
}
export default ForgottenPWModal;