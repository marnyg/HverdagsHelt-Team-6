// @flow
import axios from 'axios';
import RegionSubscription from '../classes/RegionSubscription.js';

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

export default RegionSubscriptionService;
