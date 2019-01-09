// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert } from './widgets';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <NavLink activeStyle={{ color: 'darkblue' }} exact to="/">
                Hjem
              </NavLink>
            </td>
            <td>
              <NavLink activeStyle={{ color: 'darkblue' }} to="/nysak">
                Ny sak
              </NavLink>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class Home extends Component {
  render() {
    return <div>Hjemmeside Hverdagshelt gruppe 6</div>;
  }
}

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
  categories = [
    { category_id: 1, name: 'Helse og oppvekst' },
    { category_id: 2, name: 'Vei og transport' },
    { category_id: 3, name: 'Kultur og fritid' },
    { category_id: 4, name: 'Skatt og avgifter' },
    { category_id: 5, name: 'Skader og herverk' },
    { category_id: 6, name: 'Administrasjon' },
    { category_id: 7, name: 'Annet' }
  ];
  list1 = null;
  list2 = null;
  lastResortAddress = null;
  pos = { lat: 59.9138688, lon: 10.752245399999993 };

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
    console.log('Mounted!');
    // Fetching counties logic here
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
            Alert.warning('Vennligst velg et fylke og en kommune hvor saken finner sted og prøv igjen.');
          }
          break;
        case 2:
          // Last resort list
          console.log('Using list selection to determine position.');
          console.log(this.list1.selectedIndex);
          if (this.list1.selectedIndex !== 0 && this.list2.selectedIndex !== 0) {
            this.send();
          } else {
            Alert.warning('Vennligst velg et fylke og en kommune hvor saken finner sted og prøv igjen.');
          }
          break;
      }
    } else {
      // Basic Built-in HTML5 form validation failed. Cannot send.
      console.log('Failed basic validation.');
      Alert.warning('Vennligst fyll inn de pålagte feltene i kontaktskjemaet og prøv igjen.');
    }
  }

  send() {
    console.log('Sending form data to server.');
    console.log('Position is ' + JSON.stringify(this.pos));
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/nysak" component={NewCase} />
      </div>
    </HashRouter>,
    root
  );
