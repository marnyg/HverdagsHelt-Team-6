//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/index";

class TeamList extends Component{

    render() {
        return(
            <div className={'container'}>
                <table className={'table table-hover table-striped'}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Fornavn</th>
                            <th scope="col">Etternavn</th>
                            <th scope="col">Epost</th>
                            <th scope="col">Telefon</th>
                            <th scope="col">Tilgangsnivå</th>
                            <th scope="col">Slett</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.users.map(user => {
                        return(
                            <tr key={user.user_id} style={{ cursor: 'pointer' }}>
                                <td onClick={(event) => this.props.onUserSelected(user)}>{user.user_id}</td>
                                <td onClick={(event) => this.props.onUserSelected(user)}>{user.email}</td>
                                <td onClick={(event) => this.props.onUserSelected(user)}>{this.getRole(user.role_id)}</td>
                                <td onClick={(event) => this.props.deleteUser(user)}>
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
        );
    }
}
export default TeamList;