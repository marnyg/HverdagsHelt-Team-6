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
    return (
      <div className={'ml-2 pl-2'}>
        <div className={'card'}>
          <div className={'card-header'}> Dine kommuner</div>
          <table className={'table'}>
            <th itemScope={'col'}>#</th>
            <th itemScope={'col'}>Kommune</th>
            <th itemScope={'col'}>Få epost varsler</th>
            <th itemScope={'col'}>Slett fra varsler</th>
            <tbody>{this.getYourRegionListEllement('Dine Komuner', this.followedRegions)}</tbody>
          </table>
        </div>
        <div className={'card my-3'}>
          <div className={'card-header'}>Velg fylke:</div>
          {this.getCountyListEllement('Fylker', this.county)}
        </div>

        <div className={'card my-3'}>
          <div className={'card-header'}>Velg kommune:</div>
          {this.getRegionListEllement('Komuner', this.region)}
        </div>
      </div>
    );
  }

  getYourRegionListEllement(headline: string, listItems: Array<RegionSubscription>) {
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
            <button onClick={this.handleDelete} className={'btn btn-danger'}>
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

  getCountyListEllement(headline: string, listItems: Array<County>) {
    return (
      <div>
        <ul className={'list-group list-group-flush'}>
          {listItems.map(e => {
            return (
              <li className={'list-group-item '} id={e.county_id} onClick={this.filterKomuner}>
                {e.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  getRegionListEllement(headline: string, listItems: Array<{ name: string, id: number }>) {
    return (
      <div>
        <ul className={'list-group list-group-flush'}>
          {listItems.map(e => {
            return (
              <li key={e.region_id} className={'list-group-item'} id={e.region_id}>
                {e.name}
                <button className={'btn btn-primary float-right'} onClick={this.handleAdd} id={e.region_id}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  filterKomuner(e) {
    let id = Number.parseInt(e.target.id);
    console.log('finltering on region with id ' + id);
    this.regionService
      .getAllRegionGivenCounty(id)
      .then((regions: Region[]) => (this.region = regions))
      .catch((error: Error) => console.error(error));
  }

  handleDelete(e) {
    console.log('delete ' + e.target.parentNode.parentNode.id);
    console.log(e.target.parentNode.parentNode);
    console.log(e.target.parentNode.parentNode.parentNode);
    this.regSubService.deleteRegionSubscription(e.target.parentNode.parentNode.id, this.user.user_id).then(() => {
      this.userServise
        .getRegionSubscriptionsGivenUserId(this.user.user_id)
        .then(res => (this.followedRegions = res.regions));
    });
  }

  handleAdd(e) {
    let regionSub = new RegionSubscription(this.user.user_id, e.target.parentNode.id, true);
    console.log('add sub for user ' + this.user.user_id + ' to region ' + e.target.parentNode.id);
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
      .then(res => (this.followedRegions = res.regions))
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
