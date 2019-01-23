//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminTeamForm from "./AdminTeamForm";
import AdminTeamList from './AdminTeamList';

class AdminTeamView extends Component {
    render() {
        if(this.props.region === undefined || this.props.region === null) {
            return(
                <div>
                    <AdminTeamForm region={this.props.region} onUserCreated={() => this.props.onUserCreated()}/>
                    <h4 className={'ml-1'}>Ingen kommune valgt</h4>
                    <AdminTeamList team={this.props.team}/>
                </div>
            );
        }
        return(
            <div>
                <AdminTeamForm region={this.props.region} onUserCreated={() => this.props.onUserCreated()}/>
                <h4 className={'ml-1'}>Ansatte i {this.props.region.name}:</h4>
                <AdminTeamList team={this.props.team} onTeamChange={(user) => this.props.onTeamChange(user)}/>
            </div>
        );
    }
}
export default AdminTeamView;