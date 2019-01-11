// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import { MyCases } from './MyCases.js';
import NewCase from './NewCase';

class MiProfileEdit extends Component {
    asd = [
        { a: "asdasd", b: "dsadsa" },
        { a: "asdasd", b: "dsadsa" },
        { a: "asdasd", b: "dsadsa" },
        { a: "asdasd", b: "dsadsa" },
        { a: "asdasd", b: "dsadsa" }
    ];
    render() {
        return (
            <form classname="p-3">
                {this.asd.map(e => {
                    return (
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">{e.a + "    "}</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="staticEmail" defaultValue={e.b}></input>
                            </div>
                        </div>)
                })}
                < button className="btn btn-primary" > Rediger Profil</button >

            </form >
        );
    }
}

export default MiProfileEdit

