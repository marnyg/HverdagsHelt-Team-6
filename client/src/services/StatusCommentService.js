// @flow
import axios from 'axios';
import StatusComment from '../classes/StatusComment.js';
import LoginService from "./LoginService";

class StatusCommentService {
  //Get all status comments, given case
  getAllStatusComments(case_id: number): Promise<StatusComment[]> {
      return axios.get('/api/cases/' + case_id + '/status_comments');
  }

  //Update one specific category
  updateStatusComment(sc: StatusComment): Promise<void> {
      //return axios.put('/api/cases/status_comments/' + status_comment_id, sc);
      return new Promise((resolve, reject) => {
          let loginService = new LoginService();
          loginService.isLoggedIn()
              .then((logged_in: Boolean) => {
                  if(logged_in === true){
                      let token = localStorage.getItem('token');
                      axios.put('/api/cases/status_comments/' + sc.status_comment_id, sc, {
                          headers: {
                              Authorization: 'Bearer ' + token
                          }
                      })
                          .then(response => resolve(response))
                          .catch((error: Error) => reject(error));
                  } else {
                      reject('User is not logged in');
                  }
              })
              .catch((error: Error) => reject(error));
      });
  }

  //Create status comment
  createStatusComment(sc: StatusComment): Promise<StatusComment> {
    //return axios.post('/api/cases/status_comments/')
      return new Promise((resolve, reject) => {
          let loginService = new LoginService();
          loginService.isLoggedIn()
              .then((logged_in: Boolean) => {
                  if(logged_in === true){
                      let token = localStorage.getItem('token');
                      axios.post('/api/cases/status_comments', sc, {
                          headers: {
                              Authorization: 'Bearer ' + token
                          }
                      })
                          .then((status_comment: StatusComment) => resolve(status_comment))
                          .catch((error: Error) => reject(error));
                  } else {
                      reject('User is not logged in');
                  }
              })
              .catch((error: Error) => reject(error));
      });
  }

  deleteStatusComment(sc: StatusComment){
      return new Promise((resolve, reject) => {
          let loginService = new LoginService();
          loginService.isLoggedIn()
              .then((logged_in: Boolean) => {
                  if(logged_in === true){
                      let token = localStorage.getItem('token');
                      axios.delete('/api/cases/status_comment/' + sc.status_comment_id, sc, {
                          headers: {
                              Authorization: 'Bearer ' + token
                          }
                      })
                          .then(response => resolve(response))
                          .catch((error: Error) => reject(error));
                  } else {
                      reject('User is not logged in');
                  }
              })
              .catch((error: Error) => reject(error));
      });
  }
}
export default StatusCommentService;
