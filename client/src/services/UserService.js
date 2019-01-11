// @flow
import axios from 'axios';
import User from '../classes/User.js';

class UserService {
  //Get all users
  getAllUsers(): Promise<User[]> {
    return axios.get('/api/users');
  }

  //Get one specific user
  getUser(user_id: number): Promise<User> {
    return axios.get('/api/users/' + user_id);
  }

  //Update one specific user
  updateUser(user_id: number, u: User): Promise<void> {
    return axios.put('/api/users/' + user_id, u);
  }

  //Delete one specific user
  deleteUser(user_id: number): Promise<void> {
    return axios.delete('/api/users/' + user_id);
  }

  //Create user
  createUser(u: User): Promise<User> {
    return axios.post('/api/users', u);
  }

  //Update user password
  updatePassword(user_id: number, u: User): Promise<void> {
    return axios.put('/api/users/' + user_id + '/password', u);
  }
}

export let userService = new UserService();
