//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminUserList from "./AdminUserList";
import UserService from "../../../services/UserService";
import AdminUserView from "./AdminUserView";

/**
 * This component is representing the Accesslevel tab in the web page. This is used set
 * access level for the registered users on the web page.
 */

class AccessLevels extends Component{
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
        this.fetch_users();
    }

    /**
     * Getting all users registered in the system and adding them to an array.
     */

    fetch_users() {
        let userService = new UserService();
        userService.getAllUsers()
            .then((users: User[]) => {
                this.users = users;
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
}
export default AccessLevels;