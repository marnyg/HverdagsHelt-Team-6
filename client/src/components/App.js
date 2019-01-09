// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { Minside } from './Minside'
import { Footer } from './Footer'

import '../styles/styles.css';
import '../styles/loginmodal.css';
import '../styles/registermodal.css';
import '../styles/grid-list-toggle.css';
import '../styles/simple-sidebar.css';

import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div style={{ fontSize: 16 }}>
                This is the app, place all the initialization of other components here.
            <Minside ></Minside>
                <Footer></Footer>
            </div>

        );
    }
}
export default App;