//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegionsList from "./AdminRegionsList";
import AdminTeamView from "./AdminTeamView";
import UserService from "../../services/UserService";

const region_employee_id = 2; // Change to 2 upon delivery

class AdminTeams extends Component {
    region = null;
    team = [];

    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-lg'}>
                        <h3>Velg en kommune fra listen</h3>
                        <AdminRegionsList onRegionSelected={(region) => this.onRegionSelected(region)}/>
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
        this.region = region;
        let userService = new UserService();
        userService.getAllEmployeesInRegion(region.region_id)
            .then((users: User[]) => {
                //this.team = users.filter(u => (u.role_id === region_employee_id && u.region_id === region.region_id));
                this.team = users;
            })
            .catch((error: Error) => console.error(error));
    }

    onTeamChange(user: User) {
        console.log('Team changed');
        let userService = new UserService();
        userService.getAllEmployeesInRegion(this.region.region_id)
            .then((users: User[]) => {
                this.team = users;
            })
            .catch((error: Error) => console.error(error));
    }
}
export default AdminTeams;