// @flow
import axios from 'axios';
import Role from '../classes/Role.js';

class RoleService {
  //Get all cases
  getAllRoles(): Promise<Role[]> {
    let token = localStorage.getItem('token');
    axios.get('/api/roles', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
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
