//@flow
import axios from 'axios';

class LoginService {
  isLoggedIn(): Promise<Boolean> {
      return new Promise((resolve, reject) => {
          let token = localStorage.getItem('token');
          if(token){
              axios.post('/api/verify', {}, {
                  headers: {
                      Authorization: 'Bearer ' + token
                  }
              })
                  .then((response) => {
                      if(response.status = 200){
                          resolve(true);
                      } else {
                          reject('Token is no longer active');
                      }
                  })
                  .catch((error: Error) => reject(error));
          } else {
              reject('User has not registered before');
          }
      });
  }
}
export default LoginService;
