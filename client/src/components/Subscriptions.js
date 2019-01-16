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

class Subscriptions extends Component {
  temp=[];
  subscriptions = [];
  user = JSON.parse(localStorage.getItem('user'));

  render() {
    if (!this.subscriptions) {
      return null;
    }

    return(
      <div>
        {this.temp.map(e => {
          return <div>
            <h1>{e[0].region_name}</h1>
          {e.map(j => (
            <div className='border'>
              <p><b>{j.title}</b></p>
              <p>Opprettet: {j.created_at}, Oppdatert: {j.updated_at}</p>
              <p><i>{j.description}</i></p>
            </div>
          ))
        }</div>})}
      </div>
    )
  }

  mounted() {
    let caseSubscriptionService = new CaseSubscriptionService();
    caseSubscriptionService
    .getAllSubscribedCasesGivenUser(this.user.user_id)
    .then((subscriptions: Case[]) => {
      this.subscriptions = subscriptions;
      console.log('tabell: ', subscriptions)
    })
    .then(() => {
      this.indexerRegion().map(index => {
        this.temp.push(this.subscriptions.filter(sub => sub.region_id === index));
      })
    })
    .catch((error: Error) => console.error(error));
  }

  indexerRegion() {
    let unique = [...new Set(this.subscriptions.map(item => item.region_id))];
    console.log(unique);
    return unique;
  }

  toRegionName(region_id: number){
    let regionService = new RegionService();
    return regionService.getRegion(region_id);
  }
}

export default Subscriptions;
