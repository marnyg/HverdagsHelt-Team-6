//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import CaseSubscriptionService from '../services/CaseSubscriptionService.js';
import CaseSubscription from '../classes/CaseSubscription.js';
import Users from '../classes/User.js';
import RegionService from '../services/RegionService.js';

class Subscriptions extends Component {
  temp=[];
  subscriptions = [
    {
      title: 'Trondheim smiler i sola',
      description: 'Dårlig måking',
      created_at: '10.07.2018',
      updated_at: '11.07.2018',
      region_id: 3
    },
    {
      title: 'Bilen min er nedsnødd i Trondheim',
      description: 'Må måkes',
      created_at: '10.07.2018',
      updated_at: '11.07.2018',
      region_id: 4
    },
    {
      title: 'Frogner er flott på vintern!',
      description: 'Høvlig ok måking',
      created_at: '10.07.2018',
      updated_at: '11.07.2018',
      region_id: 2
    },
    {
      title: 'Hurra det er flott på vintern!',
      description: 'Høvlig ok måking',
      created_at: '10.07.2018',
      updated_at: '11.07.2018',
      region_id: 1
    },
    {
      title: 'Hurra det er flott på vintern!',
      description: 'Høvlig ok måking',
      created_at: '10.07.2018',
      updated_at: '11.07.2018',
      region_id: 1
    }
  ];

  render() {
    if (!this.subscriptions) {
      return null;
    }

    return(
      <div>
        {this.temp.map((e, i) => (
          <div>
            <h1>{this.temp[i][0].region_id}</h1>
            <p>Opprettet: {this.temp[i][0].created_at}, Oppdatert: {this.temp[i][0].updated_at}</p>
            <p><b>{this.temp[i][0].title}</b></p>
            <p><i>{this.temp[i][0].description}</i></p>
          </div>
        ))}
      </div>
    )
  }


  mounted() {
    this.indexerRegion().map(index => {
      this.temp.push(this.subscriptions.filter(sub => sub.region_id === index));
    });
    console.log('hei');
    //console.log(this.temp);

    let caseSubscriptionService = new CaseSubscriptionService();
    caseSubscriptionService
    .getAllCaseSubscriptions(1)
    /*.then((subscriptions: CaseSubscription[]) => {
      this.subscriptions = subscriptions;
      console.log(subscriptions);
    })*/
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

  subCases(){
    let region_ids = this.indexerRegion();
    console.log('heer');
    console.log(region_ids);
    let res = this.subscriptions.filter(cases => region_ids === cases.region_id);
    console.log('hei');
    console.log(res);
    return res;
  }

}

/*
{this.subscriptions.filter(sub => sub.region_id).map(sub2 => (
  <div>
    <h1>{sub2.region_name}</h1>
    <p>{sub2.des}</p>
  </div>
))}
{this.subscriptions.filter((name, i, subscriptions) => subscriptions.indexOf(name) == i).map(sub => (
  <div>
    <h1>{sub.region_name}</h1>
    <p>{sub.des}</p>
  </div>
))}
<p>Opprettet: {this.subscriptions[i].created_at}, Oppdatert: {this.subscriptions[i].updated_at}</p>
<p><i>{this.subscriptions[i].description}</i></p>
{this.subscriptions.map((sub, i) => (
  <div>
    <h1>{this.subscriptions[i].region_id}</h1>
  </div>
))}
{this.subscriptions.map((sub, i) => (
  <div>
  <p>Opprettet: {this.subscriptions[i].created_at}, Oppdatert: {this.subscriptions[i].updated_at}</p>
  <p><i>{this.subscriptions[i].description}</i></p>
  </div>
))}

/MARIUSKODE
indexListe.map(index=> {
  relevantcasse=subscriptions.filter(sub=> sub.region_id===index)
} )
*/

/*<div>
  <h1>{this.subscriptions[i].region_id}</h1>
</div>

{this.temp.map((e, i) => (
  <div>

  </div>
))}

{this.temp.map((e, row) => (
  this.temp.map((j, col) => (
    <div>
      <h1>{this.temp[row][col].region_id}</h1>
      <p>Opprettet: {this.temp[row][col].created_at}, Oppdatert: {this.temp[row][col].updated_at}</p>
      <p><b>{this.temp[row][col].title}</b></p>
      <p><i>{this.temp[row][col].description}</i></p>
    </div>
  ))
))}

{this.temp.map((e, i) => (
  <div>
    <h1>{this.temp[i][0].region_id}</h1>
    <p>Opprettet: {this.temp[i][0].created_at}, Oppdatert: {this.temp[i][0].updated_at}</p>
    <p><b>{this.temp[i][0].title}</b></p>
    <p><i>{this.temp[i][0].description}</i></p>
  </div>
))}

<div>
  <h1>{this.subscriptions[i].region_id}</h1>
</div>

  <h1>{this.subscriptions[index].title}</h1>
  <p>Opprettet: {this.subscriptions[index].created_at}, Oppdatert: {this.subscriptions[index].updated_at}</p>
  <p><i>{this.subscriptions[index].description}</i></p>
*/

export default withRouter(Subscriptions);
