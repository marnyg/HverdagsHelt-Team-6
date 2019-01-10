class RegionSubscription {
  user_id: number;
  region_id: number;
  notify: boolean;

  constructor(user_id, region_id, notify){
    this.user_id = user_id;
    this.region_id = region_id;
    this.notify = notify;
  }
}
export default RegionSubscription;
