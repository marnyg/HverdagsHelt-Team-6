//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import UserService from "../../services/UserService";
import ToolService from "../../services/ToolService";
import VerificationModal from "../VerificationModal";
import EditUserForm from "./EditUserForm";

class AdminTeamList extends Component{
    verification = false;
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

    setDeleteModalContent(event, employee) {
        let modal_header = "Er du sikker?";
        let modal_body = (
            <div>
                <div className={'my-3 mx-3'}>
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

    setEditModalContent(event, employee) {
        let modal_header = "Rediger ansatt: " + employee.firstname + ' ' + employee.lastname;
        let modal_body = (
            <EditUserForm editUser={(user) => this.editEmployee(user)} user={employee}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    editEmployee(employee: User) {
        console.log('User updated', employee);

        let userService = new UserService();
        userService.updateUser(employee)
            .then(res => {
                $('#verify-modal').modal('hide');
                this.props.onTeamChange(employee);
                console.log(res);
            })
            .catch((error: Error) => console.error(error));
    }

    removeEmployee(event, employee: User) {

        let userService = new UserService();
        if(!employee.role_id || employee.role_id !== ToolService.private_user_role_id) employee.role_id = ToolService.private_user_role_id;
        console.log(employee);
        userService.updateUser(employee)
            .then(res => {
                console.log(res);
                this.props.onTeamChange(employee);
            })
            .catch((error: Error) => console.error(error));
    }
}
export default AdminTeamList;