class StatusComment {
  status_comment_id: number;
  case_id: number;
  status_id: number;
  user_id: number;
  comment: string;
  createdAt: any;

  constructor(status_comment_id, case_id, status_id, user_id, comment, created_at){
    this.status_comment_id = status_comment_id;
    this.case_id = case_id;
    this.status_id = status_id;
    this.user_id = user_id;
    this.comment = comment;
    this.createdAt = created_at;
  }
}
export default StatusComment;
