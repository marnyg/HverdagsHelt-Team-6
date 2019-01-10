// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { Minside } from './Minside';
import { Footer } from './Footer';

import '../styles/styles.css';
import '../styles/loginmodal.css';
import '../styles/registermodal.css';
import '../styles/grid-list-toggle.css';
import '../styles/simple-sidebar.css';

import Navbar from './Navbar.js';
import Content from './Content.js';
import NewCase from './NewCase.js';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from "axios/index";
axios.interceptors.response.use(response => response.data);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <div className="content-wrapper">
            <Route exact path="/" render={() => <Content />} />
            <Route path="/new-case" render={() => <NewCase />} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
