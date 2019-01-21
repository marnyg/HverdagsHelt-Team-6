//@flow
import * as React from 'react';
import { Component } from 'react-simplified';

class AdminTeamList extends Component{
    render() {
        if(this.props.team === undefined || this.props.team === null) return null;
        return(
            <div className={'card'} style={{'max-height': '600px'}}>
                <div className={'list-group list-group-flush'} style={{overflow: 'scroll'}}>
                    {this.props.team.map(employee => {
                        return(
                            <div className={'list-group-item'}>
                                {employee.firstname} {employee.lastname}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
export default AdminTeamList;