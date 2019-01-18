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
    { name: 'Min Profil', component: <MyProfile />, selected: true},
    { name: 'Mine Kommuner', component: <MyRegions />, selected: false},
    { name: 'Mine Saker', component: <MyCases user_id={JSON.parse(localStorage.getItem('user')).user_id} />, selected: false }
  ];

  element = this.menuItems[0];
  comp = <MyProfile />;
  render() {
    return (
        <div>
            <div>
                <ul className={'nav nav-tabs bg-light pl-3'}>
                        {this.menuItems.map(e => {
                            if (e.selected === true) {
                                return (
                                    <li className={'nav-item'}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => {
                                            this.element.selected = false;
                                            this.comp = e.component;
                                            this.element = e;
                                            this.element.selected = true;
                                        }}>
                                        <a className={'nav-link active'}>{e.name}</a>
                                    </li>
                                );
                            } else {
                                return (
                                    <li className={'nav-item'}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => {
                                            this.element.selected = false;
                                            this.comp = e.component;
                                            this.element = e;
                                            this.element.selected = true;
                                        }}>
                                        <a className={'nav-link disabled'}>{e.name}</a>
                                    </li>
                                );
                            }
                        })}
                    </ul>
            </div>
            <div>
                <div className={'w-100 py-5 px-2'}>
                    {this.element.component}
                </div>
            </div>
        </div>
    );
  }
}
export default MyPage;
