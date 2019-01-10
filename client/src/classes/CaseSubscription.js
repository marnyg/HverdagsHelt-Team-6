class CaseSubscription {
  user_id: number;
  case_id: number;
  notify_by_email: boolean;
  is_up_to_date: boolean;

  constructor(user_id, case_id, notify_by_email, is_up_to_date){
    this.user_id = user_id;
    this.case_id = case_id;
    this.notify_by_email = notify_by_email;
    this.is_up_to_date = is_up_to_date;
  }
}
export default CaseSubscription;
