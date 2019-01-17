//@flow
import * as React from 'react';
import { Component } from 'react-simplified';

import CaseItem from './CaseItem.js';
//import CaseService from '../services/CaseServices.js'; REMOVE COMMENT WHEN SERVICES DONE
import LocationService from '../services/LocationService.js';
import CaseService from '../services/CaseService.js';
import Location from '../classes/Location.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faTh } from '@fortawesome/free-solid-svg-icons/index';
import Notify from './Notify.js';
import CaseSubscriptionService from "../services/CaseSubscriptionService";
import CaseSubscription from "../classes/CaseSubscription";
import NoLocationPage from "./NoLocationPage";

class Content extends Component {
  cases = null;
  grid = true;
  location = null;

  constructor() {
    super();
    Notify.flush();
  }

  render() {
    console.log('Content rendering');
    if (this.cases === null || this.cases === undefined){
        if(this.location !== null || this.location !== undefined){ // No response from the locationservice has been given, wait before showing
            console.log('No Location');
            return (
                <NoLocationPage location={this.location} onSubmit={(region_id) => this.onRegionSelected(region_id)}/>
            );
        } else {
            return(
                <h1>Waiting for location</h1>
            );
        }
    } else {
        return (
            <div>
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
                                    <CaseItem case={e} key={e.case_id} grid={this.grid} />
                                ))}
                            </div>
                        ) : (
                            this.cases.map(e => <CaseItem case={e} key={e.case_id} grid={this.grid} />)
                        )}
                    </div>
                </div>
            </div>
        );
    }
  }

  mounted() {
    console.log('Content mounted');
    if (this.props.match && this.props.match.params) {
      // Redirected from search
      // Must render only search results
      console.log(this.props.match.params);
      /* REMOVE COMMENT WHEN CaseService and Case class DONE!
            let caseService = new CaseService();
            caseService.search(this.props.params.query)
                .then((cases) => this.cases = cases)
                .catch((error: Error) => console.error(error));
            */
    } else {
      // Loaded by normal navigation
      let locationService = new LocationService();
      let caseService = new CaseService();
      let subService = new CaseSubscriptionService();
      locationService
        .getLocation()
        .then((location: Location) => {
            console.log('Found location!', location);
            this.location = location;
            caseService.getCasesByLoc(location.city, location.region)
                .then((cases: Case[]) => {
                    console.log('Found cases:', cases, ' Region: ', location.city, location.region);
                    let user = JSON.parse(localStorage.getItem('user'));
                    if(user){
                        subService.getAllCaseSubscriptions(user.user_id)
                            .then((subscriptions: CaseSubscription) => {
                                for(let i = 0; i < cases.length; i++){
                                    for(let j = 0; j < subscriptions.length; j++){
                                        if(subscriptions[j].case_id === cases[i].case_id){
                                            cases[i].subscribed = true;
                                        }
                                    }
                                }
                                //document.getElementsByClassName("loading")[0].style.display = "none";
                                this.cases = cases;
                            })
                            .catch((error: Error) => {
                                //document.getElementsByClassName("loading")[0].style.display = "none";
                                this.cases = cases;
                                console.error(error);
                            });
                    } else {
                        //document.getElementsByClassName("loading")[0].style.display = "none";
                        this.cases = cases;
                    }
                })
                .catch((error: Error) => console.error(error));
        })
        .catch(error => console.error(error));
    }
  }

  onRegionSelected(region_id) {
      console.log('Region selected', region_id);
      let caseService = new CaseService();
      caseService.getAllCasesGivenRegionId(region_id)
          .then((cases: Case[]) => {
              console.log('Cases: ', cases);
              this.location = new Location();
              this.cases = cases;
          })
          .catch((error: Error) => console.error(error));
  }

}
export default Content;
