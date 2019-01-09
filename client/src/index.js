// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import App from './components/App.js';
import * as serviceWorker from './components/serviceWorker';
import { Component } from 'react-simplified';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { studentService } from './services';

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
serviceWorker.unregister();
