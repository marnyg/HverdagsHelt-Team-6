// @flow
import axios from 'axios';
import Case from '../classes/Case.js';

class SearchService {
  searchForCases(searchWord: string): Promise<Case[]> {
    return axios.get('endepunkt' + searchWord);
  }
}
export default SearchService;
