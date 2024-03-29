// @flow
import * as React from 'react';
import {Component} from "react-simplified";
import LocationService from "../services/LocationService";
import CountyService from "../services/CountyService";
import RegionService from "../services/RegionService";
import Notify from './Notify.js';
import RegionSelect from "./RegionSelect";

/**
 * Components informing the user that we were unable to locate his/her location using automatic positioning.
 * Prompts user for input to determin user's location.
 */
class NoLocationPage extends Component {
    location = null;
    counties = [];
    regions = [];
    region_id = null;
  
  /**
   * Generates HTML code
   * @returns {*} HTML Element with sub-elements
   */
    render() {
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
                    <RegionSelect
                        className={"region-select"}
                        onSubmit={(region_id) => this.props.onSubmit(region_id)}
                        elementsMargin={'mb-3'}
                    />
                </div>
            </div>
        );
    }
  
  /**
   * When coponent mounts: Fetch current location and set the component object state location.
   */
  mounted(){
        let locationService = new LocationService();
        locationService.getLocation()
            .then((location: Location) => {
                this.location = location;
            })
            .catch((error: Error) => console.error(error));
    }
}
export default NoLocationPage;