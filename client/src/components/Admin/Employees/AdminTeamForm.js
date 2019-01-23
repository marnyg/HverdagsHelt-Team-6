//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import User from "../../../classes/User";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import UserService from "../../../services/UserService";
import ToolService from '../../../services/ToolService';

const region_employee_id = 2;

class AdminTeamForm extends Component {
    password_error = false;

    render() {
        if(this.props.region === undefined || this.props.region === null){
            return(
                <div className={'card px-3 py-3 mb-2'}>
                    <div className={''}>
                        <h2>Velg en kommune fra listen</h2>
                    </div>
                    <div className={'text-muted'}>
                        <strong>Kommune: </strong>
                    </div>
                </div>
            );
        }
        //User(null, null, Number(this.region_id), this.fn, this.ln, Number(this.phone), this.email, this.password1);
        return(
            <div className={'card px-3 py-3 mb-2'}>
                <div className={''}>
                    <button className="btn btn-primary float-right" type="button" data-toggle="collapse" data-target="#admin-collapsed-form"
                            aria-expanded="false" aria-controls="admin-collapsed-form">
                        <FontAwesomeIcon icon={faCaretDown}/>
                    </button>
                    <h2>Registrer ny ansatt</h2>
                </div>
                <div className={'text-muted'}>
                    <strong>Kommune: </strong>
                    {this.props.region.name}
                </div>
                <div className={'collapse form-group'} id={'admin-collapsed-form'}>
                    <label htmlFor={'firstname'} className={'mt-2'}>Fornavn</label>
                    <input className={'form-control'} type={'text'} id={'firstname'} placeholder={'Fornavn'}/>

                    <label htmlFor={'lastname'} className={'mt-2'}>Etternavn</label>
                    <input className={'form-control'} type={'text'} id={'lastname'} placeholder={'Etternavn'}/>

                    <label htmlFor={'email'} className={'mt-2'}>Epost</label>
                    <input className={'form-control'} type={'text'} id={'email'} placeholder={'Epost'}/>

                    <label htmlFor={'phone'} className={'mt-3 mb-0'}>Telefon</label>
                    <br/>
                    <small className={'text-muted ml-3'}>Minimum 8 tall, uten landskode</small>
                    <input className={'form-control'} type={'text'} id={'phone'} placeholder={'Telefon'}/>

                    <label htmlFor={'password1'} className={'mt-3 mb-0'}>Passord</label>
                    <br/>
                    <small className={'text-muted ml-3'}>Må inneholde store og små bokstaver og tall</small>
                    <input className={'form-control'} type={'text'} id={'password1'} placeholder={'Passord'}/>

                    <label htmlFor={'password2'} className={'mt-2'}>Gjenta passord</label>
                    <input className={'form-control has-error'} type={'text'} id={'password2'} placeholder={'Gjenta passord'} onChange={(event) => this.checkPW()}/>

                    <button className={'btn btn-primary w-100 mt-2'} onClick={() => this.submit()}>Registrer ansatt</button>
                </div>
            </div>
        );
    }

    submit() {
        let pw1 = document.querySelector('#password1').value;
        let pw2 = document.querySelector('#password2').value;

        let fname = document.querySelector('#firstname').value;
        let lname = document.querySelector('#lastname').value;
        let email = document.querySelector('#email').value;
        let phone = document.querySelector('#phone').value;
        let role_id = ToolService.employee_role_id;
        console.log('Empl role_id:', ToolService.employee_role_id);

        let user = null;
        if(pw1 !== undefined && pw1 !== null && pw1 !== "" && pw2 !== undefined && pw2 !== null && pw2 !== ""){
            if(pw1 === pw2){
                user = {
                    firstname: fname,
                    lastname: lname,
                    email: email,
                    tlf: Number(phone),
                    role_id: role_id,
                    region_id: this.props.region.region_id,
                    password: pw1
                };

                let valid = true;
                for (let param in user) {
                    if(this.notGiven(param)){
                        valid = false;
                        break;
                    }
                }
                if(valid){
                    console.log(user);
                    let userService = new UserService();
                    userService.createEmployee(user)
                        .then(res => {
                            console.log(res);
                            document.querySelector('#password1').value = "";
                            document.querySelector('#password2').value = "";

                            document.querySelector('#firstname').value = "";
                            document.querySelector('#lastname').value = "";
                            document.querySelector('#email').value = "";
                            document.querySelector('#phone').value = null;
                            $('#admin-collapsed-form').collapse('hide');
                            this.props.onUserCreated();
                        })
                        .catch((error: Error) => console.error(error));
                } else {
                    alert('Fyll inn alle feltene for å registrere ny ansatt');
                }
            } else {
                this.password_error = true;
                alert('Passordene er ikke like');
            }
        } else {
            this.password_error = false;
            alert('Passord er ikke gitt');
        }
    }

    notGiven(val) {
        if(val === undefined || val === null || val === ""){
            return true;
        } else {
            return false;
        }
    }

    checkPW(){
        let pw1 = document.querySelector('#password1').value;
        let pw2 = document.querySelector('#password2').value;
        if(pw1 !== undefined && pw1 !== null && pw1 !== "" && pw2 !== undefined && pw2 !== null && pw2 !== ""){
            if(pw1 === pw2){
                this.password_error = false;
            } else {
                this.password_error = true;
            }
        } else {
            this.password_error = false;
        }
    }
}
export default AdminTeamForm;