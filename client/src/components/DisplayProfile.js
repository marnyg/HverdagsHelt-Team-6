

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
            <form id="form-inline" >

                <legend>Profil</legend>
                <label>Fornavn: </label>
                <p>{this.user.firstname}</p>
                <label>Etternavn: </label>
                <p>{this.user.lastname}</p>
                <label>Epost :</label>
                <p>{this.user.email}</p>
                <label>Tlf</label>
                <p>{this.user.tlf}</p>
                <button className="btn btn-primary" onClick={e => {
                    this.props.callback(e, <EditProfile callback={this.props.callback} />)
                }}>
                    Rediger Profil
        </button>
                <button className="btn btn-primary" onClick={e => {
                    this.props.callback(e, <EditPassword callback={this.props.callback} />)
                }
                }>
                    Rediger Passord
        </button >
            </form >
        );
    }
}
export default DisplayProfile;