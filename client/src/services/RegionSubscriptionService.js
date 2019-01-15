// @flow
import axios from 'axios';
import RegionSubscription from '../classes/RegionSubscription.js';
import LoginService from './LoginService.js';

class RegionSubscriptionService {
  getAllRegionSubscribers(region_id: number): Promise<RegionSubscription[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/regions/' + region_id + '/subscribe', {
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

  deleteRegionSubscription(region_id: number, user_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .delete('/api/regions/' + region_id + '/subscribe', {
                data: { user_id: user_id },
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

  createRegionSubscription(r: RegionSubscription, region_id: number): Promise<RegionSubscription> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .post('/api/regions/' + region_id + '/subscribe', r, {
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

  updateRegionSubscription(r: RegionSubscription, region_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .put('/api/regions/' + region_id + '/subscribe', r, {
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

export default RegionSubscriptionService;
