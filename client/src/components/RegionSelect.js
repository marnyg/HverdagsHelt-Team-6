import * as React from 'react';
import {Component} from "react-simplified";
import LocationService from "../services/LocationService";
import CountyService from "../services/CountyService";
import RegionService from "../services/RegionService";
import Notify from './Notify.js';

class RegionSelect extends Component {
    regions = [];
    counties = [];
    render() {
        return(
            <div className={this.props.className}>
                <form className={this.props.classNameChild}>
                    <select className={'form-control ' + this.props.elementsMargin} id={'county-selector' + this.props.selector_id} onChange={this.countySelected}
                            defaultValue={'.null'}>
                        <option value={'.null'} disabled>Velg fylke</option>
                        {this.counties.map(e => (
                            <option key={e.county_id} value={e.county_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                    <select className={'form-control '+ this.props.elementsMargin} id={'region-selector' + this.props.selector_id} onChange={this.regionSelected}
                            defaultValue={'.null'}>
                        <option value={'.null'} disabled>Velg kommune</option>
                        {this.regions.map(e => (
                            <option key={e.region_id} value={e.region_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                    <button className={'form-control btn btn-primary ' + this.props.elementsMargin} onClick={this.submit}>
                        Filtrer
                    </button>
                </form>
            </div>
        );
    }

    mounted() {
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
                document.querySelector('#region-selector' + this.props.selector_id).hidden = false;
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
            if(this.props.selector_id === 'mobile'){
                document.querySelector('#county-selector' + this.props.selector_id).hidden = false;
                document.querySelector('#region-selector' + this.props.selector_id).hidden = true;
            }
            this.regions = [];
            document.querySelector('#county-selector' + this.props.selector_id).selectedIndex = 0;
            document.querySelector('#region-selector' + this.props.selector_id).selectedIndex = 0;
            this.props.onSubmit(this.region_id);
        } else {
            Notify.danger('Du må velge både fylke og kommune før du kan sende skjemaet.');
        }
    }
}
export default RegionSelect;