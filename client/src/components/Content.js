//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

import CaseItem from './CaseItem.js';
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
import LoginModal from './LoginModal';

/**
 * This component is used to display given cases on the webpage.
 */

class Content extends Component {
  grid = true;
  filter_error = null;

  /**
   * Overrides default constructor. Flushes/removes any previous notifications from the Notify component.
   */
  constructor() {
    super();
    Notify.flush();
  }

    /**
     * The render method is rendering the cases on the webpage.
     * @returns {*} HTML element containing table of cases.
     */

  render() {
      let registerButton = null;
      let user = JSON.parse(localStorage.getItem('user'));
      if(user === null){
          registerButton = (
              <div className={'text-center'}>
                  <div className="btn btn-primary btn-lg w-100 mb-3 megabutton" style={{cursor: 'pointer'}} data-toggle="modal" data-target="#content-login">
                      Registrer sak
                  </div>
                  <LoginModal modal_id={'content-login'} onLogin={() => this.props.onLogin()} />
              </div>
          );
      } else {
          registerButton = (
              <div className={'text-center'}>
                    <NavLink to={'/new-case'} className={'btn btn-primary btn-lg w-100 mb-3 megabutton'}>Registrer sak</NavLink>
              </div>
          );
      }
      return (
          <div className={'container'}>
              {registerButton}
              {this.filter_error}
              <RegionSelect
                  className={'mobile-region-select'}
                  classNameChild={'form-group'}
                  elementsMargin={'mb-3'}
                  selector_id={'mobile'}
                  onSubmit={(region_id) => this.props.onSubmit(region_id)}
                  onFilterError={(error) => this.filter_error = error}
              />
              <div>
                  <div className="grid-list-control mb-3">
                      <div className="btn-toolbar mx-2" role="toolbar">
                          <div className="btn-group mr-2" role="group">
                              <button
                                  type="button"
                                  className={'btn btn-secondary grid-list-swapper'}
                                  onClick={() => (this.grid = true)}
                              >
                                  <FontAwesomeIcon icon={faTh} /> Grid
                              </button>
                              <button type="button" className="btn btn-secondary grid-list-swapper" onClick={() => (this.grid = false)}>
                                  <FontAwesomeIcon icon={faListUl} /> List
                              </button>
                          </div>
                          <RegionSelect
                              className={'desktop-region-select'}
                              classNameChild={'form-inline'}
                              elementsMargin={'mr-2'}
                              selector_id={'desktop'}
                              onSubmit={(region_id) => this.props.onSubmit(region_id)}
                              onFilterError={(error) => this.filter_error = error}
                          />
                      </div>
                  </div>
                  {this.props.location ?
                      <div className={'ml-3 mb-3'}>
                          <h4>Saker i {this.props.location.city} {this.props.location.region}</h4>
                      </div>:null}
                  <div>
                      {this.grid ? (
                          <div className="content">
                              {this.props.cases.map(e => (
                                  <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.props.user} logged_in={this.props.logged_in}/>
                              ))}
                          </div>
                      ) : (
                          <div className={''}>
                              {this.props.cases.map(e => <CaseItem case={e} key={e.case_id} grid={this.grid} user={this.props.user} logged_in={this.props.logged_in}/>)}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }
}
export default Content;
