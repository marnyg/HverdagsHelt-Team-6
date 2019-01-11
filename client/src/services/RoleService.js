// @flow
import axios from 'axios';
import Role from '../classes/Role.js';

class RoleService {
  //Get all cases
  getAllRoles(): Promise<Role[]> {
    return axios.get('/api/roles');
  }
}
export default RoleService;
