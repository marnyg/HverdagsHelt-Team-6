// @flow
import axios from 'axios';
import Region from '../classes/Region.js';

class RegionService {
  //Get all regions(X)
  getAllRegions(): Promise<Region[]> {
    return axios.get('/api/regions');
  }

  //Get one specific region, given id(X)
  getRegionGivenId(region_id: number): Promise<Region> {
    return axios.get('/api/regions/' + region_id);
  }

  //Get all regions, given county
  getAllRegionGivenCounty(county_id: number): Promise<Region[]> {
    return axios.get('/api/counties/' + county_id + '/regions');
  }

  //Create region
  createRegion(r: Region): Promise<Region> {
    let token = localStorage.getItem('token');
    axios.post('/api/regions', {
      body: {
        name: r.name,
        lat: r.lat,
        lon: r.lon,
        county_id: r.county_id
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Get region, given id
  getRegion(region_id: number): Promise<Region> {
    return axios.get('api/regions/' + region_id);
  }

  //Update region, gived id
  updateRegion(r: Region, region_id: number): Promise<void> {
    let token = localStorage.getItem('token');
    axios.put('api/regions/' + region_id, {
      body: {
        name: r.name,
        lat: r.lat,
        lon: r.lon,
        county_id: r.county_id
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Delete region, given id
  deleteRegion(region_id: number): Promise<void> {
    let token = localStorage.getItem('token');
    axios.delete('api/regions/' + region_id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }
}

export default RegionService;
