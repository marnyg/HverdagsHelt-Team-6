//@flow

import axios from 'axios';
import Status from '../classes/Status.js';
import LoginService from './LoginService.js';

class StatusService {
  /**
   * Get all statuses
   * @returns {AxiosPromise<Status[]>}
   */
  getAllStatuses(): Promise<Status[]> {
    return axios.get('/api/statuses');
  }

  /**
   * Create a status
   * @param s Status
   * @returns {Promise<any>}
   */
  createStatus(s: Status): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .post('/api/statuses', s, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
              })
              .then(response => resolve(response))
              .catch((error: Error) => reject(error));
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Update a status
   * @param status_id
   * @param s Status
   * @returns {Promise<any>}
   */
  updateStatus(status_id: number, s: Status): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .put('/api/statuses/' + status_id, s, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
              })
              .then(response => resolve(response))
              .catch((error: Error) => reject(error));
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Delete a status
   * @param status_id
   * @returns {Promise<any>}
   */
  deleteStatus(status_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .delete('/api/statuses/' + status_id, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
              })
              .then(response => resolve(response))
              .catch((error: Error) => reject(error));
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }
}

export default StatusService;
