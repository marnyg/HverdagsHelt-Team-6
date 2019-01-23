//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminUserList from "./AdminUserList";
import UserService from "../../../services/UserService";
import AdminUserView from "./AdminUserView";

class AccessLevels extends Component{
    users = [];
    viewing_user = null;

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
                        <AdminUserView user={this.viewing_user}/>
                    </div>
                </div>
            </div>
        );
    }

    mounted() {
        let userService = new UserService();
        userService.getAllUsers()
            .then((users: User[]) => {
                this.users = users;
            })
            .catch((error: Error) => console.error(error));
    }

    onUserSelected(user) {
        this.viewing_user = user;
    }
}
export default AccessLevels;