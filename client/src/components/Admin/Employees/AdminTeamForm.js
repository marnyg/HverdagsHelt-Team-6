//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import User from "../../../classes/User";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import UserService from "../../../services/UserService";
import ToolService from '../../../services/ToolService';
import Alert from "../../Alert";

const region_employee_id = 2;

/**
 * This component is used to create the 'Register new employee' modal.
 * If you are logged in as a admin you will be able to register new employee
 * to the system.
 */

class AdminTeamForm extends Component {
    password_error = false; //Used to determine if password is alike
    error = null;   //Used to display error messages

    /**
     * Rendering the register new employee form with different parameters.
     * @returns {*} HTML elements for the register new employee form.
     */

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
                {this.error}
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
                <form ref={'adminCollapsedForm'}  className={'collapse form-group'} id={'admin-collapsed-form'}>
                    <label htmlFor={'firstname'} className={'mt-2'}>Fornavn</label>
                    <input
                        className={'form-control'}
                        type={'text'}
                        id={'firstname'}
                        placeholder={'Fornavn'}
                        required
                    />

                    <label htmlFor={'lastname'} className={'mt-2'}>Etternavn</label>
                    <input className={'form-control'}
                           type={'text'}
                           id={'lastname'}
                           placeholder={'Etternavn'}
                           required
                    />

                    <label htmlFor={'email'} className={'mt-2'}>Epost</label>
                    <input className={'form-control'}
                           type={'email'}
                           id={'email'}
                           placeholder={'Epost'}
                           required
                    />

                    <label htmlFor={'phone'} className={'mt-3 mb-0'}>Telefon</label>
                    <br/>
                    <small className={'text-muted ml-3'}>Minimum 8 tall, uten landskode</small>
                    <input
                        className={'form-control'}
                        type={'tel'}
                        id={'phone'}
                        placeholder={'Telefon'}
                        required
                    />

                    <label htmlFor={'password1'} className={'mt-3 mb-0'}>Passord</label>
                    <br/>
                    <small className={'text-muted ml-3'}>Må inneholde store og små bokstaver og tall</small>
                    <input
                        className={'form-control'}
                        type={'password'}
                        id={'password1'}
                        placeholder={'Passord'}
                        required
                    />

                    <label htmlFor={'password2'} className={'mt-2'}>Gjenta passord</label>
                    <input
                        className={'form-control has-error'}
                        type={'password'}
                        id={'password2'}
                        placeholder={'Gjenta passord'}
                        onChange={(event) => this.checkPW()}
                        required
                    />

                    <button className={'btn btn-primary w-100 mt-2'} onClick={(event) => this.submit(event)}>Registrer ansatt</button>
                </form>
            </div>
        );
    }

    /**
     * Function that submits the parameters (based on information from
     * register form).
     * @param event Triggered by a button-click.
     */

    submit(event) {
        event.preventDefault();
        let form = this.refs.adminCollapsedForm;
        if(form.checkValidity()) {
            $("#spinner").show();
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
                                $("#spinner").hide();
                                this.props.onUserCreated();
                            })
                            .catch((error: Error) => {
                                $("#spinner").hide();
                                if(error.response) {
                                    if(error.response.status === 409) {
                                        // Epost finnes allerede
                                        this.error = (
                                            <Alert
                                                type={'danger'}
                                                text={'En bruker med denne epostadressen eksisterer allerede.'}
                                                onClose={() => this.error = null}
                                            />
                                        );
                                    } else if (error.response.status === 400) {
                                        // bad request
                                        this.error = (
                                            <Alert
                                                type={'danger'}
                                                text={'Fyll inn alle feltene riktig før du registrerer.'}
                                                onClose={() => this.error = null}
                                            />
                                        );
                                    } else if (error.response.status === 403) {
                                        // not logged in, token expired
                                        this.error = (
                                            <Alert
                                                type={'danger'}
                                                text={'Din økt har utgått, logg ut og inn og prøv igjen.'}
                                                onClose={() => this.error = null}
                                            />
                                        );
                                    } else if (error.response.status === 401) {
                                        // unauthorized
                                        this.error = (
                                            <Alert
                                                type={'danger'}
                                                text={'Du har ikke rettigheter til å utføre denne handlingen.'}
                                                onClose={() => this.error = null}
                                            />
                                        );
                                    } else {
                                        this.error = (
                                            <Alert
                                                type={'danger'}
                                                text={error.message}
                                                onClose={() => this.error = null}
                                            />
                                        );
                                    }
                                } else {
                                    this.error = (
                                        <Alert
                                            type={'danger'}
                                            text={error.message}
                                            onClose={() => this.error = null}
                                        />
                                    );
                                }
                            });
                    } else {
                        $("#spinner").hide();
                        this.error = (
                            <Alert type={'danger'} text={'Passordene er ikke like'} onClose={() => this.error = null}/>
                        );
                    }
                } else {
                    $("#spinner").hide();
                    this.password_error = true;
                    this.error = (
                        <Alert type={'danger'} text={'Passordene er ikke like'} onClose={() => this.error = null}/>
                    );
                }
            } else {
                $("#spinner").hide();
                this.error = (
                    <Alert type={'danger'} text={'Passord er ikke gitt'} onClose={() => this.error = null}/>
                );
            }
        } else {
            form.reportValidity();
        }
    }

    notGiven(val) {
        if(val === undefined || val === null || val === ""){
            return true;
        } else {
            return false;
        }
    }

    /**
     * Function that is checking if password1 and password2 i alike.
     */

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