// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

export class Case {
  case_id: number;
  region_id: number;
  user_id: number;
  category_id: number;
  status_id: number;
  title: string;
  description: string;
  created_at: any;
  updated_at: any;
  lat: number;
  lon: number;
}

class CaseService {
  //Get all cases
  getAllCases(): Promise<Case[]> {
    return axios.get('/api/cases');
  }

  //Get one specific case
  getCase(case_id: number): Promise<Case> {
    return axios.get('/api/cases/' + case_id);
  }

  updateCase(case_id: number): Promise<void> {
    return axios.put('api/cases/', case_id);
  }

  deleteCase(case_id: number): Promise<void> {
    return axios.delete('/api/cases/' + case_id);
  }

  /*createCase(case: Case): Promise<Case> {
    return axios.post('/cases/newCase', case);
  }*/

  getAllCasesGivenUser(user_id: number): Promise<Case[]> {
    return axios.get('/api/cases/user_cases/' + user_id);
  }
}

export let caseService = new CaseService();
