import * as React from 'react';
import { Component } from 'react-simplified';

export default class SearchBox extends React.Component {
    render() {
        return <input ref="input" hidden={this.props.hide} type="text" />;
    }
    onPlacesChanged = () => {
        let pla = this.searchBox.getPlaces()
        this.props.callback(pla)
    }
    componentDidMount() {
        var input = this.refs.input;
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
        console.log(this.props);


        // this.searchBox.setBounds(this.props.map.getBounds());
    }
    componentWillUnmount() {
        // https://developers.google.com/maps/documentation/javascript/events#removing
        google.maps.event.clearInstanceListeners(this.searchBox);
    }
}
