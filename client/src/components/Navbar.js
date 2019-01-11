import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import Content from './Content.js';
import UserService from '../services/UserService.js';

class Navbar extends Component {
    logged_in = false;
    constructor(){
        super();
        this.submitSearch = this.submitSearch.bind(this);
        this.logout = this.logout.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink to="/" className="navbar-brand">
                    HverdagsHelt
                </NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink exact to="/" className="nav-link">
                                Hjem
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/new-case" className="nav-link">
                                Registrer sak
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            {
                                this.logged_in ?
                                    <NavLink to="/notifications" className="nav-link">
                                        Varsler
                                    </NavLink>
                                    :null
                            }
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-1" onSubmit={this.submitSearch}>
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => this.search = e.target.value}/>
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.submitSearch}>Søk</button>
                    </form>
                    <ul className="navbar-nav">
                        {this.logincheck()}
                    </ul>
                </div>
            </nav>
        );
    }

    mounted(){
        // Check if user is logged in
        console.log('Navbar mounted');
        /*
        let userService = new UserService();
        userService.checkLogin()
            .then((logged_in: Boolean) => {
                this.logged_in = logged_in;
            })
            .catch((error: Error) => console.error(error));
            */
    }

    submitSearch(event){
        event.preventDefault();
        /*
        if(Content.instance()) {
            //Content.instance().mounted();
        }
        */
        this.props.history.push('/search/' + this.search);
    }

    logincheck(){
        if(this.logged_in){
            return(
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/my-page" className="nav-link">Min Side</NavLink>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" onClick={this.logout}>
                            Logg ut
                        </div>
                        <LoginModal onLogin={() => this.onLogin()}/>
                    </li>
                </ul>);
        } else {
            return(
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="nav-link" data-toggle="modal" data-target="#register-modal">
                            Ny bruker
                        </div>
                            <RegisterModal/>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" data-toggle="modal" data-target="#login-modal">
                            Logg inn
                        </div>
                        <LoginModal onLogin={() => this.onLogin()}/>
                    </li>
                </ul>
            );
        }
    }

    logout(event){
        console.log('Logging out');
        this.logged_in = false;
    }

    onLogin = () => {
        //console.log('onLogin');
        this.logged_in = true;
    }
}
export default withRouter(Navbar);