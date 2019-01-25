// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import Notify from '../components/Notify';
import Alert from '../components/Alert';
import User from '../classes/User';

const dateConverter = require('dateformat');

const statusStyles = [{ color: '#CC0000' }, { color: '#0000FF' }, { color: '#007500' }]; // Constant used for colouring status fields in table.
// Frequently used static methods are put here to reduce overall duplicate code

class ToolService {
  static admin_role_id = 1;
  static employee_role_id = 2;
  static private_user_role_id = 4;

    /**
     * Get the defined color for given status_id
     * @param status_id
     * @returns {{color}|*}
     */
  static getStatusColour(status_id: number) {
    return statusStyles[status_id - 1];
  }

    /**
     * Get the default date format
     * @param date
     * @returns {string}
     */
  static dateFormat(date: string) {
    // Format: 1970-01-01T00:00:01.000Z
    if (date) {
      return dateConverter(date, 'HH:MM dd.mm.yyyy');
    } else {
      return 'Fant ikke dato.';
    }
  }

    /**
     * Get the role_id for employees
     * @returns {number}
     */
  static employeeRole() {
    return 2;
  }

    /**
     * Get user_id from localStorage
     * @returns {number}
     */
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

    /**
     * Get user from localStorage
     * @returns {User}
     */
  static getUser(): ?User {
    let userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    } else {
      return null;
    }
  }

    /**
     * Method to fix conflicting region names after joined regions
     * @param query
     */
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

    /**
     * Error handler for user update
     * @param error
     * @returns {*}
     */
  static getUserUpdateErrorAlert(error: Error, onClose) {
      if(error.response) {
          if(error.response.status === 409) {
              // Epost finnes allerede
              return(
                  <Alert
                      type={'danger'}
                      text={'En bruker med denne epostadressen eksisterer allerede.'}
                      onClose={() => onClose}
                  />
              );
          } else if (error.response.status === 400) {
              // bad request
              return(
                  <Alert
                      type={'danger'}
                      text={'Fyll inn alle feltene riktig før du registrerer.'}
                      onClose={() => onClose}
                  />
              );
          } else if (error.response.status === 403) {
              // not logged in, token expired
              return(
                  <Alert
                      type={'danger'}
                      text={'Din økt har utgått, logg ut og inn og prøv igjen.'}
                      onClose={() => onClose}
                  />
              );
          } else if (error.response.status === 401) {
              // unauthorized
              return(
                  <Alert
                      type={'danger'}
                      text={'Du har ikke rettigheter til å utføre denne handlingen.'}
                      onClose={() => onClose}
                  />
              );
          } else {
              return(
                  <Alert
                      type={'danger'}
                      text={error.message}
                      onClose={() => onClose}
                  />
              );
          }
      } else {
          return(
              <Alert
                  type={'danger'}
                  text={error.message}
                  onClose={() => onClose}
              />
          );
      }
  }
}

export default ToolService;
