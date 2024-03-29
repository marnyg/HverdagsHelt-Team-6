// @flow
import axios from 'axios';
import CaseSubscription from '../classes/CaseSubscription.js';
import LoginService from './LoginService.js';
import Case from '../classes/Case.js';

class CaseSubscriptionService {
  /**
   * Get all subscriptions, given user
   * @param user_id
   * @returns {Promise<CaseSubscription[]>}
   */
  getAllCaseSubscriptions(user_id: number): Promise<CaseSubscription[]> {
    //return axios.get('/api/cases/subscription/' + user_id);
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .get('/api/cases/subscriptions/' + user_id, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then((subscriptions: CaseSubscription[]) => {
                  resolve(subscriptions);
                })
                .catch((error: Error) => reject(error));
            } else {
              reject('Fant ikke brukerens token. Prøv å logg ut og inn igjen.');
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Delete subscription, given case
   * @param case_id
   * @param user_id
   * @returns {Promise<void>}
   */
  deleteCaseSubscription(case_id: number, user_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              ///api/cases/:case_id/subscribe
              axios
                .delete('/api/cases/' + case_id + '/subscribe/' + user_id, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then(response => resolve(response))
                .catch((error: Error) => reject(error));
            } else {
              reject('Fant ikke brukerens token. Prøv å logg ut og inn igjen.');
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Create subscription, given case
   * @param subscription
   * @returns {Promise<CaseSubscription>}
   */
  createCaseSubscription(subscription: CaseSubscription): Promise<CaseSubscription> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              //'/api/cases/:case_id/subscribe'
              axios
                .post('/api/cases/' + subscription.case_id + '/subscribe', subscription, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then(response => {
                  resolve(response);
                })
                .catch((error: Error) => reject(error));
            } else {
              reject('Fant ikke brukerens token. Prøv å logg ut og inn igjen.');
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Update a case subscription
   * @param subscription
   * @returns {Promise<any>}
   */
  updateCaseSubscription(subscription: CaseSubscription): Promise<any> {
    console.log('UPDATING CASE SUBSCRIPTION');
    //axios.put('/api/cases/' + case_id + '/subscribe');
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              //'/api/cases/:case_id/subscribe'
              axios
                .put('/api/cases/' + subscription.case_id + '/subscribe', subscription, {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then(response => resolve(response))
                .catch((error: Error) => reject(error));
            } else {
              reject('Fant ikke brukerens token. Prøv å logg ut og inn igjen.');
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Get all subscribed cases for a user
   * @param user_id
   * @returns {Promise<Case[]>}
   */
  getAllSubscribedCasesGivenUser(user_id: number): Promise<Case[]> {
    //return axios.get('/api/cases/subscription/' + user_id);
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .get('/api/cases/subscriptions/' + user_id + '/cases', {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then((cases: Case[]) => resolve(cases))
                .catch((error: Error) => reject(error));
            } else {
              reject('Fant ikke brukerens token. Prøv å logg ut og inn igjen.');
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Get all outdated cases that user subscribed to
   * @param user_id
   * @returns {Promise<Case[]>}
   */
  getAllOutdatedCaseSubscriptions(user_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            if (token) {
              axios
                .get('/api/cases/subscriptions/' + user_id + '/cases/is_up_to_date', {
                  headers: {
                    Authorization: 'Bearer ' + token
                  }
                })
                .then((cases: Case[]) => resolve(cases))
                .catch((error: Error) => reject(error));
            } else {
              reject('Fant ikke brukerens token. Prøv å logg ut og inn igjen.');
            }
          } else {
            reject('User is not logged in');
          }
        })
        .catch((error: Error) => reject(error));
    });
  }
}

export default CaseSubscriptionService;
