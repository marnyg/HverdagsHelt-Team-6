//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminTeamForm from "./AdminTeamForm";
import AdminTeamList from './AdminTeamList';

class AdminTeamView extends Component {
    render() {
        if(this.props.region === undefined || this.props.region === null) return null;
        return(
            <div>
                <AdminTeamForm region={this.props.region} onUserCreated={() => this.props.onUserCreated()}/>
                <AdminTeamList team={this.props.team}/>
            </div>
        );
    }
}
export default AdminTeamView;