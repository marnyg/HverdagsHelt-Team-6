class StatusComment {
  status_comment_id: number;
  case_id: number;
  status_id: number;
  user_id: number;
  status_name: string;
  comment: string;
  createdBy: string;
  createdAt: any;

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
