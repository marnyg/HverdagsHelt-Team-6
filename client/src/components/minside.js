// @flow
import * as React from 'react';
import { Component } from 'react-simplified';


import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div class="row">
                <div class="col-4">.col-4<br>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
                    <div class="col-6">.col-6<br>Subsequent columns continue along the new line.</div>
                    </div>
                    );
                }
            }
export default App;