import * as React from 'react';
import { Component } from 'react-simplified';
import { withRouter } from 'react-router-dom';


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
                        <input type="text" name="user" placeholder="Epost" onKeyPress={this.keyCheck} onChange={this.emailChange}></input>
                        <input type="password" name="pass" placeholder="Passord" onKeyPress={this.keyCheck} onChange={this.pwChange}></input>
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
        //window.location = '/';
        this.props.onLogin();
        $('#login-modal').modal('hide');

        /*

        if(this.valid(data)){
            let userService = new UserService();
            userService.login(data)
                .then((user: User) => {
                    //document.getElementsByClassName("loading")[0].style.display = "none";
                    //localStorage.setItem('token': user.token); Mulig UserService ordner denne?
                    this.props.history.push('/');
                })
                .catch((error: Error) => console.error(error.message));
        } else {
            alert("Not valid data. Try again");
        }
        */
    }

    keyCheck(event){
        console.log(event.key);
        if(event.key === 'Enter'){
            console.log('Key was enter');
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
