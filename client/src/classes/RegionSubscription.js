class RegionSubscription {
  /**
   * Mimics the Region_Subscription table in the database. Enables effective type-checking.
   */

  user_id: number;
  region_id: number;
  notify: boolean;

  /**
   *
   * @param user_id ID number of the user to which this subscription belongs.
   * @param region_id ID number of region to which this subscription is associated.
   * @param notify Boolean value that indicates whether or not to receive e-mail notifications
   */

  constructor(user_id, region_id, notify) {
    this.user_id = user_id;
    this.region_id = region_id;
    this.notify = notify;
  }
}
export default RegionSubscription;
