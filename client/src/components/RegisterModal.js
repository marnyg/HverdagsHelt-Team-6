import * as React from 'react';
import { Component } from 'react-simplified';

class RegisterModal extends Component {
    constructor(){
        super();
        this.submit = this.submit.bind(this);
        this.notBlank = this.notBlank.bind(this);
        /*
        this.emailChange = this.emailChange.bind(this);
        this.pw1Change = this.pw1Change.bind(this);
        this.pw2Change = this.pw2Change.bind(this);
        this.fnChange = this.fnChange.bind(this);
        this.lnChange = this.lnChange.bind(this);
        this.addressChange = this.addressChange.bind(this);
        this.zipChange = this.zipChange.bind(this);
        this.cityChange = this.cityChange.bind(this);
        this.phoneChange = this.phoneChange.bind(this);
        */
    }
    render() {
        return (
            <div className="modal fade" id="register-modal" tabIndex="-1" role="dialog"
                 aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="registermodal-container modal-content">
                        <h1>Lag ny bruker</h1><br/>
                        <input className="error-input" type="text" name="email" placeholder="Epost" onChange={(event) => {this.email = event.target.value}}/>
                        <input type="password" name="pass1" placeholder="Passord" onChange={(event) => {this.password1 = event.target.value}}/>
                        <input type="password" name="pass2" placeholder="Gjenta passord" onChange={(event) => {this.password2 = event.target.value}}/>
                        <input type="text" name="firstname" placeholder="Fornavn" onChange={(event) => {this.fn = event.target.value}}/>
                        <input type="text" name="lastname" placeholder="Etternavn" onChange={(event) => {this.ln = event.target.value}}/>
                        <input type="text" name="adress" placeholder="Adresse" onChange={(event) => {this.address= event.target.value}}/>
                        <input type="text" name="zip" placeholder="Postnummer" onChange={(event) => {this.zip = event.target.value}}/>
                        <input type="text" name="city" placeholder="Sted" onChange={(event) => {this.city = event.target.value}}/>
                        <input type="text" name="phone" placeholder="Telefonnummer"/>
                        <input name="login" className="btn btn-primary" value="Register" onChange={this.submit} onClick={this.submit}/>
                    </div>
                </div>
            </div>
        );
    }

    submit(event){
        var data = {
            email: this.email,
            pw1: this.password1,
            pw2: this.password2,
            fn: this.fn,
            ln: this.ln,
            address: this.address,
            zip: this.zip,
            city: this.city
        };
        console.log(data);

        if(this.notBlank(data)){
            // All required fields have been filled
            console.log('Good to go');
            if(this.validPW(this.password1, this.password2)){
                if(this.validEmail(this.email)){
                    /*
                    let userService = new UserService();

                    userService.register(data)
                        .then((user: User) => {

                        })
                        .catch((error: Error) => {console.error(error)});
                    */
                } else {
                    alert('Epostadressen er ikke gyldig');
                }
            } else {
                alert('Passordene er ikke like');
            }
        } else {
            // One or more required fields have not been filled
            alert('Du må fylle ut alle feltene for å kunne registrere deg.');
        }
    }

    validPW(pw1, pw2){
        if(pw1 !== pw2){
            return false;
        } else {
            return true;
        }
    }

    validEmail(email){
        return false;
        /*
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
        */
    }

    notBlank(data){
        for(var prop in data){
            if(data[prop] === undefined || data[prop] === ''){
                return false;
            }
        }
        return true
    }
}
export default RegisterModal;
