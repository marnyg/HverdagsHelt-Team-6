//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RegionForm from './RegionForm';
import CountyForm from "./CountyForm";
import CountyService from "../../../services/CountyService";

/**
 * Component for registering regions. Implements forms for registering regions and counties.
 */
class RegionRegistration extends Component {
    counties = [];

  /**
   * Generates HTML code
   * @returns {*} HTML Element with ub-elements.
   */
  render() {
    return (
      <div className={'container'}>
        <div className={'row'}>
          <div className={'col-lg'}>
            <RegionForm counties={this.counties} />
          </div>
          <div className={'col-lg'}>
            <CountyForm onCountyCreated={() => this.onCountyCreated()} />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Function called by CountyForm component when county has been created. Sends nwly created county to server.
   */
  onCountyCreated() {
    let countyService = new CountyService();
    countyService
      .getAllCounties()
      .then((counties: County[]) => {
        this.counties = counties;
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * When component mounts: Fetches counties and puts them in component variable list.
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
}
export default RegionRegistration;
