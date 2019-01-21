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


class Subscriptions extends Component<{ props: { region_id: number }  }> {
  sub_temp=[];
  reg_temp=[];
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
            <NavLink to={'/case/' + j.case_id} className="preview">
              <div className='border' key={j.case_id}>
                <p><b>{j.title}</b></p>
                <p>Opprettet: {this.dateFormat(j.createdAt)}, oppdatert: {this.dateFormat(j.updatedAt)}</p>
                <p><i>{j.description}</i></p>
              </div>
            </NavLink>
          ))
        }</div>})}
        <div className='card-body'>
        <h1>Saker fra abonnerende kommuner:</h1>
          {this.subRegionCases().map(e => {
            return <div className='card-body'>
              <h1>{e[0].region_name}</h1>
              {e.map(j => (
                <NavLink to={'/case/' + j.case_id} className="preview">
                  <div className='border' key={j.case_id}>
                    <p><b>{j.title}</b></p>
                    <p>Opprettet: {this.dateFormat(j.createdAt)}, oppdatert: {this.dateFormat(j.updatedAt)}</p>
                    <p><i>{j.description}</i></p>
                  </div>
                </NavLink>
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

export default Subscriptions;
