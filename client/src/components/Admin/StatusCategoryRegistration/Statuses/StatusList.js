//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt, faEdit, faPlus} from "@fortawesome/free-solid-svg-icons/index";
import StatusService from "../../../../services/StatusService";
import Status from '../../../../classes/Status';
import ToolService from "../../../../services/ToolService";
import VerificationModal from "../../../VerificationModal";
import EditStatusForm from "./EditStatusForm";
import AddStatusForm from "./AddStatusForm";
import DeleteStatus from "./DeleteStatus";

class StatusList extends Component{
    statuses: Status[] = [];
    delete_error = null;
    edit_error = null;

    render() {
        return(
            <div>
                <div className={'card mb-3'}>
                    <h3 className={'text-center w-100'}>Registrer ny status</h3>
                    <button onClick={(event) => this.addStatus()}
                        className={'btn btn-primary'} type="button" data-toggle="modal"
                            data-target="#verify-modal">
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
                <div className={'card mb-3'} style={{'overflow':'scroll','maxHeight': '700px'}}>
                    <table className={'table table-hover table-striped'}>
                        <thead>
                        <tr>
                            <th scope="col">Status ID</th>
                            <th scope="col">Navn</th>
                            <th scope="col">Rediger</th>
                            <th scope="col">Slett</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.statuses.map(status => {
                            return(
                                <tr key={status.status_id} style={{ cursor: 'pointer' }}>
                                    <td>{status.status_id}</td>
                                    <td>{status.name}</td>
                                    <td onClick={(event) => this.editStatus(status)}>
                                        <button className={'btn btn-primary'} type="button" data-toggle="modal"
                                                data-target="#verify-modal">
                                            <FontAwesomeIcon icon={faEdit}/>
                                        </button>
                                    </td>
                                    <td onClick={(event) => this.deleteStatus(status)}>
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
            </div>
        );
    }

    mounted() {
        $('#spinner').hide();
        this.fetch_statuses();
    }

    fetch_statuses() {
        let statusService = new StatusService();
        statusService.getAllStatuses()
            .then((statuses: Status[]) => {
                this.statuses = statuses;
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    deleteStatus(status: Status) {
        let modal_header = 'Er du sikker?';
        let modal_body = (
            <DeleteStatus status={status} onDelete={() => this.fetch_statuses()}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    editStatus(status: Status) {
        let modal_header = 'Er du sikker?';
        let modal_body = (
            <EditStatusForm status={status} onChange={(newstatus) => {
                this.fetch_statuses();
            }}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    addStatus() {
        let modal_header = 'Skriv inn navnet til en ny status!';
        let modal_body = (
            <AddStatusForm onCreate={(newstatus) => {
                this.fetch_statuses();
            }}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }
}
export default StatusList;