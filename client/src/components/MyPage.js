// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import { Route } from 'react-router-dom';
import CaseList from './CaseList.js';
import MyProfile from './MyProfile';
import NewCase from './NewCase';
import MyRegions from './MyRegions';
import { NavLink } from 'react-router-dom';
import DisplayProfile from './DisplayProfile.js';
import Statistics from './Statistics.js';
import Alert from './Alert.js';

/**
 * This component is representing the 'My page'-tab, where you will be able to navigate to
 * 'Min profil', 'Mine kommuner' and 'Mine saker'.
 */


class MyPage extends Component {
  menuItems = [
    { name: 'Min Profil', component: <MyProfile />, selected: true},
    { name: 'Mine Kommuner', component: <MyRegions />, selected: false},
    { name: 'Mine Saker', component: <CaseList user_id={JSON.parse(localStorage.getItem('user')).user_id} />, selected: false }
  ];
  error=null;   //To display error messages

  element = this.menuItems[0];
  comp = <MyProfile />;

    /**
     * Rendering the different options.
     * @returns {*} HTML element with different menu-options.
     */

  render() {
    return (
      <div>
        <div>
            <div>
                <ul className={'nav nav-tabs bg-light pl-3'}>
                    <NavLink className={'nav-link nav-item link-unstyled'} exact to={'/my-page/my-profile'}>Min Profil</NavLink>
                    <NavLink className={'nav-item nav-link link-unstyled'} exact to={'/my-page/my-regions'}>Mine Kommuner</NavLink>
                    <NavLink className={'nav-item nav-link link-unstyled'} exact to={'/my-page/my-cases'}>Mine Saker</NavLink>
                </ul>
            </div>
            <div>
                <div className={'w-100 py-5 px-2'}>
                    <Route exact path="/my-page/my-cases" render={() => <CaseList user_id={JSON.parse(localStorage.getItem('user')).user_id} />} />
                    <Route exact path="/my-page/my-regions" render={() => <MyRegions/>} />
                    <Route exact path="/my-page/my-profile" render={() => <MyProfile/>} />
                </div>
            </div>
        </div>
      </div>
    );
  }

  mounted() {
      $('#spinner').hide();
  }
}
export default MyPage;
