//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from "../../../services/CountyService";
import LocationService from "../../../services/LocationService";
import RegionService from "../../../services/RegionService";

class RegionForm extends Component{
    counties = [];

    region = {};

    render() {
        return(
            <div className={'card'}>
                <div className={'form-group mx-3'}>
                    <h1>Registrer kommune</h1>
                    <div className={'d-inline'}>
                        <label htmlFor={'region_name'} className={'form-label'}>Kommunenavn</label>
                        <div className={'input-group my-2'}>
                            <input onKeyDown={(event) => this.region_name_change(event)} className={'form-control'} type="text" id={'region_name'} name="region_name" placeholder="Kommunenavn"/>
                            <span className="input-group-btn ml-2">
                                <button type={'button'} className={'btn btn-primary'} onClick={(event) => this.searchLoc()}>Søk</button>
                            </span>
                        </div>
                    </div>
                    <h2>Lokasjon</h2>
                    <div className={'form-check'}>
                        <input
                            onChange={(event) => this.checkListener(true)}
                            id={'radio1'}
                            className={'form-check-input'}
                            type="radio"
                            name="pos"
                            value="auto"
                            defaultChecked
                        />
                        <label htmlFor={'radio1'} className={'form-check-label'}>
                            Hent lokasjon automatisk fra kommunenavn
                        </label>
                    </div>
                    <div className={'form-check mb-2'}>
                        <input
                            onChange={(event) => this.checkListener(false)}
                            id={'radio2'}
                            className={'form-check-input'}
                            type="radio"
                            name="pos"
                            value="mapmarker"
                        />
                        <label htmlFor={'radio2'} className={'form-check-label'}>
                            Skriv inn bredde- og lengdegrad
                        </label>
                    </div>
                    <label htmlFor={'lat'}>Breddegrad</label>
                    <input className={'form-control my-2'} type={'number'} id={'lat'} name={'lat'} placeholder="Breddegrad" onChange={(event) => this.latChange(event)} disabled/>
                    <label htmlFor={'lat'}>Lengdegrad</label>
                    <input className={'form-control my-2'} type={'number'} id={'lon'} name={'lon'} placeholder="Lengdegrad" onChange={(event) => this.lonChange(event)} disabled/>
                    <label htmlFor={'county'}>Velg fylke</label>
                    <select
                        onChange={(event) => this.county_selected(event)}
                        defaultValue={'.null'}
                        className={'form-control'}
                        id={'county'}
                        required
                    >
                        <option value={'.null'} disabled>
                            Fylke
                        </option>
                        {this.props.counties.map(e => (
                            <option key={e.county_id} value={e.county_id}>
                                {' '}
                                {e.name}
                                {' '}
                            </option>
                        ))}
                    </select>
                    <button onClick={(event) => this.submit()} className={'btn btn-primary my-3 w-100'}>Send</button>
                </div>
            </div>
        );
    }

    checkListener(find_loc_auto){
        console.log('changed');
        let lat = document.querySelector('#lat');
        let lon = document.querySelector('#lon');

        if(find_loc_auto === true){
            lat.disabled = true;
            lon.disabled = true;
        } else {
            lat.disabled = false;
            lon.disabled = false;
        }
    }

    region_name_change(event) {
        this.region.name = event.target.value;
        console.log(event.key);
        if(event.key === 'Enter'){
            this.searchLoc();
        }
    }

    searchLoc(){
        console.log('REgion name change', event.target.value);
        let lat = document.querySelector('#lat');
        let lon = document.querySelector('#lon');

        if(lat.disabled || lon.disabled){
            // Find loc auto
            let locationService = new LocationService();
            locationService.geocodeCityCounty(event.target.value, '')
                .then(res => {
                    console.log(res);
                    if(res.results.length > 0){

                        lat.value = res.results[0].geometry.location.lat;
                        lon.value = res.results[0].geometry.location.lng;
                        this.region.lat = res.results[0].geometry.location.lat;
                        this.region.lon = res.results[0].geometry.location.lng;
                    }
                })
                .catch((error: Error) => console.error(error));
        }
    }

    county_selected(event) {
        console.log(event.target.value);
        this.region.county_id = Number(event.target.value);
    }

    submit() {
        console.log('New Region:', this.region);

        let regionService = new RegionService();
        regionService.createRegion(this.region)
            .then(res => {
                document.querySelector('#region_name').value = "";
                document.querySelector('#lat').value = null;
                document.querySelector('#lon').value = null;
                document.querySelector('#county').selectedIndex = 0;
            })
            .catch((error: Error) => console.error(error));
    }

    latChange(event) {
        this.region.lat = Number(event.target.value);
    }

    lonChange(event) {
        this.region.lon = Number(event.target.value);
    }
}
export default RegionForm;