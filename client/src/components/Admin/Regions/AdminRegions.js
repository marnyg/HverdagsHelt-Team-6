//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegionsList from './AdminRegionsList';
import AdminRegionView from './AdminRegionView';
import CountyService from '../../../services/CountyService';
import RegionService from '../../../services/RegionService';

/**
 * Region edit component. Enables an admin user to edit regions throughout the system.
 */
class AdminRegions extends Component {
  viewing_region = null;
  regions = [];

  /**
   * Generates HTML code
   * @returns {*} HTML Element with sub-elements.
   */
  render() {
    return (
      <div>
        <div className={'container'}>
          <div className={'row'}>
            <div className={'col-lg'}>
              <h2>Registrerte kommuner</h2>
              <AdminRegionsList regions={this.regions} onRegionSelected={region => this.onRegionSelected(region)} />
            </div>
            <div className={'col-lg'}>
              <h2>Informasjon om kommunen</h2>
              <AdminRegionView
                region={this.viewing_region}
                onRegionUpdate={updated_region => this.onRegionUpdate(updated_region)}
                onRegionDelete={deleted_region => this.onRegionDelete(deleted_region)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Sets the in-focus/editable region to a new region.
   * @param region Region object to focus/edit.
   */
  onRegionSelected(region: Region) {
    this.viewing_region = region;
  }

  /**
   * When region gets updated: set in-focus/editable region to it's new updated state.
   * @param updated_region
   */
  onRegionUpdate(updated_region) {
    this.viewing_region = updated_region;
    this.fetch_regions();
  }

  /**
   * Removes a region from the region list.
   * @param deleted_region Region object to delete
   */
  onRegionDelete(deleted_region) {
    this.regions.splice(this.regions.indexOf(deleted_region), 1);
  }

  /**
   * Fetches a list of regions. Sets the component variable state to the result list.
   */
  fetch_regions() {
    let regionService = new RegionService();
    regionService
      .getAllRegions()
      .then((regions: Region[]) => {
        regions.map(reg => (reg.county_name = ''));
        this.regions = regions;
      })
      .then(() => {
        let countyService = new CountyService();
        countyService
          .getAllCounties()
          .then((counties: County[]) => {
            for (let i = 0; i < counties.length; i++) {
              for (let j = 0; j < this.regions.length; j++) {
                if (this.regions[j].county_id === counties[i].county_id) {
                  this.regions[j].county_name = counties[i].name;
                }
              }
            }
          })
          .catch((error: Error) => console.error(error));
      })
      .catch((error: Error) => console.error(error));
  }

  /**
   * When component mounts: issues fetching logic.
   */
  mounted() {
    this.fetch_regions();
  }
}
export default AdminRegions;
