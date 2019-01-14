// @flow
import axios from 'axios';
import Case from '../classes/Case.js';
import LoginService from "./LoginService";
import {login} from "../../../server/src/auth";

class CaseService {
  //Get all cases
  getAllCases(): Promise<Case[]> {
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
        loginService.isLoggedIn()
            .then((logged_in: Boolean) => {
                if(logged_in === true){
                    let token = localStorage.getItem('token');
                    axios.put('/api/cases/' + case_id, c, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
                        .then(response => {
                          if(response.status === 200){
                            resolve(response);
                          } else {
                            reject(response);
                          }
                        })
                        .catch((error: Error) => reject(error));
                } else {
                  reject('User is not logged in');
                }
            })
            .catch((error: error) => console.error(error));
    });
  }

  //Delete one specific case
  deleteCase(case_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: Boolean) => {
              if(logged_in === true){
                axios.delete('/api/cases/' + case_id)
                    .then(response => {
                        resolve(response);
                    })
                    .catch((error: Error) => reject(error));
              } else {
                reject('User is not logged in');
              }
            })
            .catch((error: Error) => reject(error));
    });
  }

  //Create case
  createCase(c: Case): Promise<Case> {
      return new Promise((resolve, reject) => {
          let loginService = new LoginService();
          loginService.isLoggedIn()
              .then((logged_in: Boolean) => {
                  if(logged_in === true){
                      let token = localStorage.getItem('token');
                      axios.post('/api/cases', c, {
                          headers: {
                              Authorization: 'Bearer ' + token
                          }
                      })
                          .then(response => resolve(response))
                          .catch((error: Error) => reject(error));
                  } else {

                  }
              })
              .catch((error: Error) => reject(error));
      });
  }

  //Get all cases given user
  getAllCasesGivenUser(user_id: number): Promise<Case[]> {
      return new Promise((resolve, reject) => {
          let loginService = new LoginService();
          loginService.isLoggedIn()
              .then((logged_in: Boolean) => {
                  if(logged_in === true){
                      // Do work here
                      // Example:
                      /*
                      let token = localStorage.getItem('token');
                      axios.post('/api/cases', c, {
                          headers: {
                              Authorization: 'Bearer ' + token
                          }
                      })
                          .then(cases: Case[] => resolve(cases))
                          .catch((error: Error) => reject(error));
                      */
                      /*
                      let token = localStorage.getItem('token');
                      axios.delete('/api/cases', c, {
                          headers: {
                              Authorization: 'Bearer ' + token
                          }
                      })
                          .then(response => resolve(response))
                          .catch((error: Error) => reject(error));
                      */
                  } else {
                      reject('User is not registered and/or not logged in.');
                  }
              })
              .catch((error: Error) => reject(error));
      });
      /*
    let token = localStorage.getItem('token');
    axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((response) => {
      if(response.status = 200){
        return axios.get('/api/cases/user_cases/' + user_id);
      } else {
        return response.sendStatus(403);;
      }
    }).catch((error: Error) => console.error(error));
    */
  }

  //Get all cases given location
  getCasesByLoc(county_name: string, region_name: string): Promise<Case[]> {
    return axios.get('/api/cases/region_cases/' + county_name + '/' + region_name);
  }
}
export default CaseService;
