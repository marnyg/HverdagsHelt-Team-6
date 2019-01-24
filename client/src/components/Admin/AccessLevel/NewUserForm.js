//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RegionService from "../../../services/RegionService";
import CountyService from "../../../services/CountyService";
import RoleService from "../../../services/RoleService";
import Region from "../../../classes/Region";
import UserService from "../../../services/UserService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner'; //https://www.npmjs.com/package/react-loader-spinner
import Alert from '../../Alert';

class NewUserForm extends Component{
    regions = [];
    counties = [];
    roles = [];
    error = null;
    render() {
        return(
            <div className={'card px-3 py-3 mb-2'}>
                {this.error}
                <button className="btn btn-primary float-right" type="button" data-toggle="collapse" data-target="#admin-user-collapsed-form"
                        aria-expanded="false" aria-controls="admin-user-collapsed-form">
                    <FontAwesomeIcon icon={faCaretDown}/>
                </button>
                <form ref={'myform'} className={'collapse form-group'} id={'admin-user-collapsed-form'}>
                    <div>
                        <div className={'d-inline-block mr-3'}>
                            <label htmlFor={'admin-user-form-firstname'} className={'mt-2'}>Fornavn:</label>
                            <input
                                className={'form-control'}
                                id={'admin-user-form-firstname'}
                                name={'firstname'}
                                placeholder={'Fornavn'}
                                type="text"
                                pattern={'^[a-zA-ZæøåÆØÅ\\-\\s]+$'}
                                required/>
                        </div>
                        <div className={'d-inline-block'}>
                            <label htmlFor={'admin-user-form-lastname'} className={'mt-2'}>Etternavn:</label>
                            <input className={'form-control'}
                                   id={'admin-user-form-lastname'}
                                   type={'text'}
                                   placeholder={'Etternavn'}
                                   pattern={'^[a-zA-ZæøåÆØÅ\\-\\s]+$'}
                                   required
                            />
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className={'col-8'}>
                            <label htmlFor={'admin-user-form-email'} className={'mt-2'}>Epost:</label>
                            <input className={'form-control'}
                                   id={'admin-user-form-email'}
                                   type={'email'}
                                   placeholder={'Epost'}
                                   pattern="^[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)*@[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)+$"
                                   required
                            />
                        </div>
                        <div className={'col-4'}>
                            <label htmlFor={'admin-user-form-phone'} className={'mt-2'}>Telefon: </label>
                            <small className={'text-muted'}>8 siffer</small>
                            <input className={'form-control'}
                                   id={'admin-user-form-phone'}
                                   type={'tel'}
                                   placeholder={'Telefon'}
                                   pattern="^[\d]{8}"
                                   required
                            />
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className={'col-8'}>
                            <label htmlFor={'admin-user-form-address'} className={'mt-2'}>Adresse:</label>
                            <input className={'form-control'}
                                   id={'admin-user-form-address'}
                                   type={'text'}
                                   placeholder={'Adresse'}
                                   required
                            />
                        </div>
                        <div className={'col-4'}>
                            <label htmlFor={'admin-user-form-zip'} className={'mt-2'}>Postnummer:</label>
                            <input className={'form-control'}
                                   id={'admin-user-form-zip'}
                                   type={'number'}
                                   pattern={'^[\\d]{4}'}
                                   placeholder={'Postnummer'}
                                   required
                            />
                        </div>
                    </div>

                    <div>
                        <div className={'d-inline-block mr-3'}>
                            <label htmlFor={'admin-user-form-password1'} className={'mt-2'}>Passord: </label>
                            <small className={'text-muted'}> 8 tegn, små og store bokstaver og tall</small>
                            <input className={'form-control'}
                                   id={'admin-user-form-password1'}
                                   type={'text'}
                                   placeholder={'Passord'}
                                   pattern={'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}'}
                                   required
                            />
                        </div>
                        <div className={'d-inline-block'}>
                            <label htmlFor={'admin-user-form-password2'} className={'mt-2'}>Gjenta passord:</label>
                            <input className={'form-control'}
                                   id={'admin-user-form-password2'}
                                   type={'text'}
                                   placeholder={'Gjenta passord'}
                                   pattern={'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'}
                                   required
                            />
                        </div>
                    </div>

                    <select className={'form-control mt-3'} id={'admin-user-form-county-selector'} onChange={this.countySelected}
                            defaultValue={''}
                            required>
                        <option value={''} disabled>Velg fylke</option>
                        {this.counties.map(e => (
                            <option key={e.county_id} value={e.county_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                    <select className={'form-control mt-3'} id={'admin-user-form-region-selector'} onChange={this.regionSelected}
                            defaultValue={''}
                            hidden
                            required
                    >
                        <option value={''} disabled>Velg kommune</option>
                        {this.regions.map(e => (
                            <option key={e.region_id} value={e.region_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>

                    <select className={'form-control mt-3'} id={'admin-user-form-role-selector'} onChange={() => console.log('role selected')}
                            defaultValue={''}
                            required>
                        <option value={''} disabled>Velg rolle</option>
                        {this.roles.map(e => (
                            <option key={e.role_id} value={e.role_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                    <button className={'btn btn-primary w-100 mt-3'} onClick={(event) => this.submit(event)}>
                        Registrer bruker
                    </button>
                </form>
            </div>
        );
    }

    submit(event) {
        event.preventDefault();
        if(this.refs.myform.checkValidity()) {
            $("#spinner").show();
            let role_selector = document.querySelector('#admin-user-form-role-selector');
            let region_selector = document.querySelector('#admin-user-form-region-selector');

            let pw1 = document.querySelector('#admin-user-form-password1').value;
            let pw2 = document.querySelector('#admin-user-form-password2').value;

            let user = {
                firstname: document.querySelector('#admin-user-form-firstname').value,
                lastname: document.querySelector('#admin-user-form-lastname').value,
                email: document.querySelector('#admin-user-form-email').value,
                password: document.querySelector('#admin-user-form-password1').value,
                tlf: Number(document.querySelector('#admin-user-form-phone').value),
                role_id: Number(role_selector[role_selector.selectedIndex].value),
                region_id: Number(region_selector[region_selector.selectedIndex].value)
            };

            console.log(user);
            let userService = new UserService();
            userService.createUser(user)
                .then(res => {
                    console.log(res);
                    $('#admin-user-collapsed-form').collapse('toggle');
                    $("#spinner").hide();
                })
                .catch((error: Error) => {
                    console.log('THIS IS THE ERROR', error.response.status);
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
            this.refs.myform.reportValidity();
        }
    }

    mounted() {
        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => {
                this.counties = counties;
            })
            .catch((error: Error) => console.error(error));

        let roleService = new RoleService();
        roleService.getAllRoles()
            .then((roles: Role[]) => {
                console.log(roles);
                this.roles = roles;
            })
            .catch((error: Error) => console.error(error));
    }

    countySelected() {
        document.querySelector('#admin-user-form-region-selector').hidden = false;
        let county_selector = document.querySelector('#admin-user-form-county-selector');
        let county_id = county_selector[county_selector.selectedIndex].value;

        let regionService = new RegionService();
        regionService.getAllRegionGivenCounty(county_id)
            .then((regions: Region[]) => {
                this.regions = regions;
            })
            .catch((error: Error) => console.error(error));
    }

    regionSelected() {

    }
}
export default NewUserForm;