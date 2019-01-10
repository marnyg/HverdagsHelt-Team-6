import * as React from 'react';
import { Component } from 'react-simplified';

import CaseItem from './CaseItem.js';
//import CaseService from '../services/CaseServices.js'; REMOVE COMMENT WHEN SERVICES DONE
import LocationService from '../services/LocationService.js';
import Location from '../classes/Location.js';

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
        let locationService = new LocationService();
        locationService.getLocation()
            .then((location: Location) => {
                /* REMOVE COMMENT WHEN SERVICE DONE
                let caseService = new CaseService();
                caseService.getCasesByLoc(location)
                    .then((cases: Case[]) => {
                        this.cases = cases;
                    })
                    .catch((error: Error) => console.error(error));
                */
            })
            .catch(error => console.error(error));
        this.cases = [
            {
                case_id: 1,
                title: 'Dårlig måking',
                region: 'Trondheim',
                date: '10.01.2019'
            },
            {
                case_id: 2,
                title: 'Dårlig måking',
                region: 'Trondheim',
                date: '10.01.2019'
            },
            {
                case_id: 3,
                title: 'Dårlig måking',
                region: 'Trondheim',
                date: '10.01.2019'
            },
            {
                case_id: 4,
                title: 'Dårlig måking',
                region: 'Trondheim',
                date: '10.01.2019'
            },
            {
                case_id: 5,
                title: 'Dårlig måking',
                region: 'Trondheim',
                date: '10.01.2019'
            },
        ];
    }
}
export default Content;

