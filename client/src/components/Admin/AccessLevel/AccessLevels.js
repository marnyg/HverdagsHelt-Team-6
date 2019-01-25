//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminUserList from "./AdminUserList";
import UserService from "../../../services/UserService";
import AdminUserView from "./AdminUserView";
import VerificationModal from "../../VerificationModal";

class AccessLevels extends Component{
    users = [];
    viewing_user = null;
    delete_error = null;

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

    mounted() {
        this.fetch_users();
    }

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

    onUserUpdated() {
        console.log('User updated');
        this.fetch_users();
    }

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