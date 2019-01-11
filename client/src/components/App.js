// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { BrowserRouter, Route } from 'react-router-dom';

import '../styles/styles.css';
import '../styles/loginmodal.css';
import '../styles/registermodal.css';
import '../styles/grid-list-toggle.css';
import '../styles/simple-sidebar.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faTh, faCoffee, faListUl } from '@fortawesome/free-solid-svg-icons';
library.add(faEnvelope, faKey, faTh, faCoffee, faListUl);

import Navbar from './Navbar.js';
import Content from './Content.js';
import Footer from './Footer.js';
import MinSide from './MinSide.js';
import NewCase from './NewCase.js';
import axios from 'axios';

axios.interceptors.response.use(response => response.data);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <div className="content-wrapper">
            <Route exact path="/" render={() => <Content />} />
            <Route exact path="/my-page" render={() => <MinSide />} />
            <Route exact path="/new-case" render={() => <NewCase />} />
            <Route exact path="/search/:query" component={Content} />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
