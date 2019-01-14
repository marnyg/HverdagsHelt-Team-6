
// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from '../services/CountyService'
import RegionService from '../services/RegionService'
import RegionSubscriptionService from '../services/RegionSubscriptionService'

class MyProfile extends Component<{}, { isEditing: boolean }> {
    // state = { isEditing: false };
    region = [];
    county = [];
    followedRegions = [];

    user = null
    render() {
        return <div>
            {this.getYourRegionListEllement("Dine Komuner", this.followedRegions, <button onClick={this.handleDelete}>remove</button>)}
            {this.getCountyListEllement("Fylker", this.county)}
            {this.getRegionListEllement("Komuner", this.region, <button onClick={this.handleAdd}>add</button>)}
        </div>

    }
    getYourRegionListEllement(headline: string, listItems: Array<{ name: string, id: number }>, button) {
        return <div>
            {headline}
            <ul>
                {listItems.map(e => {
                    return <li id={e.region_id}>{e.name} {button}</li>
                })}
            </ul>
        </div>
    }
    getCountyListEllement(headline: string, listItems: Array<{ name: string, id: number }>, button) {
        return <div>
            {headline}
            <ul>
                {listItems.map(e => {
                    return <li id={e.county_id} onClick={this.filterKomuner}>{e.name} {button}</li>
                })}
            </ul>
        </div>
    }
    getRegionListEllement(headline: string, listItems: Array<{ name: string, id: number }>, button) {
        return <div>
            {headline}
            < ul >
                {
                    listItems.map(e => {
                        return <li id={e.region_id}> {e.name} {button}</li>
                    })
                }
            </ul >
        </div >
    }
    filterKomuner(e) {
        let all = Array.prototype.slice.call(e.target.parentNode.children, 0);
        all.map(e => e.removeAttribute("class", "bg-dark"));
        e.target.setAttribute("class", "bg-dark")
        console.log("finltering on region with id " + e.target.id);


    }
    handleDelete(e) {
        console.log(e);
        console.log("delete " + e.target.parentNode.id);

        console.log("delete " + e.target.parentNode.id);
    }

    handleAdd(e) {
        console.log(e.target.parentNode);
        console.log("add " + e.target.parentNode.id);
    }
    mounted() {
        let b = new RegionService()
        let a = new CountyService()


        a.getAllCounties().then(res => this.county = res).catch()
        b.getAllRegions().then(res => this.region = res).catch()


    }
}

export default MyProfile
