import * as React from 'react';
import { Component } from 'react-simplified';
import LocationService from '../services/LocationService';
import CountyService from '../services/CountyService';
import RegionService from '../services/RegionService';
import Notify from './Notify.js';
import Alert from './Alert.js';

/**
 * General region list selection component. Enables user to choose regions by first selecting county and then
 * selecting a region in the previously selected county.
 */
class RegionSelect extends Component {
  regions = [];
  counties = [];
  error = null;

  /**
   * Generates HTML code
   * @returns {*} HTML Element with sub-elements
   */
  render() {
    return (
      <div className={this.props.className}>
        {this.error}
        <form className={this.props.classNameChild}>
          <select
            className={'form-control ' + this.props.elementsMargin}
            id={'county-selector' + this.props.selector_id}
            onChange={this.countySelected}
            defaultValue={'.null'}
          >
            <option value={'.null'} disabled>
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
            className={'form-control ' + this.props.elementsMargin}
            id={'region-selector' + this.props.selector_id}
            onChange={this.regionSelected}
            defaultValue={'.null'}
          >
            <option value={'.null'} disabled>
              Velg kommune
            </option>
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
          {this.props.clearButton}
        </form>
      </div>
    );
  }

  /**
   * When component mounts: Fetches counties from database.
   */
  mounted() {
    let countyService = new CountyService();
    countyService
      .getAllCounties()
      .then((counties: County[]) => {
        this.counties = counties;
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * Listener for whenever county list is changed. Initiates fetching logic for fetching municipalities in
   * selected county.
   * @param event
   */
  countySelected(event) {
    event.preventDefault();
    let county_id = event.target.value;
    let regionService = new RegionService();
    regionService
      .getAllRegionGivenCounty(county_id)
      .then((regions: Region[]) => {
        document.querySelector('#region-selector' + this.props.selector_id).hidden = false;
        this.regions = regions;
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * Set this components ragion_id variable to the calling HTML element's value.
   * @param event Source event generated by the HTML Element that called this function.
   */
  regionSelected(event) {
    event.preventDefault();
    this.region_id = event.target.value;
  }

  /**
   * Validates this components region id and sends the parent component the selected region id.
   * @param event Source event generated by the HTML Element that called this function.
   */
  submit(event) {
    event.preventDefault();
    if (this.region_id) {
      if (this.props.selector_id === 'mobile') {
        document.querySelector('#county-selector' + this.props.selector_id).hidden = false;
        document.querySelector('#region-selector' + this.props.selector_id).hidden = true;
      }
      this.regions = [];
      document.querySelector('#county-selector' + this.props.selector_id).selectedIndex = 0;
      document.querySelector('#region-selector' + this.props.selector_id).selectedIndex = 0;
      this.props.onSubmit(this.region_id);
    } else {
      this.error = <Alert type="danger" text="Du må velge både fylke og kommune før du kan sende skjemaet." />;
      /*Notify.danger('Du må velge både fylke og kommune før du kan sende skjemaet.');*/
    }
  }
}
export default RegionSelect;
