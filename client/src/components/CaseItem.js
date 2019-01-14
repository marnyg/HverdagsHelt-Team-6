import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck } from '@fortawesome/free-solid-svg-icons/index';
import { withRouter } from 'react-router-dom';
//import PictureService from '../services/PictureService.js'; REMOVE COMMENTS WHEN SERVICES DONE
//import Picture from '../classes/Picture.js'; REMOVE COMMENTS WHEN CLASSES DONE

class CaseItem extends Component {
  images = [];
  subscribed = false;
  button_type = "primary";

  render() {
    if (this.props.grid) {
      return (
        <div className="item">
          <NavLink to={'/case/' + this.props.case.case_id} className="preview">
            {this.images.length > 0 ? (
              <div className="thumb" style={{ backgroundImage: 'url(' + this.images[0].path + ')' }} />
            ) : (
              <div className="thumb" style={{ backgroundImage: 'url(/no-image.png)' }} />
            )}
            <div className="d-inline">
              <div className="card-body">
                <div className="card-text text-muted">{this.props.case.region}</div>
                <h2 className="card-title">{this.props.case.title}</h2>
                <div className=" d-inline">
                  <small className="text-muted">{this.props.case.date}</small>
                </div>
                <button onClick={this.subscribe.bind(this)} className={"btn btn-" + this.button_type + " float-right"}>
                  <FontAwesomeIcon
                    id={'subscribe'}
                    icon={this.subscribed ? faCheck:faBell }
                    alt="Klikk her for å få varsler om denne saken"
                    className="float-right"
                  />
                </button>
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
                    <img className="w-100" src={this.images[0].path} />
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
                      <small className="text-muted">Dato: {this.props.case.date}</small>
                    </p>
                    <button className="btn btn-primary float-right" onClick={this.subscribe.bind(this)}>
                      Abonner på denne saken
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
    this.images = [
      {
        path:
          'https://res.cloudinary.com/simpleview/image/upload/v1504558184/clients/norway/6d185cb5_1903_43a6_bd2b_9771c44d25bc_3c270880-a51d-4199-a673-021a21c8d2a9.jpg'
      }
    ];
    //console.log(this.images.length);
    /* REMOVE COMMENTS WHEN SERVICES DONE
        let pictureService = new PictureService();

        pictureService.get(this.props.case.case_id)
            .then((pictures: Picture[]) => {
                this.pictures = pictures;
            })
            .catch((error: Error) => console.error(error));
        */
  }
  subscribe(event) {
    event.preventDefault();
    this.subscribed = !this.subscribed;
    if(this.button_type === "primary") {
        this.button_type = "success";
    } else {
        this.button_type = "primary";
    }
    console.log('Subscribe');
  }
}
export default CaseItem;
