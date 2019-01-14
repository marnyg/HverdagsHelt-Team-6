// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import MyCases from './CaseList.js';
import MyProfile from './MyProfile';
import NewCase from './NewCase';
import { NavLink } from 'react-router-dom';

class MyPage extends Component {
  menuItems = [
    { name: 'Min Profil', component: <MyProfile /> },
    { name: 'Min Profil', component: <MyProfile /> },
    { name: 'Min Profil', component: <MyProfile /> },
    { name: 'Min Profil', component: <MyProfile /> },
    { name: 'Mine Saker', component: <MyCases /> }
  ];

  comp = <MyProfile />;
  render() {
    return (
      <div className="wrapper">
        <nav id="sidebar" className="bg-danger ">
          <div className="sidebar-header">
            <h2>Sidebar</h2>
          </div>

          <ul className="list-unstyled components">
            {this.menuItems.map(e => {
              return (
                <li>
                  <button
                    className={'btn btn-secondary'}
                    onClick={() => {
                      this.comp = e.component;
                    }}
                  >
                    {e.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {this.comp}
      </div>
    );
  }
}

export default MyPage;
