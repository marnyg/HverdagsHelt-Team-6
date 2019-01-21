//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import Notify from "../Notify";
import { withRouter } from 'react-router-dom';

const statusClosed = 3;
const statusProcesing = 2;
const statusOpen = 1;
const green = { color: 'green' };
const orange = { color: 'orange' };
const red = { color: 'red' };

class Inbox extends Component{
    render() {
        return(
            <div>
                {this.props.optional ? this.props.optional:null}
                <div className={'card mx-3'}>
                    <table className="table table-hover table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Tittel</th>
                            <th scope="col">Status</th>
                            <th scope="col" className={'desktop-table-column'}>Kommune</th>
                            <th scope="col" className={'desktop-table-column'}>Dato opprettet</th>
                            <th scope="col" className={'desktop-table-column'}>Siste oppdatering</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.cases.map(c => (
                            <tr key={c.case_id} style={{ cursor: 'pointer' }} onClick={(event) => this.onClickTableRow(event, c)}>
                                <td>
                                    {
                                        c.title.trim().length > 25 ? c.title.trim().substring(0, 25) : c.title.trim()
                                    }
                                </td>
                                <td style={this.getStatusColour(c.status_id)}>{c.status_name}</td>
                                <td className={'desktop-table-column'}>{c.region_name}</td>
                                <td className={'desktop-table-column'}>{this.getTimeString(c.createdAt)}</td>
                                <td className={'desktop-table-column'}>{this.getTimeString(c.updatedAt)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p id={'noEntries'} style={{ color: '#666' }} hidden>
                        Ingen innlegg å vise.
                    </p>
                </div>
            </div>
        );
    }

    getTimeString(dateobject){
        if(dateobject){
            var basedate = dateobject.split("T")[0];
            var basetime = dateobject.split("T")[1].slice(0, -8);
            var YYYYMMDD = basedate.split("-");
            var outtime = basetime + " ";
            for(var i = YYYYMMDD.length-1; i >= 0; i--){
                if(i === 0){
                    outtime += YYYYMMDD[i] + "";
                } else {
                    outtime += YYYYMMDD[i] + "-";
                }
            }
            return outtime;
        } else {
            return "Could not calculate date"
        }
    }

    getStatusColour(status_id: number) {
        switch (status_id) {
            case 3:
                return green;
            case 2:
                return orange;
            case 1:
                return red;
        }
    }

    onClickTableRow(event, c) {
        this.props.history.push('/case/' + c.case_id);
    }
}

export default withRouter(Inbox);