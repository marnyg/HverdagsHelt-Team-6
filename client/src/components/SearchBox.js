import * as React from 'react';
import { Component } from 'react-simplified';

export default class SearchBox extends React.Component {

  /**
  * Generates HTML code.
  * return {*} HTML Element with sub-elements.
  */
  render() {
    return <input ref="input" hidden={this.props.hide} type="text" />;
  }

  /**
   * handles change in place selected from searchbox
   */
  onPlacesChanged = () => {
    let pla = this.searchBox.getPlaces();
    this.props.callback(pla);
  };

  /**
  * When component mounts: Initiate fetching logic and sets component variable states.
  */
  componentDidMount() {
    var input = this.refs.input;
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
    console.log(this.props);

    // this.searchBox.setBounds(this.props.map.getBounds());
  }

  /**
  * clenup when component unmounts
  */
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}
