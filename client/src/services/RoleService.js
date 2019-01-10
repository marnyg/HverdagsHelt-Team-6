// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);
import Role from '../classes/Role.js';

class RoleService {
  //Get all cases
  getAllRoles(): Promise<Role[]> {
    return axios.get('/api/roles');
  }
}

export let roleService = new RoleService();
