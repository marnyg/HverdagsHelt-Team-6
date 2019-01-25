// @flow
import axios from 'axios';
import Case from '../classes/Case.js';
import LoginService from './LoginService.js';
import FormData from 'form-data';
import ToolService from './ToolService';

class CaseService {
  /**
   * Get all cases
   * @returns {AxiosPromise<any>}
   */
  static getAllCases(): Promise<Case[]> {
    return axios.get('/api/cases');
  }

  /**
   * Get one specific case
   * @param case_id
   * @returns {AxiosPromise<any>}
   */
  getCase(case_id: number): Promise<Case> {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem('token');
        if(token) {
            axios.get('/api/cases/' + case_id, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then((cases: Case) => resolve(cases))
                .catch((error: Error) => reject(error));
        } else {
            axios.get('/api/cases/' + case_id)
                .then((cases: Case) => resolve(cases))
                .catch((error: Error) => reject(error));
        }
    });
  }

  /**
   * Update one specific case
   * @param case_id
   * @param c Case
   * @returns {Promise<void>}
   */
  updateCase(case_id: number, c: Case): Promise<void> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .put('/api/cases/' + case_id, c, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then(response => resolve(response))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Delete one specific case
   * @param case_id
   * @returns {Promise<void>}
   */
  deleteCase(case_id: number): Promise<void> {
    //return axios.delete('/api/cases/' + case_id);
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .delete('/api/cases/' + case_id, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then(response => resolve(response))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Create case
   * @param c Case
   * @param pictures
   * @returns {Promise<Case>}
   */
  createCase(c: Object, pictures): Promise<Case> {
    console.log('Case:', c);
    console.log('Pictures:', pictures);
    //return axios.post('/api/cases', c);
    let formData = new FormData();
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              if (pictures.length > 0) {
                pictures.map(e => {
                  formData.append('images', e.value);
                });
              } else {
                formData.append('images', null);
              }

              formData.append('title', c.title);
              formData.append('description', c.description);
              formData.append('lat', c.lat);
              formData.append('lon', c.lon);
              formData.append('category_id', c.category_id);
              formData.append('region_id', c.region_id);

              let title = c.title;
              axios
                .post('/api/cases', formData, {
                  headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => resolve(response))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Get all cases given user
   * @param user_id
   * @returns {Promise<Case[]>}
   */
  getAllCasesGivenUser(user_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .get('/api/cases/user_cases/' + user_id, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then((cases: Case[]) => resolve(cases))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Get all cases given user with offset
   * @param user_id
   * @param page
   * @param items_per_query
   * @returns {Promise<Case[]>}
   */
  getAllCasesGivenUser(user_id: number, page: number, items_per_query: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              console.log(
                'Fertching cases for user ' + user_id + ', page ' + page + ' number of cases: ' + items_per_query
              );
              axios
                .get('/api/cases/user_cases/' + user_id + '?page=' + page + '&limit=' + items_per_query, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then((cases: Case[]) => resolve(cases))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Get cases given region
   * @param region_id
   * @returns {Promise<Case[]>}
   */
  getAllCasesGivenRegionId(region_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .get('/api/cases/region_cases/' + region_id, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then((cases: Case[]) => resolve(cases))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Get all cases given location
   * @param county_name
   * @param region_name
   * @returns {AxiosPromise<any>}
   */
  getCasesByLoc(county_name: string, region_name: string): Promise<Case[]> {
    return axios.get(
      '/api/cases/region_cases/' + region_name + '/' + county_name,
      {},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Get all cases given location
   * @param county_name
   * @param region_name
   * @returns {AxiosPromise<any>}
   */
  getCasesByLoc(county_name: string, region_name: string): Promise<Case[]> {
    return axios.get(
      '/api/cases/region_cases/' +
        ToolService.cleanQueryString(region_name) +
        '/' +
        ToolService.cleanQueryString(county_name),
      {},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Get cases given a region_id
   * @param region_id
   * @returns {AxiosPromise<any>}
   */
  getCaseGivenRegionId(region_id: number): Promise<Case> {
    return axios.get('/api/cases/region_cases/' + region_id, {}, {});
  }

  /**
   * Get cases given query string (search)
   * @param query
   * @returns {AxiosPromise<any>}
   */
  search(query: string): Promise<Case[]> {
    return axios.get('/api/search/' + query, {}, {});
  }

  /**
   * Get all cases in region, given region_id, limit and offset
   * @param region_id
   * @param limit
   * @param offset
   */
  getCasesByRegionWithLimitOffset(region_id: number, limit: number, offset: number) {}

  /**
   * Upload picture to existing case
   * @param case_id
   * @param picture
   * @returns {Promise<any>}
   */
  uploadPicture(case_id: number, picture: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              let formData = new FormData();
              formData.append('image', picture);
              axios
                .post('/api/pictures/' + case_id, formData, {
                  headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => resolve(response))
                .catch((error: Error) => reject(error));
            } else {
              reject(
                'Fant ikke brukerens token. Det kan hende brukeren ikke er logget inn, eller annen feil har oppstått. Prøv å logge ut og inn igjen, og prøv på nytt.'
              );
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Delete picture from case
   * @param case_id
   * @param src
   * @returns {Promise<void>}
   */
  deletePicture(case_id: number, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .delete('/api/pictures/' + case_id + '/' + src, {
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
   * Get one page of cases, from specific region
   * @param limit
   * @param page
   * @param region_id
   * @returns {AxiosPromise<any>}
   */
  getCasePageByRegion(limit: number, page: number, region_id: number) {
    return axios.get('/api/cases/region_cases/' + region_id + '?page=' + page + '&limit=' + limit);
  }
}
export default CaseService;
