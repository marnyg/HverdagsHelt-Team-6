// @flow
import axios from 'axios';
import Case from '../classes/Case.js';
import LoginService from './LoginService.js';
import FormData from 'form-data';
import CaseService from "./CaseService";

class EmployeeService {
    // Status 1 == åpen
    // Status 2 == under behandling
    // Status 3 == lukket
    getOpenCases(region_id: number): Promise<Case[]> {
        return new Promise((resolve, reject) => {
            let caseService = new CaseService();
            caseService.getCaseGivenRegionId(region_id)
                .then((cases: Case[]) => {
                    resolve(cases.filter(element => element.status_id === 1));
                })
                .catch((error: Error) => {
                    reject(error);
                });
        })
    }

    getStartedCases(region_id: number): Promise<Case[]> {
        return new Promise((resolve, reject) => {
            let caseService = new CaseService();
            caseService.getCaseGivenRegionId(region_id)
                .then((cases: Case[]) => {
                    resolve(cases.filter(element => element.status_id === 2));
                })
                .catch((error: Error) => {
                    reject(error);
                });
        })
    }

    getClosedCases(region_id: number): Promise<Case[]> {
        return new Promise((resolve, reject) => {
            let caseService = new CaseService();
            caseService.getCaseGivenRegionId(region_id)
                .then((cases: Case[]) => {
                    resolve(cases.filter(element => element.status_id === 3));
                })
                .catch((error: Error) => {
                    reject(error);
                });
        })
    }
}

export default EmployeeService;