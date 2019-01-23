//@flow
import * as React from 'react';
import { Component } from 'react-simplified';

class AdminUserList extends Component{
    render() {
        return(
            <div className={'card mb-3'} style={{'overflow':'scroll','maxHeight': '700px'}}>
                <table className={'table table-hover table-striped'}>
                    <thead>
                        <tr>
                            <th scope="col">Fornavn</th>
                            <th scope="col">Etternavn</th>
                            <th scope="col">Epost</th>
                            <th scope="col">Tilgangsnivå</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.map(user => {
                            return(
                                <tr key={user.user_id} style={{ cursor: 'pointer' }}>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.firstname}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.lastname}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.email}</td>
                                    <td onClick={(event) => this.props.onUserSelected(user)}>{user.role_id}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default AdminUserList;