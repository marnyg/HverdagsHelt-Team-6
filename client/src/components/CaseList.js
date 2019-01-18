//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, withRouter } from 'react-router-dom';
import CaseService from '../services/CaseService';
import Notify from './Notify';

// Constants used for colouring status fields in table

const statusStyles = [{ color: 'red' }, { color: 'orange' }, { color: 'green' }]; // Constant used for colouring status fields in table.
const ITEMS_PER_QUERY = 20;

class CaseList extends Component<{ user_id: number, region_id: number }> {
  cases = [];
  offset: number = 0;
  fetchButton = null;

  render() {
    if (!this.cases) {
      return null;
    }

    return (
      <div className={'card my-3 mx-3'}>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">Tittel</th>
              <th scope="col">Status</th>
              <th scope="col">Kommune</th>
              <th scope="col">Eier</th>
              <th scope="col">Dato opprettet</th>
              <th scope="col">Siste oppdatering</th>
            </tr>
          </thead>
          <tbody>
            {this.cases.map(c => (
              <tr key={c.case_id} style={{ cursor: 'pointer' }} onClick={this.onClickTableRow}>
                <td>{c.title.trim()}</td>
                <td style={this.getStatusColour(c.status_id)}>{c.status_name}</td>
                <td>{c.region_name}</td>
                <td>{c.createdBy}</td>
                <td>{this.dateFormat(c.createdAt)}</td>
                <td>{this.dateFormat(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          ref={e => {
            this.fetchButton = e;
          }}
          className={'btn btn-secondary'}
          onClick={this.onClickButton}
        >
          Last mer
        </button>
        <p id={'noEntries'} style={{ color: '#666' }} hidden>
          Ingen innlegg å vise.
        </p>
      </div>
    );
  }

  mounted() {
    console.log('user_id: ' + this.props.user_id + ', region_id: ' + this.props.region_id);
    this.fetchData();
  }

  fetchData() {
    let cas = new CaseService();
    if (this.props.user_id) {
      // Set up table for cases on per user basis
      cas
        .getAllCasesGivenUser(this.props.user_id)
        .then(cases => {
          this.cases = cases.concat(cases);
          this.offset += cases.length;
          if (this.fetchButton && cases.length < ITEMS_PER_QUERY) {
            this.fetchButton.hidden = true;
          }
        })
        .catch((err: Error) => {
          Notify.danger(
            'Det oppstod en feil under henting av dine saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
              err.message
          );
          console.log('Error when fetching cases for user with id ' + this.props.user_id + '.\nError message is: ' + err.message);
        });
    } else if (this.props.region_id) {
      // Set up table for cases on per municipality/region basis
      cas
        .getAllCasesGivenRegionId(this.props.region_id)
        .then(cases => {
          this.cases = cases.concat(cases);
          this.offset += cases.length;
          if (this.fetchButton && cases.length < ITEMS_PER_QUERY) {
            this.fetchButton.hidden = true;
          }
        })
        .catch((err: Error) => {
          Notify.danger(
            'Det oppstod en feil under henting av kommunens saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
              err.message
          );
          console.log('Error when fetching cases for region with id ' + this.props.region_id + '.\nError message is: ' + err.message);
        });
    } else {
      console.warn("Didn't find user_id or region_id");
      Notify.danger(
        'Kunne ikke finne bruker eller kommunedata for å hente saker fra server. Vennligst gå tilbake til hovedsida.'
      );
    }
  }
  
  getStatusColour(status_id: number) {
    return statusStyles[status_id + 1];
  }

  onClickTableRow(event: SyntheticInputEvent<HTMLInputElement>) {
    console.log('Trykket på tabell.');
    if (event.target && event.target.parentElement instanceof HTMLTableRowElement) {
      let case_id = this.cases[event.target.parentElement.rowIndex - 1].case_id;
      console.log(case_id);
      this.props.history.push('/case/' + case_id);
    } else {
      Notify.danger('Kunne ikke videresende deg til sak.');
    }
  }

  onClickButton(event: SyntheticInputEvent<HTMLButtonElement>) {}

  dateFormat(date: string) {
    if (date) {
      let a = date.split('.')[0].replace('T', ' ');
      return a.substr(0, a.length - 3);
    } else {
      return 'Fant ikke dato.';
    }
  }
}

export default withRouter(CaseList);
