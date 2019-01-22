// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import CaseSubscriptionService from "../services/CaseSubscriptionService";
import CaseSubscription from "../classes/CaseSubscription";
import hverdagsheltLogo from '../../public/hverdagsheltLogo2Trans.png';

const region_employee_id = 2; // Change to 2 upon delivery
const admin_id = 1; // Change to 1 upon delivery

class Navbar extends Component {
    notification_count = 0;
    notifications = [];
    constructor() {
        super();
        this.submitSearch = this.submitSearch.bind(this);
    }

    render() {
        let loginlink = null;
        let user = JSON.parse(localStorage.getItem('user'));
        if(user === null){
            loginlink = (
                <div className="nav-link" style={{cursor: 'pointer'}} data-toggle="modal" data-target="#login-modal">
                    Registrer sak
                </div>
            );
        } else if(this.props.logged_in === false){
            loginlink = (
                <div className="nav-link" style={{cursor: 'pointer'}} data-toggle="modal" data-target="#login-modal">
                    Registrer sak
                </div>
            );
        } else {
            loginlink = (
                <NavLink to="/new-case" className="nav-link">
                    Registrer sak
                </NavLink>
            );
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {this.props.logged_in ?
                    <NavLink to={'/'} className="navbar-left">
                        <img src={hverdagsheltLogo} height={29.7} width={185}/>
                        <sup className="badge badge-primary mobile-notification">{this.notification_count > 0 ? this.notification_count:null}</sup>
                    </NavLink>
                    :
                    <NavLink to={'/'} className="navbar-left"><img src={hverdagsheltLogo} height={29.7} width={185}/></NavLink>
                }
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink exact to="/" className="nav-link">
                                Hjem
                            </NavLink>
                        </li>

                        <li className="nav-item">{loginlink}</li>
                        <li className="nav-item">
                            {this.props.logged_in ? (
                                <NavLink to="/subscriptions" className="nav-link">
                                    Abonnement
                                </NavLink>
                            ) : null}
                        </li>
                        <li className="nav-item">
                            {this.props.logged_in ? (
                                <NavLink to="/notifications" className="nav-link">
                                    Varsler <sup className="badge badge-primary">{this.notification_count > 0 ? this.notification_count:null}</sup>
                                </NavLink>
                            ) : null}
                        </li>
                        {user && user.role_id === region_employee_id ? (
                            <li className="nav-item">
                                <NavLink exact to="/employee/inbox" className="nav-link">
                                    Behandle saker
                                </NavLink>
                            </li>
                        ): null}
                        {user && user.role_id === admin_id ? (
                            <li className="nav-item">
                                <NavLink exact to="/admin/regions" className="nav-link">
                                    Admin
                                </NavLink>
                            </li>
                        ): null}
                    </ul>
                    <form className="form-inline my-2 my-lg-1" onSubmit={this.submitSearch}>
                        <input
                            className="form-control mr-sm-2"
                            type="search"
                            placeholder="Søk i saker"
                            aria-label="Search"
                            onChange={e => (this.search = e.target.value)}
                        />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.submitSearch}>
                            Søk
                        </button>
                    </form>
                    <ul className="navbar-nav">{this.logincheck()}</ul>
                </div>
            </nav>
        );
    }

    mounted() {
        // Check if user is logged in
        //console.log('Navbar mounted');
        if(this.props.logged_in === true){
            // get notifications
            let subscriptionService = new CaseSubscriptionService();
            let user = JSON.parse(localStorage.getItem('user'));
            subscriptionService.getAllCaseSubscriptions(user.user_id)
                .then((cs: CaseSubscription[]) => {
                    for (let i = 0; i < cs.length; i++) {
                        if(cs[i].is_up_to_date === false){
                            this.notification_count++;
                        }
                    }
                    this.notifications = cs;
                })
                .catch((error: Error) => console.error(error));
        }
    }

    submitSearch(event) {
        event.preventDefault();
        console.log(this.search);
        if (this.search !== undefined && this.search !== '') {
            this.props.history.push('/search/' + this.search);
        }
    }

    logincheck() {
        if (this.props.logged_in) {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/my-page/my-profile" className="nav-link">
                            Min Side
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" style={{cursor: 'pointer'}} onClick={(event) => this.props.logout(event)}>
                            Logg ut
                        </div>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="nav-link" style={{cursor: 'pointer'}} data-toggle="modal" data-target="#register-modal">
                            Ny bruker
                        </div>
                        <RegisterModal onLogin={() => this.props.onLogin()}/>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" style={{cursor: 'pointer'}} data-toggle="modal" data-target="#login-modal">
                            Logg inn
                        </div>
                        <LoginModal modal_id={'login-modal'} onLogin={() => this.props.onLogin()} />
                    </li>
                </ul>
            );
        }
    }
}
export default withRouter(Navbar);
