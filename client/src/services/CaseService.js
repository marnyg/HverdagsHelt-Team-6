// @flow
import axios from 'axios';
import Case from '../classes/Case.js';
import LoginService from './LoginService.js';
import FormData from 'form-data';

class CaseService {
  //Get all cases
  static getAllCases(): Promise<Case[]> {
    return axios.get('/api/cases');
  }

  //Get one specific case
  getCase(case_id: number): Promise<Case> {
    return axios.get('/api/cases/' + case_id);
  }

  //Update one specific case
  updateCase(case_id: number, c: Case): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get('/api/cases/' + case_id, c, {
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

  //Delete one specific case
  deleteCase(case_id: number): Promise<void> {
    //return axios.delete('/api/cases/' + case_id);
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .delete(
                '/api/cases' + case_id,
                {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                }
              )
              .then(response => resolve(response))
              .catch((error: Error) => reject(error));
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  //Create case
  createCase(c: Case, pictures): Promise<Case> {
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
            let images = [];
            for (let i = 0; i < pictures.length; i++) {
              images.append('image', pictures[i]);
            }
            formData.append(images);
            formData.append(c);
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
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  //Get all cases given user
  getAllCasesGivenUser(user_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get(
                '/api/cases/user_cases/' + user_id,
                {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                }
              )
              .then((cases: Case[]) => resolve(cases))
              .catch((error: Error) => reject(error));
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  //Get cases given region
  getAllCasesGivenRegionId(region_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .get(
                '/api/cases/region_cases/' + region_id,
                {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                }
              )
              .then((cases: Case[]) => resolve(cases))
              .catch((error: Error) => reject(error));
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  //Get all cases given location
  getCasesByLoc(county_name: string, region_name: string): Promise<Case[]> {
    return axios.get(
      '/api/cases/region_cases/' + region_name + '/' + county_name,
      {},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
export default CaseService;
