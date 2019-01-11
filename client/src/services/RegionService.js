// @flow
import axios from 'axios';
import Region from '../classes/Region.js';

class RegionService {
  //Get all regions
  getAllRegions(): Promise<Region[]> {
    return axios.get('/api/regions/');
  }

  //Get one specific region, given id
  getRegionGivenId(region_id: number): Promise<Region> {
    return axios.get('/api/regions/' + region_id);
  }

  //Get all regions, given county
  getAllRegionGivenCounty(county_id: number): Promise<Region[]> {
    return axios.get('/api/counties/' + county_id + '/regions');
  }

  //Create region
  createRegion(r: Region): Promise<Region> {
    return axios.post('/api/regions/', r);
  }

  //Get region, given id
  getRegion(region_id: number): Promise<Region> {
    return axios.get('api/regions/' + region_id);
  }

  //Update region, gived id
  updateRegion(r: Region, region_id: number): Promise<void> {
    return axios.put('api/regions/' + region_id, r);
  }

  //Delete region, given id
  deleteRegion(region_id: number): Promise<void> {
    return axios.delete('api/regions/' + region_id);
  }
}

export default RegionService;
