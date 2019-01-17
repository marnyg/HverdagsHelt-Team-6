// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import MyCases from './CaseList.js';
import MyProfile from './MyProfile';
import NewCase from './NewCase';
import MyRegions from './MyRegions'
import { NavLink } from 'react-router-dom';
import DisplayProfile from './DisplayProfile.js';

class MyPage extends Component {
  menuItems = [
    { name: 'Min Profil', component: <MyProfile />, selected: true },
    { name: 'Mine Komuner', component: <MyRegions />, selected: false },
    { name: 'Mine Saker', component: <MyCases user_id={JSON.parse(localStorage.getItem('user')).user_id} />, selected: false }
  ];

  element = this.menuItems[0];
  comp = <MyProfile />;
  render() {
    return (
      <div>
        <div className={'wrapper'}>
          <nav id="sidebar" className="nav flex-column bg-light">
            <div className="sidebar-header">
              <h2>Meny</h2>
            </div>

            <ul className="nav flex-column components">
              {this.menuItems.map(e => {
                if (e.selected === true) {
                  return (
                    <li className={'nav-item nav-link active'}
                      onClick={() => {
                        this.element.selected = false;
                        this.comp = e.component;
                        this.element = e;
                        this.element.selected = true;
                      }}>
                      {e.name}
                    </li>
                  );
                } else {
                  return (
                    <li className={'nav-item nav-link disabled'}
                      onClick={() => {
                        this.element.selected = false;
                        this.comp = e.component;
                        this.element = e;
                        this.element.selected = true;
                      }}>
                      {e.name}
                    </li>
                  );
                }
              })}
            </ul>
          </nav>
          {this.element.component}
        </div>
      </div>
    );
  }
}

export default MyPage;
