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

class MyCases extends Component {
  render() {
    return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Case status</th>
            <th scope="col">Region</th>
            <th scope="col">Date created</th>
          </tr>
        </thead>
      </table>
    )
  }
}
