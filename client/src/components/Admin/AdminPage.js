//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegions from "./AdminRegions";
import AdminTeams from "./AdminTeams";
import Navigation from "../Navigation";
import RegionRegistration from "./RegionRegistration";

class AdminPage extends Component {
    render() {
        let regions_tab = {
            path:'/admin/regions',
            name: 'Kommuner',
            component: <AdminRegions/>
        };
        let teams_tab = {
            path:'/admin/teams',
            name:'Kommuneansatte',
            component: <AdminTeams/>
        };

        let registration_tab = {
            path:'/admin/registration',
            name:'Kommuneregistrering',
            component: <RegionRegistration/>
        };
        let left_tabs = [regions_tab, teams_tab];
        let right_tabs = [registration_tab];
        return(
            <div>
                <Navigation left_tabs={left_tabs} right_tabs={right_tabs}/>
            </div>
        );
    }
}
export default AdminPage;