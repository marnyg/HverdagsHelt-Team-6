import * as React from 'react';
import { Component } from 'react-simplified';
import { withRouter } from 'react-router-dom';
import UserService from '../services/UserService.js';
import Notify from "./Notify";


class LoginModal extends Component {
    error = false;
    constructor(){
        super();
        this.submit = this.submit.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.pwChange = this.pwChange.bind(this);
    }
    render() {
        return (
            <div className="modal fade" id={this.props.modal_id} tabIndex="-1" role="dialog"
                 aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="loginmodal-container modal-content">
                        <h1>Logg inn</h1><br/>
                        {this.error ?
                            <div className={"alert alert-danger alert-dismissible fade show"} role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                Brukernavn og/eller passord er feil
                            </div>
                            :null}
                        <input type="text" name="user" placeholder="Epost" onKeyPress={this.keyCheck} onChange={this.emailChange}></input>
                        <input type="password" name="pass" placeholder="Passord" onKeyPress={this.keyCheck} onChange={this.pwChange}></input>
                        <input name="login" className="btn btn-primary" value="Login" onChange={this.submit} onClick={this.submit}></input>
                        <div className="login-help">
                            <a href="#">Glemt passordet ditt?</a>
                            <br/>
                            <a href="#">Innlogging for kommuneansatte</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    submit(event){
        this.error = false;
        console.log("Submitting login: ", this.email, this.password);
        event.preventDefault();
        let data = {
            email: this.email,
            password: this.password
        };

        if(this.valid(data)){
            let userService = new UserService();
            userService.login(this.email, this.password)
                .then((user: User) => {
                    //document.getElementsByClassName("loading")[0].style.display = "none";
                    $('#' + this.props.modal_id).modal('hide');
                    //this.props.history.push('/');
                    this.props.onLogin();
                })
                .catch((error: Error) => {
                    console.error(error.message);
                    console.log("Oppsey!");
                    this.error = true;
                });
        } else {
            alert("Not valid data. Try again");
        }
    }

    keyCheck(event){
        if(event.key === 'Enter'){
            this.submit(event);
        }
    }

    pwChange(event){
        this.password = event.target.value;
    }

    emailChange(event){
        this.email = event.target.value;
    }

    valid(data){
        if(data.email && data.password){
            if(data.email !== undefined && data.email !== ''){
                if(data.password !== undefined && data.password !== ''){
                    return true;
                }
            }
        }
        return false;
    }
}
export default withRouter(LoginModal);
