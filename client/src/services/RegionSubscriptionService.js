// @flow
import axios from 'axios';
import RegionSubscription from '../classes/RegionSubscription.js';
import LoginService from './LoginService.js';
import User from '../classes/User.js';

class RegionSubscriptionService {
  /**
   * Get all region subscriptions
   * @param region_id
   * @returns {Promise<RegionSubscription[]>}
   */
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

  /**
   * Delete a region subscription
   * @param region_id
   * @param user_id
   * @returns {Promise<void>}
   */
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

  /**
   * Create a region subscription
   * @param r Region
   * @param region_id
   * @returns {Promise<RegionSubscription>}
   */
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

  /**
   * Update a region subscription
   * @param r Region
   * @param region_id
   * @returns {Promise<void>}
   */
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

  /**
   * Get region subscription for a given user
   * @param user_id
   * @returns {Promise<RegionSubscription[]>}
   */
  getSubscribedRegionsForUser(user_id: number): Promise<RegionSubscription[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/users/' + user_id + '/region_subscriptions', {
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

  setNotifyByEmail(region_id: number, sub: RegionSubscription): Promise<any> {
      return new Promise((resolve, reject) => {
          let loginService = new LoginService();
          loginService
              .isLoggedIn()
              .then((logged_in: Boolean) => {
                  if (logged_in === true) {
                      let token = localStorage.getItem('token');
                      axios
                          .put('/api/regions/' + region_id + '/subscribe', sub, {
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
