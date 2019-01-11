//@flow
import axios from 'axios';

class LoginService {
  isLoggedIn(): Promise<boolean> {
    let token = localStorage.getItem('token');
    axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((response) => {
      if(response.status = 200){
        return true;
      } else {
        return false;
      }
    }).catch((error: Error) => console.error(error));
  }
}
export default LoginService;
