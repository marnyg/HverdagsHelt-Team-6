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

/**
 * This component is representing the user's notifications page.
 */

class Notifications extends Component {
  grid = true;  //Used to display cases in different view, depending on the user's preferences
  cases = [];   //Array of cases that there exists notifications on
  user = JSON.parse(localStorage.getItem('user'));  //Getting user information from the localStorage

    /**
     * If there is any new notifications those will be displayed in this element.
     * If there is no new notifications, the user will be presented with necessary information about
     * how to subscribe to cases.
     * @returns {*} HTML element containing information about case notifications, depending on the result.
     */

    render() {
        if(this.cases === undefined || this.cases === null) {
            return null;
        }
        if (this.cases.length === 0) {
            return (
                <div className={'container'}>
                    <h1>Vi vil holde deg oppdatert!</h1>
                    <p>
                        Alle våre ansatte gjør sitt yttertste for å løse dine saker. Så fort det oppstår endringer i din sak, eller
                        saker du har abonnert på, vil disse dukke opp på denne siden. Vennligst kom tilbake senere.
                    </p>
                    <p>
                        <strong>Vi i Hverdagshelter ønsker deg en fin dag videre!</strong>
                    </p>
                </div>
            );
        }

        return (
            <div>
                <NavLink to={'/new-case'} className={'btn btn-primary btn-lg w-100 mb-3 megabutton'}>
                    Registrer sak
                </NavLink>
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
                                    <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.user} />
                                ))}
                            </div>
                        ) : (
                            this.cases.map(e => <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.user} />)
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Getting all the cases that is outdated, to present new notifications for the user.
     */

    mounted() {
        $('#spinner').show();
        let caseSubscriptionService = new CaseSubscriptionService();
        caseSubscriptionService
            .getAllOutdatedCaseSubscriptions(this.user.user_id)
            .then((cases: Case[]) => {
                for (var i = 0; i < cases.length; i++) {
                    cases[i].subscribed = true;
                }
                this.cases = cases;
                console.log('tabell: ', cases);
                $('#spinner').hide();
            })
            .catch((error: Error) => {
                console.error(error);
                $('#spinner').hide();
            });
    }

    /**
     * Function to format the date properly.
     * @param date  Dateformat from the database. Used to convert to a more readable format.
     * @returns {string}    Date result returned on a more readable format.
     */

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
