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
import RegionService from "../services/RegionService";
import CountyService from "../services/CountyService";
import RegionSelect from "./RegionSelect";

class Content extends Component {
  grid = true;

  constructor() {
    super();
    Notify.flush();
  }

  render() {
      return (
          <div>
              <NavLink to={'/new-case'} className={'btn btn-primary btn-lg w-100 mb-3 megabutton'}>Registrer sak</NavLink>
              <RegionSelect
                  className={'mobile-region-select'}
                  classNameChild={'form-group'}
                  elementsMargin={'mb-3'}
                  selector_id={'mobile'}
                  onSubmit={(region_id) => this.props.onSubmit(region_id)}/>
              <div>
                  <div className="grid-list-control mb-3">
                      <div className="btn-toolbar mx-2" role="toolbar">
                          <div className="btn-group mr-2" role="group">
                              <button
                                  type="button"
                                  className={'btn btn-secondary'}
                                  onClick={() => (this.grid = true)}
                              >
                                  <FontAwesomeIcon icon={faTh} /> Grid
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={() => (this.grid = false)}>
                                  <FontAwesomeIcon icon={faListUl} /> List
                              </button>
                          </div>
                          <RegionSelect
                              className={'desktop-region-select'}
                              classNameChild={'form-inline'}
                              elementsMargin={'mr-2'}
                              selector_id={'desktop'}
                              onSubmit={(region_id) => this.props.onSubmit(region_id)}/>
                      </div>
                  </div>
                  <div className={'ml-3 mb-3'}>
                      <h4>Saker i {this.props.location.city} {this.props.location.region}</h4>
                  </div>
                  <div>
                      {this.grid ? (
                          <div className="content">
                              {this.props.cases.map(e => (
                                  <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.props.user}/>
                              ))}
                          </div>
                      ) : (
                          this.props.cases.map(e => <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.props.user}/>)
                      )}
                  </div>
              </div>
          </div>
      );
  }
}
export default Content;
