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

/**
 * This component is representing the the register new user form.
 */

class RegisterModal extends Component {
    _isMounted = false; // Used to not update state (promise resolve) when component has unmounted
    counties = [];  //Array of counties
    regions = [];   //Array of regions
    validemail = true;
    validpasswords = false;
    region_id = null;   //
    error = null;   //Used to display the error messages

    constructor() {
        super();
        this.submit = this.submit.bind(this);   //Function to submit the the registration
    }
    /**
     * Function to check if exists.
     * @returns {boolean}   Returns true / false depending on the given email's status.
     */
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
    /**
     * Rendering the register new user form.
     * @returns {*} HTML element that represents the register new user form.
     */
    render() {
        t         return (
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

                            <small className="text-muted">Passord må inneholde store og små bokstaver pluss tall, og ha minst 8 tegn </small>
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
    /**
     * Function used to unmount component.
     */
    componentWillUnmount() {
        this._isMounted = false;
    }
    /**
     * Getting all counties registered in the database.
     */
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

    /**
     * Function used to get county from dropdown menu in register new user form.
     * @param event Triggered by selected value in dropdown menu.
     */
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

    /**
     * Function for setting region-id from dropdown menu in register new user form.
     * @param event Triggered by selected value in dropdown menu.
     */

    regionListener(event) {
        console.log('Region selected');
        this.region_id = event.target.options[event.target.selectedIndex].value;
    }

    /**
     * Function for submitting the register user process.
     * @param event Triggered by a button-click.
     */

    submit(event) {
        console.log('Is ' + this.email + ' a valid email?: ');
        //user_id, role_id, region_id, firstname, lastname, tlf, email, hash_password, salt){
        if (this.refs.form.checkValidity() && this.refs.pass1.value === this.refs.pass2.value) {
            console.log("true");
            this.refs.pass2.setCustomValidity("");


            let user = new User(null, null, Number(this.region_id),
                this.refs.fn.value, this.refs.ln.value, Number(this.refs.tlf.value),
                this.refs.email.value, this.refs.pass1.value);
            let userService = new UserService();

            userService.createUser(user)
                .then((user_out: User) => {
                    //email: string, password: string
                    userService.login(this.refs.email.value, this.refs.pass1.value)
                        .then(res => {
                            $('#register-modal').modal('hide');
                            this.props.onLogin();
                        })
                        .catch((error: Error) => console.error(error));
                })
                .catch((error: Error) => {
                    console.error(error);
                    this.error = ToolService.getUserUpdateErrorAlert(error, () => {
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
    }
}
export default RegisterModal;
