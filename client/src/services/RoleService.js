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

  createRole(r: Role): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.post('/api/regions', r, {
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

  updateRole(role_id: number, r: Role): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.put('/api/roles/' + role_id, r, {
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

  deleteRole(role_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.delete('/api/roles/' + role_id, {
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
}
export default RoleService;
