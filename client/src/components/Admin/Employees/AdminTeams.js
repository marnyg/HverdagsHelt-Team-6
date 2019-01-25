//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegionsList from "../Regions/AdminRegionsList";
import AdminTeamView from "./AdminTeamView";
import UserService from "../../../services/UserService";
import CountyService from "../../../services/CountyService";
import RegionService from "../../../services/RegionService";

const region_employee_id = 2;

/**
 * Component for editing municipality employees.
 */
class AdminTeams extends Component {
    region = null;
    team = [];
    regions = [];
  
  /**
   * Generates HTML code.
   * @returns {*} HTML Element with sub-elements.
   */
    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-lg'}>
                        <h3>Velg en kommune fra listen</h3>
                        <AdminRegionsList
                            onRegionSelected={(region) => this.onRegionSelected(region)}
                            regions={this.regions}/>
                    </div>
                    <div className={'col-lg mt-5'}>
                        <AdminTeamView region={this.region} team={this.team} onUserCreated={() => this.onUserCreated()}
                            onTeamChange={(user) => this.onTeamChange(user)}
                        />
                    </div>
                </div>
            </div>
        );
    }
  
  /**
   * Fetches employees from current component region variable.
   */
  onUserCreated() {
        if(this.region){
            console.log('user created');
            let userService = new UserService();
            userService.getAllEmployeesInRegion(this.region.region_id)
                .then((users: User[]) => {
                    this.team = users;
                })
                .catch((error: Error) => console.error(error));
        } else {
            console.error('Can\'t update user list, no region_id');
        }
    }
  
  /**
   * Fetches employees from region provided.
   * @param region Region object to fetch users.
   */
    onRegionSelected(region) {
        $('#spinner').show();
        this.region = region;
        let userService = new UserService();
        userService.getAllEmployeesInRegion(region.region_id)
            .then((users: User[]) => {
                //this.team = users.filter(u => (u.role_id === region_employee_id && u.region_id === region.region_id));
                this.team = users;
                $('#spinner').hide();
            })
            .catch((error: Error) => {
                $('#spinner').hide();
            });
    }
  
  /**
   * Fetches updates list of employees in region. Called by child component.
   * @param user
   */
    onTeamChange(user: User) {
        $('#spinner').show();
        console.log('Team changed');
        let userService = new UserService();
        userService.getAllEmployeesInRegion(this.region.region_id)
            .then((users: User[]) => {
                this.team = users;
                $('#spinner').hide();
            })
            .catch((error: Error) => {
                $('#spinner').hide();
            });
    }
  
  /**
   * When component mounts: fetch regions and counties and set component region and county variable object state.
   */
  mounted() {
        $('#spinner').show();
        let regionService = new RegionService();
        regionService.getAllRegions()
            .then((regions: Region[]) => {
                regions.map(reg => reg.county_name = '');
                this.regions = regions;
            })
            .then(() => {
                let countyService = new CountyService();
                countyService.getAllCounties()
                    .then((counties: County[]) => {
                        for (let i = 0; i < counties.length; i++) {
                            for (let j = 0; j < this.regions.length; j++) {
                                if(this.regions[j].county_id === counties[i].county_id){
                                    this.regions[j].county_name = counties[i].name;
                                }
                            }
                        }
                        $('#spinner').hide();
                    })
                    .catch((error: Error) => {
                        $('#spinner').hide();
                        console.error(error);
                    });
            })
            .catch((error: Error) => {
                $('#spinner').hide();
                console.error(error);
            });
    }
}
export default AdminTeams;