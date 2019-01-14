// @flow
import axios from 'axios';
import Role from '../classes/Role.js';
import LoginService from './LoginService.js';

class RoleService {
  getAllRoles(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.get('/api/roles', {
                         headers: {
                             Authorization: 'Bearer ' + token
                         }
                     })
                         .then(response => resolve(response))
                         .catch((error: Error) => reject(error));
                 } else {
                     reject('User is not registered and/or not logged in.');
                 }
             })
             .catch((error: Error) => reject(error));
     });
  }

  createRole(r: Role): Promise<void> {
    let token = localStorage.getItem('token');
    axios.post('/api/roles', {
      body: {
        'name': r.name,
        'access_level': r.access_level
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  updateRole(role_id: number, r: Role): Promise<void> {
    let token = localStorage.getItem('token');
    axios.put('/api/roles/' + role_id, {
      body: {
        'name': r.name,
        'access_level': r.access_level
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  deleteRole(role_id: number): Promise<void> {
    let token = localStorage.getItem('token');
    axios.delete('/api/roles/' + role_id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }
}
export default RoleService;
