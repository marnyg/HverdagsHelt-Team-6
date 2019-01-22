//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import ToolService from '../../services/ToolService';

class AdminCaseList extends Component {
    render() {
        return(
            <div className={'card mt-3'} style={{'overflow':'scroll','maxHeight': '500px'}}>
                <table className="table table-hover table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Sak ID</th>
                        <th scope="col">Eier</th>
                        <th scope="col">Publisert</th>
                        <th scope="col">Sist endret</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.cases.map(c => {
                        return(
                            <tr key={c.case_id} style={{ cursor: 'pointer' }}>
                                <td onClick={(event) => this.props.onCaseSelected(c)}>{c.case_id}</td>
                                <td onClick={(event) => this.props.onCaseSelected(c)}>{c.createdBy}</td>
                                <td onClick={(event) => this.props.onCaseSelected(c)}>{ToolService.dateFormat(c.createdAt)}</td>
                                <td onClick={(event) => this.props.onCaseSelected(c)}>{ToolService.dateFormat(c.updatedAt)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default AdminCaseList;