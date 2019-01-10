// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);
import County from '../classes/County.js';

class CountyService {
  //Get all counties
  getAllCounties(): Promise<County[]> {
    return axios.get('/api/counties');
  }
  /*
  //Update county
  updateCounty(county_id: number, c: County): Promise<void> {
    return axios.put('/api/counties/' + county_id, c);
  }

  //Delete one specific county
  deleteCounty(county_id: number): Promise<void> {
    return axios.delete('/api/counties/' + county_id);
  }
  */
}

export let countyService = new CountyService();
