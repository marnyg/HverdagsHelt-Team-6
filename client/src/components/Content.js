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

class Content extends Component {
  cases = null;
  grid = true;

  constructor() {
    super();
    Notify.flush();
  }

  render() {
    if (!this.cases) return null;
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

  mounted() {
    localStorage.setItem('token', 'mytokentest1234');
    let subsSercvice = new CaseSubscriptionService();
    subsSercvice.getAllCaseSubscriptions(1)
        .then(res => {console.log('Got a response')})
        .catch(error => console.error(error));

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
      locationService
        .getLocation()
        .then((location: Location) => {
          /*
            console.log("Location", location);
            let caseService = new CaseService();
            caseService.getCasesByLoc(location.city, location.region)
                .then((cases: Case[]) => {
                    console.log("Retreived cases");
                    this.cases = cases;
                })
                .catch((error: Error) => console.error(error));
                */
        })
        .catch(error => console.error(error));
    }

    this.cases = [
      {
        case_id: 1,
        title: 'Dårlig måking',
        region: 'Trondheim',
        date: '10.01.2019',
        description: 'Dårlig måking ved NTNU Kalvskinnget. Kommunen må få ut fingeren før noen slår seg.'
      },
      {
        case_id: 2,
        title: 'Dårlig måking',
        region: 'Trondheim',
        date: '10.01.2019',
        description: 'Dårlig måking ved NTNU Kalvskinnget. Kommunen må få ut fingeren før noen slår seg.'
      },
      {
        case_id: 3,
        title: 'Dårlig måking',
        region: 'Trondheim',
        date: '10.01.2019',
        description: 'Dårlig måking ved NTNU Kalvskinnget. Kommunen må få ut fingeren før noen slår seg.'
      },
      {
        case_id: 4,
        title: 'Dårlig måking',
        region: 'Trondheim',
        date: '10.01.2019',
        description: 'Dårlig måking ved NTNU Kalvskinnget. Kommunen må få ut fingeren før noen slår seg.'
      },
      {
        case_id: 5,
        title: 'Dårlig måking',
        region: 'Trondheim',
        date: '10.01.2019',
        description: 'Dårlig måking ved NTNU Kalvskinnget. Kommunen må få ut fingeren før noen slår seg.'
      }
    ];
  }
}
export default Content;
