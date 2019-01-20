// @flow

import Notify from '../components/Notify';

const statusStyles = [{ color: 'red' }, { color: 'orange' }, { color: 'green' }]; // Constant used for colouring status fields in table.
const dateMonths = ['jan', 'feb', 'mar', 'apr', 'mai', 'juni', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

// Frequently used static methods are put here to reduce overall duplicate code

class ToolService {
  static getStatusColour(status_id: number) {
    return statusStyles[status_id + 1];
  }

  static dateFormat(date: string) {
    if (date) {
      let a = date.split('.')[0].replace('T', ' ');
      return a.substr(0, a.length - 3);
    } else {
      return 'Fant ikke dato.';
    }
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
}

export default ToolService;
