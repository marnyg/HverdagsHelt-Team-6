//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from '../../../services/CountyService';
import LocationService from '../../../services/LocationService';
import RegionService from '../../../services/RegionService';

/**
 * Form for registering regions.
 */

class RegionForm extends Component {
  counties = [];

  region = {};

  /**
   * Generates HTML code.
   * @returns {*} HTML Element with sub-elements.
   */
  render() {
    return (
      <div className={'card'}>
        <div className={'form-group mx-3'}>
          <h1>Registrer kommune</h1>
          <div className={'d-inline'}>
            <label htmlFor={'region_name'} className={'form-label'}>
              Kommunenavn
            </label>
            <div className={'input-group my-2'}>
              <input
                onKeyDown={event => this.region_name_change(event)}
                className={'form-control'}
                type="text"
                id={'region_name'}
                name="region_name"
                placeholder="Kommunenavn"
              />
              <span className="input-group-btn ml-2">
                <button type={'button'} className={'btn btn-primary'} onClick={event => this.searchLoc()}>
                  Søk
                </button>
              </span>
            </div>
          </div>
          <h2>Lokasjon</h2>
          <div className={'form-check'}>
            <input
              onChange={event => this.checkListener(true)}
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
              onChange={event => this.checkListener(false)}
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
          <input
            className={'form-control my-2'}
            type={'number'}
            id={'lat'}
            name={'lat'}
            placeholder="Breddegrad"
            onChange={event => this.latChange(event)}
            disabled
          />
          <label htmlFor={'lat'}>Lengdegrad</label>
          <input
            className={'form-control my-2'}
            type={'number'}
            id={'lon'}
            name={'lon'}
            placeholder="Lengdegrad"
            onChange={event => this.lonChange(event)}
            disabled
          />
          <label htmlFor={'county'}>Velg fylke</label>
          <select
            onChange={event => this.county_selected(event)}
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
                {e.name}{' '}
              </option>
            ))}
          </select>
          <button onClick={event => this.submit()} className={'btn btn-primary my-3 w-100'}>
            Send
          </button>
        </div>
      </div>
    );
  }

  /**
   * Listens for whether or not to use auto positioning or input field for lat lon coordinates.
   * @param find_loc_auto True/false statement for whether or not to display input lat lon fields.
   */
  checkListener(find_loc_auto) {
    console.log('changed');
    let lat = document.querySelector('#lat');
    let lon = document.querySelector('#lon');

    if (find_loc_auto === true) {
      lat.disabled = true;
      lon.disabled = true;
    } else {
      lat.disabled = false;
      lon.disabled = false;
    }
  }

  /**
   * Changes component's region object's name field to match the input fields value.
   * @param event Source event generated by HTML Input element that called this function.
   */
  region_name_change(event) {
    this.region.name = event.target.value;
    console.log(event.key);
    if (event.key === 'Enter') {
      this.searchLoc();
    }
  }

  /**
   * Checks whether or not to use autopositioning.
   * If yes: initiate a LocationService call and receive, if possible, a Location object,
   * and use it's lat lon cordinates as the cointy's lat lon coordinates.
   */
  searchLoc() {
    console.log('Region name change', event.target.value);
    let lat = document.querySelector('#lat');
    let lon = document.querySelector('#lon');

    if (lat.disabled || lon.disabled) {
      // Find loc auto
      let locationService = new LocationService();
      locationService
        .geocodeCityCounty(event.target.value, '')
        .then(res => {
          console.log(res);
          if (res.results.length > 0) {
            lat.value = res.results[0].geometry.location.lat;
            lon.value = res.results[0].geometry.location.lng;
            this.region.lat = res.results[0].geometry.location.lat;
            this.region.lon = res.results[0].geometry.location.lng;
          }
        })
        .catch((error: Error) => console.error(error));
    }
  }

  /**
   * Sets component region object's county id to match the value of the HTML element that called thi function.
   * @param event Source event generated by HTML Element that called this function.
   */
  county_selected(event) {
    console.log(event.target.value);
    this.region.county_id = Number(event.target.value);
  }

  /**
   * Submit form: sends components form object to server.
   */
  submit() {
    console.log('New Region:', this.region);

    let regionService = new RegionService();
    regionService
      .createRegion(this.region)
      .then(res => {
        document.querySelector('#region_name').value = '';
        document.querySelector('#lat').value = null;
        document.querySelector('#lon').value = null;
        document.querySelector('#county').selectedIndex = 0;
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * Changes component's region.lat property to match value of HTML element that called this function.
   * @param event Source event generated by HTML Element that called this function.
   */
  latChange(event) {
    this.region.lat = Number(event.target.value);
  }

  /**
   * Changes component's region.lon property to match value of HTML element that called this function.
   * @param event Source event generated by HTML Element that called this function.
   */
  lonChange(event) {
    this.region.lon = Number(event.target.value);
  }
}
export default RegionForm;
