import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from "../services/CountyService.js";
import County from '../classes/County.js';
import RegionService from "../services/RegionService";
import Region from '../classes/Region.js';
import UserService from '../services/UserService.js';
import User from '../classes/User.js';
import Alert from './Alert.js';


class RegisterModal extends Component {
    _isMounted = false; // Used to not update state (promise resolve) when component has unmounted
    counties = [];
    regions = [];
    validemail = true;
    validpasswords = false;
    region_id = null;

    emailPattern = "^[\wæøåÆØÅ]+([.]{1[\wæøåÆØÅ]+)*@[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ])*"
    regexPassword = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
    regexNumber = "^[\d]{8}"
    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this.notBlank = this.notBlank.bind(this);
    }
    getEmailStatus() {
        if (this.email === undefined || this.email === null) {
            // email is good
            return true;
        } else {
            // email might be bad
            if (this.email === "") {
                return true;
            } else if (this.validate_email(this.email)) {
                // Email is good
                return true;
            } else {
                // Email is definetly bad
                return false;
            }
        }
    }

    render() {
        return (
            <div className="modal fade" id="register-modal" tabIndex="-1" role="dialog"
                aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="registermodal-container modal-content">
                        <h1>Lag ny bruker</h1><br />
                        {this.error}
                        <form ref="form" className={'form-group'}>
                            <input className={"form-control"} pattern={this.emailPattern} type="email" required name="emails" id={'inputPassword'} placeholder="Epost" />
                            <input type="password" ref="pass1" pattern={this.regexPassword} required placeholder="Passord" />

                            <input type="password" ref="pass2" required placeholder="Gjenta passord" />
                            <input type="text" required name="firstname" placeholder="Fornavn" />
                            <input type="text" required name="lastname" placeholder="Etternavn" />
                            <input type="text" required name="adress" placeholder="Adresse" onChange={(event) => { this.address = event.target.value }} />
                            <input type="text" required name="zip" placeholder="Postnummer" onChange={(event) => { this.zip = event.target.value }} />
                            <select defaultValue={''} required onChange={this.countyListener} className={'form-control mb-3'} id={'countySelector'}>
                                <option value={''} >
                                    Velg fylke
                            </option>
                                {this.counties.map(e => (
                                    <option key={e.county_id} value={e.county_id}>
                                        {' '}
                                        {e.name}{' '}
                                    </option>
                                ))}
                            </select>
                            <select
                                required
                                className={'form-control mb-3'}
                                id={'regionSelector'}
                                onChange={this.regionListener}
                                defaultValue={''}
                                hidden
                            >
                                <option value={''} disabled>
                                    Velg kommune
                            </option>
                                {this.regions.map(e => (
                                    <option key={e.region_id} value={e.region_id}>
                                        {' '}
                                        {e.name}{' '}
                                    </option>
                                ))}
                            </select>
                            <input pattern={this.regexNumber} type="tel" required placeholder="Telefonnummer" />
                            <input name="login" className="btn btn-primary" value="Register" onChange={this.submit} onClick={this.submit} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    mounted() {
        this._isMounted = true;
        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => {
                if (this._isMounted) {
                    this.counties = counties;
                }
            })
            .catch((error: Error) => console.error(error));
    }


    countyListener(event) {
        let county = event.target.options[event.target.selectedIndex];
        console.log('County selected:', county.value);
        let regionService = new RegionService();
        regionService.getAllRegionGivenCounty(county.value)
            .then((regions: Region[]) => {
                document.getElementById('regionSelector').hidden = false;

                this.regions = regions
            })
            .catch((error: Error) => console.error(error));
    }

    regionListener(event) {
        console.log('Region selected');
        this.region_id = event.target.options[event.target.selectedIndex].value;
    }

    submit(event) {
        console.log('Is ' + this.email + ' a valid email?: ', this.validate_email(this.email));
        //user_id, role_id, region_id, firstname, lastname, tlf, email, hash_password, salt){
        if (this.refs.form.checkValidity()) {
            console.log("true");

        } else {

            this.refs.form.reportValidity()
            this.refs.pass1.setCustomValidity("")
            console.log("nottrue");
            console.log(this.refs.pass1.value);
            console.log(this.refs.pass1);
            console.log(this.refs.pass1.inv);

        }

        let user = new User(null, null, Number(this.region_id), this.fn, this.ln, Number(this.phone), this.email, this.password1);

        // if (this.notBlank(user)) {
        //     // All required fields have been filled
        //     if (this.validate_passwords(this.password1, this.password2)) {
        //         if (this.validate_email(this.email)) {
        //             let userService = new UserService();

        //             userService.createUser(user)
        //                 .then((user_out: User) => {
        //                     //email: string, password: string
        //                     console.log('Registered');
        //                     userService.login(this.email, this.password1)
        //                         .then(res => {
        //                             $('#register-modal').modal('hide');
        //                             this.props.onLogin();
        //                         })
        //                         .catch((error: Error) => console.error(error));
        //                 })
        //                 .catch((error: Error) => { console.error(error) });
        //         } else {
        //             alert('Epostadressen er ikke gyldig');
        //         }
        //     } else {
        //         alert('Passordene er ikke like')
        //     }
        // } else {
        //     // One or more required fields have not been filled
        //     alert('Epostadressen er ikke gyldig');
        // }
    }

    validate_passwords(pw1, pw2) {
        if (pw1 !== pw2) {
            return false;
        } else {
            return true;
        }
    }

    validate_email(email) {
        //console.log(re + '.test(' + email + ') === ' + re.test(email));
        // return re.test(email);
    }

    notBlank(data) {
        for (var prop in data) {
            if (data[prop] === undefined || data[prop] === '') {
                return false;
            }
        }
        return true
    }
}
export default RegisterModal;
