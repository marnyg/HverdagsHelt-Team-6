//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import UserService from "../../../services/UserService";
import ToolService from "../../../services/ToolService";
import VerificationModal from "../../VerificationModal";
import EditUserForm from "./EditUserForm";

/**
 * This component is a table of regions with their respective employees. Admin
 * have the opportunity to either edit or delete users from this list.
 */

class AdminTeamList extends Component{
    verification = false;
    delete_error = null;    //Used to display error-messages caused by delete failures

    /**
     * Rendering the table containing the employees of an region. If a region has no employees,
     * the user will be met with a message telling that the region has no employees.
     * @returns {*} HTML elements displaying employees, with opportunity to delete or edit
     *              user.
     */

    render() {
        if(this.props.team === undefined || this.props.team === null){
            return(
                <div className={'card'} style={{'maxHeight': '600px'}}>
                    <div className={'list-group list-group-flush'} style={{overflow: 'scroll'}}>
                        <div className={'list-group-item'}>
                            <strong>Velg en kommune fra listen</strong>
                        </div>
                    </div>
                </div>
            );
        }
        if(this.props.team.length === 0) {
            return(
                <div className={'card'} style={{'maxHeight': '600px'}}>
                    <div className={'list-group list-group-flush'} style={{overflow: 'scroll'}}>
                            <div className={'list-group-item'}>
                                <strong>Ingen ansatte finnes for kommunen</strong>
                            </div>
                    </div>
                </div>
            );
        } else {
            return(
                <div className={'card'} style={{'maxHeight': '600px'}}>
                    <div className={'list-group list-group-flush'} style={{overflow: 'scroll'}}>
                        {this.props.team.map(employee => {
                            return(
                                <div key={employee.user_id} className={'list-group-item'}>
                                    {employee.firstname} {employee.lastname}
                                    <br/>
                                    <small className={'text-muted'}>Epost: {employee.email}</small>
                                    <button
                                        onClick={(event) => this.setDeleteModalContent(event, employee)}
                                        type="button" data-toggle="modal"
                                        data-target="#verify-modal"
                                        className={'btn btn-danger float-right ml-3'}>
                                        <FontAwesomeIcon icon={faTrashAlt}/>
                                    </button>
                                    <button
                                        onClick={(event) => this.setEditModalContent(event, employee)}
                                        type="button" data-toggle="modal"
                                        data-target="#verify-modal"
                                        className={'btn btn-primary float-right'}>
                                        <FontAwesomeIcon icon={faEdit}/>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    }

    /**
     * Function displaying a delete confirmation box. Here you will be able to
     * cancel or submit the action.
     * @param event Triggered by a button click.
     * @param employee  The specific employee that you would like to delete.
     */

    setDeleteModalContent(event, employee) {
        let modal_header = "Er du sikker?";
        let modal_body = (
            <div>
                <div className={'my-3 mx-3'}>
                    {this.delete_error}
                    <div>Er du sikker på at du vil fjerne <strong>{employee.firstname} {employee.lastname}</strong> fra kommunens saksbehandlere?</div>
                    <div className={'text-muted'}>Epost: {employee.email}</div>
                </div>
                <button onClick={(event) => console.log('Avbryter')} type="button" className="btn btn-primary" data-dismiss="modal">Avbryt</button>
                <button onClick={(event) => this.removeEmployee(event, employee)} type="button" className="btn btn-danger float-right" data-dismiss="modal">Fjern ansatt</button>
            </div>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    /**
     * Function displaying a edit modal, where you will be able to edit different user variables.
     * @param event Triggered by a button-click.
     * @param employee  The specific employee that you would like to edit.
     */

    setEditModalContent(event, employee) {
        let modal_header = "Rediger ansatt: " + employee.firstname + ' ' + employee.lastname;
        let modal_body = (
            <EditUserForm editUser={(user) => this.editEmployee(user)}
                          user={employee}
                          error={this.edit_error}
            />
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    /**
     * Function that handles and proceeds the edit.
     * @param employee  The specific employee you would like to edit.
     */

    editEmployee(employee: User) {
        $('#verify-modal').modal('hide');
        this.props.onTeamChange(employee);
    }

    /**
     * Function that handles and proceeds the edit.
     * @param event Triggered by a double click.
     * @param employee  The specific employee you would like to delete.
     */

    removeEmployee(event, employee: User) {
        $('#spinner').show();
        let userService = new UserService();
        if(!employee.role_id || employee.role_id !== ToolService.private_user_role_id) employee.role_id = ToolService.private_user_role_id;
        console.log(employee);
        userService.updateUser(employee)
            .then(res => {
                console.log(res);
                $('#spinner').hide();
                this.props.onTeamChange(employee);
            })
            .catch((error: Error) => {
                $('#spinner').hide();
                this.delete_error = ToolService.getUserUpdateErrorAlert(error);
                console.error(error);
            });
    }
}
export default AdminTeamList;