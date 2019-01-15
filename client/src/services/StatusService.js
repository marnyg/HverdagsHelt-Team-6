//@flow
import axios from 'axios';
import Status from '../classes/Status.js';
import LoginService from './LoginService.js';

class StatusService {
  getAllStatuses(): Promise<Status[]> {
    return axios.get('/api/statuses');
  }

  createStatus(s: Status): Promise<any> {
    return new Promise((resolve, reject) => {
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: Boolean) => {
                if(logged_in === true){
                    let token = localStorage.getItem('token');
                    axios.post('/api/statuses', s, {
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

  updateStatus(status_id: number, s: Status): Promise<any> {
    return new Promise((resolve, reject) => {
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: Boolean) => {
                if(logged_in === true){
                    let token = localStorage.getItem('token');
                    axios.put('/api/statuses/' + status_id, s, {
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

  deleteStatus(status_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: Boolean) => {
                if(logged_in === true){
                    let token = localStorage.getItem('token');
                    axios.delete('/api/statuses/' + status_id, {
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

export default StatusService;
