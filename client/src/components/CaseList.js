//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, withRouter } from 'react-router-dom';
import Notify from './Notify';
import ToolService from '../services/ToolService';
import Case from '../classes/Case';
import CaseService from '../services/CaseService';
import CaseSubscription from '../classes/CaseSubscription';
import CaseSubscriptionService from '../services/CaseSubscriptionService';
import Alert from './Alert.js';

// Constants used for colouring status fields in table

const ITEMS_PER_QUERY = 3;
const STATUS_CAN_DELETE = 1;
const subscriptionButtonStyles = ['btn btn-info', 'btn btn-outline-info'];

class CaseList extends Component<{ user_id: ?number, region_id: ?number }> {
  cases: Case[] = [];
  subscriptions: CaseSubscription[] = [];
  pagenumber: number = 1;
  fetchButton = null;
  error = null;

  render() {
    if (!this.cases) {
      return null;
    }

    return (
      <div className={'card my-3 mx-3'}>
        {this.error}
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">Tittel</th>
              <th scope="col">Status</th>
              <th scope="col">Kommune</th>
              <th scope="col">Eier</th>
              <th scope="col">Dato opprettet</th>
              <th scope="col">Siste oppdatering</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {this.cases.map(c => (
              <tr key={c.case_id} style={{ cursor: 'pointer' }}>
                <td onClick={this.onClickTableRow}>{c.title.trim()}</td>
                <td onClick={this.onClickTableRow} style={ToolService.getStatusColour(c.status_id)}>
                  {c.status_name}
                </td>
                <td onClick={this.onClickTableRow}>{c.region_name}</td>
                <td onClick={this.onClickTableRow}>{c.createdBy}</td>
                <td onClick={this.onClickTableRow}>{ToolService.dateFormat(c.createdAt)}</td>
                <td onClick={this.onClickTableRow}>{ToolService.dateFormat(c.updatedAt)}</td>
                <td>
                  {this.canDelete(c) ? (
                    <div className="btn-group mr-2" role="group">
                      <button className={'btn btn-danger'} onClick={this.onClickDeleteButton}>
                        Slett
                      </button>
                      {this.isSubscribed(c) ? (
                        <button className={this.getSubscriptionButtonStyles(c)} onClick={this.onClickSubscribeButton}>
                          Slutt å følg
                        </button>
                      ) : (
                        <button className={this.getSubscriptionButtonStyles(c)} onClick={this.onClickSubscribeButton}>
                          Følg sak
                        </button>
                      )}
                    </div>
                  ) : ToolService.getUser() !== null ? (
                    <div>
                      {this.isSubscribed(c) ? (
                        <button className={this.getSubscriptionButtonStyles(c)} onClick={this.onClickSubscribeButton}>
                          Slutt å følg
                        </button>
                      ) : (
                        <button className={this.getSubscriptionButtonStyles(c)} onClick={this.onClickSubscribeButton}>
                          Følg sak
                        </button>
                      )}
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.cases.length === 0 ? <p>Vi fant ingen saker for deg.</p> : null}
        <button
          ref={e => {
            this.fetchButton = e;
          }}
          className={'btn btn-secondary'}
          onClick={this.fetchCases}
        >
          Hent flere saker
        </button>
      </div>
    );
  }

  mounted() {
    this.fetchCases();
    this.fetchSubscriptions();
  }

  fetchCases() {
    let cas = new CaseService();
    if (this.props.user_id) {
      // Set up table for cases on per user basis
      cas
        .getAllCasesGivenUser(this.props.user_id, this.pagenumber, ITEMS_PER_QUERY)
        .then(cases => {
          this.cases.push.apply(this.cases, cases);
          this.pagenumber++;
          if (this.fetchButton && cases.length < ITEMS_PER_QUERY) {
            this.fetchButton.hidden = true;
          }
        })
        .catch((err: Error) => {
          this.error = (
            <Alert
              type="danger"
              text={
                'Det oppstod en feil under henting av dine saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
                err.message
              }
            />
          );
          /*Notify.danger(
            'Det oppstod en feil under henting av dine saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
              err.message
          );*/
          console.log(
            'Error when fetching cases for user with id ' +
              this.props.user_id.toString() +
              '.\nError message is: ' +
              err.message
          );
        });
    } else if (this.props.region_id) {
      // Set up table for cases on per municipality/region basis
      cas
        .getAllCasesGivenRegionId(this.props.region_id, this.pagenumber, ITEMS_PER_QUERY)
        .then(cases => {
          this.cases.push.apply(this.cases, cases);
          this.pagenumber++;
          if (this.fetchButton && cases.length < ITEMS_PER_QUERY) {
            this.fetchButton.hidden = true;
          }
        })
        .catch((err: Error) => {
          this.error = (
            <Alert
              type="danger"
              text={
                'Det oppstod en feil under henting av kommunens saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
                err.message
              }
            />
          );
          /*Notify.danger(
            'Det oppstod en feil under henting av kommunens saker. Hvis feilen vedvarer kontakt oss. \n\nFeilmelding: ' +
              err.message
          );*/
          console.log(
            'Error when fetching cases for region with id ' +
              this.props.region_id.toString() +
              '.\nError message is: ' +
              err.message
          );
        });
    } else {
      console.warn("Didn't find user_id or region_id");
      this.error = (
        <Alert
          type="danger"
          text="Kunne ikke finne bruker eller kommunedata for å hente saker fra server. Vennligst gå tilbake til hovedsida."
        />
      );
      /*Notify.danger(
        'Kunne ikke finne bruker eller kommunedata for å hente saker fra server. Vennligst gå tilbake til hovedsida.'
      );*/
    }
  }

  fetchSubscriptions() {
    let sub = new CaseSubscriptionService();
    let user_id = ToolService.getUserId();
    sub
      .getAllCaseSubscriptions(user_id)
      .then(e => {
        this.subscriptions = e;
      })
      .then(() => console.log('this.subscriptions: ', this.subscriptions))
      .catch((err: Error) => {
        console.log('Could not fetch subscriptions for user with id: ' + user_id);
        this.error = (
          <Alert
            type="danger"
            text={'Kunne ikke hente abonnement. Hvis problemet vedvarer kontakt oss. \n\nFeilmelding: ' + err.message}
          />
        );
        /*Notify.danger(
          'Kunne ikke hente abonnement. Hvis problemet vedvarer kontakt oss. \n\nFeilmelding: ' + err.message
        );*/
      });
  }

  isOwner(c: Case) {
    return ToolService.getUserId() === c.user_id;
  }

  isSubscribed(c: Case) {
    return this.subscriptions.some(e => e.case_id === c.case_id);
  }

  getSubscriptionButtonStyles(c: Case) {
    if (this.isSubscribed(c)) {
      return subscriptionButtonStyles[1];
    } else {
      return subscriptionButtonStyles[0];
    }
  }

  canDelete(c: Case) {
    if (c.status_id === STATUS_CAN_DELETE) {
      return this.isOwner(c);
    } else {
      return false;
    }
  }

  onClickTableRow(event: SyntheticInputEvent<HTMLInputElement>) {
    console.log('Trykket på tabell.');
    if (event.target && event.target.parentElement instanceof HTMLTableRowElement) {
      let case_id = this.cases[event.target.parentElement.rowIndex - 1].case_id;
      console.log(case_id);
      this.props.history.push('/case/' + case_id);
    } else {
      this.error = <Alert type="danger" text="Kunne ikke videresende deg til sak." />;
      //Notify.danger('Kunne ikke videresende deg til sak.');
    }
  }

  onClickDeleteButton(event: SyntheticInputEvent<HTMLButtonElement>) {
    console.log('Trykket SLETT!');
    let cas = new CaseService();
    let td = event.target.parentElement.parentElement;
    if (td && td.parentElement && td.parentElement instanceof HTMLTableRowElement) {
      let case_id = this.cases[td.parentElement.rowIndex - 1].case_id;
      console.log('Requesting to delete case with id: ' + case_id);
      cas
        .deleteCase(case_id)
        .then(() => {
          console.log('Delete successful!');
          this.error = <Alert type="success" text={'Din sak med id ' + case_id + ' ble slettet.'} />;
          //Notify.success('Din sak med id ' + case_id + ' ble slettet.');
          this.cases = this.cases.filter(e => e.case_id !== case_id);
        })
        .catch((err: Error) => {
          console.log('Could not delete case with id ' + case_id + ': ', err);
          this.error = <Alert type="danger" text={'Kunne ikke slette sak. \n\nFeilmelding: ' + err.message} />;
          //Notify.danger('Kunne ikke slette sak. \n\nFeilmelding: ' + err.message);
        });
    } else {
      console.log('Did not find case_id to delete.');
    }
  }

  onClickSubscribeButton(event: SyntheticInputEvent<HTMLButtonElement>) {
    console.log('Clicked subscribe button 2!');
    let sub = new CaseSubscriptionService();
    let td = event.target.parentElement.parentElement;
    if (td && td.parentElement && td.parentElement instanceof HTMLTableRowElement) {
      let c = this.cases[td.parentElement.rowIndex - 1];
      if (this.isSubscribed(c)) {
        // Unsubscribe the user from this case
        sub
          .deleteCaseSubscription(c.case_id, ToolService.getUserId())
          .then(() => {
            this.subscriptions = this.subscriptions.filter(e => e.case_id !== c.case_id);
            //console.log("Unsubscribed, returned: ", e);
          })
          .catch((err: Error) => {
            console.log('Could not unsubscribe user from case with id ' + c.case_id);
            this.error = (
              <Alert
                type="warning"
                text={'Det oppstod en feil ved sletting av abonnement på saken. \n\nFeilmelding: ' + err.message}
              />
            );
            //Notify.warning('Det oppstod en feil ved sletting av abonnement på saken. \n\nFeilmelding: ' + err.message);
          });
      } else {
        // Subscribe this case to user
        let s = new CaseSubscription(ToolService.getUserId(), c.case_id, false, true);
        sub
          .createCaseSubscription(s)
          .then(e => {
            console.log('Subscribed, returned: ', e);
            this.subscriptions.push(e);
          })
          .catch((err: Error) => {
            console.log('Could not unsubscribe user from case with id ' + c.case_id);
            this.error = (
              <Alert
                type="warning"
                text={'Det oppstod en feil ved sletting av abonnement på saken. \n\nFeilmelding: ' + err.message}
              />
            );
            //Notify.warning('Det oppstod en feil ved sletting av abonnement på saken. \n\nFeilmelding: ' + err.message);
          });
      }
    } else {
      console.log('Did not find case_id to alter subscription.');
    }
  }
}
export default withRouter(CaseList);
