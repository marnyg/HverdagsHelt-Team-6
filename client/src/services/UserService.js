// @flow
import axios from 'axios';
import User from '../classes/User.js';
import LoginService from './LoginService.js';
import ToolService from "./ToolService";

class UserService {
    /**
     * Get all users
     * @returns {Promise<User[]>}
     */
    getAllUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService
                .isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios
                            .get('/api/users', {
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

    forgottenPassword(email: string): Promise<any> {
        return axios.post('/api/users/new_password', {
            email: email
        });
    }

    /**
     * Get one user, given user_id
     * @param user_id
     * @returns {Promise<User>}
     */
    getUser(user_id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService
                .isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios
                            .get('/api/users/' + user_id, {
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

    /**
     * Get all region subscriptions for given user_id
     * @param user_id
     * @returns {Promise<User>}
     */
    getRegionSubscriptionsGivenUserId(user_id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService
                .isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios
                            .get('/api/users/' + user_id + '/region_subscriptions', {
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

    /**
     * Update a user
     * @param u User
     * @returns {Promise<any>}
     */
    updateUser(u: User): Promise<any> {
        if(!u.role_id) {
            u.role_id = -1; // Standard, needed to make user-updates by admin work
        }
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService
                .isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios
                            .put('/api/users/' + u.user_id, u, {
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

    /**
     * Delete a user
     * @param user_id
     * @returns {Promise<any>}
     */
    deleteUser(user_id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService
                .isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios
                            .delete('/api/users/' + user_id, {
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

    //Create user(RIKTIGE PARAMETERE?)
    /**
     * Create a new user
     * @param u User
     * @returns {AxiosPromise<User>}
     */
    createUser(u: User): Promise<User> {
        console.log(u);
        if(!u.role_id){
            u.role_id = -1;
        }
        return axios.post('/api/users', u, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Create a new employee user
     * @param u User
     * @returns {Promise<User>}
     */
    createEmployee(u: User): Promise<User> {
        if(!u.role_id) u.role_id = ToolService.employeeRole();
        return new Promise(((resolve, reject) => {
            let loginService = new LoginService();
            loginService.isLoggedIn()
                .then((logged_in: Boolean) => {
                    if(logged_in === true){
                        let token = localStorage.getItem('token');
                        axios.post('/api/users', u, {
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
        }));
    }

    /**
     * Update password for a user
     * @param user_id
     * @param old_password
     * @param new_password
     * @returns {Promise<void>}
     */
    updatePassword(user_id: number, old_password: string, new_password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let loginService = new LoginService();
            loginService
                .isLoggedIn()
                .then((logged_in: Boolean) => {
                    if (logged_in === true) {
                        let token = localStorage.getItem('token');
                        axios
                            .put(
                                '/api/users/' + user_id + '/password',
                                {
                                    old_password: old_password,
                                    new_password: new_password
                                },
                                {
                                    headers: {
                                        Authorization: 'Bearer ' + token
                                    }
                                }
                            )
                            .then(response => resolve(response))
                            .catch((error: Error) => reject(error));
                    } else {
                        reject('User is not registered and/or not logged in.');
                    }
                })
                .catch((error: Error) => reject(error));
        });
    }

    /**
     * Check if e-mail is available
     * @param email
     * @returns {AxiosPromise<any>}
     */
    emailAvailable(email: string): Promise<User> {
        //SKAL DENNE RETURNERE EN BOOLEAN ELLER BRUKER OBJEKT??
        return axios.get('/api/email_available', email);
    }

    /**
     * Method to log in
     * @param email
     * @param password
     * @returns {Promise<any>}
     */
    login(email: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            axios
                .post('/api/login', { email: email, password: password })
                .then(data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    resolve('Logged in');
                })
                .catch((error: Error) => reject(error));
        });
    }

    /**
     * Method to log out
     * @returns {Promise<any>}
     */
    logout(): Promise<any> {
        let token = localStorage.getItem('token');
        return new Promise((resolve, reject) => {
            axios
                .post(
                    '/api/logout',
                    {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                )
                .then(res => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    resolve(res);
                })
                .catch((error: Error) => reject(error));
        });
    }

    /**
     * Get all employees in given region
     * @param region_id
     * @returns {Promise<User[]>}
     */
    getAllEmployeesInRegion(region_id: number): Promise<User[]> {
        return new Promise(((resolve, reject) => {
            let loginService = new LoginService();
            loginService.isLoggedIn()
                .then((logged_in: Boolean) => {
                    if(logged_in === true){
                        let token = localStorage.getItem('token');
                        axios.get('/api/regions/' + region_id + '/staff', {
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
        }));
        //api/regions/:region_id/staff
    }
}

export default UserService;
