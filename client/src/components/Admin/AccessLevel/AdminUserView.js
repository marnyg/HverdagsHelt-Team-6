//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import NewUserForm from "./NewUserForm";
import SelectedUser from "./SelectedUser";

/**
 * This component is used to update a user or register a new user.
 */

class AdminUserView extends Component{

    /**
     * Rendering the update existing user modal and register new user.
     * @returns {*} HTML element that contains update user and register new user
     *              (from admin point of view).
     */

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