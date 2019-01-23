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
import CaseItem from './CaseItem';


class Subscriptions extends Component<{ props: { region_id: number }  }> {
    sub_temp = [];
    subscriptions = [];
    regions = [];
    regionCases = [];
    user = JSON.parse(localStorage.getItem('user'));
    frase = null;

    render() {
      if (this.subscriptions.length === 0 && this.subRegionCases().length === 0) {
          return <div className = 'mt-4 ml-4'>
            <h1>Du har foreløpig ingen saks-abonnementer.</h1>
            <p>For å opprette et abonnement på en sak, trykk på den blå klokken,
            nederst i høyre hjørne av en sak. Saken vil da dukke opp under denne menyen</p>
          </div>
      }


        return(
            <div className={'mycarousel-wrapper'}>
                <div className={'mycarousel'}>
                    {this.sub_temp.map(e => {
                        return (
                            <div className='mt-5'>
                                <h3 className={'mycarousel-row-title'}>{e[0].region_name}</h3>
                                <div className={'mycarousel-row'}>
                                    {e.map(j => {
                                        j.subscribed = true;
                                        return(
                                            <div className={'mycarousel-tile'}>
                                                <CaseItem case={j} key={j.case_id} grid={true} user={this.user}/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <h1 className={'ml-5'}>Saker fra abonnerende kommuner:</h1>
                <div className={'mycarousel'}>
                {this.subRegionCases().length === 0 ?
                  <div className = 'mt-4 ml-4'>
                    <h3>Du har foreløpig ingen kommune-abonnementer.</h3>
                    <p>For å opprette et abonnement på en kommune, gå til Min side etterfulgt av Mine kommuner.
                    Du vil her kunne velge hvilke kommuner du ønsker å følge. Sakene for de respektive kommunene vil
                    da dukke opp under denne menyen</p>
                  </div>
                  : null}
                    {this.subRegionCases().map(e => {
                        return (
                            <div className='mycarousel-row'>
                                <h3 className={'mycarousel-row-title'}>{e[0].region_name}</h3>
                                {e.map(j => {
                                    j.subscribed = true;
                                    return(
                                        <div className={'mycarousel-tile'}>
                                            <CaseItem case={j} key={j.case_id} grid={true} user={this.user}/>
                                        </div>
                                    );
                                })}
                            </div>
                        );
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
    subRegionCases() {
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
}
export default Subscriptions;
