// @flow
import axios from 'axios';
import Case from '../classes/Case.js';

class CaseService {
  //Get all cases
  getAllCases(): Promise<Case[]> {
    return axios.get('/api/cases');
  }

  //Get one specific case
  getCase(case_id: number): Promise<Case> {
    return axios.get('/api/cases/' + case_id);
  }

  //Update one specific case
  updateCase(case_id: number, c: Case): Promise<void> {
    return axios.put('/api/cases/' + case_id, c);
  }

  //Delete one specific case
  deleteCase(case_id: number): Promise<void> {
    return axios.delete('/api/cases/' + case_id);
  }

  //Create case
  createCase(c: Case): Promise<Case> {
    return axios.post('/api/cases', c);
  }

  //Get all cases given user
  getAllCasesGivenUser(user_id: number): Promise<Case[]> {
    let token = localStorage.getItem('token');
    axios.post('/api/login', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((response) => {
      if(response.status = 200){
        return axios.get('/api/cases/user_cases/' + user_id);
      } else {
        return response.sendStatus(403);;
      }
    }).catch((error: Error) => console.error(error));
  }

  //Get all cases given location
  getCasesByLoc(county_name: string, region_name: string): Promise<Case[]> {
    return axios.get('/api/cases/region_cases/' + county_name + '/' + region_name);
  }
}
export default CaseService;
