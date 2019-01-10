import * as React from 'react';
import { Component } from 'react-simplified';

class LoginModal extends Component {
    constructor(){
        super();
        this.submit = this.submit.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.pwChange = this.pwChange.bind(this);
    }
    render() {
        return (
            <div className="modal fade" id="login-modal" tabIndex="-1" role="dialog"
                 aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="loginmodal-container modal-content">
                        <h1>Logg inn</h1><br/>
                        <input type="text" name="user" placeholder="Epost" onChange={this.emailChange}></input>
                        <input type="password" name="pass" placeholder="Passord" onChange={this.pwChange}></input>
                        <input name="login" className="btn btn-primary" value="Login" onChange={this.submit} onClick={this.submit}></input>
                        <div className="login-help">
                            <a href="#">Glemt passordet ditt?</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    submit(event){
        console.log("Submitting login: ", this.email, this.password);
        let data = {
            email: this.email,
            password: this.password
        };

        /*

        if(this.valid(data)){
            let userService = new UserService();

            userService.login(data)
                .then((user: User) => {
                    //document.getElementsByClassName("loading")[0].style.display = "none";
                    localStorage.setItem('token': user.token);
                })
                .catch((error: Error) => console.error(error.message));
        } else {
            alert("Not valid data. Try again");
        }
        */
    }

    pwChange(event){
        this.password = event.target.value;
        console.log("PW changed");
    }

    emailChange(event){
        this.email = event.target.value;
        console.log("Email changed");
    }

    valid(data){
        return true;
    }
}
export default LoginModal;
