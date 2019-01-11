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
    return axios.put('/api/categories/' + category_id, c);
  }

  //Delete one specific category
  deleteCategory(category_id: number): Promise<void> {
    return axios.delete('/api/categories/' + category_id);
  }

  //Create category
  createCategory(c: Category): Promise<Category> {
    return axios.post('/api/categories', c);
  }
}

export default CategoryService;
