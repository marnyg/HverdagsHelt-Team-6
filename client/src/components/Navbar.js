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
import Notify from "./Notify";

const SERVER_IP: string = 'localhost';
const SERVER_PORT: number = 3000;

/**
 * This component is used for the menu-bar located at the top of the webpage.
 */

class Navbar extends Component<{ logged_in: boolean }> {
    notification_count: number = 0; //Counting the number of notifications generated by unseen subscribed cases
    subscriptions: CaseSubscription[] = []; //Array containing the users case subscriptions
    search: string = '';    //Used for the search bar
    socket: WebSocket = null;   //WebSocket used for notification-counter
    logged_in: boolean = false; //Boolean to track if the user is signed in or not

    constructor() {
        super();
        this.submitSearch = this.submitSearch.bind(this);   //Function to submit search-word
    }

    /**
     * Rendering the menu-bar.
     * Functionality of the menu-bar is varying depending on if the user is signed
     * in or not, including the user's access level.
     * @returns {*} HTML element with the menu-bar.
     */

    render() {
        let loginlink = null;
        let user = ToolService.getUser();
        if (!user) {
            loginlink = (
                <div className="nav-link"
                     style={{ cursor: 'pointer' }}
                     data-toggle="modal"
                     data-target="#login-modal"
                     onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                    Registrer sak
                </div>
            );
        } else if (this.logged_in === false) {
            loginlink = (
                <div className="nav-link" style={{ cursor: 'pointer' }}
                     data-toggle="modal"
                     data-target="#login-modal"
                     onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                    Registrer sak
                </div>
            );
        } else {
            loginlink = (
                <NavLink to="/new-case"
                         className="nav-link"
                         onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                    Registrer sak
                </NavLink>
            );
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <RegisterModal onLogin={() => this.onLogin()} />
                <LoginModal modal_id={'login-modal'} onLogin={() => this.onLogin()} />
                {this.logged_in ? (
                    <NavLink exact to={'/'} className="navbar-left" onClick={(event) => {
                        $('#navbarSupportedContent').collapse('hide');
                        if(window.location.pathname === '/'){
                            window.location.reload();
                        }
                    }}>
                        <img src={hverdagsheltLogo} height={29.7} width={185} />
                        <sup className="badge badge-primary mobile-notification">
                            {this.notification_count > 0 ? this.notification_count : null}
                        </sup>
                    </NavLink>
                ) : (
                    <NavLink to={'/'} className="navbar-left" onClick={(event) => {
                        $('#navbarSupportedContent').collapse('hide');
                        if(window.location.pathname === '/'){
                            window.location.reload();
                        }
                    }}>
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
                            <NavLink exact to="/" className="nav-link" onClick={(event) => {
                                $('#navbarSupportedContent').collapse('hide');
                                if(window.location.pathname === '/'){
                                    window.location.reload();
                                }
                            }}>
                                Hjem
                            </NavLink>
                        </li>

                        <li className="nav-item">{loginlink}</li>
                        <li className="nav-item">
                            {this.logged_in ? (
                                <NavLink to="/subscriptions" className="nav-link" onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                                    Abonnement
                                </NavLink>
                            ) : null}
                        </li>
                        <li className="nav-item">
                            {this.logged_in ? (
                                <NavLink to="/notifications" className="nav-link" onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                                    Varsler{' '}
                                    <sup className="badge badge-primary">
                                        {this.notification_count > 0 ? this.notification_count : null}
                                    </sup>
                                </NavLink>
                            ) : null}
                        </li>
                        {user && user.role_id === ToolService.employee_role_id ? (
                            <li className="nav-item">
                                <NavLink exact to="/employee/inbox" className="nav-link" onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                                    Behandle saker
                                </NavLink>
                            </li>
                        ) : null}
                        {user && user.role_id === ToolService.admin_role_id ? (
                            <li className="nav-item">
                                <NavLink exact to="/admin/regions" className="nav-link" onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
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
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={(event) => {
                            this.submitSearch(event);
                            $('#navbarSupportedContent').collapse('hide');
                        }}>
                            Søk
                        </button>
                    </form>
                    <ul className="navbar-nav">{this.logincheck()}</ul>
                </div>
            </nav>
        );
    }

    /**
     * This function is handeling the users login.
     */

    mounted() {
        // Check if user is logged in
        this.logged_in = this.props.logged_in;
        this.setState({
            logged_in: this.props.logged_in
        });
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: boolean) => {
                if(logged_in === true){
                    let user: User = ToolService.getUser();
                    this.fetch_notifications(user, this.countPushNotifications);
                }
            })
            .catch((error: Error) => {
                // user is not logged in
            });
    }

    /**
     * This function is getting all the cases a given user is subscribed to.
     * @param user  The given user that you want to find subscribed cases for.
     * @param cb    Callback
     */

    fetch_notifications(user: User, cb) {
        let subscriptionService = new CaseSubscriptionService();
        subscriptionService
            .getAllCaseSubscriptions(user.user_id)
            .then((cs: CaseSubscription[]) => {
                this.subscriptions = cs;
                cb(cs);
            })
            .catch((error: Error) => console.error(error));
    }

    /**
     * This function is counting all unseen changes on its subscribed cases.
     * @param subscriptions Array filled with all of the user's subscriptions.
     */

    countPushNotifications(subscriptions: []) {
        this.notification_count = 0;
        subscriptions.map(e => e.is_up_to_date === false ? this.notification_count++:null);
    }

    /**
     *
     * @param newProps
     */

    componentWillReceiveProps(newProps) {
        if(newProps.logged_in !== this.props.logged_in) {
            this.logged_in = newProps.logged_in;
            this.setState({
                logged_in: newProps.logged_in
            });
        }

        if(this.logged_in === true) {
            if(this.socket === undefined || this.socket === null) {
                this.initSocket();
            }
            let user: User = ToolService.getUser();
            if(user) {
                this.fetch_notifications(user, this.countPushNotifications);
            }
        }
    }

    /**
     * Function to handle the search functionality. Pushing the user to a given page
     * based on its search-words.
     * @param event Triggered by a button-click.
     */

    submitSearch(event) {
        event.preventDefault();
        if (this.search !== undefined && this.search !== '') {
            this.props.history.push('/search/' + this.search);
        }
    }

    /**
     * This function is showing the right options based on if the user is logged in or not.
     * @returns {*}
     */

    logincheck() {
        if (this.logged_in) {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/my-page/my-profile" className="nav-link" onClick={(event) => $('#navbarSupportedContent').collapse('hide')}>
                            Min Side
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            exact
                            to={'/'}
                            className="nav-link"
                            style={{ cursor: 'pointer' }}
                            onClick={event => {
                                $('#navbarSupportedContent').collapse('hide');
                                this.logout(event);
                            }}
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
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#login-modal">
                            Logg inn
                        </div>
                    </li>
                </ul>
            );
        }
    }

    onLogin() {
        this.props.onLogin();
    }

    /**
     * This function is handelig the logout.
     * @param event Triggered by a button-click.
     */

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
        console.log(json);
        console.log(this.subscriptions);
        let user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            this.fetch_notifications(user, (subs) => {
                if (json) {
                    if (this.subscriptions.length > 0) {
                        let id: number = Number(json.case_id);
                        this.notification_count = 0;
                        this.subscriptions.map(e => e.is_up_to_date === false && e.case_id !== id ? this.notification_count++:null);
                        if (this.subscriptions.some(e => e.case_id === id)) {
                            this.notification_count++;
                        }
                    }
                } else {
                    console.log('Could not parse websocket data from server.');
                }
            })
        }
    }

    initSocket() {
        let socketArgument: string = 'ws://' + SERVER_IP + ':' + SERVER_PORT.toString();
        console.log(socketArgument);
        this.socket = new WebSocket(socketArgument);
        this.socket.onmessage = (msg: MessageEvent) => this.receiveBcast(msg);
        this.socket.onerror = (err: Event) => console.log('WebSocket error:', err);
        this.socket.onopen = (e: Event) => console.log('Connected to ', e);
    }

    static onCaseOpened(c) {
        setTimeout(() => {
            for (let instance of Navbar.instances()) {
                for(let sub of instance.subscriptions) {
                    if(sub.case_id === c.case_id) {
                        instance.subscriptions.splice(instance.subscriptions.indexOf(sub), 1);
                        instance.countPushNotifications(instance.subscriptions);
                        break;
                    }
                }
            }
        });

    }
}
export default withRouter(Navbar);
