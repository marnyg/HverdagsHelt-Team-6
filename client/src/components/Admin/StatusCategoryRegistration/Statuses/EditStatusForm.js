//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import StatusList from "./StatusList";
import StatusService from "../../../../services/StatusService";
import ToolService from "../../../../services/ToolService";

class EditStatusForm extends Component{
    error = null;
    status = null;
    render() {
        return(
            <div key={this.props.status.status_id}>
                {this.error}
                <form ref={'editStatusForm'} className={'form-group'}>
                    <label htmlFor={'edit-status-form-name'}>Statusnavn:</label>
                    <br/>
                    <small className={'text-muted'}>Kun bokstaver og mellomrom, ingen tall eller spesialtegn.</small>
                    <input id={'edit-status-form-name'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-status-form-name'}
                           defaultValue={this.props.status.name}
                           pattern={'^[a-zA-ZæøåÆØÅ\\-\\s]+'}
                           required
                    />
                    <div className={'mt-3'}>
                        <button className={'btn btn-primary'}
                                onClick={(event) => this.editStatus(event)}>Lagre endringer</button>
                        <button className={'btn btn-danger float-right'} type="button"
                                data-dismiss="modal" onClick={(event) => event.preventDefault()}>Avbryt</button>
                    </div>
                </form>
            </div>
        );
    }

    editStatus(event) {
        event.preventDefault();
        let form = this.refs.editStatusForm;

        if(form.checkValidity()){
            let newStatus = {
                status_id: Number(this.props.status.status_id),
                name: document.querySelector('#edit-status-form-name').value
            };
            console.log(newStatus);
            let statusService = new StatusService();
            statusService.updateStatus(newStatus.status_id, newStatus)
                .then(res => {
                    $('#verify-modal').modal('hide');
                    this.props.onChange(newStatus);
                })
                .catch((error: Error) => {
                   this.error = ToolService.getStatusDeleteErrorAlert(error, () => {
                       this.error = null;
                   });
                });
        } else {
            form.reportValidity();
        }

    }

    componentWillReceiveProps(newProps) {
        if(newProps.status !== this.props.status) {
            this.setState({
                status: newProps.status
            });
        }
    }
}
export default EditStatusForm;