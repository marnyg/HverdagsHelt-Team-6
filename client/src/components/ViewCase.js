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
import StatusComment from '../classes/StatusComment';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Picture from '../classes/Picture';
import ToolService from '../services/ToolService';

const statusStyles = [{ color: 'red' }, { color: 'orange' }, { color: 'green' }]; // Constant used for colouring status fields in table.
const MAX_NUMBER_IMG: number = 3; // Maximum number of images allwed in a single case.
const NOT_OWNER_NOT_EMPLOYEE: number = 3;
const OWNER_NOT_EMPLOYEE: number = 2;
const EMPLOYEE: number = 1;
const EMPLOYEE_ACCESS_LEVEL: number = 2;
const MAX_DESCRIPTION_LENGTH: number = 255;
const STATUS_OPEN: number = 1;

class ViewCase extends Component<{ match: { params: { case_id: number } } }> {
  case: Case = null;
  statusComment: StatusComment = null;
  deletedImages: string[] = [];
  statuses = [];
  categories = [];
  statusMessages = [];
  form = null;
  fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  render() {
    if (!this.case || !this.statusComment) {
      return null;
    }

    switch (this.grantAccess()) {
      case EMPLOYEE:
        // Employee, full access. May not edit case description or title.
        console.log('USER IS EMPLOYEE OR HIGHER');
        return (
          <div className={'modal-body row'}>
            <div className={'col-md-6'}>
              <form
                ref={e => {
                  this.form = e;
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
                <h2>Rediger sak</h2>
                <h3>Sett kategori</h3>
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
                <h3>Sett saksstatus</h3>
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
                    className={'message'}
                    id={'message'}
                    maxLength={255}
                    minLength={2}
                    placeholder="Melding"
                    value={this.statusComment.comment}
                    onChange={this.textareaListener}
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
                <GoogleApiWrapper updatePos={this.updatePos} userPos={{ lat: this.case.lat, lng: this.case.lon }} />
              </div>
            </div>
            <div className={'col-md-6'}>
              <h2>Statusmeldinger</h2>
              <p id={'noComments'} style={{ color: '#666' }} hidden>
                Ingen har kommentert enda.
              </p>
              <ul className={'list-group'}>
                {this.statusMessages.map(e => (
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
      case OWNER_NOT_EMPLOYEE:
        // View case as owner, not pleoyee. Cannot send status comment, but can edit case given that status is open/not processing/not closed.
        console.log('USER IS OWNER OF CASE');
        return (
          <div className={'modal-body row'}>
            <div className={'col-md-6'}>
              <form
                ref={e => {
                  this.form = e;
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
                <h2>Rediger sak</h2>
                <h3>Sett kategori</h3>
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
                <div className={'form-group'}>
                  <label htmlFor="description">Beskrivelse</label>
                  <textarea
                    className={'form-control'}
                    id={'description'}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    placeholder="Gi din sak en beskrivende tittel, så blir det enklere for oss å hjelpe deg."
                    value={this.case.description}
                    onChange={this.textareaListener}
                  />
                  {this.case.description
                    ? this.case.description.length + ' av ' + MAX_DESCRIPTION_LENGTH + ' tegn brukt.'
                    : null}
                </div>
                {this.case.img.length < MAX_NUMBER_IMG ? (
                  <div className={'form-group'}>
                    <label htmlFor={'image-input'}>Legg ved bilder</label>
                    <input
                      className={'form-control-file'}
                      id={'image-input'}
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
              <div className={'col-md-6 embed-responsive'}>
                <GoogleApiWrapper updatePos={this.updatePos} userPos={{ lat: this.case.lat, lng: this.case.lon }} />
              </div>
              <button className={'btn btn-primary mr-2'} onClick={this.submit}>
                Oppdater
              </button>
              {this.isOwner(this.case) && this.case.status_id === STATUS_OPEN ? (
                <button className={'btn btn-danger mr-2'} onClick={this.delete}>
                  Slett
                </button>
              ) : null}
            </div>
            <div className={'col-md-6'}>
              <h2>Statusmeldinger</h2>
              <p id={'noComments'} style={{ color: '#666' }} hidden>
                Ingen har kommentert enda.
              </p>
              <ul className={'list-group'}>
                {this.statusMessages.map(e => (
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
      case NOT_OWNER_NOT_EMPLOYEE:
        // Only view/read access.
        console.log('UNAUTHORIZED USER. MAY ONLy VIEW CASE.');
        return (
          <div className={'modal-body row'}>
            <div className={'col-md-6'}>
              <form
                ref={e => {
                  this.form = e;
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
                <div className="container my-5">
                  <div className="row">
                    {this.case.img.map(e => (
                      <div key={e.src} className="col-md-3">
                        <div className="card">
                          <img src={e.src} alt={e.src} className="card-img-top" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
              <div className={'col-md-6 embed-responsive'}>
                <GoogleApiWrapper updatePos={this.updatePos} userPos={{ lat: this.case.lat, lng: this.case.lon }} />
              </div>
            </div>
            <div className={'col-md-6'}>
              <h2>Statusmeldinger</h2>
              <p id={'noComments'} style={{ color: '#666' }} hidden>
                Ingen har kommentert enda.
              </p>
              <ul className={'list-group'}>
                {this.statusMessages.map(e => (
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
          let userObj = localStorage.getItem('user');
          let statusCommentPoster: number;
          if (userObj) {
            statusCommentPoster = JSON.parse(userObj).user_id;
          } else {
            alert('HEI!');
          }
          this.statusComment = {
            case_id: this.case.case_id,
            status_id: this.case.status_id,
            user_id: statusCommentPoster,
            comment: ''
          };
        } else {
          console.log('Case object was not returned encapsulated in an array. Using this.case = Case[0].');
          Notify.danger('Saken ble hentet i et ukjent format.');
        }
      })
      .then(() => {
        cascom
          .getAllStatusComments(this.props.match.params.case_id)
          .then(e => {
            this.statusMessages = e;
            console.log('Statuskommentarer lengde = ' + this.statusMessages.length);
            if (this.statusMessages.length === 0) {
              let p = document.getElementById('noComments');
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
      let user: Object = JSON.parse(userObj);
      console.log('User ' + user.firstname + ' ' + user.lastname + ' has privilege ' + user.access_level);
      console.log('user.user_id: ' + user.user_id + ', this.case.user_id: ' + this.case.user_id);
      if (user.access_level <= EMPLOYEE_ACCESS_LEVEL && user.region_id === this.case.region_id) {
        // User is a municipality employee or higher. May edit case.
        return EMPLOYEE;
      } else if (this.case.user_id === user.user_id) {
        // User is owner of case, may not send messages, but can edit until process or closed status.
        return OWNER_NOT_EMPLOYEE;
      } else {
        // User is not authorized to edit case.
        return NOT_OWNER_NOT_EMPLOYEE;
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
    return statusStyles[status_id + 1];
  }

  dateFormat(date: string) {
    if (date) {
      let a = date.split('.')[0].replace('T', ' ');
      return a.substr(0, a.length - 3);
    } else {
      return 'Fant ikke dato.';
    }
  }

  isOwner(c: Case) {
    return ToolService.getUserId() === c.user_id;
  }

  updatePos(newPos: Object) {
    this.case.lat = newPos.lat;
    this.case.lon = newPos.lon;
    console.log('got pos from map: ', { lat: this.case.lat, lon: this.case.lon });
  }

  textareaListener(event: SyntheticInputEvent<HTMLInputElement>) {
    if (event.target) {
      if (event.target.id === 'description') {
        this.case.description = event.target.value;
      } else {
        this.statusComment.comment = event.target.value;
      }
    }
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

  delete(event: SyntheticEvent<HTMLButtonElement>) {
    console.log('Clicked delete button');
    let cas = new CaseService();
    cas
      .deleteCase(this.case.case_id)
      .then(() => {
        Notify.success('Din sak med id ' + this.case.case_id + ' ble slettet.');
        this.props.history.push('/');
      })
      .catch((err: Error) => {
        console.log('Could not delete case with id: ' + this.case.case_id, err);
        Notify.danger('Kunne ikke slette sak med id: ' + this.case.case_id + '. \n\nFeilmelding: ' + err.message);
      });
  }

  submit() {
    console.log('Clicked submit! this.case:', this.case);
    console.log('this.statusComment: ', this.statusComment);
  }
}

export default withRouter(ViewCase);
