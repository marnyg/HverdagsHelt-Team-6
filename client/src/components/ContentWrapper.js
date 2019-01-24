//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import LocationService from '../services/LocationService.js';
import CaseService from '../services/CaseService.js';
import Location from '../classes/Location.js';
import Notify from './Notify.js';
import CaseSubscriptionService from "../services/CaseSubscriptionService";
import CaseSubscription from "../classes/CaseSubscription";
import NoLocationPage from "./NoLocationPage";
import RegionService from "../services/RegionService";
import Content from './Content.js';
import ToolService from "../services/ToolService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight} from '@fortawesome/free-solid-svg-icons/index';

class ContentWrapper extends Component {
    cases = [];
    grid = true;
    region = null;
    limit = 20;
    page = 1;
    cant_find_loaction = null;
    logged_in = false;

    constructor() {
        super();
        Notify.flush();
    }

    render() {
        if (this.location){
            if(this.cases !== null && this.cases.length > 0){ // No response from the locationservice has been given, wait before showing
                $('#loader').hide();
                return (
                    <div>
                        <Content
                            user={this.user}
                            onSubmit={(region_id) => this.onRegionSelected(region_id)}
                            location={this.location}
                            cases={this.cases}
                            loadResults={(lim, offset) => this.loadResults()}
                            logged_in={this.logged_in}
                            onLogin={() => this.props.onLogin()}
                        />
                        {this.pageButtons()}
                    </div>
                );
            } else {
                if(this.cases !== null){ // cases.length === 0
                    $('#loader').hide();
                    return(
                        <div>
                            <Content
                                user={this.user}
                                onSubmit={(region_id) => this.onRegionSelected(region_id)}
                                location={this.location}
                                cases={this.cases}
                                logged_in={this.props.logged_in}
                                onLogin={() => this.props.onLogin()}
                            />
                            {this.pageButtons()}
                        </div>
                    );
                } else {
                    $('#loader').show();
                    return null;
                }
            }
        } else {
            if(this.cases !== null && this.cases.length > 0){
                $('#loader').hide();
                return(
                    <div>
                        <Content
                            user={this.user}
                            onSubmit={(region_id) => this.onRegionSelected(region_id)}
                            cases={this.cases}
                            logged_in={this.logged_in}
                            onLogin={() => this.props.onLogin()}
                        />
                        {this.pageButtons()}
                    </div>
                );
            } else {
                $('#loader').show();
                return null;
            }
        }
    }

    componentWillReceiveProps(newProps) {
        console.log('Contentwrapper received props, old:', this.props, ' new:', newProps);
        if(newProps.logged_in !== this.props.logged_in) {
            this.logged_in = newProps.logged_in;
            let user = JSON.parse(localStorage.getItem('user'));
            if(user && this.location) {
                this.fetch_cases(this.location, (cases: Case[]) => {
                    // resolved
                    this.fetch_subscriptions(user, (subs: CaseSubscription[]) => {
                        //resolved
                        this.cases = this.setSubscribedToCases(cases, subs);
                    }, (error: Error) => console.error(error))
                }, (error: Error) => console.error(error));
            }
            this.setState({
                logged_in: newProps.logged_in
            });
            console.log('CONTENTWRAPPER is now logged_in:', this.logged_in);
        }
    }

    fetch_cases(location: Location, resolve_cb, reject_cb) {
        let caseService = new CaseService();
        caseService.getCasesByLoc(location.city, location.region)
            .then((cases: Case[]) => {
                resolve_cb(cases);
            })
            .catch((error: Error) => {
                reject_cb(error);
            })
    }

    fetch_subscriptions(user: User, resolve_cb, reject_cb) {
        let subService = new CaseSubscriptionService();
        subService.getAllCaseSubscriptions(user.user_id)
            .then((subs: CaseSubscription[]) => {
                resolve_cb(subs);
            })
            .catch((error: Error) => reject_cb(error))
    }

    setSubscribedToCases(cases: Case[], subs: CaseSubscription[]) {
        for(let i = 0; i < cases.length; i++){
            for(let j = 0; j < subs.length; j++){
                if(subs[j].case_id === cases[i].case_id){
                    cases[i].subscribed = true;
                }
            }
        }
        return cases;
    }

    mounted() {
        $('#spinner').show();
        this.logged_in = this.props.logged_in;
        if (this.props.match && this.props.match.params && this.props.match.params.query) {
            // Redirected from search
            // Must render only search results

            let caseService = new CaseService();
            caseService.search(this.props.match.params.query)
                .then((cases: Case[]) => {
                    this.cases = cases;
                })
                .catch((error: Error) => console.error(error));
        } else {
            // Loaded by normal navigation
            let locationService = new LocationService();
            let caseService = new CaseService();
            let subService = new CaseSubscriptionService();
            locationService
                .getLocation()
                .then((location: Location) => {
                    location.region = ToolService.cleanQueryString(location.region);
                    location.city = ToolService.cleanQueryString(location.city);
                    this.location = location;
                    caseService.getCasesByLoc(location.city, location.region)
                        .then((cases: Case[]) => {
                            if(cases.length > 0){
                                this.region = cases[0].region_id;
                            }
                            let user = JSON.parse(localStorage.getItem('user'));
                            this.user = user;
                            if(user){
                                subService.getAllCaseSubscriptions(user.user_id)
                                    .then((subscriptions: CaseSubscription) => {
                                        for(let i = 0; i < cases.length; i++){
                                            for(let j = 0; j < subscriptions.length; j++){
                                                if(subscriptions[j].case_id === cases[i].case_id){
                                                    cases[i].subscribed = true;
                                                }
                                            }
                                        }
                                        //document.getElementsByClassName("loading")[0].style.display = "none";
                                        $('#spinner').hide();
                                        this.cases = cases;
                                    })
                                    .catch((error: Error) => {
                                        //document.getElementsByClassName("loading")[0].style.display = "none";
                                        $('#spinner').hide();
                                        this.cases = cases;
                                        console.error(error);
                                    });
                            } else {
                                //document.getElementsByClassName("loading")[0].style.display = "none";
                                $('#spinner').hide();
                                this.cases = cases;
                            }
                        })
                        .catch((error: Error) => {
                            console.error(error);
                            $('#spinner').hide();
                            this.cant_find_loaction = (
                                <NoLocationPage onSubmit={(region_id) => this.onRegionSelected(region_id)}/>
                            );
                        });
                })
                .catch(error => {
                    console.error(error);
                    $('#spinner').hide();
                    this.cant_find_loaction = (
                        <NoLocationPage onSubmit={(region_id) => this.onRegionSelected(region_id)}/>
                    );
                });
        }
    }

    onRegionSelected(region_id) {
        let regionService = new RegionService();
        regionService.getRegionGivenId(region_id)
            .then((region: Region) => {
                //   region_id: number;
                //   county_id: number;
                //   name: string;
                //   lat: number;
                //   lon: number;
                this.location = new Location(region.lat, region.lon, region.name, null, null);
                this.region = region.region_id;
            })
            .catch((error: Error) => console.error(error));

        let caseService = new CaseService();
        caseService.getCaseGivenRegionId(region_id)
            .then((cases: Case[]) => {
                this.cases = cases;
            })
            .catch((error: Error) => console.error(error));
    }

    loadResults(){
        console.log('Loading page: ', this.page);
        let caseService = new CaseService();
        caseService.getCasePageByRegion(this.limit, this.page, this.region)
            .then((cases: Case[]) => {
                this.cases = cases;
                console.log('Number of cases loaded:', this.cases.length);
            })
            .catch((error: Error) => console.error(error));
    }

    pageButtons() {
        return(
            <div className={'container mt-5'}>
                <div className={'row'}>
                    <div className={'col w-100 text-center'}>
                        <button className={'btn btn-primary w-100'} onClick={() => {
                            if(this.page !== 1) {
                                this.page--;
                                this.loadResults();
                            }
                        }}>
                            <FontAwesomeIcon icon={faCaretLeft}/>
                            &nbsp;Gå til forrige side
                        </button>
                    </div>
                    <div className={'col w-100 text-center'}>
                        <h2 className={'w-100'}>Side: {this.page}</h2>
                    </div>
                    <div className={'col w-100 text-center'}>
                        <button className={'btn btn-primary w-100'} onClick={() => {
                            this.page++;
                            this.loadResults()
                        }}>
                            Gå til neste side&nbsp;
                            <FontAwesomeIcon icon={faCaretRight}/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}
export default ContentWrapper;
