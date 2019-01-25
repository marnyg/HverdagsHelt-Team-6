//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegionsList from "../Regions/AdminRegionsList";
import AdminTeamView from "./AdminTeamView";
import UserService from "../../../services/UserService";
import CountyService from "../../../services/CountyService";
import RegionService from "../../../services/RegionService";

const region_employee_id = 2; // Change to 2 upon delivery

class AdminTeams extends Component {
    region = null;
    team = [];
    regions = [];

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