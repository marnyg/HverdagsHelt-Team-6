class StatusComment {
  /**
   * StatusComment objects enable aagregated data flow of status comments and the user of which posted the status comment.
   */

  status_comment_id: number;
  case_id: number;
  status_id: number;
  user_id: number;
  status_name: string;
  comment: string;
  createdBy: string;
  createdAt: any;

  /**
   *
   * @param status_comment_id ID number which uniquely identifies this status comment.
   * @param case_id ID number of case to which this status comment belongs.
   * @param status_id ID number of status that was selected as current status at the time this status comment was posted.
   * @param user_id ID number of the user that posted this status comment.
   * @param status_name Name of status that was selected as current status at the time this status comment was posted.
   * @param comment Text message sent by the user.
   * @param createdBy Name of user with user_id.
   * @param created_at Date time when this status comment was created and accepted in the database.
   */

  constructor(
    status_comment_id: number,
    case_id: number,
    status_id: number,
    user_id: number,
    status_name: string,
    comment: string,
    createdBy: string,
    created_at: string
  ) {
    this.status_comment_id = status_comment_id;
    this.case_id = case_id;
    this.status_id = status_id;
    this.user_id = user_id;
    this.status_name = status_name;
    this.comment = comment;
    this.createdBy = createdBy;
    this.createdAt = created_at;
  }
}
export default StatusComment;
