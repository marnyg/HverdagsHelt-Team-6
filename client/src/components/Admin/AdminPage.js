//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegions from "./Regions/AdminRegions";
import AdminTeams from "./Employees/AdminTeams";
import Navigation from "../Navigation";
import RegionRegistration from "./RegionRegistration/RegionRegistration";
import AccessLevels from "./AccessLevel/AccessLevels";
import StatusCategoryRegistration from './StatusCategoryRegistration/StatusCategoryRegistration';

/**
 * Admin page component.
 * Implements a navigation Component that mounts various types of Admin related components when clicked.
 */
class AdminPage extends Component {
  
  /**
   * Generates HTML code.
   * @returns {*} HTML element with sub-elements.
   */
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

        let access_level_tab = {
            path:'/admin/access',
            name:'Tilgangsrettigheter',
            component: <AccessLevels/>
        };

        let registration_tab = {
            path:'/admin/registration',
            name:'Kommuneregistrering',
            component: <RegionRegistration/>
        };
        let statuses_and_categories = {
            path: '/admin/statuses_categories',
            name: 'Statuser og kategorier',
            component: <StatusCategoryRegistration/>
        };
        let left_tabs = [regions_tab, teams_tab, statuses_and_categories, access_level_tab, registration_tab];
        let right_tabs = [];
        return(
            <div>
                <Navigation left_tabs={left_tabs} right_tabs={right_tabs}/>
            </div>
        );
    }
}
export default AdminPage;