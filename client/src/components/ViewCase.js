//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { withRouter } from 'react-router-dom';
import CategoryService from '../services/CategoryService';
import CaseService from '../services/CaseService';
import StatusService from '../services/StatusService';
import StatusCommentService from '../services/StatusCommentService';
import CaseSubscriptionService from '../services/CaseSubscriptionService';
import LoginService from '../services/LoginService';
import Notify from './Notify';
import ImageModal from './ImageModal';
import GoogleApiWrapper from './GoogleApiWrapper';
import User from '../classes/User';
import Case from '../classes/Case';
import Category from '../classes/Category';
import Status from '../classes/Status';
import StatusComment from '../classes/StatusComment';
import Location from '../classes/Location';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Picture from '../classes/Picture';
import ToolService from '../services/ToolService';
import CaseSubscription from '../classes/CaseSubscription';

const MAX_NUMBER_IMG: number = 3; // Maximum number of images allowed in a single case.

// Privilege levels
const NOT_USER: number = 5;
const NOT_OWNER_NOT_EMPLOYEE: number = 4;
const OWNER_NOT_EMPLOYEE: number = 3;
const EMPLOYEE: number = 2;
const ADMIN: number = 1;

const EMPLOYEE_ACCESS_LEVEL: number = 2;
const ADMIN_ACCESS_LEVEL: number = 1;
const MAX_DESCRIPTION_LENGTH: number = 255;
const STATUS_OPEN: number = 1;
const COMMENTS_PER_QUERY = 5;

class ViewCase extends Component<{ match: { params: { case_id: number } } }> {
  case: Case = null;
  statusComment: StatusComment = new StatusComment();
  pos: Location = null;
  offset: number = 0;
  deletedImages: string[] = [];
  statuses: Status[] = [];
  categories: Category[] = [];
  statusMessages: StatusComment[] = [];
  form: HTMLFormElement = null;
  fetchButton: HTMLButtonElement = null;
  fileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

  render() {
    if (!this.case || !this.statusComment) {
      return null;
    }

    let privilege = this.grantAccess();

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
                  <td style={ToolService.getStatusColour(this.case.status_id)}>{this.case.status_name}</td>
                </tr>
                <tr>
                  <td>Sted</td>
                  <td>
                    {this.case.region_name} ({this.case.county_name})
                  </td>
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
                  <td>{ToolService.dateFormat(this.case.createdAt)}</td>
                </tr>
                <tr>
                  <td>Sist oppdatert</td>
                  <td>{ToolService.dateFormat(this.case.updatedAt)}</td>
                </tr>
              </tbody>
            </table>
            <p>{this.case.description}</p>
            {privilege < OWNER_NOT_EMPLOYEE ||
            !(this.case.status_id !== STATUS_OPEN && privilege === OWNER_NOT_EMPLOYEE) ? (
              <section>
                <h2>Oppdater sak</h2>
                <div className={'form-group'}>
                  <label htmlFor="category">Kategori</label>
                  <select
                    defaultValue={this.case.category_id}
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
                </div>
                {privilege === EMPLOYEE ? (
                  <div className={'form-group'}>
                    <label htmlFor="status">Saksstatus</label>
                    <select
                      defaultValue={this.case.status_id}
                      onChange={this.statusListener}
                      className={'form-control'}
                      id={'status'}
                      required
                    >
                      {this.statuses.map(e => (
                        <option key={e.status_id} value={e.status_id}>
                          {' '}
                          {e.name}{' '}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                {privilege === OWNER_NOT_EMPLOYEE || privilege === ADMIN ? (
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
                ) : null}
                {privilege <= EMPLOYEE ? (
                  <div className={'form-group'}>
                    <label htmlFor="description">Melding</label>
                    <textarea
                      className={'form-control'}
                      id={'message'}
                      maxLength={255}
                      minLength={2}
                      placeholder="Melding om sak"
                      value={this.statusComment.comment}
                      onChange={this.textareaListener}
                      required
                    />
                  </div>
                ) : null}
                {this.case.img.length < MAX_NUMBER_IMG ? (
                  <div className={'form-group'}>
                    <label htmlFor={'image-input'}>Legg ved bilder</label>
                    <input
                      className={'form-control-file'}
                      id={'image-inpu'}
                      type={'file'}
                      accept={'.png, .jpg, .jpeg'}
                      onChange={this.fileInputListener}
                      multiple
                    />
                  </div>
                ) : null}
                <button className={'btn btn-primary mr-2'} onClick={this.submit}>
                  Oppdater
                </button>
                {(this.case.status_id === STATUS_OPEN && this.isOwner(this.case)) || privilege === ADMIN ? (
                  <button className={'btn btn-danger mr-2'} onClick={this.delete}>
                    Slett
                  </button>
                ) : null}
              </section>
            ) : null}

            <div className="container my-5">
              <div className="row">
                {this.case.img.map(e => (
                  <div key={e.src} className="col-md-3">
                    <div className="card">
                      <img src={e.src} alt={e.src} className="card-img-top" />
                      {privilege < OWNER_NOT_EMPLOYEE ||
                      !(this.case.status_id !== STATUS_OPEN && privilege === OWNER_NOT_EMPLOYEE) ? (
                        <div className="card-img-overlay">
                          <button
                            className={'btn btn-danger img-overlay float-right align-text-bottom'}
                            onClick={(event, src) => this.fileInputDeleteImage(event, e.src)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
          <div className={'col-md-6 embed-responsive'}>
            {/*<GoogleApiWrapper updatePos={this.updatePos} userPos={{ lat: this.case.lat, lng: this.case.lon }} /> */}
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
                  <p>{ToolService.dateFormat(e.createdAt)}</p>
                  <p>{e.comment}</p>
                  <p style={ToolService.getStatusColour(e.status_id)}>{e.status_name}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            ref={e => {
              this.fetchButton = e;
            }}
            className={'btn btn-secondary'}
            onClick={this.fetchStatusComments}
          >
            Hent mer
          </button>
        </div>
      </div>
    );
  }

  mounted() {
    this.case = new Case();
    let cas = new CaseService();
    let cascom = new StatusCommentService();
    let stat = new StatusService();
    let cat = new CategoryService();
    let cassub = new CaseSubscriptionService();
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
          let userObj: User = ToolService.getUser();
          let statusCommentPoster: number;
          if (userObj) {
            statusCommentPoster = userObj.user_id;
            this.statusComment = {
              case_id: this.case.case_id,
              status_id: this.case.status_id,
              user_id: statusCommentPoster,
              comment: '',
              status_name: this.case.status_name,
              createdBy: userObj.firstname + ' ' + userObj.lastname,
              createdAt: null
            };
          }
          this.pos = new Location(a.lat, a.lon, a.region_name, a.county_name, 'Norway');
        } else {
          console.log('Case object was not returned encapsulated in an array. Using this.case = Case[0].');
          Notify.danger('Saken ble hentet i et ukjent format.');
        }
      })
      .then(() => {
        this.fetchStatusComments();
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
      .then(() => {
        let login = new LoginService();
        login
          .isLoggedIn()
          .then(e => {
            if (e) {
              // TODO Sjekk om vi kan sende notify by email som null/undefined slik at vi slipper å spørre om tilstanden til ett subscriptionobjekt
              let sub: CaseSubscription = new CaseSubscription(ToolService.getUserId(), this.case.case_id, false, true);
              cassub
                .updateCaseSubscription(sub)
                .then(() => {
                  console.log('Case with id ' + this.case.case_id + ' has been set up to date.');
                })
                .catch((err: Error) => {
                  console.log('Could not set CaseSubscription is_up_to_date.');
                });
            }
          })
          .catch((err: Error) => {
            console.log('User is not logged in. No need to set subscription state.');
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
      if (user.access_level === ADMIN_ACCESS_LEVEL) {
        // User is Administrator, has full access
        return ADMIN;
      } else if (user.access_level === EMPLOYEE_ACCESS_LEVEL && user.region_id === this.case.region_id) {
        // User is a municipality employee or higher. May edit case.
        return EMPLOYEE;
      } else if (this.case.user_id === user.user_id) {
        // User is owner of case, may not send messages, but can edit until process or closed status.
        return OWNER_NOT_EMPLOYEE;
      } else {
        // User is not authorized to edit case.
        return NOT_OWNER_NOT_EMPLOYEE;
      }
    } else {
      // User is not logged. Has the least privileges possible.
      return NOT_USER;
    }
  }

  getInitialCategory() {
    if (this.case) {
      let cat = this.categories.find(e => e.category_id === this.case.category_id);
      if (cat) {
        return cat.category_id;
      } else {
        return -1;
      }
    }
  }

  getInitialStatus() {
    if (this.case) {
      let status = this.statuses.find(e => e.status_id === this.case.status_id);
      if (status) {
        return status.status_id;
      } else {
        return -1;
      }
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

  categoryListener(event: SyntheticEvent<HTMLSelectElement>) {
    if (event.target && event.target instanceof HTMLSelectElement && this.case) {
      this.case.category_id = event.target.options[event.target.selectedIndex].value;
      console.log('this.case.category_id: ' + this.case.category_id);
    }
  }

  statusListener(event: SyntheticEvent<HTMLSelectElement>) {
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

  fetchStatusComments() {
    let cascom = new StatusCommentService();
    cascom
      .getAllStatusComments(this.props.match.params.case_id)
      .then(e => {
        this.statusMessages.push.apply(this.statusMessages, e);
        this.offset += e.length;
        if (this.fetchButton && e.length < COMMENTS_PER_QUERY) {
          this.fetchButton.hidden = true;
        }
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
  }

  validate() {
    let privilege = this.grantAccess();
    if ((this.case.status_id === STATUS_OPEN && privilege === OWNER_NOT_EMPLOYEE) || privilege <= EMPLOYEE) {
      if (this.form.checkValidity()) {
        console.log('Passed basic HTML form validation.');
        return true;
      } else {
        console.log('Failed basic HTML form validation.');
        Notify.warning('Vennligst fyll inn de påkrevde feltene.');
        return false;
      }
    } else {
      console.log('Case can no longer be updated by owner.');
      return false;
    }
  }

  submit(event: SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault();
    let privilege = this.grantAccess();
    console.log('Clicked submit! this.case:', this.case);
    console.log('this.statusComment: ', this.statusComment);
    if (this.validate()) {
      let cas = new CaseService();
      cas
        .updateCase(this.case.case_id, this.case)
        .then(() => {
          console.log('Case ' + this.case.case_id + ' was updated.');
          if (this.case.img.length > 0) {
            // Pictures are present
            console.log('Images are present. Proceeding to update images.');
          }
        })
        .then(() => {
          if (privilege <= EMPLOYEE) {
            // Upload status comment
            let statcom = new StatusCommentService();
            statcom
              .createStatusComment(this.statusComment)
              .then(e => {
                console.log('Received StatusComment Object: ', e);
                this.statusComment.createdAt = e.createdAt;
                this.statusMessages.push(this.statusComment);
                this.statusComment = new StatusComment();
              })
              .catch((err: Error) => {
                console.log('Uploading status comment failed for case ' + this.case.case_id + '. Error: ', err);
                Notify.danger(
                  'Feil ved opplasting av statuskommentar. Saken har blitt oppdatert, men kommentaren din har ikke blitt lagret. \n\nFeilmelding: ' +
                    err.message
                );
              });
          }
        })
        .catch((err: Error) => {
          console.log('Updating case ' + this.case.case_id + ' failed. Error: ', err);
          Notify.danger(
            'Feil ved opplasting av oppdatert informasjon. Din sak har ikke blitt oppdatert. \n\nFeilmelding: ' +
              err.message
          );
        });
    }
  }
}

export default withRouter(ViewCase);
