// @flow
import * as React from 'react';
import { Component } from 'react-simplified';



export class Minside extends Component {
    render() {
        return (
            <div class="wrapper">
                <nav id="sidebar" class="bg-danger ">
                    <div class="sidebar-header">
                        <h2>Sidebar</h2>
                    </div>

                    <ul class="list-unstyled components">
                        <li>
                            <a href="#">About</a>
                        </li>
                        <li>
                            <a href="#">Portfolio</a>
                        </li>
                        <li>
                            <a href="#">Contact</a>
                        </li>
                    </ul>
                </nav>
                <div class="bg-warning">
                    Velit aliquip tempor sint quis dolor amet cupidatat
                      quis cupidatat est sint officia tempor enim.
                       Id dolore sint aliqua in velit irure occaecat
                        ullamco reprehenderit.
                </div>
            </div >
        );
    }
}