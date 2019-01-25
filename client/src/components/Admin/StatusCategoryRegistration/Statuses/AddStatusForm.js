//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import StatusService from "../../../../services/StatusService";
import ToolService from "../../../../services/ToolService";

class AddStatusForm extends Component{
    error = null;
    render() {
        return(
            <div>
                {this.error}
                <div className={'mt-3'}>
                    <form ref={'addStatusForm'} className={'form-group'}>
                        <label htmlFor={'add-status-name'}>Statusnavn:</label>
                        <br/>
                        <small className={'text-muted'}>Kun bokstaver og mellomrom, ingen tall eller spesialtegn.</small>
                        <input
                            id={'add-status-name'}
                            className={'form-control'}
                            type={'text'}
                            name={'add-status-name'}
                            placeholder={'Statusnavn'}
                            pattern={'^[a-zA-ZæøåÆØÅ\\-\\s]+'}
                            required
                        />
                        <div className={'mt-3'}>
                            <button className={'btn btn-danger'} onClick={(event) => this.submit(event)}>Registrer status</button>
                            <button onClick={(event) => {}} type="button" className="btn btn-primary float-right" data-dismiss="modal">Avbryt</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    submit(event) {
        event.preventDefault();
        let form = this.refs.addStatusForm;
        if(form.checkValidity()) {
            let newstatus = {
                status_id: null,
                name: document.querySelector('#add-status-name').value
            };
            let statusService = new StatusService();
            statusService.createStatus(newstatus)
                .then(res => {
                    $('#verify-modal').modal('hide');
                    this.props.onCreate(newstatus);
                })
                .catch((error: Error) => {
                    this.error = ToolService.getStatusCreateErrorAlert(error, () => this.error = null);
                })
        } else {
            form.reportValidity();
        }
    }
}
export default AddStatusForm;