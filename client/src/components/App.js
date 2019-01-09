// @flow
import * as React from 'react';
import { Component } from 'react-simplified';

import '../styles/styles.css';
import '../styles/loginmodal.css';
import '../styles/registermodal.css';
import '../styles/grid-list-toggle.css';

import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div style={{fontSize: 25}}>
                This is the app, place all the initialization of other components here.
            </div>
        );
    }
}
export default App;