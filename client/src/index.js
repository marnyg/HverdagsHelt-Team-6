// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import App from './components/App.js';
import * as serviceWorker from './components/serviceWorker';

const root = document.getElementById('root');
ReactDOM.render(<App />, root); serviceWorker.unregister();
