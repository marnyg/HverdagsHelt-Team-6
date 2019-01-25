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
import Alert from './Alert.js';

const MAX_NUMBER_IMG: number = 3; // Maximum number of images allowed in a single case.
const subscriptionButtonStyles = ['btn btn-info', 'btn btn-outline-info'];
const editButtonStyles = ['btn btn-secondary', 'btn btn-outline-secondary'];

// Privilege levels
const NOT_USER: number = 6;
const NOT_OWNER_NOT_EMPLOYEE: number = 5;
const OWNER_NOT_EMPLOYEE: number = 4;
const OWNER_EMPLOYEE = 3;
const NOT_OWNER_EMPLOYEE: number = 2;
const ADMIN: number = 1;

const EMPLOYEE_ACCESS_LEVEL: number = 2;
const ADMIN_ACCESS_LEVEL: number = 1;

const MAX_DESCRIPTION_LENGTH: number = 255; // Maximum length of description attribute accepted in database.
const STATUS_OPEN: number = 1;
const STATUS_CLOSED: number = 3;
const COMMENTS_PER_QUERY = 5; // Number of status comments returned per fetch request.

/**
 * React Component. Provides user with a set display of a case, and logic and elements needed to alter/update said case.
 * match: params: case_id: case_id which uniquely identifies the case to be displayed.
 */

class ViewCase extends Component<{ match: { params: { case_id: number } } }> {
    case: Case = null; // Case object to be displayed
    statusComment: StatusComment = new StatusComment(); // Status comment object to be sent if required
    subscription: CaseSubscription = null; // Subscription object to represent the users current subscription state to this case
    pos: Location = null; // Location object used for list-selection transitivity.
    pagenumber: number = 1; // Current page to load status comments
    statuses: Status[] = []; // List of available statuses
    categories: Category[] = []; // List of available categories
    statusMessages: StatusComment[] = []; // List of currently loaded status comments
    form: HTMLFormElement = null; // Reply form element used for user input
    fetchButton: HTMLButtonElement = null; // Button element used for status comment fetch requests
    fileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png']; // List of accepted image file types. Could be constant.
    imgSync: boolean = false; // Boolean state. If images are currently being uploaded/downloaded.
    error = null; // Alert component
    loggedIn: boolean = false; // Boolean state. If user is logged in or not.
    edit: boolean = false; // Boolean state. Toggle whether or not to show the edit/reply form

    /**
     * Returns an HTML element containing sub-elements that presents a case and if the user's authorized; the needs to alter or update it.
     * Utilizes object variables to alter the state of the HTML element.
     */
    render() {
        if (!this.case || !this.statusComment) {
            return null;
        }

        let privilege = this.grantAccess();

        return (
            <div className={'modal-body row'}>
                <div className={'col-md-6'}>
                    {this.loggedIn ? (
                        this.isSubscribed(this.case) ? (
                            <button className={this.getSubscriptionButtonStyles(this.case)} onClick={this.onClickSubscribeButton}>
                                Slutt å følg
                            </button>
                        ) : (
                                <button className={this.getSubscriptionButtonStyles(this.case)} onClick={this.onClickSubscribeButton}>
                                    Følg sak
                            </button>
                            )
                    ) : null}
                    {this.error}
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
                                {this.getCreatedBy()}
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
                        <h3>Beskrivelse</h3>
                        {this.case.description ? <p>{this.case.description}</p> : <p>INGEN BESKRIVELSE GITT</p>}
                        {(privilege <= OWNER_EMPLOYEE && this.loggedIn) ||
                            (this.case.status_id === STATUS_OPEN && privilege === OWNER_NOT_EMPLOYEE && this.loggedIn) ? (
                                <section>
                                    {privilege <= NOT_OWNER_EMPLOYEE ? (
                                        <button
                                            className={this.edit === false ? editButtonStyles[0] : editButtonStyles[1]}
                                            type={'button'}
                                            onClick={this.onClickToggleForm}
                                        >
                                            Svar sak
                                    </button>
                                    ) : (
                                            <button
                                                className={this.edit === false ? editButtonStyles[0] : editButtonStyles[1]}
                                                type={'button'}
                                                onClick={this.onClickToggleForm}
                                            >
                                                Rediger sak
                                    </button>
                                        )}
                                    {this.edit === true ? (
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
                                            {(this.case.status_id === STATUS_OPEN && this.isOwner(this.case)) || privilege === ADMIN ? (
                                                <div className={'form-group'}>
                                                    <label htmlFor="title">Tittel</label>
                                                    <input
                                                        className={'form-control'}
                                                        type="text"
                                                        pattern="^.{2,255}$"
                                                        autoComplete="off"
                                                        value={this.case.title}
                                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                                            this.case.title = event.target.value;
                                                        }}
                                                        placeholder={'Gi saken din en beskrivende tittel'}
                                                        required
                                                    />
                                                </div>
                                            ) : null}
                                            {privilege <= OWNER_EMPLOYEE ? (
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
                                            {this.case.status_id === STATUS_OPEN || privilege === ADMIN ? (
                                                <div className={'form-group'}>
                                                    <label htmlFor="description">Beskrivelse</label>
                                                    <textarea
                                                        className={'form-control'}
                                                        id={'description'}
                                                        maxLength={MAX_DESCRIPTION_LENGTH}
                                                        placeholder="Gi din sak en beskrivende beskrivelse, så blir det enklere for oss å hjelpe deg."
                                                        value={this.case.description}
                                                        onChange={this.textareaListener}
                                                    />
                                                    {this.case.description
                                                        ? this.case.description.length + ' av ' + MAX_DESCRIPTION_LENGTH + ' tegn brukt.'
                                                        : null}
                                                </div>
                                            ) : null}
                                            {privilege <= OWNER_EMPLOYEE ? (
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
                                </section>
                            ) : null}
                    </form>
                    <div className="container my-5">
                        <div className="row">
                            {this.case.img.map(e => (
                                <div key={e.src} className="col-md-3">
                                    <div className="card">
                                        <img src={e.src} alt={e.src} className="card-img-top" />
                                        {(privilege <= OWNER_EMPLOYEE && this.case.status_id !== STATUS_CLOSED) ||
                                            (privilege === OWNER_NOT_EMPLOYEE && this.case.status_id === STATUS_OPEN) ||
                                            privilege === ADMIN ? (
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
                    <div style={{ minHeight: "250px" }} className={'col-md google-map'}>
                        <GoogleApiWrapper
                            ref="map"
                            markerPos={{ lat: this.case.lat, lng: this.case.lon }}
                            isClickable={false}
                            userPos={{ lat: this.case.lat, lng: this.case.lon }}
                            centerPos={{ lat: this.case.lat, lng: this.case.lon }}
                        />

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

    /**
     * Runs when component is mounted.
     * Initiates data variables, fetching logic and state logic.
     */
    mounted() {
        $('#spinner').hide();
        this.case = new Case();
        let cas = new CaseService();
        let cascom = new StatusCommentService();
        let stat = new StatusService();
        let cat = new CategoryService();
        let cassub = new CaseSubscriptionService();
        let login = new LoginService();
        login
            .isLoggedIn()
            .then(e => (this.loggedIn = e))
            .catch((err: Error) => {
                console.log('User is not logged in. this.loggedIn remains false.');
            });
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
                    this.props.onCaseOpened(this.case);
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
                    this.error = <Alert type="danger" text="Saken ble hentet i et ukjent format." />;
                    /*Notify.danger('Saken ble hentet i et ukjent format.');*/
                }
            })
            .then(() => this.fetchStatusComments())
            .then(() => {
                if (this.loggedIn) {
                    let sub = new CaseSubscriptionService();
                    sub
                        .getAllCaseSubscriptions(ToolService.getUserId())
                        .then(e => {
                            this.subscription = e.find(e => e.case_id === this.case.case_id);
                            if (this.subscription) {
                                if (!this.subscription.is_up_to_date) {
                                    let sub: CaseSubscription = new CaseSubscription(
                                        ToolService.getUserId(),
                                        this.case.case_id,
                                        null,
                                        true
                                    );
                                    cassub
                                        .updateCaseSubscription(sub)
                                        .then(() => {
                                            console.log('Case with id ' + this.case.case_id + ' has been set up to date.');
                                        })
                                        .catch((err: Error) => {
                                            console.log('Could not set CaseSubscription is_up_to_date.');
                                        });
                                } else {
                                    let userObj: User = ToolService.getUser();
                                    if (userObj) {
                                        console.log(
                                            'Case with id ' +
                                            this.case.case_id +
                                            ' is already up to date for user ' +
                                            userObj.firstname +
                                            ' ' +
                                            userObj.lastname +
                                            ' (id = ' +
                                            userObj.user_id +
                                            ').'
                                        );
                                    }
                                }
                            } else {
                                let userObj: User = ToolService.getUser();
                                if (userObj) {
                                    console.log(
                                        'Case with id ' +
                                        this.case.case_id +
                                        ' is not subscribed to user ' +
                                        userObj.firstname +
                                        ' ' +
                                        userObj.lastname +
                                        ' (id = ' +
                                        userObj.user_id +
                                        ').'
                                    );
                                } else {
                                    console.log('Could not load user object from local storage.');
                                }
                            }
                        })
                        .catch((err: Error) => {
                            console.log('Could not load categories.');
                            Notify.danger(
                                'Klarte ikke å hente abbonnementene dine, vi får derfor ikke til å vise om du allerede er abonnement på denne saken eller ikke. Du kan likevel trykke på abonnerknappen for å enten legge til eller slette abonnement. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                                err.message
                            );
                        });
                }
            })
            .then(() => {
                if (this.grantAccess() <= OWNER_EMPLOYEE) {
                    stat
                        .getAllStatuses()
                        .then(e => {
                            this.statuses = e;
                            let statList = this.form.querySelector('#status');
                            if (statList && statList instanceof HTMLSelectElement) {
                                statList.value = this.case.category_id;
                            }
                        })
                        .catch((err: Error) => {
                            console.log('Could not load statuses.');
                            this.error = (
                                <Alert
                                    type="danger"
                                    text={
                                        'Klarte ikke å hente statuser. ' +
                                        'Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                                        err.message
                                    }
                                />
                            );
                            /*Notify.danger(
                              'Klarte ikke å hente statuser. ' +
                                'Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                                err.message
                            );*/
                        });
                }
                cat
                    .getAllCategories()
                    .then(e => {
                        this.categories = e;
                        let catList = this.form.querySelector('#category');
                        if (catList && catList instanceof HTMLSelectElement) {
                            catList.value = this.case.category_id;
                        }
                    })
                    .catch((err: Error) => {
                        console.log('Could not load categories.');
                        this.error = (
                            <Alert
                                type="danger"
                                text={
                                    'Klarte ikke å hente statuser. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                                    err.message
                                }
                            />
                        );
                        /*Notify.danger(
                          'Klarte ikke å hente statuser. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                            err.message
                        );*/
                    });
            })
            .catch((err: Error) => {
                console.log('Could not load case with id ' + this.props.match.params.case_id);
                this.error = (
                    <Alert
                        type="danger"
                        text={
                            'Klarte ikke å hente sak med id ' +
                            this.props.match.params.case_id +
                            '. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                            err.message
                        }
                    />
                );
                /*Notify.danger(
                  'Klarte ikke å hente sak med id ' +
                    this.props.match.params.case_id +
                    '. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                    err.message
                );*/
            });
    }

    /**
     * Detects the users privilege level, if user is logged in.
     * @returns {number} Number that uniquely identifies the user's privilege level.
     */
    grantAccess() {
        let userObj = localStorage.getItem('user');
        if (this.case && userObj) {
            let user: Object = JSON.parse(userObj);
            if (user.access_level === ADMIN_ACCESS_LEVEL) {
                // User is Administrator, has full access
                return ADMIN;
            } else if (
                user.access_level === EMPLOYEE_ACCESS_LEVEL &&
                user.region_id === this.case.region_id &&
                this.case.user_id === user.user_id
            ) {
                // User is a municipality employee and owns this case.
                return OWNER_EMPLOYEE;
            } else if (user.access_level === EMPLOYEE_ACCESS_LEVEL && user.region_id === this.case.region_id) {
                // User is a municipality employee. May edit case.
                return NOT_OWNER_EMPLOYEE;
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

    /**
     * Detects wheter or not the currently logged in user is the owner of the supplied case.
     * @param c Case object to check for ownership.
     * @returns {boolean} True if user's user_id matches c.user_id
     */
    isOwner(c: Case) {
        return ToolService.getUserId() === c.user_id;
    }

    /**
     *
     * @param c
     * @returns {boolean}
     */
    isSubscribed(c: Case) {
        if (this.subscription) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Detects whether or not user is logged in
     * @returns {boolean} True if user is logged in. False if user is not logged in.
     */
    isLoggedIn() {
        let token = localStorage.getItem('token');
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Fetches CSS style for Subscription Button
     * @param c Case item of which status is to be styled.
     * @returns {*} CSS-style component with predefined style property.
     */
    getSubscriptionButtonStyles(c: Case) {
        if (this.isSubscribed(c)) {
            return subscriptionButtonStyles[1];
        } else {
            return subscriptionButtonStyles[0];
        }
    }

    /**
     * Subscribes the user to this case if user is not currently subscribed, or unsibscribes the user if the user is currently not subscribed.
     * @param event Source event, created by a HTML Button Element, that called this method.
     */
    onClickSubscribeButton(event: SyntheticInputEvent<HTMLButtonElement>) {
        console.log('Clicked subscribe button!');
        let sub = new CaseSubscriptionService();
        if (this.isSubscribed(this.case)) {
            // Unsubscribe the user from this case
            console.log('USER IS SUBSCRIBED');
            sub
                .deleteCaseSubscription(this.case.case_id, ToolService.getUserId())
                .then(() => {
                    this.subscription = null;
                })
                .catch((err: Error) => {
                    console.log('Could not unsubscribe user from case with id ' + this.case.case_id);
                    Notify.warning('Det oppstod en feil ved sletting av abonnement på saken. \n\nFeilmelding: ' + err.message);
                });
        } else {
            // Subscribe this case to user
            let s;
            if (this.subscription) {
                s = new CaseSubscription(ToolService.getUserId(), this.case.case_id, this.subscription.notify_by_email, true);
            } else {
                s = new CaseSubscription(ToolService.getUserId(), this.case.case_id, false, true);
            }
            sub
                .createCaseSubscription(s)
                .then(e => {
                    console.log('Subscribed, returned: ', e);
                    this.subscription = e;
                })
                .catch((err: Error) => {
                    console.log('Could not subscribe user from case with id ' + this.case.case_id);
                    Notify.warning('Det oppstod en feil ved oppretting av abonnement på saken. \n\nFeilmelding: ' + err.message);
                });
        }
    }

    /**
     * Displays or hides the form with user input, if the user has sufficient privilege.
     * @param event Source event, created by a HTML Button Element, that called this method.
     */
    onClickToggleForm(event: SyntheticInputEvent<HTMLButtonElement>) {
        event.preventDefault();
        console.log('Toggling form edit.');
        if (this.edit === true) {
            this.edit = false;
        } else {
            this.edit = true;
        }
    }

    /**
     * Listens for any changes on a bound HTML Textarea Element and alters the case's description with the changes made to the text field inpput.
     * @param event Source event, created by a HTML Textarea Element, that called this method.
     */
    textareaListener(event: SyntheticInputEvent<HTMLInputElement>) {
        if (event.target) {
            if (event.target.id === 'description') {
                this.case.description = event.target.value;
            } else {
                this.statusComment.comment = event.target.value;
            }
        }
    }

    /**
     * Listens for any changes to the category drop-down list and alters the case's category_id and category_name accordingly.
     * @param event Source event, created by a HTML Select Element, that called this method.
     */
    categoryListener(event: SyntheticEvent<HTMLSelectElement>) {
        if (event.target && event.target instanceof HTMLSelectElement && this.case) {
            this.case.category_id = this.categories[event.target.selectedIndex].category_id;
            this.case.category_name = this.categories[event.target.selectedIndex].name;
            console.log('this.case.category_id: ' + this.case.category_id);
        }
    }

    /**
     * Listens for any changes to the status drop-down list and alters the case's status_id and status_name accordingly.
     * @param event Source event, created by a HTML Select Element, that called this method.
     */
    statusListener(event: SyntheticEvent<HTMLSelectElement>) {
        if (event.target && event.target instanceof HTMLSelectElement && this.case) {
            this.case.status_id = this.statuses[event.target.selectedIndex].status_id;
            this.case.status_name = this.statuses[event.target.selectedIndex].name;
            console.log('this.case.status_id: ' + this.case.status_id);
            if (this.statusComment) {
                this.statusComment.status_id = this.case.status_id;
                this.statusComment.status_name = this.case.status_name;
                console.log('this.statusComment.status_id: ' + this.statusComment.status_id);
            }
        }
    }

    /**
     * Listen for changes to the HTML Input Element of type file. Filters associated files and adds files to the case when necessary.
     * @param event Source event, created by a HTML Input Element, that called this method.
     */
    fileInputListener(event: SyntheticInputEvent<HTMLInputElement>) {
        if (!this.imgSync) {
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
                        this.imgSync = true;
                        let cas = new CaseService();
                        cas
                            .uploadPicture(this.case.case_id, files[0])
                            .then(() => (this.imgSync = false))
                            .then(() => {
                                console.log('Image upload successful!');
                                this.case.img.push({
                                    value: files[0],
                                    alt: 'Bildenavn: ' + files[0].name,
                                    src: URL.createObjectURL(files[0])
                                });
                            })
                            .catch((err: Error) => {
                                this.imgSync = false;
                                console.log('Upload image failed. ', err);
                                Notify.danger(
                                    'Kunne ikke laste opp bildet. Hvis problemet vedvarer kontakt oss. \n\nFeilmelding: ' + err.message
                                );
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
                            'Du kan maksimalt feste ' +
                            MAX_NUMBER_IMG +
                            ' til en sak. Noen bilder må slettes før du kan legge til nye.'
                        );
                    }
                } else {
                    // File type not accepted.
                    console.warn('File type not accepted.');
                    Notify.warning('Filtypen er ikke støttet. Vennligst velg et bilde med format .jpg, .jpeg eller .png.');
                }
            }
        } else {
            Notify.warning('Synkronisering av bilder pågår. Vennligst vent 2-3 sekunder og prøv igjen.');
        }
    }

    /**
     * Deletes image associated with the given src parameter from the case object.
     * @param event Source event, created by a HTML Button Element, that called this method.
     * @param src Temporary URL of image to be deleted
     */
    fileInputDeleteImage(event: SyntheticInputEvent<HTMLInputElement>, src: string) {
        if (!this.imgSync) {
            this.imgSync = true;
            let url = this.formatImageURL(src);
            let cas = new CaseService();
            cas
                .deletePicture(this.case.case_id, url)
                .then(() => {
                    this.case.img = this.case.img.filter(e => e.src !== src);
                    console.log('Deleting image file with src = ' + src);
                    console.log('this.case.img: ' + JSON.stringify(this.case.img));
                    this.imgSync = false;
                })
                .catch((err: Error) => {
                    console.log('Delete image failed. ', err);
                    Notify.danger(
                        'Kunne ikke slette bildet. Hvis problemet vedvarer kontakt oss. \n\nFeilmelding: ' + err.message
                    );
                    this.imgSync = false;
                });
        } else {
            Notify.warning('Synkronisering av bilder pågår. Vennligst vent 2-3 sekunder og prøv igjen.');
        }
    }

    /**
     * Removes header prefix from local URL resource
     * @param src URL of image resource
     * @returns {string} File name of the image, ready for upload.
     */
    formatImageURL(src: string) {
        let a = src.split('/')[2];
        return a;
    }

    /**
     * Deletes this case, if status is open.
     * @param event Source event, created by a HTML Button Element, that called this method.
     */
    delete(event: SyntheticEvent<HTMLButtonElement>) {
        event.preventDefault();
        console.log('Clicked delete button');
        if (this.isOwner(this.case)) {
            let cas = new CaseService();
            cas
                .deleteCase(this.case.case_id)
                .then(() => {
                    this.error = <Alert type="success" text={'Din sak med id ' + this.case.case_id + ' ble slettet.'} />;
                    /*Notify.success('Din sak med id ' + this.case.case_id + ' ble slettet.');*/
                    this.props.history.goBack();
                })
                .catch((err: Error) => {
                    console.log('Could not delete case with id: ' + this.case.case_id, err);
                    this.error = (
                        <Alert
                            type="danger"
                            text={'Kunne ikke slette sak med id: ' + this.case.case_id + '. \n\nFeilmelding: ' + err.message}
                        />
                    );
                    /*Notify.danger('Kunne ikke slette sak med id: ' + this.case.case_id + '. \n\nFeilmelding: ' + err.message);*/
                });
        } else {
            console.log("You're not the owner of this case, nor admin! You cannot delete it.");
            //Notify.warning('Du eier ikke denne saken, og kan derfor ikke slette den.');
            this.error = <Alert type="warning" text="Du eier ikke denne saken, og kan derfor ikke slette den." />;
            /*Notify.warning("Du eier ikke denne saken, og kan derfor ikke slette den.");*/
        }
    }

    /**
     * Fetches status comments from the server.
     */
    fetchStatusComments() {
        let cascom = new StatusCommentService();
        cascom
            .getAllStatusComments(this.props.match.params.case_id, this.pagenumber, COMMENTS_PER_QUERY)
            .then(e => {
                this.statusMessages.push.apply(this.statusMessages, e);
                this.pagenumber++;
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
                this.error = (
                    <Alert
                        type="danger"
                        text={
                            'Klarte ikke å hente kommentarer til sak med id ' +
                            this.props.match.params.case_id +
                            '. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                            err.message
                        }
                    />
                );
                /*Notify.danger(
                  'Klarte ikke å hente kommentarer til sak med id ' +
                    this.props.match.params.case_id +
                    '. Hvis problemet vedvarer vennligst kontakt oss. \n\nFeilmelding: ' +
                    err.message
                );*/
            });
    }

    /**
     * Validates all inputfields in the HTML form element.
     * @returns {boolean} Returns true if all fields are ok, or false if not ok.
     */
    validate() {
        let privilege = this.grantAccess();
        if ((this.case.status_id === STATUS_OPEN && privilege === OWNER_NOT_EMPLOYEE) || privilege <= NOT_OWNER_EMPLOYEE) {
            if (this.form.checkValidity()) {
                console.log('Passed basic HTML form validation.');
                return true;
            } else {
                console.log('Failed basic HTML form validation.');
                this.error = <Alert type="warning" text="Vennligst fyll inn de påkrevde feltene." />;
                /*Notify.warning('Vennligst fyll inn de påkrevde feltene.');*/
                return false;
            }
        } else {
            console.log('Case can no longer be updated by owner.');
            return false;
        }
    }

    /**
     * Checks form validity and then sends the case and, if applicable, status comment to server.
     * @param event Source event, created by a HTML Button Element, that called this method.
     */
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
                    this.error = <Alert type="success" text={'Sak med id ' + this.case.case_id + ' ble oppdatert.'} />;
                })
                .then(() => {
                    if (privilege <= NOT_OWNER_EMPLOYEE) {
                        // Upload status comment
                        let statcom = new StatusCommentService();
                        statcom
                            .createStatusComment(this.statusComment)
                            .then(e => {
                                console.log('Received StatusComment Object: ', e);
                                this.statusComment.createdAt = e.createdAt;
                                this.statusMessages.unshift(this.statusComment);
                                let usr = ToolService.getUser()
                                this.statusComment = new StatusComment(null, this.case.case_id, this.case.status_id, usr.user_id, this.case.status_name, "", usr.firstname + " " + usr.lastname, null);
                            })
                            .catch((err: Error) => {
                                console.log('Uploading status comment failed for case ' + this.case.case_id + '. Error: ', err);
                                this.error = (
                                    <Alert
                                        type="danger"
                                        text={
                                            '1Feil ved opplasting av statuskommentar. Saken har blitt oppdatert, men kommentaren din har ikke blitt lagret. \n\nFeilmelding: ' +
                                            err.message
                                        }
                                    />
                                );
                                /*Notify.danger(
                                  'Feil ved opplasting av statuskommentar. Saken har blitt oppdatert, men kommentaren din har ikke blitt lagret. \n\nFeilmelding: ' +
                                    err.message
                                );*/
                            });
                    }
                })
                .then(() => {
                    this.edit = false;
                })
                .catch((err: Error) => {
                    console.log('Updating case ' + this.case.case_id + ' failed. Error: ', err);
                    this.error = (
                        <Alert
                            type="danger"
                            text={
                                'Feil ved opplasting av oppdatert informasjon. Din sak har ikke blitt oppdatert. \n\nFeilmelding: ' +
                                err.message
                            }
                        />
                    );
                    /*Notify.danger(
                      'Feil ved opplasting av oppdatert informasjon. Din sak har ikke blitt oppdatert. \n\nFeilmelding: ' +
                        err.message
                    );*/
                });
        }
    }
    getCreatedBy() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.role_id === ToolService.admin_role_id || user.role_id === ToolService.employee_role_id) {
                return (
                    <tr>
                        <td>Sak sendt av</td>
                        <td>{this.case.createdBy}</td>
                    </tr>
                );
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export default withRouter(ViewCase);
