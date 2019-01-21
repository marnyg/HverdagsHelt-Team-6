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
                        <AdminRegionsList onRegionSelected={(region) => this.onRegionSelected(region)}/>
                    </div>
                    <div className={'col-lg'}>
                        <AdminTeamView region={this.region} team={this.team} onUserCreated={() => this.onUserCreated()}/>
                    </div>
                </div>
            </div>
        );
    }

    onUserCreated() {
        console.log('user created');
        let userService = new UserService();
        userService.getAllUsers()
            .then((users: User[]) => {
                this.team = users;
            })
            .catch((error: Error) => console.error(error));
    }

    onRegionSelected(region) {
        console.log('Region selected!');
        this.region = region;
        let userService = new UserService();
        userService.getAllUsers()
            .then((users: User[]) => {
                console.log(users);
                console.log(users.filter(u => (u.role_id === region_employee_id && u.region_id === region.region_id)));
                //this.team = users.filter(u => (u.role_id === region_employee_id && u.region_id === region.region_id));
                this.team = users;
            })
            .catch((error: Error) => console.error(error));
    }
}
export default AdminTeams;