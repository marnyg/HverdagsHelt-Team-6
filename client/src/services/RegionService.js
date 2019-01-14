// @flow
import axios from 'axios';
import Region from '../classes/Region.js';
import LoginService from './LoginService.js';

class RegionService {
  //Get all regions
  getAllRegions(): Promise<Region[]> {
    return axios.get('/api/regions');
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
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.post('/api/regions', r, {
                         headers: {
                             Authorization: 'Bearer ' + token
                         }
                     })
                         .then(response => resolve(response))
                         .catch((error: Error) => reject(error));
                 } else {
                     reject('User is not registered and/or not logged in.');
                 }
             })
             .catch((error: Error) => reject(error));
     });
  }

  //Get region, given id
  getRegion(region_id: number): Promise<Region> {
    return axios.get('api/regions/' + region_id);
  }

  //Update region, gived id
  updateRegion(r: Region, region_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.put('/api/regions/' + region_id, r, {
                         headers: {
                             Authorization: 'Bearer ' + token
                         }
                     })
                         .then(response => resolve(response))
                         .catch((error: Error) => reject(error));
                 } else {
                     reject('User is not registered and/or not logged in.');
                 }
             })
             .catch((error: Error) => reject(error));
     });
  }

  //Delete region, given id
  deleteRegion(region_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.delete('/api/regions/' + region_id, {
                         headers: {
                             Authorization: 'Bearer ' + token
                         }
                     })
                         .then(response => resolve(response))
                         .catch((error: Error) => reject(error));
                 } else {
                     reject('User is not registered and/or not logged in.');
                 }
             })
             .catch((error: Error) => reject(error));
     });
  }
}

export default RegionService;
