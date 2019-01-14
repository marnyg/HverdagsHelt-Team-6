//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, withRouter } from 'react-router-dom';
import CaseService from '../services/CaseService';
import StatusCommentService from '../services/StatusCommentService';
import Notify from './Notify';
import GoogleApiWrapper from './GoogleApiWrapper';
import Case from '../classes/Case';

// Constants used for colouring status fields in table

const statusClosed = 3;
const statusProcesing = 2;
const statusOpen = 1;
const green = { color: 'green' };
const orange = { color: 'orange' };
const red = { color: 'red' };

class ViewCase extends Component<{ match: { params: { case_id: number } } }> {
  case = {
    user_id: 1002,
    caseworker_id: 100,
    case_id: 1283921234,
    region_id: 1006,
    status_id: 1,
    title: 'Elendig vei!!!',
    description:
      'Dette er totalt uakseptabelt. Nå har jeg kjørt på denne forbaska grusveien i 2 år, og nå er det samme mange hull at det ødelegger bilen min! Dere får 1 måned på å fikse dette ellers går jeg til sak mot kommunen. Jeg har en DYYYYYR Tesla som DERE udugelige politikere ødelegger med inkompetansen deres. Grønnt skifte MY ASS!!!!!!|||||oneone',
    user_name: 'Mr. T',
    caseworker_name: 'Anne B. Ragde',
    region_name: 'Stjørdal',
    status_name: 'Åpen',
    createdAt: '2019-01-01T13:37:00.000Z',
    updatedAt: '2019-01-01T13:37:00.000Z'
  };

  statuses = [
    { status_id: 0, status_name: 'Åpen' },
    { status_id: 1, status_name: 'Under behandling' },
    { status_id: 2, status_name: 'Lukket' }
  ];
  images = [];
  lastResortPos = { lat: 59.9138688, lon: 10.752245399999993 }; // Last resort position OSLO
  pos = this.lastResortPos;
  statusMessage = [
    {
      status_comment_id: 11,
      case_id: 100,
      region_id: 103,
      region_name: 'Trondheim',
      status_id: 2,
      status_name: 'Under behandling',
      user_id: 309,
      caseworker_name: 'Nils Arne Eggen',
      comment:
        'Kom igjen gutta, stå på! D va slagorde på RBK-plata æ va me på. Dæven døtte sykkelstøtte. Du må bruk gofoten, sjøl om æ har sagd av gofoten på St. Olavs. D har itj så my med vei å gjør, men d e nå arti å blæs ut litt skitprat ein gång i blant!',
      createdAt: '2019-01-01T13:37:00.000Z',
      updatedAt: '2019-01-01T13:37:00.000Z'
    },
    {
      status_comment_id: 12,
      case_id: 100,
      region_id: 103,
      region_name: 'Trondheim',
      status_id: 2,
      status_name: 'Under behandling',
      user_id: 21,
      caseworker_name: 'Piers Morgan',
      comment: "I don't know what I'm doing here, but being the most disliked British TV anchor suits me very well!",
      createdAt: '2019-01-01T13:37:00.000Z',
      updatedAt: '2019-01-01T13:37:00.000Z'
    }
  ];
  statusForm = null;
  messageForm = null;

  render() {
    if (!this.case) {
      return null;
    }

    return (
      <div className={'modal-body row'}>
        <div className={'col-md-6'}>
          <form
            ref={e => {
              this.messageForm = e;
            }}
          >
            <h1>{this.case.title}</h1>
            <table className={'table'}>
              <tbody>
                <tr>
                  <td>Status</td>
                  <td style={this.getStatusColour(this.case.status_id)}>{this.case.status_name}</td>
                </tr>
                <tr>
                  <td>Sak sendt av</td>
                  <td>{this.case.user_name}</td>
                </tr>
                <tr>
                  <td>Sak opprettet</td>
                  <td>{this.dateFormat(this.case.createdAt)}</td>
                </tr>
                <tr>
                  <td>Sist oppdatert</td>
                  <td>{this.dateFormat(this.case.updatedAt)}</td>
                </tr>
              </tbody>
            </table>
            <p>{this.case.description}</p>
            <h2>Sett saksstatus</h2>
            <select defaultValue={this.getInitialStatus()} className={'form-control'} id={'category'} required>
              {this.statuses.map(e => (
                <option key={e.status_id} value={e.status_id}>
                  {' '}
                  {e.status_name}{' '}
                </option>
              ))}
            </select>
            <div className={'form-group'}>
              <label htmlFor="description">Melding</label>
              <textarea
                className={'form-control'}
                id={'description'}
                maxLength={255}
                minLength={2}
                placeholder="Melding"
                required
              />
            </div>
          </form>
          <button className={'btn btn-primary mr-2'} onClick={this.submit}>
            Oppdater
          </button>
          <div className={'col-md-6 embed-responsive'}>
            <GoogleApiWrapper updatePos={this.updatePos} userPos={{ lat: this.pos.lat, lng: this.pos.lon }} />
          </div>
        </div>
        <div className={'col-md-6'}>
          <h2>Statusmeldinger</h2>
          <ul className={'list-group'}>
            {this.statusMessage.map(e => (
              <li className={'list-group-item'} key={e.status_comment_id}>
                <div>
                  <h4>{e.user_name}</h4>
                  <p>{this.dateFormat(e.createdAt)}</p>
                  <p>{e.comment}</p>
                  <p style={this.getStatusColour(e.status_id)}>{e.status_name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  getInitialStatus() {
    if (this.case) {
      let status = this.statuses.find(e => parseInt(e.status_id) === this.case.status_id);
      if (status) {
        return status.status_id;
      } else {
        return -1;
      }
    }
  }

  mounted() {
    this.props.match.params.case_id = 1; // Placeholder!!!
    let cas = new CaseService();
    let cascom = new StatusCommentService();
    // let stat = new StatusService();
    let token = localStorage.getItem('token');
    cas
      .getCase(this.props.match.params.case_id)
      .then(e => {
        this.case = e;
      })
      .catch((err: Error) => {
        console.log('Could not load case with id ' + this.props.match.params.case_id);
        Notify.danger(
          'Klarte ikke å hente sak med id ' +
            this.props.match.params.case_id +
            '. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
            err.message
        );
      });
    cascom
      .getAllStatusComments(this.props.match.params.case_id)
      .then(e => {
        this.statusMessage = e;
        console.log(this.statusMessage);
      })
      .catch((err: Error) => {
        console.log('Could not load case comments for case with id ' + this.props.match.params.case_id);
        Notify.danger(
          'Klarte ikke å hente kommentarer til sak med id ' +
            this.props.match.params.case_id +
            '. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
            err.message
        );
      });
    /*stat
      .getAllStatuses()
      .then(e => {
        this.statuses = e;
      })
      .catch((err: Error) => {
        console.log('Could not load statuses.');
        Notify.danger(
          'Klarte ikke å hente statuser. ' +
            'Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
            err.message
        );
      });*/
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

  dateFormat(date: string) {
    if (date) {
      return date.split('.')[0].replace('T', ' ');
    } else {
      return 'Fant ikke dato.';
    }
  }

  updatePos(newPos) {
    this.pos = newPos;
    console.log('got pos from map: ', this.pos);
  }

  sendMessage() {
    console.log('Clicked send message!');
    if (this.messageForm) {
      let textarea = this.messageForm.querySelector('textarea');
      if (this.messageForm && this.messageForm.checkValidity() && textarea instanceof HTMLTextAreaElement) {
        let comment = {
          case_id: this.case.case_id,
          status: this.case.status_id,
          comment: textarea.value
        };
        console.log(comment);
      }
    }
  }

  submit() {
    console.log('Clicked submit!');
  }
}

export default withRouter(ViewCase);
