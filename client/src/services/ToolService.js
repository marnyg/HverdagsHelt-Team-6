// @flow

import Notify from '../components/Notify';
import User from '../classes/User';

const statusStyles = [{ color: '#CC0000' }, { color: '#0000FF' }, { color: '#007500' }]; // Constant used for colouring status fields in table.
const dateMonths = ['jan', 'feb', 'mar', 'apr', 'mai', 'juni', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
// Frequently used static methods are put here to reduce overall duplicate code

class ToolService {
  static admin_role_id = 1;
  static employee_role_id = 2;
  static private_user_role_id = 4;

  static getStatusColour(status_id: number) {
    return statusStyles[status_id - 1];
  }

  static dateFormat(date: string) {
    // Format: 1970-01-01T00:00:01.000Z
    if (date) {
      let d = new Date(date);
      return (
        d.getDay() +
        '. ' +
        dateMonths[d.getMonth()] +
        ' ' +
        d.getFullYear() +
        ' kl. ' +
        d.getHours() +
        ':' +
        d.getMinutes()
      );
    } else {
      return 'Fant ikke dato.';
    }
  }

  static employeeRole() {
    return 2;
  }

  static getUserId() {
    let userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString).user_id;
    } else {
      console.log('User is not logged in!');
      Notify.danger('Du må logge inn for å bruke denne tjenesten!');
      return -1;
    }
  }

  static getUser(): ?User {
    let userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    } else {
      return null;
    }
  }

  static cleanQueryString(query: string) {
    let check = {
      'Nord-Trøndelag': 'Trøndelag',
      'Sør-Trøndelag': 'Trøndelag',
      'Øst-Trøndelag': 'Trøndelag',
      'Vest-Trøndelag': 'Trøndelag'
    };
    if (query in check) return check[query];
    return query;

    /*
      let help = query;
      if(help.split('-').length > 1){
          let part = help.split('-');
          help = part[part.length - 1];
      }
      return help;
      */
  }
}

export default ToolService;
