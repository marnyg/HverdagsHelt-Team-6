// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import CaseSubscriptionService from '../services/CaseSubscriptionService';
import CaseSubscription from '../classes/CaseSubscription';
import User from '../classes/User';
import ToolService from '../services/ToolService';
import hverdagsheltLogo from '../../public/hverdagsheltLogo2Trans.png';
import LoginService from "../services/LoginService";

const SERVER_IP: string = 'localhost';
const SERVER_PORT: number = 3000;

class Navbar extends Component<{ logged_in: boolean }> {
    notification_count: number = 0;
    subscriptions: CaseSubscription[] = [];
    search: string = '';
    socket: WebSocket = null;
    logged_in: boolean = false;

    constructor() {
        super();
        this.submitSearch = this.submitSearch.bind(this);
    }

    render() {
        let loginlink = null;
        let user = ToolService.getUser();
        if (!user) {
            loginlink = (
                <div className="nav-link" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#login-modal">
                    Registrer sak
                </div>
            );
        } else if (this.logged_in === false) {
            loginlink = (
                <div className="nav-link" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#login-modal">
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
                {this.logged_in ? (
                    <NavLink to={'/'} className="navbar-left">
                        <img src={hverdagsheltLogo} height={29.7} width={185} />
                        <sup className="badge badge-primary mobile-notification">
                            {this.notification_count > 0 ? this.notification_count : null}
                        </sup>
                    </NavLink>
                ) : (
                    <NavLink to={'/'} className="navbar-left">
                        <img src={hverdagsheltLogo} height={29.7} width={185} />
                    </NavLink>
                )}
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
                            {this.logged_in ? (
                                <NavLink to="/subscriptions" className="nav-link">
                                    Abonnement
                                </NavLink>
                            ) : null}
                        </li>
                        <li className="nav-item">
                            {this.logged_in ? (
                                <NavLink to="/notifications" className="nav-link">
                                    Varsler{' '}
                                    <sup className="badge badge-primary">
                                        {this.notification_count > 0 ? this.notification_count : null}
                                    </sup>
                                </NavLink>
                            ) : null}
                        </li>
                        {user && user.role_id === ToolService.employee_role_id ? (
                            <li className="nav-item">
                                <NavLink exact to="/employee/inbox" className="nav-link">
                                    Behandle saker
                                </NavLink>
                            </li>
                        ) : null}
                        {user && user.role_id === ToolService.admin_role_id ? (
                            <li className="nav-item">
                                <NavLink exact to="/admin/regions" className="nav-link">
                                    Admin
                                </NavLink>
                            </li>
                        ) : null}
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
        console.log('Navbar mounted');
        this.logged_in = this.props.logged_in;
        this.setState({
            logged_in: this.props.logged_in
        });
        this.initSocket();
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: boolean) => {
                if(logged_in === true){
                    console.log('Navbar user is logged in');
                    let user: User = ToolService.getUser();
                    this.fetch_notifications(user, this.countPushNotifications);
                }
            })
            .catch((error: Error) => console.error(error));
    }

    fetch_notifications(user: User, cb) {
        console.log('Navbar fetching subscriptions');
        let subscriptionService = new CaseSubscriptionService();
        subscriptionService
            .getAllCaseSubscriptions(user.user_id)
            .then((cs: CaseSubscription[]) => {
                //this.subscriptions = cs;
                cb(cs);
            })
            .catch((error: Error) => console.error(error));
    }

    countPushNotifications(subscriptions: []) {
        console.log('Before counting notifications:', this.notification_count);
        this.notification_count = 0;
        let subService = new CaseSubscriptionService();
        let user: User = ToolService.getUser();
        subService.getAllOutdatedCaseSubscriptions(user.user_id)
            .then((subs: CaseSubscription[]) => {
                console.log('These are the outdated subscriptions:', subs);
                this.subscriptions = subs;
            })
            .catch((error: Error) => console.error(error));
        /*
        for (let i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].is_up_to_date === false) {
                this.notification_count++;
            }
        }
        */
        /*
        subscriptions.map(e => {
            if(e.is_up_to_date === false) this.notification_count++;
        });
        */
        console.log('After counting notifications:', this.notification_count);
    }

    componentWillReceiveProps(newProps) {
        console.log('Navbar received props logged_in:', newProps.logged_in);
        if(this.socket === undefined || this.socket === null) {
            this.initSocket();
        }
        if(newProps.logged_in !== this.props.logged_in) {
            this.logged_in = newProps.logged_in;
            this.setState({
                logged_in: newProps.logged_in
            });
        }

        if(this.logged_in === true) {
            let user: User = ToolService.getUser();
            if(user) {
                this.fetch_notifications(user, this.countPushNotifications);
            }
        }
    }

    submitSearch(event) {
        event.preventDefault();
        if (this.search !== undefined && this.search !== '') {
            this.props.history.push('/search/' + this.search);
        }
    }

    logincheck() {
        if (this.logged_in) {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/my-page/my-profile" className="nav-link">
                            Min Side
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            exact
                            to={'/'}
                            className="nav-link"
                            style={{ cursor: 'pointer' }}
                            onClick={event => this.logout(event)}
                        >
                            Logg ut
                        </NavLink>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="nav-link" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#register-modal">
                            Ny bruker
                        </div>
                        <RegisterModal onLogin={() => this.onLogin()} />
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#login-modal">
                            Logg inn
                        </div>
                        <LoginModal modal_id={'login-modal'} onLogin={() => this.onLogin()} />
                    </li>
                </ul>
            );
        }
    }

    onLogin() {
        if(this.socket === undefined || this.socket === null) {
            this.initSocket();
        }
        this.props.onLogin();
    }

    logout(event) {
        if(this.socket !== undefined && this.socket !== null) {
            this.socket.onclose = function() {
                console.log('socket closing');
            };
            this.socket.close();
        }
        this.props.logout(event);
    }

    receiveBcast(message: MessageEvent) {
        let json = JSON.parse(message.data);
        if (json) {
            if (this.subscriptions.length > 0) {
                let id: number = Number(json.case_id);
                if (this.subscriptions.some(e => e.case_id === id)) {
                    this.notification_count++;
                }

                for (let i = 0; i < this.subscriptions.length; i++) {
                    if(this.subscriptions[i].case_id === id) {
                        this.subscriptions[i].is_up_to_date = false;
                        break;
                    }
                }
            }
        } else {
            console.log('Could not parse websocket data from server.');
        }
    }

    initSocket() {
        console.log('initiating socket');
        let socketArgument: string = 'ws://' + SERVER_IP + ':' + SERVER_PORT.toString();
        console.log(socketArgument);
        this.socket = new WebSocket(socketArgument);
        this.socket.onmessage = (msg: MessageEvent) => this.receiveBcast(msg);
        this.socket.onerror = (err: Event) => console.log('WebSocket error:', err);
        this.socket.onopen = (e: Event) => console.log('Connected to ', e);
        console.log('socket initiated');
    }
}
export default withRouter(Navbar);
