// @flow
import Case from '../classes/Case.js';
import CaseService from './CaseService';

class EmployeeService {
  // Status 1 == åpen
  // Status 2 == under behandling
  // Status 3 == lukket
  /**
   * Get open cases for given region_id
   * @param region_id
   * @returns {Promise<Case[]>}
   */
  getOpenCases(region_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let caseService = new CaseService();
      caseService
        .getCaseGivenRegionId(region_id)
        .then((cases: Case[]) => {
          resolve(cases.filter(element => element.status_id === 1));
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * Get all started cases for given region_id
   * @param region_id
   * @returns {Promise<Case[]>}
   */
  getStartedCases(region_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let caseService = new CaseService();
      caseService
        .getCaseGivenRegionId(region_id)
        .then((cases: Case[]) => {
          resolve(cases.filter(element => element.status_id === 2));
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * Get all closed cases for given region_id
   * @param region_id
   * @returns {Promise<Case[]>}
   */
  getClosedCases(region_id: number): Promise<Case[]> {
    return new Promise((resolve, reject) => {
      let caseService = new CaseService();
      caseService
        .getCaseGivenRegionId(region_id)
        .then((cases: Case[]) => {
          resolve(cases.filter(element => element.status_id === 3));
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
}

export default EmployeeService;
