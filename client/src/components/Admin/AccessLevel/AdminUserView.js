//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import NewUserForm from "./NewUserForm";
import SelectedUser from "./SelectedUser";

class AdminUserView extends Component{
    render() {
        return(
            <div>
                <h1>Oppdater eksisterende bruker</h1>
                <SelectedUser user={this.props.user} onUserUpdated={() => this.props.onUserUpdated()}/>
                <h3>Eller registrer ny bruker</h3>
                <NewUserForm/>
            </div>
        );
    }
}
export default AdminUserView;