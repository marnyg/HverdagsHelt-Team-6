import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from "../services/CountyService.js";
import County from '../classes/County.js';
import RegionService from "../services/RegionService";
import Region from '../classes/Region.js';
import UserService from '../services/UserService.js';
import User from '../classes/User.js';


class RegisterModal extends Component {
    counties = [];
    regions = [];

    region_id = null;


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
                        <select onChange={this.countyListener} className={'form-control mb-3'} id={'countySelector'}>
                            <option selected disabled>
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
                            className={'form-control mb-3'}
                            id={'regionSelector'}
                            onChange={this.regionListener}
                            defaultValue={'Velg kommune'}
                            hidden
                        >
                            <option selected disabled>
                                Velg kommune
                            </option>
                            {this.regions.map(e => (
                                <option key={e.region_id} value={e.region_id}>
                                    {' '}
                                    {e.name}{' '}
                                </option>
                            ))}
                        </select>
                        <input type="text" name="phone" placeholder="Telefonnummer" onChange={(event) => {this.phone = event.target.value}}/>
                        <input name="login" className="btn btn-primary" value="Register" onChange={this.submit} onClick={this.submit}/>
                    </div>
                </div>
            </div>
        );
    }

    mounted(){
        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => this.counties = counties)
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

    regionListener(event){
        console.log('Region selected');
        this.region_id = event.target.options[event.target.selectedIndex].value;
    }

    submit(event){
        //user_id, role_id, region_id, firstname, lastname, tlf, email, hash_password, salt){
        let user = new User(null, null, Number(this.region_id), this.fn, this.ln, Number(this.phone), this.email, this.password1);

        if(this.notBlank(user) && this.validPW(this.password1, this.password2)){
            // All required fields have been filled
            if(this.validPW(this.password1, this.password2)){
                if(this.validEmail(this.email)){
                    let userService = new UserService();

                    userService.createUser(user)
                        .then((user_out: User) => {
                            //email: string, password: string
                            console.log('Registered');
                            userService.login(this.email, this.password1)
                                .then(res => {
                                    $('#register-modal').modal('hide');
                                    this.props.onLogin();
                                })
                                .catch((error: Error) => console.error(error));
                        })
                        .catch((error: Error) => {console.error(error)});
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
        return true;
        //let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //return re.test(email);
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
