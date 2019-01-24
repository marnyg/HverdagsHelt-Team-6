// @flow
import axios from 'axios';
import County from '../classes/County.js';
import LoginService from './LoginService.js';

class CountyService {
  /**
   * Get all counties
   * @returns {AxiosPromise<County[]>}
   */
  getAllCounties(): Promise<County[]> {
    return axios.get('/api/counties');
  }

  /**
   * Create a new county
   * @param c County
   */
  createCounty(c: County): Promise<County> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .post('/api/counties', c, {
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

  /**
   * Update a county
   * @param county_id
   * @param c County
   * @returns {Promise<any>}
   */
  updateCounty(county_id: number, c: County): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .put('/api/counties/' + county_id, c, {
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

  /**
   * Delete a county, given county_id
   * @param county_id
   * @returns {Promise<any>}
   */
  deleteCounty(county_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .delete('/api/counties/' + county_id, {
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

export default CountyService;
