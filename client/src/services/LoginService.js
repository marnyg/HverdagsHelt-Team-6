//@flow
import axios from 'axios';

class LoginService {
  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem('token');
        if(token){
          // User has registered before
          // Must check if token is still active
          axios.post('/api/verify', {}, {
              headers: {
                  Authorization: 'Bearer ' + token
              }
          }).then((response) => {
              if(response.status = 200){
                  resolve(true);
              } else {
                  resolve(false);
              }
          }).catch((error: Error) => reject(error));
        } else {
            resolve(false);
        }
    });
  }
}
export default LoginService;
