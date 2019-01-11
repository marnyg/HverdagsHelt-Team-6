// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import { MyCases } from './MyCases.js';
import NewCase from './NewCase';

class MinProfil extends Component {
  render() {
    return (
      <form classname="p-3">
        <div class="form-group row">
          <label for="staticEmail" class="col-sm-2 col-form-label">Email:</label>
          <div class="col-sm-10">
            <a type="text" class="form-control-plaintext" id="staticEmail" >Epost@a.no</a>
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">Navn:</label>
          <div class="col-sm-10">
            <a type="text" class="form-control-plaintext" id="inputPassword">Ola Norman</a>
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">Tlf:</label>
          <div class="col-sm-10">
            <a type="text" class="form-control-plaintext" id="inputPassword">123123</a>
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">Rolle?:</label>
          {/* <div class="col-"> */}
          <a id="inputPassword" class="col">Bruker</a>
          {/* </div> */}
        </div>
        <button className="btn btn-primary"> Rediger Profil</button>

      </form>
    );
  }
}

export default MinProfil;
