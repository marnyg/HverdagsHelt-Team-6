//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
//import { Alert } from './widgets';
//import { studentService } from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

export class MyCases extends Component <{ match: { params: { user_id: number } } }> {
  cases = [];

  render() {
    if(!this.cases) {
      return null;
    }

    return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Case status</th>
            <th scope="col">Region</th>
            <th scope="col">Date created</th>
            <th scope="col">Last updated</th>
            <th scope="col">User</th> //hente ut navnet på bruker
          </tr>
        </thead>
        <tbody>
          {this.cases.map((c, i) => (
            <tr key={i}>
              <td>{c.title}</td>
              <td>{c.status_id}</td> //hente ut navnet til en status gitt id.
              <td>{c.created_at}</td>
              <td>{c.updated_at}</td>
              <td>{c.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  mounted() {
    caseService
    .getAllCasesGivenUser(this.props.match.params.user_id)
    .then(cases => (this.cases = cases));
  }

  /*render() {
    return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Case status</th>
            <th scope="col">Region</th>
            <th scope="col">Date created</th>
            <th scope="col">Last updated</th>
            <th scope="col">User</th> //hente ut navnet på bruker
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hei</td>
            <td>Ja</td> //hente ut navnet til en status gitt id.
            <td>Smil</td>
            <td>Ja</td>
            <td>Hurra!</td>
          </tr>
        </tbody>
      </table>
    )
  }*/
}
