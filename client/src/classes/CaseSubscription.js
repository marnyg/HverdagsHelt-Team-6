class CaseSubscription {
  /**
   * CaseSubscription is a data object of a user's current subscription to a case.
   */

  user_id: number;
  case_id: number;
  notify_by_email: ?boolean;
  is_up_to_date: boolean;

  /**
   *
   * @param user_id ID number of the user whom is currently subscribed to the case
   * @param case_id ID number of the case to which the user is currently subscribed
   * @param notify_by_email Boolean value which enables whether or not the user should receive e-mail updates whenever the case with case_id is updated.
   * @param is_up_to_date Boolean value that states whether or not user with user_id has seen the latest update to case with case_id or not.
   */

  constructor(user_id, case_id, notify_by_email, is_up_to_date) {
    this.user_id = user_id;
    this.case_id = case_id;
    this.notify_by_email = notify_by_email;
    this.is_up_to_date = is_up_to_date;
  }
}
export default CaseSubscription;
