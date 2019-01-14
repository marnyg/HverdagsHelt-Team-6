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
    return axios.post('/api/users', u);
  }

  //Update user password(SKAL TOKEN BRUKES HER?, riktige parametere?)
  updatePassword(user_id: number, old_password: string, new_password: string): Promise<void> { // Trenger token i header her
    let token = localStorage.getItem('token');
    let loginService = new LoginService();

    loginService.isLoggedIn().then(loggedIn => {
      if(loggedIn === true){
        return axios.post('/api/users/' + user_id + '/password', {
          body: {
            old_password: old_password,
            new_password: new_password
          }
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      } else {
        //Returner status-melding her om bruker ikke er riktig
      }
    }).catch((error: Error) => console.error(error));
  }

  //Check if e-mail is available
  emailAvailable(email: string): Promise<User> {   //SKAL DENNE RETURNERE EN BOOLEAN ELLER BRUKER OBJEKT??
    return axios.get('/api/email_available', email);
  }

  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
         let loginService = new LoginService();
         loginService.isLoggedIn()
             .then((logged_in: Boolean) => {
                 if(logged_in === true){
                     let token = localStorage.getItem('token');
                     axios.post('/api/login', {
                         body: {
                           email: email,
                           password: password
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
}

export default UserService;
