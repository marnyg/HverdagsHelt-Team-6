//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RoleService from "../../../services/RoleService";

class AdminUserList extends Component{
    roles = [];
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
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.map(user => {
                            return(
                                <tr key={user.user_id} style={{ cursor: 'pointer' }}>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.user_id}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.email}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{this.getRole(user.role_id)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    mounted() {
        let roleService = new RoleService();
        roleService.getAllRoles()
            .then((roles: Role[]) => {
                this.roles = roles;
            })
            .catch((error: Errror) => console.error(error));
    }

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