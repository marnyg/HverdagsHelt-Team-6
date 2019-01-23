//@flow
import axios from 'axios';

class LoginService {
  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('token');
      if (token) {
        axios
          .post(
            '/api/verify',
            {},
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            }
          )
          .then(response => {
            //console.log('LoginService received this on verify:', response);
            if (response === 'OK') {
              resolve(true);
            } else {
              console.log('LoginService: Token is no longer active');
              reject(new Error('LoginService: Token is no longer active'));
            }
          })
          .catch((error: Error) => reject(error));
      } else {
        reject(new Error('LoginService: User has not logged in before'));
      }
    });
  }
}
export default LoginService;
