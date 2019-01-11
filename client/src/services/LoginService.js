//@flow
import axios from 'axios';

class LoginService {
  isLoggedIn() {
    let token = localStorage.getItem('token');
    let res = axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if(res = 200){
      return true;
    } else {
      return false;
    }
  }
}
