

import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditPassword from './EditPassword';
import EditProfile from './EditProfile';

class DisplayProfile extends Component {
    user = JSON.parse(localStorage.getItem("user"))
    render() {
        return (
            <div className={'card'}>
                <div className={'list-group list-group-flush'}>
                    <div className={'container'}>
                        <div className={'row list-group-item d-flex'}>
                            <div className={'col-sm'}>
                                Fornavn:
                      </div>
                            <div className={'col-lg'}>
                                {this.user.firstname}
                            </div>
                        </div>
                        <div className={'row list-group-item d-flex'}>
                            <div className={'col-sm'}>
                                Etternavn:
                      </div>
                            <div className={'col-lg'}>
                                {this.user.lastname}
                            </div>
                        </div>
                        <div className={'row list-group-item d-flex'}>
                            <div className={'col-sm'}>
                                Epost:
                      </div>
                            <div className={'col-lg'}>
                                {this.user.email}
                            </div>
                        </div>
                        <div className={'row list-group-item d-flex'}>
                            <div className={'col-sm'}>
                                Tlf:
                      </div>
                            <div className={'col-lg'}>
                                {this.user.tlf}
                            </div>
                        </div>
                    </div>
                    <div className={'d-flex'}>
                        <button className={'col-lg btn btn-primary'} onClick={e => {
                            console.log(this.props);
                            this.props.callback(e, <EditProfile callback={this.props.callback} />)
                        }}>
                            Rediger Profil
                    </button>
                        <button className={'col-md btn btn-danger'} onClick={e => { this.props.callback(e, <EditPassword callback={this.props.callback} />) }}>
                            Rediger Passord
                    </button >
                    </div>
                </div>
            </div>
        );
    }
}
export default DisplayProfile;