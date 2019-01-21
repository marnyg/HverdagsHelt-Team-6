//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import CaseSubscriptionService from '../services/CaseSubscriptionService.js';
import CaseSubscription from '../classes/CaseSubscription.js';
import User from '../classes/User.js';
import RegionService from '../services/RegionService.js';
import Case from '../classes/Case.js';
import Region from '../classes/Region.js';
import ViewCase from './ViewCase.js';
import { Redirect } from 'react-router-dom';
import Notify from './Notify.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CaseItem from './CaseItem.js';
import { faListUl, faTh } from '@fortawesome/free-solid-svg-icons/index';

class Notifications extends Component {
  grid = true;
  cases = null;
  user = JSON.parse(localStorage.getItem('user'));

  render() {
    if (!this.cases) {
      return null;
    }

    return(
        <div>
            <NavLink to={'/new-case'} className={'btn btn-primary btn-lg w-100 mb-3 megabutton'}>Registrer sak</NavLink>
            <div>
                <div className="d-none d-sm-block">
                    <div className="btn-toolbar my-3 mx-2" role="toolbar">
                        <div className="btn-group mr-2" role="group">
                            <button
                                type="button"
                                className={this.grid ? 'btn btn-secondary' : 'btn btn-secondary'}
                                onClick={() => (this.grid = true)}
                            >
                                <FontAwesomeIcon icon={faTh} /> Grid
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => (this.grid = false)}>
                                <FontAwesomeIcon icon={faListUl} /> List
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    {this.grid ? (
                        <div className="content">
                            {this.cases.map(e => (
                                <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.user}/>
                            ))}
                        </div>
                    ) : (
                        this.cases.map(e => <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.user}/>)
                    )}
                </div>
            </div>
        </div>
    );
  }

  mounted() {
      console.log('Notifications found user:', this.user);
    let caseSubscriptionService = new CaseSubscriptionService();
    caseSubscriptionService
    .getAllOutdatedCaseSubscriptions(this.user.user_id)
    .then((cases: Case[]) => {
      for (var i = 0; i < cases.length; i++) {
        cases[i].subscribed = true;
      }
      this.cases = cases;
      console.log('tabell: ', cases)
    })
    .catch((error: Error) => console.error(error));
  }

  dateFormat(date: string) {
    if (date) {
      let a = date.split('.')[0].replace('T', ' ');
      return a.substr(0, a.length - 3);
    } else {
      return 'Fant ikke dato.';
    }
  }
}

export default Notifications;
