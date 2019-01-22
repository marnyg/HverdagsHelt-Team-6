//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import Navigation from '../Navigation';
import Inbox from './Inbox';
import EmployeeService from "../../services/EmployeeService";
import Statistics from "../Statistics";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons/index';

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
        let statistics_tab = {
            path:'/employee/statistics',
            name: (
                <div>
                    <div className="badge badge-primary">
                        <FontAwesomeIcon icon={faChartLine}/>
                    </div> Statistikk
                </div>
            ),
            component: <Statistics/>,
        };

        let admin_tab = {
            path:'/employee/statistics',
            name: (
                <div>
                    <div className="badge badge-primary">
                        <FontAwesomeIcon icon={faUsers}/>
                    </div> Ditt Team
                </div>
            ),
            component: <Statistics/>
        };

        let left_tabs = [inbox_tab, started_tab, closed_tab];
        let right_tabs = [statistics_tab, admin_tab];
        return(
            <div className={'w-100'}>
                <Navigation left_tabs={left_tabs} right_tabs={right_tabs}/>
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