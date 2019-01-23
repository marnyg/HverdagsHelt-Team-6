//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import NewUserForm from "./NewUserForm";
import SelectedUser from "./SelectedUser";

class AdminUserView extends Component{
    render() {
        return(
            <div>
                <h1>Registrer ny bruker</h1>
                <NewUserForm/>
                <SelectedUser user={this.props.user} onUserUpdated={() => this.props.onUserUpdated()}/>
            </div>
        );
    }
}
export default AdminUserView;