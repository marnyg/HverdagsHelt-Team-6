//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import UserService from "../../../services/UserService";
import ToolService from "../../../services/ToolService";

class EditUserForm extends Component{
    newuser = {
        name: ""
    };
    error = null;

    render() {
        return(
            <div key={this.props.user.user_id}>
                {this.error}
                <form ref={'editUserForm'} className={'form-group'}>
                    <label htmlFor={'edit-user-form-firstname'}>Fornavn:</label>
                    <input id={'edit-user-form-firstname'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-user-form-firstname'}
                           defaultValue={this.props.user.firstname}
                           required
                    />

                    <label htmlFor={'edit-user-form-lastname'}>Etternavn:</label>
                    <input id={'edit-user-form-lastname'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-user-form-lastname'}
                           defaultValue={this.props.user.lastname}
                           required
                    />

                    <label htmlFor={'edit-user-form-email'}>Epost:</label>
                    <input id={'edit-user-form-email'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-user-form-email'}
                           defaultValue={this.props.user.email}
                           required
                    />

                    <label htmlFor={'edit-user-form-phone'}>Telefon:</label>
                    <input id={'edit-user-form-phone'}
                           className={'form-control'}
                           type={'number'}
                           name={'edit-user-form-phone'}
                           defaultValue={this.props.user.tlf}
                           required
                    />
                </form>
                <button onClick={(event) => console.log('Avbryter')}
                        type="button"
                        className="btn btn-danger float-right"
                        data-dismiss="modal">Avbryt</button>
                <button onClick={(event) => this.submit(event)}
                        type="button"
                        className="btn btn-primary"
                        >Oppdater</button>
            </div>
        );
    }

    componentWillReceiveProps(newProps) {
        if(newProps.user !== this.props.user) {
            this.setState({
                newuser: newProps.user
            });
        }
    }

    componentWillUnmount() {
        console.log('User form unmounting');
    }

    mounted () {
        console.log('mounting');
    }

    submit(event) {
        event.preventDefault();
        let form = this.refs.editUserForm;
        if(form.checkValidity()) {
            $('#spinner').show();
            let newuser = {
                user_id: this.props.user.user_id,
                firstname: document.querySelector('#edit-user-form-firstname').value,
                lastname: document.querySelector('#edit-user-form-lastname').value,
                email: document.querySelector('#edit-user-form-email').value,
                tlf: Number(document.querySelector('#edit-user-form-phone').value),
                region_id: this.props.user.region_id,
                role_id: this.props.user.role_id
            };

            let userService = new UserService();
            userService.updateUser(newuser)
                .then(res => {
                    $('#spinner').hide();
                    console.log(res);
                    this.props.editUser(newuser);
                })
                .catch((error: Error) => {
                    $("#spinner").hide();
                    this.error = ToolService.getUserUpdateErrorAlert(error);
                    console.error(error);
                });
        } else {
            form.reportValidity();
        }
    }
}
export default EditUserForm;