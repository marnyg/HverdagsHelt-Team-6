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
import { faPlus, faCheck, faTrashAlt, faKey, faTh, faCoffee, faListUl, faBell } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar.js';
import ContentWrapper from './ContentWrapper.js';
import Footer from './Footer.js';
import MyPage from './MyPage.js';
import ViewCase from './ViewCase.js';
import CaseList from './CaseList.js';
import NewCase from './NewCase.js';
import MyCases from './CaseList.js';
import Subscription from './Subscriptions.js';
import axios from 'axios';
import MyRegions from "./MyRegions";
import Notify from './Notify.js';
import Subscriptions from './Subscriptions.js';
import InfoPage from './InfoPage.js';
import About from './About.js';
import NoLocationPage from "./NoLocationPage";
import Notifications from './Notifications.js';
library.add(faPlus, faCheck, faTrashAlt, faKey, faTh, faCoffee, faListUl, faBell);
axios.interceptors.response.use(response => response.data);

class App extends Component {
  render() {
    let visited = JSON.parse(localStorage.getItem('visited'));
    if(!visited){
        localStorage.setItem('visited', JSON.stringify({visited: true}));
    }

    return (
      <BrowserRouter>
          <div className={'main-wrapper'}>
              <Navbar />
              <Route exact path="/my-page" render={() => <MyPage />} />
              <div className="content-wrapper">
                  <Notify />
                  {visited ? <Route exact path="/" render={() => <ContentWrapper />} /> : <Route exact path="/" render={() => <InfoPage/>}/>}
                  <Route exact path="/case/:case_id" render={() => <ViewCase/>} />
                  <Route exact path="/subscriptions" render={() => <Subscriptions/>} />
                  <Route exact path="/notifications" render={() => <Notifications/>} />
                  <Route exact path="/new-case" render={() => <NewCase />} />
                  <Route exact path="/search/:query" component={ContentWrapper} />
                  <Route exact path="/welcome" render={() => <InfoPage/>} />
                  <Route exact path="/about" render={() => <About/>} />
              </div>
              <Footer />
          </div>
      </BrowserRouter>
    );
  }
}
export default App;
