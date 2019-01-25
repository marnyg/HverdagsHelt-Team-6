//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from '../../../services/CountyService';
import LocationService from '../../../services/LocationService';
import RegionService from '../../../services/RegionService';

/**
 * Form component for registering counties.
 */
class CountyForm extends Component {
  county = {};

  /**
   * Generates HTML code
   * @returns {*} HTML Element with sub-elements.
   */
  render() {
    return (
      <div className={'card'}>
        <div className={'form-group mx-3'}>
          <h1>Registrer fylke</h1>
          <div className={'d-inline'}>
            <label htmlFor={'county_name'} className={'form-label'}>
              Fylkesnavn
            </label>
            <input
              onKeyDown={event => this.county_name_change(event)}
              className={'form-control'}
              type="text"
              id={'county_name'}
              name="county_name"
              placeholder="Fylkesnavn"
            />
          </div>
          <button onClick={event => this.submit()} className={'btn btn-primary my-3 w-100'}>
            Send
          </button>
        </div>
      </div>
    );
  }

  /**
   * Listens to whether or not to display lat lon coordinate input fields.
   * @param find_loc_auto True or false statement whether or not to display lat lon coordinate input fields.
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
   * Called when input field changes. Changes county objects name variable to match the input field's value.
   * @param event Source event generated by the HTML Input field that called this function.
   */
  county_name_change(event) {
    this.county.name = event.target.value;
    /*
        console.log(event.key);
        if(event.key === 'Enter'){
            this.searchLoc();
        }
        */
  }

  /**
   * Called when submitting form. Validate county object properties and sends county object to server.
   */
  submit() {
    console.log('New County:', this.county);
    let county_name = document.querySelector('#county_name').value;
    if (county_name !== undefined && county_name !== null && county_name !== '') {
      let countyService = new CountyService();
      countyService
        .createCounty({ name: county_name })
        .then(res => {
          document.querySelector('#county_name').value = '';
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
