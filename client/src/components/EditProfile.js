// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import UserService from '../services/UserService';
import EditPassword from './EditPassword';
import DisplayProfile from './DisplayProfile';
import CountyService from '../services/CountyService';
import RegionService from '../services/RegionService';

class EditProfile extends Component<{}, { isEditing: boolean }> {
  isEditing = false;
  us = new UserService();
  user = JSON.parse(localStorage.getItem('user'));

  render() {
    {
      console.log(this.user);
    }
    if (this.user == null) {
      return <div>404</div>;
    }
    {
      console.log(this.user);
    }
    return <div>{this.getForm()}</div>;
  }

  handleChange(event: React.ChangeEvent<HTMLInpuStElement>) {
    switch (event.target.id) {
      case 'firstname':
        this.user.firstname = event.target.value;
        break;
      case 'lastname':
        this.user.lastname = event.target.value;
        break;
      case 'email':
        this.user.email = event.target.value;
        break;
      case 'tlf':
        this.user.tlf = event.target.value;
        break;
      case 'password':
        this.user.password = event.target.value;
        break;
    }
    console.log(this.user);
  }

  getForm() {
    return (
      <div className={'card w-100'}>
        <form ref="form" className={'list-group list-group-flush mw-100'}>
          <div className={'container w-100'}>
            <div className={'row list-group-item d-flex'}>
              <div className={'col-sm'}>Fornavn:</div>
              <div className={'col-lg'}>
                <input
                  type="text"
                  id="firstname"
                  required
                  defaultValue={this.user.firstname}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className={'row list-group-item d-flex'}>
              <div className={'col-sm'}>Etternavn:</div>
              <div className={'col-lg'}>
                <input
                  type="text"
                  id="lastname"
                  required
                  defaultValue={this.user.lastname}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className={'row list-group-item'}>
              <div className={'col-lg-auto'}>
                Email:
                <input
                  type="email"
                  pattern="^[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)*@[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)+$"
                  required
                  id="email"
                  defaultValue={this.user.email}
                  onChange={this.handleChange}
                  className="form-control mt-2"
                />
                <small className={"text-muted"}>Epost må vere på formen bruker@adresse.no  </small>
              </div>
            </div>
            <div className={'row list-group-item d-flex'}>
              <div className={'col-sm'}>Tlf:</div>
              <div className={'col-lg'}>
                <input
                  pattern="^[\d]{8}"
                  type="tel"
                  required
                  id="tlf"
                  defaultValue={this.user.tlf}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <small className={"text-muted"}>Tlf må ha 8 siffer  </small>
              </div>
            </div>
            <div className={'row list-group-item d-flex'}>
              <div className={'col-sm'}>Hjemme Kommune:</div>
              <div className={'col-lg'}>
                <RegionSelect
                  className={"region-select"}
                  onRegionSelect={this.setRegionID}
                  elementsMargin={'mb-3'}
                />
              </div>
            </div>
          </div>

          <div className={'d-flex'}>
            <div className={'col-lg btn btn-primary'} onClick={this.validateForm}>
              Lagre
            </div>
            <div
              className={'col-md btn btn-danger'}
              onClick={e => this.props.callback(e, <DisplayProfile callback={this.props.callback} />)}
            >
              Avbryt
            </div>
          </div>
        </form>
      </div>
    );
  }
  setRegionID(regID) {
    this.user.region_id = regID
  }
  validateForm(event: Event) {
    event.preventDefault();
    let form = this.refs.form;
    console.log('user:', this.user);

    if (form.checkValidity()) {
      this.user.tlf = Number(this.user.tlf);
      this.us
        .updateUser(this.user)
        .then(() => {
          localStorage.setItem('user', JSON.stringify(this.user));
          this.props.callback(null, <DisplayProfile callback={this.props.callback} />);
        })
        .catch(Error => console.log(Error));
    } else {
      form.reportValidity();
    }
  }
}

export default EditProfile;

class RegionSelect extends Component {
  regions = [];
  counties = [];
  render() {
    return (
      <div className={this.props.className}>
        <div className={this.props.classNameChild}>
          <select className={'form-control ' + this.props.elementsMargin} id={'county-selector' + this.props.selector_id} onChange={this.countySelected}
            defaultValue={'.null'}>
            <option value={'.null'} disabled>Velg fylke</option>
            {this.counties.map(e => (
              <option key={e.county_id} value={e.county_id}>
                {' '}
                {e.name}{' '}
              </option>
            ))}
          </select>
          <select className={'form-control ' + this.props.elementsMargin} id={'region-selector' + this.props.selector_id} onChange={this.regionSelected}
            defaultValue={'.null'}>
            <option value={'.null'} disabled>Velg kommune</option>
            {this.regions.map(e => (
              <option key={e.region_id} value={e.region_id}>
                {' '}
                {e.name}{' '}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  mounted() {
    let countyService = new CountyService();
    countyService.getAllCounties()
      .then((counties: County[]) => {
        this.counties = counties;
      })
      .catch((error: Error) => console.error(error));
  }

  countySelected(event) {
    event.preventDefault();
    let county_id = event.target.value;
    let regionService = new RegionService();
    regionService.getAllRegionGivenCounty(county_id)
      .then((regions: Region[]) => {
        document.querySelector('#region-selector' + this.props.selector_id).hidden = false;
        this.regions = regions;
      })
      .catch((error: Error) => console.error(error));
  }

  regionSelected(event) {
    event.preventDefault();
    this.region_id = event.target.value;
    this.props.onRegionSelect(Number(this.region_id))
  }

  // submit(event) {
  //   event.preventDefault();
  //   if (this.region_id) {
  //     if (this.props.selector_id === 'mobile') {
  //       document.querySelector('#county-selector' + this.props.selector_id).hidden = false;
  //       document.querySelector('#region-selector' + this.props.selector_id).hidden = true;
  //     }
  //     this.regions = [];
  //     document.querySelector('#county-selector' + this.props.selector_id).selectedIndex = 0;
  //     document.querySelector('#region-selector' + this.props.selector_id).selectedIndex = 0;
  //     this.props.onSubmit(this.region_id);
  //   } else {
  //     Notify.danger('Du må velge både fylke og kommune før du kan sende skjemaet.');
  //   }
  // }
}