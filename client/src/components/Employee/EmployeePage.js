//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import Navigation from './Navigation';
import Inbox from './Inbox';
import EmployeeService from "../../services/EmployeeService";

class EmployeePage extends Component{
    inbox = [];
    closed = [];
    started = [];

    render() {
        let inbox_tab = {
            path:'/employee/inbox', name: (
                <div>
                    Inbox
                    <div className="badge badge-danger ml-2">{this.inbox.length}</div>
                </div>
            ),
            component: <Inbox cases={this.inbox}/>
        };
        let started_tab = {
            path:'/employee/started', name: (
                <div>
                    Started
                    <div className="badge badge-warning ml-2">{this.started.length}</div>
                </div>
            ), component: <Inbox cases={this.started}/>
        };
        let closed_tab = {
            path:'/employee/closed', name: (
                <div>
                    Closed
                    <div className="badge badge-success ml-2">{this.closed.length}</div>
                </div>
            ), component: <Inbox cases={this.closed}/>
        };

        let tabs = [inbox_tab, started_tab, closed_tab];
        return(
            <div>
                <Navigation tabs={tabs}/>
            </div>
        );
    }

    mounted() {
        console.log('EmployeePage mounted');
        let user = JSON.parse(localStorage.getItem('user'));
        if(user){
            this.fetchCases(user.region_id);
        }
    }

    fetchCases(region_id: number) {
        let employeeService = new EmployeeService();

        employeeService.getOpenCases(region_id)
            .then((cases: Case[]) => {
                this.inbox = cases;
            })
            .catch((error: Error) => console.error(error));

        employeeService.getStartedCases(region_id)
            .then((cases: Case[]) => {
                //console.log('Started cases:', cases);
                this.started = cases;
            })
            .catch((error: Error) => console.error(error));

        employeeService.getClosedCases(region_id)
            .then((cases: Case[]) => {
                //console.log('Closed cases:', cases);
                this.closed = cases;
            })
            .catch((error: Error) => console.error(error));
    }
}

export default EmployeePage;