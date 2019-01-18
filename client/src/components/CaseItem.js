import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck } from '@fortawesome/free-solid-svg-icons/index';
import { withRouter } from 'react-router-dom';
import CaseSubscriptionService from "../services/CaseSubscriptionService";
import CaseSubscription from "../classes/CaseSubscription";
import LoginService from "../services/LoginService";
//import PictureService from '../services/PictureService.js'; REMOVE COMMENTS WHEN SERVICES DONE
//import Picture from '../classes/Picture.js'; REMOVE COMMENTS WHEN CLASSES DONE

class CaseItem extends Component {
  images = [];
  button_type = "primary";

  render() {
    if (this.props.grid) {
      return (
        <div className="item">
          <NavLink to={'/case/' + this.props.case.case_id} className="preview">
            {this.images.length > 0 ? (
              <div className="thumb" style={{ backgroundImage: 'url(' + this.images[0] + ')' }} />
            ) : (
              <div className="thumb" style={{ backgroundImage: 'url(/no-image.png)' }} />
            )}
            <div className="d-inline">
              <div className="card-body">
                <div className="card-text text-muted">{this.props.case.region_name} {this.props.case.county_name}</div>
                <h2 className="card-title">{this.props.case.title}</h2>
                <div className=" d-inline">
                  <small className="text-muted">{this.getTimeString(this.props.case.createdAt)}</small>
                </div>
                {this.props.user ?
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
                    <img className="w-100" src={this.images[0]} />
                  ) : (
                    <img className="w-100" src={'/no-image.png'} />
                  )}
                </div>
                <div className="col-md-8">
                  <div className="card-block">
                    <h6 className="card-title">{this.props.case.title}</h6>
                    <p className="card-text">
                      <small className="text-muted">{this.props.case.region}</small>
                    </p>
                    <p className="card-text text-justify">{this.props.case.description}</p>
                    <p className="card-text">
                      <small className="text-muted">{this.getTimeString(this.props.case.createdAt)}</small>
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

  mounted() {
      if(this.props.case.subscribed){
          this.button_type = "success";
      }
      this.images = this.props.case.img;

      if(this.images.length > 0){
          // Check if image is delivered
          this.checkImage(this.images[0], () => {
              console.log('Image exists');
          }, () => {
              console.log('Image does not exist');
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
}
export default CaseItem;
