//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RoleService from "../../../services/RoleService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * This component is representing a table of all the users registered in the system.
 * The table is used to access user for changing access-level and view user information.
 */

class AdminUserList extends Component{
    roles = []; //Array containing all roles registered in the database

    /**
     * Rendering the table containing all the users.
     * @returns {*} HTML element containing all the users.
     */

    render() {
        if(this.props.users === undefined || this.props.users === null) {
            return null;
        }
        return(
            <div className={'card mb-3'} style={{'overflow':'scroll','maxHeight': '700px'}}>
                <table className={'table table-hover table-striped'}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Epost</th>
                            <th scope="col">Tilgangsnivå</th>
                            <th scope="col">Slett</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.map(user => {
                            return(
                                <tr key={user.user_id} style={{ cursor: 'pointer' }}>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.user_id}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.email}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{this.getRole(user.role_id)}</td>
                                    <td onClick={(event) => this.props.deleteUser(user)}>
                                        <button className={'btn btn-danger'} type="button" data-toggle="modal"
                                                data-target="#verify-modal">
                                            <FontAwesomeIcon icon={faTrashAlt}/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    /**
     * Function for getting all roles registered in the database.
     */

    mounted() {
        let roleService = new RoleService();
        roleService.getAllRoles()
            .then((roles: Role[]) => {
                this.roles = roles;
            })
            .catch((error: Errror) => console.error(error));
    }

    /**
     * Function to convert role-id to role name.
     * @param role_id   The role-id that you want to convert to its role name.
     * @returns {*} The role name, based on its id.
     */

    getRole(role_id: number) {
        let out = null;
        for (let i = 0; i < this.roles.length; i++) {
            if(this.roles[i].role_id === role_id){
                out = this.roles[i].name;
                break;
            }
        }
        if(out !== undefined && out !== null) {
            return out;
        } else {
            return 'Vet ikke'
        }

    }
}
export default AdminUserList;