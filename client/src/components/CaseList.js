//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, withRouter } from 'react-router-dom';
import CaseService from '../services/CaseService';
import Notify from './Notify';

// Constants used for colouring status fields in table

const statusClosed = 3;
const statusProcesing = 2;
const statusOpen = 1;
const green = { color: 'green' };
const orange = { color: 'orange' };
const red = { color: 'red' };

class CaseList extends Component<{ match: { params: { user_id: number, region_id: number } } }> {
  cases = [
    {
      user_id: 1002,
      caseworker_id: 100,
      case_id: 1283921234,
      region_id: 1006,
      status_id: 1,
      title: 'Elendig vei!!!',
      user_name: 'Mr. T',
      caseworker_name: 'Anne B. Ragde',
      region_name: 'Stjørdal',
      status_name: 'Åpen',
      createdAt: '2019-01-01T13:37:00.000Z',
      updatedAt: '2019-01-01T13:37:00.000Z'
    },
    {
      user_id: 1056,
      caseworker_id: 101,
      case_id: 1283921098,
      region_id: 1090,
      status_id: 2,
      title: 'Ferga suger',
      user_name: 'Petter Northug',
      caseworker_name: 'Arne Brimi',
      region_name: 'Levanger',
      status_name: 'Under behandling',
      createdAt: '2019-01-01T13:37:00.000Z',
      updatedAt: '2019-01-01T13:37:00.000Z'
    },
    {
      user_id: 1000,
      caseworker_id: 103,
      case_id: 1283921765,
      region_id: 1006,
      status_id: 3,
      title: 'Bibliotek',
      user_name: 'Katy Perry',
      caseworker_name: 'Mette Marit',
      region_name: 'Stjørdal',
      region_name: 'Stjørdal',
      status_name: 'Lukket',
      createdAt: '2019-01-01T13:37:00.000Z',
      updatedAt: '2019-01-01T13:37:00.000Z'
    }
  ];

  render() {
    if (!this.cases) {
      return null;
    }
    
    return (
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Tittel</th>
            <th scope="col">Status</th>
            <th scope="col">Kommune</th>
            <th scope="col">Eier</th>
            <th scope="col">Dato opprettet</th>
            <th scope="col">Siste oppdatering</th>
            <th scope="col">Oppdatert av</th>
          </tr>
        </thead>
        <tbody>
          {this.cases.map(c => (
            <tr key={c.case_id} style={{ cursor: 'pointer' }} onClick={this.onClickTableRow}>
              <td>{c.title.trim()}</td>
              <td style = { this.getStatusColour(c.status_id) }>{c.status_name}</td>
              <td>{c.region_name}</td>
              <td>{c.user_name}</td>
              <td>{this.dateFormat(c.createdAt)}</td>
              <td>{this.dateFormat(c.updatedAt)}</td>
              <td>{c.caseworker_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  mounted() {
    let id = 1; // Placeholder!!!
    let cas = new CaseService();
    let token = localStorage.getItem('token');
    if(this.props.match.params.user_id){
      // Set up table for cases on per user basis
      id = this.props.match.params.user_id;
      cas
        .getAllCasesGivenUser(id)
        .then(cases => {
          this.cases = cases;
          console.log('Length of this.cases = ' + this.cases.length);
          console.log(this.cases);
          if (this.cases.length === 0) {
            Notify.info(
              "Vi fant ingen saker for denne brukeren. Du kan lage en ny sak ved å trykke 'Registrer Sak' øverst i navigasjonsbaren."
            );
          }
        })
        .catch((err: Error) => {
          Notify.danger(
            'Det oppstod en feil under henting av dine saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
            err.message
          );
          console.log(
            'Error when fetching cases for user with id ' +
            id +
            '.\nError message is: ' +
            err.message
          );
        });
    }else if(this.props.match.params.region_id){
      // Set up table for cases on per municipality/region basis
      id = this.props.match.params.region_id;
      cas
        .getAllCasesGivenRegion(id)
        .then(cases => {
          this.cases = cases;
          console.log('Length of this.cases = ' + this.cases.length);
          console.log(this.cases);
          if (this.cases.length === 0) {
            Notify.info(
              "Vi fant ingen saker for denne kommunen."
            );
          }
        })
        .catch((err: Error) => {
          Notify.danger(
            'Det oppstod en feil under henting av kommunens saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
            err.message
          );
          console.log(
            'Error when fetching cases for region with id ' +
            id +
            '.\nError message is: ' +
            err.message
          );
        });
    }
  }
  
  getStatusColour(status_id: number){
    switch(status_id){
      case statusClosed:
        return green;
      case statusProcesing:
        return orange;
      case statusOpen:
        return red;
    }
  }

  onClickTableRow(event: SyntheticInputEvent<HTMLInputElement>) {
    if (event.target) {
      let case_id = this.cases[event.target.parentElement.rowIndex - 1].case_id;
      console.log(case_id);
      //this.props.history.push('/case/' + case_id);
      //this.props.history.push('/'); // Placeholder
    }
  }

  dateFormat(date: string) {
    if (date) {
      return date.split('.')[0].replace('T', ' ');
    } else {
      return 'Fant ikke dato.';
    }
  }
}

export default withRouter(CaseList);
