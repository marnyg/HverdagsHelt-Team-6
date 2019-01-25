//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RoleService from "../../../services/RoleService";
import UserService from "../../../services/UserService";
import {faEdit} from "@fortawesome/free-solid-svg-icons/index";
import VerificationModal from "../../VerificationModal";
import ToolService from '../../../services/ToolService';

/**
 * This component is representing the modal presenting information about a selected user
 * from the admin user list.
 */

class SelectedUser extends Component{
    roles = []; //Array containing all the registered roles in the database
    selected_role = null;   //Variable to set the selected role

    /**
     * Rendering the modal for selected user, which lists the user-information.
     * @returns {*} HTML elements containing the modal for selected user.
     */

    render() {
        if(!this.props.user){
            return(
                <div className={'card px-3 py-3 mb-2'}>
                    <div>Velg en bruker fra listen</div>
                </div>
            );
        }
        return(
            <div className={'card px-3 py-3 mb-2'}>
                <div className={'form-group'}>
                    <strong>ID: </strong> {this.props.user.user_id}
                    <br/>
                    <strong>Navn: </strong>{this.props.user.firstname} {this.props.user.lastname}
                    <br/>
                    <strong>Epost: </strong>{this.props.user.email}
                    <select className={'form-control mt-3'} id={'admin-user-form-role-selector'}
                            onChange={(event) => this.selected_role = event.target.value}
                            value={this.selected_role}>
                        {this.roles.map(e => {
                            if(e.role_id !== ToolService.deleted_role_id) {
                                return(
                                    <option key={e.role_id} value={e.role_id}>
                                        {' '}
                                        {e.name}{' '}
                                    </option>
                                );
                            }
                        })}
                    </select>
                    <button
                        onClick={(event) => this.setVerificationModalContent(event, this.props.user, this.selected_role)}
                        type="button" data-toggle="modal"
                        data-target="#verify-modal"
                        className={'btn btn-primary w-100 mt-3'}>
                        Oppdater rettigheter
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Function to update state values with new props. This method will get called whenever
     * any change happens to props values.
     * @param newProps  New values for state props.
     */

    componentWillReceiveProps(newProps) {
        if(newProps.user !== this.props.user) {
            this.selected_role = newProps.user.role_id;
            this.setState({
                selected_role: newProps.user.role_id
            });
        }
    }

    /**
     * Function to get all roles registered to the database. The results will
     * be store into the array 'roles'.
     */

    mounted() {
        let roleService = new RoleService();
        roleService.getAllRoles()
            .then((roles: Role[]) => {
                this.roles = roles;
            })
            .catch((error: Error) => console.error(error));
    }

    /**
     * Function to submit the registration. This is triggered by a button-click.
     */

    submit() {
        if(this.selected_role !== this.props.user.role_id){
            console.log('Gammel rolle:', this.props.user.role_id, ' Ny rolle:', this.selected_role);

            let newuser = {
                user_id: this.props.user.user_id,
                firstname: this.props.user.firstname,
                lastname: this.props.user.lastname,
                tlf: this.props.user.tlf,
                email: this.props.user.email,
                region_id: this.props.user.region_id,
                role_id: Number(this.selected_role)
            };

            console.log(newuser);

            let userService = new UserService();
            userService.updateUser(newuser)
                .then(res => {
                    console.log(res);
                    this.props.onUserUpdated();
                })
                .catch((error: Error) => console.error(error));
        } else {
            alert('Ingen oppdatering å gjøre');
        }
    }

    /**
     * Function used as a verification to submitted role-changes of a give user. You will
     * be asked to confirm or decline changes.
     * @param event Triggered by a button-click.
     * @param user  The user that will be affected by the changes.
     * @param selected_role The new role that the specific user will be updated with.
     */

    setVerificationModalContent(event, user, selected_role) {
        selected_role = Number(selected_role);
        if(user.role_id !== selected_role) {
            let modal_header = 'Er du sikker?';
            let modal_body = (
                <div>
                    <div className={'my-3 mx-3'}>
                        <div>Er du sikker på at du vil endre <strong>{user.firstname} {user.lastname}</strong> sine tilgangsrettigheter?</div>
                        <div>Fra <strong>{this.getRoleName(user.role_id)}</strong></div>
                        <div>Til <strong>{this.getRoleName(Number(selected_role))}</strong></div>
                    </div>
                    <button onClick={(event) => console.log('Avbryter')} type="button" className="btn btn-primary float-right" data-dismiss="modal">Avbryt</button>
                    <button onClick={(event) => this.submit()} type="button" className="btn btn-danger" data-dismiss="modal">Ja jeg er sikker</button>
                </div>
            );
            let modal_footer = null;
            VerificationModal.setcontent(modal_header, modal_body, modal_footer);
        } else {
            let modal_header = 'Trenger ikke oppdatere rettigheter';
            let modal_body = (
                <div>
                    <div className={'my-3 mx-3'}>
                        <div>Unødvendig å endre tilgangsrettigheter, brukerens rettigheter er de samme som du valgt.</div>
                        <div>Fra <strong>{this.getRoleName(user.role_id)}</strong></div>
                        <div>Til <strong>{this.getRoleName(Number(selected_role))}</strong></div>
                    </div>
                    <button onClick={(event) => console.log('Avbryter')} type="button" className="btn btn-primary float-right" data-dismiss="modal">Lukk</button>
                    <button onClick={(event) => this.submit()} type="button" className="btn btn-danger" data-dismiss="modal">Ok</button>
                </div>
            );
            let modal_footer = null;
            VerificationModal.setcontent(modal_header, modal_body, modal_footer);
        }
    }

    /**
     * Function to get role name, given role-id.
     * @param role_id   The role-id of the role that you want the role name of.
     * @returns {string}    The role name.
     */

    getRoleName(role_id) {
        for (let i = 0; i < this.roles.length; i++) {
            if(role_id === this.roles[i].role_id){
                return this.roles[i].name;
            }
        }
        return 'finner ikke rolle beskrivelse';
    }
}
export default SelectedUser;