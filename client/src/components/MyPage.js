// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import { MyCases } from './MyCases.js';
import MyProfile from './MyProfile';
import MyProfileEdit from './MyProfileEdit';
import NewCase from './NewCase';
import { NavLink } from 'react-router-dom';

class MyPage extends Component {
  comp = <MyProfile />;
  render() {
    return (
      <div className="wrapper">
        <nav id="sidebar" className="bg-danger ">
          <div className="sidebar-header">
            <h2>Sidebar</h2>
          </div>

          <ul className="list-unstyled components">
            <li>
              <button
                onClick={() => {
                  this.comp = <MyProfile />;
                }}
                className={'btn btn-secondary'}
              >
                Min Profil
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  this.comp = <MyProfileEdit />;
                }}
                className={'btn btn-secondary'}
              >
                Kommuner
              </button>
            </li>
            <li>
              {' '}
              <button
                onClick={() => {
                  this.comp = <MyCases user_id={1} />;
                }}
                className={'btn btn-secondary'}
              >
                Mine Saker
              </button>
            </li>
          </ul>
        </nav>
        {this.comp}
      </div>
    );
  }
}

export default MyPage;
