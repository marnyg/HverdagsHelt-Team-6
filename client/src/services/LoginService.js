//@flow
import axios from 'axios';

class LoginService {
  isLoggedIn(): Promise<Boolean> {
      return new Promise((resolve, reject) => {
          let token = localStorage.getItem('token');
          console.log('LoginService found this token:', token);
          if(token){
              axios.post('/api/verify', {}, {
                  headers: {
                      Authorization: 'Bearer ' + token
                  }
              })
                  .then((response) => {
                      //console.log('LoginService received this on verify:', response);
                      if(response === "OK"){
                          resolve(true);
                      } else {
                          reject('LoginService: Token is no longer active');
                      }
                  })
                  .catch((error: Error) => reject(error));
          } else {
              reject('LoginService: User has not logged in before');
          }
      });
  }
}
export default LoginService;
