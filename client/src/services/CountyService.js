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
    let token = localStorage.getItem('token');
    axios.post('/api/counties', {
      body: {
        'name': c.name
      }
    }, {
      Authorization: 'Bearer ' + token
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Update county
  updateCounty(county_id: number, c: County): Promise<void> {
    let token = localStorage.getItem('token');
    axios.put('/api/counties/' + county_id, {
      body: {
        'name': c.name
      }
    }, {
      Authorization: 'Bearer ' + token
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Delete one specific county
  deleteCounty(county_id: number): Promise<void> {
    let token = localStorage.getItem('token');
    axios.delete('/api/counties/' + county_id,
    {
      Authorization: 'Bearer ' + token
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

}

export default CountyService;
