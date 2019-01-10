// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

export class CaseSubscription {
  user_id: number;
  case_id: number;
  notify_by_email: boolean;
  is_up_to_date: boolean;
}

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
