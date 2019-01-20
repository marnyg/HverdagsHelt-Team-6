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
import CaseItem from "./CaseItem";

class Subscriptions extends Component {
    temp=[];
    subscriptions = [];
    user = JSON.parse(localStorage.getItem('user'));

    render() {
        if (!this.subscriptions) {
            return null;
        }

        return(
            <div className={'mycarousel-wrapper'}>
                <div className={'mycarousel'}>
                    {this.temp.map(e => {
                        return(
                            <div className={'mt-5'}>
                                <h1 className={'mycarousel-row-title'}>{e[0].region_name}</h1>
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
            </div>
        );
    }

    mounted() {
        console.log('Subscriptions found user:', this.user);
        let css = new CaseSubscriptionService();
        let rss = new RegionSubscriptionService();
        css
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
