//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import CaseSubscriptionService from '../services/CaseSubscriptionService.js';
import Users from '../classes/User.js';

class Subscriptions extends Component<{ match: { params: { user_id: number } } }> {

  subscriptions = [
    {
      region_name: "Frogner",
      des: "Jaggu her var det bra måket!",
      user_id: 1,
      date: "10.12.2019",
      status: "Åpen",
      region_id: 1
    },
    {
      region_name: "Lillestrøm",
      des: "Dårlig måking",
      user_id: 1,
      date: "10.12.2019",
      status: "Åpen",
      region_id: 3
    },
    {
      region_name: "Lillestrøm",
      des: "Stusslig med måking",
      user_id: 2,
      date: "10.12.2019",
      status: "Åpen",
      region_id: 3
    }
  ];

  render() {
    if (!this.subscriptions) {
      return null;
    }
    return(
      <div>
        {this.subscriptions.filter(sub => sub.region_id).map(sub2 => (
          <div>
            <h1>{sub2.region_name}</h1>
            <p>{sub2.des}</p>
          </div>
        ))}
      </div>
    )
  }

  mounted() {
    let caseSubscriptionService = new CaseSubscriptionService();
    caseSubscriptionService
    .getAllCaseSubscriptions(this.props.match.params.user_id)
    .then(subscriptions => (this.subscriptions = subscriptions))
  }
}

export default withRouter(Subscriptions);
