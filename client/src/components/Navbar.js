import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

class Navbar extends Component {
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink to="/" className="navbar-brand">
                    HverdagsHelt
                </NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <NavLink to="/" className="nav-link" >
                                Hjem
                                <span className="sr-only">(current)</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/new-case" className="nav-link">
                                Registrer sak
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/notifications" className="nav-link">
                                Varsler
                            </NavLink>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-1">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Søk</button>
                    </form>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" data-toggle="modal" data-target="#register-modal">
                                Ny bruker
                            </NavLink>
                            <RegisterModal/>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/new-case" className="nav-link" href="#" data-toggle="modal" data-target="#login-modal">
                                Logg inn
                            </NavLink>
                            <LoginModal/>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
export default Navbar;