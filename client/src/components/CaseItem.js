import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck } from '@fortawesome/free-solid-svg-icons/index';
import CaseSubscriptionService from "../services/CaseSubscriptionService";
import CaseSubscription from "../classes/CaseSubscription";
import LoginService from "../services/LoginService";
import ToolService from "../services/ToolService";


const max_title_length = 24;
class CaseItem extends Component {
  images = [];
  button_type = "primary";

  render() {
    if (this.props.grid) {
      return (
        <div className="item bg-light">
          <NavLink to={'/case/' + this.props.case.case_id} className="preview">
            {this.images.length > 0 ? (
                <div className="thumb" style={{ backgroundImage: 'url(' + this.images[0] + ')' }}>
                    <span role="img" aria-label="Bilde sendt inn av bruker"/>
                </div>
            ) : (
                <div className="thumb" style={{ backgroundImage: 'url(/no-image.png)' }}>
                    <span role="img" aria-label="Bilde sendt inn av bruker"/>
                </div>
            )}
            <div className="d-inline">
              <div className="card-body">
                <h2 className="card-title">{this.props.case.title.length > max_title_length ? this.props.case.title.substring(0, max_title_length-5)+'...': this.props.case.title}</h2>
                <div className="card-text text-muted">{this.props.case.region_name} {this.props.case.county_name}</div>
                <h2 className="card-title">{this.props.case.category_name}</h2>
                <div className=" d-inline">
                  <small className="text-muted">{ToolService.dateFormat(this.props.case.updatedAt)}</small>
                </div>
                {this.props.logged_in ?
                    <button onClick={this.subscribe.bind(this)} className={"btn btn-" + this.button_type + " float-right"}>
                        <FontAwesomeIcon
                            id={'subscribe'}
                            icon={this.props.case.subscribed ? faCheck:faBell }
                            alt="Klikk her for å få varsler om denne saken"
                            className="float-right"
                        />
                    </button>
                    :null
                }
              </div>
            </div>
          </NavLink>
        </div>
      );
    } else {
      return (
        <NavLink exact to={'/case/' + this.props.case.case_id} className="link-unstyled">
          <div className="row my-2">
            <div className="card col-md-12 p-3">
              <div className="row ">
                <div className="col-md-4">
                  {this.images.length > 0 ? (
                    <img className="w-100" src={this.images[0]} alt={'Bilde sendt inn av bruker'}/>
                  ) : (
                    <img className="w-100" src={'/no-image.png'} alt={'Bilde sendt inn av bruker'}/>
                  )}
                </div>
                <div className="col-md-8">
                  <div className="card-block">
                    <h2 className="card-title">{this.props.case.title}</h2>
                    <p className="card-text">
                      <small className="text-muted">{this.props.case.region_name}</small>
                    </p>

                    <p className="card-text text-justify">{this.props.case.description ? this.props.case.description:"Ingen beskrivelse"}</p>
                    <p className="card-text">
                      <small className="text-muted">{ToolService.dateFormat(this.props.case.updatedAt)}</small>
                    </p>
                    <button className={"btn btn-" + this.button_type + " float-right"} onClick={this.subscribe.bind(this)}>
                        {this.props.case.subscribed ? "Du abonnerer på denne saken":"Abonner på denne saken"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      );
    }
  }

  componentWillReceiveProps(newProps) {
      if(newProps.case.subscribed){
          this.button_type = "success";
      }
  }

  mounted() {
      if(this.props.case.subscribed){
          this.button_type = "success";
      }
      this.images = this.props.case.img;

      if(this.images.length > 0){
          // Check if image is delivered
          this.checkImage(this.images[0], () => {
          }, () => {
              this.images = [];
          })
      }
  }

  checkImage(src, resolve, reject){
      let img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
  }

  subscribe(event) {
    event.preventDefault();
    let subscriptionService = new CaseSubscriptionService();
    //user_id, case_id, notify_by_email, is_up_to_date
    let user = JSON.parse(localStorage.getItem('user'));
    if(!this.props.case.subscribed === true) {
        // Clicked subscribe for the first time, create subscription
        console.log('Subscribing');
        let subscription = new CaseSubscription(user.user_id, this.props.case.case_id, true, true);
        console.log('Sending sub:', subscription);
        subscriptionService.createCaseSubscription(subscription)
            .then((sub) => {
                this.button_type = "success";
                this.props.case.subscribed = !this.props.case.subscribed;
            })
            .catch((error: Error) => console.error(error));

    } else {
        // Clicked subscribe for the second time, delete subscription
        console.log('Deleting subscription');
        let loginService = new LoginService();
        loginService.isLoggedIn()
            .then((logged_in: Boolean) => {
              if(logged_in === true){
                  subscriptionService.deleteCaseSubscription(this.props.case.case_id, user.user_id)
                      .then(response => {
                          this.button_type = "primary";
                          this.props.case.subscribed = !this.props.case.subscribed;
                      })
                      .catch((error: Error) => console.error());
              }
            })
            .catch((error: Error) => console.error(error));
    }
  }
}
export default CaseItem;
