import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { countyService } from '../services/CountyService';
import { regionService } from '../services/RegionService';
import { categoryService } from '../services/CategoryService';
import { Notify } from './Notify';

class NewCase extends Component {
  form = null;
  counties = [
    { county_id: 11, name: 'Trøndelag' },
    { county_id: 12, name: 'Hordaland' },
    { county_id: 13, name: 'Akershus' }
  ];
  municipalities = [
    { region_id: 1, name: 'Trondheim', lat: 63.1, lon: 10.2 },
    { region_id: 2, name: 'Roan', lat: 63.3, lon: 10.2 },
    { region_id: 3, name: 'Bergen', lat: 63.4, lon: 10.1 },
    { region_id: 4, name: 'Lillestrøm', lat: 63.2, lon: 10.7 },
    { region_id: 5, name: 'Fet', lat: 63.9, lon: 10.1 },
    { region_id: 6, name: 'Singsaker', lat: 63.8, lon: 10.1 }
  ];
  categories = [];
  list1 = null;
  list2 = null;
  lastResortAddress = null;
  pos = { lat: 59.9138688, lon: 10.752245399999993 }; // Last resort position OSLO

  render() {
    return (
      <div>
        <form
          ref={e => {
            this.form = e;
          }}
        >
          <label htmlFor="category">Kategori</label>
          <select id={'category'} required>
            <option selected disabled>
              Kategori
            </option>
            {this.categories.map(e => (
              <option key={e.category_id} value={e.category_id}>
                {' '}
                {e.name}{' '}
              </option>
            ))}
          </select>
          <label htmlFor="title">Tittel</label>
          <input id={'title'} type="text" pattern="^.{2,255}$" autoComplete="off" required />
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            id={'description'}
            maxLength={255}
            placeholder="Skriv en kort beskrivelse her, så blir det enklere for oss å hjelpe deg."
          />
          Posisjon
          <ul>
            <li>
              <label>
                <input type="radio" name="pos" value="auto" onClick={this.radioListener} defaultChecked />
                Hent automatisk
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="pos" value="mapmarker" onClick={this.radioListener} />
                Marker på kart
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="pos" value="last-resort-selection" onClick={this.radioListener} />
                Velg fra liste
              </label>
            </li>
          </ul>
          <select id={'last-resort-county'} onChange={this.countyListener} hidden>
            <option selected disabled>
              Velg fylke
            </option>
            {this.counties.map(e => (
              <option key={e.county_id} value={e.county_id}>
                {' '}
                {e.name}{' '}
              </option>
            ))}
          </select>
          <select id={'last-resort-municipality'} onChange={this.municipalityListener} hidden>
            <option selected disabled>
              Velg kommune
            </option>
            {this.municipalities.map(e => (
              <option key={e.region_id} value={e.region_id}>
                {' '}
                {e.name}{' '}
              </option>
            ))}
          </select>
          <input id={'last-resort-address'} type="text" placeholder={'Skriv inn eventuell adresse'} hidden />
        </form>
        <button onClick={this.submit}>Send sak</button>
        <NavLink exact to={'/'}>
          Avbryt
        </NavLink>
      </div>
    );
  }

  mounted() {
    this.list1 = document.getElementById('last-resort-county');
    this.list2 = document.getElementById('last-resort-municipality');
    this.lastResortAddress = document.getElementById('last-resort-address');

    // Fetching logic
    console.log('Fetchng categories.');
    categoryService
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
    countyService
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
    console.log('Mounted!');
  }

  radioListener(event: SyntheticInputEvent<HTMLInputElement>) {
    let radio = event.target;
    console.log(radio.value);
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

  radioSelector(): Promise<number> {
    let posSelector = this.form.querySelectorAll('input[name="pos"]');
    let select = Array.from(posSelector).find(e => e.checked === true);
    switch (select.value) {
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
  }

  radio1() {
    // Automatic location discovery
    this.list1.hidden = true;
    this.list2.hidden = true;
    this.lastResortAddress.hidden = true;
  }

  radio2() {
    // Map marker location discovery
    this.list1.hidden = true;
    this.list2.hidden = true;
    this.lastResortAddress.hidden = true;
  }

  radio3() {
    // Last resort list location selection
    if (this.list1 && this.list2 && this.lastResortAddress) {
      if (this.list1.selectedIndex === 0) {
        this.list1.hidden = false;
      } else if (this.list2.selectedIndex === 0) {
        this.list1.hidden = false;
        this.list2.hidden = false;
      } else {
        this.list1.hidden = false;
        this.list2.hidden = false;
        this.lastResortAddress.hidden = false;
      }
    } else {
      console.log('list1 eller list2 er null!');
    }
  }

  countyListener(event: SyntheticInputEvent<HTMLInputElement>) {
    console.log('Selecting county from drop-down list.');
    let county = event.target;
    console.log(
      'Slected ' +
        county.options[county.selectedIndex].text +
        ' with id = ' +
        county.value +
        ' as county from drop-down list.'
    );
    this.list2.hidden = false;
    this.fetchMunicipalities(county.value);
    console.log(this.list2.options[this.list2.selectedIndex].value);
  }

  municipalityListener(event: SyntheticInputEvent<HTMLInputElement>) {
    console.log('Selecting municipality from drop-down list.');
    let muni = event.target;
    let obj = this.municipalities.find(e => e.region_id === parseInt(muni.value));
    console.log(
      'Slected ' +
        muni.options[muni.selectedIndex].text +
        ' with id = ' +
        muni.value +
        ' as municipality from drop-down list.'
    );
    this.lastResortAddress.hidden = false;
    this.pos = { lat: obj.lat, lon: obj.lon };
  }

  fetchMunicipalities(county_id: number) {
    console.log(
      'Fetching municipalities for county: ' +
        this.list1.options[this.list1.selectedIndex].text +
        ' (county_id = ' +
        county_id +
        ').'
    );
    // Fetching logic here
    /*regionService.getAll()
        .then(e => this.municipalities = e)
        .then(e => console.log("Received " + e.length + " municipalities from server."))
        .catch((err: Error) => {
            console.warn(err.toString());
            Notify.danger("Det oppstod en feil under lasting av kommuner fra fylke " +
	            this.list1.options[this.list1.selectedIndex].text + ". " +
                "Vennligst prøv igjen. Hvis problemet vedvarer vennligst kontakt nettsideansvarlig." +
                "\n\nFeilmelding: " + err.toString());
        });*/
  }

  submit() {
    console.log('Validating form input.');
    if (this.form.checkValidity() && this.pos) {
      // Basic Built-in HTML5 form validation succeeded. Proceeding to validate using JavaScript.
      let index = this.radioSelector();
      switch (index) {
        case 0:
          // Automatic location discovery
          console.log(
            'Using automatic location discovery using IP-address and GPS if available to determine position.'
          );
          break;
        case 1:
          // Map marker
          console.log('Using a map marker to determine position.');
          if (this.pos != null) {
          } else {
            Notify.warning('Vennligst velg et fylke og en kommune hvor saken finner sted og prøv igjen.');
          }
          break;
        case 2:
          // Last resort list
          console.log('Using list selection to determine position.');
          console.log(this.list1.selectedIndex);
          if (this.list1.selectedIndex !== 0 && this.list2.selectedIndex !== 0) {
            this.send();
          } else {
            Notify.warning('Vennligst velg et fylke og en kommune hvor saken finner sted og prøv igjen.');
          }
          break;
      }
    } else {
      // Basic Built-in HTML5 form validation failed. Cannot send.
      console.log('Failed basic validation.');
      Notify.warning('Vennligst fyll inn de pålagte feltene i kontaktskjemaet og prøv igjen.');
    }
  }

  send() {
    console.log('Sending form data to server.');
    console.log('Position is ' + JSON.stringify(this.pos));
  }
}

export default NewCase;
