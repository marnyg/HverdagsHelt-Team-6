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
    return axios.get('/api/cases/user_cases/' + user_id);
  }

  //Get all cases given location
  getLocationByLoc(county_name: string, region_name: string, l: Location): Promise<Case[]> {
    return axios.get('/api/cases/region_cases/' + county_name + '/' + region_name, l);
  }
}

export let caseService = new CaseService();
