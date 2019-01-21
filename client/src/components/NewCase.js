//@flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, withRouter } from 'react-router-dom';
import ToolService from '../services/ToolService';
import CountyService from '../services/CountyService';
import CaseService from '../services/CaseService';
import RegionService from '../services/RegionService';
import CategoryService from '../services/CategoryService';
import Notify from './Notify.js';
import LocationService from '../services/LocationService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/index';
import GoogleApiWrapper from './GoogleApiWrapper';
import Location from '../classes/Location';
import Case from '../classes/Case';
import Region from '../classes/Region';
import County from '../classes/County';
import Category from '../classes/Category';
import User from '../classes/User';

const MAX_DESCRIPTION_LENGTH: number = 255;

class NewCase extends Component {
  case: Case = new Case();
  form: HTMLFormElement = null;
  counties: County[] = [];
  municipalities: Region[] = [];
  categories: Category[] = [];
  images = [];
  list1: HTMLSelectElement = null;
  list2: HTMLSelectElement = null;
  lastResortAddress: HTMLInputElement = null;
  lastResortAddressLabel: HTMLLabelElement = null;
  lastResortPos: Location = new Location(59.9138688, 10.752245399999993, 'Oslo', 'Oslo', 'Norway'); // Last resort position OSLO
  pos: Location = this.lastResortPos; // Used for automatic and map marker position because additional info is needed to validate coordinates.
  markerPos = this.lastResortPos;
  fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  isMapClickable: boolean = false;

  constructor() {
    super();
    Notify.flush();
  }

  render() {
    if (!this.case) {
      return null;
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <form
                ref={e => {
                  this.form = e;
                }}
              >
                <div className={'form-group'}>
                  <label htmlFor="category">Kategori</label>
                  <select
                    defaultValue={'.null'}
                    className={'form-control'}
                    id={'category'}
                    onChange={(event: SyntheticInputEvent<HTMLSelectElement>) =>
                      (this.case.category_id = event.target.value)
                    }
                    required
                  >
                    <option value={'.null'} disabled>
                      Kategori
                    </option>
                    {this.categories.map(e => (
                      <option key={e.category_id} value={e.category_id}>
                        {' '}
                        {e.name}{' '}
                      </option>
                    ))}
                  </select>
                </div>
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
                <div className={'form-group'}>
                  <label htmlFor="description">Beskrivelse</label>
                  <textarea
                    className={'form-control'}
                    id={'description'}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    value={this.case.description}
                    onChange={(event: SyntheticInputEvent<HTMLTextAreaElement>) =>
                      (this.case.description = event.target.value)
                    }
                    placeholder="Skriv en kort beskrivelse her, så blir det enklere for oss å hjelpe deg."
                  />
                  {this.case.description
                    ? this.case.description.length + ' av ' + MAX_DESCRIPTION_LENGTH + ' tegn brukt.'
                    : null}
                </div>
                <div>
                  Posisjon
                  <div className={'form-check'}>
                    <input
                      id={'radio1'}
                      className={'form-check-input'}
                      type="radio"
                      name="pos"
                      value="auto"
                      onClick={this.radioListener}
                      defaultChecked
                    />
                    <label htmlFor={'radio1'} className={'form-check-label'}>
                      Hent automatisk
                    </label>
                  </div>
                  <div className={'form-check'}>
                    <input
                      id={'radio2'}
                      className={'form-check-input'}
                      type="radio"
                      name="pos"
                      value="mapmarker"
                      onClick={this.radioListener}
                    />
                    <label htmlFor={'radio2'} className={'form-check-label'}>
                      Marker på kart
                    </label>
                  </div>
                  <div className={'form-check'}>
                    <input
                      id={'radio3'}
                      className={'form-check-input'}
                      type="radio"
                      name="pos"
                      value="last-resort-selection"
                      onClick={this.radioListener}
                    />
                    <label htmlFor={'radio3'} className={'form-check-label'}>
                      Velg fra liste
                    </label>
                  </div>
                </div>
                <div className={'form-group ml-3 my-3'}>
                  <select
                    ref={e => {
                      this.list1 = e;
                    }}
                    defaultValue={'.null'}
                    className={'form-control mb-3'}
                    id={'last-resort-county'}
                    onChange={this.countyListener}
                    hidden
                  >
                    <option value={'.null'} disabled>
                      Velg fylke
                    </option>
                    {this.counties.map(e => (
                      <option key={e.county_id} value={e.county_id}>
                        {' '}
                        {e.name}{' '}
                      </option>
                    ))}
                  </select>
                  <select
                    ref={e => {
                      this.list2 = e;
                    }}
                    defaultValue={'.null'}
                    className={'form-control mb-3'}
                    id={'last-resort-municipality'}
                    onChange={(event: SyntheticEvent<HTMLSelectElement>) => {
                      this.case.region_id = this.municipalities[event.target.selectedIndex - 1].region_id;
                      this.case.lat = this.municipalities[event.target.selectedIndex - 1].lat;
                      this.case.lon = this.municipalities[event.target.selectedIndex - 1].lon;
                      this.municipalityListener(event);
                    }}
                    hidden
                  >
                    <option value={'.null'} disabled>
                      Velg kommune
                    </option>
                    {this.municipalities.map(e => (
                      <option key={e.region_id} value={e.region_id}>
                        {' '}
                        {e.name}{' '}
                      </option>
                    ))}
                  </select>
                  <label
                    ref={e => {
                      this.lastResortAddressLabel = e;
                    }}
                    id={'last-resort-address-label'}
                    htmlFor={'last-resort-address'}
                    hidden
                  >
                    Adresse
                  </label>
                  <input
                    ref={e => {
                      this.lastResortAddress = e;
                    }}
                    className={'form-control mb-3'}
                    id={'last-resort-address'}
                    type="text"
                    placeholder={'Skriv inn eventuell adresse'}
                    hidden
                  />
                </div>
                {this.case.img.length < 3 ? (
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
              </form>
              <div>
                <button className={'btn btn-primary mr-2'} onClick={this.submit}>
                  Send sak
                </button>
                <NavLink className={'btn btn-secondary'} exact to="/">
                  Avbryt
                </NavLink>
              </div>
            </div>
            <div className="col-md-6 embed-responsive">

              <GoogleApiWrapper
                centerPos={this.case.lat !== undefined && this.case.lon !== undefined ? { lat: this.case.lat, lng: this.case.lon } : { lat: this.lastResortPos.lat, lng: this.lastResortPos.lon }}
                updatePos={this.updatePos}
                markerPos={this.case.lat !== undefined && this.case.lon !== undefined ? { lat: this.case.lat, lng: this.case.lon } : { lat: this.lastResortPos.lat, lng: this.lastResortPos.lon }}
                isClickable={this.isMapClickable}
                chosenMuni={this.list2 ? this.municipalities[this.list2.selectedIndex - 1] : null}
              />
            </div>
          </div>
        </div>
        <div className="container my-5">
          <div className="row">
            {this.case.img.map(e => (
              <div key={e.src} className="col-md-3">
                <div className="card">
                  <img src={e.src} alt={e.alt} className="card-img-top" />
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
      </div>
    );
  }

  mounted() {

    this.case.user_id = ToolService.getUserId();
    let locationService = new LocationService();
    locationService
      .getLocation()
      .then((location: Location) => {
        this.case.lat = location.lat;
        this.case.lon = location.lon;
        this.case.region_name = location.city;
        this.pos = location;
        this.markerPos = location;
        console.log(this.case, this.pos);

      })
      .then(() => {
        let reg = new RegionService();
        reg
          .getAllRegions()
          .then(e => {
            // TODO Denne tar ikke hensyn til Bø i to fylker!
            let region = e.find(e => e.name === this.case.region_name);
            this.case.region_id = region.region_id;
            console.log('This.case.region_id: ' + this.case.region_id + '\nCity/region_name: ' + this.case.region_name);
          })
          .catch((err: Error) => {
            console.log('Could not load regions from server. Error: ' + err.message);
            throw new Error(
              'Klarte ikke å sammenlikne automatisk posisjon med en kommune. \n\nFeilmelding: ' + err.message
            );
          });
      })
      .catch((error: Error) => {
        console.log(error);
        this.case.lat = this.lastResortPos.lat;
        this.case.lon = this.lastResortPos.lon;
        this.pos = this.lastResortPos;
      });

    // Fetching logic
    console.log('Fetchng categories.');
    let cat = new CategoryService();
    let cout = new CountyService();
    cat
      .getAllCategories()
      .then(e => (this.categories = e))
      .then(e => console.log('Received ' + e.length + ' categories from server.'))
      .catch((err: Error) => {
        console.warn('FEIL!' + err.toString());
        Notify.danger(
          'Det oppstod en feil under lasting av kategorier. ' +
          'Vennligst prøv igjen. Hvis problemet vedvarer vennligst kontakt nettsideansvarlig.' +
          '\n\nFeilmelding: ' +
          err.toString()
        );
      });
    console.log('Fetchng counties.');
    cout
      .getAllCounties()
      .then(e => (this.counties = e))
      .then(e => console.log('Received ' + e.length + ' counties from server.'))
      .catch((err: Error) => {
        console.warn('FEIL!' + err.toString());
        Notify.danger(
          'Det oppstod en feil under lasting av fylker. ' +
          'Vennligst prøv igjen. Hvis problemet vedvarer vennligst kontakt nettsideansvarlig.' +
          '\n\nFeilmelding: ' +
          err.toString()
        );
      });
  }

  radioListener(event: SyntheticInputEvent<HTMLInputElement>) {
    let radio = event.target;
    let index = this.radioSelector();
    switch (index) {
      case 0:
        this.radio1();
        break;
      case 1:
        this.radio2();
        break;
      case 2:
        this.radio3();
        break;
    }
  }


  radioSelector(): number {
    if (this.form) {
      let posSelector: NodeList<HTMLElement> = this.form.querySelectorAll('input[name="pos"]');
      let select = [...posSelector].find((e: HTMLElement) => e instanceof HTMLInputElement && e.checked === true);
      let radioValue = null;
      if (select instanceof HTMLInputElement) {
        radioValue = select.value;
        switch (radioValue) {
          case 'auto':
            // Automatic location discovery
            return 0;
          case 'mapmarker':
            // Map marker
            return 1;
          case 'last-resort-selection':
            // Last resort list
            return 2;
        }
      } else {
        return -1;
      }
    }
  }

  radio1() {
    // Automatic location discovery
    if (this.list1 && this.list2 && this.lastResortAddress && this.lastResortAddressLabel) {
      this.list1.hidden = true;
      this.list2.hidden = true;
      this.lastResortAddress.hidden = true;
      this.lastResortAddressLabel.hidden = true;
      this.isMapClickable = false;
    }
    let locator = new LocationService();
    locator
      .getLocation()
      .then(e => {
        if (this.pos) {
          console.log(e);

          this.case.lat = e.lat;
          this.case.lon = e.lon;
          this.pos = e;
          this.markerPos = e;
        }
      })
      // TODO Tar ikke hensyn til to Bø kommuner!!!
      .then(() => {
        let reg = new RegionService();
        reg
          .getAllRegions()
          .then(e => {
            let region = e.find(e => e.name === this.pos.city);
            if (region) {
              // Region detected by Google Location was found in database
              this.case.region_id = region.region_id;
              console.log('This.case.region_id: ' + this.case.region_id + '\nCity/region_name: ' + this.pos.city);
            } else {
              // Region detected by Google Location was not found in database
              // Proceeding to set this.case_region_id = undefined. This'll enable the validate() method to tell the user that automatic positioning failed
              this.case.region_id = undefined;
              Notify.warning(
                'Vi klarte ikke å plassere din posisjon i en kommune registrert hos oss. Vennligst benytt en annen metode for å sette din posisjon, ellers blir posisjonen satt til din angitte hjemkommune.'
              );
            }
          })
          .catch((err: Error) => {
            console.log('Could not load regions from server. Error: ' + err.message);
            throw new Error(
              'Klarte ikke å sammenlikne automatisk posisjon med en kommune. \n\nFeilmelding: ' + err.message
            );
          });
      })
      .catch((err: Error) => {
        Notify.danger('Det oppstod en feil ved henting av automatisk posisjon. \n\nFeilmelding: ' + err.message);
      });
    console.log('THIS.POS', JSON.stringify(this.pos));
  }

  radio2() {
    // Map marker location discovery
    if (this.list1 && this.list2 && this.lastResortAddress && this.lastResortAddressLabel) {
      this.list1.hidden = true;
      this.list2.hidden = true;
      this.lastResortAddress.hidden = true;
      this.lastResortAddressLabel.hidden = true;
      this.isMapClickable = true;
    }
  }

  radio3() {
    // Last resort list location selection
    if (this.list1 && this.list2 && this.lastResortAddress && this.lastResortAddressLabel) {
      this.isMapClickable = false;
      console.log(JSON.stringify(this.pos));
      if (this.list1.selectedIndex === 0) {
        this.list1.hidden = false;
      } else if (this.list2.selectedIndex === 0) {
        this.list1.hidden = false;
        this.list2.hidden = false;
      } else {
        this.list1.hidden = false;
        this.list2.hidden = false;
        this.lastResortAddress.hidden = false;
        this.lastResortAddressLabel.hidden = false;
      }
    } else {
      console.log('list1 eller list2 er null!');
    }
  }

  countyListener(event: SyntheticEvent<HTMLSelectElement>) {
    console.log('Selecting county from drop-down list.');
    if (this.list2 && this.list2) {
      let county = event.target;
      console.log(
        'Slected ' +
        event.target.options[event.target.selectedIndex].text +
        ' with id = ' +
        event.target.value +
        ' as county from drop-down list.'
      );
      this.list2.hidden = false;
      this.fetchMunicipalities(county.value);
      this.resetMunicipalityList();
      console.log(this.list2.options[this.list2.selectedIndex].value);
    }
  }

  municipalityListener(event: SyntheticInputEvent<HTMLSelectElement>) {
    console.log('Selecting municipality from drop-down list.');
    if (this.lastResortAddress && this.lastResortAddressLabel) {
      let muni = event.target;
      let obj = this.municipalities.find(e => e.region_id === parseInt(muni.value));
      if (muni instanceof HTMLSelectElement) {
        console.log(
          muni,
          'Slected ' +
          muni.options[muni.selectedIndex].text +
          ' with id = ' +
          muni.value +
          ' as municipality from drop-down list.'
        );
      }
      this.lastResortAddress.hidden = false;
      this.lastResortAddressLabel.hidden = false;
      if (obj) {
        this.pos = { lat: obj.lat, lon: obj.lon };
      }
    }
  }

  fetchMunicipalities(county_id: number) {
    if (this.list1 && this.list1 instanceof HTMLSelectElement) {
      console.log(
        'Fetching municipalities for county: ' +
        this.list1.options[this.list1.selectedIndex].text +
        ' (county_id = ' +
        county_id +
        ').'
      );
      // Fetching logic here
      let reg = new RegionService();
      reg
        .getAllRegionGivenCounty(county_id)
        .then(e => (this.municipalities = e))
        .then(e => console.log('Received ' + e.length + ' municipalities from server.'))
        .catch((err: Error) => {
          console.warn(err.toString());
          if (this.list1 instanceof HTMLSelectElement) {
            Notify.danger(
              'Det oppstod en feil under lasting av kommuner fra fylke ' +
              this.list1.options[this.list1.selectedIndex].text +
              '. ' +
              'Vennligst prøv igjen. Hvis problemet vedvarer vennligst kontakt nettsideansvarlig.' +
              '\n\nFeilmelding: ' +
              err.toString()
            );
          }
        });
    }
  }

  resetMunicipalityList() {
    if (this.list2 instanceof HTMLSelectElement) {
      this.list2.selectedIndex = 0;
    }
  }

  fileInputListener(event: SyntheticInputEvent<HTMLInputElement>) {
    let files = Array.from(event.target.files);
    console.log('Files in file-input:', files);

    if (files.length === 0) {
      // No files were selected. No changes committed.
      console.log('No files were selected.');
    } else {
      // Files selected. Processing changes.
      console.log('Files were selected.');
      // Redundant file type check.
      if (files.filter(e => this.fileTypes.includes(e.type))) {
        // File type is accepted.
        files.map(e => {
          this.case.img.push({
            value: e,
            alt: 'Bildenavn: ' + e.name,
            src: URL.createObjectURL(e)
          });
        });
      } else {
        // File type not accepted.
        console.warn('File type not accepted.');
        Notify.warning('Filtypen er ikke støttet. Vennligst velg et bilde med format .jpg, .jpeg eller .png.');
      }
    }
  }

  fileInputDeleteImage(event: SyntheticInputEvent<HTMLInputElement>, src) {
    this.case.img = this.case.img.filter(e => e.src !== src);
    console.log('Deleting image file with src = ' + src);
  }

  getRegionId(name: string) {
    let service = new RegionService();
    service
      .getAllRegions()
      .then(e => {
        let region = e.find(j => j.region_name === name);
        if (region) {
          return region.region_id;
        } else {
          Notify.danger('Ingen kommuner passer ditt valg.');
          return null;
        }
      })
      .catch((err: Error) => {
        console.log('Could not get regions.');
        Notify.danger(
          'Kunne ikke hente kommunedata fra server for å sammenlikne med din valgte kommune. \n\nFeilmelding: ' +
          err.message
        );
        return null;
      });
  }

  validate(index: number) {
    if (this.list1 && this.list2 && this.pos) {
      switch (index) {
        case 0:
          // Validate automatic position

          if (this.pos && this.case.region_id) {
            return true;
          } else {
            Notify.warning(
              'Din automatisk detekterte posisjon (lat: ' +
              this.pos.lat +
              ', lon: ' +
              this.pos.lon +
              ') finner sted i ' +
              this.pos.country +
              ' og kan derfor ikke brukes som posisjon. Vennligst benytt en annen metode for å velge posisjon.'
            );
            console.log('Automatic position is not valid. this.pos: ', this.pos);
            return false;
          }
        case 1:
          // Validate map marker position

          if (!this.case.region_id && this.pos.region) {
            let reg = new RegionService();
            let cs = new CountyService();
            cs.getAllCounties()
              .then(e => {
                let county = e.find(f => f.county_name === this.pos.region);
                if (county) {
                  reg
                    .getAllRegionGivenCounty(county.county_id)
                    .then(e => {
                      let region = e.find(f => f.region_name === this.pos.city);
                      if (region) {
                        this.case.region_id = region.region_id;
                        return true;
                      } else {
                        console.log(
                          'Region ' + this.pos.city + ' was not found in county' + this.pos.region + ' in database.'
                        );
                        return false;
                      }
                    })
                    .catch((err: Error) => {
                      Notify.danger(
                        'Det oppstod en feil ved validering av din posisjon fra kart. Vi kunne ikke hente kommunedata. Vennligst prøv igjen. \n\nFeilmelding: ' +
                        err.message
                      );
                      return false;
                    });
                } else {
                  Notify.danger(
                    'Fylket du trykket på finnes ikke i vår database. Dette kan komme som et resultat av kommunesammenslåing eller at geolokaliseringstjenesten vi benytter ikke bruker samme fylkesdata som oss.'
                  );
                  return false;
                }
              })
              .catch((err: Error) => {
                Notify.danger(
                  'Det oppstod en feil ved validering av din posisjon fra kart. Vi kunne ikke hente fylkesdata. Vennligst prøv igjen. \n\nFeilmelding: ' +
                  err.message
                );
                return false;
              });
          } else {
            Notify.warning(
              'Din posisjon (lat: ' +
              this.pos.lat +
              ', lon: ' +
              this.pos.lon +
              ') finner sted i ' +
              this.pos.country +
              ' og kan derfor ikke brukes som posisjon. Vennligst benytt en annen metode for å velge posisjon.'
            );
            console.log('Automatic position is not valid.');
            return false;
          }
        case 2:
          // Validate last resort list selection

          if (
            this.list1.selectedIndex !== 0 &&
            this.list2.selectedIndex !== 0 &&
            this.case.region_id === this.municipalities[this.list2.selectedIndex - 1].region_id
          ) {
            console.log('Last-resort-list validation is valid.');
            return true;
          } else {
            Notify.danger('Vennligst velg et fylke og en kommune hvor saken finner sted og prøv igjen.');
            console.warn('County or municipality has not been set.');
            return false;
          }
      }
    }
  }

  send() {
    if (this.case && this.form) {
      let index: number = this.radioSelector();
      if (this.validate(index)) {
        console.log('Sending form data to server.');
        console.log('Case is ', this.case);
        let cas = new CaseService();
        cas
          .createCase(this.case, this.case.img)
          .then(e => {
            if (e) {
              Notify.success('Din henvendelse er sendt og mottat. Din nyopprettede saks-ID er ' + e.case_id);
              console.log('Form data transmission success! Case ID: ' + e.case_id);
              this.props.history.push('/case/' + e.case_id);
            } else {
              Notify.danger(
                "Det skjedde en feil ved prosessering av din nye sak. Du kan prøve å finne saken din på 'Min side' > 'Mine Saker'."
              );
              console.log('Received case is undefined. Something went very wrong!');
            }
          })
          .catch((err: Error) => {
            Notify.danger(
              'Det oppstod en feil ved sending av saken til oss. Sørg for at alle felter er fyllt ut korrekt. ' +
              'Hvis problemet vedvarer kan du kontakte oss. \n\nFeilmelding: ' +
              err.message
            );
            console.warn('Error while transmitting form data to server with error message: ' + err.message);
          });
      } else {
        console.log('Form is not valid.');
        Notify.warning('');
      }
    } else {
      Notify.warning('En kritisk feil har oppstått. Vennligst last sida på nytt.');
    }
  }

  updatePos(newPos) {
    this.pos.lon = newPos.lon;
    this.pos.lat = newPos.lat;
    this.case.lat = newPos.lat;
    this.case.lon = newPos.lon;
    this.case.region_id = undefined;
    console.log('got pos from map:', this.pos);
    let locator = new LocationService();

    locator.geocodeLatLng(this.pos.lat, this.pos.lon)
      .then(e => {
        console.log(e)
        console.log(e.results[0])
        console.log(e.results[0].address_components)
        console.log(e.results[0].address_components[0])
        console.log(e.results[0].address_components.filter(e => e.types[0] === "administrative_area_level_2"))
        console.log(e.results[0].address_components.filter(e => e.types[0] === "administrative_area_level_1"))
        console.log(e)
        console.log(e)
      })
    // locator
    //   .geocodeLatLng(this.pos.lat, this.pos.lon)
    //   .then(e => {
    //     if (this.pos) {
    //       this.pos = e;
    //     }
    //   })
    //   .then(() => {
    //     let reg = new RegionService();
    //     reg
    //       .getAllRegions()
    //       .then(e => {
    //         let region = e.find(e => e.name === this.pos.city);
    //         if (region) {
    //           // Region detected by Google Location was found in database
    //           this.case.region_id = region.region_id;
    //           console.log('This.case.region_id: ' + this.case.region_id + '\nCity/region_name: ' + this.pos.city);
    //         } else {
    //           // Region detected by Google Location was not found in databse
    //           // Proceeding to set this.pos = users home region's GPS position from localStorage object
    //           this.case.region_id = JSON.stringify(localStorage.getItem('user')).region_id;
    //           console.log('this.case.region_id set to: ' + this.case.region_id);
    //         }
    //       })
    //       .catch((err: Error) => {
    //         console.log('Could not load regions from server. Error: ' + err.message);
    //         throw new Error(
    //           'Klarte ikke å sammenlikne automatisk posisjon med en kommune. \n\nFeilmelding: ' + err.message
    //         );
    //       });
    //   })
    //   .catch((err: Error) => {
    //     Notify.danger(
    //       'Det oppstod en feil ved sammenlikning av valgt posisjon og kommuner i databasen vår. \n\nFeilmelding: ' +
    //       err.message
    //     );
    //   });
  }
}

export default withRouter(NewCase);
