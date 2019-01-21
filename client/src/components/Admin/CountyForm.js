//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from "../../services/CountyService";
import LocationService from "../../services/LocationService";
import RegionService from "../../services/RegionService";

class CountyForm extends Component{
    county = {};

    render() {
        return(
            <div className={'card'}>
                <div className={'form-group mx-3'}>
                    <h1>Registrer fylke</h1>
                    <div className={'d-inline'}>
                        <label htmlFor={'county_name'} className={'form-label'}>Fylkesnavn</label>
                        <input onKeyDown={(event) => this.county_name_change(event)} className={'form-control'} type="text" id={'county_name'} name="county_name" placeholder="Fylkesnavn"/>
                    </div>
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

    county_name_change(event) {
        this.county.name = event.target.value;
        /*
        console.log(event.key);
        if(event.key === 'Enter'){
            this.searchLoc();
        }
        */
    }

    submit() {
        console.log('New County:', this.county);
        let county_name = document.querySelector('#county_name').value;
        if(county_name !== undefined && county_name !== null && county_name !== ""){
            let countyService = new CountyService();
            countyService.createCounty({name: county_name})
                .then(res => {
                    document.querySelector('#county_name').value = "";
                    this.county = {};
                    console.log(res);
                    this.props.onCountyCreated();
                })
                .catch((error: Error) => console.error(error));
        } else {
            alert('Fylket trenger navn');
        }
    }
}
export default CountyForm;