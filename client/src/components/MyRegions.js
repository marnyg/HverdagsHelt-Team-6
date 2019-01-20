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

  render() {
      let overflowstyle = {
          'overflow': 'scroll',
          '-webkit-overflow-scrolling': 'touch'
      };
      return (
          <div className={'container'}>
              <div className={'row'}>
                  <div className={'col col-md'}>
                      <div className={'card'}>
                          <div className={'card-header'}> Dine kommuner</div>
                          <table className={'table'}>
                              <th itemScope={'col'}>#</th>
                              <th itemScope={'col'}>Kommune</th>
                              <th itemScope={'col'}>Få epost varsler</th>
                              <th itemScope={'col'}>Slett fra varsler</th>
                              <tbody>{this.getYourRegionListEllement(this.followedRegions)}</tbody>
                          </table>
                      </div>
                  </div>
              </div>
              <div className={'row'}>
                  <div className={'col-md'}>
                      <div className={'card my-3'} style={{maxHeight: '500px'}}>
                          <div className={'card-header'}>Velg fylke:</div>
                          {this.getCountyListEllement(this.county)}
                      </div>
                  </div>
                  <div className={'col-md'}>
                      <div className={'card my-3'}>
                          <div className={'card-header'}>Velg kommune:</div>
                          <div style={{overflow: 'scroll'}}>{this.getRegionListEllement()}</div>
                      </div>
                  </div>
              </div>
          </div>
    );
  }

  getYourRegionListEllement(listItems: RegionSubscription[]) {
    return listItems.map((e, index) => {
      return (
        <tr id={e.region_id} key={e.region_id}>
          <th itemScope={'row'}>{index + 1}</th>
          <td>{e.region_name}</td>
          <td className={'text-center'}>
            {e.subscribed === true ? (
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
  getCountyListEllement(listItems: Array<County>) {
    return (
        <ul className={'list-group list-group-flush'} style={{overflow: 'scroll'}}>
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

  filterRegions(e) {
      console.log('filtering regions');
    let id = Number.parseInt(e.target.id);
    console.log('finltering on region with id ' + id);
    this.regionService
      .getAllRegionGivenCounty(id)
      .then((regions: Region[]) => {
          this.region = regions;
      })
      .catch((error: Error) => console.error(error));
  }

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

  handleAdd(event, e) {
    this.region.splice( this.region.indexOf(e), 1 );
    let regionSub = new RegionSubscription(this.user.user_id, e.region_id, true);
    console.log('add sub for user ' + this.user.user_id + ' to region ' + e.region_id);
    this.regSubService.createRegionSubscription(regionSub, regionSub.region_id).then(() => {
      this.userServise
        .getRegionSubscriptionsGivenUserId(this.user.user_id)
        .then(res => (this.followedRegions = res.regions));
    });
  }
  mounted() {
    this.countyService
      .getAllCounties()
      .then(res => {
        this.county = res.map(e => new County(e.county_id, e.name));
        for (let i = 0; i < this.county.length; i++) {
          this.county[i].subscribed = true;
        }
      })
      .catch((error: Error) => console.error(error));
    this.userServise
      .getRegionSubscriptionsGivenUserId(this.user.user_id)
      .then(res => {
          this.followedRegions = res.regions;
      })
      .then(console.log(this.followedRegions));
  }

  subscribe(event, element) {
    event.preventDefault();
    console.log('Subscribe to region');
    element.subscribed = !element.subscribed;
  }

  delete(event, element) {
    event.preventDefault();
    console.log('Delete region sub');
  }
}

export default MyRegions;
