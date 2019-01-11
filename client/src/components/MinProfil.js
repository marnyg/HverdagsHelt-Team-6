// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import { MyCases } from './MyCases.js';
import NewCase from './NewCase';

class MinProfil extends Component {
  render() {
    return (
      <div className="card-body">
        <label for="navn"></label>
        <p id="navn">ola Norman</p>
      </div>
    );
  }
}

export default MinProfil;
