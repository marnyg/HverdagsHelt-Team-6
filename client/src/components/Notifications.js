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

class Notifications extends Component {
  temp=[];
  notifications = [
    {
      user_id: 1,
      region_id: 1,
      region_name: 'Lillestrøm',
      title: 'Her var det glatt gitt',
      createdAt: '10.07.1994',
      updatedAt: '10.07.2019',
      description: 'Må måkes plezz'
    },
    {
      user_id: 1,
      region_id: 2,
      region_name: 'Trondheim',
      title: 'Hola påræ!',
      createdAt: '10.07.1994',
      updatedAt: '10.07.2019',
      description: 'Må måkes plezz'
    },
    {
      user_id: 1,
      region_id: 1,
      region_name: 'Lillestrøm',
      title: 'Jaggumei jaggu',
      createdAt: '10.07.1994',
      updatedAt: '10.07.2019',
      description: 'Må måkes plezz'
    },
    {
      user_id: 1,
      region_id: 3,
      region_name: 'Frogner',
      title: 'Hurra hurra, bursdag bursdag',
      createdAt: '10.07.1994',
      updatedAt: '10.07.2019',
      description: 'Bare krims og krams'
    },
    {
      user_id: 1,
      region_id: 3,
      region_name: 'Lillestrøm',
      title: 'Berit er ute å cruiser på rolleblades igjen, hjølp!',
      createdAt: '10.07.1994',
      updatedAt: '10.07.2019',
      description: 'Bistand kreves'
    }
  ];

  user = JSON.parse(localStorage.getItem('user'));

  render() {
    if (!this.notifications) {
      return null;
    }

    return(
      <div>
        {this.temp.map(e => {
          return <div className='card-body'>
            <h1>{e[0].region_name}</h1>
          {e.map(j => (
            <div className='border' style={{ cursor: 'pointer' }} onClick={this.onClickCaseBlock}>
              <p><b>{j.title}</b></p>
              <p>Opprettet: {this.dateFormat(j.createdAt)}, oppdatert: {this.dateFormat(j.updatedAt)}</p>
              <p><i>{j.description}</i></p>
            </div>
          ))
        }</div>})}
      </div>
    )
  }

  mounted() {
    this.indexerRegion().map(index => {
      this.temp.push(this.notifications.filter(sub => sub.region_id === index));
    });
    console.log(this.temp);
    /*let caseSubscriptionService = new CaseSubscriptionService();
    caseSubscriptionService
    .getAllSubscribedCasesGivenUser(this.user.user_id)
    .then((subscriptions: Case[]) => {
      this.notifications = subscriptions;
      console.log('tabell: ', subscriptions)
    })
    .then(() => {
      this.indexerRegion().map(index => {
        this.temp.push(this.notifications.filter(sub => sub.region_id === index));
      })
    })
    .catch((error: Error) => console.error(error));*/
  }

  indexerRegion() {
    let unique = [...new Set(this.notifications.map(item => item.region_id))];
    console.log(unique);
    return unique;
  }

  onClickCaseBlock(event: SyntheticInputEvent<HTMLInputElement>) {
    if (event.target && event.target instanceof HTMLTableRowElement) {
      let case_id = this.notifications[event.target.parentElement].region_id;
      console.log(case_id);
      //this.props.history.push('/case/' + case_id);
      //this.props.history.push('/'); // Placeholder
    }
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
