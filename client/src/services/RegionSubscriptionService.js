// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

export class RegionSubscription {
  user_id: number;
  region_id: number;
  notify: boolean;
}

class RegionSubscriptionService {
  //Get all subscribers, given region
  getAllRegionSubscribers(region_id: number): Promise<RegionSubscription[]> {
    return axios.get('/api/regions/' + region_id + '/subscribe');
  }

  //Delete subscription, given case
  deleteRegionSubscription(case_id: number): Promise<void> {
    return axios.delete('/api/cases/' + case_id + '/subscribe');
  }

  //Create subscription, given region
  createRegionSubscription(r: RegionSubscription, region_id: number): Promise<RegionSubscription> {
    return axios.post('/api/regions/' + region_id + '/subscribe', r);
  }

  //Update subscription, given region
  updateRegionSubscription(r: RegionSubscription, region_id: number): Promise<void> {
    return axios.put('/api/regions/' + region_id + '/subscribe', r);
  }
}

export let regionSubscriptionService = new RegionSubscriptionService();
