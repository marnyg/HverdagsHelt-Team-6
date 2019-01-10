// @flow
import * as React from 'react';
import { Component } from 'react-simplified';

export class MinSide extends Component {
    render() {
        return (
            <div className="wrapper">
                <nav id="sidebar" className="bg-danger ">
                    <div className="sidebar-header">
                        <h2>Sidebar</h2>
                    </div>

                    <ul className="list-unstyled components">
                        <li>
                            <a href="#">Mine Saker</a>
                        </li>
                        <li>
                            <a href="#">Kommuner</a>
                        </li>
                        <li>
                            <a href="#">Contact</a>
                        </li>
                    </ul>
                </nav>
                <div className="bg-warning">
                    Velit aliquip tempor sint quis dolor amet cupidatat
                      quis cupidatat est sint officia tempor enim.
                       Id dolore sint aliqua in velit irure occaecat
                        ullamco reprehenderit.
                </div>
            </div >
        );
    }
}
export default MinSide;