// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import App from './components/App.js';
import * as serviceWorker from './components/serviceWorker';
import { Component } from 'react-simplified';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
// import { Alert } from './widgets';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
serviceWorker.unregister();
