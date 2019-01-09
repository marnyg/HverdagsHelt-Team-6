import * as React from 'react';
import { Component } from 'react-simplified';
import CaseItem from './CaseItem.js';
//import CaseService from '../services/CaseServices.js'; REMOVE COMMENT WHEN SERVICES DONE
import LocationService from '../services/LocationService.js';

class Content extends Component {
    cases = null;

    render() {
        if(!this.cases) return null;
        return (
            <div className="content">
                <button className="btn btn-secondary btn-sm toggle">List</button>
                {this.cases.map(e => (<CaseItem case={e}/>))}
            </div>
        );
    }

    mounted(){
        //let caseService = new CaseService();
        let locationService = new LocationService();
        locationService.getLocation()
            .then(location => console.log(location))
            .catch(error => console.error(error));
        this.cases = [];
    }
}
export default Content;

