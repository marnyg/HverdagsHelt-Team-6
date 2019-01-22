
// @flow
import axios from 'axios';
import Region from '../classes/Region.js';
import LoginService from './LoginService.js';

class StatService {
    getNatCasesOpenedInYear(year: number): Promise<Region> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService.isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios.get('/api/stats/opened/' + year, {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        })
                            .then(response => resolve(response))
                            .catch((error: Error) => reject(error));
                    } else {
                        reject('User is not registered and/or not logged in.');
                    }
                })
                .catch((error: Error) => reject(error));
        });
    }

    getNatCasesClosedInYear(year: number): Promise<Region> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService.isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios.get('/api/stats/closed/' + year, {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        })
                            .then(response => resolve(response))
                            .catch((error: Error) => reject(error));
                    } else {
                        reject('User is not registered and/or not logged in.');
                    }
                })
                .catch((error: Error) => reject(error));
        });
    }

    getCasesClosedInYearInRegion(year: number, region_id: number): Promise<Region> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService.isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios.get('/api/stats/closed/' + year + "/" + region_id, {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        })
                            .then(response => resolve(response))
                            .catch((error: Error) => reject(error));
                    } else {
                        reject('User is not registered and/or not logged in.');
                    }
                })
                .catch((error: Error) => reject(error));
        });
    }
    getCasesOpenedInYearInRegion(year: number, region_id: number): Promise<Region> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService.isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios.get('/api/stats/opened/' + year + "/" + region_id, {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        })
                            .then(response => resolve(response))
                            .catch((error: Error) => reject(error));
                    } else {
                        reject('User is not registered and/or not logged in.');
                    }
                })
                .catch((error: Error) => reject(error));
        });
    }
}

export default StatService