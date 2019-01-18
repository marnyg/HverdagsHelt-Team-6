//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

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
    if (this.location !== null){
        if(this.cases !== null && this.cases.length > 0){ // No response from the locationservice has been given, wait before showing
            return (
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
                        <div className={'ml-3 mb-3'}>
                            <h4>Saker i {this.location.city} {this.location.region}</h4>
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
        } else {
            return(
                <NoLocationPage location={this.location} onSubmit={(region_id) => this.onRegionSelected(region_id)}/>
            );
        }
    } else {
        return(
            <NoLocationPage location={this.location} onSubmit={(region_id) => this.onRegionSelected(region_id)}/>
        );
    }
  }

  mounted() {
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
            this.location = location;
            caseService.getCasesByLoc(location.city, location.region)
                .then((cases: Case[]) => {
                    let user = JSON.parse(localStorage.getItem('user'));
                    this.user = user;
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
      console.log('NoLocPageCallback, region_id:', region_id);
      let caseService = new CaseService();
      caseService.getCaseGivenRegionId(region_id)
          .then((cases: Case[]) => {
              console.log('NoLocationCallback cases:', cases);
              this.cases = cases;
          })
          .catch((error: Error) => console.error(error));
  }

}
export default Content;
