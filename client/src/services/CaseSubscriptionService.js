// @flow
import axios from 'axios';
import CaseSubscription from '../classes/CaseSubscription.js';

class CaseSubscriptionService {
  //Get all subscriotions, given user
  getAllCaseSubscriptions(user_id: number): Promise<CaseSubscription[]> {
    return axios.get('/api/cases/subscription/' + user_id);
  }

  //Delete subscription, given case
  deleteCaseSubscription(case_id: number): Promise<void> {
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res = 200){
      return axios.delete('/api/cases/' + case_id + '/subscribe');
    } else {
      return res.sendStatus(400);
    }
  }

  //Create subscription, given case
  createCaseSubscription(s: CaseSubscription, case_id: number): Promise<CaseSubscription> {
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res = 200){
      return axios.post('/api/cases/' + case_id + '/subscribe', s);
    } else {
      return res.sendStatus(400);
    }
  }
}

export default CaseSubscriptionService;
