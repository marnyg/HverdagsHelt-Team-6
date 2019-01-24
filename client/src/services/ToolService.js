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

  static getStatusColour(status_id: number) {
    return statusStyles[status_id - 1];
  }

  static dateFormat(date: string) {
    // Format: 1970-01-01T00:00:01.000Z
    if (date) {
      return dateConverter(date, 'dd.mm.yyyy HH:MM');
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

  static getUserUpdateErrorAlert(error: Error) {
      if(error.response) {
          if(error.response.status === 409) {
              // Epost finnes allerede
              return(
                  <Alert
                      type={'danger'}
                      text={'En bruker med denne epostadressen eksisterer allerede.'}
                      onClose={() => this.error = null}
                  />
              );
          } else if (error.response.status === 400) {
              // bad request
              return(
                  <Alert
                      type={'danger'}
                      text={'Fyll inn alle feltene riktig før du registrerer.'}
                      onClose={() => this.error = null}
                  />
              );
          } else if (error.response.status === 403) {
              // not logged in, token expired
              return(
                  <Alert
                      type={'danger'}
                      text={'Din økt har utgått, logg ut og inn og prøv igjen.'}
                      onClose={() => this.error = null}
                  />
              );
          } else if (error.response.status === 401) {
              // unauthorized
              return(
                  <Alert
                      type={'danger'}
                      text={'Du har ikke rettigheter til å utføre denne handlingen.'}
                      onClose={() => this.error = null}
                  />
              );
          } else {
              return(
                  <Alert
                      type={'danger'}
                      text={error.message}
                      onClose={() => this.error = null}
                  />
              );
          }
      } else {
          return(
              <Alert
                  type={'danger'}
                  text={error.message}
                  onClose={() => this.error = null}
              />
          );
      }
  }
}

export default ToolService;
