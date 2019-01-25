import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from "../services/CountyService.js";
import County from '../classes/County.js';
import RegionService from "../services/RegionService";
import Region from '../classes/Region.js';
import UserService from '../services/UserService.js';
import User from '../classes/User.js';
import Alert from './Alert.js';
import ToolService from '../services/ToolService';

class RegisterModal extends Component {
    _isMounted = false; // Used to not update state (promise resolve) when component has unmounted
    counties = [];
    regions = [];
    validemail = true;
    validpasswords = false;
    region_id = null;
    error = null;

    constructor() {
        super();
        this.submit = this.submit.bind(this);
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
        console.log('Registermodal rendering');
        return (
            <div className="modal fade" id="register-modal" tabIndex="-1" role="dialog"
                aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="registermodal-container modal-content">
                        <h1>Lag ny bruker</h1><br />
                        {this.error}
                        <form ref="form" className={'form-group'}>
                            <small className="text-muted">Epost på formen bruker@adresse.no</small>
                            <input ref="email" className={"form-control my-2 py-3"}
                                pattern="^[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)*@[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)+$"
                                type="email" required name="emails" id={'inputPassword'} placeholder="Epost" />

                            <small className="text-muted">Passord må inneholde store og må bokstaver pluss tall</small>
                            <input type="password" ref="pass1"
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" required placeholder="Passord" />

                            <input type="password" ref="pass2" required placeholder="Gjenta passord" />
                            <input type="text" ref="fn" required name="firstname" placeholder="Fornavn" />
                            <input type="text" ref="ln" required name="lastname" placeholder="Etternavn" />
                            {/* <input type="text" ref="addr" required name="adress" placeholder="Adresse" /> */}
                            {/* <input type="text" ref="zip" required name="zip" placeholder="Postnummer" /> */}
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
                            <small className="text-muted">Tlf må inneholde 8 tall</small>
                            <input ref="tlf" className={"form-control my-2 py-3"} pattern="^[\d]{8}" type="tel" required placeholder="Telefonnummer" />
                            <input name="login" className="btn btn-primary w-100" value="Register" onChange={this.submit} onClick={this.submit} />
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
        console.log('Is ' + this.email + ' a valid email?: ');
        //user_id, role_id, region_id, firstname, lastname, tlf, email, hash_password, salt){
        if (this.refs.form.checkValidity() && this.refs.pass1.value === this.refs.pass2.value) {
            console.log("true");
            this.refs.pass2.setCustomValidity("")


            let user = new User(null, null, Number(this.region_id),
                this.refs.fn.value, this.refs.ln.value, Number(this.refs.tlf.value),
                this.refs.email.value, this.refs.pass1.value);
            console.log(user);


            let userService = new UserService();

            userService.createUser(user)
                .then((user_out: User) => {
                    //email: string, password: string
                    console.log('Registered');
                    userService.login(this.props.email.value, this.props.pass1.value)
                        .then(res => {
                            $('#register-modal').modal('hide');
                            this.props.onLogin();
                        })
                        .catch((error: Error) => console.error(error));
                })
                .catch((error: Error) => {
                    console.log('FVEWEWNIOVMEWIOFMEWO');
                    this.error = ToolService.getUserUpdateErrorAlert(error, () => {
                        console.log('Alert closing');
                        this.error = null
                    });
                });


        } else {
            if (!(this.refs.pass1.value === this.refs.pass2.value)) {
                this.refs.pass2.setCustomValidity("Passord må vere identisk")
            } else {
                this.refs.pass2.setCustomValidity("")
            }
            this.refs.form.reportValidity()

        }


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

}
export default RegisterModal;
