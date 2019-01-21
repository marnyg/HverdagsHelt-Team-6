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
import RegionSubscriptionService from '../services/RegionSubscriptionService.js';
import RegionSubscription from '../classes/RegionSubscription.js';
import CaseService from '../services/CaseService.js';
import Notify from './Notify.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoginService from '../services/LoginService.js';
import { faBell, faCheck } from '@fortawesome/free-solid-svg-icons/index';

class Subscriptions extends Component<{ props: { region_id: number }  }> {
  sub_temp=[];
  subscriptions = [];
  regions = [];
  regionCases = [];
  user = JSON.parse(localStorage.getItem('user'));

  render() {
    if (!this.subscriptions) {
      return null;
    }

    return(
      <div>
        {this.sub_temp.map(e => {
          return <div className='card-body'>
            <h1>{e[0].region_name}</h1>
          {e.map(j => (
            <div className='border' key={j.case_id}>
              <NavLink to={'/case/' + j.case_id} className="preview">
                <p><b>{j.title}</b></p>
                <p>Opprettet: {this.dateFormat(j.createdAt)}, oppdatert: {this.dateFormat(j.updatedAt)}</p>
                <p><i>{j.description}</i></p>
              </NavLink>
              <button onClick={() => this.subscribe(j)} className={"btn btn-float-right"}>
                Abonner
              </button>
            </div>
          ))
        }</div>})}
        <div className='card-body'>
        {console.log('1: ', this.subRegionCases())}
        <h1>Saker fra abonnerende kommuner:</h1>
          {this.subRegionCases().map(e => {
            return <div className='card-body'>
              <h1>{e[0].region_name}</h1>
              {e.map(j => (
                <div className='border' key={j.case_id}>
                <NavLink to={'/case/' + j.case_id} className="preview">
                  <p><b>{j.title}</b></p>
                  <p>Opprettet: {this.dateFormat(j.createdAt)}, oppdatert: {this.dateFormat(j.updatedAt)}</p>
                  <p><i>{j.description}</i></p>
                </NavLink>
                  <button onClick={() => this.subscribe(j)} className={"btn btn-float-right"}>
                    Abonner
                  </button>
                </div>
              ))}
            </div>
          })}
        </div>
      </div>
    )
  }

  mounted() {
    let css = new CaseSubscriptionService();
    let rss = new RegionSubscriptionService();
    let cs = new CaseService();

    css
    .getAllSubscribedCasesGivenUser(this.user.user_id)
    .then((subscriptions: Case[]) => {
      this.subscriptions = subscriptions;
      console.log('Subscriptions: ', subscriptions)
    })
    .then(() => {
      this.divideSubscriptionCasesByRegion().map(index => {
        this.sub_temp.push(this.subscriptions.filter(sub => sub.region_id === index));
      })
    })
    .catch((error: Error) => console.error(error));

    rss
    .getSubscribedRegionsForUser(this.user.user_id)
    .then((regions: RegionSubscription[]) => {
      this.regions = regions.regions;
      JSON.stringify(this.regions);
      JSON.parse(JSON.stringify(this.regions));
    })
    .then(() => {
      this.regions.map(e => {
        cs
        .getAllCasesGivenRegionId(e.region_id)
        .then((regionCases: Case[]) => {
          this.regionCases.push(regionCases);
          JSON.stringify(this.regionCases);
          JSON.parse(JSON.stringify(this.regionCases));
        })
      })
    })
    .catch((error: Error) => console.error(error));
  }

  divideSubscriptionCasesByRegion() {
    let unique = [...new Set(this.subscriptions.map(item => item.region_id))];
    console.log('Unique subscription cases region_id: ', unique);
    return unique;
  }

  //For å fjerne abonnerenderegioner UTEN caser
  subRegionCases(){
    let res = this.regionCases.filter(e => e.length);
    return res;
  }

  dateFormat(date: string) {
    if (date) {
      let a = date.split('.')[0].replace('T', ' ');
      return a.substr(0, a.length - 3);
    } else {
      return 'Fant ikke dato.';
    }
  }

  subscribe(j: Case) {
    let subscriptionService = new CaseSubscriptionService();
    let r = this.subscriptions.filter(e => e.case_id === j.case_id);
    if(r.length > 0){
      console.log('Jihaaaa! ');
      j.subscribed = true;
    } else {
      console.log('Buhuu ');
      j.subscribed = false;
    }
    console.log('Her ', j.subscribed);
    if(j.subscribed === false){
      console.log('jippi ', j.subscribed);
      let subscription = new CaseSubscription(j.user_id, j.case_id, true, true);
      console.log('Sub: ', subscription);
      console.log('Hola! ', j.user_id + ' ' + j.case_id);
      subscriptionService.createCaseSubscription(subscription)
      .then((sub) => {
        j.subscribed = !j.subscribed;
      })
      .catch((error: Error) => console.error(error));
    } else if(j.subscribed === true) {
      console.log('Slett', j.subscribed);
      let loginService = new LoginService();
      loginService.isLoggedIn()
      .then((logged_in: Boolean) => {
        subscriptionService.deleteCaseSubscription(j.case_id, this.user.user_id)
        .then(res => {
          j.subscribed = !j.subscribed;
        })
        .catch((error: Error) => console.error());
      })
      .catch((error: Error) => console.error(error));
    }
  }
}

export default Subscriptions;
