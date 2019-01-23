//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RoleService from "../../../services/RoleService";

class SelectedUser extends Component{
    roles = [];
    render() {
        if(!this.props.user){
            return(
                <div className={'card px-3 py-3 mb-2'}>
                    <h1>Velg en bruker fra listen</h1>
                </div>
            );
        }
        console.log(this.props.user);
        return(
            <div className={'card px-3 py-3 mb-2'}>
                <div className={'form-group'}>
                    <strong>ID: </strong> {this.props.user.user_id}
                    <br/>
                    <strong>Navn: </strong>{this.props.user.firstname} {this.props.user.lastname}
                    <select className={'form-control mt-3'} id={'admin-user-form-role-selector'} onChange={() => console.log('role selected')}
                            defaultValue={this.props.user.role_id ? this.props.user.role_id :'.null'}>
                        {this.props.user.role_id ?
                            <option value={'.null'} disabled>Velg rolle</option>
                            :null}
                        {this.roles.map(e => (
                            <option key={e.role_id} value={e.role_id}>
                                {' '}
                                {e.name}{' '}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    mounted() {
        let roleService = new RoleService();
        roleService.getAllRoles()
            .then((roles: Role[]) => {
                this.roles = roles;
            })
            .catch((error: Error) => console.error(error));
    }
}
export default SelectedUser;