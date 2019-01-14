
// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from '../services/CountyService'
import RegionService from '../services/RegionService'
import RegionSubscriptionService from '../services/RegionSubscriptionService'
import RegionSubscription from '../classes/RegionSubscription'
import County from '../classes/County'
import Region from '../classes/Region'

class MyProfile extends Component<{}, { isEditing: boolean }> {
    regionService = new RegionService()
    countyService = new CountyService()
    regSubService = new RegionSubscriptionService()
    userid = 1;
    region = [];
    county = [];
    followedRegions = [{ name: 'asd', region_id: 'asdas' }];//temp data 

    render() {
        return <div>
            {this.getYourRegionListEllement("Dine Komuner", this.followedRegions)}
            {this.getCountyListEllement("Fylker", this.county)}
            {this.getRegionListEllement("Komuner", this.region)}
        </div>

    }
    getYourRegionListEllement(headline: string, listItems: Array<RegionSubscription>) {
        return <div>
            {headline}
            <ul>
                {listItems.map(e => {
                    return <li id={e.region_id}>{e.name}
                        <input type="checkbox" id="notify"></input>
                        <button onClick={this.handleDelete}>remove</button>
                    </li>
                })}
            </ul>
        </div>
    }
    getCountyListEllement(headline: string, listItems: Array<County>) {
        return <div>
            {headline}
            <ul>
                {listItems.map(e => {
                    return <li id={e.county_id} onClick={this.filterKomuner}>{e.name} </li>
                })}
            </ul>
        </div>
    }
    getRegionListEllement(headline: string, listItems: Array<{ name: string, id: number }>) {
        return <div>
            {headline}
            < ul >
                {
                    listItems.map(e => {
                        return <li id={e.region_id}> {e.name} <button onClick={this.handleAdd}>add</button></li>
                    })
                }
            </ul >
        </div >
    }
    filterKomuner(e) {
        let all = Array.prototype.slice.call(e.target.parentNode.children, 0);
        all.map(e => e.removeAttribute("class", "bg-dark"));
        e.target.setAttribute("class", "bg-dark")
        let id = Number.parseInt(e.target.id)
        console.log("finltering on region with id " + id);

        this.regionService.getAllRegionGivenCounty(id)
            .then(res => this.region = res.map(e => new Region(e.region_id, e.county_id, e.name, e.lat, e.lon)))

    }

    handleDelete(e) {
        console.log(e);
        console.log("delete " + e.target.parentNode.id);
        console.log("delete " + e.target.parentNode.id);
    }

    handleAdd(e) {
        let regionSub = new RegionSubscription(this.userid, e.target.parentNode.id, true)
        console.log("add sub for user " + this.userid + " to region " + e.target.parentNode.id);
        this.regSubService.createRegionSubscription(regionSub, regionSub.id)
    }
    mounted() {
        this.countyService.getAllCounties().then(res => this.county = res.map(e => new County(e.county_id, e.name))).catch()
        this.regionService.getAllRegions().then(res => this.region = res.map(e => new Region(e.region_id, e.county_id, e.name, e.lat, e.lon))).catch()
    }
}

export default MyProfile
