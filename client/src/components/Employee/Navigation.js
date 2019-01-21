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
        if(!this.props.tabs) return null;
        return(
            <div>
                <div>
                    <ul className={'nav nav-tabs bg-light pl-3'}>
                        {this.props.tabs.map(tab => {
                            return(<NavLink key={tab.path} className={'nav-link nav-item link-unstyled'} exact to={tab.path}>{tab.name}</NavLink>);
                        })}
                    </ul>
                </div>
                <div>
                    <div className={'w-100 py-5 px-2'}>
                        {this.props.tabs.map(tab => {
                            return(<Route exact path={tab.path} render={() => tab.component} />);
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigation;