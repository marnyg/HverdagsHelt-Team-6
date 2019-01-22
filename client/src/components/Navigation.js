//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink , Route } from 'react-router-dom';

class Navigation extends Component<{tabs: []}>{
    /*
    prop example:
    tabs = [
        {path: '/employee/inbox', name: 'Inbox', component: <MySubComponent my-sub-comp-prop={data}/>}
    ];
    */
    render() {
        return(
            <div className={'w-100'}>
                <div className={'w-100'}>
                    <ul className={'nav nav-tabs bg-light pl-3'}>
                        {this.left()}
                        {this.right()}
                    </ul>
                </div>
                <div>
                    <div className={'w-100 py-5 px-2'}>
                        {this.left_routes()}
                        {this.right_routes()}
                    </div>
                </div>
            </div>
        );
    }

    left(){
        if(this.props.left_tabs){
            return(
                this.props.left_tabs.map(tab =>
                        <NavLink
                            key={tab.path}
                            className={'nav-item nav-link link-unstyled ' + (tab.className ? tab.className:null) }
                            style={(tab.style ? tab.style:null)}
                            exact to={tab.path}>{tab.name}</NavLink>
                )
            );
        } else {
            return null;
        }
    }

    left_routes() {
        if(this.props.left_tabs){
            return(
                this.props.left_tabs.map(tab =>
                    <Route exact path={tab.path} render={() => tab.component} />
                )
            );
        } else {
            return null;
        }
    }

    right(){
        if(this.props.right_tabs){
            /*
            return(
                <div className={'ml-auto'}>
                    <NavLink
                        className={'nav-item nav-link link-unstyled d-inline-block'}
                        exact to={'/employee/inbox'}>Test</NavLink>
                    <NavLink
                        className={'nav-item nav-link link-unstyled d-inline-block'}
                        exact to={'/employee/inbox'}>Test</NavLink>
                    <NavLink
                        className={'nav-item nav-link link-unstyled d-inline-block'}
                        exact to={'/employee/inbox'}>Test</NavLink>
                </div>
            );
            */

            return(
                <div className={'ml-auto mr-3'}>
                    {this.props.right_tabs.map(tab => (
                        <NavLink
                            key={tab.path}
                            className={'nav-item nav-link link-unstyled d-inline-block'}
                            exact to={tab.path}>{tab.name}</NavLink>
                    ))}
                </div>
            );

        } else {
            return null;
        }
    }

    right_routes() {
        if(this.props.right_tabs){
            return(
                this.props.right_tabs.map(tab =>
                    <Route exact path={tab.path} render={() => tab.component} />
                )
            );
        } else {
            return null;
        }
    }
}

export default Navigation;
