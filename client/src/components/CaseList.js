//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, withRouter } from 'react-router-dom';
import CaseService from '../services/CaseService';
import Notify from './Notify';

// Constants used for colouring status fields in table

const statusClosed = 3;
const statusProcesing = 2;
const statusOpen = 1;
const green = { color: 'green' };
const orange = { color: 'orange' };
const red = { color: 'red' };

class CaseList extends Component<{ props: { user_id: number, region_id: number }  }> {
    cases = [];

    render() {
        if (!this.cases) {
            return null;
        }

        return (
            <div>
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
                        {this.cases.map(c => (
                            <tr key={c.case_id} style={{ cursor: 'pointer' }} onClick={this.onClickTableRow}>
                                <td>
                                    {
                                        c.title.trim().length > 25 ? c.title.trim().substring(0, 25) : c.title.trim()
                                    }
                                </td>
                                <td style={this.getStatusColour(c.status_id)}>{c.status_name}</td>
                                <td className={'desktop-table-column'}>{c.region_name}</td>
                                <td className={'desktop-table-column'}>{this.dateFormat(c.createdAt)}</td>
                                <td className={'desktop-table-column'}>{this.dateFormat(c.updatedAt)}</td>
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

    mounted() {
        let id;
        let cas = new CaseService();
        let token = localStorage.getItem('token');

        console.log("user_id: " + this.props.user_id + ", region_id: " + this.props.region_id);
        if (this.props.user_id) {
            // Set up table for cases on per user basis
            cas
                .getAllCasesGivenUser(this.props.user_id)
                .then(cases => {
                    this.cases = cases;
                    console.log('Length of this.cases = ' + this.cases.length);
                    console.log(this.cases);
                    if (this.cases.length === 0) {
                        document.querySelector('#noEntries').hidden = false;
                        Notify.info(
                            "Vi fant ingen saker for denne brukeren. Du kan lage en ny sak ved å trykke 'Registrer Sak' øverst i navigasjonsbaren."
                        );
                    }
                })
                .catch((err: Error) => {
                    Notify.danger(
                        'Det oppstod en feil under henting av dine saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
                        err.message
                    );
                    console.log('Error when fetching cases for user with id ' + id + '.\nError message is: ' + err.message);
                });
        } else if (this.props.region_id) {
            // Set up table for cases on per municipality/region basis
            cas
                .getAllCasesGivenRegionId(this.props.region_id)
                .then(cases => {
                    this.cases = cases;
                    console.log('Length of this.cases = ' + this.cases.length);
                    console.log(this.cases);
                    if (this.cases.length === 0) {
                        document.querySelector('#noEntries').hidden = false;
                        Notify.info('Vi fant ingen saker for denne kommunen.');
                    }
                })
                .catch((err: Error) => {
                    Notify.danger(
                        'Det oppstod en feil under henting av kommunens saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
                        err.message
                    );
                    console.log('Error when fetching cases for region with id ' + id + '.\nError message is: ' + err.message);
                });
        } else {
            console.warn("Didn't find user_id or region_id");
            Notify.danger(
                'Kunne ikke finne bruker eller kommunedata for å hente saker fra server. Vennligst gå tilbake til hovedsida.'
            );
        }
    }

    getStatusColour(status_id: number) {
        switch (status_id) {
            case statusClosed:
                return green;
            case statusProcesing:
                return orange;
            case statusOpen:
                return red;
        }
    }

    onClickTableRow(event: SyntheticInputEvent<HTMLInputElement>) {
        console.log("Trykket på tabell.");
        if (event.target && event.target.parentElement instanceof HTMLTableRowElement) {
            let case_id = this.cases[event.target.parentElement.rowIndex - 1].case_id;
            console.log(case_id);
            this.props.history.push('/case/' + case_id);
        }else{
            Notify.danger("Kunne ikke videresende deg til sak.");
        }
    }

    dateFormat(date: string) {
        if (date) {
            let a = date.split('.')[0].replace('T', ' ');
            return a.substr(0, a.length - 3);
        } else {
            return 'Fant ikke dato.';
        }
    }
}

export default withRouter(CaseList);
