import * as React from 'react';
import {Component} from "react-simplified";
import LocationService from "../services/LocationService";
import CountyService from "../services/CountyService";
import RegionService from "../services/RegionService";
import Notify from './Notify.js';

class NoLocationPage extends Component {
    location = null;
    counties = [];
    regions = [];
    region_id = null;

    render() {
        console.log('Rendering');
        return(
            <div className={'no-page'}>
                <h1>Vi finner ingen saker til deg...</h1>
                <div>
                    <p>Det ser ikke ut til at vi klarer å finne noen saker registrert i kommunen du er i.<br/>
                        Dette kan være grunnet i at vi ikke klarer å finne din riktige posisjon.<br/>
                        Dette kan typisk skje dersom du har valgt å blokkere lokasjonstilgang i nettleseren,<br/>
                        eller om du benytter deg av VPN eller en plugin i nettleseren for å blokkere reklame (Adblock, Ublock, etc.).<br/>
                        Dette er lokasjonen vi finner på deg:
                        {this.location ?
                            <strong> {this.location.city + " " + this.location.region + " " + this.location.country}</strong>
                            :<strong> Ingen lokasjon funnet</strong> }</p>
                    <p>
                        Dersom dette ikke stemmer, kan du velge riktig fylke og kommune i menyen under.<br/>
                    </p>
                    <div className={'form-group'}>
                        <select id={'county-selector'} onChange={this.countySelected}>
                            <option value={'.null'} disabled>Velg fylke</option>
                            {this.counties.map(e => (
                                <option key={e.county_id} value={e.county_id}>
                                    {' '}
                                    {e.name}{' '}
                                </option>
                            ))}
                        </select>
                        <select id={'region-selector'} onChange={this.regionSelected} hidden>
                            <option value={'.null'} disabled>Velg kommune</option>
                            {this.regions.map(e => (
                                <option key={e.region_id} value={e.region_id}>
                                    {' '}
                                    {e.name}{' '}
                                </option>
                            ))}
                        </select>
                        <button className={'btn btn-primary'} onClick={this.submit}>Send</button>
                    </div>
                </div>
            </div>
        );
    }

    mounted(){
        console.log('NoLocPage:', this.props.location);
        let locationService = new LocationService();
        locationService.getLocation()
            .then((location: Location) => {
                console.log('SetState');
                this.location = location;
            })
            .catch((error: Error) => console.error(error));

        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => {
                this.counties = counties;
            })
            .catch((error: Error) => console.error(error));
    }

    countySelected(event){
        event.preventDefault();
        let county_id = event.target.value;
        let regionService = new RegionService();
        regionService.getAllRegionGivenCounty(county_id)
            .then((regions: Region[]) => {
                document.querySelector('#region-selector').hidden = false;
                this.regions = regions;
            })
            .catch((error: Error) => console.error(error));
    }

    regionSelected(event){
        event.preventDefault();
        this.region_id = event.target.value;
    }

    submit(event){
        event.preventDefault();
        if(this.region_id){
            this.props.onSubmit(this.region_id);
        } else {
            Notify.danger('Du må velge både fylke og kommune før du kan sende skjemaet.');
        }
    }
}
export default NoLocationPage;