//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminUserList from "./AdminUserList";
import UserService from "../../../services/UserService";
import AdminUserView from "./AdminUserView";
import VerificationModal from "../../VerificationModal";

/**
 * This component is representing the Accesslevel tab in the web page. This is used set
 * access level for the registered users on the web page.
 */

class AccessLevels extends Component{
    users = [];
    viewing_user = null;
    delete_error = null;
    users = []; //Array containing all the users
    viewing_user = null;    //Variable for the user that is selected from the list

    /**
     * Rendering an array with all users registered in the system the system.
     * @returns {*} HTML element with users registered in the system.
     */

    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                     <div className={'col-lg'}>
                        <h1>Brukere</h1>
                        <AdminUserList
                            users={this.users}
                            onUserSelected={(user) => this.onUserSelected(user)}
                            deleteUser={(user) => this.deleteUserModal(user)}
                        />
                    </div>
                    <div className={'col-lg'}>
                        <AdminUserView user={this.viewing_user} onUserUpdated={() => this.onUserUpdated()}/>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Function to get all users.
     */

    mounted() {
        $('#spinner').hide();
        this.fetch_users();
    }

    /**
     * Getting all users registered in the system and adding them to an array.
     */

    fetch_users() {
        $('#spinner').show();
        let userService = new UserService();
        userService.getAllUsers()
            .then((users: User[]) => {
                this.users = users;
                $('#spinner').hide();
            })
            .catch((error: Error) => console.error(error));
    }

    /**
     * Function used as a callback method. After privileges is updated the user table will be
     * updated with users with new changes.
     */

    onUserUpdated() {
        console.log('User updated');
        this.fetch_users();
    }

    /**
     * Function to set viewing user to the current selected user.
     * @param user  The current selected user.
     */

    onUserSelected(user) {
        this.viewing_user = user;
    }

    deleteUserModal(user) {
        let modal_header = "Er du sikker?";
        let modal_body = (
            <div>
                <div className={'my-3 mx-3'}>
                    {this.delete_error}
                    <div>Er du sikker på at du vil slette denne brukeren?</div>
                    <div><strong>ID: </strong>{user.user_id}</div>
                    <div><strong>Navn: </strong>{user.firstname} {user.lastname}</div>
                    <div className={'text-muted'}>Epost: {user.email}</div>
                </div>
                <button onClick={(event) => console.log('Avbryter')} type="button" className="btn btn-primary" data-dismiss="modal">Avbryt</button>
                <button onClick={(event) => this.deleteUser(event, user)} type="button" className="btn btn-danger float-right">Slett bruker</button>
            </div>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    deleteUser(event, user: User) {
        $('#spinner').show();
        let userService = new UserService();
        userService.deleteUser(user.user_id)
            .then(res => {
                $('#spinner').hide();
                $('#verify-modal').modal('hide');
                this.fetch_users();
                console.log(res);
            })
            .catch((error: Error) => {
                $('#spinner').hide();
                $('#verify-modal').modal('hide');
                this.delete_error = ToolService.getUserUpdateErrorAlert(error);
                console.log(error);
            })
    }
}
export default AccessLevels;