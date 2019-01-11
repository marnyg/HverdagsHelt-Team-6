// @flow
import axios from 'axios';
import County from '../classes/County.js';

class CountyService {
  //Get all counties
  getAllCounties(): Promise<County[]> {
    return axios.get('/api/counties');
  }

  //Create new county
  createCounty(c: County): Promise<County> {
    return axios.post('/api/counties', c);
  }

  //Update county
  updateCounty(county_id: number, c: County): Promise<void> {
    return axios.put('/api/counties/' + county_id, c);
  }

  //Delete one specific county
  deleteCounty(county_id: number): Promise<void> {
    return axios.delete('/api/counties/' + county_id);
  }

}

export default CountyService;
