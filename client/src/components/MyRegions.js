// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from '../services/CountyService';
import RegionService from '../services/RegionService';
import RegionSubscriptionService from '../services/RegionSubscriptionService';
import RegionSubscription from '../classes/RegionSubscription';
import County from '../classes/County';
import Region from '../classes/Region';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEnvelope, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons/index';
import UserService from '../services/UserService';



class MyRegions extends Component<{}, { isEditing: boolean }> {
    regionService = new RegionService();
    countyService = new CountyService();
    regSubService = new RegionSubscriptionService();
    userServise = new UserService();
    user = JSON.parse(localStorage.getItem('user'));
    region = [];
    county = [];
    followedRegions = []; //temp data
    subscribed = true;



    /**
    * Generates HTML code.
    * return {*} HTML Element with sub-elements.
    */
    render() {
        return (
            <div className={'container'}>
                <h2>Legg til kommuner du ønsker å få varsler fra.</h2>
                <div className={'text-muted mb-2'}>Trykk på brev-ikonet for også å få varsler på epost. Du vil få varsler på nye saker som publiseres i kommunen.</div>
                <div className={'row'}>
                    <div className={'col col-md'}>
                        <div className={'card'}>
                            <div className={'card-header'}> Dine kommuner</div>
                            <table className={'table'}>
                                <thead>
                                    <tr>
                                        <th itemScope={'col'}>#</th>
                                        <th itemScope={'col'}>Kommune</th>
                                        <th itemScope={'col'}>Få epost varsler</th>
                                        <th itemScope={'col'}>Slett fra varsler</th>
                                    </tr>
                                </thead>
                                <tbody>{this.getYourRegionListEllement()}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-md'}>
                        <div className={'card my-3'} style={{ maxHeight: '500px' }}>
                            <div className={'card-header'}>Velg fylke:</div>
                            {this.getCountyListEllement(this.county)}
                        </div>
                    </div>
                    <div className={'col-md'}>
                        <div className={'card my-3'}>
                            <div className={'card-header'}>Velg kommune:</div>
                            <div style={{ overflow: 'scroll' }}>{this.getRegionListEllement()}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
    * Generates HTML code for list of Regions
    * return {*} HTML Element with sub-elements.
    */

    getYourRegionListEllement() {
        return this.followedRegions.map((e, index) => { //listItems = this.followedRegions
            return (
                <tr id={e.region_id} key={e.region_id}>
                    <th itemScope={'row'}>{index + 1}</th>
                    <td>{e.region_name}</td>
                    <td className={'text-center'}>
                        {e.notify !== 1 ? (
                            <button className="btn btn-success" onClick={event => this.subscribe(event, e)}>
                                <FontAwesomeIcon
                                    id={'subscribe'}
                                    icon={faCheck}
                                    alt="Klikk her for å få varsler på epost om denne saker fra denne kommunen"
                                    className="float-right"
                                />
                            </button>
                        ) : (
                                <button className="btn btn-primary" onClick={event => this.subscribe(event, e)}>
                                    <FontAwesomeIcon
                                        id={'subscribe'}
                                        icon={faEnvelope}
                                        alt="Klikk her for å få varsler på epost om denne saker fra denne kommunen"
                                        className="float-right"
                                    />
                                </button>
                            )}
                    </td>
                    <td className={'text-center'}>
                        <button onClick={(event) => this.handleDelete(event, e)} className={'btn btn-danger'}>
                            <FontAwesomeIcon
                                id={'subscribe'}
                                icon={faTrashAlt}
                                alt="Klikk her for å fjerne denne kommunen fra dine fulgte kommuner"
                                className="float-right"
                            />
                        </button>
                    </td>
                </tr>
            );
        });
    }


    /**
    * Generates HTML code for list of counties
    * return {*} HTML Element with sub-elements.
    */
    getCountyListEllement(listItems: Array<County>) {
        return (
            <ul className={'list-group list-group-flush'} style={{ overflow: 'scroll' }}>
                {listItems.map(e => {
                    return (
                        <li key={e.county_id} className={'list-group-item'} id={e.county_id} onClick={this.filterRegions}>
                            {e.name}
                        </li>
                    );
                })}
            </ul>
        );
    }
    /**
    * Generates HTML code for list of regions
    * return {*} HTML Element with sub-elements.
    */
    getRegionListEllement() {
        return (
            <div>
                <ul className={'list-group list-group-flush'}>
                    {this.region.map(e => {
                        return (
                            <li key={e.region_id} className={'list-group-item'} id={e.region_id}>
                                {e.name}
                                <button className={'btn btn-primary float-right'} onClick={(event) => this.handleAdd(event, e)} id={e.region_id}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    /**
    * gets regions relevant to the chosen county
    */

    filterRegions(e) {
        console.log('filtering regions');
        let id = Number.parseInt(e.target.id);
        console.log('finltering on region with id ' + id);
        this.regionService
            .getAllRegionGivenCounty(id)
            .then((regions: Region[]) => {

                let asd = regions.filter(e => {

                    let l = this.followedRegions.filter(el => {
                        if (el.region_id == e.region_id) {
                            return true
                        }
                    })
                    return l.length == 0
                })
                this.region = asd;
            })
            .catch((error: Error) => console.error(error));
    }

    /**
     * handles click of delete buttons
    */


    handleDelete(event, e) {
        console.log('delete ', e);
        this.regSubService.deleteRegionSubscription(e.region_id, this.user.user_id)
            .then(() => {
                this.userServise.getRegionSubscriptionsGivenUserId(this.user.user_id)
                    .then(res => (this.followedRegions = res.regions))
                    .catch((error: Error) => console.error(error));
            })
            .catch((error: Error) => console.error(error));
    }

    /**
     * handles click of add buttons
    */
    handleAdd(event, e) {
        this.region.splice(this.region.indexOf(e), 1);
        let regionSub = new RegionSubscription(this.user.user_id, e.region_id, true);
        console.log('add sub for user ' + this.user.user_id + ' to region ' + e.region_id);
        this.regSubService.createRegionSubscription(regionSub, regionSub.region_id).then(() => {
            this.userServise
                .getRegionSubscriptionsGivenUserId(this.user.user_id)
                .then(res => (this.followedRegions = res.regions));
        });
    }

    /**
     * handles click of delete buttons
    */
    mounted() {
        this.countyService
            .getAllCounties()
            .then(res => {
                this.county = res.map(e => new County(e.county_id, e.name));
                for (let i = 0; i < this.county.length; i++) {
                    this.county[i].subscribed = false;
                }
            })
            .catch((error: Error) => console.error(error));
        this.userServise
            .getRegionSubscriptionsGivenUserId(this.user.user_id)
            .then(res => {
                for (let i = 0; i < res.regions.length; i++) {
                    res.regions.subscribed = false;
                }
                let regSubService = new RegionSubscriptionService();
                regSubService.getSubscribedRegionsForUser(this.user.user_id)
                    .then((regsub: RegionSubscription[]) => {
                        for (let i = 0; i < res.regions.length; i++) {
                            for (let j = 0; j < regsub.length; j++) {
                                if(regsub[j].region_id === res.regions[i].region_id) {
                                    res.regions[i].subscribed = true;
                                }
                            }
                        }
                        this.followedRegions = res.regions;
                    })
                    .catch((error: Error) => {
                        console.error(error);
                    });
            })
            .then(console.log(this.followedRegions));
    }

    /**
     * handles click of subscribe buttons
    */
    subscribe(event, region) {
        event.preventDefault();
        console.log('Subscribe to region');
        let regionSubService = new RegionSubscriptionService();
        let sub = new RegionSubscription(this.user.user_id, region.region_id, (region.notify !== 1));
        console.log(sub);
        regionSubService.updateRegionSubscription(sub, region.region_id)
            .then(res => {
                if(region.notify === 1) {
                    region.notify = 0;
                } else {
                    region.notify = 1;
                }
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    /**
     * handles click of delete buttons
    */
    delete(event, element) {
        event.preventDefault();
        console.log('Delete region sub');
    }
}

export default MyRegions;
