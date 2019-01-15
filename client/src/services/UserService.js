// @flow
import axios from 'axios';
import User from '../classes/User.js';
import LoginService from './LoginService.js';

class UserService {
  getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.get('/api/users', {
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

  getUser(user_id: number): Promise<User> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.get('/api/users/' + user_id, {
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

  updateUser(user_id: number, u: User): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.put('/api/users/' + user_id, u, {
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

  deleteUser(user_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.delete('/api/users/' + user_id, {
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

  //Create user(RIKTIGE PARAMETERE?)
  createUser(u: User): Promise<User> {
      console.log(u);
    return axios.post('/api/users', u, {
        headers: {'Content-Type': 'application/json'},
    });
  }

  updatePassword(user_id: number, old_password: string, new_password: string): Promise<void> { // Trenger token i header her
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.post('/api/users/' + user_id, {
                       body: {
                         old_password: old_password,
                         new_password: new_password
                       }
                     }, {
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

  //Check if e-mail is available
  emailAvailable(email: string): Promise<User> {   //SKAL DENNE RETURNERE EN BOOLEAN ELLER BRUKER OBJEKT??
    return axios.get('/api/email_available', email);
  }

  login(email: string, password: string): Promise<any> {
      return new Promise(((resolve, reject) => {
          axios.post('/api/login', { email: email, password: password })
              .then(data => {
                  console.log('UserService reveived this on login:', data);
                  console.log('UserService reveived this user on login:', data.user);
                  //console.log('UserService login received this token:', data.token);
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('user', data.user);
                  resolve('Logged in');
              })
              .catch((error: Error) => reject(error));
      }));
  }

  logout(): Promise<any>{
        let token = localStorage.getItem('token');
        return new Promise(((resolve, reject) => {
            axios.post('/api/logout', {}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(res => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    resolve(res);
                })
                .catch((error: Error) => reject(error));
        }));
  }
}

export default UserService;
