// @flow
import axios from 'axios';
import Region from '../classes/Region.js';
import LoginService from './LoginService.js';

class StatService {
  /**
   * Get stats for cases opened in given year
   * @param year
   * @returns {Promise<Region>}
   */
  getNatCasesOpenedInYear(year: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/stats/opened/' + year, {
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
   * Get stats for cases closed in a given year
   * @param year
   * @returns {Promise<Region>}
   */
  getNatCasesClosedInYear(year: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/stats/closed/' + year, {
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
   * Get stats for cases closed in a given year and region
   * @param year
   * @param region_id
   * @returns {Promise<Region>}
   */
  getCasesClosedInYearInRegion(year: number, region_id: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/stats/closed/' + year + '/' + region_id, {
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
   * Get stats for cases opened in given year and region
   * @param year
   * @param region_id
   * @returns {Promise<Region>}
   */
  getCasesOpenedInYearInRegion(year: number, region_id: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/stats/opened/' + year + '/' + region_id, {
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
   * Get stats for amount of cases in categories, given a region and year
   * @param year
   * @param region_id
   * @returns {Promise<Region>}
   */
  getStatsCatYearInRegion(year: number, region_id: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/stats/categories/' + year + '/' + region_id, {
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
   * Get stats for amount of cases in categories, on national basis, given a year
   * @param year
   * @returns {Promise<Region>}
   */
  getStatsCatYearNational(year: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/stats/categories/' + year, {
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

export default StatService;
