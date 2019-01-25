// @flow
import axios from 'axios';
import Category from '../classes/Category.js';
import LoginService from './LoginService';

class CategoryService {
  /**
   * Get all categories
   * @returns {AxiosPromise<Category>}
   */
  getAllCategories(): Promise<Category[]> {
    return axios.get('/api/categories');
  }

  /**
   * Update a category
   * @param category_id
   * @param c Category
   * @returns {Promise<any>}
   */
  updateCategory(category_id: number, c: Category): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .put('/api/categories/' + category_id, c, {
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
   * Delete a category
   * @param category_id
   * @returns {Promise<any>}
   */
  deleteCategory(category_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .delete('/api/categories/' + category_id, {
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
   * Create a category
   * @param c Category
   * @returns {Promise<Category>}
   */
  createCategory(c: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      let loginService = new LoginService();
      loginService
        .isLoggedIn()
        .then((logged_in: Boolean) => {
          if (logged_in === true) {
            let token = localStorage.getItem('token');
            axios
              .post('/api/categories', c, {
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

export default CategoryService;
