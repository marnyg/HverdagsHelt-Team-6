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
    return axios.delete('/api/cases/' + case_id + '/subscribe');
  }

  //Create subscription, given case
  createCaseSubscription(s: CaseSubscription, case_id: number): Promise<CaseSubscription> {
    return axios.post('/api/cases/' + case_id + '/subscribe', s);
  }
}

export let caseSubscriptionService = new CaseSubscriptionService();
