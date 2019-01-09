// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

export class StatusComment {
  status_comment_id: number;
  case_id: number;
  status_id: number;
  user_id: number;
  comment: string;
  created_at: any;
}

class StatusCommentService {
  //Get all status comments, given case
  getAllStatusComments(case_id: number): Promise<StatusComment[]> {
    return axios.get('/api/cases/' + case_id + '/status_comments');
  }

  //Update one specific category
  updateStatusComment(status_comment_id: number, sc: StatusComment): Promise<void> {
    return axios.put('/api/cases/status_comments/' + status_comment_id, sc);
  }

  //Create status comment
  /*createStatusComment(sc: StatusComment): Promise<StatusComment> {
    return axios.post('/api/cases/status_comments/')
  }*/
}

export let statusCommentService = new StatusCommentService();
