//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink, withRouter } from 'react-router-dom';
import { caseService } from '../services/CaseService.js';
import { Notify } from './Notify';

class MyCases extends Component<{ match: { params: { user_id: number } } }> {
  cases = [
    {
      user_id: 100,
      case_id: 1,
      title: 'Elendig vei!!!',
      name: 'Åpen',
      created_at: '2019-01-01',
      updated_at: '2019-01-01'
    }
  ];
  user_id = null;

  render() {
    if (!this.cases) {
      return null;
    }

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Tittel</th>
            <th scope="col">Status</th>
            <th scope="col">Kommune</th>
            <th scope="col">Dato opprettet</th>
            <th scope="col">Siste oppdatering</th>
            <th scope="col">Oppdatert av</th>
          </tr>
        </thead>
        <tbody>
          {this.cases.map(c => (
            <tr key={c.case_id} style={{ cursor: 'pointer' }} onClick={this.onClickTableRow}>
              <td>{c.title}</td>
              <td>{c.name}</td> {/* c.name = navnet på statusen som ligger i SQL-tabellen Statuses. */}
              <td>{'Kommune'}</td>
              <td>{this.dateFormat(c.createdAt)}</td>
              <td>{this.dateFormat(c.updatedAt)}</td>
              <td>{c.user_id}</td> {/* Saksbehandler???? */}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  mounted() {
    // this.user_id = this.props.match.params.user_id;
    this.user_id = 1;
    caseService.getAllCasesGivenUser(this.user_id).then(cases => {
      this.cases = cases;
      console.log(this.cases);
    });
  }

  onClickTableRow(event: SyntheticInputEvent<HTMLInputElement>) {
    //let case_id = event.target.parentElement.key;
    //console.log(case_id);
    // this.props.history.push('/case/' + case_id);
  }

  dateFormat(date: string) {
    console.log(date.split('.')[0].replace('T', ' '));
    return date.split('.')[0].replace('T', ' ');
  }
}

export default withRouter(MyCases);
