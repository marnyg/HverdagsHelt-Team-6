// @flow
import axios from 'axios';
import User from '../classes/User.js';

class UserService {
  //Get all users
  getAllUsers(): Promise<User[]> {
    return axios.get('/api/users');
  }

  //Get one specific user
  getUser(user_id: number): Promise<User> { // Trenger token i header her
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res = 200){
      return axios.get('/api/users/' + user_id);
    } else {
      return res.sendStatus(400);
    }
  }

  //Update one specific user
  updateUser(user_id: number, u: User): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res === 200){
      return axios.put('/api/users/' + user_id, u);
    } else {
      return res.sendStatus(400);
    }
  }

  //Delete one specific user
  deleteUser(user_id: number): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res = 200){
      return axios.delete('/api/users/' + user_id);
    } else {
      return res.sendStatus(400);
    }
  }

  //Create user
  createUser(u: User): Promise<User> {
    return axios.post('/api/users', u);
  }

  //Update user password
  updatePassword(user_id: number, u: User): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res = 200){
      return axios.put('/api/users/' + user_id + '/password', u);
    } else {
      return res.sendStatus(400);
    }
  }

  //Check if e-mail is available
  emailAvailable(): Promise<User> {   //SKAL DENNE RETURNERE EN BOOLEAN ELLER BRUKER OBJEKT??
    return axios.get('/api/email_available');
  }
}

export let userService = new UserService();
