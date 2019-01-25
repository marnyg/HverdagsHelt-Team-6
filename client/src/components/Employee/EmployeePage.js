//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import Navigation from '../Navigation';
import Inbox from './Inbox';
import EmployeeService from "../../services/EmployeeService";
import Statistics from "../Statistics";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons/index';
import ToolService from "../../services/ToolService";

/**
 * EmployeePage Component. Displays employee actions in the top bar, and implements a table for cases due for action.
 */
class EmployeePage extends Component {
  inbox = [];
  closed = [];
  started = [];

  /**
   * Generates HTML code.
   * @returns {*} HTML Element with sub-elements.
   */
  render() {
    console.log(ToolService.getStatusColour(1));
    let inbox_tab = {
      path: '/employee/inbox',
      name: (
        <div>
          Innboks
          <div className="badge ml-2" style={{ backgroundColor: ToolService.getStatusColour(1).color, color: 'white' }}>
            {this.inbox.length}
          </div>
        </div>
      ),
      component: <Inbox cases={this.inbox} />
    };
    let started_tab = {
      path: '/employee/started',
      name: (
        <div>
          Under behandling
          <div className="badge ml-2" style={{ backgroundColor: ToolService.getStatusColour(2).color, color: 'white' }}>
            {this.started.length}
          </div>
        </div>
      ),
      component: <Inbox cases={this.started} />
    };
    let closed_tab = {
      path: '/employee/closed',
      name: (
        <div>
          Lukket
          <div className="badge ml-2" style={{ backgroundColor: ToolService.getStatusColour(3).color, color: 'white' }}>
            {this.closed.length}
          </div>
        </div>
      ),
      component: <Inbox cases={this.closed} />
    };
    let statistics_tab = {
      path: '/employee/statistics',
      name: (
        <div>
          <div className="badge" style={{ backgroundColor: ToolService.getStatusColour(2).color, color: 'white' }}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>{' '}
          Statistikk
        </div>
      ),
      component: <Statistics />
    };

        let left_tabs = [inbox_tab, started_tab, closed_tab];
        let right_tabs = [statistics_tab];
        return(
            <div className={'w-100'}>
                <Navigation left_tabs={left_tabs} right_tabs={right_tabs}/>
            </div>
        );
    }

  /**
   * When component mounts: fetches cases and initiates component variable states.
   */
  mounted() {
    $('#spinner').hide();
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.fetchCases(user.region_id);
    }
  }

  /**
   * Fetch cases, given unique region id number.
   * @param region_id Id number, uniquely identifying a region.
   */
  fetchCases(region_id: number) {
    let employeeService = new EmployeeService();

    employeeService
      .getOpenCases(region_id)
      .then((cases: Case[]) => {
        this.inbox = cases;
      })
      .catch((error: Error) => console.error(error));

    employeeService
      .getStartedCases(region_id)
      .then((cases: Case[]) => {
        //console.log('Started cases:', cases);
        this.started = cases;
      })
      .catch((error: Error) => console.error(error));

    employeeService
      .getClosedCases(region_id)
      .then((cases: Case[]) => {
        //console.log('Closed cases:', cases);
        this.closed = cases;
      })
      .catch((error: Error) => console.error(error));
  }
}

export default EmployeePage;