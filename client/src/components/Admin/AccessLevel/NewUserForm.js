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

class NewUserForm extends Component{
    regions = [];
    counties = [];
    roles = [];
    render() {
        return(
            <div className={'card px-3 py-3 mb-2'}>
                <button className="btn btn-primary float-right" type="button" data-toggle="collapse" data-target="#admin-user-collapsed-form"
                        aria-expanded="false" aria-controls="admin-user-collapsed-form">
                    <FontAwesomeIcon icon={faCaretDown}/>
                </button>
                <div className={'collapse form-group'} id={'admin-user-collapsed-form'}>
                    <label htmlFor={'admin-user-form-firstname'} className={'mt-2'}>Fornavn:</label>
                    <input className={'form-control'} id={'admin-user-form-firstname'} placeholder={'Fornavn'}/>

                    <label htmlFor={'admin-user-form-lastname'} className={'mt-2'}>Etternavn:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-lastname'}
                           type={'text'}
                           placeholder={'Etternavn'}
                    />

                    <label htmlFor={'admin-user-form-email'} className={'mt-2'}>Epost:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-email'}
                           type={'text'}
                           placeholder={'Epost'}
                    />

                    <label htmlFor={'admin-user-form-password1'} className={'mt-2'}>Passord:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-password1'}
                           type={'text'}
                           placeholder={'Passord'}
                    />

                    <label htmlFor={'admin-user-form-password2'} className={'mt-2'}>Gjenta passord:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-password2'}
                           type={'text'}
                           placeholder={'Gjenta passord'}
                    />

                    <label htmlFor={'admin-user-form-phone'} className={'mt-2'}>Telefon:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-phone'}
                           type={'text'}
                           placeholder={'Telefon'}
                    />

                    <label htmlFor={'admin-user-form-address'} className={'mt-2'}>Adresse:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-address'}
                           type={'text'}
                           placeholder={'Adresse'}
                    />

                    <label htmlFor={'admin-user-form-zip'} className={'mt-2'}>Postnummer:</label>
                    <input className={'form-control'}
                           id={'admin-user-form-zip'}
                           type={'text'}
                           placeholder={'Postnummer'}
                    />

                    <select className={'form-control mt-3'} id={'admin-user-form-county-selector'} onChange={this.countySelected}
                            defaultValue={'.null'}>
                        <option value={'.null'} disabled>Velg fylke</option>
                        {this.counties.map(e => (
                            <option key={e.county_id} value={e.county_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                    <select className={'form-control mt-3'} id={'admin-user-form-region-selector'} onChange={this.regionSelected}
                            defaultValue={'.null'}
                            hidden
                    >
                        <option value={'.null'} disabled>Velg kommune</option>
                        {this.regions.map(e => (
                            <option key={e.region_id} value={e.region_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>

                    <select className={'form-control mt-3'} id={'admin-user-form-role-selector'} onChange={() => console.log('role selected')}
                            defaultValue={'.null'}>
                        <option value={'.null'} disabled>Velg rolle</option>
                        {this.roles.map(e => (
                            <option key={e.role_id} value={e.role_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                    <button className={'btn btn-primary w-100 mt-3'} onClick={(event) => this.submit()}>
                        Registrer bruker
                    </button>
                </div>
            </div>
        );
    }

    submit() {
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
            })
            .catch((error: Error) => console.error(error));
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

        console.log('');

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