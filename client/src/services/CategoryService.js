// @flow
import axios from 'axios';
import Category from '../classes/Category.js';

class CategoryService {
  //Get all categories
  getAllCategories(): Promise<Category[]> {
    return axios.get('/api/categories');
  }

  //Update one specific category
  updateCategory(category_id: number, c: Category): Promise<void> {
    let token = localStorage.getItem('token');
    axios.put('/api/categories/' + category_id, {
      body: {
        name: c.name
      }
    }, {
      Authorization: 'Bearer ' + token
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Delete one specific category
  deleteCategory(category_id: number): Promise<void> {
    let token = localStorage.getItem('token');
    axios.delete('/api/categories/' + category_id,
      {
        Authorization: 'Bearer ' + token
      }).then(function (response) {
        console.log(response);
    }).catch((error: Error) => console.error(error));
  }

  //Create category
  createCategory(c: Category): Promise<Category> {
    let token = localStorage.getItem('token');
    axios.post('/api/categories', {
      body: {
        name: c.name
      }
    }, {
      Authorization: 'Bearer ' + token
    }).then(function (response) {
      console.log(response);
    }).catch((error: Error) => console.error(error));
  }
}

export default CategoryService;
