// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { faCoffee } from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Footer extends Component {
    render() {
        return (
            <footer className="page-footer font-small blue pt-4">
                <div className="container-fluid text-center text-md-left">
                    <div className="row">
                        <div className="col-md-6 mt-md-0 mt-3 ml-3">
                            <h5 className="text-uppercase">Kontakt oss&ensp;
                                <FontAwesomeIcon icon={faCoffee} />
                            </h5>
                            <p>
                                HverdagsHelt
                                <br/>
                                Adresse: Gate 1, 0012 Oslo
                                <br/>
                                Telefon: 989765433
                                <br/>
                                Epost: support@hverdagshelt.no
                                <br/>
                                Åpningstider: man-fre 9-17
                            </p>
                        </div>
                        <div className="col-md-3 mb-md-0 mb-3">
                            <h5 className="text-uppercase">Lenker</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <NavLink to={'/about'}>Om oss</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/welcome'}>Velkomstside</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright text-center py-3">© 2019 Copyright:
                    <a href="#">HverdagsHelt</a>
                </div>
            </footer>
        );
    }
}
export default Footer;