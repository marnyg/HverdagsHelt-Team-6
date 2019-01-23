//@flow
import * as React from 'react';
import { Component } from 'react-simplified';

class EditUserForm extends Component{
    newuser = {
        name: ""
    };

    render() {
        console.log('Form user:', this.props.user);

        return(
            <div key={this.props.user.user_id}>
                <div className={'form-group'}>
                    <label htmlFor={'edit-user-form-firstname'}>Fornavn:</label>
                    <input id={'edit-user-form-firstname'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-user-form-firstname'}
                           defaultValue={this.props.user.firstname}
                    />

                    <label htmlFor={'edit-user-form-lastname'}>Etternavn:</label>
                    <input id={'edit-user-form-lastname'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-user-form-lastname'}
                           defaultValue={this.props.user.lastname}
                    />

                    <label htmlFor={'edit-user-form-email'}>Epost:</label>
                    <input id={'edit-user-form-email'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-user-form-email'}
                           defaultValue={this.props.user.email}
                    />

                    <label htmlFor={'edit-user-form-phone'}>Telefon:</label>
                    <input id={'edit-user-form-phone'}
                           className={'form-control'}
                           type={'number'}
                           name={'edit-user-form-phone'}
                           defaultValue={this.props.user.tlf}
                    />
                </div>
                <button onClick={(event) => console.log('Avbryter')}
                        type="button"
                        className="btn btn-danger float-right"
                        data-dismiss="modal">Avbryt</button>
                <button onClick={(event) => this.submit()}
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

    submit() {
        let user_id = this.props.user.user_id;
        let role_id = this.props.user.role_id;
        let region_id = this.props.user.region_id;
        let firstname = document.querySelector('#edit-user-form-firstname').value;
        let lastname = document.querySelector('#edit-user-form-lastname').value;
        let email = document.querySelector('#edit-user-form-email').value;
        let tlf = Number(document.querySelector('#edit-user-form-phone').value);

        let newuser = {
            user_id: user_id,
            firstname: firstname,
            lastname: lastname,
            email: email,
            tlf: tlf,
            region_id: region_id,
            role_id: role_id
        };
        this.props.editUser(newuser)
    }
}
export default EditUserForm;