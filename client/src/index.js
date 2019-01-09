// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { studentService } from './services';
// import { Home } from './Home'
// import { Navbar } from './Navbar'

const root = document.getElementById('root');

class Home extends Component {
  render() {
    return <div>dette er hovedsiden</div>;
  }
}

class Navbar extends Component {
  render() {
    return <div>detter er en navdr</div>;
  }
}

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Navbar />
      <Route exact path="/" component={Home} />
    </div>
  </BrowserRouter>,
  root
);
