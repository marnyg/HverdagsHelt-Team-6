// @flow
import axios from 'axios';
import User from '../classes/User.js';

class UserService {
  //Get all users(RIKTIG?)
  getAllUsers(): Promise<User[]> {
    let token = localStorage.getItem('token');
    axios.get('/api/users', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Get one specific user(RIKTIG?)
  /*
  getUser(user_id: number): Promise<User> { // Trenger token i header her
    let token = localStorage.getItem('token');
    axios.get('/api/login/' + user_id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }
  */

  /*
  //Update one specific user(RIKTIG?)
  updateUser(user_id: number, u: User): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    axios.put('/api/login/' + user_id, {
      body: {
        'firstname': u.firstname,
        'lastname': u.lastname,
        'tlf': u.tlf,
        'email': u.email,
        'region_id': u.region_id
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Delete one specific user(RIKTIG?)
  deleteUser(user_id: number): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    axios.delete('/api/login/' + user_id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }
  */

  //Create user(RIKTIGE PARAMETERE?)
  createUser(u: User): Promise<User> {
    let token = localStorage.getItem('token');
    axios.post('/api/users', {
      body: {
        'firstname': u.firstname,
        'lastname': u.lastname,
        'tlf': u.tlf,
        'email': u.email,
        'password': u.password
      }
    }, {
      headers: {
        Authorization: 'Bearer: ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Update user password(SKAL TOKEN BRUKES HER?, riktige parametere?)
  updatePassword(user_id: number, old_password: string, new_password: string): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    axios.post('/api/users/' + user_id + '/password', {
      body: {
        'old_password': old_password,
        'new_password': new_password
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Check if e-mail is available
  emailAvailable(email: string): Promise<User> {   //SKAL DENNE RETURNERE EN BOOLEAN ELLER BRUKER OBJEKT??
    return axios.get('/api/email_available', email);
  }

  /*
  //For login (RIKTIG?)
  login(email: string, password: string): Promise<void> {
    let token = localStorage.getItem('token');
    axios.post('/api/login', {
      body: {
        'email': email,
        'password': password
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }
  */
}

export default UserService;
