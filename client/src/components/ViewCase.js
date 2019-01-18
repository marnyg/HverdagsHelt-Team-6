//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { withRouter } from 'react-router-dom';
import CategoryService from '../services/CategoryService';
import CaseService from '../services/CaseService';
import StatusService from '../services/StatusService';
import StatusCommentService from '../services/StatusCommentService';
import Notify from './Notify';
import GoogleApiWrapper from './GoogleApiWrapper';
import Case from '../classes/Case';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Picture from '../classes/Picture';

// Constants used for colouring status fields in table

const statusClosed = 3;
const statusProcesing = 2;
const statusOpen = 1;
const green = { color: 'green' };
const orange = { color: 'orange' };
const red = { color: 'red' };
const MAX_NUMBER_IMG = 3;

class ViewCase extends Component<{ match: { params: { case_id: number } } }> {
  case: Case = null;
  deletedImages: string[] = [];
  statuses = [];
  categories = [];
  lastResortPos = { lat: 59.9138688, lon: 10.752245399999993 }; // Last resort position OSLO
  pos = this.lastResortPos;
  statusMessage = [];
  statusForm = null;
  messageForm = null;
  fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  render() {
    if (!this.case) {
      return null;
    }

    // TODO Del opp grantAcess() til tre deler. 1. Kan ikke editere noen ting. 2. Kan sette kategori og status. 3. Kan også sende melding.

    if (this.grantAccess()) {
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
                    <td>Kategori</td>
                    <td>{this.case.category_name}</td>
                  </tr>
                  <tr>
                    <td>Sak sendt av</td>
                    <td>{this.case.createdBy}</td>
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
              <h2>Sett kategori</h2>
              <select
                defaultValue={this.getInitialCategory()}
                onChange={this.categoryListener}
                className={'form-control'}
                id={'category'}
                required
              >
                {this.categories.map(e => (
                  <option key={e.category_id} value={e.category_id}>
                    {' '}
                    {e.name}{' '}
                  </option>
                ))}
              </select>
              <h2>Sett saksstatus</h2>
              <select
                defaultValue={this.getInitialStatus()}
                onChange={this.statusListener}
                className={'form-control'}
                id={'category'}
                required
              >
                {this.statuses.map(e => (
                  <option key={e.status_id} value={e.status_id}>
                    {' '}
                    {e.name}{' '}
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
              {this.case.img.length < MAX_NUMBER_IMG ? (
                <div className={'form-group'}>
                  <label htmlFor={'image-input'}>Legg ved bilder</label>
                  <input
                    className={'form-control-file'}
                    id={'image-inpu'}
                    type={'file'}
                    accept={'.png, .jpg, .jpeg'}
                    onChange={this.fileInputListener}
                  />
                </div>
              ) : null}
              <div className="container my-5">
                <div className="row">
                  {this.case.img.map(e => (
                    <div key={e.src} className="col-md-3">
                      <div className="card">
                        <img src={e.src} alt={e.src} className="card-img-top" />
                        <div className="card-img-overlay">
                          <button
                            className={'btn btn-danger img-overlay float-right align-text-bottom'}
                            onClick={(event, src) => this.fileInputDeleteImage(event, e.src)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
            <p id={'noComments'} style={{ color: '#666' }} hidden>
              Ingen har kommentert enda.
            </p>
            <ul className={'list-group'}>
              {this.statusMessage.map(e => (
                <li className={'list-group-item'} key={e.status_comment_id}>
                  <div>
                    <h4>{e.createdBy}</h4>
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
    } else {
      return (
        <div className={'modal-body row'}>
          <div className={'col-md-6'}>
            <div>
              <h1>{this.case.title}</h1>
              <table className={'table'}>
                <tbody>
                  <tr>
                    <td>Status</td>
                    <td style={this.getStatusColour(this.case.status_id)}>{this.case.status_name}</td>
                  </tr>
                  <tr>
                    <td>Kategori</td>
                    <td>{this.case.category_name}</td>
                  </tr>
                  <tr>
                    <td>Sak sendt av</td>
                    <td>{this.case.createdBy}</td>
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
            </div>
            <div className={'col-md-6 embed-responsive'}>
              <GoogleApiWrapper updatePos={this.updatePos} userPos={{ lat: this.pos.lat, lng: this.pos.lon }} />
            </div>
          </div>
          <div className={'col-md-6'}>
            <h2>Statusmeldinger</h2>
            <p id={'noComments'} style={{ color: '#666' }} hidden>
              Ingen har kommentert enda.
            </p>
            <ul className={'list-group'}>
              {this.statusMessage.map(e => (
                <li className={'list-group-item'} key={e.status_comment_id}>
                  <div>
                    <h4>{e.createdBy}</h4>
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
  }

  mounted() {
    let cas = new CaseService();
    let cascom = new StatusCommentService();
    let stat = new StatusService();
    let cat = new CategoryService();
    cas
      .getCase(this.props.match.params.case_id)
      .then((c: Case) => {
        if (c.length > 0) {
          let a = c[0];
          this.case = new Case(
            a.case_id,
            a.region_id,
            a.user_id,
            a.category_id,
            a.status_id,
            a.createdBy,
            a.title,
            a.description,
            a.status_name,
            a.region_name,
            a.county_name,
            a.category_name,
            a.createdAt,
            a.updatedAt,
            a.lat,
            a.lon
          );
          a.img.map(e => this.case.img.push({ src: e }));
        } else {
          this.case = null;
        }
      })
      .then(() => {
        cascom
          .getAllStatusComments(this.props.match.params.case_id)
          .then(e => {
            this.statusMessage = e;
            console.log('Statuskommentarer lengde = ' + this.statusMessage.length);
            if (this.statusMessage.length === 0) {
              let p = document.getElementById('noComments');
              console.log(p);
              if (p && p instanceof HTMLElement) {
                p.hidden = false;
              }
            }
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
        stat
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
          });
        cat
          .getAllCategories()
          .then(e => {
            this.categories = e;
          })
          .catch((err: Error) => {
            console.log('Could not load categories.');
            Notify.danger(
              'Klarte ikke å hente statuser. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                err.message
            );
          });
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
  }

  grantAccess() {
    let userObj = localStorage.getItem('user');
    if (this.case && userObj) {
      let user = JSON.parse(userObj);
      console.log(user);
      if (user.access_level > 2) {
        // User is a municipality employee. May edit any parametre of case
        return true;
      } else if (this.case.user_id !== user.user_id) {
        // User is owner of case, may not send messages
        return true;
      } else {
        // User is not authorized to edit case
        return 3;
      }
    }
  }

  getInitialCategory() {
    if (this.case) {
      let cat = this.categories.find(e => parseInt(e.category_id) === this.case.category_id);
      if (cat) {
        return cat.category_id;
      } else {
        return -1;
      }
    }
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
      let a = date.split('.')[0].replace('T', ' ');
      return a.substr(0, a.length - 3);
    } else {
      return 'Fant ikke dato.';
    }
  }

  updatePos(newPos: Object) {
    this.pos = newPos;
    console.log('got pos from map: ', this.pos);
  }

  categoryListener(event: SyntheticInputEvent<HTMLSelectElement>) {
    if (event.target && event.target instanceof HTMLSelectElement && this.case) {
      this.case.category_id = event.target.options[event.target.selectedIndex].value;
      console.log('this.case.category_id: ' + this.case.category_id);
    }
  }

  statusListener(event: SyntheticInputEvent<HTMLSelectElement>) {
    if (event.target && event.target instanceof HTMLSelectElement && this.case) {
      this.case.status_id = event.target.options[event.target.selectedIndex].value;
      console.log('this.case.status_id: ' + this.case.status_id);
    }
  }

  fileInputListener(event: SyntheticInputEvent<HTMLInputElement>) {
    let files = Array.from(event.target.files);
    console.log(files);

    if (files.length === 0) {
      // No files were selected. No changes committed.
      console.log('No files were selected.');
    } else {
      // Files selected. Processing changes.
      console.log('Files were selected.');
      // Redundant file type check.
      if ((files = files.filter(e => this.fileTypes.includes(e.type)))) {
        // File type is accepted.
        if (files.length + this.case.img.length <= MAX_NUMBER_IMG) {
          files.map(e => {
            this.case.img.push({
              value: e,
              alt: 'Bildenavn: ' + e.name,
              src: URL.createObjectURL(e)
            });
          });
        } else {
          console.log(
            'Max number of pictures (' +
              MAX_NUMBER_IMG +
              ') reached. \nCurrent embedded images: ' +
              this.case.img.length +
              '\nTried to add: ' +
              files.length +
              ' new files.'
          );
          Notify.warning(
            'Du kan maksimalt feste ' + MAX_NUMBER_IMG + ' til en sak. Noen bilder må slettes før du kan legge til nye.'
          );
        }
      } else {
        // File type not accepted.
        console.warn('File type not accepted.');
        Notify.warning('Filtypen er ikke støttet. Vennligst velg et bilde med format .jpg, .jpeg eller .png.');
      }
    }
  }

  fileInputDeleteImage(event: SyntheticInputEvent<HTMLInputElement>, src: string) {
    this.deletedImages.push(this.case.img.find(e => e.src === src));
    this.case.img = this.case.img.filter(e => e.src !== src);
    console.log('Deleting image file with src = ' + src);
    console.log('this.deletedImages: ' + JSON.stringify(this.deletedImages));
    console.log('this.case.img: ' + JSON.stringify(this.case.img));
  }

  submit() {
    console.log('Clicked submit! this.case:');
    console.log(this.case);
  }
}

export default withRouter(ViewCase);
